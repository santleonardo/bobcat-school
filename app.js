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
    id: 'pb-substantivo',
    group: 'Manual Básico — Classes Gramaticais',
    name: 'Básico 1 — Substantivo',
    icon: '🧑‍🤝‍🧑',
    description: 'Pessoas, animais, lugares, objetos e sentimentos',
    url: 'lessons/pb-substantivo.html'
  },
  {
    id: 'pb-artigo',
    group: 'Manual Básico — Classes Gramaticais',
    name: 'Básico 2 — Artigo',
    icon: '🔖',
    description: 'Indica se falamos de algo específico ou qualquer',
    url: 'lessons/pb-artigo.html'
  },
  {
    id: 'pb-adjetivo',
    group: 'Manual Básico — Classes Gramaticais',
    name: 'Básico 3 — Adjetivo',
    icon: '🎨',
    description: 'Descreve como é o substantivo',
    url: 'lessons/pb-adjetivo.html'
  },
  {
    id: 'pb-numeral',
    group: 'Manual Básico — Classes Gramaticais',
    name: 'Básico 4 — Numeral',
    icon: '🔢',
    description: 'Indica quantidade, ordem ou quantas vezes',
    url: 'lessons/pb-numeral.html'
  },
  {
    id: 'pb-pronome',
    group: 'Manual Básico — Classes Gramaticais',
    name: 'Básico 5 — Pronome',
    icon: '👉',
    description: 'Pessoal, possessivo e demonstrativo',
    url: 'lessons/pb-pronome.html'
  },
  {
    id: 'pb-verbo',
    group: 'Manual Básico — Classes Gramaticais',
    name: 'Básico 6 — Verbo',
    icon: '🏃',
    description: 'O que acontece, o que se faz, como se está',
    url: 'lessons/pb-verbo.html'
  },
  {
    id: 'pb-adverbio',
    group: 'Manual Básico — Classes Gramaticais',
    name: 'Básico 7 — Advérbio',
    icon: '⚡',
    description: 'Modifica verbo, adjetivo ou outro advérbio',
    url: 'lessons/pb-adverbio.html'
  },
  {
    id: 'pb-preposicao',
    group: 'Manual Básico — Classes Gramaticais',
    name: 'Básico 8 — Preposição',
    icon: '🔗',
    description: 'Estabelece relação entre termos',
    url: 'lessons/pb-preposicao.html'
  },
  {
    id: 'pb-conjuncao',
    group: 'Manual Básico — Classes Gramaticais',
    name: 'Básico 9 — Conjunção',
    icon: '🧷',
    description: 'Adição, oposição, causa e outras relações',
    url: 'lessons/pb-conjuncao.html'
  },
  {
    id: 'pb-interjeicao',
    group: 'Manual Básico — Classes Gramaticais',
    name: 'Básico 10 — Interjeição',
    icon: '❗',
    description: 'Alegria, dor, surpresa, pedido',
    url: 'lessons/pb-interjeicao.html'
  },
  {
    id: 'pt-morfologia',
    group: 'Manual Prático — Língua Portuguesa',
    name: 'Português 1 — Morfologia',
    icon: '🔤',
    description: 'Classes gramaticais, formação e flexão das palavras',
    url: 'lessons/pt-morfologia.html'
  },
  {
    id: 'pt-sintaxe',
    group: 'Manual Prático — Língua Portuguesa',
    name: 'Português 2 — Sintaxe',
    icon: '🧩',
    description: 'Sujeito, predicado, objetos e termos acessórios',
    url: 'lessons/pt-sintaxe.html'
  },
  {
    id: 'pt-concordancia',
    group: 'Manual Prático — Língua Portuguesa',
    name: 'Português 3 — Concordância',
    icon: '🤝',
    description: 'Concordância nominal e verbal, casos especiais',
    url: 'lessons/pt-concordancia.html'
  },
  {
    id: 'pt-regencia',
    group: 'Manual Prático — Língua Portuguesa',
    name: 'Português 4 — Regência',
    icon: '🔗',
    description: 'Regência verbal e nominal, preposições exigidas',
    url: 'lessons/pt-regencia.html'
  },
  {
    id: 'pt-crase',
    group: 'Manual Prático — Língua Portuguesa',
    name: 'Português 5 — Crase',
    icon: '🅰️',
    description: 'Casos obrigatórios, proibidos e facultativos de crase',
    url: 'lessons/pt-crase.html'
  },
  {
    id: 'pt-colocacao',
    group: 'Manual Prático — Língua Portuguesa',
    name: 'Português 6 — Colocação Pronominal',
    icon: '📎',
    description: 'Posição dos pronomes oblíquos átonos',
    url: 'lessons/pt-colocacao.html'
  },
  {
    id: 'pt-acentuacao',
    group: 'Manual Prático — Língua Portuguesa',
    name: 'Português 7 — Acentuação',
    icon: '✏️',
    description: 'Oxítonas, paroxítonas, proparoxítonas e casos especiais',
    url: 'lessons/pt-acentuacao.html'
  },
  {
    id: 'pt-ortografia',
    group: 'Manual Prático — Língua Portuguesa',
    name: 'Português 8 — Ortografia',
    icon: '📝',
    description: 'Uso de S, Z, X, CH, G, J, H e hífen',
    url: 'lessons/pt-ortografia.html'
  },
  {
    id: 'pt-pontuacao',
    group: 'Manual Prático — Língua Portuguesa',
    name: 'Português 9 — Pontuação',
    icon: '✒️',
    description: 'Vírgula, ponto e vírgula, dois-pontos e demais sinais',
    url: 'lessons/pt-pontuacao.html'
  },
  {
    id: 'pt-interpretacao',
    group: 'Manual Prático — Língua Portuguesa',
    name: 'Português 10 — Interpretação de Textos',
    icon: '📖',
    description: 'Níveis de leitura, tipologias, coesão e recursos de linguagem',
    url: 'lessons/pt-interpretacao.html'
  },
  {
    id: 'licao-2-interativa',
    group: 'Outros',
    name: 'Lição 2 — Visual Interativo (mesmo conteúdo)',
    icon: '🎮',
    description: 'Mesmo conteúdo da Lição 2 oficial, no formato Genially/jogos (progresso compartilhado)',
    url: 'lessons/licao-2-interativa.html'
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
    description: 'Wh- words, artigos a/an/the — design interativo (jogos, áudio, cartões)',
    url: 'lessons/licao-2-perguntas-artigos.html',
    totalQuestions: 20 // drag-drop 8 + quiz 6 + memória 6
  },
  {
    id: 'licao-3-revisao-perguntas',
    name: 'Lição 3 — Revisando e Praticando: Quem é Você? O Que é Isso?',
    level: 'A1',
    icon: '🔁',
    description: 'Revisão das lições 1 e 2 com prática de diálogos',
    url: 'lessons/licao-3-revisao-perguntas.html',
    totalQuestions: 12 // Wh 5 + artigos 3 + MC 4 (design interativo)
  },
  {
    id: 'licao-4-preposicoes',
    name: 'Lição 4 — Preposições em Ação: Onde? Com Quem? Como?',
    level: 'A1',
    icon: '📍',
    description: 'Preposições: onde, com quem e como',
    url: 'lessons/licao-4-preposicoes.html',
    totalQuestions: 10 // design interativo
  },
  {
    id: 'licao-5-posse',
    name: 'Lição 5 — O Que É Isso? De Quem É?',
    level: 'A1',
    icon: '🎒',
    description: 'O que é isso e de quem é: posse em inglês',
    url: 'lessons/licao-5-posse.html',
    totalQuestions: 12 // design interativo
  },
  {
    id: 'licao-6-here-there',
    name: 'Lição 6 — Aqui e Ali: Localização e Posição',
    level: 'A1',
    icon: '📌',
    description: 'Localização, posição e phrasal verbs básicos',
    url: 'lessons/licao-6-here-there.html',
    totalQuestions: 12 // design interativo
  },
  {
    id: 'licao-8-to-be-passado',
    name: 'Lição 8 — Verbo To Be no Passado: Como Era e Onde Estava?',
    level: 'A1',
    icon: '⏳',
    description: 'O verbo to be no passado: was e were',
    url: 'lessons/licao-8-to-be-passado.html',
    totalQuestions: 12 // design interativo
  },
  {
    id: 'licao-9-revisao-completa',
    name: 'Lição 9 — Revisão Completa: Tudo que Aprendemos Até Aqui!',
    level: 'A1',
    icon: '📚',
    description: 'Revisão completa das lições anteriores',
    url: 'lessons/licao-9-revisao-completa.html',
    totalQuestions: 16 // design interativo
  },
  {
    id: 'licao-10-do-does-to-for',
    name: 'Lição 10 — Verbos Essenciais, Perguntas com DO/DOES, e o Uso de TO e FOR',
    level: 'A1',
    icon: '🔧',
    description: 'Verbos essenciais, DO/DOES, TO e FOR',
    url: 'lessons/licao-10-do-does-to-for.html',
    totalQuestions: 14 // design interativo
  },
  {
    id: 'licao-11-object-possessive-pronouns',
    name: 'Lesson 11 — People, Objects and Possession',
    level: 'A1',
    icon: '👥',
    description: 'Pronomes objetos, possessivos e mais de 20 verbos',
    url: 'lessons/licao-11-object-possessive-pronouns.html',
    totalQuestions: 12 // design interativo
  },
  {
    id: 'licao-12-simple-present-daily-life',
    name: 'Lição 12 — Simple Present: Rotina e Hábitos Diários',
    level: 'A1',
    icon: '🗓️',
    description: 'Simple Present, advérbios de frequência e a rotina diária',
    url: 'lessons/licao-12-simple-present-daily-life.html',
    totalQuestions: 12 // design interativo
  },
  {
    id: 'licao-13-perguntas-simple-present',
    name: 'Lição 13 — Perguntas Naturais no Simple Present',
    level: 'A1',
    icon: '🗣️',
    description: 'Perguntas e negativas com Do/Does no Simple Present',
    url: 'lessons/licao-13-perguntas-simple-present.html',
    totalQuestions: 12 // design interativo
  },
  {
    id: 'licao-14-there-is-there-are',
    name: 'Lição 14 — There Is / There Are',
    level: 'A1',
    icon: '🏠',
    description: 'Descrevendo lugares e objetos com There is/There are',
    url: 'lessons/licao-14-there-is-there-are.html',
    totalQuestions: 12 // design interativo
  },
  {
    id: 'licao-15-can-cant',
    name: "Lição 15 — Can, Can't e Comunicação do Dia a Dia",
    level: 'A1',
    icon: '🙌',
    description: "Teoria completa, diálogo, cultura, vocabulário e exercícios sobre Can/Can't",
    url: 'lessons/licao-15-can-cant.html',
    totalQuestions: 38 // teoria + vocab + 6 partes de exercícios
  },
  {
    id: 'licao-16-present-continuous',
    name: 'Lição 16 — Present Continuous',
    level: 'A1',
    icon: '🏃',
    description: 'Ações em andamento com o Present Continuous',
    url: 'lessons/licao-16-present-continuous.html',
    totalQuestions: 12 // design interativo
  },
  {
    id: 'licao-17-countable-uncountable',
    name: 'Lição 17 — Substantivos Contáveis e Incontáveis',
    level: 'A1',
    icon: '🍎',
    description: 'Countable/uncountable nouns, some, any e much/many',
    url: 'lessons/licao-17-countable-uncountable.html',
    totalQuestions: 12 // design interativo
  },
  {
    id: 'licao-18-quantities-choices',
    name: 'Lição 18 — Quantidades e Escolhas',
    level: 'A1',
    icon: '🛒',
    description: 'Expressando quantidades e fazendo escolhas em inglês',
    url: 'lessons/licao-18-quantities-choices.html',
    totalQuestions: 12 // design interativo
  },
  {
    id: 'licao-19-quantities-distance-time',
    name: 'Lição 19 — Perguntando Sobre Quantidade, Distância e Tempo',
    level: 'A1',
    icon: '📏',
    description: 'How much/how many, distância e tempo',
    url: 'lessons/licao-19-quantities-distance-time.html',
    totalQuestions: 12 // design interativo
  },
  {
    id: 'licao-20-survival-english',
    name: 'Lição 20 — Survival English 🌍',
    level: 'A1',
    icon: '🌍',
    description: 'Frases essenciais para se virar em situações reais',
    url: 'lessons/licao-20-survival-english.html',
    totalQuestions: 12 // design interativo
  },
  {
    id: 'licao-21-simple-past-regular',
    name: 'Lição 21 — Simple Past: Verbos Regulares',
    level: 'A1',
    icon: '⏮️',
    description: 'Formação e uso do Simple Past com verbos regulares',
    url: 'lessons/licao-21-simple-past-regular.html',
    totalQuestions: 12 // design interativo
  },
  {
    id: 'licao-22-simple-past-irregular',
    name: 'Lição 22 — Simple Past: Verbos Irregulares',
    level: 'A1',
    icon: '📖',
    description: 'Verbos irregulares mais comuns no Simple Past',
    url: 'lessons/licao-22-simple-past-irregular.html',
    totalQuestions: 12 // design interativo
  },
  {
    id: 'licao-23-talking-about-the-past',
    name: 'Lição 23 — Falando Sobre o Passado',
    level: 'A1',
    icon: '🕰️',
    description: 'Perguntas, negativas e expressões de tempo no passado',
    url: 'lessons/licao-23-talking-about-the-past.html',
    totalQuestions: 12 // design interativo
  },
  {
    id: 'licao-24-future-going-to',
    name: 'Lição 24 — Futuro com Going To',
    level: 'A1',
    icon: '🎯',
    description: 'Planos e intenções futuras com Going To',
    url: 'lessons/licao-24-future-going-to.html',
    totalQuestions: 12 // design interativo
  },
  {
    id: 'licao-25-future-will',
    name: 'Lição 25 — Futuro com Will',
    level: 'A1',
    icon: '🔮',
    description: 'Previsões, decisões espontâneas e promessas com Will',
    url: 'lessons/licao-25-future-will.html',
    totalQuestions: 12 // design interativo
  },
  {
    id: 'licao-26-comparatives-superlatives',
    name: 'Lição 26 — Comparativos e Superlativos',
    level: 'A1',
    icon: '⚖️',
    description: 'Comparando pessoas e coisas em inglês',
    url: 'lessons/licao-26-comparatives-superlatives.html',
    totalQuestions: 12 // design interativo
  },
  {
    id: 'licao-27-present-perfect',
    name: 'Lição 27 — Present Perfect (Introdução)',
    level: 'A1',
    icon: '✅',
    description: 'Introdução ao Present Perfect: have/has + particípio',
    url: 'lessons/licao-27-present-perfect.html',
    totalQuestions: 12 // design interativo
  },
  {
    id: 'licao-28-modal-verbs',
    name: 'Lição 28 — Verbos Modais',
    level: 'A1',
    icon: '🔑',
    description: 'Can, could, must, should e outros verbos modais',
    url: 'lessons/licao-28-modal-verbs.html',
    totalQuestions: 12 // design interativo
  },
  {
    id: 'licao-29-phrasal-verbs',
    name: 'Lição 29 — Phrasal Verbs Essenciais',
    level: 'A1',
    icon: '🧩',
    description: 'Phrasal verbs mais usados no inglês do dia a dia',
    url: 'lessons/licao-29-phrasal-verbs.html',
    totalQuestions: 12 // design interativo
  },
  {
    id: 'licao-30-revisao-semestre-2',
    name: 'Lição 30 — Revisão Geral do Semestre 2 🎓',
    level: 'A1',
    icon: '🎓',
    description: 'Revisão completa de todo o conteúdo do Semestre 2',
    url: 'lessons/licao-30-revisao-semestre-2.html',
    totalQuestions: 12 // design interativo
  },
  {
    id: 'licao-31-past-continuous',
    name: 'Lição 31 — Past Continuous',
    level: 'A2',
    icon: '⏳',
    description: 'Ações em progresso no passado: was/were + verbo-ing',
    url: 'lessons/licao-31-past-continuous.html',
    totalQuestions: 12 // design interativo
  },
  {
    id: 'licao-32-simple-past-past-continuous',
    name: 'Lição 32 — Simple Past × Past Continuous',
    level: 'A2',
    icon: '🔀',
    description: 'Combinando ações simultâneas e interrompidas ao contar histórias',
    url: 'lessons/licao-32-simple-past-past-continuous.html',
    totalQuestions: 12 // design interativo
  },
  {
    id: 'licao-33-present-perfect-experiences',
    name: 'Lição 33 — Present Perfect: Experiences',
    level: 'A2',
    icon: '🌍',
    description: 'Falando sobre experiências de vida com ever, never, before',
    url: 'lessons/licao-33-present-perfect-experiences.html',
    totalQuestions: 12 // design interativo
  },
  {
    id: 'licao-34-present-perfect-simple-past',
    name: 'Lição 34 — Present Perfect × Simple Past',
    level: 'B1',
    icon: '⚖️',
    description: 'Quando usar cada tempo verbal: since, for, last, ago',
    url: 'lessons/licao-34-present-perfect-simple-past.html',
    totalQuestions: 12 // design interativo
  },
  {
    id: 'licao-35-present-perfect-already-yet-just',
    name: 'Lição 35 — Present Perfect: Already, Yet, Just',
    level: 'B1',
    icon: '✅',
    description: 'Already, yet, just, still, recently e lately em contexto',
    url: 'lessons/licao-35-present-perfect-already-yet-just.html',
    totalQuestions: 12 // design interativo
  },
  {
    id: 'licao-36-future-will-going-to',
    name: 'Lição 36 — Future: Will, Going to & Present Continuous',
    level: 'B1',
    icon: '🔮',
    description: 'Decisões espontâneas, planos e compromissos marcados',
    url: 'lessons/licao-36-future-will-going-to.html',
    totalQuestions: 12 // design interativo
  },
  {
    id: 'licao-37-modal-verbs-advice-obligation',
    name: 'Lição 37 — Modal Verbs: Advice, Obligation & Permission',
    level: 'B1',
    icon: '🔑',
    description: 'Should, must, have to, can, may e might em contexto real',
    url: 'lessons/licao-37-modal-verbs-advice-obligation.html',
    totalQuestions: 12 // design interativo
  },
  {
    id: 'licao-38-comparatives-superlatives-equality',
    name: 'Lição 38 — Comparatives, Superlatives & Equality',
    level: 'B1',
    icon: '📊',
    description: 'Comparando pessoas e coisas: bigger, the best, as...as',
    url: 'lessons/licao-38-comparatives-superlatives-equality.html',
    totalQuestions: 12 // design interativo
  },
  {
    id: 'licao-39-conditionals-zero-first',
    name: 'Lição 39 — Conditionals: Zero & First Conditional',
    level: 'B1',
    icon: '🔀',
    description: 'Fatos gerais e possibilidades reais no futuro com if/unless',
    url: 'lessons/licao-39-conditionals-zero-first.html',
    totalQuestions: 12 // design interativo
  },
  {
    id: 'licao-40-revisao-semestre-3',
    name: 'Lição 40 — Grande Revisão A2 → B1 🎓',
    level: 'B1',
    icon: '🎓',
    description: 'Revisão completa do Semestre 3 e projeto final',
    url: 'lessons/licao-40-revisao-semestre-3.html',
    totalQuestions: 12 // design interativo
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
    await enterApp();
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
    await enterApp();
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

// ---------- Anexos de mensagens (helpers de exibição) ----------

function fileIconFor(name) {
  const ext = (name || '').split('.').pop().toLowerCase();
  if (ext === 'pdf') return '📕';
  if (['doc', 'docx', 'odt', 'rtf'].includes(ext)) return '📄';
  if (['xls', 'xlsx', 'csv'].includes(ext)) return '📊';
  if (['ppt', 'pptx'].includes(ext)) return '📽️';
  if (['jpg', 'jpeg', 'png'].includes(ext)) return '🖼️';
  return '📎';
}

function formatFileSize(bytes) {
  if (!bytes) return '';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function renderFileAttachment(url, name, size) {
  if (!url) return '';
  return `<a class="chat-file-attachment" href="${url}" target="_blank" rel="noopener noreferrer">
    <span class="file-icon">${fileIconFor(name)}</span>
    <span class="file-info">
      <span class="file-name">${escapeHtml(name || 'arquivo')}</span>
      <span class="file-size">${formatFileSize(size)}${size ? ' · ' : ''}abrir ↗</span>
    </span>
  </a>`;
}

let selectedChatFile = null;

function renderChatFilePreview() {
  const preview = document.getElementById('chat-file-preview');
  if (!preview) return;
  if (!selectedChatFile) {
    preview.classList.add('hidden');
    preview.innerHTML = '';
    return;
  }
  preview.classList.remove('hidden');
  preview.innerHTML = `<span class="chat-file-chip">📎 ${escapeHtml(selectedChatFile.name)} <button type="button" id="btn-remove-chat-file">✕</button></span>`;
  document.getElementById('btn-remove-chat-file').addEventListener('click', clearSelectedChatFile);
}

function clearSelectedChatFile() {
  selectedChatFile = null;
  const input = document.getElementById('chat-file-input');
  if (input) input.value = '';
  renderChatFilePreview();
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
      const bodyHtml = m.body ? escapeHtml(m.body) : '';
      const fileHtml = renderFileAttachment(m.file_url, m.file_name, m.file_size);
      return `<div class="chat-bubble ${m.sender}">
        <span class="chat-meta">${who} · ${date}</span>
        ${bodyHtml}${fileHtml}
      </div>`;
    }).join('');
  }
  thread.scrollTop = thread.scrollHeight;
}

