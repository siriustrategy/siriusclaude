'use client'

import { useState } from 'react'
import { ImagePlus, Wand2, Sparkles, Zap, ChevronDown, Download, RefreshCw } from 'lucide-react'
import { motion } from 'framer-motion'

const models = [
  { id: 'flux', label: 'Flux Pro', description: 'Melhor para imagens realistas', cost: 5, tag: 'Recomendado' },
  { id: 'kling', label: 'Kling', description: 'Ideal para vídeos e motion', cost: 8, tag: 'Vídeo' },
  { id: 'seaart', label: 'Seaart', description: 'Estilos artísticos e anime', cost: 4, tag: 'Arte' },
  { id: 'sora', label: 'Sora', description: 'Vídeos gerados por IA (OpenAI)', cost: 15, tag: 'Vídeo HD' },
]

const styles = ['Fotografia', 'Ilustração', 'Minimalista', 'Anime', 'Aquarela', 'Futurista', '3D', 'Retrô']
const ratios = ['1:1', '4:5', '9:16', '16:9', '3:4']

const recentImages = [
  { id: 'img1', label: 'Post produto premium', model: 'Flux Pro', gradient: 'linear-gradient(135deg, #1e1b4b, #312e81)' },
  { id: 'img2', label: 'Banner webinar', model: 'Flux Pro', gradient: 'linear-gradient(135deg, #064e3b, #065f46)' },
  { id: 'img3', label: 'Story motivacional', model: 'Seaart', gradient: 'linear-gradient(135deg, #4c1d95, #6b21a8)' },
  { id: 'img4', label: 'Cover LinkedIn', model: 'Flux Pro', gradient: 'linear-gradient(135deg, #1e3a5f, #1e40af)' },
]

