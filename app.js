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
    description: 'Descubra sua fase no inglês (A1–C2) — diferente a cada tentativa!',
    url: 'lessons/nivelamento.html',
    totalQuestions: 30
  }
];

// Catálogo de matérias extras (aba "Extra"). Diferente das lições de inglês,
// aqui não há bloqueio nem pré-requisito: todo aluno pode acessar direto.
const EXTRAS = [
  {
    id: 'manual-portugues-basico',
    group: 'Manual Básico — Classes Gramaticais',
    name: 'Capa — Manual Básico',
    icon: '📗',
    description: 'Visão geral das 10 classes gramaticais, com revisão final antes de começar',
    url: 'lessons/manual-portugues-basico.html'
  },
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
    id: 'manual-portugues',
    group: 'Manual Prático — Língua Portuguesa',
    name: 'Capa — Manual Prático',
    icon: '📘',
    description: 'Visão geral da língua portuguesa, com revisão final antes de começar',
    url: 'lessons/manual-portugues.html'
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
    description: 'Sujeito, predicado, objetos, termos acessórios e o núcleo de cada termo',
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
  },
  {
    id: 'caca-palavras-portugues',
    group: 'Jogos',
    name: 'Caça-Palavras — Português',
    icon: '🔎',
    description: 'Classes gramaticais, áreas da gramática e sinais de pontuação escondidos na grade',
    url: 'lessons/caca-palavras-portugues.html'
  },
  {
    id: 'labirinto-sintaxe',
    group: 'Jogos',
    name: 'Labirinto da Oração',
    icon: '🐾',
    description: 'Percorra o labirinto e encontre sujeito, verbo, complementos e adjuntos na ordem certa — frase e tema novos a cada rodada',
    url: 'lessons/labirinto-sintaxe.html'
  },
  {
    id: 'empurra-palavras',
    group: 'Jogos',
    name: 'Empurra-Palavras',
    icon: '📦',
    description: 'Empurre as caixinhas de palavras até os lugares certos para montar a frase',
    url: 'lessons/empurra-palavras.html'
  },
  {
    id: 'cobrinha-ortografia',
    group: 'Jogos',
    name: 'Cobrinha da Ortografia',
    icon: '🐍',
    description: 'A palavra aparece escrita errada — guie a cobrinha até comer a letra do erro antes que ela se choque',
    url: 'lessons/cobrinha-ortografia.html'
  },
  {
    id: 'concordancia-monta-frase',
    group: 'Jogos',
    name: 'Concordância — Monta a Frase',
    icon: '✏️',
    description: 'Receba uma frase sem concordância e monte a versão correta escolhendo as palavras certas no banco',
    url: 'lessons/concordancia-monta-frase.html'
  }

];

const LESSONS = [
  {
    id: "pronuncia-essencial",
    name: "Pronúncia Essencial do Inglês",
    level: "Introdutório",
    icon: "🔤",
    description: "Comece por aqui: alfabeto, vogais, consoantes e combinações mais comuns",
    url: "lessons/pronuncia-essencial.html",
    totalQuestions: 15
  },
  {
    id: "verb-to-be",
    name: "Lição 1 — Verb To Be",
    level: "A1",
    icon: "📘",
    description: "am, is, are — afirmativas, negativas e perguntas",
    url: "lessons/verb-to-be.html",
    totalQuestions: 13
  },
  {
    id: "saudacoes-apresentacoes",
    name: "Lição 2 — Saudações e Apresentações",
    level: "A1",
    icon: "👋",
    description: "Greetings, introductions e diálogos com áudio",
    url: "lessons/saudacoes-apresentacoes.html",
    totalQuestions: 13
  },
  {
    id: "licao-2-perguntas-artigos",
    name: "Lição 3 — Fazendo Perguntas e Apresentando Coisas",
    level: "A1",
    icon: "❓",
    description: "Wh- words, artigos a/an/the — base para perguntar sobre pessoas e coisas",
    url: "lessons/licao-2-perguntas-artigos.html",
    totalQuestions: 20
  },
  {
    id: "licao-3-revisao-perguntas",
    name: "Lição 4 — Revisando: Quem é Você? O Que é Isso?",
    level: "A1",
    icon: "🔁",
    description: "Revisão de To Be, saudações e Wh- questions com prática de diálogos",
    url: "lessons/licao-3-revisao-perguntas.html",
    totalQuestions: 13
  },
  {
    id: "licao-4-preposicoes",
    name: "Lição 5 — Preposições: Onde? Com Quem? Como?",
    level: "A1",
    icon: "📍",
    description: "Preposições de lugar e companhia para localizar pessoas e coisas",
    url: "lessons/licao-4-preposicoes.html",
    totalQuestions: 13
  },
  {
    id: "licao-5-posse",
    name: "Lição 6 — Posse: De Quem É?",
    level: "A1",
    icon: "🎒",
    description: "Possessivos, 's e whose — falar de pertences e pessoas",
    url: "lessons/licao-5-posse.html",
    totalQuestions: 13
  },
  {
    id: "licao-12-simple-present-daily-life",
    name: "Lição 7 — Simple Present: Rotina e Hábitos",
    level: "A1",
    icon: "🗓️",
    description: "Simple Present, advérbios de frequência e a rotina diária",
    url: "lessons/licao-12-simple-present-daily-life.html",
    totalQuestions: 13
  },
  {
    id: "licao-10-do-does-to-for",
    name: "Lição 8 — DO/DOES, TO e FOR",
    level: "A1",
    icon: "🔧",
    description: "Verbos essenciais, perguntas com DO/DOES e o uso de TO e FOR",
    url: "lessons/licao-10-do-does-to-for.html",
    totalQuestions: 13
  },
  {
    id: "licao-13-perguntas-simple-present",
    name: "Lição 9 — Perguntas no Simple Present",
    level: "A1",
    icon: "🗣️",
    description: "Perguntas e negativas com Do/Does — perguntar sobre pessoas e rotina",
    url: "lessons/licao-13-perguntas-simple-present.html",
    totalQuestions: 13
  },
  {
    id: "licao-15-can-cant",
    name: "Lição 10 — Can / Can't",
    level: "A1",
    icon: "🙌",
    description: "Habilidade, permissão e pedidos do dia a dia com can/can't",
    url: "lessons/licao-15-can-cant.html",
    totalQuestions: 13
  },
  {
    id: "licao-14-there-is-there-are",
    name: "Lição 11 — There Is / There Are",
    level: "A1",
    icon: "🏠",
    description: "Descrevendo lugares e objetos com There is/There are",
    url: "lessons/licao-14-there-is-there-are.html",
    totalQuestions: 13
  },
  {
    id: "licao-6-here-there",
    name: "Lição 12 — Aqui e Ali: Localização",
    level: "A1",
    icon: "📌",
    description: "Localização, posição e phrasal verbs básicos de movimento",
    url: "lessons/licao-6-here-there.html",
    totalQuestions: 13
  },
  {
    id: "licao-8-to-be-passado",
    name: "Lição 13 — To Be no Passado (was/were)",
    level: "A1",
    icon: "⏳",
    description: "Was e were — como era, onde estava, quem estava",
    url: "lessons/licao-8-to-be-passado.html",
    totalQuestions: 13
  },
  {
    id: "licao-21-simple-past-regular",
    name: "Lição 14 — Simple Past: Verbos Regulares",
    level: "A1",
    icon: "⏮️",
    description: "Passado de ação com verbos regulares (-ed) e expressões de tempo",
    url: "lessons/licao-21-simple-past-regular.html",
    totalQuestions: 13
  },
  {
    id: "licao-22-simple-past-irregular",
    name: "Lição 15 — Simple Past: Verbos Irregulares",
    level: "A1",
    icon: "📖",
    description: "Verbos irregulares mais comuns no Simple Past",
    url: "lessons/licao-22-simple-past-irregular.html",
    totalQuestions: 13
  },
  {
    id: "licao-24-future-going-to",
    name: "Lição 16 — Futuro com Going To",
    level: "A1",
    icon: "🎯",
    description: "Planos e intenções futuras com going to",
    url: "lessons/licao-24-future-going-to.html",
    totalQuestions: 13
  },
  {
    id: "licao-25-future-will",
    name: "Lição 17 — Futuro com Will",
    level: "A1",
    icon: "🔮",
    description: "Previsões, decisões espontâneas e promessas com will",
    url: "lessons/licao-25-future-will.html",
    totalQuestions: 13
  },
  {
    id: "licao-9-revisao-completa",
    name: "Lição 18 — Revisão A1: Conversação Básica 🎓",
    level: "A1",
    icon: "📚",
    description: "Projeto final do Semestre 1: se apresentar, perguntar sobre pessoas, rotina, ontem e planos",
    url: "lessons/licao-9-revisao-completa.html",
    totalQuestions: 13
  },
  {
    id: "licao-11-object-possessive-pronouns",
    name: "Lição 19 — Pronomes Objeto e Possessivos",
    level: "A2",
    icon: "👥",
    description: "Object pronouns, possessives e mais verbos essenciais",
    url: "lessons/licao-11-object-possessive-pronouns.html",
    totalQuestions: 13
  },
  {
    id: "licao-16-present-continuous",
    name: "Lição 20 — Present Continuous",
    level: "A2",
    icon: "🏃",
    description: "Ações em andamento e situações temporárias",
    url: "lessons/licao-16-present-continuous.html",
    totalQuestions: 13
  },
  {
    id: "licao-17-countable-uncountable",
    name: "Lição 21 — Contáveis e Incontáveis",
    level: "A2",
    icon: "🍎",
    description: "Countable/uncountable, some, any, much e many",
    url: "lessons/licao-17-countable-uncountable.html",
    totalQuestions: 13
  },
  {
    id: "licao-18-quantities-choices",
    name: "Lição 22 — Quantidades e Escolhas",
    level: "A2",
    icon: "🛒",
    description: "Expressando quantidades e fazendo escolhas em inglês",
    url: "lessons/licao-18-quantities-choices.html",
    totalQuestions: 13
  },
  {
    id: "licao-19-quantities-distance-time",
    name: "Lição 23 — Quantidade, Distância e Tempo",
    level: "A2",
    icon: "📏",
    description: "How much/many/long/far e perguntas de medida",
    url: "lessons/licao-19-quantities-distance-time.html",
    totalQuestions: 13
  },
  {
    id: "licao-20-survival-english",
    name: "Lição 24 — Survival English",
    level: "A2",
    icon: "🌍",
    description: "Inglês de sobrevivência para situações reais do dia a dia",
    url: "lessons/licao-20-survival-english.html",
    totalQuestions: 13
  },
  {
    id: "licao-23-talking-about-the-past",
    name: "Lição 25 — Falando Sobre o Passado",
    level: "A2",
    icon: "🕰️",
    description: "Perguntas, negativas e expressões de tempo no passado (consolidação)",
    url: "lessons/licao-23-talking-about-the-past.html",
    totalQuestions: 13
  },
  {
    id: "licao-26-comparatives-superlatives",
    name: "Lição 26 — Comparativos e Superlativos",
    level: "A2",
    icon: "⚖️",
    description: "Comparando pessoas e coisas em inglês (fase A2)",
    url: "lessons/licao-26-comparatives-superlatives.html",
    totalQuestions: 13
  },
  {
    id: "licao-28-modal-verbs",
    name: "Lição 27 — Verbos Modais (introdução)",
    level: "A2",
    icon: "🔑",
    description: "Could, must, should e outros modais além de can",
    url: "lessons/licao-28-modal-verbs.html",
    totalQuestions: 13
  },
  {
    id: "licao-29-phrasal-verbs",
    name: "Lição 28 — Phrasal Verbs Essenciais",
    level: "A2",
    icon: "🧩",
    description: "Phrasal verbs mais usados no inglês do dia a dia",
    url: "lessons/licao-29-phrasal-verbs.html",
    totalQuestions: 13
  },
  {
    id: "licao-30-revisao-semestre-2",
    name: "Lição 29 — Revisão Geral do Semestre 2 🎓",
    level: "A2",
    icon: "🎓",
    description: "Revisão completa do Semestre 2 (A2) e consolidação",
    url: "lessons/licao-30-revisao-semestre-2.html",
    totalQuestions: 13
  },
  {
    id: "licao-31-past-continuous",
    name: "Lição 30 — Past Continuous",
    level: "B1",
    icon: "⏳",
    description: "Ações em progresso no passado: was/were + verbo-ing",
    url: "lessons/licao-31-past-continuous.html",
    totalQuestions: 13
  },
  {
    id: "licao-32-simple-past-past-continuous",
    name: "Lição 31 — Simple Past × Past Continuous",
    level: "B1",
    icon: "🔀",
    description: "Ações simultâneas e interrompidas ao contar histórias",
    url: "lessons/licao-32-simple-past-past-continuous.html",
    totalQuestions: 12
  },
  {
    id: "licao-27-present-perfect",
    name: "Lição 32 — Present Perfect (introdução)",
    level: "B1",
    icon: "✅",
    description: "Have/has + particípio — primeira abordagem ao Present Perfect",
    url: "lessons/licao-27-present-perfect.html",
    totalQuestions: 12
  },
  {
    id: "licao-33-present-perfect-experiences",
    name: "Lição 33 — Present Perfect: Experiences",
    level: "B1",
    icon: "🌍",
    description: "Experiências de vida com ever, never, before",
    url: "lessons/licao-33-present-perfect-experiences.html",
    totalQuestions: 12
  },
  {
    id: "licao-34-present-perfect-simple-past",
    name: "Lição 34 — Present Perfect × Simple Past",
    level: "B1",
    icon: "⚖️",
    description: "Quando usar cada tempo: since, for, last, ago",
    url: "lessons/licao-34-present-perfect-simple-past.html",
    totalQuestions: 12
  },
  {
    id: "licao-35-present-perfect-already-yet-just",
    name: "Lição 35 — Present Perfect: Already, Yet, Just",
    level: "B1",
    icon: "✅",
    description: "Already, yet, just, still, recently e lately",
    url: "lessons/licao-35-present-perfect-already-yet-just.html",
    totalQuestions: 12
  },
  {
    id: "licao-36-future-will-going-to",
    name: "Lição 36 — Futuro consolidado (Will, Going to & Present Continuous)",
    level: "B1",
    icon: "🔮",
    description: "Decisões espontâneas, planos e compromissos marcados",
    url: "lessons/licao-36-future-will-going-to.html",
    totalQuestions: 12
  },
  {
    id: "licao-37-modal-verbs-advice-obligation",
    name: "Lição 37 — Modais: Conselho, Obrigação e Permissão",
    level: "B1",
    icon: "🔑",
    description: "Should, must, have to, can, may e might em contexto real",
    url: "lessons/licao-37-modal-verbs-advice-obligation.html",
    totalQuestions: 12
  },
  {
    id: "licao-38-comparatives-superlatives-equality",
    name: "Lição 38 — Comparativos, Superlativos e Igualdade",
    level: "B1",
    icon: "📊",
    description: "Bigger, the best, as...as — fase B1",
    url: "lessons/licao-38-comparatives-superlatives-equality.html",
    totalQuestions: 12
  },
  {
    id: "licao-39-conditionals-zero-first",
    name: "Lição 39 — Conditionals: Zero & First",
    level: "B1",
    icon: "🔀",
    description: "Fatos gerais e possibilidades reais com if/unless",
    url: "lessons/licao-39-conditionals-zero-first.html",
    totalQuestions: 12
  },
  {
    id: "licao-40-revisao-semestre-3",
    name: "Lição 40 — Grande Revisão A2 → B1 🎓",
    level: "B1",
    icon: "🎓",
    description: "Revisão completa do Semestre 3 e projeto final B1",
    url: "lessons/licao-40-revisao-semestre-3.html",
    totalQuestions: 12
  }
];

