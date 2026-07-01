"use client"

import React from 'react'
import { Info } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Confidence } from '@/types'
import { cn } from '@/lib/utils'

interface ConfidenceBadgeProps {
  confidence: Confidence
}

export default function ConfidenceBadge({ confidence }: ConfidenceBadgeProps) {
  const getLevelStyles = (level: 'high' | 'medium' | 'low') => {
    switch (level) {
      case 'high':
        return 'text-success bg-successBg/10 border-success/20'
      case 'medium':
        return 'text-warning bg-warningBg/10 border-warning/20'
      default:
        return 'text-danger bg-dangerBg/10 border-danger/20'
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className={cn(
          "inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold select-none cursor-pointer focus:outline-none transition-colors hover:bg-surface",
          getLevelStyles(confidence.level)
        )}>
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          <span className="capitalize">{confidence.level} Confidence</span>
          <Info size={13} className="text-textSecondary" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="center" className="w-80 p-4 border border-border bg-cardElevated shadow-xl">
        <div className="space-y-4">
          <div>
            <h4 className="font-bold text-textPrimary text-xs mb-1.5">Based On</h4>
            <ul className="list-disc pl-4 space-y-1 text-[11px] text-textSecondary">
              {confidence.based_on.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
          
          {confidence.limitations && confidence.limitations.length > 0 && (
            <div>
              <h4 className="font-bold text-textPrimary text-xs mb-1.5">Limitations</h4>
              <ul className="list-disc pl-4 space-y-1 text-[11px] text-textSecondary">
                {confidence.limitations.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {confidence.to_increase_confidence && confidence.to_increase_confidence.length > 0 && (
            <div className="border-t border-border pt-3">
              <h4 className="font-bold text-primary text-xs mb-1.5">To Increase Confidence</h4>
              <ul className="list-disc pl-4 space-y-1 text-[11px] text-primaryLight">
                {confidence.to_increase_confidence.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
