type RuntimeEnv = {
  SIRINX_API_MODE?: string;
  SIRINX_ALLOWED_ORIGIN?: string;
  SIRINX_WORKERS_AI_MODEL?: string;
  SIRINX_AI_SERVER_TOKEN?: string;
  SIRINX_MODEL_GATEWAY_URL?: string;
  ZHIPU_API_KEY?: string;
  ZHIPU_BASE_URL?: string;
  OPENROUTER_API_KEY?: string;
  OPENROUTER_BASE_URL?: string;
  OPENCLAW_SERVICE?: Fetcher;
  SIRINX_DB?: unknown;
  AI?: WorkersAiBinding;
};

type Platform = {
  fetch: typeof fetch;
};

type JsonObject = Record<string, unknown>;

type WorkersAiBinding = {
  run(model: string, input: Record<string, unknown>): Promise<unknown>;
};

type CommandCenterToolName =
  | 'status'
  | 'rooms'
  | 'pipeline_plan'
  | 'utility_manifest'
  | 'telegram_commands';

type LeadFacts = {
  businessName?: string;
  province?: string;
  monthlyBillThb?: number;
  roofAreaSqm?: number;
  serviceInterest?: 'solar' | 'ess' | 'ev' | 'ai-warroom' | 'unknown';
  urgency?: 'low' | 'medium' | 'high';
  source?: string;
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

const MAX_JSON_BYTES = 1_000_000;
const MAX_IMAGES = 10;
const MAX_IMAGE_CHARS = 6_000_000;
const MAX_WORKERS_AI_PROMPT_CHARS = 20_000;
const MAX_WORKERS_AI_OUTPUT_TOKENS = 2048;
const DEFAULT_WORKERS_AI_MODEL = '@cf/meta/llama-3.1-8b-instruct';

const COMMAND_CENTER_ROOMS = [
  {
    id: 'pc-ghostclaw-hq',
    node: 'pc',
    room: 'Ghostclaw HQ',
    telegramBot: 'local-or-old-bot',
    role: 'heavy runtime, WSL, marketplace, long-running jobs',
  },
  {
    id: 'mac-multi-agent-ai-company',
    node: 'mac',
    room: '@MultiAgentAiCompany_bot',
    telegramBot: '@MultiAgentAiCompany_bot',
    role: 'local Hermes, thCLAW, command center, lightweight orchestration',
  },
];

const TELEGRAM_COMMANDS = [
  { command: '/status', tool: 'status', description: 'System and room overview' },
  { command: '/rooms', tool: 'rooms', description: 'Show 1-node/1-room mapping' },
  { command: '/pipeline', tool: 'pipeline_plan', description: 'Show SIRINX token/agent pipeline plan' },
  { command: '/utility', tool: 'utility_manifest', description: 'Show utility tool capabilities' },
  { command: '/commands', tool: 'telegram_commands', description: 'List Telegram commands' },
] as const;

const ALLOWED_TOOLS = new Set<CommandCenterToolName>([
  'status',
  'rooms',
  'pipeline_plan',
  'utility_manifest',
  'telegram_commands',
]);

const ALLOWED_OPENCLAW_COMMANDS: Record<string, string[]> = {
  health: ['health'],
  status: ['status'],
  models: ['models', 'status', '--json'],
  agents: ['agents', 'list', '--json'],
  sessions: ['sessions', '--json'],
  gateway_status: ['gateway', 'status'],
  memory_status: ['memory', 'status'],
  skills: ['skills', '--json'],
  models_scan: ['models', 'scan'],
  logs: ['logs', '--tail', '20'],
  version: ['--version'],
};

const OPENCLAW_BLOCKED_FIELDS = [
  'argv',
  'args',
  'shell',
  'raw',
  'script',
  'cmdline',
  'commandLine',
  'env',
  'cwd',
  'stdio',
  'exec',
  'stdin',
];

const PIPELINE_STAGES = [
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
] as const;

const AGENT_PROFILES: Record<string, AgentRuntimeProfile> = {
  'chatbot-kai': agent('chatbot-kai', 0, 'Kai', 'Chatbot Kai', 'L0 Customer Interface', 'Customer chat intake', 1200),
  'agent-05-site-survey': agent('agent-05-site-survey', 5, 'Survey', 'Site Survey', 'L1 Perception', 'Site survey and roof context', 1800),
  'agent-15-google-maps': agent('agent-15-google-maps', 15, 'Maps', 'Google Maps', 'L1 Perception', 'Local map and site context', 1200),
  'agent-18-financial-analysis': agent('agent-18-financial-analysis', 18, 'Finance', 'Financial Analysis', 'L2 Analysis', 'ROI and savings model', 1800),
  'agent-19-tax-optimization': agent('agent-19-tax-optimization', 19, 'Tax', 'Tax Optimization', 'L2 Analysis', 'Tax and incentive notes', 1400),
  'agent-24-lead-qualification': agent('agent-24-lead-qualification', 24, 'Lead', 'Lead Qualification', 'L2 Analysis', 'Lead qualification and next action', 1500),
  'agent-25-competitor-intel': agent('agent-25-competitor-intel', 25, 'Intel', 'Competitor Intelligence', 'L2 Analysis', 'Market and competitor context', 1500),
  'agent-26-proposal-gen': agent('agent-26-proposal-gen', 26, 'Proposal', 'Proposal Generator', 'L3 Decision', 'Proposal and sales output', 2200),
  'agent-30-promotion-engine': agent('agent-30-promotion-engine', 30, 'Promo', 'Promotion Engine', 'L3 Decision', 'Offer and campaign fit', 1200),
  'agent-32-verification': agent('agent-32-verification', 32, 'Verify', 'Verification', 'L3 Decision', 'Evidence and risk checks', 1200),
  'agent-35-orchestrator': agent('agent-35-orchestrator', 35, 'Gengo', 'Master Orchestrator', 'L4 Coordination', 'Workflow orchestration', 2000),
  'agent-40-decision-router': agent('agent-40-decision-router', 40, 'Router', 'Decision Router', 'L4 Coordination', 'Routing and approval state', 1400),
  'agent-41-state-manager': agent('agent-41-state-manager', 41, 'State', 'State Manager', 'L4 Coordination', 'Memory and state update', 1200),
  'agent-43-security': agent('agent-43-security', 43, 'Security', 'Security', 'L3 Decision', 'Security and access review', 1500),
};

const N8N_FLOW = [
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

function agent(
  id: string,
  number: number,
  codename: string,
  displayName: string,
  layer: string,
  role: string,
  tokenBudget: number,
): AgentRuntimeProfile {
  return {
    id,
    number,
    codename,
    displayName,
    layer,
    role,
    tokenBudget,
    llmModel: 'worker-runtime',
    outputFormat: 'json',
  };
}

export async function handleRequest(
  request: Request,
  env: RuntimeEnv = {},
  ctx?: ExecutionContext,
  platform: Platform = { fetch: globalThis.fetch },
): Promise<Response> {
  const url = new URL(request.url);
  const pathname = normalizePath(url.pathname);

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders(request, env) });
  }

  if (request.method === 'GET' && pathname === '/health') {
    return jsonResponse(request, env, {
      service: 'sirinx-api-worker',
      runtime: 'cloudflare-worker',
      mode: env.SIRINX_API_MODE ?? 'production-worker',
      dynamicPostRuntime: true,
      routes: [
        '/api/command-center/tool',
        '/api/pipeline/plan',
        '/api/runtime/readiness',
        '/api/ai/server',
        '/api/ai/compute',
        '/api/openclaw/run',
        '/api/ai-customize',
        '/api/vision/analyze',
      ],
      timestamp: new Date().toISOString(),
    });
  }

  if (pathname === '/api/runtime/readiness') {
    return handleRuntimeReadiness(request, env);
  }

  if (pathname === '/api/ai/server') {
    return handleWorkersAiServer(request, env);
  }

  if (pathname === '/api/ai/compute') {
    return handleWorkersAiCompute(request, env);
  }

  if (pathname === '/api/command-center/tool') {
    return handleCommandCenter(request, env);
  }

  if (pathname === '/api/pipeline/plan') {
    return handlePipelinePlan(request, env);
  }

  if (pathname === '/api/openclaw/run') {
    return handleOpenClaw(request, env, ctx);
  }

  if (pathname === '/api/ai-customize') {
    return handleAiCustomize(request, env, platform);
  }

  if (pathname === '/api/vision/analyze') {
    return handleVisionAnalyze(request, env, platform);
  }

  return jsonResponse(request, env, { error: 'Not found' }, 404);
}

