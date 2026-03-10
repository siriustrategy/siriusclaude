'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Users, Search, Filter, Download, Upload, X, Phone, Mail, MapPin, Tag, MessageSquare, FileText, Clock, ChevronRight, AlertTriangle, Star, UserCheck } from 'lucide-react'
import { Lead, FaseCobranca } from '@/types'
import { formatCurrency, formatRelativeTime, getFaseBadge, getRiscoBadge, getAvatarColor } from '@/lib/utils'

// ============================================================
// MOCK DATA — será substituído por Supabase no Epic 02 oficial
// ============================================================
const mockLeads: Lead[] = [
  {
    id: '1', nome: 'Maria Santos', telefone: '(21) 99999-1111', email: 'maria@email.com', cpf: '123.456.789-01',
    plano: 'Plano Essencial', valor_mensalidade: 189.90, data_vencimento: '2026-02-23',
    status: 'inadimplente', dias_atraso: 15, valor_em_aberto: 189.90, fase_cobranca: 'mes1',
    idade: 34, cidade: 'Rio de Janeiro', bairro: 'Méier', profissao: 'Professora',
    tem_pet: false, num_pets: 0, tem_dependentes: true, num_dependentes: 2, idades_dependentes: [8, 11],
    score_reputacao: 72, risco_churn: 'baixo', desconto_ativo_percentual: 0,
    tags: ['tem filhos', 'boa pagadora'], ultima_interacao: '2026-03-08T10:00:00Z',
    ultima_mensagem_enviada: 'Olá Maria, notamos que seu plano venceu há 15 dias...',
    data_entrada: '2024-01-15T00:00:00Z', created_at: '2024-01-15T00:00:00Z', updated_at: '2026-03-08T10:00:00Z',
  },
  {
    id: '2', nome: 'João Oliveira', telefone: '(21) 98888-2222', email: 'joao.o@gmail.com',
    plano: 'Plano Premium', valor_mensalidade: 299.90, data_vencimento: '2025-12-23',
    status: 'inadimplente', dias_atraso: 75, valor_em_aberto: 599.80, fase_cobranca: 'mes3',
    idade: 45, cidade: 'Rio de Janeiro', bairro: 'Bangu', profissao: 'Motorista de app',
    tem_pet: true, num_pets: 1, tem_dependentes: false, num_dependentes: 0, idades_dependentes: [],
    score_reputacao: 45, risco_churn: 'medio', desconto_ativo_percentual: 5,
    tags: ['dificuldade financeira', 'tem pet'], ultima_interacao: '2026-03-05T14:30:00Z',
    ultima_mensagem_enviada: 'Entendemos sua situação, João. Temos um desconto de 5%...',
    data_entrada: '2023-06-10T00:00:00Z', created_at: '2023-06-10T00:00:00Z', updated_at: '2026-03-05T14:30:00Z',
  },
  {
    id: '3', nome: 'Ana Costa', telefone: '(21) 97777-3333', email: 'ana.costa@hotmail.com',
    plano: 'Plano Familiar', valor_mensalidade: 450.00, data_vencimento: '2025-11-23',
    status: 'inadimplente', dias_atraso: 107, valor_em_aberto: 1350.00, fase_cobranca: 'mes4',
    idade: 42, cidade: 'Rio de Janeiro', bairro: 'Campo Grande', profissao: 'Funcionária pública',
    tem_pet: false, num_pets: 0, tem_dependentes: true, num_dependentes: 3, idades_dependentes: [5, 9, 14],
    score_reputacao: 28, risco_churn: 'alto', desconto_ativo_percentual: 15,
    tags: ['quer cancelar', 'tem filhos', 'alta prioridade'], ultima_interacao: '2026-02-28T09:15:00Z',
    ultima_mensagem_enviada: 'Ana, sabemos que é difícil. Que tal parcelar em 3x?',
    data_entrada: '2022-03-20T00:00:00Z', created_at: '2022-03-20T00:00:00Z', updated_at: '2026-02-28T09:15:00Z',
  },
  {
    id: '4', nome: 'Carlos Pereira', telefone: '(21) 96666-4444', email: 'cpereiras@outlook.com',
    plano: 'Plano Essencial', valor_mensalidade: 189.90, data_vencimento: '2026-03-05',
    status: 'inadimplente', dias_atraso: 5, valor_em_aberto: 189.90, fase_cobranca: 'pre',
    idade: 58, cidade: 'Rio de Janeiro', bairro: 'Realengo', profissao: 'Aposentado',
    tem_pet: true, num_pets: 2, tem_dependentes: false, num_dependentes: 0, idades_dependentes: [],
    score_reputacao: 88, risco_churn: 'baixo', desconto_ativo_percentual: 0,
    tags: ['senior', 'tem pet', 'bom pagador'], ultima_interacao: '2026-03-09T08:00:00Z',
    ultima_mensagem_enviada: 'Carlos, seu plano venceu há 5 dias. Clique para pagar:',
    data_entrada: '2021-08-15T00:00:00Z', created_at: '2021-08-15T00:00:00Z', updated_at: '2026-03-09T08:00:00Z',
  },
  {
    id: '5', nome: 'Fernanda Lima', telefone: '(21) 95555-5555', email: 'fernanda.lima@gmail.com',
    plano: 'Plano Familiar', valor_mensalidade: 450.00, data_vencimento: '2025-10-23',
    status: 'inadimplente', dias_atraso: 138, valor_em_aberto: 900.00, fase_cobranca: 'mes5',
    idade: 36, cidade: 'Rio de Janeiro', bairro: 'Jacarepaguá', profissao: 'Empreendedora',
    tem_pet: false, num_pets: 0, tem_dependentes: true, num_dependentes: 1, idades_dependentes: [3],
    score_reputacao: 15, risco_churn: 'alto', desconto_ativo_percentual: 20,
    tags: ['urgente', 'tem filhos', 'quer cancelar'], ultima_interacao: '2026-02-20T16:45:00Z',
    ultima_mensagem_enviada: 'Fernanda, oferta especial: 20% de desconto por 48 horas!',
    data_entrada: '2023-01-05T00:00:00Z', created_at: '2023-01-05T00:00:00Z', updated_at: '2026-02-20T16:45:00Z',
  },
  {
    id: '6', nome: 'Roberto Souza', telefone: '(21) 94444-6666',
    plano: 'Plano Premium', valor_mensalidade: 299.90, data_vencimento: '2026-01-23',
    status: 'inadimplente', dias_atraso: 45, valor_em_aberto: 599.80, fase_cobranca: 'mes2',
    idade: 51, cidade: 'Rio de Janeiro', bairro: 'Tijuca', profissao: 'Engenheiro',
    tem_pet: false, num_pets: 0, tem_dependentes: true, num_dependentes: 2, idades_dependentes: [16, 19],
    score_reputacao: 61, risco_churn: 'medio', desconto_ativo_percentual: 0,
    tags: ['tem filhos'], ultima_interacao: '2026-03-07T11:20:00Z',
    ultima_mensagem_enviada: 'Roberto, seu plano está em aberto há 45 dias...',
    data_entrada: '2023-11-01T00:00:00Z', created_at: '2023-11-01T00:00:00Z', updated_at: '2026-03-07T11:20:00Z',
  },
  {
    id: '7', nome: 'Juliana Alves', telefone: '(21) 93333-7777', email: 'juliana.alves@yahoo.com',
    plano: 'Plano Essencial', valor_mensalidade: 189.90, data_vencimento: '2025-12-10',
    status: 'inadimplente', dias_atraso: 88, valor_em_aberto: 379.80, fase_cobranca: 'mes3',
    idade: 28, cidade: 'Niterói', bairro: 'Icaraí', profissao: 'Nutricionista',
    tem_pet: true, num_pets: 1, tem_dependentes: false, num_dependentes: 0, idades_dependentes: [],
    score_reputacao: 55, risco_churn: 'medio', desconto_ativo_percentual: 5,
    tags: ['tem pet', 'jovem'], ultima_interacao: '2026-03-06T15:00:00Z',
    ultima_mensagem_enviada: 'Juliana, temos um desconto especial de 5% para você:',
    data_entrada: '2024-03-18T00:00:00Z', created_at: '2024-03-18T00:00:00Z', updated_at: '2026-03-06T15:00:00Z',
  },
  {
    id: '8', nome: 'Pedro Nascimento', telefone: '(21) 92222-8888', email: 'pedro.n@gmail.com',
    plano: 'Plano Familiar', valor_mensalidade: 450.00, data_vencimento: '2025-12-01',
    status: 'inadimplente', dias_atraso: 99, valor_em_aberto: 1350.00, fase_cobranca: 'mes4',
    idade: 63, cidade: 'Rio de Janeiro', bairro: 'Botafogo', profissao: 'Médico aposentado',
    tem_pet: false, num_pets: 0, tem_dependentes: true, num_dependentes: 1, idades_dependentes: [22],
    score_reputacao: 38, risco_churn: 'alto', desconto_ativo_percentual: 15,
    tags: ['senior', 'tem filhos', 'alto valor'], ultima_interacao: '2026-03-01T10:30:00Z',
    ultima_mensagem_enviada: 'Pedro, parcelamento em 3x disponível para você agora.',
    data_entrada: '2022-07-10T00:00:00Z', created_at: '2022-07-10T00:00:00Z', updated_at: '2026-03-01T10:30:00Z',
  },
]

