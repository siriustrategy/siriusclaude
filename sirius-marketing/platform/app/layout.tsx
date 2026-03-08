import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'Sirius Marketing — Creative AI Studio',
  description: 'Crie conteúdo estratégico e viral com inteligência artificial, alinhado com a identidade da sua marca.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#161E34',
              color: '#E8EEFF',
              border: '1px solid rgba(59,91,219,0.28)',
              borderRadius: '10px',
              fontSize: '14px',
              fontFamily: 'DM Sans, sans-serif',
            },
          }}
        />
      </body>
    </html>
  )
}
