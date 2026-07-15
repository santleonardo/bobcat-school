// ============================================================
// Bobcat Language School — App PWA
// Perfil e progresso vêm do db-client.js (Supabase ou localStorage).
// ============================================================

// ---------- Teste de Nivelamento (A1–C2) ----------
// 46 questões de múltipla escolha, em ordem crescente de dificuldade.
// Aplicado uma única vez no cadastro do aluno. O resultado define o
// nível no perfil e libera as lições dos níveis A1 até o nível alcançado.

const LEVEL_TEST_QUESTIONS = [
  // ----- A1 (1–8) -----
  { id: 1, level: 'A1', q: 'She ___ a teacher.', options: ['is', 'are', 'am', 'be'], answer: 0 },
  { id: 2, level: 'A1', q: 'I have two ___.', options: ['child', 'childs', 'children', 'childrens'], answer: 2 },
  { id: 3, level: 'A1', q: 'There ___ a book on the table.', options: ['is', 'are', 'am', 'be'], answer: 0 },
  { id: 4, level: 'A1', q: "What's your name? My name ___ Ana.", options: ['is', 'are', 'am', 'be'], answer: 0 },
  { id: 5, level: 'A1', q: "He doesn't ___ coffee.", options: ['like', 'likes', 'liking', 'liked'], answer: 0 },
  { id: 6, level: 'A1', q: 'This is ___ apple.', options: ['a', 'an', 'the', 'some'], answer: 1 },
  { id: 7, level: 'A1', q: '___ you from Brazil?', options: ['Is', 'Are', 'Am', 'Do'], answer: 1 },
  { id: 8, level: 'A1', q: 'My brother ___ football every Sunday.', options: ['play', 'plays', 'playing', 'played'], answer: 1 },

  // ----- A2 (9–16) -----
  { id: 9, level: 'A2', q: 'Yesterday, I ___ to the cinema.', options: ['go', 'goes', 'went', 'gone'], answer: 2 },
  { id: 10, level: 'A2', q: 'London is ___ than Paris in winter.', options: ['cold', 'colder', 'coldest', 'more cold'], answer: 1 },
  { id: 11, level: 'A2', q: 'We ___ going to travel next month.', options: ['is', 'are', 'am', 'be'], answer: 1 },
  { id: 12, level: 'A2', q: 'She was born ___ 1998.', options: ['in', 'on', 'at', 'since'], answer: 0 },
  { id: 13, level: 'A2', q: 'I ___ my homework last night.', options: ['do', 'did', 'done', 'doing'], answer: 1 },
  { id: 14, level: 'A2', q: 'There ___ some milk in the fridge.', options: ['is', 'are', 'be', 'were'], answer: 0 },
  { id: 15, level: 'A2', q: 'He is the ___ student in the class.', options: ['good', 'better', 'best', 'goodest'], answer: 2 },
  { id: 16, level: 'A2', q: 'Look! It ___ raining.', options: ['rain', 'rains', 'is', 'was'], answer: 2 },

  // ----- B1 (17–24) -----
  { id: 17, level: 'B1', q: 'I have ___ been to Japan.', options: ['never', 'ever', 'already', 'yet'], answer: 0 },
  { id: 18, level: 'B1', q: 'If it rains tomorrow, we ___ the picnic.', options: ['cancel', 'will cancel', 'cancelled', 'cancelling'], answer: 1 },
  { id: 19, level: 'B1', q: 'The letter ___ by John yesterday.', options: ['wrote', 'was written', 'is written', 'has written'], answer: 1 },
  { id: 20, level: 'B1', q: 'She has lived here ___ 2015.', options: ['for', 'since', 'during', 'at'], answer: 1 },
  { id: 21, level: 'B1', q: 'I wish I ___ more free time.', options: ['have', 'had', 'has', 'will have'], answer: 1 },
  { id: 22, level: 'B1', passage: 'Remote Work\nRemote work has become increasingly common over the last few years. Many companies now allow their employees to work from home, at least a few days a week. Supporters say this arrangement saves time and money, because people don\'t need to travel to an office every day. However, some managers believe that remote work makes it harder for teams to communicate and to build strong relationships. As a result, many businesses have started offering a hybrid model, combining days in the office with days at home.', q: 'According to the text, why do supporters like remote work?', options: ['Because it is more traditional', 'Because it saves time and money', 'Because it requires more meetings', 'Because it is required by law'], answer: 1 },
  { id: 23, level: 'B1', passage: 'Remote Work\nRemote work has become increasingly common over the last few years. Many companies now allow their employees to work from home, at least a few days a week. Supporters say this arrangement saves time and money, because people don\'t need to travel to an office every day. However, some managers believe that remote work makes it harder for teams to communicate and to build strong relationships. As a result, many businesses have started offering a hybrid model, combining days in the office with days at home.', q: 'What concern do some managers have about remote work?', options: ['It is too expensive', 'It makes communication harder', 'It increases travel', 'It reduces employee salaries'], answer: 1 },
  { id: 24, level: 'B1', passage: 'Remote Work\nRemote work has become increasingly common over the last few years. Many companies now allow their employees to work from home, at least a few days a week. Supporters say this arrangement saves time and money, because people don\'t need to travel to an office every day. However, some managers believe that remote work makes it harder for teams to communicate and to build strong relationships. As a result, many businesses have started offering a hybrid model, combining days in the office with days at home.', q: "What is a 'hybrid model', according to the text?", options: ['Working only from home', 'Working only in the office', 'A mix of office days and home days', 'A model used only by managers'], answer: 2 },

  // ----- B2 (25–32) -----
  { id: 25, level: 'B2', q: 'She said that she ___ tired.', options: ['is', 'was', 'has been', 'be'], answer: 1 },
  { id: 26, level: 'B2', q: 'If I had studied harder, I ___ the exam.', options: ['would pass', 'would have passed', 'will pass', 'passed'], answer: 1 },
  { id: 27, level: 'B2', q: 'They finally managed to ___ the problem after hours of work.', options: ['give up', 'sort out', 'look up', 'take off'], answer: 1 },
  { id: 28, level: 'B2', q: 'He asked me where ___.', options: ['did I live', 'I live', 'I lived', 'I have lived'], answer: 2 },
  { id: 29, level: 'B2', q: 'The meeting ___ postponed because of the storm.', options: ['was', 'has', 'did', 'is being being'], answer: 0 },
  { id: 30, level: 'B2', passage: 'The Rise of Electric Vehicles\nElectric vehicles (EVs) are no longer a niche product for environmentally conscious consumers. Falling battery costs, government incentives, and a growing network of charging stations have made EVs a realistic option for millions of drivers. Critics, however, point out that the manufacturing of batteries has its own environmental cost, and that electricity grids in many countries still rely heavily on fossil fuels. Whether EVs represent a truly sustainable solution, they argue, depends on how quickly the energy sector itself can be transformed.', q: 'What has helped make EVs more accessible?', options: ['Higher battery costs', 'Falling battery costs and incentives', 'A shortage of charging stations', 'Stricter emissions-only regulations'], answer: 1 },
  { id: 31, level: 'B2', passage: 'The Rise of Electric Vehicles\nElectric vehicles (EVs) are no longer a niche product for environmentally conscious consumers. Falling battery costs, government incentives, and a growing network of charging stations have made EVs a realistic option for millions of drivers. Critics, however, point out that the manufacturing of batteries has its own environmental cost, and that electricity grids in many countries still rely heavily on fossil fuels. Whether EVs represent a truly sustainable solution, they argue, depends on how quickly the energy sector itself can be transformed.', q: 'What criticism do some people make about EVs?', options: ['They are too quiet', 'Battery production has environmental costs', 'They are cheaper than expected', "They don't require electricity"], answer: 1 },
  { id: 32, level: 'B2', passage: 'The Rise of Electric Vehicles\nElectric vehicles (EVs) are no longer a niche product for environmentally conscious consumers. Falling battery costs, government incentives, and a growing network of charging stations have made EVs a realistic option for millions of drivers. Critics, however, point out that the manufacturing of batteries has its own environmental cost, and that electricity grids in many countries still rely heavily on fossil fuels. Whether EVs represent a truly sustainable solution, they argue, depends on how quickly the energy sector itself can be transformed.', q: 'What does the sustainability of EVs ultimately depend on, according to the text?', options: ['The price of gasoline', 'How fast the energy sector is transformed', 'The number of cars sold', 'The color of the vehicles'], answer: 1 },

  // ----- C1 (33–40) -----
  { id: 33, level: 'C1', q: 'Rarely ___ such a compelling argument in a debate.', options: ['I have seen', 'have I seen', 'I saw', 'did I saw'], answer: 1 },
  { id: 34, level: 'C1', q: 'The committee insists that the report ___ submitted by Friday.', options: ['is', 'be', 'will be', 'was'], answer: 1 },
  { id: 35, level: 'C1', q: 'It was not until she moved abroad ___ she realized how much she missed home.', options: ['that', 'when', 'then', 'which'], answer: 0 },
  { id: 36, level: 'C1', q: 'Had I known about the delay, I ___ earlier.', options: ['would leave', 'would have left', 'left', 'will leave'], answer: 1 },
  { id: 37, level: 'C1', q: 'Not only ___ the deadline, but he also improved the quality of the work.', options: ['he met', 'did he meet', 'he did meet', 'meeting he'], answer: 1 },
  { id: 38, level: 'C1', passage: 'The Attention Economy\nIn an age saturated with information, attention has arguably become the scarcest resource of all. Platforms compete fiercely for the fleeting moments of focus that users are willing to grant them, and in doing so, they have reshaped everything from journalism to political discourse. Some commentators argue that this relentless competition has driven a race to the bottom, in which sensationalism is rewarded over nuance. Others contend that users are far from passive victims, and that framing the debate solely in terms of manipulation underestimates people\'s ability to navigate — and occasionally resist — the platforms they use.', q: 'What does the author suggest attention has become?', options: ['An unlimited resource', 'The scarcest resource', 'Irrelevant to platforms', 'A form of currency only in politics'], answer: 1 },
  { id: 39, level: 'C1', passage: 'The Attention Economy\nIn an age saturated with information, attention has arguably become the scarcest resource of all. Platforms compete fiercely for the fleeting moments of focus that users are willing to grant them, and in doing so, they have reshaped everything from journalism to political discourse. Some commentators argue that this relentless competition has driven a race to the bottom, in which sensationalism is rewarded over nuance. Others contend that users are far from passive victims, and that framing the debate solely in terms of manipulation underestimates people\'s ability to navigate — and occasionally resist — the platforms they use.', q: "What is the 'race to the bottom' mentioned in the text?", options: ['Platforms competing to lower prices', 'A trend toward rewarding sensationalism over nuance', 'A competition to reduce screen time', 'A decline in the number of users'], answer: 1 },
  { id: 40, level: 'C1', passage: 'The Attention Economy\nIn an age saturated with information, attention has arguably become the scarcest resource of all. Platforms compete fiercely for the fleeting moments of focus that users are willing to grant them, and in doing so, they have reshaped everything from journalism to political discourse. Some commentators argue that this relentless competition has driven a race to the bottom, in which sensationalism is rewarded over nuance. Others contend that users are far from passive victims, and that framing the debate solely in terms of manipulation underestimates people\'s ability to navigate — and occasionally resist — the platforms they use.', q: "What is the view of those who disagree with the 'race to the bottom' argument?", options: ['They believe users have no agency at all', 'They believe users can navigate and resist platform influence', 'They agree completely with the manipulation theory', 'They think platforms should be banned'], answer: 1 },

  // ----- C2 (41–46) -----
  { id: 41, level: 'C2', q: 'The negotiations reached an impasse, and neither side was willing to ___.', options: ['budge', 'budged', 'budging', 'to budge'], answer: 0 },
  { id: 42, level: 'C2', q: 'Her argument, while eloquent, was ultimately ___ — it sounded convincing but had little real content.', options: ['specious', 'meticulous', 'candid', 'succinct'], answer: 0 },
  { id: 43, level: 'C2', q: 'He has a knack ___ making even the dullest topics sound fascinating.', options: ['of', 'for', 'with', 'in'], answer: 1 },
  { id: 44, level: 'C2', q: 'The critics were scathing, describing the film as ___ pretentious.', options: ['utter', 'utterly', 'uttering', 'utterness'], answer: 1 },
  { id: 45, level: 'C2', q: 'Given the circumstances, resigning was, ___, the only honourable course of action.', options: ['if anything', 'for all intents and purposes', 'by and large', 'in the same vein'], answer: 1 },
  { id: 46, level: 'C2', q: "The professor's remark was laced with ___; she clearly meant the opposite of what she said.", options: ['irony', 'clarity', 'brevity', 'sincerity'], answer: 0 }
];

