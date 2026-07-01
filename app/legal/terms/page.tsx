"use client"

import React from 'react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { Card, CardContent } from '@/components/ui/card'
import ArchviseLogo from '@/components/brand/ArchviseLogo'
import Footer from '@/components/landing/Footer'

const TERMS_MARKDOWN = `
# Terms of Service

Last Updated: June 25, 2026

Welcome to Archvise. By using our website and services, you agree to comply with and be bound by the following terms and conditions.

## 1. Description of Service
Archvise provides automated AI-assisted code auditing and architecture design systems ("Services"). The Services are provided "as is" and "as available".

## 2. Accounts
To access the Services, you must register for an account using Firebase Authentication. You are responsible for maintaining the confidentiality of your account credentials.

## 3. Data Auditing & Deletion
Archvise respects your privacy and codebase confidentiality:
- Files uploaded for static analysis are temporarily stored securely.
- All code contents are permanently deleted immediately after analysis is complete.
- We request read-only access for GitHub integrations and do not persist code repositories.

## 4. Subscriptions & Billing
Stripe handles payments. Subscriptions are billed on a recurring monthly basis. You can cancel your subscription at any time via the customer billing portal. Refunds are subject to our refund policy.

## 5. Limitation of Liability
Archvise is not liable for runtime failures, server crashes, security breaches, or scaling issues. Our reports provide static analysis recommendations, which should be validated through load testing.
`

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-textPrimary flex flex-col justify-between overflow-x-hidden">
      
      {/* Header */}
      <header className="border-b border-border bg-surface/50 select-none">
        <div className="max-w-5xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 text-textPrimary">
            <ArchviseLogo size={24} className="text-primary animate-pulse" />
            <span className="font-bold tracking-tight text-base">Archvise</span>
          </Link>
          <Link href="/sign-up" className="text-xs font-semibold uppercase tracking-wider text-textSecondary hover:text-textPrimary">
            Sign Up
          </Link>
        </div>
      </header>

      {/* Main markdown content */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-12">
        <Card className="border-border bg-card p-8 shadow-xl">
          <CardContent className="prose prose-invert max-w-none text-xs text-textSecondary leading-relaxed space-y-4">
            <ReactMarkdown>{TERMS_MARKDOWN}</ReactMarkdown>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <Footer />
      
    </div>
  )
}
