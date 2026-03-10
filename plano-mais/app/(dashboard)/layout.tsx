import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AuthProvider } from '@/contexts/AuthContext'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <AuthProvider>
      <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
        <Sidebar />
        <Header />
        <main style={{ marginLeft: 220, paddingTop: 60, minHeight: '100vh' }}>
          <div style={{ padding: '28px 32px' }}>
            {children}
          </div>
        </main>
      </div>
    </AuthProvider>
  )
}
