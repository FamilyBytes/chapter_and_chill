// Chapter & Chill · service worker
// Sube VERSION cada vez que publiques cambios para renovar la caché.
const VERSION = 'v1';
const APP = `cc-app-${VERSION}`;
const EXTRA = 'cc-extra';           // fuentes y portadas (se conserva entre versiones)
const EXTRA_MAX = 120;

const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(APP).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith('cc-app-') && k !== APP).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

async function recortar(cache) {
  const keys = await cache.keys();
  for (let i = 0; i < keys.length - EXTRA_MAX; i++) await cache.delete(keys[i]);
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // La búsqueda de portadas de Google Books siempre va a la red
  if (url.hostname === 'www.googleapis.com') return;

  // La app: primero la red (para recibir cambios) y, sin conexión, la copia guardada
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then(res => { if (res.ok) { const copia = res.clone(); caches.open(APP).then(c => c.put('./index.html', copia)); } return res; })
        .catch(() => caches.match('./index.html', { ignoreSearch: true }))
    );
    return;
  }

  // Archivos propios: primero la caché
  if (url.origin === location.origin) {
    e.respondWith(caches.match(req, { ignoreSearch: true }).then(r => r || fetch(req)));
    return;
  }

  // Fuentes de Google y portadas externas: se muestran de caché y se actualizan por detrás
  if (req.destination === 'font' || req.destination === 'style' || req.destination === 'image') {
    e.respondWith(caches.open(EXTRA).then(async cache => {
      const guardada = await cache.match(req);
      const red = fetch(req).then(res => {
        if (res.ok || res.type === 'opaque') { cache.put(req, res.clone()).then(() => recortar(cache)); }
        return res;
      }).catch(() => guardada);
      return guardada || red;
    }));
  }
});
