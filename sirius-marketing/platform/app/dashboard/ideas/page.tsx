'use client'

import { useState } from 'react'
import { Lightbulb, Sparkles, ThumbsUp, ThumbsDown, Copy, Check, Filter, ChevronDown, RefreshCw, BookmarkPlus } from 'lucide-react'
import { motion } from 'framer-motion'

const categories = ['Todas', 'Educativo', 'Entretenimento', 'Vendas', 'Bastidores', 'Trend']
const platforms = ['Todas', 'Instagram', 'TikTok', 'YouTube']
const formats = ['Todos', 'Reel', 'Carrossel', 'Story', 'Post estático', 'Short']

const mockIdeas = [
  {
    id: 'i1',
    title: '3 erros que impedem seu negócio de crescer no Instagram',
    hook: 'Você sabe por que 90% dos perfis nunca passam de 1k seguidores? É porque cometem esses 3 erros...',
    category: 'Educativo',
    platform: 'Instagram',
    format: 'Reel',
    estimatedReach: '12k–28k',
    difficulty: 'fácil',
    saved: false,
  },
  {
    id: 'i2',
    title: 'Dia a dia nos bastidores: como é trabalhar com marketing digital',
    hook: 'Ninguém te mostra o que realmente acontece por trás de uma campanha de sucesso...',
    category: 'Bastidores',
    platform: 'TikTok',
    format: 'Reel',
    estimatedReach: '8k–20k',
    difficulty: 'fácil',
    saved: false,
  },
  {
    id: 'i3',
    title: 'Antes e depois: transformação de perfil em 30 dias',
    hook: 'Em 30 dias saímos de zero para R$12k em vendas. Aqui está exatamente o que fizemos...',
    category: 'Vendas',
    platform: 'Instagram',
    format: 'Carrossel',
    estimatedReach: '15k–35k',
    difficulty: 'médio',
    saved: true,
  },
  {
    id: 'i4',
    title: 'Tutorial: como criar Reels que vendem em menos de 60 segundos',
    hook: 'Em 60 segundos você pode explicar, conectar e vender. Deixa eu te mostrar como...',
    category: 'Educativo',
    platform: 'YouTube',
    format: 'Short',
    estimatedReach: '5k–18k',
    difficulty: 'médio',
    saved: false,
  },
  {
    id: 'i5',
    title: 'POV: quando o cliente diz que "não tem tempo para redes sociais"',
    hook: 'Cada hora que você adia sua presença digital, seu concorrente está crescendo no seu lugar.',
    category: 'Entretenimento',
    platform: 'TikTok',
    format: 'Reel',
    estimatedReach: '20k–60k',
    difficulty: 'fácil',
    saved: false,
  },
  {
    id: 'i6',
    title: '5 tipos de conteúdo que geram leads todo dia (mesmo dormindo)',
    hook: 'Conteúdo certo = cliente entrando no DM às 3 da manhã. Aqui estão os 5 formatos que funcionam...',
    category: 'Vendas',
    platform: 'Instagram',
    format: 'Carrossel',
    estimatedReach: '18k–42k',
    difficulty: 'médio',
    saved: false,
  },
]

const difficultyColor: Record<string, string> = {
  fácil: '#10b981',
  médio: '#f59e0b',
  difícil: '#ef4444',
}

const platformColor: Record<string, string> = {
  Instagram: '#7C3AED',
  TikTok: '#06b6d4',
  YouTube: '#ef4444',
}

