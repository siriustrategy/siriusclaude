'use client'

import { usePathname } from 'next/navigation'
import { Bell } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useSidebar } from '@/contexts/SidebarContext'

const PAGE_TITLES: Record<string, string> = {
  '/dashboard':  'Dashboard',
  '/chat':       'Chat ao Vivo',
  '/crm':        'CRM — Leads',
  '/campanhas':  'Campanhas',
  '/analytics':  'Analytics',
  '/custos':     'Custos',
  '/admin':      'Configuracoes',
}

export default function Header() {
  const pathname = usePathname()
  const { perfil: usuario } = useAuth()
  const { sidebarWidth } = useSidebar()

  const title = Object.entries(PAGE_TITLES).find(([key]) => pathname === key || pathname.startsWith(key + '/'))?.[1] || 'Plano Mais'
  const isGestor = usuario?.role === 'gestor'
  const initials = usuario?.nome.split(' ').map((p: string) => p[0]).slice(0, 2).join('').toUpperCase() || 'U'

  return (
    <header style={{
      position: 'fixed',
      top: 0, left: sidebarWidth, right: 0,
      height: 60,
      background: 'var(--sidebar-bg)',
      borderBottom: '1px solid var(--sidebar-border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 28px',
      zIndex: 40,
      boxShadow: '0 1px 4px rgba(13,61,204,0.06)',
      transition: 'left 0.2s cubic-bezier(0.22,1,0.36,1)',
    }}>
      <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 16, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
        {title}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span className={`badge ${isGestor ? 'badge-blue' : 'badge-teal'}`}>
          {isGestor ? 'Gestor' : 'Atendente'}
        </span>
        <button style={{ position: 'relative', background: 'var(--muted-bg)', border: '1px solid var(--border)', borderRadius: 8, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)' }}>
          <Bell size={16} strokeWidth={2} />
          <span className="magenta-glow-pulse" style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, background: 'var(--magenta)', borderRadius: '50%', border: '1.5px solid var(--sidebar-bg)' }} />
        </button>
        <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg, #0D3DCC 0%, #0BBFAA 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 12, color: '#FFF', cursor: 'pointer', flexShrink: 0 }}>
          {initials}
        </div>
      </div>
    </header>
  )
}
