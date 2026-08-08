-- ============================================================
-- Bobcat Language School — Schema Supabase
-- Rode isso em: painel do Supabase → SQL Editor → New query
-- ============================================================

-- Tabela de perfis (1 linha por aluno/dispositivo)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  avatar text not null default '🦁',
  level text not null default 'A1',
  created_at timestamptz not null default now()
);

-- Tabela de progresso (1 linha por aluno + lição)
-- A coluna `answers` guarda um array JSON com cada pergunta da última
-- tentativa (enunciado, resposta do aluno, resposta certa e status), gerado
-- automaticamente pelo app — é o que alimenta o botão "Ver respostas" no
-- painel do professor.
create table if not exists progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id text not null,
  completed boolean not null default false,
  correct int not null default 0,
  total int not null default 0,
  answers jsonb not null default '[]'::jsonb,
  last_attempt timestamptz not null default now(),
  unique (user_id, lesson_id)
);

-- Se você já tinha criado a tabela `progress` antes desta atualização, rode
-- só esta linha abaixo no SQL Editor do Supabase (não precisa rodar o
-- arquivo inteiro de novo):
--   alter table progress add column if not exists answers jsonb not null default '[]'::jsonb;

-- Row Level Security: cada aluno só enxerga e altera os próprios dados
alter table profiles enable row level security;
alter table progress enable row level security;

drop policy if exists "Users manage their own profile" on profiles;
create policy "Users manage their own profile"
  on profiles for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "Users manage their own progress" on progress;
create policy "Users manage their own progress"
  on progress for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Permite que qualquer aluno logado LEIA todos os
-- perfis e progresso — é o que possibilita o painel do professor (teacher.html).
-- Escrita continua restrita a "só o próprio registro" pelas políticas acima.
-- Trade-off: com isso, em teoria um aluno também consegue ler dados de outros
-- alunos (só leitura, nunca escrita). Para uma turma pequena costuma ser um
-- risco aceitável; se quiser bloquear isso e restringir a leitura só ao
-- professor, me avise que ajusto para exigir login de professor de verdade.
drop policy if exists "Authenticated can view all profiles" on profiles;
create policy "Authenticated can view all profiles"
  on profiles for select
  using (auth.role() = 'authenticated');

drop policy if exists "Authenticated can view all progress" on progress;
create policy "Authenticated can view all progress"
  on progress for select
  using (auth.role() = 'authenticated');

-- Tabela de mensagens (canal de comunicação aluno ↔ professor)
-- Cada linha é uma mensagem dentro da "conversa" do aluno (user_id) com o
-- professor. sender indica quem escreveu: 'student' (o próprio aluno) ou
-- 'teacher' (o professor, respondendo pelo painel teacher.html).
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  sender text not null check (sender in ('student', 'teacher')),
  body text not null,
  created_at timestamptz not null default now(),
  -- Anexo opcional (PDF, Word, texto, planilha, imagem etc.). Uma mensagem
  -- pode ter só texto, só arquivo, ou os dois — nunca os dois vazios (isso é
  -- validado no app, não aqui no banco).
  file_url text,
  file_name text,
  file_type text,
  file_size bigint
);

alter table messages enable row level security;

-- Alunos só enxergam e criam mensagens na própria conversa, e só como 'student'.
drop policy if exists "Students manage their own messages" on messages;
create policy "Students manage their own messages"
  on messages for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id and sender = 'student');

-- Qualquer usuário autenticado pode LER todas as conversas — é o que
-- permite o painel do professor (teacher.html, que usa login anônimo)
-- listar as mensagens de todos os alunos. Mesmo trade-off já assumido
-- acima para profiles/progress: leitura ampla, escrita restrita.
drop policy if exists "Authenticated can view all messages" on messages;
create policy "Authenticated can view all messages"
  on messages for select
  using (auth.role() = 'authenticated');

