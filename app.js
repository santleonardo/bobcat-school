// ============================================================
// Bobcat Language School — App PWA
// Perfil e progresso vêm do db-client.js (Supabase ou localStorage).
// ============================================================

// Catálogo de lições. Para adicionar uma nova lição, basta
// incluir um novo objeto aqui e criar o arquivo em /lessons.
// Catálogo de testes de nivelamento (exibidos na aba "Testes")
const TESTS = [
  {
    id: 'nivelamento',
    name: 'Teste de Nivelamento',
    icon: '🎯',
    description: 'Descubra seu nível de inglês (A1–C2) — diferente a cada tentativa!',
    url: 'lessons/nivelamento.html',
    totalQuestions: 30
  }
];

// Catálogo de matérias extras (aba "Extra"). Diferente das lições de inglês,
// aqui não há bloqueio nem pré-requisito: todo aluno pode acessar direto.
const EXTRAS = [
  {
    id: 'manual-portugues',
    name: 'Manual Prático de Língua Portuguesa',
    icon: '📘',
    description: 'Morfologia, sintaxe, concordância, crase, pontuação e mais — com exercícios',
    url: 'lessons/manual-portugues.html'
  }
];

const LESSONS = [
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
  },
  {
    id: 'licao-12-simple-present-daily-life',
    name: 'Lição 12 — Simple Present: Rotina e Hábitos Diários',
    level: 'A1',
    icon: '🗓️',
    description: 'Simple Present, advérbios de frequência e a rotina diária',
    url: 'lessons/licao-12-simple-present-daily-life.html',
    totalQuestions: 17 // exercícios com gabarito (correção automática)
  },
  {
    id: 'licao-13-perguntas-simple-present',
    name: 'Lição 13 — Perguntas Naturais no Simple Present',
    level: 'A1',
    icon: '🗣️',
    description: 'Perguntas e negativas com Do/Does no Simple Present',
    url: 'lessons/licao-13-perguntas-simple-present.html',
    totalQuestions: 16 // exercícios com gabarito (correção automática)
  },
  {
    id: 'licao-14-there-is-there-are',
    name: 'Lição 14 — There Is / There Are',
    level: 'A1',
    icon: '🏠',
    description: 'Descrevendo lugares e objetos com There is/There are',
    url: 'lessons/licao-14-there-is-there-are.html',
    totalQuestions: 17 // exercícios com gabarito (correção automática)
  },
  {
    id: 'licao-15-can-cant',
    name: "Lição 15 — Can, Can't e Comunicação do Dia a Dia",
    level: 'A1',
    icon: '🙌',
    description: "Habilidades e permissões com Can/Can't",
    url: 'lessons/licao-15-can-cant.html',
    totalQuestions: 18 // exercícios com gabarito (correção automática)
  },
  {
    id: 'licao-16-present-continuous',
    name: 'Lição 16 — Present Continuous',
    level: 'A1',
    icon: '🏃',
    description: 'Ações em andamento com o Present Continuous',
    url: 'lessons/licao-16-present-continuous.html',
    totalQuestions: 17 // exercícios com gabarito (correção automática)
  },
  {
    id: 'licao-17-countable-uncountable',
    name: 'Lição 17 — Substantivos Contáveis e Incontáveis',
    level: 'A1',
    icon: '🍎',
    description: 'Countable/uncountable nouns, some, any e much/many',
    url: 'lessons/licao-17-countable-uncountable.html',
    totalQuestions: 21 // exercícios com gabarito (correção automática)
  },
  {
    id: 'licao-18-quantities-choices',
    name: 'Lição 18 — Quantidades e Escolhas',
    level: 'A1',
    icon: '🛒',
    description: 'Expressando quantidades e fazendo escolhas em inglês',
    url: 'lessons/licao-18-quantities-choices.html',
    totalQuestions: 17 // exercícios com gabarito (correção automática)
  },
  {
    id: 'licao-19-quantities-distance-time',
    name: 'Lição 19 — Perguntando Sobre Quantidade, Distância e Tempo',
    level: 'A1',
    icon: '📏',
    description: 'How much/how many, distância e tempo',
    url: 'lessons/licao-19-quantities-distance-time.html',
    totalQuestions: 18 // exercícios com gabarito (correção automática)
  },
  {
    id: 'licao-20-survival-english',
    name: 'Lição 20 — Survival English 🌍',
    level: 'A1',
    icon: '🌍',
    description: 'Frases essenciais para se virar em situações reais',
    url: 'lessons/licao-20-survival-english.html',
    totalQuestions: 19 // exercícios com gabarito (correção automática)
  },
  {
    id: 'licao-21-simple-past-regular',
    name: 'Lição 21 — Simple Past: Verbos Regulares',
    level: 'A1',
    icon: '⏮️',
    description: 'Formação e uso do Simple Past com verbos regulares',
    url: 'lessons/licao-21-simple-past-regular.html',
    totalQuestions: 17 // exercícios com gabarito (correção automática)
  },
  {
    id: 'licao-22-simple-past-irregular',
    name: 'Lição 22 — Simple Past: Verbos Irregulares',
    level: 'A1',
    icon: '📖',
    description: 'Verbos irregulares mais comuns no Simple Past',
    url: 'lessons/licao-22-simple-past-irregular.html',
    totalQuestions: 17 // exercícios com gabarito (correção automática)
  },
  {
    id: 'licao-23-talking-about-the-past',
    name: 'Lição 23 — Falando Sobre o Passado',
    level: 'A1',
    icon: '🕰️',
    description: 'Perguntas, negativas e expressões de tempo no passado',
    url: 'lessons/licao-23-talking-about-the-past.html',
    totalQuestions: 13 // exercícios com gabarito (correção automática)
  },
  {
    id: 'licao-24-future-going-to',
    name: 'Lição 24 — Futuro com Going To',
    level: 'A1',
    icon: '🎯',
    description: 'Planos e intenções futuras com Going To',
    url: 'lessons/licao-24-future-going-to.html',
    totalQuestions: 17 // exercícios com gabarito (correção automática)
  },
  {
    id: 'licao-25-future-will',
    name: 'Lição 25 — Futuro com Will',
    level: 'A1',
    icon: '🔮',
    description: 'Previsões, decisões espontâneas e promessas com Will',
    url: 'lessons/licao-25-future-will.html',
    totalQuestions: 17 // exercícios com gabarito (correção automática)
  },
  {
    id: 'licao-26-comparatives-superlatives',
    name: 'Lição 26 — Comparativos e Superlativos',
    level: 'A1',
    icon: '⚖️',
    description: 'Comparando pessoas e coisas em inglês',
    url: 'lessons/licao-26-comparatives-superlatives.html',
    totalQuestions: 17 // exercícios com gabarito (correção automática)
  },
  {
    id: 'licao-27-present-perfect',
    name: 'Lição 27 — Present Perfect (Introdução)',
    level: 'A1',
    icon: '✅',
    description: 'Introdução ao Present Perfect: have/has + particípio',
    url: 'lessons/licao-27-present-perfect.html',
    totalQuestions: 17 // exercícios com gabarito (correção automática)
  },
  {
    id: 'licao-28-modal-verbs',
    name: 'Lição 28 — Verbos Modais',
    level: 'A1',
    icon: '🔑',
    description: 'Can, could, must, should e outros verbos modais',
    url: 'lessons/licao-28-modal-verbs.html',
    totalQuestions: 17 // exercícios com gabarito (correção automática)
  },
  {
    id: 'licao-29-phrasal-verbs',
    name: 'Lição 29 — Phrasal Verbs Essenciais',
    level: 'A1',
    icon: '🧩',
    description: 'Phrasal verbs mais usados no inglês do dia a dia',
    url: 'lessons/licao-29-phrasal-verbs.html',
    totalQuestions: 17 // exercícios com gabarito (correção automática)
  },
  {
    id: 'licao-30-revisao-semestre-2',
    name: 'Lição 30 — Revisão Geral do Semestre 2 🎓',
    level: 'A1',
    icon: '🎓',
    description: 'Revisão completa de todo o conteúdo do Semestre 2',
    url: 'lessons/licao-30-revisao-semestre-2.html',
    totalQuestions: 50 // exercícios com gabarito (correção automática)
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

  if (id === 'menu') renderMenu();
  if (id === 'home') renderHome();
  if (id === 'tests') renderTests();
  if (id === 'extra') renderExtras();
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

  await renderMessages();
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

async function renderMessages() {
  const notice = document.getElementById('messages-notice');
  const thread = document.getElementById('chat-thread');
  const input = document.getElementById('chat-input');
  const sendBtn = document.getElementById('btn-send-message');
  if (!thread) return;

  if (!messagingAvailable()) {
    notice.innerHTML = '<div class="chat-empty" style="background:var(--cream-2); border-radius:10px; padding:12px;">💾 Esse canal só funciona com conta na nuvem (Supabase). Crie uma conta com e-mail e senha para poder falar com o professor.</div>';
    thread.innerHTML = '';
    input.disabled = true;
    sendBtn.disabled = true;
    return;
  }

  notice.innerHTML = '';
  input.disabled = false;
  sendBtn.disabled = false;

  const messages = await getMyMessages();
  if (messages.length === 0) {
    thread.innerHTML = '<div class="chat-empty">Nenhuma mensagem ainda. Mande a primeira dúvida para o professor! 👋</div>';
  } else {
    thread.innerHTML = messages.map(m => {
      const who = m.sender === 'teacher' ? 'Professor(a)' : 'Você';
      const date = new Date(m.created_at).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
      return `<div class="chat-bubble ${m.sender}">
        <span class="chat-meta">${who} · ${date}</span>
        ${escapeHtml(m.body)}
      </div>`;
    }).join('');
  }
  thread.scrollTop = thread.scrollHeight;
}

function setupProfileViewScreen() {
  initAvatarPicker('avatar-picker-edit', (avatar) => { selectedAvatarEdit = avatar; });

  document.getElementById('chat-toggle').addEventListener('click', () => {
    const panel = document.getElementById('chat-panel');
    const toggle = document.getElementById('chat-toggle');
    const nowOpen = panel.classList.toggle('hidden') === false;
    toggle.classList.toggle('open', nowOpen);
    if (nowOpen) {
      const thread = document.getElementById('chat-thread');
      thread.scrollTop = thread.scrollHeight;
    }
  });

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

  document.getElementById('btn-send-message').addEventListener('click', async () => {
    const input = document.getElementById('chat-input');
    const text = input.value.trim();
    if (!text) return;
    const btn = document.getElementById('btn-send-message');
    btn.disabled = true;
    const result = await sendMessageToTeacher(text);
    btn.disabled = false;
    if (!result.ok) { alert(result.message); return; }
    input.value = '';
    await renderMessages();
  });

  document.getElementById('chat-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      document.getElementById('btn-send-message').click();
    }
  });
}

