// ============================================================
// Bobcat Language School — App PWA
// Perfil e progresso vêm do db-client.js (Supabase ou localStorage).
// ============================================================

// Catálogo de lições. Para adicionar uma nova lição, basta
// incluir um novo objeto aqui e criar o arquivo em /lessons.
const LESSONS = [
  {
    id: 'nivelamento',
    name: 'Teste de Nivelamento',
    level: 'Introdutório',
    icon: '🎯',
    description: 'Descubra seu nível de inglês (A1–C2) com teste adaptativo — diferente a cada tentativa',
    url: 'lessons/nivelamento.html',
    totalQuestions: 30
  },
  {
    id: 'pronuncia-essencial',
    name: 'Pronúncia Essencial do Inglês',
    level: 'Introdutório',
    icon: '🔤',
    description: 'Comece por aqui: alfabeto, vogais, consoantes e combinações mais comuns',
    url: 'lessons/pronuncia-essencial.html',
    totalQuestions: 15 // 5 (parte1) + 5 (parte2) + 5 (parte3)
  },
  {
    id: 'verb-to-be',
    name: 'Verb To Be',
    level: 'A1',
    icon: '📘',
    description: 'am, is, are — afirmativas, negativas e perguntas',
    url: 'lessons/verb-to-be.html',
    totalQuestions: 21 // 8 (parte1) + 6 (parte2) + 7 (parte3)
  },
  {
    id: 'saudacoes-apresentacoes',
    name: 'Saudações e Apresentações',
    level: 'A1',
    icon: '👋',
    description: 'Greetings, introductions e diálogos com áudio',
    url: 'lessons/saudacoes-apresentacoes.html',
    totalQuestions: 17 // 5 (parte1) + 3 (parte2) + 3 (parte3) + 4 (parte4) + 2 (parte5)
  },
  {
    id: 'licao-2-perguntas-artigos',
    name: 'Lição 2 — Fazendo Perguntas e Apresentando Coisas',
    level: 'A1',
    icon: '❓',
    description: 'Perguntas com Wh- words e o uso de a, an, the',
    url: 'lessons/licao-2-perguntas-artigos.html',
    totalQuestions: 5 // preenchimento de exercícios (prática, sem correção automática)
  },
  {
    id: 'licao-3-revisao-perguntas',
    name: 'Lição 3 — Revisando e Praticando: Quem é Você? O Que é Isso?',
    level: 'A1',
    icon: '🔁',
    description: 'Revisão das lições 1 e 2 com prática de diálogos',
    url: 'lessons/licao-3-revisao-perguntas.html',
    totalQuestions: 11 // preenchimento de exercícios (prática, sem correção automática)
  },
  {
    id: 'licao-4-preposicoes',
    name: 'Lição 4 — Preposições em Ação: Onde? Com Quem? Como?',
    level: 'A1',
    icon: '📍',
    description: 'Preposições: onde, com quem e como',
    url: 'lessons/licao-4-preposicoes.html',
    totalQuestions: 7 // preenchimento de exercícios (prática, sem correção automática)
  },
  {
    id: 'licao-5-posse',
    name: 'Lição 5 — O Que É Isso? De Quem É?',
    level: 'A1',
    icon: '🎒',
    description: 'O que é isso e de quem é: posse em inglês',
    url: 'lessons/licao-5-posse.html',
    totalQuestions: 12 // preenchimento de exercícios (prática, sem correção automática)
  },
  {
    id: 'licao-6-here-there',
    name: 'Lição 6 — Aqui e Ali: Localização e Posição',
    level: 'A1',
    icon: '📌',
    description: 'Localização, posição e phrasal verbs básicos',
    url: 'lessons/licao-6-here-there.html',
    totalQuestions: 7 // preenchimento de exercícios (prática, sem correção automática)
  },
  {
    id: 'licao-8-to-be-passado',
    name: 'Lição 8 — Verbo To Be no Passado: Como Era e Onde Estava?',
    level: 'A1',
    icon: '⏳',
    description: 'O verbo to be no passado: was e were',
    url: 'lessons/licao-8-to-be-passado.html',
    totalQuestions: 8 // preenchimento de exercícios (prática, sem correção automática)
  },
  {
    id: 'licao-9-revisao-completa',
    name: 'Lição 9 — Revisão Completa: Tudo que Aprendemos Até Aqui!',
    level: 'A1',
    icon: '📚',
    description: 'Revisão completa das lições anteriores',
    url: 'lessons/licao-9-revisao-completa.html',
    totalQuestions: 26 // preenchimento de exercícios (prática, sem correção automática)
  },
  {
    id: 'licao-10-do-does-to-for',
    name: 'Lição 10 — Verbos Essenciais, Perguntas com DO/DOES, e o Uso de TO e FOR',
    level: 'A1',
    icon: '🔧',
    description: 'Verbos essenciais, DO/DOES, TO e FOR',
    url: 'lessons/licao-10-do-does-to-for.html',
    totalQuestions: 20 // preenchimento de exercícios (prática, sem correção automática)
  },
  {
    id: 'licao-11-object-possessive-pronouns',
    name: 'Lesson 11 — People, Objects and Possession',
    level: 'A1',
    icon: '👥',
    description: 'Pronomes objetos, possessivos e mais de 20 verbos',
    url: 'lessons/licao-11-object-possessive-pronouns.html',
    totalQuestions: 14 // preenchimento de exercícios (prática, sem correção automática)
  }
  // próximas lições entram aqui, ex:
  // { id: 'present-simple', name: 'Present Simple', level: 'A1', icon: '📗', url: 'lessons/present-simple.html', totalQuestions: 15 }
];

