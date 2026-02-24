'use client';

import { Assessment } from '@/types/assessment';
import { useState } from 'react';

interface Section4Props {
  data: Partial<Assessment>;
  onChange: (data: Partial<Assessment>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Section4({ data, onChange, onNext, onBack }: Section4Props) {
  const [errors, setErrors] = useState<string[]>([]);

  const handleChange = (field: string, value: any) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const validateSection = () => {
    const newErrors: string[] = [];

    if (!data.section_4_modelo_preferido?.trim()) {
      newErrors.push('Modelo de negócio preferido é obrigatório');
    }
    if (!data.section_4_tolerancia_risco) {
      newErrors.push('Tolerância a risco é obrigatória');
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
        <h2 className="text-2xl font-bold text-gray-900">Seção 4: Seu Negócio</h2>
        <p className="text-gray-600 mt-2">Seu modelo de negócio ideal e relação com o mercado</p>
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
        <label className="form-label">Qual é seu modelo de negócio ideal?</label>
        <textarea
          className="form-textarea"
          placeholder="Produtos digitais, consultoria, membros, empresa própria..."
          rows={3}
          value={data.section_4_modelo_preferido || ''}
          onChange={(e) => handleChange('section_4_modelo_preferido', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Qual é sua tolerância a risco?</label>
        <select
          className="form-select"
          value={data.section_4_tolerancia_risco || ''}
          onChange={(e) => handleChange('section_4_tolerancia_risco', e.target.value)}
        >
          <option value="">Selecione...</option>
          <option value="Muito conservador">Muito conservador</option>
          <option value="Conservador">Conservador</option>
          <option value="Equilibrado">Equilibrado</option>
          <option value="Amo risco">Amo risco</option>
          <option value="Muito alto risco">Muito alto risco</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Você prefere trabalhar solo ou em time?</label>
        <select
          className="form-select"
          value={data.section_4_solo_vs_time || ''}
          onChange={(e) => handleChange('section_4_solo_vs_time', e.target.value)}
        >
          <option value="">Selecione...</option>
          <option value="Sempre solo">Sempre solo</option>
          <option value="Prefiro solo">Prefiro solo</option>
          <option value="Equilibrado">Equilibrado</option>
          <option value="Prefiro time">Prefiro time</option>
          <option value="Sempre em time">Sempre em time</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Como você pensa em timing/oportunidades de mercado?</label>
        <textarea
          className="form-textarea"
          placeholder="Ser primeiro, entrar cedo, fast follower..."
          rows={3}
          value={data.section_4_timing_mercado || ''}
          onChange={(e) => handleChange('section_4_timing_mercado', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Qual seria sua fonte de receita ideal?</label>
        <textarea
          className="form-textarea"
          placeholder="SaaS, produtos digitais, consultoria, passiva..."
          rows={3}
          value={data.section_4_fonte_receita_ideal || ''}
          onChange={(e) => handleChange('section_4_fonte_receita_ideal', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">
          Como você se relaciona com precificação?
        </label>
        <textarea
          className="form-textarea"
          placeholder="Entende seu valor? Preça alto ou baixo?"
          rows={3}
          value={data.section_4_relacao_preco || ''}
          onChange={(e) => handleChange('section_4_relacao_preco', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Escala vs profundidade?</label>
        <select
          className="form-select"
          value={data.section_4_escala_vs_profundidade || ''}
          onChange={(e) => handleChange('section_4_escala_vs_profundidade', e.target.value)}
        >
          <option value="">Selecione...</option>
          <option value="Poucos com profundidade">Poucos com profundidade</option>
          <option value="Melhor poucos">Melhor poucos</option>
          <option value="Equilibrado">Equilibrado</option>
          <option value="Melhor muitos">Melhor muitos</option>
          <option value="Escala máxima">Escala máxima</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Seu perfil Wealth Dynamics?</label>
        <select
          className="form-select"
          value={data.section_4_perfil_wealth_dynamics || ''}
          onChange={(e) => handleChange('section_4_perfil_wealth_dynamics', e.target.value)}
        >
          <option value="">Selecione...</option>
          <option value="CRIADOR">CRIADOR - Ideias, começa coisas novas</option>
          <option value="MECHANIC">MECHANIC - Executa, otimiza sistemas</option>
          <option value="DEAL MAKER">DEAL MAKER - Vê oportunidades, negocia</option>
          <option value="STAR">STAR - Carisma, presença, inspira</option>
          <option value="SUPPORTER">SUPPORTER - Suporta, equipe</option>
          <option value="ACCUMULATOR">ACCUMULATOR - Acumula riqueza</option>
        </select>
      </div>

      <div className="flex gap-4 mt-8">
        <button onClick={onBack} className="btn-secondary flex-1">
          ← Voltar
        </button>
        <button onClick={handleSubmit} className="btn-primary flex-1">
          Próximo →
        </button>
      </div>
    </div>
  );
}
