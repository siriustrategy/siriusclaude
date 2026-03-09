'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Monitor, Plus, RefreshCw, TrendingUp, TrendingDown,
  Instagram, Play, Users, ArrowLeft, Zap, Clock,
  AlertTriangle, CheckCircle, Eye, MoreHorizontal,
} from 'lucide-react'
import Link from 'next/link'

/* ─── tipos ─── */
type SyncFreq = '30min' | '6h' | '24h' | 'semanal'
type Platform = 'instagram' | 'tiktok' | 'youtube' | 'facebook'

interface MonitoredAccount {
  id: string
  username: string
  name: string
  platform: Platform
  followers: number
  followersDelta: number    // variação nos últimos 7 dias
  engagement: number
  avgLikes: number
  lastPost: string
  lastSync: string
  syncFreq: SyncFreq
  score: number
  status: 'ativo' | 'inativo' | 'mudança'
  alertas: string[]
}

/* ─── mock ─── */
const mockAccounts: MonitoredAccount[] = [
  {
    id: '1', username: '@empreende.rio', name: 'Patricia Lima',
    platform: 'instagram', followers: 87000, followersDelta: 1240,
    engagement: 8.3, avgLikes: 7221, lastPost: 'há 2h', lastSync: 'há 4 min',
    syncFreq: '30min', score: 97,
    status: 'mudança',
    alertas: ['Crescimento acelerado: +1.2k seguidores em 7 dias', 'Novo post com engajamento acima da média'],
  },
  {
    id: '2', username: '@studio.criativo.ssa', name: 'Juliana Brito',
    platform: 'instagram', followers: 44700, followersDelta: 320,
    engagement: 5.6, avgLikes: 2503, lastPost: 'há 1h', lastSync: 'há 18 min',
    syncFreq: '6h', score: 91,
    status: 'ativo',
    alertas: [],
  },
  {
    id: '3', username: '@marketing.digital.sp', name: 'Carla Mendes',
    platform: 'instagram', followers: 28400, followersDelta: -120,
    engagement: 4.8, avgLikes: 1363, lastPost: 'há 6h', lastSync: 'há 6h',
    syncFreq: '24h', score: 88,
    status: 'ativo',
    alertas: [],
  },
  {
    id: '4', username: '@negocios.online.fortaleza', name: 'Marcos Sousa',
    platform: 'tiktok', followers: 33000, followersDelta: 2100,
    engagement: 9.2, avgLikes: 3036, lastPost: 'há 3h', lastSync: 'há 12 min',
    syncFreq: '30min', score: 89,
    status: 'mudança',
    alertas: ['Vídeo viral detectado: +2.1k seguidores em 48h'],
  },
  {
    id: '5', username: '@agencia.criaativa', name: 'Bruno Farias',
    platform: 'instagram', followers: 12200, followersDelta: 45,
    engagement: 6.1, avgLikes: 744, lastPost: 'há 2 dias', lastSync: 'há 24h',
    syncFreq: '24h', score: 88,
    status: 'ativo',
    alertas: [],
  },
  {
    id: '6', username: '@social.media.porto', name: 'Fernanda Costa',
    platform: 'instagram', followers: 19800, followersDelta: -890,
    engagement: 4.1, avgLikes: 811, lastPost: 'há 1 semana', lastSync: 'há 1 sem',
    syncFreq: 'semanal', score: 77,
    status: 'inativo',
    alertas: ['Perfil inativo: sem posts em 7 dias', 'Queda de 4.3% em seguidores'],
  },
]

/* ─── helpers ─── */
function fmtNum(n: number) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}

function scoreColor(s: number) {
  if (s >= 85) return '#25D366'
  if (s >= 70) return '#06b6d4'
  if (s >= 50) return '#f59e0b'
  return '#ef4444'
}

function freqColor(f: SyncFreq) {
  const m: Record<SyncFreq, string> = { '30min': '#25D366', '6h': '#06b6d4', '24h': '#f59e0b', 'semanal': '#7A8AAE' }
  return m[f]
}

function freqLabel(f: SyncFreq) {
  const m: Record<SyncFreq, string> = { '30min': 'A cada 30min', '6h': 'A cada 6h', '24h': 'Diário', 'semanal': 'Semanal' }
  return m[f]
}

function freqCost(f: SyncFreq) {
  const m: Record<SyncFreq, string> = { '30min': '~$0.48/mês', '6h': '~$0.04/mês', '24h': '~$0.01/mês', 'semanal': '<$0.01/mês' }
  return m[f]
}

const platformIcon = (p: Platform, size = 13) => {
  if (p === 'instagram') return <Instagram size={size} color="#e1306c" />
  if (p === 'tiktok') return <Play size={size} color="#69c9d0" />
  if (p === 'youtube') return <TrendingUp size={size} color="#FF0000" />
  return <Users size={size} color="#1877f2" />
}

