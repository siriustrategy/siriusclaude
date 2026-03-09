'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Library, Search, Download, Image,
  FileText, Play, Layout, Star, Grid, List,
  Sparkles, Eye,
} from 'lucide-react'

type AssetType = 'imagem' | 'video' | 'copy' | 'storyboard' | 'template'
type AssetFilter = AssetType | 'todos'

interface Asset {
  id: string
  type: AssetType
  title: string
  brand: string
  brandColor: string
  platform: string
  date: string
  score: number
  tags: string[]
  approved: boolean
  gradient: string
}

const mockAssets: Asset[] = [
  { id: '1',  type: 'imagem',     title: 'Post produto — linha premium',       brand: 'Sirius Strategy', brandColor: '#3B5BDB', platform: 'Instagram', date: 'hoje',      score: 94, tags: ['produto','elegante'],    approved: true,  gradient: 'linear-gradient(135deg,#3B5BDB,#7C3AED)' },
  { id: '2',  type: 'copy',       title: 'Copy de lançamento — Black Friday',  brand: 'Sirius Strategy', brandColor: '#3B5BDB', platform: 'Instagram', date: 'ontem',     score: 88, tags: ['promoção','urgência'],   approved: true,  gradient: 'linear-gradient(135deg,#7C3AED,#a855f7)' },
  { id: '3',  type: 'video',      title: 'Reel — Bastidores do processo',      brand: 'Studio Criativo', brandColor: '#10b981', platform: 'TikTok',   date: 'ontem',     score: 91, tags: ['bastidores','autêntico'], approved: true,  gradient: 'linear-gradient(135deg,#10b981,#06b6d4)' },
  { id: '4',  type: 'storyboard', title: 'Storyboard — Tutorial IA',           brand: 'Sirius Strategy', brandColor: '#3B5BDB', platform: 'TikTok',   date: '2 dias',    score: 87, tags: ['educativo','tutorial'],  approved: true,  gradient: 'linear-gradient(135deg,#06b6d4,#3B5BDB)' },
  { id: '5',  type: 'imagem',     title: 'Cover LinkedIn — Proposta de valor', brand: 'Studio Criativo', brandColor: '#10b981', platform: 'LinkedIn', date: '3 dias',    score: 79, tags: ['b2b','profissional'],    approved: false, gradient: 'linear-gradient(135deg,#f59e0b,#ef4444)' },
  { id: '6',  type: 'template',   title: 'Template Stories — Enquete semanal',brand: 'Sirius Strategy', brandColor: '#3B5BDB', platform: 'Instagram', date: '1 semana',  score: 92, tags: ['stories','engajamento'], approved: true,  gradient: 'linear-gradient(135deg,#a855f7,#7C3AED)' },
  { id: '7',  type: 'copy',       title: 'Sequência email — Boas-vindas',      brand: 'Studio Criativo', brandColor: '#10b981', platform: 'Email',    date: '1 semana',  score: 83, tags: ['email','onboarding'],    approved: true,  gradient: 'linear-gradient(135deg,#10b981,#25D366)' },
  { id: '8',  type: 'imagem',     title: 'Carrossel — 5 erros de marketing',   brand: 'Sirius Strategy', brandColor: '#3B5BDB', platform: 'Instagram', date: '2 semanas', score: 96, tags: ['educativo','carrossel'], approved: true,  gradient: 'linear-gradient(135deg,#3B5BDB,#06b6d4)' },
  { id: '9',  type: 'template',   title: 'Template Reels — Depoimento',        brand: 'Sirius Strategy', brandColor: '#3B5BDB', platform: 'Instagram', date: '2 semanas', score: 90, tags: ['prova social','vídeo'],  approved: true,  gradient: 'linear-gradient(135deg,#06b6d4,#a855f7)' },
  { id: '10', type: 'copy',       title: 'Copy WhatsApp — Follow-up lead',     brand: 'Studio Criativo', brandColor: '#10b981', platform: 'WhatsApp', date: '3 semanas', score: 77, tags: ['lead','follow-up'],      approved: false, gradient: 'linear-gradient(135deg,#25D366,#10b981)' },
  { id: '11', type: 'imagem',     title: 'Banner campanha — Ano novo',         brand: 'Sirius Strategy', brandColor: '#3B5BDB', platform: 'Facebook', date: '1 mês',     score: 85, tags: ['sazonal','campanha'],    approved: true,  gradient: 'linear-gradient(135deg,#f59e0b,#7C3AED)' },
  { id: '12', type: 'storyboard', title: 'Storyboard — Vídeo de produto 60s',  brand: 'Studio Criativo', brandColor: '#10b981', platform: 'YouTube',  date: '1 mês',     score: 89, tags: ['produto','vídeo longo'], approved: true,  gradient: 'linear-gradient(135deg,#ef4444,#f59e0b)' },
]