// ---------- Modal de senha: zerar progresso das lições ----------

function openResetPasswordModal() {
  const modal = document.getElementById('reset-password-modal');
  const input = document.getElementById('reset-password-input');
  const error = document.getElementById('reset-password-error');
  input.value = '';
  error.classList.add('hidden');
  modal.classList.remove('hidden');
  input.focus();
}

function closeResetPasswordModal() {
  document.getElementById('reset-password-modal').classList.add('hidden');
}

async function confirmResetPassword() {
  const input = document.getElementById('reset-password-input');
  const error = document.getElementById('reset-password-error');
  const confirmBtn = document.getElementById('reset-password-confirm');

  confirmBtn.disabled = true;
  // Prioridade: senha cadastrada pelo professor para este aluno (Supabase).
  // Se não houver Supabase ou nenhuma senha cadastrada para o aluno, cai
  // para a senha global de config.js como alternativa.
  let expectedPassword = await getMyResetPassword();
  if (!expectedPassword) {
    expectedPassword = (window.APP_CONFIG && window.APP_CONFIG.resetProgressPassword) || '';
  }
  confirmBtn.disabled = false;

  if (!expectedPassword) {
    error.textContent = 'Nenhuma senha configurada. Peça ao professor para cadastrar uma no painel.';
    error.classList.remove('hidden');
    return;
  }

  if (input.value !== expectedPassword) {
    error.textContent = 'Senha incorreta. Peça a senha ao professor.';
    error.classList.remove('hidden');
    input.value = '';
    input.focus();
    return;
  }

  closeResetPasswordModal();
  await resetAllProgress();
  await renderProfileView();
  alert('Progresso zerado.');
}

