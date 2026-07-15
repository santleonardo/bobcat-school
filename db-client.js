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

let supabaseClient = null;
let currentUserId = null;
let useSupabase = false;      // Supabase está configurado (config.js preenchido)
let dataLayerReady = false;

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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

// Retorna { ok: true } ou { ok: false, message: '...', needsConfirmation: true|false }
async function signUpStudent(email, password) {
  if (!useSupabase) return { ok: false, message: 'Cadastro só está disponível com Supabase configurado.' };
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
  if (!useSupabase) return { ok: false, message: 'Login só está disponível com Supabase configurado.' };
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
  if (!useSupabase) return { ok: false, message: 'Só disponível com Supabase configurado.' };
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

// ---------- Perfil ----------

async function getProfile() {
  if (useSupabase) {
    if (!currentUserId) return null;
    const { data, error } = await supabaseClient
      .from('profiles').select('*').eq('id', currentUserId).maybeSingle();
    if (error) { console.error(error); return null; }
    if (!data) return null;
    // Mapeia as colunas snake_case do Supabase para camelCase do app.
    return {
      name: data.name,
      avatar: data.avatar,
      level: data.level,
      createdAt: data.created_at,
      levelTestScore: data.level_test_score !== undefined && data.level_test_score !== null
        ? data.level_test_score : null,
      levelTestTotal: data.level_test_total !== undefined && data.level_test_total !== null
        ? data.level_test_total : null,
      levelTestDate: data.level_test_date || null,
      levelTestAnswers: Array.isArray(data.level_test_answers) ? data.level_test_answers : null
    };
  }
  const raw = localStorage.getItem(PROFILE_KEY);
  return raw ? JSON.parse(raw) : null;
}

async function saveProfile(profile) {
  if (useSupabase) {
    if (!currentUserId) return;
    // Mantém compatível com o schema: só envia as colunas que existem na tabela.
    // level_test_score / level_test_total / level_test_date podem não existir
    // ainda em projetos Supabase antigos — quem cria as colunas é o schema.sql.
    const row = {
      id: currentUserId,
      name: profile.name,
      avatar: profile.avatar,
      level: profile.level
    };
    if (profile.levelTestScore !== undefined && profile.levelTestScore !== null) {
      row.level_test_score = profile.levelTestScore;
    }
    if (profile.levelTestTotal !== undefined && profile.levelTestTotal !== null) {
      row.level_test_total = profile.levelTestTotal;
    }
    if (profile.levelTestDate) {
      row.level_test_date = profile.levelTestDate;
    }
    if (profile.levelTestAnswers !== undefined && profile.levelTestAnswers !== null) {
      row.level_test_answers = profile.levelTestAnswers;
    }
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
  const pct = total > 0 ? (correct / total) * 100 : 0;
  const completed = pct >= PASSING_PCT;

  if (useSupabase) {
    if (!currentUserId) return { completed, pct };
    const row = {
      user_id: currentUserId,
      lesson_id: lessonId,
      completed: completed,
      correct: correct,
      total: total,
      last_attempt: new Date().toISOString()
    };
    const { error } = await supabaseClient.from('progress').upsert(row, { onConflict: 'user_id,lesson_id' });
    if (error) console.error(error);
    return { completed, pct };
  }
  const progress = await getProgress();
  progress[lessonId] = { completed, correct, total, lastAttempt: new Date().toISOString() };
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  return { completed, pct };
}

// Fluxo compartilhado de "finalizar lição", usado por todas as páginas de lição.
// kind: 'correct' (exercícios com gabarito, ex: "Você acertou X de Y") ou
//       'filled' (lições de prática sem correção automática, ex: "Você preencheu X de Y").
// Retorna true se a nota mínima (85%) foi atingida (e portanto a lição foi
// marcada como concluída e o app vai redirecionar); false se o aluno precisa
// tentar novamente (nesse caso o botão de finalizar continua liberado).
async function handleLessonFinish(lessonId, correct, total, kind) {
  const msg = document.getElementById('finishMessage');
  if (msg) {
    msg.style.display = 'block';
    msg.style.color = '#888';
    msg.textContent = 'Salvando progresso...';
  }

  await initDataLayer();
  const { completed, pct } = await saveLessonProgressData(lessonId, correct, total);
  const roundedPct = Math.round(pct);

  const cloudNote = isUsingCloud() ? ' (sincronizado na nuvem ☁️)' : ' (salvo neste navegador 💾)';
  const verb = kind === 'filled' ? 'preencheu' : 'acertou';
  const noun = kind === 'filled' ? 'exercícios' : (total === 1 ? 'questão' : 'questões');

  if (!msg) return completed;

  if (completed) {
    msg.style.color = '#1e6b40';
    msg.textContent = '🎉 Parabéns! Você ' + verb + ' ' + correct + ' de ' + total + ' ' + noun +
      ' (' + roundedPct + '%) — lição concluída' + cloudNote + '. Voltando ao app...';
    setTimeout(() => { window.location.href = '../index.html'; }, 2600);
  } else {
    msg.style.color = '#C0392B';
    msg.textContent = '📌 Você ' + verb + ' ' + correct + ' de ' + total + ' ' + noun +
      ' (' + roundedPct + '%). É preciso pelo menos ' + PASSING_PCT + '% (nota 8,5) para concluir a lição e desbloquear a próxima. Revise as respostas e tente novamente!' + cloudNote;
  }

  return completed;
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
