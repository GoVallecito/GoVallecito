/* GoVallecito service worker.
 *
 * FRESHNESS IS THE WHOLE POINT of this site, so the strategy is deliberately
 * conservative:
 *   - /data/*  (live conditions, weekly-water, analytics)  -> NEVER cached;
 *     always straight to the network. (The front-end keeps its own last-good
 *     copy in localStorage for offline.)
 *   - HTML navigations + CSS + JS  -> network-first (cache is only a fallback
 *     when offline), so online visitors always get the latest.
 *   - images + fonts  -> stale-while-revalidate (fast + offline, refreshed in
 *     the background; these rarely change).
 *   - cross-origin + non-GET  -> not intercepted.
 *
 * Bump CACHE to invalidate everything on the next deploy. To disable the PWA
 * entirely, replace this file with a stub that calls self.registration.unregister().
 */
const CACHE = 'gv-v1';
// Clean URL (no .html) — /offline.html 308-redirects on Pages, and a redirected
// response can't be returned to a navigation ("had redirections" error).
const OFFLINE_URL = '/offline';
const PRECACHE = [
  OFFLINE_URL,
  '/assets/css/styles.css',
  '/assets/js/nav.js',
  '/assets/js/conditions.js',
  '/assets/js/pwa.js',
  '/assets/img/icon-192.png',
  '/assets/img/apple-touch-icon.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function putInCache(req, res) {
  // Only cache complete, same-origin, OK responses.
  if (res && res.ok && res.type === 'basic') {
    const copy = res.clone();
    caches.open(CACHE).then((c) => c.put(req, copy));
  }
  return res;
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;   // leave cross-origin alone
  if (url.pathname.startsWith('/data/')) return;      // NEVER cache live data

  // HTML navigations: network-first, fall back to cache then the offline page.
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => putInCache(req, res))
        .catch(() => caches.match(req).then((hit) => hit || caches.match(OFFLINE_URL)))
    );
    return;
  }

  const dest = req.destination;

  // Images & fonts: stale-while-revalidate (serve cache, refresh behind).
  if (dest === 'image' || dest === 'font') {
    event.respondWith(
      caches.match(req).then((hit) => {
        const network = fetch(req).then((res) => putInCache(req, res)).catch(() => hit);
        return hit || network;
      })
    );
    return;
  }

  // Everything else (CSS, JS, etc.): network-first, cache fallback when offline.
  event.respondWith(
    fetch(req)
      .then((res) => putInCache(req, res))
      .catch(() => caches.match(req))
  );
});