function setupResetPasswordModal() {
  document.getElementById('reset-password-cancel').addEventListener('click', closeResetPasswordModal);
  document.getElementById('reset-password-confirm').addEventListener('click', confirmResetPassword);
  document.getElementById('reset-password-modal').addEventListener('click', (e) => {
    if (e.target.id === 'reset-password-modal') closeResetPasswordModal();
  });
  document.getElementById('reset-password-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); confirmResetPassword(); }
    if (e.key === 'Escape') closeResetPasswordModal();
  });
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

  document.getElementById('btn-reset-progress').addEventListener('click', openResetPasswordModal);

  document.getElementById('btn-logout').addEventListener('click', async () => {
    if (!confirm('Sair da conta? Você vai precisar do usuário e senha para entrar de novo.')) return;
    await signOutStudent();
    document.getElementById('bottom-nav').style.display = 'none';
    setAuthMode('login');
    showScreen('auth');
  });

  document.getElementById('btn-attach-file').addEventListener('click', () => {
    document.getElementById('chat-file-input').click();
  });

  document.getElementById('chat-file-input').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert('Arquivo muito grande (máximo 10MB).');
      e.target.value = '';
      return;
    }
    selectedChatFile = file;
    renderChatFilePreview();
  });

  document.getElementById('btn-send-message').addEventListener('click', async () => {
    const input = document.getElementById('chat-input');
    const text = input.value.trim();
    if (!text && !selectedChatFile) return;
    const btn = document.getElementById('btn-send-message');
    btn.disabled = true;
    const result = await sendMessageToTeacher(text, selectedChatFile);
    btn.disabled = false;
    if (!result.ok) { alert(result.message); return; }
    input.value = '';
    clearSelectedChatFile();
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
            <span style="font-size:13px;font-weight:700;color:#B75E3D;">${detail.score}/${detail.total} (${detail.pct}%)</span>
          </div>
          <div style="margin-top:4px;font-size:11.5px;color:#888;">${detail.variation || ''} • Tentativa ${detail.attempt}/${detail.maxAttempts}${dateStr ? ' • ' + dateStr : ''}</div>
          <div style="margin-top:4px;font-size:11.5px;color:${canRetake ? '#3C7A52' : '#B23B2E'};">${canRetake ? 'Você pode refazer o teste mais uma vez' : 'Todas as tentativas utilizadas'}</div>
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

  const GROUP_META = {
    'Manual Básico — Classes Gramaticais': {
      icon: '🔤',
      short: 'Manual Básico',
      blurb: 'As 10 classes gramaticais — substantivo, verbo, pronome e mais, com exemplos e exercícios.'
    },
    'Manual Prático — Língua Portuguesa': {
      icon: '📘',
      short: 'Manual Prático',
      blurb: 'Morfologia, sintaxe, concordância, crase, pontuação e interpretação — teoria e prática.'
    },
    'Outros': {
      icon: '📎',
      short: 'Outros',
      blurb: 'Materiais extras e conteúdos em teste.'
    }
  };
  const GROUP_ORDER = [
    'Manual Básico — Classes Gramaticais',
    'Manual Prático — Língua Portuguesa',
    'Outros'
  ];

  const groups = {};
  EXTRAS.forEach(extra => {
    const g = extra.group || 'Outros';
    if (!groups[g]) groups[g] = [];
    groups[g].push(extra);
  });

  // Se um manual está aberto, mostra só as lições dele + voltar
  if (window._extraOpenGroup && groups[window._extraOpenGroup]) {
    const groupName = window._extraOpenGroup;
    const meta = GROUP_META[groupName] || { icon: '📎', short: groupName, blurb: '' };
    const items = groups[groupName];

    const back = document.createElement('button');
    back.type = 'button';
    back.className = 'extra-back-btn';
    back.innerHTML = '← Voltar aos manuais';
    back.addEventListener('click', () => {
      window._extraOpenGroup = null;
      renderExtras();
    });
    list.appendChild(back);

    const header = document.createElement('div');
    header.className = 'extra-folder-header';
    header.innerHTML = `
      <div class="extra-folder-header-icon">${meta.icon}</div>
      <div>
        <div class="extra-folder-header-title">${meta.short}</div>
        <div class="extra-folder-header-sub">${items.length} lição${items.length === 1 ? '' : 'ões'} · toque para estudar</div>
      </div>
    `;
    list.appendChild(header);

    items.forEach(extra => {
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
      card.addEventListener('click', () => { window.location.href = extra.url; });
      list.appendChild(card);
    });
    return;
  }

  // Visão inicial: duas (ou mais) caixas de manual
  const grid = document.createElement('div');
  grid.className = 'extra-folder-grid';

  GROUP_ORDER.forEach(groupName => {
    const items = groups[groupName];
    if (!items || items.length === 0) return;
    const meta = GROUP_META[groupName] || { icon: '📎', short: groupName, blurb: '' };

    const box = document.createElement('button');
    box.type = 'button';
    box.className = 'extra-folder-card';
    box.innerHTML = `
      <div class="extra-folder-card-top">
        <span class="extra-folder-card-icon">${meta.icon}</span>
        <span class="extra-folder-card-count">${items.length} lições</span>
      </div>
      <div class="extra-folder-card-title">${meta.short}</div>
      <div class="extra-folder-card-blurb">${meta.blurb}</div>
      <div class="extra-folder-card-cta">Abrir manual ›</div>
    `;
    box.addEventListener('click', () => {
      window._extraOpenGroup = groupName;
      renderExtras();
    });
    grid.appendChild(box);
  });

  list.appendChild(grid);
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
      <div class="icon locked-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="width:20px;height:20px;"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg></div>
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

// Lições adicionadas pelo professor pelo painel (upload de HTML) só existem
// com Supabase configurado. Busca uma vez (por sessão do app) e mescla no
// catálogo estático: 'lessons' entra em LESSONS (com bloqueio sequencial
// normal), 'extras' entra em EXTRAS (sem bloqueio).
let customLessonsLoaded = false;

async function loadCustomLessonsIntoCatalog() {
  if (customLessonsLoaded) return;
  customLessonsLoaded = true;
  if (!isUsingCloud()) return;
  const custom = await getCustomLessons();
  custom.forEach(item => {
    if (item.section === 'extras') {
      if (!EXTRAS.some(e => e.id === item.id)) {
        if (!item.group) item.group = 'Outros';
        EXTRAS.push(item);
      }
    } else {
      if (!LESSONS.some(l => l.id === item.id)) LESSONS.push(item);
    }
  });
}

async function enterApp() {
  await loadCustomLessonsIntoCatalog();
  document.getElementById('bottom-nav').style.display = 'flex';
  showScreen('menu');
}

async function boot() {
  showLoadingState(true);
  await initDataLayer();

  setupAuthScreen();
  setupProfileScreen();
  setupProfileViewScreen();
  setupResetPasswordModal();

  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => showScreen(btn.dataset.screen));
  });

  document.querySelectorAll('.menu-btn').forEach(btn => {
    btn.addEventListener('click', () => showScreen(btn.dataset.screen));
  });

  setupAiChat();

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
      await enterApp();
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
  if (!('serviceWorker' in navigator)) return;

  navigator.serviceWorker.register('./sw.js').then((registration) => {
    // Se já existir uma versão nova esperando (ex: publicada enquanto o
    // aluno estava com o app aberto), avisa na hora.
    if (registration.waiting && navigator.serviceWorker.controller) {
      showUpdateBanner(registration);
    }

    // Detecta quando uma nova versão termina de baixar em segundo plano.
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      if (!newWorker) return;
      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          // Já havia um service worker controlando a página antes —
          // ou seja, isso é uma atualização, não a primeira instalação.
          showUpdateBanner(registration);
        }
      });
    });

    // Verifica se saiu uma versão nova sempre que o aluno volta pro app
    // (ex: depois de um tempo em outra aba ou app).
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') registration.update();
    });
  }).catch(() => {
    console.log('Service worker não registrado (provavelmente rodando via file://).');
  });

  // Depois que o novo service worker assume o controle (só acontece quando
  // o aluno clica em "Atualizar agora" no aviso), recarrega a página uma
  // única vez para carregar os arquivos novos.
  let reloading = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (reloading) return;
    reloading = true;
    window.location.reload();
  });
}

