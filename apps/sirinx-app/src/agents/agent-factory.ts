// SIRINX Agent Factory — registry of all 47 Ronin constructors
// Agents are loaded lazily; stubs are used for any not yet implemented

import { BaseAgent } from './base-agent'
import type { AgentConfig, AgentInput } from './types'
import { getAgentById } from './agent-definitions'

// Stub agent — used when specific implementation is not yet loaded
class StubAgent extends BaseAgent {
  protected async process(input: AgentInput): Promise<Record<string, unknown>> {
    return {
      status: 'stub',
      agentId: this.id,
      message: `${this.name} agent processed request`,
      receivedPayload: input.payload,
    }
  }
}

// Factory function — returns agent instance for a given agent ID
export function createAgent(agentId: string): BaseAgent {
  const config = getAgentById(agentId)
  if (!config) {
    throw new Error(`Unknown agent ID: ${agentId}`)
  }
  // All agents currently use stub implementation
  // Individual agent files will override this as they are built out
  return new StubAgent(config)
}

// Get all registered agent IDs
export function getRegisteredAgentIds(): string[] {
  return [
    // L1
    'agent-01-pv-monitor', 'agent-02-battery-monitor', 'agent-03-weather',
    'agent-04-grid-tariff', 'agent-05-site-survey', 'agent-06-customer-usage',
    'agent-07-maintenance-hist', 'agent-08-contractor-perf', 'agent-09-fb-group-scanner',
    'agent-10-fb-comment-scanner', 'agent-11-tiktok-scanner', 'agent-12-instagram-scanner',
    'agent-13-youtube-scanner', 'agent-14-property-scanner', 'agent-15-google-maps',
    'agent-16-multi-bot-coord',
    // L2
    'agent-17-degradation', 'agent-18-financial-analysis', 'agent-19-tax-optimization',
    'agent-20-production-forecast', 'agent-21-battery-optimizer', 'agent-22-low-prod-detection',
    'agent-23-cash-flow-health', 'agent-24-lead-qualification', 'agent-25-competitor-intel',
    // L3
    'agent-26-proposal-gen', 'agent-27-service-recommend', 'agent-28-job-posting',
    'agent-29-bid-evaluation', 'agent-30-promotion-engine', 'agent-31-notification',
    'agent-32-verification', 'agent-33-content-request', 'agent-34-email-marketing',
    'agent-43-security',
    // L4
    'agent-35-orchestrator', 'agent-36-customer-portal', 'agent-37-core-dashboard',
    'agent-38-contractor-portal', 'agent-39-growth-acq', 'agent-40-decision-router',
    'agent-41-state-manager', 'agent-42-learning-optim',
    // L5
    'agent-44-ai-trend-scanner', 'agent-45-code-evolution',
    'agent-46-benchmark-research', 'agent-47-integration-disc',
    // Chatbot
    'chatbot-kai',
  ]
}
