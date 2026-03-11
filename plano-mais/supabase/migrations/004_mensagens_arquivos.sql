-- =====================================================
-- Migration 004: Suporte a arquivos em mensagens
-- =====================================================

-- Colunas para armazenar URL e nome do arquivo enviado
ALTER TABLE mensagens
  ADD COLUMN IF NOT EXISTS arquivo_url  TEXT,
  ADD COLUMN IF NOT EXISTS arquivo_nome TEXT;

-- Index para busca por conversas com arquivos
CREATE INDEX IF NOT EXISTS idx_mensagens_arquivo ON mensagens(conversa_id) WHERE arquivo_url IS NOT NULL;
