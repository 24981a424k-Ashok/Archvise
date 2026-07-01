"use client"

import React from 'react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { Card, CardContent } from '@/components/ui/card'
import ArchviseLogo from '@/components/brand/ArchviseLogo'
import Footer from '@/components/landing/Footer'

const PRIVACY_MARKDOWN = `
# Privacy Policy

Last Updated: June 25, 2026

At Archvise, we are committed to protecting your privacy and codebase confidentiality. This Privacy Policy explains how we collect, use, and safeguard your data.

## 1. Information We Collect
- **Account Information**: When you register, we collect your email address and profile credentials via Firebase Authentication.
- **Codebase Data**: We request read-only access to your repositories via GitHub OAuth, or collect files uploaded directly for static analysis.
- **Billing Information**: Payment and credit card details are processed securely and directly by Stripe. We do not store credit card numbers on our servers.

## 2. Code Confidentiality & Deletion
We prioritize the security of your proprietary code:
- **Temporary Uploads**: Code files uploaded for static analysis are processed securely.
- **Immediate Deletion**: All raw code contents and file uploads are permanently deleted immediately after the analysis and scoring are completed.
- **No Repository Persistence**: We do not store or mirror your GitHub repository contents.

## 3. Third-Party Integrations
We use secure third-party services to power Archvise:
- **Firebase**: For user authentication and session management.
- **NVIDIA NIM (DeepSeek & Llama)**: Code metadata and design instructions are analyzed via secure AI API endpoints. Your code is not used for training models.
- **Stripe**: For subscription billing and checkout services.
- **Cloudflare R2**: Used for secure, ephemeral storage of upload files during the audit process.

## 4. Your Rights & Choices
You can delete your Archvise account and all associated project reports at any time through your Account Settings. If you disconnect your GitHub account, we immediately revoke and delete all OAuth tokens.
`

export default function PrivacyPage() {
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
            <ReactMarkdown>{PRIVACY_MARKDOWN}</ReactMarkdown>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <Footer />
      
    </div>
  )
}
