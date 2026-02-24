'use client';

import { Assessment } from '@/types/assessment';
import { useState } from 'react';

interface Section1Props {
  data: Partial<Assessment>;
  onChange: (data: Partial<Assessment>) => void;
  onNext: () => void;
}

export default function Section1({ data, onChange, onNext }: Section1Props) {
  const [errors, setErrors] = useState<string[]>([]);

  const handleChange = (field: string, value: any) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const validateSection = () => {
    const newErrors: string[] = [];

    if (!data.section_1_nome?.trim()) {
      newErrors.push('Nome completo é obrigatório');
    }
    if (!data.section_1_area_atuacao?.trim()) {
      newErrors.push('Área de atuação é obrigatória');
    }
    if (!data.section_1_tempo_experiencia) {
      newErrors.push('Tempo de experiência é obrigatório');
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = () => {
    if (validateSection()) {
      onNext();
    }
  };

  return (
    <div className="assessment-section">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Seção 1: Quem Você É?</h2>
        <p className="text-gray-600 mt-2">Conte-nos sobre você em detalhes</p>
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
        <label className="form-label">Qual é o seu nome completo?</label>
        <input
          type="text"
          className="form-input"
          placeholder="Ex: Breno Nobre"
          value={data.section_1_nome || ''}
          onChange={(e) => handleChange('section_1_nome', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">
          Qual é sua área de atuação? (Ex: Tecnologia, Marketing, etc.)
        </label>
        <input
          type="text"
          className="form-input"
          placeholder="Tecnologia, IA, Marketing Digital, Growth"
          value={data.section_1_area_atuacao || ''}
          onChange={(e) => handleChange('section_1_area_atuacao', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Quanto tempo de experiência você tem?</label>
        <select
          className="form-select"
          value={data.section_1_tempo_experiencia || ''}
          onChange={(e) => handleChange('section_1_tempo_experiencia', e.target.value)}
        >
          <option value="">Selecione...</option>
          <option value="0-1 ano">0-1 ano</option>
          <option value="1-3 anos">1-3 anos</option>
          <option value="3-5 anos">3-5 anos</option>
          <option value="5-10 anos">5-10 anos</option>
          <option value="10+ anos">10+ anos</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Descreva um dia típico seu</label>
        <textarea
          className="form-textarea"
          placeholder="Como passa seu tempo? O que faz?"
          rows={4}
          value={data.section_1_descricao_dia_a_dia || ''}
          onChange={(e) => handleChange('section_1_descricao_dia_a_dia', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">
          Se dinheiro não fosse problema, o que você faria da vida?
        </label>
        <textarea
          className="form-textarea"
          placeholder="Seus sonhos e aspirações..."
          rows={4}
          value={data.section_1_se_dinheiro_nao_importasse || ''}
          onChange={(e) => handleChange('section_1_se_dinheiro_nao_importasse', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">
          Você é mais introvertido ou extrovertido?
        </label>
        <select
          className="form-select"
          value={data.section_1_espectro_introextro || ''}
          onChange={(e) => handleChange('section_1_espectro_introextro', e.target.value)}
        >
          <option value="">Selecione...</option>
          <option value="Muito introvertido">Muito introvertido</option>
          <option value="Mais introvertido">Mais introvertido</option>
          <option value="Equilibrado">Equilibrado</option>
          <option value="Mais extrovertido">Mais extrovertido</option>
          <option value="Muito extrovertido">Muito extrovertido</option>
        </select>
      </div>

      <div className="flex gap-4 mt-8">
        <button
          onClick={handleSubmit}
          className="btn-primary flex-1"
        >
          Próximo →
        </button>
      </div>
    </div>
  );
}
