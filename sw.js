const CACHE_NAME = 'city-snack-v4';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './img/burger-city.jpg',
  './img/burger-caesar.jpg',
  './img/burger-chef.jpg',
  './img/hotdog-cheese.jpg',
  './img/hotdog-chili.jpg',
  './img/shawarma-1.jpg',
  './img/shawarma-2.jpg',
  './img/shawarma-3.jpg',
  './img/giro-veg.jpg',
  './img/giro-club.jpg',
  './img/tacos-wrap.jpg',
  './img/tacos-beef.jpg',
  './img/tacos-sausage.jpg',
  './img/nuggets.jpg',
  './img/fries.jpg'
];

// Install — cache all assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — cache-first, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        if (response && response.status === 200 && response.type === 'basic') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => {
        // Offline fallback
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
