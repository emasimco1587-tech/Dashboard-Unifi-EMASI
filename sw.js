const CACHE_NAME = 'emasi-mco-v5';
const ASSETS = [
  '/Dashboard-Unifi-EMASI/',
  '/Dashboard-Unifi-EMASI/index.html'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Réseau en priorité absolue — jamais de cache servi si le réseau répond
self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      }).catch(() => caches.match(event.request))
    );
    return;
  }
  event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
});
