import React from 'react'
import { AlertCircle } from 'lucide-react'
import { Finding } from '@/types'
import { cn } from '@/lib/utils'

interface FindingItemProps {
  finding: Finding
  displayMode: 'founder' | 'engineer'
}

export default function FindingItem({ finding, displayMode }: FindingItemProps) {
  const getSeverityStyles = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
      case 'high':
        return 'text-danger bg-dangerBg/10 border-danger/20'
      case 'medium':
        return 'text-warning bg-warningBg/10 border-warning/20'
      default:
        return 'text-primary bg-primary/10 border-primary/20'
    }
  }

  const textToShow = displayMode === 'founder' ? finding.founder_text : finding.engineer_text

  return (
    <div className="flex items-start space-x-3 p-3.5 bg-surface border border-border rounded-md mb-2.5">
      <div className="mt-0.5 text-textSecondary shrink-0">
        <AlertCircle size={15} className="text-textMuted" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1.5">
          <span className={cn(
            "text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 border rounded-sm",
            getSeverityStyles(finding.severity)
          )}>
            {finding.severity}
          </span>
          <span className="text-xs text-textMuted font-mono truncate max-w-xs">{finding.location}</span>
        </div>
        <p className="text-sm font-semibold text-textPrimary mb-1">{finding.issue}</p>
        <p className="text-xs text-textSecondary leading-relaxed">{textToShow}</p>
        {displayMode === 'engineer' && finding.impact && (
          <p className="text-[11px] text-textMuted mt-1.5">
            <span className="font-semibold text-danger">Impact:</span> {finding.impact}
          </p>
        )}
      </div>
    </div>
  )
}