// ---------- Navegação entre telas ----------

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
  document.getElementById('screen-' + id).classList.remove('hidden');

  document.body.classList.toggle('on-auth-screen', id === 'auth' || id === 'landing');
  document.body.classList.toggle('on-landing-screen', id === 'landing');

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
  // Nota: o aviso "info" (ex.: "faça login para acessar as lições") não é
  // limpo aqui de propósito — ele deve continuar visível mesmo se o aluno
  // trocar entre as abas "Entrar" / "Criar conta".
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

// Aviso neutro (não é erro nem sucesso) — usado quando o aluno é mandado
// pra cá porque tentou abrir uma lição sem estar logado.
function showAuthInfo(text) {
  let el = document.getElementById('auth-info');
  if (!el) {
    el = document.createElement('p');
    el.id = 'auth-info';
    el.className = 'auth-alert info';
    const errorEl = document.getElementById('auth-error');
    errorEl.parentNode.insertBefore(el, errorEl);
  }
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

  // Se o aluno tinha tentado abrir uma lição direto (sem estar logado),
  // volta pra ela agora que já entrou — em vez de deixá-lo no menu.
  let pendingLesson = null;
  try { pendingLesson = sessionStorage.getItem('bobcat_pending_lesson'); } catch (e) {}

  const profile = await getProfile();
  if (profile) {
    if (pendingLesson) {
      try { sessionStorage.removeItem('bobcat_pending_lesson'); } catch (e) {}
      window.location.href = 'lessons/' + pendingLesson;
      return;
    }
    await enterApp();
  } else {
    // Perfil novo (primeiro login/cadastro): completa o cadastro primeiro.
    // A lição pendente continua guardada e será retomada depois que o
    // perfil for salvo (ver setupProfileScreen).
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

    let pendingLesson = null;
    try { pendingLesson = sessionStorage.getItem('bobcat_pending_lesson'); } catch (e) {}
    if (pendingLesson) {
      try { sessionStorage.removeItem('bobcat_pending_lesson'); } catch (e) {}
      window.location.href = 'lessons/' + pendingLesson;
      return;
    }
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
  document.getElementById('profile-level-display').textContent = 'Fase ' + profile.level;

  const progress = await getProgress();
  const stats = computeProgressStats(progress);
  document.getElementById('profile-stat-completed').textContent = stats.completed;
  document.getElementById('profile-stat-score').textContent = stats.avgPct !== null ? stats.avgPct + '%' : '—';
  document.getElementById('profile-stat-total').textContent = stats.total;
  const game = await computeGameStats(progress);
  const xpP = document.getElementById('profile-stat-xp');
  if (xpP) xpP.textContent = game.totalXP;
  const stP = document.getElementById('profile-stat-streak');
  if (stP) stP.textContent = game.streak;
  renderAchievementsGrid(game.achievements, game.achievementDefs);
  // level sub line with XP
  const levelSub = document.getElementById('profile-level-display');
  if (levelSub && profile) {
    levelSub.textContent = 'Fase ' + profile.level + ' · ' + game.totalXP + ' XP · 🔥 ' + game.streak + 'd';
  }
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
      ? '☁️ Conta na nuvem'
      : '💾 Salvo neste navegador';
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
    notice.innerHTML = '<div class="chat-empty" style="background:var(--cream-2); border-radius:10px; padding:12px;">💾 Esse canal só funciona com conta na nuvem. Crie uma conta com e-mail e senha para poder falar com o professor.</div>';
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

// ---------- Baixar meus dados (LGPD) ----------

async function downloadMyData() {
  const btn = document.getElementById('btn-download-data');
  const originalText = btn.textContent;
  btn.disabled = true;
  btn.textContent = 'Preparando...';
  try {
    const data = await exportMyData();
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const dateStamp = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `bobcat-meus-dados-${dateStamp}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch (e) {
    console.error('downloadMyData:', e);
    alert('Não foi possível gerar o arquivo agora. Tente de novo em instantes.');
  } finally {
    btn.disabled = false;
    btn.textContent = originalText;
  }
}

// ---------- Modal de confirmação: excluir conta (LGPD) ----------

function openDeleteAccountModal() {
  const modal = document.getElementById('delete-account-modal');
  const input = document.getElementById('delete-account-input');
  const error = document.getElementById('delete-account-error');
  input.value = '';
  error.classList.add('hidden');
  modal.classList.remove('hidden');
  input.focus();
}

function closeDeleteAccountModal() {
  document.getElementById('delete-account-modal').classList.add('hidden');
}

async function confirmDeleteAccount() {
  const input = document.getElementById('delete-account-input');
  const error = document.getElementById('delete-account-error');
  const confirmBtn = document.getElementById('delete-account-confirm');

  if (input.value.trim().toUpperCase() !== 'EXCLUIR') {
    error.textContent = 'Digite exatamente EXCLUIR para confirmar.';
    error.classList.remove('hidden');
    return;
  }

  confirmBtn.disabled = true;
  confirmBtn.textContent = 'Excluindo...';
  const result = await deleteMyAccount();
  confirmBtn.disabled = false;
  confirmBtn.textContent = 'Excluir permanentemente';

  if (!result.ok) {
    error.textContent = result.message || 'Não foi possível excluir a conta. Tente novamente.';
    error.classList.remove('hidden');
    return;
  }

  closeDeleteAccountModal();
  alert('Sua conta e todos os seus dados foram excluídos.');
  document.getElementById('bottom-nav').style.display = 'none';
  setAuthMode('login');
  showScreen('auth');
}

function setupDeleteAccountModal() {
  document.getElementById('delete-account-cancel').addEventListener('click', closeDeleteAccountModal);
  document.getElementById('delete-account-confirm').addEventListener('click', confirmDeleteAccount);
  document.getElementById('delete-account-modal').addEventListener('click', (e) => {
    if (e.target.id === 'delete-account-modal') closeDeleteAccountModal();
  });
  document.getElementById('delete-account-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); confirmDeleteAccount(); }
    if (e.key === 'Escape') closeDeleteAccountModal();
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

  document.getElementById('btn-download-data').addEventListener('click', downloadMyData);
  document.getElementById('btn-delete-account').addEventListener('click', openDeleteAccountModal);

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
            <span style="font-size:13px;font-weight:700;color:#ff5b3d;">${detail.score}/${detail.total} (${detail.pct}%)</span>
          </div>
          <div style="margin-top:4px;font-size:11.5px;color:rgba(247,241,236,0.5);">${detail.variation || ''} • Tentativa ${detail.attempt}/${detail.maxAttempts}${dateStr ? ' • ' + dateStr : ''}</div>
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

async function renderExtras() {
  const list = document.getElementById('extra-list');
  if (!list) return;
  list.innerHTML = '';
  const progress = await getProgress();

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
    'Jogos': {
      icon: '🎮',
      short: 'Jogos',
      blurb: 'Caça-palavras, labirinto e outros jogos para praticar gramática de um jeito leve.'
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
    'Jogos',
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
      const p = progress[extra.id];
      const done = !!(p && p.completed);
      const pct = p && p.total > 0 ? Math.round((p.correct / p.total) * 100) : 0;
      const badge = done ? `✓ ${pct}%` : (p ? `${pct}%` : 'Aberto');

      const card = document.createElement('div');
      card.className = 'lesson-card';
      card.innerHTML = `
        <div class="icon">${extra.icon}</div>
        <div class="info">
          <div class="name">${extra.name}</div>
          <div class="level">${extra.description}</div>
        </div>
        <div class="badge ${done ? 'done' : ''}">${badge}</div>
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
    const doneCount = items.filter(it => progress[it.id] && progress[it.id].completed).length;
    const countLabel = doneCount > 0
      ? `${doneCount}/${items.length} concluídas`
      : `${items.length} lições`;

    const box = document.createElement('button');
    box.type = 'button';
    box.className = 'extra-folder-card';
    box.innerHTML = `
      <div class="extra-folder-card-top">
        <span class="extra-folder-card-icon">${meta.icon}</span>
        <span class="extra-folder-card-count">${countLabel}</span>
      </div>
      <div class="extra-folder-card-title">${meta.short}${doneCount === items.length ? ' ✓' : ''}</div>
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
  document.getElementById('menu-level-sub').textContent = 'Fase ' + profile.level + ' • o que vamos fazer hoje?';
}

// ---------- Tela Home / lista de lições ----------

async function renderHome() {
  const profile = await getProfile();
  if (!profile) return;

  document.getElementById('home-avatar').textContent = profile.avatar;
  document.getElementById('home-greeting').textContent = 'Olá, ' + profile.name + '!';
  document.getElementById('home-level-sub').textContent = 'Fase ' + profile.level + ' • continue praticando';

  const progress = await getProgress();
  const stats = computeProgressStats(progress);
  const game = await computeGameStats(progress);

  document.getElementById('stat-completed').textContent = stats.completed;
  const xpEl = document.getElementById('stat-xp');
  if (xpEl) xpEl.textContent = game.totalXP;
  document.getElementById('stat-streak').textContent = game.streak;
  document.getElementById('stat-score').textContent = stats.avgPct !== null ? stats.avgPct + '%' : '—';
  const achEl = document.getElementById('stat-achievements');
  if (achEl) achEl.textContent = (game.achievements || []).length;

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
  const collapsedLevels = getCollapsedLevels();
  groups.forEach(({ level, lessons }) => {
    const section = document.createElement('div');
    section.className = 'level-group';
    const countLabel = lessons.length === 1 ? '1 lição' : lessons.length + ' lições';
    const collapsed = collapsedLevels.has(level);
    section.innerHTML = `
      <button type="button" class="level-group-title${collapsed ? ' collapsed' : ''}">
        <span class="chevron" aria-hidden="true">▾</span>
        <span class="label">${level}</span>
        <span class="line"></span>
        <span class="count">${countLabel}</span>
      </button>
    `;
    const cardsWrap = document.createElement('div');
    cardsWrap.className = 'level-group-lessons' + (collapsed ? ' hidden' : '');
    lessons.forEach(lesson => {
      const locked = lockStatus[lesson.id];
      const card = document.createElement('div');
      card.className = 'lesson-card' + (locked ? ' locked' : '');
      card.innerHTML = buildLessonCardHTML(lesson, progress, locked);
      card.addEventListener('click', () => locked ? showLockedMessage(lesson) : openLesson(lesson));
      cardsWrap.appendChild(card);
    });
    section.querySelector('.level-group-title').addEventListener('click', () => {
      const nowCollapsed = cardsWrap.classList.toggle('hidden');
      section.querySelector('.level-group-title').classList.toggle('collapsed', nowCollapsed);
      toggleCollapsedLevel(level, nowCollapsed);
    });
    section.appendChild(cardsWrap);
    list.appendChild(section);
  });
}

// Níveis (A1, A2...) que o aluno recolheu, salvo por aparelho — vale tanto
// para a lista da Home quanto para a do perfil, já que usam o mesmo nome de nível.
const COLLAPSED_LEVELS_KEY = 'bobcat_collapsed_lesson_levels';

function getCollapsedLevels() {
  try {
    return new Set(JSON.parse(localStorage.getItem(COLLAPSED_LEVELS_KEY) || '[]'));
  } catch (e) {
    return new Set();
  }
}

function toggleCollapsedLevel(level, collapsed) {
  const set = getCollapsedLevels();
  if (collapsed) set.add(level); else set.delete(level);
  try { localStorage.setItem(COLLAPSED_LEVELS_KEY, JSON.stringify([...set])); } catch (e) { /* ignore quota */ }
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

async function computeGameStats(progress) {
  let game = { totalXP: 0, achievements: [], hadPerfect: false, hadImprove: false, history: [] };
  try {
    if (typeof getGamification === 'function') game = await getGamification();
  } catch (e) { /* ignore */ }
  const streak = (typeof computeStreak === 'function')
    ? computeStreak(progress, game)
    : 0;
  return {
    totalXP: game.totalXP || 0,
    streak: streak,
    achievements: game.achievements || [],
    achievementDefs: (typeof ACHIEVEMENTS !== 'undefined') ? ACHIEVEMENTS : []
  };
}

function renderAchievementsGrid(unlockedIds, defs) {
  const grid = document.getElementById('achievements-grid');
  if (!grid) return;
  const have = new Set(unlockedIds || []);
  const list = defs && defs.length ? defs : [];
  if (!list.length) {
    grid.innerHTML = '<p class="bk-hint">Continue estudando para desbloquear conquistas.</p>';
    return;
  }
  grid.innerHTML = list.map(a => {
    const on = have.has(a.id);
    return `<div class="achievement-card${on ? ' unlocked' : ''}" title="${a.desc}">
      <div class="achievement-icon">${a.icon}</div>
      <div class="achievement-title">${a.title}</div>
      <div class="achievement-desc">${a.desc}</div>
    </div>`;
  }).join('');
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


// ---------- Theme (light / dark) ----------
const THEME_KEY = 'bobcat_theme';

function getStoredTheme() {
  try {
    const t = localStorage.getItem(THEME_KEY);
    if (t === 'light' || t === 'dark') return t;
  } catch (e) { /* ignore */ }
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) return 'light';
  return 'dark';
}

function applyTheme(theme) {
  const t = theme === 'light' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', t);
  try { localStorage.setItem(THEME_KEY, t); } catch (e) { /* ignore */ }

  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', t === 'light' ? '#33473B' : '#0a0a0b');

  const btn = document.getElementById('btn-theme-toggle');
  const knob = document.getElementById('theme-switch-knob');
  const label = document.getElementById('theme-toggle-label');
  if (btn) {
    const isLight = t === 'light';
    btn.setAttribute('aria-checked', isLight ? 'true' : 'false');
    btn.setAttribute('aria-label', isLight ? 'Alternar para modo escuro' : 'Alternar para modo claro');
  }
  if (knob) knob.textContent = t === 'light' ? '☀️' : '🌙';
  if (label) {
    label.textContent = t === 'light'
      ? 'Modo claro — papel e terracota'
      : 'Modo escuro — cores da landing';
  }
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || getStoredTheme();
  applyTheme(current === 'light' ? 'dark' : 'light');
}

function setupThemeToggle() {
  applyTheme(getStoredTheme());
  const btn = document.getElementById('btn-theme-toggle');
  if (btn && !btn.dataset.bound) {
    btn.dataset.bound = '1';
    btn.addEventListener('click', toggleTheme);
  }
}

async function boot() {
  showLoadingState(true);
  await initDataLayer();

  setupAuthScreen();
  setupProfileScreen();
  setupProfileViewScreen();
  setupResetPasswordModal();
  setupDeleteAccountModal();

  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => showScreen(btn.dataset.screen));
  });

  document.querySelectorAll('.menu-btn[data-screen]').forEach(btn => {
    btn.addEventListener('click', () => showScreen(btn.dataset.screen));
  });

  const howtoCta = document.querySelector('.howto-cta[data-screen]');
  if (howtoCta) howtoCta.addEventListener('click', () => showScreen(howtoCta.dataset.screen));

  setupAiChat();
  setupVocabCard();

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

  setupThemeToggle();
  showLoadingState(false);

  // Se o aluno foi mandado pra cá porque tentou abrir uma lição sem estar
  // logado (ver guardLessonRequiresLogin em db-client.js), pula a landing
  // page e vai direto pro login, com um aviso explicando o motivo.
  const cameFromLessonGuard = new URLSearchParams(window.location.search).get('needLogin') === '1';
  if (cameFromLessonGuard) {
    history.replaceState(null, '', window.location.pathname);
  }

  // Landing first for visitors without session; returning students go straight in.
  if (isUsingCloud() && !isLoggedIn()) {
    if (cameFromLessonGuard) {
      setAuthMode('login');
      showScreen('auth');
      showAuthInfo('É preciso estar logado para fazer as lições. Entre na sua conta (ou crie uma) para continuar.');
    } else {
      showScreen('landing');
    }
  } else {
    const profile = await getProfile();
    if (profile) {
      await enterApp();
    } else {
      showScreen('landing');
    }
  }

  const btnLandingStart = document.getElementById('btn-landing-start');
  if (btnLandingStart) {
    btnLandingStart.addEventListener('click', () => {
      if (isUsingCloud()) {
        setAuthMode('signup');
        showScreen('auth');
      } else {
        showScreen('profile-setup');
      }
    });
  }

  setupInstallPrompt();
  registerServiceWorker();
  // Deep link de notificação (?screen=ai-chat) — só depois do app estar pronto
  setTimeout(handleDeepLinkScreen, 300);
}

function showLoadingState(loading) {
  const el = document.getElementById('boot-loading');
  if (el) el.style.display = loading ? 'flex' : 'none';
}

// ---------- PWA: instalação e service worker ----------

let deferredInstallPrompt = null;

const INSTALL_DISMISS_KEY = 'bobcat_install_banner_dismissed_at';
const INSTALL_DISMISS_DAYS = 7; // depois de fechar, só volta a incomodar depois de N dias

// iOS nunca dispara "beforeinstallprompt" — precisamos detectar o aparelho
// na mão e mostrar o passo a passo manual (Compartilhar → Adicionar à Tela de Início).
function detectInstallPlatform() {
  const ua = navigator.userAgent || navigator.vendor || '';
  const isIOS = /iPad|iPhone|iPod/.test(ua) ||
    (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1); // iPad com iPadOS 13+
  if (isIOS) return 'ios';
  if (/Android/.test(ua)) return 'android';
  return 'other';
}

function isRunningAsInstalledPWA() {
  return (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches)
    || window.navigator.standalone === true; // Safari iOS
}

function wasInstallBannerDismissedRecently() {
  try {
    const raw = localStorage.getItem(INSTALL_DISMISS_KEY);
    if (!raw) return false;
    const days = (Date.now() - parseInt(raw, 10)) / 86400000;
    return days < INSTALL_DISMISS_DAYS;
  } catch (e) {
    return false;
  }
}

function markInstallBannerDismissed() {
  try { localStorage.setItem(INSTALL_DISMISS_KEY, String(Date.now())); } catch (e) { /* ignore */ }
}

function setupInstallPrompt() {
  // Já instalado (rodando a partir da tela inicial) → não precisa avisar nada.
  if (isRunningAsInstalledPWA()) return;
  if (wasInstallBannerDismissedRecently()) return;

  // Android/Chrome/Edge: o navegador nos avisa quando pode instalar.
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    showInstallBanner('android');
  });

  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
    markInstallBannerDismissed();
    const slot = document.getElementById('install-banner-slot');
    if (slot) slot.innerHTML = '';
  });

  // iOS/Safari (e navegadores iOS em geral, que usam a mesma engine): não existe
  // esse evento, então mostramos o passo a passo manual direto.
  if (detectInstallPlatform() === 'ios') {
    showInstallBanner('ios');
  }
}

function showInstallBanner(platform) {
  const slot = document.getElementById('install-banner-slot');
  if (!slot || slot.dataset.shown) return;
  slot.dataset.shown = 'true';

  if (platform === 'ios') {
    slot.innerHTML = `
      <div class="install-banner">
        <span>📲 Instale o app: toque em <strong>Compartilhar</strong> 📤 e depois em “Adicionar à Tela de Início”</span>
        <button id="btn-install-dismiss" class="install-banner-close" aria-label="Fechar aviso">✕</button>
      </div>
    `;
  } else {
    slot.innerHTML = `
      <div class="install-banner">
        <span>📲 Instale o app na tela inicial para acessar offline</span>
        <div class="install-banner-actions">
          <button id="btn-install">Instalar</button>
          <button id="btn-install-dismiss" class="install-banner-close" aria-label="Fechar aviso">✕</button>
        </div>
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

  const dismissBtn = document.getElementById('btn-install-dismiss');
  if (dismissBtn) {
    dismissBtn.addEventListener('click', () => {
      markInstallBannerDismissed();
      slot.innerHTML = '';
    });
  }
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

  // Clique em notificação push → abre a tela de Praticar com IA
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'NOTIFICATION_CLICK') {
      try {
        showScreen('ai-chat');
        if (typeof aiChatShowListView === 'function') aiChatShowListView();
      } catch (e) { /* tela ainda não pronta */ }
    }
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

// ─── Web Push (lembretes de prática) ───────────────────────────────────────

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

function pushSupported() {
  return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
}

async function getPushRegistration() {
  if (!('serviceWorker' in navigator)) return null;
  return navigator.serviceWorker.ready;
}

async function isPushSubscribed() {
  try {
    const reg = await getPushRegistration();
    if (!reg) return false;
    const sub = await reg.pushManager.getSubscription();
    return !!sub;
  } catch (e) {
    return false;
  }
}

async function updatePushRemindersUI() {
  const statusEl = document.getElementById('push-reminders-status');
  const btn = document.getElementById('btn-push-toggle');
  const testBtn = document.getElementById('btn-push-test');
  const configBtn = document.getElementById('btn-push-config');
  if (!btn) return;

  if (!pushSupported()) {
    if (statusEl) statusEl.textContent = 'Seu navegador não suporta notificações push.';
    btn.disabled = true;
    btn.textContent = 'Indisponível';
    if (testBtn) testBtn.classList.add('hidden');
    if (configBtn) configBtn.classList.add('hidden');
    return;
  }

  const permission = Notification.permission;
  const subscribed = await isPushSubscribed();

  if (permission === 'denied') {
    if (statusEl) statusEl.textContent = 'Notificações bloqueadas. Libere nas configurações do navegador/celular.';
    btn.textContent = 'Bloqueado';
    btn.disabled = true;
    btn.classList.remove('is-on');
    if (testBtn) testBtn.classList.add('hidden');
    if (configBtn) configBtn.classList.add('hidden');
    return;
  }

  btn.disabled = false;
  if (subscribed) {
    if (statusEl) statusEl.textContent = 'Lembretes ativos neste aparelho. Você receberá toques para praticar.';
    btn.textContent = 'Desativar';
    btn.classList.add('is-on');
    if (testBtn) testBtn.classList.remove('hidden');
    if (configBtn) configBtn.classList.remove('hidden');
  } else {
    if (statusEl) statusEl.textContent = 'Toque no celular pra praticar.';
    btn.textContent = 'Ativar';
    btn.classList.remove('is-on');
    if (testBtn) testBtn.classList.add('hidden');
    if (configBtn) configBtn.classList.add('hidden');
    closePushTimesPanel();
  }
}

async function enablePushReminders() {
  if (!pushSupported()) {
    alert('Seu navegador não suporta notificações push.');
    return;
  }
  const vapidKey = (window.APP_CONFIG && window.APP_CONFIG.vapidPublicKey) || '';
  if (!vapidKey || vapidKey.includes('COLE')) {
    alert('Chave VAPID pública não configurada em config.js. Veja o README.');
    return;
  }

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    alert('Você precisa permitir notificações para ativar os lembretes.');
    await updatePushRemindersUI();
    return;
  }

  try {
    const reg = await getPushRegistration();
    let sub = await reg.pushManager.getSubscription();
    if (!sub) {
      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey)
      });
    }
    if (typeof savePushSubscription === 'function') {
      await savePushSubscription(sub);
    } else {
      try {
        localStorage.setItem('bobcat_push_subscription', JSON.stringify(sub.toJSON()));
      } catch (e) { /* ignore */ }
    }
    localStorage.setItem('bobcat_push_enabled', '1');
  } catch (err) {
    console.error(err);
    alert('Não foi possível ativar as notificações. Tente de novo ou use Chrome/Edge no Android.');
  }
  await updatePushRemindersUI();
}

