'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell, X, Zap, TrendingUp, Users, Trophy, GraduationCap,
  AlertTriangle, CheckCircle, Star, ArrowRight, ExternalLink,
} from 'lucide-react'
import Link from 'next/link'

const ACADEMY_URL = 'https://sirius-academy-production.up.railway.app/'

type NotifType = 'operational' | 'academy' | 'achievement' | 'alert'

interface Notification {
  id: string
  type: NotifType
  icon: React.ElementType
  iconColor: string
  title: string
  body: string
  time: string
  read: boolean
  cta?: { label: string; href: string }
  showAcademyBtn?: boolean
  academyHref?: string
  freeForAcademy?: boolean
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'academy',
    icon: Users,
    iconColor: '#a855f7',
    title: '127 leads capturados e esperando',
    body: 'Sua última captura gerou 127 leads qualificados. Na Sirius Academy tem um módulo completo sobre conversão de leads com IA — aprenda a fechar mais com menos esforço.',
    time: '5 min',
    read: false,
    cta: { label: 'Fazer disparo agora', href: '/dashboard/distribution' },
    showAcademyBtn: true,
    academyHref: 'https://sirius-academy-production.up.railway.app/',
  },
  {
    id: '2',
    type: 'operational',
    icon: TrendingUp,
    iconColor: '#06b6d4',
    title: 'Trend emergindo no seu nicho',
    body: '#IAparaNegocios subiu 340% nas últimas 6h no TikTok. Janela de oportunidade: 48h.',
    time: '12 min',
    read: false,
    cta: { label: 'Ver trend', href: '/dashboard/viral' },
  },
  {
    id: '3',
    type: 'academy',
    icon: GraduationCap,
    iconColor: '#7C3AED',
    title: 'Engajamento caiu 23% esta semana',
    body: 'Seu engajamento médio caiu nos últimos 7 dias. Na Sirius Academy temos um módulo completo de recuperação de alcance orgânico com IA.',
    time: '1h',
    read: false,
    showAcademyBtn: true,
    academyHref: 'https://sirius-academy-production.up.railway.app/',
    cta: { label: 'Ver diagnóstico', href: '/dashboard/analytics' },
  },
  {
    id: '4',
    type: 'achievement',
    icon: Trophy,
    iconColor: '#f59e0b',
    title: '500 leads capturados este mês!',
    body: 'Você está acima da média dos usuários Pro. Continue assim — você é um prospector de elite.',
    time: '2h',
    read: true,
  },
  {
    id: '5',
    type: 'alert',
    icon: AlertTriangle,
    iconColor: '#ef4444',
    title: 'Créditos baixos: 18 restantes',
    body: 'Você está quase sem créditos. Recarregue agora ou acesse a Sirius Academy — alunos têm créditos ilimitados no plano Academy.',
    time: '3h',
    read: true,
    cta: { label: 'Recarregar créditos', href: '/dashboard/settings' },
    showAcademyBtn: true,
    academyHref: 'https://sirius-academy-production.up.railway.app/',
    freeForAcademy: true,
  },
  {
    id: '6',
    type: 'operational',
    icon: CheckCircle,
    iconColor: '#10b981',
    title: 'Monitoramento sincronizado',
    body: '47 contas monitoradas atualizadas. 3 perfis tiveram crescimento expressivo de seguidores.',
    time: '30 min',
    read: true,
    cta: { label: 'Ver monitor', href: '/dashboard/leads/monitor' },
  },
]

function NotifIcon({ Icon, color, type }: { Icon: React.ElementType; color: string; type: NotifType }) {
  return (
    <div style={{
      width: 38, height: 38, borderRadius: 10, flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: type === 'academy'
        ? 'linear-gradient(135deg, rgba(124,58,237,0.22), rgba(59,91,219,0.18))'
        : `${color}18`,
      border: type === 'academy'
        ? '1px solid rgba(124,58,237,0.3)'
        : `1px solid ${color}28`,
    }}>
      <Icon size={17} color={color} strokeWidth={2} />
    </div>
  )
}

