const CACHE_NAME = "hercycle-cache-v2";

const urlsToCache = [
  "./",
  "./index.html",
  "./history.html",
  "./style.css",
  "./script.js",
  "./manifest.json"
];

self.addEventListener("install", (event) => {

  self.skipWaiting();

  event.waitUntil(

    caches.open(CACHE_NAME)

      .then((cache) => {

        return cache.addAll(urlsToCache);

      })

  );

});

self.addEventListener("activate", (event) => {

  event.waitUntil(

    caches.keys().then((keys) => {

      return Promise.all(

        keys.map((key) => {

          if(key !== CACHE_NAME) {

            return caches.delete(key);

          }

        })

      );

    })

  );

});

self.addEventListener("fetch", (event) => {

  event.respondWith(

    caches.match(event.request)

      .then((response) => {

        return response || fetch(event.request);

      })

  );

});
