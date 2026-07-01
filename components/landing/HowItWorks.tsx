"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { UploadCloud, Bot, BarChart3 } from 'lucide-react'
import { Card } from '../ui/card'

export default function HowItWorks() {
  const steps = [
    {
      num: "01",
      icon: UploadCloud,
      title: "Upload or Connect",
      desc: "Upload your code files directly or connect your GitHub repo with secure read-only access."
    },
    {
      num: "02",
      icon: Bot,
      title: "4 Expert AI Agents Analyze",
      desc: "Alex, Maria, James, and Priya review database connections, SRE scaling configurations, and security protocols."
    },
    {
      num: "03",
      icon: BarChart3,
      title: "Production Readiness Score",
      desc: "Receive a comprehensive score out of 100 with an exact list of founder-friendly and engineer-level fixes."
    }
  ]

  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const } 
    }
  }

  return (
    <section className="py-24 max-w-5xl mx-auto px-4 md:px-6 select-none">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-textPrimary text-center mb-16">
        How Archvise works
      </h2>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 relative"
      >
        {steps.map((step, idx) => {
          const Icon = step.icon
          return (
            <motion.div key={idx} variants={cardVariants}>
              <Card className="p-6 bg-card border-border relative h-full flex flex-col justify-between">
                {/* Connector line for large screens */}
                {idx < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-[1px] bg-border z-10" />
                )}
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <div className="h-10 w-10 rounded-md bg-surface border border-border flex items-center justify-center text-primary">
                      <Icon size={20} />
                    </div>
                    <span className="text-xl font-extrabold text-borderLight">{step.num}</span>
                  </div>
                  
                  <h3 className="text-base font-bold text-textPrimary mb-2">{step.title}</h3>
                  <p className="text-xs text-textSecondary leading-relaxed">{step.desc}</p>
                </div>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>
    </section>
  )
}
