-- =====================================================
-- Migration 007: Denormalizar última mensagem em conversas
-- Performance: evita carregar TODAS as mensagens só para exibir preview
-- =====================================================

-- Adiciona colunas desnormalizadas para preview rápido
ALTER TABLE conversas
  ADD COLUMN IF NOT EXISTS ultima_msg_conteudo    TEXT,
  ADD COLUMN IF NOT EXISTS ultima_msg_remetente   mensagem_remetente,
  ADD COLUMN IF NOT EXISTS total_msgs             INTEGER NOT NULL DEFAULT 0;

-- Índice para ordenação por última atividade
CREATE INDEX IF NOT EXISTS idx_conversas_ultima_atividade ON conversas(updated_at DESC);

-- =====================================================
-- TRIGGER: atualiza ultima_msg e total_msgs ao inserir mensagem
-- =====================================================

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

CREATE TRIGGER trigger_mensagem_atualiza_conversa
  AFTER INSERT ON mensagens
  FOR EACH ROW EXECUTE FUNCTION fn_update_conversa_ultima_msg();

-- =====================================================
-- Backfill: preenche dados existentes
-- =====================================================
UPDATE conversas c SET
  ultima_msg_conteudo  = sub.conteudo,
  ultima_msg_remetente = sub.remetente,
  total_msgs           = sub.total
FROM (
  SELECT
    conversa_id,
    LAST_VALUE(conteudo)   OVER w AS conteudo,
    LAST_VALUE(remetente)  OVER w AS remetente,
    COUNT(*)               OVER (PARTITION BY conversa_id) AS total
  FROM mensagens
  WINDOW w AS (
    PARTITION BY conversa_id
    ORDER BY timestamp
    ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
  )
) sub
WHERE c.id = sub.conversa_id;