function handleRuntimeReadiness(request: Request, env: RuntimeEnv): Response {
  if (request.method !== 'GET') {
    return methodNotAllowed(request, env, ['GET', 'OPTIONS']);
  }

  const allowedOrigins = (env.SIRINX_ALLOWED_ORIGIN || '*')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
  const allowedOriginReady = allowedOrigins.length > 0 && !allowedOrigins.includes('*');
  const workersAiReady = Boolean(env.AI);
  const aiServerAccessTokenReady = Boolean(env.SIRINX_AI_SERVER_TOKEN);
  const visionProviderReady = Boolean(env.ZHIPU_API_KEY || env.OPENROUTER_API_KEY);
  const openclawServiceReady = Boolean(env.OPENCLAW_SERVICE);
  const databaseReady = Boolean(env.SIRINX_DB);

  const checks = {
    allowedOrigin: {
      ready: allowedOriginReady,
      required: 'Set SIRINX_ALLOWED_ORIGIN to exact production origin(s).',
    },
    workersAiBinding: {
      ready: workersAiReady,
      required: 'Bind Cloudflare Workers AI as env.AI for edge compute inference.',
    },
    aiServerAccessToken: {
      ready: aiServerAccessTokenReady,
      required: 'Set SIRINX_AI_SERVER_TOKEN as a Worker secret before enabling /api/ai/compute.',
    },
    visionProviderSecret: {
      ready: visionProviderReady,
      required: 'Set ZHIPU_API_KEY or OPENROUTER_API_KEY as a Worker secret.',
    },
    openclawServiceBinding: {
      ready: openclawServiceReady,
      required: 'Bind OPENCLAW_SERVICE to the internal OpenClaw execution Worker.',
    },
    databaseBinding: {
      ready: databaseReady,
      required: 'Bind SIRINX_DB through Hyperdrive before production database access.',
    },
  };

  const missing: string[] = [];
  if (!checks.allowedOrigin.ready) missing.push('allowed_origin_exact');
  if (!checks.workersAiBinding.ready) missing.push('workers_ai_binding');
  if (!checks.aiServerAccessToken.ready) missing.push('ai_server_access_token');
  if (!checks.visionProviderSecret.ready) missing.push('vision_provider_secret');
  if (!checks.openclawServiceBinding.ready) missing.push('openclaw_service_binding');
  if (!checks.databaseBinding.ready) missing.push('database_binding');

  return jsonResponse(request, env, {
    service: 'sirinx-api-worker',
    ready: missing.length === 0,
    checks,
    missing,
    timestamp: new Date().toISOString(),
  });
}

