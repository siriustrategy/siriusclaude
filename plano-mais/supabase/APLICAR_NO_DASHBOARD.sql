-- =====================================================
-- PLANO MAIS — Migrations pendentes 006 + 007 + 008
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

-- =====================================================
-- MIGRATION 008: Trigger corrigido para nota_interna
-- Notas internas NÃO atualizam o preview de ultima_msg
-- =====================================================

CREATE OR REPLACE FUNCTION fn_update_conversa_ultima_msg()
RETURNS TRIGGER AS $$
BEGIN
  -- Nota interna: só incrementa contador, NÃO expõe no preview
  IF NEW.tipo = 'nota_interna' THEN
    UPDATE conversas SET
      total_msgs = total_msgs + 1,
      updated_at = NOW()
    WHERE id = NEW.conversa_id;
    RETURN NEW;
  END IF;

  -- Mensagem normal: atualiza preview completo
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

-- Backfill: preenche dados existentes com a última mensagem real de cada conversa
-- (exclui notas internas do preview)
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
    MAX(timestamp) OVER (PARTITION BY conversa_id) AS last_ts
  FROM mensagens
  WHERE tipo != 'nota_interna'
  ORDER BY conversa_id, timestamp DESC
) sub
WHERE c.id = sub.conversa_id;

-- =====================================================
-- STORAGE: Bucket público "mensagens"
-- Necessário para Z-API acessar áudios e imagens pela URL
-- =====================================================

-- Cria o bucket se ainda não existir
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'mensagens',
  'mensagens',
  true,   -- público: Z-API consegue baixar pelos arquivos pela URL
  52428800, -- 50 MB limite
  ARRAY['image/*', 'audio/*', 'video/*', 'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/plain']
)
ON CONFLICT (id) DO UPDATE SET public = true;

-- RLS: qualquer pessoa autenticada pode fazer upload
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
    AND policyname = 'Autenticados podem upload'
  ) THEN
    CREATE POLICY "Autenticados podem upload" ON storage.objects
      FOR INSERT TO authenticated
      WITH CHECK (bucket_id = 'mensagens');
  END IF;
END $$;

-- RLS: leitura pública (necessário para URLs públicas funcionarem)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
    AND policyname = 'Leitura pública mensagens'
  ) THEN
    CREATE POLICY "Leitura pública mensagens" ON storage.objects
      FOR SELECT TO public
      USING (bucket_id = 'mensagens');
  END IF;
END $$;

-- Confirma sucesso
SELECT
  'Migrations 006+007+008 + Storage aplicadas com sucesso!' AS resultado,
  COUNT(*) AS total_conversas
FROM conversas;

-- =====================================================
-- MIGRATION 009: Checkout melhorias + Notificações
-- =====================================================

-- TABELA: cobrancas_pendentes
-- Rastreia PIX/boleto pendentes para régua de lembretes:
--   • 15 min após geração (n8n verifica lembrete_15min_sent = false)
--   • 24 horas após geração
--   • 3 dias após geração
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
    SELECT 1 FROM pg_policies WHERE tablename = 'cobrancas_pendentes'
    AND policyname = 'Autenticados full access cobrancas_pendentes'
  ) THEN
    CREATE POLICY "Autenticados full access cobrancas_pendentes"
      ON cobrancas_pendentes FOR ALL TO authenticated USING (true) WITH CHECK (true);
  END IF;
END $$;

-- TABELA: notificacoes
-- Notificações in-app para dashboard do gestor.
-- Tipos: venda_robo | desconto_aprovacao | lead_urgente | nova_mensagem
CREATE TABLE IF NOT EXISTS notificacoes (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo       TEXT NOT NULL,
  titulo     TEXT NOT NULL,
  mensagem   TEXT NOT NULL,
  prioridade TEXT NOT NULL DEFAULT 'normal'
               CHECK (prioridade IN ('urgente', 'alta', 'normal')),
  lida       BOOLEAN NOT NULL DEFAULT false,
  meta       JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notificacoes_nao_lidas
  ON notificacoes(lida) WHERE lida = false;
CREATE INDEX IF NOT EXISTS idx_notificacoes_created
  ON notificacoes(created_at DESC);

ALTER TABLE notificacoes ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'notificacoes'
    AND policyname = 'Autenticados full access notificacoes'
  ) THEN
    CREATE POLICY "Autenticados full access notificacoes"
      ON notificacoes FOR ALL TO authenticated USING (true) WITH CHECK (true);
  END IF;
END $$;

-- Campos adicionais em checkout_tokens
ALTER TABLE checkout_tokens
  ADD COLUMN IF NOT EXISTS metodo_pagamento TEXT,
  ADD COLUMN IF NOT EXISTS parcelas         INTEGER DEFAULT 1;

SELECT 'Migration 009 aplicada com sucesso!' AS resultado;
