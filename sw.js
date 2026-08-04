const CACHE_NAME = 'abdelselam-store-v1';
const ASSETS = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', (e)=>{
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)).catch(()=>{})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e)=>{
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e)=>{
  // شبكة أولاً، وإن فشلت (بدون إنترنت) نرجع للنسخة المخزّنة
  e.respondWith(
    fetch(e.request).then(res=>{
      const resClone = res.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(e.request, resClone)).catch(()=>{});
      return res;
    }).catch(()=> caches.match(e.request).then(r => r || caches.match('./index.html')))
  );
});
