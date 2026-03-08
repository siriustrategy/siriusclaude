'use client'

import { BarChart2, TrendingUp, TrendingDown, Users, Heart, MessageCircle, Share2, Eye } from 'lucide-react'
import { motion } from 'framer-motion'

const kpis = [
  { label: 'Alcance total', value: '142.8k', delta: '+18%', up: true, color: '#10b981' },
  { label: 'Engajamento médio', value: '4.7%', delta: '+0.9pp', up: true, color: '#3B5BDB' },
  { label: 'Seguidores ganhos', value: '+1.247', delta: '+34%', up: true, color: '#7C3AED' },
  { label: 'Posts publicados', value: '34', delta: '-2', up: false, color: '#f59e0b' },
]

const topPosts = [
  {
    id: 'p1',
    platform: 'Instagram',
    type: 'Reel',
    preview: '3 erros que impedem seu negócio de crescer...',
    reach: '28.4k',
    likes: '1.2k',
    comments: '143',
    shares: '89',
    date: '03 Mar',
    color: '#7C3AED',
  },
  {
    id: 'p2',
    platform: 'TikTok',
    type: 'Vídeo',
    preview: 'POV: quando o cliente diz que não tem tempo...',
    reach: '51.2k',
    likes: '3.8k',
    comments: '220',
    shares: '415',
    date: '01 Mar',
    color: '#06b6d4',
  },
  {
    id: 'p3',
    platform: 'Instagram',
    type: 'Carrossel',
    preview: 'Antes e depois: transformação de perfil em 30 dias',
    reach: '19.7k',
    likes: '876',
    comments: '98',
    shares: '62',
    date: '27 Fev',
    color: '#7C3AED',
  },
]

const platformBreakdown = [
  { platform: 'Instagram', posts: 18, reach: '72k', engagement: '4.2%', color: '#7C3AED', pct: 60 },
  { platform: 'TikTok', posts: 10, reach: '58k', engagement: '6.1%', color: '#06b6d4', pct: 48 },
  { platform: 'YouTube', posts: 6, reach: '12k', engagement: '2.8%', color: '#ef4444', pct: 25 },
]

const weeklyData = [
  { day: 'Seg', reach: 18, engagement: 4.2 },
  { day: 'Ter', reach: 24, engagement: 5.1 },
  { day: 'Qua', reach: 31, engagement: 6.3 },
  { day: 'Qui', reach: 22, engagement: 4.8 },
  { day: 'Sex', reach: 28, engagement: 5.5 },
  { day: 'Sáb', reach: 19, engagement: 4.0 },
  { day: 'Dom', reach: 12, engagement: 3.2 },
]

const maxReach = Math.max(...weeklyData.map(d => d.reach))

