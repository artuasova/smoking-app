const CACHE_NAME = 'smoking-app-v0.6';
const urlsToCache = [
  '/smoking-app/',
  '/smoking-app/index.html',
  '/smoking-app/manifest.json',
  '/smoking-app/icon-192x192.png',
  '/smoking-app/icon-512x512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
