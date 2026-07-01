"use client"

import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'

interface CostEstimates {
  "1k_users": { monthly_cost: string; drivers: string }
  "100k_users": { monthly_cost: string; drivers: string }
  "1m_users": { monthly_cost: string; drivers: string }
}

interface CostTableProps {
  estimates: CostEstimates
  displayMode: 'founder' | 'engineer'
}

export default function CostTable({ estimates, displayMode }: CostTableProps) {
  return (
    <div className="space-y-3 select-none">
      <div className="border border-border rounded-lg overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Scale</TableHead>
              <TableHead>Estimated Cost</TableHead>
              <TableHead>Primary Drivers</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-semibold text-xs text-textPrimary">1,000 DAU</TableCell>
              <TableCell className="text-xs text-textPrimary">{estimates["1k_users"].monthly_cost}</TableCell>
              <TableCell className="text-xs text-textSecondary">{estimates["1k_users"].drivers}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold text-xs text-textPrimary">100,000 DAU</TableCell>
              <TableCell className="text-xs text-textPrimary">{estimates["100k_users"].monthly_cost}</TableCell>
              <TableCell className="text-xs text-textSecondary">{estimates["100k_users"].drivers}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold text-xs text-textPrimary">1,000,000 DAU</TableCell>
              <TableCell className="text-xs text-textPrimary">{estimates["1m_users"].monthly_cost}</TableCell>
              <TableCell className="text-xs text-textSecondary">{estimates["1m_users"].drivers}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      
      <p className="text-[10px] text-textMuted leading-relaxed">
        {displayMode === 'founder'
          ? "💡 Estimated pricing reflects average hosting charges. Upgrades to databases or multi-region setups will affect monthly bills."
          : "💡 Infrastructure cost calculations assume AWS standard resource rates. Traffic estimates include load balancers, caching and replication nodes."}
      </p>
    </div>
  )
}
