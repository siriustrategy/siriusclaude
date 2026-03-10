'use client'

import { useState, useRef, useEffect } from 'react'
import {
  Bot, UserCheck, BellRing, Search, Send, Phone,
  Info, X, MoreVertical, AlertTriangle, CheckCheck, Check,
  FileText, MessageSquare, Zap, ChevronDown, Users, Clock,
  History, Tag,
} from 'lucide-react'
import { getFaseBadge, getRiscoBadge, formatRelativeTime, getAvatarColor, formatCurrency } from '@/lib/utils'

// ====================================================================
// TIPOS
// ====================================================================
type TipoMsg = 'mensagem' | 'nota_interna'
interface Msg { id: string; remetente: 'BOT' | 'LEAD' | 'ATENDENTE'; conteudo: string; hora: string; status?: string; tipo?: TipoMsg }
interface Conversa { id: string; lead_id: string; nome: string; telefone: string; plano: string; fase: string; risco: string; tipo: 'BOT' | 'HUMANO' | 'MISTO'; status: 'aberta' | 'transferida'; prioridade: boolean; hora: string; nao_lidas: number; ultima_mensagem: string; ultima_msg_remetente: 'BOT' | 'LEAD' | 'ATENDENTE'; total_msgs: number }

// ====================================================================
// MOCK DATA
// ====================================================================
const mockConversas: Conversa[] = [
  { id: 'c1', lead_id: '1', nome: 'Maria Santos', telefone: '(21) 99999-1111', plano: 'Plano Essencial', fase: 'mes1', risco: 'baixo', tipo: 'BOT', status: 'aberta', prioridade: false, hora: '10:34', nao_lidas: 1, total_msgs: 5, ultima_mensagem: 'Ok, vou verificar o link agora!', ultima_msg_remetente: 'LEAD' },
  { id: 'c2', lead_id: '3', nome: 'Ana Costa', telefone: '(21) 97777-3333', plano: 'Plano Familiar', fase: 'mes4', risco: 'alto', tipo: 'HUMANO', status: 'aberta', prioridade: true, hora: '10:21', nao_lidas: 3, total_msgs: 6, ultima_mensagem: 'Não consigo pagar de uma vez...', ultima_msg_remetente: 'LEAD' },
  { id: 'c3', lead_id: '5', nome: 'Fernanda Lima', telefone: '(21) 95555-5555', plano: 'Plano Familiar', fase: 'mes5', risco: 'alto', tipo: 'BOT', status: 'aberta', prioridade: false, hora: '09:58', nao_lidas: 0, total_msgs: 4, ultima_mensagem: 'Posso pensar um pouco?', ultima_msg_remetente: 'LEAD' },
  { id: 'c4', lead_id: '4', nome: 'Carlos Pereira', telefone: '(21) 96666-4444', plano: 'Plano Essencial', fase: 'pre', risco: 'baixo', tipo: 'BOT', status: 'aberta', prioridade: false, hora: '08:15', nao_lidas: 0, total_msgs: 5, ultima_mensagem: 'Entendido, obrigado!', ultima_msg_remetente: 'LEAD' },
  { id: 'c5', lead_id: '2', nome: 'João Oliveira', telefone: '(21) 98888-2222', plano: 'Plano Premium', fase: 'mes3', risco: 'medio', tipo: 'BOT', status: 'transferida', prioridade: false, hora: 'Ontem', nao_lidas: 0, total_msgs: 4, ultima_mensagem: 'Preciso falar com um atendente.', ultima_msg_remetente: 'LEAD' },
  { id: 'c6', lead_id: '6', nome: 'Roberto Souza', telefone: '(21) 94444-6666', plano: 'Plano Premium', fase: 'mes2', risco: 'medio', tipo: 'BOT', status: 'transferida', prioridade: false, hora: 'Ontem', nao_lidas: 0, total_msgs: 3, ultima_mensagem: 'Quando posso falar com alguém?', ultima_msg_remetente: 'LEAD' },
]

