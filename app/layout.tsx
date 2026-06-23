import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TylerHodl — Build in Web3',
  description: '投资工具 × Web3 研究 × 内容运营',
  icons: { icon: '/favicon.ico' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className="dark" suppressHydrationWarning>
      <body className="min-h-screen bg-background antialiased">
        {children}
      </body>
    </html>
  )
}
