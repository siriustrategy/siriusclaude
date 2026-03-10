'use client'

import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Bell } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useState } from 'react'

// Mapa de títulos por rota
const TITULOS: Record<string, string> = {
  '/dashboard':  'Dashboard',
  '/chat':       'Chat ao Vivo',
  '/crm':        'CRM — Leads',
  '/campanhas':  'Campanhas',
  '/analytics':  'Analytics',
  '/custos':     'Custos',
  '/admin':      'Configuracoes',
}

// Simulacao de notificacoes nao lidas (substituir com dados reais no Epic 06)
const NOTIFICACOES_NAO_LIDAS = 3

export default function Header() {
  const pathname = usePathname()
  const { perfil } = useAuth()
  const [showNotif, setShowNotif] = useState(false)

  // Determinar titulo da pagina atual
  const titulo = Object.entries(TITULOS).find(([key]) =>
    pathname === key || pathname.startsWith(key + '/')
  )?.[1] ?? 'Plano Mais'

  const iniciais = perfil?.nome
    ? perfil.nome.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : '??'

  const labelRole = {
    gestor: { texto: 'Gestor', cor: '#7EB3FF', bg: 'rgba(13,61,204,0.12)', border: 'rgba(13,61,204,0.28)' },
    atendente_senior: { texto: 'At. Senior', cor: '#39D272', bg: 'rgba(30,132,73,0.12)', border: 'rgba(30,132,73,0.28)' },
    atendente_junior: { texto: 'At. Junior', cor: '#8AAFCF', bg: 'rgba(13,61,204,0.08)', border: 'rgba(13,61,204,0.18)' },
  }

  const roleInfo = perfil?.role ? labelRole[perfil.role] : labelRole.atendente_junior

  return (
    <header
      className="fixed top-0 right-0 z-30 flex items-center justify-between px-6"
      style={{
        left: '240px',
        height: '64px',
        background: 'rgba(0,17,64,0.92)',
        borderBottom: '1px solid var(--sidebar-border)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Esquerda — titulo da pagina */}
      <div>
        <motion.h1
          key={titulo}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25 }}
          style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 700,
            fontSize: '18px',
            color: 'var(--text-primary)',
            letterSpacing: '-0.01em',
          }}
        >
          {titulo}
        </motion.h1>
      </div>

      {/* Direita — notificacoes + role + avatar */}
      <div className="flex items-center gap-3">

        {/* Badge de Role */}
        <div
          style={{
            background: roleInfo.bg,
            border: `1px solid ${roleInfo.border}`,
            color: roleInfo.cor,
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 700,
            fontSize: '11px',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            padding: '3px 10px',
            borderRadius: '20px',
          }}
        >
          {roleInfo.texto}
        </div>

        {/* Sino de notificacoes */}
        <div className="relative">
          <motion.button
            onClick={() => setShowNotif(!showNotif)}
            whileTap={{ scale: 0.9 }}
            className="relative flex items-center justify-center rounded-lg"
            style={{
              width: '36px',
              height: '36px',
              background: 'rgba(13,61,204,0.08)',
              border: '1px solid var(--border)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
            }}
          >
            <Bell size={16} />
            {NOTIFICACOES_NAO_LIDAS > 0 && (
              <motion.span
                animate={{
                  boxShadow: [
                    '0 0 4px rgba(232,27,143,0.6)',
                    '0 0 10px rgba(232,27,143,0.9)',
                    '0 0 4px rgba(232,27,143,0.6)',
                  ]
                }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
                style={{
                  background: 'var(--magenta)',
                  fontSize: '9px',
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: 700,
                  color: '#fff',
                }}
              >
                {NOTIFICACOES_NAO_LIDAS}
              </motion.span>
            )}
          </motion.button>
        </div>

        {/* Avatar com iniciais */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer"
          style={{
            background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-hover) 100%)',
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 700,
            fontSize: '13px',
            color: '#E8F4FF',
            border: '2px solid rgba(80,247,232,0.25)',
          }}
          title={perfil?.nome}
        >
          {iniciais}
        </motion.div>
      </div>
    </header>
  )
}
