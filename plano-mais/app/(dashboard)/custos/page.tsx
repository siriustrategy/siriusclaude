'use client'

import { useState } from 'react'
import {
  DollarSign, TrendingDown, MessageSquare, Cpu, Zap,
  BarChart3, AlertTriangle, CheckCircle, Info,
} from 'lucide-react'

// ===================== MOCK DATA =====================
const CUSTOS_TIPOS = [
  { tipo: 'WhatsApp (Evolution)', icone: MessageSquare, cor: '#25D366', unitario: 0.12, volume: 588, limite_dia: 100 },
  { tipo: 'LLM Claude (Anthropic)', icone: Cpu,         cor: '#0D3DCC', unitario: 0.08, volume: 412, limite_dia: 80  },
  { tipo: 'Checkout (Asaas)',       icone: Zap,          cor: '#F59E0B', unitario: 0.10, volume: 86,  limite_dia: 40  },
]

const HISTORICO = [
  { dia: 'Seg', valor: 14.20 },
  { dia: 'Ter', valor: 18.60 },
  { dia: 'Qua', valor: 22.40 },
  { dia: 'Qui', valor: 16.80 },
  { dia: 'Sex', valor: 31.20 },
  { dia: 'Sab', valor: 9.40  },
  { dia: 'Dom', valor: 5.10  },
]

function fmt(v: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 }).format(v)
}

