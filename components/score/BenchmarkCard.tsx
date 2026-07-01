"use client"

import React from 'react'
import { Trophy } from 'lucide-react'
import { Card } from '../ui/card'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts'

interface BenchmarkCardProps {
  percentile: number
  displayMode: 'founder' | 'engineer'
}

export default function BenchmarkCard({ percentile, displayMode }: BenchmarkCardProps) {
  const chartData = [{ name: 'Percentile', value: percentile }]

  return (
    <Card className="p-5 bg-card border-border relative overflow-hidden select-none">
      <div className="flex items-start space-x-3.5">
        <div className="h-9 w-9 rounded-md bg-warningBg/10 border border-warning/20 flex items-center justify-center text-warning shrink-0">
          <Trophy size={18} className="fill-warning/10" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-textPrimary text-sm mb-1">Benchmark Analysis</h4>
          <p className="text-xs text-textSecondary mb-3">
            {displayMode === 'founder'
              ? `Your app scores better than ${percentile}% of analyzed codebases.`
              : `Percentile rank: ${percentile}th among analyzed codebases.`}
          </p>
          
          <div className="h-6 w-full bg-surface border border-border rounded-md overflow-hidden relative flex items-center px-1">
            <ResponsiveContainer width="100%" height={12}>
              <BarChart layout="vertical" data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis type="category" dataKey="name" hide />
                <Bar 
                  dataKey="value" 
                  fill="#3B82F6" 
                  radius={[4, 4, 4, 4]} 
                  background={{ fill: '#141414', radius: 4 }}
                />
              </BarChart>
            </ResponsiveContainer>
            {/* Absolute indicator label */}
            <div 
              className="absolute text-[9px] font-bold text-textPrimary bg-primary/95 border border-primaryLight/40 px-1 py-0.5 rounded-sm shadow-sm"
              style={{ left: `calc(${percentile}% - 14px)`, transform: 'translateY(-12px)' }}
            >
              {percentile}%
            </div>
          </div>
          <div className="flex justify-between items-center text-[9px] text-textMuted mt-1.5 font-semibold uppercase tracking-wider">
            <span>0th (Poor)</span>
            <span>50th (Average)</span>
            <span>100th (Optimal)</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
