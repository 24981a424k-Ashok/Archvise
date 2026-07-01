"use client"

import React from 'react'
import { Activity, ShieldAlert, Cpu } from 'lucide-react'
import { Card } from '../ui/card'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '../ui/dialog'

interface CapacityEstimate {
  safe_range: string
  peak_range: string
  description: string
  reasoning: string
  confidence: string
}

interface CapacityCardProps {
  capacity: CapacityEstimate
  disclaimer: string
}

export default function CapacityCard({ capacity, disclaimer }: CapacityCardProps) {
  return (
    <Card className="p-5 bg-card border-border select-none">
      <div className="flex items-start space-x-3.5 mb-4">
        <div className="h-9 w-9 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
          <Activity size={18} />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-textPrimary text-sm mb-0.5">Capacity Estimate</h4>
          <p className="text-xs text-textSecondary leading-normal">
            Estimated Daily Active User (DAU) support based on static code parsing.
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 bg-surface p-3 border border-border rounded-md mb-3.5">
        <div>
          <span className="text-[10px] text-textMuted uppercase font-semibold tracking-wider block mb-0.5">Right Now</span>
          <span className="text-base font-bold text-textPrimary">{capacity.safe_range}</span>
        </div>
        <div>
          <span className="text-[10px] text-textMuted uppercase font-semibold tracking-wider block mb-0.5">During Spikes</span>
          <span className="text-base font-bold text-orange">{capacity.peak_range}</span>
        </div>
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <button className="text-xs font-semibold text-primary hover:text-primaryLight hover:underline focus:outline-none flex items-center">
            Why this estimate? &rarr;
          </button>
        </DialogTrigger>
        <DialogContent className="max-w-md bg-cardElevated border border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Cpu size={18} className="text-primary" />
              <span>SRE Capacity Calculations</span>
            </DialogTitle>
            <DialogDescription>
              How our AI panel calculates these traffic thresholds.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 my-2 text-sm text-textSecondary">
            <div>
              <h5 className="font-bold text-textPrimary text-xs mb-1 uppercase tracking-wider">Reasoning</h5>
              <p className="text-xs leading-relaxed">{capacity.reasoning}</p>
            </div>
            <div>
              <h5 className="font-bold text-textPrimary text-xs mb-1 uppercase tracking-wider">Metrics Checked</h5>
              <p className="text-xs leading-relaxed">{capacity.description}</p>
            </div>
            <div className="flex justify-between items-center text-xs border-t border-border pt-3">
              <span>Estimate Confidence:</span>
              <span className="font-bold text-textPrimary capitalize">{capacity.confidence}</span>
            </div>
            <div className="bg-surface border border-border p-3 rounded-md flex items-start space-x-2 text-[10px] text-textMuted leading-relaxed">
              <ShieldAlert size={16} className="shrink-0 text-textSecondary" />
              <span>{disclaimer}</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