// ---------- Tela Testes ----------

async function renderTests() {
  const progress = await getProgress();
  const list = document.getElementById('tests-list');
  if (!list) return;
  list.innerHTML = '';

  TESTS.forEach(test => {
    const p = progress[test.id];
    const pct = p && p.total > 0 ? Math.round((p.correct / p.total) * 100) : 0;
    const done = p && p.completed;
    const attempts = p ? (done ? 'Concluído' : pct + '%') : 'Não iniciado';

    // Read detailed result from localStorage (saved by nivelamento.html)
    let detail = null;
    try {
      const raw = localStorage.getItem('bobcat_nivelamento_detail');
      if (raw) detail = JSON.parse(raw);
    } catch(e) {}

    // Read attempt count
    let attemptCount = 0;
    try {
      const v = localStorage.getItem('bobcat_nivelamento_attempts');
      if (v) attemptCount = parseInt(v, 10);
    } catch(e) {}

    const card = document.createElement('div');
    card.className = 'lesson-card';

    if (detail && p) {
      // Show detailed result card
      const levelColors = { A1:'#4caf50', A2:'#66bb6a', B1:'#ffa726', B2:'#fb8c00', C1:'#ef5350', C2:'#c62828' };
      const lColor = levelColors[detail.level] || '#999';
      const dateStr = detail.timestamp ? new Date(detail.timestamp).toLocaleDateString('pt-BR', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' }) : '';
      const canRetake = attemptCount < 2;

      card.innerHTML = `
        <div class="icon">${test.icon}</div>
        <div class="info">
          <div class="name">${test.name}</div>
          <div class="level">${test.description}</div>
          <div style="margin-top:8px;display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
            <span style="display:inline-block;color:#fff;padding:2px 10px;border-radius:4px;font-size:12px;font-weight:700;background:${lColor};">${detail.level} — ${detail.levelName}</span>
            <span style="font-size:13px;font-weight:700;color:#C9622A;">${detail.score}/${detail.total} (${detail.pct}%)</span>
          </div>
          <div style="margin-top:4px;font-size:11.5px;color:#888;">${detail.variation || ''} • Tentativa ${detail.attempt}/${detail.maxAttempts}${dateStr ? ' • ' + dateStr : ''}</div>
          <div style="margin-top:4px;font-size:11.5px;color:${canRetake ? '#2E8B57' : '#C0392B'};">${canRetake ? 'Você pode refazer o teste mais uma vez' : 'Todas as tentativas utilizadas'}</div>
          <div class="progress-track" style="margin-top:6px;"><div class="progress-fill" style="width:${pct}%;"></div></div>
        </div>
        <div class="badge ${done ? 'done' : ''}">${done ? '✓ ' + pct + '%' : attempts}</div>
        <div class="chevron">›</div>
      `;
    } else {
      // Show simple card (no results yet)
      card.innerHTML = `
        <div class="icon">${test.icon}</div>
        <div class="info">
          <div class="name">${test.name}</div>
          <div class="level">${test.description}</div>
          <div class="progress-track"><div class="progress-fill" style="width:${pct}%;"></div></div>
        </div>
        <div class="badge ${done ? 'done' : ''}">${done ? '✓ ' + pct + '%' : attempts}</div>
        <div class="chevron">›</div>
      `;
    }

    card.addEventListener('click', () => { window.location.href = test.url; });
    list.appendChild(card);
  });
}

// ---------- Tela Extra (matérias bônus, sem requisito de acesso) ----------

function renderExtras() {
  const list = document.getElementById('extra-list');
  if (!list) return;
  list.innerHTML = '';

  EXTRAS.forEach(extra => {
    const card = document.createElement('div');
    card.className = 'lesson-card';
    card.innerHTML = `
      <div class="icon">${extra.icon}</div>
      <div class="info">
        <div class="name">${extra.name}</div>
        <div class="level">${extra.description}</div>
      </div>
      <div class="badge">Aberto</div>
      <div class="chevron">›</div>
    `;
    // Sem verificação de bloqueio: matéria extra é sempre acessível.
    card.addEventListener('click', () => { window.location.href = extra.url; });
    list.appendChild(card);
  });
}

// ---------- Tela Menu (página inicial) ----------

async function renderMenu() {
  const profile = await getProfile();
  if (!profile) return;

  document.getElementById('menu-avatar').textContent = profile.avatar;
  document.getElementById('menu-greeting').textContent = 'Olá, ' + profile.name + '!';
  document.getElementById('menu-level-sub').textContent = 'Nível ' + profile.level + ' • o que vamos fazer hoje?';
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
    const prev = LESSONS[idx - 1];
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
  showScreen('menu');
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

  document.querySelectorAll('.menu-btn').forEach(btn => {
    btn.addEventListener('click', () => showScreen(btn.dataset.screen));
  });

  const topbarHomeLink = document.getElementById('topbar-home-link');
  if (topbarHomeLink) {
    const goHome = () => {
      // só navega se o app já foi iniciado (aluno logado / perfil criado);
      // nas telas de login e criação de perfil, o clique não faz nada.
      if (document.getElementById('bottom-nav').style.display !== 'none') {
        showScreen('menu');
      }
    };
    topbarHomeLink.addEventListener('click', goHome);
    topbarHomeLink.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goHome(); }
    });
  }

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
