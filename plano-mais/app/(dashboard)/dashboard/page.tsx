'use client'

import { motion } from 'framer-motion'
import { TrendingUp, DollarSign, Users, BarChart3, Construction } from 'lucide-react'

const kpiCards = [
  {
    titulo: 'Total Cobrado',
    valor: 'R$ 0,00',
    descricao: 'Este mes',
    icon: <DollarSign size={20} />,
    cor: '#7EB3FF',
    corBg: 'rgba(13,61,204,0.12)',
  },
  {
    titulo: 'Total Arrecadado',
    valor: 'R$ 0,00',
    descricao: 'Confirmado',
    icon: <TrendingUp size={20} />,
    cor: '#39D272',
    corBg: 'rgba(30,132,73,0.12)',
  },
  {
    titulo: 'Taxa de Conversao',
    valor: '0%',
    descricao: 'Leads pagos / total',
    icon: <BarChart3 size={20} />,
    cor: '#50F7E8',
    corBg: 'rgba(80,247,232,0.10)',
  },
  {
    titulo: 'Leads Ativos',
    valor: '0',
    descricao: 'Em acompanhamento',
    icon: <Users size={20} />,
    cor: '#A1E4ED',
    corBg: 'rgba(161,228,237,0.10)',
  },
]

export default function DashboardPage() {
  return (
    <div>
      {/* Titulo da secao */}
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
          Visao Geral
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Acompanhe os indicadores principais de cobranca
        </p>
      </motion.div>

      {/* Grid de KPIs */}
      <div
        className="grid gap-4 mb-8"
        style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}
      >
        {kpiCards.map((card, i) => (
          <motion.div
            key={card.titulo}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="kpi-card"
          >
            {/* Icone */}
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
              style={{
                background: card.corBg,
                color: card.cor,
                border: `1px solid ${card.cor}22`,
              }}
            >
              {card.icon}
            </div>

            {/* Valor */}
            <div
              style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 700,
                fontSize: '26px',
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
                marginBottom: '6px',
              }}
            >
              {card.valor}
            </div>

            {/* Titulo */}
            <div
              style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 600,
                fontSize: '13px',
                color: 'var(--text-secondary)',
                marginBottom: '3px',
              }}
            >
              {card.titulo}
            </div>

            {/* Descricao */}
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {card.descricao}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Banner de desenvolvimento */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="glass-card"
        style={{ padding: '32px', textAlign: 'center' }}
      >
        <div className="flex justify-center mb-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{
              background: 'rgba(80,247,232,0.10)',
              border: '1px solid rgba(80,247,232,0.20)',
              color: 'var(--teal)',
            }}
          >
            <Construction size={28} />
          </div>
        </div>

        <motion.div
          animate={{
            boxShadow: [
              '0 0 4px rgba(80,247,232,0.3)',
              '0 0 12px rgba(80,247,232,0.6)',
              '0 0 4px rgba(80,247,232,0.3)',
            ]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="inline-flex items-center gap-2 px-4 py-1 rounded-full mb-4"
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
          Em Desenvolvimento — Epic 07
        </motion.div>

        <h3
          style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 700,
            fontSize: '18px',
            color: 'var(--text-primary)',
            marginBottom: '8px',
          }}
        >
          Analytics em desenvolvimento
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '420px', margin: '0 auto' }}>
          Os graficos, relatorios e indicadores detalhados serao implementados no Epic 07.
          Por enquanto, os KPIs acima mostram os valores base.
        </p>
      </motion.div>
    </div>
  )
}