export default function AnalyticsPage() {
  return (
    <div style={{ padding: '40px 48px', maxWidth: 1040, margin: '0 auto' }}>

      {/* Header */}
      <motion.div
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 42, height: 42, borderRadius: 12,
            background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <BarChart2 size={20} color="#10b981" strokeWidth={2} />
          </div>
          <div>
            <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 20, fontWeight: 700, color: '#E8EEFF', marginBottom: 2 }}>
              Analytics
            </h1>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif' }}>
              Últimos 30 dias · Atualizado hoje às 09:00
            </div>
          </div>
        </div>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: 4, borderRadius: 10, background: 'rgba(13,18,37,0.8)' }}>
          {['7 dias', '30 dias', '90 dias'].map((p, i) => (
            <button key={p} style={{
              padding: '6px 14px', borderRadius: 7, fontSize: 13, fontWeight: 600,
              cursor: 'pointer', border: 'none', fontFamily: 'Space Grotesk, sans-serif',
              background: i === 1 ? '#3B5BDB' : 'transparent',
              color: i === 1 ? '#fff' : 'var(--text-secondary)',
            }}>{p}</button>
          ))}
        </div>
      </motion.div>

      {/* KPIs */}
      <motion.div
        style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 28 }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        {kpis.map((kpi) => (
          <div key={kpi.label} className="glass-card" style={{ padding: '18px 20px' }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase' as const, marginBottom: 10 }}>
              {kpi.label}
            </div>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 24, fontWeight: 700, color: '#E8EEFF', marginBottom: 6 }}>
              {kpi.value}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {kpi.up ? <TrendingUp size={12} color="#10b981" /> : <TrendingDown size={12} color="#ef4444" />}
              <span style={{ fontSize: 12, fontWeight: 600, color: kpi.up ? '#10b981' : '#ef4444', fontFamily: 'Space Grotesk, sans-serif' }}>
                {kpi.delta}
              </span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif' }}>vs mês ant.</span>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Chart + Platform breakdown */}
      <motion.div
        style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, marginBottom: 28 }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
      >
        {/* Reach chart (bar) */}
        <div className="glass-card" style={{ padding: '20px 22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, fontWeight: 700, color: '#E8EEFF' }}>Alcance diário (mil)</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: '#3B5BDB' }} />
                <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif' }}>Alcance</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 100 }}>
            {weeklyData.map((d) => (
              <div key={d.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{
                  width: '100%', borderRadius: '4px 4px 0 0',
                  height: `${(d.reach / maxReach) * 80}px`,
                  background: 'linear-gradient(180deg, #3B5BDB, rgba(59,91,219,0.4))',
                  transition: 'height 0.5s ease',
                }} />
                <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif' }}>{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Platform breakdown */}
        <div className="glass-card" style={{ padding: '20px 22px' }}>
          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, fontWeight: 700, color: '#E8EEFF', marginBottom: 16 }}>
            Por plataforma
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {platformBreakdown.map((p) => (
              <div key={p.platform}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#E8EEFF', fontFamily: 'Space Grotesk, sans-serif' }}>{p.platform}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif' }}>{p.reach}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#10b981', fontFamily: 'Space Grotesk, sans-serif' }}>{p.engagement}</span>
                  </div>
                </div>
                <div style={{ background: 'rgba(59,91,219,0.1)', borderRadius: 3, height: 4, overflow: 'hidden' }}>
                  <div style={{
                    width: `${p.pct}%`, height: '100%',
                    background: p.color,
                    borderRadius: 3,
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Top posts */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <div style={{ marginBottom: 14 }}>
          <span className="section-label">TOP POSTS DO MÊS</span>
        </div>
        <div className="glass-card" style={{ overflow: 'hidden' }}>
          {topPosts.map((post, i) => (
            <div key={post.id} style={{
              display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px',
              borderBottom: i < topPosts.length - 1 ? '1px solid var(--border)' : 'none',
            }}>
              {/* Rank */}
              <div style={{
                width: 28, height: 28, borderRadius: 7, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700, color: i === 0 ? '#f59e0b' : 'var(--text-muted)',
                background: i === 0 ? 'rgba(245,158,11,0.12)' : 'var(--muted-bg)',
                border: i === 0 ? '1px solid rgba(245,158,11,0.25)' : '1px solid var(--border)',
                fontFamily: 'Space Grotesk, sans-serif',
              }}>
                #{i + 1}
              </div>

              {/* Platform badge */}
              <span style={{
                padding: '3px 9px', borderRadius: 20, fontSize: 11, fontWeight: 700, flexShrink: 0,
                background: `${post.color}18`, color: post.color,
                border: `1px solid ${post.color}30`,
                fontFamily: 'Space Grotesk, sans-serif',
              }}>
                {post.platform}
              </span>

              {/* Preview */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#E8EEFF', fontFamily: 'Space Grotesk, sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>
                  {post.preview}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif', marginTop: 2 }}>
                  {post.type} · {post.date}
                </div>
              </div>

              {/* Metrics */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Eye size={12} color="var(--text-muted)" />
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#E8EEFF', fontFamily: 'Space Grotesk, sans-serif' }}>{post.reach}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Heart size={12} color="#ef4444" />
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'Space Grotesk, sans-serif' }}>{post.likes}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <MessageCircle size={12} color="var(--text-muted)" />
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'Space Grotesk, sans-serif' }}>{post.comments}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Share2 size={12} color="var(--text-muted)" />
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'Space Grotesk, sans-serif' }}>{post.shares}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
