import gsap from 'gsap'
import { router } from '../router'

export const landing = {
  async render() {
    // Check if user is logged in to dynamically adjust CTA buttons
    const user = router.currentUser
    const ctaText = user ? 'Go to Dashboard' : 'Get Started Free'
    const ctaHash = user 
      ? (user.profile?.role === 'admin' ? '#/admin/dashboard' : user.profile?.role === 'staff' ? '#/staff/dashboard' : '#/customer/dashboard') 
      : '#/login'

    return `
      <div class="min-h-screen bg-bg-light dark:bg-slate-950 text-slate-800 dark:text-slate-200 flex flex-col">
        <!-- Navigation -->
        <header class="fixed top-0 left-0 right-0 h-20 glass-nav z-50 px-6 lg:px-12 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="p-2 rounded-xl bg-primary text-white shadow-lg shadow-primary/30">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </span>
            <span class="text-2xl font-black bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">SmartQueue</span>
          </div>

          <nav class="hidden md:flex items-center gap-8">
            <a href="#features" class="text-sm font-semibold hover:text-primary transition-colors">Features</a>
            <a href="#how-it-works" class="text-sm font-semibold hover:text-primary transition-colors">How It Works</a>
            <a href="#pricing" class="text-sm font-semibold hover:text-primary transition-colors">Pricing</a>
          </nav>

          <div class="flex items-center gap-4">
            ${user ? `
              <a href="${ctaHash}" class="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-sm shadow-md hover:shadow-primary/20 transition-all cursor-pointer">
                Dashboard
              </a>
            ` : `
              <a href="#/login" class="text-sm font-bold hover:text-primary transition-colors px-4 py-2">Sign In</a>
              <a href="#/register" class="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-sm shadow-md hover:shadow-primary/20 transition-all cursor-pointer">
                Get Started
              </a>
            `}
          </div>
        </header>

        <!-- Hero Section -->
        <main class="flex-grow pt-32 pb-16 px-6 lg:px-12 flex flex-col items-center justify-center text-center relative overflow-hidden">
          <!-- Background Gradients -->
          <div class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>
          <div class="absolute bottom-10 left-10 w-[300px] h-[300px] bg-accent/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>

          <div class="max-w-4xl mx-auto flex flex-col items-center">
            <!-- Badge -->
            <div class="hero-badge mb-6 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-extrabold tracking-wider uppercase inline-block">
              ⚡ Intelligent Queue Management
            </div>

            <!-- Title -->
            <h1 class="hero-title text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white leading-[1.1] mb-6 tracking-tight">
              Skip the waiting room.<br/>
              <span class="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">Queue up digitally.</span>
            </h1>

            <!-- Subtitle -->
            <p class="hero-subtitle text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mb-10 leading-relaxed">
              SmartQueue is a next-generation queue platform. Join queues via QR codes, track your waiting position in real-time, and get AI-powered wait predictions on your phone.
            </p>

            <!-- Action Buttons -->
            <div class="hero-actions flex flex-col sm:flex-row gap-4 mb-16 justify-center">
              <a href="${ctaHash}" class="px-8 py-4 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-base shadow-lg hover:shadow-primary/25 transition-all flex items-center justify-center gap-2 cursor-pointer">
                ${ctaText}
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path>
                </svg>
              </a>
              <a href="#how-it-works" class="px-8 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold text-base hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-all flex items-center justify-center gap-2 cursor-pointer">
                See How It Works
              </a>
            </div>

            <!-- Mockup Dashboard -->
            <div class="hero-mockup w-full max-w-4xl rounded-3xl overflow-hidden border border-slate-200/60 dark:border-slate-800/40 shadow-2xl shadow-slate-200/30 dark:shadow-slate-950/40 bg-white/70 dark:bg-slate-900/40 backdrop-blur-md p-4 sm:p-6">
              <div class="flex items-center gap-2 mb-4 border-b border-slate-200/30 dark:border-slate-800/30 pb-4">
                <span class="w-3 h-3 rounded-full bg-danger"></span>
                <span class="w-3 h-3 rounded-full bg-warning"></span>
                <span class="w-3 h-3 rounded-full bg-success"></span>
                <span class="text-xs text-slate-400 font-semibold ml-2">Live Demo: Customer Tracking View</span>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div class="glass-card p-6 rounded-2xl border border-primary/20 shadow-sm relative overflow-hidden">
                  <div class="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full -mr-5 -mt-5"></div>
                  <h4 class="text-xs font-bold uppercase tracking-wider text-primary mb-1">Your Token</h4>
                  <div class="text-4xl font-black text-slate-900 dark:text-white mb-2">A-108</div>
                  <p class="text-xs text-slate-500 dark:text-slate-400">General Inquiry Service</p>
                </div>

                <div class="glass-card p-6 rounded-2xl border border-slate-200/40 dark:border-slate-800/30 shadow-sm">
                  <h4 class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-450 mb-1">Queue Position</h4>
                  <div class="text-4xl font-black text-slate-900 dark:text-white mb-2 flex items-baseline gap-2">
                    3 <span class="text-xs font-bold text-slate-400">people ahead</span>
                  </div>
                  <p class="text-xs text-success font-bold flex items-center gap-1">
                    <span class="w-2 h-2 rounded-full bg-success animate-pulse"></span> Live updating...
                  </p>
                </div>

                <div class="glass-card p-6 rounded-2xl border border-slate-200/40 dark:border-slate-800/30 shadow-sm">
                  <h4 class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-450 mb-1">Estimated Wait</h4>
                  <div class="text-4xl font-black text-slate-900 dark:text-white mb-2">~18 <span class="text-sm font-bold text-slate-500">mins</span></div>
                  <p class="text-xs text-primary font-semibold">🤖 AI-predicted wait time</p>
                </div>
              </div>
            </div>
          </div>
        </main>

        <!-- Features Section -->
        <section id="features" class="py-24 bg-slate-50/50 dark:bg-slate-900/20 border-t border-b border-slate-200/20 dark:border-slate-800/10 px-6 lg:px-12">
          <div class="max-w-6xl mx-auto">
            <div class="text-center max-w-2xl mx-auto mb-16">
              <h2 class="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">Packed with Enterprise Features</h2>
              <p class="text-slate-600 dark:text-slate-400">Everything you need to manage customer flow, analyze performance, and delight visitors.</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <!-- Feature 1 -->
              <div class="glass-card p-8 rounded-3xl border border-slate-200/40 dark:border-slate-800/30 hover:border-primary/30 transition-all group">
                <div class="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
                <h3 class="text-lg font-bold mb-2 text-slate-900 dark:text-white">Real-Time Updates</h3>
                <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Supabase Realtime integration ensures queue positions, called tokens, and active counters update instantly on all screens.</p>
              </div>

              <!-- Feature 2 -->
              <div class="glass-card p-8 rounded-3xl border border-slate-200/40 dark:border-slate-800/30 hover:border-primary/30 transition-all group">
                <div class="w-12 h-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-all">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                  </svg>
                </div>
                <h3 class="text-lg font-bold mb-2 text-slate-900 dark:text-white">AI Wait Time Predictor</h3>
                <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Uses historical service times and peak congestion patterns to predict waiting times for different services and priorities.</p>
              </div>

              <!-- Feature 3 -->
              <div class="glass-card p-8 rounded-3xl border border-slate-200/40 dark:border-slate-800/30 hover:border-primary/30 transition-all group">
                <div class="w-12 h-12 rounded-2xl bg-success/10 text-success flex items-center justify-center mb-6 group-hover:bg-success group-hover:text-white transition-all">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <h3 class="text-lg font-bold mb-2 text-slate-900 dark:text-white">Mobile PWA Support</h3>
                <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Customers can install the app on their phone directly from the browser. No app store downloads required.</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Footer -->
        <footer class="py-12 px-6 lg:px-12 border-t border-slate-200/30 dark:border-slate-800/30 text-center text-slate-500 text-sm">
          <div class="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
            <div class="flex items-center gap-2">
              <span class="p-1 rounded bg-primary text-white">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </span>
              <span class="font-bold text-slate-800 dark:text-slate-200">SmartQueue</span>
            </div>
            <p>&copy; 2026 SmartQueue System. All rights reserved.</p>
          </div>
        </footer>
      </div>
    `
  },

  init() {
    // GSAP entrance animations
    gsap.from('.hero-badge', { opacity: 0, y: 10, duration: 0.5, delay: 0.1, ease: 'power2.out' })
    gsap.from('.hero-title', { opacity: 0, y: 15, duration: 0.6, delay: 0.2, ease: 'power2.out' })
    gsap.from('.hero-subtitle', { opacity: 0, y: 15, duration: 0.6, delay: 0.3, ease: 'power2.out' })
    gsap.from('.hero-actions', { opacity: 0, y: 15, duration: 0.6, delay: 0.4, ease: 'power2.out' })
    gsap.from('.hero-mockup', { opacity: 0, y: 30, duration: 0.8, delay: 0.5, ease: 'power2.out' })
  }
}

export default landing