function NotifCard({ n, onMarkRead }: { n: Notification; onMarkRead: (id: string) => void }) {
  const isAcademy = n.type === 'academy'

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        borderRadius: 12,
        padding: '14px 16px',
        marginBottom: 8,
        position: 'relative',
        cursor: 'default',
        background: isAcademy
          ? 'linear-gradient(135deg, rgba(124,58,237,0.10) 0%, rgba(59,91,219,0.10) 100%)'
          : n.read
            ? 'rgba(13,18,37,0.7)'
            : 'rgba(59,91,219,0.07)',
        border: isAcademy
          ? '1px solid rgba(124,58,237,0.22)'
          : n.read
            ? '1px solid rgba(59,91,219,0.1)'
            : '1px solid rgba(59,91,219,0.2)',
      }}
      onClick={() => !n.read && onMarkRead(n.id)}
    >
      {/* Unread dot */}
      {!n.read && (
        <div style={{
          position: 'absolute', top: 14, right: 14,
          width: 7, height: 7, borderRadius: '50%',
          background: isAcademy ? '#a855f7' : '#3B5BDB',
          boxShadow: isAcademy ? '0 0 6px #a855f7' : '0 0 6px #3B5BDB88',
        }} />
      )}

      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <NotifIcon Icon={n.icon} color={n.iconColor} type={n.type} />
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Academy badge */}
          {isAcademy && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              background: 'linear-gradient(90deg, rgba(124,58,237,0.3), rgba(59,91,219,0.25))',
              border: '1px solid rgba(124,58,237,0.3)',
              borderRadius: 20, padding: '2px 8px',
              fontSize: 10, fontWeight: 700,
              fontFamily: 'Space Grotesk, sans-serif',
              color: '#c084fc', letterSpacing: '0.06em',
              marginBottom: 6,
            }}>
              <GraduationCap size={10} color="#c084fc" />
              SIRIUS ACADEMY
            </div>
          )}

          {n.freeForAcademy && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              background: 'rgba(16,185,129,0.12)',
              border: '1px solid rgba(16,185,129,0.25)',
              borderRadius: 20, padding: '2px 8px',
              fontSize: 10, fontWeight: 700,
              fontFamily: 'Space Grotesk, sans-serif',
              color: '#34d399', letterSpacing: '0.06em',
              marginBottom: 6, marginLeft: isAcademy ? 0 : 0,
            }}>
              <Star size={9} color="#34d399" />
              GRÁTIS PARA ALUNOS ACADEMY
            </div>
          )}

          <div style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 700, fontSize: 13,
            color: '#E8EEFF', lineHeight: 1.3, marginBottom: 5,
          }}>
            {n.title}
          </div>
          <div style={{
            fontSize: 12, color: 'var(--text-secondary)',
            lineHeight: 1.5, marginBottom: n.cta || n.showAcademyBtn ? 10 : 0,
          }}>
            {n.body}
          </div>

          {/* Action buttons */}
          {(n.cta || n.showAcademyBtn) && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {n.cta && (
                <Link href={n.cta.href} style={{ textDecoration: 'none' }}>
                  <button style={{
                    background: 'rgba(59,91,219,0.18)',
                    border: '1px solid rgba(59,91,219,0.32)',
                    borderRadius: 7, padding: '5px 11px',
                    fontSize: 11, fontWeight: 700,
                    fontFamily: 'Space Grotesk, sans-serif',
                    color: '#93c5fd', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 5,
                  }}>
                    {n.cta.label}
                    <ArrowRight size={10} color="#93c5fd" />
                  </button>
                </Link>
              )}
              {n.showAcademyBtn && (
                <a href={n.academyHref ?? 'https://sirius-academy-production.up.railway.app/'} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                  <button style={{
                    background: 'linear-gradient(90deg, rgba(124,58,237,0.25), rgba(59,91,219,0.2))',
                    border: '1px solid rgba(124,58,237,0.35)',
                    borderRadius: 7, padding: '5px 11px',
                    fontSize: 11, fontWeight: 700,
                    fontFamily: 'Space Grotesk, sans-serif',
                    color: '#c084fc', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 5,
                  }}>
                    <GraduationCap size={10} color="#c084fc" />
                    Visitar Sirius Academy
                    <ExternalLink size={9} color="#c084fc" />
                  </button>
                </a>
              )}
            </div>
          )}

          <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 8 }}>
            há {n.time}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState(mockNotifications)

  const unread = notifications.filter(n => !n.read).length

  function markRead(id: string) {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  function markAllRead() {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  return (
    <div style={{ position: 'relative' }}>
      {/* Bell button */}
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          position: 'relative',
          width: 36, height: 36, borderRadius: 9,
          background: open ? 'rgba(59,91,219,0.18)' : 'rgba(59,91,219,0.08)',
          border: `1px solid ${open ? 'rgba(59,91,219,0.35)' : 'rgba(59,91,219,0.18)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', transition: 'all 0.2s',
        }}
      >
        <Bell size={16} color={open ? '#93c5fd' : 'var(--text-secondary)'} strokeWidth={2} />
        {unread > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{
              position: 'absolute', top: -3, right: -3,
              width: 16, height: 16, borderRadius: '50%',
              background: 'linear-gradient(135deg, #a855f7, #3B5BDB)',
              border: '2px solid #080C18',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 8, fontWeight: 800,
              fontFamily: 'Space Grotesk, sans-serif',
              color: '#fff',
              boxShadow: '0 0 8px rgba(168,85,247,0.6)',
            }}
          >
            {unread > 9 ? '9+' : unread}
          </motion.div>
        )}
      </button>

      {/* Backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            style={{
              position: 'fixed', inset: 0, zIndex: 998,
              background: 'rgba(4,6,15,0.4)',
              backdropFilter: 'blur(2px)',
            }}
          />
        )}
      </AnimatePresence>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: 16, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 16, scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'fixed',
              top: 68, right: 16,
              width: 380,
              maxHeight: 'calc(100vh - 90px)',
              background: 'rgba(8,12,24,0.97)',
              border: '1px solid rgba(59,91,219,0.22)',
              borderRadius: 16,
              backdropFilter: 'blur(24px)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(59,91,219,0.1)',
              zIndex: 999,
              display: 'flex', flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '16px 20px 12px',
              borderBottom: '1px solid rgba(59,91,219,0.12)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Bell size={15} color="#93c5fd" />
                <span style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: 700, fontSize: 14, color: '#E8EEFF',
                }}>
                  Notificações
                </span>
                {unread > 0 && (
                  <div style={{
                    background: 'linear-gradient(90deg, rgba(124,58,237,0.3), rgba(59,91,219,0.25))',
                    border: '1px solid rgba(124,58,237,0.3)',
                    borderRadius: 20, padding: '1px 8px',
                    fontSize: 11, fontWeight: 700,
                    fontFamily: 'Space Grotesk, sans-serif',
                    color: '#c084fc',
                  }}>
                    {unread} novas
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {unread > 0 && (
                  <button
                    onClick={markAllRead}
                    style={{
                      background: 'none', border: 'none',
                      fontSize: 11, color: 'var(--text-muted)',
                      cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif',
                      fontWeight: 600, padding: '2px 6px',
                    }}
                  >
                    marcar todas
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  style={{
                    background: 'var(--muted-bg)', border: '1px solid var(--border)',
                    borderRadius: 7, width: 26, height: 26,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', color: 'var(--text-muted)',
                  }}
                >
                  <X size={13} />
                </button>
              </div>
            </div>

            {/* Academy promo banner */}
            <a
              href="https://sirius-academy-production.up.railway.app/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none' }}
            >
              <div style={{
                margin: '12px 16px 4px',
                background: 'linear-gradient(135deg, rgba(124,58,237,0.18) 0%, rgba(59,91,219,0.15) 100%)',
                border: '1px solid rgba(124,58,237,0.28)',
                borderRadius: 10,
                padding: '10px 14px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                cursor: 'pointer',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 8,
                    background: 'linear-gradient(135deg, #7C3AED, #3B5BDB)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <GraduationCap size={14} color="#fff" />
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 800, color: '#c084fc', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.04em' }}>
                      SIRIUS ACADEMY
                    </div>
                    <div style={{ fontSize: 11, color: '#a78bfa', fontFamily: 'DM Sans, sans-serif' }}>
                      Acesso ilimitado + créditos grátis para alunos
                    </div>
                  </div>
                </div>
                <div style={{
                  fontSize: 11, fontWeight: 700, color: '#c084fc',
                  fontFamily: 'Space Grotesk, sans-serif',
                  display: 'flex', alignItems: 'center', gap: 4,
                }}>
                  Criar conta
                  <ArrowRight size={11} color="#c084fc" />
                </div>
              </div>
            </a>

            {/* List */}
            <div style={{ overflowY: 'auto', padding: '8px 12px 16px', flex: 1 }}>
              {notifications.map(n => (
                <NotifCard key={n.id} n={n} onMarkRead={markRead} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