function handleWorkersAiServer(request: Request, env: RuntimeEnv): Response {
  if (request.method !== 'GET') {
    return methodNotAllowed(request, env, ['GET', 'OPTIONS']);
  }

  return jsonResponse(request, env, {
    service: 'sirinx-ai-server',
    provider: 'cloudflare-workers-ai',
    binding: 'AI',
    bindingConfigured: Boolean(env.AI),
    accessTokenConfigured: Boolean(env.SIRINX_AI_SERVER_TOKEN),
    defaultModel: workersAiModel(env),
    routes: {
      server: '/api/ai/server',
      compute: '/api/ai/compute',
    },
    note: 'Workers AI runs through Cloudflare account-backed compute. Use dry-run/tests to avoid live model calls.',
    timestamp: new Date().toISOString(),
  });
}

async function handleWorkersAiCompute(request: Request, env: RuntimeEnv): Promise<Response> {
  if (request.method !== 'POST') {
    return methodNotAllowed(request, env, ['POST', 'OPTIONS']);
  }

  const body = await readJsonObject(request);
  if ('error' in body) return jsonResponse(request, env, { success: false, error: body.error }, body.status);

  const extra = Object.keys(body.value).filter((key) => !['prompt', 'model', 'max_tokens', 'temperature'].includes(key));
  if (extra.length > 0) {
    return jsonResponse(request, env, { success: false, error: 'Unsupported fields', extra }, 400);
  }

  const prompt = body.value.prompt;
  if (typeof prompt !== 'string' || !prompt.trim()) {
    return jsonResponse(request, env, { success: false, error: 'prompt must be a non-empty string' }, 400);
  }
  if (prompt.length > MAX_WORKERS_AI_PROMPT_CHARS) {
    return jsonResponse(request, env, {
      success: false,
      error: `prompt must be ${MAX_WORKERS_AI_PROMPT_CHARS} characters or fewer`,
    }, 413);
  }

  if (!env.AI) {
    return jsonResponse(request, env, {
      success: false,
      error: 'workers_ai_binding_unavailable',
      hint: 'Configure "ai": { "binding": "AI" } in wrangler.jsonc and deploy/run with Cloudflare Workers AI enabled.',
    }, 503);
  }

  const accessResponse = await validateAiServerAccess(request, env);
  if (accessResponse) return accessResponse;

  const model = typeof body.value.model === 'string' && body.value.model.trim()
    ? body.value.model.trim()
    : workersAiModel(env);
  if (!model.startsWith('@cf/')) {
    return jsonResponse(request, env, { success: false, error: 'model must be a Cloudflare Workers AI model id starting with @cf/' }, 400);
  }

  const input = workersAiInput(prompt, body.value);
  try {
    const result = await env.AI.run(model, input);
    return jsonResponse(request, env, {
      success: true,
      provider: 'cloudflare-workers-ai',
      model,
      input: {
        promptChars: prompt.length,
        max_tokens: input.max_tokens,
        temperature: input.temperature,
      },
      text: extractWorkersAiText(result),
      result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return jsonResponse(request, env, {
      success: false,
      provider: 'cloudflare-workers-ai',
      model,
      error: error instanceof Error ? error.message : String(error),
    }, 502);
  }
}

async function handleCommandCenter(request: Request, env: RuntimeEnv): Promise<Response> {
  if (request.method === 'GET') {
    return jsonResponse(request, env, {
      availableTools: Array.from(ALLOWED_TOOLS),
      telegramExamples: ['/status', '/rooms', '/pipeline', '/utility', '/commands'],
      runtime: 'worker',
    });
  }

  if (request.method !== 'POST') {
    return methodNotAllowed(request, env, ['GET', 'POST', 'OPTIONS']);
  }

  const body = await readJsonObject(request);
  if ('error' in body) return jsonResponse(request, env, { error: body.error }, body.status);

  const extra = Object.keys(body.value).filter((key) => !['tool', 'telegramText'].includes(key));
  if (extra.length > 0) {
    return jsonResponse(request, env, { error: 'Unsupported fields', extra }, 400);
  }

  const requestedTool = typeof body.value.tool === 'string'
    ? body.value.tool
    : typeof body.value.telegramText === 'string'
      ? toolFromTelegramCommand(body.value.telegramText)
      : null;

  if (!requestedTool || !ALLOWED_TOOLS.has(requestedTool as CommandCenterToolName)) {
    return jsonResponse(request, env, {
      error: 'Unknown or disallowed tool',
      availableTools: Array.from(ALLOWED_TOOLS),
    }, 400);
  }

  return jsonResponse(request, env, {
    tool: requestedTool,
    result: runCommandCenterTool(requestedTool as CommandCenterToolName),
  });
}

async function handlePipelinePlan(request: Request, env: RuntimeEnv): Promise<Response> {
  if (request.method === 'GET') {
    return jsonResponse(request, env, createPipelinePlan());
  }

  if (request.method !== 'POST') {
    return methodNotAllowed(request, env, ['GET', 'POST', 'OPTIONS']);
  }

  const body = await readJsonObject(request);
  if ('error' in body) return jsonResponse(request, env, { error: body.error }, body.status);

  const allowed = new Set([
    'businessName',
    'province',
    'monthlyBillThb',
    'roofAreaSqm',
    'serviceInterest',
    'urgency',
    'source',
  ]);
  const extra = Object.keys(body.value).filter((key) => !allowed.has(key));
  if (extra.length > 0) {
    return jsonResponse(request, env, {
      error: 'Unsupported lead fact fields',
      extra,
      allowed: Array.from(allowed),
    }, 400);
  }

  return jsonResponse(request, env, createPipelinePlan(body.value as LeadFacts));
}

async function handleOpenClaw(
  request: Request,
  env: RuntimeEnv,
  ctx?: ExecutionContext,
): Promise<Response> {
  if (request.method === 'GET') {
    return jsonResponse(request, env, {
      availableCommands: Object.keys(ALLOWED_OPENCLAW_COMMANDS),
      configured: Boolean(env.OPENCLAW_SERVICE),
      runtime: 'worker-service-binding',
      hint: 'Bind OPENCLAW_SERVICE to an internal Worker for production execution. Raw argv/shell/env/cwd fields are rejected.',
    });
  }

  if (request.method !== 'POST') {
    return methodNotAllowed(request, env, ['GET', 'POST', 'OPTIONS']);
  }

  const body = await readJsonObject(request);
  if ('error' in body) return jsonResponse(request, env, { error: body.error }, body.status);

  for (const key of OPENCLAW_BLOCKED_FIELDS) {
    if (key in body.value) {
      return jsonResponse(request, env, { error: `Field "${key}" is not permitted` }, 400);
    }
  }

  const unknownKeys = Object.keys(body.value).filter((key) => key !== 'command');
  if (unknownKeys.length > 0) {
    return jsonResponse(request, env, { error: 'Only "command" is allowed', extra: unknownKeys }, 400);
  }

  const command = body.value.command;
  if (typeof command !== 'string' || !command.trim()) {
    return jsonResponse(request, env, { error: 'command must be a non-empty string' }, 400);
  }

  const args = ALLOWED_OPENCLAW_COMMANDS[command];
  if (!args) {
    return jsonResponse(request, env, {
      command,
      fullCmd: '(not executed - unknown preset)',
      stdout: '',
      stderr: `Unknown command: ${command}`,
      success: false,
      timestamp: new Date().toISOString(),
    }, 400);
  }

  if (!env.OPENCLAW_SERVICE) {
    return jsonResponse(request, env, {
      command,
      fullCmd: '(not executed - service binding unavailable)',
      stdout: '',
      stderr: 'OPENCLAW_SERVICE binding is not configured for this Worker.',
      success: false,
      timestamp: new Date().toISOString(),
      hint: `Allowed presets: ${Object.keys(ALLOWED_OPENCLAW_COMMANDS).join(', ')}`,
    }, 503);
  }

  const serviceRequest = new Request('https://openclaw.internal/run', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ command, args }),
  });
  const serviceResponse = await env.OPENCLAW_SERVICE.fetch(serviceRequest);
  if (ctx) {
    ctx.waitUntil(Promise.resolve());
  }
  return withCors(serviceResponse, request, env);
}

