const CACHE_NAME = "the-form-pwa-task-manager-v1.1.0";
const URLS_TO_PRECACHE = ["/"];
const URLS_TO_CACHE = [/\/?static\/.+/];

// Install a service worker
self.addEventListener("install", (event) => {
  console.log("Installing service worker " + CACHE_NAME);
  // Skip wating even if previous worker is running.
  self.skipWaiting();
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Opened cache " + CACHE_NAME);
        return cache.addAll(URLS_TO_PRECACHE);
      })
      .then(() => console.log("All required urls are precached."))
      .catch((err) => console.log("Could not install service worker because of ", err)),
  );
});

// Cache and return requests
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      // Cache hit - return response
      if (cached) return cached;
      // Cache miss
      return fetch(event.request).then((response) => {
        // Check if this content should be cached
        for (let i = 0; i < URLS_TO_CACHE.length; i++) {
          if (event.request.url.match(URLS_TO_CACHE[i])) {
            // If it should be cached, cache it.
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
            break;
          }
        }
        // Then response original response
        return response;
      });
    }),
  );
});

// Update a service worker
self.addEventListener("activate", (event) => {
  console.log("Activated service worker " + CACHE_NAME);
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map(async (cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) < 0) {
            await caches.delete(cacheName);
            console.log("Previous service worker " + cacheName + " deleted.");
          }
        }),
      );
    }),
  );
});
