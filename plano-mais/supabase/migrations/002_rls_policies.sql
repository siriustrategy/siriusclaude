-- =====================================================
-- Plano Mais — Sistema de Cobrança e Inadimplência
-- Migration 002: Row Level Security (RLS) Policies
-- =====================================================

-- =====================================================
-- FUNÇÃO AUXILIAR: Obter role do usuário atual
-- =====================================================

CREATE OR REPLACE FUNCTION get_my_role()
RETURNS user_role AS $$
  SELECT role FROM usuarios WHERE id = auth.uid()
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION is_gestor()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM usuarios WHERE id = auth.uid() AND role = 'gestor'
  )
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION is_atendente()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM usuarios WHERE id = auth.uid() AND role IN ('atendente_senior', 'atendente_junior')
  )
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- =====================================================
-- TABELA: usuarios
-- =====================================================

ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

-- Qualquer usuário autenticado pode ver todos os usuários (para listar atendentes, etc.)
CREATE POLICY "usuarios_select_authenticated"
  ON usuarios FOR SELECT
  USING (auth.role() = 'authenticated');

-- Usuário pode atualizar seu próprio perfil
CREATE POLICY "usuarios_update_own"
  ON usuarios FOR UPDATE
  USING (auth.uid() = id);

-- Gestor pode inserir, atualizar e deletar qualquer usuário
CREATE POLICY "usuarios_all_gestor"
  ON usuarios FOR ALL
  USING (is_gestor());

-- Sistema pode criar perfil automaticamente (service role)
CREATE POLICY "usuarios_insert_service"
  ON usuarios FOR INSERT
  WITH CHECK (auth.role() = 'service_role' OR is_gestor());

-- =====================================================
-- TABELA: leads
-- =====================================================

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Gestor pode ver todos os leads
CREATE POLICY "leads_select_gestor"
  ON leads FOR SELECT
  USING (is_gestor());

-- Atendente vê todos os leads (para CRM)
CREATE POLICY "leads_select_atendente"
  ON leads FOR SELECT
  USING (is_atendente());

-- Gestor pode criar, editar e deletar leads
CREATE POLICY "leads_all_gestor"
  ON leads FOR ALL
  USING (is_gestor());

-- Atendente pode inserir novos leads
CREATE POLICY "leads_insert_atendente"
  ON leads FOR INSERT
  WITH CHECK (is_atendente());

-- Atendente pode atualizar leads (interações, anotações, etc.)
CREATE POLICY "leads_update_atendente"
  ON leads FOR UPDATE
  USING (is_atendente());

-- Service role tem acesso completo (para automações e bots)
CREATE POLICY "leads_all_service"
  ON leads FOR ALL
  USING (auth.role() = 'service_role');

-- =====================================================
-- TABELA: notas_crm
-- =====================================================

ALTER TABLE notas_crm ENABLE ROW LEVEL SECURITY;

-- Qualquer usuário autenticado pode ver todas as notas
CREATE POLICY "notas_crm_select"
  ON notas_crm FOR SELECT
  USING (auth.role() = 'authenticated');

-- Usuário só cria suas próprias notas
CREATE POLICY "notas_crm_insert"
  ON notas_crm FOR INSERT
  WITH CHECK (auth.uid() = usuario_id);

-- Usuário só edita suas próprias notas; gestor edita qualquer uma
CREATE POLICY "notas_crm_update"
  ON notas_crm FOR UPDATE
  USING (auth.uid() = usuario_id OR is_gestor());

-- Gestor pode deletar qualquer nota
CREATE POLICY "notas_crm_delete_gestor"
  ON notas_crm FOR DELETE
  USING (is_gestor());

-- =====================================================
-- TABELA: historico_status
-- =====================================================

ALTER TABLE historico_status ENABLE ROW LEVEL SECURITY;

-- Todos os autenticados podem visualizar o histórico
CREATE POLICY "historico_status_select"
  ON historico_status FOR SELECT
  USING (auth.role() = 'authenticated');

-- Qualquer usuário autenticado e service role podem inserir
CREATE POLICY "historico_status_insert"
  ON historico_status FOR INSERT
  WITH CHECK (auth.role() IN ('authenticated', 'service_role'));

-- Ninguém pode editar histórico (imutável)

-- =====================================================
-- TABELA: conversas
-- =====================================================

ALTER TABLE conversas ENABLE ROW LEVEL SECURITY;

-- Gestor vê todas as conversas
CREATE POLICY "conversas_select_gestor"
  ON conversas FOR SELECT
  USING (is_gestor());

