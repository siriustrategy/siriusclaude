'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Phone, Mail, MapPin, Users, Tag, MessageSquare, FileText, DollarSign, Clock, Star, AlertTriangle, CheckCircle, Plus, Send, ChevronRight, Shield, Edit } from 'lucide-react'
import { formatCurrency, formatRelativeTime, getFaseBadge, getRiscoBadge, getAvatarColor, getDescontoDisponivel } from '@/lib/utils'
import { Lead } from '@/types'

// Mock — em produção virá do Supabase
const mockLeadsMap: Record<string, Lead & { notas?: Array<{id: string; conteudo: string; tipo: string; autor: string; created_at: string}>; pagamentos?: Array<{id: string; valor: number; metodo: string; status: string; data: string}> }> = {
  '1': {
    id: '1', nome: 'Maria Santos', telefone: '(21) 99999-1111', email: 'maria@email.com', cpf: '123.456.789-01',
    plano: 'Plano Essencial', valor_mensalidade: 189.90, data_vencimento: '2026-02-23',
    status: 'inadimplente', dias_atraso: 15, valor_em_aberto: 189.90, fase_cobranca: 'mes1',
    idade: 34, cidade: 'Rio de Janeiro', bairro: 'Méier', cep: '20720-001', profissao: 'Professora',
    tem_pet: false, num_pets: 0, tem_dependentes: true, num_dependentes: 2, idades_dependentes: [8, 11],
    score_reputacao: 72, risco_churn: 'baixo', desconto_ativo_percentual: 0,
    tags: ['tem filhos', 'boa pagadora'], ultima_interacao: '2026-03-08T10:00:00Z',
    ultima_mensagem_enviada: 'Ok, vou verificar o link de pagamento agora!',
    data_entrada: '2024-01-15T00:00:00Z', created_at: '2024-01-15T00:00:00Z', updated_at: '2026-03-08T10:00:00Z',
    notas: [
      { id: 'n1', conteudo: 'Lead demonstrou interesse em pagar. Aguardando confirmação do PIX.', tipo: 'negociacao', autor: 'Atendente A', created_at: '2026-03-08T10:30:00Z' },
      { id: 'n2', conteudo: 'Ligamos 3x, não atendeu. Optamos por abordagem pelo WhatsApp.', tipo: 'geral', autor: 'Atendente B', created_at: '2026-02-28T14:00:00Z' },
    ],
    pagamentos: [
      { id: 'p1', valor: 189.90, metodo: 'pix', status: 'confirmado', data: '2026-01-25' },
      { id: 'p2', valor: 189.90, metodo: 'boleto', status: 'confirmado', data: '2025-12-23' },
    ],
  },
  '3': {
    id: '3', nome: 'Ana Costa', telefone: '(21) 97777-3333', email: 'ana.costa@hotmail.com', cpf: '321.654.987-09',
    plano: 'Plano Familiar', valor_mensalidade: 450.00, data_vencimento: '2025-11-23',
    status: 'inadimplente', dias_atraso: 107, valor_em_aberto: 1350.00, fase_cobranca: 'mes4',
    idade: 42, cidade: 'Rio de Janeiro', bairro: 'Campo Grande', cep: '23080-001', profissao: 'Funcionária pública',
    tem_pet: false, num_pets: 0, tem_dependentes: true, num_dependentes: 3, idades_dependentes: [5, 9, 14],
    score_reputacao: 28, risco_churn: 'alto', desconto_ativo_percentual: 15,
    tags: ['quer cancelar', 'tem filhos', 'alta prioridade'], ultima_interacao: '2026-02-28T09:15:00Z',
    ultima_mensagem_enviada: 'Não consigo pagar tudo de uma vez, tem como parcelar?',
    data_entrada: '2022-03-20T00:00:00Z', created_at: '2022-03-20T00:00:00Z', updated_at: '2026-02-28T09:15:00Z',
    notas: [
      { id: 'n1', conteudo: 'Ana sinalizou intenção de cancelar. Acionei Atendente B para retenção.', tipo: 'cancelamento', autor: 'Gestor', created_at: '2026-02-28T10:00:00Z' },
      { id: 'n2', conteudo: 'Oferta de parcelamento 3x de R$ 382,50 apresentada. Aguarda retorno.', tipo: 'negociacao', autor: 'Atendente B', created_at: '2026-02-25T14:30:00Z' },
    ],
    pagamentos: [
      { id: 'p1', valor: 450.00, metodo: 'pix', status: 'confirmado', data: '2025-10-23' },
      { id: 'p2', valor: 450.00, metodo: 'boleto', status: 'confirmado', data: '2025-09-23' },
    ],
  },
}

