'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, FolderOpen, BookOpen, Lightbulb, Brain } from 'lucide-react'

const BOTTOM_ITEMS = [
  { href: '/dashboard',    icon: LayoutDashboard, label: 'Home' },
  { href: '/projetos',     icon: FolderOpen,      label: 'Projetos' },
  { href: '/estudos',      icon: BookOpen,        label: 'Estudos' },
  { href: '/ideias',       icon: Lightbulb,       label: 'Ideias' },
  { href: '/second-brain', icon: Brain,           label: 'Brain' },
]

export default function BottomNav() {
  const pathname = usePathname()
  return (
    <nav className="hub-bottom-nav">
      {BOTTOM_ITEMS.map(item => {
        const Icon = item.icon
        const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 3, padding: '6px 12px',
              color: isActive ? '#93c5fd' : 'var(--text-muted)',
              textDecoration: 'none',
              transition: 'color 0.15s',
              flex: 1,
            }}
          >
            <Icon size={20} />
            <span style={{ fontSize: 10, fontFamily: 'Space Grotesk, sans-serif', fontWeight: isActive ? 600 : 400 }}>
              {item.label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