const typeIcon: Record<AssetType, React.ElementType> = { imagem: Image, video: Play, copy: FileText, storyboard: Layout, template: Star }
const typeColor: Record<AssetType, string> = { imagem: '#7C3AED', video: '#06b6d4', copy: '#3B5BDB', storyboard: '#f59e0b', template: '#10b981' }
const typeLabel: Record<AssetType, string> = { imagem: 'Imagem', video: 'Vídeo', copy: 'Copy', storyboard: 'Storyboard', template: 'Template' }

const filterTabs: { id: AssetFilter; label: string; count: number }[] = [
  { id: 'todos',      label: 'Todos',       count: mockAssets.length },
  { id: 'imagem',     label: 'Imagens',     count: mockAssets.filter(a => a.type === 'imagem').length },
  { id: 'video',      label: 'Vídeos',      count: mockAssets.filter(a => a.type === 'video').length },
  { id: 'copy',       label: 'Copies',      count: mockAssets.filter(a => a.type === 'copy').length },
  { id: 'storyboard', label: 'Storyboards', count: mockAssets.filter(a => a.type === 'storyboard').length },
  { id: 'template',   label: 'Templates',   count: mockAssets.filter(a => a.type === 'template').length },
]

const statsRow = [
  { label: 'Assets totais', value: '147', color: '#3B5BDB' },
  { label: 'Aprovados',      value: '118', color: '#25D366' },
  { label: 'Templates',      value: '23',  color: '#10b981' },
  { label: 'Este mês',       value: '34',  color: '#a855f7' },
]

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 85 ? '#25D366' : score >= 70 ? '#06b6d4' : '#f59e0b'
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 3, background: `${color}15`, border: `1px solid ${color}30`, borderRadius: 20, padding: '2px 7px' }}>
      <div style={{ width: 4, height: 4, borderRadius: '50%', background: color, boxShadow: `0 0 4px ${color}` }} />
      <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 10, color }}>{score}</span>
    </div>
  )
}