const HISTORICO_MOCK = [
  { tipo: 'mensagem_bot', descricao: 'Bot enviou mensagem de cobrança', hora: '10:00 — 08/03/26' },
  { tipo: 'resposta_lead', descricao: 'Lead respondeu: "Ok, vou verificar..."', hora: '10:34 — 08/03/26' },
  { tipo: 'mensagem_bot', descricao: 'Bot enviou link de pagamento', hora: '10:31 — 08/03/26' },
  { tipo: 'fase', descricao: 'Lead avançou para Mês 1 de cobrança', hora: '09:00 — 23/02/26' },
  { tipo: 'entrada', descricao: 'Lead cadastrado no sistema', hora: '09:00 — 15/01/24' },
]

function ScoreCircle({ score }: { score: number }) {
  const cor = score >= 70 ? 'var(--success)' : score >= 45 ? 'var(--warning)' : 'var(--error)'
  const size = 64
  const r = 26
  const circ = 2 * Math.PI * r
  const fill = circ * (1 - score / 100)
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--surface-2)" strokeWidth={6} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={cor} strokeWidth={6}
          strokeDasharray={circ} strokeDashoffset={fill} strokeLinecap="round" />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 16, color: cor, lineHeight: 1 }}>{score}</span>
      </div>
    </div>
  )
}