// ---------- Navegação entre telas ----------

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
  document.getElementById('screen-' + id).classList.remove('hidden');

  document.body.classList.toggle('on-auth-screen', id === 'auth');

  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  const navBtn = document.querySelector('.nav-btn[data-screen="' + id + '"]');
  if (navBtn) navBtn.classList.add('active');

  if (id === 'home') renderHome();
  if (id === 'profile-view') renderProfileView();
}

// ---------- Tela de login / cadastro ----------

let authMode = 'login'; // 'login' | 'signup'

function setAuthMode(mode) {
  authMode = mode;
  document.getElementById('tab-login').classList.toggle('active', mode === 'login');
  document.getElementById('tab-signup').classList.toggle('active', mode === 'signup');
  document.getElementById('auth-signup-extra').classList.toggle('hidden', mode === 'login');
  document.getElementById('auth-title').textContent = mode === 'login' ? 'Bem-vindo(a) de volta!' : 'Crie sua conta gratuita';
  document.getElementById('btn-auth-submit').textContent = mode === 'login' ? 'Entrar' : 'Criar conta';
  document.getElementById('btn-forgot-password').classList.toggle('hidden', mode !== 'login');
  document.getElementById('auth-error').classList.remove('show');
  document.getElementById('auth-success').classList.remove('show');
}

function togglePasswordVisibility(inputId, btnId) {
  const input = document.getElementById(inputId);
  const btn = document.getElementById(btnId);
  const show = input.type === 'password';
  input.type = show ? 'text' : 'password';
  btn.textContent = show ? '🙈' : '👁';
  btn.setAttribute('aria-label', show ? 'Ocultar senha' : 'Mostrar senha');
}

function showAuthError(text) {
  const el = document.getElementById('auth-error');
  document.getElementById('auth-success').classList.remove('show');
  el.textContent = text;
  el.classList.toggle('show', !!text);
}

function showAuthSuccess(text) {
  const el = document.getElementById('auth-success');
  document.getElementById('auth-error').classList.remove('show');
  el.textContent = text;
  el.classList.toggle('show', !!text);
}

