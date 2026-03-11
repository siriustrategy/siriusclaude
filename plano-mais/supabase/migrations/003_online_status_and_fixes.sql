-- =====================================================
-- Migration 003: Status Online + Nota Interna
-- =====================================================

-- Adiciona colunas de status online na tabela usuarios
ALTER TABLE usuarios
  ADD COLUMN IF NOT EXISTS status_online TEXT NOT NULL DEFAULT 'offline',
  ADD COLUMN IF NOT EXISTS ultimo_online TIMESTAMPTZ;

-- Adiciona nota_interna ao enum de tipos de mensagem
ALTER TYPE mensagem_tipo ADD VALUE IF NOT EXISTS 'nota_interna';

-- Adiciona status fechada ao enum de conversa (caso não exista)
-- (conversa_status já tem 'fechada' no schema original, mas garantindo)
-- ALTER TYPE conversa_status ADD VALUE IF NOT EXISTS 'fechada';

-- Index para busca por status online
CREATE INDEX IF NOT EXISTS idx_usuarios_status_online ON usuarios(status_online);
