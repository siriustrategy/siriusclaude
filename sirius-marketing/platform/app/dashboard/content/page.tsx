'use client'

import { useState } from 'react'
import { FileText, Sparkles, ChevronRight, Copy, Check, ArrowRight, Wand2, AlignLeft, Hash, MessageSquare } from 'lucide-react'
import { motion } from 'framer-motion'

const contentTypes = [
  { id: 'caption', label: 'Legenda', icon: AlignLeft, color: '#3B5BDB', description: 'Para feed, Reels, TikTok' },
  { id: 'hashtags', label: 'Hashtags', icon: Hash, color: '#7C3AED', description: 'Conjunto otimizado' },
  { id: 'cta', label: 'CTA', icon: ArrowRight, color: '#10b981', description: 'Call to action eficaz' },
  { id: 'comment', label: 'Resposta', icon: MessageSquare, color: '#f59e0b', description: 'Para comentários e DMs' },
]

const tones = ['Profissional', 'Descontraído', 'Urgente', 'Inspirador', 'Humorístico']
const platforms = ['Instagram', 'TikTok', 'YouTube', 'LinkedIn']

const recentOutputs = [
  {
    id: 'o1',
    type: 'caption',
    platform: 'Instagram',
    tone: 'Inspirador',
    preview: 'Você não precisa de um produto perfeito. Você precisa do produto CERTO para a pessoa CERTA no momento CERTO. Essa é a diferença entre uma campanha esquecida e uma campanha que converte. 💡 Qual foi a última vez que você pensou assim na sua estratégia?',
    createdAt: 'há 2 horas',
  },
  {
    id: 'o2',
    type: 'hashtags',
    platform: 'Instagram',
    tone: 'Profissional',
    preview: '#marketingdigital #estrategiadigital #conteudodigital #marcaforte #negociodigital #empreendedorismo #marketingdeconteudo #redessociais #crescimentodigital #brandingpessoal',
    createdAt: 'ontem',
  },
  {
    id: 'o3',
    type: 'caption',
    platform: 'TikTok',
    tone: 'Descontraído',
    preview: 'POV: você finalmente entendeu que consistência bate perfeição SEMPRE. Posta todo dia, mesmo que imperfeito. Seu eu de 6 meses vai agradecer 🔥',
    createdAt: 'ontem',
  },
]

const typeLabel: Record<string, string> = {
  caption: 'Legenda',
  hashtags: 'Hashtags',
  cta: 'CTA',
  comment: 'Resposta',
}

const typeColor: Record<string, string> = {
  caption: '#3B5BDB',
  hashtags: '#7C3AED',
  cta: '#10b981',
  comment: '#f59e0b',
}

function OutputCard({ output }: { output: typeof recentOutputs[0] }) {
  const [copied, setCopied] = useState(false)
  function copy() {
    navigator.clipboard.writeText(output.preview)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <div className="glass-card" style={{ padding: '16px 18px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            padding: '3px 9px', borderRadius: 20, fontSize: 11, fontWeight: 700,
            background: `${typeColor[output.type]}18`, color: typeColor[output.type],
            border: `1px solid ${typeColor[output.type]}30`,
            fontFamily: 'Space Grotesk, sans-serif',
          }}>{typeLabel[output.type]}</span>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif' }}>
            {output.platform} · {output.tone}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif' }}>{output.createdAt}</span>
          <button
            onClick={copy}
            style={{
              width: 28, height: 28, borderRadius: 6, border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: copied ? 'rgba(16,185,129,0.15)' : 'var(--muted-bg)',
              color: copied ? '#10b981' : 'var(--text-muted)',
              transition: 'all 0.15s',
            }}
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
          </button>
        </div>
      </div>
      <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
        {output.preview}
      </p>
    </div>
  )
}

