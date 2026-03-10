'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Eye, EyeOff, LogIn, AlertCircle, Shield } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: senha,
      })

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setErro('Email ou senha incorretos. Verifique os dados e tente novamente.')
        } else if (error.message.includes('Email not confirmed')) {
          setErro('Seu email ainda não foi confirmado. Verifique sua caixa de entrada.')
        } else {
          setErro(error.message)
        }
        return
      }

      if (data.user) {
        // Verificar o role do usuário para redirecionar corretamente
        const { data: userData } = await supabase
          .from('usuarios')
          .select('role')
          .eq('id', data.user.id)
          .single()

        if (userData?.role === 'gestor') {
          router.push('/dashboard')
        } else {
          router.push('/chat')
        }
      }
    } catch {
      setErro('Ocorreu um erro inesperado. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: 'var(--bg)' }}>

      {/* Background — gradiente radial com brilhos sutis */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 20% 30%, rgba(13,61,204,0.18) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 80% 70%, rgba(80,247,232,0.08) 0%, transparent 55%),
            radial-gradient(ellipse 40% 40% at 50% 10%, rgba(13,61,204,0.12) 0%, transparent 50%)
          `
        }}
      />

      {/* Grade sutil de pontos */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(13,61,204,0.4) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />

      {/* Card de login */}
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        {/* Logo + Título */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="inline-flex items-center justify-center mb-4"
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #0D3DCC 0%, #002073 100%)',
                boxShadow: '0 8px 32px rgba(13,61,204,0.45)',
                border: '1px solid rgba(80,247,232,0.2)'
              }}
            >
              {/* Ícone SVG personalizado — letra P estilizada */}
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <text
                  x="50%"
                  y="50%"
                  dominantBaseline="central"
                  textAnchor="middle"
                  fontFamily="Space Grotesk, sans-serif"
                  fontWeight="700"
                  fontSize="18"
                  fill="#50F7E8"
                >P+</text>
              </svg>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 700,
              fontSize: '26px',
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
              marginBottom: '4px'
            }}
          >
            Plano Mais
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 }}
            style={{ color: 'var(--text-secondary)', fontSize: '14px' }}
          >
            Sistema de Cobrança Inteligente
          </motion.p>
        </div>

        {/* Formulário */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card"
          style={{ padding: '32px' }}
        >
          <div className="flex items-center gap-2 mb-6">
            <Shield size={16} style={{ color: 'var(--teal)' }} />
            <span style={{ color: 'var(--text-secondary)', fontSize: '13px', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500 }}>
              Acesso Seguro
            </span>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            {/* Campo Email */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: 600,
                  fontSize: '13px',
                  color: 'var(--text-secondary)',
                  letterSpacing: '0.03em'
                }}
              >
                EMAIL
              </label>
              <input
                id="email"
                type="email"
                className="input-field"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                disabled={loading}
              />
            </div>

            {/* Campo Senha */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="senha"
                style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: 600,
                  fontSize: '13px',
                  color: 'var(--text-secondary)',
                  letterSpacing: '0.03em'
                }}
              >
                SENHA
              </label>
              <div className="relative">
                <input
                  id="senha"
                  type={mostrarSenha ? 'text' : 'password'}
                  className="input-field"
                  placeholder="••••••••"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  autoComplete="current-password"
                  disabled={loading}
                  style={{ paddingRight: '44px' }}
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
                  tabIndex={-1}
                >
                  {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Erro */}
            {erro && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3 rounded-lg p-3"
                style={{
                  background: 'rgba(192,57,43,0.10)',
                  border: '1px solid rgba(192,57,43,0.28)',
                }}
              >
                <AlertCircle size={16} style={{ color: 'var(--error-light)', flexShrink: 0, marginTop: '2px' }} />
                <span style={{ color: '#FF6B5A', fontSize: '13px', lineHeight: 1.5 }}>{erro}</span>
              </motion.div>
            )}

            {/* Botão Entrar */}
            <motion.button
              type="submit"
              className="btn-primary w-full"
              disabled={loading || !email || !senha}
              whileTap={{ scale: 0.98 }}
              animate={!loading ? {
                boxShadow: [
                  '0 4px 16px rgba(13,61,204,0.3)',
                  '0 4px 24px rgba(80,247,232,0.2)',
                  '0 4px 16px rgba(13,61,204,0.3)',
                ]
              } : {}}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              style={{ marginTop: '4px', fontSize: '15px', padding: '14px' }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="spinner" style={{ width: '16px', height: '16px' }} />
                  Entrando...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <LogIn size={16} />
                  Entrar no Sistema
                </span>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Rodapé discreto */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-6"
          style={{ color: 'var(--text-muted)', fontSize: '12px' }}
        >
          Sistema interno Plano Mais — acesso restrito
        </motion.p>
      </motion.div>
    </div>
  )
}
