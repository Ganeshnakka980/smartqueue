const CACHE_NAME = 'smartqueue-v1'
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/src/main.js',
  '/src/style.css',
  '/src/router.js',
  '/src/services/supabase.js',
  '/src/services/auth.js',
  '/src/services/queue.js',
  '/src/services/aiPredictor.js',
  '/src/components/toast.js',
  '/src/components/modal.js',
  '/src/components/sidebar.js',
  '/src/components/skeletons.js',
  '/src/pages/landing.js',
  '/src/pages/auth.js',
  '/src/pages/customer.js',
  '/src/pages/staff.js',
  '/src/pages/admin.js',
  '/manifest.json',
  '/favicon.svg'
]

// Install Event - Cache App Shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('PWA Cache opened, caching static assets.')
      return cache.addAll(ASSETS_TO_CACHE)
    }).then(() => self.skipWaiting())
  )
})

// Activate Event - Clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Clearing old PWA cache:', cache)
            return caches.delete(cache)
          }
        })
      )
    }).then(() => self.clients.claim())
  )
})

// Fetch Event - Network First, falling back to cache if offline
self.addEventListener('fetch', (event) => {
  // Only handle HTTP/HTTPS requests (avoid chrome-extension or other schemes)
  if (!event.request.url.startsWith(self.location.origin)) {
    return
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // If successful, clone response and update cache
        if (response && response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache)
          })
        }
        return response
      })
      .catch(() => {
        // Offline: serve from cache
        return caches.match(event.request)
      })
  )
})
