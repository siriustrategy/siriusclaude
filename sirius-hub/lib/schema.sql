-- ============================================================
-- SIRIUS HUB — Schema Supabase
-- Execute este SQL no Supabase > SQL Editor
-- ============================================================

-- PROJETOS
create table if not exists projetos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  nome text not null,
  empresa text not null default '',
  descricao text default '',
  status text not null default 'Planejamento',
  score integer default 0 check (score >= 0 and score <= 100),
  horas_investidas numeric default 0,
  data_inicio date,
  tags text[] default '{}',
  link_externo text default '',
  created_at timestamptz default now()
);

-- ESTUDOS
create table if not exists estudos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  titulo text not null,
  plataforma text not null default '',
  link text default '',
  carga_horaria numeric default 0,
  progresso integer default 0 check (progresso >= 0 and progresso <= 100),
  status text not null default 'A fazer',
  categoria text not null default 'IA',
  created_at timestamptz default now()
);

-- CERTIFICADOS
create table if not exists certificados (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  titulo text not null,
  instituicao text not null default '',
  data_conclusao date,
  carga_horaria numeric default 0,
  categoria text not null default 'IA',
  tipo text not null default 'importado',
  estudo_id uuid references estudos(id),
  created_at timestamptz default now()
);

-- REUNIOES
create table if not exists reunioes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  titulo text not null,
  projeto_id uuid references projetos(id),
  empresa text not null default '',
  data date not null,
  horario text default '',
  participantes text[] default '{}',
  pauta text default '',
  notas text default '',
  google_event_id text default '',
  created_at timestamptz default now()
);

-- ACTION ITEMS (tarefas de reunião)
create table if not exists action_items (
  id uuid primary key default gen_random_uuid(),
  reuniao_id uuid references reunioes(id) on delete cascade not null,
  descricao text not null,
  concluido boolean default false,
  created_at timestamptz default now()
);

-- IDEIAS
create table if not exists ideias (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  titulo text not null,
  descricao text default '',
  categoria text not null default 'Produto',
  prioridade text not null default 'Média',
  status text not null default 'Rascunho',
  created_at timestamptz default now()
);

-- LIVROS (Second Brain - Biblioteca)
create table if not exists livros (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  titulo text not null,
  autor text not null default '',
  categoria text not null default 'Desenvolvimento Pessoal',
  subcategoria text default '',
  status text not null default 'Quero ler',
  progresso integer default 0,
  insights text default '',
  frases_marcantes text[] default '{}',
  cover_color text default '#3B5BDB',
  created_at timestamptz default now()
);

-- NOTAS DO SECOND BRAIN
create table if not exists notas_brain (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  titulo text not null,
  conteudo text not null default '',
  categoria text not null default 'Geral',
  tags text[] default '{}',
  created_at timestamptz default now()
);

-- USER INTEGRATIONS (tokens OAuth e configurações)
create table if not exists user_integrations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  google_refresh_token text default '',
  google_connected boolean default false,
  telegram_connected boolean default false,
  clickup_connected boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table projetos enable row level security;
alter table estudos enable row level security;
alter table certificados enable row level security;
alter table reunioes enable row level security;
alter table action_items enable row level security;
alter table ideias enable row level security;
alter table livros enable row level security;
alter table notas_brain enable row level security;

-- Policies: cada usuário acessa apenas seus próprios dados
create policy "owner_projetos" on projetos for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "owner_estudos" on estudos for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "owner_certificados" on certificados for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "owner_reunioes" on reunioes for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "owner_action_items" on action_items for all
  using (reuniao_id in (select id from reunioes where user_id = auth.uid()))
  with check (reuniao_id in (select id from reunioes where user_id = auth.uid()));
create policy "owner_ideias" on ideias for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "owner_livros" on livros for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "owner_notas_brain" on notas_brain for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
alter table user_integrations enable row level security;
create policy "owner_integrations" on user_integrations for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
