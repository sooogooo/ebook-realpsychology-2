// Service Worker for Medical Aesthetics Psychology Website
// Provides offline functionality and performance optimization

const CACHE_NAME = 'medical-aesthetics-psychology-v1.0.0';
const CACHE_VERSION = '2024-01-01';

// Cache configuration
const CACHE_CONFIG = {
  // Pages to cache for offline access
  pages: [
    '/',
    '/index.html',
    '/00-preface-and-introduction.html',
    '/01-multidimensional-perspectives.html',
    '/02-research-methods-and-critical-thinking.html',
    '/03-consumption-motivation-and-psychological-needs.html',
    '/04-information-processing-and-decision-making.html',
    '/05-service-delivery-and-patient-experience.html',
    '/06-marketing-communication-and-consumer-behavior.html',
    '/07-ethical-boundaries-of-sales-psychology.html',
    '/08-technology-development-and-psychological-adaptation.html',
    '/09-cultural-differences-and-globalization.html',
    '/10-future-outlook-and-development-trends.html',
    '/psychological-assessment.html',
    '/technology-timeline.html',
    '/cultural-comparison.html',
    '/decision-tree.html',
    '/emotional-flow.html'
  ],

  // Critical assets to cache
  criticalAssets: [
    '/assets/css/main.css',
    '/assets/css/psychological-assessment.css',
    '/assets/css/technology-timeline.css',
    '/assets/css/cultural-comparison.css',
    '/assets/css/decision-tree.css',
    '/assets/css/emotional-flow.css',
    '/assets/js/psychological-assessment.js',
    '/assets/js/technology-timeline.js',
    '/assets/js/cultural-comparison.js',
    '/assets/js/decision-tree.js',
    '/assets/js/emotional-flow.js',
    '/assets/js/svg-illustration-manager.js',
    '/assets/svg/webfont-icons/medical-aesthetics-icons.svg'
  ],

  // External resources (CDN)
  externalResources: [
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
    'https://fonts.googleapis.com/icon?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0'
  ]
};

// Install event - Cache resources
self.addEventListener('install', event => {
  console.log('[Service Worker] Installing Service Worker...', CACHE_NAME);

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Caching assets');

        // Cache all pages and critical assets
        const resourcesToCache = [
          ...CACHE_CONFIG.pages,
          ...CACHE_CONFIG.criticalAssets
        ];

        return cache.addAll(resourcesToCache);
      })
      .then(() => {
        console.log('[Service Worker] Skip waiting');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('[Service Worker] Failed to cache resources:', error);
      })
  );
});

// Activate event - Clean up old caches
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activating Service Worker...');

  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              console.log('[Service Worker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[Service Worker] Claiming clients');
        return self.clients.claim();
      })
  );
});

// Fetch event - Handle network requests
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-HTTP requests
  if (!request.url.startsWith('http')) {
    return;
  }

  // Handle different types of requests
  if (request.method === 'GET') {
    // Handle page requests
    if (isPageRequest(request)) {
      event.respondWith(handlePageRequest(request));
    }
    // Handle asset requests
    else if (isAssetRequest(request)) {
      event.respondWith(handleAssetRequest(request));
    }
    // Handle API requests
    else if (isApiRequest(request)) {
      event.respondWith(handleApiRequest(request));
    }
    // Handle external resources
    else if (isExternalResource(request)) {
      event.respondWith(handleExternalRequest(request));
    }
  }
});

// Check if request is for a page
function isPageRequest(request) {
  const url = new URL(request.url);
  const acceptHeader = request.headers.get('Accept') || '';

  return url.pathname === '/' ||
         url.pathname.endsWith('.html') ||
         url.pathname.endsWith('/') ||
         acceptHeader.includes('text/html');
}

// Check if request is for an asset
function isAssetRequest(request) {
  const url = new URL(request.url);
  return url.pathname.startsWith('/assets/');
}

