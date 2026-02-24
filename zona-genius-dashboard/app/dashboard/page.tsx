'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { User, Assessment } from '@/types/assessment';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
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

        // Get assessments
        let query = supabase.from('assessments').select('*');

        // If gestor, get all team assessments; otherwise get own only
        if (userData.role === 'gestor') {
          query = query.eq('organization_id', userData.organization_id);
        } else {
          query = query.eq('user_id', authUser.id);
        }

        const { data: assessmentData, error: assessmentError } = await query.order(
          'created_at',
          { ascending: false }
        );

        if (assessmentError) throw assessmentError;
        setAssessments(assessmentData || []);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [router]);

  const handleNewAssessment = async () => {
    try {
      if (!user) return;

      const { data: newAssessment, error } = await supabase
        .from('assessments')
        .insert([
          {
            user_id: user.id,
            organization_id: user.organization_id,
            status: 'em_progresso',
            completeness: '0%',
          },
        ])
        .select()
        .single();

      if (error) throw error;

      router.push('/dashboard/assessment');
    } catch (err) {
      console.error('Error creating assessment:', err);
      setError('Erro ao criar assessment');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completo':
        return 'bg-green-100 text-green-800';
      case 'em_progresso':
        return 'bg-blue-100 text-blue-800';
      case 'rascunho':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completo':
        return '✅ Completo';
      case 'em_progresso':
        return '⏳ Em Progresso';
      case 'rascunho':
        return '📝 Rascunho';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🧠 Zona de Genialidade Dashboard
          </h1>
          <p className="text-gray-600">
            Bem-vindo, <strong>{user?.full_name}</strong>!
          </p>
          {user?.role === 'gestor' && (
            <p className="text-sm text-blue-600 font-medium mt-1">
              👤 Você é GESTOR - Visualizando todos os assessments da equipe
            </p>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-8 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Comece seu Assessment</h2>
              <p className="text-blue-100">
                Descubra seu perfil de genialidade e crie seu plano de ação 90 dias
              </p>
            </div>
            <button
              onClick={handleNewAssessment}
              className="bg-white text-blue-600 font-bold px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors"
            >
              + Novo Assessment
            </button>
          </div>
        </div>

        {/* Assessments Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Meus Assessments {assessments.length > 0 && `(${assessments.length})`}
            </h3>
          </div>

          {assessments.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500 text-lg mb-4">
                Nenhum assessment iniciado ainda
              </p>
              <button
                onClick={handleNewAssessment}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Começar Agora
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Usuário
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Progresso
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Data
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Ação
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {assessments.map((assessment) => {
                    const isCompleted = assessment.status === 'completo';
                    const isInProgress = assessment.status === 'em_progresso';

                    return (
                      <tr key={assessment.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm">
                          <div>
                            <p className="font-medium text-gray-900">Assessment</p>
                            <p className="text-gray-600 text-xs">
                              ID: {assessment.id.substring(0, 8)}...
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(assessment.status)}`}>
                            {getStatusLabel(assessment.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full transition-all"
                                style={{
                                  width: assessment.completeness || '0%',
                                }}
                              ></div>
                            </div>
                            <span className="text-gray-600 font-medium">
                              {assessment.completeness || '0%'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(assessment.created_at || '').toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {isCompleted ? (
                            <Link
                              href={`/dashboard/results/${assessment.id}`}
                              className="text-blue-600 hover:text-blue-700 font-medium"
                            >
                              Ver Resultado →
                            </Link>
                          ) : isInProgress ? (
                            <button
                              onClick={() => router.push('/dashboard/assessment')}
                              className="text-blue-600 hover:text-blue-700 font-medium"
                            >
                              Continuar →
                            </button>
                          ) : (
                            <button
                              onClick={() => router.push('/dashboard/assessment')}
                              className="text-blue-600 hover:text-blue-700 font-medium"
                            >
                              Iniciar →
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="font-semibold text-gray-900 mb-2">💡 Como Funciona?</h4>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Preencha as 5 seções do assessment com sinceridade</li>
            <li>Seu perfil de genialidade será gerado automaticamente</li>
            <li>Receba seu plano de ação personalizado 90 dias</li>
            <li>Visualize recomendações de squad ideal</li>
            <li>Baixe seu relatório em PDF</li>
          </ol>
        </div>
      </div>
    </main>
  );
}
