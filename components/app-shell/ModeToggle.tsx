"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { User, Settings } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { api } from '@/lib/api'

interface ModeToggleProps {
  compact?: boolean
}

export default function ModeToggle({ compact = false }: ModeToggleProps) {
  const { display_mode, updateDisplayMode } = useAuthStore()

  const handleToggle = (mode: 'founder' | 'engineer') => {
    updateDisplayMode(mode)
    // Fire background non-blocking request
    api.patch('/auth/mode', { display_mode: mode }).catch((err) => {
      console.error("Failed to update display mode in background", err)
    })
  }

  return (
    <div className="relative flex items-center bg-surface border border-border p-1 rounded-md select-none">
      <button
        onClick={() => handleToggle('founder')}
        className={`relative flex items-center justify-center space-x-1.5 rounded-sm transition-colors z-10 font-medium ${
          compact ? 'px-2.5 py-1 text-[10px]' : 'px-3.5 py-1.5 text-xs'
        } ${display_mode === 'founder' ? 'text-textPrimary' : 'text-textSecondary hover:text-textPrimary'}`}
      >
        <User size={compact ? 12 : 14} />
        <span>Founder</span>
        {display_mode === 'founder' && (
          <motion.div
            layoutId="activeModePill"
            className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-sm -z-10"
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
          />
        )}
      </button>
      <button
        onClick={() => handleToggle('engineer')}
        className={`relative flex items-center justify-center space-x-1.5 rounded-sm transition-colors z-10 font-medium ${
          compact ? 'px-2.5 py-1 text-[10px]' : 'px-3.5 py-1.5 text-xs'
        } ${display_mode === 'engineer' ? 'text-textPrimary' : 'text-textSecondary hover:text-textPrimary'}`}
      >
        <Settings size={compact ? 12 : 14} />
        <span>Engineer</span>
        {display_mode === 'engineer' && (
          <motion.div
            layoutId="activeModePill"
            className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-sm -z-10"
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
          />
        )}
      </button>
    </div>
  )
}
