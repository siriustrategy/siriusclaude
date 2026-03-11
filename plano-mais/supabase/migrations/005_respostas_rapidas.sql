-- =====================================================
-- Migration 005: Respostas Rápidas gerenciáveis
-- =====================================================

CREATE TABLE respostas_rapidas (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titulo     TEXT NOT NULL,
  texto      TEXT NOT NULL,
  ativo      BOOLEAN NOT NULL DEFAULT true,
  ordem      INTEGER NOT NULL DEFAULT 0,
  created_by UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_respostas_rapidas_ativo ON respostas_rapidas(ativo);
CREATE INDEX idx_respostas_rapidas_ordem ON respostas_rapidas(ordem);

-- Respostas padrão iniciais
INSERT INTO respostas_rapidas (titulo, texto, ordem) VALUES
  ('Saudação inicial',      'Olá! Aqui é [seu nome] da Plano Mais Assistencial. Como posso ajudar você hoje?', 1),
  ('Um momento',            'Só um instante, vou verificar isso para você.', 2),
  ('Oferta de parcelamento','Podemos parcelar em até 3x sem juros. Deseja que eu gere o link de pagamento?', 3),
  ('Link de checkout',      'Aqui está o link para regularização do seu plano: [link]', 4),
  ('Encerrar atendimento',  'Foi um prazer ajudar! Qualquer dúvida, estamos aqui. Tenha um ótimo dia!', 5),
  ('Aguardar aprovação',    'Preciso consultar com nossa equipe sobre esse desconto. Posso retornar em breve?', 6);

-- RLS: qualquer autenticado lê, só gestor pode modificar
ALTER TABLE respostas_rapidas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "respostas_leitura" ON respostas_rapidas
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "respostas_gestor_escrita" ON respostas_rapidas
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM usuarios WHERE id = auth.uid() AND role = 'gestor')
  );
