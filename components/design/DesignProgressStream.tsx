"use client"

import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Check, Loader2, X } from 'lucide-react'
import { Card } from '../ui/card'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'
import Image from 'next/image'

interface Step {
  agent: string
  label: string
  status: 'pending' | 'active' | 'complete'
}

interface DesignProgressStreamProps {
  steps: Step[]
  onCancel?: () => void
}

export default function DesignProgressStream({ steps, onCancel }: DesignProgressStreamProps) {
  const completedCount = steps.filter(s => s.status === 'complete').length
  const totalCount = steps.length
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  const activeStep = steps.find(s => s.status === 'active')

  const getAgentColor = (agent: string) => {
    switch (agent) {
      case 'connecting': return 'bg-primary border-primary'
      case 'sre': return 'bg-purple border-purple'
      case 'backend': return 'bg-blue-500 border-blue-500'
      case 'infrastructure': return 'bg-emerald-500 border-emerald-500'
      case 'cloud_architect': return 'bg-amber-500 border-amber-500'
      default: return 'bg-textMuted border-border'
    }
  }

  return (
    <div className="flex flex-col items-center justify-center max-w-md mx-auto py-20 px-4 select-none">
      {/* Animated logo */}
      <div className="relative h-28 w-28 flex items-center justify-center mb-8">
        <motion.div
          className="absolute inset-0 rounded-full bg-purple/10 border border-purple/20"
          animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute inset-2 rounded-full bg-purple/15 border border-purple/30"
          animate={{ scale: [1, 1.5, 1], opacity: [0.8, 0, 0.8] }}
          transition={{ duration: 3, delay: 1, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="h-16 w-16 rounded-full bg-purple/20 border border-purple/30 flex items-center justify-center z-10">
          <Image src="/icon.png" alt="Archvise" width={36} height={36} className="opacity-90" />
        </div>
      </div>

      <h2 className="text-xl font-bold text-textPrimary text-center mb-1">Drafting Architecture Blueprint</h2>
      <p className="text-sm text-textSecondary text-center mb-6">
        {activeStep ? activeStep.label : 'Our system architects are designing your stack...'}
      </p>

      {/* Progress bar */}
      <div className="w-full mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-textMuted font-medium">Progress</span>
          <span className="text-xs font-bold text-purple">{progressPct}% complete</span>
        </div>
        <div className="w-full h-2 bg-surface rounded-full border border-border overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-purple to-primary rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>
        <p className="text-[10px] text-textMuted mt-1.5 text-right">
          {completedCount} of {totalCount} steps done
        </p>
      </div>

      {/* Steps timeline */}
      <Card className="w-full p-6 bg-card border-border mb-6">
        <div className="relative pl-6 border-l border-border space-y-5">
          {steps.map((step, idx) => {
            const isPending = step.status === 'pending'
            const isActive = step.status === 'active'
            const isComplete = step.status === 'complete'
            return (
              <div key={idx} className="relative">
                <div className={cn(
                  'absolute -left-[30px] top-0.5 h-4 w-4 rounded-full border-2 flex items-center justify-center transition-all duration-300',
                  isPending ? 'bg-surface border-border' : getAgentColor(step.agent)
                )}>
                  {isComplete && <Check size={8} className="text-white" />}
                  {isActive && <span className="absolute inset-0 rounded-full border-2 border-inherit animate-ping opacity-75" />}
                </div>
                <div className="flex items-center space-x-2">
                  <span className={cn(
                    'text-xs font-semibold transition-colors',
                    isPending && 'text-textMuted',
                    isActive && 'text-textPrimary font-bold',
                    isComplete && 'text-textSecondary line-through decoration-textMuted/50'
                  )}>
                    {step.label}
                  </span>
                  {isActive && <Loader2 size={12} className="text-purple animate-spin" />}
                  {isComplete && <Check size={10} className="text-emerald-500" />}
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      <span className="text-xs text-textMuted font-semibold mb-1 block">Usually takes 15-30 seconds</span>
      <span className="text-[10px] text-textMuted mb-6">Designs are automatically compiled using NIM models.</span>

      {/* Cancel button */}
      {onCancel && (
        <Button
          variant="outline"
          size="sm"
          onClick={onCancel}
          className="flex items-center space-x-1.5 text-danger border-danger/30 hover:bg-danger/10 hover:text-danger"
        >
          <X size={13} />
          <span>Cancel Generation</span>
        </Button>
      )}
    </div>
  )
}
