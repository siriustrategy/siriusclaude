import { Settings, Users, Target, MessageSquare, Zap, Shield, Edit } from 'lucide-react'

export default function AdminPage() {
  return (
    <div>
      <div className="page-label hero-item hero-item-0">
        <Settings size={10} strokeWidth={2.5} />
        CONFIGURAÇÕES
      </div>
      <h1 className="hero-item hero-item-1" style={{ fontSize: 26, fontWeight: 800, marginBottom: 6 }}>
        Painel Administrativo
      </h1>
      <p className="hero-item hero-item-2" style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>
        Configure a régua de cobrança, prompt do agente, usuarios e limites operacionais.
      </p>

      <div className="hero-item hero-item-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

        {/* Régua de cobrança */}
        <div className="card-accent" style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(13,61,204,0.08)', border: '1px solid rgba(13,61,204,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Target size={18} color="var(--accent)" strokeWidth={2} />
            </div>
            <div>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 14 }}>Régua de Cobrança</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Prazos e descontos por fase</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { fase: 'Pré / Mês 1-2', desconto: '0%', prazo: 'D-3 a D+60', editavel: false },
              { fase: 'Mês 3', desconto: '5%', prazo: 'D+61 a D+90 (48h)', editavel: true },
              { fase: 'Mês 4', desconto: '15% + 3x', prazo: 'D+91 a D+120', editavel: true },
              { fase: 'Mês 5', desconto: '20%', prazo: 'D+121 a D+150', editavel: true },
            ].map(r => (
              <div key={r.fase} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--surface-2)', borderRadius: 8 }}>
                <div>
                  <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: 13 }}>{r.fase}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{r.prazo}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="badge badge-blue">{r.desconto}</span>
                  {r.editavel ? (
                    <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                      <Edit size={12} color="var(--text-muted)" />
                    </button>
                  ) : (
                    <div style={{ width: 20 }} />
                  )}
                </div>
              </div>
            ))}
          </div>
          <button className="btn-ghost" style={{ marginTop: 12, width: '100%', justifyContent: 'center' }}>
            <Edit size={13} />
            Editar Régua (Epic 03)
          </button>
        </div>

        {/* Prompt do agente */}
        <div className="card-accent card-teal" style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(11,191,170,0.08)', border: '1px solid rgba(11,191,170,0.20)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MessageSquare size={18} color="var(--teal)" strokeWidth={2} />
            </div>
            <div>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 14 }}>Prompt do Agente IA</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Tom de voz, instruções e persona</div>
            </div>
          </div>
          <div style={{ padding: '12px 14px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, marginBottom: 12 }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600 }}>PROMPT ATUAL</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: 1.5 }}>
              Você é um assistente de cobrança da Plano Mais Assistencial. Seu objetivo é ajudar o cliente a regularizar seu plano de forma empática e profissional...
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-ghost" style={{ flex: 1, justifyContent: 'center' }}>
              <Edit size={13} />
              Editar Prompt
            </button>
            <button className="btn-ghost">
              Testar
            </button>
          </div>
        </div>

        {/* Gestão de usuários */}
        <div className="card-accent" style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(13,61,204,0.08)', border: '1px solid rgba(13,61,204,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={18} color="var(--accent)" strokeWidth={2} />
            </div>
            <div>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 14 }}>Usuários do Sistema</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Gestores e atendentes</div>
            </div>
          </div>
          {[
            { nome: 'Breno Nobre', role: 'Gestor', perfil: null, ativo: true },
            { nome: 'Atendente A', role: 'Atendente', perfil: 'A — Negociação', ativo: true },
            { nome: 'Atendente B', role: 'Atendente', perfil: 'B — Retenção', ativo: true },
          ].map(u => (
            <div key={u.nome} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--surface-2)', borderRadius: 8, marginBottom: 6 }}>
              <div>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: 13 }}>{u.nome}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{u.perfil || u.role}</div>
              </div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <span className={`badge ${u.role === 'Gestor' ? 'badge-blue' : 'badge-teal'}`}>{u.role}</span>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: u.ativo ? 'var(--success)' : 'var(--error)' }} />
              </div>
            </div>
          ))}
          <button className="btn-ghost" style={{ marginTop: 8, width: '100%', justifyContent: 'center' }}>
            <Users size={13} />
            Adicionar Usuário
          </button>
        </div>

        {/* Integrações */}
        <div className="card-accent card-warning" style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(214,137,16,0.08)', border: '1px solid rgba(214,137,16,0.20)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={18} color="var(--warning)" strokeWidth={2} />
            </div>
            <div>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 14 }}>Integrações</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Conexões com APIs externas</div>
            </div>
          </div>
          {[
            { nome: 'n8n Webhooks', status: 'pendente', descricao: 'Motor de cobrança automático' },
            { nome: 'Evolution API', status: 'pendente', descricao: 'WhatsApp Business' },
            { nome: 'Asaas API', status: 'pendente', descricao: 'Checkout e pagamentos' },
            { nome: 'Supabase', status: 'conectado', descricao: 'Banco de dados' },
          ].map(int => (
            <div key={int.nome} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--surface-2)', borderRadius: 8, marginBottom: 6 }}>
              <div>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: 12 }}>{int.nome}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{int.descricao}</div>
              </div>
              <span className={`badge ${int.status === 'conectado' ? 'badge-green' : 'badge-gray'}`}>
                {int.status === 'conectado' ? 'Conectado' : 'Pendente'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Auditoria */}
      <div className="hero-item hero-item-4 card-accent" style={{ marginTop: 16, padding: '20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <Shield size={16} color="var(--accent)" />
          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 14 }}>Auditoria & Compliance</div>
          <span className="badge badge-gray" style={{ marginLeft: 'auto' }}>Epic 08</span>
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          Log completo de todas as ações críticas (pagamentos, descontos, encerramentos), exportação CSV, rastreabilidade por usuário e conformidade com LGPD — disponíveis após Epic 08.
        </div>
      </div>
    </div>
  )
}
