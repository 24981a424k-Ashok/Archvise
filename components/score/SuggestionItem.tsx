"use client"

import React from 'react'
import { Copy, Check, Zap } from 'lucide-react'
import { Suggestion } from '@/types'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface SuggestionItemProps {
  suggestion: Suggestion
  displayMode: 'founder' | 'engineer'
}

export default function SuggestionItem({ suggestion, displayMode }: SuggestionItemProps) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(suggestion.engineer_text)
    setCopied(true)
    toast.success("Engineer fix instructions copied to clipboard!")
    setTimeout(() => setCopied(false), 2000)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'text-orange bg-orange/10 border-orange/20'
      case 'medium': return 'text-warning bg-warning/10 border-warning/20'
      default: return 'text-primary bg-primary/10 border-primary/20'
    }
  }

  const getEffortColor = (effort: string) => {
    switch (effort.toLowerCase()) {
      case 'low': return 'text-success bg-successBg/10 border-success/20'
      case 'medium': return 'text-warning bg-warning/10 border-warning/20'
      default: return 'text-orange bg-orange/10 border-orange/20'
    }
  }

  const textToShow = displayMode === 'founder' ? suggestion.founder_text : suggestion.engineer_text

  return (
    <div className="flex items-start space-x-3.5 p-4 bg-surface border border-border rounded-md mb-3.5">
      <div className="mt-1 text-success shrink-0">
        <Zap size={16} className="text-success fill-success/10 animate-bounce" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className={cn("text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 border rounded-sm", getPriorityColor(suggestion.priority))}>
              {suggestion.priority} Priority
            </span>
            <span className={cn("text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 border rounded-sm", getEffortColor(suggestion.effort))}>
              {suggestion.effort} Effort
            </span>
          </div>
          {suggestion.estimated_score_gain > 0 && (
            <span className="text-[10px] font-bold bg-successBg/20 text-success border border-success/30 px-1.5 py-0.5 rounded-sm">
              +{suggestion.estimated_score_gain} pts
            </span>
          )}
        </div>

        <p className="text-sm font-semibold text-textPrimary mb-1">{suggestion.suggestion}</p>
        <p className="text-xs text-textSecondary leading-relaxed">{textToShow}</p>

        {suggestion.estimated_capacity_gain && (
          <p className="text-[11px] text-textMuted mt-1.5">
            <span className="font-semibold text-success">Capacity Gain:</span> {suggestion.estimated_capacity_gain}
          </p>
        )}
      </div>

      {displayMode === 'engineer' && (
        <button
          onClick={handleCopy}
          className="h-8 w-8 shrink-0 flex items-center justify-center border border-border hover:bg-card hover:text-textPrimary text-textSecondary rounded-md transition-colors focus:outline-none"
          title="Copy fix command"
        >
          {copied ? <Check size={13} className="text-success" /> : <Copy size={13} />}
        </button>
      )}
    </div>
  )
}
