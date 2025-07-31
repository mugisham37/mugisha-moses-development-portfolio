// Service Worker for caching and performance optimization

const CACHE_NAME = "developer-portfolio-v1";
const STATIC_CACHE_NAME = "static-v1";
const DYNAMIC_CACHE_NAME = "dynamic-v1";

// Assets to cache immediately
const STATIC_ASSETS = [
  "/",
  "/about",
  "/portfolio",
  "/services",
  "/contact",
  "/manifest.json",
  "/favicon.ico",
  // Add critical CSS and JS files here
];

// Assets to cache on first request
const DYNAMIC_ASSETS = ["/images/", "/_next/static/", "/api/"];

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("Service Worker installing...");

  event.waitUntil(
    caches
      .open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log("Caching static assets");
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("Service Worker activating...");

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (
              cacheName !== STATIC_CACHE_NAME &&
              cacheName !== DYNAMIC_CACHE_NAME
            ) {
              console.log("Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") {
    return;
  }

  // Skip external requests
  if (url.origin !== location.origin) {
    return;
  }

  // Handle different types of requests
  if (isStaticAsset(request.url)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE_NAME));
  } else if (isDynamicAsset(request.url)) {
    event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE_NAME));
  } else {
    event.respondWith(networkFirst(request, DYNAMIC_CACHE_NAME));
  }
});

// Cache strategies
async function cacheFirst(request, cacheName) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error("Cache first strategy failed:", error);
    return new Response("Offline", { status: 503 });
  }
}

async function networkFirst(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log("Network failed, trying cache:", error);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    return new Response("Offline", { status: 503 });
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);

  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  });

  return cachedResponse || fetchPromise;
}

// Helper functions
function isStaticAsset(url) {
  return (
    url.includes("/_next/static/") ||
    url.includes("/images/") ||
    url.endsWith(".css") ||
    url.endsWith(".js") ||
    url.endsWith(".woff2") ||
    url.endsWith(".woff")
  );
}

function isDynamicAsset(url) {
  return url.includes("/api/") || url.includes("/_next/image");
}

// Background sync for analytics
self.addEventListener("sync", (event) => {
  if (event.tag === "web-vitals-sync") {
    event.waitUntil(syncWebVitals());
  }
});

async function syncWebVitals() {
  // Sync any queued web vitals data when connection is restored
  try {
    const cache = await caches.open("web-vitals-queue");
    const requests = await cache.keys();

    for (const request of requests) {
      try {
        await fetch(request);
        await cache.delete(request);
      } catch (error) {
        console.error("Failed to sync web vitals:", error);
      }
    }
  } catch (error) {
    console.error("Background sync failed:", error);
  }
}

// Push notifications (if needed in the future)
self.addEventListener("push", (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.primaryKey,
      },
      actions: [
        {
          action: "explore",
          title: "View Portfolio",
          icon: "/icon-192.png",
        },
        {
          action: "close",
          title: "Close",
          icon: "/icon-192.png",
        },
      ],
    };

    event.waitUntil(self.registration.showNotification(data.title, options));
  }
});

// Notification click handler
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "explore") {
    event.waitUntil(clients.openWindow("/"));
  }
});
