'use client'

import { useState, useEffect } from 'react'
import {
  TrendingUp, DollarSign, Target, CheckCircle,
  AlertTriangle, Clock, MessageSquare, Zap, ArrowUpRight,
  ArrowDownRight, Activity, BarChart3, Bell,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

function tempoRelativo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const min = Math.floor(diff / 60000)
  if (min < 1) return 'agora'
  if (min < 60) return `${min} min`
  const h = Math.floor(min / 60)
  if (h < 24) return `${h}h`
  return `${Math.floor(h / 24)}d`
}

function fmt(v: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency', currency: 'BRL', maximumFractionDigits: 0,
  }).format(v)
}

const FASES_CONFIG = [
  { fase: 'pre',  label: 'Pré-vencimento', cor: '#0D3DCC', desconto: 0 },
  { fase: 'mes1', label: 'Mês 1',          cor: '#3B65FF', desconto: 0 },
  { fase: 'mes2', label: 'Mês 2',          cor: '#7C3AED', desconto: 0 },
  { fase: 'mes3', label: 'Mês 3 — 5%',     cor: '#D97706', desconto: 5 },
  { fase: 'mes4', label: 'Mês 4 — 15%',    cor: '#EA580C', desconto: 15 },
  { fase: 'mes5', label: 'Mês 5 — 20%',    cor: '#DC2626', desconto: 20 },
]

interface KPIs {
  totalDivida: number
  recuperadoMes: number
  taxaConversao: number
  leadsInadimplentes: number
  mensagensHoje: number
  conversasAbertas: number
  pagamentosHoje: number
  ticketMedio: number
}

interface FunilItem { fase: string; leads: number; valor: number }
interface SemanaItem { dia: string; pagamentos: number; valor: number }
interface AtividadeItem { tipo: string; lead: string; valor: number | null; tempo: string; cor: string }

