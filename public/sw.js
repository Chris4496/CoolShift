// Bump when the precache list or caching strategy changes
const VERSION = "v1";
const PAGES = `cool-shift-pages-${VERSION}`;
const ASSETS = `cool-shift-assets-${VERSION}`;

const PRECACHE = [
  "/",
  "/insights",
  "/ask",
  "/rewards",
  "/cooling",
  "/charging",
  "/budget",
  "/impact",
  "/mascot.png",
  "/mascot-sm.png",
  "/icons/icon-192.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(PAGES)
      .then((cache) => Promise.allSettled(PRECACHE.map((url) => cache.add(url))))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== PAGES && k !== ASSETS).map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Pages: network first so content stays fresh, cached copy when offline
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(PAGES).then((cache) => cache.put(request, copy));
          return res;
        })
        .catch(() =>
          caches.match(request).then((hit) => hit || caches.match("/")),
        ),
    );
    return;
  }

  // Hashed build output and static images never change under the same URL
  const immutable =
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/icons/") ||
    url.pathname.startsWith("/mascot") ||
    url.pathname.startsWith("/_next/image");
  if (immutable) {
    event.respondWith(
      caches.match(request).then(
        (hit) =>
          hit ||
          fetch(request).then((res) => {
            if (res.ok) {
              const copy = res.clone();
              caches.open(ASSETS).then((cache) => cache.put(request, copy));
            }
            return res;
          }),
      ),
    );
  }
});
