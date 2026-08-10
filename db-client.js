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
  if (!useSupabase) return { ok: false, message: 'Cadastro só está disponível com conta na nuvem configurada.' };
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
  if (!useSupabase) return { ok: false, message: 'Login só está disponível com conta na nuvem configurada.' };
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
  if (!useSupabase) return { ok: false, message: 'Só disponível com conta na nuvem configurada.' };
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
        answers: row.answers || [],
        lastAttempt: row.last_attempt
      };
    });
    return map;
  }
  const raw = localStorage.getItem(PROGRESS_KEY);
  return raw ? JSON.parse(raw) : {};
}

async function saveLessonProgressData(lessonId, correct, total, answers) {
  const pct = total > 0 ? (correct / total) * 100 : 0;
  const completed = pct >= PASSING_PCT;
  const safeAnswers = Array.isArray(answers) ? answers : [];

  if (useSupabase) {
    if (!currentUserId) return { completed, pct };
    const row = {
      user_id: currentUserId,
      lesson_id: lessonId,
      completed: completed,
      correct: correct,
      total: total,
      answers: safeAnswers,
      last_attempt: new Date().toISOString()
    };
    const { error } = await supabaseClient.from('progress').upsert(row, { onConflict: 'user_id,lesson_id' });
    if (error) console.error(error);
    return { completed, pct };
  }
  const progress = await getProgress();
  progress[lessonId] = { completed, correct, total, answers: safeAnswers, lastAttempt: new Date().toISOString() };
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  return { completed, pct };
}

// ---------- Captura automática das respostas (para o professor revisar) ----------
// Lê o gabarito direto do que já existe no HTML de cada lição — não precisa
// editar lição por lição. Cobre os dois padrões usados nas lições:
//  1) Campo de texto com data-answer="..." ou data-answers="a|b" (uma ou mais
//     respostas aceitas), opcionalmente com data-label="enunciado".
//  2) Grupo de rádio (mesmo atributo `name`) onde a opção certa tem a classe
//     "correct-answer" no HTML, com o enunciado em ".mc-item .q".
// Como fallback (grupos de rádio corrigidos só via JavaScript da própria
// lição, sem marcação no HTML), aproveita as classes "correct"/"incorrect"
// que a lição já aplica na tela ao conferir as respostas.
// Campos de texto livre (sem gabarito) entram como resposta aberta, sem
// status de certo/errado — útil pro professor ver o que o aluno escreveu.
function normalizeAnswerText(s) {
  return (s || '').trim().toLowerCase().replace(/\s+/g, ' ');
}

function labelFromContext(el) {
  if (el.dataset && el.dataset.label) return el.dataset.label;
  const item = el.closest('.fill-item, .mc-item');
  if (item) {
    const qEl = item.querySelector('.q');
    if (qEl) return qEl.textContent.replace(/\s+/g, ' ').trim();
    const clone = item.cloneNode(true);
    clone.querySelectorAll('input, select, button, .answer-hint').forEach(n => n.remove());
    const text = clone.textContent.replace(/\s+/g, ' ').trim();
    if (text) return text;
  }
  return el.placeholder || el.name || el.id || 'Questão';
}

function labelTextForRadio(radioEl) {
  const label = radioEl.closest('label');
  if (label) return label.textContent.replace(/\s+/g, ' ').trim();
  return radioEl.value;
}

