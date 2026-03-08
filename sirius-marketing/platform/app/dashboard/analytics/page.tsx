'use client'

import { useState } from 'react'
import { BarChart2, TrendingUp, TrendingDown, Heart, MessageCircle, Share2, Eye, Users, Bookmark, Clock, ChevronDown } from 'lucide-react'
import { motion } from 'framer-motion'

// Simulated Instagram pages connected
const igPages = [
  {
    id: 'ig1',
    handle: '@siriusacademy',
    name: 'Sirius Academy',
    avatar: 'SA',
    color: '#3B5BDB',
    followers: 12480,
    followersDelta: '+1.247',
    followersDeltaUp: true,
    reach: '142.8k',
    reachDelta: '+18%',
    reachDeltaUp: true,
    impressions: '318k',
    impressionsDelta: '+22%',
    impressionsDeltaUp: true,
    engagement: '4.7%',
    engagementDelta: '+0.9pp',
    engagementDeltaUp: true,
    saves: '2.1k',
    savesDelta: '+31%',
    savesDeltaUp: true,
    storyViews: '8.4k',
    storyViewsDelta: '+12%',
    storyViewsDeltaUp: true,
    bestTime: '19:00–21:00',
    bestDay: 'Quarta e Quinta',
    audienceAge: [
      { range: '18–24', pct: 28 },
      { range: '25–34', pct: 41 },
      { range: '35–44', pct: 19 },
      { range: '45+', pct: 12 },
    ],
    audienceGender: { female: 62, male: 38 },
    weeklyData: [
      { day: 'Seg', reach: 18, engagement: 4.2 },
      { day: 'Ter', reach: 24, engagement: 5.1 },
      { day: 'Qua', reach: 31, engagement: 6.3 },
      { day: 'Qui', reach: 22, engagement: 4.8 },
      { day: 'Sex', reach: 28, engagement: 5.5 },
      { day: 'Sáb', reach: 19, engagement: 4.0 },
      { day: 'Dom', reach: 12, engagement: 3.2 },
    ],
    topPosts: [
      { preview: '3 erros que impedem seu negócio de crescer no IG', type: 'Reel', reach: '28.4k', likes: '1.2k', comments: '143', saves: '312', date: '03 Mar' },
      { preview: 'Antes e depois: transformação em 30 dias', type: 'Carrossel', reach: '19.7k', likes: '876', comments: '98', saves: '189', date: '27 Fev' },
      { preview: '5 tipos de conteúdo que geram leads', type: 'Reel', reach: '15.2k', likes: '634', comments: '72', saves: '98', date: '21 Fev' },
    ],
  },
  {
    id: 'ig2',
    handle: '@minhaloja',
    name: 'Minha Loja',
    avatar: 'ML',
    color: '#7C3AED',
    followers: 3240,
    followersDelta: '+182',
    followersDeltaUp: true,
    reach: '24.1k',
    reachDelta: '+6%',
    reachDeltaUp: true,
    impressions: '58k',
    impressionsDelta: '-3%',
    impressionsDeltaUp: false,
    engagement: '3.2%',
    engagementDelta: '-0.4pp',
    engagementDeltaUp: false,
    saves: '410',
    savesDelta: '+8%',
    savesDeltaUp: true,
    storyViews: '1.9k',
    storyViewsDelta: '+5%',
    storyViewsDeltaUp: true,
    bestTime: '12:00–14:00',
    bestDay: 'Segunda e Sexta',
    audienceAge: [
      { range: '18–24', pct: 35 },
      { range: '25–34', pct: 38 },
      { range: '35–44', pct: 17 },
      { range: '45+', pct: 10 },
    ],
    audienceGender: { female: 71, male: 29 },
    weeklyData: [
      { day: 'Seg', reach: 8, engagement: 3.1 },
      { day: 'Ter', reach: 11, engagement: 3.8 },
      { day: 'Qua', reach: 14, engagement: 4.0 },
      { day: 'Qui', reach: 9, engagement: 3.2 },
      { day: 'Sex', reach: 13, engagement: 3.9 },
      { day: 'Sáb', reach: 7, engagement: 2.8 },
      { day: 'Dom', reach: 5, engagement: 2.2 },
    ],
    topPosts: [
      { preview: 'Novidade: coleção de inverno chegou!', type: 'Carrossel', reach: '7.2k', likes: '312', comments: '41', saves: '88', date: '05 Mar' },
      { preview: 'Como cuidar das suas peças favoritas', type: 'Reel', reach: '5.8k', likes: '198', comments: '28', saves: '62', date: '28 Fev' },
      { preview: 'Clientes reais, resultados reais ❤️', type: 'Post', reach: '4.1k', likes: '156', comments: '19', saves: '34', date: '22 Fev' },
    ],
  },
]

const periods = ['7 dias', '30 dias', '90 dias']

