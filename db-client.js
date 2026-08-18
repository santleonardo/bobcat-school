// ============================================================
// Camada de dados do app Bobcat.
// Se o Supabase estiver configurado (config.js), os dados ficam
// na nuvem, sincronizam entre dispositivos e exigem login (usuário
// + senha) — assim o aluno recupera o perfil mesmo trocando de
// aparelho ou depois de limpar os dados do navegador.
// Caso o Supabase não esteja configurado, tudo cai automaticamente
// para localStorage (funciona offline, sem login, sem configuração,
// mas só naquele navegador/aparelho).
// ============================================================

const PROFILE_KEY = 'bobcat_profile';
const PROGRESS_KEY = 'bobcat_progress';

const PASSING_PCT = 85; // nota mínima (85% / 8.5) para considerar a lição concluída

// ─── Gamificação (XP global, streak, conquistas) ─────────────────────────
// Persistido em localStorage. Com login, a chave inclui o userId para não
// misturar contas no mesmo aparelho. Sem alteração de schema no Supabase.
const GAME_KEY_BASE = 'bobcat_gamification';

const ACHIEVEMENTS = [
  { id: 'first_lesson',  icon: '🌱', title: 'Primeiro passo',   desc: 'Conclua 1 lição',              check: (s) => s.completedCount >= 1 },
  { id: 'lessons_5',     icon: '📘', title: 'Em ritmo',         desc: 'Conclua 5 lições',             check: (s) => s.completedCount >= 5 },
  { id: 'lessons_10',    icon: '📚', title: 'Dez lições',       desc: 'Conclua 10 lições',            check: (s) => s.completedCount >= 10 },
  { id: 'lessons_20',    icon: '🎓', title: 'Dedicação',        desc: 'Conclua 20 lições',            check: (s) => s.completedCount >= 20 },
  { id: 'perfect_score', icon: '💯', title: 'Nota 10',          desc: 'Acerte 100% em uma lição',     check: (s) => s.hadPerfect },
  { id: 'improver',      icon: '📈', title: 'Melhorou!',        desc: 'Refaça uma lição com nota maior', check: (s) => s.hadImprove },
  { id: 'streak_3',      icon: '🔥', title: '3 dias seguidos',  desc: 'Pratique 3 dias seguidos',     check: (s) => s.streak >= 3 },
  { id: 'streak_7',      icon: '⚡', title: 'Uma semana',       desc: 'Pratique 7 dias seguidos',     check: (s) => s.streak >= 7 },
  { id: 'xp_500',        icon: '⭐', title: '500 XP',           desc: 'Acumule 500 XP',               check: (s) => s.totalXP >= 500 },
  { id: 'xp_1000',       icon: '🏆', title: '1000 XP',          desc: 'Acumule 1000 XP',              check: (s) => s.totalXP >= 1000 },
];

function gameStorageKey() {
  if (useSupabase && currentUserId) return GAME_KEY_BASE + '_' + currentUserId;
  return GAME_KEY_BASE;
}

function defaultGameState() {
  return {
    totalXP: 0,
    achievements: [],      // ids desbloqueados
    hadPerfect: false,
    hadImprove: false,
    history: []            // { date: 'YYYY-MM-DD', lessonId, xp, pct } recent activity
  };
}

async function getGamification() {
  await initDataLayer();
  try {
    const raw = localStorage.getItem(gameStorageKey());
    if (!raw) return defaultGameState();
    const data = JSON.parse(raw);
    return Object.assign(defaultGameState(), data);
  } catch (e) {
    return defaultGameState();
  }
}

async function saveGamification(state) {
  await initDataLayer();
  try {
    localStorage.setItem(gameStorageKey(), JSON.stringify(state));
  } catch (e) { /* quota */ }
}

/** Dias de atividade a partir do progresso (lastAttempt / last_attempt). */
function collectActivityDays(progress) {
  const days = new Set();
  Object.keys(progress || {}).forEach(function (id) {
    const p = progress[id];
    if (!p) return;
    const iso = p.lastAttempt || p.last_attempt;
    if (!iso) return;
    const d = new Date(iso);
    if (isNaN(d.getTime())) return;
    days.add(d.toISOString().slice(0, 10));
  });
  // também dias do histórico de gamificação
  return days;
}

