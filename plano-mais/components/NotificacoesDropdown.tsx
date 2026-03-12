'use client'

import { useState, useRef, useEffect } from 'react'
import { Bell, TrendingUp, Tag, AlertTriangle, MessageSquare, Check, X, Loader } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

// ─── Tipos ────────────────────────────────────────────────────────────────────

type TipoNotif = 'venda_robo' | 'desconto_aprovacao' | 'lead_urgente' | 'nova_mensagem'
type Prioridade = 'urgente' | 'alta' | 'normal'
type AprovacaoStatus = 'idle' | 'aprovando' | 'negando' | 'aprovado' | 'negado' | 'erro'

interface Notificacao {
  id: string
  tipo: TipoNotif
  titulo: string
  mensagem: string
  prioridade: Prioridade
  lida: boolean
  created_at: string
  meta?: {
    lead_id?: string
    lead_nome?: string
    lead_fase?: string
    lead_valor?: number
    atendente?: string
    desconto_total?: number
    desconto_extra?: number
    valor?: number
    metodo?: string
    parcelas?: number
    [key: string]: unknown
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatarTempo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  if (diff < 60000) return 'agora'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}min`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`
  return `${Math.floor(diff / 86400000)}d`
}

const CONFIG_TIPO: Record<TipoNotif, { cor: string; bg: string; Icon: React.ElementType }> = {
  venda_robo:         { cor: '#1E8449', bg: 'rgba(30,132,73,0.12)',  Icon: TrendingUp },
  desconto_aprovacao: { cor: '#D97706', bg: 'rgba(217,119,6,0.12)',  Icon: Tag },
  lead_urgente:       { cor: '#DC2626', bg: 'rgba(220,38,38,0.12)',  Icon: AlertTriangle },
  nova_mensagem:      { cor: '#0D3DCC', bg: 'rgba(13,61,204,0.12)',  Icon: MessageSquare },
}

const CONFIG_PRIORIDADE: Record<Prioridade, { label: string; cor: string }> = {
  urgente: { label: 'URGENTE', cor: '#DC2626' },
  alta:    { label: 'ALTA',    cor: '#D97706' },
  normal:  { label: '',        cor: '' },
}

// ─── Componente de aprovação ──────────────────────────────────────────────────

