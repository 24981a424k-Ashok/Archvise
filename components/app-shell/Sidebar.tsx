"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, FolderOpen, Settings, ShieldCheck } from 'lucide-react'
import ArchviseLogo from '../brand/ArchviseLogo'
import { useAuthStore } from '@/stores/authStore'
import { cn } from '@/lib/utils'

interface SidebarProps {
  className?: string
  onLinkClick?: () => void
}

export default function Sidebar({ className, onLinkClick }: SidebarProps) {
  const pathname = usePathname()
  const { user } = useAuthStore()

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Projects', href: '/projects', icon: FolderOpen },
    { name: 'Settings', href: '/settings', icon: Settings },
  ]

  // Get plan badge styling
  const getPlanStyles = (plan: string) => {
    switch (plan) {
      case 'pro':
        return 'bg-purple/10 text-purple border-purple/20'
      case 'starter':
        return 'bg-primary/10 text-primary border-primary/20'
      default:
        return 'bg-textSecondary/10 text-textSecondary border-textSecondary/20'
    }
  }

  // Get first letter of name for avatar placeholder
  const avatarLetter = user?.name ? user.name.charAt(0).toUpperCase() : 'U'

  return (
    <aside className={cn("flex flex-col h-full bg-surface border-r border-border w-[240px] text-textPrimary select-none p-4", className)}>
      {/* Brand logo */}
      <div className="flex items-center space-x-2.5 px-2 py-4 mb-6">
        <Link href="/dashboard" className="flex items-center space-x-2 text-textPrimary hover:opacity-90" onClick={onLinkClick}>
          <ArchviseLogo size={28} className="text-primary animate-pulse" />
          <span className="font-bold tracking-tight text-lg">Archvise</span>
        </Link>
      </div>

      {/* Navigation links */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
          const Icon = item.icon
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onLinkClick}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive 
                  ? "bg-primary/15 text-primary border-l-2 border-primary" 
                  : "text-textSecondary hover:text-textPrimary hover:bg-card"
              )}
            >
              <Icon size={18} />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Bottom user profile info */}
      {user && (
        <div className="border-t border-border pt-4 mt-auto">
          <div className="flex items-center space-x-3 mb-2 px-1">
            <div className="h-9 w-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center font-bold text-primary text-sm">
              {avatarLetter}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-textPrimary leading-none mb-1">{user.name}</p>
              <span className={cn("inline-block text-[9px] px-1.5 py-0.5 rounded-sm border font-semibold uppercase tracking-wider", getPlanStyles(user.plan))}>
                {user.plan}
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-xs text-textSecondary bg-card px-3 py-2 rounded-md border border-border mt-2">
            <span>Credits remaining:</span>
            <span className="font-bold text-textPrimary">{user.credits_remaining === 999999 ? '∞' : user.credits_remaining}</span>
          </div>
        </div>
      )}
    </aside>
  )
}
