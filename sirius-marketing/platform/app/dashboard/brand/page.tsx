'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield, Plus, Check, ChevronRight, Palette, Type,
  MessageSquare, Target, Star, AlertTriangle, Sparkles,
  Edit3, Trash2, Upload, Eye, BarChart2, Zap,
} from 'lucide-react'

/* ─── tipos ─── */
type BrandSlot = 1 | 2 | 3
interface Brand { id: string; slot: BrandSlot; name: string; color: string; accent: string; active: boolean; score: number; onboarded: boolean }

/* ─── mock ─── */
const mockBrands: Brand[] = [
  { id: '1', slot: 1, name: 'Sirius Strategy', color: '#3B5BDB', accent: '#7C3AED', active: true,  score: 91, onboarded: true },
  { id: '2', slot: 2, name: 'Studio Criativo',  color: '#10b981', accent: '#06b6d4', active: false, score: 74, onboarded: true },
  { id: '3', slot: 3, name: '',                  color: '#333',    accent: '#555',    active: false, score: 0,  onboarded: false },
]

const brandMemoryFields = [
  { key: 'mission',    label: 'Missão',         placeholder: 'O que sua marca faz e para quem faz...', rows: 2 },
  { key: 'vision',     label: 'Visão',          placeholder: 'Onde sua marca quer chegar em 5 anos...', rows: 2 },
  { key: 'values',     label: 'Valores',        placeholder: 'Honestidade, Inovação, Simplicidade...', rows: 2 },
  { key: 'audience',   label: 'Público-alvo',   placeholder: 'Profissionais de 25-40 anos que buscam...', rows: 2 },
  { key: 'pain',       label: 'Dor principal',  placeholder: 'Meu cliente sofre com a falta de...', rows: 2 },
]

const toneOptions = [
  { value: 'profissional', label: 'Profissional', desc: 'Formal, direto, credível' },
  { value: 'descontraido', label: 'Descontraído', desc: 'Leve, amigável, acessível' },
  { value: 'inspirador',   label: 'Inspirador',   desc: 'Motivacional, elevado, aspiracional' },
  { value: 'educativo',    label: 'Educativo',    desc: 'Claro, didático, paciente' },
  { value: 'ousado',       label: 'Ousado',       desc: 'Bold, provocador, disruptivo' },
]

const policeDimensions = [
  { label: 'Tom de voz',    score: 94, color: '#25D366' },
  { label: 'Paleta visual', score: 88, color: '#25D366' },
  { label: 'Audiência',     score: 71, color: '#06b6d4' },
  { label: 'Estratégia',    score: 83, color: '#25D366' },
]

