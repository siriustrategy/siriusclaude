'use client'

import { useState } from 'react'
import { Send, Calendar, Clock, Plus, ChevronLeft, ChevronRight, Check, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'

const platformColor: Record<string, string> = {
  Instagram: '#7C3AED',
  TikTok: '#06b6d4',
  YouTube: '#ef4444',
  LinkedIn: '#3B5BDB',
}

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  scheduled: { label: 'Agendado', color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
  published: { label: 'Publicado', color: 'var(--text-muted)', bg: 'var(--muted-bg)' },
  draft: { label: 'Rascunho', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  failed: { label: 'Falhou', color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
}

const scheduledPosts = [
  { id: 'sp1', platform: 'Instagram', type: 'Reel', title: '3 erros que impedem crescimento no IG', date: 'Hoje', time: '19:00', status: 'scheduled' },
  { id: 'sp2', platform: 'TikTok', type: 'Vídeo', title: 'POV: cliente sem tempo para redes sociais', date: 'Amanhã', time: '12:00', status: 'scheduled' },
  { id: 'sp3', platform: 'Instagram', type: 'Carrossel', title: 'Antes e depois: 30 dias de transformação', date: 'Qui 13 Mar', time: '18:00', status: 'scheduled' },
  { id: 'sp4', platform: 'YouTube', type: 'Short', title: 'Tutorial: Reels que vendem em 60s', date: 'Sex 14 Mar', time: '15:00', status: 'draft' },
  { id: 'sp5', platform: 'Instagram', type: 'Post', title: 'Quote motivacional semanal', date: 'Sáb 15 Mar', time: '10:00', status: 'scheduled' },
]

const publishedPosts = [
  { id: 'pp1', platform: 'Instagram', type: 'Reel', title: '5 tipos de conteúdo que geram leads', date: '05 Mar', time: '18:00', status: 'published' },
  { id: 'pp2', platform: 'TikTok', type: 'Vídeo', title: 'Dia a dia nos bastidores', date: '03 Mar', time: '12:00', status: 'published' },
  { id: 'pp3', platform: 'Instagram', type: 'Carrossel', title: '10 dicas de copy para Instagram', date: '01 Mar', time: '19:00', status: 'published' },
]

const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const calendarDays = [
  { day: 3, posts: 1 },
  { day: 4, posts: 0 },
  { day: 5, posts: 2 },
  { day: 6, posts: 0 },
  { day: 7, posts: 1 },
  { day: 8, posts: 0 },
  { day: 9, posts: 0 },
  { day: 10, posts: 0 },
  { day: 11, posts: 1 },
  { day: 12, posts: 0 },
  { day: 13, posts: 2 },
  { day: 14, posts: 1 },
  { day: 15, posts: 1 },
  { day: 16, posts: 0 },
  { day: 17, posts: 0 },
  { day: 18, posts: 3 },
  { day: 19, posts: 0 },
  { day: 20, posts: 1 },
]

function PostRow({ post }: { post: typeof scheduledPosts[0] }) {
  const status = statusConfig[post.status]
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px',
      borderBottom: '1px solid var(--border)',
      transition: 'background 0.15s',
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'var(--muted-bg)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent' }}
    >
      {/* Platform dot */}
      <div style={{
        width: 8, height: 8, borderRadius: '50%',
        background: platformColor[post.platform] ?? '#3B5BDB', flexShrink: 0,
      }} />

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 13, fontWeight: 600, color: '#E8EEFF',
          fontFamily: 'Space Grotesk, sans-serif',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const,
        }}>{post.title}</div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif', marginTop: 2 }}>
          {post.platform} · {post.type}
        </div>
      </div>

      {/* Date/time */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
        <Calendar size={11} color="var(--text-muted)" />
        <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'Space Grotesk, sans-serif' }}>{post.date}</span>
        <Clock size={11} color="var(--text-muted)" />
        <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'Space Grotesk, sans-serif' }}>{post.time}</span>
      </div>

      {/* Status */}
      <span style={{
        padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700,
        background: status.bg, color: status.color,
        fontFamily: 'Space Grotesk, sans-serif', flexShrink: 0,
      }}>
        {post.status === 'scheduled' && <Check size={10} style={{ display: 'inline', marginRight: 3 }} />}
        {post.status === 'failed' && <AlertCircle size={10} style={{ display: 'inline', marginRight: 3 }} />}
        {status.label}
      </span>
    </div>
  )
}

