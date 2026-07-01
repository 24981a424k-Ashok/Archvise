"use client"

import React, { useState } from 'react'
import { RefreshCw, Search, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Project } from '@/types'
import ProjectCard from '@/components/shared/ProjectCard'
import EmptyState from '@/components/shared/EmptyState'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'

export default function ProjectsPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const limit = 10

  // Fetch paginated projects
  const { data: projects, isLoading, error, refetch, isFetching } = useQuery<Project[]>({
    queryKey: ['projects', 'list', page],
    queryFn: () => api.get<Project[]>(`/projects/all?page=${page}&limit=${limit}`),
    refetchInterval: 20000
  })

  // Filter projects by name locally
  const filteredProjects = projects?.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  ) || []

  const handleNextPage = () => {
    if (projects && projects.length === limit) {
      setPage(prev => prev + 1)
    }
  }

  const handlePrevPage = () => {
    setPage(prev => Math.max(prev - 1, 1))
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto select-none">
      {/* Header and Refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-textPrimary">All Projects</h2>
          <p className="text-xs text-textSecondary mt-0.5">Manage and review your architecture audits and designs.</p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => refetch()} 
          disabled={isFetching}
          className="flex items-center space-x-1.5"
        >
          <RefreshCw size={13} className={isFetching ? "animate-spin text-primary" : ""} />
          <span>Refresh</span>
        </Button>
      </div>

      {/* Filter and search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 h-4 w-4 text-textMuted" />
        <Input
          placeholder="Filter projects by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Loading states */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      )}

      {/* Projects Grid */}
      {!isLoading && !error && filteredProjects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}

      {/* Empty states */}
      {!isLoading && !error && filteredProjects.length === 0 && (
        <EmptyState 
          title={search ? "No matches found" : "No projects yet"}
          description={search ? "No projects found matching your search query. Try another keyword." : undefined}
        />
      )}

      {/* Pagination controls */}
      {!isLoading && !error && projects && (projects.length === limit || page > 1) && (
        <div className="flex items-center justify-center space-x-4 pt-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handlePrevPage} 
            disabled={page === 1}
            className="flex items-center space-x-1"
          >
            <ArrowLeft size={13} />
            <span>Previous</span>
          </Button>
          <span className="text-xs text-textSecondary font-semibold">Page {page}</span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleNextPage} 
            disabled={projects.length < limit}
            className="flex items-center space-x-1"
          >
            <span>Next</span>
            <ArrowRight size={13} />
          </Button>
        </div>
      )}
    </div>
  )
}
