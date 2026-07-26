import { supabase } from './supabase.js'
import { queueService } from './queue.js'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export const aiPredictor = {
  /**
   * Predict the waiting time (in minutes) for a token.
   * If tokenId is provided, it predicts for that specific token.
   * If not, it predicts for a hypothetical new token joining the queue.
   */
  async predictWaitingTime(branchId, serviceId, priority = 'normal', tokenId = null) {
    try {
      // Defensive UUID validation before querying Supabase
      const isBranchUuid = branchId && UUID_REGEX.test(branchId)
      const isServiceUuid = serviceId && UUID_REGEX.test(serviceId)

      if (!isBranchUuid || !isServiceUuid) {
        console.warn(`[AI PREDICTOR] Non-UUID IDs provided (branchId: "${branchId}", serviceId: "${serviceId}"). Using safe prediction fallback.`)
        return {
          predictedMinutes: 15,
          factors: {
            avgServiceTime: 15,
            activeCounters: 1,
            peopleAhead: 0,
            congestionMultiplier: 1.0
          }
        }
      }

      // 1. Get average service time from historical completed tokens
      const avgServiceTime = await this.getHistoricalAverageServiceTime(serviceId)

      // 2. Get the number of active counters for this branch
      const activeCountersCount = await this.getActiveCountersCount(branchId)

      // 3. Get the number of people ahead in the queue
      let peopleAhead = 0
      if (tokenId && UUID_REGEX.test(tokenId)) {
        const position = await queueService.getQueuePosition(tokenId)
        peopleAhead = Math.max(0, position - 1)
      } else {
        peopleAhead = await this.getHypotheticalPeopleAhead(branchId, serviceId, priority)
      }

      // 4. Calculate base waiting time: (People Ahead * Avg Service Time) / Active Counters
      let predictedMinutes = (peopleAhead * avgServiceTime) / activeCountersCount

      // 5. Apply Time-of-Day Congestion Multiplier
      const congestionMultiplier = await this.getHistoricalCongestionMultiplier(branchId)
      predictedMinutes *= congestionMultiplier

      // 6. Round to nearest minute, ensure at least 1 minute if there are people ahead
      predictedMinutes = Math.round(predictedMinutes)
      if (peopleAhead > 0 && predictedMinutes === 0) {
        predictedMinutes = 1
      }

      return {
        predictedMinutes,
        factors: {
          avgServiceTime: Math.round(avgServiceTime * 10) / 10,
          activeCounters: activeCountersCount,
          peopleAhead,
          congestionMultiplier: Math.round(congestionMultiplier * 100) / 100,
        }
      }
    } catch (error) {
      console.error('Error in AI predictor:', error)
      return {
        predictedMinutes: 15,
        factors: {
          avgServiceTime: 15,
          activeCounters: 1,
          peopleAhead: 0,
          congestionMultiplier: 1.0,
        }
      }
    }
  },

  /**
   * Calculate average service time (in minutes) based on completed tokens.
   */
  async getHistoricalAverageServiceTime(serviceId) {
    if (!serviceId || !UUID_REGEX.test(serviceId)) return 15

    try {
      const { data: history, error } = await supabase
        .from('queues')
        .select('called_at, completed_at')
        .eq('service_id', serviceId)
        .eq('status', 'completed')
        .not('called_at', 'is', null)
        .not('completed_at', 'is', null)
        .order('completed_at', { ascending: false })
        .limit(50)

      if (error || !history || history.length === 0) {
        const { data: service } = await supabase
          .from('services')
          .select('avg_service_time')
          .eq('id', serviceId)
          .maybeSingle()
        
        return service?.avg_service_time || 15
      }

      let totalMinutes = 0
      history.forEach((ticket) => {
        const durationMs = new Date(ticket.completed_at) - new Date(ticket.called_at)
        totalMinutes += durationMs / 1000 / 60
      })

      return totalMinutes / history.length
    } catch (e) {
      return 15
    }
  },

  /**
   * Count how many counters are currently 'open' at the branch.
   */
  async getActiveCountersCount(branchId) {
    if (!branchId || !UUID_REGEX.test(branchId)) return 1

    try {
      const { data, error } = await supabase
        .from('counters')
        .select('id')
        .eq('branch_id', branchId)
        .eq('status', 'open')

      if (error || !data || data.length === 0) {
        return 1
      }

      return data.length
    } catch (e) {
      return 1
    }
  },

  /**
   * Calculate how many people would be ahead of a new token.
   */
  async getHypotheticalPeopleAhead(branchId, serviceId, priority) {
    if (!branchId || !serviceId || !UUID_REGEX.test(branchId) || !UUID_REGEX.test(serviceId)) return 0

    try {
      const { data, error } = await supabase
        .from('queues')
        .select('priority')
        .eq('branch_id', branchId)
        .eq('service_id', serviceId)
        .eq('status', 'waiting')

      if (error || !data) return 0

      const priorityWeights = {
        emergency: 1,
        vip: 2,
        senior: 3,
        normal: 4,
      }

      const newPriorityWeight = priorityWeights[priority] || 4
      let aheadCount = 0

      data.forEach((ticket) => {
        const ticketWeight = priorityWeights[ticket.priority] || 4
        if (ticketWeight <= newPriorityWeight) {
          aheadCount++
        }
      })

      return aheadCount
    } catch (e) {
      return 0
    }
  },

  /**
   * Calculate time-of-day traffic congestion multiplier.
   */
  async getHistoricalCongestionMultiplier(branchId) {
    if (!branchId || !UUID_REGEX.test(branchId)) return 1.0

    try {
      const currentHour = new Date().getHours()
      
      const { data, error } = await supabase
        .from('queues')
        .select('created_at')
        .eq('branch_id', branchId)
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .limit(200)

      if (error || !data || data.length === 0) {
        if (currentHour >= 11 && currentHour <= 14) return 1.3
        if (currentHour >= 17 && currentHour <= 19) return 1.2
        return 1.0
      }

      const hourCounts = new Array(24).fill(0)
      data.forEach(t => {
        const h = new Date(t.created_at).getHours()
        hourCounts[h]++
      })

      const maxCount = Math.max(...hourCounts)
      const currentHourCount = hourCounts[currentHour]

      if (maxCount === 0) return 1.0
      const ratio = currentHourCount / maxCount
      return 0.8 + (ratio * 0.6)
    } catch (e) {
      return 1.0
    }
  }
}

export default aiPredictor
