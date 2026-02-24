import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * POST /api/genius-profile
 * Generate genius profile from assessment answers
 */
export async function POST(request: NextRequest) {
  try {
    const { assessmentId } = await request.json();

    if (!assessmentId) {
      return NextResponse.json(
        { success: false, error: 'assessmentId is required' },
        { status: 400 }
      );
    }

    // Get assessment data
    const { data: assessment, error: assessmentError } = await supabase
      .from('assessments')
      .select('*')
      .eq('id', assessmentId)
      .single();

    if (assessmentError || !assessment) {
      return NextResponse.json(
        { success: false, error: 'Assessment not found' },
        { status: 404 }
      );
    }

    // Get user data
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', assessment.user_id)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Extract and analyze assessment data
    const profile = generateGeniusProfile(assessment, user);

    // Save profile to database
    const { data: savedProfile, error: saveError } = await supabase
      .from('genius_profiles')
      .upsert(
        [
          {
            assessment_id: assessmentId,
            user_id: assessment.user_id,
            organization_id: assessment.organization_id,
            profile_data: profile,
          },
        ],
        { onConflict: 'assessment_id' }
      )
      .select()
      .single();

    if (saveError) {
      return NextResponse.json(
        { success: false, error: saveError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: profile });
  } catch (error) {
    console.error('Error generating profile:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/genius-profile?assessmentId=xxx
 * Retrieve existing genius profile
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const assessmentId = searchParams.get('assessmentId');

    if (!assessmentId) {
      return NextResponse.json(
        { success: false, error: 'assessmentId is required' },
        { status: 400 }
      );
    }

    const { data: profile, error } = await supabase
      .from('genius_profiles')
      .select('*')
      .eq('assessment_id', assessmentId)
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: 'Profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: profile });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Generate Genius Profile based on assessment answers
 */
function generateGeniusProfile(assessment: any, user: any) {
  // Extract main themes from assessment data
  const primary_strength = getPrimaryStrength(assessment);
  const secondary_strengths = getSecondaryStrengths(assessment);
  const wealth_dynamic = assessment.section_4_perfil_wealth_dynamics || 'Desconhecido';
  const risk_tolerance = assessment.section_4_tolerancia_risco || 'Equilibrado';
  const main_blocker = assessment.section_5_maior_bloqueio || 'Não informado';
  const revenue_goal = assessment.section_5_meta_receita_mensal || 'Não definida';
  const available_time = assessment.section_5_tempo_disponivel || 'Não informado';
  const ai_proficiency = assessment.section_5_nivel_ai || 'Iniciante';

  // Generate narrative
  const narrative = generateNarrative(
    user.full_name,
    primary_strength,
    wealth_dynamic,
    risk_tolerance
  );

  // Generate 90-day blueprint
  const blueprint = generate90DayBlueprint(
    primary_strength,
    main_blocker,
    revenue_goal,
    available_time
  );

  // Generate squad recommendations
  const squadRecommendations = generateSquadRecommendations(
    wealth_dynamic,
    secondary_strengths
  );

  return {
    user_name: user.full_name,
    email: user.email,
    created_at: new Date().toISOString(),
    primary_strength,
    secondary_strengths,
    wealth_dynamic,
    risk_tolerance,
    ai_proficiency,
    main_blocker,
    revenue_goal,
    available_time,
    narrative,
    blueprint,
    squad_recommendations: squadRecommendations,
    frameworks_analysis: {
      gay_hendricks: analyzeGayHendricks(assessment),
      don_clifton: analyzeDonClifton(assessment),
      dan_sullivan: analyzeDanSullivan(assessment),
      roger_hamilton: analyzeRogerHamilton(assessment),
      alex_hormozi: analyzeAlexHormozi(assessment),
      kathy_kolbe: analyzeKathyKolbe(assessment),
      sally_hogshead: analyzeSallyHogshead(assessment),
    },
  };
}

/**
 * Get primary strength based on assessment answers
 */
function getPrimaryStrength(assessment: any): string {
  // Simple heuristic: check which sections have most detailed answers
  const section1_length = String(assessment.section_1_context || '').length;
  const section2_length = String(assessment.section_2_activities || '').length;
  const section3_length = String(assessment.section_3_talents || '').length;
  const section4_length = String(assessment.section_4_modelo_preferido || '').length;

  const max =
    Math.max(section1_length, section2_length, section3_length, section4_length);

  if (max === section3_length && section3_length > 50) {
    return 'Talentos Naturais';
  } else if (max === section2_length && section2_length > 50) {
    return 'Atividades Apaixonantes';
  } else if (max === section4_length && section4_length > 50) {
    return 'Modelo de Negócio';
  } else {
    return 'Desenvolvimento Pessoal';
  }
}

/**
 * Get secondary strengths
 */
function getSecondaryStrengths(assessment: any): string[] {
  const strengths = [];

  if (
    assessment.section_4_tolerancia_risco &&
    assessment.section_4_tolerancia_risco.includes('alto')
  ) {
    strengths.push('Empreendedor');
  }

  if (
    assessment.section_4_solo_vs_time &&
    assessment.section_4_solo_vs_time.includes('time')
  ) {
    strengths.push('Liderança de Equipe');
  }

  if (assessment.section_5_nivel_ai && assessment.section_5_nivel_ai !== 'Iniciante') {
    strengths.push('Inovação Tecnológica');
  }

  if (
    assessment.section_5_meta_receita_mensal &&
    assessment.section_5_meta_receita_mensal.includes('R$')
  ) {
    strengths.push('Pensamento Financeiro');
  }

  return strengths.length > 0 ? strengths : ['Aprendizado Contínuo'];
}

/**
 * Generate narrative profile
 */
function generateNarrative(
  fullName: string,
  primary: string,
  wealth: string,
  risk: string
): string {
  return `${fullName} é um profissional orientado por ${primary.toLowerCase()}, com perfil Wealth Dynamics de ${wealth}. Com tolerância a risco ${risk.toLowerCase()}, você está pronto para construir uma carreira alinhada com seus valores e objetivos únicos. Seu potencial reside na capacidade de combinar insights pessoais com ação estratégica.`;
}

/**
 * Generate 90-day blueprint
 */
function generate90DayBlueprint(
  primaryStrength: string,
  blocker: string,
  revenueGoal: string,
  availableTime: string
): any {
  return {
    objective: `Desenvolver estratégia baseada em ${primaryStrength.toLowerCase()} para atingir ${revenueGoal}`,
    blockers_to_address: [blocker || 'Não informado'],
    daily_practices: [
      'Dedicar 30 min ao desenvolvimento pessoal',
      'Revisar progresso em relação aos objetivos',
      'Aplicar novo conhecimento aprendido',
    ],
    weekly_milestones: [
      'Semana 1-2: Diagnóstico e planejamento',
      'Semana 3-4: Implementação inicial',
      'Semana 5-8: Otimização e aprendizado',
      'Semana 9-12: Consolidação de resultados',
    ],
    resources_needed: [
      'Mentoria/coaching especializado',
      'Ferramentas de produtividade',
      'Comunidade de apoio',
      'Educação contínua',
    ],
    success_metrics: ['Bloqueios removidos', 'Meta de receita atingida', 'Plano de escalabilidade'],
    available_time_allocation: `${availableTime} por semana dedicadas ao desenvolvimento`,
  };
}

/**
 * Generate squad recommendations
 */
function generateSquadRecommendations(wealth: string, secondaryStrengths: string[]): any[] {
  const complementaryRoles = {
    CRIADOR: 'Executor (Mechanic)',
    MECHANIC: 'Negociador (Deal Maker)',
    DEAL_MAKER: 'Influenciador (Star)',
    STAR: 'Suportador (Supporter)',
    SUPPORTER: 'Acumulador (Accumulator)',
    ACCUMULATOR: 'Criador (Creator)',
  };

  const complementary = complementaryRoles[wealth as keyof typeof complementaryRoles] ||
    'Profissional com perfil complementar';

  return [
    {
      role: 'Mentor/Coach',
      description: 'Guia estratégico para acelerar seu desenvolvimento',
      why: 'Vai ajudar a validar decisões e evitar armadilhas',
    },
    {
      role: complementary,
      description: `Profissional com ${complementary.toLowerCase()}`,
      why: 'Complementa suas forças e cobre seus pontos cegos',
    },
    {
      role: 'Executor Operacional',
      description: 'Especialista em implementação',
      why: 'Libera você para focar em estratégia e visão',
    },
  ];
}

// Lightweight framework analysis functions
function analyzeGayHendricks(assessment: any): any {
  return {
    framework: 'Gay Hendricks - Zona de Genialidade',
    insight: 'Seu potencial máximo está em focar nas atividades que geram mais impacto',
    recommendation: 'Dedique 70% do seu tempo às suas maiores forças',
  };
}

function analyzeDonClifton(assessment: any): any {
  return {
    framework: 'Don Clifton - StrengthsFinder',
    insight: 'Talentos naturais são seu diferencial',
    recommendation: 'Invista em desenvolvimento dos seus top 5 talentos',
  };
}

function analyzeDanSullivan(assessment: any): any {
  return {
    framework: 'Dan Sullivan - Rumo à Liberdade',
    insight: 'Sua visão de futuro define suas escolhas presentes',
    recommendation: 'Defina objetivos 10X e trabalhe backward',
  };
}

function analyzeRogerHamilton(assessment: any): any {
  const wealth = assessment.section_4_perfil_wealth_dynamics || 'Desconhecido';
  return {
    framework: 'Roger Hamilton - Wealth Dynamics',
    insight: `Seu perfil ${wealth} tem um caminho natural para prosperidade`,
    recommendation: 'Trabalhe em harmonia com seu tipo natural',
  };
}

function analyzeAlexHormozi(assessment: any): any {
  return {
    framework: 'Alex Hormozi - Construção de Negócios',
    insight: 'Há um mercado pronto para suas soluções',
    recommendation: 'Foco em nicho rentável antes de escalar',
  };
}

function analyzeKathyKolbe(assessment: any): any {
  return {
    framework: 'Kathy Kolbe - Estilos de Ação',
    insight: 'Seu instinto natural é seu melhor guia',
    recommendation: 'Confie em seu modo de operar natural',
  };
}

function analyzeSallyHogshead(assessment: any): any {
  return {
    framework: 'Sally Hogshead - Fascinate',
    insight: 'Seu diferencial atrai o mercado certo',
    recommendation: 'Comunique seu valor único consistentemente',
  };
}