async function disablePushReminders() {
  try {
    const reg = await getPushRegistration();
    const sub = reg ? await reg.pushManager.getSubscription() : null;
    const endpoint = sub ? sub.endpoint : null;
    if (sub) await sub.unsubscribe();
    if (typeof removePushSubscription === 'function') {
      await removePushSubscription(endpoint);
    } else {
      try { localStorage.removeItem('bobcat_push_subscription'); } catch (e) { /* ignore */ }
    }
    localStorage.setItem('bobcat_push_enabled', '0');
  } catch (err) {
    console.error(err);
  }
  await updatePushRemindersUI();
}

async function togglePushReminders() {
  const subscribed = await isPushSubscribed();
  if (subscribed) await disablePushReminders();
  else await enablePushReminders();
}

/** Notificação local de teste (não passa pelo servidor). */
async function sendLocalTestNotification() {
  if (!pushSupported() || Notification.permission !== 'granted') {
    alert('Ative os lembretes primeiro.');
    return;
  }
  const reg = await getPushRegistration();
  if (!reg || !reg.active) {
    new Notification('Bobcat — hora de praticar! 🐱', {
      body: 'Toque para abrir o chat com a IA e treinar um pouco de inglês.',
      icon: './icons/icon-192.png',
      tag: 'bobcat-test'
    });
    return;
  }
  reg.active.postMessage({
    type: 'SHOW_LOCAL_NOTIFICATION',
    title: 'Bobcat — hora de praticar! 🐱',
    body: 'Toque para abrir o chat com a IA e treinar um pouco de inglês.',
    url: './index.html?screen=ai-chat',
    tag: 'bobcat-test'
  });
}