const TABS: { key: FaseCobranca | 'todos' | 'pos'; label: string }[] = [
  { key: 'todos', label: 'Todos' },
  { key: 'pre',   label: 'Pré' },
  { key: 'mes1',  label: 'Mês 1' },
  { key: 'mes2',  label: 'Mês 2' },
  { key: 'mes3',  label: 'Mês 3' },
  { key: 'mes4',  label: 'Mês 4' },
  { key: 'mes5',  label: 'Mês 5' },
  { key: 'pos',   label: 'Pós D+150' },
]

function ScoreBar({ score }: { score: number }) {
  const color = score >= 70 ? 'var(--success)' : score >= 45 ? 'var(--warning)' : 'var(--error)'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ width: 56, height: 5, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ width: `${score}%`, height: '100%', background: color, borderRadius: 3 }} />
      </div>
      <span style={{ fontSize: 12, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, color }}>{score}</span>
    </div>
  )
}

function LeadDrawer({ lead, onClose }: { lead: Lead; onClose: () => void }) {
  const fase = getFaseBadge(lead.fase_cobranca)
  const risco = getRiscoBadge(lead.risco_churn)
  const avatarColor = getAvatarColor(lead.nome)
  const initials = lead.nome.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase()
  const descontoFase: Record<string, number> = { mes3: 5, mes4: 15, mes5: 20 }
  const desconto = descontoFase[lead.fase_cobranca] || 0
  const valorFinal = lead.valor_em_aberto * (1 - desconto / 100)

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.20)', zIndex: 99 }}
      />
      {/* Drawer */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: 480, background: 'var(--bg-elevated)',
        borderLeft: '1px solid var(--border)', zIndex: 100,
        display: 'flex', flexDirection: 'column',
        boxShadow: '-8px 0 32px rgba(13,61,204,0.10)',
        animation: 'slideIn 0.25s cubic-bezier(0.22,1,0.36,1)',
      }}>
        <style>{`@keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>

        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 46, height: 46, borderRadius: 12,
            background: `linear-gradient(135deg, ${avatarColor} 0%, ${avatarColor}AA 100%)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 16, color: '#FFF',
            flexShrink: 0,
          }}>{initials}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 16, color: 'var(--text-primary)' }}>
              {lead.nome}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{lead.plano}</div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span className={fase.className}>{fase.label}</span>
            <button onClick={onClose} style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, padding: 6, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <X size={14} color="var(--text-muted)" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>

          {/* KPIs rápidos */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
            <div style={{ padding: '14px 16px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 10 }}>
              <div style={{ fontSize: 10, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: 4 }}>DIAS EM ATRASO</div>
              <div style={{ fontSize: 22, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, color: lead.dias_atraso > 60 ? 'var(--error)' : 'var(--warning)' }}>{lead.dias_atraso}d</div>
            </div>
            <div style={{ padding: '14px 16px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 10 }}>
              <div style={{ fontSize: 10, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: 4 }}>VALOR EM ABERTO</div>
              <div style={{ fontSize: 18, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, color: 'var(--text-primary)' }}>{formatCurrency(lead.valor_em_aberto)}</div>
            </div>
            <div style={{ padding: '14px 16px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 10 }}>
              <div style={{ fontSize: 10, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: 4 }}>SCORE REPUTAÇÃO</div>
              <ScoreBar score={lead.score_reputacao} />
            </div>
            <div style={{ padding: '14px 16px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 10 }}>
              <div style={{ fontSize: 10, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: 4 }}>RISCO CHURN</div>
              <span className={risco.className} style={{ marginTop: 4 }}>{risco.label}</span>
            </div>
          </div>

          {/* Proposta de valor */}
          {desconto > 0 && (
            <div style={{ padding: '14px 16px', background: 'rgba(30,132,73,0.06)', border: '1px solid rgba(30,132,73,0.18)', borderRadius: 10, marginBottom: 20 }}>
              <div style={{ fontSize: 10, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, color: 'var(--success)', letterSpacing: '0.08em', marginBottom: 6 }}>OFERTA DISPONIVEL AGORA</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)', textDecoration: 'line-through' }}>{formatCurrency(lead.valor_em_aberto)}</span>
                  <span style={{ marginLeft: 8, fontSize: 18, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, color: 'var(--success)' }}>{formatCurrency(valorFinal)}</span>
                </div>
                <span className="badge badge-green">{desconto}% OFF</span>
              </div>
              {lead.fase_cobranca === 'mes3' && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Válido por 48h</div>}
            </div>
          )}

          {/* Dados de contato */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 10, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: 10 }}>CONTATO & LOCALIZAÇÃO</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
                <Phone size={13} color="var(--text-muted)" /> <span>{lead.telefone}</span>
              </div>
              {lead.email && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
                  <Mail size={13} color="var(--text-muted)" /> <span>{lead.email}</span>
                </div>
              )}
              {lead.cidade && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
                  <MapPin size={13} color="var(--text-muted)" /> <span>{lead.bairro}, {lead.cidade}</span>
                </div>
              )}
            </div>
          </div>

          {/* Dados pessoais */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 10, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: 10 }}>PERFIL PESSOAL</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {lead.idade && <span className="badge badge-gray">{lead.idade} anos</span>}
              {lead.profissao && <span className="badge badge-gray">{lead.profissao}</span>}
              {lead.tem_dependentes && <span className="badge badge-blue">{lead.num_dependentes} dependente{lead.num_dependentes > 1 ? 's' : ''}</span>}
              {lead.tem_pet && <span className="badge badge-teal">{lead.num_pets} pet{lead.num_pets > 1 ? 's' : ''}</span>}
            </div>
          </div>

          {/* Tags */}
          {lead.tags.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 10, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: 10 }}>
                <Tag size={9} style={{ display: 'inline', marginRight: 4 }} />
                TAGS
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {lead.tags.map(tag => (
                  <span key={tag} className={`badge ${tag.includes('cancelar') || tag === 'urgente' || tag === 'alta prioridade' ? 'badge-magenta' : 'badge-gray'}`}>{tag}</span>
                ))}
              </div>
            </div>
          )}

          {/* Última interação */}
          <div style={{ padding: '14px 16px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 10, marginBottom: 20 }}>
            <div style={{ fontSize: 10, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: 6 }}>
              <Clock size={9} style={{ display: 'inline', marginRight: 4 }} />
              ULTIMA INTERAÇÃO — {lead.ultima_interacao ? formatRelativeTime(lead.ultima_interacao) : '—'}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontStyle: 'italic' }}>
              "{lead.ultima_mensagem_enviada}"
            </div>
          </div>

          {/* Nota sobre funcionalidades completas */}
          <div style={{ padding: '12px 14px', background: 'rgba(13,61,204,0.04)', border: '1px dashed var(--border-strong)', borderRadius: 10 }}>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
              Histórico completo de mensagens, notas, linha do tempo e aprovação de desconto disponíveis após integração com n8n (Epic 04) e Supabase Realtime (Epic 05).
            </div>
          </div>
        </div>

        {/* Ações */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', display: 'flex', gap: 10 }}>
          <button className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
            <MessageSquare size={14} />
            Enviar Mensagem
          </button>
          <button className="btn-ghost">
            <FileText size={14} />
            Nota
          </button>
          <button className="btn-ghost" style={{ color: 'var(--magenta)', borderColor: 'rgba(232,27,143,0.25)' }}>
            <AlertTriangle size={14} />
          </button>
        </div>
      </div>
    </>
  )
}

