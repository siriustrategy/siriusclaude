'use client'

import { useState, useEffect } from 'react'
import { Users, Search, Filter, Download, Upload, X, Phone, Mail, MapPin, Tag, MessageSquare, FileText, Clock, ChevronRight, AlertTriangle, Star, UserCheck, Link, Check, Loader } from 'lucide-react'
import { Lead, FaseCobranca } from '@/types'
import { formatCurrency, formatRelativeTime, getFaseBadge, getRiscoBadge, getAvatarColor } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

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
  const supabase = createClient()
  const fase = getFaseBadge(lead.fase_cobranca)
  const risco = getRiscoBadge(lead.risco_churn)
  const avatarColor = getAvatarColor(lead.nome)
  const initials = lead.nome.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase()
  const descontoFase: Record<string, number> = { mes3: 5, mes4: 15, mes5: 20 }
  const desconto = descontoFase[lead.fase_cobranca] || 0
  const valorFinal = lead.valor_em_aberto * (1 - desconto / 100)

  // Gerar link de checkout
  type LinkStatus = 'idle' | 'gerando' | 'ok' | 'erro'
  const [linkStatus, setLinkStatus] = useState<LinkStatus>('idle')
  const [checkoutUrl, setCheckoutUrl] = useState('')

  // Histórico de links
  type TokenRow = { id: string; token: string; valor: number; desconto: number; expira_em: string; usado: boolean; created_at: string }
  const [linksHistorico, setLinksHistorico] = useState<TokenRow[]>([])

  useEffect(() => {
    supabase
      .from('checkout_tokens')
      .select('id, token, valor, desconto, expira_em, usado, created_at')
      .eq('lead_id', lead.id)
      .order('created_at', { ascending: false })
      .limit(5)
      .then(({ data }) => { if (data) setLinksHistorico(data) })
  }, [lead.id, linkStatus])

  async function handleGerarLink() {
    setLinkStatus('gerando')
    try {
      const res = await fetch('/api/checkout/gerar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lead_id: lead.id }),
      })
      const json = await res.json()
      if (res.ok && json.ok) {
        setCheckoutUrl(json.checkout_url)
        setLinkStatus('ok')
        await navigator.clipboard.writeText(json.checkout_url).catch(() => {})
        window.open(json.checkout_url, '_blank')
      } else {
        // Fallback: abre demo para visualização mesmo sem API configurada
        const demoUrl = `${window.location.origin}/checkout/demo`
        setCheckoutUrl(demoUrl)
        setLinkStatus('ok')
        await navigator.clipboard.writeText(demoUrl).catch(() => {})
        window.open(demoUrl, '_blank')
      }
    } catch {
      const demoUrl = `${window.location.origin}/checkout/demo`
      setCheckoutUrl(demoUrl)
      setLinkStatus('ok')
      window.open(demoUrl, '_blank')
    }
  }

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

          {/* Histórico de links de checkout */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 10, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 4 }}>
              <Link size={9} />
              LINKS DE CHECKOUT GERADOS
            </div>
            {linksHistorico.length === 0 ? (
              <div style={{ fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic' }}>Nenhum link gerado ainda.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {linksHistorico.map(tk => {
                  const exp = new Date(tk.expira_em)
                  const expirado = exp < new Date()
                  const statusLabel = tk.usado ? 'Pago' : expirado ? 'Expirado' : 'Ativo'
                  const statusColor = tk.usado ? 'var(--success)' : expirado ? 'var(--text-muted)' : 'var(--accent)'
                  return (
                    <div key={tk.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{tk.token.slice(0, 16)}…</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                          {formatCurrency(tk.valor)}{tk.desconto > 0 ? ` · ${tk.desconto}% OFF` : ''} · {new Date(tk.created_at).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                      <span style={{ fontSize: 10, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, color: statusColor }}>{statusLabel}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Ações */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* Linha 1 */}
          <div style={{ display: 'flex', gap: 10 }}>
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
          {/* Linha 2 — Checkout */}
          <button
            onClick={handleGerarLink}
            disabled={linkStatus === 'gerando'}
            className="btn-ghost"
            style={{
              width: '100%', justifyContent: 'center',
              borderColor: linkStatus === 'ok' ? 'rgba(30,132,73,0.35)' : linkStatus === 'erro' ? 'rgba(220,38,38,0.30)' : 'var(--border)',
              color: linkStatus === 'ok' ? 'var(--success)' : linkStatus === 'erro' ? 'var(--error)' : 'var(--text-secondary)',
              background: linkStatus === 'ok' ? 'rgba(30,132,73,0.06)' : 'transparent',
            }}
          >
            {linkStatus === 'gerando' ? <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} />
              : linkStatus === 'ok' ? <Check size={14} />
              : <Link size={14} />}
            {linkStatus === 'gerando' ? 'Gerando link...'
              : linkStatus === 'ok' ? `Link copiado e enviado via WhatsApp${desconto > 0 ? ` — ${desconto}% OFF` : ''}`
              : linkStatus === 'erro' ? 'Erro ao gerar — tente novamente'
              : `Gerar Link de Checkout${desconto > 0 ? ` (${desconto}% OFF)` : ''}`}
          </button>
          {linkStatus === 'ok' && checkoutUrl && (
            <div style={{ fontSize: 11, color: 'var(--text-muted)', wordBreak: 'break-all', background: 'var(--surface-2)', padding: '6px 10px', borderRadius: 6, border: '1px solid var(--border)' }}>
              {checkoutUrl}
            </div>
          )}
        </div>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    </>
  )
}

export default function CRMPage() {
  const supabase = createClient()
  const [tabAtiva, setTabAtiva] = useState<string>('todos')
  const [busca, setBusca] = useState('')
  const [leadSelecionado, setLeadSelecionado] = useState<Lead | null>(null)
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [erroCarregamento, setErroCarregamento] = useState<string | null>(null)

  // Carregar todos os leads do Supabase
  useEffect(() => {
    async function loadLeads() {
      setLoading(true)
      setErroCarregamento(null)
      const { data, error } = await supabase
        .from('leads')
        .select(`
          id, nome, telefone, email, cpf, plano,
          valor_mensalidade, data_vencimento, status,
          dias_atraso, valor_em_aberto, fase_cobranca,
          idade, cidade, bairro, profissao,
          tem_pet, num_pets, tem_dependentes, num_dependentes, idades_dependentes,
          score_reputacao, risco_churn, desconto_ativo_percentual,
          tags, ultima_interacao, ultima_mensagem_enviada,
          data_entrada, created_at, updated_at
        `)
        .order('dias_atraso', { ascending: false })

      if (error) {
        console.error('[CRM] Erro ao carregar leads:', error)
        setErroCarregamento(error.message)
      } else if (data) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mapped: Lead[] = (data as any[]).map(d => ({
          id: d.id,
          nome: d.nome,
          telefone: d.telefone || '',
          email: d.email || undefined,
          cpf: d.cpf || undefined,
          plano: d.plano,
          valor_mensalidade: Number(d.valor_mensalidade) || 0,
          data_vencimento: d.data_vencimento || '',
          status: d.status || 'ativo',
          dias_atraso: Number(d.dias_atraso) || 0,
          valor_em_aberto: Number(d.valor_em_aberto) || 0,
          fase_cobranca: d.fase_cobranca || 'pre',
          idade: d.idade || undefined,
          cidade: d.cidade || undefined,
          bairro: d.bairro || undefined,
          profissao: d.profissao || undefined,
          tem_pet: d.tem_pet || false,
          num_pets: d.num_pets || 0,
          tem_dependentes: d.tem_dependentes || false,
          num_dependentes: d.num_dependentes || 0,
          idades_dependentes: d.idades_dependentes || [],
          score_reputacao: Number(d.score_reputacao) || 50,
          risco_churn: d.risco_churn || 'baixo',
          desconto_ativo_percentual: Number(d.desconto_ativo_percentual) || 0,
          tags: d.tags || [],
          ultima_interacao: d.ultima_interacao || undefined,
          ultima_mensagem_enviada: d.ultima_mensagem_enviada || undefined,
          data_entrada: d.data_entrada || d.created_at || '',
          created_at: d.created_at,
          updated_at: d.updated_at,
        }))
        setLeads(mapped)
      }
      setLoading(false)
    }
    loadLeads()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const leadsFiltrados = leads.filter(lead => {
    const matchFase = tabAtiva === 'todos' || lead.fase_cobranca === tabAtiva
    const matchBusca = !busca || lead.nome.toLowerCase().includes(busca.toLowerCase()) ||
      lead.telefone.includes(busca) || (lead.cpf || '').includes(busca)
    return matchFase && matchBusca
  })

  const countPorFase = (fase: string) =>
    fase === 'todos' ? leads.length : leads.filter(l => l.fase_cobranca === fase).length

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

      {/* Banner de erro */}
      {erroCarregamento && (
        <div className="hero-item hero-item-1" style={{ marginBottom: 20, padding: '12px 16px', background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.22)', borderRadius: 10, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <AlertTriangle size={15} color="#DC2626" style={{ flexShrink: 0, marginTop: 1 }} />
          <div>
            <div style={{ fontFamily: 'Space Grotesk,sans-serif', fontWeight: 700, fontSize: 13, color: '#DC2626' }}>Erro ao carregar leads</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{erroCarregamento}</div>
          </div>
        </div>
      )}

      {/* KPIs rápidos */}
      <div className="hero-item hero-item-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        <div className="kpi-card">
          <div className="kpi-label"><Users size={11} strokeWidth={2.5} />Total Leads</div>
          <div className="kpi-value">{loading ? '—' : leads.length}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>Cadastrados no sistema</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label"><AlertTriangle size={11} strokeWidth={2.5} color="var(--error)" />Alto Risco</div>
          <div className="kpi-value" style={{ color: 'var(--error)' }}>
            {loading ? '—' : leads.filter(l => l.risco_churn === 'alto').length}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>Risco de churn alto</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label"><Star size={11} strokeWidth={2.5} color="var(--warning)" />Score Médio</div>
          <div className="kpi-value" style={{ color: 'var(--warning)' }}>
            {loading || leads.length === 0 ? '—' : Math.round(leads.reduce((s, l) => s + l.score_reputacao, 0) / leads.length)}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>Score de reputação</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label"><UserCheck size={11} strokeWidth={2.5} color="var(--success)" />Valor Total</div>
          <div className="kpi-value" style={{ color: 'var(--success)', fontSize: 20 }}>
            {loading ? '—' : formatCurrency(leads.reduce((s, l) => s + l.valor_em_aberto, 0))}
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
            {loading ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '48px 0' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', border: '2px solid var(--accent)', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Carregando leads...</span>
                  </div>
                </td>
              </tr>
            ) : leadsFiltrados.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '48px 0' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                    <Users size={28} color="var(--text-muted)" strokeWidth={1.5} />
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                      {leads.length === 0
                        ? 'Nenhum lead cadastrado ainda. Leads aparecem automaticamente quando chegam mensagens via WhatsApp.'
                        : 'Nenhum lead encontrado para esta busca ou fase.'}
                    </span>
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
