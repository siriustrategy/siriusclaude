'use client'

import { useState } from 'react'
import { MessageSquare, Bot, UserCheck, BellRing, Search, Filter, ChevronRight, Send, ArrowLeft, Phone, MoreVertical, AlertTriangle, Clock, CheckCheck, Check, Wifi } from 'lucide-react'
import { getFaseBadge, getRiscoBadge, formatRelativeTime, getAvatarColor } from '@/lib/utils'

// ============================================================
// MOCK DATA — conversas ativas
// ============================================================
const mockConversas = [
  {
    id: 'c1', lead_id: '1',
    nome: 'Maria Santos', telefone: '(21) 99999-1111',
    plano: 'Plano Essencial', fase: 'mes1', risco: 'baixo',
    tipo: 'BOT', status: 'aberta',
    ultima_mensagem: 'Ok, vou verificar o link de pagamento agora!',
    ultima_msg_remetente: 'LEAD',
    hora: '10:34',
    nao_lidas: 1,
    prioridade: false,
  },
  {
    id: 'c2', lead_id: '3',
    nome: 'Ana Costa', telefone: '(21) 97777-3333',
    plano: 'Plano Familiar', fase: 'mes4', risco: 'alto',
    tipo: 'HUMANO', status: 'aberta',
    ultima_mensagem: 'Não consigo pagar tudo de uma vez, tem como parcelar?',
    ultima_msg_remetente: 'LEAD',
    hora: '10:21',
    nao_lidas: 3,
    prioridade: true,
  },
  {
    id: 'c3', lead_id: '5',
    nome: 'Fernanda Lima', telefone: '(21) 95555-5555',
    plano: 'Plano Familiar', fase: 'mes5', risco: 'alto',
    tipo: 'BOT', status: 'aberta',
    ultima_mensagem: 'Essa oferta de 20% está me ajudando bastante. Posso pensar?',
    ultima_msg_remetente: 'LEAD',
    hora: '09:58',
    nao_lidas: 0,
    prioridade: false,
  },
  {
    id: 'c4', lead_id: '4',
    nome: 'Carlos Pereira', telefone: '(21) 96666-4444',
    plano: 'Plano Essencial', fase: 'pre', risco: 'baixo',
    tipo: 'BOT', status: 'aberta',
    ultima_mensagem: 'Entendido, muito obrigado!',
    ultima_msg_remetente: 'LEAD',
    hora: '08:15',
    nao_lidas: 0,
    prioridade: false,
  },
  {
    id: 'c5', lead_id: '2',
    nome: 'João Oliveira', telefone: '(21) 98888-2222',
    plano: 'Plano Premium', fase: 'mes3', risco: 'medio',
    tipo: 'BOT', status: 'transferida',
    ultima_mensagem: 'Preciso falar com um atendente humano.',
    ultima_msg_remetente: 'LEAD',
    hora: 'Ontem',
    nao_lidas: 0,
    prioridade: false,
  },
]