export default function ContentPage() {
  const [selectedType, setSelectedType] = useState('caption')
  const [selectedTone, setSelectedTone] = useState('Profissional')
  const [selectedPlatform, setSelectedPlatform] = useState('Instagram')
  const [brief, setBrief] = useState('')
  const [generating, setGenerating] = useState(false)

  function handleGenerate() {
    if (!brief.trim()) return
    setGenerating(true)
    setTimeout(() => setGenerating(false), 2000)
  }

  return (
    <div style={{ padding: '40px 48px', maxWidth: 1040, margin: '0 auto' }}>

      {/* Header */}
      <motion.div
        style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 32 }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div style={{
          width: 42, height: 42, borderRadius: 12,
          background: 'rgba(59,91,219,0.12)', border: '1px solid rgba(59,91,219,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <FileText size={20} color="#5B7BFF" strokeWidth={2} />
        </div>
        <div>
          <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 20, fontWeight: 700, color: '#E8EEFF', marginBottom: 2 }}>
            Content Factory
          </h1>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif' }}>
            Copy engine com IA — legendas, hashtags, CTAs e mais
          </div>
        </div>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24, alignItems: 'start' }}>

        {/* Left: Generator */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {/* Type selector */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em', fontFamily: 'Space Grotesk, sans-serif', marginBottom: 10 }}>
              O QUE GERAR
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
              {contentTypes.map((type) => {
                const Icon = type.icon
                const active = selectedType === type.id
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    style={{
                      padding: '12px 10px', borderRadius: 10, cursor: 'pointer',
                      background: active ? `${type.color}18` : 'var(--muted-bg)',
                      border: active ? `1px solid ${type.color}35` : '1px solid var(--border)',
                      textAlign: 'center' as const,
                      transition: 'all 0.15s',
                    } as React.CSSProperties}
                  >
                    <div style={{
                      width: 32, height: 32, borderRadius: 8, margin: '0 auto 6px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: active ? `${type.color}22` : 'rgba(255,255,255,0.04)',
                    }}>
                      <Icon size={15} color={active ? type.color : 'var(--text-muted)'} strokeWidth={2} />
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: active ? type.color : '#E8EEFF', fontFamily: 'Space Grotesk, sans-serif' }}>
                      {type.label}
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif', marginTop: 1 }}>
                      {type.description}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Platform + Tone */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em', fontFamily: 'Space Grotesk, sans-serif', marginBottom: 8 }}>
                PLATAFORMA
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 6 }}>
                {platforms.map((p) => (
                  <button key={p} onClick={() => setSelectedPlatform(p)} style={{
                    padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                    cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif',
                    background: selectedPlatform === p ? 'rgba(59,91,219,0.15)' : 'transparent',
                    color: selectedPlatform === p ? '#93c5fd' : 'var(--text-secondary)',
                    border: selectedPlatform === p ? '1px solid rgba(59,91,219,0.35)' : '1px solid var(--border)',
                  }}>{p}</button>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em', fontFamily: 'Space Grotesk, sans-serif', marginBottom: 8 }}>
                TOM DE VOZ
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 6 }}>
                {tones.map((t) => (
                  <button key={t} onClick={() => setSelectedTone(t)} style={{
                    padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                    cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif',
                    background: selectedTone === t ? 'rgba(124,58,237,0.15)' : 'transparent',
                    color: selectedTone === t ? '#a855f7' : 'var(--text-secondary)',
                    border: selectedTone === t ? '1px solid rgba(124,58,237,0.35)' : '1px solid var(--border)',
                  }}>{t}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Brief input */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em', fontFamily: 'Space Grotesk, sans-serif', marginBottom: 8 }}>
              BRIEFING (o que você quer comunicar?)
            </div>
            <textarea
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
              placeholder="Ex: Estou lançando um curso de marketing digital para pequenos empreendedores. Quero um post que mostre os resultados dos meus alunos..."
              style={{
                width: '100%', minHeight: 100, padding: '12px 14px',
                borderRadius: 10, border: '1px solid var(--border)',
                background: 'rgba(13,18,37,0.8)',
                color: '#E8EEFF', fontSize: 13, lineHeight: 1.6,
                fontFamily: 'DM Sans, sans-serif',
                resize: 'vertical' as const,
                outline: 'none',
                boxSizing: 'border-box' as const,
              }}
              onFocus={e => { e.currentTarget.style.borderColor = 'rgba(59,91,219,0.5)' }}
              onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)' }}
            />
          </div>

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={!brief.trim() || generating}
            style={{
              width: '100%', padding: '13px', borderRadius: 10,
              background: brief.trim() ? 'linear-gradient(135deg, #3B5BDB, #7C3AED)' : 'var(--muted-bg)',
              border: 'none', cursor: brief.trim() ? 'pointer' : 'not-allowed',
              color: brief.trim() ? '#fff' : 'var(--text-muted)',
              fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 14,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'all 0.15s',
            }}
          >
            {generating ? (
              <>
                <Sparkles size={16} style={{ animation: 'spin 1s linear infinite' }} />
                Gerando...
              </>
            ) : (
              <>
                <Wand2 size={16} />
                Gerar {typeLabel[selectedType]} — 3 créditos
              </>
            )}
          </button>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </motion.div>

        {/* Right: Recent outputs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span className="section-label">CRIADOS RECENTEMENTE</span>
            <button className="btn-ghost" style={{ fontSize: 12, padding: '5px 10px', display: 'flex', alignItems: 'center', gap: 4 }}>
              Ver todos <ChevronRight size={12} />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {recentOutputs.map((output) => (
              <OutputCard key={output.id} output={output} />
            ))}
          </div>

          {/* A/B testing promo */}
          <div style={{ marginTop: 16, padding: '14px 16px', borderRadius: 10, background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.2)' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#f59e0b', letterSpacing: '0.1em', fontFamily: 'Space Grotesk, sans-serif', marginBottom: 5 }}>
              A/B TESTING
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 10, lineHeight: 1.5 }}>
              Gere 3 versões do mesmo conteúdo e descubra qual performa melhor com seu público.
            </p>
            <button className="btn-ghost" style={{ fontSize: 12, padding: '6px 10px', display: 'flex', alignItems: 'center', gap: 5 }}>
              Gerar variações <ChevronRight size={12} />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