/** Streak real: dias consecutivos com atividade, terminando hoje ou ontem. */
function computeStreak(progress, gameState) {
  const days = collectActivityDays(progress);
  if (gameState && Array.isArray(gameState.history)) {
    gameState.history.forEach(function (h) { if (h && h.date) days.add(h.date); });
  }
  if (days.size === 0) return 0;

  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  const y = new Date(today); y.setDate(y.getDate() - 1);
  const yStr = y.toISOString().slice(0, 10);

  let cursor;
  if (days.has(todayStr)) cursor = today;
  else if (days.has(yStr)) cursor = y;
  else return 0;

  let streak = 0;
  for (;;) {
    const key = cursor.toISOString().slice(0, 10);
    if (!days.has(key)) break;
    streak++;
    cursor = new Date(cursor);
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

/**
 * Calcula XP da tentativa e atualiza estado global.
 * prev = progresso anterior da mesma lição (ou null).
 * sessionXP = XP ganho no HUD da lição (opcional).
 */
async function applyLessonRewards(lessonId, correct, total, prev, sessionXP) {
  const pct = total > 0 ? (correct / total) * 100 : 0;
  const completed = pct >= PASSING_PCT;
  const state = await getGamification();
  const progress = await getProgress();

  let gained = 0;
  // XP base: 10 por acerto
  gained += Math.max(0, correct) * 10;
  // bônus de sessão do HUD (parcial, evita double-count com o base)
  if (sessionXP && sessionXP > 0) gained += Math.min(Math.round(sessionXP * 0.25), 50);
  // primeira conclusão desta lição
  const wasCompleted = prev && prev.completed;
  if (completed && !wasCompleted) gained += 50;
  // 100%
  if (total > 0 && correct >= total) {
    gained += 100;
    state.hadPerfect = true;
  }
  // bônus por melhorar a nota ao refazer
  if (prev && prev.total > 0) {
    const oldPct = (prev.correct / prev.total) * 100;
    if (pct > oldPct + 0.5) {
      const delta = Math.round(pct - oldPct);
      gained += 25 + Math.min(delta, 50); // +25 base + até 50 pelo delta
      state.hadImprove = true;
    }
  }

  state.totalXP = (state.totalXP || 0) + gained;

  const todayStr = new Date().toISOString().slice(0, 10);
  state.history = Array.isArray(state.history) ? state.history : [];
  state.history.push({ date: todayStr, lessonId: lessonId, xp: gained, pct: Math.round(pct) });
  if (state.history.length > 60) state.history = state.history.slice(-60);

  // stats para conquistas — progresso já foi salvo pelo caller
  const fresh = await getProgress();
  const completedCount = Object.keys(fresh).filter(function (id) {
    return fresh[id] && fresh[id].completed;
  }).length;

  // hadPerfect também se qualquer progresso tiver 100%
  Object.keys(fresh).forEach(function (id) {
    const p = fresh[id];
    if (p && p.total > 0 && p.correct >= p.total) state.hadPerfect = true;
  });
  if (total > 0 && correct >= total) state.hadPerfect = true;

  const streak = computeStreak(fresh, state);
  const snap = {
    completedCount: completedCount,
    hadPerfect: !!state.hadPerfect,
    hadImprove: !!state.hadImprove,
    streak: streak,
    totalXP: state.totalXP
  };

  const unlockedNow = [];
  const have = new Set(state.achievements || []);
  ACHIEVEMENTS.forEach(function (a) {
    if (have.has(a.id)) return;
    try {
      if (a.check(snap)) {
        have.add(a.id);
        unlockedNow.push(a);
        gained += 30; // bônus por conquista
        state.totalXP += 30;
      }
    } catch (e) { /* ignore */ }
  });
  state.achievements = Array.from(have);

  await saveGamification(state);

  return {
    gained: gained,
    totalXP: state.totalXP,
    streak: streak,
    unlocked: unlockedNow,
    completed: completed,
    pct: pct
  };
}

async function resetGamification() {
  try { localStorage.removeItem(gameStorageKey()); } catch (e) { /* ignore */ }
}


let supabaseClient = null;
let currentUserId = null;
let useSupabase = false;      // Supabase está configurado (config.js preenchido)
let dataLayerReady = false;

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// initDataLayer() é idempotente: não importa quantas vezes (ou de quantos
// arquivos diferentes) for chamada, a conexão com o Supabase só é aberta
// uma vez, e todo mundo que chamar espera pela mesma Promise. Isso garante
// que currentUserId/useSupabase estejam prontos antes de qualquer leitura
// ou gravação de progresso, mesmo em páginas de lição que não chamam essa
// função explicitamente (veja a auto-inicialização no fim deste arquivo).
let _dataLayerReadyPromise = null;
function initDataLayer() {
  if (_dataLayerReadyPromise) return _dataLayerReadyPromise;
  _dataLayerReadyPromise = (async () => {
    const cfg = window.SUPABASE_CONFIG;
    const configured = cfg && cfg.url && cfg.anonKey && !cfg.url.includes('SEU-PROJETO');

    if (configured && window.supabase) {
      try {
        supabaseClient = window.supabase.createClient(cfg.url, cfg.anonKey);
        const { data: { session } } = await supabaseClient.auth.getSession();
        currentUserId = session ? session.user.id : null;
        useSupabase = true;
        console.log('Conectado ao Supabase.', currentUserId ? 'Sessão ativa.' : 'Nenhuma sessão — login necessário.');
      } catch (e) {
        console.warn('Não foi possível conectar ao Supabase — usando armazenamento local.', e);
        useSupabase = false;
      }
    } else {
      useSupabase = false;
    }
    dataLayerReady = true;
  })();
  return _dataLayerReadyPromise;
}

// ---------- Login / Cadastro / Logout ----------

function isUsingCloud() {
  return useSupabase;
}

function isLoggedIn() {
  return useSupabase ? !!currentUserId : true; // sem Supabase, "logado" sempre (localStorage)
}

// Retorna { ok: true } ou { ok: false, message: '...', needsConfirmation: true|false }
async function signUpStudent(email, password) {
  if (!useSupabase) return { ok: false, message: 'Cadastro só está disponível com conta na nuvem configurada.' };
  email = (email || '').trim().toLowerCase();
  if (!isValidEmail(email)) return { ok: false, message: 'Digite um e-mail válido.' };
  if (!password || password.length < 6) return { ok: false, message: 'A senha precisa ter pelo menos 6 caracteres.' };

  const { data, error } = await supabaseClient.auth.signUp({ email, password });
  if (error) {
    if (error.message && error.message.toLowerCase().includes('already registered')) {
      return { ok: false, message: 'Esse e-mail já está cadastrado. Tente fazer login.' };
    }
    return { ok: false, message: error.message };
  }

  // Se a confirmação por e-mail estiver ligada no Supabase, `session` vem nulo
  // aqui — o aluno precisa clicar no link recebido por e-mail antes de entrar.
  if (!data.session) {
    return { ok: false, message: 'Conta criada! Verifique seu e-mail e clique no link de confirmação antes de entrar.', needsConfirmation: true };
  }

  currentUserId = data.user.id;
  return { ok: true };
}

async function signInStudent(email, password) {
  if (!useSupabase) return { ok: false, message: 'Login só está disponível com conta na nuvem configurada.' };
  email = (email || '').trim().toLowerCase();
  const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
  if (error) {
    if (error.message && error.message.toLowerCase().includes('email not confirmed')) {
      return { ok: false, message: 'Confirme seu e-mail (verifique sua caixa de entrada) antes de entrar.' };
    }
    return { ok: false, message: 'E-mail ou senha incorretos.' };
  }
  currentUserId = data.user.id;
  return { ok: true };
}

async function resetPasswordForEmail(email) {
  if (!useSupabase) return { ok: false, message: 'Só disponível com conta na nuvem configurada.' };
  email = (email || '').trim().toLowerCase();
  if (!isValidEmail(email)) return { ok: false, message: 'Digite um e-mail válido para recuperar a senha.' };
  const { error } = await supabaseClient.auth.resetPasswordForEmail(email);
  if (error) return { ok: false, message: error.message };
  return { ok: true, message: 'Enviamos um link de redefinição de senha para o seu e-mail.' };
}

async function signOutStudent() {
  if (useSupabase && supabaseClient) {
    await supabaseClient.auth.signOut();
  }
  currentUserId = null;
}

/**
 * Login / cadastro OAuth (Google, Apple, etc.).
 * Redireciona ao provedor e volta ao app; a sessão é lida em initDataLayer / getSession.
 * @param {'google'} provider
 */
async function signInWithOAuthProvider(provider) {
  const labels = { google: 'Google' };
  const label = labels[provider] || provider;
  if (!useSupabase || !supabaseClient) {
    return { ok: false, message: 'Login com ' + label + ' só está disponível com a conta na nuvem configurada.' };
  }
  if (provider !== 'google') {
    return { ok: false, message: 'Provedor de login não suportado.' };
  }
  const options = {
    redirectTo: window.location.origin + '/'
  };
  if (provider === 'google') {
    options.queryParams = { access_type: 'offline', prompt: 'select_account' };
  }
  try {
    const { data, error } = await supabaseClient.auth.signInWithOAuth({
      provider: provider,
      options: options
    });
    if (error) return { ok: false, message: error.message || ('Não foi possível iniciar o login com ' + label + '.') };
    return { ok: true, redirected: true, url: data && data.url };
  } catch (e) {
    return { ok: false, message: (e && e.message) || ('Falha ao conectar com ' + label + '.') };
  }
}

async function signInWithGoogle() {
  return signInWithOAuthProvider('google');
}


if (typeof window !== 'undefined') {
  window.signInWithOAuthProvider = signInWithOAuthProvider;
  window.signInWithGoogle = signInWithGoogle;
}

/** Dados úteis do usuário OAuth (Google) para pré-preencher o perfil. */
function getOAuthProfileHints() {
  if (!useSupabase || !supabaseClient) return null;
  // session sincronizada após OAuth — getUser is async; use cached from last getSession if any
  return null;
}

async function getAuthUserHints() {
  if (!useSupabase || !supabaseClient) return {};
  try {
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) return {};
    const meta = user.user_metadata || {};
    let name = meta.full_name || meta.name || meta.preferred_username || '';
    // Apple às vezes envia name como { firstName, lastName } na primeira autorização
    if (!name && meta.name && typeof meta.name === 'object') {
      name = [meta.name.firstName, meta.name.lastName].filter(Boolean).join(' ');
    }
    if (!name && meta.given_name) {
      name = [meta.given_name, meta.family_name].filter(Boolean).join(' ');
    }
    return {
      email: user.email || '',
      name: typeof name === 'string' ? name : '',
      avatarUrl: meta.avatar_url || meta.picture || ''
    };
  } catch (e) {
    return {};
  }
}

// ---------- Perfil ----------


/** Access token da sessão Supabase (para Authorization nas APIs serverless). */
async function getAccessToken() {
  try {
    await initDataLayer();
  } catch (e) { /* ignore */ }
  if (!useSupabase || !supabaseClient) return null;
  try {
    const { data: { session } } = await supabaseClient.auth.getSession();
    return session && session.access_token ? session.access_token : null;
  } catch (e) {
    return null;
  }
}
window.getAccessToken = getAccessToken;


async function getProfile() {
  if (useSupabase) {
    if (!currentUserId) return null;
    const { data, error } = await supabaseClient
      .from('profiles').select('*').eq('id', currentUserId).maybeSingle();
    if (error) { console.error(error); return null; }
    return data;
  }
  const raw = localStorage.getItem(PROFILE_KEY);
  return raw ? JSON.parse(raw) : null;
}

async function saveProfile(profile) {
  if (useSupabase) {
    if (!currentUserId) return;
    const row = { id: currentUserId, name: profile.name, avatar: profile.avatar, level: profile.level };
    const { error } = await supabaseClient.from('profiles').upsert(row);
    if (error) console.error(error);
    return;
  }
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

// ---------- Progresso das lições ----------

async function getProgress() {
  await initDataLayer();
  // useSupabase só é usado de fato quando também há uma sessão ativa
  // (currentUserId). Sem isso, cairíamos silenciosamente em "sem dado
  // nenhum" mesmo tendo progresso salvo localmente antes — por isso o
  // fallback para localStorage cobre TANTO "Supabase não configurado"
  // quanto "Supabase configurado mas sem sessão detectada nesta página".
  if (useSupabase && currentUserId) {
    const { data, error } = await supabaseClient
      .from('progress').select('*').eq('user_id', currentUserId);
    if (error) { console.error(error); return {}; }
    const map = {};
    (data || []).forEach(row => {
      map[row.lesson_id] = {
        completed: row.completed,
        correct: row.correct,
        total: row.total,
        answers: row.answers || [],
        lastAttempt: row.last_attempt
      };
    });
    return map;
  }
  const raw = localStorage.getItem(PROGRESS_KEY);
  return raw ? JSON.parse(raw) : {};
}

// savedTo indica onde o progresso realmente ficou gravado, para que quem
// chamou (handleLessonFinish) possa avisar bem visivelmente o aluno sempre
// que NÃO tiver ido para a nuvem:
//  'cloud'          → gravou no Supabase normalmente.
//  'local-no-login' → Supabase configurado, mas sem sessão detectada nesta
//                      página (aluno "deslogado" aqui) — salvou só neste
//                      aparelho/navegador.
//  'local-error'    → tinha sessão, mas a gravação na nuvem falhou (rede,
//                      RLS etc.) — salvou só neste aparelho como reserva.
//  'local-no-cloud' → Supabase não está configurado no app (modo 100% local
//                      por design, não é uma falha).
async function saveLessonProgressData(lessonId, correct, total, answers) {
  await initDataLayer();
  const pct = total > 0 ? (correct / total) * 100 : 0;
  const completed = pct >= PASSING_PCT;
  const safeAnswers = Array.isArray(answers) ? answers : [];

  // Mesma lógica do getProgress(): só usa a nuvem se realmente há uma
  // sessão logada nesta página. Caso contrário, salva no localStorage em
  // vez de descartar o progresso silenciosamente (isso evita perder a
  // tentativa do aluno) — mas quem chamou precisa avisar isso na tela.
  if (useSupabase && currentUserId) {
    const row = {
      user_id: currentUserId,
      lesson_id: lessonId,
      completed: completed,
      correct: correct,
      total: total,
      answers: safeAnswers,
      last_attempt: new Date().toISOString()
    };
    const { error } = await supabaseClient.from('progress').upsert(row, { onConflict: 'user_id,lesson_id' });
    if (error) {
      console.error(error);
      // Se a gravação na nuvem falhar (rede, RLS, etc.), ainda assim
      // guarda localmente para não perder a tentativa do aluno.
      const progress = await getLocalProgressOnly();
      progress[lessonId] = { completed, correct, total, answers: safeAnswers, lastAttempt: new Date().toISOString() };
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
      return { completed, pct, savedTo: 'local-error' };
    }
    return { completed, pct, savedTo: 'cloud' };
  }
  const progress = await getLocalProgressOnly();
  progress[lessonId] = { completed, correct, total, answers: safeAnswers, lastAttempt: new Date().toISOString() };
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  return { completed, pct, savedTo: useSupabase ? 'local-no-login' : 'local-no-cloud' };
}

function getLocalProgressOnly() {
  const raw = localStorage.getItem(PROGRESS_KEY);
  return raw ? JSON.parse(raw) : {};
}

// ---------- Progresso de jogos (ex.: Interpretação — Harmonia) ----------
// Reutiliza a tabela `progress` com lesson_id = "game:<id>".
// O estado do jogo vai em `answers` como JSON. Fallback: localStorage.

const GAME_PROGRESS_PREFIX = 'game:';
const GAME_LOCAL_KEY = 'bobcat_game_progress';

function gameLessonId(gameId) {
  return GAME_PROGRESS_PREFIX + String(gameId || '').replace(/^game:/, '');
}

function getLocalGameProgressAll() {
  try {
    const raw = localStorage.getItem(GAME_LOCAL_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function setLocalGameProgress(gameId, data) {
  const all = getLocalGameProgressAll();
  all[gameId] = Object.assign({}, data || {}, { updatedAt: new Date().toISOString() });
  localStorage.setItem(GAME_LOCAL_KEY, JSON.stringify(all));
}

/** Lê o save de um jogo (Supabase se logado, senão local + migração legada). */
async function getGameProgress(gameId, legacyLocalKey) {
  await initDataLayer();
  const id = String(gameId || '').trim();
  if (!id) return {};

  if (useSupabase && currentUserId) {
    try {
      const lessonId = gameLessonId(id);
      const { data, error } = await supabaseClient
        .from('progress')
        .select('*')
        .eq('user_id', currentUserId)
        .eq('lesson_id', lessonId)
        .maybeSingle();
      if (error) console.error('getGameProgress', error);
      else if (data) {
        let payload = data.answers;
        if (Array.isArray(payload) && payload.length && payload[0] && payload[0]._game) {
          payload = payload[0].data;
        }
        if (payload && typeof payload === 'object' && !Array.isArray(payload)) {
          setLocalGameProgress(id, payload);
          return payload;
        }
      }
    } catch (e) {
      console.error('getGameProgress cloud', e);
    }
  }

  const local = getLocalGameProgressAll()[id];
  if (local && typeof local === 'object') return local;

  if (legacyLocalKey) {
    try {
      const raw = localStorage.getItem(legacyLocalKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          setLocalGameProgress(id, parsed);
          return parsed;
        }
      }
    } catch (e) { /* ignore */ }
  }
  return {};
}

/**
 * Grava o save de um jogo.
 * @returns {{ savedTo: string }}
 */
async function saveGameProgress(gameId, data) {
  await initDataLayer();
  const id = String(gameId || '').trim();
  const payload = Object.assign({}, data || {}, { updatedAt: new Date().toISOString() });
  if (!id) return { savedTo: 'local-no-cloud' };

  setLocalGameProgress(id, payload);

  if (useSupabase && currentUserId) {
    const cleared = payload.cleared || {};
    const clearedN = Object.keys(cleared).filter(function (k) { return cleared[k]; }).length;
    const totalScenarios = typeof payload.totalScenarios === 'number' ? payload.totalScenarios : 5;
    const row = {
      user_id: currentUserId,
      lesson_id: gameLessonId(id),
      completed: clearedN >= totalScenarios,
      correct: clearedN,
      total: totalScenarios,
      answers: [{ _game: true, data: payload }],
      last_attempt: new Date().toISOString()
    };
    const { error } = await supabaseClient
      .from('progress')
      .upsert(row, { onConflict: 'user_id,lesson_id' });
    if (error) {
      console.error('saveGameProgress', error);
      return { savedTo: 'local-error' };
    }
    return { savedTo: 'cloud' };
  }

  return { savedTo: useSupabase ? 'local-no-login' : 'local-no-cloud' };
}

// ---------- Captura automática das respostas (para o professor revisar) ----------
// Lê o gabarito direto do que já existe no HTML de cada lição — não precisa
// editar lição por lição. Cobre os dois padrões usados nas lições:
//  1) Campo de texto com data-answer="..." ou data-answers="a|b" (uma ou mais
//     respostas aceitas), opcionalmente com data-label="enunciado".
//  2) Grupo de rádio (mesmo atributo `name`) onde a opção certa tem a classe
//     "correct-answer" no HTML, com o enunciado em ".mc-item .q".
// Como fallback (grupos de rádio corrigidos só via JavaScript da própria
// lição, sem marcação no HTML), aproveita as classes "correct"/"incorrect"
// que a lição já aplica na tela ao conferir as respostas.
// Campos de texto livre (sem gabarito) entram como resposta aberta, sem
// status de certo/errado — útil pro professor ver o que o aluno escreveu.
function normalizeAnswerText(s) {
  return (s || '').trim().toLowerCase().replace(/\s+/g, ' ');
}

function labelFromContext(el) {
  if (el.dataset && el.dataset.label) return el.dataset.label;
  const item = el.closest('.fill-item, .mc-item');
  if (item) {
    const qEl = item.querySelector('.q');
    if (qEl) return qEl.textContent.replace(/\s+/g, ' ').trim();
    const clone = item.cloneNode(true);
    clone.querySelectorAll('input, select, button, .answer-hint').forEach(n => n.remove());
    const text = clone.textContent.replace(/\s+/g, ' ').trim();
    if (text) return text;
  }
  return el.placeholder || el.name || el.id || 'Questão';
}

function labelTextForRadio(radioEl) {
  const label = radioEl.closest('label');
  if (label) return label.textContent.replace(/\s+/g, ' ').trim();
  return radioEl.value;
}

function collectLessonAnswers() {
  const items = [];
  const handledInputs = new Set();

  // 1) Campos de texto com gabarito declarado no HTML
  document.querySelectorAll('input[type="text"][data-answer], input[type="text"][data-answers]').forEach(inp => {
    handledInputs.add(inp);
    const given = inp.value.trim();
    const acceptedRaw = inp.dataset.answers || inp.dataset.answer || '';
    const accepted = acceptedRaw.split('|').map(a => a.trim()).filter(Boolean);
    const isCorrect = given !== '' && accepted.some(a => normalizeAnswerText(a) === normalizeAnswerText(given));
    items.push({
      question: labelFromContext(inp),
      studentAnswer: given || '(em branco)',
      correctAnswer: accepted[0] || null,
      status: given === '' ? 'blank' : (isCorrect ? 'correct' : 'incorrect')
    });
  });

  // 2) Grupos de rádio (múltipla escolha / verdadeiro-falso)
  const radioGroups = {};
  document.querySelectorAll('input[type="radio"]').forEach(r => {
    (radioGroups[r.name] = radioGroups[r.name] || []).push(r);
  });
  Object.values(radioGroups).forEach(group => {
    const selected = group.find(r => r.checked) || null;
    const staticCorrect = group.find(r => r.classList.contains('correct-answer'));
    let correctLabel = null;
    let status;

    if (staticCorrect) {
      correctLabel = labelTextForRadio(staticCorrect);
      status = !selected ? 'blank' : (selected === staticCorrect ? 'correct' : 'incorrect');
    } else if (selected) {
      // Fallback: usa a marcação visual que a própria lição já aplicou ao conferir
      const selLabel = selected.closest('label');
      if (selLabel && selLabel.classList.contains('correct')) status = 'correct';
      else if (selLabel && selLabel.classList.contains('incorrect')) status = 'incorrect';
      else status = 'open';
      const correctMarked = group.find(r => {
        const l = r.closest('label');
        return l && l.classList.contains('correct');
      });
      if (correctMarked) correctLabel = labelTextForRadio(correctMarked);
    } else {
      status = 'blank';
    }

    items.push({
      question: labelFromContext(group[0]),
      studentAnswer: selected ? labelTextForRadio(selected) : '(em branco)',
      correctAnswer: correctLabel,
      status
    });
  });

  // 3) Texto livre preenchido, sem gabarito (produção do aluno)
  document.querySelectorAll('input[type="text"]').forEach(inp => {
    if (handledInputs.has(inp)) return;
    const given = inp.value.trim();
    if (given === '') return;
    items.push({
      question: labelFromContext(inp),
      studentAnswer: given,
      correctAnswer: null,
      status: 'open'
    });
  });

  return items;
}

// Mostra (ou esconde) um aviso BEM visível quando o progresso não foi
// gravado na nuvem — sempre que cai no fallback local, o aluno precisa ver
// isso na hora, não só um iconezinho discreto (☁️/💾) fácil de não notar.
// Cria o elemento dinamicamente, então funciona em qualquer página de lição
// sem precisar editar o HTML de cada uma.
function showSaveLocationWarning(savedTo) {
  let banner = document.getElementById('bobcat-save-warning');
  if (savedTo === 'cloud') {
    if (banner) banner.style.display = 'none';
    return;
  }
  if (!banner) {
    banner = document.createElement('div');
    banner.id = 'bobcat-save-warning';
    banner.style.cssText = 'margin:12px 0;padding:13px 16px;border-radius:10px;font-size:14px;font-weight:600;line-height:1.45;';
    const msg = document.getElementById('finishMsg') || document.getElementById('finishMessage');
    if (msg && msg.parentNode) {
      msg.parentNode.insertBefore(banner, msg);
    } else {
      document.body.appendChild(banner);
    }
  }
  banner.style.display = 'block';
  if (savedTo === 'local-no-login') {
    banner.style.background = '#fdece8';
    banner.style.border = '1.5px solid #f2b8ab';
    banner.style.color = '#a3321e';
    banner.textContent = '⚠️ Você não está conectado à sua conta nesta página — este progresso foi salvo SÓ NESTE APARELHO, não na nuvem. Faça login de novo (e refaça a lição) para não perder essa nota em outro dispositivo.';
  } else if (savedTo === 'local-error') {
    banner.style.background = '#fdece8';
    banner.style.border = '1.5px solid #f2b8ab';
    banner.style.color = '#a3321e';
    banner.textContent = '⚠️ Não consegui salvar na nuvem agora (falha de conexão com o servidor). Guardei este progresso só neste aparelho como reserva — quando a internet voltar, refaça a lição para sincronizar de vez.';
  } else if (savedTo === 'local-no-cloud') {
    banner.style.background = '#fdf1ea';
    banner.style.border = '1.5px solid #f2d3ba';
    banner.style.color = '#a35a1e';
    banner.textContent = '💾 Este app está rodando em modo local (sem conta na nuvem configurada) — o progresso fica salvo só neste aparelho/navegador.';
  }
}

// Fluxo compartilhado de "finalizar lição", usado por todas as páginas de lição.
// kind: 'correct' (exercícios com gabarito, ex: "Você acertou X de Y") ou
//       'filled' (lições de prática sem correção automática, ex: "Você preencheu X de Y").
// Retorna true se a nota mínima (85%) foi atingida (e portanto a lição foi
// marcada como concluída e o app vai redirecionar); false se o aluno precisa
// tentar novamente (nesse caso o botão de finalizar continua liberado).
async function handleLessonFinish(lessonId, correct, total, kind) {
  const msg = document.getElementById('finishMsg') || document.getElementById('finishMessage');
  if (msg) {
    msg.style.display = 'block';
    msg.style.color = '#6B6B6B';
    msg.textContent = 'Salvando progresso...';
  }

  // progresso anterior (para bônus de melhoria)
  const allProgress = await getProgress();
  const prev = allProgress[lessonId] || null;

  const answers = typeof collectLessonAnswers === 'function' ? collectLessonAnswers() : [];
  const { completed, pct, savedTo } = await saveLessonProgressData(lessonId, correct, total, answers);
  const roundedPct = Math.round(pct);
  showSaveLocationWarning(savedTo);

  // XP de sessão do HUD da lição (se disponível)
  let sessionXP = 0;
  try {
    if (window.BobcatLesson && typeof BobcatLesson.getXP === 'function') {
      sessionXP = BobcatLesson.getXP() || 0;
    }
  } catch (e) { /* ignore */ }

  const rewards = await applyLessonRewards(lessonId, correct, total, prev, sessionXP);

  const cloudNote = isUsingCloud() ? ' (☁️)' : ' (💾)';
  const verb = kind === 'filled' ? 'preencheu' : 'acertou';
  const noun = kind === 'filled' ? 'exercícios' : (total === 1 ? 'questão' : 'questões');

  if (!msg) return completed;

  let extra = '';
  if (rewards && rewards.gained > 0) {
    extra = ' · +' + rewards.gained + ' XP (total ' + rewards.totalXP + ')';
  }
  if (rewards && rewards.unlocked && rewards.unlocked.length) {
    extra += ' · 🏅 ' + rewards.unlocked.map(function (a) { return a.title; }).join(', ');
  }
  if (rewards && rewards.streak > 0) {
    extra += ' · 🔥 ' + rewards.streak + 'd';
  }

  if (completed) {
    msg.style.color = '#1e6b40';
    msg.textContent = '🎉 Parabéns! Você ' + verb + ' ' + correct + ' de ' + total + ' ' + noun +
      ' (' + roundedPct + '%) — lição concluída' + cloudNote + extra + '. Voltando ao app...';
    if (typeof confetti === 'function') {
      try { confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } }); } catch (e) {}
    }
    // Se o progresso não foi para a nuvem, dá mais tempo antes de voltar
    // ao app para o aluno realmente ler o aviso acima.
    const redirectDelay = (savedTo === 'cloud') ? 2800 : 6000;
    setTimeout(function () { window.location.href = '../index.html'; }, redirectDelay);
  } else {
    msg.style.color = '#C0392B';
    msg.textContent = '📌 Você ' + verb + ' ' + correct + ' de ' + total + ' ' + noun +
      ' (' + roundedPct + '%). É preciso pelo menos ' + PASSING_PCT + '% (nota 8,5) para concluir a lição e desbloquear a próxima.' + extra + cloudNote;
    if (kind !== 'filled' && typeof renderErrorTrail === 'function') renderErrorTrail(msg, answers);
  }

  return completed;
}

async function resetAllProgress() {
  await initDataLayer();
  await resetGamification();
  if (useSupabase && currentUserId) {
    const { error } = await supabaseClient.from('progress').delete().eq('user_id', currentUserId);
    if (error) console.error(error);
  }
  localStorage.setItem(PROGRESS_KEY, JSON.stringify({}));
}

// ---------- Senha para zerar progresso (definida pelo professor) ----------

// Retorna a senha cadastrada pelo professor para o aluno logado, ou null se
// não houver nenhuma cadastrada (ou se não estiver usando Supabase — nesse
// caso o app cai para a senha global de config.js como alternativa).
async function getMyResetPassword() {
  if (!useSupabase || !currentUserId) return null;
  const { data, error } = await supabaseClient
    .from('student_reset_passwords')
    .select('password')
    .eq('user_id', currentUserId)
    .maybeSingle();
  if (error) { console.error(error); return null; }
  return data ? data.password : null;
}

// ---------- Lições customizadas (adicionadas pelo professor pelo painel) ----------
// Só existem com o Supabase configurado — como o app é um site estático,
// não há como o painel "criar o arquivo" de verdade dentro de lessons/, então
// essas lições moram no banco e são abertas por lessons/custom.html?id=...

async function getCustomLessons() {
  if (!useSupabase || !currentUserId) return [];
  const { data, error } = await supabaseClient
    .from('custom_lessons')
    .select('id,name,level,icon,description,total_questions,section')
    .order('created_at', { ascending: true });
  if (error) { console.error(error); return []; }
  return (data || []).map(row => ({
    id: row.id,
    name: row.name,
    level: row.level,
    icon: row.icon || '📄',
    description: row.description || '',
    url: 'lessons/custom.html?id=' + encodeURIComponent(row.id),
    totalQuestions: row.total_questions || 0,
    section: row.section
  }));
}

// ---------- Mensagens (canal de comunicação com o professor) ----------
// Esse recurso só existe com o Supabase configurado: sem nuvem não há como
// a mensagem "sair" do aparelho do aluno e chegar ao painel do professor.

function messagingAvailable() {
  return useSupabase && !!currentUserId;
}

// ---------- Anexos de mensagens (PDF, Word, texto, planilha, imagem etc.) ----------

const MESSAGE_FILES_BUCKET = 'mensagens-arquivos';
const MAX_MESSAGE_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_MESSAGE_FILE_EXTENSIONS = [
  'pdf', 'doc', 'docx', 'odt', 'rtf', 'txt',
  'xls', 'xlsx', 'csv', 'ppt', 'pptx',
  'jpg', 'jpeg', 'png'
];

function getFileExtension(name) {
  const parts = (name || '').split('.');
  return parts.length > 1 ? parts.pop().toLowerCase() : '';
}

function isAllowedMessageFile(file) {
  return ALLOWED_MESSAGE_FILE_EXTENSIONS.includes(getFileExtension(file.name));
}

// Faz upload de um arquivo anexado ao bucket do Supabase Storage e devolve
// os metadados para salvar junto da mensagem.
async function uploadMessageFile(file) {
  if (!messagingAvailable()) return { ok: false, message: 'Esse recurso precisa de uma conta na nuvem para funcionar.' };
  if (!file) return { ok: false, message: 'Nenhum arquivo selecionado.' };
  if (file.size > MAX_MESSAGE_FILE_SIZE) return { ok: false, message: 'Arquivo muito grande (máximo 10MB).' };
  if (!isAllowedMessageFile(file)) return { ok: false, message: 'Tipo de arquivo não permitido. Envie PDF, Word, texto, planilha, apresentação ou imagem.' };

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const path = `${currentUserId}/${Date.now()}-${safeName}`;

  const { error: uploadError } = await supabaseClient.storage.from(MESSAGE_FILES_BUCKET).upload(path, file, { upsert: false });
  if (uploadError) { console.error(uploadError); return { ok: false, message: 'Não foi possível enviar o arquivo. Tente novamente.' }; }

  const { data } = supabaseClient.storage.from(MESSAGE_FILES_BUCKET).getPublicUrl(path);
  return { ok: true, url: data.publicUrl, name: file.name, type: file.type || getFileExtension(file.name), size: file.size };
}

// ---------- Personalidades e histórico do chat com IA ----------
// Mesmo padrão do perfil/progresso: com Supabase configurado, sincroniza
// entre dispositivos; sem Supabase, cai para localStorage (só naquele
// aparelho). Antes disso, ambos viviam só no localStorage — por isso um
// personagem/conversa criado no celular não aparecia no desktop e vice-versa.

function aiChatHistoryLocalKey(personaId) { return 'aiChatHistory_' + personaId; }

async function getAiChatPersonas() {
  if (useSupabase) {
    if (!currentUserId) return [];
    const { data, error } = await supabaseClient
      .from('ai_chat_personas').select('*').eq('user_id', currentUserId).order('created_at');
    if (error) { console.error(error); return []; }
    return (data || []).map(r => ({
      id: r.id, name: r.name, personality: r.personality,
      emoji: r.emoji, gender: r.gender, createdAt: r.created_at
    }));
  }
  try { return JSON.parse(localStorage.getItem('aiChatPersonas') || '[]') || []; }
  catch (e) { return []; }
}

async function addAiChatPersona(persona) {
  if (useSupabase) {
    if (!currentUserId) return;
    const row = {
      id: persona.id, user_id: currentUserId, name: persona.name,
      personality: persona.personality, emoji: persona.emoji,
      gender: persona.gender === 'male' ? 'male' : 'female',
      created_at: persona.createdAt || new Date().toISOString()
    };
    const { error } = await supabaseClient.from('ai_chat_personas').insert(row);
    if (error) console.error(error);
    return;
  }
  const list = await getAiChatPersonas();
  list.push(persona);
  localStorage.setItem('aiChatPersonas', JSON.stringify(list));
}

async function deleteAiChatPersona(id) {
  if (useSupabase) {
    if (!currentUserId) return;
    // O histórico (ai_chat_history) é apagado junto via "on delete cascade".
    const { error } = await supabaseClient.from('ai_chat_personas').delete().eq('id', id).eq('user_id', currentUserId);
    if (error) console.error(error);
    return;
  }
  const list = (await getAiChatPersonas()).filter(p => p.id !== id);
  localStorage.setItem('aiChatPersonas', JSON.stringify(list));
  localStorage.removeItem(aiChatHistoryLocalKey(id));
}

async function getAiChatHistoryFor(personaId) {
  if (useSupabase) {
    if (!currentUserId) return [];
    const { data, error } = await supabaseClient
      .from('ai_chat_history').select('messages').eq('user_id', currentUserId).eq('persona_id', personaId).maybeSingle();
    if (error) { console.error(error); return []; }
    return (data && data.messages) || [];
  }
  try { return JSON.parse(localStorage.getItem(aiChatHistoryLocalKey(personaId)) || '[]') || []; }
  catch (e) { return []; }
}

async function saveAiChatHistoryFor(personaId, hist) {
  if (useSupabase) {
    if (!currentUserId) return;
    const row = { user_id: currentUserId, persona_id: personaId, messages: hist, updated_at: new Date().toISOString() };
    const { error } = await supabaseClient.from('ai_chat_history').upsert(row, { onConflict: 'user_id,persona_id' });
    if (error) console.error(error);
    return;
  }
  localStorage.setItem(aiChatHistoryLocalKey(personaId), JSON.stringify(hist));
}

// Retorna a conversa do aluno logado, mais antiga primeiro.
async function getMyMessages() {
  if (!messagingAvailable()) return [];
  const { data, error } = await supabaseClient
    .from('messages')
    .select('*')
    .eq('user_id', currentUserId)
    .order('created_at', { ascending: true });
  if (error) { console.error(error); return []; }
  return data || [];
}

// Envia uma mensagem do aluno para o professor. `file`, se passado (um
// objeto File do input), é enviado como anexo — pode ir sozinho, sem texto.
async function sendMessageToTeacher(body, file) {
  if (!messagingAvailable()) return { ok: false, message: 'Esse recurso precisa de uma conta na nuvem para funcionar.' };
  const text = (body || '').trim();
  if (!text && !file) return { ok: false, message: 'Escreva algo ou anexe um arquivo antes de enviar.' };

  let fileData = null;
  if (file) {
    const uploadResult = await uploadMessageFile(file);
    if (!uploadResult.ok) return uploadResult;
    fileData = uploadResult;
  }

  const { error } = await supabaseClient.from('messages').insert({
    user_id: currentUserId,
    sender: 'student',
    body: text,
    file_url: fileData ? fileData.url : null,
    file_name: fileData ? fileData.name : null,
    file_type: fileData ? fileData.type : null,
    file_size: fileData ? fileData.size : null
  });
  if (error) { console.error(error); return { ok: false, message: 'Não foi possível enviar. Tente novamente.' }; }
  return { ok: true };
}

// ---------- Web Push subscriptions ----------

async function savePushSubscription(subscription) {
  if (!subscription || !subscription.endpoint) return { ok: false };
  const json = typeof subscription.toJSON === 'function' ? subscription.toJSON() : subscription;
  const endpoint = json.endpoint;
  const p256dh = json.keys && json.keys.p256dh;
  const auth = json.keys && json.keys.auth;
  if (!endpoint || !p256dh || !auth) return { ok: false, message: 'Subscription inválida.' };

  // Sempre guarda local (funciona sem Supabase)
  try {
    localStorage.setItem('bobcat_push_subscription', JSON.stringify({ endpoint, keys: { p256dh, auth } }));
  } catch (e) { /* ignore quota */ }

  if (!useSupabase || !supabaseClient || !currentUserId) {
    return { ok: true, localOnly: true };
  }

  const row = {
    user_id: currentUserId,
    endpoint,
    p256dh,
    auth,
    user_agent: (typeof navigator !== 'undefined' && navigator.userAgent) ? navigator.userAgent.slice(0, 300) : null,
    reminder_times: getLocalPushReminderTimes(),
    updated_at: new Date().toISOString()
  };

  const { error } = await supabaseClient
    .from('push_subscriptions')
    .upsert(row, { onConflict: 'endpoint' });
  if (error) {
    console.error('savePushSubscription:', error);
    return { ok: false, message: error.message };
  }
  return { ok: true };
}

async function removePushSubscription(endpoint) {
  try { localStorage.removeItem('bobcat_push_subscription'); } catch (e) { /* ignore */ }
  if (!useSupabase || !supabaseClient || !endpoint) return { ok: true };
  const { error } = await supabaseClient
    .from('push_subscriptions')
    .delete()
    .eq('endpoint', endpoint);
  if (error) console.error('removePushSubscription:', error);
  return { ok: true };
}

function getLocalPushSubscription() {
  try {
    return JSON.parse(localStorage.getItem('bobcat_push_subscription') || 'null');
  } catch (e) {
    return null;
  }
}

// Horários (formato 'HH:MM', em UTC) em que o aluno quer receber o lembrete
// de prática. Fica atrelado à subscription deste aparelho (coluna
// reminder_times em push_subscriptions). Sem Supabase, fica só local — nesse
// modo não há como o servidor de push saber do horário escolhido, então o
// lembrete automático (cron) não chega; só o botão de teste funciona.
async function savePushReminderTimes(times) {
  const list = Array.isArray(times) ? times : [];
  try { localStorage.setItem('bobcat_push_reminder_times', JSON.stringify(list)); } catch (e) { /* ignore quota */ }

  if (!useSupabase || !supabaseClient || !currentUserId) return { ok: true, localOnly: true };

  const local = getLocalPushSubscription();
  if (!local || !local.endpoint) {
    return { ok: false, message: 'Ative os lembretes de prática antes de escolher os horários.' };
  }

  const { error } = await supabaseClient
    .from('push_subscriptions')
    .update({ reminder_times: list, updated_at: new Date().toISOString() })
    .eq('endpoint', local.endpoint);
  if (error) {
    console.error('savePushReminderTimes:', error);
    return { ok: false, message: error.message };
  }
  return { ok: true };
}

function getLocalPushReminderTimes() {
  try {
    const list = JSON.parse(localStorage.getItem('bobcat_push_reminder_times') || '[]');
    return Array.isArray(list) ? list : [];
  } catch (e) {
    return [];
  }
}

// ---------- Baixar meus dados (LGPD — direito de acesso/portabilidade) ----------
// Junta tudo que o app guarda sobre o aluno: perfil, progresso das lições,
// personalidades de IA + histórico de conversas, mensagens trocadas com o
// professor e as preferências de notificação/lembrete. Usado pelo botão
// "Baixar meus dados" na tela de Perfil.
async function exportMyData() {
  const profile = await getProfile();
  const progress = await getProgress();
  const personas = await getAiChatPersonas();

  const historico = {};
  for (const p of personas) {
    historico[p.id] = await getAiChatHistoryFor(p.id);
  }

  const mensagens = messagingAvailable() ? await getMyMessages() : [];

  let pushSubscriptions = [];
  if (useSupabase && supabaseClient && currentUserId) {
    const { data, error } = await supabaseClient
      .from('push_subscriptions')
      .select('endpoint, user_agent, reminder_times, created_at, updated_at, last_reminder_sent_at')
      .eq('user_id', currentUserId);
    if (error) console.error('exportMyData (push_subscriptions):', error);
    pushSubscriptions = data || [];
  } else {
    const local = getLocalPushSubscription();
    if (local && local.endpoint) {
      pushSubscriptions = [{ endpoint: local.endpoint, reminder_times: getLocalPushReminderTimes() }];
    }
  }

  return {
    gerado_em: new Date().toISOString(),
    modo_de_armazenamento: useSupabase ? 'nuvem (Supabase)' : 'somente neste aparelho (localStorage)',
    perfil: profile,
    progresso_das_licoes: progress,
    gamificacao: await getGamification(),
    personalidades_de_ia: personas,
    historico_de_conversas_com_ia: historico,
    mensagens_com_o_professor: mensagens,
    notificacoes_push: pushSubscriptions
  };
}

// ---------- Excluir minha conta (LGPD — direito de eliminação) ----------
// Apaga por completo os dados do aluno. Com Supabase: chama a função
// serverless /api/delete-account, que remove o usuário do Supabase Auth —
// e, por causa dos "on delete cascade" definidos em schema.sql, isso já
// arrasta junto o perfil, progresso, mensagens, personalidades de IA,
// histórico de conversas, notificações push e a senha de zerar progresso.
// Sem Supabase, apaga só o que está salvo neste aparelho (localStorage).
async function deleteMyAccount() {
  if (!useSupabase || !supabaseClient || !currentUserId) {
    clearAllLocalAppData();
    return { ok: true, localOnly: true };
  }

  const { data: { session } } = await supabaseClient.auth.getSession();
  const accessToken = session && session.access_token;
  if (!accessToken) {
    return { ok: false, message: 'Sessão expirada. Faça login de novo e tente outra vez.' };
  }

  try {
    const res = await fetch('/api/delete-account', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + accessToken }
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { ok: false, message: result.error || 'Não foi possível excluir a conta. Tente novamente.' };
    }
  } catch (e) {
    console.error('deleteMyAccount:', e);
    return { ok: false, message: 'Erro de conexão ao excluir a conta. Verifique a internet e tente de novo.' };
  }

  currentUserId = null;
  clearAllLocalAppData();
  return { ok: true };
}

