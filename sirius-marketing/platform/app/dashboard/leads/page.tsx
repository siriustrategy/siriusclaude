'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, Search, Filter, Play, Download, Star, MapPin,
  Instagram, Send, TrendingUp, ArrowRight, ChevronDown,
  RefreshCw, Zap, Eye, GraduationCap, ExternalLink,
  Hash, Heart, MessageCircle, BarChart2, Monitor,
} from 'lucide-react'
import Link from 'next/link'

/* ─── tipos ─── */
type Platform = 'instagram' | 'tiktok' | 'google_maps' | 'facebook' | 'youtube'
type LeadStatus = 'capturado' | 'qualificado' | 'contatado' | 'respondeu' | 'convertido'

interface Lead {
  id: string
  username: string
  name: string
  platform: Platform
  followers: number
  engagement: number
  avgLikes: number
  score: number
  city: string
  state: string
  bio: string
  status: LeadStatus
  hasEmail: boolean
  hasWhatsapp: boolean
  capturedAt: string
}

/* ─── mock data ─── */
const mockLeads: Lead[] = [
  { id: '1', username: '@marketing.digital.sp', name: 'Carla Mendes',  platform: 'instagram', followers: 28400,  engagement: 4.8, avgLikes: 1363, score: 94, city: 'São Paulo',        state: 'SP', bio: 'Consultora de marketing | IA para negócios',    status: 'capturado',  hasEmail: true,  hasWhatsapp: true,  capturedAt: '2 min' },
  { id: '2', username: '@agencia.criaativa',    name: 'Bruno Farias',   platform: 'instagram', followers: 12200,  engagement: 6.1, avgLikes: 744,  score: 88, city: 'Belo Horizonte',    state: 'MG', bio: 'Dono de agência de marketing',               status: 'qualificado',hasEmail: false, hasWhatsapp: true,  capturedAt: '5 min' },
  { id: '3', username: '@empreende.rio',        name: 'Patricia Lima',  platform: 'tiktok',    followers: 87000,  engagement: 8.3, avgLikes: 7221, score: 97, city: 'Rio de Janeiro',    state: 'RJ', bio: 'Empreendedora | Negócios com IA',           status: 'contatado',  hasEmail: true,  hasWhatsapp: false, capturedAt: '18 min' },
  { id: '4', username: '@consultoria.pme',      name: 'Rafael Torres',  platform: 'instagram', followers: 5300,   engagement: 3.2, avgLikes: 169,  score: 61, city: 'Curitiba',          state: 'PR', bio: 'Consultor para PMEs',                        status: 'capturado',  hasEmail: false, hasWhatsapp: false, capturedAt: '32 min' },
  { id: '5', username: '@studio.criativo.ssa',  name: 'Juliana Brito',  platform: 'instagram', followers: 44700,  engagement: 5.6, avgLikes: 2503, score: 91, city: 'Salvador',          state: 'BA', bio: 'Studio criativo | Conteúdo & Marca',        status: 'respondeu',  hasEmail: true,  hasWhatsapp: true,  capturedAt: '1h' },
  { id: '6', username: '@negocios.online.fortaleza', name: 'Marcos Sousa', platform: 'tiktok', followers: 33000, engagement: 9.2, avgLikes: 3036, score: 89, city: 'Fortaleza',        state: 'CE', bio: 'Negócios online | Vida com propósito',       status: 'capturado',  hasEmail: false, hasWhatsapp: true,  capturedAt: '2h' },
  { id: '7', username: '@social.media.porto',   name: 'Fernanda Costa', platform: 'instagram', followers: 19800,  engagement: 4.1, avgLikes: 811,  score: 77, city: 'Porto Alegre',      state: 'RS', bio: 'Social media specialist',                    status: 'qualificado',hasEmail: true,  hasWhatsapp: true,  capturedAt: '3h' },
  { id: '8', username: '@mkt.digital.manaus',   name: 'Diego Nunes',    platform: 'instagram', followers: 8900,   engagement: 2.8, avgLikes: 249,  score: 54, city: 'Manaus',            state: 'AM', bio: 'Marketing digital no norte do Brasil',       status: 'capturado',  hasEmail: false, hasWhatsapp: false, capturedAt: '4h' },
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

function scoreLabel(s: number) {
  if (s >= 85) return 'Quente'
  if (s >= 70) return 'Bom'
  if (s >= 50) return 'Médio'
  return 'Frio'
}

function statusColor(s: LeadStatus) {
  const map: Record<LeadStatus, string> = {
    capturado: '#3B5BDB', qualificado: '#06b6d4',
    contatado: '#f59e0b', respondeu: '#a855f7', convertido: '#25D366',
  }
  return map[s]
}

const platformIcon: Record<Platform, React.ReactNode> = {
  instagram: <Instagram size={13} color="#e1306c" />,
  tiktok: <Play size={13} color="#69c9d0" />,
  google_maps: <MapPin size={13} color="#EA4335" />,
  facebook: <Users size={13} color="#1877f2" />,
  youtube: <TrendingUp size={13} color="#FF0000" />,
}

const platformLabel: Record<Platform, string> = {
  instagram: 'Instagram', tiktok: 'TikTok',
  google_maps: 'Google Maps', facebook: 'Facebook', youtube: 'YouTube',
}

/* ─── Stats Card ─── */
const statsData = [
  { label: 'Leads capturados', value: '1.247', sub: 'este mês', color: '#3B5BDB', icon: Users },
  { label: 'Contatados',        value: '389',   sub: 'via disparo', color: '#06b6d4', icon: Send },
  { label: 'Responderam',       value: '127',   sub: '32,6% de resposta', color: '#a855f7', icon: MessageCircle },
  { label: 'Convertidos',       value: '31',    sub: '7,9% conversão', color: '#25D366', icon: Star },
]

/* ─── Capture Modal ─── */
function CaptureModal({ onClose }: { onClose: () => void }) {
  const [platform, setPlatform] = useState<Platform>('instagram')
  const [hashtags, setHashtags] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [minFollowers, setMinFollowers] = useState('1000')
  const [maxFollowers, setMaxFollowers] = useState('500000')
  const [minEngagement, setMinEngagement] = useState('2')
  const [keywords, setKeywords] = useState('')
  const [limit, setLimit] = useState('50')
  const [running, setRunning] = useState(false)

  function runCapture() {
    setRunning(true)
    setTimeout(() => { setRunning(false); onClose() }, 2200)
  }

  const platforms: { id: Platform; label: string; color: string }[] = [
    { id: 'instagram',   label: 'Instagram',    color: '#e1306c' },
    { id: 'tiktok',      label: 'TikTok',       color: '#69c9d0' },
    { id: 'facebook',    label: 'Facebook',     color: '#1877f2' },
    { id: 'google_maps', label: 'Google Maps',  color: '#EA4335' },
    { id: 'youtube',     label: 'YouTube',      color: '#FF0000' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(4,6,15,0.75)', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
      }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 16 }}
        style={{
          background: 'rgba(8,12,24,0.98)',
          border: '1px solid rgba(59,91,219,0.25)',
          borderRadius: 18,
          width: '100%', maxWidth: 580,
          maxHeight: '90vh', overflowY: 'auto',
          boxShadow: '0 32px 80px rgba(0,0,0,0.7)',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '22px 24px 18px',
          borderBottom: '1px solid rgba(59,91,219,0.12)',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: 'rgba(59,91,219,0.15)', border: '1px solid rgba(59,91,219,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Search size={15} color="#5B7BFF" />
              </div>
              <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 16, color: '#E8EEFF' }}>
                Nova Captura de Leads
              </span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 40 }}>
              Configure os filtros e inicie a captura via Apify
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'var(--muted-bg)', border: '1px solid var(--border)', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)' }}>
            ×
          </button>
        </div>

        <div style={{ padding: '20px 24px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Rede social */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
              Rede Social
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {platforms.map(p => (
                <button
                  key={p.id}
                  onClick={() => setPlatform(p.id)}
                  style={{
                    padding: '7px 14px', borderRadius: 8,
                    fontSize: 12, fontWeight: 700, cursor: 'pointer',
                    fontFamily: 'Space Grotesk, sans-serif',
                    background: platform === p.id ? `${p.color}20` : 'var(--muted-bg)',
                    border: `1px solid ${platform === p.id ? p.color + '55' : 'var(--border)'}`,
                    color: platform === p.id ? p.color : 'var(--text-secondary)',
                    transition: 'all 0.15s',
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Hashtags / Keywords */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>
                Hashtags
              </div>
              <div style={{ position: 'relative' }}>
                <Hash size={13} color="var(--text-muted)" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  className="input-field"
                  placeholder="marketing, ia, negócios..."
                  value={hashtags}
                  onChange={e => setHashtags(e.target.value)}
                  style={{ paddingLeft: 30, width: '100%' }}
                />
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>Separe por vírgula</div>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>
                Keywords na bio
              </div>
              <input
                className="input-field"
                placeholder="consultor, agência, CEO..."
                value={keywords}
                onChange={e => setKeywords(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          {/* Localização */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>
                Cidade
              </div>
              <div style={{ position: 'relative' }}>
                <MapPin size={13} color="var(--text-muted)" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)' }} />
                <input className="input-field" placeholder="São Paulo, Rio..." value={city} onChange={e => setCity(e.target.value)} style={{ paddingLeft: 30, width: '100%' }} />
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>
                Estado
              </div>
              <select
                className="input-field"
                value={state}
                onChange={e => setState(e.target.value)}
                style={{ width: '100%', cursor: 'pointer' }}
              >
                <option value="">Todos</option>
                {['SP','RJ','MG','RS','PR','BA','SC','GO','PE','CE','AM','DF'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Seguidores */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
              Faixa de Seguidores
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 10, alignItems: 'center' }}>
              <input className="input-field" type="number" placeholder="Mín: 1.000" value={minFollowers} onChange={e => setMinFollowers(e.target.value)} />
              <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>até</span>
              <input className="input-field" type="number" placeholder="Máx: 500.000" value={maxFollowers} onChange={e => setMaxFollowers(e.target.value)} />
            </div>
            <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
              {[['Nano','1k–10k','1000','10000'],['Micro','10k–100k','10000','100000'],['Macro','100k+','100000','5000000']].map(([lbl, range, min, max]) => (
                <button key={lbl} onClick={() => { setMinFollowers(min); setMaxFollowers(max) }} style={{ padding: '4px 10px', borderRadius: 6, fontSize: 10, fontWeight: 700, cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif', background: 'rgba(59,91,219,0.1)', border: '1px solid rgba(59,91,219,0.2)', color: '#93c5fd' }}>
                  {lbl} <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>{range}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Engajamento + Limite */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>
                Engajamento mínimo (%)
              </div>
              <div style={{ position: 'relative' }}>
                <Heart size={13} color="var(--text-muted)" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)' }} />
                <input className="input-field" type="number" step="0.5" placeholder="Ex: 2.0" value={minEngagement} onChange={e => setMinEngagement(e.target.value)} style={{ paddingLeft: 30, width: '100%' }} />
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>Médio do mercado: 2-3%</div>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>
                Máx. de leads
              </div>
              <select className="input-field" value={limit} onChange={e => setLimit(e.target.value)} style={{ width: '100%' }}>
                {['25','50','100','200','500'].map(l => <option key={l} value={l}>{l} leads</option>)}
              </select>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>
                ~{Math.ceil(Number(limit) * 0.002 * 100) / 100} USD de API
              </div>
            </div>
          </div>

          {/* Enriquecimento */}
          <div style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 10, padding: '12px 14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <Zap size={13} color="#10b981" />
              <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 12, fontWeight: 700, color: '#34d399' }}>
                Enriquecimento automático
              </span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
              Após a captura, o sistema buscará automaticamente email e WhatsApp nos perfis coletados.
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={runCapture}
            disabled={running}
            style={{
              width: '100%', padding: '14px', borderRadius: 10,
              background: running ? 'rgba(59,91,219,0.2)' : 'linear-gradient(135deg, #3B5BDB, #5B7BFF)',
              border: running ? '1px solid rgba(59,91,219,0.3)' : 'none',
              color: '#fff', fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 800, fontSize: 14, cursor: running ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: running ? 'none' : '0 4px 20px rgba(59,91,219,0.35)',
              transition: 'all 0.2s',
            }}
          >
            {running ? (
              <>
                <RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} />
                Capturando leads...
              </>
            ) : (
              <>
                <Play size={16} />
                Iniciar Captura
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ─── Lead Row ─── */
function LeadRow({ lead, selected, onSelect }: { lead: Lead; selected: boolean; onSelect: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: 'grid',
        gridTemplateColumns: '32px 1fr 110px 90px 90px 80px 100px 100px',
        alignItems: 'center',
        gap: 12,
        padding: '12px 20px',
        borderBottom: '1px solid rgba(59,91,219,0.07)',
        background: selected ? 'rgba(59,91,219,0.07)' : 'transparent',
        transition: 'background 0.15s',
        cursor: 'pointer',
      }}
      onClick={onSelect}
    >
      {/* Checkbox */}
      <div style={{
        width: 18, height: 18, borderRadius: 5,
        border: `2px solid ${selected ? '#3B5BDB' : 'rgba(59,91,219,0.3)'}`,
        background: selected ? '#3B5BDB' : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        {selected && <div style={{ width: 8, height: 8, borderRadius: 2, background: '#fff' }} />}
      </div>

      {/* Lead info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
        <div style={{
          width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
          background: `linear-gradient(135deg, ${scoreColor(lead.score)}33, ${scoreColor(lead.score)}11)`,
          border: `1px solid ${scoreColor(lead.score)}40`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 12,
          color: scoreColor(lead.score),
        }}>
          {lead.name.charAt(0)}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 13, color: '#E8EEFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {lead.username}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {lead.bio}
          </div>
        </div>
      </div>

      {/* Platform */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        {platformIcon[lead.platform]}
        <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontFamily: 'Space Grotesk, sans-serif' }}>
          {platformLabel[lead.platform]}
        </span>
      </div>

      {/* Seguidores */}
      <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 13, color: '#E8EEFF' }}>
        {fmtNum(lead.followers)}
      </div>

      {/* Engajamento */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <Heart size={11} color="#e1306c" />
        <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 13, color: '#E8EEFF' }}>
          {lead.engagement}%
        </span>
      </div>

      {/* Localização */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <MapPin size={11} color="var(--text-muted)" />
        <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{lead.state}</span>
      </div>

      {/* Score */}
      <div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          background: `${scoreColor(lead.score)}15`,
          border: `1px solid ${scoreColor(lead.score)}35`,
          borderRadius: 20, padding: '3px 9px',
        }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: scoreColor(lead.score), boxShadow: `0 0 6px ${scoreColor(lead.score)}` }} />
          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 11, color: scoreColor(lead.score) }}>
            {lead.score} · {scoreLabel(lead.score)}
          </span>
        </div>
      </div>

      {/* Status */}
      <div style={{
        display: 'inline-flex', alignItems: 'center',
        background: `${statusColor(lead.status)}15`,
        border: `1px solid ${statusColor(lead.status)}30`,
        borderRadius: 20, padding: '3px 9px',
      }}>
        <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 10, color: statusColor(lead.status), textTransform: 'capitalize' }}>
          {lead.status}
        </span>
      </div>
    </motion.div>
  )
}

/* ─── Page ─── */
export default function LeadsPage() {
  const [showCapture, setShowCapture] = useState(false)
  const [selected, setSelected] = useState<string[]>([])
  const [filter, setFilter] = useState('')
  const [platformFilter, setPlatformFilter] = useState<Platform | 'all'>('all')

  function toggleSelect(id: string) {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const filtered = mockLeads.filter(l =>
    (platformFilter === 'all' || l.platform === platformFilter) &&
    (filter === '' || l.username.includes(filter) || l.bio.toLowerCase().includes(filter.toLowerCase()))
  )

  return (
    <div style={{ padding: '32px', minHeight: '100vh' }}>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <div style={{ width: 38, height: 38, borderRadius: 11, background: 'rgba(59,91,219,0.15)', border: '1px solid rgba(59,91,219,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={18} color="#5B7BFF" />
              </div>
              <div>
                <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 22, color: '#E8EEFF', lineHeight: 1.1 }}>
                  Lead Intelligence
                </h1>
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Captura, qualificação e disparo de leads com IA</p>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Link href="/dashboard/leads/monitor" style={{ textDecoration: 'none' }}>
              <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', borderRadius: 9, background: 'rgba(59,91,219,0.1)', border: '1px solid rgba(59,91,219,0.22)', color: '#93c5fd', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                <Monitor size={14} />
                Monitor de Contas
              </button>
            </Link>
            {selected.length > 0 && (
              <Link href="/dashboard/distribution" style={{ textDecoration: 'none' }}>
                <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', borderRadius: 9, background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', color: '#c084fc', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                  <Send size={14} />
                  Fazer Disparo ({selected.length})
                </button>
              </Link>
            )}
            <button
              onClick={() => setShowCapture(true)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', borderRadius: 9, background: 'linear-gradient(135deg, #3B5BDB, #5B7BFF)', border: 'none', color: '#fff', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 13, cursor: 'pointer', boxShadow: '0 4px 16px rgba(59,91,219,0.35)' }}
            >
              <Search size={14} />
              Nova Captura
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        {statsData.map((s, i) => {
          const Icon = s.icon
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              style={{ background: 'rgba(13,18,37,0.8)', border: '1px solid rgba(59,91,219,0.14)', borderRadius: 14, padding: '18px 20px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {s.label}
                </div>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: `${s.color}15`, border: `1px solid ${s.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={14} color={s.color} />
                </div>
              </div>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 900, fontSize: 26, color: '#E8EEFF', lineHeight: 1 }}>
                {s.value}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{s.sub}</div>
            </motion.div>
          )
        })}
      </div>

      {/* Funnel visual */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{ background: 'rgba(13,18,37,0.8)', border: '1px solid rgba(59,91,219,0.14)', borderRadius: 14, padding: '18px 20px', marginBottom: 20 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
          <BarChart2 size={14} color="#3B5BDB" />
          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 13, color: '#E8EEFF' }}>Funil de Leads</span>
        </div>
        <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: 48 }}>
          {[
            { label: 'Capturado', count: 1247, pct: 100, color: '#3B5BDB' },
            { label: 'Qualificado', count: 843, pct: 67, color: '#06b6d4' },
            { label: 'Contatado', count: 389, pct: 31, color: '#a855f7' },
            { label: 'Respondeu', count: 127, pct: 10, color: '#f59e0b' },
            { label: 'Convertido', count: 31, pct: 2.5, color: '#25D366' },
          ].map(stage => (
            <div key={stage.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 12, color: stage.color }}>{stage.count}</div>
              <div style={{ width: '100%', height: `${stage.pct * 0.4 + 4}px`, minHeight: 6, background: `${stage.color}20`, border: `1px solid ${stage.color}35`, borderRadius: 4 }} />
              <div style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>{stage.label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Filters + Table */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        style={{ background: 'rgba(13,18,37,0.8)', border: '1px solid rgba(59,91,219,0.14)', borderRadius: 14, overflow: 'hidden' }}
      >
        {/* Filter bar */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(59,91,219,0.1)', display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 180 }}>
            <Search size={13} color="var(--text-muted)" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)' }} />
            <input className="input-field" placeholder="Buscar por username ou bio..." value={filter} onChange={e => setFilter(e.target.value)} style={{ paddingLeft: 30, width: '100%' }} />
          </div>
          {(['all','instagram','tiktok','facebook','google_maps'] as const).map(p => (
            <button key={p} onClick={() => setPlatformFilter(p)} style={{ padding: '7px 13px', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif', background: platformFilter === p ? 'rgba(59,91,219,0.2)' : 'rgba(59,91,219,0.06)', border: `1px solid ${platformFilter === p ? 'rgba(59,91,219,0.4)' : 'rgba(59,91,219,0.12)'}`, color: platformFilter === p ? '#93c5fd' : 'var(--text-muted)', transition: 'all 0.15s' }}>
              {p === 'all' ? 'Todos' : p === 'google_maps' ? 'Google Maps' : p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
          <button style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 13px', borderRadius: 8, background: 'var(--muted-bg)', border: '1px solid var(--border)', color: 'var(--text-secondary)', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif' }}>
            <Download size={12} />
            Exportar CSV
          </button>
        </div>

        {/* Table header */}
        <div style={{ display: 'grid', gridTemplateColumns: '32px 1fr 110px 90px 90px 80px 100px 100px', gap: 12, padding: '10px 20px', borderBottom: '1px solid rgba(59,91,219,0.08)' }}>
          {['', 'Lead', 'Rede', 'Seguidores', 'Engaj.', 'Loc.', 'Score IA', 'Status'].map(h => (
            <div key={h} style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</div>
          ))}
        </div>

        {/* Rows */}
        <div>
          {filtered.map((lead, i) => (
            <LeadRow key={lead.id} lead={lead} selected={selected.includes(lead.id)} onSelect={() => toggleSelect(lead.id)} />
          ))}
        </div>

        {/* Footer */}
        <div style={{ padding: '12px 20px', borderTop: '1px solid rgba(59,91,219,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif' }}>
            {filtered.length} leads · {selected.length} selecionados
          </span>
          {selected.length > 0 && (
            <Link href="/dashboard/distribution" style={{ textDecoration: 'none' }}>
              <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8, background: 'linear-gradient(135deg, #7C3AED, #3B5BDB)', border: 'none', color: '#fff', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 12, cursor: 'pointer', boxShadow: '0 4px 14px rgba(124,58,237,0.3)' }}>
                <Send size={13} />
                Fazer Disparo com {selected.length} leads
                <ArrowRight size={12} />
              </button>
            </Link>
          )}
        </div>
      </motion.div>

      {/* Capture modal */}
      <AnimatePresence>
        {showCapture && <CaptureModal onClose={() => setShowCapture(false)} />}
      </AnimatePresence>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
