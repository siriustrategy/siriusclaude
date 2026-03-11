-- =====================================================
-- Migration 006: Conversas — prioridade + updated_at
-- =====================================================

-- Adiciona updated_at (necessário para o n8n atualizar o timestamp)
ALTER TABLE conversas
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- Adiciona prioridade (usado pelo chat para marcar urgência)
ALTER TABLE conversas
  ADD COLUMN IF NOT EXISTS prioridade BOOLEAN NOT NULL DEFAULT false;

-- Trigger para atualizar updated_at automaticamente
CREATE TRIGGER trigger_conversas_updated_at
  BEFORE UPDATE ON conversas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_conversas_updated_at ON conversas(updated_at);
CREATE INDEX IF NOT EXISTS idx_conversas_prioridade ON conversas(prioridade) WHERE prioridade = true;
