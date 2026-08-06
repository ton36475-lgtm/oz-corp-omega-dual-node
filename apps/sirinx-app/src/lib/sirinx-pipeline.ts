import { AGENT_DNA } from '@/data/agent-dna-data';

export type PipelineStageId =
  | 'lead_intake'
  | 'site_intelligence'
  | 'roi_proposal'
  | 'human_approval'
  | 'memory_write';

export type LeadFacts = {
  businessName?: string;
  province?: string;
  monthlyBillThb?: number;
  roofAreaSqm?: number;
  serviceInterest?: 'solar' | 'ess' | 'ev' | 'ai-warroom' | 'unknown';
  urgency?: 'low' | 'medium' | 'high';
  source?: string;
};

export type PipelineStage = {
  id: PipelineStageId;
  label: string;
  budgetTokens: number;
  primaryAgentId: string;
  supportAgentIds: string[];
  requiredFacts: string[];
  outputContract: string;
};

export type PipelinePlan = {
  objective: string;
  leadFacts: Required<LeadFacts>;
  totalBudgetTokens: number;
  stages: Array<PipelineStage & {
    primaryAgent: AgentRuntimeProfile;
    supportAgents: AgentRuntimeProfile[];
    status: 'ready' | 'needs_input';
    missingFacts: string[];
  }>;
  n8nFlow: string[];
  mcpContract: {
    route: string;
    allowedTools: string[];
    disallowedInputs: string[];
  };
};

type AgentRuntimeProfile = {
  id: string;
  number: number;
  codename: string;
  displayName: string;
  layer: string;
  role: string;
  tokenBudget: number;
  llmModel: string;
  outputFormat: string;
};

export const PIPELINE_STAGES: PipelineStage[] = [
  {
    id: 'lead_intake',
    label: 'Lead Intake',
    budgetTokens: 1500,
    primaryAgentId: 'agent-24-lead-qualification',
    supportAgentIds: ['chatbot-kai'],
    requiredFacts: ['businessName', 'province', 'monthlyBillThb'],
    outputContract: 'JSON lead payload with contact readiness, business type, province, bill range, urgency, and next best question.',
  },
  {
    id: 'site_intelligence',
    label: 'Site Intelligence',
    budgetTokens: 3000,
    primaryAgentId: 'agent-05-site-survey',
    supportAgentIds: ['agent-15-google-maps', 'agent-25-competitor-intel'],
    requiredFacts: ['province', 'roofAreaSqm', 'serviceInterest'],
    outputContract: 'Structured site context with roof estimate, feasibility score, local market notes, and missing survey items.',
  },
  {
    id: 'roi_proposal',
    label: 'ROI Proposal',
    budgetTokens: 4000,
    primaryAgentId: 'agent-26-proposal-gen',
    supportAgentIds: ['agent-18-financial-analysis', 'agent-19-tax-optimization', 'agent-30-promotion-engine'],
    requiredFacts: ['monthlyBillThb', 'serviceInterest', 'urgency'],
    outputContract: 'Customer-ready ROI snapshot, proposal outline, proof points, CTA, and sales follow-up script.',
  },
  {
    id: 'human_approval',
    label: 'Human Approval',
    budgetTokens: 800,
    primaryAgentId: 'agent-35-orchestrator',
    supportAgentIds: ['agent-32-verification', 'agent-43-security'],
    requiredFacts: ['businessName', 'source'],
    outputContract: 'Short approval summary with risks, confidence, required human decision, and allowed send action.',
  },
  {
    id: 'memory_write',
    label: 'Memory Write',
    budgetTokens: 500,
    primaryAgentId: 'agent-41-state-manager',
    supportAgentIds: ['agent-40-decision-router'],
    requiredFacts: ['businessName', 'province', 'serviceInterest'],
    outputContract: 'Durable memory note containing only stable lead facts, decision state, and next action.',
  },
];

export const N8N_FLOW = [
  'Webhook/Form Trigger',
  'Normalize Lead',
  'File Index / Allowed Context Lookup',
  'Token Budget Gate',
  'Enrich Site Context',
  'Score Opportunity',
  'Generate ROI Snapshot',
  'Generate Proposal Draft',
  'Human Approval',
  'Send LINE/Email',
  'Write CRM + Memory',
];

export function normalizeLeadFacts(input: LeadFacts = {}): Required<LeadFacts> {
  return {
    businessName: sanitizeText(input.businessName) || 'Unknown business',
    province: sanitizeText(input.province) || 'Unknown province',
    monthlyBillThb: safeNumber(input.monthlyBillThb),
    roofAreaSqm: safeNumber(input.roofAreaSqm),
    serviceInterest: input.serviceInterest || 'unknown',
    urgency: input.urgency || 'medium',
    source: sanitizeText(input.source) || 'manual',
  };
}

export function createPipelinePlan(input: LeadFacts = {}): PipelinePlan {
  const leadFacts = normalizeLeadFacts(input);
  const totalBudgetTokens = PIPELINE_STAGES.reduce((sum, stage) => sum + stage.budgetTokens, 0);

  return {
    objective: 'restore_sirinx_public_website_and_sales_pipeline',
    leadFacts,
    totalBudgetTokens,
    stages: PIPELINE_STAGES.map((stage) => {
      const missingFacts = stage.requiredFacts.filter((fact) => {
        const value = leadFacts[fact as keyof Required<LeadFacts>];
        return value === 'Unknown business' ||
          value === 'Unknown province' ||
          value === 'unknown' ||
          value === 0;
      });

      return {
        ...stage,
        primaryAgent: getAgentProfile(stage.primaryAgentId),
        supportAgents: stage.supportAgentIds.map(getAgentProfile),
        status: missingFacts.length === 0 ? 'ready' : 'needs_input',
        missingFacts,
      };
    }),
    n8nFlow: N8N_FLOW,
    mcpContract: {
      route: '/api/pipeline/plan',
      allowedTools: ['lead_normalizer', 'file_index_lookup', 'agent_router', 'token_budget_gate', 'approval_summary'],
      disallowedInputs: ['raw_secret', 'api_key', 'full_disk_context', 'unfiltered_browser_cookies', 'shell_command'],
    },
  };
}

function getAgentProfile(id: string): AgentRuntimeProfile {
  const agent = AGENT_DNA.find((item) => item.id === id);
  if (!agent) {
    throw new Error(`Unknown agent id: ${id}`);
  }

  return {
    id: agent.id,
    number: agent.number,
    codename: agent.codename,
    displayName: agent.displayName,
    layer: agent.layer,
    role: agent.role,
    tokenBudget: agent.tokenBudget,
    llmModel: agent.llmModel,
    outputFormat: agent.outputFormat,
  };
}

function sanitizeText(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]*>?/g, '')
    .replace(/[<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 160);
}

function safeNumber(value: unknown): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) return 0;
  return Math.max(0, Math.round(value));
}