// Apaga tudo que o app guarda neste aparelho (localStorage): perfil e
// progresso locais, personalidades de IA e conversas, cache de vocabulário,
// preferências de lembrete/push etc. Usado ao excluir a conta (e, em modo
// sem Supabase, é a própria exclusão — não existe outro lugar pra apagar).
function clearAllLocalAppData() {
  try {
    const prefixes = ['bobcat_', 'aiChatPersonas', 'aiChatTtsEnabled', 'aiChatHistory_', 'vocabCache_'];
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && prefixes.some(p => k === p || k.startsWith(p))) keys.push(k);
    }
    keys.forEach(k => localStorage.removeItem(k));
  } catch (e) { /* ignore */ }
}

// ---------- Resumo da última conversa com a IA (só para personalizar o lembrete) ----------

const AI_LAST_CONVO_MAX_MESSAGES = 8; // suficiente pra dar contexto ao Gemini sem pesar o payload
const AI_LAST_CONVO_MAX_CHARS = 400; // por mensagem, corta mensagens muito longas

// Chamado depois de cada turno do chat com a IA. Só faz algo em modo Supabase
// (é o único jeito de o servidor de push, que não vê o localStorage do aluno,
// saber do que foi a última conversa). Falha em silêncio: isso é só um "plus"
// do lembrete, nunca deve travar o chat em si.
async function syncAiChatLastConversation(persona, history) {
  if (!useSupabase || !supabaseClient || !currentUserId) return;
  if (!persona || !Array.isArray(history) || history.length === 0) return;

  const recent = history
    .slice(-AI_LAST_CONVO_MAX_MESSAGES)
    .filter(m => m && typeof m.text === 'string' && (m.role === 'user' || m.role === 'model'))
    .map(m => ({ role: m.role, text: m.text.slice(0, AI_LAST_CONVO_MAX_CHARS) }));
  if (recent.length === 0) return;

  const row = {
    user_id: currentUserId,
    persona_name: (persona.name || '').slice(0, 60),
    persona_emoji: (persona.emoji || '').slice(0, 10),
    persona_gender: persona.gender === 'male' ? 'male' : 'female',
    messages: recent,
    updated_at: new Date().toISOString()
  };

  try {
    const { error } = await supabaseClient
      .from('ai_chat_last_conversation')
      .upsert(row, { onConflict: 'user_id' });
    if (error) console.error('syncAiChatLastConversation:', error);
  } catch (e) {
    console.error('syncAiChatLastConversation:', e);
  }
}

