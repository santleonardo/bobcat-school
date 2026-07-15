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
  created_at timestamptz not null default now(),
  -- Resultado do Teste de Nivelamento (feito uma única vez no cadastro):
  level_test_score int,            -- qtde de acertos (de 46)
  level_test_total int,            -- total de questões (46)
  level_test_date timestamptz,     -- quando o teste foi feito
  level_test_answers jsonb         -- respostas do aluno por questão (índice da opção escolhida, ou null)
);

-- Garante as colunas do teste de nivelamento mesmo em projetos que já
-- tinham a tabela profiles criada antes dessa atualização.
do $$
begin
  if not exists (select 1 from information_schema.columns
                 where table_name = 'profiles' and column_name = 'level_test_score') then
    alter table profiles add column level_test_score int;
  end if;
  if not exists (select 1 from information_schema.columns
                 where table_name = 'profiles' and column_name = 'level_test_total') then
    alter table profiles add column level_test_total int;
  end if;
  if not exists (select 1 from information_schema.columns
                 where table_name = 'profiles' and column_name = 'level_test_date') then
    alter table profiles add column level_test_date timestamptz;
  end if;
  if not exists (select 1 from information_schema.columns
                 where table_name = 'profiles' and column_name = 'level_test_answers') then
    alter table profiles add column level_test_answers jsonb;
  end if;
end$$;

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
-- A opção "Confirm email" é sua escolha:
--   - desligada: aluno cria a conta e já entra na hora (mais simples)
--   - ligada: aluno recebe um e-mail e precisa confirmar antes de
--     entrar (mais seguro, mas exige configurar Site URL em
--     Authentication → URL Configuration)
-- ============================================================
