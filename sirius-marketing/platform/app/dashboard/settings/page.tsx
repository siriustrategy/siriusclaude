'use client'

import { useState } from 'react'
import { Settings, User, CreditCard, Bell, Link2, Shield, Instagram, Youtube, LogOut, Check, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'

const sections = [
  { id: 'profile', label: 'Perfil', icon: User },
  { id: 'billing', label: 'Plano & Créditos', icon: CreditCard },
  { id: 'integrations', label: 'Integrações', icon: Link2 },
  { id: 'notifications', label: 'Notificações', icon: Bell },
  { id: 'security', label: 'Segurança', icon: Shield },
]

const integrations = [
  { id: 'instagram', name: 'Instagram', description: 'Conecte suas páginas para analytics e auto-reply', icon: Instagram, color: '#7C3AED', connected: true, account: '@siriusacademy' },
  { id: 'instagram2', name: 'Instagram', description: 'Segunda conta conectada', icon: Instagram, color: '#7C3AED', connected: true, account: '@minhaloja' },
  { id: 'tiktok', name: 'TikTok', description: 'Conecte para agendar e monitorar', icon: null, color: '#06b6d4', connected: false, account: null },
  { id: 'youtube', name: 'YouTube', description: 'Analytics e agendamento de Shorts', icon: Youtube, color: '#ef4444', connected: false, account: null },
]

const plans = [
  { id: 'starter', label: 'Starter', credits: 100, price: 'R$ 97/mês', features: ['1 marca', '100 créditos/mês', 'Analytics básico'] },
  { id: 'pro', label: 'Pro', credits: 500, price: 'R$ 197/mês', features: ['3 marcas', '500 créditos/mês', 'Analytics completo', 'Instagram Agent', 'Viral Intelligence'] },
  { id: 'agency', label: 'Agency', credits: 2000, price: 'R$ 497/mês', features: ['Marcas ilimitadas', '2000 créditos/mês', 'Tudo do Pro', 'API access', 'Suporte prioritário'] },
]

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('profile')
  const [notifEmail, setNotifEmail] = useState(true)
  const [notifTrends, setNotifTrends] = useState(true)
  const [notifReports, setNotifReports] = useState(false)

  return (
    <div style={{ padding: '28px 36px' }}>

      {/* Header */}
      <motion.div
        style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 32 }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div style={{
          width: 48, height: 48, borderRadius: 14,
          background: 'rgba(59,91,219,0.12)', border: '1px solid rgba(59,91,219,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Settings size={20} color="#5B7BFF" strokeWidth={2} />
        </div>
        <div>
          <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 24, fontWeight: 700, color: '#E8EEFF', marginBottom: 2 }}>
            Configurações
          </h1>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif' }}>
            Gerencie sua conta, plano e integrações
          </div>
        </div>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 24, alignItems: 'start' }}>

        {/* Left nav */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="glass-card" style={{ overflow: 'hidden' }}>
            {sections.map((s, i) => {
              const Icon = s.icon
              const active = activeSection === s.id
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                    padding: '12px 14px', border: 'none', cursor: 'pointer', textAlign: 'left' as const,
                    background: active ? 'rgba(59,91,219,0.15)' : 'transparent',
                    borderLeft: active ? '2px solid #3B5BDB' : '2px solid transparent',
                    borderBottom: i < sections.length - 1 ? '1px solid var(--border)' : 'none',
                    transition: 'all 0.15s',
                  }}
                >
                  <Icon size={14} color={active ? '#93c5fd' : 'var(--text-muted)'} />
                  <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, fontWeight: 600, color: active ? '#E8EEFF' : 'var(--text-secondary)' }}>
                    {s.label}
                  </span>
                </button>
              )
            })}
            <button style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 10,
              padding: '12px 14px', border: 'none', cursor: 'pointer', textAlign: 'left' as const,
              background: 'transparent', color: '#ef4444', borderTop: '1px solid var(--border)',
              transition: 'background 0.15s',
            }}>
              <LogOut size={14} />
              <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, fontWeight: 600 }}>Sair</span>
            </button>
          </div>
        </motion.div>

        {/* Right content */}
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeSection === 'profile' && (
            <div>
              <div className="glass-card" style={{ padding: '24px', marginBottom: 16 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em', fontFamily: 'Space Grotesk, sans-serif', marginBottom: 18 }}>DADOS PESSOAIS</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                  {[
                    { label: 'Nome completo', value: 'Breno Nobre', type: 'text' },
                    { label: 'Email', value: 'breno@siriusstrategy.com', type: 'email' },
                  ].map((field) => (
                    <div key={field.label}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif', marginBottom: 6 }}>{field.label}</div>
                      <input
                        defaultValue={field.value}
                        type={field.type}
                        style={{
                          width: '100%', padding: '9px 12px', borderRadius: 8,
                          background: 'rgba(13,18,37,0.8)', border: '1px solid var(--border)',
                          color: '#E8EEFF', fontSize: 13, fontFamily: 'DM Sans, sans-serif',
                          outline: 'none', boxSizing: 'border-box' as const,
                        }}
                      />
                    </div>
                  ))}
                </div>
                <button className="btn-primary" style={{ fontSize: 12, padding: '8px 18px' }}>
                  Salvar alterações
                </button>
              </div>
            </div>
          )}

          {activeSection === 'billing' && (
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em', fontFamily: 'Space Grotesk, sans-serif', marginBottom: 12 }}>ESCOLHA SEU PLANO</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {plans.map((plan) => {
                  const active = plan.id === 'pro'
                  return (
                    <div key={plan.id} style={{
                      padding: '18px 20px', borderRadius: 12,
                      background: active ? 'rgba(59,91,219,0.12)' : 'var(--muted-bg)',
                      border: active ? '1px solid rgba(59,91,219,0.4)' : '1px solid var(--border)',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 15, fontWeight: 700, color: '#E8EEFF' }}>{plan.label}</span>
                          {active && <span className="badge-primary" style={{ fontSize: 10 }}>Plano atual</span>}
                        </div>
                        <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 15, fontWeight: 700, color: active ? '#93c5fd' : 'var(--text-secondary)' }}>{plan.price}</span>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 8 }}>
                        {plan.features.map((f) => (
                          <span key={f} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'Space Grotesk, sans-serif' }}>
                            <Check size={11} color="#10b981" />
                            {f}
                          </span>
                        ))}
                      </div>
                      {!active && (
                        <button className="btn-secondary" style={{ fontSize: 12, marginTop: 12, padding: '6px 14px' }}>
                          Fazer upgrade
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {activeSection === 'integrations' && (
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em', fontFamily: 'Space Grotesk, sans-serif', marginBottom: 12 }}>PLATAFORMAS CONECTADAS</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {integrations.map((integ) => (
                  <div key={integ.id} className="glass-card" style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                      background: `${integ.color}18`, border: `1px solid ${integ.color}30`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, fontWeight: 800, color: integ.color,
                      fontFamily: 'Space Grotesk, sans-serif',
                    }}>
                      {integ.icon ? <integ.icon size={18} color={integ.color} /> : integ.name[0]}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, fontWeight: 700, color: '#E8EEFF', marginBottom: 2 }}>
                        {integ.name}
                        {integ.account && <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500, marginLeft: 8 }}>{integ.account}</span>}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif' }}>{integ.description}</div>
                    </div>
                    {integ.connected ? (
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#10b981', display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'Space Grotesk, sans-serif' }}>
                        <Check size={12} />Conectado
                      </span>
                    ) : (
                      <button className="btn-secondary" style={{ fontSize: 12, padding: '6px 14px' }}>
                        Conectar
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em', fontFamily: 'Space Grotesk, sans-serif', marginBottom: 18 }}>PREFERÊNCIAS DE NOTIFICAÇÃO</div>
              {[
                { label: 'Relatório semanal por email', sub: 'Receba um resumo todo domingo', value: notifEmail, set: setNotifEmail },
                { label: 'Alertas de trends virais', sub: 'Quando uma trend tiver 87%+ de fit', value: notifTrends, set: setNotifTrends },
                { label: 'Relatório de performance mensal', sub: 'Análise completa do mês anterior', value: notifReports, set: setNotifReports },
              ].map((n) => (
                <div key={n.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, fontWeight: 600, color: '#E8EEFF', marginBottom: 2 }}>{n.label}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif' }}>{n.sub}</div>
                  </div>
                  <button
                    onClick={() => n.set(!n.value)}
                    style={{
                      width: 44, height: 24, borderRadius: 12, cursor: 'pointer', border: 'none',
                      background: n.value ? 'rgba(16,185,129,0.2)' : 'var(--muted-bg)',
                      display: 'flex', alignItems: 'center', padding: '0 3px',
                      transition: 'background 0.2s',
                    }}
                  >
                    <div style={{
                      width: 18, height: 18, borderRadius: '50%',
                      background: n.value ? '#10b981' : 'var(--text-muted)',
                      transform: n.value ? 'translateX(20px)' : 'translateX(0)',
                      transition: 'transform 0.2s, background 0.2s',
                    }} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeSection === 'security' && (
            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em', fontFamily: 'Space Grotesk, sans-serif', marginBottom: 18 }}>SEGURANÇA</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <button className="btn-ghost" style={{ fontSize: 13, padding: '10px 14px', justifyContent: 'space-between', display: 'flex', alignItems: 'center' }}>
                  Alterar senha <ChevronRight size={14} />
                </button>
                <button className="btn-ghost" style={{ fontSize: 13, padding: '10px 14px', justifyContent: 'space-between', display: 'flex', alignItems: 'center' }}>
                  Autenticação de 2 fatores <ChevronRight size={14} />
                </button>
                <button className="btn-ghost" style={{ fontSize: 13, padding: '10px 14px', justifyContent: 'space-between', display: 'flex', alignItems: 'center' }}>
                  Sessões ativas <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
