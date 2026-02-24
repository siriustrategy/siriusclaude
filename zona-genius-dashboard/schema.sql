-- Synkra Zona de Genialidade — Schema Supabase
-- Dashboard corporativo para assessments de Genius Zone
-- Data: 2026-02-23

-- ============================================================================
-- STEP 1: ENABLE EXTENSIONS
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================================================
-- STEP 2: ENUM TYPES
-- ============================================================================

CREATE TYPE user_role AS ENUM ('colaborador', 'gestor', 'admin');
CREATE TYPE assessment_status AS ENUM ('em_progresso', 'completo', 'rascunho');
CREATE TYPE assessment_completeness AS ENUM ('0%', '20%', '40%', '60%', '80%', '100%');

-- ============================================================================
-- STEP 3: ORGANIZATIONS TABLE
-- ============================================================================

CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  logo_url TEXT,
  branding_color VARCHAR(7) DEFAULT '#000000',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ============================================================================
-- STEP 4: USERS TABLE (with Supabase Auth integration)
-- ============================================================================

CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  role user_role NOT NULL DEFAULT 'colaborador',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(email, organization_id)
);

-- ============================================================================
-- STEP 5: ASSESSMENTS TABLE (Core Assessment Data)
-- ============================================================================

CREATE TABLE assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  status assessment_status NOT NULL DEFAULT 'rascunho',
  completeness assessment_completeness DEFAULT '0%',

  -- SECTION 1: CONTEXT (6 questions)
  section_1_nome VARCHAR(255),
  section_1_area_atuacao TEXT,
  section_1_tempo_experiencia VARCHAR(50),
  section_1_descricao_dia_a_dia TEXT,
  section_1_se_dinheiro_nao_importasse TEXT,
  section_1_espectro_introextro VARCHAR(50),

  -- SECTION 2: ACTIVITIES (12 questions)
  section_2_atividades_drenam TEXT[], -- Array of activities
  section_2_atividades_energizam TEXT[],
  section_2_outros_agradecem_por TEXT,
  section_2_perde_tempo_em TEXT,
  section_2_como_inicia_projetos TEXT,
  section_2_como_resolve_problemas VARCHAR(255),
  section_2_manual_vs_conceitual VARCHAR(50),
  section_2_nivel_detalhe VARCHAR(50),
  section_2_estilo_delegacao TEXT,
  section_2_ritmo_trabalho TEXT,
  section_2_inovacao_vs_otimizacao VARCHAR(50),
  section_2_foco_vs_multitask VARCHAR(50),

  -- SECTION 3: TALENTS (10 questions)
  section_3_padrao_sucesso TEXT,
  section_3_como_outros_descrevem TEXT,
  section_3_facilidade_natural TEXT,
  section_3_dominio_strengths TEXT,
  section_3_frustracao_recorrente TEXT,
  section_3_estilo_comunicacao VARCHAR(50),
  section_3_estilo_aprendizado TEXT,
  section_3_reacao_feedback VARCHAR(50),
  section_3_contribuicao_mundo TEXT,
  section_3_competencia_vs_genialidade TEXT,
  section_3_principal_forca TEXT,

  -- SECTION 4: BUSINESS (7 questions)
  section_4_modelo_preferido TEXT,
  section_4_tolerancia_risco VARCHAR(50),
  section_4_solo_vs_time VARCHAR(50),
  section_4_timing_mercado TEXT,
  section_4_fonte_receita_ideal TEXT,
  section_4_relacao_preco TEXT,
  section_4_escala_vs_profundidade VARCHAR(50),
  section_4_perfil_wealth_dynamics VARCHAR(50),

  -- SECTION 5: VISION (8 questions)
  section_5_resultado_90_dias TEXT,
  section_5_meta_receita_mensal VARCHAR(100),
  section_5_maior_bloqueio TEXT,
  section_5_tempo_disponivel VARCHAR(50),
  section_5_nivel_ai VARCHAR(50),

  -- METADATA
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ============================================================================
-- STEP 6: GENIUS PROFILES TABLE (Analysis Results)
-- ============================================================================