// ---------- Trilha de Erro (explicações da IA para questões erradas) ----------
// Aparece na tela de "Finalizar lição" quando o aluno não atinge a nota
// mínima: pega as questões marcadas como erradas por collectLessonAnswers()
// e deixa o aluno pedir, uma a uma, uma explicação curta da IA — e depois,
// se quiser, mais alguns exemplos daquele mesmo ponto. Cada card só chama a
// IA quando o aluno pede (nada é gerado automaticamente), e cada card só
// permite pedir "mais exemplos" duas vezes, pra manter o custo baixo.

const ERROR_TRAIL_MAX_ITEMS = 4;
const ERROR_TRAIL_MAX_MORE_CLICKS = 2;
let errorTrailStylesInjected = false;

function injectErrorTrailStyles() {
  if (errorTrailStylesInjected) return;
  errorTrailStylesInjected = true;
  const style = document.createElement('style');
  style.textContent = `
    .bcerr-wrap{margin-top:22px;text-align:left;font-family:"Inter","Segoe UI",sans-serif}
    .bcerr-title{font-size:14px;font-weight:700;color:#3a3226;margin-bottom:10px;text-align:center}
    .bcerr-card{background:#fff;border:1px solid #EBC9AE;border-radius:14px;padding:14px 16px;margin-bottom:10px;box-shadow:0 2px 10px rgba(180,120,80,.08)}
    .bcerr-q{font-size:13px;color:#2b2b2b;margin-bottom:8px;line-height:1.5}
    .bcerr-q b{color:#C0392B}
    .bcerr-btn{background:#D9793F;color:#fff;border:none;border-radius:99px;padding:7px 14px;font-size:12.5px;font-weight:700;cursor:pointer}
    .bcerr-btn:disabled{opacity:.6;cursor:default}
    .bcerr-btn.ghost{background:transparent;color:#D9793F;border:1px solid #D9793F;margin-top:8px}
    .bcerr-explain{font-size:13px;color:#2b2b2b;line-height:1.55;margin-top:10px;padding-top:10px;border-top:1px dashed #EBC9AE}
    .bcerr-examples{margin:8px 0 0;padding-left:18px}
    .bcerr-examples li{font-size:12.5px;color:#555;margin-bottom:4px;line-height:1.5}
    .bcerr-error{font-size:12.5px;color:#C0392B;margin-top:8px}
  `;
  document.head.appendChild(style);
}

