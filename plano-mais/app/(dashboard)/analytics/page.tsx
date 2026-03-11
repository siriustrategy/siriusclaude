'use client'

import { useState } from 'react'
import {
  BarChart3, TrendingUp, DollarSign, Target, Users,
  AlertTriangle, ArrowUp, ArrowDown, Sparkles, Calendar,
} from 'lucide-react'

// ===================== MOCK DATA =====================
const FUNIL_DATA = [
  { fase: 'Pre-vencimento', leads: 48, conversoes: 12, cor: '#0D3DCC' },
  { fase: 'Mes 1 (0%)',     leads: 67, conversoes: 9,  cor: '#3B65FF' },
  { fase: 'Mes 2 (0%)',     leads: 53, conversoes: 7,  cor: '#7C3AED' },
  { fase: 'Mes 3 (5%)',     leads: 41, conversoes: 14, cor: '#D97706' },
  { fase: 'Mes 4 (15%)',    leads: 28, conversoes: 8,  cor: '#DC2626' },
  { fase: 'Mes 5 (20%)',    leads: 19, conversoes: 4,  cor: '#C0392B' },
]

const INSIGHTS = [
  { icon: AlertTriangle, cor: '#E81B8F', texto: 'Leads de Bangu no Mes 3 tem 42% menos conversao — revisar abordagem nessa regiao' },
  { icon: TrendingUp, cor: '#1E8449', texto: 'Horario ideal de disparo: 10h–11h e 18h–19h (dados dos ultimos 30 dias)' },
  { icon: Users, cor: '#0D3DCC', texto: '23 leads tem alto risco de inadimplencia no proximo ciclo — acionar agora' },
  { icon: Sparkles, cor: '#7C3AED', texto: 'Campanha "Desconto Mes 3" superou media em 34% — replicar modelo' },
]

const MESES = [
  { mes: 'Out', cobrado: 84200, arrecadado: 31500 },
  { mes: 'Nov', cobrado: 91800, arrecadado: 38200 },
  { mes: 'Dez', cobrado: 78400, arrecadado: 28900 },
  { mes: 'Jan', cobrado: 95600, arrecadado: 41200 },
  { mes: 'Fev', cobrado: 102300, arrecadado: 44800 },
  { mes: 'Mar', cobrado: 98700, arrecadado: 43150 },
]

function fmt(v: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v)
}

