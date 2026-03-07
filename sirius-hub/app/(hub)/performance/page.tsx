'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Projeto } from '@/lib/types'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  LineChart, Line, CartesianGrid,
} from 'recharts'
import { TrendingUp, Award, Target, Zap } from 'lucide-react'

const TOOLTIP_STYLE = {
  backgroundColor: '#0D1225',
  border: '1px solid rgba(59,91,219,0.25)',
  borderRadius: 8,
  color: '#E8EEFF',
  fontFamily: 'DM Sans, sans-serif',
  fontSize: 13,
}

export default function PerformancePage() {
  const [projetos, setProjetos] = useState<Projeto[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('projetos').select('*').eq('user_id', user.id).order('score', { ascending: false })
      setProjetos(data || [])
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <div style={{ color: 'var(--text-muted)', padding: 40, textAlign: 'center' }}>Carregando performance...</div>

  const scoreTotal = projetos.length > 0 ? Math.round(projetos.reduce((a, p) => a + p.score, 0) / projetos.length) : 0
  const melhor = projetos[0]
  const acima80 = projetos.filter(p => p.score >= 80).length

  // Agrupa por empresa
  const empresaMap: Record<string, number[]> = {}
  projetos.forEach(p => {
    if (!empresaMap[p.empresa]) empresaMap[p.empresa] = []
    empresaMap[p.empresa].push(p.score)
  })
  const empresaData = Object.entries(empresaMap).map(([empresa, scores]) => ({
    empresa, media: Math.round(scores.reduce((a, s) => a + s, 0) / scores.length), total: scores.length,
  }))

  const barData = projetos.map(p => ({ nome: p.nome.length > 18 ? p.nome.slice(0, 16) + '…' : p.nome, score: p.score, empresa: p.empresa }))

  const lineData = [
    { mes: 'Jan', score: 58 }, { mes: 'Fev', score: 62 }, { mes: 'Mar', score: 65 },
    { mes: 'Abr', score: 71 }, { mes: 'Mai', score: 68 }, { mes: 'Jun', score: scoreTotal },
  ]

  return (
    <div style={{ padding: '40px 48px', maxWidth: 980, margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}>
        <span className="section-label" style={{ marginBottom: 12, display: 'inline-flex' }}>PERFORMANCE</span>
        <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 28, fontWeight: 700, marginBottom: 6 }}>Análise de Performance</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>Visão comparativa de todos os seus projetos</p>
      </div>

      {projetos.length === 0 ? (
        <div className="empty-state">
          <TrendingUp size={40} style={{ margin: '0 auto 16px', color: 'var(--text-muted)' }} />
          <p style={{ fontSize: 15, marginBottom: 8 }}>Nenhum projeto para analisar</p>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Adicione projetos na aba Projetos para ver sua performance aqui.</p>
        </div>
      ) : (
        <>
          {/* KPIs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 28 }}>
            <KpiCard icon={Target} label="Score Médio Geral" value={`${scoreTotal}%`} color="#3B5BDB" />
            <KpiCard icon={Award} label="Melhor Projeto" value={melhor?.nome || '-'} sub={`${melhor?.score || 0}%`} color="#10b981" />
            <KpiCard icon={Zap} label="Acima de 80%" value={acima80} sub={`de ${projetos.length} projetos`} color="#f59e0b" />
            <KpiCard icon={TrendingUp} label="Total de Horas" value={`${projetos.reduce((a, p) => a + (p.horas_investidas || 0), 0)}h`} color="#7C3AED" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
            {/* Score por projeto */}
            <div className="glass-card" style={{ padding: 24 }}>
              <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 15, fontWeight: 600, marginBottom: 20 }}>Score por Projeto</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={barData} layout="vertical">
                  <XAxis type="number" domain={[0, 100]} tick={{ fill: '#4A5680', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis dataKey="nome" type="category" tick={{ fill: '#7A8AAE', fontSize: 11 }} axisLine={false} tickLine={false} width={100} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: any) => [`${v}%`, 'Score']} />
                  <Bar dataKey="score" fill="#3B5BDB" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Evolução */}
            <div className="glass-card" style={{ padding: 24 }}>
              <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 15, fontWeight: 600, marginBottom: 20 }}>Evolução da Performance</h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(59,91,219,0.1)" />
                  <XAxis dataKey="mes" tick={{ fill: '#4A5680', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fill: '#4A5680', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: any) => [`${v}%`, 'Score']} />
                  <Line type="monotone" dataKey="score" stroke="#3B5BDB" strokeWidth={2} dot={{ fill: '#3B5BDB', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Ranking */}
          <div className="glass-card" style={{ padding: 24 }}>
            <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 15, fontWeight: 600, marginBottom: 20 }}>Ranking Completo</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {projetos.map((p, i) => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: i < projetos.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                    background: i === 0 ? 'rgba(245,158,11,0.15)' : i === 1 ? 'rgba(74,86,128,0.15)' : 'rgba(59,91,219,0.08)',
                    border: `1px solid ${i === 0 ? 'rgba(245,158,11,0.3)' : 'var(--border)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'Space Grotesk, sans-serif', fontSize: 12, fontWeight: 700,
                    color: i === 0 ? '#fbbf24' : i === 1 ? '#9aa5c4' : 'var(--text-muted)',
                  }}>
                    {i + 1}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <div>
                        <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: 14 }}>{p.nome}</span>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 8 }}>{p.empresa}</span>
                      </div>
                      <span style={{
                        fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 14,
                        color: p.score >= 80 ? '#10b981' : p.score >= 50 ? '#f59e0b' : '#f87171',
                      }}>{p.score}%</span>
                    </div>
                    <div className="progress-bar-track">
                      <div className="progress-bar-fill" style={{
                        width: `${p.score}%`,
                        background: p.score >= 80 ? 'linear-gradient(90deg, #10b981, #34d399)' : p.score >= 50 ? 'linear-gradient(90deg, #f59e0b, #fbbf24)' : 'linear-gradient(90deg, #ef4444, #f87171)',
                      }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Por empresa */}
          {empresaData.length > 0 && (
            <div style={{ marginTop: 20 }}>
              <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 15, fontWeight: 600, marginBottom: 14 }}>Score Médio por Empresa</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
                {empresaData.map(e => (
                  <div key={e.empresa} className="stat-card" style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 32, fontWeight: 700, color: e.media >= 80 ? '#10b981' : e.media >= 50 ? '#f59e0b' : '#f87171', lineHeight: 1 }}>
                      {e.media}%
                    </div>
                    <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 14, fontWeight: 600, marginTop: 8, marginBottom: 4 }}>{e.empresa}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{e.total} projeto{e.total !== 1 ? 's' : ''}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function KpiCard({ icon: Icon, label, value, sub, color }: any) {
  return (
    <div className="stat-card">
      <div style={{ width: 34, height: 34, borderRadius: 9, background: `${color}18`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
        <Icon size={16} color={color} />
      </div>
      <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 22, fontWeight: 700, lineHeight: 1.2, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: color, marginTop: 2 }}>{sub}</div>}
      <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>{label}</div>
    </div>
  )
}
