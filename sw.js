// Bobcat Language School — Service Worker
// Faz o cache do "app shell" para o app abrir mesmo sem internet, e também
// é o mecanismo que garante que uma atualização publicada (novo HTML, JS,
// CSS ou uma lição nova/editada) chegue aos alunos.
//
// IMPORTANTE: sempre que você fizer uma alteração e publicar (deploy), suba
// esse número — é o que avisa o navegador que existe uma versão nova do
// service worker para instalar. Sem isso, o navegador pode continuar
// rodando a versão antiga do service worker por bastante tempo.
const CACHE_NAME = 'bobcat-app-v33';

const APP_SHELL = [
  './',
  './index.html',
  './teacher.html',
  './style.css',
  './app.js',
  './config.js',
  './db-client.js',
  './manifest.json',
  './bobcat-ville.html',
  './story.js',
  './mapa-bobcat-ville.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './lessons/nivelamento.html',
  './lessons/pb-interjeicao.html',
  './lessons/pb-conjuncao.html',
  './lessons/pb-preposicao.html',
  './lessons/pb-adverbio.html',
  './lessons/pb-verbo.html',
  './lessons/pb-pronome.html',
  './lessons/pb-numeral.html',
  './lessons/pb-adjetivo.html',
  './lessons/pb-artigo.html',
  './lessons/pb-substantivo.html',
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
  './lessons/licao-12-simple-present-daily-life.html',
  './lessons/licao-13-perguntas-simple-present.html',
  './lessons/licao-14-there-is-there-are.html',
  './lessons/licao-15-can-cant.html',
  './lessons/licao-16-present-continuous.html',
  './lessons/licao-17-countable-uncountable.html',
  './lessons/licao-18-quantities-choices.html',
  './lessons/licao-19-quantities-distance-time.html',
  './lessons/licao-20-survival-english.html',
  './lessons/licao-21-simple-past-regular.html',
  './lessons/licao-22-simple-past-irregular.html',
  './lessons/licao-23-talking-about-the-past.html',
  './lessons/licao-24-future-going-to.html',
  './lessons/licao-25-future-will.html',
  './lessons/licao-26-comparatives-superlatives.html',
  './lessons/licao-27-present-perfect.html',
  './lessons/licao-28-modal-verbs.html',
  './lessons/licao-29-phrasal-verbs.html',
  './lessons/licao-30-revisao-semestre-2.html',
  './lessons/custom.html',
  './lessons/pt-interpretacao.html',
  './lessons/pt-pontuacao.html',
  './lessons/pt-ortografia.html',
  './lessons/pt-acentuacao.html',
  './lessons/pt-colocacao.html',
  './lessons/pt-crase.html',
  './lessons/pt-regencia.html',
  './lessons/pt-concordancia.html',
  './lessons/pt-sintaxe.html',
  './lessons/pt-morfologia.html',
  './lessons/caca-palavras-portugues.html',
];

// Extensões tratadas como "app shell": sempre tenta buscar a versão mais
// nova na rede primeiro. Só cai para o cache se estiver offline.
const NETWORK_FIRST_RE = /\.(html|js|css|json)$/;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  // Sem self.skipWaiting() aqui de propósito: a versão nova fica esperando
  // até o aluno confirmar clicando em "Atualizar agora" (veja app.js), pra
  // não recarregar a página sozinha no meio de uma lição em andamento.
});

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
  // Permite o app pedir uma notificação local de teste (sem passar pelo servidor).
  if (event.data && event.data.type === 'SHOW_LOCAL_NOTIFICATION') {
    const d = event.data;
    event.waitUntil(
      self.registration.showNotification(d.title || 'Bobcat', {
        body: d.body || '',
        icon: d.icon || './icons/icon-192.png',
        badge: './icons/icon-192.png',
        tag: d.tag || 'bobcat-local',
        data: { url: d.url || './index.html?screen=ai-chat' },
        renotify: true
      })
    );
  }
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) =>
        Promise.all(
          keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return; // não mexe em chamadas ao Supabase, CDN etc.

  const isAppShell = NETWORK_FIRST_RE.test(url.pathname) || url.pathname.endsWith('/');

  if (isAppShell) {
    // Network-first: garante que uma mudança publicada apareça já na
    // próxima vez que a página for aberta/recarregada, enquanto o aluno
    // estiver online. Sem internet, cai para a última versão salva em cache.
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => caches.match(event.request))
    );
  } else {
    // Cache-first para ícones/imagens, que praticamente nunca mudam —
    // mantém a resposta rápida e funcionando offline.
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
  }
});

// ─── Web Push ───────────────────────────────────────────────────────────────
// O servidor (ou um cron) envia um push; aqui só exibimos a notificação.
// Payload esperado (JSON): { title, body, url?, tag? }

self.addEventListener('push', (event) => {
  let data = { title: 'Bobcat Language School', body: 'Hora de praticar inglês! 🐱', url: './index.html?screen=ai-chat', tag: 'bobcat-practice' };
  try {
    if (event.data) {
      const parsed = event.data.json();
      data = { ...data, ...parsed };
    }
  } catch (e) {
    try {
      const text = event.data && event.data.text();
      if (text) data.body = text;
    } catch (_) { /* ignore */ }
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: './icons/icon-192.png',
      badge: './icons/icon-192.png',
      tag: data.tag || 'bobcat-practice',
      data: { url: data.url || './index.html?screen=ai-chat' },
      renotify: true,
      vibrate: [120, 60, 120]
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || './index.html?screen=ai-chat';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) {
          client.postMessage({ type: 'NOTIFICATION_CLICK', url: targetUrl });
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
