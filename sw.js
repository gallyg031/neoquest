// NeoQuest TV — Service Worker
// Version du cache — incrémenter à chaque mise à jour du site
const CACHE_NAME = 'neoquest-v1';

// Fichiers à mettre en cache pour le mode hors-ligne
const ASSETS = [
  '/',
  '/index.html',
  '/cours.html',
  '/chapitre.html',
  '/profil.html',
  '/data/data.json',
  '/manifest.json',
  '/img/Neo_assis-Photoroom.png',
  '/img/NeoGeo3DlogoTranspbright.png',
  '/img/neobanner2.jpg',
  'https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap',
  'https://cdn.tailwindcss.com',
];

// ── Installation : mise en cache des assets ──
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[NeoQuest SW] Mise en cache des assets...');
      // On cache ce qu'on peut, on ignore les erreurs (ex: CDN externe)
      return Promise.allSettled(
        ASSETS.map(url => cache.add(url).catch(() => console.warn('[SW] Impossible de cacher:', url)))
      );
    }).then(() => self.skipWaiting())
  );
});

// ── Activation : nettoyage des anciens caches ──
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => {
          console.log('[NeoQuest SW] Suppression ancien cache:', k);
          return caches.delete(k);
        })
      )
    ).then(() => self.clients.claim())
  );
});

// ── Fetch : stratégie Cache First puis Network ──
self.addEventListener('fetch', event => {
  // Ignore les requêtes non-GET
  if(event.request.method !== 'GET') return;

  // Pour data.json : Network First (pour avoir les dernières questions)
  if(event.request.url.includes('data.json')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Pour tout le reste : Cache First
  event.respondWith(
    caches.match(event.request).then(cached => {
      if(cached) return cached;
      return fetch(event.request).then(response => {
        if(!response || response.status !== 200 || response.type === 'opaque') return response;
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      });
    })
  );
});
