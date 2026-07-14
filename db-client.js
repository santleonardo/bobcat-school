// ============================================================
// Camada de dados do app Bobcat.
// Se o Supabase estiver configurado (config.js), os dados ficam
// na nuvem e sincronizam entre dispositivos. Caso contrário,
// tudo cai automaticamente para localStorage (funciona offline
// e sem nenhuma configuração).
// ============================================================

const PROFILE_KEY = 'bobcat_profile';
const PROGRESS_KEY = 'bobcat_progress';

let supabaseClient = null;
let currentUserId = null;
let useSupabase = false;
let dataLayerReady = false;

async function initDataLayer() {
  const cfg = window.SUPABASE_CONFIG;
  const configured = cfg && cfg.url && cfg.anonKey && !cfg.url.includes('SEU-PROJETO');

  if (configured && window.supabase) {
    try {
      supabaseClient = window.supabase.createClient(cfg.url, cfg.anonKey);

      let { data: { session } } = await supabaseClient.auth.getSession();
      if (!session) {
        const { data, error } = await supabaseClient.auth.signInAnonymously();
        if (error) throw error;
        session = data.session;
      }
      currentUserId = session.user.id;
      useSupabase = true;
      console.log('Conectado ao Supabase. Progresso será sincronizado na nuvem.');
    } catch (e) {
      console.warn('Não foi possível conectar ao Supabase — usando armazenamento local.', e);
      useSupabase = false;
    }
  } else {
    useSupabase = false;
  }
  dataLayerReady = true;
}

// ---------- Perfil ----------

async function getProfile() {
  if (useSupabase) {
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
    const { error } = await supabaseClient.from('progress').delete().eq('user_id', currentUserId);
    if (error) console.error(error);
    return;
  }
  localStorage.setItem(PROGRESS_KEY, JSON.stringify({}));
}

function isUsingCloud() {
  return useSupabase;
}
