// /api/push-send.js
// Envia notificações Web Push para um ou mais alunos.
//
// Variáveis de ambiente na Vercel:
//   VAPID_PUBLIC_KEY   — mesma chave pública exposta em config.js
//   VAPID_PRIVATE_KEY  — chave privada (NUNCA no navegador)
//   VAPID_SUBJECT      — mailto:seu@email.com (contato do dono do app)
//   SUPABASE_URL       — (opcional) para buscar subscriptions no banco
//   SUPABASE_SERVICE_ROLE_KEY — (opcional) para listar todas as subscriptions
//   GEMINI_API_KEY     — (opcional) mesma chave do api/chat.js — habilita lembretes
//                         personalizados com base na última conversa do aluno
//   PUSH_SEND_SECRET   — (opcional) se definida, exige header x-push-secret
//   CRON_SECRET        — (opcional) enviado automaticamente pelo Vercel Cron
//                         quando configurada nas env vars do projeto
//
// Duas formas de chamar:
//   GET  (usado pelo Vercel Cron, ver "crons" em vercel.json) — sem corpo,
//        manda lembrete só pra quem está "no horário" agora (ver
//        reminder_times abaixo). É o disparo automático, agendado.
//   POST { title, body, url?, tag?, userId?, personalize? }
//        ou { title, body, subscription: {...} } — envio manual/imediato
//        (painel do professor, curl, ou o botão de teste do app), ignora
//        horário e manda na hora pra quem for pedido.
//
// Horários configuráveis (reminder_times, coluna em push_subscriptions):
//   Cada aluno pode escolher, na tela de Perfil/Praticar com IA, em que
//   horários (UTC, arredondados pro quarto de hora) quer receber o lembrete.
//   Quem não configurou nada usa DEFAULT_REMINDER_TIMES. O cron precisa
//   rodar com a mesma granularidade de REMINDER_WINDOW_MINUTES (15 min) pra
//   não perder nenhum horário configurado.
//
// Personalização (só funciona com Supabase + GEMINI_API_KEY configurados):
//   Busca a conversa mais recente do aluno com a IA e pede pro Gemini gerar
//   um título/corpo de notificação que "lembra" do assunto. Quando o aluno
//   tem mais de uma personalidade de IA criada, sorteia qual delas "manda"
//   o lembrete dessa vez (fetchConversationsForReminder), pra não ficar
//   sempre a mesma e confundir quem conversa com várias. Se não houver
//   conversa, ou o Gemini falhar, ou personalize estiver desligado, cai no
//   title/body genérico enviado no request.

const webpush = require('web-push');

