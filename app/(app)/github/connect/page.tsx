"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, ShieldAlert, Loader2 } from 'lucide-react'
import { Github } from '@/components/icons/Github'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'

export default function GitHubConnectPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleConnect = async () => {
    setLoading(true)
    try {
      // Fetch OAuth Authorization URL
      const data = await api.get<{ auth_url: string }>('/github/auth-url')
      window.location.href = data.auth_url
    } catch (e: any) {
      toast.error(e.message || "Failed to fetch GitHub OAuth URL")
      setLoading(false)
    }
  }

  const benefits = [
    "Analyze any branch directly",
    "No manual file uploads required",
    "Secure read-only permissions",
    "Disconnect account at any time"
  ]

  return (
    <div className="max-w-md mx-auto py-12 px-4 select-none">
      <Card className="border-border bg-card shadow-2xl">
        <CardHeader className="text-center pb-4">
          <div className="h-12 w-12 rounded-full bg-surface border border-border flex items-center justify-center text-textPrimary mx-auto mb-3">
            <Github size={24} />
          </div>
          <CardTitle className="text-base font-bold">Connect your GitHub account</CardTitle>
          <CardDescription className="text-xs">
            Analyze repositories directly without uploading source files.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Benefits list */}
          <div className="space-y-2.5">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="flex items-center space-x-2.5 text-xs text-textSecondary">
                <CheckCircle size={14} className="text-success shrink-0" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>

          {/* Connect button */}
          <Button 
            onClick={handleConnect}
            disabled={loading}
            className="w-full bg-black hover:bg-zinc-900 border border-zinc-800 text-white font-semibold flex items-center justify-center space-x-2 h-11"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Github size={16} />
            )}
            <span>Connect with GitHub</span>
          </Button>

          {/* Security Notice */}
          <div className="bg-surface border border-border p-3.5 rounded-md flex items-start space-x-2.5 text-[10px] text-textMuted leading-relaxed">
            <ShieldAlert size={16} className="shrink-0 text-textSecondary mt-0.5" />
            <span>
              Archvise requests read-only access only. We will **never** push changes, delete files, or create commits on your repositories.
            </span>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}
