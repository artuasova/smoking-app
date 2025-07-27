const CACHE_NAME = 'smoking-app-v2'; // Увеличьте версию кэша
const urlsToCache = [
  '/smoking-app/',
  '/smoking-app/index.html',
  '/smoking-app/manifest.json',
  '/smoking-app/icon-192x192.png', // Добавьте путь к иконке 192x192
  '/smoking-app/icon-512x512.png'  // Добавьте путь к иконке 512x512
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Стратегия кэширования: Cache First с сетью в качестве резервного варианта
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Возвращаем кэшированный ресурс, если он найден
        if (response) {
          return response;
        }
        // Иначе пытаемся загрузить его из сети
        return fetch(event.request).catch(error => {
            // Опционально: возвращаем "резервный" ресурс, если сеть недоступна
            // Например, для изображений можно вернуть placeholder
            // if (event.request.url.endsWith('.png') || event.request.url.endsWith('.jpg')) {
            //   return caches.match('/smoking-app/fallback-image.png');
            // }
            console.log('Fetch failed for:', event.request.url, error);
            throw error; // Пробрасываем ошибку, если резервного ресурса нет
        });
      })
  );
});

// Активация нового Service Worker и удаление старого кэша
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