function IdeaCard({ idea, index }: { idea: typeof mockIdeas[0]; index: number }) {
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(idea.saved)
  const [liked, setLiked] = useState<'up' | 'down' | null>(null)

  function copyHook() {
    navigator.clipboard.writeText(idea.hook)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      className="glass-card"
      style={{ padding: '20px 22px' }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
    >
      {/* Badges */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' as const, marginBottom: 10 }}>
        <span style={{
          padding: '3px 9px', borderRadius: 20, fontSize: 11, fontWeight: 700,
          background: `${platformColor[idea.platform] ?? '#3B5BDB'}18`,
          color: platformColor[idea.platform] ?? '#3B5BDB',
          border: `1px solid ${platformColor[idea.platform] ?? '#3B5BDB'}30`,
          fontFamily: 'Space Grotesk, sans-serif',
        }}>
          {idea.platform}
        </span>
        <span style={{
          padding: '3px 9px', borderRadius: 20, fontSize: 11, fontWeight: 600,
          background: 'var(--muted-bg)', color: 'var(--text-secondary)',
          border: '1px solid var(--border)',
          fontFamily: 'Space Grotesk, sans-serif',
        }}>
          {idea.format}
        </span>
        <span style={{
          padding: '3px 9px', borderRadius: 20, fontSize: 11, fontWeight: 600,
          background: 'var(--muted-bg)', color: 'var(--text-muted)',
          border: '1px solid var(--border)',
          fontFamily: 'Space Grotesk, sans-serif',
        }}>
          {idea.category}
        </span>
      </div>

      {/* Title */}
      <h3 style={{
        fontFamily: 'Space Grotesk, sans-serif', fontSize: 15, fontWeight: 700,
        color: '#E8EEFF', lineHeight: 1.35, marginBottom: 12,
      }}>
        {idea.title}
      </h3>

      {/* Hook preview */}
      <div style={{
        padding: '10px 14px', borderRadius: 8,
        background: 'rgba(59,91,219,0.07)', border: '1px solid rgba(59,91,219,0.18)',
        marginBottom: 16,
      }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: '#93c5fd', letterSpacing: '0.1em', marginBottom: 5, fontFamily: 'Space Grotesk, sans-serif' }}>
          HOOK SUGERIDO
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.55, fontStyle: 'italic' }}>
          "{idea.hook}"
        </p>
      </div>

      {/* Bottom row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' as const }}>
        {/* Metrics */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1 }}>
          <div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif', marginBottom: 1 }}>Alcance est.</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#10b981', fontFamily: 'Space Grotesk, sans-serif' }}>{idea.estimatedReach}</div>
          </div>
          <div style={{ width: 1, height: 24, background: 'var(--border)' }} />
          <div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif', marginBottom: 1 }}>Dificuldade</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: difficultyColor[idea.difficulty], fontFamily: 'Space Grotesk, sans-serif' }}>
              {idea.difficulty}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button
            onClick={() => setLiked(liked === 'up' ? null : 'up')}
            style={{
              width: 32, height: 32, borderRadius: 8, border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: liked === 'up' ? 'rgba(16,185,129,0.15)' : 'var(--muted-bg)',
              color: liked === 'up' ? '#10b981' : 'var(--text-muted)',
              transition: 'all 0.15s',
            }}
          >
            <ThumbsUp size={13} />
          </button>
          <button
            onClick={() => setLiked(liked === 'down' ? null : 'down')}
            style={{
              width: 32, height: 32, borderRadius: 8, border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: liked === 'down' ? 'rgba(239,68,68,0.12)' : 'var(--muted-bg)',
              color: liked === 'down' ? '#ef4444' : 'var(--text-muted)',
              transition: 'all 0.15s',
            }}
          >
            <ThumbsDown size={13} />
          </button>
          <button
            onClick={() => setSaved(!saved)}
            style={{
              width: 32, height: 32, borderRadius: 8, border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: saved ? 'rgba(59,91,219,0.18)' : 'var(--muted-bg)',
              color: saved ? '#93c5fd' : 'var(--text-muted)',
              transition: 'all 0.15s',
            }}
          >
            <BookmarkPlus size={13} />
          </button>
          <button
            onClick={copyHook}
            className="btn-ghost"
            style={{ fontSize: 12, padding: '6px 10px', display: 'flex', alignItems: 'center', gap: 5 }}
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? 'Copiado!' : 'Copiar hook'}
          </button>
          <button className="btn-primary" style={{ fontSize: 12, padding: '7px 14px' }}>
            <Sparkles size={12} />
            Criar conteúdo
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default function IdeasPage() {
  const [activeCategory, setActiveCategory] = useState('Todas')
  const [activePlatform, setActivePlatform] = useState('Todas')
  const [activeFormat, setActiveFormat] = useState('Todos')
  const [showFilters, setShowFilters] = useState(false)

  const filtered = mockIdeas.filter((idea) => {
    if (activeCategory !== 'Todas' && idea.category !== activeCategory) return false
    if (activePlatform !== 'Todas' && idea.platform !== activePlatform) return false
    if (activeFormat !== 'Todos' && idea.format !== activeFormat) return false
    return true
  })

  return (
    <div style={{ padding: '40px 48px', maxWidth: 960, margin: '0 auto' }}>

      {/* Header */}
      <motion.div
        style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 42, height: 42, borderRadius: 12,
            background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Lightbulb size={20} color="#f59e0b" strokeWidth={2} />
          </div>
          <div>
            <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 20, fontWeight: 700, color: '#E8EEFF', marginBottom: 2 }}>
              Ideas Lab
            </h1>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif' }}>
              {filtered.length} ideias geradas para você esta semana
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-ghost"
            style={{ fontSize: 12, padding: '7px 12px', display: 'flex', alignItems: 'center', gap: 5 }}
          >
            <Filter size={13} />
            Filtros
            <ChevronDown size={12} style={{ transform: showFilters ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
          </button>
          <button className="btn-primary" style={{ fontSize: 12, padding: '7px 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
            <RefreshCw size={13} />
            Gerar novas ideias
          </button>
        </div>
      </motion.div>

      {/* Expanded filters */}
      {showFilters && (
        <motion.div
          style={{ marginBottom: 20, padding: '16px 18px', borderRadius: 12, background: 'var(--muted-bg)', border: '1px solid var(--border)' }}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' as const }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em', fontFamily: 'Space Grotesk, sans-serif', marginBottom: 8 }}>CATEGORIA</div>
              <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 6 }}>
                {categories.map((c) => (
                  <button key={c} onClick={() => setActiveCategory(c)} style={{
                    padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                    cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif',
                    background: activeCategory === c ? 'rgba(245,158,11,0.15)' : 'transparent',
                    color: activeCategory === c ? '#f59e0b' : 'var(--text-secondary)',
                    border: activeCategory === c ? '1px solid rgba(245,158,11,0.35)' : '1px solid var(--border)',
                  }}>{c}</button>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em', fontFamily: 'Space Grotesk, sans-serif', marginBottom: 8 }}>PLATAFORMA</div>
              <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 6 }}>
                {platforms.map((p) => (
                  <button key={p} onClick={() => setActivePlatform(p)} style={{
                    padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                    cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif',
                    background: activePlatform === p ? 'rgba(59,91,219,0.15)' : 'transparent',
                    color: activePlatform === p ? '#93c5fd' : 'var(--text-secondary)',
                    border: activePlatform === p ? '1px solid rgba(59,91,219,0.35)' : '1px solid var(--border)',
                  }}>{p}</button>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em', fontFamily: 'Space Grotesk, sans-serif', marginBottom: 8 }}>FORMATO</div>
              <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 6 }}>
                {formats.map((f) => (
                  <button key={f} onClick={() => setActiveFormat(f)} style={{
                    padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                    cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif',
                    background: activeFormat === f ? 'rgba(124,58,237,0.15)' : 'transparent',
                    color: activeFormat === f ? '#a855f7' : 'var(--text-secondary)',
                    border: activeFormat === f ? '1px solid rgba(124,58,237,0.35)' : '1px solid var(--border)',
                  }}>{f}</button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Quick category pills */}
      {!showFilters && (
        <div style={{ display: 'flex', gap: 6, marginBottom: 24, flexWrap: 'wrap' as const }}>
          {categories.map((c) => (
            <button key={c} onClick={() => setActiveCategory(c)} style={{
              padding: '5px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600,
              cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif',
              background: activeCategory === c ? 'rgba(245,158,11,0.15)' : 'transparent',
              color: activeCategory === c ? '#f59e0b' : 'var(--text-secondary)',
              border: activeCategory === c ? '1px solid rgba(245,158,11,0.35)' : '1px solid var(--border)',
            }}>{c}</button>
          ))}
        </div>
      )}

      {/* Ideas list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 40 }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center' as const, padding: '60px 0', color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif' }}>
            Nenhuma ideia encontrada com esses filtros.
          </div>
        ) : (
          filtered.map((idea, i) => <IdeaCard key={idea.id} idea={idea} index={i} />)
        )}
      </div>

      {/* CTA bottom */}
      <div className="action-card-blue" style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <div style={{
          width: 48, height: 48, borderRadius: 12, flexShrink: 0,
          background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Sparkles size={22} color="#f59e0b" strokeWidth={2} />
        </div>
        <div style={{ flex: 1 }}>
          <h4 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 14, color: '#E8EEFF', marginBottom: 3 }}>
            Quer ideias mais personalizadas?
          </h4>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            Configure seu Brand Hub para a IA gerar ideias 100% alinhadas com sua marca e público.
          </p>
        </div>
        <button className="btn-secondary" style={{ fontSize: 12, flexShrink: 0 }}>
          Configurar marca
        </button>
      </div>
    </div>
  )
}