const mockMensagens: Record<string, Msg[]> = {
  c1: [
    { id: 'm1', remetente: 'BOT', conteudo: 'Olá, Maria! Notamos que seu Plano Essencial venceu há 15 dias. O valor em aberto é R$ 189,90. Clique no link abaixo para regularizar:', hora: '08:00' },
    { id: 'm2', remetente: 'BOT', conteudo: 'https://pagar.planomais.com.br/r/maria-jan26', hora: '08:00' },
    { id: 'm3', remetente: 'LEAD', conteudo: 'Oi! Quanto é o boleto mesmo?', hora: '10:30', status: 'lido' },
    { id: 'm4', remetente: 'BOT', conteudo: 'Maria, o valor total é R$ 189,90. Você pode pagar via PIX, cartão ou boleto. O PIX é confirmado na hora!', hora: '10:31' },
    { id: 'm5', remetente: 'LEAD', conteudo: 'Ok, vou verificar o link agora!', hora: '10:34', status: 'lido' },
  ],
  c2: [
    { id: 'm1', remetente: 'BOT', conteudo: 'Olá, Ana! Seu Plano Familiar está em aberto há 107 dias. Temos uma oferta de 15% de desconto disponível hoje! O valor fica R$ 1.147,50.', hora: '09:00' },
    { id: 'm2', remetente: 'LEAD', conteudo: 'Nossa, tá caro assim. Sei lá né', hora: '09:45', status: 'lido' },
    { id: 'm3', remetente: 'BOT', conteudo: 'Entendo, Ana. Além do desconto de 15%, você pode parcelar em até 3x sem juros. Assim fica R$ 382,50 por mês.', hora: '09:45' },
    { id: 'm4', remetente: 'LEAD', conteudo: 'Não consigo pagar tudo de uma vez, tem como parcelar?', hora: '10:21', status: 'lido' },
    { id: 'm5', remetente: 'LEAD', conteudo: 'Mas precisa ser um valor menor que esse ainda', hora: '10:21', status: 'lido' },
    { id: 'm6', remetente: 'LEAD', conteudo: 'Será que tem desconto maior?', hora: '10:22', status: 'lido' },
  ],
  c3: [
    { id: 'm1', remetente: 'BOT', conteudo: 'Fernanda, seu plano está há 138 dias em atraso. Nossa melhor oferta: 20% de desconto + 3x. Valor: R$ 720,00 (3x de R$ 240,00).', hora: '09:50' },
    { id: 'm2', remetente: 'LEAD', conteudo: 'Tô passando por um momento difícil financeiramente', hora: '09:55', status: 'lido' },
    { id: 'm3', remetente: 'BOT', conteudo: 'Entendo, Fernanda. Você tem uma filha pequena e o plano cobre pediatria. Essa oferta de 20% é a melhor que podemos fazer.', hora: '09:56' },
    { id: 'm4', remetente: 'LEAD', conteudo: 'Essa oferta de 20% está me ajudando bastante. Posso pensar um pouco?', hora: '09:58', status: 'lido' },
  ],
  c4: [
    { id: 'm1', remetente: 'BOT', conteudo: 'Boa tarde, Carlos! Seu Plano Essencial venceu há 5 dias. Aqui está o link para pagamento fácil:', hora: '08:00' },
    { id: 'm2', remetente: 'BOT', conteudo: 'https://pagar.planomais.com.br/r/carlos-mar26', hora: '08:00' },
    { id: 'm3', remetente: 'LEAD', conteudo: 'Vou pagar hoje à tarde', hora: '08:10', status: 'lido' },
    { id: 'm4', remetente: 'BOT', conteudo: 'Ótimo, Carlos! O link fica ativo por 7 dias.', hora: '08:10' },
    { id: 'm5', remetente: 'LEAD', conteudo: 'Entendido, obrigado!', hora: '08:15', status: 'lido' },
  ],
  c5: [
    { id: 'm1', remetente: 'BOT', conteudo: 'João, seu Plano Premium venceu há 75 dias. Desconto de 5% disponível (48h): R$ 569,81.', hora: '14:00' },
    { id: 'm2', remetente: 'LEAD', conteudo: 'Quero falar com uma pessoa, não com robô', hora: '14:30', status: 'lido' },
    { id: 'm3', remetente: 'BOT', conteudo: 'Entendo, João! Vou transferir você para um atendente agora.', hora: '14:30' },
    { id: 'm4', remetente: 'LEAD', conteudo: 'Preciso falar com um atendente humano.', hora: '14:31', status: 'lido' },
  ],
  c6: [
    { id: 'm1', remetente: 'BOT', conteudo: 'Roberto, seu plano está há 45 dias em atraso. Podemos ajudar!', hora: '13:00' },
    { id: 'm2', remetente: 'LEAD', conteudo: 'Quero negociar minha dívida', hora: '13:20', status: 'lido' },
    { id: 'm3', remetente: 'LEAD', conteudo: 'Quando posso falar com alguém?', hora: '13:21', status: 'lido' },
  ],
}

