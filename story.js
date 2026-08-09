// ============================================================
// BOBCAT VILLE — story.js
// Dados narrativos do jogo, separados da lógica de UI.
// História de Bobcat Ville.
//
// Papel deste arquivo (igual ao types.ts + constants.tsx do
// Sky Metropolis): nenhuma lógica de tela aqui, só o "mundo"
// como dados que app.js / lesson-kit.js podem consultar.
//
// Cobre só o ATO 1 (A1 + A2) por enquanto. Atos 2 e 3 (B1→C2)
// entram depois, quando o catálogo de lições chegar lá — hoje
// o Bobcat só tem lições até B1 (ver app.js, LESSONS).
// ============================================================

// --- Tema central (seção 1 do MD) ---------------------------
const BOBCAT_VILLE_THEME = 'Inglês é liberdade.';

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
    lessonId: 'licao-16-present-continuous', // foco: present continuous (seção 5, A2)
    trigger: 'after',
    location: 'mercado_bairro',
    npc: 'idris',
    line_pt: 'No mercado do bairro, um homem te ouve tentar montar uma frase — e não ri.',
    theme: true, // este é o checkpoint que carrega a Cena do Tema (THEME_SCENE)
  },
  {
    id: 'limiar_1',
    stage: 'Cruzamento do 1º Limiar', // Plot Point 1 (seção 5)
    lessonId: 'licao-24-future-going-to', // foco: going to (seção 5, A2)
    trigger: 'after',
    location: 'campus_escritorio',
    npc: 'idris',
    line_pt: 'A vaga está na sua frente. Aceitar significa que não tem mais como fingir que não precisa do inglês.',
    line_en: "I'm going to take the job. There's no going back now.",
    decision: true, // decisão ativa do jogador, sem volta
  },
];

// --- Helpers de consulta ------------------------------------------
// Puramente leitura de dados — a lógica de "quando mostrar" fica em
// app.js / lesson-kit.js, igual ao Sky Metropolis: constants.tsx nunca
// decide quando renderizar, só descreve o que existe.

function getCheckpointForLesson(lessonId, trigger) {
  return ACT1_CHECKPOINTS.find(
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
  moralDilemma: MORAL_DILEMMA,
  locations: LOCATIONS,
  npcs: NPCS,
  themeScene: THEME_SCENE,
  act1Checkpoints: ACT1_CHECKPOINTS,
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
