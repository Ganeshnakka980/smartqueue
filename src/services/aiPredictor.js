import { supabase } from './supabase'
import { queueService } from './queue'

export const aiPredictor = {
  /**
   * Predict the waiting time (in minutes) for a token.
   * If tokenId is provided, it predicts for that specific token.
   * If not, it predicts for a hypothetical new token joining the queue.
   */
  async predictWaitingTime(branchId, serviceId, priority = 'normal', tokenId = null) {
    try {
      // 1. Get average service time from historical completed tokens (last 30 days, up to 100 records)
      const avgServiceTime = await this.getHistoricalAverageServiceTime(serviceId)

      // 2. Get the number of active counters for this branch
      const activeCountersCount = await this.getActiveCountersCount(branchId)

      // 3. Get the number of people ahead in the queue
      let peopleAhead = 0
      if (tokenId) {
        const position = await queueService.getQueuePosition(tokenId)
        peopleAhead = Math.max(0, position - 1)
      } else {
        peopleAhead = await this.getHypotheticalPeopleAhead(branchId, serviceId, priority)
      }

      // 4. Calculate the base waiting time
      // Formula: (People Ahead * Avg Service Time) / Active Counters
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
      // Return a safe fallback based on a simple calculation
      return {
        predictedMinutes: 15,
        factors: {
          avgServiceTime: 15,
          activeCounters: 1,
          peopleAhead: 1,
          congestionMultiplier: 1.0,
        }
      }
    }
  },

  /**
   * Calculate average service time (in minutes) based on the last 50 completed tokens.
   * Falls back to the service's default avg_service_time if no history is available.
   */
  async getHistoricalAverageServiceTime(serviceId) {
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
      // Fallback: fetch default from service table
      const { data: service } = await supabase
        .from('services')
        .select('avg_service_time')
        .eq('id', serviceId)
        .single()
      
      return service?.avg_service_time || 15
    }

    let totalMinutes = 0
    history.forEach((ticket) => {
      const durationMs = new Date(ticket.completed_at) - new Date(ticket.called_at)
      totalMinutes += durationMs / 1000 / 60
    })

    return totalMinutes / history.length
  },

  /**
   * Count how many counters are currently 'open' at the branch.
   * Returns at least 1 to avoid division by zero.
   */
  async getActiveCountersCount(branchId) {
    const { data, error } = await supabase
      .from('counters')
      .select('id')
      .eq('branch_id', branchId)
      .eq('status', 'open')

    if (error || !data || data.length === 0) {
      return 1 // default fallback
    }

    return data.length
  },

  /**
   * Calculate how many people would be ahead of a new token with the given priority.
   */
  async getHypotheticalPeopleAhead(branchId, serviceId, priority) {
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
  },

  /**
   * Determine a congestion multiplier based on the hour of the day.
   * Uses historical queue volumes to see if the current hour is historically busy.
   */
  async getHistoricalCongestionMultiplier(branchId) {
    const currentHour = new Date().getHours()
    
    // Query last 100 tickets at this branch to find peak hours
    const { data: history, error } = await supabase
      .from('queues')
      .select('created_at')
      .eq('branch_id', branchId)
      .limit(200)

    if (error || !history || history.length === 0) {
      return 1.0 // no history, no multiplier
    }

    // Map tickets to their hour of creation
    const hourlyCounts = Array(24).fill(0)
    history.forEach((ticket) => {
      const hour = new Date(ticket.created_at).getHours()
      hourlyCounts[hour]++
    })

    // Calculate average tickets per hour (for active hours, say 8am to 6pm = 10 hours)
    const activeHoursCount = hourlyCounts.slice(8, 18).reduce((a, b) => a + b, 0)
    const avgTicketsPerHour = activeHoursCount / 10

    if (avgTicketsPerHour === 0) return 1.0

    // Compare current hour traffic to average
    const currentHourTraffic = hourlyCounts[currentHour] || 0
    const ratio = currentHourTraffic / avgTicketsPerHour

    // Normalize ratio into a sensible multiplier (cap at 1.5x, floor at 0.8x)
    if (ratio > 1.2) {
      return Math.min(1.5, 1.0 + (ratio - 1.0) * 0.5) // Peak hour: up to 1.5x wait time
    } else if (ratio < 0.8) {
      return Math.max(0.8, 1.0 - (1.0 - ratio) * 0.3) // Light hour: down to 0.8x wait time
    }

    return 1.0
  }
}

export default aiPredictor