export default function StudioPage() {
  const [selectedModel, setSelectedModel] = useState('flux')
  const [selectedStyle, setSelectedStyle] = useState('Fotografia')
  const [selectedRatio, setSelectedRatio] = useState('1:1')
  const [prompt, setPrompt] = useState('')
  const [generating, setGenerating] = useState(false)

  const model = models.find(m => m.id === selectedModel)!

  function generate() {
    if (!prompt.trim()) return
    setGenerating(true)
    setTimeout(() => setGenerating(false), 3000)
  }

  return (
    <div style={{ padding: '28px 36px' }}>

      {/* Header */}
      <motion.div
        style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 32 }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div style={{
          width: 48, height: 48, borderRadius: 14,
          background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <ImagePlus size={20} color="#a855f7" strokeWidth={2} />
        </div>
        <div>
          <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 24, fontWeight: 700, color: '#E8EEFF', marginBottom: 2 }}>
            Creative Studio
          </h1>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif' }}>
            Geração de imagens e vídeos com IA
          </div>
        </div>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 28, alignItems: 'start' }}>

        {/* Left: Generator */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {/* Model selector */}
          <div style={{ marginBottom: 22 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em', fontFamily: 'Space Grotesk, sans-serif', marginBottom: 10 }}>
              MODELO DE IA
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
              {models.map((m) => {
                const active = selectedModel === m.id
                return (
                  <button
                    key={m.id}
                    onClick={() => setSelectedModel(m.id)}
                    style={{
                      padding: '12px 14px', borderRadius: 10, cursor: 'pointer', textAlign: 'left' as const,
                      background: active ? 'rgba(124,58,237,0.15)' : 'var(--muted-bg)',
                      border: active ? '1px solid rgba(124,58,237,0.4)' : '1px solid var(--border)',
                      transition: 'all 0.15s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, fontWeight: 700, color: active ? '#E8EEFF' : 'var(--text-secondary)' }}>
                        {m.label}
                      </span>
                      <span style={{
                        fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4,
                        background: active ? 'rgba(124,58,237,0.25)' : 'rgba(59,91,219,0.12)',
                        color: active ? '#c4b5fd' : '#93c5fd',
                        fontFamily: 'Space Grotesk, sans-serif',
                      }}>{m.tag}</span>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif', marginBottom: 6 }}>
                      {m.description}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Zap size={10} color={active ? '#a855f7' : 'var(--text-muted)'} />
                      <span style={{ fontSize: 11, fontWeight: 700, color: active ? '#a855f7' : 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif' }}>
                        {m.cost} créditos
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Prompt */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em', fontFamily: 'Space Grotesk, sans-serif', marginBottom: 8 }}>
              DESCREVA A IMAGEM
            </div>
            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="Ex: Mulher empreendedora em escritório moderno, iluminação suave, laptop na mesa, tom profissional, fundo desfocado..."
              style={{
                width: '100%', minHeight: 90, padding: '12px 14px',
                borderRadius: 10, border: '1px solid var(--border)',
                background: 'rgba(13,18,37,0.8)', color: '#E8EEFF',
                fontSize: 13, lineHeight: 1.6, fontFamily: 'DM Sans, sans-serif',
                resize: 'vertical' as const, outline: 'none', boxSizing: 'border-box' as const,
              }}
              onFocus={e => { e.currentTarget.style.borderColor = 'rgba(124,58,237,0.5)' }}
              onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)' }}
            />
          </div>

          {/* Style + Ratio */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 20, marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em', fontFamily: 'Space Grotesk, sans-serif', marginBottom: 8 }}>
                ESTILO
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 6 }}>
                {styles.map(s => (
                  <button key={s} onClick={() => setSelectedStyle(s)} style={{
                    padding: '4px 11px', borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                    fontFamily: 'Space Grotesk, sans-serif',
                    background: selectedStyle === s ? 'rgba(124,58,237,0.15)' : 'transparent',
                    color: selectedStyle === s ? '#a855f7' : 'var(--text-secondary)',
                    border: selectedStyle === s ? '1px solid rgba(124,58,237,0.35)' : '1px solid var(--border)',
                  }}>{s}</button>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em', fontFamily: 'Space Grotesk, sans-serif', marginBottom: 8 }}>
                PROPORÇÃO
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {ratios.map(r => (
                  <button key={r} onClick={() => setSelectedRatio(r)} style={{
                    padding: '4px 12px', borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                    fontFamily: 'Space Grotesk, sans-serif',
                    background: selectedRatio === r ? 'rgba(124,58,237,0.15)' : 'transparent',
                    color: selectedRatio === r ? '#a855f7' : 'var(--text-secondary)',
                    border: selectedRatio === r ? '1px solid rgba(124,58,237,0.35)' : '1px solid var(--border)',
                  }}>{r}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Generate */}
          <button
            onClick={generate}
            disabled={!prompt.trim() || generating}
            style={{
              width: '100%', padding: '13px', borderRadius: 10, border: 'none',
              background: prompt.trim() ? 'linear-gradient(135deg, #7C3AED, #a855f7)' : 'var(--muted-bg)',
              color: prompt.trim() ? '#fff' : 'var(--text-muted)',
              fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 14,
              cursor: prompt.trim() ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'all 0.15s',
            }}
          >
            {generating ? (
              <><RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} />Gerando...</>
            ) : (
              <><Wand2 size={16} />Gerar imagem — {model.cost} créditos</>
            )}
          </button>
        </motion.div>

        {/* Right: Recent */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div style={{ marginBottom: 12 }}>
            <span className="section-label">GERADOS RECENTEMENTE</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
            {recentImages.map((img) => (
              <div key={img.id} style={{ borderRadius: 10, overflow: 'hidden', position: 'relative' as const }}>
                <div style={{
                  height: 110, background: img.gradient,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Sparkles size={22} color="rgba(255,255,255,0.3)" />
                </div>
                <div style={{ padding: '8px 10px', background: 'rgba(13,18,37,0.95)', border: '1px solid var(--border)', borderTop: 'none', borderRadius: '0 0 10px 10px' }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#E8EEFF', fontFamily: 'Space Grotesk, sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>
                    {img.label}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif' }}>
                    {img.model}
                  </div>
                </div>
                <button style={{
                  position: 'absolute' as const, top: 8, right: 8,
                  width: 26, height: 26, borderRadius: 6, border: 'none', cursor: 'pointer',
                  background: 'rgba(13,18,37,0.8)', color: 'rgba(255,255,255,0.7)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Download size={11} />
                </button>
              </div>
            ))}
          </div>

          {/* Tips */}
          <div style={{ padding: '14px 16px', borderRadius: 10, background: 'rgba(124,58,237,0.07)', border: '1px solid rgba(124,58,237,0.2)' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#a855f7', letterSpacing: '0.1em', fontFamily: 'Space Grotesk, sans-serif', marginBottom: 8 }}>
              DICA DE PROMPT
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Seja específico sobre iluminação, composição e estilo. Ex: <span style={{ color: '#c4b5fd' }}>"luz dourada da tarde, plano médio, estilo editorial"</span>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