// Check if request is for API
function isApiRequest(request) {
  const url = new URL(request.url);
  return url.pathname.startsWith('/api/');
}

// Check if request is for external resource
function isExternalResource(request) {
  const url = new URL(request.url);
  return !url.origin.includes('medical-aesthetics-psychology') &&
         CACHE_CONFIG.externalResources.some(resource =>
           new URL(resource).origin === url.origin
         );
}

// Handle page requests with stale-while-revalidate
async function handlePageRequest(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);

  // Create network request
  const networkPromise = fetch(request)
    .then(networkResponse => {
      // Cache successful network responses
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    })
    .catch(() => {
      // Return cached version if network fails
      return cachedResponse;
    });

  // Return cached version immediately, update in background
  if (cachedResponse) {
    // Start network request in background
    networkPromise;
    return cachedResponse;
  }

  // Return network response if no cache available
  return networkPromise;
}

// Handle asset requests with cache-first strategy
async function handleAssetRequest(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);

    // Cache non-error responses
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.warn('[Service Worker] Network request failed:', request.url, error);

    // Return a fallback for critical assets
    if (request.url.includes('main.css')) {
      return new Response('/* Fallback styles */', {
        status: 200,
        headers: { 'Content-Type': 'text/css' }
      });
    }

    return new Response('Resource not available offline', {
      status: 503,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

// Handle API requests with network-first strategy
async function handleApiRequest(request) {
  try {
    const networkResponse = await fetch(request);

    // Cache successful responses for 5 minutes
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    // Return cached version if network fails
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    return new Response(JSON.stringify({ error: 'API not available offline' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Handle external resources
async function handleExternalRequest(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);

    // Cache external resources with longer TTL
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    // Return cached version if network fails
    return cachedResponse;
  }
}

// Background sync for offline actions
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  console.log('[Service Worker] Background sync triggered');
  // Handle any background synchronization tasks
  return Promise.resolve();
}

// Push notifications
self.addEventListener('push', event => {
  if (event.data) {
    const options = {
      body: event.data.text(),
      icon: '/assets/images/logo.png',
      badge: '/assets/images/badge.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      },
      actions: [
        {
          action: 'explore',
          title: 'Explore',
          icon: '/assets/images/checkmark.png'
        },
        {
          action: 'close',
          title: 'Close',
          icon: '/assets/images/xmark.png'
        }
      ]
    };

    event.waitUntil(
      self.registration.showNotification('Medical Aesthetics Psychology', options)
    );
  }
});

// Notification click handling
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Service Worker error handling
self.addEventListener('error', event => {
  console.error('[Service Worker] Error:', event.error);
});

self.addEventListener('unhandledrejection', event => {
  console.error('[Service Worker] Unhandled promise rejection:', event.reason);
});

// Periodic background sync for content updates
self.addEventListener('periodicsync', event => {
  if (event.tag === 'content-update') {
    event.waitUntil(updateContent());
  }
});

async function updateContent() {
  console.log('[Service Worker] Periodic content update triggered');

  // Refresh critical pages in background
  const cache = await caches.open(CACHE_NAME);

  for (const page of CACHE_CONFIG.pages.slice(0, 5)) { // Limit to prevent overwhelming
    try {
      const response = await fetch(page);
      if (response.ok) {
        await cache.put(page, response);
      }
    } catch (error) {
      console.warn(`[Service Worker] Failed to update ${page}:`, error);
    }
  }
}

// Install prompt for PWA
let deferredPrompt;

self.addEventListener('beforeinstallprompt', (e) => {
  console.log('[Service Worker] Before install prompt');
  e.preventDefault();
  deferredPrompt = e;

  // Show custom install UI
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({
        type: 'INSTALL_PROMPT',
        data: 'App can be installed'
      });
    });
  });
});

// Message handling
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({
      type: 'VERSION',
      data: CACHE_NAME
    });
  }
});