const mockMensagens: Record<string, Array<{id: string; remetente: 'BOT' | 'LEAD' | 'ATENDENTE'; conteudo: string; hora: string; status?: string}>> = {
  c1: [
    { id: 'm1', remetente: 'BOT', conteudo: 'Olá, Maria! Notamos que seu Plano Essencial venceu há 15 dias. O valor em aberto é R$ 189,90. Clique no link abaixo para regularizar com facilidade 👇', hora: '08:00' },
    { id: 'm2', remetente: 'BOT', conteudo: 'https://pagar.planomais.com.br/r/maria-jan26', hora: '08:00' },
    { id: 'm3', remetente: 'LEAD', conteudo: 'Oi! Quanto é o boleto mesmo?', hora: '10:30', status: 'lido' },
    { id: 'm4', remetente: 'BOT', conteudo: 'Maria, o valor total em aberto é R$ 189,90. Você pode pagar via PIX, cartão de crédito ou boleto. O pagamento é confirmado na hora pelo PIX! Deseja o link atualizado?', hora: '10:31' },
    { id: 'm5', remetente: 'LEAD', conteudo: 'Ok, vou verificar o link de pagamento agora!', hora: '10:34', status: 'lido' },
  ],
  c2: [
    { id: 'm1', remetente: 'BOT', conteudo: 'Olá, Ana! Seu Plano Familiar está em aberto há 107 dias. Temos uma oferta especial de 15% de desconto disponível para você hoje! O valor fica R$ 1.147,50.', hora: '09:00' },
    { id: 'm2', remetente: 'LEAD', conteudo: 'Nossa, tá caro assim. Sei lá né', hora: '09:45', status: 'lido' },
    { id: 'm3', remetente: 'BOT', conteudo: 'Entendo, Ana. Além do desconto de 15%, você pode parcelar em até 3x sem juros. Assim fica R$ 382,50 por mês. O que acha?', hora: '09:45' },
    { id: 'm4', remetente: 'LEAD', conteudo: 'Não consigo pagar tudo de uma vez, tem como parcelar?', hora: '10:21', status: 'lido' },
    { id: 'm5', remetente: 'LEAD', conteudo: 'Mas precisa ser um valor menor que esse ainda', hora: '10:21', status: 'lido' },
    { id: 'm6', remetente: 'LEAD', conteudo: 'Será que tem desconto maior?', hora: '10:22', status: 'lido' },
  ],
  c3: [
    { id: 'm1', remetente: 'BOT', conteudo: 'Fernanda, seu plano está há 138 dias em atraso. Essa é nossa melhor oferta: 20% de desconto + parcelamento em 3x. Valor total: R$ 720,00 (3x de R$ 240,00).', hora: '09:50' },
    { id: 'm2', remetente: 'LEAD', conteudo: 'Tô passando por um momento difícil financeiramente', hora: '09:55', status: 'lido' },
    { id: 'm3', remetente: 'BOT', conteudo: 'Entendo completamente, Fernanda. Sabemos que isso não é fácil. Você tem uma filha pequena e o plano cobre pediatria, o que é essencial. Essa oferta de 20% é a melhor que podemos oferecer e ela garante que sua família continue protegida.', hora: '09:56' },
    { id: 'm4', remetente: 'LEAD', conteudo: 'Essa oferta de 20% está me ajudando bastante. Posso pensar?', hora: '09:58', status: 'lido' },
  ],
  c4: [
    { id: 'm1', remetente: 'BOT', conteudo: 'Boa tarde, Carlos! Seu Plano Essencial venceu há 5 dias. O valor é R$ 189,90. Aqui está o link para pagamento fácil:', hora: '08:00' },
    { id: 'm2', remetente: 'BOT', conteudo: 'https://pagar.planomais.com.br/r/carlos-mar26', hora: '08:00' },
    { id: 'm3', remetente: 'LEAD', conteudo: 'Vou pagar hoje à tarde', hora: '08:10', status: 'lido' },
    { id: 'm4', remetente: 'BOT', conteudo: 'Ótimo, Carlos! O link fica ativo por 7 dias. Qualquer dúvida estou aqui.', hora: '08:10' },
    { id: 'm5', remetente: 'LEAD', conteudo: 'Entendido, muito obrigado!', hora: '08:15', status: 'lido' },
  ],
  c5: [
    { id: 'm1', remetente: 'BOT', conteudo: 'João, seu Plano Premium venceu há 75 dias. Temos um desconto especial de 5% disponível (válido 48h): R$ 569,81 ao invés de R$ 599,80.', hora: '14:00' },
    { id: 'm2', remetente: 'LEAD', conteudo: 'Quero falar com uma pessoa, não com robô', hora: '14:30', status: 'lido' },
    { id: 'm3', remetente: 'BOT', conteudo: 'Entendo, João! Vou transferir você para um de nossos atendentes agora mesmo. Aguarde um momento.', hora: '14:30' },
    { id: 'm4', remetente: 'LEAD', conteudo: 'Preciso falar com um atendente humano.', hora: '14:31', status: 'lido' },
  ],
}

