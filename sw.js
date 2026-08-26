// Bobcat Language School — Service Worker
// Faz o cache do "app shell" para o app abrir mesmo sem internet, e também
// é o mecanismo que garante que uma atualização publicada (novo HTML, JS,
// CSS ou uma lição nova/editada) chegue aos alunos.
//
// IMPORTANTE: sempre que você fizer uma alteração e publicar (deploy), suba
// esse número — é o que avisa o navegador que existe uma versão nova do
// service worker para instalar. Sem isso, o navegador pode continuar
// rodando a versão antiga do service worker por bastante tempo.
const CACHE_NAME = 'bobcat-app-v39';

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
  './lessons/gridscape-verb-to-be.html',
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
  './lessons/labirinto-sintaxe.html',
  './lessons/cobrinha-ortografia.html',
  './lessons/gridscape-can-cant.html',
  './lessons/gridscape-comparatives.html',
  './lessons/gridscape-comparisons-eq.html',
  './lessons/gridscape-conditionals.html',
  './lessons/gridscape-countable.html',
  './lessons/gridscape-do-does.html',
  './lessons/gridscape-future-forms.html',
  './lessons/gridscape-going-to.html',
  './lessons/gridscape-here-there.html',
  './lessons/gridscape-modals-advice.html',
  './lessons/gridscape-modals.html',
  './lessons/gridscape-past-continuous.html',
  './lessons/gridscape-past-irregular.html',
  './lessons/gridscape-past-mix.html',
  './lessons/gridscape-past-regular.html',
  './lessons/gridscape-perguntas-artigos.html',
  './lessons/gridscape-perguntas-sp.html',
  './lessons/gridscape-phrasal-verbs.html',
  './lessons/gridscape-posse.html',
  './lessons/gridscape-pp-already.html',
  './lessons/gridscape-pp-experiences.html',
  './lessons/gridscape-pp-vs-past.html',
  './lessons/gridscape-preposicoes.html',
  './lessons/gridscape-present-continuous.html',
  './lessons/gridscape-present-perfect.html',
  './lessons/gridscape-pronouns.html',
  './lessons/gridscape-quantities-choices.html',
  './lessons/gridscape-quantities-time.html',
  './lessons/gridscape-revisao-a1.html',
  './lessons/gridscape-revisao-perguntas.html',
  './lessons/gridscape-revisao-s2.html',
  './lessons/gridscape-revisao-s3.html',
  './lessons/gridscape-saudacoes.html',
  './lessons/gridscape-simple-present.html',
  './lessons/gridscape-survival.html',
  './lessons/gridscape-talking-past.html',
  './lessons/gridscape-there-is.html',
  './lessons/gridscape-was-were.html',
  './lessons/gridscape-will.html',
  './lessons/lesson-kit.js',
  './lessons/lesson-kit.css',
  './lessons/gridscape-kit.js',
  './lessons/gridscape-kit.css',
  './lessons/game-sound.js',
  './lessons/config.js',
  './lessons/caca-palavras-ingles.html',
  './lessons/cobrinha-ortografia-ingles.html',
  './lessons/concordancia-monta-frase.html',
  './lessons/empurra-palavras-ingles.html',
  './lessons/empurra-palavras.html',
  './lessons/generos-em-cena.html',
  './lessons/interpretacao-harmonia.html',
  './lessons/manual-portugues-avancado.html',
  './lessons/manual-portugues-basico.html',
  './lessons/manual-portugues.html',
  './lessons/pa-coesao-coerencia.html',
  './lessons/pa-figuras-linguagem.html',
  './lessons/pa-funcoes-linguagem.html',
  './lessons/pa-generos-textuais.html',
  './lessons/pa-periodo-coordenacao.html',
  './lessons/pa-periodo-subordinacao-i.html',
  './lessons/pa-periodo-subordinacao-ii.html',
  './lessons/pa-redacao-dissertativa.html',
  './lessons/pa-semantica.html',
  './lessons/pa-vicios-ambiguidade.html'
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
