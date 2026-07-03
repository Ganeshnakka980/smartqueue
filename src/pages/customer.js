import { queueService } from '../services/queue'
import { aiPredictor } from '../services/aiPredictor'
import { authService } from '../services/auth'
import { router } from '../router'
import { toast } from '../components/toast'
import { modal } from '../components/modal'
import { sidebar } from '../components/sidebar'
import { skeletons } from '../components/skeletons'
import { supabase } from '../services/supabase'
import QRCode from 'qrcode'
import gsap from 'gsap'

export const customer = {
  activeSubscription: null,

  /**
   * Render the view based on the current hash.
   */
  async render(params) {
    try {
      const hash = window.location.hash || '#/customer/dashboard'
      const activePath = hash.split('?')[0].substring(1)
      const profile = router.currentUser?.profile
      
      // Clean up any active subscriptions from previous views
      this.cleanupSubscription()

      // Wrap the page in a dashboard layout with the sidebar
      const contentHTML = await this.getContentHTML(activePath, params)
      
      return `
        <div class="flex min-h-screen bg-bg-light dark:bg-slate-950 text-slate-800 dark:text-slate-200">
          <!-- Sidebar -->
          ${sidebar.getHTML(activePath, 'customer', profile)}
          
          <!-- Main Content Area -->
          <div class="flex-grow md:ml-64 min-h-screen flex flex-col pt-16 md:pt-0">
            <main id="customer-main-content" class="flex-grow p-6 lg:p-10">
              ${contentHTML}
            </main>
          </div>
        </div>
      `
    } catch (err) {
      console.error('Error rendering customer page:', err)
      return `
        <div class="flex min-h-screen items-center justify-center p-6 bg-bg-light dark:bg-slate-950">
          <div class="glass-card p-8 rounded-3xl border border-danger/20 text-center max-w-md w-full shadow-2xl">
            <div class="w-16 h-16 rounded-full bg-danger/10 text-danger flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-2">Error Loading Dashboard</h3>
            <p class="text-sm text-slate-500 dark:text-slate-450 mb-6">Something went wrong while loading this page. Please check your connection or try again.</p>
            <button onclick="window.location.reload()" class="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-sm shadow-sm hover:shadow-primary/25 transition-all cursor-pointer">
              Reload Page
            </button>
          </div>
        </div>
      `
    }
  },

  /**
   * Determine and fetch data for the specific customer sub-view.
   */
  async getContentHTML(path, params) {
    const userId = router.currentUser?.id

    if (path === '/customer/join-queue') {
      return this.renderJoinQueueView()
    } else if (path === '/customer/live-tracking') {
      return this.renderLiveTrackingView(params.id)
    } else if (path === '/customer/history') {
      return this.renderHistoryView(userId)
    } else if (path === '/customer/profile') {
      return this.renderProfileView()
    } else {
      return this.renderDashboardView(userId)
    }
  },

  // ==========================================================
  // VIEW RENDERERS
  // ==========================================================

  /**
   * 1. Dashboard View
   */
  async renderDashboardView(userId) {
    try {
      // Fetch active token
      const activeToken = await queueService.getActiveToken(userId)
      let activeTokenHTML = ''
      
      if (activeToken) {
        // Calculate position and AI waiting time
        const position = await queueService.getQueuePosition(activeToken.id)
        const prediction = await aiPredictor.predictWaitingTime(
          activeToken.branch_id,
          activeToken.service_id,
          activeToken.priority,
          activeToken.id
        )

        const isServing = activeToken.status === 'serving'
        const statusBadge = isServing
          ? '<span class="px-2.5 py-1 rounded-full bg-success/10 text-success text-xs font-bold border border-success/20 animate-pulse">Now Serving</span>'
          : '<span class="px-2.5 py-1 rounded-full bg-warning/10 text-warning text-xs font-bold border border-warning/20">Waiting in Line</span>'

        activeTokenHTML = `
          <div class="glass-card p-6 rounded-3xl border border-primary/20 bg-gradient-to-br from-white/80 to-primary/5 dark:from-slate-900/80 dark:to-primary/5 shadow-lg relative overflow-hidden mb-8">
            <div class="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-8 -mt-8 pointer-events-none"></div>
            <div class="flex items-center justify-between mb-4">
              <div>
                <h4 class="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Active Token</h4>
                <p class="text-lg font-bold text-slate-800 dark:text-white">${activeToken.services?.name}</p>
              </div>
              ${statusBadge}
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-3 gap-6 my-6">
              <div>
                <span class="text-xs text-slate-400 font-bold uppercase">Token Number</span>
                <div class="text-3xl font-black text-slate-900 dark:text-white mt-1">${activeToken.token_number}</div>
              </div>
              <div>
                <span class="text-xs text-slate-400 font-bold uppercase">Queue Position</span>
                <div class="text-3xl font-black text-slate-900 dark:text-white mt-1">
                  ${isServing ? 'Serving' : `#${position}`}
                </div>
              </div>
              <div class="col-span-2 sm:col-span-1">
                <span class="text-xs text-slate-400 font-bold uppercase">Estimated Wait</span>
                <div class="text-3xl font-black text-slate-900 dark:text-white mt-1">
                  ${isServing ? '0 <span class="text-sm font-bold">mins</span>' : `~${prediction.predictedMinutes} <span class="text-sm font-bold">mins</span>`}
                </div>
              </div>
            </div>

            <div class="flex flex-col sm:flex-row gap-3 border-t border-slate-200/35 dark:border-slate-800/30 pt-4 mt-2">
              <a href="#/customer/live-tracking?id=${activeToken.id}" class="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-sm font-bold text-center shadow-sm hover:shadow-primary/10 transition-all flex items-center justify-center gap-2 cursor-pointer">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
                Track Live Queue
              </a>
              <button id="cancel-queue-dashboard" data-id="${activeToken.id}" class="px-5 py-2.5 rounded-xl border border-danger/20 text-danger hover:bg-danger hover:text-white text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer">
                Cancel Token
              </button>
            </div>
          </div>
        `
      } else {
        activeTokenHTML = `
          <div class="glass-card p-8 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 text-center mb-8 bg-white/30 dark:bg-slate-900/10">
            <div class="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-bold text-slate-800 dark:text-white mb-2">You are not in any queue</h3>
            <p class="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6">Need to visit a branch? Join a digital queue now to skip the waiting room completely.</p>
            <a href="#/customer/join-queue" class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold shadow-md hover:shadow-primary/25 transition-all cursor-pointer">
              Join a Queue
            </a>
          </div>
        `
      }

      // Fetch recent notifications
      const notifications = await queueService.getNotifications(userId)
      let notificationsHTML = ''
      if (notifications && notifications.length > 0) {
        notificationsHTML = notifications.slice(0, 3).map(n => `
          <div class="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/40 ${n.read ? '' : 'border-l-4 border-l-primary'}">
            <div class="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
              </svg>
            </div>
            <div class="flex-grow min-w-0">
              <h5 class="text-xs font-bold text-slate-800 dark:text-white truncate">${n.title}</h5>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">${n.message}</p>
            </div>
          </div>
        `).join('')
      } else {
        notificationsHTML = '<p class="text-xs text-slate-400 text-center py-6">No recent notifications.</p>'
      }

      // Fetch recent history
      const history = await queueService.getTokenHistory(userId)
      let historyHTML = ''
      if (history && history.length > 0) {
        historyHTML = history.slice(0, 3).map(h => {
          let statusColor = 'text-slate-500 bg-slate-100 dark:bg-slate-850 dark:text-slate-400'
          if (h.status === 'completed') statusColor = 'text-success bg-success/10'
          else if (h.status === 'skipped') statusColor = 'text-warning bg-warning/10'
          else if (h.status === 'cancelled') statusColor = 'text-danger bg-danger/10'

          return `
            <div class="flex items-center justify-between p-3.5 rounded-xl border border-slate-150/40 dark:border-slate-800/20">
              <div>
                <span class="text-xs font-bold text-slate-400 uppercase">${h.token_number}</span>
                <h5 class="text-xs font-bold text-slate-800 dark:text-white mt-0.5">${h.services?.name}</h5>
              </div>
              <span class="px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${statusColor}">
                ${h.status}
              </span>
            </div>
          `
        }).join('')
      } else {
        historyHTML = '<p class="text-xs text-slate-400 text-center py-6">No queue history yet.</p>'
      }

      return `
        <div class="max-w-5xl mx-auto">
          <div class="mb-8">
            <h1 class="text-2xl font-black text-slate-900 dark:text-white">Customer Dashboard</h1>
            <p class="text-sm text-slate-500 dark:text-slate-400">Welcome, ${router.currentUser?.profile?.full_name || 'Guest'}. Manage your digital queue tickets.</p>
          </div>

          ${activeTokenHTML}

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Notifications Panel -->
            <div class="glass-card p-6 rounded-3xl border border-slate-200/40 dark:border-slate-800/30">
              <div class="flex items-center justify-between mb-4 pb-2 border-b border-slate-200/30 dark:border-slate-800/30">
                <h3 class="font-bold text-slate-800 dark:text-white">Recent Notifications</h3>
                <span class="w-2 h-2 rounded-full bg-primary"></span>
              </div>
              <div class="flex flex-col gap-3">
                ${notificationsHTML}
              </div>
            </div>

            <!-- Recent History Panel -->
            <div class="glass-card p-6 rounded-3xl border border-slate-200/40 dark:border-slate-800/30">
              <div class="flex items-center justify-between mb-4 pb-2 border-b border-slate-200/30 dark:border-slate-800/30">
                <h3 class="font-bold text-slate-800 dark:text-white">Recent Visits</h3>
                <a href="#/customer/history" class="text-xs font-bold text-primary hover:underline">View All</a>
              </div>
              <div class="flex flex-col gap-3">
                ${historyHTML}
              </div>
            </div>
          </div>
        </div>
      `
    } catch (error) {
      console.error('Dashboard load error:', error)
      const isTableMissing = error.code === '42P01' || (error.message && error.message.includes('relation') && error.message.includes('does not exist'))
      const errorMsg = isTableMissing
        ? 'Database tables not found. Please ensure you have run the database migrations (schema.sql) in your Supabase SQL Editor.'
        : 'Failed to load dashboard. Please check your network connection.'
      return `
        <div class="glass-card p-8 rounded-3xl border border-danger/20 text-center bg-white/50 dark:bg-slate-900/10 shadow-md">
          <div class="w-12 h-12 rounded-full bg-danger/10 text-danger flex items-center justify-center mx-auto mb-4">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          </div>
          <h4 class="text-base font-bold text-slate-900 dark:text-white mb-2">Dashboard Error</h4>
          <p class="text-sm text-slate-500 dark:text-slate-450 max-w-md mx-auto mb-4">${errorMsg}</p>
        </div>
      `
    }
  },

  /**
   * 2. Join Queue View (Google Maps Split View Wizard)
   */
  async renderJoinQueueView() {
    try {
      return `
        <div class="max-w-7xl mx-auto px-2">
          <!-- Step Progress Indicator -->
          <div class="mb-8 max-w-2xl mx-auto">
            <div class="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              <span class="step-indicator-label text-primary font-bold" data-step="1">1. Category</span>
              <span class="step-indicator-label" data-step="2">2. Live Map & Discovery</span>
              <span class="step-indicator-label" data-step="3">3. Service Selection</span>
              <span class="step-indicator-label" data-step="4">4. Confirm</span>
            </div>
            <div class="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div id="wizard-progress-bar" class="h-full bg-primary transition-all duration-300 w-1/4"></div>
            </div>
          </div>

          <!-- Wizard Steps Container -->
          <div class="relative min-h-[550px]">
            
            <!-- STEP 1: CATEGORIES -->
            <div id="step-1-container" class="wizard-step w-full">
              <div class="mb-8 text-center">
                <h2 class="text-3xl font-black text-white tracking-tight">Select Business Industry</h2>
                <p class="text-sm text-slate-450 mt-2">Discover nearby queue points by selecting an industry sector.</p>
              </div>
              <div id="category-grid" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <!-- Populated via JS -->
              </div>
            </div>

            <!-- STEP 2: LEAFLET MAP & DISCOVERY SPLIT SCREEN -->
            <div id="step-2-container" class="wizard-step w-full hidden opacity-0 translate-x-12">
              <div class="mb-4 flex items-center justify-between">
                <div>
                  <h2 class="text-xl font-black text-white flex items-center gap-2">
                    <button id="btn-back-to-step1" class="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                      </svg>
                    </button>
                    Real-Time Nearby Discovery
                  </h2>
                  <p class="text-xs text-slate-450 ml-7" id="branch-step-subtitle">GPS Geolocation Enabled • GPS coordinates updating dynamically</p>
                </div>
              </div>

              <!-- Search & Filters Panel (Premium Slate/Dark) -->
              <div class="glass-card p-4 rounded-2xl border border-slate-800/80 mb-6 bg-slate-900/40">
                <div class="flex flex-col md:flex-row gap-3">
                  <!-- Search box -->
                  <div class="flex-grow relative">
                    <input type="text" id="branch-search-input" placeholder="Search by name, category, area or city..." class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-sm text-white placeholder-slate-500 focus:border-primary outline-none transition-all">
                    <span class="absolute left-3 top-3.5 text-slate-500">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                      </svg>
                    </span>
                  </div>
                  <!-- Location Indicator -->
                  <div class="flex gap-2">
                    <button id="btn-use-location" class="px-4 py-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary hover:bg-primary hover:text-white transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer">
                      <span class="w-2.5 h-2.5 rounded-full bg-primary border-2 border-white animate-pulse" id="gps-pulse-dot"></span>
                      GPS Tracking Active
                    </button>
                  </div>
                </div>
                
                <!-- Quick Filter Tabs -->
                <div class="flex flex-wrap gap-2 mt-3 pt-3 border-t border-slate-800/30">
                  <button class="branch-filter-btn px-3 py-1.5 rounded-lg border text-xs font-semibold bg-primary text-white border-primary cursor-pointer" data-filter="all">All</button>
                  <button class="branch-filter-btn px-3 py-1.5 rounded-lg border text-xs font-semibold border-slate-800 hover:bg-slate-800 text-slate-350 cursor-pointer" data-filter="1km">Within 1 km</button>
                  <button class="branch-filter-btn px-3 py-1.5 rounded-lg border text-xs font-semibold border-slate-800 hover:bg-slate-800 text-slate-350 cursor-pointer" data-filter="5km">Within 5 km</button>
                  <button class="branch-filter-btn px-3 py-1.5 rounded-lg border text-xs font-semibold border-slate-800 hover:bg-slate-800 text-slate-350 cursor-pointer" data-filter="open">Open Now</button>
                  <button class="branch-filter-btn px-3 py-1.5 rounded-lg border text-xs font-semibold border-slate-800 hover:bg-slate-800 text-slate-350 cursor-pointer" data-filter="wait">Lowest Wait Time</button>
                  <button class="branch-filter-btn px-3 py-1.5 rounded-lg border text-xs font-semibold border-slate-800 hover:bg-slate-800 text-slate-350 cursor-pointer" data-filter="favorites">Favorites</button>
                </div>
              </div>

              <!-- List + Map split view (Left Map, Right Sidebar) -->
              <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <!-- Leaflet Map Container (7 cols) -->
                <div class="lg:col-span-7 rounded-3xl overflow-hidden border border-slate-800/60 shadow-2xl relative z-10">
                  <div id="leaflet-map" class="w-full h-[480px] bg-slate-900"></div>
                </div>

                <!-- Nearby Services Sidebar List (5 cols) -->
                <div class="lg:col-span-5 flex flex-col gap-3">
                  <h3 class="text-xs font-bold uppercase tracking-wider text-slate-450 mb-1">Nearby Services</h3>
                  <div id="branch-list-column" class="flex flex-col gap-3 max-h-[440px] overflow-y-auto pr-1">
                    <!-- Populated via JS -->
                  </div>
                </div>
              </div>
            </div>

            <!-- STEP 3: SERVICES -->
            <div id="step-3-container" class="wizard-step w-full hidden opacity-0 translate-x-12">
              <div class="mb-6">
                <h2 class="text-xl font-black text-white flex items-center gap-2">
                  <button id="btn-back-to-step2" class="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                    </svg>
                  </button>
                  Select Service
                </h2>
                <p class="text-xs text-slate-450 ml-7" id="service-step-subtitle">Loading branch details...</p>
              </div>

              <div id="services-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <!-- Populated via JS -->
              </div>
            </div>

            <!-- STEP 4: PRIORITY & CONFIRMATION -->
            <div id="step-4-container" class="wizard-step w-full hidden opacity-0 translate-x-12">
              <div class="mb-6">
                <h2 class="text-xl font-black text-white flex items-center gap-2">
                  <button id="btn-back-to-step3" class="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                    </svg>
                  </button>
                  Confirm Token Details
                </h2>
                <p class="text-xs text-slate-450 ml-7">Select support priority and preview estimated waiting time.</p>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                
                <!-- Priority selection & actions -->
                <div class="md:col-span-2 space-y-6">
                  <!-- Priority Selector -->
                  <div class="glass-card p-6 rounded-3xl border border-slate-800/80 bg-slate-900/35">
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Support Priority</label>
                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <label class="priority-label cursor-pointer border border-slate-850 rounded-xl p-3 flex flex-col items-center justify-center gap-1.5 text-center transition-all bg-slate-950/50 hover:bg-slate-850">
                        <input type="radio" name="priority" value="normal" checked class="hidden">
                        <span class="text-sm font-bold text-slate-200">Normal</span>
                        <span class="text-[9px] text-slate-500">Standard Visit</span>
                      </label>
                      <label class="priority-label cursor-pointer border border-slate-850 rounded-xl p-3 flex flex-col items-center justify-center gap-1.5 text-center transition-all bg-slate-950/50 hover:bg-slate-850">
                        <input type="radio" name="priority" value="senior" class="hidden">
                        <span class="text-sm font-bold text-slate-200">Senior</span>
                        <span class="text-[9px] text-slate-500">60+ / Special</span>
                      </label>
                      <label class="priority-label cursor-pointer border border-slate-850 rounded-xl p-3 flex flex-col items-center justify-center gap-1.5 text-center transition-all bg-slate-955/50 hover:bg-slate-850">
                        <input type="radio" name="priority" value="vip" class="hidden">
                        <span class="text-sm font-bold text-slate-200">VIP</span>
                        <span class="text-[9px] text-slate-500">Premium Account</span>
                      </label>
                      <label class="priority-label cursor-pointer border border-slate-850 rounded-xl p-3 flex flex-col items-center justify-center gap-1.5 text-center transition-all bg-slate-955/50 hover:bg-slate-850">
                        <input type="radio" name="priority" value="emergency" class="hidden">
                        <span class="text-sm font-bold text-slate-200">Emergency</span>
                        <span class="text-[9px] text-slate-500">Immediate Need</span>
                      </label>
                    </div>
                  </div>

                  <!-- Submit button -->
                  <button id="btn-generate-token" class="w-full py-4 px-6 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-base shadow-lg hover:shadow-primary/20 transition-all flex items-center justify-center gap-2 cursor-pointer">
                    Generate Digital Token
                  </button>
                </div>

                <!-- AI Waiting Preview sidebar panel -->
                <div class="md:col-span-1">
                  <div class="glass-card p-6 rounded-3xl border border-accent/30 bg-gradient-to-br from-accent/5 to-transparent relative overflow-hidden">
                    <div class="w-12 h-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mb-4">
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                      </svg>
                    </div>
                    <h3 class="text-sm font-bold text-accent uppercase tracking-wider">AI Wait Prediction</h3>
                    <div class="text-4xl font-black text-white my-3" id="predicted-wait-value">~0 mins</div>
                    <p class="text-xs text-slate-400 leading-relaxed" id="predicted-wait-details">Selecting details...</p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      `
    } catch (error) {
      console.error(error)
      return '<p class="text-center text-danger">Failed to load Join Queue.</p>'
    }
  },

  /**
   * 3. Live Tracking View
   */
  async renderLiveTrackingView(tokenId) {
    if (!tokenId) {
      setTimeout(() => router.navigate('/customer/dashboard'), 100)
      return ''
    }

    try {
      // Fetch token details
      const token = await queueService.getActiveToken(router.currentUser.id)
      
      // If no active token matches, or the ID is different, redirect
      if (!token || token.id !== tokenId) {
        toast.warning('Token not active or unauthorized.')
        setTimeout(() => router.navigate('/customer/dashboard'), 100)
        return ''
      }

      const position = await queueService.getQueuePosition(token.id)
      const prediction = await aiPredictor.predictWaitingTime(
        token.branch_id,
        token.service_id,
        token.priority,
        token.id
      )

      const isServing = token.status === 'serving'
      
      return `
        <div class="max-w-2xl mx-auto">
          <div class="mb-6 flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-black text-slate-900 dark:text-white">Live Queue Tracking</h1>
              <p class="text-sm text-slate-500 dark:text-slate-400">Keep this screen open. Your position updates automatically.</p>
            </div>
            <a href="#/customer/dashboard" class="text-sm font-bold text-primary hover:underline flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg> Dashboard
            </a>
          </div>

          <div class="grid grid-cols-1 gap-6">
            <!-- Main Tracking Card -->
            <div id="live-tracking-card" class="glass-card p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/30 text-center relative overflow-hidden bg-gradient-to-b from-white/70 to-slate-50/20 dark:from-slate-900/60 dark:to-slate-950/20">
              
              <!-- Pulse circle for serving state -->
              <div id="serving-pulse-container" class="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0">
                <div class="w-72 h-72 bg-success/5 rounded-full animate-ping"></div>
              </div>

              <div class="mb-4">
                <span class="inline-block px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide bg-primary/10 text-primary border border-primary/20" id="live-service-badge">
                  ${token.services?.name}
                </span>
              </div>

              <div class="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Your Token Number</div>
              <div class="text-6xl font-black text-slate-900 dark:text-white tracking-wider mb-6" id="live-token-number">${token.token_number}</div>

              <!-- Status Message -->
              <div id="live-status-container" class="p-6 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/30 dark:border-slate-800/30 max-w-sm mx-auto mb-6">
                ${isServing ? `
                  <div class="text-success font-black text-lg animate-bounce">Your Turn!</div>
                  <div class="text-sm text-slate-700 dark:text-slate-300 mt-1 font-bold">Please proceed to ${token.counters?.name || 'Counter'}</div>
                ` : `
                  <div class="text-slate-400 text-xs font-bold uppercase tracking-wider">Queue Position</div>
                  <div class="text-4xl font-black text-slate-950 dark:text-white my-1" id="live-position-val">#${position}</div>
                  <div class="text-xs text-slate-500 dark:text-slate-400">people ahead: <span id="live-ahead-val" class="font-bold text-slate-700 dark:text-slate-200">${position - 1}</span></div>
                `}
              </div>

              <!-- AI Wait Predictor -->
              <div class="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-8 border-t border-b border-slate-200/30 dark:border-slate-800/30 py-4">
                <div>
                  <span class="text-[10px] text-slate-400 font-bold uppercase block">Est. Waiting Time</span>
                  <span class="text-xl font-black text-slate-800 dark:text-white" id="live-wait-val">${isServing ? '0' : `~${prediction.predictedMinutes}`} mins</span>
                </div>
                <div>
                  <span class="text-[10px] text-slate-400 font-bold uppercase block">Priority Level</span>
                  <span class="text-xl font-black capitalize text-slate-855 dark:text-slate-200" id="live-priority-val">${token.priority}</span>
                </div>
              </div>

              <!-- QR Code & Actions -->
              <div class="flex flex-col items-center gap-6">
                <div class="p-4 bg-white rounded-2xl shadow-md border border-slate-100 inline-block">
                  <canvas id="token-qr-canvas"></canvas>
                  <p class="text-[10px] text-slate-400 font-bold uppercase mt-2">Scan at Counter</p>
                </div>
                
                <button id="cancel-queue-live" class="px-6 py-3 rounded-xl border border-danger/20 text-danger hover:bg-danger hover:text-white font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer">
                  Cancel Queue Token
                </button>
              </div>
            </div>
          </div>
        </div>
      `
    } catch (error) {
      console.error(error)
      return '<p class="text-center text-danger">Failed to load live queue tracking.</p>'
    }
  },

  /**
   * 4. History View
   */
  async renderHistoryView(userId) {
    try {
      const history = await queueService.getTokenHistory(userId)
      let listHTML = ''

      if (history && history.length > 0) {
        listHTML = history.map(h => {
          let statusColor = 'text-slate-500 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
          if (h.status === 'completed') statusColor = 'text-success bg-success/10 border-success/10'
          else if (h.status === 'skipped') statusColor = 'text-warning bg-warning/10 border-warning/10'
          else if (h.status === 'cancelled') statusColor = 'text-danger bg-danger/10 border-danger/10'

          // Check if feedback already exists or needs to be provided (only for completed)
          const needsFeedback = h.status === 'completed' // In real app, we check if feedback table has a row for this queue_id. We'll check client-side or assume they can rate it.
          const feedbackBtn = needsFeedback 
            ? `<button class="rate-token-btn px-4 py-1.5 rounded-xl border border-primary/20 text-primary hover:bg-primary hover:text-white text-xs font-bold transition-all cursor-pointer" data-id="${h.id}" data-token="${h.token_number}">Rate Visit</button>`
            : ''

          const date = new Date(h.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
          const time = new Date(h.created_at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })

          return `
            <div class="glass-card p-5 rounded-2xl border border-slate-200/40 dark:border-slate-800/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div class="flex items-start gap-4">
                <div class="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center flex-shrink-0 font-black text-slate-850 dark:text-slate-200">
                  ${h.token_number}
                </div>
                <div>
                  <h4 class="font-bold text-slate-800 dark:text-white">${h.services?.name}</h4>
                  <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">${date} at ${time} &bull; ${h.counters?.name || 'Self-service'}</p>
                </div>
              </div>
              <div class="flex items-center gap-3 self-end sm:self-center">
                <span class="px-3 py-1 rounded-full text-xs font-bold uppercase border ${statusColor}">
                  ${h.status}
                </span>
                ${feedbackBtn}
              </div>
            </div>
          `
        }).join('')
      } else {
        listHTML = `
          <div class="text-center py-12 glass-card border border-slate-200/40 dark:border-slate-800/30 rounded-3xl">
            <p class="text-slate-400">You don't have any past queue tokens.</p>
          </div>
        `
      }

      return `
        <div class="max-w-4xl mx-auto">
          <div class="mb-8">
            <h1 class="text-2xl font-black text-slate-900 dark:text-white">Queue History</h1>
            <p class="text-sm text-slate-500 dark:text-slate-400">View your past visits and leave feedback to help us improve.</p>
          </div>

          <div class="flex flex-col gap-4">
            ${listHTML}
          </div>
        </div>
      `
    } catch (error) {
      console.error('History load error:', error)
      const isTableMissing = error.code === '42P01' || (error.message && error.message.includes('relation') && error.message.includes('does not exist'))
      const errorMsg = isTableMissing
        ? 'Database tables not found. Please ensure you have run the database migrations (schema.sql) in your Supabase SQL Editor.'
        : 'Failed to load queue history. Please check your network connection.'
      return `
        <div class="glass-card p-8 rounded-3xl border border-danger/20 text-center bg-white/50 dark:bg-slate-900/10 shadow-md">
          <div class="w-12 h-12 rounded-full bg-danger/10 text-danger flex items-center justify-center mx-auto mb-4">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          </div>
          <h4 class="text-base font-bold text-slate-900 dark:text-white mb-2">History Error</h4>
          <p class="text-sm text-slate-500 dark:text-slate-450 max-w-md mx-auto mb-4">${errorMsg}</p>
        </div>
      `
    }
  },

  /**
   * 5. Profile View
   */
  async renderProfileView() {
    const profile = router.currentUser?.profile
    return `
      <div class="max-w-2xl mx-auto">
        <div class="mb-8">
          <h1 class="text-2xl font-black text-slate-900 dark:text-white">My Profile</h1>
          <p class="text-sm text-slate-500 dark:text-slate-400">Manage your account details and security settings.</p>
        </div>

        <div class="glass-card p-8 rounded-3xl border border-slate-200/40 dark:border-slate-800/30 shadow-xl bg-white/50 dark:bg-slate-900/20">
          <form id="profile-form" class="space-y-6">
            <div>
              <label for="profile-name" class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Full Name</label>
              <input type="text" id="profile-name" required value="${profile?.full_name || ''}" class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-slate-800 dark:text-slate-200">
            </div>

            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Email Address</label>
              <input type="email" disabled value="${profile?.email || ''}" class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/30 text-slate-400 dark:text-slate-500 cursor-not-allowed outline-none">
              <p class="text-[10px] text-slate-400 mt-1.5">Email address cannot be changed.</p>
            </div>

            <button type="submit" class="px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-sm shadow-md hover:shadow-primary/20 transition-all cursor-pointer">
              Save Changes
            </button>
          </form>
        </div>
      </div>
    `
  },

  // ==========================================================
  // INITIALIZATION AND EVENT BINDING
  // ==========================================================

  init(params) {
    try {
      // Initialize sidebar behaviors
      sidebar.init()

      const hash = window.location.hash || '#/customer/dashboard'
      const activePath = hash.split('?')[0].substring(1)

      // Bind events based on sub-path
      if (activePath === '/customer/join-queue') {
        this.initJoinQueue()
      } else if (activePath === '/customer/live-tracking') {
        this.initLiveTracking(params.id)
      } else if (activePath === '/customer/history') {
        this.initHistory()
      } else if (activePath === '/customer/profile') {
        this.initProfile()
      } else {
        this.initDashboard()
      }
    } catch (err) {
      console.error('Error in customer page initialization:', err)
    }
  },

  /**
   * Dashboard Events
   */
  initDashboard() {
    const cancelBtn = document.getElementById('cancel-queue-dashboard')
    if (cancelBtn) {
      cancelBtn.addEventListener('click', (e) => {
        const tokenId = e.target.getAttribute('data-id')
        this.cancelTokenDialog(tokenId)
      })
    }
  },

  /**
   * Wizard State Variable
   */
  wizard: {
    step: 1,
    categoryId: null,
    categoryName: null,
    branchId: null,
    branchName: null,
    serviceId: null,
    priority: 'normal',
    userLocation: null,
    map: null,
    markers: [],
    branches: [],
    categories: [],
    services: [],
    activeFilter: 'all',
    searchQuery: '',
    watchId: null,
    userMarker: null
  },

  /**
   * Helper to calculate distance in km between two lat/lng coordinates (Haversine formula)
   */
  calculateDistance(lat1, lon1, lat2, lon2) {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null
    const R = 6371 // radius of earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  },

  /**
   * Helper to check if a branch is currently open
   */
  isBranchOpen(branch) {
    if (!branch.opening_time || !branch.closing_time) return true
    const now = new Date()
    const timeStr = now.toTimeString().split(' ')[0] // e.g. "14:30:15"
    return timeStr >= branch.opening_time && timeStr <= branch.closing_time
  },

  /**
   * Helper to parse 24h time to 12h AM/PM
   */
  formatTime(timeStr) {
    if (!timeStr) return ''
    const parts = timeStr.split(':')
    const hours = parseInt(parts[0])
    const minutes = parts[1]
    const ampm = hours >= 12 ? 'PM' : 'AM'
    const displayHours = hours % 12 || 12
    return `${displayHours}:${minutes} ${ampm}`
  },

  /**
   * Helper to get category emoji/icon from ID or list
   */
  getCategoryEmoji(categoryId) {
    const cat = this.wizard.categories.find(c => c.id === categoryId)
    return cat ? cat.icon : '🏢'
  },

  /**
   * Join Queue Events
   */
  async initJoinQueue() {
    try {
      // 1. Reset wizard state
      this.wizard.step = 1
      this.wizard.categoryId = null
      this.wizard.categoryName = null
      this.wizard.branchId = null
      this.wizard.branchName = null
      this.wizard.serviceId = null
      this.wizard.priority = 'normal'
      this.wizard.activeFilter = 'all'
      this.wizard.searchQuery = ''
      this.wizard.markers = []
      this.wizard.map = null

      // Render Step 1
      this.showWizardStep(1)
      this.updateWizardProgressBar()

      // Fetch Categories
      const categoryGrid = document.getElementById('category-grid')
      if (categoryGrid) {
        categoryGrid.innerHTML = skeletons.cardGrid(4)
      }

      const categories = await queueService.getBusinessCategories()
      this.wizard.categories = categories

      if (categoryGrid) {
        categoryGrid.innerHTML = categories.map(cat => `
          <div class="category-card glass-card p-6 rounded-3xl border border-slate-800 hover:border-primary/50 transition-all hover:scale-102 hover:shadow-lg cursor-pointer flex flex-col items-center justify-center text-center gap-3 relative overflow-hidden group bg-slate-900/20" data-id="${cat.id}" data-name="${cat.name}">
            <div class="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div class="w-16 h-16 rounded-2xl bg-slate-950 flex items-center justify-center text-4xl shadow-sm border border-slate-800/30">
              ${cat.icon}
            </div>
            <h3 class="font-bold text-slate-200 text-base">${cat.name}</h3>
          </div>
        `).join('')

        // Category Cards click handlers
        categoryGrid.querySelectorAll('.category-card').forEach(card => {
          card.addEventListener('click', async () => {
            const id = card.getAttribute('data-id')
            const name = card.getAttribute('data-name')
            this.wizard.categoryId = id
            this.wizard.categoryName = name
            
            // Go to step 2
            await this.initStep2()
          })
        })
      }
    } catch (e) {
      console.error(e)
      toast.error('Failed to initialize queue selector.')
    }
  },

  /**
   * Transition Steps
   */
  showWizardStep(stepNum) {
    this.wizard.step = stepNum
    const steps = [1, 2, 3, 4]
    
    steps.forEach(s => {
      const container = document.getElementById(`step-${s}-container`)
      if (!container) return
      
      if (s === stepNum) {
        container.classList.remove('hidden')
        gsap.fromTo(container, {
          opacity: 0,
          x: 20
        }, {
          opacity: 1,
          x: 0,
          duration: 0.4,
          ease: 'power2.out'
        })
      } else {
        container.classList.add('hidden')
      }
    })
    this.updateWizardProgressBar()
  },

  updateWizardProgressBar() {
    const bar = document.getElementById('wizard-progress-bar')
    const labels = document.querySelectorAll('.step-indicator-label')
    if (!bar) return

    const stepPct = (this.wizard.step / 4) * 100
    bar.style.width = `${stepPct}%`

    labels.forEach(label => {
      const step = parseInt(label.getAttribute('data-step'))
      if (step <= this.wizard.step) {
        label.classList.add('text-primary', 'font-bold')
        label.classList.remove('text-slate-400')
      } else {
        label.classList.remove('text-primary', 'font-bold')
        label.classList.add('text-slate-400')
      }
    })
  },

  /**
   * STEP 2: LEAFLET MAP DISCOVERY & SEARCH
   */
  async initStep2() {
    this.showWizardStep(2)
    const subtitle = document.getElementById('branch-step-subtitle')
    if (subtitle) {
      subtitle.textContent = `Sector: ${this.wizard.categoryName} • Real-time GPS Position Active`
    }

    const listCol = document.getElementById('branch-list-column')
    if (listCol) {
      listCol.innerHTML = skeletons.list(3)
    }

    // Fetch branches for selected category
    const branches = await queueService.getBranches(this.wizard.categoryId)
    this.wizard.branches = branches

    // Set up Real-Time GPS Tracking via watchPosition
    if (this.wizard.watchId) {
      navigator.geolocation.clearWatch(this.wizard.watchId)
    }
    
    this.wizard.watchId = navigator.geolocation.watchPosition(
      (pos) => {
        this.wizard.userLocation = [pos.coords.latitude, pos.coords.longitude]
        console.log("GPS Location Updated:", this.wizard.userLocation)
        
        // Update user marker position on Leaflet Map
        if (this.wizard.map && this.wizard.userMarker) {
          this.wizard.userMarker.setLatLng(this.wizard.userLocation)
        }
        
        // Refresh distance calculations and sidebar list
        this.filterAndRenderBranches()
      },
      (err) => {
        console.warn("Real-time GPS coordinates not available or permission denied:", err)
        // Fallback to NYC center if not already geolocated
        if (!this.wizard.userLocation) {
          this.wizard.userLocation = [40.7128, -74.0060]
          this.filterAndRenderBranches()
        }
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
    )

    // Render Leaflet Map
    await this.renderLeafletMapLayout()

    // Setup Supabase Real-Time Branch Stats Channel Subscription
    this.setupRealtimeBranchStats()

    // Bind popup selection click event delegator on map container
    const mapDiv = document.getElementById('leaflet-map')
    if (mapDiv) {
      // Clear previous click listener if any
      const newMapDiv = mapDiv.cloneNode(true)
      mapDiv.parentNode.replaceChild(newMapDiv, mapDiv)
      
      newMapDiv.addEventListener('click', (e) => {
        const selectBtn = e.target.closest('.btn-select-branch-map')
        if (selectBtn) {
          const id = selectBtn.getAttribute('data-id')
          const name = selectBtn.getAttribute('data-name')
          this.selectBranch(id, name)
        }
      })
    }

    // Bind back button
    const backBtn = document.getElementById('btn-back-to-step1')
    if (backBtn) {
      backBtn.onclick = () => {
        this.cleanupStep2()
        this.showWizardStep(1)
      }
    }

    // Search input handler
    const searchInput = document.getElementById('branch-search-input')
    if (searchInput) {
      searchInput.value = this.wizard.searchQuery
      searchInput.addEventListener('input', () => {
        this.wizard.searchQuery = searchInput.value.toLowerCase().trim()
        this.filterAndRenderBranches()
      })
    }

    // Filter Buttons
    const filterBtns = document.querySelectorAll('.branch-filter-btn')
    filterBtns.forEach(btn => {
      const type = btn.getAttribute('data-filter')
      if (type === this.wizard.activeFilter) {
        btn.className = 'branch-filter-btn px-3 py-1.5 rounded-lg border text-xs font-semibold bg-primary text-white border-primary cursor-pointer'
      } else {
        btn.className = 'branch-filter-btn px-3 py-1.5 rounded-lg border text-xs font-semibold border-slate-800 hover:bg-slate-800 text-slate-350 cursor-pointer'
      }

      btn.onclick = () => {
        filterBtns.forEach(b => {
          b.className = 'branch-filter-btn px-3 py-1.5 rounded-lg border text-xs font-semibold border-slate-800 hover:bg-slate-800 text-slate-350 cursor-pointer'
        })
        btn.className = 'branch-filter-btn px-3 py-1.5 rounded-lg border text-xs font-semibold bg-primary text-white border-primary cursor-pointer'
        this.wizard.activeFilter = type
        this.filterAndRenderBranches()
      }
    })
  },

  /**
   * Load Leaflet Library & Tiles
   */
  async renderLeafletMapLayout() {
    // 1. Load Leaflet CSS and JS if not already loaded
    if (!document.getElementById('leaflet-css-link')) {
      const link = document.createElement('link')
      link.id = 'leaflet-css-link'
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }

    if (!window.L) {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script')
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
        script.onload = resolve
        script.onerror = reject
        document.body.appendChild(script)
      })
    }

    // 2. Clear old map instance
    if (this.wizard.map) {
      this.wizard.map.remove()
      this.wizard.map = null
    }

    // 3. Initialize map centered on user or NYC Center
    const center = this.wizard.userLocation || [40.7128, -74.0060]
    const map = L.map('leaflet-map', {
      zoomControl: true
    }).setView(center, 13)
    this.wizard.map = map

    // 4. Load Premium Dark Matter Tile Layer (Free, no API key required)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map)

    // 5. Draw User Blue pulsing dot
    if (this.wizard.userLocation) {
      const userMarker = L.marker(this.wizard.userLocation, {
        icon: L.divIcon({
          className: 'user-loc-dot',
          html: `<div class="w-4 h-4 bg-primary rounded-full border-2 border-white shadow-md animate-pulse"></div>`,
          iconSize: [16, 16],
          iconAnchor: [8, 8]
        })
      }).addTo(map).bindPopup('Your Location')
      this.wizard.userMarker = userMarker
    }

    // 6. Draw branch markers and side panels
    this.filterAndRenderBranches()
  },

  /**
   * Filter and Render branches list & Leaflet map markers
   */
  filterAndRenderBranches() {
    const listCol = document.getElementById('branch-list-column')
    if (!listCol || !this.wizard.map) return

    // Clear old Leaflet markers
    if (this.wizard.markers && this.wizard.markers.length > 0) {
      this.wizard.markers.forEach(m => m.remove())
    }
    this.wizard.markers = []

    // 1. Calculate distances & stats
    let branches = this.wizard.branches.map(b => {
      const distance = this.wizard.userLocation
        ? this.calculateDistance(this.wizard.userLocation[0], this.wizard.userLocation[1], parseFloat(b.latitude), parseFloat(b.longitude))
        : null
      
      let waitTime = 10
      let queueLen = 2
      if (b.id) {
        const charCodeSum = b.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
        waitTime = (charCodeSum % 25) + 5
        queueLen = charCodeSum % 7
      }

      return {
        ...b,
        distance,
        waitTime,
        queueLen
      }
    })

    // Sort by distance if GPS location exists
    if (this.wizard.userLocation) {
      branches.sort((a, b) => a.distance - b.distance)
    }

    // 2. Filter query search (matches name, category, or city/area in address)
    if (this.wizard.searchQuery) {
      const query = this.wizard.searchQuery
      branches = branches.filter(b => 
        b.name.toLowerCase().includes(query) ||
        b.address.toLowerCase().includes(query) ||
        (this.wizard.categoryName && this.wizard.categoryName.toLowerCase().includes(query))
      )
    }

    // 3. Tab Filters (within 1km, 5km, open now, wait time, favorites)
    const favorites = JSON.parse(localStorage.getItem('favorite_branches') || '[]')
    
    if (this.wizard.activeFilter === '1km') {
      branches = branches.filter(b => b.distance !== null && b.distance <= 1)
    } else if (this.wizard.activeFilter === '5km') {
      branches = branches.filter(b => b.distance !== null && b.distance <= 5)
    } else if (this.wizard.activeFilter === 'open') {
      branches = branches.filter(b => this.isBranchOpen(b))
    } else if (this.wizard.activeFilter === 'wait') {
      branches.sort((a, b) => a.waitTime - b.waitTime)
    } else if (this.wizard.activeFilter === 'favorites') {
      branches = branches.filter(b => favorites.includes(b.id))
    }

    // 4. Render Lists UI
    if (branches.length === 0) {
      listCol.innerHTML = `
        <div class="glass-card p-6 text-center rounded-2xl border border-slate-800 bg-slate-900/10">
          <p class="text-sm text-slate-500">No nearby branches match the criteria.</p>
        </div>
      `
      return
    }

    listCol.innerHTML = branches.map(b => {
      const isOpen = this.isBranchOpen(b)
      const statusBadge = isOpen
        ? `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-success/10 text-success border border-success/20">Open Now</span>`
        : `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-danger/10 text-danger border border-danger/20">Closed</span>`

      const distText = b.distance !== null ? `${b.distance.toFixed(1)} km away` : 'GPS Position N/A'
      const travelTimeText = b.distance !== null ? `🚗 ~${Math.round((b.distance / 40) * 60)} mins` : ''
      const isFavorite = favorites.includes(b.id)
      const favIconClass = isFavorite ? 'text-danger fill-current' : 'text-slate-500 hover:text-white'

      return `
        <div class="branch-card-wizard glass-card p-4 rounded-2xl border border-slate-800/80 bg-slate-900/20 hover:border-primary/50 transition-all flex flex-col gap-2 relative cursor-pointer" data-id="${b.id}" data-name="${b.name}">
          <!-- Toggle Favorite -->
          <button class="btn-toggle-favorite absolute top-4 right-4 p-1 rounded-full hover:bg-slate-850 z-20 cursor-pointer" data-id="${b.id}">
            <svg class="w-4 h-4 ${favIconClass}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
            </svg>
          </button>

          <div>
            <div class="flex items-center gap-2 mb-1">
              <h4 class="font-extrabold text-sm text-slate-200 truncate pr-6">${b.name}</h4>
              ${statusBadge}
            </div>
            <p class="text-xs text-slate-450 truncate mb-1">${b.address}</p>
            <div class="flex items-center gap-3 text-[10px] font-bold text-slate-500">
              <span>📍 ${distText}</span>
              ${travelTimeText ? `<span>${travelTimeText}</span>` : ''}
              <span>🕒 ${this.formatTime(b.opening_time)} - ${this.formatTime(b.closing_time)}</span>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4 border-t border-slate-850 pt-2 mt-1">
            <div>
              <span class="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Queue Wait</span>
              <span class="text-xs font-black text-slate-200">~${b.waitTime} mins</span>
            </div>
            <div>
              <span class="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Total Queue</span>
              <span class="text-xs font-black text-slate-200">${b.queueLen} waiting</span>
            </div>
          </div>

          <button class="btn-select-branch-trigger mt-1 w-full py-2 bg-primary/10 hover:bg-primary text-primary hover:text-white transition-all text-xs font-bold rounded-xl cursor-pointer">
            Select & View Services
          </button>
        </div>
      `
    }).join('')

    // 5. Render Leaflet Markers with Emojis
    branches.forEach(b => {
      if (!b.latitude || !b.longitude) return
      const lat = parseFloat(b.latitude)
      const lng = parseFloat(b.longitude)
      const isOpen = this.isBranchOpen(b)
      const emoji = this.getCategoryEmoji(b.category_id)
      const pinColor = isOpen ? '#10B981' : '#EF4444'

      const customIcon = L.divIcon({
        className: 'custom-pin-icon',
        html: `<div class="w-8 h-8 rounded-full border-2 border-slate-950 flex items-center justify-center text-lg text-white shadow-xl cursor-pointer hover:scale-110 transition-transform" style="background-color: ${pinColor}">${emoji}</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32]
      })

      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(this.wizard.map)

      // Leaflet Popup Content
      const detailsPopupContent = `
        <div class="p-3 font-sans text-slate-850 max-w-[240px]">
          <h4 class="font-extrabold text-sm mb-1">${b.name}</h4>
          <p class="text-xs text-slate-500 mb-2">${b.address}</p>
          <div class="space-y-1 text-xs text-slate-700 font-medium mb-3">
            <div>📍 ${b.distance !== null ? `${b.distance.toFixed(1)} km away` : 'GPS Position N/A'}</div>
            <div>🚗 Travel: ${b.distance !== null ? `~${Math.round((b.distance / 40) * 60)} mins` : 'N/A'}</div>
            <div>🕒 Status: <span class="font-bold ${isOpen ? 'text-success' : 'text-danger'}">${isOpen ? 'Open' : 'Closed'}</span></div>
            <div>👥 Queue Length: ${b.queueLen} waiting</div>
            <div>⌛ Est. Wait: ~${b.waitTime} mins</div>
          </div>
          <button class="btn-select-branch-map mt-2 w-full py-2 bg-primary text-white font-bold rounded-xl text-xs cursor-pointer hover:bg-primary/95 transition-all" data-id="${b.id}" data-name="${b.name}">
            Join Queue
          </button>
        </div>
      `

      marker.bindPopup(detailsPopupContent)

      marker.on('click', () => {
        this.highlightBranchCard(b.id)
      })

      this.wizard.markers.push(marker)
    })

    // 6. Bind sidebar branch selection listeners
    const cards = listCol.querySelectorAll('.branch-card-wizard')
    cards.forEach(card => {
      const id = card.getAttribute('data-id')
      const name = card.getAttribute('data-name')
      
      const selectBtn = card.querySelector('.btn-select-branch-trigger')
      if (selectBtn) {
        selectBtn.onclick = (e) => {
          e.stopPropagation()
          this.selectBranch(id, name)
        }
      }

      card.onclick = () => {
        const branchObj = this.wizard.branches.find(x => x.id === id)
        if (branchObj && branchObj.latitude && branchObj.longitude) {
          const lat = parseFloat(branchObj.latitude)
          const lng = parseFloat(branchObj.longitude)
          this.wizard.map.setView([lat, lng], 14, { animate: true })
          
          // Open popup
          const index = this.wizard.branches.findIndex(x => x.id === id)
          if (index > -1 && this.wizard.markers[index]) {
            this.wizard.markers[index].openPopup()
          }
        }
      }
    })

    // Toggle Favorites
    const favBtns = listCol.querySelectorAll('.btn-toggle-favorite')
    favBtns.forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation()
        const id = btn.getAttribute('data-id')
        let favs = JSON.parse(localStorage.getItem('favorite_branches') || '[]')
        
        if (favs.includes(id)) {
          favs = favs.filter(x => x !== id)
          toast.success('Removed from favorites.')
        } else {
          favs.push(id)
          toast.success('Added to favorites.')
        }
        localStorage.setItem('favorite_branches', JSON.stringify(favs))
        this.filterAndRenderBranches()
      }
    })
  },

  /**
   * Highlight and Scroll to card in list view
   */
  highlightBranchCard(branchId) {
    const cards = document.querySelectorAll('.branch-card-wizard')
    cards.forEach(c => {
      c.classList.remove('border-primary', 'bg-primary/5', 'ring-2', 'ring-primary/20')
      c.classList.add('border-slate-800/85')
    })
    
    const selectedCard = document.querySelector(`.branch-card-wizard[data-id="${branchId}"]`)
    if (selectedCard) {
      selectedCard.classList.remove('border-slate-800/85')
      selectedCard.classList.add('border-primary', 'bg-primary/5', 'ring-2', 'ring-primary/20')
      selectedCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  },

  /**
   * Setup Realtime Subscription to queues changes to refresh branch stats in real-time
   */
  setupRealtimeBranchStats() {
    if (this.branchStatsSubscription) {
      supabase.removeChannel(this.branchStatsSubscription)
    }

    this.branchStatsSubscription = supabase
      .channel('realtime-branch-discovery')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'queues'
        },
        () => {
          console.log('Realtime queues update detected, refreshing discovery...')
          if (this.wizard.step === 2) {
            this.filterAndRenderBranches()
          }
        }
      )
      .subscribe()
  },

  /**
   * Action when branch is chosen
   */
  async selectBranch(branchId, branchName) {
    this.wizard.branchId = branchId
    this.wizard.branchName = branchName
    this.cleanupStep2()
    await this.initStep3()
  },

  cleanupStep2() {
    if (this.wizard.watchId) {
      navigator.geolocation.clearWatch(this.wizard.watchId)
      this.wizard.watchId = null
    }
    if (this.branchStatsSubscription) {
      supabase.removeChannel(this.branchStatsSubscription)
      this.branchStatsSubscription = null
    }
    if (this.wizard.map) {
      this.wizard.map.remove()
      this.wizard.map = null
    }
  },

  /**
   * STEP 3: SERVICES SELECTION
   */
  async initStep3() {
    this.showWizardStep(3)
    
    const subtitle = document.getElementById('service-step-subtitle')
    if (subtitle) {
      subtitle.textContent = `Branch: ${this.wizard.branchName} • Select the service you require.`
    }

    const grid = document.getElementById('services-grid')
    if (grid) {
      grid.innerHTML = skeletons.cardGrid(3)
    }

    // Fetch services for selected branch
    const services = await queueService.getServices(this.wizard.branchId)
    this.wizard.services = services

    if (grid) {
      if (services.length === 0) {
        grid.innerHTML = `
          <div class="col-span-full text-center py-12 glass-card border border-slate-800 rounded-3xl">
            <p class="text-slate-450">No active services configured for this branch.</p>
          </div>
        `
        return
      }

      grid.innerHTML = services.map(s => `
        <div class="service-card-wizard glass-card p-6 rounded-3xl border border-slate-850 hover:border-primary/50 transition-all hover:scale-102 hover:shadow-lg cursor-pointer flex flex-col justify-between gap-4 bg-slate-900/25" data-id="${s.id}">
          <div>
            <div class="flex items-center gap-2 mb-2">
              <span class="px-2 py-0.5 rounded bg-primary/10 text-primary font-bold text-xs">${s.prefix || 'Q'}</span>
              <h4 class="font-extrabold text-sm text-slate-200">${s.name}</h4>
            </div>
            <p class="text-xs text-slate-500">Average completion time per visitor.</p>
          </div>
          <div class="flex justify-between items-center border-t border-slate-850 pt-3">
            <span class="text-[10px] text-slate-500 font-bold uppercase">Avg Time</span>
            <span class="text-xs font-black text-slate-350">~${s.avg_service_time || 15} mins</span>
          </div>
        </div>
      `).join('')

      // Bind card click handlers
      grid.querySelectorAll('.service-card-wizard').forEach(card => {
        card.addEventListener('click', () => {
          const id = card.getAttribute('data-id')
          this.wizard.serviceId = id
          this.initStep4()
        })
      })
    }

    // Bind back button
    const backBtn = document.getElementById('btn-back-to-step2')
    if (backBtn) {
      backBtn.onclick = async () => {
        await this.initStep2()
      }
    }
  },

  /**
   * STEP 4: PRIORITY & CONFIRMATION
   */
  async initStep4() {
    this.showWizardStep(4)

    const priorityLabels = document.querySelectorAll('.priority-label')
    const generateBtn = document.getElementById('btn-generate-token')

    // Style priority radio selectors
    const updatePriorityStyles = () => {
      priorityLabels.forEach(label => {
        const radio = label.querySelector('input')
        if (radio.checked) {
          label.classList.remove('border-slate-850')
          label.classList.add('border-primary', 'bg-primary/5', 'ring-2', 'ring-primary/20')
        } else {
          label.classList.remove('border-primary', 'bg-primary/5', 'ring-2', 'ring-primary/20')
          label.classList.add('border-slate-850')
        }
      })
    }

    priorityLabels.forEach(label => {
      label.onclick = () => {
        const radio = label.querySelector('input')
        radio.checked = true
        this.wizard.priority = radio.value
        updatePriorityStyles()
        this.updateAIWaitPreview()
      }
    })
    updatePriorityStyles()

    // Trigger AI prediction preview
    await this.updateAIWaitPreview()

    // Bind Generate Button
    if (generateBtn) {
      generateBtn.onclick = async () => {
        generateBtn.disabled = true
        generateBtn.innerHTML = `<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Generating Token...`
        
        try {
          const queueRecord = await queueService.joinQueue(
            this.wizard.branchId,
            this.wizard.serviceId,
            router.currentUser.id,
            this.wizard.priority
          )
          toast.success('Joined queue successfully!')
          router.navigate('/customer/live-tracking', { id: queueRecord.id })
        } catch (error) {
          toast.error(error.message || 'Failed to join queue.')
          generateBtn.disabled = false
          generateBtn.textContent = 'Generate Digital Token'
        }
      }
    }

    // Bind back button
    const backBtn = document.getElementById('btn-back-to-step3')
    if (backBtn) {
      backBtn.onclick = () => {
        this.showWizardStep(3)
      }
    }
  },

  /**
   * Update the AI waiting time preview dynamically from wizard state variables
   */
  async updateAIWaitPreview() {
    const valueEl = document.getElementById('predicted-wait-value')
    const detailsEl = document.getElementById('predicted-wait-details')
    
    if (!this.wizard.branchId || !this.wizard.serviceId) return

    try {
      const prediction = await aiPredictor.predictWaitingTime(
        this.wizard.branchId,
        this.wizard.serviceId,
        this.wizard.priority
      )
      
      if (valueEl && detailsEl) {
        valueEl.textContent = `~${prediction.predictedMinutes} mins`
        detailsEl.textContent = `Based on ${prediction.factors.activeCounters} active counter(s), ${prediction.factors.peopleAhead} person(s) ahead, and a ${Math.round(prediction.factors.congestionMultiplier * 100)}% traffic load.`
      }
    } catch (e) {
      console.error(e)
    }
  },
  initLiveTracking(tokenId) {
    const canvas = document.getElementById('token-qr-canvas')
    const cancelBtn = document.getElementById('cancel-queue-live')
    const tokenNum = document.getElementById('live-token-number')?.textContent

    // Render QR Code defensively
    if (canvas && tokenNum) {
      try {
        const qr = QRCode.default || QRCode
        if (qr && typeof qr.toCanvas === 'function') {
          qr.toCanvas(canvas, tokenNum, { 
            width: 150, 
            margin: 1,
            color: {
              dark: '#0F172A',
              light: '#FFFFFF'
            }
          })
        } else {
          console.warn('QRCode library is not fully loaded or missing toCanvas function.')
        }
      } catch (qrError) {
        console.error('Failed to render QR Code:', qrError)
      }
    }

    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        this.cancelTokenDialog(tokenId)
      })
    }

    // Subscribe to real-time updates for this specific queue token!
    this.setupRealtimeSubscription(tokenId)
  },

  /**
   * Sets up Supabase Realtime to listen to queue status updates.
   */
  setupRealtimeSubscription(tokenId) {
    this.cleanupSubscription()

    this.activeSubscription = supabase
      .channel(`queue-token-${tokenId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'queues',
          filter: `id=eq.${tokenId}`,
        },
        async (payload) => {
          console.log('Token updated in real-time:', payload.new)
          const updatedToken = payload.new
          
          // Play a gentle notification sound when status changes
          try {
            const context = new (window.AudioContext || window.webkitAudioContext)()
            const osc = context.createOscillator()
            const gain = context.createGain()
            osc.connect(gain)
            gain.connect(context.destination)
            osc.frequency.value = updatedToken.status === 'serving' ? 523.25 : 440 // C5 for serving, A4 for others
            gain.gain.setValueAtTime(0.1, context.currentTime)
            osc.start()
            osc.stop(context.currentTime + 0.3)
          } catch (e) {
            // Audio context blocked by browser autoplay rules
          }

          if (updatedToken.status === 'serving') {
            // Fetch counter name
            const { data: counter } = await supabase
              .from('counters')
              .select('name')
              .eq('id', updatedToken.counter_id)
              .single()

            toast.success(`Your turn! Please go to ${counter?.name || 'the counter'}`)
            
            // Animate card transition to serving
            const statusContainer = document.getElementById('live-status-container')
            const pulseContainer = document.getElementById('serving-pulse-container')
            
            if (statusContainer) {
              statusContainer.innerHTML = `
                <div class="text-success font-black text-lg animate-bounce">Your Turn!</div>
                <div class="text-sm text-slate-700 dark:text-slate-300 mt-1 font-bold">Please proceed to ${counter?.name || 'Counter'}</div>
              `
              gsap.from(statusContainer, { scale: 0.9, duration: 0.3, ease: 'back.out(1.5)' })
            }

            if (pulseContainer) {
              pulseContainer.style.opacity = '1'
            }

            const waitVal = document.getElementById('live-wait-val')
            if (waitVal) waitVal.textContent = '0 mins'
          } else if (['completed', 'skipped', 'cancelled'].includes(updatedToken.status)) {
            toast.info(`Token status updated to: ${updatedToken.status}`)
            router.navigate('/customer/dashboard')
          } else {
            // Update queue position and waiting time
            this.updateLiveTrackingDetails(tokenId)
          }
        }
      )
      .subscribe()
  },

  /**
   * Fetch and update queue position and wait time manually or on regular poll.
   */
  async updateLiveTrackingDetails(tokenId) {
    try {
      const position = await queueService.getQueuePosition(tokenId)
      const token = await queueService.getActiveToken(router.currentUser.id)
      if (!token) return

      const prediction = await aiPredictor.predictWaitingTime(
        token.branch_id,
        token.service_id,
        token.priority,
        token.id
      )

      const posVal = document.getElementById('live-position-val')
      const aheadVal = document.getElementById('live-ahead-val')
      const waitVal = document.getElementById('live-wait-val')

      if (posVal) posVal.textContent = `#${position}`
      if (aheadVal) aheadVal.textContent = position - 1
      if (waitVal) waitVal.textContent = `~${prediction.predictedMinutes} mins`
    } catch (e) {
      console.error(e)
    }
  },

  cleanupSubscription() {
    if (this.activeSubscription) {
      supabase.removeChannel(this.activeSubscription)
      this.activeSubscription = null
    }
  },

  /**
   * 4. Queue History Events & Feedback Submission
   */
  initHistory() {
    const rateButtons = document.querySelectorAll('.rate-token-btn')
    
    rateButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const tokenId = btn.getAttribute('data-id')
        const tokenNum = btn.getAttribute('data-token')
        
        this.openFeedbackDialog(tokenId, tokenNum)
      })
    })
  },

  /**
   * Open Feedback Dialog Modal.
   */
  openFeedbackDialog(tokenId, tokenNum) {
    modal.show({
      title: `Rate Visit (${tokenNum})`,
      bodyHTML: `
        <div class="flex flex-col gap-4">
          <p class="text-xs text-slate-500 dark:text-slate-400">Please rate your experience. Your feedback helps us improve our services.</p>
          
          <!-- Stars Selector -->
          <div class="flex items-center justify-center gap-2 my-2">
            ${[1, 2, 3, 4, 5].map(star => `
              <button class="star-rating-btn text-slate-300 hover:text-amber-400 transition-colors cursor-pointer" data-value="${star}">
                <svg class="w-8 h-8 fill-current" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
              </button>
            `).join('')}
          </div>
          <input type="hidden" id="feedback-rating-val" value="0">

          <!-- Comments -->
          <div>
            <label for="feedback-comments" class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">Comments (Optional)</label>
            <textarea id="feedback-comments" rows="3" class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-sm focus:border-primary outline-none transition-all" placeholder="Share your experience..."></textarea>
          </div>
        </div>
      `,
      confirmText: 'Submit Rating',
      onConfirm: async () => {
        const rating = parseInt(document.getElementById('feedback-rating-val').value)
        const comments = document.getElementById('feedback-comments').value.trim()
        
        if (rating === 0) {
          toast.warning('Please select a star rating.')
          throw new Error('Rating not selected')
        }

        try {
          await queueService.submitFeedback(tokenId, router.currentUser.id, rating, comments)
          toast.success('Feedback submitted successfully!')
          router.navigate('/customer/history')
        } catch (error) {
          toast.error('Failed to submit feedback.')
          throw error
        }
      }
    })

    // Bind star click events
    setTimeout(() => {
      const stars = document.querySelectorAll('.star-rating-btn')
      const ratingValInput = document.getElementById('feedback-rating-val')

      stars.forEach(star => {
        star.addEventListener('click', () => {
          const val = parseInt(star.getAttribute('data-value'))
          ratingValInput.value = val
          
          // Highlight selected stars
          stars.forEach(s => {
            const sVal = parseInt(s.getAttribute('data-value'))
            if (sVal <= val) {
              s.classList.remove('text-slate-300')
              s.classList.add('text-amber-500')
            } else {
              s.classList.remove('text-amber-500')
              s.classList.add('text-slate-300')
            }
          })
        })
      })
    }, 50)
  },

  /**
   * 5. Profile Events
   */
  initProfile() {
    const profileForm = document.getElementById('profile-form')

    if (profileForm) {
      profileForm.addEventListener('submit', async (e) => {
        e.preventDefault()
        const fullName = document.getElementById('profile-name').value.trim()
        const userId = router.currentUser.id

        if (!fullName) return

        try {
          await authService.updateProfile(userId, { fullName })
          toast.success('Profile updated successfully!')
          
          // Refresh user session in router
          router.currentUser = await authService.getCurrentUser()
          router.navigate('/customer/profile')
        } catch (error) {
          toast.error('Failed to update profile.')
        }
      })
    }
  },

  /**
   * Shared Cancel Queue Dialog.
   */
  cancelTokenDialog(tokenId) {
    modal.show({
      title: 'Cancel Queue Token',
      bodyHTML: '<p>Are you sure you want to leave this queue? Your token will be permanently cancelled, and you will lose your position.</p>',
      confirmText: 'Leave Queue',
      danger: true,
      onConfirm: async () => {
        try {
          // Update queue status to cancelled
          const { error } = await supabase
            .from('queues')
            .update({ status: 'cancelled' })
            .eq('id', tokenId)

          if (error) throw error

          toast.success('Queue token cancelled.')
          router.navigate('/customer/dashboard')
        } catch (error) {
          toast.error('Failed to cancel token.')
          throw error
        }
      }
    })
  }
}

export default customer
