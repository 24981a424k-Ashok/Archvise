"use client"

import React from 'react'
import { Loader2, AlertCircle, Clock, Check } from 'lucide-react'
import ScoreGauge from '../score/ScoreGauge'
import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  status: 'queued' | 'processing' | 'complete' | 'failed'
  type: 'audit' | 'system_design'
  score?: number
}

export default function StatusBadge({ status, type, score }: StatusBadgeProps) {
  switch (status) {
    case 'queued':
      return (
        <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 text-xs rounded-md bg-border border border-borderLight text-textSecondary font-semibold select-none">
          <Clock size={12} />
          <span>Queued</span>
        </span>
      )
    case 'processing':
      return (
        <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 text-xs rounded-md bg-primary/10 border border-primary/20 text-primary font-semibold select-none animate-pulse">
          <Loader2 size={12} className="animate-spin" />
          <span>{type === 'audit' ? 'Analyzing...' : 'Designing...'}</span>
        </span>
      )
    case 'complete':
      if (type === 'audit' && score !== undefined) {
        return <ScoreGauge score={score} size="sm" />
      }
      return (
        <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 text-xs rounded-md bg-successBg/10 border border-success/20 text-success font-semibold select-none">
          <Check size={12} />
          <span>Ready</span>
        </span>
      )
    default:
      return (
        <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 text-xs rounded-md bg-dangerBg/10 border border-danger/20 text-danger font-semibold select-none">
          <AlertCircle size={12} />
          <span>Failed</span>
        </span>
      )
  }
}