async function handleAiCustomize(
  request: Request,
  env: RuntimeEnv,
  platform: Platform,
): Promise<Response> {
  if (request.method !== 'POST') {
    return methodNotAllowed(request, env, ['POST', 'OPTIONS']);
  }

  const body = await readJsonObject(request);
  if ('error' in body) return jsonResponse(request, env, { error: body.error }, body.status);

  const extra = Object.keys(body.value).filter((key) => !['model', 'prompt'].includes(key));
  if (extra.length > 0) {
    return jsonResponse(request, env, { error: 'Unsupported fields', extra }, 400);
  }

  const prompt = body.value.prompt;
  if (typeof prompt !== 'string' || !prompt.trim()) {
    return jsonResponse(request, env, { error: 'prompt must be a non-empty string' }, 400);
  }

  const model = typeof body.value.model === 'string' ? body.value.model : 'worker-fallback';
  if (env.SIRINX_MODEL_GATEWAY_URL && model !== 'worker-fallback') {
    try {
      const response = await platform.fetch(`${env.SIRINX_MODEL_GATEWAY_URL.replace(/\/+$/, '')}/api/generate`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ model, prompt }),
      });
      if (response.ok) return withCors(response, request, env);
    } catch {
      // Deterministic fallback below keeps the production API available.
    }
  }

  return jsonResponse(request, env, localOfficeFallback(prompt));
}

