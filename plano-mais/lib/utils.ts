// ===================== FORMATADORES =====================

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

export function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return 'Hoje'
  if (diffDays === 1) return 'Ontem'
  if (diffDays < 7) return `${diffDays} dias atrás`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} semanas atrás`
  return `${Math.floor(diffDays / 30)} meses atrás`
}

// ===================== BADGES =====================

export function getFaseBadge(fase: string): { label: string; className: string } {
  const map: Record<string, { label: string; className: string }> = {
    pre:  { label: 'Pré',   className: 'badge badge-gray' },
    mes1: { label: 'Mês 1', className: 'badge badge-blue' },
    mes2: { label: 'Mês 2', className: 'badge badge-blue' },
    mes3: { label: 'Mês 3', className: 'badge badge-orange' },
    mes4: { label: 'Mês 4', className: 'badge badge-red' },
    mes5: { label: 'Mês 5', className: 'badge badge-red' },
    pos:  { label: 'Pós',   className: 'badge badge-gray' },
  }
  return map[fase] || { label: fase, className: 'badge badge-gray' }
}

export function getRiscoBadge(risco: string): { label: string; className: string } {
  const map: Record<string, { label: string; className: string }> = {
    baixo: { label: 'Baixo Risco', className: 'badge badge-green' },
    medio: { label: 'Risco Médio', className: 'badge badge-orange' },
    alto:  { label: 'Alto Risco',  className: 'badge badge-red' },
  }
  return map[risco] || { label: risco, className: 'badge badge-gray' }
}

// ===================== AVATAR =====================

const AVATAR_COLORS = ['#0D3DCC', '#7C3AED', '#059669', '#D97706', '#DC2626', '#0891B2', '#9333EA']

export function getAvatarColor(name: string): string {
  const idx = name.charCodeAt(0) % AVATAR_COLORS.length
  return AVATAR_COLORS[idx]
}

// ===================== DESCONTO POR FASE =====================

export function getDescontoDisponivel(fase: string): {
  percentual: number
  validade?: string
  parcelamento: boolean
} {
  switch (fase) {
    case 'mes3': return { percentual: 5,  validade: '48h', parcelamento: false }
    case 'mes4': return { percentual: 15, validade: undefined, parcelamento: true }
    case 'mes5': return { percentual: 20, validade: undefined, parcelamento: true }
    default:     return { percentual: 0,  validade: undefined, parcelamento: false }
  }
}
