// Bobcat Language School — Service Worker
// Faz o cache do "app shell" para o app abrir mesmo sem internet.

const CACHE_NAME = 'bobcat-app-v7';
const APP_SHELL = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './config.js',
  './db-client.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './lessons/pronuncia-essencial.html',
  './lessons/verb-to-be.html',
  './lessons/saudacoes-apresentacoes.html',
  './lessons/licao-2-perguntas-artigos.html',
  './lessons/licao-3-revisao-perguntas.html',
  './lessons/licao-4-preposicoes.html',
  './lessons/licao-5-posse.html',
  './lessons/licao-6-here-there.html',
  './lessons/licao-8-to-be-passado.html',
  './lessons/licao-9-revisao-completa.html',
  './lessons/licao-10-do-does-to-for.html',
  './lessons/licao-11-object-possessive-pronouns.html',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Estratégia: cache primeiro, com atualização em segundo plano (stale-while-revalidate)
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const networkFetch = fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => cached);
      return cached || networkFetch;
    })
  );
});