CREATE TABLE genius_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assessment_id UUID NOT NULL UNIQUE REFERENCES assessments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,

  -- 7 FRAMEWORKS ANALYSIS
  -- 1. Gay Hendricks Framework
  hendricks_zona_atual VARCHAR(100),
  hendricks_zona_desejada VARCHAR(100),
  hendricks_upper_limit_problem TEXT,
  hendricks_acao_recomendada TEXT,
  hendricks_confidence_score DECIMAL(3, 2),

  -- 2. Don Clifton Strengths
  clifton_top_5 JSONB, -- Array of {rank, talent, score}
  clifton_primary_strength VARCHAR(100),
  clifton_confidence_score DECIMAL(3, 2),

  -- 3. Dan Sullivan Unique Ability
  sullivan_unique_ability TEXT,
  sullivan_unique_ability_evidence TEXT,
  sullivan_who_not_how_readiness VARCHAR(50),
  sullivan_gap_vs_gain TEXT,
  sullivan_confidence_score DECIMAL(3, 2),

  -- 4. Roger Hamilton Wealth Dynamics
  hamilton_primary_profile VARCHAR(50),
  hamilton_secondary_signals VARCHAR(50),
  hamilton_wealth_spectrum VARCHAR(50),
  hamilton_ideal_partner VARCHAR(100),
  hamilton_confidence_score DECIMAL(3, 2),

  -- 5. Alex Hormozi Value Equation
  hormozi_monetization_readiness VARCHAR(50),
  hormozi_core_4_opportunity TEXT,
  hormozi_value_equation_gap TEXT,
  hormozi_grand_slam_offer_draft TEXT,
  hormozi_confidence_score DECIMAL(3, 2),

  -- 6. Kathy Kolbe Action Modes
  kolbe_quick_start SMALLINT, -- 0-100 scale
  kolbe_fact_finder SMALLINT,
  kolbe_follow_thru SMALLINT,
  kolbe_implementor SMALLINT,
  kolbe_recomendacao TEXT,
  kolbe_confidence_score DECIMAL(3, 2),

  -- 7. Sally Hogshead Fascination Advantage
  hogshead_primary_advantage VARCHAR(50),
  hogshead_secondary_advantage VARCHAR(50),
  hogshead_mystique TEXT,
  hogshead_fascination_archetype VARCHAR(100),
  hogshead_confidence_score DECIMAL(3, 2),

  -- OVERALL SYNTHESIS
  overall_confidence_score DECIMAL(3, 2),
  consistency_check VARCHAR(50), -- CONSISTENTE | INCONSISTENTE
  contradiction_flags TEXT[],

  generated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ============================================================================
-- STEP 7: SQUAD RECOMMENDATIONS TABLE
-- ============================================================================

CREATE TABLE squad_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  genius_profile_id UUID NOT NULL REFERENCES genius_profiles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,

  -- TOP 3 SQUADS
  squad_1_name VARCHAR(100) NOT NULL,
  squad_1_score DECIMAL(3, 2),
  squad_1_description TEXT,
  squad_1_why_perfect TEXT,
  squad_1_model TEXT,
  squad_1_90day_meta VARCHAR(100),

  squad_2_name VARCHAR(100),
  squad_2_score DECIMAL(3, 2),
  squad_2_description TEXT,
  squad_2_when_to_activate TEXT,

  squad_3_name VARCHAR(100),
  squad_3_score DECIMAL(3, 2),
  squad_3_description TEXT,
  squad_3_conditions TEXT,

  dream_squad_name VARCHAR(100),
  dream_squad_potential VARCHAR(100),

  generated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ============================================================================
-- STEP 8: GENIUS ZONE BLUEPRINTS TABLE
-- ============================================================================

