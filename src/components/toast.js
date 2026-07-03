import gsap from 'gsap'

class ToastManager {
  constructor() {
    this.container = null
    this.createContainer()
  }

  createContainer() {
    if (this.container) return
    this.container = document.createElement('div')
    this.container.id = 'toast-container'
    this.container.className = 'fixed bottom-4 right-4 z-50 flex flex-col gap-3 max-w-md w-full px-4 sm:px-0 pointer-events-none'
    document.body.appendChild(this.container)
  }

  show(message, type = 'info', duration = 4000) {
    this.createContainer()

    // Create toast element
    const toastItem = document.createElement('div')
    toastItem.className = 'toast-item glass-card flex items-start gap-3 p-4 rounded-xl shadow-lg border pointer-events-auto transition-all duration-300 translate-x-12 opacity-0'
    
    // Set colors and icons based on type
    let borderClass = 'border-blue-500/30'
    let iconColor = 'text-blue-500'
    let iconSvg = `
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>`

    if (type === 'success') {
      borderClass = 'border-success/30'
      iconColor = 'text-success'
      iconSvg = `
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>`
    } else if (type === 'error') {
      borderClass = 'border-danger/30'
      iconColor = 'text-danger'
      iconSvg = `
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>`
    } else if (type === 'warning') {
      borderClass = 'border-warning/30'
      iconColor = 'text-warning'
      iconSvg = `
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
        </svg>`
    }

    toastItem.className += ` ${borderClass}`

    toastItem.innerHTML = `
      <div class="flex-shrink-0 ${iconColor}">
        ${iconSvg}
      </div>
      <div class="flex-grow text-sm font-medium text-slate-800 dark:text-slate-200">
        ${message}
      </div>
      <button class="toast-close text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors flex-shrink-0">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    `

    // Append to container
    this.container.appendChild(toastItem)

    // Animate In using GSAP
    gsap.to(toastItem, {
      translateX: 0,
      opacity: 1,
      duration: 0.35,
      ease: 'back.out(1.7)',
    })

    // Setup auto-dismissal
    let autoDismissTimer = setTimeout(() => {
      this.dismiss(toastItem)
    }, duration)

    // Close button click listener
    toastItem.querySelector('.toast-close').addEventListener('click', () => {
      clearTimeout(autoDismissTimer)
      this.dismiss(toastItem)
    })
  }

  dismiss(toastItem) {
    gsap.to(toastItem, {
      translateX: 40,
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        toastItem.remove()
      },
    })
  }

  success(message, duration) {
    this.show(message, 'success', duration)
  }

  error(message, duration) {
    this.show(message, 'error', duration)
  }

  warning(message, duration) {
    this.show(message, 'warning', duration)
  }

  info(message, duration) {
    this.show(message, 'info', duration)
  }
}

export const toast = new ToastManager()
export default toast