// Ordem dos níveis CEFR para cálculo de desbloqueio.
const CEFR_ORDER = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

// Faixas de acertos (de 46) → nível alcançado (e nível máximo liberado).
// Quanto mais acertos, mais níveis de lições ficam disponíveis.
//   0–8   → A1   (libera A1)
//   9–16  → A2   (libera A1–A2)
//   17–24 → B1   (libera A1–B1)
//   25–32 → B2   (libera A1–B2)  ← exemplo do usuário
//   33–40 → C1   (libera A1–C1)
//   41–46 → C2   (libera A1–C2)
function levelFromTestScore(score) {
  if (score <= 8) return 'A1';
  if (score <= 16) return 'A2';
  if (score <= 24) return 'B1';
  if (score <= 32) return 'B2';
  if (score <= 40) return 'C1';
  return 'C2';
}

function levelLabel(code) {
  const map = {
    A1: 'A1 — Iniciante', A2: 'A2 — Básico', B1: 'B1 — Intermediário',
    B2: 'B2 — Intermediário avançado', C1: 'C1 — Avançado', C2: 'C2 — Proficiente'
  };
  return map[code] || code;
}

// Verifica se uma lição (por nível) está liberada pelo resultado do teste.
function isLevelUnlockedByTest(lessonLevel, studentLevel) {
  if (lessonLevel === 'Introdutório') return true;
  const li = CEFR_ORDER.indexOf(lessonLevel);
  const si = CEFR_ORDER.indexOf(studentLevel);
  if (li === -1) return true;       // nível desconhecido: libera por padrão
  if (si === -1) return false;      // aluno sem nível válido: trava
  return li <= si;
}