CREATE TABLE genius_zone_blueprints (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  squad_recommendation_id UUID NOT NULL REFERENCES squad_recommendations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,

  -- 10 SECTIONS OF BLUEPRINT
  section_1_who_are_you_30_seconds TEXT,
  section_1_superpower TEXT,

  section_2_genius_zone JSONB, -- Array of genius areas
  section_2_blocker TEXT,

  section_4_unique_ability TEXT,
  section_4_evidence JSONB,

  section_5_wealth_profile_primary VARCHAR(50),
  section_5_wealth_profile_secondary VARCHAR(50),
  section_5_potential_range VARCHAR(100),
  section_5_blocker_underpricing TEXT,

  section_6_squad_1_type VARCHAR(100),
  section_6_squad_1_score DECIMAL(3, 2),
  section_6_squad_1_model JSONB,
  section_6_squad_1_90day_target VARCHAR(100),

  section_7_monetization JSONB, -- Array of offers with pricing

  section_8_execution_style_quickstart SMALLINT,
  section_8_execution_style_factfinder SMALLINT,
  section_8_execution_style_implementor SMALLINT,
  section_8_execution_style_followthru SMALLINT,

  section_9_positioning_power VARCHAR(50),
  section_9_positioning_intrigue VARCHAR(50),
  section_9_positioning_message TEXT,

  section_10_next_90_days JSONB, -- Array of actions with timelines

  global_meta JSONB, -- 90-day revenue targets, etc.

  confidence_score DECIMAL(3, 2),
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ============================================================================
-- STEP 9: CHAT RESPONSES TABLE (Open-ended questions)
-- ============================================================================

CREATE TABLE chat_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,

  question_id VARCHAR(50) NOT NULL, -- e.g., "section_2_7"
  question_text TEXT NOT NULL,
  response_text TEXT NOT NULL,
  character_count INT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ============================================================================
-- STEP 10: AUDIT LOG TABLE
-- ============================================================================

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,

  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50) NOT NULL,
  resource_id UUID,
  details JSONB,

  ip_address INET,
  user_agent TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ============================================================================
-- STEP 11: INDEXES
-- ============================================================================

CREATE INDEX idx_users_org_id ON users(organization_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_assessments_user_id ON assessments(user_id);
CREATE INDEX idx_assessments_org_id ON assessments(organization_id);
CREATE INDEX idx_assessments_status ON assessments(status);
CREATE INDEX idx_assessments_completed_at ON assessments(completed_at);
CREATE INDEX idx_genius_profiles_user_id ON genius_profiles(user_id);
CREATE INDEX idx_genius_profiles_assessment_id ON genius_profiles(assessment_id);
CREATE INDEX idx_squad_recommendations_user_id ON squad_recommendations(user_id);
CREATE INDEX idx_squad_recommendations_genius_profile_id ON squad_recommendations(genius_profile_id);
CREATE INDEX idx_genius_zone_blueprints_user_id ON genius_zone_blueprints(user_id);
CREATE INDEX idx_chat_responses_assessment_id ON chat_responses(assessment_id);
CREATE INDEX idx_audit_logs_org_id ON audit_logs(organization_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- ============================================================================
-- STEP 12: ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE genius_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE squad_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE genius_zone_blueprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Organizations: admins can see all, others see their own
CREATE POLICY "Organizations select" ON organizations
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE users.organization_id = organizations.id AND users.id = auth.uid())
  );

-- Users: users can see themselves and others in their organization
CREATE POLICY "Users select own org" ON users
  FOR SELECT USING (
    organization_id IN (SELECT organization_id FROM users WHERE id = auth.uid())
  );

CREATE POLICY "Users update self" ON users
  FOR UPDATE USING (id = auth.uid()) WITH CHECK (id = auth.uid());

-- Assessments: users see their own, gestores see their collaborators
CREATE POLICY "Assessments select own" ON assessments
  FOR SELECT USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM users u1
      WHERE u1.id = auth.uid() AND u1.role = 'gestor'
      AND u1.organization_id = assessments.organization_id
    )
  );