function setupAuthScreen() {
  document.getElementById('tab-login').addEventListener('click', () => setAuthMode('login'));
  document.getElementById('tab-signup').addEventListener('click', () => setAuthMode('signup'));

  document.getElementById('toggle-auth-password').addEventListener('click', () => {
    togglePasswordVisibility('auth-password', 'toggle-auth-password');
  });
  document.getElementById('toggle-auth-password-confirm').addEventListener('click', () => {
    togglePasswordVisibility('auth-password-confirm', 'toggle-auth-password-confirm');
  });

  document.getElementById('btn-auth-submit').addEventListener('click', async () => {
    const email = document.getElementById('auth-username').value.trim();
    const password = document.getElementById('auth-password').value;
    showAuthError('');
    showAuthSuccess('');

    if (!email || !password) {
      showAuthError('Preencha e-mail e senha.');
      return;
    }

    const btn = document.getElementById('btn-auth-submit');
    btn.disabled = true;

    if (authMode === 'signup') {
      const confirm = document.getElementById('auth-password-confirm').value;
      if (password !== confirm) {
        showAuthError('As senhas não coincidem.');
        btn.disabled = false;
        return;
      }
      btn.textContent = 'Criando conta...';
      const result = await signUpStudent(email, password);
      btn.disabled = false;
      btn.textContent = 'Criar conta';
      if (!result.ok) {
        if (result.needsConfirmation) {
          showAuthSuccess(result.message);
          setAuthModeKeepMessage('login');
        } else {
          showAuthError(result.message);
        }
        return;
      }
      await afterAuthSuccess();
    } else {
      btn.textContent = 'Entrando...';
      const result = await signInStudent(email, password);
      btn.disabled = false;
      btn.textContent = 'Entrar';
      if (!result.ok) { showAuthError(result.message); return; }
      await afterAuthSuccess();
    }
  });

  document.getElementById('btn-forgot-password').addEventListener('click', async () => {
    const email = document.getElementById('auth-username').value.trim();
    showAuthError('');
    showAuthSuccess('');

    if (!email) {
      showAuthError('Digite seu e-mail acima primeiro, depois clique em "Esqueci minha senha".');
      return;
    }
    const result = await resetPasswordForEmail(email);
    if (result.ok) showAuthSuccess(result.message);
    else showAuthError(result.message);
  });
}

// Troca de aba sem apagar a mensagem de sucesso (usado após cadastro que
// exige confirmação por e-mail, pra mostrar o aviso na aba de login).
function setAuthModeKeepMessage(mode) {
  const msg = document.getElementById('auth-success').textContent;
  setAuthMode(mode);
  showAuthSuccess(msg);
}

async function afterAuthSuccess() {
  document.getElementById('auth-username').value = '';
  document.getElementById('auth-password').value = '';
  const confirmField = document.getElementById('auth-password-confirm');
  if (confirmField) confirmField.value = '';

  const profile = await getProfile();
  if (profile) {
    enterApp();
  } else {
    showScreen('profile-setup');
  }
}

// ---------- Tela de criação de perfil ----------

let selectedAvatarSetup = '🦁';

