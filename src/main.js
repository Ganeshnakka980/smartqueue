import './style.css'
import { router } from './router'

// ==========================================================
// THEME MANAGER (LIGHT / DARK MODE)
// ==========================================================
const themeManager = {
  theme: 'light',

  init() {
    // Check local storage or system preference
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      this.theme = savedTheme
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.theme = 'dark'
    }

    this.applyTheme()
    this.injectToggleBtn()
  },

  applyTheme() {
    if (this.theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('theme', this.theme)
  },

  toggle() {
    this.theme = this.theme === 'light' ? 'dark' : 'light'
    this.applyTheme()
    this.updateToggleIcon()
  },

  injectToggleBtn() {
    // Check if button already exists
    if (document.getElementById('theme-toggle-btn')) return

    const btn = document.createElement('button')
    btn.id = 'theme-toggle-btn'
    btn.className = 'fixed bottom-4 left-4 z-50 w-10 h-10 rounded-full glass-card border border-slate-200/50 dark:border-slate-800/40 shadow-lg flex items-center justify-center text-slate-700 dark:text-slate-200 hover:scale-105 active:scale-95 transition-all cursor-pointer'
    btn.title = 'Toggle Theme'
    
    document.body.appendChild(btn)
    
    this.updateToggleIcon()

    btn.addEventListener('click', () => this.toggle())
  },

  updateToggleIcon() {
    const btn = document.getElementById('theme-toggle-btn')
    if (!btn) return

    const sunIcon = `
      <svg class="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707m12.728 12.728A9 9 0 115.636 5.636m12.728 12.728L12 12"></path>
      </svg>
    `
    const moonIcon = `
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
      </svg>
    `

    btn.innerHTML = this.theme === 'dark' ? sunIcon : moonIcon
  }
}

// ==========================================================
// PWA SERVICE WORKER REGISTRATION
// ==========================================================
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('Service Worker registered successfully with scope: ', reg.scope)
        })
        .catch((err) => {
          console.warn('Service Worker registration failed: ', err)
        })
    })
  }
}

// ==========================================================
// APP INITIALIZATION
// ==========================================================
themeManager.init()
registerServiceWorker()

// Initialize SPA router
router.init('app')