// Catálogo de lições. Para adicionar uma nova lição, basta
// incluir um novo objeto aqui e criar o arquivo em /lessons.
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
  if (id === 'level-test-review') renderLevelTestReview();
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
    // Aluno com perfil mas sem teste de nivelamento → precisa fazer o teste
    // uma única vez para que o nível e o acesso às lições sejam definidos.
    if (profile.levelTestScore === undefined || profile.levelTestScore === null) {
      startLevelTest();
    } else {
      enterApp();
    }
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
    // O nível não é mais escolhido manualmente — ele é definido pelo
    // Teste de Nivelamento a seguir. Salvamos um nível inicial provisório
    // (A1) que será sobrescrito pelo resultado do teste.
    const btn = document.getElementById('btn-save-profile');
    btn.disabled = true;
    btn.textContent = 'Salvando...';
    await saveProfile({
      name,
      avatar: selectedAvatarSetup,
      level: 'A1',
      createdAt: new Date().toISOString()
    });
    btn.disabled = false;
    btn.textContent = 'Continuar para o teste';
    startLevelTest();
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
  await renderLessonCardsInto('profile-lesson-list', progress);

  document.getElementById('edit-name').value = profile.name;

  // Mostra o nível como somente leitura (definido pelo teste de nivelamento).
  const levelDisplay = document.getElementById('edit-level-display');
  if (levelDisplay) {
    const score = profile.levelTestScore;
    const date = profile.levelTestDate ? new Date(profile.levelTestDate).toLocaleDateString('pt-BR') : null;
    let txt = levelLabel(profile.level);
    if (score !== undefined && score !== null) {
      txt += '  •  ' + score + '/46 acertos';
      if (date) txt += '  •  ' + date;
    } else {
      txt += '  •  teste não realizado';
    }
    levelDisplay.textContent = txt;
  }

  // Mostra o botão de detalhes do teste só quando há respostas salvas
  // (perfis antigos, feitos antes dessa funcionalidade, podem não ter).
  const detailsBtn = document.getElementById('btn-view-test-details');
  if (detailsBtn) {
    detailsBtn.classList.toggle('hidden', !Array.isArray(profile.levelTestAnswers));
  }

  // Botão de refazer o teste: só aparece se o aluno já fez o teste ao menos
  // uma vez e ainda não usou a tentativa extra de refação.
  const hasDoneTest = profile.levelTestScore !== undefined && profile.levelTestScore !== null;
  const retakeUsed = !!profile.levelTestRetakeUsed;
  const retakeBtn = document.getElementById('btn-retake-test');
  if (retakeBtn) {
    retakeBtn.classList.toggle('hidden', !hasDoneTest || retakeUsed);
  }
  const retakeNote = document.getElementById('retake-used-note');
  if (retakeNote) {
    retakeNote.classList.toggle('hidden', !hasDoneTest || !retakeUsed);
  }

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

