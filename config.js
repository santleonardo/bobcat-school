// Cole aqui as chaves do seu projeto Supabase.
// Painel do Supabase → Project Settings → API.
// A "anon public key" é segura para expor no navegador — a segurança real
// vem das políticas de Row Level Security (RLS) definidas em schema.sql.

window.SUPABASE_CONFIG = {
  url: 'https://zzezrrqewsiowblqnkyw.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6ZXpycnFld3Npb3dibHFua3l3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM5ODY0MjksImV4cCI6MjA5OTU2MjQyOX0.Nek0nV6595BroDReR2gQvinByV-bNiE2VNI_eIwKZMI'
};

// Senha exigida para o botão "Zerar progresso das lições" no perfil do aluno.
// Troque para a senha que quiser — só quem souber essa senha consegue zerar
// o progresso. Aviso: como este é um arquivo carregado no navegador, essa
// senha não é um segredo criptográfico de verdade (dá pra ver no código-fonte
// da página); serve para evitar que o próprio aluno zere sem querer/sem
// autorização, não para proteger contra alguém tecnicamente curioso.
window.APP_CONFIG = {
  resetProgressPassword: 'bobcat123',
  // Chave pública VAPID (Web Push). A privada fica só na Vercel (VAPID_PRIVATE_KEY).
  // Gere um par novo com: npx web-push generate-vapid-keys
  // Depois cole a pública aqui e a privada + pública nas env vars da Vercel.
  vapidPublicKey: 'BPzNxMpNXIKyzKG7x2HYgq2dYBvDudKLPNWW4zfjvTV6tpY6MxGtzRyyGHE4UGz9KGWO_RfGS7Dbqm206K5BOmU'
};

// ---------- Login com Google (OAuth) ----------
// 1. Google Cloud Console → APIs & Services → Credentials → OAuth 2.0 Client (Web)
// 2. Authorized redirect URIs:
//      https://SEU-PROJETO.supabase.co/auth/v1/callback
// 3. Supabase → Authentication → Providers → Google → ON
//    cole Client ID e Client Secret do Google
// 4. Supabase → Authentication → URL Configuration → Redirect URLs:
//      https://seu-dominio.vercel.app/
//      http://localhost:3000/   (dev)
// 5. Site URL = URL principal do app
