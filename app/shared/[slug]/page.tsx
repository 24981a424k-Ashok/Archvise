import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ArchviseLogo from '@/components/brand/ArchviseLogo'
import DesignResultView from '@/components/design/DesignResultView'
import { Button } from '@/components/ui/button'
import { SystemDesign } from '@/types'

interface SharedDesignPageProps {
  params: {
    slug: string
  }
}

async function fetchSharedDesign(slug: string): Promise<SystemDesign> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
  
  try {
    const res = await fetch(`${API_URL}/api/shared/${slug}`, { 
      cache: 'no-store',
      headers: {
        'Accept': 'application/json'
      }
    })
    
    if (!res.ok) {
      throw new Error("Shared blueprint not found")
    }
    return res.json()
  } catch (e) {
    notFound()
  }
}

export async function generateMetadata({ params }: SharedDesignPageProps): Promise<Metadata> {
  try {
    const design = await fetchSharedDesign(params.slug)
    return {
      title: `${design.title} — Archvise System Design`,
      description: design.founder_summary,
      openGraph: {
        title: `${design.title} — Archvise System Design`,
        description: design.founder_summary,
        images: [`/api/og/${params.slug}`],
      },
    }
  } catch (e) {
    return {
      title: 'System Design Blueprint — Archvise',
      description: 'Review this interactive architecture blueprint generated on Archvise.',
    }
  }
}

export default async function SharedDesignPage({ params }: SharedDesignPageProps) {
  const design = await fetchSharedDesign(params.slug)

  return (
    <div className="min-h-screen bg-background text-textPrimary flex flex-col justify-between overflow-x-hidden">
      
      {/* minimal nav: logo + "Try Archvise free" CTA */}
      <header className="sticky top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border/40 select-none">
        <div className="max-w-5xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 text-textPrimary hover:opacity-90">
            <ArchviseLogo size={24} className="text-primary animate-pulse" />
            <span className="font-bold tracking-tight text-base">Archvise</span>
          </Link>
          
          <Button size="sm" asChild>
            <Link href="/sign-up" className="font-bold uppercase tracking-wider text-[10px]">
              Try Archvise Free
            </Link>
          </Button>
        </div>
      </header>

      {/* Main design Result View in read-only founder mode */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 pb-16">
        <div className="bg-surface/30 border border-border p-4 rounded-lg text-xs text-textSecondary mb-6 flex items-center justify-between">
          <span>You are viewing a shared blueprint copy.</span>
          <Link href="/sign-up" className="text-primary font-bold hover:underline">
            Generate your own &rarr;
          </Link>
        </div>
        
        <DesignResultView design={design} readOnly />
      </main>

      {/* "Generate your own design free" + signup CTA */}
      <section className="py-16 border-t border-border bg-card text-center select-none">
        <div className="max-w-md mx-auto px-4 space-y-4">
          <h3 className="text-xl font-extrabold text-textPrimary">Generate your own design free</h3>
          <p className="text-xs text-textSecondary leading-normal">
            Describe your platform concept and compile production-ready tech stacks and diagrams in under a minute.
          </p>
          <Button size="lg" asChild className="font-bold uppercase tracking-wider text-xs">
            <Link href="/sign-up">
              Start Designing Now
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-6 text-center select-none text-[10px] text-textMuted font-medium">
        &copy; {new Date().getFullYear()} Archvise. All rights reserved.
      </footer>

    </div>
  )
}