export default function CRMPage() {
  const router = useRouter()
  const [tabAtiva, setTabAtiva] = useState<string>('todos')
  const [busca, setBusca] = useState('')
  const [leadSelecionado, setLeadSelecionado] = useState<Lead | null>(null)

  const leadsFiltrados = mockLeads.filter(lead => {
    const matchFase = tabAtiva === 'todos' || lead.fase_cobranca === tabAtiva
    const matchBusca = !busca || lead.nome.toLowerCase().includes(busca.toLowerCase()) ||
      lead.telefone.includes(busca) || (lead.cpf || '').includes(busca)
    return matchFase && matchBusca
  })

  const countPorFase = (fase: string) =>
    fase === 'todos' ? mockLeads.length : mockLeads.filter(l => l.fase_cobranca === fase).length

  return (
    <div>
      <div className="page-label hero-item hero-item-0">
        <Users size={10} strokeWidth={2.5} />
        CRM — LEADS
      </div>
      <h1 className="hero-item hero-item-1" style={{ fontSize: 26, fontWeight: 800, marginBottom: 6 }}>
        Gestao de Leads
      </h1>
      <p className="hero-item hero-item-2" style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>
        Central de todos os inadimplentes com ficha completa, score e historico de interacoes.
      </p>

      {/* KPIs rápidos */}
      <div className="hero-item hero-item-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        <div className="kpi-card">
          <div className="kpi-label"><Users size={11} strokeWidth={2.5} />Total Leads</div>
          <div className="kpi-value">{mockLeads.length}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>Em cobrança ativa</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label"><AlertTriangle size={11} strokeWidth={2.5} color="var(--error)" />Alto Risco</div>
          <div className="kpi-value" style={{ color: 'var(--error)' }}>
            {mockLeads.filter(l => l.risco_churn === 'alto').length}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>Risco de churn alto</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label"><Star size={11} strokeWidth={2.5} color="var(--warning)" />Score Médio</div>
          <div className="kpi-value" style={{ color: 'var(--warning)' }}>
            {Math.round(mockLeads.reduce((s, l) => s + l.score_reputacao, 0) / mockLeads.length)}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>Score de reputação</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label"><UserCheck size={11} strokeWidth={2.5} color="var(--success)" />Valor Total</div>
          <div className="kpi-value" style={{ color: 'var(--success)', fontSize: 20 }}>
            {formatCurrency(mockLeads.reduce((s, l) => s + l.valor_em_aberto, 0))}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>Em aberto total</div>
        </div>
      </div>

      {/* Barra de busca + ações */}
      <div className="hero-item hero-item-2" style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} strokeWidth={2} />
          <input
            className="input-field"
            placeholder="Buscar por nome, telefone ou CPF..."
            style={{ paddingLeft: 38 }}
            value={busca}
            onChange={e => setBusca(e.target.value)}
          />
        </div>
        <button className="btn-ghost"><Filter size={14} strokeWidth={2} />Filtros</button>
        <button className="btn-ghost"><Download size={14} strokeWidth={2} />Exportar</button>
        <button className="btn-primary"><Upload size={14} strokeWidth={2} />Importar Leads</button>
      </div>

      {/* Tabs de fase */}
      <div className="hero-item hero-item-3" style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
        {TABS.map(tab => {
          const count = countPorFase(tab.key)
          const ativa = tabAtiva === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => setTabAtiva(tab.key)}
              style={{
                padding: '6px 14px',
                borderRadius: 100,
                border: ativa ? '1.5px solid var(--accent)' : '1px solid var(--border)',
                background: ativa ? 'rgba(13,61,204,0.08)' : 'var(--card-bg)',
                color: ativa ? 'var(--accent)' : 'var(--text-secondary)',
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: ativa ? 700 : 500,
                fontSize: 12,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                transition: 'all 0.15s',
              }}
            >
              {tab.label}
              <span style={{
                background: ativa ? 'var(--accent)' : 'var(--surface-2)',
                color: ativa ? '#fff' : 'var(--text-muted)',
                padding: '1px 6px',
                borderRadius: 100,
                fontSize: 10,
                fontWeight: 700,
              }}>{count}</span>
            </button>
          )
        })}
      </div>

      {/* Tabela */}
      <div className="hero-item hero-item-3 glass-card" style={{ overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Lead</th>
              <th>Plano</th>
              <th>Fase</th>
              <th>Dias Atraso</th>
              <th>Valor em Aberto</th>
              <th>Score</th>
              <th>Ultima Interacao</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {leadsFiltrados.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '48px 0' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                    <Users size={28} color="var(--text-muted)" strokeWidth={1.5} />
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Nenhum lead encontrado</span>
                  </div>
                </td>
              </tr>
            ) : leadsFiltrados.map(lead => {
              const fase = getFaseBadge(lead.fase_cobranca)
              const risco = getRiscoBadge(lead.risco_churn)
              const avatarColor = getAvatarColor(lead.nome)
              const initials = lead.nome.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase()
              return (
                <tr key={lead.id} onClick={() => setLeadSelecionado(lead)} style={{ cursor: 'pointer' }}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                        background: `linear-gradient(135deg, ${avatarColor} 0%, ${avatarColor}AA 100%)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 11, color: '#FFF',
                      }}>{initials}</div>
                      <div>
                        <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: 13 }}>{lead.nome}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{lead.telefone}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{lead.plano}</td>
                  <td><span className={fase.className}>{fase.label}</span></td>
                  <td>
                    <span style={{
                      fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 13,
                      color: lead.dias_atraso > 90 ? 'var(--error)' : lead.dias_atraso > 30 ? 'var(--warning)' : 'var(--text-primary)',
                    }}>{lead.dias_atraso}d</span>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>
                      {formatCurrency(lead.valor_em_aberto)}
                    </span>
                  </td>
                  <td><ScoreBar score={lead.score_reputacao} /></td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                        {lead.ultima_interacao ? formatRelativeTime(lead.ultima_interacao) : '—'}
                      </span>
                      <span className={risco.className} style={{ fontSize: 10 }}>{risco.label}</span>
                    </div>
                  </td>
                  <td>
                    <ChevronRight size={14} color="var(--text-muted)" />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Total de resultados */}
      <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-muted)', textAlign: 'right' }}>
        {leadsFiltrados.length} lead{leadsFiltrados.length !== 1 ? 's' : ''} encontrado{leadsFiltrados.length !== 1 ? 's' : ''}
        {tabAtiva !== 'todos' && ` na fase ${TABS.find(t => t.key === tabAtiva)?.label}`}
      </div>

      {/* Drawer de ficha do lead */}
      {leadSelecionado && (
        <LeadDrawer lead={leadSelecionado} onClose={() => setLeadSelecionado(null)} />
      )}
    </div>
  )
}
