"use client"

import React from 'react'
import { motion } from 'framer-motion'

interface ScoreGaugeProps {
  score: number
  size?: 'sm' | 'md' | 'lg'
}

export const getScoreColor = (val: number) => {
  if (val >= 90) return '#22C55E' // Success Green
  if (val >= 70) return '#3B82F6' // Primary Blue
  if (val >= 50) return '#EAB308' // Warning Yellow
  return '#EF4444' // Danger Red
}

export const getScoreLabel = (val: number) => {
  if (val >= 90) return 'Excellent'
  if (val >= 80) return 'Very Good'
  if (val >= 70) return 'Good'
  if (val >= 50) return 'Fair'
  return 'Critical'
}

export default function ScoreGauge({ score, size = 'md' }: ScoreGaugeProps) {

  // Dimensions based on size
  const config = {
    sm: { radius: 16, stroke: 3, size: 36, fontSize: '10px' },
    md: { radius: 36, stroke: 6, size: 84, fontSize: '20px' },
    lg: { radius: 64, stroke: 10, size: 148, fontSize: '32px' }
  }

  const { radius, stroke, size: elementSize, fontSize } = config[size]
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (score / 100) * circumference

  return (
    <div className="flex flex-col items-center justify-center select-none">
      <div className="relative" style={{ width: elementSize, height: elementSize }}>
        <svg
          width={elementSize}
          height={elementSize}
          viewBox={`0 0 ${elementSize} ${elementSize}`}
          className="-rotate-90"
        >
          {/* Base track circle */}
          <circle
            cx={elementSize / 2}
            cy={elementSize / 2}
            r={radius}
            fill="transparent"
            stroke="#2D2D2D"
            strokeWidth={stroke}
          />
          {/* Animated active track circle */}
          <motion.circle
            cx={elementSize / 2}
            cy={elementSize / 2}
            r={radius}
            fill="transparent"
            stroke={getScoreColor(score)}
            strokeWidth={stroke}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
          <span style={{ fontSize }} className="font-bold text-textPrimary">
            {score}
          </span>
          {size === 'lg' && (
            <span className="text-[10px] text-textMuted font-medium mt-1">
              / 100
            </span>
          )}
        </div>
      </div>
      {size === 'lg' && (
        <div 
          className="mt-3 text-sm font-semibold uppercase tracking-wider" 
          style={{ color: getScoreColor(score) }}
        >
          {getScoreLabel(score)}
        </div>
      )}
    </div>
  )
}
