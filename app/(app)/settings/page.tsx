"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  User as UserIcon, CreditCard, ShieldAlert, LogOut, Check, 
  HelpCircle, Trash2, ShieldCheck, Mail, Info, Calendar, Sparkles 
} from 'lucide-react'
import { Github } from '@/components/icons/Github'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { useAuth } from '@/hooks/useAuth'
import { api } from '@/lib/api'
import ModeToggle from '@/components/app-shell/ModeToggle'
import { Skeleton } from '@/components/ui/skeleton'

interface UsageStats {
  total_audits: number
  total_designs: number
  credits_remaining: number
  credits_reset_at: string
}

export default function SettingsPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { user, logout } = useAuth()
  
  // Profile name state
  const [name, setName] = useState(user?.name || '')
  const [savingProfile, setSavingProfile] = useState(false)

  // Dialog open triggers
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [manageBillingLoading, setManageBillingLoading] = useState(false)
  const [githubDisconnecting, setGithubDisconnecting] = useState(false)

  // Fetch usage stats
  const { data: stats, isLoading: statsLoading } = useQuery<UsageStats>({
    queryKey: ['settings', 'stats'],
    queryFn: () => api.get<UsageStats>('/settings/stats'),
    enabled: !!user
  })

  // Mutate profile details
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error("Name cannot be empty")
      return
    }
    setSavingProfile(true)
    try {
      await api.patch('/settings/profile', { name })
      toast.success("Profile details updated successfully")
      queryClient.invalidateQueries({ queryKey: ['settings', 'stats'] })
    } catch (e: any) {
      toast.error(e.message || "Failed to update profile details")
    } finally {
      setSavingProfile(false)
    }
  }

  // Stripe portal
  const handleManageBilling = async () => {
    setManageBillingLoading(true)
    try {
      const data = await api.post<{ portal_url: string }>('/billing/portal', {})
      window.location.href = data.portal_url
    } catch (e: any) {
      toast.error(e.message || "Failed to create customer billing portal session")
    } finally {
      setManageBillingLoading(false)
    }
  }

  // GitHub Disconnect
  const handleGithubDisconnect = async () => {
    setGithubDisconnecting(true)
    try {
      await api.post('/github/disconnect', {})
      toast.success("GitHub account disconnected successfully")
      // Invalidate query
      queryClient.refetchQueries()
    } catch (e: any) {
      toast.error("Failed to disconnect GitHub account")
    } finally {
      setGithubDisconnecting(false)
    }
  }

  // Account deletion
  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') {
      toast.error("Please type DELETE to confirm account deactivation")
      return
    }
    try {
      await api.delete('/auth/account')
      toast.info("Account deactivated successfully. Logging out...")
      await logout()
      router.push('/sign-in')
    } catch (e) {
      toast.error("Failed to deactivate account")
    }
  }

  const avatarLetter = user?.name ? user.name.charAt(0).toUpperCase() : 'U'
  const resetDate = stats?.credits_reset_at ? new Date(stats.credits_reset_at).toLocaleDateString() : ''

  return (
    <div className="max-w-3xl mx-auto space-y-6 select-none pb-12">
      
      {/* Profile Section */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-bold flex items-center space-x-2">
            <UserIcon size={18} className="text-primary" />
            <span>Profile Details</span>
          </CardTitle>
          <CardDescription className="text-xs">Manage your name and view settings.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="h-14 w-14 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold text-xl">
                {avatarLetter}
              </div>
              <div className="flex-1 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-textSecondary block">Registered Email</span>
                <span className="text-sm text-textPrimary block font-mono">{user?.email}</span>
              </div>
            </div>
            
            <div className="space-y-1.5 max-w-sm">
              <label className="text-[10px] font-bold uppercase tracking-wider text-textSecondary">Full Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                disabled={savingProfile}
              />
            </div>
            
            <Button type="submit" size="sm" className="font-semibold text-xs" disabled={savingProfile || !name.trim() || name === user?.name}>
              {savingProfile ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Mode preference card */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-bold flex items-center space-x-2">
            <Sparkles size={18} className="text-primary" />
            <span>Dashboard Mode Preference</span>
          </CardTitle>
          <CardDescription className="text-xs">Select your preferred view mode. Applies to all generated report views.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-xs text-textSecondary max-w-md">
            **Founder Mode** yields business impact summaries. **Engineer Mode** exposes exact codebase line positions and copy-to-clipboard code blocks.
          </div>
          <ModeToggle />
        </CardContent>
      </Card>

      {/* Usage statistics grid */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-bold flex items-center space-x-2">
            <Calendar size={18} className="text-primary" />
            <span>Usage Statistics</span>
          </CardTitle>
          <CardDescription className="text-xs">Track active credits and analysis metrics.</CardDescription>
        </CardHeader>
        <CardContent>
          {statsLoading ? (
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-14 w-full rounded-md" />)}
            </div>
          ) : stats ? (
            <div className="grid grid-cols-2 gap-4 text-xs text-textSecondary">
              <div className="bg-surface p-3 border border-border rounded-md">
                <span className="text-textMuted uppercase font-bold text-[9px] tracking-wider block mb-0.5">Total Code Audits</span>
                <span className="text-base font-bold text-textPrimary">{stats.total_audits}</span>
              </div>
              <div className="bg-surface p-3 border border-border rounded-md">
                <span className="text-textMuted uppercase font-bold text-[9px] tracking-wider block mb-0.5">Total System Designs</span>
                <span className="text-base font-bold text-textPrimary">{stats.total_designs}</span>
              </div>
              <div className="bg-surface p-3 border border-border rounded-md">
                <span className="text-textMuted uppercase font-bold text-[9px] tracking-wider block mb-0.5">Credits Left This Month</span>
                <span className="text-base font-bold text-textPrimary">
                  {stats.credits_remaining === 999999 ? 'Unlimited (∞)' : stats.credits_remaining}
                </span>
              </div>
              <div className="bg-surface p-3 border border-border rounded-md">
                <span className="text-textMuted uppercase font-bold text-[9px] tracking-wider block mb-0.5">Credits Reset Date</span>
                <span className="text-sm font-bold text-textPrimary">{resetDate || 'Monthly'}</span>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* GitHub connection */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-bold flex items-center space-x-2">
            <Github size={18} className="text-primary" />
            <span>GitHub Connection</span>
          </CardTitle>
          <CardDescription className="text-xs">Scan and pull code repository files directly.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-xs text-textSecondary flex-1">
            {user?.github_connected ? (
              <span className="flex items-center space-x-1.5 font-semibold text-success">
                <ShieldCheck size={14} />
                <span>Connected successfully (read-only)</span>
              </span>
            ) : (
              <span>Link your GitHub account to trigger scans directly from branches.</span>
            )}
          </div>
          {user?.github_connected ? (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleGithubDisconnect} 
              disabled={githubDisconnecting}
              className="text-danger hover:bg-dangerBg/10 border-danger/20"
            >
              Disconnect GitHub
            </Button>
          ) : (
            <Button size="sm" onClick={() => router.push('/github/connect')} className="flex items-center space-x-1.5 bg-black hover:bg-zinc-950 border border-zinc-800 text-white">
              <Github size={14} />
              <span>Connect GitHub</span>
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Billing */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-bold flex items-center space-x-2">
            <CreditCard size={18} className="text-primary" />
            <span>Billing &amp; Stripe Subscriptions</span>
          </CardTitle>
          <CardDescription className="text-xs">Upgrade your limits or edit payment methods.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-xs text-textSecondary">
            Active Subscription: <span className="font-bold text-textPrimary capitalize">{user?.plan} plan</span>.
          </div>
          <div className="flex space-x-3">
            <Button size="sm" variant="outline" onClick={() => router.push('/billing/upgrade')}>
              Upgrade Plan
            </Button>
            {user?.plan && user.plan !== 'free' && (
              <Button size="sm" onClick={handleManageBilling} disabled={manageBillingLoading}>
                {manageBillingLoading ? "Loading..." : "Manage Billing"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Legal Explainer */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-bold flex items-center space-x-2">
            <HelpCircle size={18} className="text-primary" />
            <span>Information &amp; Legal</span>
          </CardTitle>
          <CardDescription className="text-xs">Review rules and scoring guidelines.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Link href="/legal/terms" className="text-xs text-primary hover:underline font-semibold">Terms of Service</Link>
          <Link href="/legal/privacy" className="text-xs text-primary hover:underline font-semibold">Privacy Policy</Link>
          <Dialog>
            <DialogTrigger asChild>
              <button className="text-xs text-primary hover:underline font-semibold focus:outline-none">
                How scoring works
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-md bg-card border border-border">
              <DialogHeader>
                <DialogTitle>Readiness Scoring Model</DialogTitle>
                <DialogDescription>
                  Our formula calculates overall scoring weights server-side.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 text-xs text-textSecondary leading-relaxed my-2">
                <p>
                  The **Production Readiness Score** represents a weighted combination of 4 evaluations:
                  `round(SRE*0.30 + Backend*0.30 + Infrastructure*0.20 + Cloud*0.20)`.
                </p>
                <p>
                  The **Confidence Score** measures the depth of the scan: 
                  files count (&gt;=10: +20), config presence (+15), Dockerfile (+15), character count (&gt;=50K: +20), and truncation checks (+20).
                </p>
                <p>
                  Recommendations and issues are calculated independently by specialized NIM agents based on structural codebase metrics.
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-danger/30 bg-dangerBg/5">
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-bold flex items-center space-x-2 text-danger">
            <ShieldAlert size={18} className="text-danger" />
            <span>Danger Zone</span>
          </CardTitle>
          <CardDescription className="text-xs text-danger/80">High-risk user actions.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-xs text-danger/80">
            Sign out of your session or permanently deactivate your account (deactivates Stripe subscriptions immediately).
          </div>
          <div className="flex space-x-3">
            <Button size="sm" variant="outline" onClick={logout} className="border-border">
              Sign Out
            </Button>
            <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="destructive" className="bg-danger text-textPrimary hover:bg-danger/90">
                  Delete Account
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md bg-card border border-border">
                <DialogHeader>
                  <DialogTitle className="text-danger flex items-center space-x-2">
                    <Trash2 size={18} />
                    <span>Delete Account</span>
                  </DialogTitle>
                  <DialogDescription>
                    This will deactivate your account and cancel active Stripe subscriptions.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 my-2 text-xs text-textSecondary leading-normal">
                  <p className="font-bold text-textPrimary">
                    Are you absolutely sure? This action is irreversible. All your projects, blueprints, and reports will be soft-deleted.
                  </p>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider block">
                      Type **DELETE** to confirm:
                    </label>
                    <Input
                      placeholder="DELETE"
                      value={deleteConfirmText}
                      onChange={(e) => setDeleteConfirmText(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button size="sm" variant="outline" onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
                  <Button size="sm" variant="destructive" onClick={handleDeleteAccount} disabled={deleteConfirmText !== 'DELETE'} className="bg-danger text-white hover:bg-danger/95">
                    Confirm Deactivation
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

    </div>
  )
}
