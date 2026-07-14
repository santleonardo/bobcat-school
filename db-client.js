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

// Domínio "falso" usado para transformar o nome de usuário do aluno
// em um e-mail válido para o Supabase Auth (o aluno nunca vê isso).
const AUTH_FAKE_DOMAIN = 'bobcat.app';

let supabaseClient = null;
let currentUserId = null;
let useSupabase = false;      // Supabase está configurado (config.js preenchido)
let dataLayerReady = false;

function usernameToEmail(username) {
  const clean = username.trim().toLowerCase().replace(/[^a-z0-9._-]/g, '');
  return clean + '@' + AUTH_FAKE_DOMAIN;
}

async function initDataLayer() {
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
}

// ---------- Login / Cadastro / Logout ----------

function isUsingCloud() {
  return useSupabase;
}

function isLoggedIn() {
  return useSupabase ? !!currentUserId : true; // sem Supabase, "logado" sempre (localStorage)
}

// Retorna { ok: true } ou { ok: false, message: '...' }
async function signUpStudent(username, password) {
  if (!useSupabase) return { ok: false, message: 'Cadastro só está disponível com Supabase configurado.' };
  if (!username || username.trim().length < 3) return { ok: false, message: 'O usuário precisa ter pelo menos 3 caracteres.' };
  if (!password || password.length < 6) return { ok: false, message: 'A senha precisa ter pelo menos 6 caracteres.' };

  const email = usernameToEmail(username);
  const { data, error } = await supabaseClient.auth.signUp({ email, password });
  if (error) {
    if (error.message && error.message.toLowerCase().includes('already registered')) {
      return { ok: false, message: 'Esse usuário já existe. Tente fazer login.' };
    }
    return { ok: false, message: error.message };
  }
  currentUserId = data.user ? data.user.id : (data.session ? data.session.user.id : null);
  if (!currentUserId) {
    return { ok: false, message: 'Conta criada, mas não foi possível entrar automaticamente. Tente fazer login.' };
  }
  return { ok: true };
}

async function signInStudent(username, password) {
  if (!useSupabase) return { ok: false, message: 'Login só está disponível com Supabase configurado.' };
  const email = usernameToEmail(username);
  const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
  if (error) {
    return { ok: false, message: 'Usuário ou senha incorretos.' };
  }
  currentUserId = data.user.id;
  return { ok: true };
}

async function signOutStudent() {
  if (useSupabase && supabaseClient) {
    await supabaseClient.auth.signOut();
  }
  currentUserId = null;
}

// ---------- Perfil ----------

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
  if (useSupabase) {
    if (!currentUserId) return {};
    const { data, error } = await supabaseClient
      .from('progress').select('*').eq('user_id', currentUserId);
    if (error) { console.error(error); return {}; }
    const map = {};
    (data || []).forEach(row => {
      map[row.lesson_id] = {
        completed: row.completed,
        correct: row.correct,
        total: row.total,
        lastAttempt: row.last_attempt
      };
    });
    return map;
  }
  const raw = localStorage.getItem(PROGRESS_KEY);
  return raw ? JSON.parse(raw) : {};
}

async function saveLessonProgressData(lessonId, correct, total) {
  if (useSupabase) {
    if (!currentUserId) return;
    const row = {
      user_id: currentUserId,
      lesson_id: lessonId,
      completed: true,
      correct: correct,
      total: total,
      last_attempt: new Date().toISOString()
    };
    const { error } = await supabaseClient.from('progress').upsert(row, { onConflict: 'user_id,lesson_id' });
    if (error) console.error(error);
    return;
  }
  const progress = await getProgress();
  progress[lessonId] = { completed: true, correct, total, lastAttempt: new Date().toISOString() };
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

async function resetAllProgress() {
  if (useSupabase) {
    if (!currentUserId) return;
    const { error } = await supabaseClient.from('progress').delete().eq('user_id', currentUserId);
    if (error) console.error(error);
    return;
  }
  localStorage.setItem(PROGRESS_KEY, JSON.stringify({}));
}
