"use client"

import React, { useState } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { Plus, Share2, Download, ArrowLeft, RefreshCw, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { SystemDesign } from '@/types'
import { useDesignStream } from '@/hooks/useSSE'
import DesignProgressStream from '@/components/design/DesignProgressStream'
import DesignResultView from '@/components/design/DesignResultView'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

export default function DesignResultPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const id = params.id as string
  const jobId = searchParams.get('jobId')

  // Subscribe to live SSE design generation stream
  const { steps, status, resultId } = useDesignStream(jobId)

  const targetId = resultId || id
  const isStreaming = status === 'streaming'

  // Fetch system design
  const { data: design, isLoading: isDesignLoading, error: designError, refetch } = useQuery<SystemDesign>({
    queryKey: ['design', targetId],
    queryFn: () => api.get<SystemDesign>(`/design/${targetId}`),
    enabled: !!targetId && !isStreaming,
    retry: 2,
    retryDelay: 2000,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })

  const handleShare = async () => {
    try {
      const data = await api.post<{ slug: string; share_url: string }>(`/design/${targetId}/share`, {})
      navigator.clipboard.writeText(data.share_url)
      toast.success("Public sharing link copied to clipboard!")
    } catch (e) {
      toast.error("Failed to generate share link")
    }
  }

  const handleExportPDF = () => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
    window.open(`${API_URL}/api/design/${targetId}/export-pdf`, '_blank')
    toast.success("Downloading design blueprint PDF...")
  }

  // Render stream view
  const handleCancel = () => {
    router.push('/design/new')
    toast.info('Generation cancelled. Start a new design anytime.')
  }

  if (isStreaming) {
    return <DesignProgressStream steps={steps} onCancel={handleCancel} />
  }

  // Render skeleton load
  if (isDesignLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 py-8 select-none">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-6 w-20" />
        </div>
        <Skeleton className="h-32 w-full rounded-lg" />
        <Skeleton className="h-[450px] w-full rounded-lg" />
      </div>
    )
  }

  // Render error card
  if (designError || !design) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border border-border bg-surface/30 text-center select-none max-w-md mx-auto my-12 rounded-lg">
        <AlertTriangle size={36} className="text-danger mb-4" />
        <h3 className="font-bold text-textPrimary text-sm mb-1.5">Design blueprint unavailable</h3>
        <p className="text-xs text-textSecondary max-w-xs mb-6">
          {designError?.message || "There was a problem loading this system design. It might still be processing or failed."}
        </p>
        <div className="flex space-x-3">
          <Button variant="outline" size="sm" onClick={() => router.push('/dashboard')}>
            <ArrowLeft size={13} className="mr-1.5" />
            <span>Dashboard</span>
          </Button>
          <Button size="sm" onClick={() => refetch()} className="flex items-center space-x-1.5">
            <RefreshCw size={13} />
            <span>Retry</span>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-8 select-none pb-28 relative">
      <DesignResultView design={design} />

      {/* ━━ STICKY BOTTOM ACTION BAR ━━ */}
      <div className="fixed bottom-0 left-0 right-0 lg:left-[240px] bg-background/80 backdrop-blur-md border-t border-border py-4 px-6 z-40 flex justify-between items-center max-w-5xl mx-auto shadow-2xl">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => router.push('/design/new')}
          className="flex items-center space-x-1"
        >
          <Plus size={13} />
          <span>New Design</span>
        </Button>
        
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleShare}
            className="flex items-center space-x-1.5"
          >
            <Share2 size={13} />
            <span>Share Design</span>
          </Button>
          <Button 
            size="sm" 
            onClick={handleExportPDF}
            className="flex items-center space-x-1.5"
          >
            <Download size={13} />
            <span>Export PDF</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
