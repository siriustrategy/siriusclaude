'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import {
  MessageSquare, Users, Megaphone, BarChart3,
  DollarSign, Settings, LogOut, TrendingUp, Shield,
} from 'lucide-react'

function PlusLogo() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <rect width="36" height="36" rx="10" fill="#0D3DCC" />
      <text
        x="50%" y="52%"
        dominantBaseline="central"
        textAnchor="middle"
        fontFamily="Space Grotesk, sans-serif"
        fontWeight="800"
        fontSize="15"
        fill="#50F7E8"
        style={{ userSelect: 'none' as const }}
      >P+</text>
    </svg>
  )
}

function InitialsAvatar({ nome, size = 36 }: { nome: string; size?: number }) {
  const initials = nome.split(' ').map((p: string) => p[0]).slice(0, 2).join('').toUpperCase()
  return (
    <div
      className="avatar-initials"
      style={{
        width: size, height: size,
        background: 'linear-gradient(135deg, #0D3DCC 0%, #0BBFAA 100%)',
        fontSize: size * 0.36,
      }}
    >
      {initials}
    </div>
  )
}

const MENU_ITEMS = [
  { href: '/dashboard', icon: TrendingUp,    label: 'Dashboard',   color: '#0D3DCC' },
  { href: '/chat',      icon: MessageSquare, label: 'Chat ao Vivo', color: '#0BBFAA' },
  { href: '/crm',       icon: Users,         label: 'CRM — Leads', color: '#3B65FF' },
]

const GESTOR_ITEMS = [
  { href: '/campanhas', icon: Megaphone,  label: 'Campanhas',  color: '#7C3AED' },
  { href: '/analytics', icon: BarChart3,  label: 'Analytics',  color: '#D97706' },
  { href: '/custos',    icon: DollarSign, label: 'Custos',     color: '#1E8449' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { perfil: usuario, signOut } = useAuth()

  const isGestor = usuario?.role === 'gestor'

  async function handleLogout() {
    await signOut()
    router.push('/login')
  }

  function NavItem({ href, icon: Icon, label, color }: { href: string; icon: React.ElementType; label: string; color: string }) {
    const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
    return (
      <Link href={href} style={{ textDecoration: 'none' }}>
        <div className={`nav-pill ${active ? 'active' : ''}`}>
          <div
            className="nav-icon"
            style={{
              background: active ? `${color}15` : 'var(--muted-bg)',
              border: `1px solid ${active ? color + '28' : 'var(--border)'}`,
            }}
          >
            <Icon size={14} color={active ? color : 'var(--text-muted)'} strokeWidth={2} />
          </div>
          <span>{label}</span>
        </div>
      </Link>
    )
  }

  return (
    <aside style={{
      width: 220,
      background: 'var(--sidebar-bg)',
      borderRight: '1px solid var(--sidebar-border)',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px 12px 16px',
      position: 'fixed',
      top: 0, bottom: 0, left: 0,
      zIndex: 50,
      overflowY: 'auto',
      boxShadow: '2px 0 12px rgba(13,61,204,0.06)',
    }}>

      {/* Logo */}
      <Link href="/dashboard" style={{ textDecoration: 'none', marginBottom: 24, display: 'block' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '2px 4px' }}>
          <PlusLogo />
          <div>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 14, color: 'var(--text-primary)', letterSpacing: '0.04em', lineHeight: 1.1 }}>
              PLANO MAIS
            </div>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500, fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.12em' }}>
              COBRANCA
            </div>
          </div>
        </div>
      </Link>

      {/* Card do usuario */}
      {usuario && (
        <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 14px', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <InitialsAvatar nome={usuario.nome} size={34} />
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {usuario.nome.split(' ')[0]}
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: isGestor ? '#0D3DCC' : '#0BBFAA', marginTop: 1 }}>
                {isGestor ? 'Gestor' : 'Atendente'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MENU */}
      <div className="section-label" style={{ marginBottom: 6 }}>Menu</div>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 14 }}>
        {MENU_ITEMS.map(item => <NavItem key={item.href} {...item} />)}
      </nav>

      {/* OPERACIONAL — apenas gestor */}
      {isGestor && (
        <>
          <div className="divider" />
          <div className="section-label" style={{ margin: '8px 0 6px' }}>
            <BarChart3 size={9} color="var(--text-muted)" strokeWidth={2} />
            Operacional
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 14 }}>
            {GESTOR_ITEMS.map(item => <NavItem key={item.href} {...item} />)}
          </nav>
        </>
      )}

      {/* SISTEMA */}
      <div className="divider" />
      <div className="section-label" style={{ margin: '8px 0 6px' }}>
        <Shield size={9} color="var(--text-muted)" strokeWidth={2} />
        Sistema
      </div>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {isGestor && (
          <Link href="/admin" style={{ textDecoration: 'none' }}>
            <div className={`nav-pill ${pathname === '/admin' ? 'active' : ''}`}>
              <div className="nav-icon" style={{ background: pathname === '/admin' ? 'rgba(122,144,184,0.12)' : 'var(--muted-bg)', border: '1px solid var(--border)' }}>
                <Settings size={14} color={pathname === '/admin' ? '#7A90B8' : 'var(--text-muted)'} strokeWidth={2} />
              </div>
              <span>Configuracoes</span>
            </div>
          </Link>
        )}
        <button onClick={handleLogout} className="nav-pill" style={{ border: 'none' }}>
          <div className="nav-icon" style={{ background: 'var(--muted-bg)', border: '1px solid var(--border)' }}>
            <LogOut size={14} color="var(--text-muted)" strokeWidth={2} />
          </div>
          <span>Sair</span>
        </button>
      </nav>

      {/* Rodape */}
      <div style={{ marginTop: 'auto', paddingTop: 16 }}>
        <div className="divider" />
        <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif', padding: '8px 6px 0' }}>
          Projeto Inadimplencia v1.0
        </div>
      </div>
    </aside>
  )
}