CREATE POLICY "Assessments insert own" ON assessments
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Assessments update own" ON assessments
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Genius Profiles: same as assessments
CREATE POLICY "Genius profiles select" ON genius_profiles
  FOR SELECT USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid() AND u.role IN ('gestor', 'admin')
      AND u.organization_id = genius_profiles.organization_id
    )
  );

-- Squad Recommendations: same access as genius profiles
CREATE POLICY "Squad recommendations select" ON squad_recommendations
  FOR SELECT USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid() AND u.role IN ('gestor', 'admin')
      AND u.organization_id = squad_recommendations.organization_id
    )
  );

-- Genius Zone Blueprints: same access
CREATE POLICY "Blueprints select" ON genius_zone_blueprints
  FOR SELECT USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid() AND u.role IN ('gestor', 'admin')
      AND u.organization_id = genius_zone_blueprints.organization_id
    )
  );

-- Chat Responses: own responses or gestor oversight
CREATE POLICY "Chat responses select" ON chat_responses
  FOR SELECT USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid() AND u.role = 'gestor'
      AND u.organization_id = chat_responses.organization_id
    )
  );

CREATE POLICY "Chat responses insert own" ON chat_responses
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Audit logs: only admins and gestores
CREATE POLICY "Audit logs select" ON audit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid() AND u.role IN ('gestor', 'admin')
      AND u.organization_id = audit_logs.organization_id
    )
  );

-- ============================================================================
-- STEP 13: TRIGGERS FOR AUDIT
-- ============================================================================

CREATE OR REPLACE FUNCTION audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_logs (user_id, organization_id, action, resource_type, resource_id, details)
  VALUES (
    auth.uid(),
    COALESCE(NEW.organization_id, OLD.organization_id),
    TG_ARGV[0],
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    jsonb_build_object('old', to_jsonb(OLD), 'new', to_jsonb(NEW))
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER audit_assessments_changes
AFTER INSERT OR UPDATE OR DELETE ON assessments
FOR EACH ROW EXECUTE FUNCTION audit_trigger('assessment_changed');

CREATE TRIGGER audit_genius_profiles_changes
AFTER INSERT OR UPDATE OR DELETE ON genius_profiles
FOR EACH ROW EXECUTE FUNCTION audit_trigger('profile_analyzed');

-- ============================================================================
-- STEP 14: HELPER FUNCTIONS
-- ============================================================================

-- Function to get assessment completeness
CREATE OR REPLACE FUNCTION calculate_assessment_completeness(assessment_id UUID)
RETURNS TEXT AS $$
DECLARE
  filled_count INT := 0;
  total_fields INT := 43; -- 43 main questions
  percentage INT;
BEGIN
  SELECT COUNT(*)
  INTO filled_count
  FROM assessments a
  WHERE a.id = assessment_id
  AND (
    a.section_1_nome IS NOT NULL OR
    a.section_1_area_atuacao IS NOT NULL OR
    a.section_1_tempo_experiencia IS NOT NULL OR
    a.section_2_atividades_drenam IS NOT NULL OR
    a.section_3_padrao_sucesso IS NOT NULL OR
    a.section_4_modelo_preferido IS NOT NULL OR
    a.section_5_resultado_90_dias IS NOT NULL
  );

  percentage := (filled_count * 100) / total_fields;

  RETURN CASE
    WHEN percentage = 0 THEN '0%'
    WHEN percentage <= 20 THEN '20%'
    WHEN percentage <= 40 THEN '40%'
    WHEN percentage <= 60 THEN '60%'
    WHEN percentage <= 80 THEN '80%'
    ELSE '100%'
  END;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- STEP 15: INITIAL DATA
-- ============================================================================

-- Create default organization (for testing/demo)
INSERT INTO organizations (name, slug, branding_color)
VALUES ('Rio Mais PlayBooks', 'rio-mais-playbooks', '#FF6B00');