// ===================== PAGE =====================
export default function CustosPage() {
  const [periodoAtivo, setPeriodoAtivo] = useState<'dia' | 'semana' | 'mes'>('mes')

  const totalCusto = CUSTOS_TIPOS.reduce((s, c) => s + c.unitario * c.volume, 0)
  const totalVolume = CUSTOS_TIPOS.reduce((s, c) => s + c.volume, 0)
  const valorRecuperado = 43150
  const roi = Math.round(valorRecuperado / totalCusto)
  const custoPorLead = totalCusto / 86
  const maxHistorico = Math.max(...HISTORICO.map(h => h.valor))

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <div className="page-label hero-item hero-item-0">
            <DollarSign size={10} strokeWidth={2.5} />
            CUSTO DE OPERACAO
          </div>
          <h1 className="hero-item hero-item-1" style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.03em', margin: '6px 0 4px' }}>
            Controle de Custos
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
            ROI da operacao, custo por lead e performance por canal
          </p>
        </div>
        <div style={{ display: 'flex', gap: 0, background: 'var(--surface-2)', borderRadius: 8, border: '1px solid var(--border)', padding: 3 }}>
          {(['dia', 'semana', 'mes'] as const).map(p => (
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
                textTransform: 'capitalize',
              }}
            >
              {p === 'dia' ? 'Hoje' : p === 'semana' ? '7 dias' : 'Mes'}
            </button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="hero-item hero-item-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Custo Total', valor: fmt(totalCusto), icon: DollarSign, cor: '#0D3DCC', sub: 'Este mes' },
          { label: 'Custo por Lead', valor: fmt(custoPorLead), icon: TrendingDown, cor: '#7C3AED', sub: 'Media por recuperado' },
          { label: 'ROI', valor: `${roi}x`, icon: BarChart3, cor: '#1E8449', sub: 'Recuperado / Investido' },
          { label: 'Alertas', valor: '0', icon: AlertTriangle, cor: '#D97706', sub: 'Limites excedidos' },
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

      {/* Tabela + Grafico */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 16, marginBottom: 16 }}>

        {/* Tabela por canal */}
        <div className="glass-card" style={{ overflow: 'hidden', padding: 0 }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
            <div className="page-label">
              <BarChart3 size={9} strokeWidth={2.5} />
              CUSTO POR CANAL — ESTE MES
            </div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface-2)' }}>
                {['Canal / Tipo', 'Unitario', 'Volume', 'Total', '% do Total'].map(h => (
                  <th key={h} style={{ padding: '9px 14px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'Space Grotesk', letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CUSTOS_TIPOS.map((item, i) => {
                const total = item.unitario * item.volume
                const pct = Math.round((total / totalCusto) * 100)
                return (
                  <tr
                    key={item.tipo}
                    style={{ borderBottom: i < CUSTOS_TIPOS.length - 1 ? '1px solid var(--border)' : 'none' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-2)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                        <div style={{ width: 28, height: 28, borderRadius: 7, background: `${item.cor}15`, border: `1px solid ${item.cor}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <item.icone size={13} color={item.cor} strokeWidth={2} />
                        </div>
                        <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>{item.tipo}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px', fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: 13, color: 'var(--text-secondary)' }}>
                      R$ {item.unitario.toFixed(2)}
                    </td>
                    <td style={{ padding: '12px 14px', fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>
                      {item.volume.toLocaleString('pt-BR')}
                    </td>
                    <td style={{ padding: '12px 14px', fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>
                      {fmt(total)}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ flex: 1, height: 5, background: 'var(--surface-2)', borderRadius: 3, overflow: 'hidden', minWidth: 50 }}>
                          <div style={{ width: `${pct}%`, height: '100%', background: item.cor, borderRadius: 3 }} />
                        </div>
                        <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 11, color: 'var(--text-muted)', width: 30 }}>{pct}%</span>
                      </div>
                    </td>
                  </tr>
                )
              })}
              <tr style={{ borderTop: '1px solid var(--border)', background: 'var(--surface-2)' }}>
                <td colSpan={3} style={{ padding: '10px 14px', fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 13 }}>Total</td>
                <td style={{ padding: '10px 14px', fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: 14, color: 'var(--accent)' }}>{fmt(totalCusto)}</td>
                <td style={{ padding: '10px 14px', fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 11, color: 'var(--text-muted)' }}>{totalVolume.toLocaleString('pt-BR')} ops.</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Grafico historico semanal */}
        <div className="glass-card" style={{ padding: '20px 24px' }}>
          <div className="page-label" style={{ marginBottom: 12 }}>
            <DollarSign size={9} strokeWidth={2.5} />
            CUSTO DIARIO — ESTA SEMANA
          </div>
          <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', marginBottom: 16 }}>
            Historico 7 dias
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 100 }}>
            {HISTORICO.map((h) => {
              const hPct = Math.round((h.valor / maxHistorico) * 100)
              return (
                <div key={h.dia} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: '100%', flex: 1, display: 'flex', alignItems: 'flex-end' }}>
                    <div style={{
                      width: '100%',
                      height: hPct > 0 ? `${Math.max(hPct, 8)}%` : '3px',
                      background: h.valor > maxHistorico * 0.7
                        ? 'linear-gradient(180deg, #DC2626 0%, #EA580C 100%)'
                        : 'linear-gradient(180deg, #0D3DCC 0%, #0BBFAA 100%)',
                      borderRadius: '4px 4px 2px 2px',
                      opacity: 0.85,
                    }} />
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'Space Grotesk', fontWeight: 600 }}>{h.dia}</div>
                </div>
              )
            })}
          </div>
          <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Total 7 dias: <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{fmt(HISTORICO.reduce((s, h) => s + h.valor, 0))}</span></span>
            <span style={{ fontSize: 11, color: '#DC2626', fontWeight: 700 }}>Pico: {fmt(maxHistorico)}</span>
          </div>
        </div>
      </div>

      {/* ROI detalhado */}
      <div className="glass-card" style={{ padding: '20px 24px' }}>
        <div className="page-label" style={{ marginBottom: 12 }}>
          <CheckCircle size={9} strokeWidth={2.5} />
          ROI DA OPERACAO
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {[
            { label: 'Valor Recuperado', valor: fmt(valorRecuperado), icon: TrendingDown, cor: '#1E8449', desc: 'Pagamentos confirmados' },
            { label: 'Custo Total Investido', valor: fmt(totalCusto), icon: DollarSign, cor: '#0D3DCC', desc: 'Todas as operacoes' },
            { label: 'ROI', valor: `${roi}x`, icon: BarChart3, cor: '#7C3AED', desc: 'Para cada R$1 investido' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: 'var(--surface-2)', border: `1px solid ${item.cor}15`, borderRadius: 10, borderLeft: `3px solid ${item.cor}` }}>
              <item.icon size={18} color={item.cor} strokeWidth={2} style={{ flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'Space Grotesk', fontWeight: 600 }}>{item.label.toUpperCase()}</div>
                <div style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: 18, color: item.cor, marginTop: 2 }}>{item.valor}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, padding: '10px 12px', background: 'rgba(30,132,73,0.05)', border: '1px solid rgba(30,132,73,0.12)', borderRadius: 8, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
          <Info size={13} color="#1E8449" strokeWidth={2} style={{ flexShrink: 0, marginTop: 1 }} />
          <span style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Custo automático registrado via n8n workflows após Epic 04. Hoje os valores são estimados com base nas tarifas configuradas.
          </span>
        </div>
      </div>
    </div>
  )
}
