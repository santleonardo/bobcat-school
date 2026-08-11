// /api/delete-account.js
// Exclui a conta do aluno por completo — direito de eliminação da LGPD
// (art. 18, VI). Remove o usuário do Supabase Auth; por causa dos
// "on delete cascade" definidos em schema.sql, isso já apaga em cascata:
// profile, progresso das lições, mensagens com o professor, personalidades
// de IA + histórico de conversas, notificações push e a senha de zerar
// progresso. Não sobra nada órfão no banco.
//
// Variáveis de ambiente na Vercel (as mesmas já usadas em api/push-send.js):
//   SUPABASE_URL
//   SUPABASE_SERVICE_ROLE_KEY
//
// Espera POST com header "Authorization: Bearer <access_token>" — o token
// de sessão do próprio aluno (Supabase Auth), não a service role. O
// endpoint usa esse token só para descobrir COM CERTEZA quem está pedindo
// a exclusão; nunca aceita um id vindo do corpo da requisição, senão
// qualquer pessoa que soubesse o id de outro aluno poderia apagar a conta
// dele.

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    res.status(500).json({
      error: 'SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY não configuradas na Vercel — veja o README.'
    });
    return;
  }

  const authHeader = req.headers.authorization || '';
  const accessToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!accessToken) {
    res.status(401).json({ error: 'Faltou o token de login (sessão expirada?). Faça login de novo e tente outra vez.' });
    return;
  }

  try {
    // 1) Descobre quem é o dono desse token de sessão.
    const whoRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${accessToken}`
      }
    });
    if (!whoRes.ok) {
      res.status(401).json({ error: 'Sessão inválida ou expirada. Faça login de novo e tente outra vez.' });
      return;
    }
    const who = await whoRes.json();
    const userId = who && who.id;
    if (!userId) {
      res.status(401).json({ error: 'Não foi possível identificar a conta a partir da sessão atual.' });
      return;
    }

    // 2) Apaga o usuário do Auth — o cascade no banco cuida do resto.
    const delRes = await fetch(`${supabaseUrl}/auth/v1/admin/users/${userId}`, {
      method: 'DELETE',
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`
      }
    });
    if (!delRes.ok) {
      const t = await delRes.text();
      console.error('delete-account: Supabase admin delete error:', delRes.status, t);
      res.status(502).json({ error: 'Não foi possível excluir a conta agora. Tente novamente em instantes.' });
      return;
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('delete-account error:', err);
    res.status(500).json({ error: 'Erro inesperado ao excluir a conta.' });
  }
};
