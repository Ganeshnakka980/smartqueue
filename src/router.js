import { authService } from './services/auth'
import { toast } from './components/toast'
import gsap from 'gsap'

// Route definition structure
// Each route has a path, a module loading function, and a metadata object
const routes = {
  '/': {
    title: 'SmartQueue - Smart Digital Queue Management System',
    requiresAuth: false,
    roles: [],
    module: () => import('./pages/landing')
  },
  '/login': {
    title: 'Login - SmartQueue',
    requiresAuth: false,
    guestOnly: true,
    roles: [],
    module: () => import('./pages/auth')
  },
  '/register': {
    title: 'Register - SmartQueue',
    requiresAuth: false,
    guestOnly: true,
    roles: [],
    module: () => import('./pages/auth')
  },
  '/forgot-password': {
    title: 'Forgot Password - SmartQueue',
    requiresAuth: false,
    guestOnly: true,
    roles: [],
    module: () => import('./pages/auth')
  },
  
  // Customer Routes
  '/customer/dashboard': {
    title: 'Customer Dashboard - SmartQueue',
    requiresAuth: true,
    roles: ['customer'],
    module: () => import('./pages/customer')
  },
  '/customer/join-queue': {
    title: 'Join Queue - SmartQueue',
    requiresAuth: true,
    roles: ['customer'],
    module: () => import('./pages/customer')
  },
  '/customer/live-tracking': {
    title: 'Live Queue Tracking - SmartQueue',
    requiresAuth: true,
    roles: ['customer'],
    module: () => import('./pages/customer')
  },
  '/customer/history': {
    title: 'Queue History - SmartQueue',
    requiresAuth: true,
    roles: ['customer'],
    module: () => import('./pages/customer')
  },
  '/customer/profile': {
    title: 'My Profile - SmartQueue',
    requiresAuth: true,
    roles: ['customer'],
    module: () => import('./pages/customer')
  },

  // Staff Routes
  '/staff/dashboard': {
    title: 'Staff Dashboard - SmartQueue',
    requiresAuth: true,
    roles: ['staff'],
    module: () => import('./pages/staff')
  },
  '/staff/stats': {
    title: 'Staff Statistics - SmartQueue',
    requiresAuth: true,
    roles: ['staff'],
    module: () => import('./pages/staff')
  },

  // Admin Routes
  '/admin/dashboard': {
    title: 'Admin Dashboard - SmartQueue',
    requiresAuth: true,
    roles: ['admin'],
    module: () => import('./pages/admin')
  },
  '/admin/users': {
    title: 'User Management - SmartQueue',
    requiresAuth: true,
    roles: ['admin'],
    module: () => import('./pages/admin')
  },
  '/admin/services': {
    title: 'Service Management - SmartQueue',
    requiresAuth: true,
    roles: ['admin'],
    module: () => import('./pages/admin')
  },
  '/admin/branches': {
    title: 'Branch Management - SmartQueue',
    requiresAuth: true,
    roles: ['admin'],
    module: () => import('./pages/admin')
  },
  '/admin/counters': {
    title: 'Counter Management - SmartQueue',
    requiresAuth: true,
    roles: ['admin'],
    module: () => import('./pages/admin')
  },
  '/admin/reports': {
    title: 'Reports & Analytics - SmartQueue',
    requiresAuth: true,
    roles: ['admin'],
    module: () => import('./pages/admin')
  },
  '/admin/settings': {
    title: 'System Settings - SmartQueue',
    requiresAuth: true,
    roles: ['admin'],
    module: () => import('./pages/admin')
  }
}

