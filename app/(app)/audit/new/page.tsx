"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShieldCheck, Info, Loader2, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import FileUploadZone from '@/components/audit/FileUploadZone'
import GitHubRepoPicker from '@/components/audit/GitHubRepoPicker'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/authStore'
import { api } from '@/lib/api'

export default function NewAuditPage() {
  const router = useRouter()
  const { user } = useAuthStore()

  // Form States
  const [projectName, setProjectName] = useState('')
  const [activeTab, setActiveTab] = useState<'upload' | 'github'>('upload')
  const [fileType, setFileType] = useState('Backend')
  const [displayMode, setDisplayMode] = useState<'founder' | 'engineer'>(user?.display_mode || 'founder')
  
  // Selection states
  const [files, setFiles] = useState<File[]>([])
  const [githubRepo, setGithubRepo] = useState<string | null>(null)
  const [githubBranch, setGithubBranch] = useState('main')
  
  // Loading status
  const [submitting, setSubmitting] = useState(false)

  // Enforce credits check
  const isOutOfCredits = user?.credits_remaining === 0 && user?.plan === 'free'

  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles(selectedFiles)
  }

  const handleRepoSelected = (repo: string, branch: string) => {
    setGithubRepo(repo)
    setGithubBranch(branch)
    toast.success(`Repository ${repo}:${branch} selected successfully`)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!projectName.trim()) {
      toast.error("Project name is required")
      return
    }

    if (activeTab === 'upload' && files.length === 0) {
      toast.error("Please upload or drag at least one file to scan")
      return
    }

    if (activeTab === 'github' && !githubRepo) {
      toast.error("Please select a GitHub repository to scan")
      return
    }

    setSubmitting(true)

    try {
      let data: { project_id: string; job_id: string }

      if (activeTab === 'upload') {
        const formData = new FormData()
        formData.append('project_name', projectName)
        formData.append('file_type', fileType)
        formData.append('display_mode', displayMode)
        
        files.forEach((file) => {
          formData.append('files', file)
        })

        data = await api.upload<{ project_id: string; job_id: string }>('/audit/upload', formData)
      } else {
        data = await api.post<{ project_id: string; job_id: string }>('/audit/github', {
          project_name: projectName,
          repo: githubRepo,
          branch: githubBranch,
          file_type: fileType,
          display_mode: displayMode
        })
      }

      toast.success("Audit queued successfully! Directing to pipeline stream.")
      
      // Redirect to stream result page
      router.push(`/audit/${data.project_id}?jobId=${data.job_id}`)
    } catch (e: any) {
      toast.error(e.message || "Failed to start analysis job.")
    } finally {
      setSubmitting(false)
    }
  }

  // Determine if submit is disabled
  const isSubmitDisabled = 
    isOutOfCredits || 
    !projectName.trim() || 
    projectName.length > 100 ||
    (activeTab === 'upload' && files.length === 0) ||
    (activeTab === 'github' && !githubRepo) ||
    submitting

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto select-none">
      {/* LEFT COLUMN - Source Selection */}
      <div className="lg:col-span-7 space-y-6">
        <div className="border border-border bg-card rounded-lg p-5">
          <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as any)} className="w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-textPrimary text-sm">Select Code Source</h3>
              <TabsList>
                <TabsTrigger value="upload">Upload Files</TabsTrigger>
                <TabsTrigger value="github">Connect GitHub</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="upload">
              <FileUploadZone 
                onFilesChanged={handleFilesSelected} 
                fileType={fileType}
                onFileTypeChanged={setFileType}
              />
            </TabsContent>

            <TabsContent value="github">
              <GitHubRepoPicker onRepoSelected={handleRepoSelected} />
              {githubRepo && (
                <div className="mt-4 p-3 bg-surface border border-border rounded-md text-xs text-textSecondary flex justify-between items-center">
                  <div>
                    <span className="font-semibold block text-textPrimary">Selected Repo</span>
                    <span className="font-mono">{githubRepo}:{githubBranch}</span>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    type="button" 
                    onClick={() => setGithubRepo(null)}
                    className="text-[10px]"
                  >
                    Change
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* RIGHT COLUMN - Configuration Settings */}
      <div className="lg:col-span-5">
        <Card className="sticky top-6 border-border bg-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm font-bold flex items-center space-x-2">
              <ShieldCheck size={18} className="text-primary" />
              <span>Audit Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 text-xs text-textSecondary">
            {/* Project name input */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="font-bold uppercase tracking-wider text-textSecondary">Project Name</label>
                <span className={`text-[10px] ${projectName.length > 90 ? 'text-danger font-bold' : 'text-textMuted'}`}>
                  {projectName.length}/100
                </span>
              </div>
              <Input
                placeholder="e.g. My Scaling MVP Backend"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value.slice(0, 100))}
                disabled={submitting}
              />
            </div>

            {/* Mode Selector */}
            <div className="space-y-1.5">
              <label className="font-bold uppercase tracking-wider text-textSecondary block">Preferred View Mode</label>
              <div className="flex space-x-2 bg-surface p-1 rounded-md border border-border w-fit">
                {['founder', 'engineer'].map(mode => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setDisplayMode(mode as any)}
                    className={`px-3.5 py-1.5 rounded-sm font-medium transition-all capitalize ${
                      displayMode === mode
                        ? "bg-card text-textPrimary shadow-sm border border-border"
                        : "text-textSecondary hover:text-textPrimary"
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-surface border border-border p-3 rounded-md flex items-start space-x-2 text-[10px] text-textMuted leading-normal">
              <Info size={14} className="shrink-0 text-textSecondary mt-0.5" />
              <span>Code files are aggregated, checked symmetrically, and permanently deleted immediately after SRE analysis completes.</span>
            </div>

            {/* Credit Indicator */}
            {user && (
              <div className="flex justify-between items-center text-xs border-t border-border pt-4 text-textSecondary font-semibold">
                <span>Credit status:</span>
                <span className={user.credits_remaining === 0 ? "text-danger" : "text-textPrimary"}>
                  {user.credits_remaining === 999999 ? "Unlimited" : `${user.credits_remaining} analyses left`}
                </span>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitDisabled}
              className="w-full flex items-center justify-center space-x-1.5 font-bold uppercase tracking-wider text-xs h-11"
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Enqueuing Job...</span>
                </>
              ) : (
                <>
                  <span>Start Analysis</span>
                  <Sparkles size={14} />
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </form>
  )
}
