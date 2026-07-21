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
create table if not exists progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id text not null,
  completed boolean not null default false,
  correct int not null default 0,
  total int not null default 0,
  last_attempt timestamptz not null default now(),
  unique (user_id, lesson_id)
);

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
-- IMPORTANTE: também é preciso habilitar login por e-mail/senha:
-- painel do Supabase → Authentication → Providers → Email → Enable.
-- A opção "Confirm email" é sua escolha:
--   - desligada: aluno cria a conta e já entra na hora (mais simples)
--   - ligada: aluno recebe um e-mail e precisa confirmar antes de
--     entrar (mais seguro, mas exige configurar Site URL em
--     Authentication → URL Configuration)
-- ============================================================
