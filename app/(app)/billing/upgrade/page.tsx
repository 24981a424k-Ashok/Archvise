"use client"

import React from 'react'
import { Check, ShieldCheck, Sparkles, Code, Layout, FileText, Share2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useAuthStore } from '@/stores/authStore'

export default function BillingUpgradePage() {
  const { user } = useAuthStore()

  const features = [
    {
      icon: Code,
      title: "Deep Code Audits",
      desc: "Specialized AI agents review database connection pools, SRE configurations, caching, CDNs, and security settings."
    },
    {
      icon: Layout,
      title: "System Design Blueprints",
      desc: "Generate full stack architecture maps, schema structures, and API specs rendered in interactive React Flow diagrams."
    },
    {
      icon: FileText,
      title: "Branded PDF Exports",
      desc: "Download clean, presentation-ready PDF audit reports to share with investors, founders, and developers."
    },
    {
      icon: Share2,
      title: "Public Shared Links",
      desc: "Share read-only design blueprints with your team or clients instantly with single-click links."
    }
  ]

  return (
    <div className="max-w-3xl mx-auto space-y-8 select-none py-4">
      {/* Header info */}
      <div className="border-b border-border pb-4">
        <h2 className="text-xl font-bold tracking-tight text-textPrimary">Archvise Premium Access</h2>
        <p className="text-xs text-textSecondary mt-0.5">Manage your plans, status, and active limits.</p>
      </div>

      {/* Plan Status Banner */}
      <Card className="p-6 bg-surface border-border relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-primary/10 text-primary text-[10px] font-extrabold px-4 py-1.5 rounded-bl-lg uppercase tracking-wider flex items-center space-x-1">
          <Sparkles size={11} />
          <span>Active Plan: Pro (Free)</span>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-base font-bold text-textPrimary">Your Account is Upgraded</h3>
          <p className="text-xs text-textSecondary max-w-xl leading-relaxed">
            Archvise is currently in open access. All accounts have been automatically upgraded to the **Production Pro Plan** with **unlimited credits (∞)** for free. No credit card or payment setup is required.
          </p>
          
          <div className="flex flex-wrap gap-4 text-xs text-textSecondary border-t border-border pt-4">
            <div>
              <span className="text-textMuted uppercase font-bold text-[9px] tracking-wider block mb-0.5">Active Plan</span>
              <span className="font-bold text-textPrimary capitalize">Pro Plan</span>
            </div>
            <div className="sm:ml-8">
              <span className="text-textMuted uppercase font-bold text-[9px] tracking-wider block mb-0.5">Credits Remaining</span>
              <span className="font-bold text-textPrimary">Unlimited (∞)</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Pro Features Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-textPrimary uppercase tracking-wider">Unlocked Pro Features</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((feat, idx) => {
            const Icon = feat.icon
            return (
              <Card key={idx} className="p-4 bg-card border-border flex items-start space-x-3.5">
                <div className="h-9 w-9 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                  <Icon size={18} />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-textPrimary text-xs">{feat.title}</h4>
                  <p className="text-[11px] text-textSecondary leading-relaxed">{feat.desc}</p>
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Stripe Removal Notice */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 bg-surface p-4 border border-border rounded-lg text-xs text-textSecondary text-center sm:text-left select-none">
        <ShieldCheck size={28} className="text-success shrink-0" />
        <p className="leading-relaxed">
          Stripe billing has been disabled. All premium features, audits, and design blueprints are completely **free to use** with no billing thresholds.
        </p>
      </div>
    </div>
  )
}
