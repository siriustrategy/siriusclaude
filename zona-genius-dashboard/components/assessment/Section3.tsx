'use client';

import { Assessment } from '@/types/assessment';
import { useState } from 'react';

interface Section3Props {
  data: Partial<Assessment>;
  onChange: (data: Partial<Assessment>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Section3({ data, onChange, onNext, onBack }: Section3Props) {
  const [errors, setErrors] = useState<string[]>([]);

  const handleChange = (field: string, value: any) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const validateSection = () => {
    const newErrors: string[] = [];

    if (!data.section_3_padrao_sucesso?.trim()) {
      newErrors.push('Padrão de sucesso é obrigatório');
    }
    if (!data.section_3_dominio_strengths?.trim()) {
      newErrors.push('Seu domínio de forças é obrigatório');
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
        <h2 className="text-2xl font-bold text-gray-900">Seção 3: Seus Talentos</h2>
        <p className="text-gray-600 mt-2">Suas forças e o que as pessoas apreciam em você</p>
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
          Qual é o padrão nos seus sucessos/vitórias?
        </label>
        <textarea
          className="form-textarea"
          placeholder="O que eles têm em comum?"
          rows={3}
          value={data.section_3_padrao_sucesso || ''}
          onChange={(e) => handleChange('section_3_padrao_sucesso', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Como os outros te descrevem?</label>
        <input
          type="text"
          className="form-input"
          placeholder="Adjetivos que usam para você..."
          value={data.section_3_como_outros_descrevem || ''}
          onChange={(e) => handleChange('section_3_como_outros_descrevem', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Qual é a sua facilidade natural/inata?</label>
        <textarea
          className="form-textarea"
          placeholder="O que você faz naturalmente bem?"
          rows={3}
          value={data.section_3_facilidade_natural || ''}
          onChange={(e) => handleChange('section_3_facilidade_natural', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Qual é seu domínio de forças?</label>
        <input
          type="text"
          className="form-input"
          placeholder="Área em que você é muito forte..."
          value={data.section_3_dominio_strengths || ''}
          onChange={(e) => handleChange('section_3_dominio_strengths', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Qual é a frustração mais recorrente?</label>
        <textarea
          className="form-textarea"
          placeholder="O que mais te frustra?"
          rows={3}
          value={data.section_3_frustracao_recorrente || ''}
          onChange={(e) => handleChange('section_3_frustracao_recorrente', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Qual é seu estilo de comunicação?</label>
        <select
          className="form-select"
          value={data.section_3_estilo_comunicacao || ''}
          onChange={(e) => handleChange('section_3_estilo_comunicacao', e.target.value)}
        >
          <option value="">Selecione...</option>
          <option value="Direto e objetivo">Direto e objetivo</option>
          <option value="Amigável e detalhado">Amigável e detalhado</option>
          <option value="Inspirador e visão">Inspirador e visão</option>
          <option value="Analítico e dados">Analítico e dados</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Como você aprende melhor?</label>
        <textarea
          className="form-textarea"
          placeholder="Vídeos, leitura, conversas, aprender fazendo..."
          rows={3}
          value={data.section_3_estilo_aprendizado || ''}
          onChange={(e) => handleChange('section_3_estilo_aprendizado', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Como você reage ao feedback crítico?</label>
        <select
          className="form-select"
          value={data.section_3_reacao_feedback || ''}
          onChange={(e) => handleChange('section_3_reacao_feedback', e.target.value)}
        >
          <option value="">Selecione...</option>
          <option value="Fico defensivo">Fico defensivo</option>
          <option value="Levo pessoalmente">Levo pessoalmente</option>
          <option value="Analiso friamente">Analiso friamente</option>
          <option value="Ignoro na maioria">Ignoro na maioria</option>
          <option value="Peço mais detalhes">Peço mais detalhes</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">
          Como gostaria de contribuir para o mundo?
        </label>
        <textarea
          className="form-textarea"
          placeholder="Seu impacto desejado..."
          rows={3}
          value={data.section_3_contribuicao_mundo || ''}
          onChange={(e) => handleChange('section_3_contribuicao_mundo', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">
          Competência vs Genialidade - onde você está?
        </label>
        <textarea
          className="form-textarea"
          placeholder="O que é competência para você vs genialidade?"
          rows={3}
          value={data.section_3_competencia_vs_genialidade || ''}
          onChange={(e) => handleChange('section_3_competencia_vs_genialidade', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Qual é sua principal força?</label>
        <textarea
          className="form-textarea"
          placeholder="O que você faria se o mundo dependesse disso?"
          rows={3}
          value={data.section_3_principal_forca || ''}
          onChange={(e) => handleChange('section_3_principal_forca', e.target.value)}
        />
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
