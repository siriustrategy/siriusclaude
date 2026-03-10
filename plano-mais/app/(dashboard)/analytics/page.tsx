import { BarChart3, TrendingUp, DollarSign, Target, Users, AlertTriangle, ArrowUp, ArrowDown } from 'lucide-react'

const FUNIL_DATA = [
  { fase: 'Pré-Vencimento', leads: 0, cor: '#0D3DCC' },
  { fase: 'Mês 1 (0%)',     leads: 0, cor: '#3B65FF' },
  { fase: 'Mês 2 (0%)',     leads: 0, cor: '#7C3AED' },
  { fase: 'Mês 3 (5%)',     leads: 0, cor: '#D97706' },
  { fase: 'Mês 4 (15%)',    leads: 0, cor: '#DC2626' },
  { fase: 'Mês 5 (20%)',    leads: 0, cor: '#C0392B' },
  { fase: 'Pós D+150',      leads: 0, cor: '#7A90B8' },
]

export default function AnalyticsPage() {
  return (
    <div>
      <div className="page-label hero-item hero-item-0">
        <BarChart3 size={10} strokeWidth={2.5} />
        ANALYTICS & BI
      </div>
      <h1 className="hero-item hero-item-1" style={{ fontSize: 26, fontWeight: 800, marginBottom: 6 }}>
        Analise Financeira
      </h1>
      <p className="hero-item hero-item-2" style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>
        Dashboard financeiro completo com insights de IA, funil de cobrança e projecoes de receita.
      </p>

      {/* KPIs principais */}
      <div className="hero-item hero-item-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        <div className="kpi-card">
          <div className="kpi-label"><DollarSign size={11} />Total Cobrado</div>
          <div className="kpi-value">R$ 0</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>Este mês</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label"><TrendingUp size={11} color="var(--success)" />Total Arrecadado</div>
          <div className="kpi-value" style={{ color: 'var(--success)' }}>R$ 0</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>Confirmados</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label"><Target size={11} color="var(--accent)" />Taxa de Conversao</div>
          <div className="kpi-value">0%</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>Inadimplentes pagos</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label"><Users size={11} />Ticket Médio</div>
          <div className="kpi-value">R$ 0</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>Por recuperação</div>
        </div>
      </div>

      <div className="hero-item hero-item-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>

        {/* Funil */}
        <div className="card-accent" style={{ padding: '20px 24px' }}>
          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 15, marginBottom: 4 }}>
            Funil de Cobrança
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>
            Distribuição de leads por fase da régua
          </div>
          {FUNIL_DATA.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
              <div style={{ width: 90, fontSize: 11, color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, flexShrink: 0 }}>
                {item.fase.split(' ').slice(0, 2).join(' ')}
              </div>
              <div style={{ flex: 1, height: 6, background: 'var(--surface-2)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ width: `${item.leads}%`, height: '100%', background: item.cor, borderRadius: 3 }} />
              </div>
              <div style={{ width: 24, fontSize: 11, color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif', textAlign: 'right' }}>{item.leads}</div>
            </div>
          ))}
          <div style={{ marginTop: 12, padding: '8px 12px', background: 'rgba(13,61,204,0.04)', borderRadius: 8, fontSize: 12, color: 'var(--text-secondary)' }}>
            Dados reais após integração com n8n (Epic 04)
          </div>
        </div>

        {/* Insights IA */}
        <div className="card-accent card-teal" style={{ padding: '20px 24px' }}>
          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 15, marginBottom: 4 }}>
            Insights de IA
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>
            Padrões detectados e sugestões de ação
          </div>
          {[
            { icon: AlertTriangle, cor: '#E81B8F', texto: 'Leads de Bangu no Mês 3 têm 42% menos conversão — revisar abordagem' },
            { icon: TrendingUp, cor: 'var(--success)', texto: 'Horário ideal de disparo: 10h–11h e 18h–19h (dados dos últimos 30 dias)' },
            { icon: Users, cor: 'var(--accent)', texto: '23 leads têm alto risco de inadimplência no próximo ciclo' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 14, padding: '10px 12px', background: 'var(--surface-2)', borderRadius: 8 }}>
              <item.icon size={14} color={item.cor} strokeWidth={2} style={{ flexShrink: 0, marginTop: 1 }} />
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{item.texto}</span>
            </div>
          ))}
          <div style={{ marginTop: 4, padding: '8px 12px', background: 'rgba(11,191,170,0.06)', borderRadius: 8, fontSize: 12, color: 'var(--text-muted)' }}>
            Insights baseados em dados reais após Epic 07
          </div>
        </div>
      </div>

      {/* Projeção */}
      <div className="hero-item hero-item-4 card-accent card-success" style={{ padding: '20px 24px', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 15, marginBottom: 3 }}>
              Receita Recuperavel — Previsao IA
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              Estimativa de recuperacao para os proximos 30 dias
            </div>
          </div>
          <span className="badge badge-green">Epic 07</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[
            { label: 'Projeção Conservadora', value: 'R$ 0', icon: ArrowDown, cor: 'var(--text-muted)' },
            { label: 'Projeção Base', value: 'R$ 0', icon: TrendingUp, cor: 'var(--accent)' },
            { label: 'Projeção Otimista', value: 'R$ 0', icon: ArrowUp, cor: 'var(--success)' },
          ].map(item => (
            <div key={item.label} style={{ padding: '14px 16px', background: 'var(--surface-2)', borderRadius: 10, textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600 }}>{item.label}</div>
              <item.icon size={16} color={item.cor} style={{ margin: '0 auto 4px' }} />
              <div style={{ fontSize: 20, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, color: item.cor }}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features coming */}
      <div className="hero-item hero-item-4 glass-card" style={{ padding: '20px 24px' }}>
        <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 14, marginBottom: 12 }}>
          Analytics Completo — Epic 07
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          {[
            'Taxa de conversão por fase',
            'Performance por atendente',
            'Motivos de cancelamento (Pareto)',
            'ROI por campanha e canal',
            'Tempo médio de atendimento',
            'NPS pós-conversa',
            'Análise de cohort de pagadores',
            'Custo por lead recuperado',
            'Exportação PDF e CSV',
          ].map(f => (
            <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12, color: 'var(--text-secondary)', padding: '5px 0' }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0, marginTop: 5 }} />
              {f}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