function Delta({ value, up }: { value: string; up: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      {up ? <TrendingUp size={11} color="#10b981" /> : <TrendingDown size={11} color="#ef4444" />}
      <span style={{ fontSize: 11, fontWeight: 600, color: up ? '#10b981' : '#ef4444', fontFamily: 'Space Grotesk, sans-serif' }}>{value}</span>
    </div>
  )
}

export default function AnalyticsPage() {
  const [activePage, setActivePage] = useState(igPages[0])
  const [activePeriod, setActivePeriod] = useState('30 dias')
  const [pageDropdown, setPageDropdown] = useState(false)
  const maxReach = Math.max(...activePage.weeklyData.map(d => d.reach))

  return (
    <div style={{ padding: '28px 36px' }}>

      {/* Header */}
      <motion.div
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <BarChart2 size={20} color="#10b981" strokeWidth={2} />
          </div>
          <div>
            <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 24, fontWeight: 700, color: '#E8EEFF', marginBottom: 2 }}>
              Analytics
            </h1>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif' }}>
              Atualizado hoje às 09:00
            </div>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Period toggle */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 2, padding: 4, borderRadius: 10, background: 'rgba(13,18,37,0.8)' }}>
            {periods.map((p) => (
              <button key={p} onClick={() => setActivePeriod(p)} style={{
                padding: '6px 14px', borderRadius: 7, fontSize: 12, fontWeight: 600,
                cursor: 'pointer', border: 'none', fontFamily: 'Space Grotesk, sans-serif',
                background: activePeriod === p ? '#3B5BDB' : 'transparent',
                color: activePeriod === p ? '#fff' : 'var(--text-secondary)',
              }}>{p}</button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Page selector */}
      <motion.div
        style={{ marginBottom: 24, position: 'relative' as const }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <span className="section-label">PÁGINA DO INSTAGRAM</span>
        </div>

        {/* Page tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {igPages.map((page) => {
            const isActive = activePage.id === page.id
            return (
              <button
                key={page.id}
                onClick={() => setActivePage(page)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 9,
                  padding: '8px 14px', borderRadius: 10, cursor: 'pointer',
                  background: isActive ? `${page.color}18` : 'var(--muted-bg)',
                  border: isActive ? `1px solid ${page.color}40` : '1px solid var(--border)',
                  transition: 'all 0.15s',
                }}
              >
                <div style={{
                  width: 26, height: 26, borderRadius: 7, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, fontWeight: 800, color: '#fff',
                  background: page.color,
                }}>
                  {page.avatar}
                </div>
                <div style={{ textAlign: 'left' as const }}>
                  <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, fontWeight: 700, color: isActive ? '#E8EEFF' : 'var(--text-secondary)' }}>
                    {page.handle}
                  </div>
                  <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 10, color: 'var(--text-muted)' }}>
                    {page.followers.toLocaleString('pt-BR')} seguidores
                  </div>
                </div>
              </button>
            )
          })}
          <button style={{
            padding: '8px 12px', borderRadius: 10, cursor: 'pointer',
            background: 'transparent', border: '1px dashed var(--border)',
            color: 'var(--text-muted)', fontSize: 12, fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 600,
          }}>
            + Conectar página
          </button>
        </div>
      </motion.div>

      {/* KPIs 6-grid */}
      <motion.div
        key={activePage.id}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        {[
          { label: 'Alcance', value: activePage.reach, delta: activePage.reachDelta, up: activePage.reachDeltaUp, icon: Eye, color: '#10b981' },
          { label: 'Impressões', value: activePage.impressions, delta: activePage.impressionsDelta, up: activePage.impressionsDeltaUp, icon: BarChart2, color: '#3B5BDB' },
          { label: 'Engajamento', value: activePage.engagement, delta: activePage.engagementDelta, up: activePage.engagementDeltaUp, icon: Heart, color: '#ef4444' },
          { label: 'Saves', value: activePage.saves, delta: activePage.savesDelta, up: activePage.savesDeltaUp, icon: Bookmark, color: '#f59e0b' },
          { label: 'Views de Stories', value: activePage.storyViews, delta: activePage.storyViewsDelta, up: activePage.storyViewsDeltaUp, icon: Users, color: '#7C3AED' },
          { label: 'Seguidores ganhos', value: activePage.followersDelta, delta: activePage.followersDelta, up: activePage.followersDeltaUp, icon: Users, color: '#06b6d4' },
        ].map((kpi) => {
          const Icon = kpi.icon
          return (
            <div key={kpi.label} className="glass-card" style={{ padding: '20px 22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 9,
                  background: `${kpi.color}15`, border: `1px solid ${kpi.color}25`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={16} color={kpi.color} strokeWidth={2} />
                </div>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>
                  {kpi.label}
                </span>
              </div>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 30, fontWeight: 700, color: '#E8EEFF', marginBottom: 6, lineHeight: 1 }}>
                {kpi.value}
              </div>
              <Delta value={kpi.delta} up={kpi.up} />
            </div>
          )
        })}
      </motion.div>

      {/* Chart + Audience */}
      <motion.div
        key={activePage.id + '-chart'}
        style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20, marginBottom: 24 }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05 }}
      >
        {/* Reach bar chart */}
        <div className="glass-card" style={{ padding: '20px 22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, fontWeight: 700, color: '#E8EEFF' }}>
              Alcance diário — {activePage.handle}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 140 }}>
            {activePage.weeklyData.map((d) => (
              <div key={d.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: '100%', borderRadius: '4px 4px 0 0',
                  height: `${(d.reach / maxReach) * 114}px`,
                  background: `linear-gradient(180deg, ${activePage.color}, ${activePage.color}55)`,
                }} />
                <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif' }}>{d.day}</span>
              </div>
            ))}
          </div>

          {/* Best time hint */}
          <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, background: 'rgba(59,91,219,0.07)', border: '1px solid rgba(59,91,219,0.15)' }}>
            <Clock size={13} color="#93c5fd" />
            <div>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'Space Grotesk, sans-serif' }}>
                Melhor horário: <span style={{ fontWeight: 700, color: '#93c5fd' }}>{activePage.bestTime}</span>
              </span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif', marginLeft: 8 }}>
                · {activePage.bestDay}
              </span>
            </div>
          </div>
        </div>

        {/* Audience */}
        <div className="glass-card" style={{ padding: '20px 22px' }}>
          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, fontWeight: 700, color: '#E8EEFF', marginBottom: 16 }}>
            Audiência
          </div>

          {/* Gender */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', marginBottom: 6, fontFamily: 'Space Grotesk, sans-serif' }}>
              <span>Feminino {activePage.audienceGender.female}%</span>
              <span>Masculino {activePage.audienceGender.male}%</span>
            </div>
            <div style={{ height: 6, borderRadius: 3, overflow: 'hidden', display: 'flex' }}>
              <div style={{ width: `${activePage.audienceGender.female}%`, background: '#a855f7', transition: 'width 0.5s ease' }} />
              <div style={{ flex: 1, background: '#3B5BDB' }} />
            </div>
          </div>

          {/* Age */}
          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em', fontFamily: 'Space Grotesk, sans-serif', marginBottom: 10 }}>
            FAIXA ETÁRIA
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {activePage.audienceAge.map((a) => (
              <div key={a.range}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4, fontFamily: 'Space Grotesk, sans-serif' }}>
                  <span>{a.range}</span>
                  <span style={{ fontWeight: 700, color: '#E8EEFF' }}>{a.pct}%</span>
                </div>
                <div style={{ background: 'rgba(59,91,219,0.1)', borderRadius: 2, height: 3 }}>
                  <div style={{ width: `${a.pct}%`, height: '100%', background: activePage.color, borderRadius: 2, transition: 'width 0.5s ease' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Top posts desta página */}
      <motion.div
        key={activePage.id + '-posts'}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
      >
        <div style={{ marginBottom: 14 }}>
          <span className="section-label">TOP POSTS — {activePage.handle}</span>
        </div>
        <div className="glass-card" style={{ overflow: 'hidden' }}>
          {activePage.topPosts.map((post, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 16, padding: '14px 20px',
              borderBottom: i < activePage.topPosts.length - 1 ? '1px solid var(--border)' : 'none',
            }}>
              <div style={{
                width: 26, height: 26, borderRadius: 6, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700,
                color: i === 0 ? '#f59e0b' : 'var(--text-muted)',
                background: i === 0 ? 'rgba(245,158,11,0.12)' : 'var(--muted-bg)',
                border: i === 0 ? '1px solid rgba(245,158,11,0.25)' : '1px solid var(--border)',
                fontFamily: 'Space Grotesk, sans-serif',
              }}>
                #{i + 1}
              </div>

              <span style={{
                padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 700, flexShrink: 0,
                background: `${activePage.color}18`, color: activePage.color,
                border: `1px solid ${activePage.color}30`,
                fontFamily: 'Space Grotesk, sans-serif',
              }}>
                {post.type}
              </span>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#E8EEFF', fontFamily: 'Space Grotesk, sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>
                  {post.preview}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif', marginTop: 2 }}>{post.date}</div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Eye size={11} color="var(--text-muted)" />
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#E8EEFF', fontFamily: 'Space Grotesk, sans-serif' }}>{post.reach}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Heart size={11} color="#ef4444" />
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'Space Grotesk, sans-serif' }}>{post.likes}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <MessageCircle size={11} color="var(--text-muted)" />
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'Space Grotesk, sans-serif' }}>{post.comments}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Bookmark size={11} color="var(--text-muted)" />
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'Space Grotesk, sans-serif' }}>{post.saves}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