async function handleVisionAnalyze(
  request: Request,
  env: RuntimeEnv,
  platform: Platform,
): Promise<Response> {
  if (request.method !== 'POST') {
    return methodNotAllowed(request, env, ['POST', 'OPTIONS']);
  }

  const body = await readJsonObject(request);
  if ('error' in body) return jsonResponse(request, env, { success: false, error: body.error }, body.status);

  const type = typeof body.value.type === 'string' ? body.value.type : 'general';
  const images = body.value.images;
  if (!validateImages(images)) {
    return jsonResponse(request, env, {
      success: false,
      error: `"images" must be a non-empty array of up to ${MAX_IMAGES} base64 strings`,
    }, 400);
  }

  const prompt = typeof body.value.prompt === 'string' ? body.value.prompt : '';
  if (type === 'general' && !prompt.trim()) {
    return jsonResponse(request, env, { success: false, error: '"prompt" is required for general vision analysis' }, 400);
  }

  const apiKey = env.ZHIPU_API_KEY || env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return jsonResponse(request, env, {
      success: false,
      error: 'Vision API not configured - set ZHIPU_API_KEY or OPENROUTER_API_KEY as a Worker secret',
    }, 503);
  }

  try {
    const result = await callVisionProvider({
      env,
      platform,
      apiKey,
      type,
      images,
      prompt,
      context: isRecord(body.value.context) ? body.value.context : {},
    });
    return jsonResponse(request, env, result);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return jsonResponse(request, env, { success: false, error: message }, 500);
  }
}

function runCommandCenterTool(tool: CommandCenterToolName): JsonObject {
  switch (tool) {
    case 'status':
      return {
        service: 'sirinx-command-center',
        mode: 'production-worker',
        rooms: COMMAND_CENTER_ROOMS,
        tools: TELEGRAM_COMMANDS.map((item) => item.tool),
        timestamp: new Date().toISOString(),
      };
    case 'rooms':
      return {
        rooms: COMMAND_CENTER_ROOMS,
        rule: '1 node = 1 room. PC uses Ghostclaw HQ. Mac uses @MultiAgentAiCompany_bot.',
      };
    case 'pipeline_plan':
      return createPipelinePlan({
        businessName: 'Telegram Command Center',
        province: 'Phitsanulok',
        serviceInterest: 'ai-warroom',
        source: 'telegram',
        urgency: 'medium',
      });
    case 'utility_manifest':
      return {
        name: 'utility-tool',
        supportedLanguages: ['typescript', 'javascript', 'python', 'rust', 'go', 'shell', 'json', 'markdown', 'yaml'],
        tools: ['language_scan', 'check_plan', 'context_budget'],
      };
    case 'telegram_commands':
      return { commands: TELEGRAM_COMMANDS };
  }
}

function toolFromTelegramCommand(text: string): CommandCenterToolName | null {
  const command = text.trim().split(/\s+/)[0]?.toLowerCase();
  const found = TELEGRAM_COMMANDS.find((item) => item.command === command);
  return found?.tool ?? null;
}

