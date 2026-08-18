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


-- ============================================================
-- Professores: quem pode ver a turma e agir no painel teacher.html
-- Depois de criar a conta do professor no Auth (e-mail + senha), rode:
--   insert into public.teachers (user_id)
--   values ('UUID-DO-USUARIO-PROFESSOR')
--   on conflict do nothing;
-- (UUID em Authentication → Users no painel do Supabase)
-- ============================================================
create table if not exists teachers (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table teachers enable row level security;

-- Professores autenticados podem ver a própria linha (confirmação no painel).
drop policy if exists "Teachers can read self" on teachers;
create policy "Teachers can read self"
  on teachers for select
  using (auth.uid() = user_id);

-- Função auxiliar (security definer) para políticas RLS.
create or replace function public.is_teacher()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.teachers t where t.user_id = auth.uid()
  );
$$;

revoke all on function public.is_teacher() from public;
grant execute on function public.is_teacher() to authenticated;

-- Só professores (tabela teachers) leem perfis/progresso de toda a turma.
drop policy if exists "Authenticated can view all profiles" on profiles;
drop policy if exists "Teachers can view all profiles" on profiles;
create policy "Teachers can view all profiles"
  on profiles for select
  using (public.is_teacher());

drop policy if exists "Authenticated can view all progress" on progress;
drop policy if exists "Teachers can view all progress" on progress;
create policy "Teachers can view all progress"
  on progress for select
  using (public.is_teacher());

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

-- Professores leem todas as conversas; alunos só as próprias (política acima).
drop policy if exists "Authenticated can view all messages" on messages;
drop policy if exists "Teachers can view all messages" on messages;
create policy "Teachers can view all messages"
  on messages for select
  using (public.is_teacher());

-- Só professores podem enviar como sender = 'teacher'.
drop policy if exists "Authenticated can reply as teacher" on messages;
drop policy if exists "Teachers can reply as teacher" on messages;
create policy "Teachers can reply as teacher"
  on messages for insert
  with check (public.is_teacher() and sender = 'teacher');

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

-- Só professores gerenciam senhas de reset dos alunos.
drop policy if exists "Authenticated can manage reset passwords" on student_reset_passwords;
drop policy if exists "Teachers manage reset passwords" on student_reset_passwords;
create policy "Teachers manage reset passwords"
  on student_reset_passwords for all
  using (public.is_teacher())
  with check (public.is_teacher());

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

-- Só professores criam/editam/apagam lições customizadas.
drop policy if exists "Authenticated can manage custom lessons" on custom_lessons;
drop policy if exists "Teachers manage custom lessons" on custom_lessons;
create policy "Teachers manage custom lessons"
  on custom_lessons for all
  using (public.is_teacher())
  with check (public.is_teacher());

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

-- Horários (em UTC, formato 'HH:MM', arredondados pro quarto de hora mais
-- próximo) em que o aluno quer receber lembrete de prática. Editável pelo
-- aluno na tela de Perfil/Praticar com IA. Vazio ([]) = usa os horários
-- padrão do sistema (ver DEFAULT_REMINDER_TIMES em api/push-send.js).
alter table push_subscriptions add column if not exists reminder_times jsonb not null default '[]'::jsonb;

-- Evita mandar o mesmo lembrete duas vezes no mesmo horário (ex.: o cron
-- rodar de novo por retry). Atualizado pelo servidor a cada envio.
alter table push_subscriptions add column if not exists last_reminder_sent_at timestamptz;

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
drop policy if exists "Teachers can view all push subscriptions" on push_subscriptions;
-- Push é lido pelo servidor com service role; professores não precisam listar endpoints.


-- ============================================================
-- Personalidades de IA criadas pelo aluno e histórico completo das
-- conversas. Antes ficavam só no localStorage (por aparelho); agora, com
-- Supabase configurado, sincronizam entre qualquer dispositivo logado com
-- a mesma conta.
-- ============================================================
create table if not exists ai_chat_personas (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  personality text not null default '',
  emoji text not null default '🤖',
  gender text not null default 'female' check (gender in ('male', 'female')),
  created_at timestamptz not null default now()
);

create index if not exists ai_chat_personas_user_id_idx on ai_chat_personas (user_id);

alter table ai_chat_personas enable row level security;

drop policy if exists "Students manage own ai chat personas" on ai_chat_personas;
create policy "Students manage own ai chat personas"
  on ai_chat_personas for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Histórico completo de cada conversa (1 linha por personalidade). Guarda
-- todas as mensagens trocadas, diferente de ai_chat_last_conversation
-- (mais abaixo), que guarda só as últimas ~8 mensagens só para o lembrete
-- de push.
create table if not exists ai_chat_history (
  user_id uuid not null references auth.users(id) on delete cascade,
  persona_id text not null references ai_chat_personas(id) on delete cascade,
  messages jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (user_id, persona_id)
);

alter table ai_chat_history enable row level security;

drop policy if exists "Students manage own ai chat history" on ai_chat_history;
create policy "Students manage own ai chat history"
  on ai_chat_history for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================================
-- Resumo da última conversa com a IA — usado só para personalizar o
-- texto do lembrete (push). Guarda as últimas mensagens da conversa mais
-- recente do aluno (com qualquer personalidade), sobrescritas a cada
-- turno novo. Não é o histórico completo (esse fica em ai_chat_history,
-- acima) — é só o suficiente para o servidor (api/push-send.js)
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
