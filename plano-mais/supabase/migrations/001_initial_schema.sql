-- =====================================================
-- Plano Mais — Sistema de Cobrança e Inadimplência
-- Migration 001: Schema Inicial Completo
-- =====================================================

-- Habilitar extensão para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TIPOS CUSTOMIZADOS (ENUMS)
-- =====================================================

CREATE TYPE user_role AS ENUM ('gestor', 'atendente_senior', 'atendente_junior');
CREATE TYPE perfil_atendimento AS ENUM ('A', 'B', 'C');
CREATE TYPE lead_status AS ENUM ('ativo', 'inadimplente', 'cancelado', 'arquivado', 'pago');
CREATE TYPE fase_cobranca AS ENUM ('pre', 'mes1', 'mes2', 'mes3', 'mes4', 'mes5', 'pos');
CREATE TYPE risco_churn AS ENUM ('baixo', 'medio', 'alto');
CREATE TYPE conversa_tipo AS ENUM ('BOT', 'HUMANO', 'MISTO');
CREATE TYPE conversa_status AS ENUM ('aberta', 'fechada', 'pausada', 'transferida');
CREATE TYPE mensagem_remetente AS ENUM ('BOT', 'LEAD', 'ATENDENTE');
CREATE TYPE mensagem_tipo AS ENUM ('texto', 'imagem', 'audio', 'documento', 'template', 'botao');
CREATE TYPE mensagem_status_entrega AS ENUM ('enviado', 'entregue', 'lido', 'falhou');
CREATE TYPE pagamento_metodo AS ENUM ('pix', 'boleto', 'cartao', 'transferencia', 'dinheiro');
CREATE TYPE pagamento_status AS ENUM ('pendente', 'confirmado', 'cancelado', 'estornado');
CREATE TYPE campanha_status AS ENUM ('rascunho', 'agendada', 'em_execucao', 'pausada', 'concluida', 'cancelada');
CREATE TYPE prioridade_notificacao AS ENUM ('baixa', 'media', 'alta', 'urgente');
CREATE TYPE nota_tipo AS ENUM ('geral', 'negociacao', 'pagamento', 'cancelamento', 'retencao');
CREATE TYPE diagnostico_tipo AS ENUM ('churn_prediction', 'best_time', 'offer_recommendation', 'sentiment');

-- =====================================================
-- TABELA: usuarios
-- Perfis dos funcionários (complementa auth.users do Supabase)
-- =====================================================

