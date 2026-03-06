'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Sidebar from '@/components/layout/Sidebar'
import BottomNav from '@/components/layout/BottomNav'

export default function HubLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.replace('/login')
      else setChecking(false)
    })
  }, [router])

  if (checking) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        gap: 12, color: 'var(--text-muted)',
      }}>
        <div style={{
          width: 20, height: 20, border: '2px solid var(--border-strong)',
          borderTopColor: 'var(--accent)',
          borderRadius: '50%',
        }} className="animate-spin" />
        <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 14 }}>Carregando...</span>
      </div>
    )
  }

  return (
    <div className="hub-layout">
      <Sidebar />
      <main className="hub-main">
        <div className="hub-content animate-fade-in">
          {children}
        </div>
      </main>
      <BottomNav />
    </div>
  )
}
