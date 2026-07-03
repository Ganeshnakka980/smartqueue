import { queueService } from '../services/queue'
import { authService } from '../services/auth'
import { router } from '../router'
import { toast } from '../components/toast'
import { modal } from '../components/modal'
import { sidebar } from '../components/sidebar'
import { skeletons } from '../components/skeletons'
import { supabase } from '../services/supabase'
import gsap from 'gsap'

export const staff = {
  activeCounter: null,
  realtimeChannel: null,

  async render(params) {
    const hash = window.location.hash || '#/staff/dashboard'
    const activePath = hash.split('?')[0].substring(1)
    const profile = router.currentUser?.profile

    this.cleanupRealtime()

    // 1. Fetch if the staff is already assigned to an open counter
    this.activeCounter = await queueService.getStaffCounter(router.currentUser.id)

    // 2. Wrap page in dashboard layout
    const contentHTML = await this.getContentHTML(activePath, params)

    return `
      <div class="flex min-h-screen bg-bg-light dark:bg-slate-950 text-slate-800 dark:text-slate-200">
        <!-- Sidebar -->
        ${sidebar.getHTML(activePath, 'staff', profile)}

        <!-- Main Content Area -->
        <div class="flex-grow md:ml-64 min-h-screen flex flex-col pt-16 md:pt-0">
          <main id="staff-main-content" class="flex-grow p-6 lg:p-10">
            ${contentHTML}
          </main>
        </div>
      </div>
    `
  },

  async getContentHTML(path, params) {
    const staffId = router.currentUser.id

    if (path === '/staff/stats') {
      return this.renderStatsView()
    }

    // Default: Dashboard View
    if (!this.activeCounter) {
      return this.renderCounterAssignmentView()
    } else {
      return this.renderDashboardView()
    }
  },

  // ==========================================================
  // VIEW RENDERERS
  // ==========================================================

  /**
   * 1. Counter Assignment View
   */
  async renderCounterAssignmentView() {
    try {
      const branches = await queueService.getBranches()
      
      const branchOptions = branches.map(b => `
        <option value="${b.id}">${b.name}</option>
      `).join('')

      return `
        <div class="max-w-md mx-auto">
          <div class="mb-8 text-center">
            <h1 class="text-2xl font-black text-slate-900 dark:text-white">Counter Assignment</h1>
            <p class="text-sm text-slate-500 dark:text-slate-400">Please select your branch and counter to start serving customers.</p>
          </div>

          <div class="glass-card p-8 rounded-3xl border border-slate-200/40 dark:border-slate-800/30 shadow-xl bg-white/50 dark:bg-slate-900/20">
            <form id="counter-assignment-form" class="space-y-6">
              <!-- Branch Selector -->
              <div>
                <label for="assign-branch" class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Select Branch</label>
                <select id="assign-branch" required class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 cursor-pointer outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all">
                  <option value="" disabled selected>Choose a branch...</option>
                  ${branchOptions}
                </select>
              </div>

              <!-- Counter Selector -->
              <div>
                <label for="assign-counter" class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Select Counter</label>
                <select id="assign-counter" required disabled class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 cursor-pointer outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all disabled:opacity-60 disabled:cursor-not-allowed">
                  <option value="" disabled selected>Select a branch first...</option>
                </select>
              </div>

              <button type="submit" id="assign-submit" class="w-full py-3.5 px-6 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-base shadow-lg hover:shadow-primary/20 transition-all flex items-center justify-center gap-2 cursor-pointer">
                Open Counter & Start Session
              </button>
            </form>
          </div>
        </div>
      `
    } catch (e) {
      console.error(e)
      return '<p class="text-center text-danger">Failed to load counter assignment.</p>'
    }
  },

  /**
   * 2. Active Staff Dashboard View
   */
  async renderDashboardView() {
    try {
      const counter = this.activeCounter
      
      // Fetch currently serving token on this counter
      let servingToken = null
      if (counter.current_token_id) {
        const { data } = await supabase
          .from('queues')
          .select('*, services(name)')
          .eq('id', counter.current_token_id)
          .single()
        servingToken = data
      }

      // Fetch today's branch statistics
      const stats = await queueService.getDailyStats(counter.branch_id)

      // Dynamic Counter Card based on idle or serving state
      let activeTokenHTML = ''
      if (servingToken) {
        let priorityColor = 'bg-slate-100 text-slate-600'
        if (servingToken.priority === 'emergency') priorityColor = 'bg-danger/10 text-danger border-danger/10'
        else if (servingToken.priority === 'vip') priorityColor = 'bg-primary/10 text-primary border-primary/10'
        else if (servingToken.priority === 'senior') priorityColor = 'bg-warning/10 text-warning border-warning/10'

        const calledTime = new Date(servingToken.called_at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })

        activeTokenHTML = `
          <div class="glass-card p-8 rounded-3xl border border-primary/20 bg-gradient-to-br from-white/80 to-primary/5 dark:from-slate-900/80 dark:to-primary/5 shadow-lg relative overflow-hidden mb-8" id="serving-card">
            <div class="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-8 -mt-8 pointer-events-none"></div>
            
            <div class="flex items-center justify-between mb-4">
              <div>
                <h4 class="text-xs font-bold text-primary uppercase tracking-wider">Currently Serving</h4>
                <p class="text-xl font-black text-slate-800 dark:text-white mt-1">${servingToken.services?.name}</p>
              </div>
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${priorityColor}">
                ${servingToken.priority}
              </span>
            </div>

            <div class="my-6">
              <div class="text-xs text-slate-400 font-bold uppercase">Token Number</div>
              <div class="text-6xl font-black text-slate-900 dark:text-white tracking-wider mt-1">${servingToken.token_number}</div>
              <p class="text-xs text-slate-500 mt-2">Called at ${calledTime}</p>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-wrap gap-3 border-t border-slate-200/35 dark:border-slate-800/30 pt-6">
              <button id="complete-token-btn" class="px-6 py-3 rounded-xl bg-success hover:bg-success/90 text-white text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer">
                Complete Service
              </button>
              <button id="skip-token-btn" class="px-6 py-3 rounded-xl bg-warning hover:bg-warning/90 text-white text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer">
                Skip Customer
              </button>
              <button id="recall-token-btn" class="px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer">
                Recall Voice
              </button>
              <button id="transfer-token-btn" class="px-6 py-3 rounded-xl border border-primary/20 text-primary hover:bg-primary hover:text-white text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer">
                Transfer Service
              </button>
            </div>
          </div>
        `
      } else {
        activeTokenHTML = `
          <div class="glass-card p-8 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 text-center mb-8 bg-white/30 dark:bg-slate-900/10" id="idle-card">
            <div class="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-550 flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.071m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-bold text-slate-800 dark:text-white mb-2">Counter Idle</h3>
            <p class="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6">You are currently not serving anyone. Click below to call the next customer in the queue.</p>
            
            <button id="call-next-btn" class="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold shadow-md hover:shadow-primary/20 transition-all cursor-pointer">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
              </svg>
              Call Next Customer
            </button>
          </div>
        `
      }

      return `
        <div class="max-w-5xl mx-auto">
          <!-- Top Header Info -->
          <div class="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 class="text-2xl font-black text-slate-900 dark:text-white">${counter.name} Dashboard</h1>
              <p class="text-sm text-slate-500 dark:text-slate-400">Operating at: <span class="font-bold text-slate-700 dark:text-slate-200" id="staff-branch-name">Loading branch...</span></p>
            </div>
            <button id="close-counter-btn" class="px-5 py-2.5 rounded-xl border border-danger/20 text-danger hover:bg-danger hover:text-white text-sm font-bold transition-all cursor-pointer">
              Close Counter Session
            </button>
          </div>

          <!-- Main Call Token Card -->
          ${activeTokenHTML}

          <!-- Live Daily Statistics -->
          <div>
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-bold text-slate-800 dark:text-white text-lg">Today's Branch Performance</h3>
              <div class="flex items-center gap-1.5 text-xs text-success font-semibold">
                <span class="w-2 h-2 rounded-full bg-success animate-pulse"></span> Live
              </div>
            </div>
            
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div class="glass-card p-5 rounded-2xl border border-slate-200/40 dark:border-slate-800/30">
                <span class="text-xs text-slate-400 font-bold uppercase">Waiting in Line</span>
                <div class="text-3xl font-black text-slate-900 dark:text-white mt-1" id="stat-waiting">${stats.waiting}</div>
              </div>
              <div class="glass-card p-5 rounded-2xl border border-slate-200/40 dark:border-slate-800/30">
                <span class="text-xs text-slate-400 font-bold uppercase">Total Served</span>
                <div class="text-3xl font-black text-slate-900 dark:text-white mt-1" id="stat-completed">${stats.completed}</div>
              </div>
              <div class="glass-card p-5 rounded-2xl border border-slate-200/40 dark:border-slate-800/30">
                <span class="text-xs text-slate-400 font-bold uppercase">Customers Skipped</span>
                <div class="text-3xl font-black text-slate-900 dark:text-white mt-1" id="stat-skipped">${stats.skipped}</div>
              </div>
              <div class="glass-card p-5 rounded-2xl border border-slate-200/40 dark:border-slate-800/30">
                <span class="text-xs text-slate-400 font-bold uppercase">Avg. Service Time</span>
                <div class="text-3xl font-black text-slate-900 dark:text-white mt-1" id="stat-avg-time">${stats.avgServiceTime} <span class="text-sm font-bold text-slate-500">mins</span></div>
              </div>
            </div>
          </div>
        </div>
      `
    } catch (e) {
      console.error(e)
      return '<p class="text-center text-danger">Failed to load staff dashboard.</p>'
    }
  },

  /**
   * 3. Staff Statistics View
   */
  async renderStatsView() {
    return `
      <div class="max-w-4xl mx-auto">
        <div class="mb-8">
          <h1 class="text-2xl font-black text-slate-900 dark:text-white">Performance Statistics</h1>
          <p class="text-sm text-slate-500 dark:text-slate-400">Review your metrics and service averages.</p>
        </div>
        
        <div class="glass-card p-8 rounded-3xl border border-slate-200/40 dark:border-slate-800/30 text-center">
          <p class="text-slate-500">Weekly and monthly charts will be available in the next release. Check your branch statistics on the main Dashboard.</p>
        </div>
      </div>
    `
  },

  // ==========================================================
  // EVENT BINDINGS & LIFECYCLE
  // ==========================================================

  init() {
    sidebar.init()

    const hash = window.location.hash || '#/staff/dashboard'
    const activePath = hash.split('?')[0].substring(1)

    if (activePath === '/staff/stats') {
      return
    }

    if (!this.activeCounter) {
      this.initCounterAssignment()
    } else {
      this.initActiveDashboard()
    }
  },

  /**
   * Initialize Counter Assignment Logic
   */
  initCounterAssignment() {
    const branchSelect = document.getElementById('assign-branch')
    const counterSelect = document.getElementById('assign-counter')
    const assignmentForm = document.getElementById('counter-assignment-form')
    const submitBtn = document.getElementById('assign-submit')

    if (branchSelect) {
      branchSelect.addEventListener('change', async () => {
        const branchId = branchSelect.value
        if (!branchId) return

        counterSelect.disabled = true
        counterSelect.innerHTML = '<option value="" disabled selected>Loading counters...</option>'

        try {
          // Fetch all counters
          const counters = await queueService.getCounters(branchId)
          if (counters && counters.length > 0) {
            // Filter open/busy vs closed counters. Show all, but mark occupied ones.
            counterSelect.innerHTML = `
              <option value="" disabled selected>Choose a counter...</option>
              ${counters.map(c => {
                const isOccupied = c.status === 'open' && c.staff_id && c.staff_id !== router.currentUser.id
                const label = isOccupied ? `${c.name} (${c.profiles?.full_name || 'Occupied'})` : c.name
                const disabled = isOccupied ? 'disabled class="text-slate-400 bg-slate-50"' : ''
                return `<option value="${c.id}" ${disabled}>${label}</option>`
              }).join('')}
            `
            counterSelect.disabled = false
          } else {
            counterSelect.innerHTML = '<option value="" disabled>No counters configured for this branch.</option>'
          }
        } catch (e) {
          toast.error('Failed to load counters.')
        }
      })
    }

    if (assignmentForm) {
      assignmentForm.addEventListener('submit', async (e) => {
        e.preventDefault()
        const counterId = counterSelect.value
        const staffId = router.currentUser.id

        if (!counterId) return

        submitBtn.disabled = true
        submitBtn.textContent = 'Opening Counter...'

        try {
          await queueService.assignStaffToCounter(counterId, staffId)
          toast.success('Counter opened successfully! Let\'s serve.')
          
          // Re-render dashboard
          this.activeCounter = await queueService.getStaffCounter(staffId)
          router.navigate('/staff/dashboard')
        } catch (error) {
          toast.error('Failed to open counter.')
          submitBtn.disabled = false
          submitBtn.textContent = 'Open Counter & Start Session'
        }
      })
    }
  },

  /**
   * Initialize Active Dashboard Controls
   */
  async initActiveDashboard() {
    const branchNameEl = document.getElementById('staff-branch-name')
    const closeCounterBtn = document.getElementById('close-counter-btn')
    const callNextBtn = document.getElementById('call-next-btn')
    const completeBtn = document.getElementById('complete-token-btn')
    const skipBtn = document.getElementById('skip-token-btn')
    const recallBtn = document.getElementById('recall-token-btn')
    const transferBtn = document.getElementById('transfer-token-btn')

    const counter = this.activeCounter
    const staffId = router.currentUser.id

    // Load branch details
    if (branchNameEl && counter) {
      try {
        const { data: branch } = await supabase
          .from('branches')
          .select('name')
          .eq('id', counter.branch_id)
          .single()
        
        branchNameEl.textContent = branch?.name || 'Unknown Branch'
      } catch (e) {
        console.error(e)
      }
    }

    // Close Counter
    if (closeCounterBtn) {
      closeCounterBtn.addEventListener('click', () => {
        modal.show({
          title: 'Close Counter Session',
          bodyHTML: '<p>Are you sure you want to close this counter? You will be signed out of this counter session, and any active token serving will be completed.</p>',
          confirmText: 'Close Counter',
          danger: true,
          onConfirm: async () => {
            try {
              // Complete current token if any
              if (counter.current_token_id) {
                await queueService.completeCurrentToken(counter.id)
              }
              await queueService.closeCounter(counter.id)
              toast.success('Counter session closed.')
              this.activeCounter = null
              router.navigate('/staff/dashboard')
            } catch (error) {
              toast.error('Failed to close counter.')
              throw error
            }
          }
        })
      })
    }

    // Call Next Token
    if (callNextBtn) {
      callNextBtn.addEventListener('click', async () => {
        callNextBtn.disabled = true
        callNextBtn.innerHTML = `
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg> Calling...
        `
        try {
          const calledToken = await queueService.callNextToken(counter.id, staffId)
          if (calledToken) {
            toast.success(`Called token ${calledToken.token_number}`)
            // Trigger refresh
            this.activeCounter = await queueService.getStaffCounter(staffId)
            router.navigate('/staff/dashboard')
          } else {
            toast.info('No customers waiting in line.')
            callNextBtn.disabled = false
            callNextBtn.innerHTML = `
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
              </svg> Call Next Customer
            `
          }
        } catch (e) {
          toast.error('Error calling next customer.')
          callNextBtn.disabled = false
        }
      })
    }

    // Complete Current Token
    if (completeBtn) {
      completeBtn.addEventListener('click', async () => {
        completeBtn.disabled = true
        try {
          await queueService.completeCurrentToken(counter.id)
          toast.success('Service completed.')
          this.activeCounter = await queueService.getStaffCounter(staffId)
          router.navigate('/staff/dashboard')
        } catch (e) {
          toast.error('Failed to complete token.')
          completeBtn.disabled = false
        }
      })
    }

    // Skip Current Token
    if (skipBtn) {
      skipBtn.addEventListener('click', async () => {
        skipBtn.disabled = true
        try {
          await queueService.skipCurrentToken(counter.id)
          toast.info('Customer marked as skipped.')
          this.activeCounter = await queueService.getStaffCounter(staffId)
          router.navigate('/staff/dashboard')
        } catch (e) {
          toast.error('Failed to skip token.')
          skipBtn.disabled = false
        }
      })
    }

    // Recall Token (Voice announcement simulation)
    if (recallBtn) {
      recallBtn.addEventListener('click', async () => {
        if (!counter.current_token_id) return
        
        recallBtn.disabled = true
        
        try {
          const { data: token } = await supabase
            .from('queues')
            .select('token_number')
            .eq('id', counter.current_token_id)
            .single()

          toast.info(`Recalling token ${token?.token_number}...`)

          // Simulate voice call using SpeechSynthesis if available
          if ('speechSynthesis' in window) {
            const text = `Token number, ${token?.token_number.split('').join(' ')}, please proceed to ${counter.name}`
            const utterance = new SpeechSynthesisUtterance(text)
            utterance.rate = 0.85
            window.speechSynthesis.speak(utterance)
          }

          // Trigger a notification update to customer
          await supabase.from('notifications').insert({
            user_id: (await supabase.from('queues').select('user_id').eq('id', counter.current_token_id).single()).data?.user_id,
            title: 'Counter Recall',
            message: `Please proceed to ${counter.name} immediately.`,
            type: 'queue'
          })

          setTimeout(() => {
            recallBtn.disabled = false
          }, 3000)
        } catch (err) {
          console.error(err)
          recallBtn.disabled = false
        }
      })
    }

    // Transfer Token to another service
    if (transferBtn) {
      transferBtn.addEventListener('click', async () => {
        if (!counter.current_token_id) return
        this.openTransferDialog(counter.current_token_id)
      })
    }

    // Subscribe to branch queue changes to update statistics in real time!
    this.setupRealtimeBranchStats()
  },

  /**
   * Open Transfer Dialog Modal.
   */
  async openTransferDialog(tokenId) {
    try {
      const services = await queueService.getServices(this.activeCounter.branch_id)
      
      const optionsHTML = services
        .filter(s => s.id !== (this.activeCounter.current_token_id)) // exclude current service if we can track it.
        .map(s => `<option value="${s.id}">${s.name} (${s.prefix})</option>`)
        .join('')

      modal.show({
        title: 'Transfer Customer',
        bodyHTML: `
          <div class="flex flex-col gap-4">
            <p class="text-xs text-slate-500 dark:text-slate-400">Select the target service to transfer this customer to. They will be placed in the waiting queue for that service with a new token number.</p>
            <div>
              <label for="transfer-service-select" class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Target Service</label>
              <select id="transfer-service-select" class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-850 dark:text-slate-200 cursor-pointer outline-none focus:border-primary">
                ${optionsHTML}
              </select>
            </div>
          </div>
        `,
        confirmText: 'Transfer Customer',
        onConfirm: async () => {
          const targetServiceId = document.getElementById('transfer-service-select').value
          if (!targetServiceId) return

          try {
            // Complete current counter session first (clear current_token_id on counter)
            await supabase
              .from('counters')
              .update({ current_token_id: null })
              .eq('id', this.activeCounter.id)

            // Perform transfer
            await queueService.transferToken(tokenId, targetServiceId)
            toast.success('Customer transferred successfully.')
            
            // Reload
            this.activeCounter = await queueService.getStaffCounter(router.currentUser.id)
            router.navigate('/staff/dashboard')
          } catch (e) {
            toast.error('Failed to transfer customer.')
            throw e
          }
        }
      })
    } catch (err) {
      toast.error('Failed to load services for transfer.')
    }
  },

  /**
   * Set up real-time subscription for branch queue updates to keep statistics current.
   */
  setupRealtimeBranchStats() {
    const branchId = this.activeCounter?.branch_id
    if (!branchId) return

    this.realtimeChannel = supabase
      .channel(`branch-queues-${branchId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'queues',
          filter: `branch_id=eq.${branchId}`,
        },
        async () => {
          console.log('Branch queues changed. Re-fetching statistics.')
          const stats = await queueService.getDailyStats(branchId)
          
          const waitingEl = document.getElementById('stat-waiting')
          const completedEl = document.getElementById('stat-completed')
          const skippedEl = document.getElementById('stat-skipped')
          const avgEl = document.getElementById('stat-avg-time')

          if (waitingEl) waitingEl.textContent = stats.waiting
          if (completedEl) completedEl.textContent = stats.completed
          if (skippedEl) skippedEl.textContent = stats.skipped
          if (avgEl) avgEl.innerHTML = `${stats.avgServiceTime} <span class="text-sm font-bold text-slate-500">mins</span>`
        }
      )
      .subscribe()
  },

  cleanupRealtime() {
    if (this.realtimeChannel) {
      supabase.removeChannel(this.realtimeChannel)
      this.realtimeChannel = null
    }
  }
}

export default staff