-- Atendente vê conversas em que foi atribuído ou todas abertas
CREATE POLICY "conversas_select_atendente"
  ON conversas FOR SELECT
  USING (
    is_atendente() AND (
      atendente_id = auth.uid()
      OR atendente_id IS NULL
      OR status = 'aberta'
    )
  );

-- Service role (bot) pode criar e atualizar conversas
CREATE POLICY "conversas_all_service"
  ON conversas FOR ALL
  USING (auth.role() = 'service_role');

-- Atendente pode atualizar conversas que lhe são atribuídas
CREATE POLICY "conversas_update_atendente"
  ON conversas FOR UPDATE
  USING (is_atendente() AND (atendente_id = auth.uid() OR atendente_id IS NULL));

-- Gestor tem acesso total
CREATE POLICY "conversas_all_gestor"
  ON conversas FOR ALL
  USING (is_gestor());

-- =====================================================
-- TABELA: mensagens
-- =====================================================

ALTER TABLE mensagens ENABLE ROW LEVEL SECURITY;

-- Gestor vê todas as mensagens
CREATE POLICY "mensagens_select_gestor"
  ON mensagens FOR SELECT
  USING (is_gestor());

-- Atendente vê mensagens das conversas acessíveis
CREATE POLICY "mensagens_select_atendente"
  ON mensagens FOR SELECT
  USING (is_atendente());

-- Service role pode inserir mensagens (bot)
CREATE POLICY "mensagens_insert_service"
  ON mensagens FOR INSERT
  WITH CHECK (auth.role() = 'service_role' OR auth.role() = 'authenticated');

-- Ninguém pode editar mensagens enviadas (somente status_entrega pelo service)
CREATE POLICY "mensagens_update_service"
  ON mensagens FOR UPDATE
  USING (auth.role() = 'service_role' OR is_gestor());

-- =====================================================
-- TABELA: descontos_concedidos
-- =====================================================

ALTER TABLE descontos_concedidos ENABLE ROW LEVEL SECURITY;

-- Gestor vê todos os descontos
CREATE POLICY "descontos_select_gestor"
  ON descontos_concedidos FOR SELECT
  USING (is_gestor());

-- Atendente vê os descontos que concedeu
CREATE POLICY "descontos_select_atendente"
  ON descontos_concedidos FOR SELECT
  USING (is_atendente() AND atendente_id = auth.uid());

-- Atendente pode criar desconto
CREATE POLICY "descontos_insert_atendente"
  ON descontos_concedidos FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND atendente_id = auth.uid());

-- Gestor pode atualizar qualquer desconto
CREATE POLICY "descontos_update_gestor"
  ON descontos_concedidos FOR UPDATE
  USING (is_gestor());

-- Service role tem acesso total
CREATE POLICY "descontos_all_service"
  ON descontos_concedidos FOR ALL
  USING (auth.role() = 'service_role');

-- =====================================================
-- TABELA: pagamentos
-- =====================================================

ALTER TABLE pagamentos ENABLE ROW LEVEL SECURITY;

-- Todos os autenticados podem ver pagamentos
CREATE POLICY "pagamentos_select"
  ON pagamentos FOR SELECT
  USING (auth.role() = 'authenticated');

-- Gestores e service role podem criar pagamentos
CREATE POLICY "pagamentos_insert"
  ON pagamentos FOR INSERT
  WITH CHECK (is_gestor() OR auth.role() = 'service_role');

-- Gestor pode atualizar
CREATE POLICY "pagamentos_update_gestor"
  ON pagamentos FOR UPDATE
  USING (is_gestor());

-- Service role tem acesso total (confirmação via webhook)
CREATE POLICY "pagamentos_all_service"
  ON pagamentos FOR ALL
  USING (auth.role() = 'service_role');

-- =====================================================
-- TABELA: templates_mensagem
-- =====================================================

ALTER TABLE templates_mensagem ENABLE ROW LEVEL SECURITY;

-- Todos os autenticados podem ver templates ativos
CREATE POLICY "templates_select"
  ON templates_mensagem FOR SELECT
  USING (auth.role() = 'authenticated');

-- Apenas gestor pode criar/editar/deletar templates
CREATE POLICY "templates_all_gestor"
  ON templates_mensagem FOR ALL
  USING (is_gestor());

-- Service role tem acesso total
CREATE POLICY "templates_all_service"
  ON templates_mensagem FOR ALL
  USING (auth.role() = 'service_role');

-- =====================================================
-- TABELA: campanhas
-- =====================================================

ALTER TABLE campanhas ENABLE ROW LEVEL SECURITY;

-- Gestor vê e gerencia todas as campanhas
CREATE POLICY "campanhas_all_gestor"
  ON campanhas FOR ALL
  USING (is_gestor());

