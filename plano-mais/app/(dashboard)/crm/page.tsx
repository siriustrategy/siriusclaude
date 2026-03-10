import { Users, Search, Filter } from 'lucide-react'

export default function CRMPage() {
  return (
    <div>
      <div className="page-label hero-item hero-item-0">
        <Users size={10} strokeWidth={2.5} />
        CRM
      </div>
      <h1 className="hero-item hero-item-1" style={{ fontSize: 26, fontWeight: 800, marginBottom: 6 }}>
        Gestao de Leads
      </h1>
      <p className="hero-item hero-item-2" style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 28 }}>
        Central de todos os inadimplentes com ficha completa, score e historico.
      </p>

      {/* Barra de busca + filtros */}
      <div className="hero-item hero-item-2" style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} strokeWidth={2} />
          <input className="input-field" placeholder="Buscar por nome, telefone ou CPF..." style={{ paddingLeft: 38 }} />
        </div>
        <button className="btn-ghost">
          <Filter size={14} strokeWidth={2} />
          Filtros
        </button>
        <button className="btn-primary">
          <Users size={14} strokeWidth={2} />
          Importar Leads
        </button>
      </div>

      {/* Tabs de fase */}
      <div className="hero-item hero-item-3" style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {['Todos', 'Pre', 'Mes 1', 'Mes 2', 'Mes 3', 'Mes 4', 'Mes 5', 'Pos'].map((tab, i) => (
          <button
            key={tab}
            style={{
              padding: '6px 14px',
              borderRadius: 100,
              border: i === 0 ? '1.5px solid var(--accent)' : '1px solid var(--border)',
              background: i === 0 ? 'rgba(13,61,204,0.08)' : 'var(--card-bg)',
              color: i === 0 ? 'var(--accent)' : 'var(--text-secondary)',
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: i === 0 ? 700 : 500,
              fontSize: 12,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tabela placeholder */}
      <div className="hero-item hero-item-3 glass-card" style={{ overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Lead</th>
              <th>Plano</th>
              <th>Fase</th>
              <th>Dias em Atraso</th>
              <th>Valor em Aberto</th>
              <th>Score</th>
              <th>Ultima Interacao</th>
              <th>Acao</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={8} style={{ textAlign: 'center', padding: '48px 0' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: 'var(--surface-2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Users size={22} color="var(--text-muted)" strokeWidth={1.8} />
                  </div>
                  <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: 14, color: 'var(--text-secondary)' }}>
                    Nenhum lead cadastrado ainda
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    Importe uma planilha ou configure a integracao com o n8n
                  </div>
                  <div style={{ marginTop: 4, display: 'flex', gap: 10 }}>
                    <span className="badge badge-blue">Epic 02 — CRM Completo</span>
                    <span className="badge badge-gray">Epic 04 — n8n Importacao</span>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
