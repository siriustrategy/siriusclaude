'use client'

import { useState } from 'react'
import { Zap, X, TrendingDown } from 'lucide-react'

const mockCredits = {
  balance: 87,
  plan: 'pro',
  monthly_allowance: 500,
  used_this_month: 413,
}

function getCreditStatus(balance: number) {
  if (balance <= 10) return 'critical'
  if (balance <= 30) return 'low'
  return 'normal'
}

const creditHistory = [
  { action: 'Geração de imagem', amount: -5, time: '14:32' },
  { action: 'Copy Engine A/B', amount: -3, time: '13:15' },
  { action: 'Ideas Generator', amount: -3, time: '11:02' },
  { action: 'Renovação mensal', amount: +500, time: '01 Mar' },
]

export default function CreditBadge() {
  const [open, setOpen] = useState(false)
  const { balance, plan, monthly_allowance, used_this_month } = mockCredits
  const status = getCreditStatus(balance)

  const badgeColor = status === 'critical' ? '#ef4444' : status === 'low' ? '#f59e0b' : '#5B7BFF'
  const badgeBg = status === 'critical' ? 'rgba(239,68,68,0.1)' : status === 'low' ? 'rgba(245,158,11,0.1)' : 'rgba(59,91,219,0.1)'
  const badgeBorder = status === 'critical' ? 'rgba(239,68,68,0.28)' : status === 'low' ? 'rgba(245,158,11,0.28)' : 'rgba(59,91,219,0.22)'

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '6px 12px',
          borderRadius: 8,
          background: badgeBg,
          border: `1px solid ${badgeBorder}`,
          color: badgeColor,
          cursor: 'pointer',
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: 13, fontWeight: 700,
          transition: 'all 0.15s',
        }}
      >
        <Zap size={13} />
        <span>{balance}</span>
        <span style={{ fontSize: 10, opacity: 0.7, fontWeight: 500 }}>créditos</span>
      </button>

      {open && (
        <div
          style={{
            position: 'absolute', top: 'calc(100% + 8px)', right: 0,
            width: 288, borderRadius: 14, zIndex: 50,
            background: '#0D1225',
            border: '1px solid rgba(59,91,219,0.28)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 18px',
            borderBottom: '1px solid var(--border)',
          }}>
            <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 14, fontWeight: 700, color: '#E8EEFF' }}>
              Seus Créditos
            </span>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}>
              <X size={14} />
            </button>
          </div>

          {/* Balance */}
          <div style={{ padding: '18px 18px 14px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 14 }}>
              <div>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 32, fontWeight: 700, color: '#E8EEFF', lineHeight: 1 }}>
                  {balance}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>créditos disponíveis</div>
              </div>
              <span className="badge-primary" style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 12 }}>
                {plan.toUpperCase()}
              </span>
            </div>

            {/* Usage bar */}
            <div style={{ marginBottom: 4 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', marginBottom: 6, fontFamily: 'Space Grotesk, sans-serif' }}>
                <span>Usado este mês</span>
                <span>{used_this_month}/{monthly_allowance}</span>
              </div>
              <div style={{ background: 'rgba(59,91,219,0.1)', borderRadius: 3, height: 4, overflow: 'hidden' }}>
                <div style={{
                  width: `${(used_this_month / monthly_allowance) * 100}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #3B5BDB, #7C3AED)',
                  borderRadius: 3,
                }} />
              </div>
            </div>

            {status !== 'normal' && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                marginTop: 12, padding: '10px 12px', borderRadius: 8, fontSize: 12,
                background: status === 'critical' ? 'rgba(239,68,68,0.08)' : 'rgba(245,158,11,0.08)',
                border: `1px solid ${status === 'critical' ? 'rgba(239,68,68,0.25)' : 'rgba(245,158,11,0.25)'}`,
                color: status === 'critical' ? 'var(--danger)' : 'var(--warning)',
              }}>
                <TrendingDown size={13} />
                <span style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Saldo baixo — recarregue para continuar.</span>
              </div>
            )}
          </div>

          {/* History */}
          <div style={{ borderTop: '1px solid var(--border)', padding: '12px 18px 14px' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em', fontFamily: 'Space Grotesk, sans-serif', marginBottom: 10 }}>
              ÚLTIMAS AÇÕES
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {creditHistory.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{item.action}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: item.amount < 0 ? 'var(--danger)' : 'var(--success)', fontFamily: 'Space Grotesk, sans-serif' }}>
                      {item.amount > 0 ? '+' : ''}{item.amount}
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div style={{ padding: '0 12px 12px' }}>
            <button
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '11px 0', borderRadius: 10,
                background: 'rgba(37,211,102,0.1)',
                border: '1px solid rgba(37,211,102,0.3)',
                color: '#25D366',
                fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 14,
                cursor: 'pointer', transition: 'background 0.15s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(37,211,102,0.18)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(37,211,102,0.1)' }}
            >
              <Zap size={14} />
              Comprar créditos
            </button>
          </div>
        </div>
      )}

      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  )
}
