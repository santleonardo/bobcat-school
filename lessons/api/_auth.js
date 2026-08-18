/**
 * Validação de sessão Supabase para rotas serverless.
 * Exige header: Authorization: Bearer <access_token do aluno/professor>
 */
async function requireSupabaseUser(req) {
  const authHeader = req.headers.authorization || '';
  const accessToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
  if (!accessToken) {
    return { ok: false, status: 401, error: 'Faça login para usar este recurso.' };
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  // Prefer service role for reliable user lookup; fall back to anon key.
  const apiKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !apiKey) {
    return {
      ok: false,
      status: 500,
      error: 'SUPABASE_URL / chave não configuradas no servidor.'
    };
  }

  try {
    const whoRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: {
        apikey: apiKey,
        Authorization: `Bearer ${accessToken}`
      }
    });
    if (!whoRes.ok) {
      return { ok: false, status: 401, error: 'Sessão inválida ou expirada. Entre de novo.' };
    }
    const who = await whoRes.json();
    if (!who || !who.id) {
      return { ok: false, status: 401, error: 'Não foi possível identificar o usuário.' };
    }
    // Reject pure anonymous sessions for AI endpoints (optional: allow if email present)
    const isAnonymous = !who.email && (who.is_anonymous === true || who.app_metadata?.provider === 'anonymous');
    if (isAnonymous) {
      return { ok: false, status: 401, error: 'Crie uma conta com e-mail para usar a IA.' };
    }
    return { ok: true, user: who, accessToken };
  } catch (err) {
    console.error('requireSupabaseUser:', err);
    return { ok: false, status: 500, error: 'Erro ao validar sessão.' };
  }
}

module.exports = { requireSupabaseUser };
