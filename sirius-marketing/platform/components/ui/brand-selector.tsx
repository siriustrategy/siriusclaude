'use client'

import { useState } from 'react'
import { ChevronDown, Plus, Check } from 'lucide-react'

const mockBrands = [
  { id: '1', name: 'Sirius Academy', color: '#3B5BDB', initials: 'SA', active: true },
  { id: '2', name: 'Minha Loja', color: '#7C3AED', initials: 'ML', active: false },
]

export default function BrandSelector() {
  const [open, setOpen] = useState(false)
  const [brands] = useState(mockBrands)
  const activeBrand = brands.find((b) => b.active) ?? brands[0]

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '6px 12px',
          borderRadius: 8,
          background: 'rgba(59,91,219,0.07)',
          border: '1px solid rgba(59,91,219,0.15)',
          color: '#E8EEFF',
          cursor: 'pointer',
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: 13, fontWeight: 600,
          transition: 'all 0.15s',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(59,91,219,0.12)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(59,91,219,0.07)' }}
      >
        <div style={{
          width: 22, height: 22, borderRadius: 6,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 10, fontWeight: 800, color: '#fff',
          background: activeBrand.color,
          flexShrink: 0,
        }}>
          {activeBrand.initials}
        </div>
        <span>{activeBrand.name}</span>
        <ChevronDown size={13} color="var(--text-muted)" />
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', left: 0,
          width: 228, borderRadius: 12, zIndex: 50,
          background: '#0D1225',
          border: '1px solid rgba(59,91,219,0.28)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
          overflow: 'hidden',
          animation: 'fadeIn 0.2s ease',
        }}>
          <div style={{ padding: 8 }}>
            {brands.map((brand) => (
              <button
                key={brand.id}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  width: '100%', padding: '9px 12px', borderRadius: 8,
                  background: brand.active ? 'rgba(59,91,219,0.12)' : 'transparent',
                  border: brand.active ? '1px solid rgba(59,91,219,0.22)' : '1px solid transparent',
                  color: '#E8EEFF',
                  cursor: 'pointer', textAlign: 'left',
                  fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, fontWeight: 600,
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { if (!brand.active) (e.currentTarget as HTMLButtonElement).style.background = 'var(--muted-bg)' }}
                onMouseLeave={e => { if (!brand.active) (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
              >
                <div style={{
                  width: 28, height: 28, borderRadius: 7,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 800, color: '#fff',
                  background: brand.color, flexShrink: 0,
                }}>
                  {brand.initials}
                </div>
                <span style={{ flex: 1 }}>{brand.name}</span>
                {brand.active && <Check size={13} color="#93c5fd" />}
              </button>
            ))}
          </div>

          {brands.length < 3 && (
            <div style={{ borderTop: '1px solid var(--border)', padding: 8 }}>
              <button style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', padding: '9px 12px', borderRadius: 8,
                background: 'transparent', border: '1px solid transparent',
                color: 'var(--text-secondary)',
                cursor: 'pointer', textAlign: 'left',
                fontFamily: 'Space Grotesk, sans-serif', fontSize: 13,
                transition: 'all 0.15s',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--muted-bg)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
              >
                <Plus size={14} />
                <span>Adicionar marca</span>
                <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-muted)' }}>
                  {3 - brands.length} restante{3 - brands.length !== 1 ? 's' : ''}
                </span>
              </button>
            </div>
          )}
        </div>
      )}

      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  )
}
