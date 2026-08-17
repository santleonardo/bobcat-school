// ============================================================
// BOBCAT VILLE — story.js
// Dados narrativos do jogo, separados da lógica de UI.
// História de Bobcat Ville.
//
// Papel deste arquivo (igual ao types.ts + constants.tsx do
// Sky Metropolis): nenhuma lógica de tela aqui, só o "mundo"
// como dados que app.js / lesson-kit.js podem consultar.
//
// Cobre os TRÊS atos agora. O Ato 1 (A1+A2) usa lições que já
// existem como páginas reais (ver app.js, LESSONS_CATALOG). Os
// Atos 2 e 3 (B1→C2) usam o ROADMAP_CATALOG do teacher.html —
// lições 41 a 70, ainda só planejadas, sem página própria no ar.
// Por isso os checkpoints dos Atos 2/3 apontam pra `lessonId`
// no MESMO padrão de slug (licao-N-nome-do-topico) que as lições
// já existentes usam, mas essas páginas ainda precisam ser
// criadas antes desses checkpoints funcionarem de verdade.
//
// Achado importante ao cruzar com o roadmap: os projetos finais
// dos semestres 4 e 5 já SÃO os beats centrais da história —
// (esquema original de 5 semestres, com C1 e C2 juntos no Sem. 5).
// "The Story of My Life" (sem. 4) = o Midpoint; "An Issue Worth
// Discussing" e "The Big Argument" (sem. 5, C1+C2) = a Provação
// Central e a Cena Obrigatória do clímax. Não foi preciso inventar
// missão nenhuma pra esses pontos — o currículo já pedia exatamente
// essas entregas.
// ============================================================

// --- Tema central (seção 1 do MD) ---------------------------
const BOBCAT_VILLE_THEME = 'Inglês é liberdade.';

// --- Identidades do jogador (seção 1 do MD) -------------------
// Escolhida na criação do personagem. Muda só o tom e o desejo
// pessoal (seção 3.1: "Desejo... varia com a identidade") — a
// estrutura da história (checkpoints, PNJs, locais) é a mesma
// pra todo mundo.
const IDENTITIES = {
  turista: {
    id: 'turista',
    name: 'Turista',
    icon: '🎒',
    tagline: 'Veio viver Bobcat Ville por um tempo, sem pressa de ficar.',
    desejo: 'Aproveitar cada ponto turístico da cidade antes de ir embora.',
  },
  intercambista: {
    id: 'intercambista',
    name: 'Intercambista',
    icon: '🎓',
    tagline: 'Chegou pra estudar — o campus é o novo mundo.',
    desejo: 'Se formar bem no Campus de Bobcat Ville.',
  },
  imigrante: {
    id: 'imigrante',
    name: 'Imigrante',
    icon: '🧳',
    tagline: 'Veio construir uma vida nova aqui, do zero.',
    desejo: 'Se estabelecer de vez em Bobcat Ville.',
  },
  executivo: {
    id: 'executivo',
    name: 'Executivo(a)',
    icon: '💼',
    tagline: 'Veio fechar um grande negócio — não pretende ficar mais que o necessário.',
    desejo: 'Fechar a fusão corporativa antes do prazo.',
  },
};

// --- Dilema moral do elenco (seção 4) ------------------------
const MORAL_DILEMMA =
  'Vale mais a pena se proteger evitando o risco de errar, ' +
  'ou se arriscar e crescer mesmo com medo?';

