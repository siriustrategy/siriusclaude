import { MessageSquare, Bot, UserCheck, BellRing } from 'lucide-react'

export default function ChatPage() {
  return (
    <div>
      <div className="page-label hero-item hero-item-0">
        <MessageSquare size={10} strokeWidth={2.5} />
        CHAT AO VIVO
      </div>
      <h1 className="hero-item hero-item-1" style={{ fontSize: 26, fontWeight: 800, marginBottom: 6 }}>
        Monitoramento de Conversas
      </h1>
      <p className="hero-item hero-item-2" style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 28 }}>
        Visualize todas as conversas do bot em tempo real e assuma quando necessario.
      </p>

      <div className="hero-item hero-item-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
        {[
          { icon: Bot, label: 'Conversas com Bot', value: '0', color: '#0D3DCC', badge: 'badge-blue' },
          { icon: UserCheck, label: 'Em Atendimento Humano', value: '0', color: '#0BBFAA', badge: 'badge-teal' },
          { icon: BellRing, label: 'Aguardando Atencao', value: '0', color: '#E81B8F', badge: 'badge-magenta' },
        ].map((item) => (
          <div key={item.label} className="kpi-card">
            <div className="kpi-label">
              <item.icon size={11} color={item.color} strokeWidth={2.5} />
              {item.label.toUpperCase()}
            </div>
            <div className="kpi-value" style={{ color: item.color }}>{item.value}</div>
          </div>
        ))}
      </div>

      <div className="hero-item hero-item-3 card-accent" style={{ padding: '28px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(13,61,204,0.08)', border: '1px solid rgba(13,61,204,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MessageSquare size={24} color="var(--accent)" strokeWidth={1.8} />
          </div>
          <div>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 17, color: 'var(--text-primary)', marginBottom: 3 }}>
              Chat Unificado — Epic 05
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              Interface de monitoramento em tempo real com Supabase Realtime
            </div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            'Lista de conversas ao vivo com filtros',
            'Assumir conversa do bot com 1 clique',
            'Historico completo de mensagens',
            'Devolver conversa ao bot',
            'Notificacoes urgentes (intencao cancelar)',
            'Aprovacao de desconto pelo app',
          ].map((feature) => (
            <div key={feature} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: 'var(--surface-2)', borderRadius: 8 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
