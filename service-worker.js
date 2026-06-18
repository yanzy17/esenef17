/*
 * Service worker for Buku Keuangan Digital.
 *
 * IMPORTANT: This service worker ONLY manages the Cache Storage API (the cached
 * copies of the app shell assets). It NEVER touches localStorage. All user data
 * (transactions, expenses, products, targets, budgets, settings) lives in
 * localStorage under the key "bukuKeuanganDigital:v1", which is a completely
 * separate storage area from Cache Storage. Deleting old caches on activate or
 * refreshing cached assets has zero effect on the user's saved data.
 *
 * Strategy: network-first (with cache fallback when offline) so the app
 * auto-updates to the newest deployed assets the moment the user is online,
 * without anyone ever needing to clear cache / site data.
 */

const CACHE_NAME = "buku-keuangan-digital-v4";
const APP_SHELL = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./manifest.json",
  "./icon.svg"
];

// Pre-cache the app shell so the very first offline visit still works.
self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

// Remove stale caches from previous versions. (Cache Storage only — localStorage is untouched.)
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

// Put a fresh copy of a response into the cache (best-effort, never throws).
function putInCache(request, response) {
  const copy = response.clone();
  caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)).catch(() => {});
}

// Network-first: fetch from the network, refresh the cache, fall back to cache when offline.
function networkFirst(request, fallbackToIndex) {
  return fetch(request)
    .then((response) => {
      if (response && response.ok && response.type === "basic") putInCache(request, response);
      return response;
    })
    .catch(() =>
      caches.match(request).then((cached) => {
        if (cached) return cached;
        if (fallbackToIndex) return caches.match("./index.html");
        return Response.error();
      })
    );
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  // Only manage same-origin requests; let cross-origin requests pass through untouched.
  if (url.origin !== self.location.origin) return;

  // Navigation requests (page loads): network-first, offline fallback to index.html.
  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request, true));
    return;
  }

  // Same-origin app-shell assets: network-first so newest assets are always used online.
  event.respondWith(networkFirst(request, false));
});
