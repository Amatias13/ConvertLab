const CACHE_NAME = 'ConvertLab-v2'
const STATIC_ASSETS = [
  '/ConvertLab/',
  '/ConvertLab/index.html',
]

// Install — pre-cache shell
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  )
  self.skipWaiting()
})

// Activate — clean old caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  )
  self.clients.claim()
})

// Fetch — network first, fall back to cache
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url)

  // Skip non-GET and cross-origin API calls (Pollinations, QR code API)
  if (e.request.method !== 'GET') return
  if (url.hostname === 'text.pollinations.ai') return
  if (url.hostname === 'api.qrserver.com') return
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    // Cache-first for fonts
    e.respondWith(
      caches.match(e.request).then(cached => {
        if (cached) return cached
        return fetch(e.request).then(res => {
          const clone = res.clone()
          caches.open(CACHE_NAME).then(c => c.put(e.request, clone))
          return res
        })
      })
    )
    return
  }

  // Network first, fallback to cache for app shell
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const clone = res.clone()
        caches.open(CACHE_NAME).then(c => c.put(e.request, clone))
        return res
      })
      .catch(() => caches.match(e.request).then(cached => cached || caches.match('/ConvertLab/')))
  )
})
