// sw.js — serves at /browse-free/sw.js
importScripts("https://cdn.jsdelivr.net/npm/@mercuryworkshop/scramjet@2/dist/scramjet.all.js");

// Required: point Scramjet at its WASM + sync files
self.$scramjet = {
  files: {
    wasm: "https://cdn.jsdelivr.net/npm/@mercuryworkshop/scramjet@2/dist/scramjet.wasm.wasm",
    sync: "https://cdn.jsdelivr.net/npm/@mercuryworkshop/scramjet@2/dist/scramjet.sync.js",
  },
};

// Derive base path from the SW's own location
const swPath = self.location.pathname;
const basePath = swPath.substring(0, swPath.lastIndexOf("/") + 1);

const { ScramjetServiceWorker } = $scramjetLoadWorker();
const scramjet = new ScramjetServiceWorker({
  prefix: basePath + "scramjet/",
});

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

self.addEventListener("fetch", (event) => {
  event.respondWith((async () => {
    await scramjet.loadConfig();
    if (scramjet.route(event)) {
      return scramjet.fetch(event);
    }
    return fetch(event.request);
  })());
});
