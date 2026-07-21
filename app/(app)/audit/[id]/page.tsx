"use client"

import React, { useState } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { Shield, AlertTriangle, Zap, Download, Share2, Plus, Lock, ArrowLeft, RefreshCw, RefreshCwIcon, HelpCircle } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { AuditReport, Project } from '@/types'
import { useAuditStream } from '@/hooks/useSSE'
import AuditProgressStream from '@/components/audit/AuditProgressStream'
import ScoreGauge from '@/components/score/ScoreGauge'
import ConfidenceBadge from '@/components/score/ConfidenceBadge'
import CapacityCard from '@/components/score/CapacityCard'
import BenchmarkCard from '@/components/score/BenchmarkCard'
import AgentCard from '@/components/score/AgentCard'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import ModeToggle from '@/components/app-shell/ModeToggle'
import { useAuthStore } from '@/stores/authStore'
import { Skeleton } from '@/components/ui/skeleton'

export default function AuditResultPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const id = params.id as string
  const jobId = searchParams.get('jobId')

  const { display_mode } = useAuthStore()

  // Subscribe to live SSE stream if jobId is present
  const { steps, status, resultId } = useAuditStream(jobId)

  // Fetch audit report
  // If resultId from stream is set, fetch using resultId, otherwise use id parameter
  const targetId = resultId || id

  const { data: report, isLoading: isReportLoading, error: reportError, refetch } = useQuery<AuditReport>({
    queryKey: ['audit', targetId],
    queryFn: () => api.get<AuditReport>(`/audit/${targetId}`),
    enabled: !!targetId,
    retry: 1
  })

  // If report data is already loaded and cached, we are NOT streaming (prevents tab switch loading loop)
  const isStreaming = status === 'streaming' && !report

  // Fetch project details to get the project name via audit history
  const { data: project } = useQuery<Project | undefined>({
    queryKey: ['project', targetId],
    queryFn: () =>
      api.get<Project[]>(`/audit/history?limit=50`)
        .then((list) => list.find((p) => p.id === targetId)),
    enabled: !!targetId,
  })

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success("Share link copied to clipboard!")
  }

  const handleExportPDF = () => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
    window.open(`${API_URL}/api/audit/${targetId}/export-pdf`, '_blank')
    toast.success("Downloading readiness report PDF...")
  }

  // Render Live SSE progress stream
  const handleCancel = async () => {
    try {
      await api.post(`/audit/${targetId}/cancel`, {})
    } catch (e) {
      console.error("Failed to cancel audit job:", e)
    }
    router.push('/audit/new')
    toast.info('Generation cancelled. Start a new audit anytime.')
  }

  // Render Live SSE progress stream
  if (isStreaming) {
    return <AuditProgressStream steps={steps} onCancel={handleCancel} />
  }

  // Render Loader while fetching report details
  if (isReportLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 py-8">
        <Skeleton className="h-48 w-full rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-32 w-full rounded-lg" />
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    )
  }

  // Render Error layouts
  if (reportError || !report) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border border-border bg-surface/30 text-center select-none max-w-md mx-auto my-12 rounded-lg">
        <AlertTriangle size={36} className="text-danger mb-4" />
        <h3 className="font-bold text-textPrimary text-sm mb-1.5">Readiness report unavailable</h3>
        <p className="text-xs text-textSecondary max-w-xs mb-6">
          {reportError?.message || "There was a problem loading this audit report. It might still be processing or failed."}
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

  const overallScore = report.readiness_score

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-8 select-none pb-28 relative">
      {/* ━━ SCORE HEADER CARD ━━ */}
      <Card className="relative overflow-hidden bg-card border-border p-8 shadow-xl">
        {/* Subtle radial gradient background */}
        <div className="absolute inset-0 bg-gradient-radial from-primary/5 to-transparent pointer-events-none" />

        <div className="relative flex flex-col items-center justify-center text-center">
          {/* Main gauge */}
          <ScoreGauge score={overallScore} size="lg" />
          
          <span className="text-[10px] text-textMuted font-bold uppercase tracking-widest mt-2 mb-4">
            Production Readiness Score
          </span>

          {/* Mode description */}
          <div className="mb-4">
            <ConfidenceBadge confidence={report.confidence} />
          </div>

          {/* Capacity estimate rows */}
          <div className="w-full max-w-md mt-4">
            <CapacityCard capacity={report.capacity_estimate} disclaimer={report.score_disclaimer} />
          </div>
        </div>
      </Card>

      {/* ━━ BENCHMARK CARD ━━ */}
      {report.benchmark_percentile !== undefined && (
        <BenchmarkCard percentile={report.benchmark_percentile} displayMode={display_mode} />
      )}

      {/* ━━ CRITICAL ISSUES (Alert card if SRE has critical issues) ━━ */}
      {report.top_critical_issues && report.top_critical_issues.length > 0 && (
        <Card className="border-l-4 border-danger bg-dangerBg/5 p-5 border-border">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="text-danger shrink-0 mt-0.5" size={18} />
            <div>
              <h4 className="font-bold text-textPrimary text-sm mb-2">Requires Immediate Attention</h4>
              <ul className="list-decimal pl-4 text-xs text-textSecondary space-y-2">
                {report.top_critical_issues.map((issue: any, idx: number) => (
                  <li key={idx} className="leading-relaxed">
                    {typeof issue === 'string' ? issue : (display_mode === 'founder' ? issue.founder_text : issue.engineer_text)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      )}

      {/* ━━ QUICK WINS ━━ */}
      {report.quick_wins && report.quick_wins.length > 0 && (
        <Card className="border-l-4 border-success bg-successBg/5 p-5 border-border">
          <div className="flex items-start space-x-3">
            <Zap className="text-success shrink-0 mt-0.5" size={18} />
            <div>
              <h4 className="font-bold text-textPrimary text-sm mb-2">Quick Wins</h4>
              <ul className="list-disc pl-4 text-xs text-textSecondary space-y-1.5">
                {report.quick_wins.map((win: any, idx: number) => (
                  <li key={idx} className="leading-relaxed">
                    {typeof win === 'string' ? win : (display_mode === 'founder' ? win.founder_text : win.engineer_text)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      )}

      {/* ━━ AGENT BREAKDOWN ━━ */}
      <div className="space-y-4">
        <div>
          <h3 className="font-bold text-textPrimary text-sm">Expert Analysis</h3>
          <p className="text-xs text-textSecondary mt-0.5">Click any engineer to see their breakdown, findings and recommendations.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AgentCard agent={report.agents.sre} agentId="sre" displayMode={display_mode} />
          <AgentCard agent={report.agents.backend} agentId="backend" displayMode={display_mode} />
          <AgentCard agent={report.agents.infrastructure} agentId="infrastructure" displayMode={display_mode} />
          <AgentCard agent={report.agents.cloud_architect} agentId="cloud_architect" displayMode={display_mode} />
        </div>
      </div>

      {/* ━━ DISCLAIMER ━━ */}
      <Card className="p-4 bg-surface border-border flex items-start space-x-3">
        <Lock size={16} className="text-textMuted shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-[10px] text-textMuted leading-relaxed">{report.score_disclaimer}</p>
          <a 
            href="https://locust.io" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-[10px] text-primary hover:text-primaryLight hover:underline font-semibold block"
          >
            Learn about load testing with Locust &rarr;
          </a>
        </div>
      </Card>

      {/* ━━ STICKY BOTTOM ACTION BAR ━━ */}
      <div className="fixed bottom-0 left-0 right-0 lg:left-[240px] bg-background/80 backdrop-blur-md border-t border-border py-4 px-6 z-40 flex justify-between items-center max-w-5xl mx-auto shadow-2xl">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => router.push('/audit/new')}
          className="flex items-center space-x-1"
        >
          <Plus size={13} />
          <span>New Audit</span>
        </Button>
        
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleShare}
            className="flex items-center space-x-1.5"
          >
            <Share2 size={13} />
            <span>Share</span>
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
