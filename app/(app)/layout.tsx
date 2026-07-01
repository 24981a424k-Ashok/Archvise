"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/app-shell/Sidebar'
import Topbar from '@/components/app-shell/Topbar'
import { useAuth } from '@/hooks/useAuth'
import ArchviseLogo from '@/components/brand/ArchviseLogo'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  // Enforce authentication
  React.useEffect(() => {
    if (!loading && !user) {
      router.push('/sign-in')
    }
  }, [loading, user, router])

  if (loading || !user) {
    return (
      <div className="min-h-screen w-full bg-background flex flex-col items-center justify-center select-none text-center">
        <ArchviseLogo size={48} className="text-primary animate-pulse mb-4" />
        <p className="text-xs text-textSecondary font-semibold tracking-wider uppercase">Loading Archvise Panel...</p>
      </div>
    )
  }

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Sidebar - Desktop persistent */}
      <div className="hidden lg:block shrink-0">
        <Sidebar className="h-full" />
      </div>

      {/* Main panel */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Topbar */}
        <Topbar />
        
        {/* Main page content scroll region */}
        <main className="flex-1 overflow-y-auto bg-background p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