-- Atendentes só podem ver campanhas (não criar)
CREATE POLICY "campanhas_select_atendente"
  ON campanhas FOR SELECT
  USING (is_atendente());

-- Service role tem acesso total
CREATE POLICY "campanhas_all_service"
  ON campanhas FOR ALL
  USING (auth.role() = 'service_role');

-- =====================================================
-- TABELA: resultados_campanha
-- =====================================================

ALTER TABLE resultados_campanha ENABLE ROW LEVEL SECURITY;

-- Gestor vê tudo
CREATE POLICY "resultados_campanha_select_gestor"
  ON resultados_campanha FOR SELECT
  USING (is_gestor());

-- Atendente pode ver resultados
CREATE POLICY "resultados_campanha_select_atendente"
  ON resultados_campanha FOR SELECT
  USING (is_atendente());

-- Service role insere e atualiza resultados
CREATE POLICY "resultados_campanha_all_service"
  ON resultados_campanha FOR ALL
  USING (auth.role() = 'service_role');

-- =====================================================
-- TABELA: custos_operacao
-- =====================================================

ALTER TABLE custos_operacao ENABLE ROW LEVEL SECURITY;

-- Apenas gestor pode ver custos
CREATE POLICY "custos_select_gestor"
  ON custos_operacao FOR SELECT
  USING (is_gestor());

-- Service role insere custos (automático)
CREATE POLICY "custos_all_service"
  ON custos_operacao FOR ALL
  USING (auth.role() = 'service_role');

-- =====================================================
-- TABELA: notificacoes
-- =====================================================

ALTER TABLE notificacoes ENABLE ROW LEVEL SECURITY;

-- Usuário vê apenas suas próprias notificações
CREATE POLICY "notificacoes_select_own"
  ON notificacoes FOR SELECT
  USING (usuario_id = auth.uid());

-- Usuário pode marcar suas notificações como lidas
CREATE POLICY "notificacoes_update_own"
  ON notificacoes FOR UPDATE
  USING (usuario_id = auth.uid());

-- Service role e gestor podem criar notificações
CREATE POLICY "notificacoes_insert"
  ON notificacoes FOR INSERT
  WITH CHECK (auth.role() = 'service_role' OR is_gestor());

-- Service role tem acesso total
CREATE POLICY "notificacoes_all_service"
  ON notificacoes FOR ALL
  USING (auth.role() = 'service_role');

-- =====================================================
-- TABELA: checkout_tokens
-- =====================================================

ALTER TABLE checkout_tokens ENABLE ROW LEVEL SECURITY;

-- Gestores podem ver todos os tokens
CREATE POLICY "checkout_tokens_select_gestor"
  ON checkout_tokens FOR SELECT
  USING (is_gestor());

-- Service role tem acesso total (criação de links)
CREATE POLICY "checkout_tokens_all_service"
  ON checkout_tokens FOR ALL
  USING (auth.role() = 'service_role');

-- Acesso público para validação de token (checkout page)
CREATE POLICY "checkout_tokens_select_public"
  ON checkout_tokens FOR SELECT
  USING (true);

-- =====================================================
-- TABELA: scores_leads
-- =====================================================

ALTER TABLE scores_leads ENABLE ROW LEVEL SECURITY;

-- Todos os autenticados podem ver scores
CREATE POLICY "scores_leads_select"
  ON scores_leads FOR SELECT
  USING (auth.role() = 'authenticated');

-- Service role insere e atualiza scores
CREATE POLICY "scores_leads_all_service"
  ON scores_leads FOR ALL
  USING (auth.role() = 'service_role');

-- =====================================================
-- TABELA: diagnosticos
-- =====================================================

ALTER TABLE diagnosticos ENABLE ROW LEVEL SECURITY;

-- Todos os autenticados podem ver diagnósticos
CREATE POLICY "diagnosticos_select"
  ON diagnosticos FOR SELECT
  USING (auth.role() = 'authenticated');

-- Service role insere e atualiza diagnósticos (gerados por IA)
CREATE POLICY "diagnosticos_all_service"
  ON diagnosticos FOR ALL
  USING (auth.role() = 'service_role');

-- =====================================================
-- TABELA: auditoria
-- =====================================================

ALTER TABLE auditoria ENABLE ROW LEVEL SECURITY;

-- Apenas gestor pode ver o log de auditoria
CREATE POLICY "auditoria_select_gestor"
  ON auditoria FOR SELECT
  USING (is_gestor());

-- Service role insere logs (automático)
CREATE POLICY "auditoria_insert_service"
  ON auditoria FOR INSERT
  WITH CHECK (auth.role() = 'service_role' OR auth.role() = 'authenticated');

-- Ninguém pode editar ou deletar logs de auditoria (imutável)
