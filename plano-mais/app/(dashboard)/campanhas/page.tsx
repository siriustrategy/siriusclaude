import { Megaphone, Plus, Filter, BarChart3, Users, Send, Clock, CheckCircle } from 'lucide-react'

const CAMPANHAS_MOCK = [
  { id: 1, nome: 'Desconto Mês 3 — Março/26', status: 'concluida', enviados: 142, lidos: 89, convertidos: 23, custo: 18.50, data: '2026-03-01' },
  { id: 2, nome: 'Retenção Alto Risco — Semana 10', status: 'em_execucao', enviados: 67, lidos: 41, convertidos: 8, custo: 8.70, data: '2026-03-08' },
  { id: 3, nome: 'Pré-Vencimento Abril', status: 'agendada', enviados: 0, lidos: 0, convertidos: 0, custo: 0, data: '2026-03-28' },
]

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    rascunho:     { label: 'Rascunho',       cls: 'badge-gray' },
    agendada:     { label: 'Agendada',        cls: 'badge-blue' },
    em_execucao:  { label: 'Em Execução',     cls: 'badge-teal' },
    pausada:      { label: 'Pausada',         cls: 'badge-orange' },
    concluida:    { label: 'Concluída',       cls: 'badge-green' },
    cancelada:    { label: 'Cancelada',       cls: 'badge-red' },
  }
  const s = map[status] || { label: status, cls: 'badge-gray' }
  return <span className={`badge ${s.cls}`}>{s.label}</span>
}

export default function CampanhasPage() {
  return (
    <div>
      <div className="page-label hero-item hero-item-0">
        <Megaphone size={10} strokeWidth={2.5} />
        CAMPANHA MANAGER
      </div>
      <h1 className="hero-item hero-item-1" style={{ fontSize: 26, fontWeight: 800, marginBottom: 6 }}>
        Campanhas de Disparo
      </h1>
      <p className="hero-item hero-item-2" style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>
        Crie, segmente e dispare campanhas manuais personalizadas via WhatsApp com apoio de IA.
      </p>

      {/* KPIs */}
      <div className="hero-item hero-item-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        <div className="kpi-card">
          <div className="kpi-label"><Megaphone size={11} strokeWidth={2.5} />Campanhas Ativas</div>
          <div className="kpi-value" style={{ color: 'var(--teal)' }}>1</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>Em execução agora</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label"><Send size={11} strokeWidth={2.5} />Total Enviados</div>
          <div className="kpi-value">209</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>Este mês</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label"><CheckCircle size={11} strokeWidth={2.5} color="var(--success)" />Convertidos</div>
          <div className="kpi-value" style={{ color: 'var(--success)' }}>31</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>Pagamentos gerados</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label"><BarChart3 size={11} strokeWidth={2.5} color="var(--accent)" />Taxa de Conversão</div>
          <div className="kpi-value">14.8%</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>Média das campanhas</div>
        </div>
      </div>

      {/* Barra de ações */}
      <div className="hero-item hero-item-2" style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <div style={{ flex: 1 }} />
        <button className="btn-ghost"><Filter size={14} strokeWidth={2} />Filtrar</button>
        <button className="btn-primary"><Plus size={14} strokeWidth={2} />Nova Campanha</button>
      </div>

      {/* Lista de campanhas */}
      <div className="hero-item hero-item-3 glass-card" style={{ overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Campanha</th>
              <th>Status</th>
              <th>Enviados</th>
              <th>Lidos</th>
              <th>Convertidos</th>
              <th>Taxa</th>
              <th>Custo</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
            {CAMPANHAS_MOCK.map(c => (
              <tr key={c.id} style={{ cursor: 'pointer' }}>
                <td>
                  <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: 13 }}>{c.nome}</div>
                </td>
                <td><StatusBadge status={c.status} /></td>
                <td style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600 }}>{c.enviados}</td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: 13 }}>{c.lidos}</span>
                    {c.enviados > 0 && (
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{Math.round((c.lidos / c.enviados) * 100)}%</span>
                    )}
                  </div>
                </td>
                <td style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, color: 'var(--success)' }}>{c.convertidos}</td>
                <td>
                  {c.enviados > 0 ? (
                    <span className={`badge ${c.convertidos / c.enviados >= 0.15 ? 'badge-green' : 'badge-orange'}`}>
                      {((c.convertidos / c.enviados) * 100).toFixed(1)}%
                    </span>
                  ) : <span className="badge badge-gray">—</span>}
                </td>
                <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                  {c.custo > 0 ? `R$ ${c.custo.toFixed(2)}` : '—'}
                </td>
                <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{c.data}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Coming soon */}
      <div className="hero-item hero-item-4 card-accent" style={{ marginTop: 20, padding: '20px 24px' }}>
        <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 14, marginBottom: 12 }}>
          Funcionalidades completas — Epic 06
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {[
            'Builder de template com variaveis personalizadas',
            'Segmentacao por fase, bairro, tags e perfil',
            'Geracao de conteudo por IA (Claude)',
            'Preview com dados reais de 3 leads',
            'Disparo em lotes de 50 com intervalo',
            'Historico completo com metricas por campanha',
          ].map(f => (
            <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12, color: 'var(--text-secondary)', padding: '6px 0' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0, marginTop: 4 }} />
              {f}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
