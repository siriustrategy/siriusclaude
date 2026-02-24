// Assessment Types
export type AssessmentStatus = 'rascunho' | 'em_progresso' | 'completo';
export type AssessmentCompleteness = '0%' | '20%' | '40%' | '60%' | '80%' | '100%';
export type UserRole = 'colaborador' | 'gestor' | 'admin';

// Database Models
export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  branding_color: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  organization_id: string;
  full_name: string;
  email: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Assessment {
  id: string;
  user_id: string;
  organization_id: string;
  status: AssessmentStatus;
  completeness: AssessmentCompleteness;

  // Section 1: Context
  section_1_nome?: string;
  section_1_area_atuacao?: string;
  section_1_tempo_experiencia?: string;
  section_1_descricao_dia_a_dia?: string;
  section_1_se_dinheiro_nao_importasse?: string;
  section_1_espectro_introextro?: string;

  // Section 2: Activities
  section_2_atividades_drenam?: string[];
  section_2_atividades_energizam?: string[];
  section_2_outros_agradecem_por?: string;
  section_2_perde_tempo_em?: string;
  section_2_como_inicia_projetos?: string;
  section_2_como_resolve_problemas?: string;
  section_2_manual_vs_conceitual?: string;
  section_2_nivel_detalhe?: string;
  section_2_estilo_delegacao?: string;
  section_2_ritmo_trabalho?: string;
  section_2_inovacao_vs_otimizacao?: string;
  section_2_foco_vs_multitask?: string;

  // Section 3: Talents
  section_3_padrao_sucesso?: string;
  section_3_como_outros_descrevem?: string;
  section_3_facilidade_natural?: string;
  section_3_dominio_strengths?: string;
  section_3_frustracao_recorrente?: string;
  section_3_estilo_comunicacao?: string;
  section_3_estilo_aprendizado?: string;
  section_3_reacao_feedback?: string;
  section_3_contribuicao_mundo?: string;
  section_3_competencia_vs_genialidade?: string;
  section_3_principal_forca?: string;

  // Section 4: Business
  section_4_modelo_preferido?: string;
  section_4_tolerancia_risco?: string;
  section_4_solo_vs_time?: string;
  section_4_timing_mercado?: string;
  section_4_fonte_receita_ideal?: string;
  section_4_relacao_preco?: string;
  section_4_escala_vs_profundidade?: string;
  section_4_perfil_wealth_dynamics?: string;

  // Section 5: Vision
  section_5_resultado_90_dias?: string;
  section_5_meta_receita_mensal?: string;
  section_5_maior_bloqueio?: string;
  section_5_tempo_disponivel?: string;
  section_5_nivel_ai?: string;

  started_at: string;
  completed_at?: string;
  last_updated_at: string;
  created_at: string;
  updated_at: string;
}

export interface GeniusProfile {
  id: string;
  assessment_id: string;
  user_id: string;
  organization_id: string;
  overall_confidence_score: number;
  generated_at: string;
  created_at: string;
  updated_at: string;
}

export interface SquadRecommendation {
  id: string;
  genius_profile_id: string;
  user_id: string;
  organization_id: string;
  squad_1_name: string;
  squad_1_score: number;
  generated_at: string;
  created_at: string;
  updated_at: string;
}

export interface GeniusZoneBlueprint {
  id: string;
  squad_recommendation_id: string;
  user_id: string;
  organization_id: string;
  confidence_score: number;
  generated_at: string;
  created_at: string;
  updated_at: string;
}

// Form State
export interface AssessmentFormState {
  section: number; // 1-5
  data: Partial<Assessment>;
  isValid: boolean;
}

// API Response
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
