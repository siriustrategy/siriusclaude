'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import dynamic from 'next/dynamic'
import {
  LayoutDashboard,
  TrendingUp,
  ImagePlus,
  FileText,
  Lightbulb,
  BarChart2,
  Send,
  Code2,
  Library,
  Settings,
  Menu,
  X,
  Zap,
  MessageCircle,
} from 'lucide-react'
import BrandSelector from '@/components/ui/brand-selector'
import CreditBadge from '@/components/ui/credit-badge'

const Starfield = dynamic(() => import('@/components/ui/starfield'), { ssr: false })

function SiriusMarketingLogo() {
  return (
    <svg width="36" height="36" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg" className="sirius-logo">
      <defs>
        <filter id="sg1" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="1.6" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="sg2" x="-120%" y="-120%" width="340%" height="340%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <line x1="19" y1="8"  x2="28" y2="17" stroke="rgba(93,130,255,0.3)" strokeWidth="0.7"/>
      <line x1="19" y1="8"  x2="10" y2="17" stroke="rgba(93,130,255,0.3)" strokeWidth="0.7"/>
      <line x1="28" y1="17" x2="24" y2="27" stroke="rgba(93,130,255,0.3)" strokeWidth="0.7"/>
      <line x1="10" y1="17" x2="14" y2="27" stroke="rgba(93,130,255,0.3)" strokeWidth="0.7"/>
      <line x1="14" y1="27" x2="24" y2="27" stroke="rgba(93,130,255,0.3)" strokeWidth="0.7"/>
      <line x1="19" y1="8"  x2="19" y2="3"  stroke="rgba(93,130,255,0.2)" strokeWidth="0.6"/>
      <line x1="28" y1="17" x2="34" y2="13" stroke="rgba(93,130,255,0.18)" strokeWidth="0.6"/>
      <circle cx="10" cy="17" r="1.3" fill="#7B9FFF" filter="url(#sg1)" />
      <circle cx="28" cy="17" r="1.3" fill="#7B9FFF" filter="url(#sg1)" />
      <circle cx="14" cy="27" r="1.1" fill="#5C7FFF" filter="url(#sg1)" />
      <circle cx="24" cy="27" r="1.1" fill="#5C7FFF" filter="url(#sg1)" />
      <circle cx="19" cy="3"  r="0.9" fill="#4A6AFF" />
      <circle cx="34" cy="13" r="0.7" fill="#4A6AFF" />
      <circle cx="19" cy="8" r="3.2" fill="#3B5BDB" filter="url(#sg2)" />
      <circle cx="19" cy="8" r="1.6" fill="#E8EEFF" />
    </svg>
  )
}

const navItems = [
  { href: '/dashboard',             label: 'Home',              icon: LayoutDashboard, color: '#3B5BDB' },
  { href: '/dashboard/viral',       label: 'Viral Intelligence', icon: TrendingUp,      color: '#06b6d4' },
  { href: '/dashboard/studio',      label: 'Creative Studio',   icon: ImagePlus,       color: '#7C3AED' },
  { href: '/dashboard/content',     label: 'Content Factory',   icon: FileText,        color: '#3B5BDB' },
  { href: '/dashboard/ideas',       label: 'Ideas Lab',         icon: Lightbulb,       color: '#f59e0b' },
  { href: '/dashboard/analytics',   label: 'Analytics',         icon: BarChart2,       color: '#10b981' },
  { href: '/dashboard/inbox',       label: 'Instagram Agent',   icon: MessageCircle,   color: '#a855f7' },
  { href: '/dashboard/distribution',label: 'Distribution',      icon: Send,            color: '#7C3AED' },
  { href: '/dashboard/lovable',     label: 'Lovable Architect', icon: Code2,           color: '#06b6d4' },
  { href: '/dashboard/library',     label: 'Library',           icon: Library,         color: '#3B5BDB' },
]

