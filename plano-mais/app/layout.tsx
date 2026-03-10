import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Plano Mais — Sistema de Cobrança',
  description: 'Sistema inteligente de gestão de inadimplência e cobrança',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
