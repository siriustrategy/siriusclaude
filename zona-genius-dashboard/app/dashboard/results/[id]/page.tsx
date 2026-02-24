'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Assessment, User } from '@/types/assessment';

interface GeniusProfile {
  user_name: string;
  email: string;
  primary_strength: string;
  secondary_strengths: string[];
  wealth_dynamic: string;
  risk_tolerance: string;
  ai_proficiency: string;
  main_blocker: string;
  revenue_goal: string;
  available_time: string;
  narrative: string;
  blueprint: any;
  squad_recommendations: any[];
  frameworks_analysis: any;
}

export default function ResultsPage() {
  const params = useParams();
  const router = useRouter();
  const assessmentId = params.id as string;

  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [profile, setProfile] = useState<GeniusProfile | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'blueprint' | 'squad' | 'frameworks'>(
    'overview'
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        // Check auth
        const {
          data: { user: authUser },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !authUser) {
          router.push('/auth/login');
          return;
        }

        // Get user profile
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .single();

        if (userError) throw userError;
        setUser(userData);

        // Get assessment
        const { data: assessmentData, error: assessmentError } = await supabase
          .from('assessments')
          .select('*')
          .eq('id', assessmentId)
          .single();

        if (assessmentError) throw assessmentError;
        setAssessment(assessmentData);

        // Check if user has access to this assessment (own or is gestor)
        if (
          userData.id !== assessmentData.user_id &&
          userData.role !== 'gestor'
        ) {
          router.push('/dashboard/assessment');
          return;
        }

        // Try to load existing profile
        const profileResponse = await fetch(
          `/api/genius-profile?assessmentId=${assessmentId}`
        );

        if (profileResponse.ok) {
          const { data: profileData } = await profileResponse.json();
          setProfile(profileData.profile_data);
        } else {
          // Generate new profile
          await generateProfile(assessmentData);
        }
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [assessmentId, router]);

  const generateProfile = async (assessmentData?: Assessment) => {
    if (!assessmentData) return;

    setGenerating(true);
    try {
      const response = await fetch('/api/genius-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assessmentId }),
      });

      if (!response.ok) throw new Error('Falha ao gerar perfil');

      const { data: generatedProfile } = await response.json();
      setProfile(generatedProfile);
    } catch (err) {
      console.error('Error generating profile:', err);
      setError('Erro ao gerar perfil de genialidade');
    } finally {
      setGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    if (!profile) return;

    try {
      // Simple HTML to PDF - using browser's built-in print to PDF
      const printWindow = window.open('', '', 'width=800,height=600');
      if (!printWindow) return;

      const htmlContent = generatePrintableHTML(profile);
      printWindow.document.write(htmlContent);
      printWindow.document.close();

      setTimeout(() => {
        printWindow.print();
      }, 250);
    } catch (err) {
      console.error('Error downloading:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Carregando seu relatório...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <p className="text-red-600 mb-4">{error || 'Perfil não disponível'}</p>
          <button
            onClick={() => generateProfile(assessment || undefined)}
            disabled={generating}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {generating ? 'Gerando...' : 'Gerar Perfil'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                🧠 Seu Perfil de Genialidade
              </h1>
              <p className="text-gray-600">
                Gerado em {new Date(profile.created_at).toLocaleDateString('pt-BR')}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handlePrint}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 text-sm font-medium"
              >
                🖨️ Imprimir
              </button>
              <button
                onClick={handleDownload}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium"
              >
                📥 Baixar PDF
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border-l-4 border-blue-600">
              <p className="text-gray-600 text-sm mb-1">Força Principal</p>
              <p className="text-xl font-bold text-blue-900">{profile.primary_strength}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border-l-4 border-purple-600">
              <p className="text-gray-600 text-sm mb-1">Perfil Wealth Dynamics</p>
              <p className="text-xl font-bold text-purple-900">{profile.wealth_dynamic}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border-l-4 border-green-600">
              <p className="text-gray-600 text-sm mb-1">Proficiência com IA</p>
              <p className="text-xl font-bold text-green-900">{profile.ai_proficiency}</p>
            </div>
          </div>

          {/* Narrative */}
          <div className="bg-gray-50 rounded-lg p-6 border-l-4 border-blue-600">
            <p className="text-gray-800 leading-relaxed italic">{profile.narrative}</p>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex gap-4 mb-8 border-b border-gray-200 bg-white rounded-t-lg overflow-hidden">
          {(['overview', 'blueprint', 'squad', 'frameworks'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-4 px-6 font-medium text-center transition-colors ${
                activeTab === tab
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-gray-50'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab === 'overview' && '📊 Visão Geral'}
              {tab === 'blueprint' && '🎯 Blueprint 90 Dias'}
              {tab === 'squad' && '👥 Squad Ideal'}
              {tab === 'frameworks' && '📚 Análise de Frameworks'}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-b-lg shadow-md p-8">
          {/* Visão Geral */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Forças Complementares</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.secondary_strengths.map((strength, idx) => (
                    <div
                      key={idx}
                      className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200"
                    >
                      <p className="text-sm text-gray-600">Força #{idx + 1}</p>
                      <p className="text-lg font-semibold text-gray-900">{strength}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Tolerância a Risco</h4>
                  <p className="text-gray-700 bg-blue-50 rounded-lg p-4 border-l-4 border-blue-600">
                    {profile.risk_tolerance}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Tempo Disponível</h4>
                  <p className="text-gray-700 bg-blue-50 rounded-lg p-4 border-l-4 border-blue-600">
                    {profile.available_time}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Principal Bloqueio</h4>
                <div className="bg-red-50 rounded-lg p-6 border-l-4 border-red-600">
                  <p className="text-gray-800">{profile.main_blocker}</p>
                  <p className="text-sm text-gray-600 mt-2">
                    💡 Foco: Identifique ações para superar este bloqueio
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Meta de Receita</h4>
                <div className="bg-green-50 rounded-lg p-6 border-l-4 border-green-600">
                  <p className="text-lg font-semibold text-gray-900">{profile.revenue_goal}</p>
                  <p className="text-sm text-gray-600 mt-2">
                    📈 Objetivamente definida para os próximos 6 meses
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Blueprint 90 Dias */}
          {activeTab === 'blueprint' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Seu Plano 90 Dias</h3>
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 border-l-4 border-blue-600 mb-6">
                  <p className="text-sm text-gray-600 mb-2">Objetivo Primário</p>
                  <p className="text-xl font-bold text-gray-900">{profile.blueprint.objective}</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-4">📋 Marcos Semanais</h4>
                <div className="space-y-3">
                  {profile.blueprint.weekly_milestones.map((milestone: string, idx: number) => (
                    <div key={idx} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                        {idx + 1}
                      </div>
                      <p className="text-gray-800">{milestone}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-4">⭐ Práticas Diárias</h4>
                <ul className="space-y-2">
                  {profile.blueprint.daily_practices.map((practice: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                      <span className="text-blue-600 font-bold">✓</span>
                      <span className="text-gray-800">{practice}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-4">📊 Métricas de Sucesso</h4>
                <ul className="space-y-2">
                  {profile.blueprint.success_metrics.map((metric: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                      <span className="text-green-600 font-bold">🎯</span>
                      <span className="text-gray-800">{metric}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-4">🛠️ Recursos Necessários</h4>
                <ul className="space-y-2">
                  {profile.blueprint.resources_needed.map((resource: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                      <span className="text-purple-600 font-bold">→</span>
                      <span className="text-gray-800">{resource}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Squad Ideal */}
          {activeTab === 'squad' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">👥 Sua Equipe Ideal</h3>
                <p className="text-gray-600 mb-6">
                  Estas são as pessoas que complementam suas forças e cobrem seus pontos cegos.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {profile.squad_recommendations.map((rec: any, idx: number) => (
                    <div
                      key={idx}
                      className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200"
                    >
                      <div className="text-3xl mb-3">
                        {idx === 0 ? '🎯' : idx === 1 ? '⚡' : '🔧'}
                      </div>
                      <h4 className="font-bold text-lg text-gray-900 mb-2">{rec.role}</h4>
                      <p className="text-gray-700 mb-4">{rec.description}</p>
                      <div className="bg-white rounded-lg p-3 border-l-4 border-purple-600">
                        <p className="text-sm text-gray-600">
                          <strong>Por quê:</strong> {rec.why}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Análise de Frameworks */}
          {activeTab === 'frameworks' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">📚 Análise dos 7 Frameworks</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(profile.frameworks_analysis).map(([key, analysis]: [string, any]) => (
                  <div key={key} className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg p-6 border border-gray-200">
                    <h4 className="font-bold text-gray-900 mb-3">{analysis.framework}</h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-semibold text-gray-600 mb-1">Insight</p>
                        <p className="text-gray-800">{analysis.insight}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-600 mb-1">Recomendação</p>
                        <p className="text-gray-800 bg-blue-100 rounded p-2">
                          {analysis.recommendation}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer with CTA */}
        <div className="mt-8 bg-blue-50 border-l-4 border-blue-600 rounded-lg p-6 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">🚀 Próximos Passos</h3>
          <p className="text-gray-700 mb-4">
            Agora que você conhece seu perfil, é hora de agir! Compartilhe com seu gestor ou
            mentor para alinhamento de objetivos.
          </p>
          <button
            onClick={() => router.push('/dashboard/assessment')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
          >
            ← Voltar ao Dashboard
          </button>
        </div>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          .no-print {
            display: none;
          }
          body {
            background: white;
          }
        }
      `}</style>
    </div>
  );
}

function generatePrintableHTML(profile: GeniusProfile): string {
  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Perfil de Genialidade - ${profile.user_name}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .page { page-break-after: always; padding: 40px; max-width: 800px; margin: 0 auto; }
        h1 { color: #2855FF; border-bottom: 3px solid #2855FF; padding-bottom: 10px; }
        h2 { color: #2855FF; margin-top: 30px; border-left: 5px solid #2855FF; padding-left: 15px; }
        h3 { color: #333; margin-top: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .highlight { background-color: #E8F0FF; padding: 15px; border-radius: 8px; margin: 15px 0; }
        .section { margin: 25px 0; }
        .blueprint-item { background-color: #f9f9f9; padding: 12px; margin: 10px 0; border-left: 4px solid #2855FF; }
        ul { margin: 10px 0; padding-left: 20px; }
        li { margin: 8px 0; }
        .generated { font-size: 12px; color: #666; margin-top: 30px; text-align: center; border-top: 1px solid #ddd; padding-top: 15px; }
      </style>
    </head>
    <body>
      <div class="page">
        <div class="header">
          <h1>🧠 Seu Perfil de Genialidade</h1>
          <p><strong>Nome:</strong> ${profile.user_name}</p>
          <p><strong>Data:</strong> ${new Date(profile.created_at).toLocaleDateString('pt-BR')}</p>
        </div>

        <h2>Sua Narrativa</h2>
        <div class="highlight">
          <p>${profile.narrative}</p>
        </div>

        <h2>Suas Forças</h2>
        <h3>Força Principal: ${profile.primary_strength}</h3>
        <h3>Forças Complementares:</h3>
        <ul>
          ${profile.secondary_strengths.map((s) => `<li>${s}</li>`).join('')}
        </ul>

        <h2>Seu Plano 90 Dias</h2>
        <h3>Objetivo: ${profile.blueprint.objective}</h3>

        <h3>Marcos Semanais:</h3>
        ${profile.blueprint.weekly_milestones.map((m: string) => `<div class="blueprint-item">${m}</div>`).join('')}

        <h3>Práticas Diárias:</h3>
        <ul>
          ${profile.blueprint.daily_practices.map((p: string) => `<li>${p}</li>`).join('')}
        </ul>

        <h3>Métricas de Sucesso:</h3>
        <ul>
          ${profile.blueprint.success_metrics.map((m: string) => `<li>${m}</li>`).join('')}
        </ul>

        <h3>Recursos Necessários:</h3>
        <ul>
          ${profile.blueprint.resources_needed.map((r: string) => `<li>${r}</li>`).join('')}
        </ul>

        <h2>Sua Equipe Ideal</h2>
        ${profile.squad_recommendations
          .map(
            (rec: any) => `
            <div class="section">
              <h3>${rec.role}</h3>
              <p><strong>Descrição:</strong> ${rec.description}</p>
              <p><strong>Por quê:</strong> ${rec.why}</p>
            </div>
          `
          )
          .join('')}

        <h2>Análise dos 7 Frameworks</h2>
        ${Object.entries(profile.frameworks_analysis)
          .map(
            ([_, analysis]: [string, any]) => `
            <div class="section">
              <h3>${analysis.framework}</h3>
              <p><strong>Insight:</strong> ${analysis.insight}</p>
              <p><strong>Recomendação:</strong> ${analysis.recommendation}</p>
            </div>
          `
          )
          .join('')}

        <div class="generated">
          <p>Relatório gerado automaticamente pelo sistema Zona de Genialidade</p>
          <p>${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
