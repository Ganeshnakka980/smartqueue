import { queueService } from '../services/queue'
import { authService } from '../services/auth'
import { router } from '../router'
import { toast } from '../components/toast'
import { modal } from '../components/modal'
import { sidebar } from '../components/sidebar'
import { skeletons } from '../components/skeletons'
import { supabase } from '../services/supabase'
import Chart from 'chart.js/auto'
import gsap from 'gsap'

export const admin = {
  charts: {},

  async render(params) {
    const hash = window.location.hash || '#/admin/dashboard'
    const activePath = hash.split('?')[0].substring(1)
    const profile = router.currentUser?.profile

    // Clean up any active chart instances to prevent canvas reuse errors
    this.cleanupCharts()

    const contentHTML = await this.getContentHTML(activePath, params)

    return `
      <div class="flex min-h-screen bg-bg-light dark:bg-slate-950 text-slate-800 dark:text-slate-200">
        <!-- Sidebar -->
        ${sidebar.getHTML(activePath, 'admin', profile)}

        <!-- Main Content Area -->
        <div class="flex-grow md:ml-64 min-h-screen flex flex-col pt-16 md:pt-0">
          <main id="admin-main-content" class="flex-grow p-6 lg:p-10">
            ${contentHTML}
          </main>
        </div>
      </div>
    `
  },

  async getContentHTML(path, params) {
    if (path === '/admin/users') {
      return this.renderUsersView()
    } else if (path === '/admin/branches') {
      return this.renderBranchesView()
    } else if (path === '/admin/services') {
      return this.renderServicesView()
    } else if (path === '/admin/counters') {
      return this.renderCountersView()
    } else if (path === '/admin/reports') {
      return this.renderReportsView()
    } else if (path === '/admin/settings') {
      return this.renderSettingsView()
    } else {
      return this.renderOverviewView()
    }
  },

  // ==========================================================
  // VIEW RENDERERS
  // ==========================================================

  /**
   * 1. Overview Dashboard View
   */
  async renderOverviewView() {
    try {
      // Fetch system-wide stats
      const { data: queues, error } = await supabase
        .from('queues')
        .select('status, created_at, services(name)')

      if (error) throw error

      let waiting = 0
      let serving = 0
      let completed = 0
      let skipped = 0

      queues.forEach(q => {
        if (q.status === 'waiting') waiting++
        else if (q.status === 'serving') serving++
        else if (q.status === 'completed') completed++
        else if (q.status === 'skipped') skipped++
      })

      return `
        <div class="max-w-6xl mx-auto">
          <div class="mb-8">
            <h1 class="text-2xl font-black text-slate-900 dark:text-white">Admin Overview</h1>
            <p class="text-sm text-slate-500 dark:text-slate-400">System-wide real-time queue metrics and analytics.</p>
          </div>

          <!-- Stats Grid -->
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div class="glass-card p-6 rounded-2xl border border-slate-200/40 dark:border-slate-800/30">
              <span class="text-xs text-slate-400 font-bold uppercase">Active Waiting</span>
              <div class="text-3xl font-black text-slate-900 dark:text-white mt-1">${waiting}</div>
            </div>
            <div class="glass-card p-6 rounded-2xl border border-slate-200/40 dark:border-slate-800/30">
              <span class="text-xs text-slate-400 font-bold uppercase">Being Served</span>
              <div class="text-3xl font-black text-slate-900 dark:text-white mt-1">${serving}</div>
            </div>
            <div class="glass-card p-6 rounded-2xl border border-slate-200/40 dark:border-slate-800/30">
              <span class="text-xs text-slate-400 font-bold uppercase">Completed Today</span>
              <div class="text-3xl font-black text-slate-900 dark:text-white mt-1">${completed}</div>
            </div>
            <div class="glass-card p-6 rounded-2xl border border-slate-200/40 dark:border-slate-800/30">
              <span class="text-xs text-slate-400 font-bold uppercase">Skipped Today</span>
              <div class="text-3xl font-black text-slate-900 dark:text-white mt-1">${skipped}</div>
            </div>
          </div>

          <!-- Charts Grid -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Traffic Line Chart -->
            <div class="lg:col-span-2 glass-card p-6 rounded-3xl border border-slate-200/40 dark:border-slate-800/30 bg-white/55 dark:bg-slate-900/10">
              <h3 class="font-bold text-slate-800 dark:text-white mb-6 text-sm uppercase tracking-wider">Hourly Traffic Volume</h3>
              <div class="h-80 w-full">
                <canvas id="admin-traffic-chart"></canvas>
              </div>
            </div>

            <!-- Service Doughnut Chart -->
            <div class="glass-card p-6 rounded-3xl border border-slate-200/40 dark:border-slate-800/30 bg-white/55 dark:bg-slate-900/10 flex flex-col justify-between">
              <div>
                <h3 class="font-bold text-slate-800 dark:text-white mb-6 text-sm uppercase tracking-wider">Service Share</h3>
                <div class="h-64 w-full flex items-center justify-center">
                  <canvas id="admin-service-chart"></canvas>
                </div>
              </div>
              <p class="text-[10px] text-slate-400 text-center mt-4">Distribution of generated tokens by service category.</p>
            </div>
          </div>
        </div>
      `
    } catch (e) {
      console.error(e)
      return '<p class="text-center text-danger">Failed to load admin overview.</p>'
    }
  },

  /**
   * 2. User Management View
   */
  async renderUsersView() {
    try {
      const { data: users, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      const rows = users.map((u, i) => `
        <tr class="border-b border-slate-100 dark:border-slate-800/30 hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
          <td class="px-6 py-4 font-bold text-slate-800 dark:text-white">${u.full_name || 'N/A'}</td>
          <td class="px-6 py-4 text-slate-500 dark:text-slate-400">${u.email || 'N/A'}</td>
          <td class="px-6 py-4">
            <span class="inline-block px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/20">
              ${u.role}
            </span>
          </td>
          <td class="px-6 py-4">
            <select class="change-role-select text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-lg outline-none cursor-pointer text-slate-800 dark:text-slate-200" data-id="${u.id}">
              <option value="customer" ${u.role === 'customer' ? 'selected' : ''}>Customer</option>
              <option value="staff" ${u.role === 'staff' ? 'selected' : ''}>Staff</option>
              <option value="admin" ${u.role === 'admin' ? 'selected' : ''}>Admin</option>
            </select>
          </td>
        </tr>
      `).join('')

      return `
        <div class="max-w-5xl mx-auto">
          <div class="mb-8">
            <h1 class="text-2xl font-black text-slate-900 dark:text-white">User & Staff Management</h1>
            <p class="text-sm text-slate-500 dark:text-slate-400">Manage registered accounts and assign roles.</p>
          </div>

          <div class="glass-card rounded-3xl border border-slate-200/40 dark:border-slate-800/30 overflow-hidden shadow-xl bg-white/50 dark:bg-slate-900/20">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-slate-200/50 dark:divide-slate-800/30 text-left text-sm">
                <thead class="bg-slate-55/50 dark:bg-slate-900/60 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs">
                  <tr>
                    <th class="px-6 py-4">Name</th>
                    <th class="px-6 py-4">Email</th>
                    <th class="px-6 py-4">Current Role</th>
                    <th class="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-800/20">
                  ${rows}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `
    } catch (e) {
      console.error(e)
      return '<p class="text-center text-danger">Failed to load users.</p>'
    }
  },

  /**
   * 3. Branch Management View
   */
  async renderBranchesView() {
    try {
      const { data: branches, error } = await supabase
        .from('branches')
        .select('*')
        .order('name', { ascending: true })

      if (error) throw error

      const listHTML = branches.map(b => `
        <div class="glass-card p-6 rounded-2xl border border-slate-200/40 dark:border-slate-800/30 flex items-center justify-between">
          <div>
            <h4 class="font-bold text-slate-800 dark:text-white text-base">${b.name}</h4>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">${b.address}</p>
          </div>
          <span class="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full bg-success/10 text-success border border-success/20">
            ${b.status}
          </span>
        </div>
      `).join('')

      return `
        <div class="max-w-4xl mx-auto">
          <div class="mb-8 flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-black text-slate-900 dark:text-white">Branch Management</h1>
              <p class="text-sm text-slate-500 dark:text-slate-400">Configure corporate locations and branches.</p>
            </div>
            <button id="add-branch-btn" class="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-sm font-bold shadow-md transition-all cursor-pointer">
              Add Branch
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            ${listHTML}
          </div>
        </div>
      `
    } catch (e) {
      console.error(e)
      return '<p class="text-center text-danger">Failed to load branches.</p>'
    }
  },

  /**
   * 4. Service Management View
   */
  async renderServicesView() {
    try {
      const { data: services, error } = await supabase
        .from('services')
        .select('*, branches(name)')
        .order('name', { ascending: true })

      if (error) throw error

      const listHTML = services.map(s => `
        <div class="glass-card p-6 rounded-2xl border border-slate-200/40 dark:border-slate-800/30 flex items-center justify-between">
          <div>
            <div class="flex items-center gap-2">
              <span class="px-2 py-0.5 rounded bg-primary/10 text-primary font-bold text-xs">${s.prefix}</span>
              <h4 class="font-bold text-slate-800 dark:text-white text-base">${s.name}</h4>
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-2">Branch: ${s.branches?.name || 'N/A'} &bull; Avg Service: ${s.avg_service_time} mins</p>
          </div>
          <span class="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full bg-success/10 text-success border border-success/20">
            ${s.status}
          </span>
        </div>
      `).join('')

      return `
        <div class="max-w-4xl mx-auto">
          <div class="mb-8 flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-black text-slate-900 dark:text-white">Service Management</h1>
              <p class="text-sm text-slate-500 dark:text-slate-400">Configure queue services, prefixes, and averages.</p>
            </div>
            <button id="add-service-btn" class="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-sm font-bold shadow-md transition-all cursor-pointer">
              Add Service
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            ${listHTML}
          </div>
        </div>
      `
    } catch (e) {
      console.error(e)
      return '<p class="text-center text-danger">Failed to load services.</p>'
    }
  },

  /**
   * 5. Counter Management View
   */
  async renderCountersView() {
    try {
      const { data: counters, error } = await supabase
        .from('counters')
        .select('*, branches(name), profiles(full_name)')
        .order('name', { ascending: true })

      if (error) throw error

      const listHTML = counters.map(c => {
        const isClosed = c.status === 'closed'
        const badgeColor = isClosed ? 'bg-slate-100 text-slate-500' : 'bg-success/10 text-success border-success/20'
        const staffName = c.profiles?.full_name || 'Unassigned'

        return `
          <div class="glass-card p-6 rounded-2xl border border-slate-200/40 dark:border-slate-800/30 flex items-center justify-between">
            <div>
              <h4 class="font-bold text-slate-800 dark:text-white text-base">${c.name} (Counter #${c.number})</h4>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-2">Branch: ${c.branches?.name || 'N/A'} &bull; Staff: <span class="font-semibold text-slate-650 dark:text-slate-300">${staffName}</span></p>
            </div>
            <span class="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full border ${badgeColor}">
              ${c.status}
            </span>
          </div>
        `
      }).join('')

      return `
        <div class="max-w-4xl mx-auto">
          <div class="mb-8 flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-black text-slate-900 dark:text-white">Counter Management</h1>
              <p class="text-sm text-slate-500 dark:text-slate-400">Configure physical and virtual counters per branch.</p>
            </div>
            <button id="add-counter-btn" class="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-sm font-bold shadow-md transition-all cursor-pointer">
              Add Counter
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            ${listHTML}
          </div>
        </div>
      `
    } catch (e) {
      console.error(e)
      return '<p class="text-center text-danger">Failed to load counters.</p>'
    }
  },

  /**
   * 6. Reports & Data Export View
   */
  async renderReportsView() {
    try {
      const { data: reportData, error } = await supabase
        .from('queues')
        .select('*, branches(name), services(name), profiles(full_name)')
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error

      const rows = reportData.map(r => {
        let statusColor = 'text-slate-500 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
        if (r.status === 'completed') statusColor = 'text-success bg-success/10 border-success/10'
        else if (r.status === 'skipped') statusColor = 'text-warning bg-warning/10 border-warning/10'
        else if (r.status === 'cancelled') statusColor = 'text-danger bg-danger/10 border-danger/10'

        const date = new Date(r.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
        const time = new Date(r.created_at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })

        return `
          <tr class="border-b border-slate-100 dark:border-slate-800/30 text-xs">
            <td class="px-6 py-4 font-bold text-slate-800 dark:text-white">${r.token_number}</td>
            <td class="px-6 py-4 text-slate-500 dark:text-slate-400">${r.branches?.name || 'N/A'}</td>
            <td class="px-6 py-4 text-slate-500 dark:text-slate-400">${r.services?.name || 'N/A'}</td>
            <td class="px-6 py-4 text-slate-800 dark:text-white font-semibold">${r.profiles?.full_name || 'Anonymous'}</td>
            <td class="px-6 py-4">
              <span class="px-2 py-0.5 text-[9px] font-bold rounded-full uppercase border ${statusColor}">
                ${r.status}
              </span>
            </td>
            <td class="px-6 py-4 text-slate-500 dark:text-slate-400">${date} at ${time}</td>
          </tr>
        `
      }).join('')

      return `
        <div class="max-w-5xl mx-auto">
          <div class="mb-8 flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-black text-slate-900 dark:text-white">Reports & Data Export</h1>
              <p class="text-sm text-slate-500 dark:text-slate-400">Export queue histories and audit trails.</p>
            </div>
            <button id="export-csv-btn" class="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-sm font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
              </svg>
              Export CSV
            </button>
          </div>

          <div class="glass-card rounded-3xl border border-slate-200/40 dark:border-slate-800/30 overflow-hidden shadow-xl bg-white/50 dark:bg-slate-900/20">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-slate-200/50 dark:divide-slate-800/30 text-left text-sm">
                <thead class="bg-slate-55/50 dark:bg-slate-900/60 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs">
                  <tr>
                    <th class="px-6 py-4">Token</th>
                    <th class="px-6 py-4">Branch</th>
                    <th class="px-6 py-4">Service</th>
                    <th class="px-6 py-4">Customer</th>
                    <th class="px-6 py-4">Status</th>
                    <th class="px-6 py-4">Created At</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-800/20">
                  ${rows}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `
    } catch (e) {
      console.error(e)
      return '<p class="text-center text-danger">Failed to load reports.</p>'
    }
  },

  /**
   * 7. System Settings View
   */
  async renderSettingsView() {
    return `
      <div class="max-w-2xl mx-auto">
        <div class="mb-8">
          <h1 class="text-2xl font-black text-slate-900 dark:text-white">System Settings</h1>
          <p class="text-sm text-slate-500 dark:text-slate-400">Configure global queue settings and notifications.</p>
        </div>

        <div class="glass-card p-8 rounded-3xl border border-slate-200/40 dark:border-slate-800/30 shadow-xl bg-white/50 dark:bg-slate-900/20 space-y-6">
          <div>
            <h3 class="font-bold text-slate-800 dark:text-white mb-2">Notification Channels</h3>
            <div class="flex items-center gap-2 text-sm text-slate-650 dark:text-slate-400">
              <input type="checkbox" id="sett-push" checked class="w-4 h-4 text-primary focus:ring-primary rounded cursor-pointer">
              <label for="sett-push" class="cursor-pointer">Enable Browser Push Notifications</label>
            </div>
            <div class="flex items-center gap-2 text-sm text-slate-650 dark:text-slate-400 mt-2">
              <input type="checkbox" id="sett-email" checked class="w-4 h-4 text-primary focus:ring-primary rounded cursor-pointer">
              <label for="sett-email" class="cursor-pointer">Enable Email Alerts on Called Tokens</label>
            </div>
          </div>

          <div class="border-t border-slate-200/30 dark:border-slate-800/30 pt-6">
            <h3 class="font-bold text-slate-800 dark:text-white mb-2">PWA Support</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">SmartQueue supports installable Progressive Web Apps. Service worker caching is active.</p>
            <button id="pwa-status-btn" class="px-5 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold transition-all cursor-pointer">
              Check Service Worker Status
            </button>
          </div>
        </div>
      </div>
    `
  },

  // ==========================================================
  // LIFECYCLE AND EVENT BINDINGS
  // ==========================================================

  init() {
    sidebar.init()

    const hash = window.location.hash || '#/admin/dashboard'
    const activePath = hash.split('?')[0].substring(1)

    // Bind events based on sub-path
    if (activePath === '/admin/users') {
      this.initUsers()
    } else if (activePath === '/admin/branches') {
      this.initBranches()
    } else if (activePath === '/admin/services') {
      this.initServices()
    } else if (activePath === '/admin/counters') {
      this.initCounters()
    } else if (activePath === '/admin/reports') {
      this.initReports()
    } else if (activePath === '/admin/settings') {
      this.initSettings()
    } else {
      this.initOverview()
    }
  },

  /**
   * Initialize Overview Charts
   */
  async initOverview() {
    const trafficCtx = document.getElementById('admin-traffic-chart')?.getContext('2d')
    const serviceCtx = document.getElementById('admin-service-chart')?.getContext('2d')

    if (!trafficCtx || !serviceCtx) return

    try {
      // Fetch queue records
      const { data: queues } = await supabase
        .from('queues')
        .select('created_at, services(name)')

      if (!queues) return

      // 1. Compile Traffic Data (Group by Hour)
      const hourlyCounts = Array(12).fill(0)
      const hourLabels = ['8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM']
      
      queues.forEach(q => {
        const hour = new Date(q.created_at).getHours()
        if (hour >= 8 && hour <= 19) {
          hourlyCounts[hour - 8]++
        }
      })

      // 2. Compile Service Data (Group by Service Name)
      const serviceCounts = {}
      queues.forEach(q => {
        const name = q.services?.name || 'Unknown'
        serviceCounts[name] = (serviceCounts[name] || 0) + 1
      })

      // Initialize Traffic Line Chart
      this.charts.traffic = new Chart(trafficCtx, {
        type: 'line',
        data: {
          labels: hourLabels,
          datasets: [{
            label: 'Tokens Generated',
            data: hourlyCounts,
            borderColor: '#2563EB',
            backgroundColor: 'rgba(37, 99, 235, 0.05)',
            fill: true,
            tension: 0.4,
            borderWidth: 3,
            pointBackgroundColor: '#2563EB',
            pointHoverRadius: 7,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: 'rgba(156, 163, 175, 0.1)' }
            },
            x: {
              grid: { display: false }
            }
          }
        }
      })

      // Initialize Service Doughnut Chart
      this.charts.service = new Chart(serviceCtx, {
        type: 'doughnut',
        data: {
          labels: Object.keys(serviceCounts),
          datasets: [{
            data: Object.values(serviceCounts),
            backgroundColor: ['#2563EB', '#14B8A6', '#F59E0B', '#EF4444', '#22C55E', '#8B5CF6'],
            borderWidth: 0,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: { boxWidth: 12, font: { weight: 'bold' } }
            }
          }
        }
      })

    } catch (e) {
      console.error(e)
    }
  },

  /**
   * Initialize User Management Events
   */
  initUsers() {
    const roleSelects = document.querySelectorAll('.change-role-select')

    roleSelects.forEach(select => {
      select.addEventListener('change', async (e) => {
        const userId = select.getAttribute('data-id')
        const newRole = select.value

        try {
          const { error } = await supabase
            .from('profiles')
            .update({ role: newRole })
            .eq('id', userId)

          if (error) throw error

          toast.success(`User role updated to ${newRole}`)
        } catch (err) {
          toast.error('Failed to update user role.')
        }
      })
    })
  },

  /**
   * Initialize Branch Management Events
   */
  initBranches() {
    const addBtn = document.getElementById('add-branch-btn')
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        modal.show({
          title: 'Add New Branch',
          bodyHTML: `
            <div class="space-y-4">
              <div>
                <label for="new-branch-name" class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Branch Name</label>
                <input type="text" id="new-branch-name" required class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-850 dark:text-slate-250 outline-none focus:border-primary">
              </div>
              <div>
                <label for="new-branch-addr" class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Address</label>
                <input type="text" id="new-branch-addr" required class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-850 dark:text-slate-250 outline-none focus:border-primary">
              </div>
            </div>
          `,
          confirmText: 'Create Branch',
          onConfirm: async () => {
            const name = document.getElementById('new-branch-name').value.trim()
            const address = document.getElementById('new-branch-addr').value.trim()

            if (!name || !address) return

            try {
              const { error } = await supabase
                .from('branches')
                .insert({ name, address, status: 'active' })

              if (error) throw error
              toast.success('Branch created successfully!')
              router.navigate('/admin/branches')
            } catch (err) {
              toast.error('Failed to create branch.')
              throw err
            }
          }
        })
      })
    }
  },

  /**
   * Initialize Service Management Events
   */
  initServices() {
    const addBtn = document.getElementById('add-service-btn')
    if (addBtn) {
      addBtn.addEventListener('click', async () => {
        try {
          const branches = await queueService.getBranches()
          const branchOptions = branches.map(b => `<option value="${b.id}">${b.name}</option>`).join('')

          modal.show({
            title: 'Add New Service',
            bodyHTML: `
              <div class="space-y-4">
                <div>
                  <label for="new-serv-branch" class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Branch</label>
                  <select id="new-serv-branch" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-850 dark:text-slate-200 cursor-pointer outline-none focus:border-primary">
                    ${branchOptions}
                  </select>
                </div>
                <div>
                  <label for="new-serv-name" class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Service Name</label>
                  <input type="text" id="new-serv-name" required placeholder="e.g. Account Services" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-850 dark:text-slate-250 outline-none focus:border-primary">
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label for="new-serv-prefix" class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Token Prefix</label>
                    <input type="text" id="new-serv-prefix" required placeholder="e.g. A" maxlength="2" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-850 dark:text-slate-250 outline-none focus:border-primary">
                  </div>
                  <div>
                    <label for="new-serv-time" class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Avg Service Time (min)</label>
                    <input type="number" id="new-serv-time" required value="15" min="1" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-850 dark:text-slate-250 outline-none focus:border-primary">
                  </div>
                </div>
              </div>
            `,
            confirmText: 'Create Service',
            onConfirm: async () => {
              const branchId = document.getElementById('new-serv-branch').value
              const name = document.getElementById('new-serv-name').value.trim()
              const prefix = document.getElementById('new-serv-prefix').value.trim().toUpperCase()
              const avgTime = parseInt(document.getElementById('new-serv-time').value)

              if (!name || !prefix || !avgTime) return

              try {
                const { error } = await supabase
                  .from('services')
                  .insert({ branch_id: branchId, name, prefix, avg_service_time: avgTime, status: 'active' })

                if (error) throw error
                toast.success('Service created successfully!')
                router.navigate('/admin/services')
              } catch (err) {
                toast.error('Failed to create service.')
                throw err
              }
            }
          })
        } catch (e) {
          toast.error('Failed to load branches.')
        }
      })
    }
  },

  /**
   * Initialize Counter Management Events
   */
  initCounters() {
    const addBtn = document.getElementById('add-counter-btn')
    if (addBtn) {
      addBtn.addEventListener('click', async () => {
        try {
          const branches = await queueService.getBranches()
          const branchOptions = branches.map(b => `<option value="${b.id}">${b.name}</option>`).join('')

          modal.show({
            title: 'Add New Counter',
            bodyHTML: `
              <div class="space-y-4">
                <div>
                  <label for="new-count-branch" class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Branch</label>
                  <select id="new-count-branch" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-850 dark:text-slate-200 cursor-pointer outline-none focus:border-primary">
                    ${branchOptions}
                  </select>
                </div>
                <div>
                  <label for="new-count-name" class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Counter Name</label>
                  <input type="text" id="new-count-name" required placeholder="e.g. Counter 3" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-850 dark:text-slate-250 outline-none focus:border-primary">
                </div>
                <div>
                  <label for="new-count-num" class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Counter Number</label>
                  <input type="number" id="new-count-num" required placeholder="e.g. 3" min="1" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-850 dark:text-slate-250 outline-none focus:border-primary">
                </div>
              </div>
            `,
            confirmText: 'Create Counter',
            onConfirm: async () => {
              const branchId = document.getElementById('new-count-branch').value
              const name = document.getElementById('new-count-name').value.trim()
              const number = parseInt(document.getElementById('new-count-num').value)

              if (!name || !number) return

              try {
                const { error } = await supabase
                  .from('counters')
                  .insert({ branch_id: branchId, name, number, status: 'closed' })

                if (error) throw error
                toast.success('Counter created successfully!')
                router.navigate('/admin/counters')
              } catch (err) {
                toast.error('Failed to create counter (number might already exist in this branch).')
                throw err
              }
            }
          })
        } catch (e) {
          toast.error('Failed to load branches.')
        }
      })
    }
  },

  /**
   * Initialize Reports Events & CSV Export
   */
  initReports() {
    const exportBtn = document.getElementById('export-csv-btn')
    
    if (exportBtn) {
      exportBtn.addEventListener('click', async () => {
        exportBtn.disabled = true
        exportBtn.textContent = 'Compiling...'
        
        try {
          const { data: queues, error } = await supabase
            .from('queues')
            .select('*, branches(name), services(name), profiles(full_name)')
            .order('created_at', { ascending: false })

          if (error) throw error

          // Generate CSV content
          let csvContent = 'Token Number,Branch,Service,Customer,Status,Priority,Created At,Called At,Completed At\n'
          
          queues.forEach(q => {
            const customer = q.profiles?.full_name || 'Anonymous'
            const branch = q.branches?.name || 'N/A'
            const service = q.services?.name || 'N/A'
            const called = q.called_at ? new Date(q.called_at).toISOString() : ''
            const completed = q.completed_at ? new Date(q.completed_at).toISOString() : ''
            const created = new Date(q.created_at).toISOString()
            
            csvContent += `"${q.token_number}","${branch}","${service}","${customer}","${q.status}","${q.priority}","${created}","${called}","${completed}"\n`
          })

          // Download File
          const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
          const url = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.setAttribute('href', url)
          link.setAttribute('download', `smartqueue_audit_report_${new Date().toISOString().split('T')[0]}.csv`)
          link.style.visibility = 'hidden'
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)

          toast.success('CSV report exported successfully!')
        } catch (err) {
          toast.error('Failed to export CSV.')
        } finally {
          exportBtn.disabled = false
          exportBtn.innerHTML = `
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
            </svg> Export CSV
          `
        }
      })
    }
  },

  /**
   * Initialize Settings Events
   */
  initSettings() {
    const pwaBtn = document.getElementById('pwa-status-btn')
    
    if (pwaBtn) {
      pwaBtn.addEventListener('click', () => {
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.getRegistrations().then(registrations => {
            if (registrations.length > 0) {
              toast.success('Service Worker is active and caching resources.')
            } else {
              toast.info('No active Service Worker found. PWA will install once hosted.')
            }
          })
        } else {
          toast.warning('Service workers are not supported by this browser.')
        }
      })
    }
  },

  cleanupCharts() {
    Object.keys(this.charts).forEach(key => {
      if (this.charts[key]) {
        this.charts[key].destroy()
        this.charts[key] = null
      }
    })
    this.charts = {}
  }
}

export default admin
