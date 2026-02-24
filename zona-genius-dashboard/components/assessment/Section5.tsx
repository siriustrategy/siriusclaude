'use client';

import { Assessment } from '@/types/assessment';
import { useState } from 'react';

interface Section5Props {
  data: Partial<Assessment>;
  onChange: (data: Partial<Assessment>) => void;
  onSubmit: () => void;
  onBack: () => void;
}

export default function Section5({ data, onChange, onSubmit, onBack }: Section5Props) {
  const [errors, setErrors] = useState<string[]>([]);

  const handleChange = (field: string, value: any) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const validateSection = () => {
    const newErrors: string[] = [];

    if (!data.section_5_resultado_90_dias?.trim()) {
      newErrors.push('Resultado de 90 dias é obrigatório');
    }
    if (!data.section_5_meta_receita_mensal?.trim()) {
      newErrors.push('Meta de receita é obrigatória');
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = () => {
    if (validateSection()) {
      onSubmit();
    }
  };

  return (
    <div className="assessment-section">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Seção 5: Sua Visão</h2>
        <p className="text-gray-600 mt-2">Seus objetivos e aspirações para os próximos 90 dias</p>
      </div>

      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <ul className="list-disc list-inside space-y-1">
            {errors.map((error, i) => (
              <li key={i} className="text-red-700 text-sm">
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="form-group">
        <label className="form-label">
          Qual seria seu resultado ideal nos próximos 90 dias?
        </label>
        <textarea
          className="form-textarea"
          placeholder="Sua visão para os próximos 3 meses..."
          rows={4}
          value={data.section_5_resultado_90_dias || ''}
          onChange={(e) => handleChange('section_5_resultado_90_dias', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">
          Qual é sua meta de receita mensal para os próximos 6 meses?
        </label>
        <input
          type="text"
          className="form-input"
          placeholder="Ex: R$ 5.000 a R$ 10.000"
          value={data.section_5_meta_receita_mensal || ''}
          onChange={(e) => handleChange('section_5_meta_receita_mensal', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Qual é seu maior bloqueio neste momento?</label>
        <textarea
          className="form-textarea"
          placeholder="Desafios, medo, falta de conhecimento..."
          rows={3}
          value={data.section_5_maior_bloqueio || ''}
          onChange={(e) => handleChange('section_5_maior_bloqueio', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">
          Quanto tempo você tem disponível por semana?
        </label>
        <select
          className="form-select"
          value={data.section_5_tempo_disponivel || ''}
          onChange={(e) => handleChange('section_5_tempo_disponivel', e.target.value)}
        >
          <option value="">Selecione...</option>
          <option value="5-10 horas">5-10 horas</option>
          <option value="10-20 horas">10-20 horas</option>
          <option value="20-30 horas">20-30 horas</option>
          <option value="30-40 horas">30-40 horas</option>
          <option value="40+ horas">40+ horas</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">
          Qual é seu nível de proficiência com IA/Automações?
        </label>
        <select
          className="form-select"
          value={data.section_5_nivel_ai || ''}
          onChange={(e) => handleChange('section_5_nivel_ai', e.target.value)}
        >
          <option value="">Selecione...</option>
          <option value="Iniciante">Iniciante</option>
          <option value="Intermediário">Intermediário</option>
          <option value="Intermediário/Avançado">Intermediário/Avançado</option>
          <option value="Avançado">Avançado</option>
          <option value="Especialista">Especialista</option>
        </select>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
        <p className="text-blue-900 text-sm">
          ✅ Parabéns! Você está prestes a completar o assessment. Depois de enviar, você
          receberá uma análise completa baseada nos 7 frameworks de desenvolvimento pessoal.
        </p>
      </div>

      <div className="flex gap-4 mt-8">
        <button onClick={onBack} className="btn-secondary flex-1">
          ← Voltar
        </button>
        <button onClick={handleSubmit} className="btn-primary flex-1">
          🎉 Enviar e Ver Resultados
        </button>
      </div>
    </div>
  );
}
