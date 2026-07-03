import gsap from 'gsap'

class ModalManager {
  constructor() {
    this.modalEl = null
  }

  show({
    title = 'Confirm Action',
    bodyHTML = '',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm = () => {},
    onCancel = () => {},
    danger = false,
  }) {
    // Remove existing modal if any
    this.hide()

    // Create modal elements
    this.modalEl = document.createElement('div')
    this.modalEl.id = 'dynamic-modal'
    this.modalEl.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm opacity-0'

    const confirmBtnClass = danger
      ? 'bg-danger hover:bg-danger/90 text-white focus:ring-danger/20'
      : 'bg-primary hover:bg-primary/90 text-white focus:ring-primary/20'

    this.modalEl.innerHTML = `
      <div class="modal-content glass-card w-full max-w-md p-6 rounded-2xl shadow-2xl border border-white/20 dark:border-white/5 transform scale-90 opacity-0">
        <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
          <h3 class="text-lg font-bold text-slate-900 dark:text-white">${title}</h3>
          <button class="modal-close text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div class="modal-body text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
          ${bodyHTML}
        </div>
        <div class="flex items-center justify-end gap-3">
          <button class="modal-cancel px-4 py-2 text-sm font-semibold rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            ${cancelText}
          </button>
          <button class="modal-confirm px-4 py-2 text-sm font-semibold rounded-xl shadow-sm transition-all focus:ring-4 ${confirmBtnClass}">
            ${confirmText}
          </button>
        </div>
      </div>
    `

    document.body.appendChild(this.modalEl)
    document.body.classList.add('overflow-hidden') // Prevent background scrolling

    const contentEl = this.modalEl.querySelector('.modal-content')

    // Animate Modal In
    gsap.to(this.modalEl, {
      opacity: 1,
      duration: 0.25,
      ease: 'power2.out',
    })

    gsap.to(contentEl, {
      scale: 1,
      opacity: 1,
      duration: 0.35,
      ease: 'back.out(1.5)',
    })

    // Event listeners
    const closeBtn = this.modalEl.querySelector('.modal-close')
    const cancelBtn = this.modalEl.querySelector('.modal-cancel')
    const confirmBtn = this.modalEl.querySelector('.modal-confirm')

    const closeHandler = () => {
      onCancel()
      this.hide()
    }

    closeBtn.addEventListener('click', closeHandler)
    cancelBtn.addEventListener('click', closeHandler)

    // Click outside to close
    this.modalEl.addEventListener('click', (e) => {
      if (e.target === this.modalEl) {
        closeHandler()
      }
    })

    confirmBtn.addEventListener('click', async () => {
      confirmBtn.disabled = true
      confirmBtn.innerHTML = `
        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg> Processing...
      `
      try {
        await onConfirm()
        this.hide()
      } catch (error) {
        console.error('Error in modal confirm action:', error)
        confirmBtn.disabled = false
        confirmBtn.textContent = confirmText
      }
    })
  }

  hide() {
    const modal = document.getElementById('dynamic-modal')
    if (!modal) return

    const contentEl = modal.querySelector('.modal-content')

    gsap.to(contentEl, {
      scale: 0.9,
      opacity: 0,
      duration: 0.2,
      ease: 'power2.in',
    })

    gsap.to(modal, {
      opacity: 0,
      duration: 0.2,
      ease: 'power2.in',
      onComplete: () => {
        modal.remove()
        document.body.classList.remove('overflow-hidden')
        this.modalEl = null
      },
    })
  }
}

export const modal = new ModalManager()
export default modal
