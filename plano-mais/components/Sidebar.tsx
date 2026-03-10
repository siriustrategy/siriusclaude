'use client'

import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  MessageSquare,
  Users,
  Megaphone,
  BarChart3,
  DollarSign,
  Settings,
  LogOut,
  ChevronRight
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  somentGestor?: boolean
}

const navItems: NavItem[] = [
  {
    label: 'Chat ao Vivo',
    href: '/chat',
    icon: <MessageSquare size={17} />,
  },
  {
    label: 'CRM — Leads',
    href: '/crm',
    icon: <Users size={17} />,
  },
  {
    label: 'Campanhas',
    href: '/campanhas',
    icon: <Megaphone size={17} />,
    somentGestor: true,
  },
  {
    label: 'Analytics',
    href: '/analytics',
    icon: <BarChart3 size={17} />,
    somentGestor: true,
  },
  {
    label: 'Custos',
    href: '/custos',
    icon: <DollarSign size={17} />,
    somentGestor: true,
  },
  {
    label: 'Configuracoes',
    href: '/admin',
    icon: <Settings size={17} />,
    somentGestor: true,
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { perfil, signOut } = useAuth()

  const isGestor = perfil?.role === 'gestor'

  const itemsVisiveis = navItems.filter(item => !item.somentGestor || isGestor)

  const iniciais = perfil?.nome
    ? perfil.nome.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : '??'

  async function handleLogout() {
    await signOut()
    router.push('/login')
  }

  return (
    <aside
      className="fixed left-0 top-0 h-full flex flex-col z-40"
      style={{
        width: '240px',
        background: 'var(--sidebar-bg)',
        borderRight: '1px solid var(--sidebar-border)',
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-5 py-5"
        style={{ borderBottom: '1px solid var(--sidebar-border)' }}
      >
        {/* Ícone P+ */}
        <motion.div
          animate={{
            boxShadow: [
              '0 0 6px rgba(80,247,232,0.3)',
              '0 0 14px rgba(80,247,232,0.55)',
              '0 0 6px rgba(80,247,232,0.3)',
            ]
          }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, #0D3DCC 0%, #002073 100%)',
            border: '1px solid rgba(80,247,232,0.25)',
          }}
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <text
              x="50%"
              y="50%"
              dominantBaseline="central"
              textAnchor="middle"
              fontFamily="Space Grotesk, sans-serif"
              fontWeight="700"
              fontSize="13"
              fill="#50F7E8"
            >P+</text>
          </svg>
        </motion.div>

        <div>
          <div style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 700,
            fontSize: '15px',
            color: 'var(--text-primary)',
            lineHeight: 1.2
          }}>
            Plano Mais
          </div>
          <div style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '10px',
            color: 'var(--teal)',
            fontWeight: 500,
            letterSpacing: '0.06em',
            textTransform: 'uppercase'
          }}>
            Sistema de Cobranca
          </div>
        </div>
      </div>

      {/* Navegacao */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-1">
        {itemsVisiveis.map((item, i) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

          return (
            <motion.a
              key={item.href}
              href={item.href}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault()
                router.push(item.href)
              }}
            >
              <span
                className="nav-icon"
                style={{
                  background: isActive ? 'rgba(80,247,232,0.12)' : 'rgba(13,61,204,0.08)',
                  color: isActive ? 'var(--teal)' : 'var(--text-muted)',
                }}
              >
                {item.icon}
              </span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {isActive && (
                <ChevronRight size={13} style={{ color: 'var(--teal)', opacity: 0.6 }} />
              )}
            </motion.a>
          )
        })}
      </nav>

      {/* Rodape — usuario + logout */}
      <div
        className="px-3 py-4"
        style={{ borderTop: '1px solid var(--sidebar-border)' }}
      >
        {/* Info do usuario */}
        <div className="flex items-center gap-3 px-2 py-2 mb-2 rounded-lg" style={{ background: 'rgba(13,61,204,0.06)' }}>
          {/* Avatar com iniciais */}
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-hover) 100%)',
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 700,
              fontSize: '12px',
              color: '#E8F4FF',
            }}
          >
            {iniciais}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 600,
              fontSize: '13px',
              color: 'var(--text-primary)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {perfil?.nome ?? 'Carregando...'}
            </div>
            <div style={{
              fontSize: '11px',
              color: 'var(--text-muted)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {perfil?.role === 'gestor' ? 'Gestor' : perfil?.role === 'atendente_senior' ? 'At. Senior' : 'At. Junior'}
            </div>
          </div>
        </div>

        {/* Botao de logout */}
        <button
          onClick={handleLogout}
          className="nav-item w-full"
          style={{ color: 'var(--text-muted)' }}
        >
          <span
            className="nav-icon"
            style={{
              background: 'rgba(232,27,143,0.08)',
              color: 'var(--magenta)',
            }}
          >
            <LogOut size={15} />
          </span>
          <span>Sair do Sistema</span>
        </button>
      </div>
    </aside>
  )
}