// --- Locais (seção 5, coluna "Local" + seção 6, fio do mistério) ---
// Cada local é um "tile" do futuro mapa de Bobcat Ville.
// clue: null enquanto o local ainda não solta pista sobre Kessler
// (isso só começa a valer a partir do B2, seção 6 do MD).
const LOCATIONS = {
  aeroporto: {
    id: 'aeroporto',
    name: 'Aeroporto de Bobcat Ville',
    icon: '✈️',
    description: 'Onde tudo começa. Filas, formulários, e ninguém te entende.',
    clue: null,
  },
  taxi_alojamento: {
    id: 'taxi_alojamento',
    name: 'Táxi & Alojamento',
    icon: '🚕',
    description: 'A primeira conversa informal — e o primeiro lugar que vira rotina.',
    clue: null,
  },
  mercado_bairro: {
    id: 'mercado_bairro',
    name: 'Mercado do bairro',
    icon: '🧺',
    description: 'O mercado de Idris Osei. Pequeno, barulhento, e o único lugar onde alguém pergunta como você está de verdade.',
    clue: null,
  },
  campus_escritorio: {
    id: 'campus_escritorio',
    name: 'Campus / Escritório temporário',
    icon: '🏢',
    description: 'Onde a decisão sem volta acontece — aceitar a vaga, o emprego, o lugar.',
    clue: null,
  },

  // --- Locais do Ato 2 (B1→B2) — mapa: mapa-bobcat-ville.png ------
  bairro_comercial: {
    id: 'bairro_comercial',
    name: 'Bairro comercial',
    icon: '🏪',
    description: 'Lojas, o motorista de sempre, o primeiro mal-entendido de cobrança.',
    clue: null, // fio do mistério só começa a valer no B2 (seção 6 do MD)
  },
  centro_eventos: {
    id: 'centro_eventos',
    name: 'Business & Convention Center',
    icon: '🎤',
    description: 'Onde a grande oportunidade (e a apresentação "The Story of My Life") acontece.',
    clue: null,
  },

  // --- Locais do Ato 2B (C1) ---------------------------------------
  museu_historico: {
    id: 'museu_historico',
    name: 'Museu / Centro Histórico',
    icon: '🏛️',
    description: 'Arquivos antigos da cidade — a primeira pista documental sobre Kessler.',
    clue: 'Registros antigos de "serviços de adaptação" prestados a recém-chegados — os nomes não batem com nada oficial.',
  },
  corporate_center: {
    id: 'corporate_center',
    name: 'Corporate Center',
    icon: '🏙️',
    description: 'Sede da fusão. Salas de reunião, e Kessler observando de longe.',
    clue: 'Uma contradição no discurso de Kessler sobre a própria chegada à cidade, décadas atrás.',
  },
  hospital: {
    id: 'hospital',
    name: 'Hospital',
    icon: '🏥',
    description: 'Onde Idris é internado — e onde Priya se revela.',
    clue: null,
  },

  // --- Local do Ato 3 (C2) — PENDENTE no mapa atual -----------------
  // O mapa enviado não tem um marco único de "prédio mais alto".
  // Local provisório até decidirem se reaproveitam o Corporate/
  // Technology Center existente ou pedem uma ilustração nova.
  torre: {
    id: 'torre',
    name: '(pendente) A Torre',
    icon: '🗼',
    description: 'PENDENTE — precisa de um marco visual único no mapa pro clímax (ver decisões em aberto do documento de história).',
    clue: null,
    pending: true,
  },
};

// --- PNJs (seção 3) -------------------------------------------
// ghost/lie/truth só preenchidos para quem tem arco (seção 3.1-3.4);
// PNJs de apoio (3.5) têm só função narrativa.
const NPCS = {
  idris: {
    id: 'idris',
    name: 'Idris Osei',
    role: 'mentor',
    arcType: 'plano', // Vogler: não muda, ajuda os outros a mudarem
    truth: 'Comunicação imperfeita ainda é comunicação real — pertencer não exige perfeição.',
    location: 'mercado_bairro',
  },
  imigracao: {
    id: 'imigracao',
    name: 'Agente de imigração',
    role: 'obstaculo_inicial',
    location: 'aeroporto',
  },
  dax: {
    id: 'dax',
    name: 'Dax',
    role: 'motorista_taxi',
    location: 'taxi_alojamento',
  },
  lucia: {
    id: 'lucia',
    name: 'Lucia',
    role: 'recepcionista',
    location: 'taxi_alojamento',
    recurring: true, // reaparece ao longo do jogo (A1–A2)
  },

  // --- PNJs do Ato 2 (B1→B2) --------------------------------------
  officer_reyes: {
    id: 'officer_reyes',
    name: 'Officer Reyes',
    role: 'policial',
    location: 'bairro_comercial',
  },

  // --- PNJs do Ato 2B/3 (C1→C2) — elenco principal (seção 3 do MD) --
  priya: {
    id: 'priya',
    name: 'Priya Chen',
    role: 'rival',
    arcType: 'shapeshifter', // Vogler: lealdade ambígua até o C1
    location: 'corporate_center',
  },
  kessler: {
    id: 'kessler',
    name: 'Nathaniel Kessler',
    role: 'vilao',
    arcType: 'queda', // Weiland: Arco de Queda — nunca supera a própria Lie
    lie: 'Nunca mais posso depender de aprender algo em público — depender é fraqueza.',
    location: 'corporate_center',
  },
  guia_turistico: {
    id: 'guia_turistico',
    name: 'Guia turístico misterioso',
    role: 'pista_do_misterio',
    location: 'museu_historico',
  },
  informante: {
    id: 'informante',
    name: 'Informante',
    role: 'pista_do_misterio',
    location: 'corporate_center',
  },
};