function collectLessonAnswers() {
  const items = [];
  const handledInputs = new Set();

  // 1) Campos de texto com gabarito declarado no HTML
  document.querySelectorAll('input[type="text"][data-answer], input[type="text"][data-answers]').forEach(inp => {
    handledInputs.add(inp);
    const given = inp.value.trim();
    const acceptedRaw = inp.dataset.answers || inp.dataset.answer || '';
    const accepted = acceptedRaw.split('|').map(a => a.trim()).filter(Boolean);
    const isCorrect = given !== '' && accepted.some(a => normalizeAnswerText(a) === normalizeAnswerText(given));
    items.push({
      question: labelFromContext(inp),
      studentAnswer: given || '(em branco)',
      correctAnswer: accepted[0] || null,
      status: given === '' ? 'blank' : (isCorrect ? 'correct' : 'incorrect')
    });
  });

  // 2) Grupos de rádio (múltipla escolha / verdadeiro-falso)
  const radioGroups = {};
  document.querySelectorAll('input[type="radio"]').forEach(r => {
    (radioGroups[r.name] = radioGroups[r.name] || []).push(r);
  });
  Object.values(radioGroups).forEach(group => {
    const selected = group.find(r => r.checked) || null;
    const staticCorrect = group.find(r => r.classList.contains('correct-answer'));
    let correctLabel = null;
    let status;

    if (staticCorrect) {
      correctLabel = labelTextForRadio(staticCorrect);
      status = !selected ? 'blank' : (selected === staticCorrect ? 'correct' : 'incorrect');
    } else if (selected) {
      // Fallback: usa a marcação visual que a própria lição já aplicou ao conferir
      const selLabel = selected.closest('label');
      if (selLabel && selLabel.classList.contains('correct')) status = 'correct';
      else if (selLabel && selLabel.classList.contains('incorrect')) status = 'incorrect';
      else status = 'open';
      const correctMarked = group.find(r => {
        const l = r.closest('label');
        return l && l.classList.contains('correct');
      });
      if (correctMarked) correctLabel = labelTextForRadio(correctMarked);
    } else {
      status = 'blank';
    }

    items.push({
      question: labelFromContext(group[0]),
      studentAnswer: selected ? labelTextForRadio(selected) : '(em branco)',
      correctAnswer: correctLabel,
      status
    });
  });

  // 3) Texto livre preenchido, sem gabarito (produção do aluno)
  document.querySelectorAll('input[type="text"]').forEach(inp => {
    if (handledInputs.has(inp)) return;
    const given = inp.value.trim();
    if (given === '') return;
    items.push({
      question: labelFromContext(inp),
      studentAnswer: given,
      correctAnswer: null,
      status: 'open'
    });
  });

  return items;
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
  const answers = collectLessonAnswers();
  const { completed, pct } = await saveLessonProgressData(lessonId, correct, total, answers);
  const roundedPct = Math.round(pct);

  const cloudNote = isUsingCloud() ? ' (☁️)' : ' (💾)';
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
    // Lição não concluída: mostra a Trilha de Erro para ajudar o aluno a
    // entender o que errou antes de tentar de novo (só quando há gabarito
    // real, kind === 'correct' — lições "filled" não têm certo/errado).
    if (kind !== 'filled') renderErrorTrail(msg, answers);
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

// ---------- Senha para zerar progresso (definida pelo professor) ----------

// Retorna a senha cadastrada pelo professor para o aluno logado, ou null se
// não houver nenhuma cadastrada (ou se não estiver usando Supabase — nesse
// caso o app cai para a senha global de config.js como alternativa).
async function getMyResetPassword() {
  if (!useSupabase || !currentUserId) return null;
  const { data, error } = await supabaseClient
    .from('student_reset_passwords')
    .select('password')
    .eq('user_id', currentUserId)
    .maybeSingle();
  if (error) { console.error(error); return null; }
  return data ? data.password : null;
}

// ---------- Lições customizadas (adicionadas pelo professor pelo painel) ----------
// Só existem com o Supabase configurado — como o app é um site estático,
// não há como o painel "criar o arquivo" de verdade dentro de lessons/, então
// essas lições moram no banco e são abertas por lessons/custom.html?id=...

async function getCustomLessons() {
  if (!useSupabase || !currentUserId) return [];
  const { data, error } = await supabaseClient
    .from('custom_lessons')
    .select('id,name,level,icon,description,total_questions,section')
    .order('created_at', { ascending: true });
  if (error) { console.error(error); return []; }
  return (data || []).map(row => ({
    id: row.id,
    name: row.name,
    level: row.level,
    icon: row.icon || '📄',
    description: row.description || '',
    url: 'lessons/custom.html?id=' + encodeURIComponent(row.id),
    totalQuestions: row.total_questions || 0,
    section: row.section
  }));
}

// ---------- Mensagens (canal de comunicação com o professor) ----------
// Esse recurso só existe com o Supabase configurado: sem nuvem não há como
// a mensagem "sair" do aparelho do aluno e chegar ao painel do professor.

function messagingAvailable() {
  return useSupabase && !!currentUserId;
}

// ---------- Anexos de mensagens (PDF, Word, texto, planilha, imagem etc.) ----------

const MESSAGE_FILES_BUCKET = 'mensagens-arquivos';
const MAX_MESSAGE_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_MESSAGE_FILE_EXTENSIONS = [
  'pdf', 'doc', 'docx', 'odt', 'rtf', 'txt',
  'xls', 'xlsx', 'csv', 'ppt', 'pptx',
  'jpg', 'jpeg', 'png'
];

function getFileExtension(name) {
  const parts = (name || '').split('.');
  return parts.length > 1 ? parts.pop().toLowerCase() : '';
}

function isAllowedMessageFile(file) {
  return ALLOWED_MESSAGE_FILE_EXTENSIONS.includes(getFileExtension(file.name));
}

// Faz upload de um arquivo anexado ao bucket do Supabase Storage e devolve
// os metadados para salvar junto da mensagem.
async function uploadMessageFile(file) {
  if (!messagingAvailable()) return { ok: false, message: 'Esse recurso precisa de uma conta na nuvem para funcionar.' };
  if (!file) return { ok: false, message: 'Nenhum arquivo selecionado.' };
  if (file.size > MAX_MESSAGE_FILE_SIZE) return { ok: false, message: 'Arquivo muito grande (máximo 10MB).' };
  if (!isAllowedMessageFile(file)) return { ok: false, message: 'Tipo de arquivo não permitido. Envie PDF, Word, texto, planilha, apresentação ou imagem.' };

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const path = `${currentUserId}/${Date.now()}-${safeName}`;

  const { error: uploadError } = await supabaseClient.storage.from(MESSAGE_FILES_BUCKET).upload(path, file, { upsert: false });
  if (uploadError) { console.error(uploadError); return { ok: false, message: 'Não foi possível enviar o arquivo. Tente novamente.' }; }

  const { data } = supabaseClient.storage.from(MESSAGE_FILES_BUCKET).getPublicUrl(path);
  return { ok: true, url: data.publicUrl, name: file.name, type: file.type || getFileExtension(file.name), size: file.size };
}

// ---------- Personalidades e histórico do chat com IA ----------
// Mesmo padrão do perfil/progresso: com Supabase configurado, sincroniza
// entre dispositivos; sem Supabase, cai para localStorage (só naquele
// aparelho). Antes disso, ambos viviam só no localStorage — por isso um
// personagem/conversa criado no celular não aparecia no desktop e vice-versa.

function aiChatHistoryLocalKey(personaId) { return 'aiChatHistory_' + personaId; }

async function getAiChatPersonas() {
  if (useSupabase) {
    if (!currentUserId) return [];
    const { data, error } = await supabaseClient
      .from('ai_chat_personas').select('*').eq('user_id', currentUserId).order('created_at');
    if (error) { console.error(error); return []; }
    return (data || []).map(r => ({
      id: r.id, name: r.name, personality: r.personality,
      emoji: r.emoji, gender: r.gender, createdAt: r.created_at
    }));
  }
  try { return JSON.parse(localStorage.getItem('aiChatPersonas') || '[]') || []; }
  catch (e) { return []; }
}

async function addAiChatPersona(persona) {
  if (useSupabase) {
    if (!currentUserId) return;
    const row = {
      id: persona.id, user_id: currentUserId, name: persona.name,
      personality: persona.personality, emoji: persona.emoji,
      gender: persona.gender === 'male' ? 'male' : 'female',
      created_at: persona.createdAt || new Date().toISOString()
    };
    const { error } = await supabaseClient.from('ai_chat_personas').insert(row);
    if (error) console.error(error);
    return;
  }
  const list = await getAiChatPersonas();
  list.push(persona);
  localStorage.setItem('aiChatPersonas', JSON.stringify(list));
}

async function deleteAiChatPersona(id) {
  if (useSupabase) {
    if (!currentUserId) return;
    // O histórico (ai_chat_history) é apagado junto via "on delete cascade".
    const { error } = await supabaseClient.from('ai_chat_personas').delete().eq('id', id).eq('user_id', currentUserId);
    if (error) console.error(error);
    return;
  }
  const list = (await getAiChatPersonas()).filter(p => p.id !== id);
  localStorage.setItem('aiChatPersonas', JSON.stringify(list));
  localStorage.removeItem(aiChatHistoryLocalKey(id));
}

async function getAiChatHistoryFor(personaId) {
  if (useSupabase) {
    if (!currentUserId) return [];
    const { data, error } = await supabaseClient
      .from('ai_chat_history').select('messages').eq('user_id', currentUserId).eq('persona_id', personaId).maybeSingle();
    if (error) { console.error(error); return []; }
    return (data && data.messages) || [];
  }
  try { return JSON.parse(localStorage.getItem(aiChatHistoryLocalKey(personaId)) || '[]') || []; }
  catch (e) { return []; }
}

async function saveAiChatHistoryFor(personaId, hist) {
  if (useSupabase) {
    if (!currentUserId) return;
    const row = { user_id: currentUserId, persona_id: personaId, messages: hist, updated_at: new Date().toISOString() };
    const { error } = await supabaseClient.from('ai_chat_history').upsert(row, { onConflict: 'user_id,persona_id' });
    if (error) console.error(error);
    return;
  }
  localStorage.setItem(aiChatHistoryLocalKey(personaId), JSON.stringify(hist));
}

// Retorna a conversa do aluno logado, mais antiga primeiro.
async function getMyMessages() {
  if (!messagingAvailable()) return [];
  const { data, error } = await supabaseClient
    .from('messages')
    .select('*')
    .eq('user_id', currentUserId)
    .order('created_at', { ascending: true });
  if (error) { console.error(error); return []; }
  return data || [];
}

// Envia uma mensagem do aluno para o professor. `file`, se passado (um
// objeto File do input), é enviado como anexo — pode ir sozinho, sem texto.
async function sendMessageToTeacher(body, file) {
  if (!messagingAvailable()) return { ok: false, message: 'Esse recurso precisa de uma conta na nuvem para funcionar.' };
  const text = (body || '').trim();
  if (!text && !file) return { ok: false, message: 'Escreva algo ou anexe um arquivo antes de enviar.' };

  let fileData = null;
  if (file) {
    const uploadResult = await uploadMessageFile(file);
    if (!uploadResult.ok) return uploadResult;
    fileData = uploadResult;
  }

  const { error } = await supabaseClient.from('messages').insert({
    user_id: currentUserId,
    sender: 'student',
    body: text,
    file_url: fileData ? fileData.url : null,
    file_name: fileData ? fileData.name : null,
    file_type: fileData ? fileData.type : null,
    file_size: fileData ? fileData.size : null
  });
  if (error) { console.error(error); return { ok: false, message: 'Não foi possível enviar. Tente novamente.' }; }
  return { ok: true };
}

// ---------- Web Push subscriptions ----------

async function savePushSubscription(subscription) {
  if (!subscription || !subscription.endpoint) return { ok: false };
  const json = typeof subscription.toJSON === 'function' ? subscription.toJSON() : subscription;
  const endpoint = json.endpoint;
  const p256dh = json.keys && json.keys.p256dh;
  const auth = json.keys && json.keys.auth;
  if (!endpoint || !p256dh || !auth) return { ok: false, message: 'Subscription inválida.' };

  // Sempre guarda local (funciona sem Supabase)
  try {
    localStorage.setItem('bobcat_push_subscription', JSON.stringify({ endpoint, keys: { p256dh, auth } }));
  } catch (e) { /* ignore quota */ }

  if (!useSupabase || !supabaseClient || !currentUserId) {
    return { ok: true, localOnly: true };
  }

  const row = {
    user_id: currentUserId,
    endpoint,
    p256dh,
    auth,
    user_agent: (typeof navigator !== 'undefined' && navigator.userAgent) ? navigator.userAgent.slice(0, 300) : null,
    updated_at: new Date().toISOString()
  };

  const { error } = await supabaseClient
    .from('push_subscriptions')
    .upsert(row, { onConflict: 'endpoint' });
  if (error) {
    console.error('savePushSubscription:', error);
    return { ok: false, message: error.message };
  }
  return { ok: true };
}

async function removePushSubscription(endpoint) {
  try { localStorage.removeItem('bobcat_push_subscription'); } catch (e) { /* ignore */ }
  if (!useSupabase || !supabaseClient || !endpoint) return { ok: true };
  const { error } = await supabaseClient
    .from('push_subscriptions')
    .delete()
    .eq('endpoint', endpoint);
  if (error) console.error('removePushSubscription:', error);
  return { ok: true };
}

function getLocalPushSubscription() {
  try {
    return JSON.parse(localStorage.getItem('bobcat_push_subscription') || 'null');
  } catch (e) {
    return null;
  }
}

// ---------- Resumo da última conversa com a IA (só para personalizar o lembrete) ----------

const AI_LAST_CONVO_MAX_MESSAGES = 8; // suficiente pra dar contexto ao Gemini sem pesar o payload
const AI_LAST_CONVO_MAX_CHARS = 400; // por mensagem, corta mensagens muito longas

// Chamado depois de cada turno do chat com a IA. Só faz algo em modo Supabase
// (é o único jeito de o servidor de push, que não vê o localStorage do aluno,
// saber do que foi a última conversa). Falha em silêncio: isso é só um "plus"
// do lembrete, nunca deve travar o chat em si.
async function syncAiChatLastConversation(persona, history) {
  if (!useSupabase || !supabaseClient || !currentUserId) return;
  if (!persona || !Array.isArray(history) || history.length === 0) return;

  const recent = history
    .slice(-AI_LAST_CONVO_MAX_MESSAGES)
    .filter(m => m && typeof m.text === 'string' && (m.role === 'user' || m.role === 'model'))
    .map(m => ({ role: m.role, text: m.text.slice(0, AI_LAST_CONVO_MAX_CHARS) }));
  if (recent.length === 0) return;

  const row = {
    user_id: currentUserId,
    persona_name: (persona.name || '').slice(0, 60),
    persona_emoji: (persona.emoji || '').slice(0, 10),
    persona_gender: persona.gender === 'male' ? 'male' : 'female',
    messages: recent,
    updated_at: new Date().toISOString()
  };

  try {
    const { error } = await supabaseClient
      .from('ai_chat_last_conversation')
      .upsert(row, { onConflict: 'user_id' });
    if (error) console.error('syncAiChatLastConversation:', error);
  } catch (e) {
    console.error('syncAiChatLastConversation:', e);
  }
}

// ---------- Trilha de Erro (explicações da IA para questões erradas) ----------
// Aparece na tela de "Finalizar lição" quando o aluno não atinge a nota
// mínima: pega as questões marcadas como erradas por collectLessonAnswers()
// e deixa o aluno pedir, uma a uma, uma explicação curta da IA — e depois,
// se quiser, mais alguns exemplos daquele mesmo ponto. Cada card só chama a
// IA quando o aluno pede (nada é gerado automaticamente), e cada card só
// permite pedir "mais exemplos" duas vezes, pra manter o custo baixo.

const ERROR_TRAIL_MAX_ITEMS = 4;
const ERROR_TRAIL_MAX_MORE_CLICKS = 2;
let errorTrailStylesInjected = false;

function injectErrorTrailStyles() {
  if (errorTrailStylesInjected) return;
  errorTrailStylesInjected = true;
  const style = document.createElement('style');
  style.textContent = `
    .bcerr-wrap{margin-top:22px;text-align:left;font-family:"Inter","Segoe UI",sans-serif}
    .bcerr-title{font-size:14px;font-weight:700;color:#3a3226;margin-bottom:10px;text-align:center}
    .bcerr-card{background:#fff;border:1px solid #EBC9AE;border-radius:14px;padding:14px 16px;margin-bottom:10px;box-shadow:0 2px 10px rgba(180,120,80,.08)}
    .bcerr-q{font-size:13px;color:#2b2b2b;margin-bottom:8px;line-height:1.5}
    .bcerr-q b{color:#C0392B}
    .bcerr-btn{background:#D9793F;color:#fff;border:none;border-radius:99px;padding:7px 14px;font-size:12.5px;font-weight:700;cursor:pointer}
    .bcerr-btn:disabled{opacity:.6;cursor:default}
    .bcerr-btn.ghost{background:transparent;color:#D9793F;border:1px solid #D9793F;margin-top:8px}
    .bcerr-explain{font-size:13px;color:#2b2b2b;line-height:1.55;margin-top:10px;padding-top:10px;border-top:1px dashed #EBC9AE}
    .bcerr-examples{margin:8px 0 0;padding-left:18px}
    .bcerr-examples li{font-size:12.5px;color:#555;margin-bottom:4px;line-height:1.5}
    .bcerr-error{font-size:12.5px;color:#C0392B;margin-top:8px}
  `;
  document.head.appendChild(style);
}

async function callExplainError(payload) {
  const res = await fetch('/api/explain-error', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.error) throw new Error(data.error || 'Erro ao consultar a IA.');
  return data;
}

function renderErrorTrail(anchorEl, answers) {
  if (!anchorEl || !Array.isArray(answers)) return;
  const wrong = answers.filter(a => a && a.status === 'incorrect').slice(0, ERROR_TRAIL_MAX_ITEMS);
  if (wrong.length === 0) return;

  injectErrorTrailStyles();

  // Evita duplicar se o aluno clicar em "Finalizar" mais de uma vez
  const existing = anchorEl.parentNode.querySelector('.bcerr-wrap');
  if (existing) existing.remove();

  const wrap = document.createElement('div');
  wrap.className = 'bcerr-wrap';
  wrap.innerHTML = '<div class="bcerr-title">🔎 Vamos entender o que você errou?</div>';

  wrong.forEach(item => {
    const card = document.createElement('div');
    card.className = 'bcerr-card';

    const q = document.createElement('div');
    q.className = 'bcerr-q';
    q.innerHTML = escapeHtmlLite(item.question) +
      '<br><b>Sua resposta:</b> ' + escapeHtmlLite(item.studentAnswer) +
      (item.correctAnswer ? '<br><b>Resposta certa:</b> ' + escapeHtmlLite(item.correctAnswer) : '');
    card.appendChild(q);

    const btn = document.createElement('button');
    btn.className = 'bcerr-btn';
    btn.type = 'button';
    btn.textContent = '💡 Entender esse erro';

    const body = document.createElement('div');
    let moreClicks = 0;
    const shownExamples = [];

    async function loadExplanation() {
      btn.disabled = true;
      btn.textContent = 'Pensando...';
      try {
        const profile = await getProfile().catch(() => null);
        const level = (profile && profile.level) || 'A1';
        const data = await callExplainError({
          mode: 'explain',
          question: item.question,
          studentAnswer: item.studentAnswer,
          correctAnswer: item.correctAnswer,
          level,
          lessonTitle: document.title
        });
        renderExplanationBody(data, level);
        btn.remove();
      } catch (err) {
        btn.disabled = false;
        btn.textContent = '💡 Entender esse erro';
        const errEl = document.createElement('div');
        errEl.className = 'bcerr-error';
        errEl.textContent = '⚠️ ' + (err.message || 'Não foi possível consultar a IA agora.');
        body.appendChild(errEl);
      }
    }

    function renderExplanationBody(data, level) {
      const explainEl = document.createElement('div');
      explainEl.className = 'bcerr-explain';
      explainEl.textContent = data.explanation || '';
      body.appendChild(explainEl);

      if (data.examples && data.examples.length) {
        const ul = document.createElement('ul');
        ul.className = 'bcerr-examples';
        data.examples.forEach(ex => {
          shownExamples.push(ex);
          const li = document.createElement('li');
          li.textContent = ex;
          ul.appendChild(li);
        });
        body.appendChild(ul);
      }

      if (moreClicks < ERROR_TRAIL_MAX_MORE_CLICKS) {
        const moreBtn = document.createElement('button');
        moreBtn.className = 'bcerr-btn ghost';
        moreBtn.type = 'button';
        moreBtn.textContent = '➕ Mais exemplos';
        moreBtn.onclick = async () => {
          moreBtn.disabled = true;
          moreBtn.textContent = 'Gerando...';
          try {
            const data2 = await callExplainError({
              mode: 'more',
              question: item.question,
              studentAnswer: item.studentAnswer,
              correctAnswer: item.correctAnswer,
              level,
              lessonTitle: document.title,
              previousExamples: shownExamples
            });
            moreClicks++;
            moreBtn.remove();
            renderExplanationBody(data2, level);
          } catch (err) {
            moreBtn.disabled = false;
            moreBtn.textContent = '➕ Mais exemplos';
          }
        };
        body.appendChild(moreBtn);
      }
    }

    btn.onclick = loadExplanation;
    card.appendChild(btn);
    card.appendChild(body);
    wrap.appendChild(card);
  });

  if (answers.filter(a => a && a.status === 'incorrect').length > ERROR_TRAIL_MAX_ITEMS) {
    const note = document.createElement('div');
    note.style.cssText = 'font-size:12px;color:#8a8171;text-align:center;margin-top:2px';
    note.textContent = 'Mostrando as primeiras ' + ERROR_TRAIL_MAX_ITEMS + ' questões erradas.';
    wrap.appendChild(note);
  }

  anchorEl.parentNode.insertBefore(wrap, anchorEl.nextSibling);
}

function escapeHtmlLite(str) {
  const div = document.createElement('div');
  div.textContent = str == null ? '' : String(str);
  return div.innerHTML;
}
