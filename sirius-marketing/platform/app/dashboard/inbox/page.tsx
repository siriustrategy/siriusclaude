'use client'

import { useState } from 'react'
import { MessageCircle, Zap, Plus, ChevronRight, Pencil, Trash2, MessageSquare, Hash, AtSign, Clock, Check, X } from 'lucide-react'
import { motion } from 'framer-motion'

type Trigger = 'keyword' | 'comment' | 'dm' | 'story_reply'
type RuleStatus = 'active' | 'inactive'

interface AutoRule {
  id: string
  name: string
  trigger: Trigger
  keywords: string[]
  response: string
  platform: 'Instagram'
  status: RuleStatus
  repliesCount: number
  lastFired: string
}

const triggerConfig: Record<Trigger, { label: string; icon: typeof MessageCircle; color: string }> = {
  keyword:     { label: 'Palavra-chave no comentário', icon: Hash,          color: '#3B5BDB' },
  comment:     { label: 'Qualquer comentário',          icon: MessageSquare, color: '#f59e0b' },
  dm:          { label: 'Mensagem direta (DM)',         icon: MessageCircle, color: '#7C3AED' },
  story_reply: { label: 'Resposta de Story',            icon: AtSign,        color: '#06b6d4' },
}

const mockRules: AutoRule[] = [
  {
    id: 'r1',
    name: 'Enviar link do curso',
    trigger: 'keyword',
    keywords: ['link', 'como comprar', 'onde comprar', 'valor', 'preço'],
    response: 'Oi! Que bom que se interessou 😊 Aqui está o link para garantir sua vaga: [LINK] Qualquer dúvida é só chamar no DM!',
    platform: 'Instagram',
    status: 'active',
    repliesCount: 234,
    lastFired: 'há 14 min',
  },
  {
    id: 'r2',
    name: 'Boas-vindas no DM',
    trigger: 'dm',
    keywords: [],
    response: 'Olá! 👋 Obrigado por entrar em contato. Nossa equipe vai responder em breve. Enquanto isso, confira nosso conteúdo mais recente no feed!',
    platform: 'Instagram',
    status: 'active',
    repliesCount: 89,
    lastFired: 'há 2 horas',
  },
  {
    id: 'r3',
    name: 'Responder "Quero saber mais"',
    trigger: 'keyword',
    keywords: ['quero saber', 'mais informações', 'me conta', 'detalhes'],
    response: 'Perfeito! Manda um DM que eu te passo todos os detalhes 🚀',
    platform: 'Instagram',
    status: 'active',
    repliesCount: 157,
    lastFired: 'há 1 hora',
  },
  {
    id: 'r4',
    name: 'Resposta de Story — Lead',
    trigger: 'story_reply',
    keywords: [],
    response: 'Oi! Vi que você respondeu nosso Story 😍 Quer saber mais? Me chama no DM que a gente resolve!',
    platform: 'Instagram',
    status: 'inactive',
    repliesCount: 42,
    lastFired: 'há 3 dias',
  },
]

const recentActivity = [
  { user: '@maria.silva', action: 'comentou "link"', rule: 'Enviar link do curso', time: 'há 14 min', replied: true },
  { user: '@joao_mkt', action: 'enviou DM', rule: 'Boas-vindas no DM', time: 'há 2 horas', replied: true },
  { user: '@ana_empreendedora', action: 'comentou "quero saber mais"', rule: 'Responder "Quero saber mais"', time: 'há 3 horas', replied: true },
  { user: '@lucas.digital', action: 'comentou "preço"', rule: 'Enviar link do curso', time: 'há 5 horas', replied: true },
  { user: '@carol_coach', action: 'enviou DM', rule: 'Boas-vindas no DM', time: 'ontem', replied: true },
]