function showUpdateBanner(registration) {
  const slot = document.getElementById('update-banner-slot');
  if (!slot || slot.dataset.shown) return; // não duplica o aviso
  slot.dataset.shown = 'true';
  slot.innerHTML = `
    <div class="install-banner">
      <span>✨ Tem uma versão nova do app disponível!</span>
      <button id="btn-app-update">Atualizar agora</button>
    </div>
  `;
  document.getElementById('btn-app-update').addEventListener('click', () => {
    if (registration.waiting) {
      registration.waiting.postMessage('SKIP_WAITING');
    } else {
      window.location.reload();
    }
  });
}

// ─── PRATICAR COM IA (chat de conversação com personalidades criadas pelo aluno) ──
let aiChatHistory = []; // [{role:'user'|'model', text}] — da personalidade aberta no momento
let aiChatBusy = false;
let aiChatCurrentPersonaId = null; // id da personalidade aberta na tela de conversa

// Áudio: gravação (aluno fala) e leitura em voz (TTS do navegador, sem custo de IA)
let aiChatMediaRecorder = null;
let aiChatAudioChunks = [];
let aiChatRecording = false;
const AI_CHAT_MAX_RECORD_MS = 30000; // 30s é suficiente pra prática e mantém o áudio leve
let aiChatRecordTimeout = null;
let aiChatTtsEnabled = localStorage.getItem('aiChatTtsEnabled') === '1';