/**
 * Envia push de verdade via /api/push-send (usa a subscription deste aparelho).
 * Útil para validar VAPID + servidor depois do deploy.
 */
async function sendServerTestPush() {
  const local = (typeof getLocalPushSubscription === 'function' && getLocalPushSubscription()) || null;
  let subJson = local;
  if (!subJson) {
    try {
      const reg = await getPushRegistration();
      const sub = reg && await reg.pushManager.getSubscription();
      if (sub) subJson = sub.toJSON();
    } catch (e) { /* ignore */ }
  }
  if (!subJson) {
    alert('Nenhuma subscription encontrada. Ative os lembretes primeiro.');
    return;
  }
  try {
    const resp = await fetch('/api/push-send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Bobcat — hora de praticar! 🐱',
        body: 'Sua personalidade de IA quer conversar. Abra o app e pratique!',
        url: './index.html?screen=ai-chat',
        tag: 'bobcat-test',
        subscription: subJson
      })
    });
    const data = await resp.json().catch(() => ({}));
    if (!resp.ok) {
      alert('Falha no push do servidor: ' + (data.error || resp.status));
    } else {
      alert('Push enviado! Se não aparecer, confira se o app está em segundo plano e as chaves VAPID na Vercel.');
    }
  } catch (err) {
    console.error(err);
    alert('Erro de conexão ao chamar /api/push-send.');
  }
}

