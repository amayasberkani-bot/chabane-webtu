// اسم الكاش (يمكن تغييره وقت التحديث)
const CACHE_NAME = "webtu-cache-v1";

// الملفات التي سيتم تخزينها للعمل بدون إنترنت
const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./index.css",
  "./index.tsx",
  "./manifest.json"
];

// تثبيت Service Worker وتخزين الملفات
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// تفعيل Service Worker وتنظيف الكاش القديم
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// جلب الملفات من الكاش أو من الإنترنت
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return (
        response ||
        fetch(event.request).catch(() =>
          caches.match("./index.html")
        )
      );
    })
  );
});
