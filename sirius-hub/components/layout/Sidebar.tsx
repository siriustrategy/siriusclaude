'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import {
  LayoutDashboard, FolderOpen, BookOpen, Award,
  CalendarDays, TrendingUp, Lightbulb, Brain,
  Plug2, Star, LogOut, ChevronRight, Bot,
} from 'lucide-react'

const NAV_ITEMS = [
  { href: '/dashboard',    icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/projetos',     icon: FolderOpen,      label: 'Projetos' },
  { href: '/estudos',      icon: BookOpen,        label: 'Estudos' },
  { href: '/certificados', icon: Award,           label: 'Certificados' },
  { href: '/reunioes',     icon: CalendarDays,    label: 'Reuniões' },
  { href: '/performance',  icon: TrendingUp,      label: 'Performance' },
  { href: '/ideias',       icon: Lightbulb,       label: 'Ideias' },
  { href: '/second-brain', icon: Brain,           label: 'Second Brain' },
  { href: '/integracoes',  icon: Plug2,           label: 'Integrações' },
  { href: '/agentes',      icon: Bot,             label: 'Agentes AIOS' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside className="hub-sidebar">
      {/* Logo */}
      <div style={{ padding: '24px 16px 16px', borderBottom: '1px solid var(--sidebar-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34,
            background: 'rgba(59,91,219,0.15)',
            border: '1px solid rgba(59,91,219,0.3)',
            borderRadius: 9,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Star size={16} color="#5B7BFF" fill="#5B7BFF" />
          </div>
          <div>
            <div style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 700, fontSize: 14,
              color: 'var(--text-primary)',
              lineHeight: 1.2,
            }}>
              Sirius Hub
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Segundo Cérebro</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV_ITEMS.map(item => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-pill ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon" style={{
                background: isActive ? 'rgba(59,91,219,0.2)' : 'transparent',
              }}>
                <Icon size={15} />
              </span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {isActive && <ChevronRight size={13} style={{ opacity: 0.5 }} />}
            </Link>
          )
        })}
      </nav>

      {/* User footer */}
      <div style={{ padding: '12px 8px', borderTop: '1px solid var(--sidebar-border)' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '8px 10px', marginBottom: 4,
        }}>
          <div style={{
            width: 30, height: 30,
            background: 'linear-gradient(135deg, #3B5BDB, #7C3AED)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 700, fontSize: 12, color: '#fff',
          }}>
            B
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif', lineHeight: 1.2 }}>
              Breno Nobre
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              Sirius Strategy
            </div>
          </div>
        </div>
        <button onClick={handleLogout} className="nav-pill" style={{ justifyContent: 'flex-start' }}>
          <span className="nav-icon"><LogOut size={14} /></span>
          <span>Sair</span>
        </button>
      </div>
    </aside>
  )
}
