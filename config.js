// Cole aqui as chaves do seu projeto Supabase.
// Painel do Supabase → Project Settings → API.
// A "anon public key" é segura para expor no navegador — a segurança real
// vem das políticas de Row Level Security (RLS) definidas em schema.sql.

window.SUPABASE_CONFIG = {
  url: 'https://SEU-PROJETO.supabase.co',
  anonKey: 'SUA-CHAVE-ANON-PUBLICA'
};