export default function CRMLeadPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [tabAtiva, setTabAtiva] = useState<'dados' | 'historico' | 'notas' | 'pagamentos'>('dados')
  const [novaNota, setNovaNota] = useState('')

  const lead = mockLeadsMap[id as string] || mockLeadsMap['1']
  const fase = getFaseBadge(lead.fase_cobranca)
  const risco = getRiscoBadge(lead.risco_churn)
  const avatarColor = getAvatarColor(lead.nome)
  const initials = lead.nome.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase()
  const desconto = getDescontoDisponivel(lead.fase_cobranca)
  const valorFinal = lead.valor_em_aberto * (1 - desconto.percentual / 100)

  const TABS = [
    { key: 'dados', label: 'Dados', icon: Users },
    { key: 'historico', label: 'Histórico', icon: Clock },
    { key: 'notas', label: `Notas ${lead.notas?.length ? `(${lead.notas.length})` : ''}`, icon: FileText },
    { key: 'pagamentos', label: 'Pagamentos', icon: DollarSign },
  ] as const

  return (
    <div>
      {/* Breadcrumb */}
      <div className="hero-item hero-item-0" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <button onClick={() => router.back()} className="btn-ghost" style={{ padding: '6px 12px' }}>
          <ArrowLeft size={13} />
          Voltar
        </button>
        <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>/</span>
        <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>CRM — Leads</span>
        <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>/</span>
        <span style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 600 }}>{lead.nome}</span>
      </div>

      {/* Header do lead */}
      <div className="hero-item hero-item-1 glass-card" style={{ padding: '24px 28px', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20 }}>
          {/* Avatar grande */}
          <div style={{
            width: 72, height: 72, borderRadius: 18, flexShrink: 0,
            background: `linear-gradient(135deg, ${avatarColor} 0%, ${avatarColor}AA 100%)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 24, color: '#FFF',
          }}>{initials}</div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
              <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>{lead.nome}</h1>
              <span className={fase.className}>{fase.label}</span>
              <span className={risco.className}>{risco.label}</span>
              {lead.desconto_ativo_percentual > 0 && (
                <span className="badge badge-green">{lead.desconto_ativo_percentual}% OFF ativo</span>
              )}
            </div>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Phone size={12} color="var(--text-muted)" /> {lead.telefone}
              </span>
              {lead.email && (
                <span style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Mail size={12} color="var(--text-muted)" /> {lead.email}
                </span>
              )}
              {lead.cidade && (
                <span style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <MapPin size={12} color="var(--text-muted)" /> {lead.bairro}, {lead.cidade}
                </span>
              )}
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                Cliente desde {new Date(lead.data_entrada).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}
              </span>
            </div>
          </div>

          {/* KPIs laterais */}
          <div style={{ display: 'flex', gap: 12, flexShrink: 0 }}>
            <div style={{ textAlign: 'center', padding: '14px 20px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 12 }}>
              <div style={{ fontSize: 10, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: 4 }}>DIAS</div>
              <div style={{ fontSize: 26, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, color: lead.dias_atraso > 60 ? 'var(--error)' : 'var(--warning)' }}>{lead.dias_atraso}</div>
            </div>
            <div style={{ textAlign: 'center', padding: '14px 20px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 12 }}>
              <div style={{ fontSize: 10, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: 4 }}>EM ABERTO</div>
              <div style={{ fontSize: 18, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, color: 'var(--text-primary)' }}>{formatCurrency(lead.valor_em_aberto)}</div>
            </div>
            <div style={{ padding: '14px 16px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ fontSize: 10, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em' }}>SCORE</div>
              <ScoreCircle score={lead.score_reputacao} />
            </div>
          </div>
        </div>

        {/* Ações rápidas */}
        <div style={{ display: 'flex', gap: 10, marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
          <button className="btn-primary"><MessageSquare size={14} />Enviar Mensagem</button>
          <button className="btn-secondary"><Send size={14} />Enviar Checkout</button>
          <button className="btn-ghost"><FileText size={14} />Adicionar Nota</button>
          <button className="btn-ghost"><Edit size={14} />Editar Dados</button>
          {lead.risco_churn === 'alto' && (
            <button className="btn-danger" style={{ marginLeft: 'auto' }}>
              <AlertTriangle size={14} />Urgente — Acionar Atendente B
            </button>
          )}
        </div>
      </div>

      {/* Oferta disponível */}
      {desconto.percentual > 0 && (
        <div className="hero-item hero-item-2" style={{ marginBottom: 20, padding: '16px 20px', background: 'rgba(30,132,73,0.06)', border: '1.5px solid rgba(30,132,73,0.22)', borderRadius: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--success)', marginBottom: 3 }}>
                Oferta Disponivel Agora — {desconto.percentual}% de desconto
                {desconto.validade && <span style={{ fontSize: 12, fontWeight: 500, marginLeft: 6 }}>(validade: {desconto.validade})</span>}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                {formatCurrency(lead.valor_em_aberto)} com {desconto.percentual}% de desconto = <strong style={{ color: 'var(--success)' }}>{formatCurrency(valorFinal)}</strong>
                {desconto.parcelamento && ' — parcelável em até 3x sem juros'}
              </div>
            </div>
            <button className="btn-primary" style={{ background: 'var(--success)', flexShrink: 0 }}>
              <Send size={14} />Enviar Link
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="hero-item hero-item-2">
        <div style={{ display: 'flex', gap: 4, marginBottom: 16, background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 10, padding: 4 }}>
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setTabAtiva(tab.key)}
              style={{
                flex: 1, padding: '8px 0', borderRadius: 8,
                border: 'none',
                background: tabAtiva === tab.key ? 'var(--accent)' : 'transparent',
                color: tabAtiva === tab.key ? '#fff' : 'var(--text-secondary)',
                fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: 13,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                transition: 'all 0.15s',
              }}
            >
              <tab.icon size={13} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB: Dados */}
        {tabAtiva === 'dados' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {/* Plano */}
            <div className="glass-card" style={{ padding: '20px 24px' }}>
              <div style={{ fontSize: 10, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: 14 }}>PLANO E COBRANÇA</div>
              {[
                { label: 'Plano', value: lead.plano },
                { label: 'Mensalidade', value: formatCurrency(lead.valor_mensalidade) },
                { label: 'Vencimento', value: new Date(lead.data_vencimento).toLocaleDateString('pt-BR') },
                { label: 'Fase Atual', value: fase.label },
                { label: 'Dias em Atraso', value: `${lead.dias_atraso} dias` },
                { label: 'Valor em Aberto', value: formatCurrency(lead.valor_em_aberto) },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{item.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{item.value}</span>
                </div>
              ))}
            </div>

            {/* Dados pessoais */}
            <div className="glass-card" style={{ padding: '20px 24px' }}>
              <div style={{ fontSize: 10, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: 14 }}>DADOS PESSOAIS</div>
              {[
                { label: 'Idade', value: lead.idade ? `${lead.idade} anos` : '—' },
                { label: 'Profissão', value: lead.profissao || '—' },
                { label: 'Cidade / Bairro', value: lead.cidade ? `${lead.bairro}, ${lead.cidade}` : '—' },
                { label: 'Dependentes', value: lead.tem_dependentes ? `${lead.num_dependentes} (idades: ${lead.idades_dependentes.join(', ')})` : 'Não' },
                { label: 'Pets', value: lead.tem_pet ? `${lead.num_pets} pet(s)` : 'Não' },
                { label: 'CPF', value: lead.cpf || '—' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{item.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{item.value}</span>
                </div>
              ))}
            </div>

            {/* Scores */}
            <div className="glass-card" style={{ padding: '20px 24px' }}>
              <div style={{ fontSize: 10, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: 14 }}>SCORES & RISCO</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 16 }}>
                <ScoreCircle score={lead.score_reputacao} />
                <div>
                  <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 14, marginBottom: 4 }}>Score de Reputação</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                    {lead.score_reputacao >= 70 ? 'Bom pagador histórico' : lead.score_reputacao >= 45 ? 'Pagador moderado' : 'Histórico de atraso'}
                  </div>
                </div>
              </div>
              <div style={{ padding: '12px 14px', background: 'var(--surface-2)', borderRadius: 8 }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600 }}>RISCO DE CHURN</div>
                <span className={risco.className}>{risco.label}</span>
              </div>
            </div>

            {/* Tags */}
            <div className="glass-card" style={{ padding: '20px 24px' }}>
              <div style={{ fontSize: 10, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: 14 }}>
                <Tag size={9} style={{ display: 'inline', marginRight: 4 }} />TAGS
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                {lead.tags.map(tag => (
                  <span key={tag} className={`badge ${tag.includes('cancelar') || tag === 'urgente' || tag === 'alta prioridade' ? 'badge-magenta' : 'badge-gray'}`}>{tag}</span>
                ))}
              </div>
              <button className="btn-ghost" style={{ fontSize: 12 }}>
                <Plus size={12} />Adicionar tag
              </button>
            </div>
          </div>
        )}

        {/* TAB: Histórico */}
        {tabAtiva === 'historico' && (
          <div className="glass-card" style={{ padding: '24px', overflow: 'hidden' }}>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>
              Linha do tempo de todas as interações e mudanças de status.
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {HISTORICO_MOCK.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 16 }}>
                  {/* Linha do tempo */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 28 }}>
                    <div style={{
                      width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
                      background: item.tipo === 'mensagem_bot' ? 'var(--accent)' :
                        item.tipo === 'resposta_lead' ? 'var(--teal)' :
                        item.tipo === 'fase' ? 'var(--warning)' : 'var(--text-muted)',
                      border: '2px solid var(--card-bg)',
                      marginTop: 4,
                    }} />
                    {i < HISTORICO_MOCK.length - 1 && (
                      <div style={{ width: 1.5, flex: 1, background: 'var(--border)', minHeight: 28 }} />
                    )}
                  </div>
                  <div style={{ paddingBottom: 20, flex: 1 }}>
                    <div style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>{item.descricao}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{item.hora}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: '12px 14px', background: 'rgba(13,61,204,0.04)', borderRadius: 8, fontSize: 12, color: 'var(--text-secondary)', marginTop: 8 }}>
              Histórico completo de mensagens WhatsApp disponível após integração n8n (Epic 04).
            </div>
          </div>
        )}

        {/* TAB: Notas */}
        {tabAtiva === 'notas' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Nova nota */}
            <div className="glass-card" style={{ padding: '20px 24px' }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600 }}>NOVA NOTA</div>
              <textarea
                className="input-field"
                placeholder="Registre uma observação sobre este lead..."
                value={novaNota}
                onChange={e => setNovaNota(e.target.value)}
                style={{ height: 80, resize: 'none', marginBottom: 10 }}
              />
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <select className="input-field" style={{ width: 160 }}>
                  <option value="geral">Geral</option>
                  <option value="negociacao">Negociação</option>
                  <option value="pagamento">Pagamento</option>
                  <option value="cancelamento">Cancelamento</option>
                  <option value="retencao">Retenção</option>
                </select>
                <button className="btn-primary" disabled={!novaNota.trim()}>Salvar Nota</button>
              </div>
            </div>

            {/* Notas existentes */}
            {(lead.notas || []).map(nota => (
              <div key={nota.id} className="card-accent" style={{ padding: '16px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span className={`badge ${nota.tipo === 'cancelamento' ? 'badge-magenta' : nota.tipo === 'negociacao' ? 'badge-blue' : 'badge-gray'}`}>
                    {nota.tipo}
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    {nota.autor} · {formatRelativeTime(nota.created_at)}
                  </span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.6, margin: 0 }}>{nota.conteudo}</p>
              </div>
            ))}
          </div>
        )}

        {/* TAB: Pagamentos */}
        {tabAtiva === 'pagamentos' && (
          <div className="glass-card" style={{ overflow: 'hidden' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Valor</th>
                  <th>Método</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {(lead.pagamentos || []).map(p => (
                  <tr key={p.id}>
                    <td style={{ fontSize: 13 }}>{p.data}</td>
                    <td>
                      <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 13 }}>
                        {formatCurrency(p.valor)}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-gray" style={{ textTransform: 'capitalize' }}>{p.metodo}</span>
                    </td>
                    <td>
                      <span className={`badge ${p.status === 'confirmado' ? 'badge-green' : 'badge-orange'}`}>
                        <CheckCircle size={9} />
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {!lead.pagamentos?.length && (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)', fontSize: 13 }}>
                      Nenhum pagamento registrado ainda
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
