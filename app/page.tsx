"use client"

import React, { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import ArchviseLogo from '@/components/brand/ArchviseLogo'
import Hero from '@/components/landing/Hero'
import ProblemSection from '@/components/landing/ProblemSection'
import HowItWorks from '@/components/landing/HowItWorks'
import AgentIntro from '@/components/landing/AgentIntro'
import PricingTeaser from '@/components/landing/PricingTeaser'
import Footer from '@/components/landing/Footer'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/authStore'

export default function LandingPage() {
  const router = useRouter()
  const { user } = useAuthStore()

  useEffect(() => {
    if (user) {
      router.push('/dashboard')
    }
  }, [user, router])

  if (user) {
    return (
      <div className="min-h-screen w-full bg-background flex flex-col items-center justify-center select-none text-center">
        <ArchviseLogo size={48} className="text-primary animate-pulse mb-4" />
        <p className="text-xs text-textSecondary font-semibold tracking-wider uppercase">Redirecting to dashboard...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-textPrimary overflow-hidden flex flex-col">
      {/* SECTION 1 — Sticky Transparent Navbar */}
      <header className="sticky top-0 w-full z-50 bg-background/70 backdrop-blur-md border-b border-border/40 select-none">
        <div className="max-w-5xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2.5 text-textPrimary hover:opacity-90">
            <ArchviseLogo size={24} className="text-primary animate-pulse" />
            <span className="font-bold tracking-tight text-base">Archvise</span>
          </Link>

          {/* Navigation Links (Center) */}
          <nav className="hidden sm:flex items-center space-x-6 text-xs font-semibold uppercase tracking-wider text-textSecondary">
            <Link href="/how-it-works" className="hover:text-textPrimary transition-colors">
              How it Works
            </Link>
            <Link href="/pricing" className="hover:text-textPrimary transition-colors">
              Pricing
            </Link>
            <Link href="/about" className="hover:text-textPrimary transition-colors">
              About
            </Link>
          </nav>

          {/* CTAs (Right) */}
          <div className="flex items-center space-x-4">
            <Link 
              href="/sign-in" 
              className="text-xs font-semibold uppercase tracking-wider text-textSecondary hover:text-textPrimary transition-colors"
            >
              Sign In
            </Link>
            <Button size="sm" asChild>
              <Link href="/sign-up" className="font-semibold uppercase tracking-wider text-[11px]">
                Get Started
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Sections */}
      <main className="flex-1">
        {/* SECTION 2 — Hero */}
        <Hero />

        {/* SECTION 3 — Problem */}
        <ProblemSection />

        {/* SECTION 4 — How it Works */}
        <HowItWorks />

        {/* SECTION 5 — Agent Intro */}
        <AgentIntro />

        {/* SECTION 6 — Pricing Teaser */}
        <PricingTeaser />

        {/* SECTION 7 — Final CTA */}
        <section className="py-20 border-t border-border bg-gradient-to-b from-surface/20 to-background text-center relative select-none">
          <div className="absolute inset-0 bg-primary/5 rounded-full blur-[100px] max-w-lg mx-auto pointer-events-none -z-10" />
          
          <div className="max-w-md mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-textPrimary mb-3">
              Find out if your app is production ready
            </h2>
            <p className="text-xs text-textSecondary mb-8 leading-normal">
              Get detailed feedback from Alex, Maria, James, and Priya in less than a minute.
            </p>
            <Button size="lg" asChild className="mb-4 font-semibold">
              <Link href="/sign-up">
                Get Started Free
              </Link>
            </Button>
            <p className="text-[10px] text-textMuted font-medium">
              No credit card required &middot; 2 free analyses
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