export default function DistributionPage() {
  const [view, setView] = useState<'list' | 'calendar'>('list')

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
            background: 'rgba(59,91,219,0.12)', border: '1px solid rgba(59,91,219,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Send size={20} color="#5B7BFF" strokeWidth={2} />
          </div>
          <div>
            <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 20, fontWeight: 700, color: '#E8EEFF', marginBottom: 2 }}>
              Distribution
            </h1>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif' }}>
              5 posts agendados · próximo hoje às 19:00
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* View toggle */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 2, padding: 4, borderRadius: 8, background: 'rgba(13,18,37,0.8)' }}>
            {(['list', 'calendar'] as const).map((v) => (
              <button key={v} onClick={() => setView(v)} style={{
                padding: '5px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600,
                cursor: 'pointer', border: 'none', fontFamily: 'Space Grotesk, sans-serif',
                background: view === v ? '#3B5BDB' : 'transparent',
                color: view === v ? '#fff' : 'var(--text-secondary)',
              }}>
                {v === 'list' ? 'Lista' : 'Calendário'}
              </button>
            ))}
          </div>
          <button className="btn-primary" style={{ fontSize: 12, padding: '7px 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Plus size={14} />
            Agendar post
          </button>
        </div>
      </motion.div>

      {view === 'list' ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {/* Upcoming */}
          <div style={{ marginBottom: 14 }}>
            <span className="section-label">PRÓXIMOS</span>
          </div>
          <div className="glass-card" style={{ overflow: 'hidden', marginBottom: 24 }}>
            {scheduledPosts.map((post) => <PostRow key={post.id} post={post} />)}
            <div style={{ padding: '12px 18px' }}>
              <button style={{
                width: '100%', padding: '10px', borderRadius: 8,
                background: 'transparent', border: '1px dashed var(--border)',
                color: 'var(--text-muted)', cursor: 'pointer',
                fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, fontWeight: 600,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}>
                <Plus size={14} />
                Adicionar post
              </button>
            </div>
          </div>

          {/* Published */}
          <div style={{ marginBottom: 14 }}>
            <span className="section-label">PUBLICADOS RECENTEMENTE</span>
          </div>
          <div className="glass-card" style={{ overflow: 'hidden' }}>
            {publishedPosts.map((post) => <PostRow key={post.id} post={post} />)}
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {/* Calendar header */}
          <div className="glass-card" style={{ padding: '20px 22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <button className="btn-ghost" style={{ padding: '6px 8px' }}><ChevronLeft size={16} /></button>
              <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 15, fontWeight: 700, color: '#E8EEFF' }}>
                Março 2026
              </span>
              <button className="btn-ghost" style={{ padding: '6px 8px' }}><ChevronRight size={16} /></button>
            </div>

            {/* Day headers */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 8 }}>
              {weekDays.map(d => (
                <div key={d} style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textAlign: 'center' as const, fontFamily: 'Space Grotesk, sans-serif' }}>
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar grid (simplified) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
              {/* Empty cells for start of month (March 2026 starts on Sunday) */}
              {[...Array(0)].map((_, i) => <div key={`e${i}`} />)}
              {calendarDays.map((d) => {
                const isToday = d.day === 7
                return (
                  <div key={d.day} style={{
                    padding: '8px 6px', borderRadius: 8, minHeight: 52,
                    background: isToday ? 'rgba(59,91,219,0.15)' : 'var(--muted-bg)',
                    border: isToday ? '1px solid rgba(59,91,219,0.35)' : '1px solid transparent',
                    cursor: 'pointer',
                    transition: 'background 0.15s',
                  }}>
                    <div style={{
                      fontSize: 12, fontWeight: isToday ? 700 : 500,
                      color: isToday ? '#93c5fd' : 'var(--text-secondary)',
                      fontFamily: 'Space Grotesk, sans-serif', marginBottom: 4,
                    }}>
                      {d.day}
                    </div>
                    {d.posts > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 2 }}>
                        {[...Array(Math.min(d.posts, 3))].map((_, i) => (
                          <div key={i} style={{
                            width: 6, height: 6, borderRadius: '50%',
                            background: i === 0 ? '#7C3AED' : i === 1 ? '#06b6d4' : '#3B5BDB',
                          }} />
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
