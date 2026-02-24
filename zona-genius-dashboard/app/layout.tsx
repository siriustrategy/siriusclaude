import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Zona de Genialidade - Dashboard',
  description: 'Descubra seu potencial com o assessment de Genius Zone',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
