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

-- ============================================================
-- IMPORTANTE: também é preciso habilitar login por e-mail/senha:
-- painel do Supabase → Authentication → Providers → Email → Enable.
-- Em "Confirm email", DEIXE DESLIGADO — o app usa um usuário+senha
-- simples (não um e-mail de verdade), então a confirmação por
-- e-mail nunca chegaria a lugar nenhum.
-- ============================================================
