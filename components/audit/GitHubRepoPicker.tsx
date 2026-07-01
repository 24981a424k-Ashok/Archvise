"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, RefreshCw, FolderGit2, GitBranch, ArrowRight } from 'lucide-react'
import { Github } from '@/components/icons/Github'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Skeleton } from '../ui/skeleton'

interface GitHubRepoPickerProps {
  onRepoSelected: (repo: string, branch: string) => void
}

interface RepoData {
  id: number
  name: string
  full_name: string
  html_url: string
  description?: string
  language?: string
  updated_at: string
  private: boolean
}

export default function GitHubRepoPicker({ onRepoSelected }: GitHubRepoPickerProps) {
  const router = useRouter()
  const { user } = useAuthStore()
  const [search, setSearch] = useState('')
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null)
  const [selectedBranch, setSelectedBranch] = useState('main')

  // Fetch repositories
  const { data: repos, isLoading, error, refetch } = useQuery<RepoData[]>({
    queryKey: ['github', 'repos'],
    queryFn: () => api.get<RepoData[]>('/github/repos'),
    enabled: !!user?.github_connected,
    retry: 1
  })

  if (!user?.github_connected) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border border-border rounded-lg bg-surface/30 select-none text-center">
        <Github size={40} className="text-textSecondary mb-4" />
        <h3 className="font-semibold text-textPrimary text-sm mb-1.5">Connect your GitHub account</h3>
        <p className="text-xs text-textSecondary max-w-xs mb-5">
          Scan and audit repositories directly without uploading files. Secure, read-only permissions.
        </p>
        <Button 
          onClick={() => router.push('/github/connect')}
          className="bg-black hover:bg-zinc-900 border border-zinc-800 text-white flex items-center space-x-2"
        >
          <Github size={16} />
          <span>Connect with GitHub</span>
        </Button>
      </div>
    )
  }

  // Filter repositories
  const filteredRepos = repos?.filter(repo => 
    repo.full_name.toLowerCase().includes(search.toLowerCase())
  ) || []

  const handleSelectRepo = (repoFullName: string) => {
    setSelectedRepo(repoFullName)
    setSelectedBranch('main') // default
  }

  const handleConfirm = () => {
    if (selectedRepo) {
      onRepoSelected(selectedRepo, selectedBranch)
    }
  }

  return (
    <div className="space-y-4 select-none">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-textMuted" />
        <Input
          placeholder="Search repositories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-14 w-full rounded-md" />
          ))}
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="p-4 border border-danger/25 bg-dangerBg/5 rounded-md text-xs text-center">
          <p className="text-danger mb-2 font-semibold">Failed to fetch repositories</p>
          <Button size="sm" variant="outline" onClick={() => refetch()} className="mx-auto flex items-center space-x-1.5">
            <RefreshCw size={12} />
            <span>Try Again</span>
          </Button>
        </div>
      )}

      {/* Repo list */}
      {!isLoading && !error && (
        <div className="max-h-72 overflow-y-auto space-y-1.5 pr-1.5 scrollbar-thin">
          {filteredRepos.map((repo) => {
            const isSelected = selectedRepo === repo.full_name
            return (
              <div 
                key={repo.id}
                className={`p-3 border rounded-md transition-all cursor-pointer flex flex-col ${
                  isSelected 
                    ? "border-primary bg-primary/5" 
                    : "border-border hover:border-primary/30 bg-surface/20"
                }`}
                onClick={() => handleSelectRepo(repo.full_name)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5 min-w-0 mr-3">
                    <FolderGit2 size={15} className={isSelected ? "text-primary" : "text-textSecondary"} />
                    <span className="font-semibold text-textPrimary text-xs truncate">{repo.full_name}</span>
                    {repo.private && (
                      <span className="text-[8px] uppercase tracking-wider font-bold bg-border text-textMuted px-1 rounded-sm border border-borderLight">
                        Private
                      </span>
                    )}
                  </div>
                  {repo.language && (
                    <span className="text-[10px] text-textMuted font-mono bg-surface border border-border px-1.5 py-0.5 rounded-sm">
                      {repo.language}
                    </span>
                  )}
                </div>
                
                {/* Branch options under selected repo */}
                {isSelected && (
                  <div className="mt-3 border-t border-border pt-3 flex flex-wrap items-center justify-between gap-3" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center space-x-2">
                      <GitBranch size={13} className="text-textSecondary" />
                      <span className="text-xs text-textSecondary font-medium">Branch:</span>
                      <select 
                        value={selectedBranch} 
                        onChange={(e) => setSelectedBranch(e.target.value)}
                        className="bg-surface border border-border text-textPrimary text-xs rounded-sm p-1 focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        <option value="main">main</option>
                        <option value="master">master</option>
                        <option value="dev">dev</option>
                      </select>
                    </div>
                    <Button 
                      size="sm" 
                      onClick={handleConfirm}
                      className="text-xs flex items-center space-x-1"
                    >
                      <span>Select Repo</span>
                      <ArrowRight size={12} />
                    </Button>
                  </div>
                )}
              </div>
            )
          })}
          
          {filteredRepos.length === 0 && (
            <p className="text-xs text-textMuted text-center py-8">No repositories found matching your query.</p>
          )}
        </div>
      )}
    </div>
  )
}
