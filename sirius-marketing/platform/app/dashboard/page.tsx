'use client'

import { TrendingUp, ImagePlus, Lightbulb, BarChart2, ArrowRight, Flame, Zap, Sparkles, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

const displayName = 'Breno'

const urgentAction = {
  icon: Flame,
  title: 'Trend viral agora',
  description: 'Sound do TikTok com 2.3M views em 24h — 87% de fit com sua marca. Janela de oportunidade: 48h.',
  cta: 'Aproveitar agora',
  href: '/dashboard/viral',
  color: '#06b6d4',
}

const nextActions = [
  {
    icon: ImagePlus,
    title: 'Calendário de amanhã vazio',
    description: '3 slots sem conteúdo para amanhã no Instagram',
    cta: 'Criar conteúdo',
    href: '/dashboard/content',
    color: '#7C3AED',
  },
  {
    icon: BarChart2,
    title: 'Relatório semanal pronto',
    description: 'Seu post de quarta teve 2.1x mais engajamento',
    cta: 'Ver insights',
    href: '/dashboard/analytics',
    color: '#10b981',
  },
  {
    icon: Lightbulb,
    title: 'Novas ideias geradas',
    description: '12 ideias de conteúdo criadas esta semana para você',
    cta: 'Explorar ideias',
    href: '/dashboard/ideas',
    color: '#f59e0b',
  },
]

const stats = [
  { label: 'Créditos', value: '87', sub: 'disponíveis', color: '#5B7BFF' },
  { label: 'Posts criados', value: '34', sub: 'este mês', color: '#10b981' },
  { label: 'Engajamento', value: '+2.1x', sub: 'vs semana ant.', color: '#f59e0b' },
]

const quickActions = [
  { label: 'Gerar imagem', href: '/dashboard/studio', icon: ImagePlus, cost: 5, color: '#7C3AED' },
  { label: 'Escrever copy', href: '/dashboard/content', icon: TrendingUp, cost: 3, color: '#3B5BDB' },
  { label: 'Gerar ideias', href: '/dashboard/ideas', icon: Lightbulb, cost: 3, color: '#f59e0b' },
  { label: 'Ver trends', href: '/dashboard/viral', icon: Flame, cost: 0, color: '#06b6d4' },
]

const scheduledPosts = [
  { platform: 'Instagram', time: 'Hoje 19:00', type: 'Reel', color: '#7C3AED' },
  { platform: 'TikTok', time: 'Amanhã 12:00', type: 'Vídeo', color: '#06b6d4' },
  { platform: 'Instagram', time: 'Qui 18:00', type: 'Carrossel', color: '#7C3AED' },
]

export default function DashboardPage() {
  return (
    <div style={{ padding: '40px 48px', maxWidth: 1040, margin: '0 auto' }}>

      {/* Greeting */}
      <motion.div
        style={{ marginBottom: 32 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <span className="section-label">MEU PAINEL</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#25D366', display: 'inline-block' }} />
            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif' }}>ao vivo</span>
          </div>
        </div>
        <h1 style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: 28, fontWeight: 700, marginBottom: 6, lineHeight: 1.2, color: '#E8EEFF',
        }}>
          Olá, <span style={{ color: '#5B7BFF' }}>{displayName}</span>! O que vamos criar hoje?
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, fontStyle: 'italic' }}>
          "Conteúdo consistente supera conteúdo perfeito todos os dias."
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 28 }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {stats.map((stat) => (
          <div key={stat.label} className="glass-card" style={{ padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: `${stat.color}15`, border: `1px solid ${stat.color}25`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Zap size={14} color={stat.color} strokeWidth={2} />
              </div>
              <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase' }}>
                {stat.label}
              </span>
            </div>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 22, fontWeight: 700, color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{stat.sub}</div>
          </div>
        ))}
      </motion.div>

      {/* Ação urgente */}
      <motion.div
        style={{ marginBottom: 28 }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        <Link href={urgentAction.href} style={{ textDecoration: 'none', display: 'block' }}>
          <div className="action-card-cyan" style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <div style={{
              width: 52, height: 52, flexShrink: 0,
              background: 'rgba(6,182,212,0.18)', border: '1px solid rgba(6,182,212,0.4)',
              borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Flame size={24} color="#06b6d4" strokeWidth={2} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#06b6d4', letterSpacing: '0.1em', fontFamily: 'Space Grotesk, sans-serif' }}>
                  AGIR AGORA
                </span>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#06b6d4', display: 'inline-block', opacity: 0.8 }} />
              </div>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 16, color: '#E8EEFF', marginBottom: 3 }}>
                {urgentAction.title}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{urgentAction.description}</div>
            </div>
            <div style={{
              background: '#06b6d4', borderRadius: 8, padding: '9px 20px',
              fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 13, color: '#fff',
              flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6,
            }}>
              {urgentAction.cta}
              <ChevronRight size={14} />
            </div>
          </div>
        </Link>
      </motion.div>

      {/* O que fazer agora */}
      <motion.div
        style={{ marginBottom: 36 }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div style={{ marginBottom: 14 }}>
          <span className="section-label">O QUE FAZER AGORA</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {nextActions.map((action, i) => {
            const Icon = action.icon
            return (
              <Link key={i} href={action.href} style={{ textDecoration: 'none' }}>
                <motion.div
                  className="glass-card"
                  style={{ padding: '18px 20px', height: '100%', cursor: 'pointer' }}
                  whileHover={{ borderColor: `${action.color}40`, y: -2 }}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + i * 0.07 }}
                >
                  <div style={{
                    width: 38, height: 38, borderRadius: 10,
                    background: `${action.color}15`, border: `1px solid ${action.color}25`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12,
                  }}>
                    <Icon size={18} color={action.color} strokeWidth={1.8} />
                  </div>
                  <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 14, color: '#E8EEFF', marginBottom: 6, lineHeight: 1.3 }}>
                    {action.title}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 14, lineHeight: 1.5 }}>
                    {action.description}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600, color: action.color, fontFamily: 'Space Grotesk, sans-serif' }}>
                    {action.cta} <ArrowRight size={12} />
                  </div>
                </motion.div>
              </Link>
            )
          })}
        </div>
      </motion.div>

      {/* Ações rápidas + Publicações */}
      <motion.div
        style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20 }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35 }}
      >
        {/* Ações rápidas */}
        <div>
          <div style={{ marginBottom: 12 }}>
            <span className="section-label">AÇÕES RÁPIDAS</span>
          </div>
          <div className="glass-card" style={{ overflow: 'hidden' }}>
            {quickActions.map((action, i) => {
              const Icon = action.icon
              return (
                <Link key={i} href={action.href} style={{ textDecoration: 'none' }}>
                  <div
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '13px 16px',
                      borderBottom: i < quickActions.length - 1 ? '1px solid var(--border)' : 'none',
                      transition: 'background 0.15s', cursor: 'pointer',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'var(--muted-bg)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent' }}
                  >
                    <div style={{
                      width: 30, height: 30, borderRadius: 7,
                      background: `${action.color}12`, border: `1px solid ${action.color}20`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <Icon size={14} color={action.color} strokeWidth={2} />
                    </div>
                    <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: '#E8EEFF', fontFamily: 'Space Grotesk, sans-serif' }}>
                      {action.label}
                    </span>
                    {action.cost > 0 ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif' }}>
                        <Zap size={10} /> {action.cost}
                      </span>
                    ) : (
                      <span className="badge-success" style={{ fontSize: 10 }}>grátis</span>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Próximas publicações */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span className="section-label">PRÓXIMAS PUBLICAÇÕES</span>
            <Link href="/dashboard/distribution" style={{ fontSize: 12, color: '#5B7BFF', textDecoration: 'none', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600 }}>
              Ver tudo
            </Link>
          </div>
          <div className="glass-card" style={{ overflow: 'hidden', marginBottom: 12 }}>
            {scheduledPosts.map((post, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '14px 18px',
                borderBottom: i < scheduledPosts.length - 1 ? '1px solid var(--border)' : 'none',
              }}>
                <div style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: post.color, flexShrink: 0,
                }} />
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#E8EEFF', fontFamily: 'Space Grotesk, sans-serif' }}>{post.platform}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 8 }}>{post.type}</span>
                </div>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'Space Grotesk, sans-serif' }}>{post.time}</span>
                <span className="badge-success" style={{ fontSize: 10 }}>agendado</span>
              </div>
            ))}
          </div>

          {/* Studio CTA */}
          <Link href="/dashboard/studio" style={{ textDecoration: 'none', display: 'block' }}>
            <div className="action-card-purple" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 42, height: 42, flexShrink: 0,
                background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.4)',
                borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Sparkles size={20} color="#9461FF" strokeWidth={2} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#9461FF', letterSpacing: '0.1em', marginBottom: 3, fontFamily: 'Space Grotesk, sans-serif' }}>
                  CREATIVE STUDIO
                </div>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 14, color: '#E8EEFF' }}>Gerar imagem agora</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 1 }}>Flux · Kling · Seaart — 5 créditos</div>
              </div>
              <div style={{
                background: '#7C3AED', borderRadius: 8, padding: '8px 16px',
                fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 13, color: '#fff',
                flexShrink: 0, display: 'flex', alignItems: 'center', gap: 5,
              }}>
                Criar <ChevronRight size={13} />
              </div>
            </div>
          </Link>
        </div>
      </motion.div>

    </div>
  )
}