function setupPushRemindersUI() {
  const btn = document.getElementById('btn-push-toggle');
  const testBtn = document.getElementById('btn-push-test');
  if (btn) btn.addEventListener('click', () => togglePushReminders());
  if (testBtn) {
    testBtn.addEventListener('click', (e) => {
      if (e.shiftKey) sendServerTestPush();
      else sendLocalTestNotification();
    });
  }
  setupPushTimesUI();
  updatePushRemindersUI();
}

// ─── Horários personalizados do lembrete ───────────────────────────────────
// Precisa bater com REMINDER_WINDOW_MINUTES em api/push-send.js.
const PUSH_REMINDER_WINDOW_MINUTES = 15;

let pushTimesDraft = [];

/** Converte um horário local ('HH:MM', do <input type="time">) pro "slot" UTC
 * mais próximo (arredondado pro quarto de hora), formato usado no servidor. */
function localTimeToUtcSlot(hhmm) {
  const [h, m] = String(hhmm).split(':').map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  const d = new Date();
  d.setHours(h, m, 0, 0);
  const rounded = d.getUTCMinutes() - (d.getUTCMinutes() % PUSH_REMINDER_WINDOW_MINUTES);
  return `${String(d.getUTCHours()).padStart(2, '0')}:${String(rounded).padStart(2, '0')}`;
}

/** Converte um "slot" UTC salvo de volta pro horário local, só para exibição. */
function utcSlotToLocalTime(hhmm) {
  const [h, m] = String(hhmm).split(':').map(Number);
  const d = new Date();
  d.setUTCHours(h, m, 0, 0);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function renderPushTimesList() {
  const list = document.getElementById('push-times-list');
  if (!list) return;
  if (pushTimesDraft.length === 0) {
    list.innerHTML = '<div class="push-times-empty">Nenhum horário específico — usando o padrão (8h e 18h).</div>';
    return;
  }
  const sorted = [...pushTimesDraft].sort();
  list.innerHTML = sorted.map((utc) => {
    const local = utcSlotToLocalTime(utc);
    return `<span class="push-time-chip" data-utc="${utc}">${local}<button type="button" class="push-time-remove" data-utc="${utc}" aria-label="Remover ${local}">✕</button></span>`;
  }).join('');
  list.querySelectorAll('.push-time-remove').forEach((removeBtn) => {
    removeBtn.addEventListener('click', () => {
      pushTimesDraft = pushTimesDraft.filter((t) => t !== removeBtn.dataset.utc);
      renderPushTimesList();
    });
  });
}

function openPushTimesPanel() {
  const panel = document.getElementById('push-times-panel');
  if (!panel) return;
  const stored = (typeof getLocalPushReminderTimes === 'function') ? getLocalPushReminderTimes() : [];
  pushTimesDraft = [...stored];
  renderPushTimesList();
  panel.classList.remove('hidden');
}

function closePushTimesPanel() {
  const panel = document.getElementById('push-times-panel');
  if (panel) panel.classList.add('hidden');
}

function addPushTimeFromInput() {
  const input = document.getElementById('push-time-input');
  if (!input || !input.value) return;
  const slot = localTimeToUtcSlot(input.value);
  if (slot && !pushTimesDraft.includes(slot)) pushTimesDraft.push(slot);
  input.value = '';
  renderPushTimesList();
}

async function savePushTimesFromPanel() {
  const saveBtn = document.getElementById('btn-push-times-save');
  if (saveBtn) { saveBtn.disabled = true; saveBtn.textContent = 'Salvando...'; }
  try {
    const result = (typeof savePushReminderTimes === 'function')
      ? await savePushReminderTimes(pushTimesDraft)
      : { ok: false };
    if (!result.ok) {
      alert('Não foi possível salvar os horários: ' + (result.message || 'tente novamente.'));
      return;
    }
    closePushTimesPanel();
  } finally {
    if (saveBtn) { saveBtn.disabled = false; saveBtn.textContent = 'Salvar horários'; }
  }
}

function setupPushTimesUI() {
  const configBtn = document.getElementById('btn-push-config');
  const addBtn = document.getElementById('btn-push-time-add');
  const saveBtn = document.getElementById('btn-push-times-save');
  const cancelBtn = document.getElementById('btn-push-times-cancel');
  const timeInput = document.getElementById('push-time-input');
  if (configBtn) configBtn.addEventListener('click', openPushTimesPanel);
  if (addBtn) addBtn.addEventListener('click', addPushTimeFromInput);
  if (saveBtn) saveBtn.addEventListener('click', savePushTimesFromPanel);
  if (cancelBtn) cancelBtn.addEventListener('click', closePushTimesPanel);
  if (timeInput) {
    timeInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); addPushTimeFromInput(); }
    });
  }
}

/** Abre a tela pedida por ?screen=... (ex.: notificação push). */
function handleDeepLinkScreen() {
  try {
    const params = new URLSearchParams(window.location.search);
    const screen = params.get('screen');
    if (screen === 'ai-chat') {
      showScreen('ai-chat');
      if (typeof aiChatShowListView === 'function') aiChatShowListView();
    }
  } catch (e) { /* ignore */ }
}

// ─── PRATICAR COM IA (chat de conversação com personalidades criadas pelo aluno) ──
let aiChatHistory = []; // [{role:'user'|'model', text}] — da personalidade aberta no momento
let aiChatBusy = false;
let aiChatCurrentPersonaId = null; // id da personalidade aberta na tela de conversa
let aiChatCurrentPersona = null; // objeto da personalidade aberta (cache — evita reconsultar a cada render/envio)
let aiChatSuggestions = []; // sugestões de próxima fala (ramificação de conversa), vindas da última resposta da IA

// Áudio: gravação (aluno fala) e leitura em voz (TTS do navegador, sem custo de IA)
let aiChatMediaRecorder = null;
let aiChatAudioChunks = [];
let aiChatRecording = false;
const AI_CHAT_MAX_RECORD_MS = 30000; // 30s é suficiente pra prática e mantém o áudio leve
let aiChatRecordTimeout = null;
let aiChatTtsEnabled = localStorage.getItem('aiChatTtsEnabled') === '1';

const PERSONA_EMOJIS = [
  // robots & fantasy
  '🤖', '👾', '👽', '🛸', '🦸', '🦹', '🧙', '🧚', '🧛', '🧜', '🧞', '🧟',
  // animals
  '🐱', '🐶', '🦊', '🐼', '🐨', '🐯', '🦁', '🐸', '🐵', '🦄', '🐲', '🦉', '🐧', '🦋',
  // people
  '🧒', '👧', '👦', '🧑', '👩', '👨', '👵', '👴', '🧑‍🎤', '🧑‍🚀', '🧑‍🔬', '🧑‍🍳', '🧑‍🎨', '🧑‍💻', '👮', '🥷',
  // hobbies & objects
  '💼', '🎸', '⚽', '🏀', '🎮', '📚', '🎬', '🎤', '🎧', '☕', '🍕', '🌈', '⭐', '🔥', '💡', '🎯'
];
let personaEmojiSelected = PERSONA_EMOJIS[0];
let personaGenderSelected = 'female'; // 'female' | 'male' — obrigatório escolher um dos dois

// ---------- Quiz MBTI (gera a personalidade a partir de 4 perguntas) ----------
// Não é um teste psicológico de verdade — é só um jeito divertido e guiado de
// o aluno chegar numa personalidade variada para a IA, baseado nas 4 letras
// clássicas do MBTI (E/I, S/N, T/F, J/P). O texto de cada tipo já vem pronto
// para o prompt da IA (em inglês, dentro do limite de 300 caracteres).
const MBTI_QUESTIONS = [
  { key: 'EI', text: 'Você prefere…', options: [
      { letter: 'E', label: '🗣️ Falar e conhecer gente' },
      { letter: 'I', label: '🤫 Pensar em silêncio' }
    ] },
  { key: 'SN', text: 'Você repara mais em…', options: [
      { letter: 'S', label: '🔎 Fatos e detalhes' },
      { letter: 'N', label: '💡 Ideias novas' }
    ] },
  { key: 'TF', text: 'Na hora de decidir…', options: [
      { letter: 'T', label: '🧠 Lógica' },
      { letter: 'F', label: '❤️ Sentimentos' }
    ] },
  { key: 'JP', text: 'No dia a dia…', options: [
      { letter: 'J', label: '📅 Plano e rotina' },
      { letter: 'P', label: '🎲 Surpresa' }
    ] }
];

