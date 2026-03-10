'use client'

import { useSidebar } from '@/contexts/SidebarContext'

export default function MainWrapper({ children }: { children: React.ReactNode }) {
  const { sidebarWidth } = useSidebar()
  return (
    <main
      style={{
        marginLeft: sidebarWidth,
        paddingTop: 60,
        minHeight: '100vh',
        transition: 'margin-left 0.2s cubic-bezier(0.22,1,0.36,1)',
      }}
    >
      <div style={{ padding: '28px 32px' }}>
        {children}
      </div>
    </main>
  )
}
