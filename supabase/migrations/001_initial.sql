-- Habilita pgvector
create extension if not exists vector;

-- Cliente: registro central
create table clientes (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  status text not null default 'aguardando', -- aguardando | processando | concluido | erro
  criado_em timestamptz default now(),
  perfil_negocio jsonb,
  dna jsonb,
  scores jsonb,
  gargalo jsonb,
  meta jsonb
);

-- Fontes brutas (transcrições, arquivos)
create table fontes (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid references clientes(id) on delete cascade,
  tipo text not null, -- 'transcricao' | 'site' | 'csv_vendas' | 'criativo' | 'outro'
  conteudo text,
  arquivo_url text,
  criado_em timestamptz default now()
);

-- Ativos de marca (cofre)
create table ativos (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid references clientes(id) on delete cascade,
  tipo text not null, -- 'logo' | 'manual_marca' | 'criativo' | 'catalogo'
  arquivo_url text not null,
  criado_em timestamptz default now()
);

-- Playbook gerado pelos agentes
create table playbooks (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid references clientes(id) on delete cascade,
  diagnostico_executivo text,
  prioridades jsonb,
  hipoteses jsonb,
  roadmap_90d jsonb,
  criado_em timestamptz default now()
);

-- Memória viva (Fase 2 — tabela criada agora, populada depois)
create table memoria (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid references clientes(id) on delete cascade,
  tipo text, -- 'reuniao' | 'campanha' | 'resultado' | 'aprendizado' | 'teste'
  conteudo text,
  embedding vector(1536),
  criado_em timestamptz default now()
);

-- Índice para busca semântica futura
create index on memoria using ivfflat (embedding vector_cosine_ops);
