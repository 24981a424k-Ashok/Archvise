"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lightbulb, Loader2, Sparkles, Building2, ChevronDown, ChevronUp } from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { useAuthStore } from '@/stores/authStore'
import { api } from '@/lib/api'

export default function NewDesignPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  
  const [prompt, setPrompt] = useState('')
  const [displayMode, setDisplayMode] = useState<'founder' | 'engineer'>(user?.display_mode || 'founder')
  const [submitting, setSubmitting] = useState(false)
  const [tipsOpen, setTipsOpen] = useState(false)

  // Example ideas mapping
  const examples: Record<string, string> = {
    "Food delivery platform": "A food delivery platform connecting 10,000 active local restaurants, 20,000 couriers, and 500,000 hungry customers. Needs real-time courier geolocation, push alerts, Elasticsearch search, and Stripe payment processing.",
    "E-commerce marketplace": "An international e-commerce marketplace supporting 100,000 active shoppers daily. Includes product catalogs, Elasticsearch filtering, Stripe checkout payments, immediate inventory updates, and order email delivery.",
    "Video streaming platform": "A scalable video streaming platform similar to Netflix. Needs distributed CDN caching, transcoder queues, user profiles, watch histories, and low-latency global playback.",
    "Healthcare booking system": "A clinic booking platform serving 150 regional clinics and 5,000 doctors. Requires HIPAA-compliant encrypted patient databases, real-time calendars, SMS appointment reminders, and telehealth video links.",
    "Real-time chat app": "A secure real-time messaging application supporting 10,000 active chat rooms. Requires instant message delivery via WebSockets, online status indicators, rich attachments uploaded to S3, and message history storage.",
    "Ride-sharing app": "A high-performance ride-sharing platform connecting 50,000 monthly drivers and riders. Needs real-time geolocation matching, PostgreSQL PostGIS queries, Stripe wallets, and push notifications."
  }

  const handleChipClick = (label: string) => {
    setPrompt(examples[label])
    toast.info(`Selected example: ${label}`)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (prompt.trim().length < 20) {
      toast.error("Idea description must be at least 20 characters")
      return
    }

    setSubmitting(true)
    try {
      const data = await api.post<{ project_id: string; job_id: string }>('/design/generate', {
        idea_prompt: prompt,
        display_mode: displayMode
      })
      toast.success("System design generation enqueued!")
      router.push(`/design/${data.project_id}?jobId=${data.job_id}`)
    } catch (e: any) {
      toast.error(e.message || "Failed to initiate design generation.")
    } finally {
      setSubmitting(false)
    }
  }

  const isSubmitDisabled = prompt.trim().length < 20 || prompt.length > 2000 || submitting

  // Character counter color classes
  const getCounterColorClass = (len: number) => {
    if (len >= 1900) return 'text-danger font-bold'
    if (len >= 1600) return 'text-orange font-bold'
    return 'text-textMuted'
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 select-none">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold tracking-tight text-textPrimary flex items-center justify-center space-x-2">
          <Building2 size={24} className="text-purple animate-pulse" />
          <span>System Design Generator</span>
        </h2>
        <p className="text-xs text-textSecondary mt-1.5">
          Describe your application idea. Get a production-ready cloud architecture blueprint.
        </p>
      </div>

      <Card className="border-border bg-card shadow-xl">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Textarea container */}
            <div className="space-y-2 relative">
              <div className="flex justify-between items-center text-xs">
                <label className="font-bold uppercase tracking-wider text-textSecondary">Describe Your Concept</label>
                <span className={getCounterColorClass(prompt.length)}>
                  {prompt.length}/2000
                </span>
              </div>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value.slice(0, 2000))}
                placeholder="e.g. A real-time multiplayer chess platform for serious players, with ELO ratings, tournaments, live analysis, and mobile apps. Target: 50,000 active players in year one."
                className="min-h-[160px] focus:ring-purple border-border"
                disabled={submitting}
              />
            </div>

            {/* Example chips */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-textMuted block">Example Concepts</span>
              <div className="flex flex-wrap gap-2">
                {Object.keys(examples).map(label => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => handleChipClick(label)}
                    className="text-[11px] font-medium border border-border hover:border-purple/40 hover:bg-purple/5 bg-surface text-textSecondary hover:text-textPrimary px-2.5 py-1 rounded-full transition-colors focus:outline-none"
                    disabled={submitting}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Mode preference pills */}
            <div className="flex items-center justify-between border-t border-border pt-4">
              <span className="text-xs font-semibold text-textSecondary">Initial Report Preference</span>
              <div className="flex space-x-2 bg-surface p-1 rounded-md border border-border">
                {['founder', 'engineer'].map(mode => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setDisplayMode(mode as any)}
                    className={`px-3 py-1 text-xs font-medium rounded-sm transition-all capitalize ${
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

            {/* Collapsible Tips */}
            <div className="border-t border-border pt-4">
              <Collapsible open={tipsOpen} onOpenChange={setTipsOpen} className="w-full">
                <CollapsibleTrigger asChild>
                  <button type="button" className="flex items-center justify-between w-full text-xs font-semibold text-textSecondary hover:text-textPrimary focus:outline-none">
                    <div className="flex items-center space-x-1.5">
                      <Lightbulb size={14} className="text-warning fill-warning/10" />
                      <span>Tips for better designs</span>
                    </div>
                    {tipsOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-3">
                  <ul className="list-disc pl-5 space-y-1.5 text-xs text-textSecondary leading-normal">
                    <li>Include your target user count (e.g. 50k DAU).</li>
                    <li>Mention key features (real-time chat, payments, media uploads).</li>
                    <li>Specify your industry, geography, or latency rules.</li>
                    <li>Describe what makes your product unique to customize resources.</li>
                  </ul>
                </CollapsibleContent>
              </Collapsible>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitDisabled}
              className="w-full flex items-center justify-center space-x-1.5 bg-purple hover:bg-purple/95 font-bold uppercase tracking-wider text-xs h-11 border border-purple/30 text-white"
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Generating Stack...</span>
                </>
              ) : (
                <>
                  <span>Generate System Design</span>
                  <Sparkles size={14} />
                </>
              )}
            </Button>

          </form>
        </CardContent>
      </Card>
    </div>
  )
}