// ===================== PAGE =====================
export default function AnalyticsPage() {
  const [periodoAtivo, setPeriodoAtivo] = useState<'7d' | '30d' | '90d'>('30d')

  const totalLeads = FUNIL_DATA.reduce((s, f) => s + f.leads, 0)
  const totalConv = FUNIL_DATA.reduce((s, f) => s + f.conversoes, 0)
  const mesAtual = MESES[MESES.length - 1]
  const taxaConv = Math.round((totalConv / totalLeads) * 100)
  const ticketMedio = Math.round(mesAtual.arrecadado / totalConv)
  const maxArrecadado = Math.max(...MESES.map(m => m.arrecadado))

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <div className="page-label hero-item hero-item-0">
            <BarChart3 size={10} strokeWidth={2.5} />
            ANALYTICS & BI
          </div>
          <h1 className="hero-item hero-item-1" style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.03em', margin: '6px 0 4px' }}>
            Analise Financeira
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
            Funil de cobranca, performance por fase e insights de IA
          </p>
        </div>
        <div style={{ display: 'flex', gap: 0, background: 'var(--surface-2)', borderRadius: 8, border: '1px solid var(--border)', padding: 3 }}>
          {(['7d', '30d', '90d'] as const).map(p => (
            <button
              key={p}
              onClick={() => setPeriodoAtivo(p)}
              style={{
                padding: '6px 12px', border: 'none', borderRadius: 6, cursor: 'pointer',
                fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 11,
                background: periodoAtivo === p ? 'var(--card-bg)' : 'transparent',
                color: periodoAtivo === p ? 'var(--accent)' : 'var(--text-muted)',
                boxShadow: periodoAtivo === p ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.15s',
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="hero-item hero-item-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Total Cobrado', valor: fmt(mesAtual.cobrado), icon: DollarSign, cor: '#0D3DCC', sub: 'Este mes' },
          { label: 'Total Arrecadado', valor: fmt(mesAtual.arrecadado), icon: TrendingUp, cor: '#1E8449', sub: 'Confirmados' },
          { label: 'Taxa de Conversao', valor: `${taxaConv}%`, icon: Target, cor: '#7C3AED', sub: 'Inadimplentes pagos' },
          { label: 'Ticket Medio', valor: fmt(ticketMedio), icon: Users, cor: '#D97706', sub: 'Por recuperacao' },
        ].map(k => (
          <div key={k.label} className="glass-card" style={{ padding: '16px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: `${k.cor}15`, border: `1px solid ${k.cor}25`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <k.icon size={13} color={k.cor} strokeWidth={2} />
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'Space Grotesk', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{k.label}</span>
            </div>
            <div style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: 20, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{k.valor}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Grafico + Funil */}
      <div className="hero-item hero-item-3" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16, marginBottom: 16 }}>

        {/* Grafico barras - arrecadado por mes */}
        <div className="glass-card" style={{ padding: '20px 24px' }}>
          <div className="page-label" style={{ marginBottom: 12 }}>
            <Calendar size={9} strokeWidth={2.5} />
            EVOLUCAO MENSAL
          </div>
          <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', marginBottom: 16 }}>
            Arrecadado vs Cobrado
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 110 }}>
            {MESES.map((m) => {
              const hArr = Math.round((m.arrecadado / maxArrecadado) * 100)
              const hCob = Math.round((m.cobrado / Math.max(...MESES.map(x => x.cobrado))) * 100)
              return (
                <div key={m.mes} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: '100%', flex: 1, display: 'flex', alignItems: 'flex-end', gap: 2 }}>
                    <div style={{ flex: 1, height: `${hCob}%`, background: 'rgba(13,61,204,0.15)', borderRadius: '3px 3px 1px 1px', border: '1px solid rgba(13,61,204,0.2)' }} />
                    <div style={{ flex: 1, height: `${hArr}%`, background: 'linear-gradient(180deg, #1E8449 0%, #0BBFAA 100%)', borderRadius: '3px 3px 1px 1px', opacity: 0.85 }} />
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'Space Grotesk', fontWeight: 600 }}>{m.mes}</div>
                </div>
              )
            })}
          </div>
          <div style={{ marginTop: 12, display: 'flex', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--text-muted)' }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: 'rgba(13,61,204,0.3)', border: '1px solid rgba(13,61,204,0.4)' }} />
              Cobrado
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--text-muted)' }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: 'linear-gradient(135deg, #1E8449, #0BBFAA)' }} />
              Arrecadado
            </div>
          </div>
        </div>

        {/* Funil */}
        <div className="glass-card" style={{ padding: '20px 24px' }}>
          <div className="page-label" style={{ marginBottom: 12 }}>
            <Target size={9} strokeWidth={2.5} />
            FUNIL DE COBRANCA
          </div>
          <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', marginBottom: 14 }}>
            Leads por fase
          </div>
          {FUNIL_DATA.map((item) => {
            const pct = Math.round((item.leads / Math.max(...FUNIL_DATA.map(f => f.leads))) * 100)
            const taxa = Math.round((item.conversoes / item.leads) * 100)
            return (
              <div key={item.fase} style={{ marginBottom: 9 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 11, color: 'var(--text-primary)' }}>{item.fase}</span>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.leads} leads</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#1E8449' }}>{taxa}% conv.</span>
                  </div>
                </div>
                <div style={{ height: 5, background: 'var(--surface-2)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: item.cor, borderRadius: 3, opacity: 0.8 }} />
                </div>
              </div>
            )
          })}
          <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{totalLeads} leads ativos</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#1E8449' }}>{totalConv} convertidos</span>
          </div>
        </div>
      </div>

      {/* Insights + Projecao */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

        {/* Insights IA */}
        <div className="glass-card" style={{ padding: '20px 24px' }}>
          <div className="page-label" style={{ marginBottom: 12 }}>
            <Sparkles size={9} strokeWidth={2.5} />
            INSIGHTS DE IA
          </div>
          <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', marginBottom: 14 }}>
            Padroes detectados
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {INSIGHTS.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 12px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: 7, background: `${item.cor}12`, border: `1px solid ${item.cor}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <item.icon size={13} color={item.cor} strokeWidth={2} />
                </div>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, paddingTop: 2 }}>{item.texto}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Projecao */}
        <div className="glass-card" style={{ padding: '20px 24px' }}>
          <div className="page-label" style={{ marginBottom: 12 }}>
            <TrendingUp size={9} strokeWidth={2.5} />
            PROJECAO — PROXIMOS 30 DIAS
          </div>
          <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', marginBottom: 14 }}>
            Receita recuperavel estimada
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { label: 'Conservadora', valor: 28400, icon: ArrowDown, cor: '#7A90B8', desc: '65% da media historica' },
              { label: 'Base', valor: 43700, icon: TrendingUp, cor: '#0D3DCC', desc: 'Tendencia atual mantida' },
              { label: 'Otimista', valor: 58200, icon: ArrowUp, cor: '#1E8449', desc: 'Campanha ativa + sazonalidade' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: 'var(--surface-2)', border: `1px solid ${item.cor}20`, borderRadius: 10, borderLeft: `3px solid ${item.cor}` }}>
                <item.icon size={16} color={item.cor} strokeWidth={2} style={{ flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'Space Grotesk', fontWeight: 600 }}>{item.label.toUpperCase()}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>{item.desc}</div>
                </div>
                <div style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: 16, color: item.cor }}>{fmt(item.valor)}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12, padding: '10px 12px', background: 'rgba(13,61,204,0.05)', border: '1px solid rgba(13,61,204,0.10)', borderRadius: 8 }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Projecao baseada em historico de 6 meses. Dados reais e precisos apos integracao com n8n (Epic 04).
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
