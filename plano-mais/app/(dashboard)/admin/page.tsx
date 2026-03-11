'use client'

import { useState, useEffect } from 'react'
import {
  Settings, Users, Target, MessageSquare, Zap, Shield,
  Edit, CheckCircle, X, ChevronRight, Save, Plus, Trash2,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

// ===================== MOCK DATA =====================
const REGUA = [
  { fase: 'Pre-vencimento', desconto: '0%', prazo: 'D-3', mensagem: 'Lembrete amigavel', editavel: false },
  { fase: 'Mes 1 (0%)', desconto: '0%', prazo: 'D+1 a D+30', mensagem: 'Cobranca simples', editavel: false },
  { fase: 'Mes 2 (0%)', desconto: '0%', prazo: 'D+31 a D+60', mensagem: 'Segunda cobranca', editavel: false },
  { fase: 'Mes 3 (5%)', desconto: '5%', prazo: 'D+61 a D+90', mensagem: 'Oferta desconto 48h', editavel: true },
  { fase: 'Mes 4 (15% + 3x)', desconto: '15%', prazo: 'D+91 a D+120', mensagem: 'Parcelamento disponivel', editavel: true },
  { fase: 'Mes 5 (20%)', desconto: '20%', prazo: 'D+121 a D+150', mensagem: 'Ultima oferta antes do bloqueio', editavel: true },
]

const USUARIOS = [
  { nome: 'Breno Nobre', role: 'Gestor', perfil: null, ativo: true, ultimo_acesso: 'Agora' },
  { nome: 'Atendente A', role: 'Atendente', perfil: 'Negociacao', ativo: true, ultimo_acesso: 'Ha 2h' },
  { nome: 'Atendente B', role: 'Atendente', perfil: 'Retencao', ativo: false, ultimo_acesso: 'Ontem' },
]

const INTEGRACOES = [
  { nome: 'n8n Webhooks', status: 'pendente', descricao: 'Motor de cobranca automatico', cor: '#D97706' },
  { nome: 'Evolution API', status: 'pendente', descricao: 'WhatsApp Business', cor: '#D97706' },
  { nome: 'Asaas API', status: 'pendente', descricao: 'Checkout e pagamentos', cor: '#D97706' },
  { nome: 'Supabase', status: 'conectado', descricao: 'Banco de dados (produção)', cor: '#1E8449' },
]

// ===================== PAGE =====================
export default function AdminPage() {
  const supabase = createClient()
  const [editandoPrompt, setEditandoPrompt] = useState(false)
  const [prompt, setPrompt] = useState(
    'Voce e um assistente de cobranca da Plano Mais Assistencial. Seu objetivo e ajudar o cliente a regularizar seu plano de forma empatica e profissional. Sempre oferta as condicoes disponiveis para a fase atual do cliente...'
  )

  // Respostas rápidas
  const [respostas, setRespostas] = useState<{ id: string; titulo: string; texto: string; ativo: boolean }[]>([])
  const [novoTitulo, setNovoTitulo] = useState('')
  const [novoTexto, setNovoTexto] = useState('')
  const [salvando, setSalvando] = useState(false)
  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [editTitulo, setEditTitulo] = useState('')
  const [editTexto, setEditTexto] = useState('')

  useEffect(() => {
    loadRespostas()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function loadRespostas() {
    const { data } = await supabase.from('respostas_rapidas')
      .select('id, titulo, texto, ativo')
      .order('ordem', { ascending: true })
    if (data) setRespostas(data)
  }

  async function handleAdicionarResposta() {
    if (!novoTitulo.trim() || !novoTexto.trim()) return
    setSalvando(true)
    const ordem = respostas.length + 1
    const { data } = await supabase.from('respostas_rapidas')
      .insert({ titulo: novoTitulo.trim(), texto: novoTexto.trim(), ordem })
      .select('id, titulo, texto, ativo')
      .single()
    if (data) {
      setRespostas(prev => [...prev, data])
      setNovoTitulo('')
      setNovoTexto('')
    }
    setSalvando(false)
  }

  async function handleToggleResposta(id: string, ativo: boolean) {
    await supabase.from('respostas_rapidas').update({ ativo: !ativo }).eq('id', id)
    setRespostas(prev => prev.map(r => r.id === id ? { ...r, ativo: !ativo } : r))
  }

  async function handleDeletarResposta(id: string) {
    await supabase.from('respostas_rapidas').delete().eq('id', id)
    setRespostas(prev => prev.filter(r => r.id !== id))
  }

  async function handleSalvarEdicao(id: string) {
    if (!editTitulo.trim() || !editTexto.trim()) return
    await supabase.from('respostas_rapidas')
      .update({ titulo: editTitulo.trim(), texto: editTexto.trim() })
      .eq('id', id)
    setRespostas(prev => prev.map(r => r.id === id ? { ...r, titulo: editTitulo, texto: editTexto } : r))
    setEditandoId(null)
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div className="page-label hero-item hero-item-0">
          <Settings size={10} strokeWidth={2.5} />
          CONFIGURACOES
        </div>
        <h1 className="hero-item hero-item-1" style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.03em', margin: '6px 0 4px' }}>
          Painel Administrativo
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
          Regua de cobranca, prompt do agente IA, usuarios e integracoes
        </p>
      </div>

      {/* Regua + Prompt */}
      <div className="hero-item hero-item-2" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16, marginBottom: 16 }}>

        {/* Regua de cobranca */}
        <div className="glass-card" style={{ padding: '20px 24px' }}>
          <div className="page-label" style={{ marginBottom: 12 }}>
            <Target size={9} strokeWidth={2.5} />
            REGUA DE COBRANCA
          </div>
          <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', marginBottom: 14 }}>
            Fases e descontos configurados
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {REGUA.map((r, i) => (
              <div
                key={i}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 12px', background: 'var(--surface-2)',
                  border: r.editavel ? '1px solid rgba(13,61,204,0.15)' : '1px solid var(--border)',
                  borderRadius: 8, gap: 10,
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 12, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.fase}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{r.prazo} · {r.mensagem}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 5,
                    background: r.desconto !== '0%' ? 'rgba(30,132,73,0.10)' : 'var(--surface-2)',
                    color: r.desconto !== '0%' ? '#1E8449' : 'var(--text-muted)',
                    border: `1px solid ${r.desconto !== '0%' ? 'rgba(30,132,73,0.20)' : 'var(--border)'}`,
                    fontFamily: 'Space Grotesk',
                  }}>
                    {r.desconto}
                  </span>
                  {r.editavel ? (
                    <button style={{ background: 'rgba(13,61,204,0.08)', border: '1px solid rgba(13,61,204,0.15)', borderRadius: 6, width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                      <Edit size={11} color="#0D3DCC" strokeWidth={2} />
                    </button>
                  ) : (
                    <div style={{ width: 26, height: 26 }} />
                  )}
                </div>
              </div>
            ))}
          </div>
          <button className="btn-ghost" style={{ marginTop: 12, width: '100%', justifyContent: 'center', fontSize: 12 }}>
            <ChevronRight size={13} />
            Configuracao completa — Epic 03
          </button>
        </div>

        {/* Prompt do agente */}
        <div className="glass-card" style={{ padding: '20px 24px' }}>
          <div className="page-label" style={{ marginBottom: 12 }}>
            <MessageSquare size={9} strokeWidth={2.5} />
            PROMPT DO AGENTE IA
          </div>
          <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', marginBottom: 14 }}>
            Tom de voz e instrucoes
          </div>
          {editandoPrompt ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <textarea
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                className="input-field"
                rows={8}
                style={{ resize: 'vertical', fontFamily: 'DM Sans, sans-serif', lineHeight: 1.6, fontSize: 12 }}
              />
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => setEditandoPrompt(false)}
                  className="btn-primary"
                  style={{ flex: 1, justifyContent: 'center', fontSize: 12 }}
                >
                  <Save size={13} /> Salvar prompt
                </button>
                <button
                  onClick={() => setEditandoPrompt(false)}
                  style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, width: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  <X size={14} color="var(--text-muted)" strokeWidth={2} />
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ padding: '12px 14px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, marginBottom: 12 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'Space Grotesk', marginBottom: 6, letterSpacing: '0.05em' }}>PROMPT ATUAL</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 5, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {prompt}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => setEditandoPrompt(true)}
                  className="btn-primary"
                  style={{ flex: 1, justifyContent: 'center', fontSize: 12 }}
                >
                  <Edit size={13} /> Editar Prompt
                </button>
                <button className="btn-ghost" style={{ fontSize: 12 }}>
                  Testar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Usuarios + Integracoes */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>

        {/* Usuarios */}
        <div className="glass-card" style={{ padding: '20px 24px' }}>
          <div className="page-label" style={{ marginBottom: 12 }}>
            <Users size={9} strokeWidth={2.5} />
            USUARIOS DO SISTEMA
          </div>
          <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', marginBottom: 14 }}>
            Gestores e atendentes
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {USUARIOS.map((u, i) => (
              <div
                key={i}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 12px', background: 'var(--surface-2)',
                  border: '1px solid var(--border)', borderRadius: 8,
                }}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                  background: u.role === 'Gestor' ? 'rgba(13,61,204,0.10)' : 'rgba(11,191,170,0.10)',
                  border: `1px solid ${u.role === 'Gestor' ? 'rgba(13,61,204,0.20)' : 'rgba(11,191,170,0.20)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: 13,
                  color: u.role === 'Gestor' ? '#0D3DCC' : '#0BBFAA',
                }}>
                  {u.nome.split(' ').map(n => n[0]).slice(0, 2).join('')}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>{u.nome}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{u.perfil || u.role} · {u.ultimo_acesso}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 5,
                    background: u.role === 'Gestor' ? 'rgba(13,61,204,0.08)' : 'rgba(11,191,170,0.08)',
                    color: u.role === 'Gestor' ? '#0D3DCC' : '#0BBFAA',
                    fontFamily: 'Space Grotesk',
                  }}>
                    {u.role}
                  </span>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: u.ativo ? '#25D366' : '#DC2626', boxShadow: u.ativo ? '0 0 4px #25D36680' : 'none' }} />
                </div>
              </div>
            ))}
          </div>
          <button className="btn-ghost" style={{ marginTop: 10, width: '100%', justifyContent: 'center', fontSize: 12 }}>
            <Users size={13} /> Convidar usuario
          </button>
        </div>

        {/* Integracoes */}
        <div className="glass-card" style={{ padding: '20px 24px' }}>
          <div className="page-label" style={{ marginBottom: 12 }}>
            <Zap size={9} strokeWidth={2.5} />
            INTEGRACOES
          </div>
          <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', marginBottom: 14 }}>
            Conexoes com APIs externas
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {INTEGRACOES.map((int, i) => (
              <div
                key={i}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '11px 12px', background: 'var(--surface-2)',
                  border: `1px solid ${int.status === 'conectado' ? 'rgba(30,132,73,0.15)' : 'var(--border)'}`,
                  borderRadius: 8,
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>{int.nome}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>{int.descricao}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                  {int.status === 'conectado'
                    ? <CheckCircle size={13} color="#1E8449" strokeWidth={2} />
                    : <X size={13} color="#D97706" strokeWidth={2} />
                  }
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 5, fontFamily: 'Space Grotesk',
                    background: int.status === 'conectado' ? 'rgba(30,132,73,0.10)' : 'rgba(217,119,6,0.10)',
                    color: int.status === 'conectado' ? '#1E8449' : '#D97706',
                  }}>
                    {int.status === 'conectado' ? 'Conectado' : 'Pendente'}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <button className="btn-ghost" style={{ marginTop: 10, width: '100%', justifyContent: 'center', fontSize: 12 }}>
            <Zap size={13} /> Configurar integracoes
          </button>
        </div>
      </div>

      {/* Auditoria */}
      <div className="glass-card" style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(13,61,204,0.08)', border: '1px solid rgba(13,61,204,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shield size={15} color="var(--accent)" strokeWidth={2} />
          </div>
          <div>
            <div className="page-label" style={{ marginBottom: 0 }}>
              <Shield size={9} strokeWidth={2.5} />
              AUDITORIA & COMPLIANCE
            </div>
          </div>
          <span style={{ marginLeft: 'auto', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 5, background: 'var(--surface-2)', color: 'var(--text-muted)', fontFamily: 'Space Grotesk', border: '1px solid var(--border)' }}>
            Epic 08
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {[
            { label: 'Log de acoes criticas', desc: 'Pagamentos, descontos, encerramentos' },
            { label: 'Rastreabilidade', desc: 'Por usuario, data e tipo de acao' },
            { label: 'Conformidade LGPD', desc: 'Exportacao e exclusao de dados' },
          ].map(item => (
            <div key={item.label} style={{ padding: '12px 14px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, opacity: 0.7 }}>
              <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 12, color: 'var(--text-secondary)', marginBottom: 3 }}>{item.label}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.desc}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>
          Log completo e exportacao CSV disponiveis apos implementacao do Epic 08.
        </div>
      </div>

      {/* ====== Respostas Padrão ====== */}
      <div className="glass-card hero-item hero-item-5" style={{ padding: '20px 24px', marginTop: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <div className="page-label" style={{ marginBottom: 6 }}>
              <MessageSquare size={9} strokeWidth={2.5} />
              RESPOSTAS PADRAO DO CHAT
            </div>
            <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>
              Mensagens rapidas dos atendentes
            </div>
          </div>
          <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 5, background: 'rgba(13,61,204,0.08)', color: '#0D3DCC', fontFamily: 'Space Grotesk', border: '1px solid rgba(13,61,204,0.15)' }}>
            {respostas.filter(r => r.ativo).length} ativas
          </span>
        </div>

        {/* Lista de respostas existentes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
          {respostas.map(r => (
            <div key={r.id} style={{
              padding: '12px 14px', borderRadius: 10,
              background: r.ativo ? 'var(--surface-2)' : 'transparent',
              border: r.ativo ? '1px solid var(--border)' : '1px dashed var(--border)',
              opacity: r.ativo ? 1 : 0.5,
            }}>
              {editandoId === r.id ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <input
                    className="input-field"
                    value={editTitulo}
                    onChange={e => setEditTitulo(e.target.value)}
                    placeholder="Título"
                    style={{ fontSize: 12 }}
                  />
                  <textarea
                    className="input-field"
                    value={editTexto}
                    onChange={e => setEditTexto(e.target.value)}
                    placeholder="Texto da resposta"
                    style={{ resize: 'none', height: 60, fontSize: 12 }}
                  />
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn-primary" style={{ fontSize: 12, padding: '6px 14px' }}
                      onClick={() => handleSalvarEdicao(r.id)}>
                      <Save size={12} /> Salvar
                    </button>
                    <button className="btn-ghost" style={{ fontSize: 12 }}
                      onClick={() => setEditandoId(null)}>
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 13, color: 'var(--text-primary)', marginBottom: 3 }}>{r.titulo}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.4 }}>{r.texto}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexShrink: 0, marginLeft: 8 }}>
                    <button
                      onClick={() => { setEditandoId(r.id); setEditTitulo(r.titulo); setEditTexto(r.texto) }}
                      style={{ background: 'rgba(13,61,204,0.08)', border: '1px solid rgba(13,61,204,0.15)', borderRadius: 6, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                    >
                      <Edit size={11} color="#0D3DCC" />
                    </button>
                    <button
                      onClick={() => handleToggleResposta(r.id, r.ativo)}
                      style={{ background: r.ativo ? 'rgba(30,132,73,0.08)' : 'var(--surface-2)', border: `1px solid ${r.ativo ? 'rgba(30,132,73,0.20)' : 'var(--border)'}`, borderRadius: 6, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                      title={r.ativo ? 'Desativar' : 'Ativar'}
                    >
                      <CheckCircle size={11} color={r.ativo ? '#1E8449' : 'var(--text-muted)'} />
                    </button>
                    <button
                      onClick={() => handleDeletarResposta(r.id)}
                      style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.15)', borderRadius: 6, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                    >
                      <Trash2 size={11} color="#DC2626" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {respostas.length === 0 && (
            <div style={{ fontSize: 13, color: 'var(--text-muted)', padding: '16px 0' }}>
              Nenhuma resposta cadastrada ainda.
            </div>
          )}
        </div>

        {/* Formulário de nova resposta */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
          <div style={{ fontSize: 11, fontFamily: 'Space Grotesk', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: 10 }}>
            ADICIONAR NOVA RESPOSTA
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr auto', gap: 10, alignItems: 'flex-end' }}>
            <input
              className="input-field"
              placeholder="Título (ex: Saudação)"
              value={novoTitulo}
              onChange={e => setNovoTitulo(e.target.value)}
              style={{ fontSize: 12 }}
            />
            <input
              className="input-field"
              placeholder="Texto da resposta..."
              value={novoTexto}
              onChange={e => setNovoTexto(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleAdicionarResposta() }}
              style={{ fontSize: 12 }}
            />
            <button
              className="btn-primary"
              onClick={handleAdicionarResposta}
              disabled={!novoTitulo.trim() || !novoTexto.trim() || salvando}
              style={{ padding: '9px 16px', fontSize: 12, flexShrink: 0 }}
            >
              <Plus size={13} />
              Adicionar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
