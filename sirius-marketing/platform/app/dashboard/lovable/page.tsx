'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Code2, ChevronRight, ChevronLeft, Check, Copy,
  Zap, Star, Users, Layers, Palette, GitBranch, Plug,
  Sparkles, History, RefreshCw, Eye, TrendingUp,
} from 'lucide-react'

type WizardStep = 0 | 1 | 2 | 3 | 4 | 5
type TabId = 'novo' | 'melhorar' | 'historico'

interface WizardData {
  visao: string; publico: string; funcionalidades: string
  design: string; fluxos: string; integracoes: string
}

function calcQuality(data: WizardData) {
  const filled = Object.values(data).filter(v => v.trim().length > 20).length
  if (filled >= 5) return { score: 95, label: 'Excelente', color: '#25D366' }
  if (filled >= 4) return { score: 78, label: 'Ótimo',     color: '#06b6d4' }
  if (filled >= 3) return { score: 60, label: 'Bom',       color: '#f59e0b' }
  return           { score: 30, label: 'Básico',            color: '#ef4444' }
}

const STEPS = [
  { id: 0, label: 'Visão',           icon: Star,      color: '#3B5BDB', key: 'visao'           as keyof WizardData, subtitle: 'Qual é o produto?',        placeholder: 'Descreva o app/site em 1-2 frases. Ex: "Um app para gestores de academia controlarem frequência dos alunos e pagamentos mensais."' },
  { id: 1, label: 'Público',         icon: Users,     color: '#7C3AED', key: 'publico'          as keyof WizardData, subtitle: 'Para quem é?',             placeholder: 'Ex: "Donos de academias pequenas, 30-55 anos, sem muita familiaridade com tecnologia."' },
  { id: 2, label: 'Funcionalidades', icon: Layers,    color: '#06b6d4', key: 'funcionalidades'  as keyof WizardData, subtitle: 'O que ele faz?',           placeholder: 'Liste as funcionalidades. Ex: "1) Dashboard com alunos ativos 2) Checkin via QR code 3) Cobranças via Stripe."' },
  { id: 3, label: 'Design',          icon: Palette,   color: '#a855f7', key: 'design'           as keyof WizardData, subtitle: 'Como vai ser visualmente?', placeholder: 'Ex: "Dark mode, minimalista. Cores: #080C18 fundo, #3B5BDB primária. Fonte: Space Grotesk."' },
  { id: 4, label: 'Fluxos',          icon: GitBranch, color: '#f59e0b', key: 'fluxos'           as keyof WizardData, subtitle: 'Como o usuário navega?',   placeholder: 'Ex: "1) Aluno chega → abre app → escaneia QR → checkin registrado. 2) Admin abre dashboard → vê lista."' },
  { id: 5, label: 'Integrações',     icon: Plug,      color: '#10b981', key: 'integracoes'      as keyof WizardData, subtitle: 'Quais ferramentas usar?',  placeholder: 'Ex: "Supabase (banco + auth), Stripe (pagamentos), shadcn/ui (componentes), Resend (emails)."' },
]

const historyItems = [
  { id: '1', title: 'App academia — Controle de alunos',   date: 'hoje',     score: 92, steps: 6 },
  { id: '2', title: 'Landing page — Sirius Academy v2',    date: 'ontem',    score: 88, steps: 5 },
  { id: '3', title: 'Dashboard CRM — Agência marketing',   date: '3 dias',   score: 95, steps: 6 },
  { id: '4', title: 'App de agenda — Clínica de estética', date: '1 semana', score: 79, steps: 4 },
]

