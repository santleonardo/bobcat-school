// /api/push-send.js
// Envia notificações Web Push para um ou mais alunos.
//
// Variáveis de ambiente na Vercel:
//   VAPID_PUBLIC_KEY   — mesma chave pública exposta em config.js
//   VAPID_PRIVATE_KEY  — chave privada (NUNCA no navegador)
//   VAPID_SUBJECT      — mailto:seu@email.com (contato do dono do app)
//   SUPABASE_URL       — (opcional) para buscar subscriptions no banco
//   SUPABASE_SERVICE_ROLE_KEY — (opcional) para listar todas as subscriptions
//   PUSH_SEND_SECRET   — (opcional) se definida, exige header x-push-secret
//
// Body JSON:
//   { title, body, url?, tag?, userId? }
//   ou { title, body, subscription: { endpoint, keys } }  — envia só para essa
//
// Pode ser chamada por um Vercel Cron, pelo painel do professor, ou manualmente.

const webpush = require('web-push');

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
    const title = String(body.title || 'Bobcat Language School').slice(0, 80);
    const text = String(body.body || 'Hora de praticar inglês! 🐱').slice(0, 200);
    const url = String(body.url || '/index.html?screen=ai-chat').slice(0, 200);
    const tag = String(body.tag || 'bobcat-practice').slice(0, 60);
    const userId = body.userId ? String(body.userId).slice(0, 80) : null;

    const payload = JSON.stringify({ title, body: text, url, tag });

    // 1) Subscription avulsa (útil para teste)
    if (body.subscription && body.subscription.endpoint && body.subscription.keys) {
      try {
        await webpush.sendNotification(body.subscription, payload);
        res.status(200).json({ ok: true, sent: 1 });
      } catch (err) {
        console.error('Push failed:', err.statusCode, err.body);
        res.status(502).json({ error: 'Falha ao enviar push.', detail: String(err.message || err) });
      }
      return;
    }

    // 2) Buscar no Supabase
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
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

    let sent = 0;
    let failed = 0;
    const gone = []; // endpoints 410/404 → remover depois

    for (const row of rows) {
      const sub = {
        endpoint: row.endpoint,
        keys: { p256dh: row.p256dh, auth: row.auth }
      };
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

    res.status(200).json({ ok: true, sent, failed, removed: gone.length });
  } catch (err) {
    console.error('Erro em /api/push-send:', err);
    res.status(500).json({ error: 'Erro interno ao enviar push.' });
  }
};