const bottomNavItems = [
  { href: '/dashboard',       icon: LayoutDashboard, label: 'Home',    color: '#3B5BDB', match: (p: string) => p === '/dashboard' },
  { href: '/dashboard/viral', icon: TrendingUp,      label: 'Viral',   color: '#06b6d4', match: (p: string) => p.startsWith('/dashboard/viral') },
  { href: '/dashboard/studio',icon: ImagePlus,       label: 'Studio',  color: '#7C3AED', match: (p: string) => p.startsWith('/dashboard/studio') },
  { href: '/dashboard/ideas', icon: Lightbulb,       label: 'Ideas',   color: '#f59e0b', match: (p: string) => p.startsWith('/dashboard/ideas') },
]

function SidebarContent({ pathname }: { pathname: string }) {
  return (
    <>
      {/* Logo */}
      <Link href="/dashboard" style={{ textDecoration: 'none', marginBottom: 28, display: 'block' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '4px 4px' }}>
          <SiriusMarketingLogo />
          <div>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 14, color: '#E8EEFF', letterSpacing: '0.04em', lineHeight: 1.1 }}>
              SIRIUS
            </div>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500, fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.14em' }}>
              MARKETING
            </div>
          </div>
        </div>
      </Link>

      {/* Section label */}
      <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.14em', textTransform: 'uppercase', padding: '0 4px', marginBottom: 6 }}>
        Menu
      </div>

      {/* Nav */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
          return (
            <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
              <div className={`nav-pill ${isActive ? 'active' : ''}`}>
                <div
                  className="nav-icon"
                  style={{
                    background: isActive ? `${item.color}18` : 'var(--muted-bg)',
                    border: `1px solid ${isActive ? item.color + '30' : 'var(--border)'}`,
                  }}
                >
                  <Icon size={15} color={isActive ? item.color : 'var(--text-secondary)'} strokeWidth={2} />
                </div>
                <span>{item.label}</span>
              </div>
            </Link>
          )
        })}
      </nav>

      <div style={{ height: 1, background: 'var(--border)', margin: '16px 0 12px' }} />

      <Link href="/dashboard/settings" style={{ textDecoration: 'none' }}>
        <div className={`nav-pill ${pathname === '/dashboard/settings' ? 'active' : ''}`}>
          <div
            className="nav-icon"
            style={{
              background: pathname === '/dashboard/settings' ? 'rgba(74,86,128,0.25)' : 'var(--muted-bg)',
              border: '1px solid var(--border)',
            }}
          >
            <Settings size={15} color="var(--text-secondary)" strokeWidth={2} />
          </div>
          <span>Settings</span>
        </div>
      </Link>

      {/* Credits info */}
      <div style={{ marginTop: 'auto', paddingTop: 16 }}>
        <div style={{
          background: 'rgba(59,91,219,0.07)',
          border: '1px solid rgba(59,91,219,0.14)',
          borderRadius: 10,
          padding: '12px 14px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <Zap size={13} color="#5B7BFF" />
            <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 12, fontWeight: 700, color: '#93c5fd' }}>
              87 créditos
            </span>
          </div>
          <div style={{ background: 'rgba(59,91,219,0.15)', borderRadius: 3, height: 3, overflow: 'hidden' }}>
            <div style={{ width: '17%', height: '100%', background: 'linear-gradient(90deg, #3B5BDB, #7C3AED)', borderRadius: 3 }} />
          </div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 5, fontFamily: 'Space Grotesk, sans-serif' }}>
            413/500 usados este mês
          </div>
        </div>
      </div>
    </>
  )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isMobile, setIsMobile] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    function check() { setIsMobile(window.innerWidth < 768) }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => { setSidebarOpen(false) }, [pathname])

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--background)' }}>
      <Starfield />

      {/* DESKTOP: sidebar fixa */}
      {!isMobile && (
        <aside style={{
          width: 228,
          background: 'rgba(8,12,24,0.92)',
          borderRight: '1px solid var(--sidebar-border)',
          display: 'flex',
          flexDirection: 'column',
          padding: '22px 12px',
          position: 'fixed',
          top: 0, bottom: 0, left: 0,
          zIndex: 50,
          overflowY: 'auto',
          backdropFilter: 'blur(12px)',
        }}>
          <SidebarContent pathname={pathname} />
        </aside>
      )}

      {/* MOBILE: top bar + drawer */}
      {isMobile && (
        <>
          {/* Top bar */}
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, zIndex: 80,
            height: 56,
            background: 'rgba(8,12,24,0.95)',
            borderBottom: '1px solid var(--sidebar-border)',
            backdropFilter: 'blur(12px)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 16px',
          }}>
            <Link href="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
              <SiriusMarketingLogo />
              <div>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 12, color: '#E8EEFF', letterSpacing: '0.04em' }}>SIRIUS</div>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500, fontSize: 8, color: 'var(--text-muted)', letterSpacing: '0.12em' }}>MARKETING</div>
              </div>
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <CreditBadge />
              <button
                onClick={() => setSidebarOpen(v => !v)}
                style={{
                  background: 'var(--muted-bg)',
                  border: '1px solid var(--border)',
                  borderRadius: 8, width: 36, height: 36,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: 'var(--text-secondary)',
                }}
              >
                {sidebarOpen ? <X size={17} /> : <Menu size={17} />}
              </button>
            </div>
          </div>

          {/* Overlay */}
          {sidebarOpen && (
            <div
              onClick={() => setSidebarOpen(false)}
              style={{
                position: 'fixed', inset: 0, zIndex: 90,
                background: 'rgba(4,6,15,0.7)',
                backdropFilter: 'blur(4px)',
              }}
            />
          )}

          {/* Drawer */}
          <div style={{
            position: 'fixed', top: 56, left: 0, bottom: 0, zIndex: 95,
            width: 240,
            background: 'rgba(8,12,24,0.98)',
            borderRight: '1px solid var(--sidebar-border)',
            backdropFilter: 'blur(16px)',
            display: 'flex', flexDirection: 'column',
            padding: '20px 12px 100px',
            overflowY: 'auto',
            transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
            transition: 'transform 0.25s cubic-bezier(0.32,0,0.15,1)',
          }}>
            <SidebarContent pathname={pathname} />
          </div>

          {/* Bottom nav mobile */}
          <nav style={{
            position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 80,
            height: 64,
            background: 'rgba(8,12,24,0.97)',
            borderTop: '1px solid var(--sidebar-border)',
            backdropFilter: 'blur(16px)',
            display: 'flex', alignItems: 'stretch',
          }}>
            {bottomNavItems.map((item) => {
              const active = item.match(pathname)
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    flex: 1,
                    textDecoration: 'none',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    gap: 4, position: 'relative',
                  }}
                >
                  {active && (
                    <div style={{
                      position: 'absolute', top: 0, left: '50%',
                      transform: 'translateX(-50%)',
                      width: 28, height: 2,
                      background: item.color,
                      borderRadius: '0 0 4px 4px',
                      boxShadow: `0 0 8px ${item.color}`,
                    }} />
                  )}
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: active ? `${item.color}18` : 'transparent',
                  }}>
                    <Icon size={20} color={active ? item.color : 'var(--text-muted)'} strokeWidth={active ? 2.2 : 1.8} />
                  </div>
                  <span style={{
                    fontSize: 10, fontWeight: active ? 700 : 500,
                    fontFamily: 'Space Grotesk, sans-serif',
                    color: active ? item.color : 'var(--text-muted)',
                  }}>
                    {item.label}
                  </span>
                </Link>
              )
            })}
          </nav>
        </>
      )}

      {/* Main */}
      <div style={{
        marginLeft: isMobile ? 0 : 228,
        flex: 1,
        minHeight: '100vh',
        paddingTop: isMobile ? 56 : 0,
        paddingBottom: isMobile ? 64 : 0,
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Header desktop */}
        {!isMobile && (
          <header style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 32px',
            height: 60,
            background: 'rgba(8,12,24,0.7)',
            borderBottom: '1px solid var(--sidebar-border)',
            backdropFilter: 'blur(12px)',
            position: 'sticky',
            top: 0,
            zIndex: 40,
          }}>
            <BrandSelector />
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <CreditBadge />
              <div style={{
                width: 34, height: 34,
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 700,
                cursor: 'pointer',
                background: 'linear-gradient(135deg, #3B5BDB, #7C3AED)',
                color: '#E8EEFF',
                fontFamily: 'Space Grotesk, sans-serif',
              }}>
                B
              </div>
            </div>
          </header>
        )}

        <main style={{ flex: 1, overflowY: 'auto', position: 'relative', zIndex: 1 }}>
          {children}
        </main>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