function createPipelinePlan(input: LeadFacts = {}): JsonObject {
  const leadFacts = normalizeLeadFacts(input);
  const totalBudgetTokens = PIPELINE_STAGES.reduce((sum, stage) => sum + stage.budgetTokens, 0);

  return {
    objective: 'restore_sirinx_public_website_and_sales_pipeline',
    leadFacts,
    totalBudgetTokens,
    stages: PIPELINE_STAGES.map((stage) => {
      const missingFacts = stage.requiredFacts.filter((fact) => {
        const value = leadFacts[fact as keyof Required<LeadFacts>];
        return value === 'Unknown business' || value === 'Unknown province' || value === 'unknown' || value === 0;
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
      runtime: 'sirinx-api-worker',
      allowedTools: ['lead_normalizer', 'file_index_lookup', 'agent_router', 'token_budget_gate', 'approval_summary'],
      disallowedInputs: ['raw_secret', 'api_key', 'full_disk_context', 'unfiltered_browser_cookies', 'shell_command'],
    },
  };
}

function normalizeLeadFacts(input: LeadFacts = {}): Required<LeadFacts> {
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

function getAgentProfile(id: string): AgentRuntimeProfile {
  const profile = AGENT_PROFILES[id];
  if (!profile) {
    throw new Error(`Unknown agent id: ${id}`);
  }
  return profile;
}

function localOfficeFallback(prompt: string): JsonObject {
  const lower = prompt.toLowerCase();
  const overrides: Record<string, string> = {};

  const setLayer = (ids: string[], status: string) => {
    for (const id of ids) overrides[id] = status;
  };

  const l1 = [
    'agent-01-pv-monitor',
    'agent-02-battery-monitor',
    'agent-03-weather',
    'agent-04-grid-tariff',
    'agent-05-site-survey',
    'agent-06-customer-usage',
    'agent-07-maintenance-hist',
    'agent-08-contractor-perf',
    'agent-09-fb-group-scanner',
    'agent-10-fb-comment-scanner',
    'agent-11-tiktok-scanner',
    'agent-12-instagram-scanner',
    'agent-13-youtube-scanner',
    'agent-14-property-scanner',
    'agent-15-google-maps',
    'agent-16-multi-bot-coord',
  ];
  const l2 = [
    'agent-17-degradation',
    'agent-18-financial-analysis',
    'agent-19-tax-optimization',
    'agent-20-production-forecast',
    'agent-21-battery-optimizer',
    'agent-22-low-prod-detection',
    'agent-23-cash-flow-health',
    'agent-24-lead-qualification',
    'agent-25-competitor-intel',
  ];
  const l3 = [
    'agent-26-proposal-gen',
    'agent-27-service-recommend',
    'agent-28-job-posting',
    'agent-29-bid-evaluation',
    'agent-30-promotion-engine',
    'agent-31-notification',
    'agent-32-verification',
    'agent-33-content-request',
    'agent-34-email-marketing',
    'agent-43-security',
  ];
  const l4 = [
    'agent-35-orchestrator',
    'agent-36-customer-portal',
    'agent-37-core-dashboard',
    'agent-38-contractor-portal',
    'agent-39-growth-acq',
    'agent-40-decision-router',
    'agent-41-state-manager',
    'agent-42-learning-optim',
  ];
  const l5 = [
    'agent-44-ai-trend-scanner',
    'agent-45-code-evolution',
    'agent-46-benchmark-research',
    'agent-47-integration-disc',
  ];
  const all = [...l1, ...l2, ...l3, ...l4, ...l5, 'chatbot-kai'];

  if (lower.includes('ทุก') && (lower.includes('ทำงาน') || lower.includes('full'))) {
    setLayer(all, 'working');
    return { overrides, message: 'ทุก agent เริ่มทำงานพร้อมกัน' };
  }
  if (lower.includes('พัก') || lower.includes('หยุด') || lower.includes('idle')) {
    setLayer(all, 'idle');
    return { overrides, message: 'ทุก agent หยุดพัก' };
  }
  if (lower.includes('l1') || lower.includes('perception')) {
    setLayer(l1, lower.includes('error') ? 'error' : 'working');
    return { overrides, message: 'L1 Perception กำลังสแกนข้อมูล' };
  }
  if (lower.includes('l2') || lower.includes('วิเคราะห์') || lower.includes('analy')) {
    setLayer(l2, 'analyzing');
    return { overrides, message: 'L2 Analysis กำลังวิเคราะห์ข้อมูล' };
  }
  if (lower.includes('l3') || lower.includes('decision')) {
    setLayer(l3, lower.includes('error') ? 'error' : 'working');
    return { overrides, message: 'L3 Decision กำลังตัดสินใจ' };
  }
  if (lower.includes('l4') || lower.includes('orchestrat') || lower.includes('coord')) {
    setLayer(l4, 'working');
    return { overrides, message: 'L4 Coordination กำลังจัดการ pipeline' };
  }
  if (lower.includes('l5') || lower.includes('research') || lower.includes('rd') || lower.includes('r&d')) {
    setLayer(l5, 'analyzing');
    return { overrides, message: 'L5 R&D Bunker กำลังวิจัย' };
  }
  if (lower.includes('kai')) {
    setLayer(all.filter((id) => id !== 'chatbot-kai'), 'idle');
    overrides['chatbot-kai'] = 'working';
    return { overrides, message: 'Kai กำลังคุยกับลูกค้า' };
  }
  if (lower.includes('gengo') || lower.includes('orchestrator')) {
    overrides['agent-35-orchestrator'] = 'working';
    setLayer(l4.filter((id) => id !== 'agent-35-orchestrator'), 'waiting');
    return { overrides, message: 'Gengo กำลังทำงานหนัก' };
  }
  if (lower.includes('error')) {
    setLayer(l3, 'error');
    return { overrides, message: 'L3 Decision เกิด error' };
  }
  if (lower.includes('success')) {
    setLayer(all, 'success');
    return { overrides, message: 'Mission complete' };
  }

  return { overrides: {}, message: `ไม่เข้าใจคำสั่ง "${sanitizeText(prompt)}" - ลองใช้ preset หรือพิมพ์ชื่อ layer` };
}

async function callVisionProvider(input: {
  env: RuntimeEnv;
  platform: Platform;
  apiKey: string;
  type: string;
  images: string[];
  prompt: string;
  context: JsonObject;
}): Promise<JsonObject> {
  const useOpenRouter = !input.env.ZHIPU_API_KEY && Boolean(input.env.OPENROUTER_API_KEY);
  const baseUrl = useOpenRouter
    ? (input.env.OPENROUTER_BASE_URL ?? 'https://openrouter.ai/api/v1')
    : (input.env.ZHIPU_BASE_URL ?? 'https://open.bigmodel.cn/api/paas/v4');
  const model = useOpenRouter ? 'z-ai/glm-5v-turbo' : 'glm-5v-turbo';
  const analysisPrompt = buildVisionPrompt(input.type, input.prompt, input.context);

  const response = await input.platform.fetch(`${baseUrl.replace(/\/+$/, '')}/chat/completions`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${input.apiKey}`,
      ...(useOpenRouter
        ? {
            'http-referer': 'https://sirinx.ai',
            'x-title': 'SIRINX Solar AI Platform',
          }
        : {}),
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'user',
          content: [
            ...input.images.map((image) => ({
              type: 'image_url',
              image_url: { url: image.startsWith('data:') ? image : `data:image/jpeg;base64,${image}` },
            })),
            { type: 'text', text: analysisPrompt },
          ],
        },
      ],
      max_tokens: 4096,
      temperature: 0.2,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Vision provider ${response.status}: ${errorText.slice(0, 500)}`);
  }

  const data = await response.json() as {
    choices?: Array<{ message?: { content?: string }; finish_reason?: string }>;
    usage?: { prompt_tokens?: number; completion_tokens?: number };
    model?: string;
  };

  const content = data.choices?.[0]?.message?.content ?? '';
  const parsed = parseJsonFromText(content);
  const inputTokens = data.usage?.prompt_tokens ?? 0;
  const outputTokens = data.usage?.completion_tokens ?? 0;

  return {
    success: true,
    type: input.type,
    content,
    parsed,
    model: data.model ?? model,
    inputTokens,
    outputTokens,
    costUsd: estimateVisionCost(model, inputTokens, outputTokens),
  };
}

function buildVisionPrompt(type: string, prompt: string, context: JsonObject): string {
  const contextLines = Object.entries(context)
    .filter(([, value]) => typeof value === 'string' || typeof value === 'number')
    .map(([key, value]) => `${key}: ${String(value)}`)
    .join('\n');

  if (type === 'roof_analysis') {
    return `Analyze rooftop photos for solar potential. Return JSON only with roofArea, orientation, obstructions, roofCondition, solarPotential, recommendations, notes.\n${contextLines}`;
  }
  if (type === 'bill_ocr') {
    return 'Read the electricity bill image. Return JSON only with meterNumber, billingPeriod, consumption, charges, avgCostPerKwh, tariffType, utility, readConfidence.';
  }
  if (type === 'installation_inspection') {
    return `Inspect solar installation photos for QC issues. Return concise JSON with defects, severity, actions, confidence.\n${contextLines}`;
  }
  if (type === 'site_survey') {
    return `Analyze site survey photos. Return concise JSON with access, roof, shading, electrical, safety, nextActions.\n${contextLines}`;
  }
  return prompt;
}

function validateImages(images: unknown): images is string[] {
  return Array.isArray(images) &&
    images.length > 0 &&
    images.length <= MAX_IMAGES &&
    images.every((image) => typeof image === 'string' && image.length > 0 && image.length <= MAX_IMAGE_CHARS);
}

function estimateVisionCost(model: string, inputTokens: number, outputTokens: number): number {
  const rates = model === 'z-ai/glm-5v-turbo'
    ? { input: 1.2, output: 4 }
    : { input: 1.2, output: 4 };
  return (inputTokens * rates.input + outputTokens * rates.output) / 1_000_000;
}

function parseJsonFromText(content: string): unknown {
  try {
    return JSON.parse(content);
  } catch {
    const match = content.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
}

function workersAiModel(env: RuntimeEnv): string {
  return env.SIRINX_WORKERS_AI_MODEL?.trim() || DEFAULT_WORKERS_AI_MODEL;
}

function workersAiInput(prompt: string, body: JsonObject): Record<string, unknown> & {
  prompt: string;
  max_tokens: number;
  temperature: number;
} {
  return {
    prompt: prompt.trim(),
    max_tokens: clampInteger(body.max_tokens, 1, MAX_WORKERS_AI_OUTPUT_TOKENS, 512),
    temperature: clampNumber(body.temperature, 0, 2, 0.2),
  };
}

async function validateAiServerAccess(request: Request, env: RuntimeEnv): Promise<Response | null> {
  const expected = env.SIRINX_AI_SERVER_TOKEN;
  if (!expected) {
    return jsonResponse(request, env, {
      success: false,
      error: 'ai_server_access_token_unavailable',
      hint: 'Set SIRINX_AI_SERVER_TOKEN as a Worker secret before enabling Workers AI compute.',
    }, 503);
  }

  const provided = bearerToken(request) || request.headers.get('x-sirinx-ai-token') || '';
  if (!provided) {
    return jsonResponse(request, env, { success: false, error: 'authorization_required' }, 401);
  }

  if (!(await timingSafeEqual(provided, expected))) {
    return jsonResponse(request, env, { success: false, error: 'authorization_denied' }, 403);
  }

  return null;
}

function bearerToken(request: Request): string {
  const authorization = request.headers.get('authorization') || '';
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() || '';
}

async function timingSafeEqual(a: string, b: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const [aHash, bHash] = await Promise.all([
    crypto.subtle.digest('SHA-256', encoder.encode(a)),
    crypto.subtle.digest('SHA-256', encoder.encode(b)),
  ]);

  const aBytes = new Uint8Array(aHash);
  const bBytes = new Uint8Array(bHash);
  let diff = a.length === b.length ? 0 : 1;
  for (let index = 0; index < aBytes.length; index += 1) {
    diff |= aBytes[index] ^ bBytes[index];
  }
  return diff === 0;
}

function extractWorkersAiText(result: unknown): string {
  if (typeof result === 'string') return result;
  if (!isRecord(result)) return '';

  if (typeof result.response === 'string') return result.response;
  if (typeof result.text === 'string') return result.text;
  if (typeof result.result === 'string') return result.result;

  const choices = result.choices;
  if (Array.isArray(choices)) {
    for (const choice of choices) {
      if (!isRecord(choice)) continue;
      if (typeof choice.text === 'string') return choice.text;
      const message = choice.message;
      if (isRecord(message) && typeof message.content === 'string') return message.content;
    }
  }

  return '';
}

function clampInteger(value: unknown, min: number, max: number, fallback: number): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, Math.round(value)));
}

function clampNumber(value: unknown, min: number, max: number, fallback: number): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, value));
}