/* ─── Next sync countdown ─── */
function NextSyncBadge({ freq }: { freq: SyncFreq }) {
  const [secs, setSecs] = useState(freq === '30min' ? 847 : freq === '6h' ? 12340 : 60000)
  useEffect(() => {
    const t = setInterval(() => setSecs(s => Math.max(0, s - 1)), 1000)
    return () => clearInterval(t)
  }, [])
  const h = Math.floor(secs / 3600)
  const m = Math.floor((secs % 3600) / 60)
  const s = secs % 60
  const label = h > 0 ? `${h}h ${m}m` : m > 0 ? `${m}m ${s}s` : `${s}s`
  return (
    <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 10, color: 'var(--text-muted)' }}>
      próximo em {label}
    </span>
  )
}

/* ─── Account Card ─── */
function AccountCard({ account }: { account: MonitoredAccount }) {
  const [changing, setChanging] = useState(false)
  const [freq, setFreq] = useState<SyncFreq>(account.syncFreq)

  function manualSync() {
    setChanging(true)
    setTimeout(() => setChanging(false), 1500)
  }

  const statusConfig = {
    ativo:    { color: '#10b981', label: 'Ativo',   icon: CheckCircle },
    inativo:  { color: '#ef4444', label: 'Inativo', icon: AlertTriangle },
    mudança:  { color: '#f59e0b', label: 'Mudança', icon: TrendingUp },
  }
  const st = statusConfig[account.status]

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: 'rgba(13,18,37,0.8)',
        border: account.status === 'mudança'
          ? '1px solid rgba(245,158,11,0.25)'
          : account.status === 'inativo'
            ? '1px solid rgba(239,68,68,0.18)'
            : '1px solid rgba(59,91,219,0.14)',
        borderRadius: 14,
        overflow: 'hidden',
      }}
    >
      {/* Alert banner */}
      {account.alertas.length > 0 && (
        <div style={{
          background: account.status === 'mudança' ? 'rgba(245,158,11,0.08)' : 'rgba(239,68,68,0.07)',
          borderBottom: account.status === 'mudança' ? '1px solid rgba(245,158,11,0.15)' : '1px solid rgba(239,68,68,0.15)',
          padding: '8px 16px',
          display: 'flex', alignItems: 'flex-start', gap: 7,
        }}>
          <AlertTriangle size={12} color={account.status === 'mudança' ? '#f59e0b' : '#ef4444'} style={{ marginTop: 1, flexShrink: 0 }} />
          <div>
            {account.alertas.map((a, i) => (
              <div key={i} style={{ fontSize: 11, color: account.status === 'mudança' ? '#fcd34d' : '#fca5a5', lineHeight: 1.4 }}>
                {a}
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ padding: '16px 18px' }}>
        {/* Top row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          {/* Avatar */}
          <div style={{
            width: 42, height: 42, borderRadius: '50%', flexShrink: 0,
            background: `linear-gradient(135deg, ${scoreColor(account.score)}33, ${scoreColor(account.score)}11)`,
            border: `1.5px solid ${scoreColor(account.score)}40`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 15,
            color: scoreColor(account.score),
          }}>
            {account.name.charAt(0)}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {platformIcon(account.platform, 12)}
              <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 13, color: '#E8EEFF' }}>
                {account.username}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <st.icon size={10} color={st.color} />
                <span style={{ fontSize: 10, color: st.color, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700 }}>
                  {st.label}
                </span>
              </div>
              <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>·</span>
              <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>sync {account.lastSync}</span>
            </div>
          </div>

          {/* Score */}
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 900, fontSize: 18, color: scoreColor(account.score), lineHeight: 1 }}>
              {account.score}
            </div>
            <div style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif' }}>SCORE</div>
          </div>
        </div>

        {/* Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 14 }}>
          {[
            { label: 'Seguidores', value: fmtNum(account.followers), delta: account.followersDelta, icon: Users, color: '#3B5BDB' },
            { label: 'Engajamento', value: `${account.engagement}%`, delta: null, icon: TrendingUp, color: '#06b6d4' },
            { label: 'Méd. curtidas', value: fmtNum(account.avgLikes), delta: null, icon: TrendingUp, color: '#a855f7' },
          ].map(m => {
            const Icon = m.icon
            return (
              <div key={m.label} style={{ background: 'rgba(59,91,219,0.06)', border: '1px solid rgba(59,91,219,0.1)', borderRadius: 9, padding: '10px 12px' }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
                  {m.label}
                </div>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 15, color: '#E8EEFF', lineHeight: 1 }}>
                  {m.value}
                </div>
                {m.delta !== null && m.delta !== 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginTop: 3 }}>
                    {m.delta > 0
                      ? <TrendingUp size={10} color="#25D366" />
                      : <TrendingDown size={10} color="#ef4444" />}
                    <span style={{ fontSize: 10, fontWeight: 700, color: m.delta > 0 ? '#25D366' : '#ef4444', fontFamily: 'Space Grotesk, sans-serif' }}>
                      {m.delta > 0 ? '+' : ''}{fmtNum(m.delta)} / 7d
                    </span>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Sync controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: `${freqColor(freq)}12`, border: `1px solid ${freqColor(freq)}30`, borderRadius: 20, padding: '3px 10px' }}>
              <Clock size={10} color={freqColor(freq)} />
              <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 10, color: freqColor(freq) }}>
                {freqLabel(freq)}
              </span>
            </div>
            <NextSyncBadge freq={freq} />
          </div>

          <div style={{ display: 'flex', gap: 6 }}>
            <select
              value={freq}
              onChange={e => setFreq(e.target.value as SyncFreq)}
              style={{
                background: 'rgba(59,91,219,0.08)', border: '1px solid rgba(59,91,219,0.18)',
                borderRadius: 7, padding: '5px 8px',
                fontSize: 10, color: '#93c5fd', cursor: 'pointer',
                fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700,
              }}
            >
              <option value="30min">30min</option>
              <option value="6h">6h</option>
              <option value="24h">24h</option>
              <option value="semanal">Semanal</option>
            </select>

            <button
              onClick={manualSync}
              disabled={changing}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '5px 11px', borderRadius: 7,
                background: 'rgba(59,91,219,0.1)', border: '1px solid rgba(59,91,219,0.22)',
                color: '#93c5fd', fontSize: 10, fontWeight: 700,
                fontFamily: 'Space Grotesk, sans-serif', cursor: 'pointer',
              }}
            >
              <RefreshCw size={11} style={{ animation: changing ? 'spin 0.8s linear infinite' : 'none' }} />
              {changing ? 'Sincronizando...' : 'Sync agora'}
            </button>
          </div>
        </div>

        {/* Cost hint */}
        <div style={{ marginTop: 8, fontSize: 10, color: 'var(--text-muted)' }}>
          Custo estimado desta conta: <span style={{ color: '#06b6d4', fontWeight: 700 }}>{freqCost(freq)}</span>
        </div>
      </div>
    </motion.div>
  )
}