const GEMINI_MODEL = 'gemini-3.5-flash-lite';
const GEMINI_URL =
  `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

// Limite de segurança: mesmo com Supabase + Gemini configurados, não deixa
// uma turma gigante gerar centenas de chamadas de IA num único envio.
// Alunos além do limite recebem o lembrete genérico (title/body do request).
const MAX_PERSONALIZED_CALLS = 60;

// Horários padrão (UTC) usados por quem não configurou horário próprio na
// tela de Perfil/Praticar com IA (equivale a 8h/18h em Brasília).
const DEFAULT_REMINDER_TIMES = ['11:00', '21:00'];

// Precisa bater com o intervalo do cron em vercel.json (ex.: "*/15 * * * *").
const REMINDER_WINDOW_MINUTES = 15;

// Horário atual em UTC, arredondado pra baixo pro múltiplo de
// REMINDER_WINDOW_MINUTES mais próximo — é o "slot" que comparamos com os
// horários configurados pelo aluno (que também são salvos já arredondados).
function currentUtcSlot() {
  const now = new Date();
  const roundedMinutes = now.getUTCMinutes() - (now.getUTCMinutes() % REMINDER_WINDOW_MINUTES);
  const hh = String(now.getUTCHours()).padStart(2, '0');
  const mm = String(roundedMinutes).padStart(2, '0');
  return `${hh}:${mm}`;
}

// Um push_subscriptions row está "no horário" agora? (usado só na chamada
// automática do cron — envios manuais/broadcast do professor ignoram isso).
function isDueNow(row, slot) {
  const times = Array.isArray(row.reminder_times) && row.reminder_times.length > 0
    ? row.reminder_times
    : DEFAULT_REMINDER_TIMES;
  if (!times.includes(slot)) return false;
  if (row.last_reminder_sent_at) {
    const elapsedMs = Date.now() - new Date(row.last_reminder_sent_at).getTime();
    if (elapsedMs < REMINDER_WINDOW_MINUTES * 60 * 1000) return false; // já mandou nesse ciclo
  }
  return true;
}

function buildPayload(title, body, url, tag) {
  return JSON.stringify({
    title: String(title || 'Bobcat Language School').slice(0, 80),
    body: String(body || 'Hora de praticar inglês! 🐱').slice(0, 200),
    url: String(url || '/index.html?screen=ai-chat').slice(0, 200),
    tag: String(tag || 'bobcat-practice').slice(0, 60)
  });
}

// Busca o resumo da última conversa de um conjunto de alunos, de uma vez só.
async function fetchLastConversations(supabaseUrl, serviceKey, userIds) {
  if (userIds.length === 0) return new Map();
  const idsParam = userIds.map(id => encodeURIComponent(id)).join(',');
  const url = `${supabaseUrl}/rest/v1/ai_chat_last_conversation?select=user_id,persona_name,persona_emoji,messages&user_id=in.(${idsParam})`;
  try {
    const res = await fetch(url, {
      headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, Accept: 'application/json' }
    });
    if (!res.ok) {
      console.error('fetchLastConversations error:', res.status, await res.text());
      return new Map();
    }
    const rows = await res.json();
    const map = new Map();
    for (const row of Array.isArray(rows) ? rows : []) {
      map.set(row.user_id, row);
    }
    return map;
  } catch (e) {
    console.error('fetchLastConversations failed:', e);
    return new Map();
  }
}

// Todas as personalidades de IA de um conjunto de alunos, agrupadas por aluno.
async function fetchPersonasByUser(supabaseUrl, serviceKey, userIds) {
  const map = new Map();
  if (userIds.length === 0) return map;
  const idsParam = userIds.map(id => encodeURIComponent(id)).join(',');
  const url = `${supabaseUrl}/rest/v1/ai_chat_personas?select=id,user_id,name,emoji&user_id=in.(${idsParam})`;
  try {
    const res = await fetch(url, {
      headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, Accept: 'application/json' }
    });
    if (!res.ok) {
      console.error('fetchPersonasByUser error:', res.status, await res.text());
      return map;
    }
    const rows = await res.json();
    for (const row of Array.isArray(rows) ? rows : []) {
      if (!map.has(row.user_id)) map.set(row.user_id, []);
      map.get(row.user_id).push(row);
    }
    return map;
  } catch (e) {
    console.error('fetchPersonasByUser failed:', e);
    return map;
  }
}

// Histórico completo (ai_chat_history) para pares (user_id, persona_id) específicos.
async function fetchHistoryForPersonas(supabaseUrl, serviceKey, pairs) {
  const map = new Map(); // `${user_id}::${persona_id}` -> messages
  if (pairs.length === 0) return map;
  const userIds = [...new Set(pairs.map(p => p.user_id))];
  const personaIds = [...new Set(pairs.map(p => p.persona_id))];
  const idsParam = userIds.map(id => encodeURIComponent(id)).join(',');
  const pidsParam = personaIds.map(id => encodeURIComponent(id)).join(',');
  const url = `${supabaseUrl}/rest/v1/ai_chat_history?select=user_id,persona_id,messages&user_id=in.(${idsParam})&persona_id=in.(${pidsParam})`;
  try {
    const res = await fetch(url, {
      headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, Accept: 'application/json' }
    });
    if (!res.ok) {
      console.error('fetchHistoryForPersonas error:', res.status, await res.text());
      return map;
    }
    const rows = await res.json();
    const wanted = new Set(pairs.map(p => `${p.user_id}::${p.persona_id}`));
    for (const row of Array.isArray(rows) ? rows : []) {
      const key = `${row.user_id}::${row.persona_id}`;
      if (wanted.has(key)) map.set(key, row.messages);
    }
    return map;
  } catch (e) {
    console.error('fetchHistoryForPersonas failed:', e);
    return map;
  }
}

// Monta os dados de conversa usados pra personalizar o lembrete de cada
// aluno. Quando o aluno tem mais de uma personalidade de IA criada, sorteia
// qual delas "manda" o lembrete dessa vez — assim não fica sempre a mesma
// personalidade (o que confundiria quem conversa com várias) nem depende de
// qual foi usada por último. Alunos com 0 ou 1 personalidade, ou cuja
// personalidade sorteada ainda não tem conversa registrada, caem no resumo
// da última conversa (fetchLastConversations) como antes.
async function fetchConversationsForReminder(supabaseUrl, serviceKey, userIds) {
  const personasByUser = await fetchPersonasByUser(supabaseUrl, serviceKey, userIds);

  const chosen = [];
  let usersNeedingFallback = [];
  for (const userId of userIds) {
    const personas = personasByUser.get(userId) || [];
    if (personas.length === 0) {
      usersNeedingFallback.push(userId);
    } else {
      const pick = personas[Math.floor(Math.random() * personas.length)];
      chosen.push({ user_id: userId, persona_id: pick.id, persona_name: pick.name, persona_emoji: pick.emoji });
    }
  }

  const historyMap = await fetchHistoryForPersonas(
    supabaseUrl, serviceKey,
    chosen.map(c => ({ user_id: c.user_id, persona_id: c.persona_id }))
  );

  const result = new Map();
  for (const c of chosen) {
    const messages = historyMap.get(`${c.user_id}::${c.persona_id}`);
    if (Array.isArray(messages) && messages.length > 0) {
      result.set(c.user_id, { persona_name: c.persona_name, persona_emoji: c.persona_emoji, messages });
    } else {
      usersNeedingFallback.push(c.user_id); // sorteada, mas nunca conversou ainda
    }
  }

  if (usersNeedingFallback.length > 0) {
    const fallbackMap = await fetchLastConversations(supabaseUrl, serviceKey, usersNeedingFallback);
    for (const [userId, conv] of fallbackMap) result.set(userId, conv);
  }

  return result;
}

// Detector bem simples (não é análise de idioma de verdade) pra pegar os
// casos mais óbvios de o modelo ter respondido em inglês em vez de
// português — frases inteiras em inglês raramente têm nenhuma das palavras
// comuns do português abaixo, e frequentemente começam com uma saudação
// genérica de abertura de conversa (sinal de que fugiu do prompt).
const PT_COMMON_WORDS = /\b(que|não|para|com|uma|seu|sua|você|voc[eê]|est[aá]|vamos|hoje|ainda|sobre|bora|ta[ ]|tá|pra|pro)\b/i;
const ENGLISH_GREETING_OPENER = /^(hi|hello|hey|good (morning|afternoon|evening))\b[,!.\s]/i;
function looksLikeEnglishGreeting(text) {
  if (!text) return false;
  if (ENGLISH_GREETING_OPENER.test(text.trim())) return true;
  // Texto "razoavelmente longo" sem nenhuma palavra comum de português é
  // suspeito de estar em outro idioma.
  return text.length > 15 && !PT_COMMON_WORDS.test(text);
}

// Pede ao Gemini um título + corpo curtos de notificação, baseados na última
// conversa do aluno com sua personalidade de IA. Retorna null em qualquer
// falha (o chamador cai no texto genérico nesse caso).
async function generatePersonalizedReminder(apiKey, conversation, fallbackTitle, fallbackBody) {
  const messages = Array.isArray(conversation.messages) ? conversation.messages.slice(-8) : [];
  if (messages.length === 0) return null;

  const personaName = (conversation.persona_name || 'sua personalidade de IA').trim();
  const transcript = messages
    .map(m => `${m.role === 'user' ? 'Aluno' : personaName}: ${String(m.text || '').slice(0, 300)}`)
    .join('\n');

  const prompt = `Você escreve notificações push curtas, em PORTUGUÊS DO BRASIL, para um app de prática de inglês. Aqui está o final da última conversa entre um aluno e sua personalidade de IA chamada "${personaName}" — essa conversa está em inglês, pois é uma prática de idioma, mas isso é só contexto:

