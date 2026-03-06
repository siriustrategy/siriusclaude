'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid,
} from 'recharts'
import {
  FolderOpen, BookOpen, Award, CalendarDays,
  TrendingUp, ArrowRight, Clock, Lightbulb,
} from 'lucide-react'
import Link from 'next/link'

const TOOLTIP_STYLE = {
  backgroundColor: '#0D1225',
  border: '1px solid rgba(59,91,219,0.25)',
  borderRadius: 8,
  color: '#E8EEFF',
  fontFamily: 'DM Sans, sans-serif',
  fontSize: 13,
}

export default function DashboardPage() {
  const [stats, setStats] = useState({ projetos: 0, estudos: 0, reunioes: 0, certificados: 0, ideias: 0 })
  const [projetos, setProjetos] = useState<any[]>([])
  const [estudos, setEstudos] = useState<any[]>([])
  const [proximaReuniao, setProximaReuniao] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const [p, e, r, c, id] = await Promise.all([
        supabase.from('projetos').select('*').eq('user_id', user.id),
        supabase.from('estudos').select('*').eq('user_id', user.id),
        supabase.from('reunioes').select('*').eq('user_id', user.id).order('data', { ascending: true }),
        supabase.from('certificados').select('id').eq('user_id', user.id),
        supabase.from('ideias').select('id').eq('user_id', user.id),
      ])

      const today = new Date().toISOString().split('T')[0]
      const proxima = (r.data || []).find((r: any) => r.data >= today)

      setStats({
        projetos: p.data?.length || 0,
        estudos: e.data?.filter((e: any) => e.status === 'Em andamento').length || 0,
        reunioes: r.data?.filter((r: any) => r.data?.slice(0, 7) === today.slice(0, 7)).length || 0,
        certificados: c.data?.length || 0,
        ideias: id.data?.length || 0,
      })
      setProjetos((p.data || []).filter((p: any) => p.status !== 'Concluído').slice(0, 4))
      setEstudos((e.data || []).filter((e: any) => e.status === 'Em andamento').slice(0, 3))
      setProximaReuniao(proxima || null)
      setLoading(false)
    }
    load()
  }, [])

  const atividadeData = [
    { dia: 'Seg', tarefas: 3, estudo: 2 },
    { dia: 'Ter', tarefas: 5, estudo: 1 },
    { dia: 'Qua', tarefas: 2, estudo: 3 },
    { dia: 'Qui', tarefas: 6, estudo: 2 },
    { dia: 'Sex', tarefas: 4, estudo: 4 },
    { dia: 'Sáb', tarefas: 1, estudo: 5 },
    { dia: 'Dom', tarefas: 0, estudo: 2 },
  ]

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300, gap: 12, color: 'var(--text-muted)' }}>
      <div style={{ width: 18, height: 18, border: '2px solid var(--border-strong)', borderTopColor: 'var(--accent)', borderRadius: '50%' }} className="animate-spin" />
      Carregando seu hub...
    </div>
  )

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div className="section-label" style={{ marginBottom: 10 }}>VISÃO GERAL</div>
        <h1 className="page-title gradient-text">Bom dia, Breno</h1>
        <p className="page-subtitle">Aqui está tudo o que está acontecendo hoje.</p>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 32 }}>
        {[
          { icon: FolderOpen, label: 'Projetos Ativos', value: stats.projetos, color: '#3B5BDB', href: '/projetos' },
          { icon: BookOpen, label: 'Estudos Ativos', value: stats.estudos, color: '#10b981', href: '/estudos' },
          { icon: CalendarDays, label: 'Reuniões no Mês', value: stats.reunioes, color: '#f59e0b', href: '/reunioes' },
          { icon: Award, label: 'Certificados', value: stats.certificados, color: '#7C3AED', href: '/certificados' },
          { icon: Lightbulb, label: 'Ideias', value: stats.ideias, color: '#ec4899', href: '/ideias' },
        ].map(kpi => (
          <Link key={kpi.label} href={kpi.href} style={{ textDecoration: 'none' }}>
            <div className="stat-card">
              <div style={{
                width: 36, height: 36, borderRadius: 9,
                background: `${kpi.color}18`,
                border: `1px solid ${kpi.color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 14,
              }}>
                <kpi.icon size={17} color={kpi.color} />
              </div>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 28, fontWeight: 700, lineHeight: 1 }}>
                {kpi.value}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>{kpi.label}</div>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        {/* Próxima Reunião */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 15, fontWeight: 600 }}>Próxima Reunião</h3>
            <Link href="/reunioes" style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--accent)', fontSize: 12, textDecoration: 'none' }}>
              Ver todas <ArrowRight size={12} />
            </Link>
          </div>
          {proximaReuniao ? (
            <div>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: 15, marginBottom: 8 }}>
                {proximaReuniao.titulo}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: 13 }}>
                <Clock size={13} />
                {new Date(proximaReuniao.data + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'short' })}
                {proximaReuniao.horario && ` — ${proximaReuniao.horario}`}
              </div>
              {proximaReuniao.empresa && (
                <div style={{ marginTop: 8 }}>
                  <span className="badge badge-blue">{proximaReuniao.empresa}</span>
                </div>
              )}
            </div>
          ) : (
            <div style={{ color: 'var(--text-muted)', fontSize: 14 }}>
              Nenhuma reunião agendada.{' '}
              <Link href="/reunioes" style={{ color: 'var(--accent)' }}>Agendar uma</Link>
            </div>
          )}
        </div>

        {/* Atividade Semanal */}
        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 15, fontWeight: 600, marginBottom: 16 }}>
            Atividade da Semana
          </h3>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={atividadeData} barGap={2}>
              <XAxis dataKey="dia" tick={{ fill: '#4A5680', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: 'rgba(59,91,219,0.06)' }} />
              <Bar dataKey="tarefas" fill="#3B5BDB" radius={[3, 3, 0, 0]} name="Tarefas" />
              <Bar dataKey="estudo" fill="#7C3AED" radius={[3, 3, 0, 0]} name="Estudo (h)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Projetos em andamento */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 15, fontWeight: 600 }}>Projetos em Andamento</h3>
            <Link href="/projetos" style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--accent)', fontSize: 12, textDecoration: 'none' }}>
              Ver todos <ArrowRight size={12} />
            </Link>
          </div>
          {projetos.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
              Nenhum projeto ativo.{' '}
              <Link href="/projetos" style={{ color: 'var(--accent)' }}>Criar projeto</Link>
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {projetos.map((p: any) => (
                <div key={p.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{p.nome}</span>
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{p.score}%</span>
                  </div>
                  <div className="progress-bar-track">
                    <div className="progress-bar-fill" style={{ width: `${p.score}%` }} />
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{p.empresa}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Estudos ativos */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 15, fontWeight: 600 }}>Estudos Ativos</h3>
            <Link href="/estudos" style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--accent)', fontSize: 12, textDecoration: 'none' }}>
              Ver todos <ArrowRight size={12} />
            </Link>
          </div>
          {estudos.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
              Nenhum estudo em andamento.{' '}
              <Link href="/estudos" style={{ color: 'var(--accent)' }}>Adicionar estudo</Link>
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {estudos.map((e: any) => (
                <div key={e.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', flex: 1, marginRight: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.titulo}</span>
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)', flexShrink: 0 }}>{e.progresso}%</span>
                  </div>
                  <div className="progress-bar-track">
                    <div className="progress-bar-fill" style={{ width: `${e.progresso}%`, background: 'linear-gradient(90deg, #10b981, #34d399)' }} />
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{e.plataforma}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
