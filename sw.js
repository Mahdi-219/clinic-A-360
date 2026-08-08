const CACHE_NAME = "clinic-app-cache-v6";
const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./css/styles.css",
  "./js/config.js",
  "./js/utils.js",
  "./js/i18n.js",
  "./js/api.js",
  "./js/session.js",
  "./js/dashboard.js",
  "./js/auth.js",
  "./js/patients.js",
  "./js/stats.js",
  "./js/charts.js",
  "./js/employees.js",
  "./js/exporter.js",
  "./js/print.js",
  "./js/main.js",
  "./icons/favicon.ico",
  "./icons/favicon-32.png",
  "./icons/apple-touch-icon.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
