const CACHE_NAME = "the-from-pwa-task-manager-v1";
const URLS_TO_PRECACHE = ["/"];

// Install a service worker
self.addEventListener("install", (event) => {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log("Opened cache");
      return cache.addAll(URLS_TO_PRECACHE);
    }),
  );
});

// Cache and return requests
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then(function (response) {
        // Cache hit - return response
        if (response) return response;
        return fetch(event.request);
      })
      .catch((err) => {
        console.log("Failed to fetch :", event.request, "Because of :", err);
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