// --- Cena do tema (seção 7) -------------------------------------
// Dita por Idris no A2, tom leve — o jogador só entende o peso dela no C2.
const THEME_SCENE = {
  npc: 'idris',
  location: 'mercado_bairro',
  line_en: "Here, if you speak, you choose. If you don't, you accept what they give you.",
  line_pt: 'Aqui, quem fala, escolhe. Quem não fala, aceita o que dão.',
};

// --- Checkpoints do Ato 1 -----------------------------------------
// Cada checkpoint é uma cena curta (tipo o UIOverlay do Sky Metropolis:
// um toast/HUD, não uma cutscene longa) amarrada a UMA lição específica
// do catálogo real do Bobcat (ver app.js -> LESSONS).
//
// Importante: o campo `level` do Bobcat hoje é grosseiro (quase tudo
// A1 até a lição 30). O vínculo real com a tabela do MD é pelo FOCO
// GRAMATICAL da lição, não pelo `level` cru — por isso cada checkpoint
// aponta pro `lessonId` exato, não só pro nível.
//
// stage = estágio da Jornada do Herói (Vogler, seção 5 do MD)
// trigger = 'before' (cena antes de abrir a lição) | 'after' (cena ao concluir)
const ACT1_CHECKPOINTS = [
  {
    id: 'chegada',
    stage: 'Mundo Comum + Chamado',
    lessonId: 'pronuncia-essencial',
    trigger: 'before',
    location: 'aeroporto',
    npc: 'imigracao',
    line_pt: 'Primeira vez completamente perdido. Ninguém entende o que você tenta dizer — nem você entende o que dizem pra você.',
    line_en: null, // agente de imigração não tem fala fixa; pode virar prompt de IA depois
  },
  {
    id: 'recusa_do_chamado',
    stage: 'Recusa do Chamado',
    lessonId: 'saudacoes-apresentacoes',
    trigger: 'after',
    location: 'taxi_alojamento',
    npc: 'dax',
    line_pt: 'Você tenta se virar só com gestos no táxi. Não dá. Precisa falar, mesmo travando.',
    line_en: "Hi, I'm... going to... this address. Sorry, my English is not good.",
  },
  {
    id: 'encontro_com_mentor',
    stage: 'Encontro com o Mentor',
    lessonId: 'licao-20-present-continuous', // foco: present continuous (seção 5, A2)
    trigger: 'after',
    location: 'mercado_bairro',
    npc: 'idris',
    line_pt: 'No mercado do bairro, um homem te ouve tentar montar uma frase — e não ri.',
    theme: true, // este é o checkpoint que carrega a Cena do Tema (THEME_SCENE)
  },
  {
    id: 'limiar_1',
    stage: 'Cruzamento do 1º Limiar', // Plot Point 1 (seção 5)
    lessonId: 'licao-16-future-going-to', // foco: going to (seção 5, A2)
    trigger: 'after',
    location: 'campus_escritorio',
    npc: 'idris',
    line_pt: 'A vaga está na sua frente. Aceitar significa que não tem mais como fingir que não precisa do inglês.',
    line_en: "I'm going to take the job. There's no going back now.",
    decision: true, // decisão ativa do jogador, sem volta
  },
];