CREATE TABLE usuarios (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome            TEXT NOT NULL,
  email           TEXT NOT NULL UNIQUE,
  telefone        TEXT,
  role            user_role NOT NULL DEFAULT 'atendente_junior',
  perfil_atendimento perfil_atendimento,
  ativo           BOOLEAN NOT NULL DEFAULT true,
  ultimo_acesso   TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_usuarios_role ON usuarios(role);
CREATE INDEX idx_usuarios_ativo ON usuarios(ativo);
CREATE INDEX idx_usuarios_email ON usuarios(email);

-- =====================================================
-- TABELA: leads
-- Clientes com plano (ativos, inadimplentes, etc.)
-- =====================================================

CREATE TABLE leads (
  id                         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome                       TEXT NOT NULL,
  telefone                   TEXT NOT NULL,
  email                      TEXT,
  cpf                        TEXT,
  plano                      TEXT NOT NULL,
  valor_mensalidade          NUMERIC(10,2) NOT NULL DEFAULT 0,
  data_vencimento            DATE NOT NULL,
  status                     lead_status NOT NULL DEFAULT 'ativo',
  dias_atraso                INTEGER NOT NULL DEFAULT 0,
  valor_em_aberto            NUMERIC(10,2) NOT NULL DEFAULT 0,
  fase_cobranca              fase_cobranca NOT NULL DEFAULT 'pre',

  -- Dados pessoais enriquecidos
  idade                      INTEGER,
  cidade                     TEXT,
  bairro                     TEXT,
  cep                        TEXT,
  profissao                  TEXT,

  -- Dependentes e pets
  tem_pet                    BOOLEAN NOT NULL DEFAULT false,
  num_pets                   INTEGER NOT NULL DEFAULT 0,
  tem_dependentes            BOOLEAN NOT NULL DEFAULT false,
  num_dependentes            INTEGER NOT NULL DEFAULT 0,
  idades_dependentes         INTEGER[] NOT NULL DEFAULT '{}',

  -- Scoring e risco
  score_reputacao            NUMERIC(5,2) NOT NULL DEFAULT 50,
  risco_churn                risco_churn NOT NULL DEFAULT 'baixo',

  -- Relacionamentos
  atendente_responsavel_id   UUID REFERENCES usuarios(id) ON DELETE SET NULL,

  -- Negociação
  desconto_ativo_percentual  NUMERIC(5,2) NOT NULL DEFAULT 0,
  desconto_ativo_validade    DATE,

  -- Preferências de contato
  horario_preferido_resposta TEXT,
  tags                       TEXT[] NOT NULL DEFAULT '{}',

  -- Rastreamento de interações
  ultima_interacao           TIMESTAMPTZ,
  ultima_mensagem_enviada    TEXT,
  data_entrada               TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  created_at                 TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                 TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_fase_cobranca ON leads(fase_cobranca);
CREATE INDEX idx_leads_atendente ON leads(atendente_responsavel_id);
CREATE INDEX idx_leads_risco_churn ON leads(risco_churn);
CREATE INDEX idx_leads_dias_atraso ON leads(dias_atraso);
CREATE INDEX idx_leads_telefone ON leads(telefone);
CREATE INDEX idx_leads_cpf ON leads(cpf);
CREATE INDEX idx_leads_data_vencimento ON leads(data_vencimento);
CREATE INDEX idx_leads_ultima_interacao ON leads(ultima_interacao);

-- =====================================================
-- TABELA: notas_crm
-- Anotações manuais sobre o lead
-- =====================================================

CREATE TABLE notas_crm (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id     UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  usuario_id  UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  conteudo    TEXT NOT NULL,
  tipo        nota_tipo NOT NULL DEFAULT 'geral',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notas_crm_lead_id ON notas_crm(lead_id);
CREATE INDEX idx_notas_crm_usuario_id ON notas_crm(usuario_id);
CREATE INDEX idx_notas_crm_tipo ON notas_crm(tipo);

-- =====================================================
-- TABELA: historico_status
-- Registro de todas as mudanças de status do lead
-- =====================================================

CREATE TABLE historico_status (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id          UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  status_anterior  lead_status NOT NULL,
  status_novo      lead_status NOT NULL,
  motivo           TEXT,
  usuario_id       UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_historico_status_lead_id ON historico_status(lead_id);
CREATE INDEX idx_historico_status_created_at ON historico_status(created_at);

-- =====================================================
-- TABELA: conversas
-- Registro de cada sessão de atendimento/cobrança
-- =====================================================

CREATE TABLE conversas (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id              UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  tipo                 conversa_tipo NOT NULL DEFAULT 'BOT',
  atendente_id         UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  status               conversa_status NOT NULL DEFAULT 'aberta',
  motivo_encerramento  TEXT,
  inicio               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  fim                  TIMESTAMPTZ,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_conversas_lead_id ON conversas(lead_id);
CREATE INDEX idx_conversas_atendente_id ON conversas(atendente_id);
CREATE INDEX idx_conversas_status ON conversas(status);
CREATE INDEX idx_conversas_inicio ON conversas(inicio);

-- =====================================================
-- TABELA: mensagens
-- Todas as mensagens trocadas em cada conversa
-- =====================================================

CREATE TABLE mensagens (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversa_id       UUID NOT NULL REFERENCES conversas(id) ON DELETE CASCADE,
  lead_id           UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  remetente         mensagem_remetente NOT NULL,
  conteudo          TEXT NOT NULL,
  tipo              mensagem_tipo NOT NULL DEFAULT 'texto',
  timestamp         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status_entrega    mensagem_status_entrega NOT NULL DEFAULT 'enviado',
  custo_estimado    NUMERIC(8,6) NOT NULL DEFAULT 0,
  metadata          JSONB DEFAULT '{}'
);

CREATE INDEX idx_mensagens_conversa_id ON mensagens(conversa_id);
CREATE INDEX idx_mensagens_lead_id ON mensagens(lead_id);
CREATE INDEX idx_mensagens_timestamp ON mensagens(timestamp);
CREATE INDEX idx_mensagens_remetente ON mensagens(remetente);

-- =====================================================
-- TABELA: descontos_concedidos
-- Histórico de descontos oferecidos e aceitos/recusados
-- =====================================================

CREATE TABLE descontos_concedidos (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id              UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  atendente_id         UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  percentual           NUMERIC(5,2) NOT NULL,
  valor_original       NUMERIC(10,2) NOT NULL,
  valor_com_desconto   NUMERIC(10,2) NOT NULL,
  motivo               TEXT,
  validade             DATE NOT NULL,
  aceito               BOOLEAN NOT NULL DEFAULT false,
  aceito_em            TIMESTAMPTZ,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_descontos_lead_id ON descontos_concedidos(lead_id);
CREATE INDEX idx_descontos_atendente_id ON descontos_concedidos(atendente_id);
CREATE INDEX idx_descontos_validade ON descontos_concedidos(validade);

-- =====================================================
-- TABELA: pagamentos
-- Registro de pagamentos recebidos
-- =====================================================

CREATE TABLE pagamentos (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id             UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  valor               NUMERIC(10,2) NOT NULL,
  valor_original      NUMERIC(10,2) NOT NULL,
  desconto_aplicado   NUMERIC(5,2) NOT NULL DEFAULT 0,
  metodo              pagamento_metodo NOT NULL,
  status              pagamento_status NOT NULL DEFAULT 'pendente',
  data_pagamento      TIMESTAMPTZ,
  referencia          TEXT,
  desconto_id         UUID REFERENCES descontos_concedidos(id) ON DELETE SET NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pagamentos_lead_id ON pagamentos(lead_id);
CREATE INDEX idx_pagamentos_status ON pagamentos(status);
CREATE INDEX idx_pagamentos_data_pagamento ON pagamentos(data_pagamento);
CREATE INDEX idx_pagamentos_metodo ON pagamentos(metodo);

-- =====================================================
-- TABELA: templates_mensagem
-- Templates de mensagens aprovados pela Meta/WhatsApp
-- =====================================================

CREATE TABLE templates_mensagem (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome             TEXT NOT NULL UNIQUE,
  categoria        TEXT NOT NULL,
  conteudo         TEXT NOT NULL,
  variaveis        TEXT[] NOT NULL DEFAULT '{}',
  fase_cobranca    fase_cobranca,
  ativo            BOOLEAN NOT NULL DEFAULT true,
  aprovado_meta    BOOLEAN NOT NULL DEFAULT false,
  criado_por       UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_templates_fase_cobranca ON templates_mensagem(fase_cobranca);
CREATE INDEX idx_templates_ativo ON templates_mensagem(ativo);

-- =====================================================
-- TABELA: campanhas
-- Campanhas de disparo em massa
-- =====================================================

CREATE TABLE campanhas (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome             TEXT NOT NULL,
  descricao        TEXT,
  template_id      UUID NOT NULL REFERENCES templates_mensagem(id) ON DELETE RESTRICT,
  segmento_leads   JSONB NOT NULL DEFAULT '{}',
  status           campanha_status NOT NULL DEFAULT 'rascunho',
  agendada_para    TIMESTAMPTZ,
  iniciada_em      TIMESTAMPTZ,
  concluida_em     TIMESTAMPTZ,
  total_leads      INTEGER NOT NULL DEFAULT 0,
  enviados         INTEGER NOT NULL DEFAULT 0,
  entregues        INTEGER NOT NULL DEFAULT 0,
  lidos            INTEGER NOT NULL DEFAULT 0,
  respondidos      INTEGER NOT NULL DEFAULT 0,
  convertidos      INTEGER NOT NULL DEFAULT 0,
  created_by       UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_campanhas_status ON campanhas(status);
CREATE INDEX idx_campanhas_created_by ON campanhas(created_by);
CREATE INDEX idx_campanhas_agendada_para ON campanhas(agendada_para);

-- =====================================================
-- TABELA: resultados_campanha
-- Resultado individual de cada lead em cada campanha
-- =====================================================

CREATE TABLE resultados_campanha (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campanha_id       UUID NOT NULL REFERENCES campanhas(id) ON DELETE CASCADE,
  lead_id           UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  mensagem_enviada  TEXT NOT NULL,
  enviado_em        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status            TEXT NOT NULL DEFAULT 'enviado',
  resposta_lead     TEXT,
  converteu         BOOLEAN NOT NULL DEFAULT false,
  valor_recuperado  NUMERIC(10,2) NOT NULL DEFAULT 0,
  UNIQUE(campanha_id, lead_id)
);

CREATE INDEX idx_resultados_campanha_campanha_id ON resultados_campanha(campanha_id);
CREATE INDEX idx_resultados_campanha_lead_id ON resultados_campanha(lead_id);
CREATE INDEX idx_resultados_campanha_converteu ON resultados_campanha(converteu);

-- =====================================================
-- TABELA: custos_operacao
-- Registro detalhado de todos os custos do sistema
-- =====================================================

CREATE TABLE custos_operacao (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  data             DATE NOT NULL DEFAULT CURRENT_DATE,
  tipo             TEXT NOT NULL,
  quantidade       INTEGER NOT NULL DEFAULT 1,
  custo_unitario   NUMERIC(10,6) NOT NULL,
  custo_total      NUMERIC(10,4) NOT NULL,
  referencia_id    UUID,
  referencia_tipo  TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_custos_data ON custos_operacao(data);
CREATE INDEX idx_custos_tipo ON custos_operacao(tipo);

-- =====================================================
-- TABELA: notificacoes
-- Notificações em tempo real para os usuários
-- =====================================================

CREATE TABLE notificacoes (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id    UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  tipo          TEXT NOT NULL,
  titulo        TEXT NOT NULL,
  mensagem      TEXT NOT NULL,
  lida          BOOLEAN NOT NULL DEFAULT false,
  lida_em       TIMESTAMPTZ,
  lead_id       UUID REFERENCES leads(id) ON DELETE SET NULL,
  conversa_id   UUID REFERENCES conversas(id) ON DELETE SET NULL,
  prioridade    prioridade_notificacao NOT NULL DEFAULT 'media',
  acao_url      TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notificacoes_usuario_id ON notificacoes(usuario_id);
CREATE INDEX idx_notificacoes_lida ON notificacoes(lida);
CREATE INDEX idx_notificacoes_prioridade ON notificacoes(prioridade);
CREATE INDEX idx_notificacoes_created_at ON notificacoes(created_at);

-- =====================================================
-- TABELA: checkout_tokens
-- Links de pagamento personalizados por lead
-- =====================================================

CREATE TABLE checkout_tokens (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id     UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  token       TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  usado       BOOLEAN NOT NULL DEFAULT false,
  expira_em   TIMESTAMPTZ NOT NULL,
  valor       NUMERIC(10,2) NOT NULL,
  desconto    NUMERIC(5,2) NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_checkout_tokens_lead_id ON checkout_tokens(lead_id);
CREATE INDEX idx_checkout_tokens_token ON checkout_tokens(token);
CREATE INDEX idx_checkout_tokens_expira_em ON checkout_tokens(expira_em);

-- =====================================================
-- TABELA: scores_leads
-- Histórico de pontuações calculadas por IA
-- =====================================================

CREATE TABLE scores_leads (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id            UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  score_pagamento    NUMERIC(5,2) NOT NULL DEFAULT 0,
  score_engajamento  NUMERIC(5,2) NOT NULL DEFAULT 0,
  score_retencao     NUMERIC(5,2) NOT NULL DEFAULT 0,
  score_final        NUMERIC(5,2) NOT NULL DEFAULT 0,
  calculado_em       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_scores_leads_lead_id ON scores_leads(lead_id);
CREATE INDEX idx_scores_leads_calculado_em ON scores_leads(calculado_em);

-- =====================================================
-- TABELA: diagnosticos
-- Diagnósticos e previsões gerados por IA
-- =====================================================

CREATE TABLE diagnosticos (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id     UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  tipo        diagnostico_tipo NOT NULL,
  resultado   JSONB NOT NULL DEFAULT '{}',
  confianca   NUMERIC(5,4) NOT NULL DEFAULT 0,
  gerado_em   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_diagnosticos_lead_id ON diagnosticos(lead_id);
CREATE INDEX idx_diagnosticos_tipo ON diagnosticos(tipo);
CREATE INDEX idx_diagnosticos_gerado_em ON diagnosticos(gerado_em);

-- =====================================================
-- TABELA: auditoria
-- Log completo de todas as ações no sistema
-- =====================================================

CREATE TABLE auditoria (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id        UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  acao              TEXT NOT NULL,
  tabela            TEXT NOT NULL,
  registro_id       UUID NOT NULL,
  dados_anteriores  JSONB,
  dados_novos       JSONB,
  ip                TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_auditoria_usuario_id ON auditoria(usuario_id);
CREATE INDEX idx_auditoria_tabela ON auditoria(tabela);
CREATE INDEX idx_auditoria_registro_id ON auditoria(registro_id);
CREATE INDEX idx_auditoria_created_at ON auditoria(created_at);

-- =====================================================
-- FUNÇÃO: atualizar updated_at automaticamente
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger em todas as tabelas com updated_at
CREATE TRIGGER trigger_usuarios_updated_at
  BEFORE UPDATE ON usuarios
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_pagamentos_updated_at
  BEFORE UPDATE ON pagamentos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_templates_updated_at
  BEFORE UPDATE ON templates_mensagem
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_campanhas_updated_at
  BEFORE UPDATE ON campanhas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- FUNÇÃO: Criar perfil de usuário automaticamente
-- Disparada quando um novo usuário é criado no auth.users
-- =====================================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO usuarios (id, nome, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nome', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'atendente_junior')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
