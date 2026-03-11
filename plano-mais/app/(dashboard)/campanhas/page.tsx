'use client'

import { useState } from 'react'
import {
  Megaphone, Plus, BarChart3, Users, Send, Clock, CheckCircle,
  X, ChevronRight, Play, Pause, Eye, Copy, Trash2, Filter,
  Calendar, Target, MessageSquare, Mail, Smartphone,
} from 'lucide-react'

// ===================== MOCK DATA =====================
type StatusCampanha = 'rascunho' | 'agendada' | 'em_execucao' | 'concluida' | 'pausada' | 'cancelada'

const CAMPANHAS_MOCK = [
  {
    id: '1', nome: 'Desconto Mes 3 — Marco/26', status: 'concluida' as StatusCampanha,
    canal: 'whatsapp', fases: ['mes3'], total: 142, enviados: 142, lidos: 89, convertidos: 23,
    custo: 18.50, valor_recuperado: 8740, data: '2026-03-01', criador: 'Gestor',
  },
  {
    id: '2', nome: 'Retencao Alto Risco — Semana 10', status: 'em_execucao' as StatusCampanha,
    canal: 'whatsapp', fases: ['mes4', 'mes5'], total: 87, enviados: 67, lidos: 41, convertidos: 8,
    custo: 8.70, valor_recuperado: 2890, data: '2026-03-08', criador: 'Gestor',
  },
  {
    id: '3', nome: 'Lembrete Vencimento — Pre-vencimento', status: 'agendada' as StatusCampanha,
    canal: 'sms', fases: ['pre'], total: 42, enviados: 0, lidos: 0, convertidos: 0,
    custo: 0, valor_recuperado: 0, data: '2026-03-12', criador: 'Gestor',
  },
  {
    id: '4', nome: 'Email Fatura Aberta Mes 2', status: 'rascunho' as StatusCampanha,
    canal: 'email', fases: ['mes2'], total: 0, enviados: 0, lidos: 0, convertidos: 0,
    custo: 0, valor_recuperado: 0, data: '2026-03-15', criador: 'Gestor',
  },
  {
    id: '5', nome: 'Black Friday Cobranca 2025', status: 'concluida' as StatusCampanha,
    canal: 'whatsapp', fases: ['mes1', 'mes2', 'mes3'], total: 312, enviados: 312, lidos: 198, convertidos: 47,
    custo: 40.56, valor_recuperado: 18920, data: '2025-11-28', criador: 'Gestor',
  },
]

const TEMPLATES_MOCK = [
  { id: 't1', nome: 'Desconto Especial', canal: 'whatsapp', fases: ['mes3', 'mes4', 'mes5'], usos: 8 },
  { id: 't2', nome: 'Lembrete Amigavel', canal: 'whatsapp', fases: ['pre', 'mes1'], usos: 12 },
  { id: 't3', nome: 'Email Fatura', canal: 'email', fases: ['mes1', 'mes2'], usos: 4 },
  { id: 't4', nome: 'SMS Urgente', canal: 'sms', fases: ['mes4', 'mes5'], usos: 5 },
]

const STATUS_META: Record<StatusCampanha, { label: string; cor: string; bg: string }> = {
  rascunho:     { label: 'Rascunho',    cor: '#7A90B8', bg: 'rgba(122,144,184,0.10)' },
  agendada:     { label: 'Agendada',    cor: '#D97706', bg: 'rgba(217,119,6,0.10)' },
  em_execucao:  { label: 'Executando',  cor: '#0D3DCC', bg: 'rgba(13,61,204,0.10)' },
  concluida:    { label: 'Concluida',   cor: '#1E8449', bg: 'rgba(30,132,73,0.10)' },
  pausada:      { label: 'Pausada',     cor: '#EA580C', bg: 'rgba(234,88,12,0.10)' },
  cancelada:    { label: 'Cancelada',   cor: '#DC2626', bg: 'rgba(220,38,38,0.10)' },
}

const CANAL_META = {
  whatsapp: { label: 'WhatsApp', icon: MessageSquare, cor: '#25D366' },
  sms:      { label: 'SMS',      icon: Smartphone,   cor: '#0D3DCC' },
  email:    { label: 'Email',    icon: Mail,          cor: '#7C3AED' },
}

function fmt(v: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v)
}

