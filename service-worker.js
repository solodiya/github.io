// service-worker.js
const CACHE_NAME = "fireworks-cache-v1";
const urlsToCache = [
    "/index.html",
    "/manifest.json",
    "/icon.png"
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache)
                    .then(() => console.log('Service Worker: cacheaddAll complete'))
                    .catch(error => console.error('Service Worker: cache.addAll error', error));
            })
            .catch(error => console.error('Service Worker: cache.open error', error))
    );
});

self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request)
                    .then(response => {
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });
                        return response;
                    })
                    .catch(() => caches.match(event.request));
            })
            .catch(() => caches.match(event.request))
    );
});
