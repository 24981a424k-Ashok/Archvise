"use client"

import React from 'react'
import { AgentReport } from '@/types'
import ScoreGauge from './ScoreGauge'
import FindingItem from './FindingItem'
import SuggestionItem from './SuggestionItem'
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '../ui/accordion'
import { cn } from '@/lib/utils'

interface AgentCardProps {
  agent: AgentReport
  agentId: 'sre' | 'backend' | 'infrastructure' | 'cloud_architect'
  displayMode: 'founder' | 'engineer'
}

export default function AgentCard({ agent, agentId, displayMode }: AgentCardProps) {
  const getAgentColor = (id: string) => {
    switch (id) {
      case 'sre': return 'border-t-[#3B82F6]'
      case 'backend': return 'border-t-[#22C55E]'
      case 'infrastructure': return 'border-t-[#A855F7]'
      default: return 'border-t-[#F97316]'
    }
  }

  const getCriterionIcon = (val: number) => {
    if (val >= 90) return <span className="text-success font-semibold mr-1.5">✓</span>
    if (val >= 50) return <span className="text-warning font-semibold mr-1.5">~</span>
    return <span className="text-danger font-semibold mr-1.5">✗</span>
  }

  const findingsCount = agent.findings ? agent.findings.length : 0
  const hasCritical = agent.findings && agent.findings.some(f => f.severity === 'critical' || f.severity === 'high')

  return (
    <div className={cn(
      "border border-border bg-card rounded-lg overflow-hidden flex flex-col border-t-4",
      getAgentColor(agentId)
    )}>
      <div className="p-4 flex items-center justify-between border-b border-border bg-surface/50 select-none">
        <div>
          <h4 className="font-bold text-textPrimary text-sm leading-tight">{agent.agent_name}</h4>
          <span className="text-[10px] text-textSecondary uppercase tracking-wider">{agent.agent_role}</span>
        </div>
        <div className="flex items-center space-x-3">
          {findingsCount > 0 && (
            <span className={cn(
              "text-[9px] font-bold px-1.5 py-0.5 rounded-sm border",
              hasCritical 
                ? "bg-dangerBg/15 text-danger border-danger/30" 
                : "bg-surface text-textSecondary border-border"
            )}>
              {findingsCount} findings
            </span>
          )}
          <ScoreGauge score={agent.score} size="sm" />
        </div>
      </div>
      
      <div className="px-4 py-2 flex-1">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="agent-details" className="border-none">
            <AccordionTrigger className="py-2.5 text-xs text-textSecondary hover:text-textPrimary font-semibold">
              View Expert Findings
            </AccordionTrigger>
            <AccordionContent className="pt-2">
              {/* Score breakdown */}
              {agent.score_breakdown && Object.keys(agent.score_breakdown).length > 0 && (
                <div className="mb-4 bg-surface p-2.5 border border-border rounded-md">
                  <h5 className="font-semibold text-textPrimary text-[11px] uppercase tracking-wider mb-2">Breakdown</h5>
                  <div className="space-y-1.5 text-xs">
                    {Object.entries(agent.score_breakdown).map(([criterion, val]) => (
                      <div key={criterion} className="flex justify-between items-center text-textSecondary">
                        <div className="flex items-center">
                          {getCriterionIcon(val)}
                          <span>{criterion}</span>
                        </div>
                        <span className="font-semibold text-textPrimary">{val} pts</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Findings */}
              {findingsCount > 0 && (
                <div className="mb-4">
                  <h5 className="font-semibold text-textPrimary text-[11px] uppercase tracking-wider mb-2">Detailed Findings</h5>
                  {agent.findings.map((finding, idx) => (
                    <FindingItem key={idx} finding={finding} displayMode={displayMode} />
                  ))}
                </div>
              )}

              {/* Suggestions */}
              {agent.suggestions && agent.suggestions.length > 0 && (
                <div>
                  <h5 className="font-semibold text-primary text-[11px] uppercase tracking-wider mb-2">Recommendations</h5>
                  {agent.suggestions.map((suggestion, idx) => (
                    <SuggestionItem key={idx} suggestion={suggestion} displayMode={displayMode} />
                  ))}
                </div>
              )}

              {findingsCount === 0 && (!agent.suggestions || agent.suggestions.length === 0) && (
                <p className="text-xs text-textMuted text-center py-4">No recommendations or issues found. Code is clean.</p>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}