function AssetCard({ asset }: { asset: Asset }) {
  const Icon = typeIcon[asset.type]
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{ background: 'rgba(13,18,37,0.8)', border: '1px solid rgba(59,91,219,0.14)', borderRadius: 14, overflow: 'hidden', cursor: 'pointer' }}
      whileHover={{ borderColor: 'rgba(59,91,219,0.3)' }}
    >
      <div style={{ height: 110, background: asset.gradient, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={30} color="rgba(255,255,255,0.7)" />
        <div style={{ position: 'absolute', top: 8, left: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: `${typeColor[asset.type]}22`, border: `1px solid ${typeColor[asset.type]}44`, borderRadius: 6, padding: '2px 7px', backdropFilter: 'blur(6px)' }}>
            <Icon size={10} color={typeColor[asset.type]} />
            <span style={{ fontSize: 9, fontWeight: 700, color: typeColor[asset.type], fontFamily: 'Space Grotesk, sans-serif' }}>{typeLabel[asset.type].toUpperCase()}</span>
          </div>
        </div>
        <div style={{ position: 'absolute', top: 8, right: 8 }}><ScoreBadge score={asset.score} /></div>
        {!asset.approved && (
          <div style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(245,158,11,0.25)', border: '1px solid rgba(245,158,11,0.4)', borderRadius: 6, padding: '2px 7px', backdropFilter: 'blur(6px)' }}>
            <span style={{ fontSize: 9, fontWeight: 700, color: '#f59e0b', fontFamily: 'Space Grotesk, sans-serif' }}>RASCUNHO</span>
          </div>
        )}
      </div>
      <div style={{ padding: '12px 14px' }}>
        <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 12, color: '#E8EEFF', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{asset.title}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: asset.brandColor }} />
          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{asset.brand}</span>
          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>·</span>
          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{asset.platform}</span>
          <span style={{ fontSize: 10, color: 'var(--text-muted)', marginLeft: 'auto' }}>{asset.date}</span>
        </div>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 10 }}>
          {asset.tags.slice(0, 2).map(tag => (
            <span key={tag} style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-muted)', background: 'rgba(59,91,219,0.08)', border: '1px solid rgba(59,91,219,0.12)', borderRadius: 20, padding: '1px 6px', fontFamily: 'Space Grotesk, sans-serif' }}>{tag}</span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button style={{ flex: 1, padding: '6px', borderRadius: 7, background: 'rgba(59,91,219,0.1)', border: '1px solid rgba(59,91,219,0.2)', color: '#93c5fd', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, fontSize: 11, fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif' }}>
            <Eye size={11} />Ver
          </button>
          <button style={{ flex: 1, padding: '6px', borderRadius: 7, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', color: '#34d399', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, fontSize: 11, fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif' }}>
            <Sparkles size={11} />Usar
          </button>
          <button style={{ padding: '6px 8px', borderRadius: 7, background: 'rgba(59,91,219,0.06)', border: '1px solid rgba(59,91,219,0.1)', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <Download size={12} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default function LibraryPage() {
  const [activeFilter, setActiveFilter] = useState<AssetFilter>('todos')
  const [search, setSearch] = useState('')
  const [view, setView] = useState<'grid' | 'list'>('grid')

  const filtered = mockAssets.filter(a =>
    (activeFilter === 'todos' || a.type === activeFilter) &&
    (search === '' || a.title.toLowerCase().includes(search.toLowerCase()) || a.tags.some(t => t.includes(search.toLowerCase())))
  )

  return (
    <div style={{ padding: '32px', minHeight: '100vh' }}>
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: 11, background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Library size={18} color="#a855f7" />
            </div>
            <div>
              <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 22, color: '#E8EEFF', lineHeight: 1.1 }}>Library</h1>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Todos os assets, templates e copies criados</p>
            </div>
          </div>
          <button onClick={() => setView(v => v === 'grid' ? 'list' : 'grid')} style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(59,91,219,0.08)', border: '1px solid rgba(59,91,219,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)' }}>
            {view === 'grid' ? <List size={15} /> : <Grid size={15} />}
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 20 }}>
          {statsRow.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              style={{ background: 'rgba(13,18,37,0.8)', border: '1px solid rgba(59,91,219,0.14)', borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 900, fontSize: 22, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 20, flexWrap: 'wrap' }}>
        {filterTabs.map(f => (
          <button key={f.id} onClick={() => setActiveFilter(f.id)} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 13px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif', background: activeFilter === f.id ? 'rgba(124,58,237,0.18)' : 'rgba(59,91,219,0.06)', border: `1px solid ${activeFilter === f.id ? 'rgba(124,58,237,0.35)' : 'rgba(59,91,219,0.12)'}`, color: activeFilter === f.id ? '#c084fc' : 'var(--text-muted)', transition: 'all 0.15s' }}>
            {f.label}
            <span style={{ background: activeFilter === f.id ? 'rgba(124,58,237,0.25)' : 'rgba(59,91,219,0.12)', borderRadius: 20, padding: '0px 5px', fontSize: 10 }}>{f.count}</span>
          </button>
        ))}
        <div style={{ marginLeft: 'auto', position: 'relative' }}>
          <Search size={13} color="var(--text-muted)" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
          <input className="input-field" placeholder="Buscar assets..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 30, width: 220 }} />
        </div>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: view === 'grid' ? 'repeat(auto-fill, minmax(220px, 1fr))' : '1fr', gap: 14 }}>
        {filtered.map((asset, i) => (
          <motion.div key={asset.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
            {view === 'grid' ? <AssetCard asset={asset} /> : (
              <div style={{ background: 'rgba(13,18,37,0.8)', border: '1px solid rgba(59,91,219,0.14)', borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: asset.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {(() => { const Icon = typeIcon[asset.type]; return <Icon size={18} color="rgba(255,255,255,0.8)" /> })()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 13, color: '#E8EEFF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{asset.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{asset.brand} · {asset.platform} · {asset.date}</div>
                </div>
                <ScoreBadge score={asset.score} />
                <div style={{ display: 'flex', gap: 6 }}>
                  <button style={{ padding: '5px 10px', borderRadius: 7, background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)', color: '#c084fc', cursor: 'pointer', fontSize: 11, fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif' }}>Usar</button>
                  <button style={{ padding: '5px 8px', borderRadius: 7, background: 'rgba(59,91,219,0.06)', border: '1px solid rgba(59,91,219,0.12)', color: 'var(--text-muted)', cursor: 'pointer' }}><Download size={12} /></button>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          <Library size={32} style={{ marginBottom: 10, opacity: 0.3 }} />
          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700 }}>Nenhum asset encontrado</div>
        </div>
      )}
    </div>
  )
}