function ScoreRing({ score, color }: { score: number; color: string }) {
  const r = 26
  const c = 2 * Math.PI * r
  const filled = (score / 100) * c
  return (
    <svg width={68} height={68} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={34} cy={34} r={r} fill="none" stroke="rgba(59,91,219,0.1)" strokeWidth={5} />
      <circle cx={34} cy={34} r={r} fill="none" stroke={color} strokeWidth={5}
        strokeDasharray={`${filled} ${c}`} strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 4px ${color}88)` }} />
    </svg>
  )
}

export default function BrandPage() {
  const [brands, setBrands] = useState(mockBrands)
  const [active, setActive] = useState(brands.find(b => b.active)!)
  const [tab, setTab] = useState<'memory' | 'voice' | 'police'>('memory')
  const [memory, setMemory] = useState<Record<string, string>>({ mission: 'Potencializar marcas com IA, tornando o marketing profissional acessível para todos.', vision: 'Ser a plataforma de marketing com IA mais usada no Brasil até 2027.', values: 'Inovação, Clareza, Resultado', audience: 'Profissionais de marketing e donos de negócio de 25-45 anos', pain: 'Falta de tempo e ferramentas integradas para criar conteúdo consistente' })
  const [tone, setTone] = useState('profissional')
  const [voiceExamples, setVoiceExamples] = useState(['Resultados reais, não promessas vazias.', 'IA que trabalha para você, não o contrário.'])
  const [newExample, setNewExample] = useState('')

  const policeScore = Math.round(policeDimensions.reduce((s, d) => s + d.score, 0) / policeDimensions.length)

  function switchBrand(b: Brand) {
    if (!b.onboarded) return
    setActive(b)
    setBrands(prev => prev.map(br => ({ ...br, active: br.id === b.id })))
  }

  function addExample() {
    if (newExample.trim() && voiceExamples.length < 10) {
      setVoiceExamples(prev => [...prev, newExample.trim()])
      setNewExample('')
    }
  }

  return (
    <div style={{ padding: '32px', minHeight: '100vh' }}>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shield size={18} color="#f59e0b" />
          </div>
          <div>
            <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 22, color: '#E8EEFF', lineHeight: 1.1 }}>Brand Hub</h1>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Gerencie até 3 marcas, Brand Memory, Voz e Brand Police</p>
          </div>
        </div>
      </motion.div>

      {/* Brand Slots */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 28 }}>
        {brands.map(b => (
          <div
            key={b.id}
            onClick={() => switchBrand(b)}
            style={{
              borderRadius: 14, padding: '18px 20px',
              background: b.active ? `linear-gradient(135deg, ${b.color}15, ${b.accent}10)` : 'rgba(13,18,37,0.8)',
              border: b.active ? `1.5px solid ${b.color}40` : '1px solid rgba(59,91,219,0.14)',
              cursor: b.onboarded ? 'pointer' : 'default',
              transition: 'all 0.2s',
            }}
          >
            {b.onboarded ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 9, background: `${b.color}25`, border: `1px solid ${b.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 13, color: b.color }}>
                    {b.name.charAt(0)}
                  </div>
                  {b.active && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: `${b.color}20`, border: `1px solid ${b.color}35`, borderRadius: 20, padding: '2px 8px' }}>
                      <div style={{ width: 5, height: 5, borderRadius: '50%', background: b.color, boxShadow: `0 0 5px ${b.color}` }} />
                      <span style={{ fontSize: 9, fontWeight: 700, color: b.color, fontFamily: 'Space Grotesk, sans-serif' }}>ATIVA</span>
                    </div>
                  )}
                </div>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 14, color: '#E8EEFF', marginBottom: 4 }}>{b.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Star size={11} color="#f59e0b" />
                  <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontFamily: 'Space Grotesk, sans-serif' }}>Brand Score: <strong style={{ color: '#f59e0b' }}>{b.score}</strong></span>
                </div>
                <div style={{ display: 'flex', gap: 4, marginTop: 10 }}>
                  {[b.color, b.accent, '#E8EEFF'].map((c, i) => (
                    <div key={i} style={{ width: 16, height: 16, borderRadius: 4, background: c, border: '1px solid rgba(255,255,255,0.1)' }} />
                  ))}
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '16px 0', opacity: 0.5 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, border: '2px dashed rgba(59,91,219,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Plus size={18} color="var(--text-muted)" />
                </div>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600 }}>Slot {b.slot} — Vazio</span>
              </div>
            )}
          </div>
        ))}
      </motion.div>

      {/* Brand detail tabs */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        style={{ background: 'rgba(13,18,37,0.8)', border: '1px solid rgba(59,91,219,0.14)', borderRadius: 16, overflow: 'hidden' }}>

        {/* Tab bar */}
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(59,91,219,0.12)', padding: '0 20px' }}>
          {([
            { id: 'memory', label: 'Brand Memory', icon: Target },
            { id: 'voice',  label: 'Brand Voice',  icon: MessageSquare },
            { id: 'police', label: 'Brand Police',  icon: Shield },
          ] as const).map(t => {
            const Icon = t.icon
            return (
              <button key={t.id} onClick={() => setTab(t.id)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '14px 16px', background: 'none', border: 'none', borderBottom: `2px solid ${tab === t.id ? '#3B5BDB' : 'transparent'}`, cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 12, color: tab === t.id ? '#93c5fd' : 'var(--text-muted)', transition: 'all 0.15s', marginBottom: -1 }}>
                <Icon size={13} color={tab === t.id ? '#3B5BDB' : 'var(--text-muted)'} />
                {t.label}
              </button>
            )
          })}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', padding: '0 4px' }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif' }}>
              Marca ativa: <strong style={{ color: active.color }}>{active.name}</strong>
            </div>
          </div>
        </div>

        <div style={{ padding: '24px 24px 28px' }}>
          <AnimatePresence mode="wait">

            {/* MEMORY TAB */}
            {tab === 'memory' && (
              <motion.div key="memory" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                  {brandMemoryFields.slice(0, 4).map(f => (
                    <div key={f.key}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>{f.label}</div>
                      <textarea
                        className="input-field"
                        rows={f.rows}
                        placeholder={f.placeholder}
                        value={memory[f.key] ?? ''}
                        onChange={e => setMemory(prev => ({ ...prev, [f.key]: e.target.value }))}
                        style={{ width: '100%', resize: 'none' }}
                      />
                    </div>
                  ))}
                </div>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Dor Principal do Público</div>
                  <textarea className="input-field" rows={2} placeholder={brandMemoryFields[4].placeholder} value={memory.pain ?? ''} onChange={e => setMemory(prev => ({ ...prev, pain: e.target.value }))} style={{ width: '100%', resize: 'none' }} />
                </div>

                {/* Colors */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Paleta de Cores</div>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    {[active.color, active.accent, '#E8EEFF', '#080C18', '#25D366'].map((c, i) => (
                      <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 10, background: c, border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }} />
                        <span style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>{c}</span>
                      </div>
                    ))}
                    <div style={{ width: 40, height: 40, borderRadius: 10, border: '2px dashed rgba(59,91,219,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                      <Plus size={16} color="var(--text-muted)" />
                    </div>
                  </div>
                </div>

                <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '11px 22px', borderRadius: 9, background: 'linear-gradient(135deg, #3B5BDB, #5B7BFF)', border: 'none', color: '#fff', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 13, cursor: 'pointer', boxShadow: '0 4px 16px rgba(59,91,219,0.3)' }}>
                  <Check size={14} />
                  Salvar Brand Memory
                </button>
              </motion.div>
            )}

            {/* VOICE TAB */}
            {tab === 'voice' && (
              <motion.div key="voice" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Tom de voz</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {toneOptions.map(t => (
                        <div
                          key={t.value}
                          onClick={() => setTone(t.value)}
                          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 10, cursor: 'pointer', background: tone === t.value ? 'rgba(59,91,219,0.12)' : 'rgba(59,91,219,0.04)', border: `1px solid ${tone === t.value ? 'rgba(59,91,219,0.35)' : 'rgba(59,91,219,0.1)'}`, transition: 'all 0.15s' }}
                        >
                          <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${tone === t.value ? '#3B5BDB' : 'rgba(59,91,219,0.3)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            {tone === t.value && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#3B5BDB' }} />}
                          </div>
                          <div>
                            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 13, color: tone === t.value ? '#93c5fd' : '#E8EEFF' }}>{t.label}</div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
                      Exemplos de copy aprovados <span style={{ color: 'var(--text-muted)', fontWeight: 500, textTransform: 'none' }}>({voiceExamples.length}/10)</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 10 }}>
                      {voiceExamples.map((ex, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 8, background: 'rgba(59,91,219,0.06)', border: '1px solid rgba(59,91,219,0.1)' }}>
                          <span style={{ fontSize: 12, color: 'var(--text-secondary)', flex: 1, fontFamily: 'DM Sans, sans-serif' }}>{ex}</span>
                          <button onClick={() => setVoiceExamples(prev => prev.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 2 }}>
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input className="input-field" placeholder="Cole aqui um copy que funcionou..." value={newExample} onChange={e => setNewExample(e.target.value)} onKeyDown={e => e.key === 'Enter' && addExample()} style={{ flex: 1 }} />
                      <button onClick={addExample} style={{ padding: '8px 14px', borderRadius: 8, background: 'rgba(59,91,219,0.15)', border: '1px solid rgba(59,91,219,0.28)', color: '#93c5fd', cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 12 }}>
                        <Plus size={14} />
                      </button>
                    </div>

                    {voiceExamples.length >= 3 && (
                      <div style={{ marginTop: 14, background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.18)', borderRadius: 10, padding: '12px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                          <Sparkles size={13} color="#10b981" />
                          <span style={{ fontSize: 12, fontWeight: 700, color: '#34d399', fontFamily: 'Space Grotesk, sans-serif' }}>Padrões detectados</span>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                          {['Frases curtas', 'Contraste direto', 'Tom assertivo', 'Sem adjetivos vazios'].map(p => (
                            <span key={p} style={{ fontSize: 10, fontWeight: 700, color: '#34d399', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 20, padding: '2px 8px', fontFamily: 'Space Grotesk, sans-serif' }}>{p}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    <button style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', borderRadius: 9, background: 'linear-gradient(135deg, #3B5BDB, #5B7BFF)', border: 'none', color: '#fff', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 12, cursor: 'pointer' }}>
                      <Zap size={13} />
                      Gerar Brand Voice Profile
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* POLICE TAB */}
            {tab === 'police' && (
              <motion.div key="police" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 28 }}>
                  {/* Score geral */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                    <div style={{ position: 'relative', width: 68, height: 68 }}>
                      <ScoreRing score={policeScore} color={policeScore >= 85 ? '#25D366' : policeScore >= 70 ? '#06b6d4' : '#f59e0b'} />
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 900, fontSize: 18, color: '#E8EEFF', lineHeight: 1 }}>{policeScore}</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 14, color: '#E8EEFF' }}>Brand Score</div>
                      <div style={{ fontSize: 11, color: '#25D366', fontWeight: 700 }}>Consistente</div>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.5 }}>
                      Baseado nos últimos 34 conteúdos gerados
                    </div>
                  </div>

                  {/* Dimensões */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {policeDimensions.map(d => (
                      <div key={d.label}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 13, color: '#E8EEFF' }}>{d.label}</span>
                          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 13, color: d.color }}>{d.score}</span>
                        </div>
                        <div style={{ background: 'rgba(59,91,219,0.1)', borderRadius: 4, height: 6, overflow: 'hidden' }}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${d.score}%` }}
                            transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
                            style={{ height: '100%', background: `linear-gradient(90deg, ${d.color}88, ${d.color})`, borderRadius: 4, boxShadow: `0 0 6px ${d.color}55` }}
                          />
                        </div>
                      </div>
                    ))}

                    <div style={{ marginTop: 8, background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.18)', borderRadius: 10, padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                        <AlertTriangle size={13} color="#f59e0b" />
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#fcd34d', fontFamily: 'Space Grotesk, sans-serif' }}>1 alerta de consistência</span>
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                        3 posts esta semana usaram tom mais informal do que o perfil de voz define. Considere revisar antes de publicar.
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
