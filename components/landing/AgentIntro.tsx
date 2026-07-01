import React from 'react'
import { Card } from '../ui/card'

export default function AgentIntro() {
  const agents = [
    {
      name: "Alex",
      role: "SRE Lead",
      colorClass: "border-t-agentSRE text-agentSRE",
      desc: "Checks uptime configurations, rate limiting rules, circuit breakers, and failover/HA architecture design."
    },
    {
      name: "Maria",
      role: "Senior Backend Engineer",
      colorClass: "border-t-agentBackend text-agentBackend",
      desc: "Reviews SQL query efficiency, database locks, cache configuration, and connection pooling settings."
    },
    {
      name: "James",
      role: "Infrastructure Engineer",
      colorClass: "border-t-agentInfra text-agentInfra",
      desc: "Evaluates CDN edge setups, load balancing protocols, security certificates, and container/Docker configs."
    },
    {
      name: "Priya",
      role: "Cloud Architect",
      colorClass: "border-t-agentCloud text-agentCloud",
      desc: "Estimates cloud hosting billing costs, auto-scaling configurations, and cross-region replication strategies."
    }
  ]

  return (
    <section className="py-20 border-t border-border bg-surface/30 select-none">
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-textPrimary text-center mb-16">
          Meet your AI engineering panel
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {agents.map((agent, index) => (
            <Card key={index} className={`bg-card border-border border-t-4 ${agent.colorClass.split(' ')[0]} p-6 flex flex-col justify-between`}>
              <div>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${agent.colorClass.split(' ')[1]} block mb-2`}>
                  {agent.role}
                </span>
                <h3 className="text-lg font-bold text-textPrimary mb-3">{agent.name}</h3>
                <p className="text-xs text-textSecondary leading-relaxed">{agent.desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
