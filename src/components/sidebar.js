import { authService } from '../services/auth'
import { router } from '../router'
import { modal } from './modal'
import { toast } from './toast'

export const sidebar = {
  /**
   * Get the HTML structure for the sidebar based on user role and active path.
   */
  getHTML(activePath, role, profile) {
    const userName = profile?.full_name || 'User'
    const userEmail = profile?.email || ''
    const userRoleText = role.charAt(0).toUpperCase() + role.slice(1)
    
    // Generate role-specific navigation links
    let navLinks = []
    
    if (role === 'customer') {
      navLinks = [
        { path: '/customer/dashboard', label: 'Dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z' },
        { path: '/customer/join-queue', label: 'Join Queue', icon: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z' },
        { path: '/customer/history', label: 'Queue History', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
        { path: '/customer/profile', label: 'My Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' }
      ]
    } else if (role === 'staff') {
      navLinks = [
        { path: '/staff/dashboard', label: 'Queue Board', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
        { path: '/staff/stats', label: 'Daily Stats', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2h-2a2 2 0 00-2 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' }
      ]
    } else if (role === 'admin') {
      navLinks = [
        { path: '/admin/dashboard', label: 'Overview', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
        { path: '/admin/users', label: 'User & Staff', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
        { path: '/admin/branches', label: 'Branches', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
        { path: '/admin/services', label: 'Services', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16' },
        { path: '/admin/counters', label: 'Counters', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
        { path: '/admin/reports', label: 'Reports', icon: 'M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
        { path: '/admin/settings', label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM12 15a3 3 0 100-6 3 3 0 000 6z' }
      ]
    }

    const navItemsHTML = navLinks.map(link => {
      const isActive = activePath === link.path
      const activeClass = isActive 
        ? 'bg-primary text-white shadow-md shadow-primary/10' 
        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
      
      return `
        <a href="#${link.path}" class="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${activeClass}">
          <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${link.icon}"></path>
          </svg>
          <span class="sidebar-label transition-opacity duration-200">${link.label}</span>
        </a>
      `
    }).join('')

    return `
      <!-- Mobile Overlay -->
      <div id="sidebar-overlay" class="fixed inset-0 bg-slate-950/20 backdrop-blur-sm z-40 hidden md:hidden"></div>

      <!-- Sidebar Container -->
      <aside id="sidebar" class="fixed top-0 left-0 bottom-0 w-64 glass-card border-r border-slate-200/50 dark:border-slate-800/40 z-45 transform -translate-x-full md:translate-x-0 transition-transform duration-300 ease-out flex flex-col justify-between">
        <div>
          <!-- Logo Section -->
          <div class="p-6 border-b border-slate-200/30 dark:border-slate-800/30 flex items-center justify-between">
            <a href="#/" class="flex items-center gap-2">
              <span class="p-1.5 rounded-lg bg-primary text-white shadow-md shadow-primary/20">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </span>
              <span class="text-xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">SmartQueue</span>
            </a>
            <button id="close-sidebar" class="md:hidden text-slate-500 hover:text-slate-800 dark:hover:text-white">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <!-- Nav Links -->
          <nav class="p-4 flex flex-col gap-1">
            ${navItemsHTML}
          </nav>
        </div>

        <!-- User Info & Logout -->
        <div class="p-4 border-t border-slate-200/30 dark:border-slate-800/30 bg-slate-50/50 dark:bg-slate-900/10">
          <div class="flex items-center gap-3 mb-4 px-2">
            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold shadow-sm">
              ${userName.substring(0, 2).toUpperCase()}
            </div>
            <div class="flex-grow min-w-0">
              <h4 class="text-sm font-bold text-slate-800 dark:text-white truncate">${userName}</h4>
              <p class="text-xs text-slate-500 dark:text-slate-400 truncate mb-0.5">${userEmail}</p>
              <span class="inline-block px-2 py-0.5 text-[10px] font-bold rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/20">${userRoleText}</span>
            </div>
          </div>
          <button id="sidebar-logout" class="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border border-danger/20 text-danger hover:bg-danger hover:text-white dark:hover:text-white shadow-sm hover:shadow-danger/10 transition-all duration-200 cursor-pointer">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
            Sign Out
          </button>
        </div>
      </aside>

      <!-- Mobile Top Navbar -->
      <header class="md:hidden fixed top-0 left-0 right-0 h-16 glass-nav z-30 px-4 flex items-center justify-between">
        <button id="open-sidebar" class="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
        <div class="flex items-center gap-2">
          <span class="p-1 rounded bg-primary text-white">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </span>
          <span class="text-lg font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">SmartQueue</span>
        </div>
        <div class="w-10"></div> <!-- spacer to center logo -->
      </header>
    `
  },

  /**
   * Initialize the event listeners for mobile sidebar toggling and sign out.
   */
  init() {
    const sidebarEl = document.getElementById('sidebar')
    const overlayEl = document.getElementById('sidebar-overlay')
    const openBtn = document.getElementById('open-sidebar')
    const closeBtn = document.getElementById('close-sidebar')
    const logoutBtn = document.getElementById('sidebar-logout')

    if (openBtn && sidebarEl && overlayEl) {
      const openSidebar = () => {
        sidebarEl.classList.remove('-translate-x-full')
        overlayEl.classList.remove('hidden')
      }

      const closeSidebar = () => {
        sidebarEl.classList.add('-translate-x-full')
        overlayEl.classList.add('hidden')
      }

      openBtn.addEventListener('click', openSidebar)
      if (closeBtn) closeBtn.addEventListener('click', closeSidebar)
      overlayEl.addEventListener('click', closeSidebar)

      // Close sidebar when clicking links on mobile
      const links = sidebarEl.querySelectorAll('nav a')
      links.forEach(link => {
        link.addEventListener('click', closeSidebar)
      })
    }

    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        modal.show({
          title: 'Confirm Sign Out',
          bodyHTML: '<p>Are you sure you want to sign out of your account?</p>',
          confirmText: 'Sign Out',
          danger: true,
          onConfirm: async () => {
            try {
              await authService.signOut()
              toast.success('Signed out successfully.')
              router.navigate('/login')
            } catch (error) {
              toast.error(error.message || 'Failed to sign out.')
            }
          }
        })
      })
    }
  }
}

export default sidebar