const MBTI_TYPES = {
  INTJ: { emoji: '🦉', name: 'Estrategista Calculista', description: 'Gosta de planejar com calma e pensar em soluções espertas antes de agir.', personality: "You are a calm, strategic thinker who loves big ideas, plans, and clever solutions. A bit reserved at first, but curious and sharp once a topic interests you, you enjoy discussing goals and how things work." },
  INTP: { emoji: '🔬', name: 'Curioso(a) Investigador(a)', description: 'Adora entender como as coisas funcionam e fazer perguntas sobre tudo.', personality: "You are a curious, analytical thinker who loves exploring ideas and asking 'why'. A bit quiet and absent-minded, but excited once a topic interests you, you enjoy talking about theories, science, and puzzles." },
  ENTJ: { emoji: '🦁', name: 'Líder Determinado(a)', description: 'Confiante e cheio(a) de energia para organizar e liderar qualquer missão.', personality: "You are a confident, ambitious, and decisive leader. Direct and driven, a little intense but fair, you enjoy talking about big goals, strategy, leadership, and how to get things done efficiently." },
  ENTP: { emoji: '⚡', name: 'Inventor(a) Brincalhão(ona)', description: "Adora debater ideias malucas e pensar em \"e se...\" o tempo todo.", personality: "You are a witty, energetic debater who loves playing with ideas. Curious, quick-thinking, and a bit of a tease, you enjoy talking about clever arguments, new inventions, and 'what if' questions." },
  INFJ: { emoji: '🌙', name: 'Sonhador(a) Atencioso(a)', description: 'Gosta de conversas profundas e se importa de verdade com o que os outros sentem.', personality: "You are a thoughtful, gentle idealist who cares deeply about people's feelings and the bigger meaning behind things. Calm and insightful, you enjoy quiet, meaningful conversations about dreams and values." },
  INFP: { emoji: '🌸', name: 'Coração Poético', description: 'Imaginativo(a) e sensível, adora histórias e falar sobre o que é importante na vida.', personality: "You are a dreamy, sensitive idealist with a rich imagination. Warm and thoughtful, a little quiet at first, you enjoy talking about stories, feelings, personal values, and what makes life meaningful." },
  ENFJ: { emoji: '🌟', name: 'Incentivador(a) Caloroso(a)', description: 'Adora animar as pessoas e ajudar todo mundo a crescer e se sentir bem.', personality: "You are a warm, charismatic, and encouraging person who loves inspiring others. Friendly and empathetic, you enjoy talking about people's goals, dreams, and how everyone can grow and support each other." },
  ENFP: { emoji: '🎈', name: 'Espírito Livre e Animado', description: 'Cheio(a) de energia e ideias novas, adora conhecer gente e sonhar alto.', personality: "You are an enthusiastic, warm, and imaginative person full of energy. Curious about people and ideas, a little scattered but always excited, you enjoy talking about dreams, creativity, and new possibilities." },
  ISTJ: { emoji: '📋', name: 'Responsável Confiável', description: 'Gosta de tudo organizado e certinho, e sempre cumpre o que promete.', personality: "You are a practical, reliable, detail-oriented person who likes order and clear rules. Calm and dependable, you enjoy talking about everyday routines, responsibilities, and how things are properly done." },
  ISFJ: { emoji: '🤗', name: 'Protetor(a) Gentil', description: 'Cuidadoso(a) e atencioso(a), adora fazer os outros se sentirem acolhidos.', personality: "You are a warm, caring, and quietly dependable person who loves helping others feel comfortable. Gentle and attentive, you enjoy talking about family, traditions, and taking care of the people you love." },
  ESTJ: { emoji: '📊', name: 'Organizador(a) Prático(a)', description: 'Direto(a) ao ponto e eficiente, gosta de colocar as coisas em ordem e resolver logo.', personality: "You are a confident, organized, no-nonsense leader type. Direct and hardworking, you enjoy talking about goals, plans, sports, and getting things done efficiently and the right way." },
  ESFJ: { emoji: '🎉', name: 'Anfitrião(ã) Sociável', description: 'Adora reunir todo mundo e cuidar para que ninguém fique de fora.', personality: "You are a warm, sociable, and caring person who loves taking care of the people around you. Friendly and talkative, you enjoy talking about friends, family, celebrations, and helping others feel included." },
  ISTP: { emoji: '🔧', name: 'Mão na Massa', description: 'Gosta de resolver problemas na prática, com calma e sem enrolação.', personality: "You are a cool, practical problem-solver who likes figuring out how things work with your hands. Calm, direct, and a little adventurous, you enjoy talking about tools, gadgets, sports, and hands-on projects." },
  ISFP: { emoji: '🎨', name: 'Alma Artística', description: 'Sensível e criativo(a), gosta de arte, música e viver com tranquilidade.', personality: "You are a gentle, artistic soul who notices beauty in small things. Quiet, kind, and a little shy at first, you enjoy talking about art, music, nature, and living life at your own relaxed pace." },
  ESTP: { emoji: '🏄', name: 'Aventureiro(a) Corajoso(a)', description: 'Adora ação, esportes e viver o momento sem medo de arriscar.', personality: "You are an energetic, bold, and fun-loving person who lives in the moment. Confident and a little cheeky, you enjoy talking about sports, adventures, games, and anything exciting happening right now." },
  ESFP: { emoji: '🎤', name: 'Alma da Festa', description: 'Animado(a) e espontâneo(a), adora ser o centro das atenções e se divertir.', personality: "You are a cheerful, spontaneous, and fun person who loves being the center of attention. Warm and playful, you enjoy talking about parties, music, friends, and making everyday moments feel special." }
};

let mbtiAnswers = {}; // {EI:'E', SN:'S', TF:'T', JP:'J'} — vai enchendo conforme o aluno responde

function renderMbtiQuiz() {
  const el = document.getElementById('mbti-quiz');
  if (!el) return;
  el.innerHTML = MBTI_QUESTIONS.map(q => `
    <div class="mbti-question">
      <div class="mbti-question-text">${q.text}</div>
      <div class="mbti-options">
        ${q.options.map(o => `<button type="button" class="mbti-option-btn${mbtiAnswers[q.key] === o.letter ? ' selected' : ''}" data-key="${q.key}" data-letter="${o.letter}">${o.label}</button>`).join('')}
      </div>
    </div>
  `).join('');
  el.querySelectorAll('.mbti-option-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      mbtiAnswers[btn.dataset.key] = btn.dataset.letter;
      renderMbtiQuiz();
      applyMbtiResultIfComplete();
    });
  });
}

function applyMbtiResultIfComplete() {
  const resultEl = document.getElementById('mbti-result');
  const keys = ['EI', 'SN', 'TF', 'JP'];
  if (!keys.every(k => mbtiAnswers[k])) {
    if (resultEl) resultEl.classList.add('hidden');
    return;
  }
  const type = keys.map(k => mbtiAnswers[k]).join('');
  const info = MBTI_TYPES[type];
  if (!info || !resultEl) return;

  const textarea = document.getElementById('input-persona-personality');
  if (textarea) textarea.value = info.personality;
  aiChatUpdatePersonaPreview();

  resultEl.classList.remove('hidden');
  resultEl.innerHTML = `
    <div class="mbti-result-header">
      <span class="mbti-result-emoji">${info.emoji}</span>
      <strong>${aiChatEscapeHtml(info.name)}</strong>
    </div>
    <p class="mbti-result-desc">${aiChatEscapeHtml(info.description)}</p>
    <p class="persona-form-hint" style="margin-top:6px;">Preenchemos a personalidade com esse jeito de ser — pode editar o texto acima à vontade. <button type="button" class="link-btn" id="btn-mbti-redo">Refazer o quiz</button></p>
  `;
  const redoBtn = document.getElementById('btn-mbti-redo');
  if (redoBtn) {
    redoBtn.addEventListener('click', () => {
      mbtiAnswers = {};
      renderMbtiQuiz();
      resultEl.classList.add('hidden');
      if (textarea) textarea.value = '';
      aiChatUpdatePersonaPreview();
    });
  }
}

// ---------- Armazenamento das personalidades ----------
// getAiChatPersonas / addAiChatPersona / deleteAiChatPersona / getAiChatHistoryFor /
// saveAiChatHistoryFor vêm do db-client.js: sincronizam pela nuvem (Supabase) quando
// configurado, ou caem para localStorage (só neste aparelho) caso contrário.

function aiChatEscapeHtml(s) {
  const div = document.createElement('div');
  div.textContent = s;
  return div.innerHTML;
}

/**
 * Mapa de Vocabulário Clicável: envolve cada palavra do texto (inglês ou
 * português) num <span class="vocab-word"> tocável, sem mexer no resto
 * (pontuação, espaços, quebras de linha). Escapa cada pedaço individualmente
 * pra não correr risco de quebrar uma entidade HTML (&amp; etc) ao inserir
 * as tags no meio do texto.
 */