const RESPOSTAS_RAPIDAS = [
  { id: 'r1', titulo: 'Saudação inicial', texto: 'Olá! Aqui é [seu nome] da Plano Mais Assistencial. Como posso ajudar você hoje?' },
  { id: 'r2', titulo: 'Um momento', texto: 'Só um instante, vou verificar isso para você.' },
  { id: 'r3', titulo: 'Oferta de parcelamento', texto: 'Podemos parcelar em até 3x sem juros. Deseja que eu gere o link de pagamento?' },
  { id: 'r4', titulo: 'Link de checkout', texto: 'Aqui está o link para regularização do seu plano: [link]' },
  { id: 'r5', titulo: 'Encerrar atendimento', texto: 'Foi um prazer ajudar! Qualquer dúvida, estamos aqui. Tenha um ótimo dia!' },
  { id: 'r6', titulo: 'Aguardar aprovação', texto: 'Preciso consultar com nossa equipe sobre esse desconto. Posso retornar em breve?' },
]

// ====================================================================
// COMPONENTES AUXILIARES
// ====================================================================
function Avatar({ nome, size = 38 }: { nome: string; size?: number }) {
  const color = getAvatarColor(nome)
  const initials = nome.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase()
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.28, flexShrink: 0,
      background: `linear-gradient(135deg, ${color}, ${color}BB)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: size * 0.32, color: '#fff',
    }}>{initials}</div>
  )
}

// ====================================================================
// PAINEL DE INFORMAÇÕES DO LEAD (direita)
// ====================================================================
function InfoPanel({ conversa, onClose }: { conversa: Conversa; onClose: () => void }) {
  const fase = getFaseBadge(conversa.fase)
  const risco = getRiscoBadge(conversa.risco)
  return (
    <div style={{ width: 280, borderLeft: '1px solid var(--border)', background: 'var(--card-bg)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 13 }}>Informações</span>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <X size={15} color="var(--text-muted)" />
        </button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
          <Avatar nome={conversa.nome} size={52} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 14 }}>{conversa.nome}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{conversa.telefone}</div>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
            <span className={fase.className}>{fase.label}</span>
            <span className={risco.className}>{risco.label}</span>
          </div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 10, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: 8 }}>DADOS DO PLANO</div>
          {[
            { label: 'Plano', value: conversa.plano },
            { label: 'Fase', value: fase.label },
            { label: 'Telefone', value: conversa.telefone },
            { label: 'Mensagens', value: `${conversa.total_msgs} trocadas` },
          ].map(i => (
            <div key={i.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border)', fontSize: 12 }}>
              <span style={{ color: 'var(--text-muted)' }}>{i.label}</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{i.value}</span>
            </div>
          ))}
        </div>
        <div>
          <div style={{ fontSize: 10, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: 8 }}>NOTAS INTERNAS</div>
          <textarea
            className="input-field"
            placeholder="Adicionar nota sobre este lead..."
            style={{ height: 80, resize: 'none', fontSize: 12 }}
          />
          <button className="btn-secondary" style={{ marginTop: 8, width: '100%', justifyContent: 'center', fontSize: 12 }}>
            Salvar Nota
          </button>
        </div>
      </div>
    </div>
  )
}

// ====================================================================
// PÁGINA PRINCIPAL
// ====================================================================
export default function ChatPage() {
  const [conversaAtiva, setConversaAtiva] = useState<Conversa>(mockConversas[1])
  const [tabLista, setTabLista] = useState<'minhas' | 'fila' | 'historico'>('minhas')
  const [mensagem, setMensagem] = useState('')
  const [tipoInput, setTipoInput] = useState<TipoMsg>('mensagem')
  const [showRapidas, setShowRapidas] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [busca, setBusca] = useState('')
  const chatRef = useRef<HTMLDivElement>(null)

  // Rolar para o fim das mensagens ao trocar de conversa
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [conversaAtiva.id])

  const msgs = mockMensagens[conversaAtiva.id] || []
  const isHumano = conversaAtiva.tipo === 'HUMANO'
  const isTransferida = conversaAtiva.status === 'transferida'

  const minhas = mockConversas.filter(c => (c.tipo === 'HUMANO' || c.tipo === 'MISTO') && c.status === 'aberta')
  const fila = mockConversas.filter(c => c.status === 'transferida')
  const historico = mockConversas.filter(c => c.status === 'aberta' && c.tipo === 'BOT')

  const listaAtiva = tabLista === 'minhas' ? minhas : tabLista === 'fila' ? fila : historico

  const listaFiltrada = listaAtiva.filter(c =>
    !busca || c.nome.toLowerCase().includes(busca.toLowerCase()) || c.telefone.includes(busca)
  )

  function handleEnviar() {
    if (!mensagem.trim() || !isHumano) return
    setMensagem('')
  }

  const faseBadge = getFaseBadge(conversaAtiva.fase)

  return (
    // Sai do padding do layout com margens negativas e ocupa tela toda
    <div style={{ margin: '-28px -32px', height: 'calc(100vh - 60px)', display: 'flex', overflow: 'hidden', background: 'var(--bg)' }}>

      {/* ============================================================
          COLUNA ESQUERDA — Lista de conversas (340px fixo)
          ============================================================ */}
      <div style={{ width: 340, borderRight: '1px solid var(--border)', background: 'var(--card-bg)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>

        {/* Tabs Minhas / Fila / Histórico */}
        <div style={{ padding: '12px 16px 0', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', gap: 0 }}>
            {([
              { key: 'minhas', label: 'Minhas', count: minhas.length },
              { key: 'fila', label: 'Fila', count: fila.length },
              { key: 'historico', label: 'Histórico', count: historico.length },
            ] as const).map(tab => (
              <button
                key={tab.key}
                onClick={() => setTabLista(tab.key)}
                style={{
                  flex: 1, padding: '8px 0', background: 'none', border: 'none',
                  borderBottom: tabLista === tab.key ? '2px solid var(--accent)' : '2px solid transparent',
                  color: tabLista === tab.key ? 'var(--accent)' : 'var(--text-muted)',
                  fontFamily: 'Space Grotesk, sans-serif', fontWeight: tabLista === tab.key ? 700 : 500,
                  fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                  marginBottom: -1,
                }}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span style={{
                    background: tabLista === tab.key ? 'var(--accent)' : 'var(--surface-2)',
                    color: tabLista === tab.key ? '#fff' : 'var(--text-muted)',
                    padding: '1px 6px', borderRadius: 100, fontSize: 10, fontWeight: 700,
                  }}>{tab.count}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Busca */}
        <div style={{ padding: '10px 12px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={13} color="var(--text-muted)" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              className="input-field"
              placeholder="Buscar nome ou telefone"
              style={{ paddingLeft: 30, fontSize: 12, padding: '7px 10px 7px 30px' }}
              value={busca}
              onChange={e => setBusca(e.target.value)}
            />
          </div>
        </div>

        {/* Aviso de fila */}
        {tabLista === 'fila' && fila.length > 0 && (
          <div style={{ padding: '6px 14px', background: 'rgba(214,137,16,0.08)', borderBottom: '1px solid rgba(214,137,16,0.18)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <BellRing size={12} color="var(--warning)" />
            <span style={{ fontSize: 11, color: 'var(--warning)', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600 }}>{fila.length} cliente{fila.length > 1 ? 's' : ''} aguardando</span>
          </div>
        )}

        {/* Lista */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {listaFiltrada.length === 0 && (
            <div style={{ padding: '40px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
              {tabLista === 'minhas' ? 'Nenhuma conversa ativa' : tabLista === 'fila' ? 'Nenhum cliente na fila' : 'Sem histórico'}
            </div>
          )}
          {listaFiltrada.map(c => {
            const ativa = c.id === conversaAtiva.id
            const fBadge = getFaseBadge(c.fase)
            return (
              <div
                key={c.id}
                onClick={() => setConversaAtiva(c)}
                style={{
                  padding: '11px 14px',
                  borderBottom: '1px solid var(--border)',
                  cursor: 'pointer',
                  background: ativa ? 'rgba(13,61,204,0.05)' : 'transparent',
                  borderLeft: ativa ? '2.5px solid var(--accent)' : '2.5px solid transparent',
                  transition: 'background 0.1s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <div style={{ position: 'relative' }}>
                    <Avatar nome={c.nome} size={36} />
                    <div style={{
                      position: 'absolute', bottom: -1, right: -1,
                      width: 10, height: 10, borderRadius: '50%',
                      background: c.tipo === 'HUMANO' ? 'var(--teal)' : c.status === 'transferida' ? 'var(--warning)' : 'var(--accent)',
                      border: '1.5px solid var(--card-bg)',
                    }} />
                  </div>
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
                      <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 13 }}>{c.nome.split(' ').slice(0, 2).join(' ')}</span>
                      <span style={{ fontSize: 10, color: 'var(--text-muted)', flexShrink: 0 }}>{c.hora}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 4, marginBottom: 3, flexWrap: 'wrap' }}>
                      <span className={fBadge.className} style={{ fontSize: 9, padding: '1px 6px' }}>{fBadge.label}</span>
                      {c.prioridade && <span className="badge badge-magenta" style={{ fontSize: 9, padding: '1px 6px' }}>Urgente</span>}
                      {c.tipo === 'HUMANO' && <span className="badge badge-teal" style={{ fontSize: 9, padding: '1px 6px' }}>Humano</span>}
                      {c.status === 'transferida' && <span className="badge badge-orange" style={{ fontSize: 9, padding: '1px 6px' }}>Aguardando</span>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 185, fontStyle: c.ultima_msg_remetente !== 'LEAD' ? 'italic' : 'normal' }}>
                        {c.ultima_msg_remetente !== 'LEAD' && 'Bot: '}{c.ultima_mensagem}
                      </span>
                      {c.nao_lidas > 0 && (
                        <div style={{ minWidth: 18, height: 18, borderRadius: 9, background: 'var(--magenta)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, flexShrink: 0, marginLeft: 4 }}>{c.nao_lidas}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ============================================================
          ÁREA PRINCIPAL — Chat + Info
          ============================================================ */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>

        {/* Header do chat */}
        <div style={{ padding: '10px 20px', background: 'var(--card-bg)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <Avatar nome={conversaAtiva.nome} size={40} />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
              <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 15 }}>{conversaAtiva.nome}</span>
              {conversaAtiva.prioridade && <span className="badge badge-magenta">Urgência</span>}
              {conversaAtiva.tipo === 'HUMANO' && <span className="badge badge-teal">Em Atendimento</span>}
              {conversaAtiva.status === 'transferida' && <span className="badge badge-orange">Aguardando atendente</span>}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Phone size={11} /> {conversaAtiva.telefone}
              </span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{conversaAtiva.plano}</span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{conversaAtiva.total_msgs} msgs</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
            <button
              onClick={() => setShowInfo(p => !p)}
              className={showInfo ? 'btn-secondary' : 'btn-ghost'}
              style={{ padding: '7px 14px', fontSize: 12 }}
            >
              <Info size={13} />
              Info
            </button>
            {isHumano ? (
              <button className="btn-ghost" style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                <Bot size={13} />
                Devolver ao Bot
              </button>
            ) : !isTransferida ? (
              <button className="btn-primary" style={{ fontSize: 12, padding: '7px 16px' }}>
                <UserCheck size={13} />
                Assumir Conversa
              </button>
            ) : null}
            {isHumano && (
              <button className="btn-danger" style={{ fontSize: 12, padding: '7px 14px' }}>
                <X size={13} />
                Finalizar
              </button>
            )}
            <button className="btn-ghost" style={{ padding: '7px 9px' }}>
              <MoreVertical size={14} />
            </button>
          </div>
        </div>

        {/* Área de mensagens + info panel */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

          {/* Chat area */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

            {/* Banner "Assumir Conversa" para conversas em fila */}
            {isTransferida && (
              <div style={{ padding: '20px 24px', background: 'rgba(13,61,204,0.06)', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
                  <Avatar nome={conversaAtiva.nome} size={46} />
                  <div>
                    <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 16 }}>{conversaAtiva.nome}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                      <Clock size={12} />
                      Aguardando atendente
                      <span className={getFaseBadge(conversaAtiva.fase).className}>{getFaseBadge(conversaAtiva.fase).label}</span>
                    </div>
                  </div>
                </div>
                <button
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: 14 }}
                  onClick={() => {
                    // Mock: assume conversa
                    setConversaAtiva({ ...conversaAtiva, tipo: 'HUMANO', status: 'aberta' })
                  }}
                >
                  <Zap size={16} />
                  Assumir esta Conversa
                </button>
              </div>
            )}

            {/* Alerta urgente */}
            {conversaAtiva.prioridade && (
              <div style={{ padding: '8px 20px', background: 'rgba(232,27,143,0.06)', borderBottom: '1px solid rgba(232,27,143,0.15)', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <AlertTriangle size={13} color="var(--magenta)" />
                <span style={{ fontSize: 12, color: 'var(--magenta)', fontWeight: 600 }}>Lead sinalizou intenção de cancelar — Atendente B recomendado</span>
              </div>
            )}

            {/* Mensagens */}
            <div ref={chatRef} style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 4 }}>
              {msgs.map((msg, i) => {
                const isLead = msg.remetente === 'LEAD'
                const isBot = msg.remetente === 'BOT'
                const isNotaInterna = msg.tipo === 'nota_interna'

                // Nota interna — estilo especial amarelo
                if (isNotaInterna) {
                  return (
                    <div key={msg.id} style={{ display: 'flex', justifyContent: 'center', margin: '6px 0' }}>
                      <div style={{ maxWidth: '70%', padding: '8px 14px', background: 'rgba(214,137,16,0.10)', border: '1px solid rgba(214,137,16,0.25)', borderRadius: 10, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                        <FileText size={13} color="var(--warning)" style={{ flexShrink: 0, marginTop: 1 }} />
                        <div>
                          <div style={{ fontSize: 10, color: 'var(--warning)', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, letterSpacing: '0.06em', marginBottom: 3 }}>NOTA INTERNA</div>
                          <div style={{ fontSize: 12, color: '#4A3000' }}>{msg.conteudo}</div>
                        </div>
                      </div>
                    </div>
                  )
                }

                // Lead = esquerda, Bot/Atendente = direita
                return (
                  <div key={msg.id} style={{ display: 'flex', justifyContent: isLead ? 'flex-start' : 'flex-end', marginBottom: 2 }}>
                    <div style={{ maxWidth: '65%', display: 'flex', flexDirection: 'column', gap: 2, alignItems: isLead ? 'flex-start' : 'flex-end' }}>

                      {/* Label do remetente não-lead */}
                      {!isLead && (i === 0 || msgs[i - 1]?.remetente !== msg.remetente) && (
                        <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, marginBottom: 1 }}>
                          {isBot ? 'Bot' : 'Atendente'}
                        </span>
                      )}

                      <div style={{
                        padding: '9px 13px',
                        borderRadius: isLead ? '4px 14px 14px 14px' : '14px 4px 14px 14px',
                        background: isLead ? 'var(--card-bg)' : isBot ? '#F0F2F8' : 'var(--accent)',
                        color: isLead ? 'var(--text-primary)' : isBot ? 'var(--text-primary)' : '#fff',
                        border: isLead ? '1px solid var(--card-border)' : isBot ? '1px solid rgba(13,61,204,0.10)' : 'none',
                        fontSize: 13.5,
                        boxShadow: isLead ? 'var(--card-shadow)' : 'none',
                        lineHeight: 1.5,
                        wordBreak: 'break-word',
                      }}>
                        {msg.conteudo.startsWith('http') ? (
                          <a href={msg.conteudo} style={{ color: isLead ? 'var(--accent)' : '#B8D4FF', fontSize: 12, textDecoration: 'underline' }}>
                            {msg.conteudo}
                          </a>
                        ) : msg.conteudo}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, paddingLeft: isLead ? 2 : 0, paddingRight: isLead ? 0 : 2 }}>
                        <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{msg.hora}</span>
                        {isLead && msg.status === 'lido' && <CheckCheck size={11} color="var(--teal)" />}
                        {isLead && !msg.status && <Check size={11} color="var(--text-muted)" />}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Input de mensagem */}
            <div style={{ padding: '12px 20px', background: 'var(--card-bg)', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
              {/* Tabs Mensagem | Nota Interna */}
              <div style={{ display: 'flex', gap: 4, marginBottom: 10 }}>
                <button
                  onClick={() => setTipoInput('mensagem')}
                  style={{
                    padding: '5px 14px', borderRadius: 7, border: 'none', cursor: 'pointer',
                    background: tipoInput === 'mensagem' ? 'var(--accent)' : 'transparent',
                    color: tipoInput === 'mensagem' ? '#fff' : 'var(--text-muted)',
                    fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: 12,
                    display: 'flex', alignItems: 'center', gap: 5,
                  }}
                >
                  <MessageSquare size={12} />Mensagem
                </button>
                <button
                  onClick={() => setTipoInput('nota_interna')}
                  style={{
                    padding: '5px 14px', borderRadius: 7, border: 'none', cursor: 'pointer',
                    background: tipoInput === 'nota_interna' ? 'rgba(214,137,16,0.12)' : 'transparent',
                    color: tipoInput === 'nota_interna' ? 'var(--warning)' : 'var(--text-muted)',
                    fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: 12,
                    display: 'flex', alignItems: 'center', gap: 5,
                  }}
                >
                  <FileText size={12} />Nota Interna
                </button>
                {/* Respostas rápidas */}
                <div style={{ marginLeft: 'auto', position: 'relative' }}>
                  <button
                    onClick={() => setShowRapidas(p => !p)}
                    style={{
                      padding: '5px 12px', borderRadius: 7, border: '1px solid var(--border)', cursor: 'pointer',
                      background: showRapidas ? 'rgba(13,61,204,0.08)' : 'transparent',
                      color: showRapidas ? 'var(--accent)' : 'var(--text-muted)',
                      fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: 12,
                      display: 'flex', alignItems: 'center', gap: 5,
                    }}
                  >
                    <Zap size={12} />Rápidas
                    <ChevronDown size={11} />
                  </button>
                  {/* Dropdown de respostas rápidas */}
                  {showRapidas && (
                    <div style={{
                      position: 'absolute', bottom: '110%', right: 0,
                      width: 340, background: 'var(--card-bg)',
                      border: '1px solid var(--card-border)',
                      borderRadius: 12, boxShadow: '0 8px 28px rgba(13,61,204,0.14)',
                      zIndex: 50, overflow: 'hidden',
                    }}>
                      <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
                        RESPOSTAS RÁPIDAS
                      </div>
                      {RESPOSTAS_RAPIDAS.map(r => (
                        <div
                          key={r.id}
                          onClick={() => { setMensagem(r.texto); setShowRapidas(false) }}
                          style={{ padding: '10px 14px', cursor: 'pointer', borderBottom: '1px solid var(--border)', transition: 'background 0.1s' }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'var(--card-hover)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                        >
                          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: 13, color: 'var(--text-primary)', marginBottom: 2 }}>{r.titulo}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.texto}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Campo de texto + envio */}
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                  <textarea
                    className="input-field"
                    placeholder={
                      !isHumano && !isTransferida
                        ? 'Bot ativo — clique em Assumir Conversa para responder'
                        : tipoInput === 'nota_interna'
                        ? 'Nota interna (visível apenas para a equipe)...'
                        : 'Digite sua mensagem...'
                    }
                    value={mensagem}
                    onChange={e => setMensagem(e.target.value)}
                    disabled={!isHumano && !isTransferida}
                    style={{ resize: 'none', height: 44, opacity: (!isHumano && !isTransferida) ? 0.5 : 1, paddingRight: 12, lineHeight: 1.5, paddingTop: 10 }}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleEnviar() }
                    }}
                  />
                </div>
                <button
                  className="btn-primary"
                  onClick={handleEnviar}
                  disabled={!isHumano || !mensagem.trim()}
                  style={{ padding: '10px 14px', flexShrink: 0, height: 44, borderRadius: 10 }}
                >
                  <Send size={16} />
                </button>
              </div>
              {isHumano && (
                <div style={{ marginTop: 4, fontSize: 11, color: 'var(--text-muted)' }}>
                  Atendente · Enter para enviar · Shift+Enter para nova linha
                </div>
              )}
            </div>
          </div>

          {/* Info panel lateral */}
          {showInfo && <InfoPanel conversa={conversaAtiva} onClose={() => setShowInfo(false)} />}
        </div>
      </div>
    </div>
  )
}
