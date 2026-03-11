-- =====================================================
-- PLANO MAIS — Migrations pendentes 006 + 007
-- Colar este SQL no Supabase Dashboard > SQL Editor
-- =====================================================

-- MIGRATION 006: updated_at + prioridade em conversas
-- (necessário para o n8n atualizar o timestamp corretamente)

ALTER TABLE conversas
  ADD COLUMN IF NOT EXISTS updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW();

ALTER TABLE conversas
  ADD COLUMN IF NOT EXISTS prioridade  BOOLEAN NOT NULL DEFAULT false;

-- Trigger para updated_at automático nas conversas
DROP TRIGGER IF EXISTS trigger_conversas_updated_at ON conversas;
CREATE TRIGGER trigger_conversas_updated_at
  BEFORE UPDATE ON conversas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_conversas_updated_at  ON conversas(updated_at);
CREATE INDEX IF NOT EXISTS idx_conversas_prioridade  ON conversas(prioridade) WHERE prioridade = true;

-- =====================================================
-- MIGRATION 007: Desnormalizar última mensagem
-- (performance: evita carregar todas as mensagens para preview)
-- =====================================================

ALTER TABLE conversas
  ADD COLUMN IF NOT EXISTS ultima_msg_conteudo   TEXT,
  ADD COLUMN IF NOT EXISTS ultima_msg_remetente  mensagem_remetente,
  ADD COLUMN IF NOT EXISTS total_msgs            INTEGER NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_conversas_ultima_atividade ON conversas(updated_at DESC);

-- Função que atualiza a última mensagem na conversa ao inserir nova mensagem
CREATE OR REPLACE FUNCTION fn_update_conversa_ultima_msg()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversas SET
    ultima_msg_conteudo   = NEW.conteudo,
    ultima_msg_remetente  = NEW.remetente,
    total_msgs            = total_msgs + 1,
    updated_at            = NOW()
  WHERE id = NEW.conversa_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger que dispara ao inserir mensagem
DROP TRIGGER IF EXISTS trigger_mensagem_atualiza_conversa ON mensagens;
CREATE TRIGGER trigger_mensagem_atualiza_conversa
  AFTER INSERT ON mensagens
  FOR EACH ROW EXECUTE FUNCTION fn_update_conversa_ultima_msg();

-- Backfill: preenche dados existentes com a última mensagem de cada conversa
UPDATE conversas c SET
  ultima_msg_conteudo   = sub.conteudo,
  ultima_msg_remetente  = sub.remetente::mensagem_remetente,
  total_msgs            = sub.total_count,
  updated_at            = GREATEST(c.created_at, sub.last_ts)
FROM (
  SELECT DISTINCT ON (conversa_id)
    conversa_id,
    conteudo,
    remetente,
    COUNT(*) OVER (PARTITION BY conversa_id) AS total_count,
    MAX(timestamp)      OVER (PARTITION BY conversa_id) AS last_ts
  FROM mensagens
  ORDER BY conversa_id, timestamp DESC
) sub
WHERE c.id = sub.conversa_id;

-- Confirma sucesso
SELECT
  'Migrations aplicadas com sucesso!' AS resultado,
  COUNT(*) AS total_conversas
FROM conversas;