// Controla a troca entre as 3 abas do perfil: Lições, Perfil e Testes.
function selectProfileTab(tabName) {
  document.querySelectorAll('#profile-tabs .profile-tab').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabName);
  });
  document.querySelectorAll('.profile-tab-content').forEach(content => {
    const isTarget = content.id === 'profile-tab-' + tabName;
    content.classList.toggle('hidden', !isTarget);
  });
}

function setupProfileTabs() {
  document.querySelectorAll('#profile-tabs .profile-tab').forEach(btn => {
    btn.addEventListener('click', () => selectProfileTab(btn.dataset.tab));
  });
}

function setupProfileViewScreen() {
  initAvatarPicker('avatar-picker-edit', (avatar) => { selectedAvatarEdit = avatar; });
  setupProfileTabs();

  document.getElementById('btn-update-profile').addEventListener('click', async () => {
    const name = document.getElementById('edit-name').value.trim();
    if (!name) return;
    // O nível NÃO é editável aqui — ele vem do Teste de Nivelamento.
    // Mantemos o nível e o resultado do teste que já estão no perfil.
    const profile = (await getProfile()) || {};
    profile.name = name;
    profile.avatar = selectedAvatarEdit;
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

  const viewDetailsBtn = document.getElementById('btn-view-test-details');
  if (viewDetailsBtn) {
    viewDetailsBtn.addEventListener('click', () => {
      showScreen('level-test-review');
      window.scrollTo(0, 0);
    });
  }

  const backFromReviewBtn = document.getElementById('btn-back-from-test-review');
  if (backFromReviewBtn) {
    backFromReviewBtn.addEventListener('click', () => {
      selectProfileTab('tests');
      showScreen('profile-view');
    });
  }

  const retakeBtn = document.getElementById('btn-retake-test');
  if (retakeBtn) {
    retakeBtn.addEventListener('click', async () => {
      const profile = (await getProfile()) || {};
      const currentLevel = profile.level || 'A1';

      const step1 = confirm(
        'Tem certeza que deseja refazer o teste de nivelamento?\n\n' +
        'Você só tem 1 tentativa extra — depois de usá-la, não será possível refazer de novo.'
      );
      if (!step1) return;

      const step2 = confirm(
        '⚠️ Atenção: refazer o teste vai:\n\n' +
        '• Zerar o progresso de TODAS as lições\n' +
        '• Recalcular seu nível com base no novo resultado — ele pode subir, ficar igual, OU REGREDIR ' +
        '(por exemplo, cair de B2 para A1) se o desempenho for pior que o do teste anterior\n\n' +
        'Seu nível atual é ' + currentLevel + '. Deseja continuar mesmo assim?'
      );
      if (!step2) return;

      startLevelTest({ isRetake: true, previousLevel: currentLevel });
    });
  }
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

  await renderLessonCardsInto('lesson-list', progress);
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
        <div class="level">Nível não liberado pelo teste de nivelamento</div>
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

// O acesso às lições é definido pelo Teste de Nivelamento: o aluno só vê
// as lições dos níveis A1 até o nível que alcançou no teste. Lições de
// níveis acima ficam bloqueadas (o teste é feito uma única vez, no cadastro).
async function computeLockStatus(progress) {
  const profile = await getProfile();
  const studentLevel = (profile && profile.level) || 'A1';
  const locked = {};
  LESSONS.forEach(lesson => {
    locked[lesson.id] = !isLevelUnlockedByTest(lesson.level, studentLevel);
  });
  return locked;
}

function showLockedMessage(lesson) {
  alert('🔒 "' + lesson.name + '" está bloqueada.\n\nEsta lição é de um nível acima do que você alcançou no Teste de Nivelamento. O acesso às lições é definido uma única vez no cadastro.');
}

async function renderLessonCardsInto(containerId, progress) {
  const list = document.getElementById(containerId);
  if (!list) return;
  list.innerHTML = '';
  const lockStatus = await computeLockStatus(progress);
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
      // Perfil já existe. Se o teste de nivelamento ainda não foi feito,
      // manda direto pra ele (caso de aluno antigo sem teste, ou de perfil
      // criado mas com teste interrompido).
      if (profile.levelTestScore === undefined || profile.levelTestScore === null) {
        startLevelTest();
      } else {
        enterApp();
      }
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

// ---------- Teste de Nivelamento (UI) ----------

// Estado em memória do teste em andamento.
let levelTestState = {
  current: 0,           // índice da questão atual (0..N-1)
  answers: [],          // resposta escolhida em cada questão (índice 0..3 ou null)
  finished: false,
  isRetake: false,       // true quando é a tentativa extra (não o teste obrigatório do cadastro)
  previousLevel: null    // nível antes da refação, pra mostrar comparação no resultado
};

function startLevelTest(options) {
  const opts = options || {};
  // (Re)inicia o estado do teste. Como o teste é feito uma única vez (mais
  // uma tentativa extra opcional), só deve ser chamado quando o aluno ainda
  // não tem resultado, ou explicitamente pediu para refazer.
  levelTestState = {
    current: 0,
    answers: new Array(LEVEL_TEST_QUESTIONS.length).fill(null),
    finished: false,
    isRetake: !!opts.isRetake,
    previousLevel: opts.previousLevel || null
  };
  document.getElementById('bottom-nav').style.display = 'none';
  renderLevelTest();
  showScreen('level-test');
  window.scrollTo(0, 0);
}

function renderLevelTest() {
  const container = document.getElementById('level-test-container');
  if (!container) return;

  const total = LEVEL_TEST_QUESTIONS.length;
  const idx = levelTestState.current;
  const item = LEVEL_TEST_QUESTIONS[idx];
  const answered = levelTestState.answers.filter(a => a !== null).length;
  const pct = Math.round(((idx) / total) * 100);
  const isLast = idx === total - 1;
  const selected = levelTestState.answers[idx];

  // Cabeçalho com instrução e progresso.
  let html = `
    <div class="lt-header">
      <h2 class="screen-title">Teste de Nivelamento</h2>
      <p class="lt-sub">46 questões do A1 ao C2. Não tem tempo limite — responda com calma. É feito só uma vez e define quais lições ficarão liberadas para você.</p>
    </div>

    <div class="lt-progress">
      <div class="lt-progress-bar"><div class="lt-progress-fill" style="width:${pct}%;"></div></div>
      <div class="lt-progress-info">
        <span>Questão ${idx + 1} de ${total}</span>
        <span>${answered} respondidas</span>
      </div>
    </div>

    <div class="lt-level-tag lt-level-${item.level}">Nível ${item.level}</div>
  `;

  // Texto de leitura (se houver) — aparece acima da questão.
  if (item.passage) {
    const [passageTitle, ...rest] = item.passage.split('\n');
    const passageBody = rest.join('\n').trim();
    html += `
      <div class="lt-passage">
        <div class="lt-passage-title">📖 ${passageTitle}</div>
        <p class="lt-passage-body">${passageBody}</p>
      </div>
    `;
  }

  // Enunciado e alternativas.
  html += `<div class="lt-question">${idx + 1}. ${item.q}</div>`;
  html += `<div class="lt-options">`;
  item.options.forEach((opt, i) => {
    const letters = ['A', 'B', 'C', 'D'];
    const isSel = selected === i;
    html += `
      <button type="button" class="lt-option${isSel ? ' selected' : ''}" data-opt="${i}">
        <span class="lt-option-letter">${letters[i]}</span>
        <span class="lt-option-text">${opt}</span>
      </button>
    `;
  });
  html += `</div>`;

  // Navegação.
  html += `<div class="lt-nav">
    <button type="button" class="btn secondary lt-btn-back"${idx === 0 ? ' disabled' : ''}>← Anterior</button>
    ${isLast
      ? `<button type="button" class="btn lt-btn-finish"${selected === null ? ' disabled' : ''}>Finalizar teste</button>`
      : `<button type="button" class="btn lt-btn-next"${selected === null ? ' disabled' : ''}>Próxima →</button>`
    }
  </div>`;

  // Aviso caso ainda haja não respondidas no fim.
  if (isLast && answered < total) {
    html += `<p class="lt-warn">Você ainda não respondeu ${total - answered} questão(ões). Pode finalizar mesmo assim, mas as não respondidas contam como erro.</p>`;
  }

  container.innerHTML = html;

  // Liga os eventos dos botões.
  container.querySelectorAll('.lt-option').forEach(btn => {
    btn.addEventListener('click', () => {
      const opt = parseInt(btn.dataset.opt, 10);
      levelTestState.answers[idx] = opt;
      renderLevelTest();
    });
  });

  const backBtn = container.querySelector('.lt-btn-back');
  if (backBtn) backBtn.addEventListener('click', () => {
    if (levelTestState.current > 0) {
      levelTestState.current--;
      renderLevelTest();
      window.scrollTo(0, 0);
    }
  });

  const nextBtn = container.querySelector('.lt-btn-next');
  if (nextBtn) nextBtn.addEventListener('click', () => {
    if (levelTestState.current < total - 1) {
      levelTestState.current++;
      renderLevelTest();
      window.scrollTo(0, 0);
    }
  });

  const finishBtn = container.querySelector('.lt-btn-finish');
  if (finishBtn) finishBtn.addEventListener('click', () => {
    finishLevelTest();
  });
}

async function finishLevelTest() {
  // Conta acertos e calcula o nível alcançado.
  let score = 0;
  LEVEL_TEST_QUESTIONS.forEach((item, i) => {
    if (levelTestState.answers[i] === item.answer) score++;
  });

  const achievedLevel = levelFromTestScore(score);
  levelTestState.finished = true;

  // Salva o resultado no perfil (sobrescreve o nível inicial provisório).
  const profile = (await getProfile()) || {};
  const previousLevel = levelTestState.isRetake ? (levelTestState.previousLevel || profile.level) : null;
  profile.level = achievedLevel;
  profile.levelTestScore = score;
  profile.levelTestTotal = LEVEL_TEST_QUESTIONS.length;
  profile.levelTestDate = new Date().toISOString();
  profile.levelTestAnswers = levelTestState.answers.slice();

  if (levelTestState.isRetake) {
    // A tentativa extra só pode ser usada uma vez, e sempre zera o progresso
    // das lições (o conjunto de lições liberadas pode mudar com o novo nível).
    profile.levelTestRetakeUsed = true;
    await resetAllProgress();
  }

  await saveProfile(profile);

  renderLevelTestResult(score, achievedLevel, previousLevel);
}

function renderLevelTestResult(score, achievedLevel, previousLevel) {
  const container = document.getElementById('level-test-container');
  if (!container) return;

  // Determina a faixa de níveis liberada (sempre A1 até o nível alcançado).
  const unlockedRange = 'A1 até ' + achievedLevel;

  const isRetake = !!previousLevel;
  const levelChanged = isRetake && previousLevel !== achievedLevel;

  const levelChangeHtml = isRetake ? `
    <div class="lt-result-compare">
      <span class="lt-level-tag lt-level-${previousLevel}">${previousLevel}</span>
      <span class="lt-result-compare-arrow">→</span>
      <span class="lt-level-tag lt-level-${achievedLevel}">${achievedLevel}</span>
    </div>
  ` : '';

  const noteHtml = isRetake
    ? (levelChanged
        ? `<p class="lt-result-note">🔄 Refação concluída! Seu nível foi atualizado de <strong>${previousLevel}</strong> para <strong>${achievedLevel}</strong>, e o progresso das lições foi zerado para refletir o novo nível.</p>`
        : `<p class="lt-result-note">🔄 Refação concluída! Seu nível se manteve em <strong>${achievedLevel}</strong>. O progresso das lições foi zerado, mas as lições liberadas continuam as mesmas.</p>`)
    : `<p class="lt-result-note">
        ✅ Pronto! Agora você tem acesso a todas as lições dos níveis liberados.
        O teste não precisa ser feito de novo — suas lições já estão disponíveis na tela inicial.
      </p>`;

  container.innerHTML = `
    <div class="lt-result">
      <div class="lt-result-emoji">🎯</div>
      <h2 class="lt-result-title">Teste concluído!</h2>

      <div class="lt-result-score">
        Você acertou <strong>${score}</strong> de <strong>${LEVEL_TEST_QUESTIONS.length}</strong> questões
      </div>

      ${levelChangeHtml || `
      <div class="lt-result-level lt-level-tag lt-level-${achievedLevel}">
        Seu nível: ${achievedLevel}
      </div>
      `}

      <div class="lt-result-unlocked">
        <div class="lt-result-unlocked-label">Lições liberadas:</div>
        <div class="lt-result-unlocked-range">${unlockedRange}</div>
      </div>

      ${noteHtml}

      <button type="button" class="btn lt-btn-continue">Começar a estudar →</button>
    </div>
  `;

  document.querySelector('.lt-btn-continue').addEventListener('click', () => {
    enterApp();
  });
}

// ---------- Detalhes do Teste de Nivelamento (revisão pós-teste) ----------
// Mostra todas as 46 questões do teste já respondido, com a alternativa
// escolhida pelo aluno, a alternativa correta, e um resumo de acertos
// por nível CEFR. Só é exibido se o perfil já tiver `levelTestAnswers`
// salvo (testes feitos antes dessa funcionalidade existir não terão isso).
async function renderLevelTestReview() {
  const container = document.getElementById('level-test-review-container');
  if (!container) return;

  const profile = await getProfile();
  const answers = profile && Array.isArray(profile.levelTestAnswers) ? profile.levelTestAnswers : null;

  if (!answers) {
    container.innerHTML = `
      <h2 class="screen-title">Detalhes do teste</h2>
      <p class="lt-sub">As respostas detalhadas desse teste não ficaram salvas (ele foi feito antes dessa funcionalidade existir). Só o resultado final está disponível no seu perfil.</p>
    `;
    return;
  }

  const letters = ['A', 'B', 'C', 'D'];
  const total = LEVEL_TEST_QUESTIONS.length;
  const score = typeof profile.levelTestScore === 'number' ? profile.levelTestScore : answers.filter((a, i) => a === LEVEL_TEST_QUESTIONS[i].answer).length;
  const date = profile.levelTestDate ? new Date(profile.levelTestDate).toLocaleDateString('pt-BR') : null;

  // Resumo de acertos por nível CEFR.
  const byLevel = {};
  CEFR_ORDER.forEach(lv => { byLevel[lv] = { correct: 0, total: 0 }; });
  LEVEL_TEST_QUESTIONS.forEach((item, i) => {
    if (!byLevel[item.level]) byLevel[item.level] = { correct: 0, total: 0 };
    byLevel[item.level].total++;
    if (answers[i] === item.answer) byLevel[item.level].correct++;
  });

  let html = `
    <h2 class="screen-title">Detalhes do teste de nivelamento</h2>
    <p class="lt-sub">
      Resultado: <strong>${score}/${total}</strong> acertos • Nível: <strong>${levelLabel(profile.level)}</strong>${date ? ' • ' + date : ''}
    </p>

    <div class="lt-review-summary">
      ${CEFR_ORDER.map(lv => `
        <div class="lt-review-summary-item">
          <span class="lt-level-tag lt-level-${lv}">${lv}</span>
          <span class="lt-review-summary-score">${byLevel[lv].correct}/${byLevel[lv].total}</span>
        </div>
      `).join('')}
    </div>
  `;

  let lastPassage = null;

  LEVEL_TEST_QUESTIONS.forEach((item, i) => {
    const chosen = answers[i];
    const isAnswered = chosen !== null && chosen !== undefined;
    const isCorrect = chosen === item.answer;

    // Mostra o texto de leitura apenas quando ele muda (evita repetir o
    // mesmo texto em cada uma das 3 questões que o usam).
    if (item.passage && item.passage !== lastPassage) {
      const [passageTitle, ...rest] = item.passage.split('\n');
      const passageBody = rest.join('\n').trim();
      html += `
        <div class="lt-passage">
          <div class="lt-passage-title">📖 ${passageTitle}</div>
          <p class="lt-passage-body">${passageBody}</p>
        </div>
      `;
    }
    lastPassage = item.passage || null;

    html += `
      <div class="lt-review-card ${isCorrect ? 'is-correct' : 'is-wrong'}">
        <div class="lt-review-card-head">
          <span class="lt-level-tag lt-level-${item.level}">${item.level}</span>
          <span class="lt-review-badge ${isCorrect ? 'ok' : 'bad'}">${isCorrect ? '✅ Acertou' : (isAnswered ? '❌ Errou' : '⚠️ Não respondeu')}</span>
        </div>
        <div class="lt-question">${i + 1}. ${item.q}</div>
        <div class="lt-options">
          ${item.options.map((opt, oi) => {
            let cls = 'lt-review-option';
            if (oi === item.answer) cls += ' correct-answer';
            if (oi === chosen && chosen !== item.answer) cls += ' wrong-answer';
            return `
              <div class="${cls}">
                <span class="lt-option-letter">${letters[oi]}</span>
                <span class="lt-option-text">${opt}</span>
                ${oi === item.answer ? '<span class="lt-review-tag">correta</span>' : ''}
                ${oi === chosen && chosen !== item.answer ? '<span class="lt-review-tag">sua resposta</span>' : ''}
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', boot);
