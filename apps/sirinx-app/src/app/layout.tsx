import type { Metadata } from 'next'
import { Sarabun } from 'next/font/google'
import './globals.css'
import Sidebar from '@/components/layout/Sidebar'

const sarabun = Sarabun({
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sarabun',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'SIRINX AI-WarRoom',
  description: '47 Ronin Multi-Agent System — Solar Energy Intelligence Platform',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={sarabun.variable}>
      <body style={{ fontFamily: 'var(--font-sarabun), Sarabun, "Noto Sans Thai", sans-serif' }}>
        <div style={{ display: 'flex', minHeight: '100vh' }}>
          <Sidebar />
          <main style={{ flex: 1, minWidth: 0, overflow: 'auto' }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
