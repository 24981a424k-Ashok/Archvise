"use client"

import React, { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { CheckCircle, Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'

export default function BillingSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const queryClient = useQueryClient()
  const { user } = useAuth()

  useEffect(() => {
    // Invalidate TanStack query cache to force user profile reload
    queryClient.invalidateQueries({ queryKey: ['projects', 'recent'] })
    
    // Invalidate auth/me queries
    queryClient.refetchQueries()

    // Redirect to dashboard after 2 seconds
    const timer = setTimeout(() => {
      router.push('/dashboard')
    }, 2000)

    return () => clearTimeout(timer)
  }, [router, queryClient])

  return (
    <div className="max-w-md mx-auto py-20 px-4 select-none text-center">
      <Card className="border-border bg-card p-6 shadow-2xl">
        <CardContent className="flex flex-col items-center justify-center pt-6 space-y-4">
          <CheckCircle size={48} className="text-success animate-bounce" />
          <h3 className="text-lg font-bold text-textPrimary">Payment Successful!</h3>
          <p className="text-xs text-textSecondary leading-relaxed">
            Your plan has been upgraded successfully. We are syncing your credit limits now.
          </p>
          <div className="flex items-center space-x-2 text-xs text-primaryLight font-medium pt-2">
            <Loader2 size={12} className="animate-spin" />
            <span>Redirecting to Dashboard...</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