function aiChatWrapVocab(text) {
  const parts = String(text == null ? '' : text).split(/([A-Za-zÀ-ÖØ-öø-ÿ]+(?:'[A-Za-zÀ-ÖØ-öø-ÿ]+)*)/);
  return parts.map((part, i) => {
    const isWord = i % 2 === 1; // grupos capturados ficam nos índices ímpares
    if (isWord && part.length >= 2) {
      const safe = aiChatEscapeHtml(part);
      const key = aiChatEscapeHtml(part.toLowerCase());
      return `<span class="vocab-word" data-word="${key}">${safe}</span>`;
    }
    return aiChatEscapeHtml(part);
  }).join('');
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
  const persona = aiChatCurrentPersona;
  const aiName = (persona && persona.name) || 'IA';
  const aiEmoji = (persona && persona.emoji) || '🤖';
  thread.innerHTML = aiChatHistory.map(m => {
    const cls = m.role === 'user' ? 'student' : 'teacher';
    const label = m.role === 'user' ? 'Você' : aiName;
    const prefix = m.viaAudio ? '🎤 ' : '';
    // Só as falas da IA viram vocabulário clicável — a mensagem do próprio
    // aluno não precisa disso, e mexer nela também atrapalharia a leitura
    // do que ele mesmo escreveu.
    const body = cls === 'teacher' ? aiChatWrapVocab(m.text) : aiChatEscapeHtml(m.text);
    const bubble = `<div class="chat-bubble ${cls}" ${cls === 'teacher' ? `data-vocab-context="${aiChatEscapeHtml(m.text).replace(/"/g, '&quot;')}"` : ''}><span class="chat-meta">${label}</span>${prefix}${body.replace(/\n/g, '<br>')}</div>`;
    if (cls === 'teacher') {
      return `<div class="ai-msg-row"><span class="ai-msg-avatar" aria-hidden="true">${aiEmoji}</span>${bubble}</div>`;
    }
    return bubble;
  }).join('');
  thread.scrollTop = thread.scrollHeight;
}

// ---------- Mapa de Vocabulário Clicável ----------
// Toca numa palavra da fala da IA → mini-cartão com tradução, pronúncia e
// exemplos. Resultado fica em cache no localStorage por palavra+nível pra
// não gastar chamada de IA de novo em palavras já vistas.

let vocabCardCurrentWord = null;
let vocabCardCurrentContext = '';
let vocabCardCurrentLevel = 'A1';

function vocabCacheKey(word, level) {
  return 'vocabCache_' + level + '_' + word;
}

function vocabCacheGet(word, level) {
  try {
    const raw = localStorage.getItem(vocabCacheKey(word, level));
    return raw ? JSON.parse(raw) : null;
  } catch (e) { return null; }
}

function vocabCacheSet(word, level, data) {
  try { localStorage.setItem(vocabCacheKey(word, level), JSON.stringify(data)); } catch (e) { /* cache não é essencial */ }
}

function setupVocabWordClicks() {
  const thread = document.getElementById('ai-chat-thread');
  if (!thread) return;
  thread.addEventListener('click', (e) => {
    const span = e.target.closest('.vocab-word');
    if (!span) return;
    const word = span.dataset.word;
    if (!word) return;
    const bubble = span.closest('.chat-bubble');
    const context = bubble ? (bubble.dataset.vocabContext || '') : '';
    vocabCardOpen(word, context);
  });
}

async function vocabCardOpen(word, context) {
  const overlay = document.getElementById('vocab-card-overlay');
  if (!overlay) return;

  let profile = {};
  try { profile = (await getProfile()) || {}; } catch (e) { /* sem perfil ainda */ }
  const level = profile.level || 'A1';

  vocabCardCurrentWord = word;
  vocabCardCurrentContext = context;
  vocabCardCurrentLevel = level;

  overlay.classList.remove('hidden');

  const cached = vocabCacheGet(word, level);
  if (cached) {
    vocabCardRender(cached);
    return;
  }

  await vocabCardFetchAndRender(word, context, level);
}

async function vocabCardFetchAndRender(word, context, level) {
  const loading = document.getElementById('vocab-card-loading');
  const content = document.getElementById('vocab-card-content');
  const errorBox = document.getElementById('vocab-card-error');
  if (loading) loading.classList.remove('hidden');
  if (content) content.classList.add('hidden');
  if (errorBox) errorBox.classList.add('hidden');

  try {
    const resp = await fetch('/api/vocab-lookup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ word, context, level })
    });
    const data = await resp.json().catch(() => ({}));
    if (!resp.ok || !data.translation) {
      vocabCardShowError(data.error);
      return;
    }
    vocabCacheSet(word, level, data);
    vocabCardRender(data);
  } catch (err) {
    console.error('Erro em vocabCardFetchAndRender:', err);
    vocabCardShowError('Erro de conexão. Verifique sua internet.');
  }
}

function vocabCardShowError(msg) {
  const loading = document.getElementById('vocab-card-loading');
  const content = document.getElementById('vocab-card-content');
  const errorBox = document.getElementById('vocab-card-error');
  const errorText = document.getElementById('vocab-card-error-text');
  if (loading) loading.classList.add('hidden');
  if (content) content.classList.add('hidden');
  if (errorBox) errorBox.classList.remove('hidden');
  if (errorText) errorText.textContent = msg || 'Não consegui buscar essa palavra agora.';
}

function vocabCardRender(data) {
  const loading = document.getElementById('vocab-card-loading');
  const content = document.getElementById('vocab-card-content');
  const errorBox = document.getElementById('vocab-card-error');
  const wordEl = document.getElementById('vocab-card-word');
  const posEl = document.getElementById('vocab-card-pos');
  const pronEl = document.getElementById('vocab-card-pron');
  const translationEl = document.getElementById('vocab-card-translation');
  const examplesEl = document.getElementById('vocab-card-examples');
  if (!content) return;

  if (loading) loading.classList.add('hidden');
  if (errorBox) errorBox.classList.add('hidden');
  content.classList.remove('hidden');

  if (wordEl) wordEl.textContent = data.word || vocabCardCurrentWord || '';
  if (posEl) {
    if (data.partOfSpeech) {
      posEl.textContent = data.partOfSpeech;
      posEl.classList.remove('hidden');
    } else {
      posEl.classList.add('hidden');
    }
  }

  if (pronEl) {
    const pronBits = [];
    if (data.pronunciationIpa) pronBits.push(`<span class="ipa">${aiChatEscapeHtml(data.pronunciationIpa)}</span>`);
    if (data.pronunciationEasy) pronBits.push(`<span class="easy">${aiChatEscapeHtml(data.pronunciationEasy)}</span>`);
    pronEl.innerHTML = pronBits.join(' &middot; ');
  }

  if (translationEl) translationEl.textContent = data.translation || '';

  if (examplesEl) {
    const examples = Array.isArray(data.examples) ? data.examples : [];
    examplesEl.innerHTML = examples.map(ex => `
      <div class="vocab-example">
        <div class="en">${aiChatEscapeHtml(ex.en || '')}</div>
        ${ex.pt ? `<div class="pt">${aiChatEscapeHtml(ex.pt)}</div>` : ''}
      </div>
    `).join('');
  }
}

function vocabCardClose() {
  const overlay = document.getElementById('vocab-card-overlay');
  if (overlay) overlay.classList.add('hidden');
  if ('speechSynthesis' in window) {
    try { window.speechSynthesis.cancel(); } catch (e) { /* TTS não é essencial */ }
  }
}

function vocabCardSpeakCurrent() {
  if (!vocabCardCurrentWord) return;
  if (!('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(vocabCardCurrentWord);
    utter.lang = 'en-US';
    utter.rate = 0.9;
    const voice = aiChatPickVoice('female');
    if (voice) utter.voice = voice;
    window.speechSynthesis.speak(utter);
  } catch (e) { /* TTS não é essencial — falha silenciosa */ }
}

function setupVocabCard() {
  setupVocabWordClicks();
  const overlay = document.getElementById('vocab-card-overlay');
  const closeBtn = document.getElementById('vocab-card-close');
  const listenBtn = document.getElementById('vocab-card-listen');
  const retryBtn = document.getElementById('vocab-card-retry');
  if (closeBtn) closeBtn.addEventListener('click', vocabCardClose);
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target.id === 'vocab-card-overlay') vocabCardClose();
    });
  }
  if (listenBtn) listenBtn.addEventListener('click', vocabCardSpeakCurrent);
  if (retryBtn) {
    retryBtn.addEventListener('click', () => {
      if (vocabCardCurrentWord) {
        vocabCardFetchAndRender(vocabCardCurrentWord, vocabCardCurrentContext, vocabCardCurrentLevel);
      }
    });
  }
}

/**
 * Ramificação de conversação: mostra 2-3 sugestões clicáveis do que o aluno
 * poderia responder em seguida (vindas da última fala da IA). Clicar numa
 * sugestão envia ela na hora, como se o aluno tivesse digitado — baixa a
 * barreira pra quem trava sem saber o que escrever.
 */
function aiChatRenderSuggestions() {
  const box = document.getElementById('ai-chat-suggestions');
  if (!box) return;
  if (!aiChatSuggestions.length) {
    box.classList.add('hidden');
    box.innerHTML = '';
    return;
  }
  box.classList.remove('hidden');
  box.innerHTML = aiChatSuggestions.map((s, i) =>
    `<button type="button" class="ai-chat-suggestion-chip" data-idx="${i}">${aiChatEscapeHtml(s)}</button>`
  ).join('');
  box.querySelectorAll('.ai-chat-suggestion-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      if (aiChatBusy) return;
      const text = aiChatSuggestions[Number(chip.dataset.idx)];
      if (!text) return;
      const input = document.getElementById('ai-chat-input');
      if (input) input.value = text;
      aiChatSend();
    });
  });
}

/** Retorna 'morning' | 'afternoon' | 'evening' | 'night' conforme o horário local do aluno. */
function aiChatTimeOfDay() {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return 'morning';
  if (h >= 12 && h < 18) return 'afternoon';
  if (h >= 18 && h < 22) return 'evening';
  return 'night';
}

function aiChatGreetingFor(persona, studentName) {
  const hi = studentName ? `, ${studentName}` : '';
  const name = persona.name || 'IA';
  const emoji = persona.emoji || '🤖';
  const tod = aiChatTimeOfDay();
  const greetings = {
    morning: [
      `${emoji} Good morning${hi}! I'm ${name}. How are you today?`,
      `${emoji} Morning${hi}! Ready to practice a little English with me?`
    ],
    afternoon: [
      `${emoji} Good afternoon${hi}! I'm ${name}. How's your day going?`,
      `${emoji} Hey${hi}! Want to chat for a bit and practice English?`
    ],
    evening: [
      `${emoji} Good evening${hi}! I'm ${name}. How was your day?`,
      `${emoji} Hi${hi}! Nice to see you this evening. What would you like to talk about?`
    ],
    night: [
      `${emoji} Hi${hi}! I'm ${name}. Still awake? Let's practice a little English.`,
      `${emoji} Hello${hi}! Quiet night — perfect for a short chat. How are you?`
    ]
  };
  const list = greetings[tod] || greetings.afternoon;
  return list[Math.floor(Math.random() * list.length)];
}

/** Quantas horas sem mensagem para a IA "puxar" conversa de novo ao abrir o chat. */
const AI_PROACTIVE_AFTER_HOURS = 4;

// ---------- Navegação entre as 3 sub-telas de "Praticar com a IA" ----------

async function aiChatShowListView() {
  document.getElementById('ai-chat-conversation-view').classList.add('hidden');
  document.getElementById('ai-chat-create-view').classList.add('hidden');
  document.getElementById('ai-chat-list-view').classList.remove('hidden');
  aiChatCurrentPersonaId = null;
  aiChatCurrentPersona = null;
  await renderAiChatPersonaList();
}

