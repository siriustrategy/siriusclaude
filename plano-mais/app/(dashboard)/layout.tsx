import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AuthProvider } from '@/contexts/AuthContext'
import { SidebarProvider } from '@/contexts/SidebarContext'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import MainWrapper from '@/components/MainWrapper'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <AuthProvider>
      <SidebarProvider>
        <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
          <Sidebar />
          <Header />
          <MainWrapper>{children}</MainWrapper>
        </div>
      </SidebarProvider>
    </AuthProvider>
  )
}
