import { DollarSign, TrendingDown, MessageSquare, Cpu, Zap, BarChart3 } from 'lucide-react'

const CUSTOS_TIPOS = [
  { tipo: 'Mensagem WhatsApp', icone: MessageSquare, cor: '#25D366', custo_unitario: 'R$ 0,12', volume: 0, total: 0 },
  { tipo: 'Chamada LLM (Claude)', icone: Cpu, cor: '#0D3DCC', custo_unitario: 'R$ 0,08', volume: 0, total: 0 },
  { tipo: 'API Asaas (checkout)', icone: Zap, cor: '#F59E0B', custo_unitario: 'R$ 0,10', volume: 0, total: 0 },
]

export default function CustosPage() {
  return (
    <div>
      <div className="page-label hero-item hero-item-0">
        <DollarSign size={10} strokeWidth={2.5} />
        CUSTO DE OPERAÇÃO
      </div>
      <h1 className="hero-item hero-item-1" style={{ fontSize: 26, fontWeight: 800, marginBottom: 6 }}>
        Controle de Custos
      </h1>
      <p className="hero-item hero-item-2" style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>
        Acompanhe o ROI da operação, custo por lead e custo total de cada canal e campanha.
      </p>

      {/* KPIs */}
      <div className="hero-item hero-item-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        <div className="kpi-card">
          <div className="kpi-label"><DollarSign size={11} />Custo Total</div>
          <div className="kpi-value">R$ 0</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>Este mês</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label"><TrendingDown size={11} color="var(--success)" />Custo/Lead</div>
          <div className="kpi-value" style={{ color: 'var(--success)' }}>R$ 0</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>Médio por inadimplente</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label"><BarChart3 size={11} color="var(--accent)" />ROI</div>
          <div className="kpi-value">0x</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>Recuperado / Investido</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label"><Zap size={11} color="var(--warning)" />Alertas</div>
          <div className="kpi-value">0</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>Limites excedidos</div>
        </div>
      </div>

      {/* Tabela de custos por tipo */}
      <div className="hero-item hero-item-3 glass-card" style={{ overflow: 'hidden', marginBottom: 20 }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 14 }}>Custo por Canal — Este Mês</div>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Canal / Tipo</th>
              <th>Custo Unitário</th>
              <th>Volume</th>
              <th>Total</th>
              <th>% do Total</th>
            </tr>
          </thead>
          <tbody>
            {CUSTOS_TIPOS.map(item => (
              <tr key={item.tipo}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 7, background: `${item.cor}15`, border: `1px solid ${item.cor}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <item.icone size={13} color={item.cor} strokeWidth={2} />
                    </div>
                    <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: 13 }}>{item.tipo}</span>
                  </div>
                </td>
                <td style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500, fontSize: 13, color: 'var(--text-secondary)' }}>{item.custo_unitario}</td>
                <td style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600 }}>{item.volume}</td>
                <td style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, color: 'var(--text-primary)' }}>
                  R$ {item.total.toFixed(2)}
                </td>
                <td><span className="badge badge-gray">—</span></td>
              </tr>
            ))}
            <tr style={{ background: 'var(--surface-2)' }}>
              <td colSpan={3} style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 13 }}>Total</td>
              <td style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 14, color: 'var(--accent)' }}>R$ 0,00</td>
              <td><span className="badge badge-blue">100%</span></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ROI visual */}
      <div className="hero-item hero-item-4 card-accent card-success" style={{ padding: '20px 24px', marginBottom: 20 }}>
        <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 15, marginBottom: 16 }}>
          ROI da Operação
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          {[
            { label: 'Valor Recuperado', value: 'R$ 0', desc: 'Pagamentos confirmados' },
            { label: 'Custo Total Investido', value: 'R$ 0', desc: 'Todas as operações' },
            { label: 'ROI', value: '—', desc: 'Retorno sobre investimento' },
          ].map(item => (
            <div key={item.label} style={{ padding: '14px 16px', background: 'var(--surface-2)', borderRadius: 10 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600 }}>{item.label}</div>
              <div style={{ fontSize: 20, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, color: 'var(--text-primary)' }}>{item.value}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features coming */}
      <div className="hero-item hero-item-4 glass-card" style={{ padding: '20px 24px' }}>
        <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 14, marginBottom: 12 }}>
          Cost Tracker Completo — Epic 08
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {[
            'Registro automático de custos via n8n workflows',
            'Custo por lead individual e por campanha',
            'Alerta quando custo diário excede limite',
            'Histórico diário / semanal / mensal',
            'Custo de infraestrutura (Supabase, Railway)',
            'Exportação CSV para análise externa',
          ].map(f => (
            <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12, color: 'var(--text-secondary)', padding: '5px 0' }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--success)', flexShrink: 0, marginTop: 5 }} />
              {f}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