"""
${transcript}
"""

Escreva um lembrete convidando o aluno a voltar e continuar essa conversa específica (mencione o assunto ou algo que ficou no ar, de forma natural). Responda APENAS um JSON válido, sem markdown, no formato exato:
{"title": "...", "body": "..."}

Regras (IMPORTANTES, sem exceção):
- "title" e "body" devem estar OS DOIS em português do Brasil — nunca em inglês, mesmo que a conversa citada acima esteja em inglês e mesmo citando algo que o aluno disse.
- Pode citar UMA palavra ou expressão em inglês entre aspas se for essencial pra lembrar o assunto (ex.: sobre "job interview"), mas o restante da frase é sempre em português.
- "title" tem no máximo 6 palavras, pode incluir 1 emoji.
- "body" tem no máximo 120 caracteres, tom leve e convidativo (nunca cobrando ou culpando o aluno).
- Não invente detalhes que não estão na conversa acima.
- Nunca comece com saudações genéricas em inglês como "Hi" ou "Hello, how are you" — vá direto ao ponto específico da conversa, em português.`;

  try {
    const geminiRes = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          maxOutputTokens: 100,
          // Nota: temperature/top_p/top_k não têm efeito nos modelos Gemini
          // 3.x (incluindo gemini-3.5-flash-lite) — o Google recomenda não
          // mexer nesses valores e deixar a variação a cargo do próprio
          // modelo. Por isso não são enviados aqui.
          thinkingConfig: { thinkingLevel: 'low' },
          responseMimeType: 'application/json'
        }
      })
    });
    if (!geminiRes.ok) {
      console.error('Gemini reminder error:', geminiRes.status, await geminiRes.text());
      return null;
    }
    const data = await geminiRes.json();
    const raw =
      data && data.candidates && data.candidates[0] &&
      data.candidates[0].content && data.candidates[0].content.parts &&
      data.candidates[0].content.parts.map(p => p.text || '').join('').trim();
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    const title = String(parsed.title || '').slice(0, 80).trim();
    const body = String(parsed.body || '').slice(0, 200).trim();
    if (!title || !body) return null;
    // Rede de segurança: se apesar da instrução o modelo devolveu algo que
    // claramente não é português (ex.: saudação genérica em inglês tipo "Hi,
    // how are you today?"), descarta e deixa o chamador cair no texto
    // genérico em português — melhor um lembrete genérico do que um em
    // inglês (ou mal traduzido) chegando pro aluno.
    if (looksLikeEnglishGreeting(title) || looksLikeEnglishGreeting(body)) {
      console.warn('generatePersonalizedReminder: descartado por parecer inglês:', { title, body });
      return null;
    }
    return { title, body };
  } catch (e) {
    console.error('generatePersonalizedReminder failed:', e);
    return null;
  }
}

module.exports = async function handler(req, res) {
  const method = req.method;
  if (method !== 'POST' && method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT || 'mailto:admin@bobcat.local';

  if (!publicKey || !privateKey) {
    res.status(500).json({
      error: 'VAPID_PUBLIC_KEY e VAPID_PRIVATE_KEY não configuradas na Vercel.',
      hint: 'Project Settings → Environment Variables. A pública deve ser igual a config.js (vapidPublicKey).'
    });
    return;
  }

  // GET é o formato que o Vercel Cron usa para chamar a rota (sem corpo JSON,
  // parâmetros na query string). POST continua sendo o formato usado pelo
  // painel do professor e pelo botão de teste no app.
  const body = method === 'POST' ? (req.body || {}) : (req.query || {});
  const isAdHocTest = method === 'POST' && !!(body.subscription && body.subscription.endpoint && body.subscription.keys);

  if (method === 'GET') {
    // Essa chamada manda lembrete pra turma inteira (ou pro userId da query),
    // então não pode ficar aberta pra qualquer um que descubra a URL. Aceita
    // o header que o próprio Vercel Cron manda automaticamente quando
    // CRON_SECRET está configurado no projeto, ou o x-push-secret de sempre
    // (útil se você preferir usar um cron externo em vez do Vercel Cron).
    const cronSecret = process.env.CRON_SECRET;
    const gotCron = (req.headers['authorization'] || '').replace(/^Bearer\s+/i, '');
    const pushSecret = process.env.PUSH_SEND_SECRET;
    const gotPush = req.headers['x-push-secret'] || '';
    const authorized = (cronSecret && gotCron === cronSecret) || (pushSecret && gotPush === pushSecret);
    if ((cronSecret || pushSecret) && !authorized) {
      res.status(401).json({ error: 'Não autorizado.', hint: 'Envie header x-push-secret igual a PUSH_SEND_SECRET.' });
      return;
    }
    // Diagnóstico rápido (protegido pelo secret): GET /api/push-send?diagnose=1
    if (String(body.diagnose || '') === '1') {
      const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
      const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || process.env.SERVICE_ROLE_KEY;
      res.status(200).json({
        ok: true,
        diagnose: {
          vapidPublic: !!publicKey,
          vapidPrivate: !!privateKey,
          vapidSubject: subject,
          supabaseUrl: !!supabaseUrl,
          serviceRole: !!serviceKey,
          pushSendSecret: !!pushSecret,
          cronSecret: !!cronSecret,
          gemini: !!process.env.GEMINI_API_KEY,
          note: 'serviceRole=false é a causa mais comum de lembrete automático não enviar.'
        }
      });
      return;
    }
  } else if (!isAdHocTest) {
    // POST "de verdade" (turma inteira ou aluno específico via Supabase):
    // protegido por PUSH_SEND_SECRET se estiver configurada.
    const requiredSecret = process.env.PUSH_SEND_SECRET;
    if (requiredSecret) {
      const got = req.headers['x-push-secret'] || '';
      if (got !== requiredSecret) {
        res.status(401).json({ error: 'Não autorizado.' });
        return;
      }
    }
  }
  // POST com "subscription" avulsa (o botão de teste do app, Shift+clique) não
  // exige segredo: só manda notificação pro próprio aparelho que já provou ter
  // essa subscription — não dá acesso à lista de alunos nem manda em massa.

  webpush.setVapidDetails(subject, publicKey, privateKey);

  try {
    const fallbackTitle = String(body.title || 'Bobcat Language School').slice(0, 80);
    const fallbackText = String(body.body || 'Hora de praticar inglês! 🐱').slice(0, 200);
    const url = String(body.url || '/index.html?screen=ai-chat').slice(0, 200);
    const tag = String(body.tag || 'bobcat-practice').slice(0, 60);
    const userId = body.userId ? String(body.userId).slice(0, 80) : null;
    // Personalização ligada por padrão; pode ser desligada explicitamente no
    // body (POST) ou com ?personalize=false na query (GET/cron).
    const wantsPersonalization = !(body.personalize === false || body.personalize === 'false');

    const genericPayload = buildPayload(fallbackTitle, fallbackText, url, tag);

    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    // Aceita nomes comuns; service_role é obrigatória para listar todas as subscriptions
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
      || process.env.SUPABASE_SERVICE_KEY
      || process.env.SERVICE_ROLE_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;
    const canPersonalize = wantsPersonalization && !!supabaseUrl && !!serviceKey && !!geminiKey;

    // Chamada automática do cron (GET, sem subscription/userId específico no
    // corpo): só manda pra quem está "no horário" configurado agora — cada
    // aluno pode ter horários próprios (reminder_times). Envios manuais
    // (POST do professor/painel, com ou sem userId) continuam mandando na
    // hora, sem filtrar por horário.
    const isScheduledDispatch = method === 'GET' && !isAdHocTest;
    const currentSlot = currentUtcSlot();

    // 1) Subscription avulsa (útil para teste). Se vier junto com userId e a
    // personalização estiver disponível, tenta personalizar; senão, genérico.
    if (isAdHocTest) {
      let payload = genericPayload;
      if (canPersonalize && userId) {
        const convMap = await fetchConversationsForReminder(supabaseUrl, serviceKey, [userId]);
        const conv = convMap.get(userId);
        if (conv) {
          const personalized = await generatePersonalizedReminder(geminiKey, conv, fallbackTitle, fallbackText);
          if (personalized) payload = buildPayload(personalized.title, personalized.body, url, tag);
        }
      }
      try {
        await webpush.sendNotification(body.subscription, payload);
        res.status(200).json({ ok: true, sent: 1, personalized: payload !== genericPayload });
      } catch (err) {
        console.error('Push failed:', err.statusCode, err.body);
        res.status(502).json({ error: 'Falha ao enviar push.', detail: String(err.message || err) });
      }
      return;
    }

    // 2) Buscar no Supabase
    if (!supabaseUrl || !serviceKey) {
      res.status(400).json({
        error: 'Sem subscription no body e sem SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY para buscar no banco.',
        hint: 'Na Vercel, adicione SUPABASE_SERVICE_ROLE_KEY (Supabase → Settings → API → service_role). NEXT_PUBLIC_SUPABASE_ANON_KEY não basta.'
      });
      return;
    }

    let queryUrl = `${supabaseUrl}/rest/v1/push_subscriptions?select=endpoint,p256dh,auth,user_id,reminder_times,last_reminder_sent_at`;
    if (userId) queryUrl += `&user_id=eq.${encodeURIComponent(userId)}`;

    const listRes = await fetch(queryUrl, {
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        Accept: 'application/json'
      }
    });
    if (!listRes.ok) {
      const t = await listRes.text();
      console.error('Supabase list error:', listRes.status, t);
      res.status(502).json({ error: 'Não foi possível listar subscriptions.' });
      return;
    }
    let rows = await listRes.json();
    if (!Array.isArray(rows)) rows = [];

    let dueRows = rows;
    let skipped = 0;
    if (isScheduledDispatch) {
      // ?force=1 ou force=all → manda para TODOS (teste do workflow / admin)
      const forceAll = String(body.force || '') === '1' || String(body.force || '').toLowerCase() === 'all';
      dueRows = forceAll ? rows : rows.filter((row) => isDueNow(row, currentSlot));
      skipped = rows.length - dueRows.length;
    }

    if (dueRows.length === 0) {
      res.status(200).json({
        ok: true, sent: 0, skipped,
        message: isScheduledDispatch ? 'Ninguém no horário agora.' : 'Nenhuma subscription encontrada.'
      });
      return;
    }

    // Busca as conversas usadas pra personalizar, de todos os alunos de uma vez.
    let conversationsByUser = new Map();
    if (canPersonalize) {
      const uniqueUserIds = [...new Set(dueRows.map(r => r.user_id).filter(Boolean))];
      conversationsByUser = await fetchConversationsForReminder(supabaseUrl, serviceKey, uniqueUserIds);
    }

    let sent = 0;
    let failed = 0;
    let personalized = 0;
    let personalizedCallsUsed = 0;
    const gone = []; // endpoints 410/404 → remover depois
    const sentEndpoints = []; // pra marcar last_reminder_sent_at depois
    const payloadCache = new Map(); // user_id -> payload já gerado (evita gerar 2x p/ aluno c/ 2 aparelhos)

    for (const row of dueRows) {
      const sub = {
        endpoint: row.endpoint,
        keys: { p256dh: row.p256dh, auth: row.auth }
      };

      let payload = genericPayload;
      if (canPersonalize && row.user_id) {
        if (payloadCache.has(row.user_id)) {
          payload = payloadCache.get(row.user_id);
        } else if (personalizedCallsUsed < MAX_PERSONALIZED_CALLS) {
          const conv = conversationsByUser.get(row.user_id);
          if (conv) {
            personalizedCallsUsed++;
            const result = await generatePersonalizedReminder(geminiKey, conv, fallbackTitle, fallbackText);
            if (result) {
              payload = buildPayload(result.title, result.body, url, tag);
              personalized++;
            }
          }
          payloadCache.set(row.user_id, payload);
        }
      }

      try {
        await webpush.sendNotification(sub, payload);
        sent++;
        sentEndpoints.push(row.endpoint);
      } catch (err) {
        failed++;
        console.error('Push to', row.endpoint.slice(0, 40), err.statusCode || err.message);
        if (err.statusCode === 404 || err.statusCode === 410) {
          gone.push(row.endpoint);
        }
      }
    }

    // Marca quando cada subscription recebeu o lembrete agendado, pra não
    // mandar de novo se o cron rodar de novo dentro da mesma janela.
    if (isScheduledDispatch && sentEndpoints.length > 0) {
      try {
        await fetch(
          `${supabaseUrl}/rest/v1/push_subscriptions?endpoint=in.(${sentEndpoints.map(e => encodeURIComponent(e)).join(',')})`,
          {
            method: 'PATCH',
            headers: {
              apikey: serviceKey,
              Authorization: `Bearer ${serviceKey}`,
              'Content-Type': 'application/json',
              Prefer: 'return=minimal'
            },
            body: JSON.stringify({ last_reminder_sent_at: new Date().toISOString() })
          }
        );
      } catch (e) {
        console.warn('Failed to update last_reminder_sent_at', e);
      }
    }

    // Limpa subscriptions mortas
    for (const endpoint of gone) {
      try {
        await fetch(
          `${supabaseUrl}/rest/v1/push_subscriptions?endpoint=eq.${encodeURIComponent(endpoint)}`,
          {
            method: 'DELETE',
            headers: {
              apikey: serviceKey,
              Authorization: `Bearer ${serviceKey}`
            }
          }
        );
      } catch (e) {
        console.warn('Failed to delete gone subscription', e);
      }
    }

    res.status(200).json({ ok: true, sent, failed, skipped, removed: gone.length, personalized });
  } catch (err) {
    console.error('Erro em /api/push-send:', err);
    res.status(500).json({ error: 'Erro interno ao enviar push.' });
  }
};
