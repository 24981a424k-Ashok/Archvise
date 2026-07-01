"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Shield, Check, Loader2 } from 'lucide-react'
import { Card } from '../ui/card'
import { cn } from '@/lib/utils'

interface Step {
  agent: string
  label: string
  status: 'pending' | 'active' | 'complete'
}

interface AuditProgressStreamProps {
  steps: Step[]
}

export default function AuditProgressStream({ steps }: AuditProgressStreamProps) {
  const getAgentColor = (agent: string) => {
    switch (agent) {
      case 'connecting': return 'bg-primary border-primary'
      case 'sre': return 'bg-agentSRE border-agentSRE'
      case 'backend': return 'bg-agentBackend border-agentBackend'
      case 'infrastructure': return 'bg-agentInfra border-agentInfra'
      case 'cloud_architect': return 'bg-agentCloud border-agentCloud'
      default: return 'bg-textMuted border-border'
    }
  }

  return (
    <div className="flex flex-col items-center justify-center max-w-md mx-auto py-20 px-4 select-none">
      {/* Concentric pulsing shield icon */}
      <div className="relative h-28 w-28 flex items-center justify-center mb-8">
        {/* Pulsing circle 1 */}
        <motion.div
          className="absolute inset-0 rounded-full bg-primary/10 border border-primary/20"
          animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Pulsing circle 2 */}
        <motion.div
          className="absolute inset-2 rounded-full bg-primary/15 border border-primary/30"
          animate={{ scale: [1, 1.5, 1], opacity: [0.8, 0, 0.8] }}
          transition={{ duration: 3, delay: 1, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Central Shield */}
        <div className="h-16 w-16 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary z-10">
          <Shield size={28} className="animate-pulse" />
        </div>
      </div>

      <h2 className="text-xl font-bold text-textPrimary text-center mb-1">Analyzing your code</h2>
      <p className="text-sm text-textSecondary text-center mb-8">
        Our AI engineering panel is reviewing your codebase.
      </p>

      {/* Progress Timeline */}
      <Card className="w-full p-6 bg-card border-border mb-6">
        <div className="relative pl-6 border-l border-border space-y-6">
          {steps.map((step, idx) => {
            const isPending = step.status === 'pending'
            const isActive = step.status === 'active'
            const isComplete = step.status === 'complete'
            
            return (
              <div key={idx} className="relative select-none">
                {/* Timeline circle indicator */}
                <div 
                  className={cn(
                    "absolute -left-[30px] top-0.5 h-4 w-4 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                    isPending ? "bg-surface border-border" : getAgentColor(step.agent)
                  )}
                >
                  {isComplete && <Check size={8} className="text-textPrimary" />}
                  {isActive && (
                    <span className="absolute inset-0 rounded-full border-2 border-inherit animate-ping opacity-75" />
                  )}
                </div>

                {/* Step label */}
                <div className="flex items-center space-x-2">
                  <span className={cn(
                    "text-xs font-semibold transition-colors",
                    isPending && "text-textMuted",
                    isActive && "text-textPrimary font-bold",
                    isComplete && "text-textSecondary"
                  )}>
                    {step.label}
                  </span>
                  {isActive && <Loader2 size={12} className="text-primary animate-spin" />}
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      <span className="text-xs text-textMuted font-semibold mb-1 block">Usually takes 20-40 seconds</span>
      <span className="text-[10px] text-textMuted block">Files are permanently deleted after analysis.</span>
    </div>
  )
}
