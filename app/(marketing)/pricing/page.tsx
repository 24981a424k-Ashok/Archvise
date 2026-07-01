import React from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, ShieldCheck, Zap } from 'lucide-react'
import Footer from '@/components/landing/Footer'
import ArchviseLogo from '@/components/brand/ArchviseLogo'

export default function PricingPage() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      desc: "Perfect for testing and small demo projects.",
      cta: "Get Started Free",
      features: [
        "2 code analyses / mo",
        "Basic SRE readiness review",
        "Dashboard reports access",
        "Symmetric key security",
        "Delete code immediately"
      ]
    },
    {
      name: "Starter",
      price: "$19",
      desc: "For active builders launching their first MVP.",
      cta: "Upgrade to Starter",
      popular: true,
      features: [
        "5 audits + 10 designs / mo",
        "Full GitHub integration",
        "PDF export capability",
        "Priority processing queue",
        "Connection pooling analysis",
        "Uptime target recommendations"
      ]
    },
    {
      name: "Pro",
      price: "$49",
      desc: "For professional teams shipping production products.",
      cta: "Upgrade to Pro",
      features: [
        "Unlimited audits & designs",
        "Fastest processing queue",
        "Shared public design links",
        "DeepSeek R1 + Llama 405B",
        "Stripe customer portal management",
        "Fallback Anthropic Claude-3.5"
      ]
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
          <Link href="/sign-in" className="text-xs font-semibold uppercase tracking-wider text-textSecondary hover:text-textPrimary">
            Sign In
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-16 px-4 max-w-5xl mx-auto w-full select-none">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-textPrimary mb-3">Pricing Plans</h2>
          <p className="text-xs text-textSecondary max-w-sm mx-auto">
            Choose the plan that fits your project scaling requirements. Secure payments by Stripe.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan, idx) => (
            <Card 
              key={idx} 
              className={`p-6 bg-card border-border flex flex-col justify-between relative ${
                plan.popular ? 'border-primary shadow-[0_0_20px_rgba(59,130,246,0.15)]' : ''
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-textPrimary text-[9px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                  Most Popular
                </span>
              )}
              
              <div>
                <h3 className="text-base font-bold text-textPrimary mb-1.5">{plan.name}</h3>
                <div className="flex items-baseline space-x-1 mb-4">
                  <span className="text-4xl font-extrabold text-textPrimary">{plan.price}</span>
                  <span className="text-xs text-textSecondary font-semibold">/month</span>
                </div>
                <p className="text-xs text-textSecondary leading-relaxed mb-6">{plan.desc}</p>
                
                <ul className="space-y-3 text-xs text-textSecondary border-t border-border pt-4 mb-8">
                  {plan.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-center space-x-2.5">
                      <Check size={14} className="text-primary shrink-0" />
                      <span className="truncate">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button 
                variant={plan.popular ? 'default' : 'outline'} 
                asChild 
                className="w-full font-semibold uppercase tracking-wider text-[10px]"
              >
                <Link href="/sign-up">
                  {plan.cta}
                </Link>
              </Button>
            </Card>
          ))}
        </div>

        {/* Security / Stripe Trust */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 bg-surface p-4 border border-border rounded-lg max-w-lg mx-auto text-xs text-textSecondary text-center sm:text-left">
          <ShieldCheck size={28} className="text-success shrink-0" />
          <p className="leading-relaxed">
            Secure processing by **Stripe**. All invoices, payment options, upgrade, and downgrade operations are managed safely. Cancel anytime with a single click.
          </p>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
