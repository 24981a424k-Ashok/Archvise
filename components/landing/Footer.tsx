import React from 'react'
import Link from 'next/link'
import ArchviseLogo from '../brand/ArchviseLogo'

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background py-8 select-none">
      <div className="max-w-5xl mx-auto px-4 md:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand logo and name */}
        <div className="flex items-center space-x-2">
          <ArchviseLogo size={20} className="text-primary" />
          <span className="font-semibold text-textPrimary text-sm">Archvise</span>
        </div>

        {/* Copyright notice */}
        <p className="text-[10px] text-textMuted font-medium order-3 sm:order-2">
          &copy; {new Date().getFullYear()} Archvise. All rights reserved.
        </p>

        {/* Legal links */}
        <div className="flex space-x-5 text-xs text-textSecondary order-2 sm:order-3 font-semibold uppercase tracking-wider">
          <Link href="/legal/terms" className="hover:text-textPrimary transition-colors">
            Terms
          </Link>
          <Link href="/legal/privacy" className="hover:text-textPrimary transition-colors">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  )
}