const PERSONA_EMOJIS = ['🤖', '🐱', '🧒', '🧑', '💼', '👴', '🦸', '🧑‍🚀', '🐉', '🎸', '⚽', '📚'];
let personaEmojiSelected = PERSONA_EMOJIS[0];
let personaGenderSelected = 'female'; // 'female' | 'male' — obrigatório escolher um dos dois

// ---------- Armazenamento das personalidades (localStorage, por aluno/aparelho) ----------

function getAiChatPersonas() {
  try { return JSON.parse(localStorage.getItem('aiChatPersonas') || '[]') || []; }
  catch (e) { return []; }
}

function saveAiChatPersonas(list) {
  localStorage.setItem('aiChatPersonas', JSON.stringify(list));
}

function aiChatHistoryKey(id) { return 'aiChatHistory_' + id; }

function getAiChatHistoryFor(id) {
  try { return JSON.parse(localStorage.getItem(aiChatHistoryKey(id)) || '[]') || []; }
  catch (e) { return []; }
}

function saveAiChatHistoryFor(id, hist) {
  localStorage.setItem(aiChatHistoryKey(id), JSON.stringify(hist));
}

function aiChatEscapeHtml(s) {
  const div = document.createElement('div');
  div.textContent = s;
  return div.innerHTML;
}