function generatePrompt(data: WizardData): string {
  return `# Prompt Lovable.dev — Sirius Architect

## VISÃO
${data.visao || '[Preencha a visão]'}

## PÚBLICO-ALVO
${data.publico || '[Descreva o público]'}

## FUNCIONALIDADES
${data.funcionalidades || '[Liste as funcionalidades]'}

## DESIGN SYSTEM
${data.design || '[Defina o visual]'}
Regras: NUNCA emojis na UI — sempre Lucide React. Cores em HEX. Dark mode padrão.

## FLUXOS DE USUÁRIO
${data.fluxos || '[Descreva os fluxos]'}

## STACK & INTEGRAÇÕES
${data.integracoes || '[Liste integrações]'}
Stack: Next.js 14 + Tailwind + shadcn/ui + Supabase (RLS obrigatório) + React Hook Form + Framer Motion.

## REGRAS PARA O LOVABLE
1. Comece pelo layout base antes de qualquer feature
2. Use shadcn/ui quando disponível — não reinvente
3. Cada tela: loading + empty state + error state
4. RLS no Supabase para todos os dados do usuário
5. Secrets apenas em .env.local`
}

export default function LovablePage() {
  const [tab, setTab] = useState<TabId>('novo')
  const [step, setStep] = useState<WizardStep>(0)
  const [data, setData] = useState<WizardData>({
    visao: '', publico: '', funcionalidades: '',
    design: 'Dark mode, minimalista. Fonte: Space Grotesk. Cores: #080C18 fundo, #3B5BDB primária, #7C3AED acento.',
    fluxos: '',
    integracoes: 'Supabase (banco + auth), Stripe (pagamentos), shadcn/ui, Lucide React.',
  })
  const [generated, setGenerated] = useState(false)
  const [copied, setCopied] = useState(false)
  const [existingPrompt, setExistingPrompt] = useState('')
  const [improving, setImproving] = useState(false)
  const [improved, setImproved] = useState(false)

  const quality = calcQuality(data)
  const currentStep = STEPS[step]
  const StepIcon = currentStep.icon

  function copyPrompt() { setCopied(true); setTimeout(() => setCopied(false), 2000) }
  function startImprove() {
    if (!existingPrompt.trim()) return
    setImproving(true)
    setTimeout(() => { setImproving(false); setImproved(true) }, 2000)
  }

  return (
    <div style={{ padding: '32px', minHeight: '100vh' }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Code2 size={18} color="#06b6d4" />
          </div>
          <div>
            <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 22, color: '#E8EEFF', lineHeight: 1.1 }}>Lovable Architect</h1>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Prompts profissionais para criar apps com Lovable.dev</p>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, borderBottom: '1px solid rgba(59,91,219,0.12)' }}>
        {([
          { id: 'novo', label: 'Novo Projeto', icon: Sparkles },
          { id: 'melhorar', label: 'Melhorar Prompt', icon: TrendingUp },
          { id: 'historico', label: 'Histórico', icon: History },
        ] as const).map(t => {
          const TIcon = t.icon
          return (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '11px 16px', background: 'none', border: 'none', borderBottom: `2px solid ${tab === t.id ? '#06b6d4' : 'transparent'}`, cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 12, color: tab === t.id ? '#06b6d4' : 'var(--text-muted)', transition: 'all 0.15s', marginBottom: -1 }}>
              <TIcon size={13} />
              {t.label}
            </button>
          )
        })}
      </div>

      <AnimatePresence mode="wait">

        {/* NOVO */}
        {tab === 'novo' && (
          <motion.div key="novo" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>

            <div style={{ background: 'rgba(13,18,37,0.8)', border: '1px solid rgba(59,91,219,0.14)', borderRadius: 16, overflow: 'hidden' }}>
              {/* Progress */}
              <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(59,91,219,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 12, color: 'var(--text-muted)' }}>Etapa {step + 1} / {STEPS.length}</span>
                  <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 12, color: currentStep.color }}>{currentStep.label}</span>
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  {STEPS.map((s, i) => (
                    <div key={s.id} onClick={() => setStep(s.id as WizardStep)} style={{ flex: 1, height: 4, borderRadius: 2, cursor: 'pointer', background: i <= step ? s.color : 'rgba(59,91,219,0.12)', transition: 'background 0.3s', boxShadow: i === step ? `0 0 6px ${s.color}88` : 'none' }} />
                  ))}
                </div>
              </div>

              <div style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: `${currentStep.color}18`, border: `1px solid ${currentStep.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <StepIcon size={17} color={currentStep.color} />
                  </div>
                  <div>
                    <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 16, color: '#E8EEFF' }}>{currentStep.label}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{currentStep.subtitle}</div>
                  </div>
                </div>
                <textarea className="input-field" rows={8} placeholder={currentStep.placeholder} value={data[currentStep.key]} onChange={e => setData(prev => ({ ...prev, [currentStep.key]: e.target.value }))} style={{ width: '100%', resize: 'none', fontSize: 13, lineHeight: 1.6 }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
                  <button onClick={() => step > 0 && setStep(s => (s - 1) as WizardStep)} disabled={step === 0}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', borderRadius: 9, background: 'var(--muted-bg)', border: '1px solid var(--border)', color: step === 0 ? 'var(--text-muted)' : 'var(--text-secondary)', cursor: step === 0 ? 'not-allowed' : 'pointer', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 13 }}>
                    <ChevronLeft size={14} />Anterior
                  </button>
                  {step < 5 ? (
                    <button onClick={() => setStep(s => (s + 1) as WizardStep)}
                      style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', borderRadius: 9, background: `linear-gradient(135deg, ${currentStep.color}cc, ${currentStep.color})`, border: 'none', color: '#fff', cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 13 }}>
                      Próximo<ChevronRight size={14} />
                    </button>
                  ) : (
                    <button onClick={() => setGenerated(true)}
                      style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px', borderRadius: 9, background: 'linear-gradient(135deg, #06b6d4, #3B5BDB)', border: 'none', color: '#fff', cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 13, boxShadow: '0 4px 16px rgba(6,182,212,0.3)' }}>
                      <Zap size={14} />Gerar Prompt
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ background: 'rgba(13,18,37,0.8)', border: '1px solid rgba(59,91,219,0.14)', borderRadius: 14, padding: '18px 20px' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>Qualidade do Prompt</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  <div style={{ position: 'relative', width: 60, height: 60 }}>
                    <svg width={60} height={60} style={{ transform: 'rotate(-90deg)' }}>
                      <circle cx={30} cy={30} r={24} fill="none" stroke="rgba(59,91,219,0.1)" strokeWidth={4} />
                      <circle cx={30} cy={30} r={24} fill="none" stroke={quality.color} strokeWidth={4}
                        strokeDasharray={`${(quality.score / 100) * 2 * Math.PI * 24} ${2 * Math.PI * 24}`}
                        strokeLinecap="round" style={{ filter: `drop-shadow(0 0 4px ${quality.color}88)`, transition: 'stroke-dasharray 0.5s' }} />
                    </svg>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 900, fontSize: 15, color: '#E8EEFF' }}>{quality.score}</span>
                    </div>
                  </div>
                  <div>
                    <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 18, color: quality.color }}>{quality.label}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Score do prompt</div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {STEPS.map(s => {
                    const filled = (data[s.key] ?? '').trim().length > 20
                    return (
                      <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 16, height: 16, borderRadius: '50%', background: filled ? `${s.color}20` : 'rgba(59,91,219,0.08)', border: `1.5px solid ${filled ? s.color : 'rgba(59,91,219,0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {filled && <Check size={9} color={s.color} />}
                        </div>
                        <span style={{ fontSize: 12, color: filled ? 'var(--text-secondary)' : 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif' }}>{s.label}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {generated && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  style={{ background: 'rgba(13,18,37,0.8)', border: '1px solid rgba(6,182,212,0.22)', borderRadius: 14, overflow: 'hidden' }}>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(6,182,212,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Sparkles size={13} color="#06b6d4" />
                      <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 12, color: '#06b6d4' }}>Prompt gerado</span>
                    </div>
                    <button onClick={copyPrompt} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 7, background: copied ? 'rgba(37,211,102,0.15)' : 'rgba(6,182,212,0.12)', border: `1px solid ${copied ? 'rgba(37,211,102,0.3)' : 'rgba(6,182,212,0.25)'}`, color: copied ? '#25D366' : '#06b6d4', cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 11 }}>
                      {copied ? <Check size={11} /> : <Copy size={11} />}
                      {copied ? 'Copiado!' : 'Copiar'}
                    </button>
                  </div>
                  <div style={{ padding: '12px 16px', maxHeight: 260, overflowY: 'auto' }}>
                    <pre style={{ fontSize: 10, color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', fontFamily: 'JetBrains Mono, monospace', lineHeight: 1.7 }}>{generatePrompt(data)}</pre>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* MELHORAR */}
        {tab === 'melhorar' && (
          <motion.div key="melhorar" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div style={{ background: 'rgba(13,18,37,0.8)', border: '1px solid rgba(59,91,219,0.14)', borderRadius: 14, padding: '20px 22px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Prompt atual (cole aqui)</div>
              <textarea className="input-field" rows={14} placeholder="Cole aqui o prompt que você já usou no Lovable..." value={existingPrompt} onChange={e => setExistingPrompt(e.target.value)} style={{ width: '100%', resize: 'none', fontSize: 12 }} />
              <button onClick={startImprove} disabled={!existingPrompt.trim() || improving}
                style={{ marginTop: 14, width: '100%', padding: '12px', borderRadius: 10, background: improving ? 'rgba(6,182,212,0.15)' : 'linear-gradient(135deg, #06b6d4, #3B5BDB)', border: improving ? '1px solid rgba(6,182,212,0.3)' : 'none', color: '#fff', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 13, cursor: !existingPrompt.trim() || improving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                {improving ? <><RefreshCw size={14} style={{ animation: 'spin 0.8s linear infinite' }} />Analisando...</> : <><Zap size={14} />Melhorar Prompt</>}
              </button>
            </div>
            <div style={{ background: 'rgba(13,18,37,0.8)', border: `1px solid ${improved ? 'rgba(37,211,102,0.22)' : 'rgba(59,91,219,0.14)'}`, borderRadius: 14, padding: '20px 22px' }}>
              {!improved ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 12, opacity: 0.4 }}>
                  <Eye size={28} color="var(--text-muted)" />
                  <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, color: 'var(--text-muted)' }}>Prompt melhorado aparece aqui</span>
                </div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Check size={14} color="#25D366" />
                      <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 12, color: '#25D366' }}>Otimizado</span>
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Score: <strong style={{ color: '#ef4444' }}>52</strong> → <strong style={{ color: '#25D366' }}>91</strong></span>
                  </div>
                  <div style={{ background: 'rgba(37,211,102,0.05)', border: '1px solid rgba(37,211,102,0.12)', borderRadius: 8, padding: '10px 12px', marginBottom: 12 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#34d399', fontFamily: 'Space Grotesk, sans-serif', marginBottom: 6 }}>Melhorias aplicadas:</div>
                    {['Design system completo com HEX','Stack definida (Next.js, Supabase)','Fluxos detalhados por persona','RLS e regras de segurança incluídas','Termos vagos removidos'].map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: 4 }}>
                        <Check size={10} color="#25D366" style={{ marginTop: 2, flexShrink: 0 }} />
                        <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{item}</span>
                      </div>
                    ))}
                  </div>
                  <button style={{ width: '100%', padding: '8px', borderRadius: 8, background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.25)', color: '#25D366', cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    <Copy size={12} />Copiar prompt otimizado
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* HISTÓRICO */}
        {tab === 'historico' && (
          <motion.div key="historico" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {historyItems.map((h, i) => (
                <motion.div key={h.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                  style={{ background: 'rgba(13,18,37,0.8)', border: '1px solid rgba(59,91,219,0.14)', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Code2 size={17} color="#06b6d4" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 14, color: '#E8EEFF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{h.steps}/6 etapas · {h.date}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: `${h.score >= 85 ? '#25D366' : '#06b6d4'}15`, border: `1px solid ${h.score >= 85 ? '#25D366' : '#06b6d4'}30`, borderRadius: 20, padding: '3px 10px' }}>
                    <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 12, color: h.score >= 85 ? '#25D366' : '#06b6d4' }}>{h.score}</span>
                  </div>
                  <button style={{ padding: '7px 13px', borderRadius: 8, background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.22)', color: '#06b6d4', cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Copy size={12} />Reusar
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
