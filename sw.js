// Velvet Dream Service Worker
// Bump CACHE_VERSION when you push new code — forces all clients to refresh
const CACHE_VERSION = 'v20';
const CACHE_NAME = `velvet-dream-${CACHE_VERSION}`;

const CORE_ASSETS = [
  './',
  './velvet_dream.html',
  './manifest.json',
  './icons/icon-192-dark.png',
  './icons/icon-512-dark.png',
  './icons/apple-touch-icon.png',
  './rabbit-light.png',
  './rabbit-dark.png'
];

// Install: cache the core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
    )).then(() => self.clients.claim())
  );
});

// Fetch strategy: network-first for the HTML (so updates land fast),
// cache-first for everything else (icons, fonts, etc.)
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip API calls — never cache OpenRouter or other live calls
  if (url.hostname.includes('openrouter.ai') ||
      url.hostname.includes('openai.com') ||
      url.hostname.includes('supabase.co')) {
    return;
  }

  // Network-first for HTML — update lands fast when online
  if (event.request.mode === 'navigate' || event.request.destination === 'document') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match(event.request).then((m) => m || caches.match('./velvet_dream.html')))
    );
    return;
  }

  // Cache-first for everything else
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return response;
      });
    })
  );
});
