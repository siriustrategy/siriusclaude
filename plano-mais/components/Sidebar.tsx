'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useSidebar } from '@/contexts/SidebarContext'
import { createClient } from '@/lib/supabase/client'
import {
  MessageSquare, Users, Megaphone, BarChart3,
  DollarSign, Settings, LogOut, TrendingUp, Shield,
  ChevronLeft, ChevronRight, X,
  User, Star, Zap, Target, Award, Flame, Globe,
  Headphones, Camera, Briefcase, Book, Code, Palette,
  Coffee, TreePine, Cat, Music, Heart,
} from 'lucide-react'

// ===================== ÍCONES DISPONÍVEIS PARA AVATAR =====================
const ICONES_AVATAR = [
  { id: 'user', Icon: User },
  { id: 'star', Icon: Star },
  { id: 'zap', Icon: Zap },
  { id: 'target', Icon: Target },
  { id: 'award', Icon: Award },
  { id: 'flame', Icon: Flame },
  { id: 'globe', Icon: Globe },
  { id: 'headphones', Icon: Headphones },
  { id: 'camera', Icon: Camera },
  { id: 'briefcase', Icon: Briefcase },
  { id: 'book', Icon: Book },
  { id: 'code', Icon: Code },
  { id: 'palette', Icon: Palette },
  { id: 'coffee', Icon: Coffee },
  { id: 'tree', Icon: TreePine },
  { id: 'cat', Icon: Cat },
  { id: 'music', Icon: Music },
  { id: 'heart', Icon: Heart },
]

function PlusLogo({ small }: { small?: boolean }) {
  if (small) {
    return (
      <div style={{
        width: 32, height: 32, borderRadius: 9, background: '#fff',
        border: '1px solid rgba(13,61,204,0.15)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden', flexShrink: 0,
      }}>
        <img src="/logo-mais-assistencial.png" alt="Mais Assistencial" style={{ width: 28, height: 'auto', objectFit: 'contain' }} />
      </div>
    )
  }
  return (
    <img src="/logo-mais-assistencial.png" alt="Mais Assistencial" style={{ height: 32, width: 'auto', objectFit: 'contain' }} />
  )
}

// ===================== MODAL DE SELEÇÃO DE ÍCONE =====================
function IconSelectorModal({ onClose, onSelect, selected }: {
  onClose: () => void
  onSelect: (id: string) => void
  selected: string
}) {
  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.25)', zIndex: 200 }} />
      <div style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        background: 'var(--card-bg)', border: '1px solid var(--card-border)',
        borderRadius: 14, padding: '20px 24px', zIndex: 201,
        boxShadow: '0 20px 60px rgba(13,61,204,0.15)', width: 320,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>
            Escolher Ícone
          </span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <X size={16} color="var(--text-muted)" />
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8 }}>
          {ICONES_AVATAR.map(({ id, Icon }) => (
            <button
              key={id}
              onClick={() => { onSelect(id); onClose() }}
              style={{
                width: '100%', aspectRatio: '1',
                borderRadius: 10,
                border: selected === id ? '2px solid var(--accent)' : '1px solid var(--border)',
                background: selected === id ? 'rgba(13,61,204,0.10)' : 'var(--surface-2)',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.1s',
              }}
            >
              <Icon size={18} color={selected === id ? 'var(--accent)' : 'var(--text-secondary)'} strokeWidth={1.8} />
            </button>
          ))}
        </div>
        <div style={{ marginTop: 12, fontSize: 11, color: 'var(--text-muted)', textAlign: 'center' }}>
          Clique no ícone para selecionar
        </div>
      </div>
    </>
  )
}

