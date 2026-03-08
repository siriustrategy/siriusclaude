'use client'

import { useState } from 'react'
import { Zap, X } from 'lucide-react'

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

export default function CreditBadge() {
  const [open, setOpen] = useState(false)
  const { balance, plan, monthly_allowance, used_this_month } = mockCredits
  const status = getCreditStatus(balance)

  const pct = Math.round((used_this_month / monthly_allowance) * 100)
  const remaining = monthly_allowance - used_this_month

  const badgeColor = status === 'critical' ? '#ef4444' : status === 'low' ? '#f59e0b' : '#5B7BFF'
  const badgeBg = status === 'critical' ? 'rgba(239,68,68,0.1)' : status === 'low' ? 'rgba(245,158,11,0.1)' : 'rgba(59,91,219,0.1)'
  const badgeBorder = status === 'critical' ? 'rgba(239,68,68,0.28)' : status === 'low' ? 'rgba(245,158,11,0.28)' : 'rgba(59,91,219,0.22)'

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '6px 12px', borderRadius: 8,
          background: badgeBg, border: `1px solid ${badgeBorder}`,
          color: badgeColor, cursor: 'pointer',
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: 13, fontWeight: 700, transition: 'all 0.15s',
        }}
      >
        <Zap size={13} />
        <span>{balance}</span>
        <span style={{ fontSize: 10, opacity: 0.65, fontWeight: 500 }}>créditos</span>
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', right: 0,
          width: 260, borderRadius: 14, zIndex: 50,
          background: '#0D1225',
          border: '1px solid rgba(59,91,219,0.28)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
          animation: 'fadeIn 0.2s ease',
          overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 16px 12px',
            borderBottom: '1px solid var(--border)',
          }}>
            <div>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 22, fontWeight: 700, color: '#E8EEFF', lineHeight: 1 }}>
                {balance}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3, fontFamily: 'Space Grotesk, sans-serif' }}>
                créditos disponíveis
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="badge-primary" style={{ fontSize: 10, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700 }}>
                {plan.toUpperCase()}
              </span>
              <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 2 }}>
                <X size={13} />
              </button>
            </div>
          </div>

          {/* Usage */}
          <div style={{ padding: '12px 16px 14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', marginBottom: 7, fontFamily: 'Space Grotesk, sans-serif' }}>
              <span>{remaining} restantes este mês</span>
              <span style={{ color: pct > 80 ? '#f59e0b' : 'var(--text-muted)' }}>{pct}%</span>
            </div>
            <div style={{ background: 'rgba(59,91,219,0.1)', borderRadius: 3, height: 4, overflow: 'hidden' }}>
              <div style={{
                width: `${pct}%`, height: '100%',
                background: pct > 80 ? 'linear-gradient(90deg, #f59e0b, #ef4444)' : 'linear-gradient(90deg, #3B5BDB, #7C3AED)',
                borderRadius: 3,
              }} />
            </div>
          </div>

          {/* Buy CTA */}
          <div style={{ padding: '0 12px 12px' }}>
            <button
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                padding: '10px 0', borderRadius: 9,
                background: 'rgba(59,91,219,0.12)', border: '1px solid rgba(59,91,219,0.28)',
                color: '#93c5fd', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 13,
                cursor: 'pointer', transition: 'background 0.15s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(59,91,219,0.2)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(59,91,219,0.12)' }}
            >
              <Zap size={13} />
              Recarregar créditos
            </button>
          </div>
        </div>
      )}

      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  )
}
