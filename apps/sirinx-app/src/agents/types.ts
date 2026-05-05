// SIRINX 47 Ronin — Shared Agent Types
// ES2020 target, strict mode

export type AgentLayer =
  | 'layer1-perception'
  | 'layer2-analysis'
  | 'layer3-decision'
  | 'layer4-coordination'
  | 'layer5-research'
  | 'chatbot'

export type AgentType =
  // L1 Perception
  | 'pv-monitor'
  | 'battery-monitor'
  | 'weather-monitor'
  | 'grid-tariff-monitor'
  | 'site-survey'
  | 'customer-usage'
  | 'maintenance-history'
  | 'contractor-performance'
  | 'fb-group-scanner'
  | 'fb-comment-scanner'
  | 'tiktok-scanner'
  | 'instagram-scanner'
  | 'youtube-scanner'
  | 'property-scanner'
  | 'google-maps-monitor'
  | 'multi-bot-coordinator'
  // L2 Analysis
  | 'degradation-analysis'
  | 'financial-analysis'
  | 'tax-optimization'
  | 'production-forecasting'
  | 'battery-optimizer'
  | 'low-production-detection'
  | 'cash-flow-health'
  | 'lead-qualification'
  | 'competitor-intel'
  // L3 Decision
  | 'proposal-generator'
  | 'service-recommender'
  | 'job-posting-agent'
  | 'bid-evaluator'
  | 'promotion-engine'
  | 'notification-agent'
  | 'verification-agent'
  | 'content-request-agent'
  | 'email-marketing-agent'
  | 'security-agent'
  // L4 Coordination
  | 'orchestrator'
  | 'customer-portal-agent'
  | 'core-dashboard-agent'
  | 'contractor-portal-agent'
  | 'growth-acquisition-agent'
  | 'decision-router'
  | 'state-manager'
  | 'learning-optimization'
  // L5 Research
  | 'ai-trend-scanner'
  | 'code-evolution'
  | 'benchmark-research'
  | 'integration-discovery'
  // Chatbot
  | 'chatbot'

export interface AgentConfig {
  id: string
  name: string
  codename?: string
  roninName?: string
  roninKanji?: string
  layer: AgentLayer
  type: AgentType
  description: string
  dependencies: string[]
  version: string
}

export interface AgentInput {
  agentId: string
  payload: Record<string, unknown>
  context?: Record<string, unknown>
  correlationId?: string
  timestamp?: string
}

export interface AgentOutput {
  agentId: string
  success: boolean
  data?: Record<string, unknown>
  error?: string
  confidence?: number
  processingMs?: number
  tokensUsed?: number
  correlationId?: string
  timestamp: string
}

export interface AgentEvent {
  type: string
  payload: Record<string, unknown>
  source: string
  timestamp: string
  correlationId?: string
}
