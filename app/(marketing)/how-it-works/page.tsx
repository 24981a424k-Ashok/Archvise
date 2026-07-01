import React from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ShieldCheck, Bot, FileText, CheckCircle } from 'lucide-react'
import Footer from '@/components/landing/Footer'
import ArchviseLogo from '@/components/brand/ArchviseLogo'

export default function HowItWorksPage() {
  const workflow = [
    {
      icon: ShieldCheck,
      color: "text-primary bg-primary/10 border-primary/20",
      title: "1. Upload Code or Connect GitHub",
      desc: "Paste file codes, drop zip packages, or authorize safe read-only connections with your GitHub accounts. Files are completely removed after processing completes."
    },
    {
      icon: Bot,
      color: "text-purple bg-purple/10 border-purple/20",
      title: "2. The AI Engineering Audits",
      desc: "Our models parse code semantics, config settings, and database schemas. SRE, Backend, Infra, and Cloud Architect agents compile scores, findings, and suggestions."
    },
    {
      icon: FileText,
      color: "text-orange bg-orange/10 border-orange/20",
      title: "3. Access Actionable Blueprints",
      desc: "Toggle instantly between Founder Mode (non-technical business evaluations) and Engineer Mode (precise code line fixes). Export branded PDFs and share diagrams."
    }
  ]

  return (
    <div className="min-h-screen bg-background text-textPrimary flex flex-col justify-between">
      {/* Navbar */}
      <header className="border-b border-border bg-surface/50 select-none">
        <div className="max-w-5xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 text-textPrimary">
            <ArchviseLogo size={24} className="text-primary animate-pulse" />
            <span className="font-bold tracking-tight text-base">Archvise</span>
          </Link>
          <Link href="/sign-up" className="text-xs font-semibold uppercase tracking-wider text-textSecondary hover:text-textPrimary">
            Get Started
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-16 px-4 max-w-3xl mx-auto w-full select-none">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-textPrimary mb-3">How it Works</h2>
          <p className="text-xs text-textSecondary max-w-sm mx-auto">
            From raw codebase files to detailed production readiness scores and system design diagrams.
          </p>
        </div>

        {/* Timeline cards */}
        <div className="space-y-6 mb-12">
          {workflow.map((step, idx) => {
            const Icon = step.icon
            return (
              <Card key={idx} className="p-6 bg-card border-border flex items-start space-x-4">
                <div className={`h-11 w-11 rounded-md flex items-center justify-center shrink-0 border ${step.color}`}>
                  <Icon size={20} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-textPrimary">{step.title}</h3>
                  <p className="text-xs text-textSecondary leading-relaxed">{step.desc}</p>
                </div>
              </Card>
            )
          })}
        </div>

        {/* Summary check CTA */}
        <div className="text-center bg-surface border border-border p-8 rounded-lg">
          <h3 className="font-semibold text-textPrimary text-base mb-2">Analyze your app today</h3>
          <p className="text-xs text-textSecondary mb-6 max-w-sm mx-auto">
            Sign up for 2 free monthly credits. Connect, scan, and secure codebases in under 60 seconds.
          </p>
          <Button asChild>
            <Link href="/sign-up" className="font-semibold uppercase tracking-wider text-xs">
              Create Free Account
            </Link>
          </Button>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