function AprovarDescontoCard({
  notif,
  aprovacaoStatus,
  onAprovar,
  onNegar,
}: {
  notif: Notificacao
  aprovacaoStatus: AprovacaoStatus
  onAprovar: () => void
  onNegar: () => void
}) {
  const m = notif.meta || {}
  const valorFormatado = m.lead_valor ? `R$ ${Number(m.lead_valor).toFixed(2).replace('.', ',')}` : ''
  const valorComDesconto = m.lead_valor && m.desconto_total
    ? `R$ ${(m.lead_valor * (1 - m.desconto_total / 100)).toFixed(2).replace('.', ',')}`
    : ''

  if (aprovacaoStatus === 'aprovado') {
    return (
      <div style={{ marginTop: 10, padding: '10px 12px', background: 'rgba(30,132,73,0.10)', border: '1px solid rgba(30,132,73,0.25)', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
        <Check size={13} color="#1E8449" />
        <span style={{ fontSize: 11.5, color: '#1E8449', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700 }}>
          Aprovado — checkout enviado via WhatsApp
        </span>
      </div>
    )
  }

  if (aprovacaoStatus === 'negado') {
    return (
      <div style={{ marginTop: 10, padding: '10px 12px', background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.20)', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
        <X size={13} color="#DC2626" />
        <span style={{ fontSize: 11.5, color: '#DC2626', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700 }}>
          Desconto negado — atendente notificado
        </span>
      </div>
    )
  }

  if (aprovacaoStatus === 'erro') {
    return (
      <div style={{ marginTop: 10, padding: '8px 12px', background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.18)', borderRadius: 8 }}>
        <span style={{ fontSize: 11, color: '#DC2626' }}>Erro ao processar. Tente novamente.</span>
      </div>
    )
  }

  const carregando = aprovacaoStatus === 'aprovando' || aprovacaoStatus === 'negando'

  return (
    <div style={{ marginTop: 10, padding: '10px 12px', background: 'rgba(217,119,6,0.06)', border: '1px solid rgba(217,119,6,0.20)', borderRadius: 8 }}>
      {/* Detalhes */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <div>
          <div style={{ fontSize: 10, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.06em' }}>LEAD</div>
          <div style={{ fontSize: 12, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, color: 'var(--text-primary)' }}>{m.lead_nome}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 10, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.06em' }}>DESCONTO</div>
          <div style={{ fontSize: 12, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, color: '#D97706' }}>{m.desconto_total}% OFF</div>
        </div>
        {valorFormatado && (
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 10, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.06em' }}>VALOR FINAL</div>
            <div style={{ fontSize: 12, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, color: '#1E8449' }}>{valorComDesconto}</div>
          </div>
        )}
      </div>

      {/* Botões */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={onAprovar}
          disabled={carregando}
          style={{
            flex: 1, padding: '8px 0', borderRadius: 8,
            background: aprovacaoStatus === 'aprovando' ? 'rgba(30,132,73,0.15)' : 'rgba(30,132,73,0.12)',
            border: '1px solid rgba(30,132,73,0.30)',
            color: '#1E8449',
            fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 12,
            cursor: carregando ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
            transition: 'all 0.15s',
          }}
        >
          {aprovacaoStatus === 'aprovando'
            ? <Loader size={12} style={{ animation: 'spin 1s linear infinite' }} />
            : <Check size={12} />
          }
          Aprovar e Enviar
        </button>
        <button
          onClick={onNegar}
          disabled={carregando}
          style={{
            flex: 1, padding: '8px 0', borderRadius: 8,
            background: aprovacaoStatus === 'negando' ? 'rgba(220,38,38,0.10)' : 'rgba(220,38,38,0.08)',
            border: '1px solid rgba(220,38,38,0.25)',
            color: '#DC2626',
            fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 12,
            cursor: carregando ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
            transition: 'all 0.15s',
          }}
        >
          {aprovacaoStatus === 'negando'
            ? <Loader size={12} style={{ animation: 'spin 1s linear infinite' }} />
            : <X size={12} />
          }
          Negar
        </button>
      </div>
    </div>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────

function mapRow(row: Record<string, unknown>): Notificacao {
  return {
    id: row.id as string,
    tipo: row.tipo as TipoNotif,
    titulo: row.titulo as string,
    mensagem: row.mensagem as string,
    prioridade: (row.prioridade as Prioridade) || 'normal',
    lida: Boolean(row.lida),
    created_at: row.created_at as string,
    meta: (row.meta as Notificacao['meta']) || undefined,
  }
}

export default function NotificacoesDropdown() {
  const supabase = createClient()
  const [notifs, setNotifs] = useState<Notificacao[]>([])
  const [aberto, setAberto] = useState(false)
  const [aprovacaoStatus, setAprovacaoStatus] = useState<Record<string, AprovacaoStatus>>({})
  const ref = useRef<HTMLDivElement>(null)

  const naoLidas = notifs.filter(n => !n.lida).length

  // Carrega notificações e subscribe ao realtime
  useEffect(() => {
    supabase
      .from('notificacoes')
      .select('id, tipo, titulo, mensagem, prioridade, lida, meta, created_at')
      .order('created_at', { ascending: false })
      .limit(50)
      .then(({ data }) => {
        if (data) setNotifs(data.map(mapRow))
      })

    const channel = supabase
      .channel('notificacoes-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notificacoes' },
        (payload) => {
          setNotifs(prev => [mapRow(payload.new as Record<string, unknown>), ...prev])
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'notificacoes' },
        (payload) => {
          setNotifs(prev => prev.map(n => n.id === (payload.new as { id: string }).id ? mapRow(payload.new as Record<string, unknown>) : n))
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  // Fecha ao clicar fora
  useEffect(() => {
    function handleClickFora(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setAberto(false)
      }
    }
    document.addEventListener('mousedown', handleClickFora)
    return () => document.removeEventListener('mousedown', handleClickFora)
  }, [])

  async function marcarLida(id: string) {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, lida: true } : n))
    await supabase.from('notificacoes').update({ lida: true }).eq('id', id)
  }

  async function marcarTodasLidas() {
    const ids = notifs.filter(n => !n.lida).map(n => n.id)
    setNotifs(prev => prev.map(n => ({ ...n, lida: true })))
    if (ids.length > 0) {
      await supabase.from('notificacoes').update({ lida: true }).in('id', ids)
    }
  }

  async function handleAprovarDesconto(notif: Notificacao) {
    const lead_id = notif.meta?.lead_id
    const desconto_total = notif.meta?.desconto_total
    if (!lead_id || !desconto_total) return

    setAprovacaoStatus(prev => ({ ...prev, [notif.id]: 'aprovando' }))

    try {
      const res = await fetch('/api/checkout/gerar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lead_id, desconto_override: desconto_total }),
      })

      if (res.ok) {
        setAprovacaoStatus(prev => ({ ...prev, [notif.id]: 'aprovado' }))
        await marcarLida(notif.id)
      } else {
        setAprovacaoStatus(prev => ({ ...prev, [notif.id]: 'erro' }))
      }
    } catch {
      setAprovacaoStatus(prev => ({ ...prev, [notif.id]: 'erro' }))
    }
  }

  function handleNegarDesconto(id: string) {
    setAprovacaoStatus(prev => ({ ...prev, [id]: 'negado' }))
    marcarLida(id)
  }

  // Ordena: urgente → alta → normal, depois por data
  const notifOrdenadas = [...notifs].sort((a, b) => {
    const ordemPrioridade = { urgente: 0, alta: 1, normal: 2 }
    const pA = ordemPrioridade[a.prioridade]
    const pB = ordemPrioridade[b.prioridade]
    if (pA !== pB) return pA - pB
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })

  return (
    <>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      <div ref={ref} style={{ position: 'relative' }}>
        {/* Botão Bell */}
        <button
          onClick={() => setAberto(v => !v)}
          style={{
            position: 'relative',
            background: 'var(--muted-bg)',
            border: aberto ? '1px solid var(--accent)' : '1px solid var(--border)',
            borderRadius: 8,
            width: 36, height: 36,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            color: aberto ? 'var(--accent)' : 'var(--text-secondary)',
            transition: 'all 0.15s',
          }}
          aria-label={`Notificacoes${naoLidas > 0 ? ` — ${naoLidas} nao lidas` : ''}`}
        >
          <Bell size={16} strokeWidth={2} />
          {naoLidas > 0 && (
            <span
              className="magenta-glow-pulse"
              style={{
                position: 'absolute', top: 5, right: 5,
                minWidth: 16, height: 16,
                background: 'var(--magenta)',
                borderRadius: '50%',
                border: '1.5px solid var(--sidebar-bg)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 9, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, color: '#fff',
                padding: naoLidas > 9 ? '0 3px' : 0,
              }}
            >
              {naoLidas > 9 ? '9+' : naoLidas}
            </span>
          )}
        </button>

        {/* Dropdown */}
        {aberto && (
          <div style={{
            position: 'absolute',
            top: 44, right: 0,
            width: 380,
            background: 'var(--sidebar-bg)',
            border: '1px solid var(--border)',
            borderRadius: 14,
            boxShadow: '0 8px 32px rgba(13,61,204,0.14)',
            zIndex: 200,
            overflow: 'hidden',
          }}>
            {/* Header do dropdown */}
            <div style={{
              padding: '14px 16px',
              borderBottom: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>
                  Notificacoes
                </span>
                {naoLidas > 0 && (
                  <span style={{
                    background: 'var(--magenta)', color: '#fff',
                    borderRadius: 100, padding: '2px 7px',
                    fontSize: 10, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700,
                  }}>
                    {naoLidas}
                  </span>
                )}
              </div>
              {naoLidas > 0 && (
                <button
                  onClick={marcarTodasLidas}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: 11, color: 'var(--accent)', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600,
                    display: 'flex', alignItems: 'center', gap: 4, padding: '4px 6px', borderRadius: 6,
                  }}
                >
                  <Check size={11} />
                  Marcar todas como lidas
                </button>
              )}
            </div>

            {/* Lista */}
            <div style={{ maxHeight: 460, overflowY: 'auto' }}>
              {notifOrdenadas.length === 0 ? (
                <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                  Nenhuma notificacao
                </div>
              ) : (
                notifOrdenadas.map(notif => {
                  const cfg = CONFIG_TIPO[notif.tipo]
                  const priorCfg = CONFIG_PRIORIDADE[notif.prioridade]
                  const apsStatus = aprovacaoStatus[notif.id] || 'idle'

                  return (
                    <div
                      key={notif.id}
                      style={{
                        padding: '12px 16px',
                        borderBottom: '1px solid var(--border)',
                        background: notif.lida ? 'transparent' : 'rgba(13,61,204,0.03)',
                      }}
                    >
                      <div
                        onClick={() => notif.tipo !== 'desconto_aprovacao' && marcarLida(notif.id)}
                        style={{
                          display: 'flex', gap: 12, alignItems: 'flex-start',
                          cursor: notif.tipo !== 'desconto_aprovacao' ? 'pointer' : 'default',
                        }}
                      >
                        {/* Ícone */}
                        <div style={{
                          width: 36, height: 36, borderRadius: 10,
                          background: cfg.bg,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0,
                        }}>
                          <cfg.Icon size={16} color={cfg.cor} strokeWidth={2} />
                        </div>

                        {/* Conteúdo */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                            <span style={{
                              fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 12,
                              color: 'var(--text-primary)',
                              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1,
                            }}>
                              {notif.titulo}
                            </span>
                            {priorCfg.label && (
                              <span style={{
                                fontSize: 9, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700,
                                color: priorCfg.cor,
                                background: `${priorCfg.cor}18`,
                                border: `1px solid ${priorCfg.cor}40`,
                                borderRadius: 4, padding: '1px 5px', flexShrink: 0,
                              }}>
                                {priorCfg.label}
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: 11.5, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                            {notif.mensagem}
                          </div>
                          <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>
                            {formatarTempo(notif.created_at)}
                          </div>
                        </div>

                        {/* Indicador não lida */}
                        {!notif.lida && (
                          <div style={{
                            width: 7, height: 7, background: 'var(--accent)',
                            borderRadius: '50%', flexShrink: 0, marginTop: 4,
                          }} />
                        )}
                      </div>

                      {/* Card de aprovação de desconto */}
                      {notif.tipo === 'desconto_aprovacao' && (
                        <AprovarDescontoCard
                          notif={notif}
                          aprovacaoStatus={apsStatus}
                          onAprovar={() => handleAprovarDesconto(notif)}
                          onNegar={() => handleNegarDesconto(notif.id)}
                        />
                      )}
                    </div>
                  )
                })
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