function KPICard({
  label, valor, sub, icon: Icon, cor = 'var(--accent)',
  variacao, destaque, loading,
}: {
  label: string; valor: string; sub: string; icon: React.ElementType
  cor?: string; variacao?: { pct: number; positivo: boolean }; destaque?: boolean; loading?: boolean
}) {
  return (
    <div className="glass-card" style={{
      padding: '18px 20px',
      border: destaque ? `1px solid ${cor}33` : '1px solid var(--card-border)',
      background: destaque ? `linear-gradient(135deg, ${cor}08 0%, transparent 100%)` : undefined,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 9,
          background: `${cor}18`, border: `1px solid ${cor}28`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={15} color={cor} strokeWidth={2} />
        </div>
        {variacao && !loading && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 3,
            fontSize: 11, fontWeight: 700,
            color: variacao.positivo ? '#1E8449' : '#DC2626',
          }}>
            {variacao.positivo ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {variacao.pct}%
          </div>
        )}
      </div>
      <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 22, color: loading ? 'var(--text-muted)' : 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1 }}>
        {loading ? '—' : valor}
      </div>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, letterSpacing: '0.04em', marginTop: 4, textTransform: 'uppercase' }}>
        {label}
      </div>
      <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>
        {sub}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [kpis, setKpis] = useState<KPIs | null>(null)
  const [funil, setFunil] = useState<FunilItem[]>([])
  const [semana, setSemana] = useState<SemanaItem[]>([])
  const [atividade, setAtividade] = useState<AtividadeItem[]>([])

  const HORA = new Date().getHours()
  const saudacao = HORA < 12 ? 'Bom dia' : HORA < 18 ? 'Boa tarde' : 'Boa noite'

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true)
      const hoje = new Date(); hoje.setHours(0, 0, 0, 0)
      const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1)
      const seteDias = new Date(hoje); seteDias.setDate(seteDias.getDate() - 6)

      const [
        leadsRes,
        pagMesRes,
        pagHojeRes,
        conversasRes,
        mensagensRes,
        semanaRes,
        atividadeRes,
      ] = await Promise.all([
        // Funil + total dívida
        supabase.from('leads')
          .select('fase_cobranca, valor_em_aberto, status')
          .in('status', ['inadimplente', 'ativo']),
        // Pagamentos do mês
        supabase.from('pagamentos')
          .select('valor')
          .eq('status', 'confirmado')
          .gte('data_pagamento', inicioMes.toISOString()),
        // Pagamentos de hoje
        supabase.from('pagamentos')
          .select('id, valor')
          .eq('status', 'confirmado')
          .gte('data_pagamento', hoje.toISOString()),
        // Conversas abertas
        supabase.from('conversas')
          .select('id', { count: 'exact' })
          .eq('status', 'aberta'),
        // Mensagens hoje
        supabase.from('mensagens')
          .select('id', { count: 'exact' })
          .gte('timestamp', hoje.toISOString()),
        // Pagamentos últimos 7 dias
        supabase.from('pagamentos')
          .select('valor, data_pagamento')
          .eq('status', 'confirmado')
          .gte('data_pagamento', seteDias.toISOString())
          .order('data_pagamento', { ascending: true }),
        // Atividade recente — últimos pagamentos + conversas
        supabase.from('pagamentos')
          .select('valor, created_at, lead:leads(nome)')
          .eq('status', 'confirmado')
          .order('data_pagamento', { ascending: false })
          .limit(6),
      ])

      // KPIs
      const leads = leadsRes.data || []
      const inadimplentes = leads.filter(l => l.status === 'inadimplente')
      const totalDivida = inadimplentes.reduce((s, l) => s + Number(l.valor_em_aberto), 0)
      const recuperadoMes = (pagMesRes.data || []).reduce((s, p) => s + Number(p.valor), 0)
      const pagamentosHoje = pagHojeRes.data?.length || 0
      const valorHoje = (pagHojeRes.data || []).reduce((s, p) => s + Number(p.valor), 0)
      const ticketMedio = pagamentosHoje > 0 ? valorHoje / pagamentosHoje : 0
      const taxaConversao = inadimplentes.length > 0
        ? Math.round((pagamentosHoje / inadimplentes.length) * 100 * 10) / 10
        : 0

      setKpis({
        totalDivida,
        recuperadoMes,
        taxaConversao,
        leadsInadimplentes: inadimplentes.length,
        mensagensHoje: mensagensRes.count || 0,
        conversasAbertas: conversasRes.count || 0,
        pagamentosHoje,
        ticketMedio,
      })

      // Funil
      const funilMapa: Record<string, { leads: number; valor: number }> = {}
      for (const l of inadimplentes) {
        const fase = l.fase_cobranca
        if (!funilMapa[fase]) funilMapa[fase] = { leads: 0, valor: 0 }
        funilMapa[fase].leads++
        funilMapa[fase].valor += Number(l.valor_em_aberto)
      }
      setFunil(FASES_CONFIG.map(f => ({
        fase: f.fase,
        leads: funilMapa[f.fase]?.leads || 0,
        valor: funilMapa[f.fase]?.valor || 0,
      })))

      // Semana — últimos 7 dias
      const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']
      const semanaMap: Record<string, { pagamentos: number; valor: number }> = {}
      for (let i = 0; i < 7; i++) {
        const d = new Date(hoje); d.setDate(d.getDate() - (6 - i))
        const key = d.toISOString().split('T')[0]
        semanaMap[key] = { pagamentos: 0, valor: 0 }
      }
      for (const p of semanaRes.data || []) {
        const key = p.data_pagamento?.split('T')[0]
        if (key && semanaMap[key]) {
          semanaMap[key].pagamentos++
          semanaMap[key].valor += Number(p.valor)
        }
      }
      setSemana(Object.entries(semanaMap).map(([key, v]) => ({
        dia: diasSemana[new Date(key + 'T12:00:00').getDay()],
        ...v,
      })))

      // Atividade
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setAtividade((atividadeRes.data || []).map((p: any) => ({
        tipo: 'pagamento',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        lead: (Array.isArray(p.lead) ? p.lead[0] : p.lead as any)?.nome || 'Lead',
        valor: Number(p.valor),
        tempo: tempoRelativo(p.created_at),
        cor: '#1E8449',
      })))

      setLoading(false)
    }
    loadDashboard()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const totalFunil = funil.reduce((s, f) => s + f.leads, 0)
  const maxSemana = Math.max(...semana.map(d => d.valor), 1)

  return (
    <div>
      {/* Cabeçalho */}
      <div style={{ marginBottom: 24 }}>
        <div className="page-label hero-item hero-item-0">
          <TrendingUp size={10} strokeWidth={2.5} />
          MEU PAINEL
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 6 }}>
          <div>
            <h1 className="hero-item hero-item-1" style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.03em', margin: 0 }}>
              {saudacao}!
            </h1>
            <p className="hero-item hero-item-2" style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 4 }}>
              {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
              {!loading && kpis ? ` — ${kpis.pagamentosHoje} pagamento${kpis.pagamentosHoje !== 1 ? 's' : ''} confirmado${kpis.pagamentosHoje !== 1 ? 's' : ''} hoje` : ''}
            </p>
          </div>
          {loading && (
            <div style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Clock size={12} />
              Carregando dados...
            </div>
          )}
        </div>
      </div>

      {/* KPIs principais */}
      <div className="hero-item hero-item-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 16 }}>
        <KPICard label="Recuperado" valor={fmt(kpis?.recuperadoMes ?? 0)} sub="Pagamentos do mês"
          icon={DollarSign} cor="#1E8449" variacao={{ pct: 0, positivo: true }} destaque loading={loading} />
        <KPICard label="Total em Aberto" valor={fmt(kpis?.totalDivida ?? 0)} sub={`${kpis?.leadsInadimplentes ?? 0} leads inadimplentes`}
          icon={AlertTriangle} cor="#DC2626" loading={loading} />
        <KPICard label="Taxa de Conversao" valor={`${kpis?.taxaConversao ?? 0}%`} sub="Inadimplentes que pagaram hoje"
          icon={Target} cor="#0D3DCC" loading={loading} />
        <KPICard label="Ticket Medio" valor={fmt(kpis?.ticketMedio ?? 0)} sub="Por pagamento recebido"
          icon={TrendingUp} cor="#7C3AED" loading={loading} />
      </div>

      {/* KPIs operacionais */}
      <div className="hero-item hero-item-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 22 }}>
        <KPICard label="Mensagens Hoje" valor={String(kpis?.mensagensHoje ?? 0)} sub="Enviadas e recebidas"
          icon={MessageSquare} cor="#0BBFAA" loading={loading} />
        <KPICard label="Conversas Abertas" valor={String(kpis?.conversasAbertas ?? 0)} sub="Bot + atendente"
          icon={Activity} cor="#D97706" loading={loading} />
        <KPICard label="Pagamentos Hoje" valor={String(kpis?.pagamentosHoje ?? 0)} sub="Confirmados"
          icon={CheckCircle} cor="#1E8449" loading={loading} />
        <KPICard label="Leads Urgentes" valor={String(funil.find(f => f.fase === 'mes5')?.leads ?? 0)} sub="Mes 5 — 20% desc."
          icon={Zap} cor="#DC2626" loading={loading} />
      </div>

      {/* Funil + Gráfico semanal */}
      <div className="hero-item hero-item-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 18 }}>
        {/* Funil */}
        <div className="glass-card" style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <div className="page-label" style={{ marginBottom: 6 }}>
                <Target size={9} strokeWidth={2.5} />
                FUNIL DA REGUA
              </div>
              <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>
                {loading ? '—' : `${totalFunil} leads em cobranca`}
              </div>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              {loading ? '' : fmt(kpis?.totalDivida ?? 0)}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {FASES_CONFIG.map(f => {
              const item = funil.find(fi => fi.fase === f.fase)
              const leads = item?.leads || 0
              const valor = item?.valor || 0
              const pct = totalFunil > 0 ? Math.round((leads / totalFunil) * 100) : 0
              return (
                <div key={f.fase}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: f.cor, flexShrink: 0 }} />
                      <span style={{ fontSize: 12, fontFamily: 'Space Grotesk', fontWeight: 600, color: 'var(--text-primary)' }}>{f.label}</span>
                      {f.desconto > 0 && (
                        <span style={{
                          fontSize: 9, fontWeight: 800, fontFamily: 'Space Grotesk',
                          color: '#1E8449', background: 'rgba(30,132,73,0.10)',
                          border: '1px solid rgba(30,132,73,0.20)', borderRadius: 4, padding: '1px 5px',
                        }}>-{f.desconto}%</span>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{fmt(valor)}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Space Grotesk', width: 26, textAlign: 'right' }}>{leads}</span>
                    </div>
                  </div>
                  <div style={{ height: 5, background: 'var(--surface-2)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: f.cor, borderRadius: 3, opacity: 0.85, transition: 'width 0.6s ease' }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Gráfico semanal */}
        <div className="glass-card" style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <div className="page-label" style={{ marginBottom: 6 }}>
                <BarChart3 size={9} strokeWidth={2.5} />
                ULTIMOS 7 DIAS
              </div>
              <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>
                Recuperacao diaria
              </div>
            </div>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#1E8449', fontFamily: 'Space Grotesk', letterSpacing: '-0.01em' }}>
              {loading ? '—' : fmt(semana.reduce((s, d) => s + d.valor, 0))}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 100 }}>
            {(semana.length > 0 ? semana : Array(7).fill({ dia: '...', pagamentos: 0, valor: 0 })).map((d, i) => {
              const h = d.valor > 0 ? (d.valor / maxSemana) * 100 : 0
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: '#1E8449', fontFamily: 'Space Grotesk', opacity: d.pagamentos > 0 ? 1 : 0 }}>
                    {d.pagamentos}
                  </div>
                  <div style={{ width: '100%', flex: 1, display: 'flex', alignItems: 'flex-end' }}>
                    <div style={{
                      width: '100%',
                      height: h > 0 ? `${Math.max(h, 6)}%` : '2px',
                      background: d.valor > 0 ? 'linear-gradient(180deg, #0D3DCC 0%, #0BBFAA 100%)' : 'var(--surface-2)',
                      borderRadius: '4px 4px 2px 2px',
                      opacity: d.valor > 0 ? 0.85 : 1,
                      transition: 'height 0.4s ease',
                    }} />
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'Space Grotesk', fontWeight: 600 }}>
                    {d.dia}
                  </div>
                </div>
              )
            })}
          </div>
          <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border)', display: 'flex', gap: 16 }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{semana.reduce((s, d) => s + d.pagamentos, 0)}</span> pagamentos
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              Maior dia: <span style={{ fontWeight: 700, color: '#1E8449' }}>{fmt(maxSemana === 1 ? 0 : maxSemana)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Atividade recente */}
      <div className="hero-item hero-item-4" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
        <div className="glass-card" style={{ padding: '20px 24px' }}>
          <div className="page-label" style={{ marginBottom: 12 }}>
            <Bell size={9} strokeWidth={2.5} />
            ATIVIDADE RECENTE
          </div>
          <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', marginBottom: 14 }}>
            Ultimos pagamentos confirmados
          </div>
          {loading ? (
            <div style={{ fontSize: 13, color: 'var(--text-muted)', padding: '16px 0' }}>Carregando...</div>
          ) : atividade.length === 0 ? (
            <div style={{ fontSize: 13, color: 'var(--text-muted)', padding: '16px 0' }}>Nenhum pagamento registrado ainda.</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {atividade.map((a, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 12px', borderRadius: 8,
                  background: 'var(--surface-2)', border: '1px solid var(--border)',
                }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 7, flexShrink: 0,
                    background: `${a.cor}15`, border: `1px solid ${a.cor}25`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <CheckCircle size={13} color={a.cor} strokeWidth={2} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {a.lead}
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>ha {a.tempo}</div>
                  </div>
                  {a.valor != null && (
                    <div style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: 12, color: '#1E8449', flexShrink: 0 }}>
                      {fmt(a.valor)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
