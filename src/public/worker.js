const CACHE_NAME = "the-form-pwa-task-manager-v1.1.3";
const URLS_TO_PRECACHE = [];
const URLS_TO_CACHE = [];

function log(x) {
  // console.log(x);
}

// Install a service worker
self.addEventListener("install", (event) => {
  log("Installing service worker " + CACHE_NAME);
  // Skip wating even if previous worker is running.
  self.skipWaiting();
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        log("Opened cache " + CACHE_NAME);
        return cache.addAll(URLS_TO_PRECACHE);
      })
      .then(() => log("All required urls are precached."))
      .catch((err) => log("Could not install service worker because of " + err)),
  );
});

// Cache and return requests
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const { method } = request;
  if (method !== "GET") return;

  event.respondWith(
    caches.match(request).then((cached) => {
      // Cache hit - return response
      if (cached) return cached;
      // Cache miss
      return fetch(request)
        .then((response) => {
          // Check if this content should be cached
          for (let i = 0; i < URLS_TO_CACHE.length; i++) {
            if (request.url.match(URLS_TO_CACHE[i])) {
              // If it should be cached, cache it.
              const responseClone = response.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, responseClone);
              });
              break;
            }
          }
          // Then response original response
          return response;
        })
        .catch(
          () =>
            new Response(
              "<h1>Network connection error</h1><div><p>Could not load data.</p></div>",
              {
                status: 503,
                headers: { "Content-Type": "text/html" },
              },
            ),
        );
    }),
  );
});

// Update a service worker
self.addEventListener("activate", (event) => {
  log("Activated service worker " + CACHE_NAME);
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map(async (cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) < 0) {
            await caches.delete(cacheName);
            log("Previous service worker " + cacheName + " deleted.");
          }
        }),
      );
    }),
  );
});
