import React from 'react'
import { Zap, AlertTriangle, HelpCircle } from 'lucide-react'
import { Card } from '../ui/card'

export default function ProblemSection() {
  const points = [
    {
      icon: Zap,
      iconColor: 'text-primary',
      borderColor: 'border-primary/10',
      title: "Zero Scalability Planning",
      desc: "Apps built in minutes with modern AI tools have zero scalability structures or resource configurations."
    },
    {
      icon: AlertTriangle,
      iconColor: 'text-warning',
      borderColor: 'border-warning/10',
      title: "Works for Demos, Breaks in Prod",
      desc: "No connection pooling, no caching, no index schemas. It works fine for single-user demos, but collapses under real traffic."
    },
    {
      icon: HelpCircle,
      iconColor: 'text-orange',
      borderColor: 'border-orange/10',
      title: "Founders Left in the Dark",
      desc: "Founders have no way of knowing if their server-less codebases or database configurations can support real users before launching."
    }
  ]

  return (
    <section className="py-20 border-t border-border bg-surface/30 select-none">
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-textPrimary text-center max-w-2xl mx-auto mb-14 leading-tight">
          AI tools let you build in hours. <br className="hidden sm:inline" />
          They don&apos;t tell you if it survives traffic.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {points.map((point, index) => {
            const Icon = point.icon
            return (
              <Card key={index} className="p-6 bg-card border-border relative">
                <div className={`h-10 w-10 rounded-md bg-surface border border-border flex items-center justify-center ${point.iconColor} mb-4`}>
                  <Icon size={20} />
                </div>
                <h3 className="text-base font-bold text-textPrimary mb-2">{point.title}</h3>
                <p className="text-xs text-textSecondary leading-relaxed">{point.desc}</p>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