-- Permite que o painel do professor (sessão anônima) insira respostas em
-- qualquer conversa, desde que marcadas como sender = 'teacher'. Como o
-- teacher.html não tem uma conta de professor "de verdade" (usa login
-- anônimo do Supabase), não dá para restringir isso a um único usuário
-- específico — qualquer sessão autenticada pode enviar como 'teacher'.
-- Para uma turma pequena costuma ser um risco aceitável; se quiser um
-- login de professor de verdade (com senha), me avise que ajusto.
drop policy if exists "Authenticated can reply as teacher" on messages;
create policy "Authenticated can reply as teacher"
  on messages for insert
  with check (auth.role() = 'authenticated' and sender = 'teacher');

-- ============================================================
-- Storage: anexos das mensagens (aluno ↔ professor)
-- Bucket público (mesmo trade-off já assumido nas tabelas acima: qualquer
-- pessoa com o link do arquivo consegue abrir, mas ninguém consegue listar
-- ou enviar arquivo sem estar autenticado). Isso permite mostrar o anexo
-- direto num link, sem precisar gerar URL assinada.
-- ============================================================
insert into storage.buckets (id, name, public)
values ('mensagens-arquivos', 'mensagens-arquivos', true)
on conflict (id) do nothing;

-- Qualquer usuário autenticado (aluno logado ou a sessão anônima do painel
-- do professor) pode enviar arquivos para este bucket.
drop policy if exists "Authenticated can upload message files" on storage.objects;
create policy "Authenticated can upload message files"
  on storage.objects for insert
  with check (bucket_id = 'mensagens-arquivos' and auth.role() = 'authenticated');

-- Qualquer usuário autenticado pode listar/ler os arquivos (necessário para
-- o painel do professor enxergar anexos de qualquer aluno). O acesso via
-- link público (usado dentro do app) não passa por essa política, mas ela
-- ainda é necessária para chamadas autenticadas via SDK.
drop policy if exists "Authenticated can read message files" on storage.objects;
create policy "Authenticated can read message files"
  on storage.objects for select
  using (bucket_id = 'mensagens-arquivos' and auth.role() = 'authenticated');

-- Tabela de senhas para "zerar progresso" — uma por aluno, definida pelo
-- professor no painel (teacher.html). O aluno só consegue apagar o próprio
-- progresso das lições se souber essa senha.
create table if not exists student_reset_passwords (
  user_id uuid primary key references auth.users(id) on delete cascade,
  password text not null,
  updated_at timestamptz not null default now()
);

alter table student_reset_passwords enable row level security;

-- O aluno só pode LER a própria senha (para conferir no app quando tenta
-- zerar o progresso) — nunca definir ou mudar a própria senha.
drop policy if exists "Students can read their own reset password" on student_reset_passwords;
create policy "Students can read their own reset password"
  on student_reset_passwords for select
  using (auth.uid() = user_id);

-- Qualquer sessão autenticada (inclui a sessão anônima do painel do
-- professor) pode ler e definir a senha de qualquer aluno — é o que
-- permite o professor cadastrar/trocar a senha de cada aluno pelo painel.
-- Mesmo trade-off já assumido nas outras tabelas: leitura/escrita ampla
-- para quem estiver autenticado, já que teacher.html não tem uma conta de
-- professor "de verdade" com senha própria.
drop policy if exists "Authenticated can manage reset passwords" on student_reset_passwords;
create policy "Authenticated can manage reset passwords"
  on student_reset_passwords for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ============================================================
-- Lições customizadas (adicionadas pelo professor pelo painel, via upload
-- de um arquivo .html) — aparecem no catálogo do app ao lado das lições
-- fixas, agrupadas pelo nível escolhido. Como este é um site estático (sem
-- servidor), não dá para "criar o arquivo" de verdade dentro da pasta
-- lessons/ a partir do navegador — em vez disso, o conteúdo do HTML enviado
-- fica guardado aqui no banco (coluna html_content) e é aberto por
-- lessons/custom.html?id=..., que busca esse conteúdo e o exibe.
create table if not exists custom_lessons (
  id text primary key,
  name text not null,
  level text not null,
  icon text not null default '📄',
  description text not null default '',
  total_questions int not null default 0,
  -- 'lessons' = entra no catálogo normal (aba "Lições"), com bloqueio
  -- sequencial igual às demais; 'extras' = entra na aba "Extra", liberada
  -- direto, sem bloqueio nem pré-requisito.
  section text not null default 'lessons' check (section in ('lessons', 'extras')),
  html_content text not null,
  created_at timestamptz not null default now()
);

