-- =============================================================
-- MIGRATION 009 — Checkout melhorias + Notificações
-- Data: 2026-03-11
-- =============================================================

-- ─────────────────────────────────────────────────────────────
-- TABELA: cobrancas_pendentes
-- Rastreia PIX e boletos gerados aguardando pagamento.
-- Usada pela régua de lembretes (n8n):
--   • 15 min após geração
--   • 24 horas após geração
--   • 3 dias após geração
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cobrancas_pendentes (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id               UUID REFERENCES leads(id) ON DELETE CASCADE,
  checkout_token_id     UUID REFERENCES checkout_tokens(id),
  metodo                TEXT NOT NULL CHECK (metodo IN ('pix', 'boleto')),
  valor                 NUMERIC(10,2) NOT NULL,
  telefone              TEXT,
  pix_codigo            TEXT,
  boleto_url            TEXT,
  boleto_codigo         TEXT,
  transaction_id        TEXT,
  status                TEXT NOT NULL DEFAULT 'pendente'
                          CHECK (status IN ('pendente', 'pago', 'cancelado', 'expirado')),
  -- Controle da régua de lembretes (n8n marca como true após envio)
  lembrete_15min_sent   BOOLEAN NOT NULL DEFAULT false,
  lembrete_24h_sent     BOOLEAN NOT NULL DEFAULT false,
  lembrete_3d_sent      BOOLEAN NOT NULL DEFAULT false,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  pago_em               TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_cobrancas_pendentes_lead
  ON cobrancas_pendentes(lead_id);

CREATE INDEX IF NOT EXISTS idx_cobrancas_pendentes_status
  ON cobrancas_pendentes(status) WHERE status = 'pendente';

CREATE INDEX IF NOT EXISTS idx_cobrancas_pendentes_created
  ON cobrancas_pendentes(created_at);

ALTER TABLE cobrancas_pendentes ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'cobrancas_pendentes'
    AND policyname = 'Autenticados full access cobrancas_pendentes'
  ) THEN
    CREATE POLICY "Autenticados full access cobrancas_pendentes"
      ON cobrancas_pendentes FOR ALL TO authenticated
      USING (true) WITH CHECK (true);
  END IF;
END $$;

-- ─────────────────────────────────────────────────────────────
-- TABELA: notificacoes
-- Notificações in-app para o dashboard.
-- Tipos:
--   venda_robo      → pagamento confirmado via robô/checkout
--   desconto_aprovacao → atendente solicitou desconto extra
--   lead_urgente    → lead quer cancelar ou em risco
--   nova_mensagem   → nova mensagem de lead não atendido
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notificacoes (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo       TEXT NOT NULL,
  titulo     TEXT NOT NULL,
  mensagem   TEXT NOT NULL,
  prioridade TEXT NOT NULL DEFAULT 'normal'
               CHECK (prioridade IN ('urgente', 'alta', 'normal')),
  lida       BOOLEAN NOT NULL DEFAULT false,
  meta       JSONB,  -- dados extras (lead_id, valor, metodo, etc.)
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notificacoes_nao_lidas
  ON notificacoes(lida) WHERE lida = false;

CREATE INDEX IF NOT EXISTS idx_notificacoes_created
  ON notificacoes(created_at DESC);

ALTER TABLE notificacoes ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'notificacoes'
    AND policyname = 'Autenticados full access notificacoes'
  ) THEN
    CREATE POLICY "Autenticados full access notificacoes"
      ON notificacoes FOR ALL TO authenticated
      USING (true) WITH CHECK (true);
  END IF;
END $$;

-- ─────────────────────────────────────────────────────────────
-- CAMPOS ADICIONAIS em checkout_tokens
-- Rastreia método de pagamento e parcelamento
-- ─────────────────────────────────────────────────────────────
ALTER TABLE checkout_tokens
  ADD COLUMN IF NOT EXISTS metodo_pagamento TEXT,
  ADD COLUMN IF NOT EXISTS parcelas         INTEGER DEFAULT 1;

-- Confirma sucesso
SELECT 'Migration 009 aplicada com sucesso!' AS resultado;
