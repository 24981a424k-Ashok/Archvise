import React from 'react'
import Link from 'next/link'
import { Card } from '../ui/card'
import { Check } from 'lucide-react'

export default function PricingTeaser() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      desc: "Perfect for testing and small demo projects.",
      features: ["2 code analyses / mo", "Basic SRE review score", "Web interface report access"]
    },
    {
      name: "Starter",
      price: "$19",
      desc: "For active builders launching their first MVP.",
      features: ["5 audits + 10 designs / mo", "Full GitHub integration", "PDF export capability", "Priority processing queue"]
    },
    {
      name: "Pro",
      price: "$49",
      desc: "For professional teams shipping production products.",
      features: ["Unlimited audits & designs", "Instant processing speed", "Shared public design links", "Symmetric encryption"]
    }
  ]

  return (
    <section className="py-24 max-w-5xl mx-auto px-4 md:px-6 select-none">
      <div className="text-center mb-16">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-textPrimary mb-3">
          Simple, transparent pricing
        </h2>
        <p className="text-sm text-textSecondary max-w-md mx-auto">
          Upgrade or downgrade your plan at any time. Stripe secures all payment data.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        {plans.map((plan, idx) => (
          <Card key={idx} className="p-6 bg-card border-border flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-textPrimary mb-1">{plan.name}</h3>
              <div className="flex items-baseline space-x-1 mb-3">
                <span className="text-3xl font-extrabold text-textPrimary">{plan.price}</span>
                <span className="text-xs text-textSecondary font-semibold">/month</span>
              </div>
              <p className="text-xs text-textSecondary leading-normal mb-6">{plan.desc}</p>
              
              <ul className="space-y-2.5 text-xs text-textSecondary border-t border-border pt-4">
                {plan.features.map((feat, fIdx) => (
                  <li key={fIdx} className="flex items-center space-x-2">
                    <Check size={12} className="text-primary shrink-0" />
                    <span className="truncate">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Link 
          href="/pricing" 
          className="inline-flex items-center text-xs font-bold text-primary hover:text-primaryLight hover:underline transition-colors uppercase tracking-wider"
        >
          <span>View Full Pricing Details</span>
          <span className="ml-1">&rarr;</span>
        </Link>
      </div>
    </section>
  )
}
