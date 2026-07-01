import React from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Footer from '@/components/landing/Footer'
import ArchviseLogo from '@/components/brand/ArchviseLogo'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-textPrimary flex flex-col justify-between">
      {/* Navbar */}
      <header className="border-b border-border bg-surface/50 select-none">
        <div className="max-w-5xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 text-textPrimary">
            <ArchviseLogo size={24} className="text-primary animate-pulse" />
            <span className="font-bold tracking-tight text-base">Archvise</span>
          </Link>
          <Link href="/sign-in" className="text-xs font-semibold uppercase tracking-wider text-textSecondary hover:text-textPrimary">
            Sign In
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-16 px-4 max-w-2xl mx-auto w-full select-none">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-textPrimary mb-3">About Archvise</h2>
          <p className="text-xs text-textSecondary max-w-sm mx-auto">
            Providing production readiness audits and architecture designs for scaling applications.
          </p>
        </div>

        <div className="space-y-6 text-xs text-textSecondary leading-relaxed mb-12">
          <p>
            Archvise was founded to bridge the gap between building fast and shipping safely. Modern AI development tools allow engineers and founders to spin up working applications in a matter of hours, but they rarely generate configurations tailored for heavy user traffic, secure database pooling, or cost-efficient auto-scaling.
          </p>
          <p>
            By combining static code analysis heuristics with deep semantic reasoning from NVIDIA NIM powered model panels (DeepSeek-R1 and Llama-3.1-405B), Archvise inspects file inputs, highlights scalability holes, and drafts complete system architecture designs with React Flow interactive diagrams.
          </p>
          <p>
            Our core focus is giving product owners and developers total transparency into their **Production Readiness Score**, helping you prevent server crashes, optimize cloud bills, and ship mvps that survive traffic spikes.
          </p>
        </div>

        {/* CTA */}
        <Card className="p-8 text-center bg-card border-border">
          <h3 className="font-bold text-textPrimary text-sm mb-2">Ready to audit your code?</h3>
          <p className="text-xs text-textSecondary mb-6 max-w-xs mx-auto">
            Join thousands of developers using Archvise to analyze their MVP builds.
          </p>
          <Button asChild>
            <Link href="/sign-up" className="font-semibold uppercase tracking-wider text-xs">
              Get Started Now
            </Link>
          </Button>
        </Card>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
