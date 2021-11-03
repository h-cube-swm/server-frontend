const CACHE_NAME = "the-from-pwa-task-manager";
const URLS_TO_CACHE = ["/"];

// Install a service worker
self.addEventListener("install", (event) => {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log("Opened cache");
      return cache.addAll(URLS_TO_CACHE);
    }),
  );
});

// Cache and return requests
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      // Cache hit - return response
      if (response) {
        return response;
      }
      return fetch(event.request);
    }),
  );
});

// Update a service worker
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map(async (cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            await caches.delete(cacheName);
          }
        }),
      );
    }),
  );
});