async function callExplainError(payload) {
  const headers = { 'Content-Type': 'application/json' };
  try {
    const t = await getAccessToken();
    if (t) headers['Authorization'] = 'Bearer ' + t;
  } catch (e) { /* sem sessão */ }
  const res = await fetch('/api/explain-error', {
    method: 'POST',
    headers,
    body: JSON.stringify(payload)
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.error) throw new Error(data.error || 'Erro ao consultar a IA.');
  return data;
}

function renderErrorTrail(anchorEl, answers) {
  if (!anchorEl || !Array.isArray(answers)) return;
  const wrong = answers.filter(a => a && a.status === 'incorrect').slice(0, ERROR_TRAIL_MAX_ITEMS);
  if (wrong.length === 0) return;

  injectErrorTrailStyles();

  // Evita duplicar se o aluno clicar em "Finalizar" mais de uma vez
  const existing = anchorEl.parentNode.querySelector('.bcerr-wrap');
  if (existing) existing.remove();

  const wrap = document.createElement('div');
  wrap.className = 'bcerr-wrap';
  wrap.innerHTML = '<div class="bcerr-title">🔎 Vamos entender o que você errou?</div>';

  wrong.forEach(item => {
    const card = document.createElement('div');
    card.className = 'bcerr-card';

    const q = document.createElement('div');
    q.className = 'bcerr-q';
    q.innerHTML = escapeHtmlLite(item.question) +
      '<br><b>Sua resposta:</b> ' + escapeHtmlLite(item.studentAnswer) +
      (item.correctAnswer ? '<br><b>Resposta certa:</b> ' + escapeHtmlLite(item.correctAnswer) : '');
    card.appendChild(q);

    const btn = document.createElement('button');
    btn.className = 'bcerr-btn';
    btn.type = 'button';
    btn.textContent = '💡 Entender esse erro';

    const body = document.createElement('div');
    let moreClicks = 0;
    const shownExamples = [];

    async function loadExplanation() {
      btn.disabled = true;
      btn.textContent = 'Pensando...';
      try {
        const profile = await getProfile().catch(() => null);
        const level = (profile && profile.level) || 'A1';
        const data = await callExplainError({
          mode: 'explain',
          question: item.question,
          studentAnswer: item.studentAnswer,
          correctAnswer: item.correctAnswer,
          level,
          lessonTitle: document.title
        });
        renderExplanationBody(data, level);
        btn.remove();
      } catch (err) {
        btn.disabled = false;
        btn.textContent = '💡 Entender esse erro';
        const errEl = document.createElement('div');
        errEl.className = 'bcerr-error';
        errEl.textContent = '⚠️ ' + (err.message || 'Não foi possível consultar a IA agora.');
        body.appendChild(errEl);
      }
    }

    function renderExplanationBody(data, level) {
      const explainEl = document.createElement('div');
      explainEl.className = 'bcerr-explain';
      explainEl.textContent = data.explanation || '';
      body.appendChild(explainEl);

      if (data.examples && data.examples.length) {
        const ul = document.createElement('ul');
        ul.className = 'bcerr-examples';
        data.examples.forEach(ex => {
          shownExamples.push(ex);
          const li = document.createElement('li');
          li.textContent = ex;
          ul.appendChild(li);
        });
        body.appendChild(ul);
      }

      if (moreClicks < ERROR_TRAIL_MAX_MORE_CLICKS) {
        const moreBtn = document.createElement('button');
        moreBtn.className = 'bcerr-btn ghost';
        moreBtn.type = 'button';
        moreBtn.textContent = '➕ Mais exemplos';
        moreBtn.onclick = async () => {
          moreBtn.disabled = true;
          moreBtn.textContent = 'Gerando...';
          try {
            const data2 = await callExplainError({
              mode: 'more',
              question: item.question,
              studentAnswer: item.studentAnswer,
              correctAnswer: item.correctAnswer,
              level,
              lessonTitle: document.title,
              previousExamples: shownExamples
            });
            moreClicks++;
            moreBtn.remove();
            renderExplanationBody(data2, level);
          } catch (err) {
            moreBtn.disabled = false;
            moreBtn.textContent = '➕ Mais exemplos';
          }
        };
        body.appendChild(moreBtn);
      }
    }

    btn.onclick = loadExplanation;
    card.appendChild(btn);
    card.appendChild(body);
    wrap.appendChild(card);
  });

  if (answers.filter(a => a && a.status === 'incorrect').length > ERROR_TRAIL_MAX_ITEMS) {
    const note = document.createElement('div');
    note.style.cssText = 'font-size:12px;color:#8a8171;text-align:center;margin-top:2px';
    note.textContent = 'Mostrando as primeiras ' + ERROR_TRAIL_MAX_ITEMS + ' questões erradas.';
    wrap.appendChild(note);
  }

  anchorEl.parentNode.insertBefore(wrap, anchorEl.nextSibling);
}

function escapeHtmlLite(str) {
  const div = document.createElement('div');
  div.textContent = str == null ? '' : String(str);
  return div.innerHTML;
}

// ---------- Exigir login para acessar lições ----------
// Com Supabase configurado, o aluno PRECISA estar logado para abrir uma
// página de lição — sem isso, dava pra estudar "anônimo" com o progresso
// preso só naquele aparelho (e sujeito a sumir se o navegador limpar
// dados). Esconde a página imediatamente (evita mostrar a lição por um
// instante antes de redirecionar) e só revela o conteúdo depois de
// confirmar a sessão.
(function () {
  if (/\/lessons\//.test(window.location.pathname)) {
    document.documentElement.style.visibility = 'hidden';
  }
})();

async function guardLessonRequiresLogin() {
  await initDataLayer();
  if (!/\/lessons\//.test(window.location.pathname)) return;

  if (!useSupabase || currentUserId) {
    // Sem Supabase configurado (app 100% local) ou já logado: libera a tela.
    document.documentElement.style.visibility = '';
    return;
  }

  // Não logado: guarda qual lição o aluno tentou abrir para reabri-la
  // automaticamente depois do login, e manda para a tela de login.
  try {
    const target = window.location.pathname.split('/').pop() + window.location.search;
    sessionStorage.setItem('bobcat_pending_lesson', target);
  } catch (e) { /* ignore */ }
  window.location.replace('../index.html?needLogin=1');
}
guardLessonRequiresLogin();

// ---------- Auto-inicialização ----------
// Dispara a conexão com o Supabase assim que este arquivo carrega, em vez de
// depender de cada página de lição chamar initDataLayer() manualmente. Sem
// isso, páginas de lição que não chamavam initDataLayer() explicitamente
// ficavam presas no modo "local" (useSupabase = false) mesmo com o aluno
// logado numa conta na nuvem: o progresso era salvo só no localStorage do
// navegador, e ao voltar para o app principal (que lê do Supabase) a lição
// parecia ter "sumido"/zerado. initDataLayer() é idempotente, então isso é
// seguro mesmo em páginas (como app.js) que também a chamam explicitamente.
initDataLayer();