// --- Checkpoints do Ato 2 (B1 → B2, lições 31-50) -----------------
// "Testes, Aliados e Inimigos" + Midpoint (seção 5 do MD).
// Lições 31-40 já existem como página real. Lições 41-50 são do
// ROADMAP_CATALOG (teacher.html) — ainda sem página própria.
const ACT2_CHECKPOINTS = [
  {
    id: 'mal_entendido_cobranca',
    stage: 'Testes, Aliados e Inimigos (parte 1)',
    lessonId: 'licao-31-simple-past-past-continuous', // já existe
    trigger: 'after',
    location: 'bairro_comercial',
    npc: 'officer_reyes',
    line_pt: 'Uma cobrança errada, um mal-entendido — e você precisa contar exatamente o que aconteceu, na ordem certa.',
    line_en: 'I was paying when the machine charged me twice.',
  },
  {
    id: 'primeira_transacao',
    stage: 'Testes, Aliados e Inimigos (parte 1)',
    lessonId: 'licao-38-comparatives-superlatives-equality', // já existe
    trigger: 'after',
    location: 'bairro_comercial',
    npc: null, // PNJ genérico de loja — pode virar prompt de IA
    line_pt: 'Primeira negociação de verdade: comparar preços, defender o que você quer pagar.',
    line_en: 'This one is cheaper, but that one is better.',
  },
  {
    id: 'midpoint_historia_de_vida',
    stage: 'Midpoint — vitória aparente esconde a 1ª pista',
    lessonId: 'licao-50-revisao-semestre-4', // ROADMAP — projeto final "The Story of My Life" (Semestre 4)
    trigger: 'after',
    location: 'centro_eventos',
    npc: 'idris',
    line_pt: 'A grande oportunidade: contar sua própria história pra uma sala cheia de gente. Você é aplaudido — e não percebe, ainda, o que ouviu de relance sobre a fusão da Kessler & Co.',
    line_en: null, // conteúdo do próprio aluno (é o projeto final do semestre)
    midpoint: true,
    projectTitle: 'The Story of My Life',
  },
];

// --- Checkpoints do Ato 2B (C1, parte do Semestre 5 — lições 46-60) ---
// Aproximação da Caverna + Provação Central + All Is Lost (seção 5).
const ACT2B_CHECKPOINTS = [
  {
    id: 'documentos_arquivo',
    stage: 'Aproximação da Caverna Mais Profunda',
    lessonId: 'licao-46-passive-voice', // ROADMAP, semestre 4
    trigger: 'after',
    location: 'museu_historico',
    npc: 'guia_turistico',
    line_pt: 'Documentos antigos, escritos naquele jeito impessoal de relatório — "foram prestados serviços a...". Ninguém quis dizer por quem.',
    line_en: 'It is believed that dozens of newcomers were affected.',
  },
  {
    id: 'passado_de_kessler',
    stage: 'Aproximação da Caverna Mais Profunda',
    lessonId: 'licao-51-third-conditional-mixed', // ROADMAP, Semestre 5 (C1+C2)
    trigger: 'after',
    location: 'corporate_center',
    npc: 'informante',
    line_pt: 'Se as coisas tivessem sido diferentes pra ele, décadas atrás, talvez nada disso tivesse acontecido. Quase dá pena. Quase.',
    line_en: 'If he had been treated differently back then, he might have become someone else.',
  },
  {
    id: 'issue_worth_discussing',
    stage: 'Provação Central',
    lessonId: 'licao-60-revisao-semestre-5', // ROADMAP — projeto final "An Issue Worth Discussing" (Semestre 5)
    trigger: 'after',
    location: 'centro_eventos',
    npc: 'kessler',
    line_pt: 'Você tenta levantar o assunto formalmente, com evidências. Kessler sorri, educado, e vira o jogo contra você na frente de todo mundo.',
    line_en: null, // conteúdo do próprio aluno (é o projeto final do semestre)
    projectTitle: 'An Issue Worth Discussing',
  },
  {
    id: 'priya_revelacao',
    stage: 'Recompensa + Caminho de Volta — All Is Lost',
    lessonId: 'licao-47-reported-speech', // ROADMAP, Semestre 4 — a gramática da própria cena
    trigger: 'after',
    location: 'hospital',
    npc: 'priya',
    line_pt: 'Idris foi atingido. E Priya finalmente conta o que fez — e o que esconde pra consertar.',
    line_en: "I told him what you found. He said he'd make sure I never worked again.",
    sceneRef: 'Seção 8.3 do documento de história — "O Que Ela Escondeu"',
    allIsLost: true,
  },
];

