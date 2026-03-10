'use client'

import { motion } from 'framer-motion'
import { Users, Search, Filter, Phone, Mail, TrendingDown, AlertTriangle } from 'lucide-react'

const statsPlaceholder = [
  { label: 'Total de Leads', valor: '0', cor: '#7EB3FF' },
  { label: 'Inadimplentes', valor: '0', cor: '#E81B8F' },
  { label: 'Em Negociacao', valor: '0', cor: '#50F7E8' },
  { label: 'Pagos Este Mes', valor: '0', cor: '#39D272' },
]

const colunasFaseCobranca = [
  { id: 'pre', label: 'Pre-vencimento', cor: '#7EB3FF', count: 0 },
  { id: 'mes1', label: '1 mes em atraso', cor: '#FFCC4D', count: 0 },
  { id: 'mes2', label: '2 meses', cor: '#F39C12', count: 0 },
  { id: 'mes3', label: '3 meses', cor: '#E81B8F', count: 0 },
]

export default function CRMPage() {
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
            marginBottom: '6px',
          }}
        >
          CRM — Leads
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Gestao completa de clientes inadimplentes
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {statsPlaceholder.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.4 }}
            className="kpi-card"
            style={{ textAlign: 'center' }}
          >
            <div
              style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 700,
                fontSize: '28px',
                color: stat.cor,
                marginBottom: '4px',
              }}
            >
              {stat.valor}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Barra de busca e filtros */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="flex items-center gap-3 mb-6"
      >
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--text-muted)' }}
          />
          <input
            type="text"
            className="input-field"
            placeholder="Buscar por nome, telefone, CPF..."
            style={{ paddingLeft: '40px' }}
            disabled
          />
        </div>
        <button
          className="btn-ghost"
          disabled
          style={{ flexShrink: 0 }}
        >
          <Filter size={15} />
          Filtros
        </button>
      </motion.div>

      {/* Kanban por fase de cobranca */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.4 }}
        className="mb-6"
      >
        <div style={{ marginBottom: '16px' }}>
          <span
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 600,
              fontSize: '13px',
              color: 'var(--text-secondary)',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            Pipeline de Cobranca
          </span>
        </div>

        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {colunasFaseCobranca.map((col, i) => (
            <motion.div
              key={col.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.07, duration: 0.4 }}
              className="glass-card"
              style={{ padding: '16px', minHeight: '220px' }}
            >
              {/* Header da coluna */}
              <div className="flex items-center justify-between mb-4">
                <span
                  style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontWeight: 600,
                    fontSize: '12px',
                    color: col.cor,
                  }}
                >
                  {col.label}
                </span>
                <span
                  className="px-2 py-0.5 rounded-full"
                  style={{
                    background: `${col.cor}18`,
                    color: col.cor,
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontWeight: 700,
                    fontSize: '11px',
                  }}
                >
                  {col.count}
                </span>
              </div>

              {/* Estado vazio */}
              <div
                className="flex flex-col items-center justify-center h-32"
                style={{ color: 'var(--text-muted)', textAlign: 'center' }}
              >
                <Users size={22} style={{ marginBottom: '8px', opacity: 0.4 }} />
                <span style={{ fontSize: '12px' }}>Nenhum lead</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Banner de desenvolvimento */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="glass-card"
        style={{ padding: '28px', display: 'flex', alignItems: 'center', gap: '20px' }}
      >
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: 'rgba(80,247,232,0.10)',
            border: '1px solid rgba(80,247,232,0.20)',
            color: 'var(--teal)',
          }}
        >
          <AlertTriangle size={22} />
        </div>
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h4
              style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 700,
                fontSize: '15px',
                color: 'var(--text-primary)',
              }}
            >
              CRM em construcao
            </h4>
            <motion.span
              animate={{
                boxShadow: [
                  '0 0 4px rgba(80,247,232,0.3)',
                  '0 0 10px rgba(80,247,232,0.5)',
                  '0 0 4px rgba(80,247,232,0.3)',
                ]
              }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              className="px-3 py-0.5 rounded-full"
              style={{
                background: 'rgba(80,247,232,0.08)',
                border: '1px solid rgba(80,247,232,0.25)',
                color: 'var(--teal)',
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 700,
                fontSize: '10px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              Epic 03
            </motion.span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
            A lista completa de leads, perfis detalhados, historico de interacoes,
            notas e gestao de descontos serao implementados no Epic 03.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
