-- =====================================================
-- Migration 008: Trigger — Não atualizar preview de
--   ultima_msg para notas internas (são internas!)
-- =====================================================

CREATE OR REPLACE FUNCTION fn_update_conversa_ultima_msg()
RETURNS TRIGGER AS $$
BEGIN
  -- Nota interna: só incrementa contador, não expõe no preview
  IF NEW.tipo = 'nota_interna' THEN
    UPDATE conversas SET
      total_msgs = total_msgs + 1,
      updated_at = NOW()
    WHERE id = NEW.conversa_id;
    RETURN NEW;
  END IF;

  -- Mensagem normal: atualiza preview completo
  UPDATE conversas SET
    ultima_msg_conteudo  = NEW.conteudo,
    ultima_msg_remetente = NEW.remetente,
    total_msgs           = total_msgs + 1,
    updated_at           = NOW()
  WHERE id = NEW.conversa_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Confirma
SELECT 'Migration 008 aplicada — trigger nota_interna corrigido' AS resultado;
