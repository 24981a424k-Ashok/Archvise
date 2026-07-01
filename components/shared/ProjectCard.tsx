"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import { Shield, Building2, Calendar } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { Card } from '../ui/card'
import StatusBadge from './StatusBadge'
import { Project } from '@/types'

interface ProjectCardProps {
  project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const router = useRouter()

  const handleCardClick = () => {
    if (project.type === 'audit') {
      router.push(`/audit/${project.id}`)
    } else {
      router.push(`/design/${project.id}`)
    }
  }

  // Get type details
  const TypeIcon = project.type === 'audit' ? Shield : Building2
  const typeLabel = project.type === 'audit' ? 'Readiness Audit' : 'System Design'

  // Format date
  const timeDistance = React.useMemo(() => {
    try {
      const date = new Date(project.created_at)
      return formatDistanceToNow(date, { addSuffix: true })
    } catch (e) {
      return 'recently'
    }
  }, [project.created_at])

  return (
    <Card 
      onClick={handleCardClick}
      className="p-4 border-border hover:border-primary/40 bg-card hover:bg-cardElevated cursor-pointer transition-all flex items-center justify-between select-none"
    >
      <div className="flex items-center space-x-3.5 min-w-0 mr-4">
        {/* Type Icon */}
        <div className={`h-9 w-9 rounded-md flex items-center justify-center shrink-0 border ${
          project.type === 'audit' 
            ? 'bg-primary/10 border-primary/20 text-primary' 
            : 'bg-purple/10 border-purple/20 text-purple'
        }`}>
          <TypeIcon size={18} />
        </div>
        
        {/* Project info */}
        <div className="min-w-0">
          <h4 className="font-semibold text-textPrimary text-sm truncate mb-0.5" title={project.name}>
            {project.name}
          </h4>
          <div className="flex items-center space-x-2 text-[10px] text-textSecondary">
            <span className="font-medium">{typeLabel}</span>
            <span className="text-textMuted">&middot;</span>
            <span className="flex items-center space-x-0.5">
              <Calendar size={10} />
              <span>{timeDistance}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Right side StatusBadge */}
      <div className="shrink-0" onClick={e => e.stopPropagation()}>
        <StatusBadge 
          status={project.status} 
          type={project.type} 
          score={project.readiness_score} 
        />
      </div>
    </Card>
  )
}
export { ProjectCard }