// Tenta achar uma voz em inglês compatível com o gênero escolhido pro aluno (melhor esforço:
// o navegador nem sempre expõe o gênero, então usamos nomes comuns de vozes femininas/masculinas).
const TTS_FEMALE_HINTS = ['female', 'zira', 'samantha', 'victoria', 'karen', 'moira', 'tessa', 'fiona', 'susan', 'amy', 'salli', 'joanna'];
const TTS_MALE_HINTS = ['male', 'david', 'alex', 'daniel', 'fred', 'thomas', 'oliver', 'james', 'george', 'matthew', 'guy'];

function aiChatPickVoice(gender) {
  if (!('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices().filter(v => /^en/i.test(v.lang));
  if (voices.length === 0) return null;
  const hints = gender === 'male' ? TTS_MALE_HINTS : TTS_FEMALE_HINTS;
  const match = voices.find(v => hints.some(h => v.name.toLowerCase().includes(h)));
  return match || voices[0];
}

function aiChatSpeak(text, gender) {
  if (!aiChatTtsEnabled || !text) return;
  if (!('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel(); // corta qualquer fala anterior antes de começar a nova
    // Remove marcações que não fazem sentido faladas (ex: parênteses de tradução ficam, mas emojis somem)
    const clean = text.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '').trim();
    if (!clean) return;
    const utter = new SpeechSynthesisUtterance(clean);
    utter.lang = 'en-US';
    utter.rate = 0.95;
    const voice = aiChatPickVoice(gender || 'female');
    if (voice) utter.voice = voice;
    window.speechSynthesis.speak(utter);
  } catch (e) { /* TTS não é essencial — falha silenciosa */ }
}

function aiChatBlobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(',')[1] || '');
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

async function aiChatToggleRecording() {
  const micBtn = document.getElementById('btn-ai-chat-mic');
  const status = document.getElementById('ai-chat-recording-status');
  const micIdle = micBtn ? micBtn.querySelector('.mic-icon-idle') : null;
  const micRec = micBtn ? micBtn.querySelector('.mic-icon-recording') : null;

  if (aiChatRecording) {
    // Toque de novo = parar e enviar
    if (aiChatMediaRecorder && aiChatMediaRecorder.state !== 'inactive') aiChatMediaRecorder.stop();
    return;
  }

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert('Seu navegador não permite gravar áudio aqui. Tente digitar a mensagem.');
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    aiChatAudioChunks = [];
    const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : '';
    aiChatMediaRecorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);

    aiChatMediaRecorder.addEventListener('dataavailable', (e) => {
      if (e.data && e.data.size > 0) aiChatAudioChunks.push(e.data);
    });

    aiChatMediaRecorder.addEventListener('stop', async () => {
      stream.getTracks().forEach(t => t.stop());
      aiChatRecording = false;
      if (aiChatRecordTimeout) { clearTimeout(aiChatRecordTimeout); aiChatRecordTimeout = null; }
      if (micBtn) micBtn.classList.remove('recording');
      if (micIdle) micIdle.classList.remove('hidden');
      if (micRec) micRec.classList.add('hidden');
      if (status) status.classList.add('hidden');

      if (aiChatAudioChunks.length === 0) return;
      const blob = new Blob(aiChatAudioChunks, { type: aiChatMediaRecorder.mimeType || 'audio/webm' });
      const base64 = await aiChatBlobToBase64(blob);
      aiChatSend({ mimeType: blob.type || 'audio/webm', data: base64 });
    });

    aiChatMediaRecorder.start();
    aiChatRecording = true;
    if (micBtn) micBtn.classList.add('recording');
    if (micIdle) micIdle.classList.add('hidden');
    if (micRec) micRec.classList.remove('hidden');
    if (status) status.classList.remove('hidden');

    // Corta automaticamente depois de um tempo, pra não gravar áudio gigante sem querer
    aiChatRecordTimeout = setTimeout(() => {
      if (aiChatMediaRecorder && aiChatMediaRecorder.state !== 'inactive') aiChatMediaRecorder.stop();
    }, AI_CHAT_MAX_RECORD_MS);
  } catch (e) {
    console.error('Erro ao acessar microfone:', e);
    alert('Não consegui acessar o microfone. Verifique a permissão do navegador.');
  }
}

