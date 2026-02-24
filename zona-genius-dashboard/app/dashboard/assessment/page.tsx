'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Assessment, User } from '@/types/assessment';
import ProgressBar from '@/components/shared/ProgressBar';
import Section1 from '@/components/assessment/Section1';
import Section2 from '@/components/assessment/Section2';
import Section3 from '@/components/assessment/Section3';
import Section4 from '@/components/assessment/Section4';
import Section5 from '@/components/assessment/Section5';
import { updateAssessment } from '@/lib/api';

export default function AssessmentPage() {
  const router = useRouter();
  const [currentSection, setCurrentSection] = useState(1);
  const [assessment, setAssessment] = useState<Partial<Assessment>>({});
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const initAssessment = async () => {
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

        // Get or create assessment
        const { data: assessmentData, error: assessmentError } = await supabase
          .from('assessments')
          .select('*')
          .eq('user_id', authUser.id)
          .eq('status', 'em_progresso')
          .single();

        if (assessmentError && assessmentError.code === 'PGRST116') {
          // No assessment found, create new one
          const { data: newAssessment, error: createError } = await supabase
            .from('assessments')
            .insert([
              {
                user_id: authUser.id,
                organization_id: userData.organization_id,
                status: 'em_progresso',
                completeness: '0%',
              },
            ])
            .select()
            .single();

          if (createError) throw createError;
          setAssessment(newAssessment);
        } else if (assessmentError) {
          throw assessmentError;
        } else {
          setAssessment(assessmentData);
        }
      } catch (error) {
        console.error('Error initializing assessment:', error);
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    initAssessment();
  }, [router]);

  const handleSectionChange = (data: Partial<Assessment>) => {
    setAssessment({ ...assessment, ...data });
  };

  const handleNext = async () => {
    setSaving(true);
    try {
      if (assessment.id) {
        await updateAssessment(assessment.id, assessment);
      }
      if (currentSection < 5) {
        setCurrentSection(currentSection + 1);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      if (assessment.id) {
        await updateAssessment(assessment.id, {
          ...assessment,
          status: 'completo',
          completeness: '100%',
          completed_at: new Date().toISOString(),
        });
        router.push(`/dashboard/results/${assessment.id}`);
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Carregando...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">🧠 Zona de Genialidade</h1>
          <p className="text-gray-600 mt-2">
            Bem-vindo, {user?.full_name}! Complete o assessment para descobrir seu potencial.
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8 bg-white rounded-lg shadow-sm p-6">
          <ProgressBar
            current={currentSection}
            total={5}
            label={`Seção ${currentSection} de 5`}
          />
        </div>

        {/* Form Sections */}
        <div className="bg-white rounded-lg shadow-md">
          {currentSection === 1 && (
            <Section1
              data={assessment}
              onChange={handleSectionChange}
              onNext={handleNext}
            />
          )}

          {currentSection === 2 && (
            <Section2
              data={assessment}
              onChange={handleSectionChange}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {currentSection === 3 && (
            <Section3
              data={assessment}
              onChange={handleSectionChange}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {currentSection === 4 && (
            <Section4
              data={assessment}
              onChange={handleSectionChange}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {currentSection === 5 && (
            <Section5
              data={assessment}
              onChange={handleSectionChange}
              onSubmit={handleSubmit}
              onBack={handleBack}
            />
          )}
        </div>

        {/* Saving indicator */}
        {saving && (
          <div className="mt-4 text-center text-sm text-gray-600">
            Salvando progresso...
          </div>
        )}
      </div>
    </main>
  );
}
