"use client"

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Shield, Building2, AlertTriangle, ArrowRight } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/stores/authStore'
import { api } from '@/lib/api'
import { Project } from '@/types'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import ProjectCard from '@/components/shared/ProjectCard'
import EmptyState from '@/components/shared/EmptyState'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'

export default function DashboardPage() {
  const router = useRouter()
  const { user } = useAuthStore()

  // Fetch 6 most recent projects
  const { data: recentProjects, isLoading, error } = useQuery<Project[]>({
    queryKey: ['projects', 'recent'],
    queryFn: () => api.get<Project[]>('/projects/recent'),
    refetchInterval: 15000 // Refetch every 15s to poll active jobs
  })

  // Extract first name
  const firstName = user?.name ? user.name.split(' ')[0] : 'there'

  // Credits warning condition
  const showCreditsWarning = user?.credits_remaining === 0 && user?.plan === 'free'

  return (
    <div className="space-y-6 max-w-5xl mx-auto select-none">
      {/* Welcome header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-textPrimary">Hey {firstName} 👋</h2>
          <p className="text-xs text-textSecondary mt-0.5">Welcome back to your architecture audit hub.</p>
        </div>
      </div>

      {/* Conditional credits warning */}
      {showCreditsWarning && (
        <Alert variant="warning" className="border-warning/30 bg-warningBg/10">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <AlertTitle className="text-xs font-bold text-warning uppercase">Out of Credits</AlertTitle>
          <AlertDescription className="text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-1 text-warning">
            <span>You have used your 2 free analyses this month. Upgrade your plan to continue scanning repositories.</span>
            <Button 
              size="sm" 
              onClick={() => router.push('/billing/upgrade')}
              className="bg-warning text-black hover:bg-warning/80 shrink-0 font-bold text-[10px] uppercase tracking-wider h-8"
            >
              Upgrade Now
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Core Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Audit My Code Card */}
        <Card 
          onClick={() => router.push('/audit/new')}
          className="border-l-4 border-primary bg-card hover:bg-cardElevated p-6 cursor-pointer transition-all hover:scale-[1.01] hover:shadow-lg flex items-start space-x-4"
        >
          <div className="h-10 w-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
            <Shield size={20} />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-textPrimary">Audit My Code</h3>
            <p className="text-xs text-textSecondary leading-relaxed">
              Upload raw source files or connect your GitHub repository to audit security, connection pooling, and uptime targets.
            </p>
          </div>
        </Card>

        {/* System Design Card */}
        <Card 
          onClick={() => router.push('/design/new')}
          className="border-l-4 border-purple bg-card hover:bg-cardElevated p-6 cursor-pointer transition-all hover:scale-[1.01] hover:shadow-lg flex items-start space-x-4"
        >
          <div className="h-10 w-10 rounded-full bg-purple/10 border border-purple/20 flex items-center justify-center text-purple shrink-0">
            <Building2 size={20} />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-textPrimary">System Design</h3>
            <p className="text-xs text-textSecondary leading-relaxed">
              Describe your application concept and generate complete architecture stacks, cost estimations, and interactive blueprints in 30 seconds.
            </p>
          </div>
        </Card>
      </div>

      {/* Recent Projects Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-textPrimary text-sm">Recent Projects</h3>
          {recentProjects && recentProjects.length > 0 && (
            <Link 
              href="/projects" 
              className="text-xs font-bold text-primary hover:text-primaryLight flex items-center space-x-1 transition-colors uppercase tracking-wider"
            >
              <span>View All</span>
              <ArrowRight size={12} />
            </Link>
          )}
        </div>

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 4].map(i => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        )}

        {/* List of projects */}
        {!isLoading && !error && recentProjects && recentProjects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && (!recentProjects || recentProjects.length === 0) && (
          <EmptyState />
        )}
      </div>
    </div>
  )
}
