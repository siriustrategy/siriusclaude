'use client';

import { Assessment } from '@/types/assessment';
import { useState } from 'react';

interface Section2Props {
  data: Partial<Assessment>;
  onChange: (data: Partial<Assessment>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Section2({ data, onChange, onNext, onBack }: Section2Props) {
  const [errors, setErrors] = useState<string[]>([]);

  const handleChange = (field: string, value: any) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const handleArrayChange = (field: string, value: string[]) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const validateSection = () => {
    const newErrors: string[] = [];

    if (!data.section_2_atividades_drenam || data.section_2_atividades_drenam.length === 0) {
      newErrors.push('Selecione pelo menos uma atividade que drena');
    }
    if (!data.section_2_atividades_energizam || data.section_2_atividades_energizam.length === 0) {
      newErrors.push('Selecione pelo menos uma atividade que energiza');
    }
    if (!data.section_2_como_resolve_problemas?.trim()) {
      newErrors.push('Como você resolve problemas é obrigatório');
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = () => {
    if (validateSection()) {
      onNext();
    }
  };

  const activityOptions = [
    'Tarefas administrativas',
    'Trabalho repetitivo',
    'Reuniões longas',
    'Detalhes técnicos',
    'Execução operacional',
  ];

  const energyOptions = [
    'Criar coisas novas',
    'Ensinar e mentorar',
    'Estratégia e planejamento',
    'Inovação',
    'Resolver problemas',
  ];

  return (
    <div className="assessment-section">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Seção 2: Suas Atividades</h2>
        <p className="text-gray-600 mt-2">O que te energiza e o que drena sua energia</p>
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
          Quais atividades/tarefas drenam sua energia?
        </label>
        <div className="space-y-2">
          {activityOptions.map((option) => (
            <label key={option} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={(data.section_2_atividades_drenam || []).includes(option)}
                onChange={(e) => {
                  const current = data.section_2_atividades_drenam || [];
                  const updated = e.target.checked
                    ? [...current, option]
                    : current.filter((a) => a !== option);
                  handleArrayChange('section_2_atividades_drenam', updated);
                }}
                className="w-4 h-4"
              />
              <span className="text-gray-700">{option}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">
          Quais atividades/tarefas te energizam?
        </label>
        <div className="space-y-2">
          {energyOptions.map((option) => (
            <label key={option} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={(data.section_2_atividades_energizam || []).includes(option)}
                onChange={(e) => {
                  const current = data.section_2_atividades_energizam || [];
                  const updated = e.target.checked
                    ? [...current, option]
                    : current.filter((a) => a !== option);
                  handleArrayChange('section_2_atividades_energizam', updated);
                }}
                className="w-4 h-4"
              />
              <span className="text-gray-700">{option}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Pelo quê outras pessoas mais agradecem a você?</label>
        <textarea
          className="form-textarea"
          placeholder="O que você faz bem?"
          rows={3}
          value={data.section_2_outros_agradecem_por || ''}
          onChange={(e) => handleChange('section_2_outros_agradecem_por', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">
          Em quais atividades você sente que perde tempo?
        </label>
        <textarea
          className="form-textarea"
          placeholder="Atividades que não deveria estar focando..."
          rows={3}
          value={data.section_2_perde_tempo_em || ''}
          onChange={(e) => handleChange('section_2_perde_tempo_em', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Como você gosta de iniciar projetos?</label>
        <textarea
          className="form-textarea"
          placeholder="Seu estilo de iniciar..."
          rows={3}
          value={data.section_2_como_inicia_projetos || ''}
          onChange={(e) => handleChange('section_2_como_inicia_projetos', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Como você resolve problemas típicos?</label>
        <select
          className="form-select"
          value={data.section_2_como_resolve_problemas || ''}
          onChange={(e) => handleChange('section_2_como_resolve_problemas', e.target.value)}
        >
          <option value="">Selecione...</option>
          <option value="Paro e analiso todas as opções">Paro e analiso todas as opções</option>
          <option value="Ajo rapidamente por intuição">Ajo rapidamente por intuição</option>
          <option value="Delego para alguém">Delego para alguém</option>
          <option value="Pesquiso soluções prontas">Pesquiso soluções prontas</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Você prefere trabalhar com coisas concretas ou abstratas?</label>
        <select
          className="form-select"
          value={data.section_2_manual_vs_conceitual || ''}
          onChange={(e) => handleChange('section_2_manual_vs_conceitual', e.target.value)}
        >
          <option value="">Selecione...</option>
          <option value="Muito concreto">Muito concreto</option>
          <option value="Mais concreto">Mais concreto</option>
          <option value="Equilibrado">Equilibrado</option>
          <option value="Mais abstrato">Mais abstrato</option>
          <option value="Muito abstrato">Muito abstrato</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Como você se relaciona com detalhes?</label>
        <select
          className="form-select"
          value={data.section_2_nivel_detalhe || ''}
          onChange={(e) => handleChange('section_2_nivel_detalhe', e.target.value)}
        >
          <option value="">Selecione...</option>
          <option value="Muito detalhista">Muito detalhista</option>
          <option value="Detalhista">Detalhista</option>
          <option value="Equilibrado">Equilibrado</option>
          <option value="Visão ampla">Visão ampla</option>
          <option value="Muito visão ampla">Muito visão ampla</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Como você se sente com delegação?</label>
        <textarea
          className="form-textarea"
          placeholder="Delega facilmente?"
          rows={3}
          value={data.section_2_estilo_delegacao || ''}
          onChange={(e) => handleChange('section_2_estilo_delegacao', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Qual é seu ritmo de trabalho ideal?</label>
        <textarea
          className="form-textarea"
          placeholder="Em que horas do dia funciona melhor?"
          rows={3}
          value={data.section_2_ritmo_trabalho || ''}
          onChange={(e) => handleChange('section_2_ritmo_trabalho', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Você prefere inovar ou otimizar?</label>
        <select
          className="form-select"
          value={data.section_2_inovacao_vs_otimizacao || ''}
          onChange={(e) => handleChange('section_2_inovacao_vs_otimizacao', e.target.value)}
        >
          <option value="">Selecione...</option>
          <option value="Criar do zero">Criar do zero</option>
          <option value="Mais criar">Mais criar</option>
          <option value="Equilibrado">Equilibrado</option>
          <option value="Mais otimizar">Mais otimizar</option>
          <option value="Otimizar existentes">Otimizar existentes</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Foco ou multitask?</label>
        <select
          className="form-select"
          value={data.section_2_foco_vs_multitask || ''}
          onChange={(e) => handleChange('section_2_foco_vs_multitask', e.target.value)}
        >
          <option value="">Selecione...</option>
          <option value="Foco total em uma">Foco total em uma</option>
          <option value="Melhor com foco">Melhor com foco</option>
          <option value="Ambos funcionam">Ambos funcionam</option>
          <option value="Melhor com múltiplos">Melhor com múltiplos</option>
          <option value="Preciso de múltiplos">Preciso de múltiplos</option>
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
