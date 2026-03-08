'use client'

import type { ReactNode, CSSProperties } from 'react'

type NeonColor = 'green' | 'purple' | 'cyan' | 'red' | 'orange'

const neonColors: Record<NeonColor, string> = {
  green:  '#25D366',
  purple: '#a855f7',
  cyan:   '#06b6d4',
  red:    '#ef4444',
  orange: '#f59e0b',
}

interface NeonPulseProps {
  children: ReactNode
  color?: NeonColor
  style?: CSSProperties
  className?: string
  as?: 'div' | 'span' | 'button'
  onClick?: () => void
}

/** Wrapper sem animação pulsante — apenas container */
export function NeonPulse({ children, style, className, onClick }: NeonPulseProps) {
  return (
    <div style={style} className={className} onClick={onClick}>
      {children}
    </div>
  )
}

/** Ponto de status — estático, sem pulsar */
export function NeonDot({ color = 'green', size = 8 }: { color?: NeonColor; size?: number }) {
  const c = neonColors[color]
  return (
    <span style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background: c,
      display: 'inline-block',
      flexShrink: 0,
    }} />
  )
}

/** Texto colorido — sem animação */
export function NeonText({ children, color = 'green', className }: { children: ReactNode; color?: NeonColor; className?: string }) {
  return (
    <span style={{ color: neonColors[color] }} className={className}>
      {children}
    </span>
  )
}
