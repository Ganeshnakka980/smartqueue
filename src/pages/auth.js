import { authService } from '../services/auth'
import { router } from '../router'
import { toast } from '../components/toast'
import gsap from 'gsap'

export const auth = {
  /**
   * Determine which view to render based on the current hash path.
   */
  async render() {
    const hash = window.location.hash || '#/login'
    
    if (hash.includes('/register')) {
      return this.renderRegisterForm()
    } else if (hash.includes('/forgot-password')) {
      return this.renderForgotPasswordForm()
    } else {
      return this.renderLoginForm()
    }
  },

  /**
   * Render the Login Form HTML.
   */
  renderLoginForm() {
    return `
      <div class="min-h-screen bg-bg-light dark:bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
        <!-- Background decorative elements -->
        <div class="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-[100px] -mr-20 -mt-20"></div>
        <div class="absolute bottom-0 left-0 w-80 h-80 bg-accent/10 rounded-full blur-[100px] -ml-20 -mb-20"></div>

        <div class="auth-card w-full max-w-md glass-card p-8 rounded-3xl shadow-2xl border border-white/20 dark:border-white/5 relative z-10">
          <div class="text-center mb-8">
            <a href="#/" class="inline-flex items-center gap-2 mb-4">
              <span class="p-1.5 rounded-lg bg-primary text-white">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </span>
              <span class="text-lg font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">SmartQueue</span>
            </a>
            <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-2">Welcome Back</h2>
            <p class="text-sm text-slate-500 dark:text-slate-450">Sign in to manage your digital tokens.</p>
          </div>

          <form id="login-form" class="space-y-5">
            <div>
              <label for="login-email" class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Email Address</label>
              <input type="email" id="login-email" required class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-slate-800 dark:text-slate-200" placeholder="name@example.com">
            </div>
            
            <div>
              <div class="flex justify-between items-center mb-2">
                <label for="login-password" class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Password</label>
                <a href="#/forgot-password" class="text-xs font-bold text-primary hover:underline">Forgot password?</a>
              </div>
              <input type="password" id="login-password" required class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-slate-800 dark:text-slate-200" placeholder="••••••••">
            </div>

            <button type="submit" id="login-submit" class="w-full py-3.5 px-4 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-base shadow-lg hover:shadow-primary/25 focus:ring-4 focus:ring-primary/20 transition-all flex items-center justify-center gap-2 cursor-pointer">
              Sign In
            </button>
          </form>

          <div class="text-center mt-6 pt-6 border-t border-slate-200/40 dark:border-slate-800/30 text-sm text-slate-500 dark:text-slate-400">
            Don't have an account? <a href="#/register" class="font-bold text-primary hover:underline">Create one</a>
          </div>
        </div>
      </div>
    `
  },

  /**
   * Render the Register Form HTML.
   */
  renderRegisterForm() {
    return `
      <div class="min-h-screen bg-bg-light dark:bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
        <!-- Background decorative elements -->
        <div class="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-[100px] -mr-20 -mt-20"></div>
        <div class="absolute bottom-0 left-0 w-80 h-80 bg-accent/10 rounded-full blur-[100px] -ml-20 -mb-20"></div>

        <div class="auth-card w-full max-w-md glass-card p-8 rounded-3xl shadow-2xl border border-white/20 dark:border-white/5 relative z-10">
          <div class="text-center mb-6">
            <a href="#/" class="inline-flex items-center gap-2 mb-3">
              <span class="p-1.5 rounded-lg bg-primary text-white">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </span>
              <span class="text-lg font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">SmartQueue</span>
            </a>
            <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-1">Get Started</h2>
            <p class="text-sm text-slate-500 dark:text-slate-450">Create your digital queuing account.</p>
          </div>

          <form id="register-form" class="space-y-4">
            <div>
              <label for="reg-name" class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">Full Name</label>
              <input type="text" id="reg-name" required class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-slate-800 dark:text-slate-200" placeholder="John Doe">
            </div>

            <div>
              <label for="reg-email" class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">Email Address</label>
              <input type="email" id="reg-email" required class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-slate-800 dark:text-slate-200" placeholder="name@example.com">
            </div>
            
            <div>
              <label for="reg-password" class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">Password</label>
              <input type="password" id="reg-password" required class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-slate-800 dark:text-slate-200" placeholder="••••••••">
            </div>

            <!-- Demo Helper Role Dropdown -->
            <div>
              <label for="reg-role" class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">Register As (For Testing)</label>
              <select id="reg-role" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-slate-850 dark:text-slate-200 cursor-pointer">
                <option value="customer">Customer (Join Queues)</option>
                <option value="staff">Staff (Serve Customers)</option>
                <option value="admin">Admin (Manage & Analytics)</option>
              </select>
            </div>

            <button type="submit" id="reg-submit" class="w-full py-3 px-4 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-base shadow-lg hover:shadow-primary/25 focus:ring-4 focus:ring-primary/20 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2">
              Create Account
            </button>
          </form>

          <div class="text-center mt-5 pt-5 border-t border-slate-200/40 dark:border-slate-800/30 text-sm text-slate-500 dark:text-slate-400">
            Already have an account? <a href="#/login" class="font-bold text-primary hover:underline">Sign In</a>
          </div>
        </div>
      </div>
    `
  },

  /**
   * Render the Forgot Password Form HTML.
   */
  renderForgotPasswordForm() {
    return `
      <div class="min-h-screen bg-bg-light dark:bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
        <!-- Background decorative elements -->
        <div class="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-[100px] -mr-20 -mt-20"></div>
        <div class="absolute bottom-0 left-0 w-80 h-80 bg-accent/10 rounded-full blur-[100px] -ml-20 -mb-20"></div>

        <div class="auth-card w-full max-w-md glass-card p-8 rounded-3xl shadow-2xl border border-white/20 dark:border-white/5 relative z-10">
          <div class="text-center mb-8">
            <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-2">Reset Password</h2>
            <p class="text-sm text-slate-500 dark:text-slate-450">Enter your email and we'll send you a link to reset your password.</p>
          </div>

          <form id="forgot-form" class="space-y-5">
            <div>
              <label for="forgot-email" class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Email Address</label>
              <input type="email" id="forgot-email" required class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-slate-800 dark:text-slate-200" placeholder="name@example.com">
            </div>

            <button type="submit" id="forgot-submit" class="w-full py-3.5 px-4 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-base shadow-lg hover:shadow-primary/25 focus:ring-4 focus:ring-primary/20 transition-all flex items-center justify-center gap-2 cursor-pointer">
              Send Reset Link
            </button>
          </form>

          <div class="text-center mt-6 pt-6 border-t border-slate-200/40 dark:border-slate-800/30 text-sm text-slate-500 dark:text-slate-400">
            Back to <a href="#/login" class="font-bold text-primary hover:underline">Sign In</a>
          </div>
        </div>
      </div>
    `
  },

  /**
   * Bind event listeners and trigger entry GSAP animations.
   */
  init() {
    // Animate Auth Card
    gsap.from('.auth-card', {
      scale: 0.95,
      opacity: 0,
      duration: 0.5,
      ease: 'back.out(1.2)'
    })

    const loginForm = document.getElementById('login-form')
    const registerForm = document.getElementById('register-form')
    const forgotForm = document.getElementById('forgot-form')

    // Bind Login Submission
    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault()
        const email = document.getElementById('login-email').value.trim()
        const password = document.getElementById('login-password').value
        const submitBtn = document.getElementById('login-submit')

        this.setLoading(submitBtn, true)
        
        try {
          const data = await authService.signIn(email, password)
          toast.success('Signed in successfully!')
          
          // Fetch role to redirect correctly
          const profile = await authService.getUserProfile(data.user.id)
          router.redirectToDashboard(profile?.role)
        } catch (error) {
          toast.error(error.message || 'Invalid email or password.')
          this.setLoading(submitBtn, false, 'Sign In')
        }
      })
    }

    // Bind Register Submission
    if (registerForm) {
      registerForm.addEventListener('submit', async (e) => {
        e.preventDefault()
        const fullName = document.getElementById('reg-name').value.trim()
        const email = document.getElementById('reg-email').value.trim()
        const password = document.getElementById('reg-password').value
        const role = document.getElementById('reg-role').value
        const submitBtn = document.getElementById('reg-submit')

        if (password.length < 6) {
          toast.warning('Password must be at least 6 characters.')
          return
        }

        this.setLoading(submitBtn, true)

        try {
          await authService.signUp(email, password, fullName, role)
          
          // In Supabase, if email confirmation is on, they need to verify.
          // If off, they are auto-logged in. Let's handle both.
          const sessionUser = await authService.getSessionUser()
          if (sessionUser) {
            toast.success('Account created successfully!')
            router.redirectToDashboard(role)
          } else {
            toast.success('Registration successful! Please check your email to verify your account.')
            router.navigate('/login')
          }
        } catch (error) {
          toast.error(error.message || 'Failed to create account.')
          this.setLoading(submitBtn, false, 'Create Account')
        }
      })
    }

    // Bind Forgot Password Submission
    if (forgotForm) {
      forgotForm.addEventListener('submit', async (e) => {
        e.preventDefault()
        const email = document.getElementById('forgot-email').value.trim()
        const submitBtn = document.getElementById('forgot-submit')

        this.setLoading(submitBtn, true)

        try {
          await authService.resetPassword(email)
          toast.success('Password reset link sent! Check your inbox.')
          router.navigate('/login')
        } catch (error) {
          toast.error(error.message || 'Failed to send reset link.')
          this.setLoading(submitBtn, false, 'Send Reset Link')
        }
      })
    }
  },

  setLoading(buttonEl, isLoading, originalText = '') {
    if (!buttonEl) return
    
    if (isLoading) {
      buttonEl.disabled = true
      buttonEl.innerHTML = `
        <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white inline-block" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg> Loading...
      `
    } else {
      buttonEl.disabled = false
      buttonEl.textContent = originalText
    }
  }
}

export default auth