function initAvatarPicker(containerId, onSelect) {
  const container = document.getElementById(containerId);
  container.querySelectorAll('.avatar-option').forEach(opt => {
    opt.addEventListener('click', () => {
      container.querySelectorAll('.avatar-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      onSelect(opt.dataset.avatar);
    });
  });
}

function setupProfileScreen() {
  initAvatarPicker('avatar-picker', (avatar) => { selectedAvatarSetup = avatar; });
  document.querySelector('#avatar-picker .avatar-option').classList.add('selected');

  document.getElementById('btn-save-profile').addEventListener('click', async () => {
    const name = document.getElementById('input-name').value.trim();
    if (!name) {
      document.getElementById('input-name').focus();
      document.getElementById('input-name').style.borderColor = 'var(--bad)';
      return;
    }
    const level = document.getElementById('input-level').value;
    const btn = document.getElementById('btn-save-profile');
    btn.disabled = true;
    btn.textContent = 'Salvando...';
    await saveProfile({ name, avatar: selectedAvatarSetup, level, createdAt: new Date().toISOString() });
    btn.disabled = false;
    btn.textContent = 'Começar a estudar';
    enterApp();
  });
}

// ---------- Tela de perfil (visualização/edição) ----------

let selectedAvatarEdit = '🦁';

async function renderProfileView() {
  const profile = await getProfile();
  if (!profile) return;

  document.getElementById('profile-avatar').textContent = profile.avatar;
  document.getElementById('profile-name-display').textContent = profile.name;
  document.getElementById('profile-level-display').textContent = 'Nível ' + profile.level;

  const progress = await getProgress();
  const stats = computeProgressStats(progress);
  document.getElementById('profile-stat-completed').textContent = stats.completed;
  document.getElementById('profile-stat-score').textContent = stats.avgPct !== null ? stats.avgPct + '%' : '—';
  document.getElementById('profile-stat-total').textContent = stats.total;
  renderLessonCardsInto('profile-lesson-list', progress);

  document.getElementById('edit-name').value = profile.name;
  document.getElementById('edit-level').value = profile.level;

  selectedAvatarEdit = profile.avatar;
  const editContainer = document.getElementById('avatar-picker-edit');
  editContainer.querySelectorAll('.avatar-option').forEach(o => {
    o.classList.toggle('selected', o.dataset.avatar === profile.avatar);
  });

  const cloudNote = document.getElementById('cloud-status');
  if (cloudNote) {
    cloudNote.textContent = isUsingCloud()
      ? '☁️ Conta na nuvem (Supabase) — funciona em qualquer aparelho'
      : '💾 Salvo apenas neste navegador (sem Supabase configurado)';
  }

  const logoutBtn = document.getElementById('btn-logout');
  if (logoutBtn) logoutBtn.classList.toggle('hidden', !isUsingCloud());
}

function setupProfileViewScreen() {
  initAvatarPicker('avatar-picker-edit', (avatar) => { selectedAvatarEdit = avatar; });

  document.getElementById('btn-update-profile').addEventListener('click', async () => {
    const name = document.getElementById('edit-name').value.trim();
    if (!name) return;
    const level = document.getElementById('edit-level').value;
    const profile = (await getProfile()) || {};
    profile.name = name;
    profile.avatar = selectedAvatarEdit;
    profile.level = level;
    await saveProfile(profile);
    await renderProfileView();
    showScreen('home');
  });

  document.getElementById('btn-reset-progress').addEventListener('click', async () => {
    if (confirm('Isso vai apagar o progresso de todas as lições. Tem certeza?')) {
      await resetAllProgress();
      await renderProfileView();
      alert('Progresso zerado.');
    }
  });

  document.getElementById('btn-logout').addEventListener('click', async () => {
    if (!confirm('Sair da conta? Você vai precisar do usuário e senha para entrar de novo.')) return;
    await signOutStudent();
    document.getElementById('bottom-nav').style.display = 'none';
    setAuthMode('login');
    showScreen('auth');
  });
}

// ---------- Tela Home / lista de lições ----------

async function renderHome() {
  const profile = await getProfile();
  if (!profile) return;

  document.getElementById('home-avatar').textContent = profile.avatar;
  document.getElementById('home-greeting').textContent = 'Olá, ' + profile.name + '!';
  document.getElementById('home-level-sub').textContent = 'Nível ' + profile.level + ' • continue praticando';

  const progress = await getProgress();
  const stats = computeProgressStats(progress);

  document.getElementById('stat-completed').textContent = stats.completed;
  document.getElementById('stat-score').textContent = stats.avgPct !== null ? stats.avgPct + '%' : '—';
  document.getElementById('stat-streak').textContent = stats.total;

  renderLessonCardsInto('lesson-list', progress);
}

function buildLessonCardHTML(lesson, progress, locked) {
  const p = progress[lesson.id];
  const pct = p && p.total > 0 ? Math.round((p.correct / p.total) * 100) : 0;
  const done = p && p.completed;

  if (locked) {
    return `
      <div class="icon locked-icon">🔒</div>
      <div class="info">
        <div class="name">${lesson.name}</div>
        <div class="level">Conclua a lição anterior com pelo menos 85% para desbloquear</div>
      </div>
      <div class="badge locked">Bloqueada</div>
    `;
  }

  return `
    <div class="icon">${lesson.icon}</div>
    <div class="info">
      <div class="name">${lesson.name}</div>
      <div class="level">${lesson.description}</div>
      <div class="progress-track"><div class="progress-fill" style="width:${pct}%;"></div></div>
    </div>
    <div class="badge ${done ? 'done' : ''}">${done ? '✓ ' + pct + '%' : (p ? pct + '%' : 'Não iniciada')}</div>
    <div class="chevron">›</div>
  `;
}

// Ordem preferida de exibição das seções de nível. Níveis não listados aqui
// aparecem depois, em ordem alfabética.
const LEVEL_ORDER = ['Introdutório', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

function groupLessonsByLevel() {
  const groups = {};
  LESSONS.forEach(lesson => {
    if (!groups[lesson.level]) groups[lesson.level] = [];
    groups[lesson.level].push(lesson);
  });
  const levels = Object.keys(groups).sort((a, b) => {
    const ia = LEVEL_ORDER.indexOf(a);
    const ib = LEVEL_ORDER.indexOf(b);
    if (ia === -1 && ib === -1) return a.localeCompare(b);
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });
  return levels.map(level => ({ level, lessons: groups[level] }));
}

// Uma lição só é desbloqueada depois que a anterior no catálogo LESSONS
// (a ordem em que elas aparecem no array, que segue a progressão pedagógica)
// tiver sido concluída com pelo menos 85% de aproveitamento. A primeira
// lição do catálogo está sempre desbloqueada.
function computeLockStatus(progress) {
  const locked = {};
  LESSONS.forEach((lesson, idx) => {
    if (idx === 0) { locked[lesson.id] = false; return; }
    // O teste de nivelamento (id: nivelamento) não bloqueia a próxima lição
    const prev = LESSONS[idx - 1];
    if (prev.id === 'nivelamento') { locked[lesson.id] = false; return; }
    const prevProgress = progress[prev.id];
    locked[lesson.id] = !(prevProgress && prevProgress.completed);
  });
  return locked;
}

function showLockedMessage(lesson) {
  alert('🔒 "' + lesson.name + '" ainda está bloqueada.\n\nConclua a lição anterior com pelo menos 85% (nota 8,5) de aproveitamento para desbloqueá-la.');
}

function renderLessonCardsInto(containerId, progress) {
  const list = document.getElementById(containerId);
  if (!list) return;
  list.innerHTML = '';
  const lockStatus = computeLockStatus(progress);
  const groups = groupLessonsByLevel();
  groups.forEach(({ level, lessons }) => {
    const section = document.createElement('div');
    section.className = 'level-group';
    const countLabel = lessons.length === 1 ? '1 lição' : lessons.length + ' lições';
    section.innerHTML = `
      <div class="level-group-title">
        <span class="label">${level}</span>
        <span class="line"></span>
        <span class="count">${countLabel}</span>
      </div>
    `;
    lessons.forEach(lesson => {
      const locked = lockStatus[lesson.id];
      const card = document.createElement('div');
      card.className = 'lesson-card' + (locked ? ' locked' : '');
      card.innerHTML = buildLessonCardHTML(lesson, progress, locked);
      card.addEventListener('click', () => locked ? showLockedMessage(lesson) : openLesson(lesson));
      section.appendChild(card);
    });
    list.appendChild(section);
  });
}

function computeProgressStats(progress) {
  const completedLessons = LESSONS.filter(l => progress[l.id] && progress[l.id].completed);
  const scored = LESSONS.filter(l => progress[l.id] && progress[l.id].total > 0);
  let avgPct = null;
  if (scored.length > 0) {
    avgPct = Math.round(
      scored.reduce((sum, l) => sum + (progress[l.id].correct / progress[l.id].total), 0) / scored.length * 100
    );
  }
  return { completed: completedLessons.length, avgPct, total: LESSONS.length };
}

function openLesson(lesson) {
  window.location.href = lesson.url;
}

// ---------- Fluxo geral do app ----------

function enterApp() {
  document.getElementById('bottom-nav').style.display = 'flex';
  showScreen('home');
}

async function boot() {
  showLoadingState(true);
  await initDataLayer();

  setupAuthScreen();
  setupProfileScreen();
  setupProfileViewScreen();

  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => showScreen(btn.dataset.screen));
  });

  showLoadingState(false);

  if (isUsingCloud() && !isLoggedIn()) {
    setAuthMode('login');
    showScreen('auth');
  } else {
    const profile = await getProfile();
    if (profile) {
      enterApp();
    } else {
      showScreen('profile-setup');
    }
  }

  setupInstallPrompt();
  registerServiceWorker();
}

function showLoadingState(loading) {
  const el = document.getElementById('boot-loading');
  if (el) el.style.display = loading ? 'flex' : 'none';
}

// ---------- PWA: instalação e service worker ----------

let deferredInstallPrompt = null;

function setupInstallPrompt() {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    showInstallBanner();
  });

  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
    const slot = document.getElementById('install-banner-slot');
    if (slot) slot.innerHTML = '';
  });
}

function showInstallBanner() {
  const slot = document.getElementById('install-banner-slot');
  if (!slot) return;
  slot.innerHTML = `
    <div class="install-banner">
      <span>📲 Instale o app na tela inicial para acessar offline</span>
      <button id="btn-install">Instalar</button>
    </div>
  `;
  document.getElementById('btn-install').addEventListener('click', async () => {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    slot.innerHTML = '';
  });
}

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {
      console.log('Service worker não registrado (provavelmente rodando via file://).');
    });
  }
}

document.addEventListener('DOMContentLoaded', boot);
