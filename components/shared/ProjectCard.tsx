"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import { Shield, Building2, Calendar, Trash2, Loader2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { useQueryClient } from '@tanstack/react-query'
import { Card } from '../ui/card'
import StatusBadge from './StatusBadge'
import { Project } from '@/types'
import { api } from '@/lib/api'
import { toast } from 'sonner'

interface ProjectCardProps {
  project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [deleting, setDeleting] = React.useState(false)

  const handleCardClick = () => {
    if (project.type === 'audit') {
      router.push(`/audit/${project.id}`)
    } else {
      router.push(`/design/${project.id}`)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to permanently delete this project?')) return;
    
    setDeleting(true)
    try {
      if (project.type === 'audit') {
        await api.delete(`/audit/${project.id}`)
      } else {
        await api.delete(`/design/${project.id}`)
      }
      toast.success('Project deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    } catch (e: any) {
      toast.error(e.message || 'Failed to delete project')
    } finally {
      setDeleting(false)
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

      {/* Right side StatusBadge and Delete button */}
      <div className="shrink-0 flex items-center space-x-3.5" onClick={e => e.stopPropagation()}>
        <StatusBadge 
          status={project.status} 
          type={project.type} 
          score={project.readiness_score} 
        />
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="text-textMuted hover:text-danger p-1.5 rounded-md hover:bg-dangerBg transition-colors disabled:opacity-50"
          title="Delete Project"
        >
          {deleting ? (
            <Loader2 size={15} className="animate-spin text-danger" />
          ) : (
            <Trash2 size={15} />
          )}
        </button>
      </div>
    </Card>
  )
}
export { ProjectCard }
