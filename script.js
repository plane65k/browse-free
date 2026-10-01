// sw.js — must be served as application/javascript
importScripts('/scramjet/scramjet.js'); // or your rewriter bundle

const wispUrl = 'wss://your-wisp-server.example.com/wisp/';

// Scramjet's service worker entry point
// In a real setup you'd import the built rewriter from the Scramjet package.
// This is the minimal shape of what the SW must do:

self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Only intercept requests that belong to the proxy
  if (!url.pathname.startsWith('/scramjet/') && url.origin !== self.location.origin) {
    return;
  }

  // Let the rewriter handle it
  event.respondWith(
    self.scramjet.handle(event.request, {
      wisp: wispUrl,
    })
  );
});