function aiChatRenderThread() {
  const thread = document.getElementById('ai-chat-thread');
  if (!thread) return;
  const persona = getAiChatPersonas().find(p => p.id === aiChatCurrentPersonaId);
  const aiName = (persona && persona.name) || 'IA';
  const aiEmoji = (persona && persona.emoji) || '🤖';
  thread.innerHTML = aiChatHistory.map(m => {
    const cls = m.role === 'user' ? 'student' : 'teacher';
    const label = m.role === 'user' ? 'Você' : aiName;
    const prefix = m.viaAudio ? '🎤 ' : '';
    const bubble = `<div class="chat-bubble ${cls}"><span class="chat-meta">${label}</span>${prefix}${aiChatEscapeHtml(m.text).replace(/\n/g, '<br>')}</div>`;
    if (cls === 'teacher') {
      return `<div class="ai-msg-row"><span class="ai-msg-avatar" aria-hidden="true">${aiEmoji}</span>${bubble}</div>`;
    }
    return bubble;
  }).join('');
  thread.scrollTop = thread.scrollHeight;
}

function aiChatGreetingFor(persona, studentName) {
  const hi = studentName ? `, ${studentName}` : '';
  return `${persona.emoji || '🤖'} Hi${hi}! I'm ${persona.name}. Let's practice English together — ask me anything or tell me about your day. What would you like to talk about?`;
}

// ---------- Navegação entre as 3 sub-telas de "Praticar com a IA" ----------

function aiChatShowListView() {
  document.getElementById('ai-chat-conversation-view').classList.add('hidden');
  document.getElementById('ai-chat-create-view').classList.add('hidden');
  document.getElementById('ai-chat-list-view').classList.remove('hidden');
  aiChatCurrentPersonaId = null;
  renderAiChatPersonaList();
}

function aiChatShowCreateView() {
  document.getElementById('ai-chat-list-view').classList.add('hidden');
  document.getElementById('ai-chat-conversation-view').classList.add('hidden');
  document.getElementById('ai-chat-create-view').classList.remove('hidden');
  document.getElementById('input-persona-name').value = '';
  document.getElementById('input-persona-personality').value = '';
  personaEmojiSelected = PERSONA_EMOJIS[0];
  personaGenderSelected = 'female';
  renderPersonaEmojiPicker();
  renderPersonaGenderPicker();
}

async function aiChatOpenPersona(id) {
  const persona = getAiChatPersonas().find(p => p.id === id);
  if (!persona) return;
  aiChatCurrentPersonaId = id;

  document.getElementById('ai-chat-list-view').classList.add('hidden');
  document.getElementById('ai-chat-create-view').classList.add('hidden');
  document.getElementById('ai-chat-conversation-view').classList.remove('hidden');
  document.getElementById('ai-chat-conv-title').innerHTML = `
    <span class="ai-conv-avatar">${persona.emoji || '🤖'}</span>
    <span class="ai-conv-info">
      <span class="ai-conv-name">${aiChatEscapeHtml(persona.name)}</span>
      <span class="ai-conv-status"><span class="ai-conv-status-dot"></span>disponível para conversar</span>
    </span>
  `;

  aiChatHistory = getAiChatHistoryFor(id);
  if (aiChatHistory.length === 0) {
    let profile = {};
    try { profile = (await getProfile()) || {}; } catch (e) { /* sem perfil ainda */ }
    aiChatHistory = [{ role: 'model', text: aiChatGreetingFor(persona, profile.name || '') }];
    saveAiChatHistoryFor(id, aiChatHistory);
  }
  aiChatRenderThread();
}
function renderAiChatPersonaList() {
  const list = document.getElementById('ai-chat-persona-list');
  if (!list) return;
  const personas = getAiChatPersonas();
  if (personas.length === 0) {
    list.innerHTML = '<div class="chat-empty" style="background:var(--cream-2); border-radius:12px; padding:18px 12px;">Você ainda não criou nenhuma personalidade. Toque em "Criar nova personalidade" acima para começar sua primeira conversa! 🎉</div>';
    return;
  }
  list.innerHTML = personas.map(p => `
    <div class="persona-card" data-id="${p.id}">
      <div class="icon">${p.emoji || '🤖'}</div>
      <div class="info">
        <div class="name">${aiChatEscapeHtml(p.name)} <span class="gender-badge">${p.gender === 'male' ? '♂️' : '♀️'}</span></div>
        <div class="personality-preview">${aiChatEscapeHtml(p.personality || '')}</div>
      </div>
      <div class="chevron">›</div>
    </div>
  `).join('');
  list.querySelectorAll('.persona-card').forEach(card => {
    card.addEventListener('click', () => aiChatOpenPersona(card.dataset.id));
  });
}

function renderPersonaGenderPicker() {
  const picker = document.getElementById('persona-gender-picker');
  if (!picker) return;
  const options = [
    { id: 'female', label: '♀️ Feminino' },
    { id: 'male', label: '♂️ Masculino' }
  ];
  picker.innerHTML = options.map(o =>
    `<button type="button" class="persona-gender-btn${o.id === personaGenderSelected ? ' selected' : ''}" data-gender="${o.id}">${o.label}</button>`
  ).join('');
  picker.querySelectorAll('.persona-gender-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      personaGenderSelected = btn.dataset.gender;
      renderPersonaGenderPicker();
    });
  });
}

function renderPersonaEmojiPicker() {
  const picker = document.getElementById('persona-emoji-picker');
  if (!picker) return;
  picker.innerHTML = PERSONA_EMOJIS.map(e =>
    `<button type="button" class="persona-emoji-btn${e === personaEmojiSelected ? ' selected' : ''}" data-emoji="${e}">${e}</button>`
  ).join('');
  picker.querySelectorAll('.persona-emoji-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      personaEmojiSelected = btn.dataset.emoji;
      renderPersonaEmojiPicker();
    });
  });
}

