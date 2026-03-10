import { TrendingUp, Users, DollarSign, Target, AlertTriangle, Clock, CheckCircle } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div>
      {/* Page label */}
      <div className="page-label hero-item hero-item-0">
        <TrendingUp size={10} strokeWidth={2.5} />
        MEU PAINEL
      </div>

      {/* Titulo */}
      <h1 className="hero-item hero-item-1" style={{ fontSize: 28, fontWeight: 800, marginBottom: 6, letterSpacing: '-0.03em' }}>
        Ola, Gestor! Bom dia.
      </h1>
      <p className="hero-item hero-item-2" style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 28 }}>
        Aqui esta o resumo da operacao de hoje.
      </p>

      {/* KPIs principais */}
      <div className="hero-item hero-item-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <div className="kpi-card">
          <div className="kpi-label">
            <DollarSign size={11} strokeWidth={2.5} />
            Total Cobrado
          </div>
          <div className="kpi-value">R$ 0</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>Este mes</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">
            <CheckCircle size={11} strokeWidth={2.5} />
            Total Arrecadado
          </div>
          <div className="kpi-value" style={{ color: 'var(--success)' }}>R$ 0</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>Pagamentos confirmados</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">
            <Target size={11} strokeWidth={2.5} />
            Taxa de Conversao
          </div>
          <div className="kpi-value">0%</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>Inadimplentes pagos</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">
            <Users size={11} strokeWidth={2.5} />
            Leads Ativos
          </div>
          <div className="kpi-value">0</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>Em cobranca agora</div>
        </div>
      </div>

      {/* Cards de acao rapida — estilo Sirius Academy com borda lateral */}
      <div className="hero-item hero-item-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>

        {/* Funil de cobranca */}
        <div className="card-accent" style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <div className="page-label" style={{ marginBottom: 8, background: 'rgba(13,61,204,0.06)' }}>
                <Target size={10} strokeWidth={2.5} />
                FUNIL DE COBRANCA
              </div>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 16, color: 'var(--text-primary)' }}>
                Leads por fase
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
                Distribuicao atual de todos os inadimplentes
              </div>
            </div>
          </div>

          {/* Fases placeholder */}
          {['Pre-vencimento', 'Mes 1', 'Mes 2', 'Mes 3 (5%)', 'Mes 4 (15%)', 'Mes 5 (20%)'].map((fase, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
              <div style={{ width: 60, fontSize: 11, color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, flexShrink: 0 }}>
                {fase.split(' ')[0]} {fase.split(' ')[1] || ''}
              </div>
              <div style={{ flex: 1, height: 6, background: 'var(--surface-2)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ width: '0%', height: '100%', background: 'var(--accent)', borderRadius: 3 }} />
              </div>
              <div style={{ width: 20, fontSize: 11, color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif', textAlign: 'right' }}>0</div>
            </div>
          ))}

          <div style={{ marginTop: 12, padding: '10px 14px', background: 'var(--surface-2)', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertTriangle size={14} color="var(--warning)" strokeWidth={2} />
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Analytics completo disponivel no Epic 07</span>
          </div>
        </div>

        {/* Alertas e acoes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Leads urgentes */}
          <div className="card-accent card-magenta" style={{ padding: '20px 24px' }}>
            <div className="page-label" style={{ marginBottom: 10, background: 'rgba(232,27,143,0.08)', color: 'var(--magenta)', borderColor: 'rgba(232,27,143,0.20)' }}>
              <AlertTriangle size={10} strokeWidth={2.5} />
              ATENCAO
            </div>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', marginBottom: 4 }}>
              Leads com intencao de cancelar
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>
              Atendente B deve ser acionado imediatamente
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif', color: 'var(--magenta)' }}>0</div>
          </div>

          {/* Conversas ativas */}
          <div className="card-accent card-teal" style={{ padding: '20px 24px' }}>
            <div className="page-label" style={{ marginBottom: 10, background: 'rgba(11,191,170,0.08)', color: '#0A7A6A', borderColor: 'rgba(11,191,170,0.20)' }}>
              <Clock size={10} strokeWidth={2.5} />
              TEMPO REAL
            </div>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', marginBottom: 4 }}>
              Conversas ativas agora
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>
              Bot e atendentes em operacao
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif', color: 'var(--teal)' }}>0</div>
          </div>
        </div>
      </div>

      {/* Proximos epics */}
      <div className="hero-item hero-item-4">
        <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--text-secondary)', marginBottom: 12, letterSpacing: '0.02em' }}>
          ROADMAP DE DESENVOLVIMENTO
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {[
            { epic: 'Epic 02', nome: 'CRM — Leads', status: 'proximo', cor: '#0D3DCC' },
            { epic: 'Epic 03', nome: 'Motor de Cobranca', status: 'proximo', cor: '#7C3AED' },
            { epic: 'Epic 04', nome: 'n8n Automacoes', status: 'planejado', cor: '#D97706' },
            { epic: 'Epic 05', nome: 'Chat Dashboard', status: 'planejado', cor: '#0BBFAA' },
            { epic: 'Epic 07', nome: 'Analytics & BI', status: 'planejado', cor: '#1E8449' },
            { epic: 'Epic 09', nome: 'Checkout Asaas', status: 'planejado', cor: '#E81B8F' },
          ].map((item) => (
            <div key={item.epic} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 16px',
              background: 'var(--card-bg)',
              border: '1px solid var(--card-border)',
              borderLeft: `3px solid ${item.cor}`,
              borderRadius: 10,
              boxShadow: 'var(--card-shadow)',
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: 2 }}>
                  {item.epic}
                </div>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                  {item.nome}
                </div>
              </div>
              <span className={`badge ${item.status === 'proximo' ? 'badge-blue' : 'badge-gray'}`}>
                {item.status === 'proximo' ? 'Proximo' : 'Planejado'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
