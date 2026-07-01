export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  plan: 'free' | 'starter' | 'pro';
  display_mode: 'founder' | 'engineer';
  credits_remaining: number;
  credits_reset_at: string;
  github_connected: boolean;
  total_audits: number;
  total_designs: number;
}

export interface Confidence {
  level: 'high' | 'medium' | 'low';
  score: number;
  label: string;
  based_on: string[];
  limitations: string[];
  to_increase_confidence: string[];
}

export interface Finding {
  severity: 'critical' | 'high' | 'medium' | 'low';
  issue: string;
  location: string;
  impact: string;
  founder_text: string;
  engineer_text: string;
}

export interface Suggestion {
  priority: 'high' | 'medium' | 'low';
  effort: 'low' | 'medium' | 'high';
  suggestion: string;
  founder_text: string;
  engineer_text: string;
  estimated_score_gain: number;
  estimated_capacity_gain: string;
}

export interface AgentReport {
  agent_name: string;
  agent_role: string;
  score: number;
  score_breakdown: Record<string, number>;
  findings: Finding[];
  suggestions: Suggestion[];
  cost_analysis?: {
    monthly_estimate: number;
    saving_opportunities: number;
  };
}

export interface AuditReport {
  id: string;
  project_id: string;
  readiness_score: number;
  confidence: Confidence;
  capacity_estimate: {
    safe_range: string;
    peak_range: string;
    description: string;
    reasoning: string;
    confidence: string;
  };
  agents: {
    sre: AgentReport;
    backend: AgentReport;
    infrastructure: AgentReport;
    cloud_architect: AgentReport;
  };
  top_critical_issues: string[];
  quick_wins: string[];
  benchmark_percentile: number;
  score_disclaimer: string;
  files_analyzed: number;
  files_skipped: number;
  created_at: string;
}

export interface SystemDesign {
  id: string;
  project_id: string;
  idea_prompt: string;
  title: string;
  founder_summary: string;
  engineer_summary: string;
  architecture_type: 'Monolith' | 'Microservices' | 'Hybrid';
  reasoning: string;
  stack: Record<string, { chip: string; reason: string }[]>;
  database_design: {
    primary_db: string;
    cache: string;
    key_tables: { table_name: string; fields: string[] }[];
  };
  api_design: {
    style: string;
    auth_strategy: string;
    core_endpoints: { method: string; path: string; description: string }[];
  };
  infrastructure: {
    cloud_provider: string;
    components: string[];
    scaling_strategy: string;
  };
  reliability: {
    uptime_target: string;
    strategies: string[];
    backup_dr: string;
  };
  cost_estimates: Record<string, { monthly_cost: string; drivers: string }>;
  diagram: {
    nodes: { id: string; type?: string; data: { label: string }; position: { x: number; y: number } }[];
    edges: { id: string; source: string; target: string; animated?: boolean; label?: string }[];
  };
  created_at: string;
}

export interface Project {
  id: string;
  name: string;
  type: 'audit' | 'system_design';
  source: 'upload' | 'github';
  status: 'queued' | 'processing' | 'complete' | 'failed';
  readiness_score?: number;
  error_msg?: string;
  github_repo?: string;
  github_branch?: string;
  created_at: string;
}