function aiChatCreatePersonaFromForm() {
  const name = document.getElementById('input-persona-name').value.trim().slice(0, 30);
  const personality = document.getElementById('input-persona-personality').value.trim().slice(0, 300);
  if (!name) { alert('Dê um nome para a personalidade.'); return; }
  if (!personality) { alert('Descreva um pouco a personalidade dela.'); return; }

  const persona = {
    id: 'p_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
    name,
    personality,
    emoji: personaEmojiSelected,
    gender: personaGenderSelected,
    createdAt: new Date().toISOString()
  };
  const list = getAiChatPersonas();
  list.push(persona);
  saveAiChatPersonas(list);
  aiChatOpenPersona(persona.id);
}

function aiChatDeleteCurrentPersona() {
  if (!aiChatCurrentPersonaId) return;
  if (!confirm('Excluir essa personalidade e toda a conversa com ela? Essa ação não pode ser desfeita.')) return;
  const list = getAiChatPersonas().filter(p => p.id !== aiChatCurrentPersonaId);
  saveAiChatPersonas(list);
  localStorage.removeItem(aiChatHistoryKey(aiChatCurrentPersonaId));
  aiChatShowListView();
}

function aiChatResetConversation() {
  if (!aiChatCurrentPersonaId) return;
  localStorage.removeItem(aiChatHistoryKey(aiChatCurrentPersonaId));
  aiChatHistory = [];
  aiChatOpenPersona(aiChatCurrentPersonaId);
}

async function aiChatSend(audioPayload) {
  if (aiChatBusy || !aiChatCurrentPersonaId) return;
  const input = document.getElementById('ai-chat-input');
  const typing = document.getElementById('ai-chat-typing');
  if (!input) return;
  const text = input.value.trim();
  if (!text && !audioPayload) return;

  const persona = getAiChatPersonas().find(p => p.id === aiChatCurrentPersonaId);
  if (!persona) return;

  let profile = {};
  try { profile = (await getProfile()) || {}; } catch (e) { /* sem perfil ainda */ }

  // Se veio de gravação, ainda não sabemos o que o aluno disse (a transcrição acontece do lado da IA),
  // então mostramos um rótulo genérico na bolha; a IA recebe o áudio de verdade na requisição.
  const displayText = audioPayload ? (text || '(mensagem em áudio)') : text;
  aiChatHistory.push({ role: 'user', text: displayText, viaAudio: !!audioPayload });
  input.value = '';
  aiChatRenderThread();
  saveAiChatHistoryFor(persona.id, aiChatHistory);

  aiChatBusy = true;
  if (typing) {
    typing.innerHTML = `<span class="ai-msg-avatar" aria-hidden="true">${persona.emoji || '🤖'}</span><span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>`;
    typing.classList.remove('hidden');
  }

  try {
    const body = {
      message: text, // pode vir vazio quando é só áudio — o servidor aceita
      history: aiChatHistory.slice(0, -1), // tudo exceto a mensagem que acabou de entrar
      level: profile.level || 'A1',
      name: profile.name || '',
      personality: persona.personality,
      aiName: persona.name,
      gender: persona.gender === 'male' ? 'male' : 'female'
    };
    if (audioPayload) body.audio = audioPayload;

    const resp = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await resp.json().catch(() => ({}));
    if (!resp.ok || !data.reply) {
      aiChatHistory.push({ role: 'model', text: '⚠️ ' + (data.error || 'Não consegui responder agora. Tente novamente em instantes.') });
    } else {
      aiChatHistory.push({ role: 'model', text: data.reply });
      aiChatSpeak(data.reply, persona.gender);
    }
  } catch (err) {
    console.error(err);
    aiChatHistory.push({ role: 'model', text: '⚠️ Erro de conexão. Verifique sua internet e tente de novo.' });
  } finally {
    aiChatBusy = false;
    if (typing) typing.classList.add('hidden');
    aiChatRenderThread();
    if (aiChatCurrentPersonaId) saveAiChatHistoryFor(aiChatCurrentPersonaId, aiChatHistory);
  }
}

function setupAiChat() {
  const btnSend = document.getElementById('btn-send-ai-message');
  const input = document.getElementById('ai-chat-input');
  const btnReset = document.getElementById('btn-ai-chat-reset');
  const btnMic = document.getElementById('btn-ai-chat-mic');
  const chkTts = document.getElementById('chk-ai-chat-tts');
  const btnNewPersona = document.getElementById('btn-ai-chat-new-persona');
  const btnCreateBack = document.getElementById('btn-ai-chat-create-back');
  const btnCreateSubmit = document.getElementById('btn-ai-chat-create-submit');
  const btnConvBack = document.getElementById('btn-ai-chat-conv-back');
  const btnDeletePersona = document.getElementById('btn-ai-chat-delete-persona');
  if (!btnSend || !input) return; // tela não presente nesta versão

  btnSend.addEventListener('click', () => aiChatSend());
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      aiChatSend();
    }
  });
  if (btnReset) btnReset.addEventListener('click', aiChatResetConversation);
  if (btnMic) btnMic.addEventListener('click', aiChatToggleRecording);
  if (btnNewPersona) btnNewPersona.addEventListener('click', aiChatShowCreateView);
  if (btnCreateBack) btnCreateBack.addEventListener('click', aiChatShowListView);
  if (btnCreateSubmit) btnCreateSubmit.addEventListener('click', aiChatCreatePersonaFromForm);
  if (btnConvBack) btnConvBack.addEventListener('click', aiChatShowListView);
  if (btnDeletePersona) btnDeletePersona.addEventListener('click', aiChatDeleteCurrentPersona);

  document.querySelectorAll('.persona-suggestion').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('input-persona-personality').value = btn.dataset.personality;
    });
  });

  if (chkTts) {
    chkTts.checked = aiChatTtsEnabled;
    chkTts.addEventListener('change', () => {
      aiChatTtsEnabled = chkTts.checked;
      localStorage.setItem('aiChatTtsEnabled', aiChatTtsEnabled ? '1' : '0');
      if (!aiChatTtsEnabled && 'speechSynthesis' in window) window.speechSynthesis.cancel();
    });
  }

  // Sempre que o aluno entra na tela "Praticar com a IA", volta pra lista de personalidades
  const aiChatMenuBtn = document.querySelector('.menu-btn[data-screen="ai-chat"]');
  if (aiChatMenuBtn) aiChatMenuBtn.addEventListener('click', aiChatShowListView);
}

document.addEventListener('DOMContentLoaded', boot);