// ===================== MODAL NOVA CAMPANHA =====================
function ModalNovaCampanha({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    nome: '', canal: 'whatsapp', fases: [] as string[],
    template: '', data_agendamento: '', mensagem: '',
  })

  const FASES = [
    { id: 'pre', label: 'Pre-vencimento' },
    { id: 'mes1', label: 'Mes 1' },
    { id: 'mes2', label: 'Mes 2' },
    { id: 'mes3', label: 'Mes 3 (5%)' },
    { id: 'mes4', label: 'Mes 4 (15%)' },
    { id: 'mes5', label: 'Mes 5 (20%)' },
  ]

  const toggleFase = (id: string) => {
    setForm(f => ({
      ...f,
      fases: f.fases.includes(id) ? f.fases.filter(x => x !== id) : [...f.fases, id],
    }))
  }

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 200 }} />
      <div style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: 520, maxHeight: '85vh', overflowY: 'auto',
        background: 'var(--card-bg)', border: '1px solid var(--card-border)',
        borderRadius: 16, zIndex: 201, boxShadow: '0 24px 80px rgba(13,61,204,0.18)',
      }}>
        {/* Header */}
        <div style={{ padding: '20px 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div className="page-label">
              <Megaphone size={9} strokeWidth={2.5} />
              NOVA CAMPANHA
            </div>
            <div style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: 16, color: 'var(--text-primary)', marginTop: 4 }}>
              {step === 1 ? 'Configurar campanha' : step === 2 ? 'Segmentar leads' : 'Revisar e agendar'}
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={18} color="var(--text-muted)" />
          </button>
        </div>

        {/* Steps */}
        <div style={{ padding: '16px 24px', display: 'flex', gap: 8 }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{ flex: 1, height: 3, borderRadius: 2, background: s <= step ? '#0D3DCC' : 'var(--surface-2)' }} />
          ))}
        </div>

        <div style={{ padding: '0 24px 24px' }}>
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', fontFamily: 'Space Grotesk', marginBottom: 6 }}>NOME DA CAMPANHA</div>
                <input
                  className="input-field"
                  placeholder="Ex: Desconto Especial Mes 3 — Marco/26"
                  value={form.nome}
                  onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
                />
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', fontFamily: 'Space Grotesk', marginBottom: 8 }}>CANAL DE ENVIO</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {Object.entries(CANAL_META).map(([key, meta]) => {
                    const sel = form.canal === key
                    return (
                      <button
                        key={key}
                        onClick={() => setForm(f => ({ ...f, canal: key }))}
                        style={{
                          flex: 1, padding: '10px 8px', borderRadius: 8, cursor: 'pointer',
                          border: `1px solid ${sel ? meta.cor + '50' : 'var(--border)'}`,
                          background: sel ? `${meta.cor}12` : 'var(--surface-2)',
                          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                          transition: 'all 0.15s',
                        }}
                      >
                        <meta.icon size={16} color={sel ? meta.cor : 'var(--text-muted)'} strokeWidth={2} />
                        <span style={{ fontSize: 11, fontWeight: 700, color: sel ? meta.cor : 'var(--text-muted)', fontFamily: 'Space Grotesk' }}>{meta.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', fontFamily: 'Space Grotesk', marginBottom: 6 }}>MENSAGEM</div>
                <textarea
                  className="input-field"
                  rows={4}
                  placeholder="Ola {{nome}}! Sua mensalidade de {{valor}} esta em aberto ha {{dias}} dias. Regularize agora: {{link}}"
                  value={form.mensagem}
                  onChange={e => setForm(f => ({ ...f, mensagem: e.target.value }))}
                  style={{ resize: 'vertical', fontFamily: 'DM Sans, sans-serif', lineHeight: 1.5 }}
                />
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                  Variaveis: {'{{nome}}'} {'{{valor}}'} {'{{dias}}'} {'{{link}}'}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', fontFamily: 'Space Grotesk', marginBottom: 8 }}>FASES DA REGUA</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {FASES.map(f => {
                    const sel = form.fases.includes(f.id)
                    return (
                      <button
                        key={f.id}
                        onClick={() => toggleFase(f.id)}
                        style={{
                          padding: '10px 12px', borderRadius: 8, cursor: 'pointer', textAlign: 'left',
                          border: `1px solid ${sel ? '#0D3DCC50' : 'var(--border)'}`,
                          background: sel ? 'rgba(13,61,204,0.08)' : 'var(--surface-2)',
                          display: 'flex', alignItems: 'center', gap: 8,
                        }}
                      >
                        <div style={{
                          width: 16, height: 16, borderRadius: 4, border: `2px solid ${sel ? '#0D3DCC' : 'var(--border)'}`,
                          background: sel ? '#0D3DCC' : 'transparent', flexShrink: 0,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          {sel && <CheckCircle size={10} color="#fff" strokeWidth={3} />}
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 600, color: sel ? 'var(--text-primary)' : 'var(--text-secondary)', fontFamily: 'Space Grotesk' }}>{f.label}</span>
                      </button>
                    )
                  })}
                </div>
                {form.fases.length > 0 && (
                  <div style={{ marginTop: 10, padding: '8px 12px', borderRadius: 8, background: 'rgba(13,61,204,0.06)', border: '1px solid rgba(13,61,204,0.12)' }}>
                    <div style={{ fontSize: 12, color: '#0D3DCC', fontWeight: 700 }}>
                      Estimativa: ~{form.fases.length * 28} leads no segmento
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ padding: '14px 16px', borderRadius: 10, background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'Space Grotesk', marginBottom: 8 }}>RESUMO</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Nome</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Space Grotesk' }}>{form.nome || '(sem nome)'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Canal</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Space Grotesk' }}>{CANAL_META[form.canal as keyof typeof CANAL_META]?.label}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Fases</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Space Grotesk' }}>{form.fases.length > 0 ? form.fases.join(', ') : 'Nenhuma'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Leads estimados</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#0D3DCC', fontFamily: 'Space Grotesk' }}>~{form.fases.length * 28}</span>
                  </div>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', fontFamily: 'Space Grotesk', marginBottom: 6 }}>AGENDAR PARA</div>
                <input
                  type="datetime-local"
                  className="input-field"
                  value={form.data_agendamento}
                  onChange={e => setForm(f => ({ ...f, data_agendamento: e.target.value }))}
                />
              </div>
            </div>
          )}

          <div style={{ marginTop: 20, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            {step > 1 && (
              <button
                onClick={() => setStep(s => s - 1)}
                className="btn-secondary"
                style={{ padding: '8px 16px', fontSize: 13 }}
              >
                Voltar
              </button>
            )}
            {step < 3 ? (
              <button
                onClick={() => setStep(s => s + 1)}
                className="btn-primary"
                style={{ padding: '8px 20px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}
              >
                Continuar <ChevronRight size={14} />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="btn-primary"
                style={{ padding: '8px 20px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <Calendar size={14} />
                Agendar campanha
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

// ===================== PAGE =====================
export default function CampanhasPage() {
  const [showModal, setShowModal] = useState(false)
  const [tabAtiva, setTabAtiva] = useState<'todas' | 'ativas' | 'concluidas' | 'rascunhos'>('todas')

  const filtradas = CAMPANHAS_MOCK.filter(c => {
    if (tabAtiva === 'ativas') return ['em_execucao', 'agendada'].includes(c.status)
    if (tabAtiva === 'concluidas') return c.status === 'concluida'
    if (tabAtiva === 'rascunhos') return c.status === 'rascunho'
    return true
  })

  const kpis = {
    totalEnviados:   CAMPANHAS_MOCK.reduce((s, c) => s + c.enviados, 0),
    totalConvertidos: CAMPANHAS_MOCK.reduce((s, c) => s + c.convertidos, 0),
    totalRecuperado: CAMPANHAS_MOCK.reduce((s, c) => s + c.valor_recuperado, 0),
    taxaMedia:       Math.round(CAMPANHAS_MOCK.filter(c => c.enviados > 0).reduce((s, c) => s + (c.convertidos / c.enviados) * 100, 0) / CAMPANHAS_MOCK.filter(c => c.enviados > 0).length),
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <div className="page-label hero-item hero-item-0">
            <Megaphone size={10} strokeWidth={2.5} />
            CAMPANHAS
          </div>
          <h1 className="hero-item hero-item-1" style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.03em', margin: '6px 0 4px' }}>
            Campanhas de Cobranca
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
            Crie e gerencie campanhas segmentadas por fase da regua
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, padding: '9px 18px' }}
        >
          <Plus size={15} strokeWidth={2.5} />
          Nova campanha
        </button>
      </div>

      {/* KPIs */}
      <div className="hero-item hero-item-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Mensagens Enviadas', valor: kpis.totalEnviados.toLocaleString('pt-BR'), icon: Send, cor: '#0D3DCC' },
          { label: 'Convertidos', valor: kpis.totalConvertidos.toLocaleString('pt-BR'), icon: Target, cor: '#1E8449' },
          { label: 'Valor Recuperado', valor: fmt(kpis.totalRecuperado), icon: BarChart3, cor: '#1E8449' },
          { label: 'Taxa Media Conv.', valor: `${kpis.taxaMedia}%`, icon: CheckCircle, cor: '#7C3AED' },
        ].map(k => (
          <div key={k.label} className="glass-card" style={{ padding: '16px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: `${k.cor}15`, border: `1px solid ${k.cor}25`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <k.icon size={13} color={k.cor} strokeWidth={2} />
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'Space Grotesk', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{k.label}</span>
            </div>
            <div style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: 20, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{k.valor}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 16, borderBottom: '1px solid var(--border)' }}>
        {(['todas', 'ativas', 'concluidas', 'rascunhos'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setTabAtiva(tab)}
            style={{
              padding: '8px 16px', border: 'none', background: 'transparent', cursor: 'pointer',
              fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 12, textTransform: 'capitalize',
              color: tabAtiva === tab ? 'var(--accent)' : 'var(--text-muted)',
              borderBottom: `2px solid ${tabAtiva === tab ? 'var(--accent)' : 'transparent'}`,
              marginBottom: -1,
              transition: 'all 0.15s',
            }}
          >
            {tab === 'todas' ? 'Todas' : tab === 'ativas' ? 'Ativas' : tab === 'concluidas' ? 'Concluidas' : 'Rascunhos'}
          </button>
        ))}
      </div>

      {/* Tabela */}
      <div className="glass-card" style={{ overflow: 'hidden', padding: 0 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface-2)' }}>
              {['Campanha', 'Canal', 'Fases', 'Status', 'Enviados', 'Lidos', 'Convertidos', 'Recuperado', 'Acoes'].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'Space Grotesk', letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtradas.map((c, i) => {
              const st = STATUS_META[c.status]
              const canal = CANAL_META[c.canal as keyof typeof CANAL_META]
              const taxaLeitura = c.enviados > 0 ? Math.round((c.lidos / c.enviados) * 100) : 0
              const taxaConv = c.enviados > 0 ? Math.round((c.convertidos / c.enviados) * 100) : 0
              return (
                <tr
                  key={c.id}
                  style={{
                    borderBottom: i < filtradas.length - 1 ? '1px solid var(--border)' : 'none',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-2)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>{c.nome}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{c.data}</div>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      {canal && <canal.icon size={13} color={canal.cor} strokeWidth={2} />}
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', fontFamily: 'Space Grotesk' }}>{canal?.label}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {c.fases.map(f => (
                        <span key={f} style={{ fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: 'rgba(13,61,204,0.08)', color: '#0D3DCC', fontFamily: 'Space Grotesk', border: '1px solid rgba(13,61,204,0.15)' }}>
                          {f}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: st.bg, color: st.cor, fontFamily: 'Space Grotesk', whiteSpace: 'nowrap' }}>
                      {st.label}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px', fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 13, color: 'var(--text-primary)', textAlign: 'center' }}>
                    {c.enviados.toLocaleString('pt-BR')}
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                    <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 13, color: taxaLeitura > 60 ? '#1E8449' : taxaLeitura > 30 ? '#D97706' : 'var(--text-secondary)' }}>
                      {c.lidos}
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{taxaLeitura}%</div>
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                    <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 13, color: '#1E8449' }}>
                      {c.convertidos}
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{taxaConv}%</div>
                  </td>
                  <td style={{ padding: '12px 14px', fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: 13, color: '#1E8449' }}>
                    {c.valor_recuperado > 0 ? fmt(c.valor_recuperado) : '—'}
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 6, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} title="Ver detalhes">
                        <Eye size={12} color="var(--text-muted)" strokeWidth={2} />
                      </button>
                      {c.status === 'em_execucao' && (
                        <button style={{ background: 'rgba(217,119,6,0.08)', border: '1px solid rgba(217,119,6,0.20)', borderRadius: 6, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} title="Pausar">
                          <Pause size={12} color="#D97706" strokeWidth={2} />
                        </button>
                      )}
                      {c.status === 'rascunho' && (
                        <button style={{ background: 'rgba(13,61,204,0.08)', border: '1px solid rgba(13,61,204,0.20)', borderRadius: 6, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} title="Executar">
                          <Play size={12} color="#0D3DCC" strokeWidth={2} />
                        </button>
                      )}
                      <button style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 6, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} title="Duplicar">
                        <Copy size={12} color="var(--text-muted)" strokeWidth={2} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Templates */}
      <div style={{ marginTop: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div className="page-label">
            <MessageSquare size={9} strokeWidth={2.5} />
            TEMPLATES DE MENSAGEM
          </div>
          <button style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Space Grotesk' }}>
            <Plus size={12} /> Novo template
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {TEMPLATES_MOCK.map(t => {
            const canal = CANAL_META[t.canal as keyof typeof CANAL_META]
            return (
              <div key={t.id} className="glass-card" style={{ padding: '14px 16px', cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  {canal && <canal.icon size={14} color={canal.cor} strokeWidth={2} />}
                  <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>{t.nome}</span>
                </div>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 8 }}>
                  {t.fases.map(f => (
                    <span key={f} style={{ fontSize: 9, fontWeight: 700, padding: '1px 5px', borderRadius: 3, background: 'rgba(13,61,204,0.07)', color: '#0D3DCC', fontFamily: 'Space Grotesk' }}>
                      {f}
                    </span>
                  ))}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t.usos} usos</div>
              </div>
            )
          })}
        </div>
      </div>

      {showModal && <ModalNovaCampanha onClose={() => setShowModal(false)} />}
    </div>
  )
}
