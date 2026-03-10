import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AuthProvider } from '@/contexts/AuthContext'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <AuthProvider>
      <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
        {/* Sidebar fixa */}
        <Sidebar />

        {/* Header fixo */}
        <Header />

        {/* Area de conteudo principal */}
        <main
          style={{
            marginLeft: '240px',
            paddingTop: '64px',
            minHeight: '100vh',
          }}
        >
          <div style={{ padding: '32px' }}>
            {children}
          </div>
        </main>
      </div>
    </AuthProvider>
  )
}
