"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import GitHubRepoPicker from '@/components/audit/GitHubRepoPicker'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useAuditStore } from '@/stores/auditStore'

export default function SelectRepoPage() {
  const router = useRouter()
  const { selectRepo } = useAuditStore()

  const handleRepoSelected = (repo: string, branch: string) => {
    selectRepo(repo, branch)
    router.push('/audit/new')
  }

  return (
    <div className="max-w-md mx-auto py-12 px-4 select-none">
      <Card className="border border-border bg-card shadow-xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-bold">Select GitHub Repository</CardTitle>
          <CardDescription className="text-xs">
            Choose the repository and active branch you would like to run a Production Readiness Audit on.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GitHubRepoPicker onRepoSelected={handleRepoSelected} />
        </CardContent>
      </Card>
    </div>
  )
}
