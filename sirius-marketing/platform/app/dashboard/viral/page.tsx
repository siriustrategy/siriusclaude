'use client'

import { useState } from 'react'
import { Flame, Calendar, Sparkles, ChevronRight, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

const tabs = ['Hoje', 'Semana', 'Mês']
const platforms = ['Todas', 'TikTok', 'Instagram', 'YouTube']

const mockTrends = [
  {
    id: 't1',
    title: 'Sound "É o amor" — vídeos com dedinho na testa',
    category: 'music',
    platforms: ['tiktok', 'instagram'],
    velocity: 'emerging',
    engagement: '4.2M interações',
    brandFit: 9,
    urgency: 'now',
    whyViral: 'Gatilho emocional de pertencimento + facilidade de participação + sound extremamente catchy',
    adaptationPreview: 'Adaptar o gesto para contexto do seu produto/serviço mostrando o "dedinho da excelência"',
  },
  {
    id: 't2',
    title: 'Copa do Mundo 2026 — conteúdo patriótico começa',
    category: 'event',
    platforms: ['instagram', 'youtube', 'tiktok'],
    velocity: 'growing',
    engagement: '12M posts/semana',
    brandFit: 7,
    urgency: 'this_week',
    whyViral: 'Evento de alto impacto emocional, identidade nacional forte, antecipação crescente',
    adaptationPreview: 'Conectar a marca com o espírito de superação e trabalho em equipe',
  },
  {
    id: 't3',
    title: 'Trend "Antes e Depois" — transformações rápidas',
    category: 'behavior',
    platforms: ['instagram', 'tiktok'],
    velocity: 'growing',
    engagement: '8.7M interações',
    brandFit: 8,
    urgency: 'this_week',
    whyViral: 'Satisfação visual instantânea, resultado claro, estrutura simples de reproduzir',
    adaptationPreview: 'Mostrar transformação do cliente ou processo do produto',
  },
  {
    id: 't4',
    title: 'YouTube Shorts: tutoriais de 60s com IA',
    category: 'aesthetic',
    platforms: ['youtube'],
    velocity: 'peak',
    engagement: '3.1M views/dia',
    brandFit: 6,
    urgency: 'standard',
    whyViral: 'Demanda por conteúdo educativo curto + fascínio com IA + algoritmo do YouTube Shorts favorecendo',
    adaptationPreview: 'Tutorial rápido sobre sua área de expertise usando IA',
  },
]

const velocityConfig: Record<string, { label: string; className: string }> = {
  emerging: { label: 'Emergindo', className: 'badge-primary' },
  growing:  { label: 'Crescendo', className: 'badge-success' },
  peak:     { label: 'No pico',   className: 'badge-warning' },
  declining:{ label: 'Caindo',    className: 'velocity-declining' },
}

const urgencyConfig: Record<string, { label: string; color: string; dot?: string }> = {
  now:       { label: 'Agir AGORA',  color: 'var(--danger)',      dot: '#ef4444' },
  this_week: { label: 'Esta semana', color: 'var(--warning)',     dot: '#f59e0b' },
  standard:  { label: 'Este mês',    color: 'var(--text-muted)' },
}

export default function ViralPage() {
  const [activeTab, setActiveTab] = useState('Hoje')
  const [activePlatform, setActivePlatform] = useState('Todas')
  const [expandedTrend, setExpandedTrend] = useState<string | null>(null)

  return (
    <div style={{ padding: '28px 36px' }}>

      {/* Header */}
      <motion.div
        style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div style={{
          width: 48, height: 48, borderRadius: 14,
          background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Flame size={20} color="#06b6d4" strokeWidth={2} />
        </div>
        <div>
          <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 24, fontWeight: 700, color: '#E8EEFF', marginBottom: 2 }}>
            Viral Intelligence
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#25D366', display: 'inline-block' }} />
            <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif' }}>
              Atualizado hoje às 08:00 — próxima segunda-feira
            </span>
          </div>
        </div>
      </motion.div>

      {/* Tabs período */}
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 16, padding: 4, borderRadius: 10, background: 'rgba(13,18,37,0.8)' }}>
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '6px 16px', borderRadius: 7, fontSize: 13, fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.15s', border: 'none',
              fontFamily: 'Space Grotesk, sans-serif',
              background: activeTab === tab ? '#3B5BDB' : 'transparent',
              color: activeTab === tab ? '#fff' : 'var(--text-secondary)',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Filtro plataforma */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
        {platforms.map((p) => (
          <button
            key={p}
            onClick={() => setActivePlatform(p)}
            style={{
              padding: '5px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.15s',
              fontFamily: 'Space Grotesk, sans-serif',
              background: activePlatform === p ? 'rgba(59,91,219,0.15)' : 'transparent',
              color: activePlatform === p ? '#93c5fd' : 'var(--text-secondary)',
              border: activePlatform === p ? '1px solid rgba(59,91,219,0.35)' : '1px solid var(--border)',
            }}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Trend cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 40 }}>
        {mockTrends.map((trend, i) => {
          const velocity = velocityConfig[trend.velocity]
          const urgency = urgencyConfig[trend.urgency]
          const isExpanded = expandedTrend === trend.id
          const isUrgent = trend.urgency === 'now'

          return (
            <motion.div
              key={trend.id}
              className="glass-card"
              style={{ overflow: 'hidden' }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <div style={{ padding: 18 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  {/* Número */}
                  <div style={{
                    width: 28, height: 28, borderRadius: 7, flexShrink: 0, marginTop: 2,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 700,
                    background: isUrgent ? 'rgba(239,68,68,0.1)' : 'var(--muted-bg)',
                    color: isUrgent ? 'var(--danger)' : 'var(--text-muted)',
                    border: isUrgent ? '1px solid rgba(239,68,68,0.25)' : '1px solid var(--border)',
                    fontFamily: 'Space Grotesk, sans-serif',
                  }}>
                    {i + 1}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 14, fontWeight: 700, color: '#E8EEFF', marginBottom: 8 }}>
                      {trend.title}
                    </h3>

                    {/* Meta */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' as const }}>
                      <span className={velocity.className}>{velocity.label}</span>

                      <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif' }}>
                        {trend.engagement}
                      </span>

                      {urgency.dot ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: urgency.dot, display: 'inline-block' }} />
                          <span style={{ fontSize: 12, fontWeight: 700, color: urgency.color, fontFamily: 'Space Grotesk, sans-serif' }}>{urgency.label}</span>
                        </div>
                      ) : (
                        <span style={{ fontSize: 12, color: urgency.color, fontFamily: 'Space Grotesk, sans-serif' }}>{urgency.label}</span>
                      )}

                      <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'Space Grotesk, sans-serif' }}>
                        Fit:{' '}
                        <span style={{
                          fontWeight: 700,
                          color: trend.brandFit >= 8 ? '#10b981' : trend.brandFit >= 6 ? '#f59e0b' : 'var(--text-muted)',
                        }}>
                          {trend.brandFit}/10
                        </span>
                      </span>
                    </div>

                    {/* Expanded */}
                    {isExpanded && (
                      <motion.div
                        style={{ marginTop: 14 }}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.2 }}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          <div style={{ padding: '12px 14px', borderRadius: 8, background: 'var(--muted-bg)', border: '1px solid var(--border)' }}>
                            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em', fontFamily: 'Space Grotesk, sans-serif', marginBottom: 5 }}>
                              POR QUE VIRALIZOU
                            </div>
                            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{trend.whyViral}</p>
                          </div>
                          <div style={{ padding: '12px 14px', borderRadius: 8, background: 'rgba(59,91,219,0.07)', border: '1px solid rgba(59,91,219,0.18)' }}>
                            <div style={{ fontSize: 10, fontWeight: 700, color: '#93c5fd', letterSpacing: '0.1em', fontFamily: 'Space Grotesk, sans-serif', marginBottom: 5 }}>
                              COMO USAR NA SUA MARCA
                            </div>
                            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{trend.adaptationPreview}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Ações */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                    <button
                      onClick={() => setExpandedTrend(isExpanded ? null : trend.id)}
                      className="btn-ghost"
                      style={{ fontSize: 12, padding: '6px 10px' }}
                    >
                      {isExpanded ? 'Fechar' : 'Analisar'}
                    </button>

                    <button
                      className={trend.brandFit >= 8 ? 'btn-neon-green' : 'btn-primary'}
                      style={{ fontSize: 12, padding: '7px 14px' }}
                    >
                      <Sparkles size={12} />
                      {trend.brandFit >= 8 ? 'Criar agora' : 'Criar'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Trend Predictor */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <Calendar size={14} color="var(--text-muted)" />
          <span className="section-label">TRENDS POR VIR — PREPARE-SE</span>
        </div>

        <div className="action-card-blue" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 42, height: 42, borderRadius: 10, flexShrink: 0,
            background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Zap size={18} color="#f59e0b" strokeWidth={2} />
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 14, color: '#E8EEFF', marginBottom: 3 }}>
              Copa do Mundo 2026 — conteúdo patriótico
            </h4>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              Pico previsto: Junho 2026 —{' '}
              <span style={{ color: '#f59e0b', fontWeight: 600 }}>comece a produzir agora</span>
              {' '}para estar pronto
            </p>
          </div>
          <button className="btn-secondary" style={{ fontSize: 12, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 5 }}>
            Ver planejamento
            <ChevronRight size={12} />
          </button>
        </div>
      </div>
    </div>
  )
}