function aiChatShowCreateView() {
  document.getElementById('ai-chat-list-view').classList.add('hidden');
  document.getElementById('ai-chat-conversation-view').classList.add('hidden');
  document.getElementById('ai-chat-create-view').classList.remove('hidden');
  document.getElementById('input-persona-name').value = '';
  document.getElementById('input-persona-personality').value = '';
  personaEmojiSelected = PERSONA_EMOJIS[0];
  personaGenderSelected = 'female';
  mbtiAnswers = {};
  renderPersonaEmojiPicker();
  renderPersonaGenderPicker();
  renderMbtiQuiz();
  const mbtiResult = document.getElementById('mbti-result');
  if (mbtiResult) mbtiResult.classList.add('hidden');
  aiChatUpdatePersonaPreview();
}

function aiChatUpdatePersonaPreview() {
  const avatarEl = document.getElementById('persona-preview-avatar');
  const nameEl = document.getElementById('persona-preview-name');
  if (avatarEl) avatarEl.textContent = personaEmojiSelected;
  if (nameEl) {
    const nameInput = document.getElementById('input-persona-name');
    const typed = nameInput ? nameInput.value.trim() : '';
    nameEl.textContent = typed || 'Sem nome';
  }
}

async function aiChatOpenPersona(id) {
  const personas = await getAiChatPersonas();
  const persona = personas.find(p => p.id === id);
  if (!persona) return;
  aiChatCurrentPersonaId = id;
  aiChatCurrentPersona = persona;

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

  aiChatHistory = await getAiChatHistoryFor(id);
  aiChatSuggestions = [];
  if (aiChatHistory.length === 0) {
    let profile = {};
    try { profile = (await getProfile()) || {}; } catch (e) { /* sem perfil ainda */ }
    aiChatHistory = [{ role: 'model', text: aiChatGreetingFor(persona, profile.name || ''), ts: Date.now() }];
    await saveAiChatHistoryFor(id, aiChatHistory);
    aiChatRenderThread();
    aiChatRenderSuggestions();
  } else {
    aiChatRenderThread();
    aiChatRenderSuggestions();
    // Se a conversa está "fria" (última mensagem antiga), a IA puxa assunto sozinha.
    const last = aiChatHistory[aiChatHistory.length - 1];
    const lastTs = last && typeof last.ts === 'number' ? last.ts : 0;
    const hoursSince = lastTs ? (Date.now() - lastTs) / (1000 * 60 * 60) : Infinity;
    if (hoursSince >= AI_PROACTIVE_AFTER_HOURS) {
      // Não espera o aluno escrever — gera uma mensagem proativa.
      aiChatSendProactive();
    }
  }
}
async function renderAiChatPersonaList() {
  const list = document.getElementById('ai-chat-persona-list');
  if (!list) return;
  list.innerHTML = '<div class="bk-empty"><div class="bk-empty-emoji">⏳</div><p class="bk-empty-sub">Carregando…</p></div>';
  const personas = await getAiChatPersonas();
  if (personas.length === 0) {
    list.innerHTML = `<div class="bk-empty">
      <div class="bk-empty-emoji" aria-hidden="true">🤖 🐱 🦸 🦄</div>
      <div class="bk-empty-title">Nenhum parceiro ainda</div>
      <p class="bk-empty-sub">Toque em <strong>Novo parceiro</strong> e comece a conversar! 🎉</p>
    </div>`;
    return;
  }
  list.innerHTML = personas.map(p => `
    <div class="persona-card" data-id="${p.id}">
      <div class="icon">${p.emoji || '🤖'}</div>
      <div class="info">
        <div class="name">${aiChatEscapeHtml(p.name)} <span class="gender-badge">${p.gender === 'male' ? '♂️' : '♀️'}</span></div>
        <div class="personality-preview">${aiChatEscapeHtml((p.personality || '').slice(0, 60))}${(p.personality || '').length > 60 ? '…' : ''}</div>
      </div>
      <div class="chevron">💬</div>
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
    { id: 'female', label: '♀️', sub: 'Ela' },
    { id: 'male', label: '♂️', sub: 'Ele' }
  ];
  picker.innerHTML = options.map(o =>
    `<button type="button" class="persona-gender-btn${o.id === personaGenderSelected ? ' selected' : ''}" data-gender="${o.id}"><span class="gender-emoji">${o.label}</span><span class="gender-sub">${o.sub}</span></button>`
  ).join('');
  picker.querySelectorAll('.persona-gender-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      personaGenderSelected = btn.dataset.gender;
      renderPersonaGenderPicker();
      aiChatUpdatePersonaPreview();
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
      aiChatUpdatePersonaPreview();
    });
  });
}

async function aiChatCreatePersonaFromForm() {
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
  await addAiChatPersona(persona);
  await aiChatOpenPersona(persona.id);
}

async function aiChatDeleteCurrentPersona() {
  if (!aiChatCurrentPersonaId) return;
  if (!confirm('Excluir essa personalidade e toda a conversa com ela? Essa ação não pode ser desfeita.')) return;
  await deleteAiChatPersona(aiChatCurrentPersonaId);
  await aiChatShowListView();
}

async function aiChatResetConversation() {
  if (!aiChatCurrentPersonaId) return;
  await saveAiChatHistoryFor(aiChatCurrentPersonaId, []);
  aiChatHistory = [];
  await aiChatOpenPersona(aiChatCurrentPersonaId);
}

async function aiChatSend(audioPayload) {
  if (aiChatBusy || !aiChatCurrentPersonaId) return;
  const input = document.getElementById('ai-chat-input');
  const typing = document.getElementById('ai-chat-typing');
  if (!input) return;
  const text = input.value.trim();
  if (!text && !audioPayload) return;

  const persona = aiChatCurrentPersona;
  if (!persona) return;

  let profile = {};
  try { profile = (await getProfile()) || {}; } catch (e) { /* sem perfil ainda */ }

  // Se veio de gravação, ainda não sabemos o que o aluno disse (a transcrição acontece do lado da IA),
  // então mostramos um rótulo genérico na bolha; a IA recebe o áudio de verdade na requisição.
  const displayText = audioPayload ? (text || '(mensagem em áudio)') : text;
  aiChatHistory.push({ role: 'user', text: displayText, viaAudio: !!audioPayload, ts: Date.now() });
  input.value = '';
  aiChatSuggestions = [];
  aiChatRenderSuggestions();
  aiChatRenderThread();
  saveAiChatHistoryFor(persona.id, aiChatHistory).catch(() => {});

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
      aiChatHistory.push({ role: 'model', text: '⚠️ ' + (data.error || 'Não consegui responder agora. Tente novamente em instantes.'), ts: Date.now() });
      aiChatSuggestions = [];
    } else {
      aiChatHistory.push({ role: 'model', text: data.reply, ts: Date.now() });
      aiChatSpeak(data.reply, persona.gender);
      aiChatSuggestions = Array.isArray(data.suggestions) ? data.suggestions : [];
    }
  } catch (err) {
    console.error(err);
    aiChatHistory.push({ role: 'model', text: '⚠️ Erro de conexão. Verifique sua internet e tente de novo.', ts: Date.now() });
  } finally {
    aiChatBusy = false;
    if (typing) typing.classList.add('hidden');
    aiChatRenderThread();
    aiChatRenderSuggestions();
    if (aiChatCurrentPersonaId) saveAiChatHistoryFor(aiChatCurrentPersonaId, aiChatHistory).catch(() => {});
    // "Fire and forget" — atualiza o resumo da conversa no Supabase (se configurado)
    // pra permitir lembretes personalizados. Nunca bloqueia nem quebra o chat.
    if (typeof syncAiChatLastConversation === 'function') {
      syncAiChatLastConversation(persona, aiChatHistory).catch(() => {});
    }
  }
}

/**
 * A IA inicia a conversa sozinha (quando o aluno abre o chat depois de várias horas).
 * Usa o modo proactive do /api/chat — a mensagem sintética não entra no histórico do aluno.
 */
async function aiChatSendProactive() {
  if (aiChatBusy || !aiChatCurrentPersonaId) return;
  const persona = aiChatCurrentPersona;
  if (!persona) return;

  const typing = document.getElementById('ai-chat-typing');
  let profile = {};
  try { profile = (await getProfile()) || {}; } catch (e) { /* sem perfil ainda */ }

  aiChatBusy = true;
  if (typing) {
    typing.innerHTML = `<span class="ai-msg-avatar" aria-hidden="true">${persona.emoji || '🤖'}</span><span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>`;
    typing.classList.remove('hidden');
  }

  try {
    const body = {
      proactive: true,
      timeOfDay: aiChatTimeOfDay(),
      history: aiChatHistory.slice(-12), // contexto recente
      level: profile.level || 'A1',
      name: profile.name || '',
      personality: persona.personality,
      aiName: persona.name,
      gender: persona.gender === 'male' ? 'male' : 'female'
    };

    const resp = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await resp.json().catch(() => ({}));
    if (resp.ok && data.reply) {
      aiChatHistory.push({ role: 'model', text: data.reply, ts: Date.now(), proactive: true });
      aiChatSpeak(data.reply, persona.gender);
      aiChatSuggestions = Array.isArray(data.suggestions) ? data.suggestions : [];
    }
    // Se falhar (sem chave Gemini, offline, etc.), silenciosamente não adiciona nada —
    // o aluno ainda vê o histórico anterior e pode escrever normalmente.
  } catch (err) {
    console.error('Proactive message failed:', err);
  } finally {
    aiChatBusy = false;
    if (typing) typing.classList.add('hidden');
    aiChatRenderThread();
    aiChatRenderSuggestions();
    if (aiChatCurrentPersonaId) saveAiChatHistoryFor(aiChatCurrentPersonaId, aiChatHistory).catch(() => {});
    if (typeof syncAiChatLastConversation === 'function') {
      syncAiChatLastConversation(persona, aiChatHistory).catch(() => {});
    }
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

  const inputPersonaName = document.getElementById('input-persona-name');
  if (inputPersonaName) inputPersonaName.addEventListener('input', aiChatUpdatePersonaPreview);

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

  setupPushRemindersUI();
}

document.addEventListener('DOMContentLoaded', boot);
