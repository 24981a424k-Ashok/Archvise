"use client"

import React from 'react'
import dynamic from 'next/dynamic'
import { formatDistanceToNow } from 'date-fns'
import { 
  Building2, Box, Info, Database, Network, Cloud, ShieldCheck, 
  Share2, Download, Plus 
} from 'lucide-react'
import { SystemDesign } from '@/types'
import CostTable from './CostTable'
import { Card, CardContent } from '../ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'
import ModeToggle from '../app-shell/ModeToggle'
import { useAuthStore } from '@/stores/authStore'
import { Skeleton } from '../ui/skeleton'

// Lazy load diagram canvas
const ArchitectureDiagram = dynamic(
  () => import('./ArchitectureDiagram'),
  { ssr: false, loading: () => <Skeleton className="h-[450px] w-full rounded-lg" /> }
)

interface DesignResultViewProps {
  design: SystemDesign
  readOnly?: boolean
}

export default function DesignResultView({ design, readOnly = false }: DesignResultViewProps) {
  const { display_mode } = useAuthStore()

  const getArchBadgeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'monolith': return 'bg-primary/10 text-primary border-primary/20'
      case 'microservices': return 'bg-purple/10 text-purple border-purple/20'
      default: return 'bg-orange/10 text-orange border-orange/20'
    }
  }

  const timeDistance = React.useMemo(() => {
    if (!design?.created_at) return ''
    try {
      return formatDistanceToNow(new Date(design.created_at), { addSuffix: true })
    } catch (e) {
      return ''
    }
  }, [design?.created_at])

  return (
    <div className="space-y-8 select-none">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <h2 className="text-xl font-bold tracking-tight text-textPrimary">{design.title}</h2>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${getArchBadgeColor(design.architecture_type)}`}>
              {design.architecture_type}
            </span>
          </div>
          {timeDistance && (
            <span className="text-[10px] text-textMuted font-semibold">Generated {timeDistance}</span>
          )}
        </div>
        {!readOnly && <ModeToggle />}
      </div>

      {/* Summary card */}
      <Card className="p-6 bg-card border-border shadow-md">
        <span className="text-[10px] font-bold text-purple uppercase tracking-widest block mb-2">Executive Summary</span>
        <p className="text-xs leading-relaxed text-textSecondary">
          {display_mode === 'founder' ? design.founder_summary : design.engineer_summary}
        </p>
      </Card>

      {/* Technology Stack */}
      <div className="space-y-3">
        <h3 className="font-bold text-textPrimary text-sm flex items-center space-x-1.5">
          <Box size={16} className="text-purple" />
          <span>Technology Stack</span>
        </h3>
        
        <Card className="p-4 bg-card border border-border">
          <TooltipProvider>
            <div className="space-y-4">
              {Object.entries(design.stack).map(([layer, chips]) => (
                <div key={layer} className="flex flex-col sm:flex-row sm:items-center border-b border-border/50 pb-3 last:border-b-0 last:pb-0">
                  <span className="text-xs font-bold text-textSecondary w-32 shrink-0 capitalize mb-2 sm:mb-0">{layer}</span>
                  <div className="flex flex-wrap gap-2">
                    {chips.map((item: any, cIdx: number) => (
                      <Tooltip key={cIdx}>
                        <TooltipTrigger asChild>
                          <div className="cursor-pointer bg-surface hover:bg-surface/80 border border-border hover:border-primary/45 rounded-md px-3 py-1 text-xs text-textPrimary font-semibold transition-colors">
                            {item.chip}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs">
                          <p className="text-[11px] leading-relaxed">{item.reason}</p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TooltipProvider>
        </Card>
      </div>

      {/* Diagram Canvas */}
      <div className="space-y-3">
        <h3 className="font-bold text-textPrimary text-sm flex items-center space-x-1.5">
          <Network size={16} className="text-purple" />
          <span>Architecture Diagram</span>
        </h3>
        <ArchitectureDiagram 
          nodes={design.diagram.nodes} 
          edges={design.diagram.edges} 
        />
      </div>

      {/* Cost Estimates */}
      <div className="space-y-3">
        <h3 className="font-bold text-textPrimary text-sm flex items-center space-x-1.5">
          <Cloud size={16} className="text-purple" />
          <span>Cost Estimates</span>
        </h3>
        <CostTable 
          estimates={design.cost_estimates as any} 
          displayMode={display_mode} 
        />
      </div>

      {/* Detailed specifications */}
      <div className="space-y-3">
        <h3 className="font-bold text-textPrimary text-sm flex items-center space-x-1.5">
          <ShieldCheck size={16} className="text-purple" />
          <span>Detailed Specifications</span>
        </h3>

        <Accordion type="single" collapsible className="w-full bg-card border border-border rounded-lg px-4">
          
          <AccordionItem value="database">
            <AccordionTrigger className="text-xs hover:no-underline font-bold text-textPrimary">
              Database Design
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-textSecondary bg-surface p-3 border border-border rounded-md">
                <div>
                  <span className="font-bold block text-textPrimary mb-0.5">Primary Storage</span>
                  <span>{design.database_design.primary_db}</span>
                </div>
                <div>
                  <span className="font-bold block text-textPrimary mb-0.5">Cache Cluster</span>
                  <span>{design.database_design.cache}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-textMuted uppercase tracking-wider block">Key Schema Tables</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {design.database_design.key_tables.map((table: any, idx: number) => (
                    <div key={idx} className="bg-surface p-3 border border-border rounded-md">
                      <span className="font-bold text-xs text-textPrimary">{table.table_name}</span>
                      <ul className="list-disc pl-4 text-xs text-textSecondary mt-2 space-y-1">
                        {table.fields.map((f: string, fIdx: number) => (
                          <li key={fIdx} className="font-mono text-[10px]">{f}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="api">
            <AccordionTrigger className="text-xs hover:no-underline font-bold text-textPrimary">
              API Design
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-textSecondary bg-surface p-3 border border-border rounded-md">
                <div>
                  <span className="font-bold block text-textPrimary mb-0.5">API Style</span>
                  <span>{design.api_design.style}</span>
                </div>
                <div>
                  <span className="font-bold block text-textPrimary mb-0.5">Authentication</span>
                  <span>{design.api_design.auth_strategy}</span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-bold text-textMuted uppercase tracking-wider block">Core Endpoints</span>
                <div className="space-y-2">
                  {design.api_design.core_endpoints.map((ep: any, idx: number) => (
                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 bg-surface border border-border rounded-md text-xs gap-1.5">
                      <div className="flex items-center space-x-2">
                        <span className="font-extrabold text-primary font-mono text-[10px] bg-primary/10 border border-primary/25 px-1.5 py-0.5 rounded-sm">{ep.method}</span>
                        <span className="font-mono font-semibold text-textPrimary">{ep.path}</span>
                      </div>
                      <span className="text-textSecondary text-[11px]">{ep.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="infra">
            <AccordionTrigger className="text-xs hover:no-underline font-bold text-textPrimary">
              Infrastructure
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              <div className="text-xs text-textSecondary bg-surface p-3 border border-border rounded-md space-y-3">
                <div>
                  <span className="font-bold block text-textPrimary mb-0.5">Cloud Provider</span>
                  <span>{design.infrastructure.cloud_provider}</span>
                </div>
                <div>
                  <span className="font-bold block text-textPrimary mb-0.5">Scaling Strategy</span>
                  <span>{design.infrastructure.scaling_strategy}</span>
                </div>
              </div>
              <div>
                <span className="text-[10px] font-bold text-textMuted uppercase tracking-wider block mb-2">Components Installed</span>
                <div className="flex flex-wrap gap-2">
                  {design.infrastructure.components.map((c: string, idx: number) => (
                    <span key={idx} className="text-xs bg-surface border border-border text-textSecondary px-2.5 py-1 rounded-md font-semibold">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="reliability" className="border-none">
            <AccordionTrigger className="text-xs hover:no-underline font-bold text-textPrimary">
              Reliability &amp; Failover
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-textSecondary bg-surface p-3 border border-border rounded-md">
                <div>
                  <span className="font-bold block text-textPrimary mb-0.5">Uptime SLA</span>
                  <span className="font-bold text-success">{design.reliability.uptime_target}</span>
                </div>
                <div>
                  <span className="font-bold block text-textPrimary mb-0.5">Backup / DR Strategy</span>
                  <span>{design.reliability.backup_dr}</span>
                </div>
              </div>
              
              {display_mode === 'engineer' && (
                <div className="bg-surface border border-border p-3 rounded-md text-xs text-textSecondary space-y-1">
                  <span className="font-bold block text-textPrimary mb-1">RPO &amp; RTO Engineering Targets</span>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-textMuted font-medium block">Recovery Point Objective (RPO)</span>
                      <span className="font-semibold text-textPrimary">1 hour (Database snapshots)</span>
                    </div>
                    <div>
                      <span className="text-textMuted font-medium block">Recovery Time Objective (RTO)</span>
                      <span className="font-semibold text-textPrimary">15 minutes (DNS Failover switch)</span>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <span className="text-[10px] font-bold text-textMuted uppercase tracking-wider block mb-2">High Availability Strategies</span>
                <ul className="list-disc pl-5 text-xs text-textSecondary space-y-1.5">
                  {design.reliability.strategies.map((strategy: string, idx: number) => (
                    <li key={idx} className="leading-relaxed">{strategy}</li>
                  ))}
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>

        </Accordion>
      </div>
    </div>
  )
}