// --- Checkpoints do Ato 3 (C2, parte do Semestre 5 — lições 61-70) ----
// Ressurreição + Retorno com o Elixir (seção 5).
const ACT3_CHECKPOINTS = [
  {
    id: 'preparando_argumento',
    stage: 'Ressurreição (preparação)',
    lessonId: 'licao-69-rhetoric-argumentation-persuasion', // ROADMAP, Semestre 5 (C1+C2)
    trigger: 'after',
    location: 'campus_escritorio',
    npc: 'priya',
    line_pt: 'Com a Priya, você organiza tudo que descobriu numa linha de raciocínio que aguenta ser questionada.',
    line_en: null,
  },
  {
    id: 'confronto_final',
    stage: 'Ressurreição',
    lessonId: 'licao-70-revisao-semestre-6', // ROADMAP — projeto final "The Big Argument" (Semestre 5)
    trigger: 'after',
    location: 'torre', // PENDENTE — ver LOCATIONS.torre
    npc: 'kessler',
    line_pt: 'O topo da torre. A sala cheia. E, pela primeira vez, você fala — imperfeito, mas real — e é ouvido.',
    line_en: null, // conteúdo do próprio aluno (é o projeto final do semestre)
    sceneRef: 'Seção 8.4 do documento de história — "O Topo da Torre"',
    climax: true,
    projectTitle: 'The Big Argument',
  },
  {
    id: 'retorno_com_elixir',
    stage: 'Retorno com o Elixir',
    lessonId: null, // não gated a uma lição — epílogo
    trigger: null,
    location: 'mercado_bairro', // fecha o ciclo, de volta ao início
    npc: 'idris',
    line_pt: 'De volta ao mercado onde tudo começou — só que agora é você quem ajuda alguém recém-chegado a montar a primeira frase.',
    line_en: null,
    epilogue: true,
  },
];

// --- Helpers de consulta ------------------------------------------
// Puramente leitura de dados — a lógica de "quando mostrar" fica em
// app.js / lesson-kit.js, igual ao Sky Metropolis: constants.tsx nunca
// decide quando renderizar, só descreve o que existe.

const ALL_CHECKPOINTS = [
  ...ACT1_CHECKPOINTS,
  ...ACT2_CHECKPOINTS,
  ...ACT2B_CHECKPOINTS,
  ...ACT3_CHECKPOINTS,
];

function getCheckpointForLesson(lessonId, trigger) {
  return ALL_CHECKPOINTS.find(
    (c) => c.lessonId === lessonId && c.trigger === trigger
  ) || null;
}

function getSceneData(checkpoint) {
  if (!checkpoint) return null;
  const npc = NPCS[checkpoint.npc];
  const location = LOCATIONS[checkpoint.location];
  const theme = checkpoint.theme ? THEME_SCENE : null;
  return { checkpoint, npc, location, theme };
}

// Uso típico em app.js, ao abrir uma lição:
//   const scene = getSceneData(getCheckpointForLesson(lesson.id, 'before'));
//   if (scene) showStoryOverlay(scene); // função de UI, não deste arquivo

// Uso típico em lesson-kit.js, ao chamar handleLessonFinish():
//   const scene = getSceneData(getCheckpointForLesson(lessonId, 'after'));
//   if (scene) showStoryOverlay(scene);

// --- Exposição global -----------------------------------------------
// Este projeto não usa bundler/import — scripts são carregados direto
// no navegador na ordem: config.js -> db-client.js -> story.js -> app.js
// (ou lesson-kit.js). Segue o mesmo padrão de config.js (window.APP_CONFIG,
// window.SUPABASE_CONFIG): tudo pendurado em um único objeto global.
var BOBCAT_VILLE_STORY = {
  theme: BOBCAT_VILLE_THEME,
  identities: IDENTITIES,
  moralDilemma: MORAL_DILEMMA,
  locations: LOCATIONS,
  npcs: NPCS,
  themeScene: THEME_SCENE,
  act1Checkpoints: ACT1_CHECKPOINTS,
  act2Checkpoints: ACT2_CHECKPOINTS,
  act2bCheckpoints: ACT2B_CHECKPOINTS,
  act3Checkpoints: ACT3_CHECKPOINTS,
  allCheckpoints: ALL_CHECKPOINTS,
  getCheckpointForLesson: getCheckpointForLesson,
  getSceneData: getSceneData,
};

if (typeof window !== 'undefined') {
  window.BOBCAT_VILLE_STORY = BOBCAT_VILLE_STORY;
}

// Mantido só para permitir testar este arquivo isoladamente com Node
// (ex.: `node -e "require('./story.js')"`), fora do navegador.
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BOBCAT_VILLE_STORY;
}