function RuleCard({ rule, onToggle }: { rule: AutoRule; onToggle: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false)
  const trigger = triggerConfig[rule.trigger]
  const TriggerIcon = trigger.icon

  return (
    <motion.div
      className="glass-card"
      style={{ overflow: 'hidden' }}
      layout
    >
      <div style={{ padding: '16px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          {/* Trigger icon */}
          <div style={{
            width: 36, height: 36, borderRadius: 9, flexShrink: 0, marginTop: 2,
            background: `${trigger.color}15`, border: `1px solid ${trigger.color}25`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <TriggerIcon size={15} color={trigger.color} strokeWidth={2} />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Name + status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 5 }}>
              <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 14, fontWeight: 700, color: '#E8EEFF' }}>
                {rule.name}
              </span>
              <span style={{
                padding: '2px 8px', borderRadius: 20, fontSize: 10, fontWeight: 700,
                background: rule.status === 'active' ? 'rgba(16,185,129,0.12)' : 'var(--muted-bg)',
                color: rule.status === 'active' ? '#10b981' : 'var(--text-muted)',
                border: rule.status === 'active' ? '1px solid rgba(16,185,129,0.25)' : '1px solid var(--border)',
                fontFamily: 'Space Grotesk, sans-serif',
              }}>
                {rule.status === 'active' ? 'Ativo' : 'Inativo'}
              </span>
            </div>

            {/* Trigger label */}
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'Space Grotesk, sans-serif', marginBottom: 6 }}>
              {trigger.label}
              {rule.keywords.length > 0 && (
                <span style={{ color: 'var(--text-muted)' }}>
                  {' '}— <span style={{ color: trigger.color }}>{rule.keywords.slice(0, 3).join(', ')}{rule.keywords.length > 3 ? '...' : ''}</span>
                </span>
              )}
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif' }}>
                <span style={{ fontWeight: 700, color: '#10b981' }}>{rule.repliesCount}</span> respostas enviadas
              </span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif' }}>
                Último disparo: {rule.lastFired}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <button
              onClick={() => setExpanded(!expanded)}
              className="btn-ghost"
              style={{ fontSize: 12, padding: '5px 10px' }}
            >
              {expanded ? 'Fechar' : 'Ver resposta'}
            </button>
            <button
              onClick={() => onToggle(rule.id)}
              style={{
                width: 44, height: 24, borderRadius: 12, cursor: 'pointer', border: 'none',
                background: rule.status === 'active' ? 'rgba(16,185,129,0.2)' : 'var(--muted-bg)',
                display: 'flex', alignItems: 'center',
                padding: '0 3px', transition: 'background 0.2s',
                position: 'relative' as const,
              }}
            >
              <div style={{
                width: 18, height: 18, borderRadius: '50%',
                background: rule.status === 'active' ? '#10b981' : 'var(--text-muted)',
                transform: rule.status === 'active' ? 'translateX(20px)' : 'translateX(0)',
                transition: 'transform 0.2s, background 0.2s',
              }} />
            </button>
          </div>
        </div>

        {/* Expanded: response preview */}
        {expanded && (
          <motion.div
            style={{ marginTop: 14 }}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.2 }}
          >
            <div style={{ padding: '12px 14px', borderRadius: 8, background: 'rgba(59,91,219,0.07)', border: '1px solid rgba(59,91,219,0.18)' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#93c5fd', letterSpacing: '0.1em', fontFamily: 'Space Grotesk, sans-serif', marginBottom: 6 }}>
                RESPOSTA AUTOMÁTICA
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {rule.response}
              </p>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              <button className="btn-ghost" style={{ fontSize: 12, padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 5 }}>
                <Pencil size={12} />
                Editar
              </button>
              <button style={{
                padding: '6px 12px', borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                color: '#ef4444', fontFamily: 'Space Grotesk, sans-serif',
                display: 'flex', alignItems: 'center', gap: 5,
              }}>
                <Trash2 size={12} />
                Excluir regra
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default function InboxPage() {
  const [rules, setRules] = useState(mockRules)
  const [showNewRule, setShowNewRule] = useState(false)

  function toggleRule(id: string) {
    setRules(prev => prev.map(r => r.id === id
      ? { ...r, status: r.status === 'active' ? 'inactive' : 'active' as RuleStatus }
      : r
    ))
  }

  const activeCount = rules.filter(r => r.status === 'active').length
  const totalReplies = rules.reduce((sum, r) => sum + r.repliesCount, 0)

  return (
    <div style={{ padding: '28px 36px' }}>

      {/* Header */}
      <motion.div
        style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <MessageCircle size={20} color="#a855f7" strokeWidth={2} />
          </div>
          <div>
            <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 24, fontWeight: 700, color: '#E8EEFF', marginBottom: 2 }}>
              Instagram Agent
            </h1>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif' }}>
              Respostas automáticas para DMs e comentários
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowNewRule(true)}
          className="btn-primary"
          style={{ fontSize: 13, padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 7 }}
        >
          <Plus size={15} />
          Nova regra
        </button>
      </motion.div>

      {/* Stats mini */}
      <motion.div
        style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 28 }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
      >
        {[
          { label: 'Regras ativas', value: `${activeCount}/${rules.length}`, color: '#10b981' },
          { label: 'Respostas enviadas', value: totalReplies.toLocaleString('pt-BR'), color: '#7C3AED' },
          { label: 'Taxa de resposta', value: '100%', color: '#3B5BDB' },
        ].map((s) => (
          <div key={s.label} className="glass-card" style={{ padding: '16px 18px' }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase' as const, marginBottom: 8 }}>
              {s.label}
            </div>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 22, fontWeight: 700, color: s.color }}>
              {s.value}
            </div>
          </div>
        ))}
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>

        {/* Left: Rules */}
        <div>
          <div style={{ marginBottom: 14 }}>
            <span className="section-label">REGRAS DE AUTOMAÇÃO</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {rules.map((rule, i) => (
              <motion.div
                key={rule.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <RuleCard rule={rule} onToggle={toggleRule} />
              </motion.div>
            ))}
          </div>

          {/* Empty rule CTA */}
          <button
            onClick={() => setShowNewRule(true)}
            style={{
              width: '100%', marginTop: 10, padding: '14px',
              borderRadius: 10, border: '1px dashed var(--border)',
              background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer',
              fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, fontWeight: 600,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--muted-bg)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
          >
            <Plus size={14} />
            Adicionar nova regra
          </button>
        </div>

        {/* Right: Activity feed */}
        <div>
          <div style={{ marginBottom: 14 }}>
            <span className="section-label">ATIVIDADE RECENTE</span>
          </div>
          <div className="glass-card" style={{ overflow: 'hidden', marginBottom: 16 }}>
            {recentActivity.map((activity, i) => (
              <div key={i} style={{
                padding: '12px 16px',
                borderBottom: i < recentActivity.length - 1 ? '1px solid var(--border)' : 'none',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                    background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.25)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, fontWeight: 700, color: '#a855f7', fontFamily: 'Space Grotesk, sans-serif',
                  }}>
                    {activity.user[1].toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, color: '#E8EEFF', fontFamily: 'Space Grotesk, sans-serif', marginBottom: 2 }}>
                      <span style={{ fontWeight: 700 }}>{activity.user}</span>
                      {' '}<span style={{ color: 'var(--text-secondary)' }}>{activity.action}</span>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif', marginBottom: 3 }}>
                      Regra: {activity.rule}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif' }}>{activity.time}</span>
                      {activity.replied && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 10, color: '#10b981', fontFamily: 'Space Grotesk, sans-serif' }}>
                          <Check size={10} />
                          Respondido
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* How it works */}
          <div style={{ padding: '14px 16px', borderRadius: 10, background: 'rgba(124,58,237,0.07)', border: '1px solid rgba(124,58,237,0.2)' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#a855f7', letterSpacing: '0.1em', fontFamily: 'Space Grotesk, sans-serif', marginBottom: 8 }}>
              COMO FUNCIONA
            </div>
            {[
              'Defina palavras-chave que ativam a resposta',
              'Escreva a mensagem automática personalizada',
              'O agente responde em até 30 segundos',
              'Acompanhe tudo no feed de atividade',
            ].map((step, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: i < 3 ? 7 : 0 }}>
                <div style={{
                  width: 16, height: 16, borderRadius: '50%', flexShrink: 0, marginTop: 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 9, fontWeight: 700, color: '#a855f7',
                  background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.25)',
                  fontFamily: 'Space Grotesk, sans-serif',
                }}>
                  {i + 1}
                </div>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, fontFamily: 'Space Grotesk, sans-serif' }}>
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
