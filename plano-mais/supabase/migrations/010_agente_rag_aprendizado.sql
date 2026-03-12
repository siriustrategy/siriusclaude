-- ============================================================
-- Migration 010 — Agente IA: RAG + Aprendizado + Chat Memory
-- Suporte ao WF3 v2 (Sofia Agente IA com RAG, Memória e Loop de Aprendizado)
-- ============================================================

-- Habilitar extensão pgvector (necessária para embeddings)
create extension if not exists vector;

-- ============================================================
-- TABELA: n8n_chat_histories
-- Usada pelo node "Postgres Chat Memory" do n8n
-- Persiste o histórico das conversas entre sessões
-- ============================================================
create table if not exists n8n_chat_histories (
  id          serial primary key,
  session_id  varchar(255) not null,
  message     jsonb        not null,
  created_at  timestamptz  default now()
);

create index if not exists n8n_chat_histories_session_idx
  on n8n_chat_histories(session_id);

create index if not exists n8n_chat_histories_created_idx
  on n8n_chat_histories(created_at desc);

-- ============================================================
-- TABELA: documentos_rag
-- Base de conhecimento vetorial do Plano Mais
-- Alimentada com FAQ, coberturas, benefícios, scripts de objeção
-- Consultada pela Sofia via ferramenta "conhecimento_plano"
-- ============================================================
create table if not exists documentos_rag (
  id          bigserial    primary key,
  content     text         not null,
  metadata    jsonb        default '{}',
  embedding   vector(1536),           -- dimensão do text-embedding-3-small (OpenAI)
  created_at  timestamptz  default now()
);

-- Índice IVFFLAT para busca por similaridade (cosine)
-- Recomendado para tabelas com até ~1M de documentos
create index if not exists documentos_rag_embedding_idx
  on documentos_rag using ivfflat (embedding vector_cosine_ops)
  with (lists = 50);

-- Índice por categoria (metadata->>'categoria') para filtros opcionais
create index if not exists documentos_rag_categoria_idx
  on documentos_rag using gin (metadata);

-- ============================================================
-- FUNÇÃO: match_documentos_rag
-- Usada pelo Supabase Vector Store do n8n para busca semântica
-- Retorna os N documentos mais similares ao embedding da query
-- ============================================================
create or replace function match_documentos_rag(
  query_embedding  vector(1536),
  match_count      int     default 5,
  filter           jsonb   default '{}'
)
returns table (
  id          bigint,
  content     text,
  metadata    jsonb,
  similarity  float
)
language plpgsql
as $$
begin
  return query
  select
    d.id,
    d.content,
    d.metadata,
    1 - (d.embedding <=> query_embedding) as similarity
  from documentos_rag d
  where
    case
      when filter != '{}' then d.metadata @> filter
      else true
    end
  order by d.embedding <=> query_embedding
  limit match_count;
end;
$$;

-- ============================================================
-- TABELA: agente_aprendizado
-- Loop de aprendizado da Sofia
-- Registra cada interação com sinal de engajamento do cliente
-- Conversas com engajamento 'positivo' são usadas como
-- few-shot examples em conversas futuras da mesma fase
-- ============================================================
create table if not exists agente_aprendizado (
  id               uuid         default gen_random_uuid() primary key,
  conversa_id      uuid         references conversas(id) on delete set null,
  lead_id          uuid         references leads(id) on delete set null,
  fase_cobranca    text,
  mensagem_cliente text         not null,
  resposta_agente  text         not null,
  engajamento      text         not null
                   check (engajamento in ('positivo', 'neutro', 'negativo'))
                   default 'neutro',
  resultado        text
                   check (resultado in ('pendente', 'pago', 'abandonou', 'transferido'))
                   default 'pendente',
  promovido_rag    boolean      default false,
  created_at       timestamptz  default now()
);

-- Índice para busca de padrões de sucesso por fase (usado no WF3)
create index if not exists agente_aprendizado_fase_engajamento_idx
  on agente_aprendizado(fase_cobranca, engajamento, created_at desc);

-- Índice para atualização de resultado pelo WF4 (pagamento confirmado)
create index if not exists agente_aprendizado_conversa_idx
  on agente_aprendizado(conversa_id);

-- ============================================================
-- RLS — Row Level Security
-- n8n usa service_role key: acesso total
-- Dashboard usa anon/authenticated: apenas leitura de aprendizado
-- ============================================================
alter table n8n_chat_histories   enable row level security;
alter table documentos_rag       enable row level security;
alter table agente_aprendizado   enable row level security;

-- Service role: acesso total (n8n)
create policy "service_role_all_chat_histories"
  on n8n_chat_histories for all
  using (true);

create policy "service_role_all_documentos_rag"
  on documentos_rag for all
  using (true);

create policy "service_role_all_aprendizado"
  on agente_aprendizado for all
  using (true);

-- ============================================================
-- DADOS INICIAIS: documentos_rag
-- Inseridos SEM embedding — rodar o workflow de indexação após
-- ou usar o n8n Vector Store para inserir via interface
-- Estas são as categorias base para alimentar o RAG
-- ============================================================

-- IMPORTANTE: os embeddings são gerados via n8n (OpenAI text-embedding-3-small)
-- Para alimentar o RAG, use o workflow de indexação ou insira via n8n UI:
-- Workflow > Add Document to Vector Store > Supabase Vector Store

comment on table documentos_rag is
  'Base de conhecimento vetorial. Alimentar via n8n workflow de indexação com: FAQ, coberturas, rede credenciada, benefícios, scripts de objeção e scripts de conversas bem-sucedidas.';

comment on table agente_aprendizado is
  'Loop de aprendizado da Sofia. Conversas com engajamento=positivo são usadas como few-shot examples em interações futuras da mesma fase_cobranca.';

comment on table n8n_chat_histories is
  'Histórico de chat gerenciado automaticamente pelo node Postgres Chat Memory do n8n. Session ID = conversa_id do Supabase.';
