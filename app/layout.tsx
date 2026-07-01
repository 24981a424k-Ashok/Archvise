import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Providers from '@/components/Providers'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Archvise — Production Readiness for AI-Built Apps',
  description: 'Audit your code or design a system architecture with AI. Know if your app can handle real users before launch.',
  openGraph: {
    title: 'Archvise — Production Readiness for AI-Built Apps',
    description: 'Audit your code or design a system architecture with AI. Know if your app can handle real users before launch.',
    images: ['/og.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.className} bg-background text-textPrimary antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