type JsonReadResult =
  | { value: JsonObject }
  | { error: string; status: number };

async function readJsonObject(request: Request): Promise<JsonReadResult> {
  const contentLength = Number(request.headers.get('content-length') ?? '0');
  if (contentLength > MAX_JSON_BYTES) {
    return { error: 'JSON body too large', status: 413 };
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return { error: 'Invalid JSON body', status: 400 };
  }

  if (!isRecord(body)) {
    return { error: 'Body must be a JSON object', status: 400 };
  }

  return { value: body };
}

function isRecord(value: unknown): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function sanitizeText(value: unknown): string {
  if (typeof value !== 'string') return '';
  // Remove active-content blocks first, then any remaining tag spans,
  // then stray brackets, then collapse whitespace.
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

function normalizePath(pathname: string): string {
  const trimmed = pathname.replace(/\/+$/, '');
  return trimmed || '/';
}

function methodNotAllowed(request: Request, env: RuntimeEnv, allow: string[]): Response {
  return jsonResponse(request, env, { error: 'Method not allowed' }, 405, {
    allow: allow.join(', '),
  });
}

function jsonResponse(
  request: Request,
  env: RuntimeEnv,
  body: unknown,
  status = 200,
  extraHeaders: HeadersInit = {},
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      ...corsHeaders(request, env),
      ...extraHeaders,
    },
  });
}

function withCors(response: Response, request: Request, env: RuntimeEnv): Response {
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(corsHeaders(request, env))) {
    headers.set(key, value);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function corsHeaders(request: Request, env: RuntimeEnv): Record<string, string> {
  const allowed = (env.SIRINX_ALLOWED_ORIGIN || '*')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
  const requestOrigin = request.headers.get('origin');
  const origin = allowed.includes('*')
    ? '*'
    : requestOrigin && allowed.includes(requestOrigin)
      ? requestOrigin
      : allowed[0] ?? '*';

  return {
    'access-control-allow-origin': origin,
    'access-control-allow-methods': 'GET,POST,OPTIONS',
    'access-control-allow-headers': 'content-type,authorization',
    'vary': 'Origin',
  };
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    return handleRequest(request, env, ctx);
  },
} satisfies ExportedHandler<Env>;
