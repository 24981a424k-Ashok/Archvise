"use client"

import React, { useRef, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useInView } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '../ui/button'
import ScoreGauge from '../score/ScoreGauge'

export default function Hero() {
  const router = useRouter()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (isInView) {
      let start = 0
      const end = 87
      const duration = 1200 // 1.2s total duration
      const incrementTime = Math.floor(duration / end)
      
      const timer = setInterval(() => {
        start += 1
        setCount(start)
        if (start === end) {
          clearInterval(timer)
        }
      }, incrementTime)
      
      return () => clearInterval(timer)
    }
  }, [isInView])

  return (
    <section className="relative pt-32 pb-20 px-4 md:px-6 max-w-5xl mx-auto flex flex-col items-center justify-center text-center select-none">
      {/* Accent glow behind hero */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-primary/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Pill Badge */}
      <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-surface border border-border rounded-full text-xs text-primaryLight mb-6 font-semibold animate-pulse">
        <Sparkles size={12} />
        <span>Now powered by DeepSeek-R1 panel</span>
      </div>

      {/* Headings */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-textPrimary max-w-3xl leading-[1.1] mb-6">
        Is your app actually ready <br className="hidden sm:inline" />
        for production?
      </h1>
      
      <p className="text-lg md:text-xl text-textSecondary max-w-2xl leading-relaxed mb-8">
        Archvise&apos;s AI engineering panel audits your code and designs your architecture &mdash; in under a minute.
      </p>

      {/* Call to Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-14 w-full sm:w-auto">
        <Button 
          onClick={() => router.push('/sign-up')}
          size="lg" 
          className="flex items-center justify-center space-x-2 w-full sm:w-auto font-semibold"
        >
          <span>Audit My Code</span>
          <ArrowRight size={16} />
        </Button>
        <Button 
          onClick={() => router.push('/sign-up')}
          size="lg" 
          variant="outline"
          className="w-full sm:w-auto font-semibold"
        >
          Design a System
        </Button>
      </div>

      {/* Scroll-activated Score Gauge */}
      <div ref={ref} className="bg-card border border-border p-8 rounded-lg flex flex-col items-center justify-center shadow-2xl relative w-[240px] mb-4">
        <div className="absolute -inset-px bg-gradient-to-r from-primary/10 to-purple/10 rounded-lg -z-10 blur-sm" />
        <ScoreGauge score={count} size="lg" />
      </div>

      {/* Trust line */}
      <span className="text-xs text-textMuted font-semibold tracking-wider uppercase mt-2 select-none">
        Used to analyze thousands of codebases
      </span>
    </section>
  )
}
