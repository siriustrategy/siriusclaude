'use client'

import { createContext, useContext, useState } from 'react'

interface SidebarContextType {
  collapsed: boolean
  toggleCollapsed: () => void
  sidebarWidth: number
}

const SidebarContext = createContext<SidebarContextType>({
  collapsed: false,
  toggleCollapsed: () => {},
  sidebarWidth: 220,
})

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const sidebarWidth = collapsed ? 60 : 220

  return (
    <SidebarContext.Provider value={{ collapsed, toggleCollapsed: () => setCollapsed(p => !p), sidebarWidth }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  return useContext(SidebarContext)
}
