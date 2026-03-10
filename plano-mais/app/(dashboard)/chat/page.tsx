'use client'

import { motion } from 'framer-motion'
import { MessageSquare, Zap, Users, Bot } from 'lucide-react'

const features = [
  {
    icon: <Bot size={18} />,
    titulo: 'IA de Cobranca',
    descricao: 'Agente autonomo que inicia conversas, negocia e encerra pendencias sem intervencao humana',
  },
  {
    icon: <Users size={18} />,
    titulo: 'Atendimento Humano',
    descricao: 'Transferencia inteligente para atendentes quando necessario, com contexto completo do lead',
  },
  {
    icon: <Zap size={18} />,
    titulo: 'Multi-canal',
    descricao: 'WhatsApp, SMS e email integrados em uma unica interface unificada',
  },
]

export default function ChatPage() {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <h2
          style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 700,
            fontSize: '22px',
            color: 'var(--text-primary)',
            marginBottom: '6px'
          }}
        >
          Chat ao Vivo
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Central de atendimento e cobranca multicanal
        </p>
      </motion.div>

      {/* Banner principal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="glass-card"
        style={{ padding: '40px', textAlign: 'center', marginBottom: '24px' }}
      >
        <div className="flex justify-center mb-5">
          <motion.div
            animate={{
              boxShadow: [
                '0 0 8px rgba(13,61,204,0.3)',
                '0 0 20px rgba(80,247,232,0.4)',
                '0 0 8px rgba(13,61,204,0.3)',
              ]
            }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, rgba(13,61,204,0.3) 0%, rgba(80,247,232,0.15) 100%)',
              border: '1px solid rgba(80,247,232,0.25)',
              color: 'var(--teal)',
            }}
          >
            <MessageSquare size={30} />
          </motion.div>
        </div>

        <motion.div
          animate={{
            boxShadow: [
              '0 0 4px rgba(80,247,232,0.3)',
              '0 0 12px rgba(80,247,232,0.5)',
              '0 0 4px rgba(80,247,232,0.3)',
            ]
          }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="inline-flex items-center gap-2 px-4 py-1 rounded-full mb-5"
          style={{
            background: 'rgba(80,247,232,0.08)',
            border: '1px solid rgba(80,247,232,0.25)',
            color: 'var(--teal)',
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 700,
            fontSize: '11px',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          Em Desenvolvimento — Epic 05
        </motion.div>

        <h3
          style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 700,
            fontSize: '20px',
            color: 'var(--text-primary)',
            marginBottom: '10px',
          }}
        >
          Modulo de Chat sendo construido
        </h3>
        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: '14px',
            maxWidth: '460px',
            margin: '0 auto',
            lineHeight: 1.7,
          }}
        >
          O modulo de chat ao vivo com agente de IA, atendimento humano e integracao
          WhatsApp sera implementado no Epic 05.
        </p>
      </motion.div>

      {/* Cards de features previstas */}
      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {features.map((feat, i) => (
          <motion.div
            key={feat.titulo}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
            className="glass-card"
            style={{ padding: '24px' }}
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
              style={{
                background: 'rgba(80,247,232,0.08)',
                color: 'var(--teal)',
                border: '1px solid rgba(80,247,232,0.18)',
              }}
            >
              {feat.icon}
            </div>
            <h4
              style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 600,
                fontSize: '14px',
                color: 'var(--text-primary)',
                marginBottom: '6px',
              }}
            >
              {feat.titulo}
            </h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.6 }}>
              {feat.descricao}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
