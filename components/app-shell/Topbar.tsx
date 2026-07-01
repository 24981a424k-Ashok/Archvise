"use client"

import React, { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, LogOut, User as UserIcon, HelpCircle } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet'
import Sidebar from './Sidebar'
import ModeToggle from './ModeToggle'
import { useAuth } from '@/hooks/useAuth'
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuLabel 
} from '../ui/dropdown-menu'

export default function Topbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  // Map route paths to human-friendly titles
  const getPageTitle = (path: string) => {
    if (path.startsWith('/dashboard')) return 'Dashboard'
    if (path.startsWith('/projects')) return 'My Projects'
    if (path.startsWith('/audit/new')) return 'New Code Audit'
    if (path.startsWith('/audit/')) return 'Readiness Audit Report'
    if (path.startsWith('/design/new')) return 'System Design Generator'
    if (path.startsWith('/design/')) return 'Architecture Blueprint'
    if (path.startsWith('/github/connect')) return 'Connect GitHub'
    if (path.startsWith('/github/select-repo')) return 'Select Repository'
    if (path.startsWith('/billing/upgrade')) return 'Upgrade Account'
    if (path.startsWith('/settings')) return 'Settings'
    return 'Archvise'
  }

  const handleLogout = async () => {
    await logout()
    router.push('/sign-in')
  }

  // Get user avatar letter
  const avatarLetter = user?.name ? user.name.charAt(0).toUpperCase() : 'U'

  return (
    <header className="flex h-16 w-full items-center justify-between border-b border-border bg-surface px-4 lg:px-6 select-none">
      <div className="flex items-center space-x-3">
        {/* Mobile Hamburger menu sheet */}
        <div className="lg:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button className="flex h-10 w-10 items-center justify-center rounded-md border border-border text-textSecondary hover:text-textPrimary hover:bg-card">
                <Menu size={20} />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-[240px] bg-surface border-r border-border h-full">
              <Sidebar onLinkClick={() => setMobileOpen(false)} />
            </SheetContent>
          </Sheet>
        </div>

        {/* Page Title */}
        <h1 className="text-lg font-medium text-textPrimary">{getPageTitle(pathname)}</h1>
      </div>

      <div className="flex items-center space-x-4">
        {/* Display Mode Toggle */}
        <ModeToggle />

        {/* User profile dropdown menu */}
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="h-9 w-9 rounded-full bg-primary/20 border border-primary/30 text-primary font-bold text-sm hover:opacity-90 flex items-center justify-center focus:outline-none">
                {avatarLetter}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-0.5">
                  <span className="text-sm font-medium truncate text-textPrimary leading-none">{user.name}</span>
                  <span className="text-xs truncate text-textSecondary leading-normal mt-0.5">{user.email}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/settings')}>
                <UserIcon size={14} className="mr-2" />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/pricing')}>
                <HelpCircle size={14} className="mr-2" />
                Pricing Plans
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-danger hover:bg-dangerBg/10">
                <LogOut size={14} className="mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  )
}
