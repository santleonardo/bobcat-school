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
//
// Body JSON:
//   { title, body, url?, tag?, userId?, personalize? }
//   ou { title, body, subscription: { endpoint, keys } }  — envia só para essa
//
// Personalização (só funciona com Supabase + GEMINI_API_KEY configurados):
//   Para cada aluno com subscription, busca o resumo da última conversa com a
//   IA (tabela ai_chat_last_conversation, alimentada pelo app a cada turno de
//   chat) e pede pro Gemini gerar um título/corpo de notificação que "lembra"
//   do assunto. Se não houver conversa, ou o Gemini falhar, ou personalize
//   estiver desligado, cai no title/body genérico enviado no request.
//
// Pode ser chamada por um Vercel Cron, pelo painel do professor, ou manualmente.

const webpush = require('web-push');

const GEMINI_MODEL = 'gemini-3.5-flash-lite';
const GEMINI_URL =
  `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

// Limite de segurança: mesmo com Supabase + Gemini configurados, não deixa
// uma turma gigante gerar centenas de chamadas de IA num único envio.
// Alunos além do limite recebem o lembrete genérico (title/body do request).
const MAX_PERSONALIZED_CALLS = 60;

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

  const prompt = `Você escreve notificações push curtas para um app de prática de inglês. Aqui está o final da última conversa entre um aluno e sua personalidade de IA chamada "${personaName}":

"""
${transcript}
"""

Escreva um lembrete convidando o aluno a voltar e continuar essa conversa específica (mencione o assunto ou algo que ficou no ar, de forma natural). Responda APENAS um JSON válido, sem markdown, no formato exato:
{"title": "...", "body": "..."}

Regras:
- "title" tem no máximo 6 palavras, pode incluir 1 emoji.
- "body" tem no máximo 120 caracteres, em português, tom leve e convidativo (nunca cobrando ou culpando o aluno).
- Não invente detalhes que não estão na conversa acima.`;

  try {
    const geminiRes = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          maxOutputTokens: 100,
          temperature: 0.8,
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
    return { title, body };
  } catch (e) {
    console.error('generatePersonalizedReminder failed:', e);
    return null;
  }
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT || 'mailto:admin@bobcat.local';

  if (!publicKey || !privateKey) {
    res.status(500).json({
      error: 'VAPID_PUBLIC_KEY e VAPID_PRIVATE_KEY não configuradas na Vercel. Veja o README.'
    });
    return;
  }

  // Proteção opcional: se PUSH_SEND_SECRET estiver definida, exige o header.
  const requiredSecret = process.env.PUSH_SEND_SECRET;
  if (requiredSecret) {
    const got = req.headers['x-push-secret'] || '';
    if (got !== requiredSecret) {
      res.status(401).json({ error: 'Não autorizado.' });
      return;
    }
  }

  webpush.setVapidDetails(subject, publicKey, privateKey);

  try {
    const body = req.body || {};
    const fallbackTitle = String(body.title || 'Bobcat Language School').slice(0, 80);
    const fallbackText = String(body.body || 'Hora de praticar inglês! 🐱').slice(0, 200);
    const url = String(body.url || '/index.html?screen=ai-chat').slice(0, 200);
    const tag = String(body.tag || 'bobcat-practice').slice(0, 60);
    const userId = body.userId ? String(body.userId).slice(0, 80) : null;
    // Personalização ligada por padrão; pode ser desligada explicitamente no body.
    const wantsPersonalization = body.personalize !== false;

    const genericPayload = buildPayload(fallbackTitle, fallbackText, url, tag);

    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;
    const canPersonalize = wantsPersonalization && !!supabaseUrl && !!serviceKey && !!geminiKey;

    // 1) Subscription avulsa (útil para teste). Se vier junto com userId e a
    // personalização estiver disponível, tenta personalizar; senão, genérico.
    if (body.subscription && body.subscription.endpoint && body.subscription.keys) {
      let payload = genericPayload;
      if (canPersonalize && userId) {
        const convMap = await fetchLastConversations(supabaseUrl, serviceKey, [userId]);
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
        error: 'Sem subscription no body e sem SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY para buscar no banco.'
      });
      return;
    }

    let queryUrl = `${supabaseUrl}/rest/v1/push_subscriptions?select=endpoint,p256dh,auth,user_id`;
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
    const rows = await listRes.json();
    if (!Array.isArray(rows) || rows.length === 0) {
      res.status(200).json({ ok: true, sent: 0, message: 'Nenhuma subscription encontrada.' });
      return;
    }

    // Busca as últimas conversas de todos os alunos com subscription, de uma vez.
    let conversationsByUser = new Map();
    if (canPersonalize) {
      const uniqueUserIds = [...new Set(rows.map(r => r.user_id).filter(Boolean))];
      conversationsByUser = await fetchLastConversations(supabaseUrl, serviceKey, uniqueUserIds);
    }

    let sent = 0;
    let failed = 0;
    let personalized = 0;
    let personalizedCallsUsed = 0;
    const gone = []; // endpoints 410/404 → remover depois
    const payloadCache = new Map(); // user_id -> payload já gerado (evita gerar 2x p/ aluno c/ 2 aparelhos)

    for (const row of rows) {
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
      } catch (err) {
        failed++;
        console.error('Push to', row.endpoint.slice(0, 40), err.statusCode || err.message);
        if (err.statusCode === 404 || err.statusCode === 410) {
          gone.push(row.endpoint);
        }
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

    res.status(200).json({ ok: true, sent, failed, removed: gone.length, personalized });
  } catch (err) {
    console.error('Erro em /api/push-send:', err);
    res.status(500).json({ error: 'Erro interno ao enviar push.' });
  }
};
