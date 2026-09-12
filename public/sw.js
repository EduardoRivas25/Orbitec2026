const MAP_CACHE = 'orbitec-map-tiles-v1';
const TILE_HOSTS = new Set(['server.arcgisonline.com', 'basemaps.cartocdn.com']);

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (!TILE_HOSTS.has(url.hostname)) return;
  event.respondWith((async () => {
    const cache = await caches.open(MAP_CACHE);
    const cached = await cache.match(event.request.url);
    if (cached) return cached;
    try {
      const response = await fetch(event.request);
      if (response.ok) await cache.put(event.request.url, response.clone());
      return response;
    } catch {
      return new Response('', { status: 504, statusText: 'Mapa no precargado' });
    }
  })());
});
