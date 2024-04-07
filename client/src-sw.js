// Import Workbox modules
import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { CacheFirst } from "workbox-strategies";
import { CacheableResponsePlugin } from "workbox-cacheable-response";
import { ExpirationPlugin } from "workbox-expiration";
import { staticResourceCache } from "workbox-recipes";

// Precache and route all assets defined in the Workbox manifest
precacheAndRoute(self.__WB_MANIFEST);

// Define cache strategies
const pageCache = new CacheFirst({
  cacheName: "page-cache",
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
    }),
  ],
});

// Warm the cache for specific URLs
const urlsToCache = ["/index.html", "/"];
urlsToCache.forEach((url) => {
  registerRoute(
    url,
    new CacheFirst({
      cacheName: "page-cache",
      plugins: [
        new CacheableResponsePlugin({
          statuses: [0, 200],
        }),
        new ExpirationPlugin({
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        }),
      ],
    })
  );
});

// Cache static resources using Workbox recipes
staticResourceCache();

// Register routes for other resources (e.g., images) as needed
registerRoute(
  ({ request }) => request.destination === "image",
  new CacheFirst()
);
