// Import necessary modules
const { offlineFallback, warmStrategyCache } = require("workbox-recipes");
const { CacheFirst } = require("workbox-strategies");
const { registerRoute } = require("workbox-routing");
const { CacheableResponsePlugin } = require("workbox-cacheable-response");
const { ExpirationPlugin } = require("workbox-expiration");
const { precacheAndRoute } = require("workbox-precaching/precacheAndRoute");

// Precache and route all static assets
precacheAndRoute(self.__WB_MANIFEST);

// Define a CacheFirst strategy for pages
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
// Warm the cache for certain URLs
warmStrategyCache({
  urls: ["/index.html", "/"],
  strategy: pageCache,
});

// Register a route for navigation requests
registerRoute(
  ({ request }) => request.mode === "navigate",
  (args) => {
    return pageCache.handle(args);
  }
);

// Implement asset caching
const { staticResourceCache } = require("workbox-recipes");
staticResourceCache();

// Define routes for caching assets
registerRoute(
  /\.(?:js|css|png|gif|jpg|svg)$/,
  new CacheFirst({
    cacheName: "assets-cache",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
      }),
    ],
  })
);

// Implement offline fallback
offlineFallback();
