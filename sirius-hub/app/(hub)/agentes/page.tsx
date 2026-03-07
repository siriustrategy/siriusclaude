'use client'

import { useEffect, useState, useCallback } from 'react'
import {
  Bot, Cpu, MessageSquare, Activity, ExternalLink,
  X, RefreshCw, Terminal, Layers, Code, Target,
  Users, Zap, ChevronRight, Circle,
} from 'lucide-react'

const TERMINAL_URL = 'http://localhost:7681'

// ── Metadata de agentes (iniciais + cor) ─────────────
const AGENT_META: Record<string, { initials: string; color: string; name: string; role: string }> = {
  'aios-master':          { initials: 'AM', color: '#FFD700', name: 'AIOS Master',    role: 'Framework'     },
  'dev':                  { initials: 'DX', color: '#3B5BDB', name: 'Dex',            role: 'Dev'           },
  'qa':                   { initials: 'QA', color: '#10b981', name: 'QA',             role: 'Quality'       },
  'architect':            { initials: 'AR', color: '#7C3AED', name: 'Aria',           role: 'Architecture'  },
  'pm':                   { initials: 'MG', color: '#f59e0b', name: 'Morgan',         role: 'Product'       },
  'po':                   { initials: 'PX', color: '#ef4444', name: 'Pax',            role: 'Owner'         },
  'sm':                   { initials: 'RV', color: '#06b6d4', name: 'River',          role: 'Scrum'         },
  'analyst':              { initials: 'AN', color: '#8b5cf6', name: 'Analyst',        role: 'Analysis'      },
  'devops':               { initials: 'GG', color: '#f97316', name: 'Gage',           role: 'DevOps'        },
  'data-engineer':        { initials: 'DA', color: '#14b8a6', name: 'Dara',           role: 'Database'      },
  'ux-design-expert':     { initials: 'UX', color: '#ec4899', name: 'UX Expert',      role: 'Design'        },
  'squad-chief':          { initials: 'SC', color: '#FFD700', name: 'Squad Chief',    role: 'Orchestrator'  },
  'oalanicolas':          { initials: 'ON', color: '#7C3AED', name: 'Oalanicolas',    role: 'Mind Clone'    },
  'pedro-valerio':        { initials: 'PV', color: '#3B5BDB', name: 'Pedro Valerio',  role: 'Process'       },
  'zona-genialidade-chief':{ initials:'ZG', color: '#06b6d4', name: 'ZG Chief',       role: 'Genius'        },
  'gay-hendricks':        { initials: 'GH', color: '#FFD700', name: 'Gay Hendricks',  role: 'Genius Zone'   },
  'roger-hamilton':       { initials: 'RH', color: '#f59e0b', name: 'R. Hamilton',    role: 'Flow'          },
  'sally-hogshead':       { initials: 'SH', color: '#ec4899', name: 'S. Hogshead',   role: 'Fascination'   },
  'kathy-kolbe':          { initials: 'KK', color: '#ef4444', name: 'Kathy Kolbe',    role: 'Conation'      },
  'don-clifton':          { initials: 'DC', color: '#10b981', name: 'Don Clifton',    role: 'Strengths'     },
  'dan-sullivan':         { initials: 'DS', color: '#3B5BDB', name: 'Dan Sullivan',   role: 'Unique Ability'},
  'alex-hormozi':         { initials: 'AH', color: '#FFD700', name: 'Alex Hormozi',   role: 'Monetization'  },
  'sirius-proposals-chief':{ initials:'SP', color: '#7C3AED', name: 'SP Chief',       role: 'Proposals'     },
  'maister':              { initials: 'MA', color: '#10b981', name: 'Maister',        role: 'Trust'         },
  'blair-enns':           { initials: 'BE', color: '#FFD700', name: 'Blair Enns',     role: 'Pricing'       },
  'hormozi':              { initials: 'HZ', color: '#f59e0b', name: 'Hormozi',        role: 'Offers'        },
  'corey-quinn':          { initials: 'CQ', color: '#3B5BDB', name: 'Corey Quinn',    role: 'Revenue'       },
  'patrick-campbell':     { initials: 'PC', color: '#7C3AED', name: 'P. Campbell',    role: 'Pricing'       },
  'klaff':                { initials: 'OK', color: '#ef4444', name: 'Oren Klaff',     role: 'Pitch'         },
  'nancy-duarte':         { initials: 'ND', color: '#ec4899', name: 'Nancy Duarte',   role: 'Story'         },
  'squadsiteslp-chief':   { initials: 'WC', color: '#06b6d4', name: 'Sites Chief',    role: 'LP & Sites'    },
  'steve-schoger':        { initials: 'SS', color: '#ec4899', name: 'Steve Schoger',  role: 'UI Design'     },
  'josh-comeau':          { initials: 'JC', color: '#FFD700', name: 'Josh Comeau',    role: 'CSS Magic'     },
  'emil-kowalski':        { initials: 'EK', color: '#f59e0b', name: 'Emil Kowalski',  role: 'Animation'     },
  'adam-argyle':          { initials: 'AA', color: '#14b8a6', name: 'Adam Argyle',    role: 'CSS'           },
  'ahmad-shadeed':        { initials: 'AS', color: '#3B5BDB', name: 'Ahmad Shadeed',  role: 'Layout'        },
  'kevin-powell':         { initials: 'KP', color: '#7C3AED', name: 'Kevin Powell',   role: 'CSS'           },
  'maxime-heckel':        { initials: 'MH', color: '#8b5cf6', name: 'Maxime Heckel',  role: 'Animations'    },
  'rand-fishkin':         { initials: 'RF', color: '#10b981', name: 'Rand Fishkin',   role: 'SEO'           },
  'joanna-wiebe':         { initials: 'JW', color: '#FFD700', name: 'Joanna Wiebe',   role: 'Copy'          },
  'peep-laja':            { initials: 'PL', color: '#10b981', name: 'Peep Laja',      role: 'CRO'           },
  'guillermo-rauch':      { initials: 'GR', color: '#e2e8f0', name: 'G. Rauch',       role: 'Vercel'        },
  'lee-robinson':         { initials: 'LR', color: '#3B5BDB', name: 'Lee Robinson',   role: 'Next.js'       },
  'theo-browne':          { initials: 'TB', color: '#7C3AED', name: 'Theo Browne',    role: 'Full Stack'    },
  'matt-biilmann':        { initials: 'MB', color: '#f59e0b', name: 'Matt Biilmann',  role: 'Netlify'       },
}