// ===================== MENU ITEMS =====================
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
  const { collapsed, toggleCollapsed } = useSidebar()

  const supabase = createClient()
  const [online, setOnline] = useState(false)
  const [iconeSelecionado, setIconeSelecionado] = useState('user')
  const [showIconSelector, setShowIconSelector] = useState(false)

  const isGestor = usuario?.role === 'gestor'
  const IconeAvatarAtual = ICONES_AVATAR.find(i => i.id === iconeSelecionado)?.Icon || User

  // Carregar status online do banco ao montar
  useEffect(() => {
    async function loadStatus() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase
        .from('usuarios')
        .select('status_online')
        .eq('id', user.id)
        .single()
      if (data) setOnline(data.status_online === 'online')
    }
    loadStatus()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function toggleOnline() {
    const novoStatus = online ? 'offline' : 'online'
    // Atualiza UI imediatamente (otimista)
    setOnline(!online)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { error } = await supabase
      .from('usuarios')
      .update({
        status_online: novoStatus,
        ultimo_online: novoStatus === 'offline' ? new Date().toISOString() : null,
      })
      .eq('id', user.id)
    // Se falhou, reverte o estado da UI
    if (error) {
      console.error('Erro ao atualizar status online:', error)
      setOnline(online)
    }
  }

  async function handleLogout() {
    await signOut()
    router.push('/login')
  }

  function NavItem({ href, icon: Icon, label, color }: { href: string; icon: React.ElementType; label: string; color: string }) {
    const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
    return (
      <Link href={href} style={{ textDecoration: 'none' }} title={collapsed ? label : undefined}>
        <div className={`nav-pill ${active ? 'active' : ''}`} style={{ padding: collapsed ? '7px 0' : '7px 10px', justifyContent: collapsed ? 'center' : 'flex-start' }}>
          <div
            className="nav-icon"
            style={{
              background: active ? `${color}15` : 'var(--muted-bg)',
              border: `1px solid ${active ? color + '28' : 'var(--border)'}`,
              flexShrink: 0,
            }}
          >
            <Icon size={14} color={active ? color : 'var(--text-muted)'} strokeWidth={2} />
          </div>
          {!collapsed && <span>{label}</span>}
        </div>
      </Link>
    )
  }

  return (
    <>
      <aside style={{
        width: collapsed ? 60 : 220,
        background: 'var(--sidebar-bg)',
        borderRight: '1px solid var(--sidebar-border)',
        display: 'flex',
        flexDirection: 'column',
        padding: collapsed ? '16px 8px' : '16px 12px 16px',
        position: 'fixed',
        top: 0, bottom: 0, left: 0,
        zIndex: 50,
        overflowY: 'auto',
        overflowX: 'hidden',
        boxShadow: '2px 0 12px rgba(13,61,204,0.06)',
        transition: 'width 0.2s cubic-bezier(0.22,1,0.36,1)',
      }}>

        {/* Logo + toggle */}
        {collapsed ? (
          // Modo recolhido: logo em cima, botão toggle abaixo
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginBottom: 18 }}>
            <Link href="/dashboard" style={{ textDecoration: 'none' }}>
              <PlusLogo small />
            </Link>
            <button
              onClick={toggleCollapsed}
              style={{
                background: 'var(--surface-2)', border: '1px solid var(--border)',
                borderRadius: 7, width: 32, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', flexShrink: 0, transition: 'all 0.15s',
              }}
              title="Expandir menu"
            >
              <ChevronRight size={13} color="var(--text-muted)" />
            </button>
          </div>
        ) : (
          // Modo expandido: logo centralizada, botão toggle no canto
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
            <Link href="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              <PlusLogo />
            </Link>
            <button
              onClick={toggleCollapsed}
              style={{
                position: 'absolute', right: 0,
                background: 'var(--surface-2)', border: '1px solid var(--border)',
                borderRadius: 7, width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', flexShrink: 0, transition: 'all 0.15s',
              }}
              title="Recolher menu"
            >
              <ChevronLeft size={13} color="var(--text-muted)" />
            </button>
          </div>
        )}

        {/* Card do usuário */}
        {usuario && (
          <div style={{
            background: 'var(--surface-2)', border: '1px solid var(--border)',
            borderRadius: 10, padding: collapsed ? '10px 4px' : '12px 12px',
            marginBottom: 18,
          }}>
            {collapsed ? (
              // Modo recolhido: só avatar + dot de status
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{ position: 'relative' }}>
                  <div
                    onClick={() => setShowIconSelector(true)}
                    style={{
                      width: 34, height: 34, borderRadius: 9, cursor: 'pointer',
                      background: 'linear-gradient(135deg, #0D3DCC 0%, #0BBFAA 100%)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <IconeAvatarAtual size={17} color="#fff" strokeWidth={1.8} />
                  </div>
                  <div style={{
                    position: 'absolute', bottom: -2, right: -2,
                    width: 10, height: 10, borderRadius: '50%',
                    background: online ? '#1E8449' : '#DC2626',
                    border: '2px solid var(--sidebar-bg)',
                  }} />
                </div>
                <button
                  onClick={toggleOnline}
                  style={{
                    background: online ? 'rgba(30,132,73,0.12)' : 'rgba(220,38,38,0.12)',
                    border: `1px solid ${online ? 'rgba(30,132,73,0.25)' : 'rgba(220,38,38,0.25)'}`,
                    borderRadius: 6, width: '100%', padding: '3px 0',
                    cursor: 'pointer', fontSize: 8, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700,
                    color: online ? '#1E8449' : '#DC2626', letterSpacing: '0.06em',
                  }}
                >
                  {online ? 'ON' : 'OFF'}
                </button>
              </div>
            ) : (
              // Modo expandido: avatar + nome + role + online/offline
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div style={{ position: 'relative' }}>
                    <div
                      onClick={() => setShowIconSelector(true)}
                      style={{
                        width: 38, height: 38, borderRadius: 10, cursor: 'pointer',
                        background: 'linear-gradient(135deg, #0D3DCC 0%, #0BBFAA 100%)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'opacity 0.15s',
                      }}
                      title="Clique para alterar ícone"
                    >
                      <IconeAvatarAtual size={20} color="#fff" strokeWidth={1.8} />
                    </div>
                    <div style={{
                      position: 'absolute', bottom: -1, right: -1,
                      width: 10, height: 10, borderRadius: '50%',
                      background: online ? '#1E8449' : '#DC2626',
                      border: '2px solid var(--sidebar-bg)',
                    }} />
                  </div>
                  <div style={{ overflow: 'hidden', flex: 1 }}>
                    <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {usuario.nome.split(' ')[0]}
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: isGestor ? '#0D3DCC' : '#0BBFAA', marginTop: 1 }}>
                      {isGestor ? 'Gestor' : 'Atendente'}
                    </div>
                  </div>
                </div>
                {/* Botão Online/Offline */}
                <button
                  onClick={toggleOnline}
                  style={{
                    width: '100%', padding: '6px 10px', borderRadius: 8,
                    background: online ? 'rgba(30,132,73,0.10)' : 'rgba(220,38,38,0.10)',
                    border: `1px solid ${online ? 'rgba(30,132,73,0.22)' : 'rgba(220,38,38,0.22)'}`,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    transition: 'all 0.15s',
                  }}
                >
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: online ? '#1E8449' : '#DC2626', flexShrink: 0 }} />
                  <span style={{ fontSize: 12, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, color: online ? '#1E8449' : '#DC2626' }}>
                    {online ? 'Online' : 'Offline'}
                  </span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* MENU */}
        {!collapsed && <div className="section-label" style={{ marginBottom: 4 }}>Menu</div>}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 12 }}>
          {MENU_ITEMS.map(item => <NavItem key={item.href} {...item} />)}
        </nav>

        {/* OPERACIONAL — gestor */}
        {isGestor && (
          <>
            <div className="divider" />
            {!collapsed && (
              <div className="section-label" style={{ margin: '8px 0 4px' }}>
                <BarChart3 size={9} color="var(--text-muted)" strokeWidth={2} />
                Operacional
              </div>
            )}
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 12 }}>
              {GESTOR_ITEMS.map(item => <NavItem key={item.href} {...item} />)}
            </nav>
          </>
        )}

        {/* SISTEMA */}
        <div className="divider" />
        {!collapsed && (
          <div className="section-label" style={{ margin: '8px 0 4px' }}>
            <Shield size={9} color="var(--text-muted)" strokeWidth={2} />
            Sistema
          </div>
        )}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {isGestor && (
            <Link href="/admin" style={{ textDecoration: 'none' }} title={collapsed ? 'Configuracoes' : undefined}>
              <div className={`nav-pill ${pathname === '/admin' ? 'active' : ''}`} style={{ padding: collapsed ? '7px 0' : '7px 10px', justifyContent: collapsed ? 'center' : 'flex-start' }}>
                <div className="nav-icon" style={{ background: pathname === '/admin' ? 'rgba(122,144,184,0.12)' : 'var(--muted-bg)', border: '1px solid var(--border)', flexShrink: 0 }}>
                  <Settings size={14} color={pathname === '/admin' ? '#7A90B8' : 'var(--text-muted)'} strokeWidth={2} />
                </div>
                {!collapsed && <span>Configuracoes</span>}
              </div>
            </Link>
          )}
          <button onClick={handleLogout} className="nav-pill" style={{ border: 'none', padding: collapsed ? '7px 0' : '7px 10px', justifyContent: collapsed ? 'center' : 'flex-start' }} title={collapsed ? 'Sair' : undefined}>
            <div className="nav-icon" style={{ background: 'var(--muted-bg)', border: '1px solid var(--border)', flexShrink: 0 }}>
              <LogOut size={14} color="var(--text-muted)" strokeWidth={2} />
            </div>
            {!collapsed && <span>Sair</span>}
          </button>
        </nav>

        {/* Rodapé */}
        {!collapsed && (
          <div style={{ marginTop: 'auto', paddingTop: 16 }}>
            <div className="divider" />
            <div style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif', padding: '6px 4px 0', letterSpacing: '0.06em' }}>
              Inadimplência v1.0
            </div>
          </div>
        )}
      </aside>

      {/* Modal de seleção de ícone */}
      {showIconSelector && (
        <IconSelectorModal
          selected={iconeSelecionado}
          onSelect={setIconeSelecionado}
          onClose={() => setShowIconSelector(false)}
        />
      )}
    </>
  )
}