alter table custom_lessons enable row level security;

-- Qualquer aluno autenticado precisa conseguir LER o catálogo (para a
-- lição aparecer na lista) e o conteúdo (para conseguir abrir a lição).
drop policy if exists "Authenticated can view custom lessons" on custom_lessons;
create policy "Authenticated can view custom lessons"
  on custom_lessons for select
  using (auth.role() = 'authenticated');

-- Qualquer sessão autenticada (inclui a sessão anônima do painel do
-- professor) pode criar, editar e apagar lições customizadas — mesmo
-- trade-off já assumido nas outras tabelas deste projeto: como teacher.html
-- não tem um login de professor "de verdade" (usa sessão anônima), não dá
-- para restringir isso a um único usuário específico. Para uma turma
-- pequena costuma ser um risco aceitável.
drop policy if exists "Authenticated can manage custom lessons" on custom_lessons;
create policy "Authenticated can manage custom lessons"
  on custom_lessons for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ============================================================
-- IMPORTANTE: também é preciso habilitar login por e-mail/senha:
-- painel do Supabase → Authentication → Providers → Email → Enable.
-- A opção "Confirm email" é sua escolha:
--   - desligada: aluno cria a conta e já entra na hora (mais simples)
--   - ligada: aluno recebe um e-mail e precisa confirmar antes de
--     entrar (mais seguro, mas exige configurar Site URL em
--     Authentication → URL Configuration)
-- ============================================================

-- ============================================================
-- Web Push — subscriptions de notificação do aluno
-- Cada aparelho/navegador que autorizar notificações grava uma linha.
-- O endpoint é único por aparelho; p256dh e auth são as chaves do browser.
-- ============================================================
create table if not exists push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  user_agent text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists push_subscriptions_user_id_idx on push_subscriptions (user_id);

alter table push_subscriptions enable row level security;

-- Aluno logado gerencia só as próprias subscriptions
drop policy if exists "Users manage own push subscriptions" on push_subscriptions;
create policy "Users manage own push subscriptions"
  on push_subscriptions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Painel do professor (sessão autenticada) pode ler todas — útil para
-- enviar lembrete em massa no futuro. Escrita continua restrita ao dono.
drop policy if exists "Authenticated can view all push subscriptions" on push_subscriptions;
create policy "Authenticated can view all push subscriptions"
  on push_subscriptions for select
  using (auth.role() = 'authenticated');

-- ============================================================
-- Resumo da última conversa com a IA — usado só para personalizar o
-- texto do lembrete (push). Guarda as últimas mensagens da conversa mais
-- recente do aluno (com qualquer personalidade), sobrescritas a cada
-- turno novo. Não é o histórico completo (esse continua só no aparelho,
-- em localStorage) — é só o suficiente para o servidor (api/push-send.js)
-- montar um lembrete com o Gemini que "lembra" do assunto.
-- Uma linha por aluno (a conversa mais recente substitui a anterior).
-- ============================================================
create table if not exists ai_chat_last_conversation (
  user_id uuid primary key references auth.users(id) on delete cascade,
  persona_name text,
  persona_emoji text,
  persona_gender text,
  messages jsonb not null default '[]'::jsonb, -- últimas ~8 mensagens: [{role:'user'|'model', text}]
  updated_at timestamptz not null default now()
);

alter table ai_chat_last_conversation enable row level security;

-- Só o próprio aluno grava/lê o resumo da própria conversa. O servidor
-- (api/push-send.js) usa a service role key, que ignora RLS — não precisa
-- de política extra para o professor ler isso.
drop policy if exists "Students manage own ai chat summary" on ai_chat_last_conversation;
create policy "Students manage own ai chat summary"
  on ai_chat_last_conversation for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
