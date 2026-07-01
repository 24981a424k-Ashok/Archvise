"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import { FolderKanban, Plus } from 'lucide-react'
import { Button } from '../ui/button'

interface EmptyStateProps {
  title?: string
  description?: string
  actionLabel?: string
  actionHref?: string
}

export default function EmptyState({
  title = "No projects yet",
  description = "Start your first audit or generate an architecture system design.",
  actionLabel = "Start Your First Audit",
  actionHref = "/audit/new"
}: EmptyStateProps) {
  const router = useRouter()

  return (
    <div className="flex flex-col items-center justify-center p-12 border border-border rounded-lg bg-surface/30 text-center select-none max-w-md mx-auto my-8">
      <div className="h-14 w-14 rounded-full bg-borderLight/30 flex items-center justify-center text-textMuted mb-4">
        <FolderKanban size={28} />
      </div>
      <h3 className="font-semibold text-textPrimary text-sm mb-1.5">{title}</h3>
      <p className="text-xs text-textSecondary max-w-xs mb-6 leading-relaxed">
        {description}
      </p>
      <Button 
        onClick={() => router.push(actionHref)}
        className="flex items-center space-x-1.5"
      >
        <Plus size={15} />
        <span>{actionLabel}</span>
      </Button>
    </div>
  )
}