function Avatar({ nome, size = 36 }: { nome: string; size?: number }) {
  const color = getAvatarColor(nome)
  const initials = nome.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase()
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.28, flexShrink: 0,
      background: `linear-gradient(135deg, ${color} 0%, ${color}AA 100%)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700,
      fontSize: size * 0.33, color: '#FFF',
    }}>{initials}</div>
  )
}

export default function ChatPage() {
  const [conversaAtiva, setConversaAtiva] = useState(mockConversas[1]) // Ana Costa — urgente
  const [mensagem, setMensagem] = useState('')
  const [filtro, setFiltro] = useState<'todos' | 'bot' | 'humano' | 'aguardando'>('todos')

  const conversasFiltradas = mockConversas.filter(c => {
    if (filtro === 'todos') return true
    if (filtro === 'bot') return c.tipo === 'BOT' && c.status === 'aberta'
    if (filtro === 'humano') return c.tipo === 'HUMANO'
    if (filtro === 'aguardando') return c.status === 'transferida'
    return true
  })

  const msgs = mockMensagens[conversaAtiva.id] || []
  const fase = getFaseBadge(conversaAtiva.fase)
  const risco = getRiscoBadge(conversaAtiva.risco)
  const isHumano = conversaAtiva.tipo === 'HUMANO'

  const kpis = [
    { icon: Bot, label: 'Com Bot', value: mockConversas.filter(c => c.tipo === 'BOT' && c.status === 'aberta').length, color: '#0D3DCC', badge: 'badge-blue' },
    { icon: UserCheck, label: 'Atendimento Humano', value: mockConversas.filter(c => c.tipo === 'HUMANO').length, color: '#0BBFAA', badge: 'badge-teal' },
    { icon: BellRing, label: 'Aguardando Atenção', value: mockConversas.filter(c => c.status === 'transferida' || c.prioridade).length, color: '#E81B8F', badge: 'badge-magenta' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

      {/* Header */}
      <div className="hero-item hero-item-0" style={{ marginBottom: 16 }}>
        <div className="page-label" style={{ marginBottom: 8 }}>
          <MessageSquare size={10} strokeWidth={2.5} />
          CHAT AO VIVO
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 3 }}>Conversas Ativas</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
              Monitore e assuma conversas do bot em tempo real.
            </p>
          </div>
          {/* Status indicador ao vivo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', background: 'rgba(11,191,170,0.08)', border: '1px solid rgba(11,191,170,0.20)', borderRadius: 100 }}>
            <div className="teal-glow-pulse" style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--teal)', flexShrink: 0 }} />
            <span style={{ fontSize: 12, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, color: 'var(--teal)' }}>AO VIVO</span>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="hero-item hero-item-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
        {kpis.map(k => (
          <div key={k.label} className="kpi-card" style={{ padding: '16px 20px' }}>
            <div className="kpi-label">
              <k.icon size={11} color={k.color} strokeWidth={2.5} />
              {k.label.toUpperCase()}
            </div>
            <div className="kpi-value" style={{ color: k.color }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Interface principal — lista + chat */}
      <div className="hero-item hero-item-2" style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 0, height: 580, borderRadius: 12, overflow: 'hidden', border: '1px solid var(--card-border)', boxShadow: 'var(--card-shadow)' }}>

        {/* Lista de conversas */}
        <div style={{ background: 'var(--sidebar-bg)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
          {/* Busca + filtros */}
          <div style={{ padding: '12px 12px 8px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ position: 'relative', marginBottom: 8 }}>
              <Search size={13} color="var(--text-muted)" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
              <input className="input-field" placeholder="Buscar conversa..." style={{ paddingLeft: 30, fontSize: 12, padding: '8px 10px 8px 30px' }} />
            </div>
            {/* Filtros rápidos */}
            <div style={{ display: 'flex', gap: 4 }}>
              {(['todos', 'bot', 'humano', 'aguardando'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFiltro(f)}
                  style={{
                    flex: 1, padding: '4px 0', borderRadius: 6,
                    border: filtro === f ? '1.5px solid var(--accent)' : '1px solid var(--border)',
                    background: filtro === f ? 'rgba(13,61,204,0.08)' : 'transparent',
                    color: filtro === f ? 'var(--accent)' : 'var(--text-muted)',
                    fontSize: 10, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700,
                    cursor: 'pointer', letterSpacing: '0.04em', textTransform: 'capitalize',
                  }}
                >
                  {f === 'todos' ? 'Todos' : f === 'bot' ? 'Bot' : f === 'humano' ? 'Humano' : 'Espera'}
                </button>
              ))}
            </div>
          </div>

          {/* Lista */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {conversasFiltradas.map(c => {
              const ativa = c.id === conversaAtiva.id
              const fBadge = getFaseBadge(c.fase)
              return (
                <div
                  key={c.id}
                  onClick={() => setConversaAtiva(c)}
                  style={{
                    padding: '12px 14px',
                    borderBottom: '1px solid var(--border)',
                    cursor: 'pointer',
                    background: ativa ? 'rgba(13,61,204,0.06)' : 'transparent',
                    borderLeft: ativa ? '2.5px solid var(--accent)' : '2.5px solid transparent',
                    transition: 'background 0.1s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <div style={{ position: 'relative' }}>
                      <Avatar nome={c.nome} size={36} />
                      {/* Status dot */}
                      <div style={{
                        position: 'absolute', bottom: -1, right: -1,
                        width: 11, height: 11, borderRadius: '50%',
                        background: c.tipo === 'HUMANO' ? 'var(--teal)' : c.status === 'transferida' ? 'var(--warning)' : 'var(--accent)',
                        border: '2px solid var(--sidebar-bg)',
                      }} />
                    </div>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                        <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>
                          {c.nome.split(' ')[0]} {c.nome.split(' ')[1]}
                        </span>
                        <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{c.hora}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
                        <span className={fBadge.className} style={{ fontSize: 9, padding: '2px 6px' }}>{fBadge.label}</span>
                        {c.prioridade && (
                          <span className="badge badge-magenta" style={{ fontSize: 9, padding: '2px 6px' }}>Urgente</span>
                        )}
                        {c.tipo === 'HUMANO' && (
                          <span className="badge badge-teal" style={{ fontSize: 9, padding: '2px 6px' }}>Humano</span>
                        )}
                        {c.status === 'transferida' && (
                          <span className="badge badge-orange" style={{ fontSize: 9, padding: '2px 6px' }}>Aguardando</span>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{
                          fontSize: 11, color: 'var(--text-muted)',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          maxWidth: 170,
                          fontStyle: c.ultima_msg_remetente === 'BOT' ? 'italic' : 'normal',
                        }}>
                          {c.ultima_msg_remetente === 'BOT' && 'Bot: '}
                          {c.ultima_mensagem}
                        </span>
                        {c.nao_lidas > 0 && (
                          <div style={{
                            minWidth: 18, height: 18, borderRadius: 9,
                            background: 'var(--magenta)', color: '#fff',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 10, fontWeight: 700, flexShrink: 0,
                          }}>{c.nao_lidas}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Área de chat */}
        <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>

          {/* Chat header */}
          <div style={{ padding: '12px 20px', background: 'var(--card-bg)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <Avatar nome={conversaAtiva.nome} size={38} />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 14 }}>{conversaAtiva.nome}</span>
                <span className={getFaseBadge(conversaAtiva.fase).className}>{getFaseBadge(conversaAtiva.fase).label}</span>
                <span className={getRiscoBadge(conversaAtiva.risco).className}>{getRiscoBadge(conversaAtiva.risco).label}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 2 }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Phone size={10} /> {conversaAtiva.telefone}
                </span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{conversaAtiva.plano}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: isHumano ? 'var(--teal)' : 'var(--accent)' }} />
                  <span style={{ fontSize: 11, color: isHumano ? 'var(--teal)' : 'var(--accent)', fontWeight: 600 }}>
                    {isHumano ? 'Atendimento Humano' : 'Bot Ativo'}
                  </span>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {isHumano ? (
                <button className="btn-ghost" style={{ fontSize: 12 }}>
                  <ArrowLeft size={13} />
                  Devolver ao Bot
                </button>
              ) : (
                <button className="btn-primary" style={{ fontSize: 12, padding: '8px 16px' }}>
                  <UserCheck size={13} />
                  Assumir Conversa
                </button>
              )}
              <button className="btn-ghost" style={{ padding: '8px 10px' }}>
                <MoreVertical size={14} />
              </button>
            </div>
          </div>

          {/* Mensagens */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>

            {/* Alerta urgente para leads de risco */}
            {conversaAtiva.prioridade && (
              <div style={{ padding: '10px 14px', background: 'rgba(232,27,143,0.08)', border: '1px solid rgba(232,27,143,0.20)', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                <AlertTriangle size={14} color="var(--magenta)" />
                <span style={{ fontSize: 12, color: 'var(--magenta)', fontWeight: 600 }}>Lead sinalizou intenção de cancelar — Atendente B recomendado</span>
              </div>
            )}

            {msgs.map((msg) => {
              const isLead = msg.remetente === 'LEAD'
              const isBot = msg.remetente === 'BOT'
              const isAtendente = msg.remetente === 'ATENDENTE'
              return (
                <div key={msg.id} style={{
                  display: 'flex',
                  justifyContent: isLead ? 'flex-end' : 'flex-start',
                  gap: 8,
                }}>
                  {!isLead && (
                    <div style={{
                      width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                      background: isBot ? 'rgba(13,61,204,0.10)' : 'rgba(11,191,170,0.12)',
                      border: `1px solid ${isBot ? 'rgba(13,61,204,0.20)' : 'rgba(11,191,170,0.25)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {isBot ? <Bot size={13} color="var(--accent)" /> : <UserCheck size={13} color="var(--teal)" />}
                    </div>
                  )}
                  <div style={{ maxWidth: '70%', display: 'flex', flexDirection: 'column', gap: 3, alignItems: isLead ? 'flex-end' : 'flex-start' }}>
                    {!isLead && (
                      <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600 }}>
                        {isBot ? 'Bot' : 'Atendente'}
                      </span>
                    )}
                    <div style={{
                      padding: '10px 14px',
                      borderRadius: isLead ? '14px 4px 14px 14px' : '4px 14px 14px 14px',
                      background: isLead ? 'var(--accent)' : isBot ? 'var(--card-bg)' : 'rgba(11,191,170,0.10)',
                      color: isLead ? '#fff' : 'var(--text-primary)',
                      border: isLead ? 'none' : `1px solid ${isBot ? 'var(--card-border)' : 'rgba(11,191,170,0.20)'}`,
                      fontSize: 13,
                      boxShadow: 'var(--card-shadow)',
                      lineHeight: 1.5,
                      wordBreak: 'break-word',
                    }}>
                      {msg.conteudo.startsWith('http') ? (
                        <a href={msg.conteudo} style={{ color: isLead ? '#B8D4FF' : 'var(--accent)', textDecoration: 'underline', fontSize: 12 }}>
                          {msg.conteudo}
                        </a>
                      ) : msg.conteudo}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{msg.hora}</span>
                      {isLead && msg.status === 'lido' && <CheckCheck size={11} color="var(--teal)" />}
                      {isLead && msg.status === 'entregue' && <CheckCheck size={11} color="var(--text-muted)" />}
                      {isLead && !msg.status && <Check size={11} color="var(--text-muted)" />}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Input de mensagem */}
          <div style={{ padding: '12px 16px', background: 'var(--card-bg)', borderTop: '1px solid var(--border)' }}>
            {!isHumano && (
              <div style={{ marginBottom: 8, padding: '6px 12px', background: 'rgba(13,61,204,0.06)', borderRadius: 8, fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Bot size={11} color="var(--accent)" />
                Bot está respondendo automaticamente. Clique em <strong style={{ color: 'var(--accent)', cursor: 'pointer' }}>Assumir Conversa</strong> para responder manualmente.
              </div>
            )}
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
              <input
                className="input-field"
                placeholder={isHumano ? 'Digitar mensagem...' : 'Bot ativo — assuma a conversa para responder'}
                value={mensagem}
                onChange={e => setMensagem(e.target.value)}
                disabled={!isHumano}
                style={{ flex: 1, opacity: isHumano ? 1 : 0.5 }}
              />
              <button
                className="btn-primary"
                disabled={!isHumano || !mensagem.trim()}
                style={{ padding: '10px 14px', flexShrink: 0 }}
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