/* ─── Page ─── */
export default function MonitorPage() {
  const [syncing, setSyncing] = useState(false)

  const withAlerts = mockAccounts.filter(a => a.alertas.length > 0).length
  const active = mockAccounts.filter(a => a.status !== 'inativo').length

  return (
    <div style={{ padding: '32px', minHeight: '100vh' }}>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <Link href="/dashboard/leads" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--text-muted)', marginBottom: 10, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600 }}>
              <ArrowLeft size={12} />
              Lead Intelligence
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 38, height: 38, borderRadius: 11, background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Monitor size={18} color="#06b6d4" />
              </div>
              <div>
                <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 22, color: '#E8EEFF', lineHeight: 1.1 }}>
                  Monitor de Contas
                </h1>
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Atualizações automáticas sem gastar API desnecessariamente</p>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => { setSyncing(true); setTimeout(() => setSyncing(false), 2000) }}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', borderRadius: 9, background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.22)', color: '#06b6d4', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
            >
              <RefreshCw size={14} style={{ animation: syncing ? 'spin 0.8s linear infinite' : 'none' }} />
              Sync todas agora
            </button>
            <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', borderRadius: 9, background: 'linear-gradient(135deg, #06b6d4, #3B5BDB)', border: 'none', color: '#fff', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 13, cursor: 'pointer', boxShadow: '0 4px 16px rgba(6,182,212,0.25)' }}>
              <Plus size={14} />
              Adicionar conta
            </button>
          </div>
        </div>
      </motion.div>

      {/* Status bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 24 }}
      >
        {[
          { label: 'Contas monitoradas', value: mockAccounts.length, color: '#3B5BDB', icon: Monitor },
          { label: 'Contas ativas',       value: active,              color: '#10b981', icon: CheckCircle },
          { label: 'Com alertas',         value: withAlerts,          color: '#f59e0b', icon: AlertTriangle },
          { label: 'Custo total/mês',     value: '~$0.62',           color: '#06b6d4', icon: Zap },
        ].map((s, i) => {
          const Icon = s.icon
          return (
            <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}
              style={{ background: 'rgba(13,18,37,0.8)', border: '1px solid rgba(59,91,219,0.14)', borderRadius: 12, padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {s.label}
                </div>
                <Icon size={13} color={s.color} />
              </div>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 900, fontSize: 22, color: s.color, lineHeight: 1 }}>
                {s.value}
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Cost strategy info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        style={{ background: 'rgba(59,91,219,0.06)', border: '1px solid rgba(59,91,219,0.15)', borderRadius: 12, padding: '12px 16px', marginBottom: 20, display: 'flex', gap: 10, alignItems: 'flex-start' }}
      >
        <Zap size={14} color="#5B7BFF" style={{ marginTop: 1, flexShrink: 0 }} />
        <div>
          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 12, color: '#93c5fd', marginBottom: 3 }}>
            Estratégia de custo inteligente
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Sync leve (30min) roda apenas contagem de seguidores — extremamente barato. Sync completo (6h/24h) atualiza bio, engajamento e último post. Sync profundo por hashtag roda somente às 2h da manhã. Cache de 24h evita chamadas duplicadas.
          </div>
        </div>
      </motion.div>

      {/* Accounts grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: 16 }}>
        {mockAccounts.map((account, i) => (
          <motion.div key={account.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 + i * 0.05 }}>
            <AccountCard account={account} />
          </motion.div>
        ))}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