export const router = {
  appElement: null,
  currentUser: null,

  init(appElementId) {
    this.appElement = document.getElementById(appElementId)
    if (!this.appElement) {
      console.error(`App element with id "${appElementId}" not found.`)
      return
    }

    // Listen to hash changes and initial page load
    window.addEventListener('hashchange', () => this.handleRouting())
    window.addEventListener('load', () => this.handleRouting())
  },

  /**
   * Parse the hash to extract the path and query parameters.
   * Example: "#/customer/live-tracking?id=123" 
   * Returns: { path: "/customer/live-tracking", params: { id: "123" } }
   */
  parseHash() {
    const hash = window.location.hash || '#/'
    
    // Split path and query string
    const queryIndex = hash.indexOf('?')
    let path = queryIndex !== -1 ? hash.substring(1, queryIndex) : hash.substring(1)
    
    // Normalize path (ensure leading slash, remove trailing slash)
    if (!path.startsWith('/')) path = '/' + path
    if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1)

    const params = {}
    if (queryIndex !== -1) {
      const queryString = hash.substring(queryIndex + 1)
      const urlParams = new URLSearchParams(queryString)
      for (const [key, value] of urlParams.entries()) {
        params[key] = value
      }
    }

    return { path, params }
  },

  /**
   * Navigate to a path programmatically.
   */
  navigate(path, params = {}) {
    let hash = `#${path}`
    const query = new URLSearchParams(params).toString()
    if (query) {
      hash += `?${query}`
    }
    window.location.hash = hash
  },

  /**
   * Core routing handler with session check and route guards.
   */
  async handleRouting() {
    const { path, params } = this.parseHash()
    
    // 1. Fetch current user session & profile (cached or fresh)
    this.currentUser = await authService.getCurrentUser()
    const userRole = this.currentUser?.profile?.role || null

    // 2. Find matching route, fallback to landing (/)
    let route = routes[path]
    if (!route) {
      console.warn(`Route not found: ${path}. Redirecting to landing page.`)
      this.navigate('/')
      return
    }

    // 3. Route Guard: Authentication Check
    if (route.requiresAuth && !this.currentUser) {
      toast.warning('Authentication required. Please log in.')
      this.navigate('/login')
      return
    }

    // 4. Route Guard: Guest Only Check (Login/Register/Forgot-password)
    if (route.guestOnly && this.currentUser) {
      // Redirect logged-in users to their respective dashboards
      this.redirectToDashboard(userRole)
      return
    }

    // 5. Route Guard: Role Authorization Check
    if (route.requiresAuth && route.roles.length > 0 && !route.roles.includes(userRole)) {
      toast.error('Unauthorized access. Redirecting to your dashboard.')
      this.redirectToDashboard(userRole)
      return
    }

    // Update Page Title
    document.title = route.title

    // 6. Render page with GSAP animation
    try {
      // Show a global loading indicator
      this.showLoader()

      // Call cleanup on current page if it exists
      if (this.currentPage && typeof this.currentPage.cleanupSubscription === 'function') {
        try {
          this.currentPage.cleanupSubscription()
        } catch (e) {
          console.warn('Failed to clean up previous page subscriptions:', e)
        }
      }

      // Dynamically load page module
      const pageModule = await route.module()
      
      // Get the page object (default export or module itself)
      const page = pageModule.default || pageModule
      
      if (typeof page.render !== 'function') {
        throw new TypeError(`Page module at ${path} does not export a render function.`)
      }

      // Store current page reference
      this.currentPage = page

      // Call render function to get HTML string
      const pageHTML = await page.render(params)
      
      // Animate transition out of old content, then in with new content
      this.animateTransition(pageHTML, () => {
        // Execute page initialization (event listeners, animations)
        if (page.init) {
          page.init(params)
        }
      })
    } catch (error) {
      console.error('Failed to render page:', error)
      toast.error('An error occurred while loading the page.')
      this.hideLoader()
      
      // Render a friendly error screen instead of leaving the app blank or crashing
      if (this.appElement) {
        this.appElement.innerHTML = `
          <div class="min-h-[80vh] flex items-center justify-center p-6">
            <div class="glass-card p-8 rounded-3xl border border-danger/20 text-center max-w-md w-full shadow-2xl">
              <div class="w-16 h-16 rounded-full bg-danger/10 text-danger flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
              </div>
              <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-2">Failed to Load Page</h3>
              <p class="text-sm text-slate-500 dark:text-slate-450 mb-6">We encountered an issue displaying this view. This might be due to a connection problem or a configuration error.</p>
              <div class="flex gap-3 justify-center">
                <a href="#/" class="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-sm font-bold shadow-sm hover:shadow-primary/25 transition-all cursor-pointer">
                  Go Home
                </a>
                <button onclick="window.location.reload()" class="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850 text-sm font-bold transition-all cursor-pointer">
                  Reload Page
                </button>
              </div>
            </div>
          </div>
        `
      }
    }
  },

  /**
   * Redirect user to their role-based dashboard.
   */
  redirectToDashboard(role) {
    if (role === 'admin') {
      this.navigate('/admin/dashboard')
    } else if (role === 'staff') {
      this.navigate('/staff/dashboard')
    } else {
      this.navigate('/customer/dashboard')
    }
  },

  /**
   * Animate page transitions using GSAP.
   */
  animateTransition(newHTML, onMountCallback) {
    const app = this.appElement
    
    // If app is empty, just insert and fade in
    if (!app.innerHTML.trim()) {
      app.innerHTML = newHTML
      this.hideLoader()
      if (onMountCallback) onMountCallback()
      gsap.fromTo(app.children, 
        { opacity: 0, y: 15 }, 
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out', stagger: 0.05 }
      )
      return
    }

    // Else animate out current content, swap, and animate in
    gsap.to(app.children, {
      opacity: 0,
      y: -15,
      duration: 0.25,
      ease: 'power2.in',
      stagger: 0.02,
      onComplete: () => {
        app.innerHTML = newHTML
        this.hideLoader()
        
        // Scroll to top on page change
        window.scrollTo({ top: 0, behavior: 'instant' })

        // Initialize dynamic scripts/listeners
        if (onMountCallback) onMountCallback()

        // Trigger entering animation
        gsap.fromTo(app.children,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out', stagger: 0.05 }
        )
      }
    })
  },


  showLoader() {
    let loader = document.getElementById('global-page-loader')
    if (!loader) {
      loader = document.createElement('div')
      loader.id = 'global-page-loader'
      loader.className = 'fixed top-0 left-0 w-full h-1 bg-primary z-50 transition-all duration-300 pointer-events-none'
      loader.style.width = '0%'
      document.body.appendChild(loader)
    }
    loader.style.width = '30%'
    loader.style.opacity = '1'
  },

  hideLoader() {
    const loader = document.getElementById('global-page-loader')
    if (loader) {
      loader.style.width = '100%'
      setTimeout(() => {
        loader.style.opacity = '0'
        setTimeout(() => {
          loader.style.width = '0%'
        }, 300)
      }, 200)
    }
  }
}

export default router