function getAgentMeta(id: string) {
  if (AGENT_META[id]) return AGENT_META[id]
  const name = id.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  const initials = name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()
  const COLORS = ['#3B5BDB', '#7C3AED', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#FFD700', '#ec4899']
  const h = id.split('').reduce((a: number, c: string) => a + c.charCodeAt(0), 0)
  return { initials, color: COLORS[h % COLORS.length], name, role: 'Agent' }
}

function textOnColor(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 > 145 ? '#000' : '#fff'
}

const DOMAIN_ICON: Record<string, React.ComponentType<any>> = {
  meta_frameworks: Layers,
  technical: Code,
  people_psychology: Zap,
  sales_proposals: Target,
}

// ── Tipos ─────────────────────────────────────────────
interface CoreAgent { id: string; name: string; role: string; color: string }
interface Squad { agent_names: string[]; domain: string; purpose: string }
interface AgentsData { core: CoreAgent[]; squads: Record<string, Squad> }
interface Conversation { id: string; projectKey: string; project: string; firstText: string; userMessages: number; lastModified: string }
interface Message { role: string; text: string }

// ── Componente principal ──────────────────────────────
export default function AgentesPage() {
  const [agents, setAgents] = useState<AgentsData | null>(null)
  const [convs, setConvs] = useState<Conversation[]>([])
  const [activity, setActivity] = useState<any[]>([])
  const [working, setWorking] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [offline, setOffline] = useState(false)
  const [convModal, setConvModal] = useState<{ conv: Conversation; messages: Message[] } | null>(null)
  const [convLoading, setConvLoading] = useState(false)
  const [showTerminal, setShowTerminal] = useState(false)

  const loadAll = useCallback(async () => {
    try {
      const [aRes, cRes, acRes] = await Promise.all([
        fetch(`${TERMINAL_URL}/api/agents`),
        fetch(`${TERMINAL_URL}/api/conversations`),
        fetch(`${TERMINAL_URL}/api/activity`),
      ])
      const [a, c, ac] = await Promise.all([aRes.json(), cRes.json(), acRes.json()])
      setAgents(a)
      setConvs(c.slice(0, 40))
      setActivity(ac.recentFiles || [])
      setOffline(false)
      // agentes "trabalhando" aleatorios
      const all = [...a.core.map((x: CoreAgent) => x.id), ...Object.values(a.squads as Record<string, Squad>).flatMap(s => s.agent_names || [])]
      const ws = new Set<string>()
      for (let i = 0; i < 3; i++) ws.add(all[Math.floor(Math.random() * all.length)])
      setWorking(ws)
    } catch {
      setOffline(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadAll()
    const t = setInterval(() => {
      if (!agents) return
      const all = [...agents.core.map(x => x.id), ...Object.values(agents.squads).flatMap(s => s.agent_names || [])]
      const ws = new Set<string>()
      for (let i = 0; i < 3; i++) ws.add(all[Math.floor(Math.random() * all.length)])
      setWorking(ws)
    }, 6000)
    return () => clearInterval(t)
  }, [loadAll, agents])

  async function openConv(conv: Conversation) {
    setConvLoading(true)
    setConvModal({ conv, messages: [] })
    try {
      const r = await fetch(`${TERMINAL_URL}/api/conversation/${encodeURIComponent(conv.projectKey)}/${encodeURIComponent(conv.id)}`)
      const data = await r.json()
      setConvModal({ conv, messages: data.messages || [] })
    } catch {
      setConvModal({ conv, messages: [] })
    } finally {
      setConvLoading(false)
    }
  }

  function timeAgo(date: string) {
    const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
    if (s < 60) return 'agora'
    if (s < 3600) return `${Math.floor(s / 60)}min`
    if (s < 86400) return `${Math.floor(s / 3600)}h`
    return `${Math.floor(s / 86400)}d`
  }

  const totalAgents = agents
    ? agents.core.length + Object.values(agents.squads).reduce((s, sq) => s + (sq.agent_names?.length || 0), 0)
    : 0

  // ── Offline ───────────────────────────────────────
  if (!loading && offline) return (
    <div style={{ padding: '40px 48px', maxWidth: 980, margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}>
        <span className="section-label blue" style={{ marginBottom: 12, display: 'inline-flex' }}>AIOS</span>
        <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 28, fontWeight: 700, marginTop: 8, marginBottom: 6 }}>
          Agentes AIOS
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>Mission Control dos seus agentes de IA.</p>
      </div>
      <div className="glass-card" style={{ padding: 40, textAlign: 'center' }}>
        <Bot size={40} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
        <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: 16, marginBottom: 8 }}>
          Sirius Terminal offline
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 20 }}>
          Inicie o servidor para ver seus agentes.
        </p>
        <code style={{
          display: 'block', background: '#080C18', border: '1px solid var(--border)',
          borderRadius: 8, padding: '10px 16px', fontFamily: 'JetBrains Mono, monospace',
          fontSize: 13, color: '#10b981', marginBottom: 20,
        }}>
          cd ~/siriusclaude/sirius-terminal && node server.js
        </code>
        <button
          onClick={loadAll}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(59,91,219,0.12)', border: '1px solid rgba(59,91,219,0.3)',
            color: '#93c5fd', borderRadius: 8, padding: '8px 18px',
            fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, fontWeight: 600, cursor: 'pointer',
          }}
        >
          <RefreshCw size={14} /> Tentar novamente
        </button>
      </div>
    </div>
  )

  // ── Loading ───────────────────────────────────────
  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300, gap: 12, color: 'var(--text-muted)' }}>
      <div style={{ width: 18, height: 18, border: '2px solid var(--border-strong)', borderTopColor: 'var(--accent)', borderRadius: '50%' }} className="animate-spin" />
      Carregando agentes...
    </div>
  )

  return (
    <div style={{ padding: '40px 48px', maxWidth: 1100, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <span className="section-label blue" style={{ marginBottom: 12, display: 'inline-flex' }}>AIOS MISSION CONTROL</span>
          <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 28, fontWeight: 700, marginTop: 8, marginBottom: 6 }}>
            Agentes AIOS
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
            Seus agentes de IA — clique em qualquer um para abrir no terminal.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
          <button
            onClick={loadAll}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'rgba(59,91,219,0.08)', border: '1px solid rgba(59,91,219,0.2)',
              color: 'var(--text-secondary)', borderRadius: 8, padding: '8px 14px',
              fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, cursor: 'pointer',
            }}
          >
            <RefreshCw size={13} /> Atualizar
          </button>
          <button
            onClick={() => setShowTerminal(!showTerminal)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: showTerminal ? 'rgba(59,91,219,0.2)' : 'rgba(59,91,219,0.08)',
              border: `1px solid ${showTerminal ? 'rgba(59,91,219,0.5)' : 'rgba(59,91,219,0.2)'}`,
              color: showTerminal ? '#93c5fd' : 'var(--text-secondary)',
              borderRadius: 8, padding: '8px 14px',
              fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, cursor: 'pointer',
            }}
          >
            <Terminal size={13} /> Terminal
          </button>
          <a
            href={TERMINAL_URL}
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'rgba(59,91,219,0.08)', border: '1px solid rgba(59,91,219,0.2)',
              color: 'var(--text-secondary)', borderRadius: 8, padding: '8px 14px',
              fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, textDecoration: 'none',
            }}
          >
            <ExternalLink size={13} /> Abrir completo
          </a>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 28 }}>
        {[
          { icon: Bot,          label: 'Total Agentes',    value: totalAgents,             color: '#3B5BDB' },
          { icon: Layers,       label: 'Squads',           value: Object.keys(agents?.squads || {}).length, color: '#7C3AED' },
          { icon: MessageSquare,label: 'Conversas Claude', value: convs.length,            color: '#10b981' },
          { icon: Activity,     label: 'Atividade Recente',value: activity.length,         color: '#f59e0b' },
        ].map(stat => (
          <div key={stat.label} className="stat-card">
            <div style={{
              width: 34, height: 34, borderRadius: 9,
              background: `${stat.color}18`, border: `1px solid ${stat.color}30`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12,
            }}>
              <stat.icon size={16} color={stat.color} />
            </div>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 26, fontWeight: 700, lineHeight: 1 }}>
              {stat.value}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Terminal embed */}
      {showTerminal && (
        <div className="glass-card" style={{ marginBottom: 28, overflow: 'hidden', borderRadius: 12 }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 18px', borderBottom: '1px solid var(--border)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Terminal size={14} color="var(--accent-light)" />
              <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, fontWeight: 600 }}>Terminal</span>
              <span className="badge badge-green" style={{ fontSize: 10 }}>ao vivo</span>
            </div>
            <button
              onClick={() => setShowTerminal(false)}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}
            >
              <X size={15} />
            </button>
          </div>
          <iframe
            src={TERMINAL_URL}
            style={{ width: '100%', height: 420, border: 'none', display: 'block', background: '#000' }}
            title="Sirius Terminal"
          />
        </div>
      )}

      {/* Mission Control + Conversas */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, alignItems: 'start' }}>

        {/* Mission Control */}
        <div>
          {/* AIOS Core */}
          {agents && (
            <div className="content-section" style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
                <Cpu size={14} color="var(--accent-light)" />
                <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, fontWeight: 600 }}>
                  AIOS Core
                </span>
                <span className="badge badge-blue">{agents.core.length} agentes</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(88px, 1fr))', gap: 10 }}>
                {agents.core.map(a => {
                  const m = getAgentMeta(a.id)
                  return <AgentCard key={a.id} id={a.id} initials={m.initials} color={m.color} name={a.name} role={a.role} working={working.has(a.id)} />
                })}
              </div>
            </div>
          )}

          {/* Squads */}
          {agents && Object.entries(agents.squads).map(([squadId, squad]) => {
            const agentsList = squad.agent_names || []
            if (!agentsList.length) return null
            const DomainIcon = DOMAIN_ICON[squad.domain] || Layers
            return (
              <div key={squadId} className="content-section" style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
                  <DomainIcon size={14} color="var(--accent-light)" />
                  <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, fontWeight: 600 }}>
                    {squadId}
                  </span>
                  <span className="badge" style={{ background: 'rgba(124,58,237,0.1)', borderColor: 'rgba(124,58,237,0.25)', color: '#c4b5fd', fontSize: 10 }}>
                    {agentsList.length} agentes
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 4 }}>{squad.domain}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(88px, 1fr))', gap: 10 }}>
                  {agentsList.map(id => {
                    const m = getAgentMeta(id)
                    return <AgentCard key={id} id={id} initials={m.initials} color={m.color} name={m.name} role={m.role} working={working.has(id)} />
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* Painel lateral: Conversas + Atividade */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Atividade */}
          {activity.length > 0 && (
            <div className="glass-card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <Activity size={14} color="#10b981" />
                <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, fontWeight: 600 }}>
                  Claude Ativo
                </span>
                <span className="badge badge-green" style={{ fontSize: 10 }}>ao vivo</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {activity.slice(0, 4).map((f: any, i: number) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Circle size={7} fill="#10b981" color="#10b981" style={{ flexShrink: 0, filter: 'drop-shadow(0 0 4px #10b981)' }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 500, fontFamily: 'JetBrains Mono, monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {f.project.split('/').filter(Boolean).pop() || f.project}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{timeAgo(f.mtime)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Conversas */}
          <div className="glass-card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <MessageSquare size={14} color="var(--accent-light)" />
              <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, fontWeight: 600 }}>
                Conversas Claude
              </span>
              <span className="badge badge-blue" style={{ fontSize: 10, marginLeft: 'auto' }}>{convs.length}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 500, overflowY: 'auto' }}>
              {convs.map(c => (
                <button
                  key={c.id}
                  onClick={() => openConv(c)}
                  style={{
                    background: 'transparent', border: '1px solid var(--border)',
                    borderRadius: 8, padding: '10px 12px', cursor: 'pointer',
                    textAlign: 'left', transition: 'border-color 0.15s',
                    width: '100%',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-strong)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                >
                  <div style={{ fontSize: 11, color: 'var(--accent-light)', fontFamily: 'JetBrains Mono, monospace', marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {c.project.split('/').filter(Boolean).pop() || c.project}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 4 }}>
                    {c.firstText || '(sem preview)'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{timeAgo(c.lastModified)}</span>
                    <span className="badge" style={{ fontSize: 10, padding: '1px 6px' }}>{c.userMessages} msgs</span>
                    <ChevronRight size={11} color="var(--accent-light)" style={{ marginLeft: 'auto' }} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de conversa */}
      {convModal && (
        <div
          onClick={() => setConvModal(null)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(4px)', zIndex: 1000,
            display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
            padding: '24px 16px', overflowY: 'auto',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'var(--surface)', border: '1px solid var(--border-strong)',
              borderRadius: 14, width: '100%', maxWidth: 720, maxHeight: '82vh',
              display: 'flex', flexDirection: 'column',
              boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
              animation: 'slide-up 0.2s ease',
            }}
          >
            {/* Modal header */}
            <div style={{
              padding: '16px 20px', borderBottom: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0,
            }}>
              <MessageSquare size={15} color="var(--accent-light)" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {convModal.conv.project.split('/').filter(Boolean).pop() || convModal.conv.project}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace', marginTop: 2 }}>
                  {convModal.conv.project}
                </div>
              </div>
              <button onClick={() => setConvModal(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 6 }}>
                <X size={16} />
              </button>
            </div>

            {/* Modal body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {convLoading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200, gap: 10, color: 'var(--text-muted)' }}>
                  <div style={{ width: 16, height: 16, border: '2px solid var(--border-strong)', borderTopColor: 'var(--accent)', borderRadius: '50%' }} className="animate-spin" />
                  Carregando...
                </div>
              ) : convModal.messages.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 40 }}>Nenhuma mensagem</div>
              ) : (
                convModal.messages.map((msg, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', maxWidth: '88%', alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 4, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, letterSpacing: '0.05em' }}>
                      {msg.role === 'user' ? 'VOCE' : 'CLAUDE'}
                    </div>
                    <div style={{
                      padding: '10px 14px', borderRadius: 12, fontSize: 13, lineHeight: 1.6,
                      wordBreak: 'break-word', whiteSpace: 'pre-wrap',
                      ...(msg.role === 'user'
                        ? { background: 'rgba(59,91,219,0.12)', border: '1px solid rgba(59,91,219,0.25)', borderBottomRightRadius: 4 }
                        : { background: 'var(--surface-2)', border: '1px solid var(--border)', borderBottomLeftRadius: 4 }
                      ),
                    }}>
                      {msg.text}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Componente AgentCard ──────────────────────────────
function AgentCard({ id, initials, color, name, role, working }: {
  id: string; initials: string; color: string; name: string; role: string; working: boolean
}) {
  const textColor = textOnColor(color)

  return (
    <a
      href={`http://localhost:7681`}
      target="_blank"
      rel="noreferrer"
      title={`@${id}`}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '14px 8px 11px', borderRadius: 10, textDecoration: 'none',
        background: working ? `${color}0A` : 'transparent',
        border: `1px solid ${working ? `${color}40` : 'var(--border)'}`,
        transition: 'all 0.2s', cursor: 'pointer', position: 'relative',
        boxShadow: working ? `0 0 14px ${color}22` : 'none',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = `${color}60`
        e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = working ? `${color}40` : 'var(--border)'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      {/* Dot de ativo */}
      {working && (
        <div style={{
          position: 'absolute', top: 6, right: 6,
          width: 7, height: 7, borderRadius: '50%',
          background: color, boxShadow: `0 0 6px ${color}`,
          animation: 'neon-green 1.5s ease-in-out infinite',
        }} />
      )}

      {/* Avatar iniciais */}
      <div style={{
        width: 42, height: 42, borderRadius: 10,
        background: color, color: textColor,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, fontWeight: 700,
        marginBottom: 8, letterSpacing: '0.03em',
        animation: working ? 'float 2s ease-in-out infinite' : 'none',
        flexShrink: 0,
      }}>
        {initials}
      </div>

      <div style={{ fontSize: 11, fontWeight: 600, fontFamily: 'Space Grotesk, sans-serif', color: 'var(--text-primary)', lineHeight: 1.3, textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' }}>
        {name}
      </div>
      <div style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 2 }}>
        {role}
      </div>
    </a>
  )
}
