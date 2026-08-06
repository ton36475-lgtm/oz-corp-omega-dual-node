import assert from 'node:assert/strict';
import test from 'node:test';
import { NextRequest } from 'next/server';

// Direct handler tests for the Next.js app API routes. These are the
// dev-only stubs; the production API surface is the Worker. Each test
// calls the exported GET/POST handler directly with a NextRequest.

import { GET as commandCenterStatusGET } from '@/app/api/command-center/status/route';
import { GET as commandCenterToolGET, POST as commandCenterToolPOST } from '@/app/api/command-center/tool/route';
import { GET as pipelineGET, POST as pipelinePOST } from '@/app/api/pipeline/plan/route';
import { POST as aiCustomizePOST } from '@/app/api/ai-customize/route';
import { GET as openclawGET, POST as openclawPOST } from '@/app/api/openclaw/run/route';
import { POST as visionPOST } from '@/app/api/vision/analyze/route';
import { GET as modelsGET } from '@/app/api/models/route';

function req(url: string, init?: RequestInit): NextRequest {
  const nextInit = init as unknown as ConstructorParameters<typeof NextRequest>[1];
  return new NextRequest(`http://localhost:3000${url}`, nextInit);
}
function jsonBody(method: string, body: unknown): RequestInit {
  return { method, headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) };
}

// ── command-center/status ────────────────────────────────────────────────────

test('command-center/status GET returns the static contract', async () => {
  const res = await commandCenterStatusGET();
  assert.equal(res.status, 200);
  const body = await res.json() as Record<string, unknown>;
  assert.equal(body.service, 'oz-corp-command-center');
  assert.equal(body.mode, 'stub');
  assert.ok((body.endpoints as Record<string, string>).tool);
});

// ── command-center/tool ──────────────────────────────────────────────────────

test('command-center/tool GET lists tools; POST runs by tool and telegram text', async () => {
  const getRes = await commandCenterToolGET();
  assert.equal(getRes.status, 200);
  const list = await getRes.json() as { availableTools: string[] };
  assert.ok(list.availableTools.includes('status'));

  const byTool = await commandCenterToolPOST(req('/api/command-center/tool', jsonBody('POST', { tool: 'status' })));
  assert.equal(byTool.status, 200);
  const toolBody = await byTool.json() as Record<string, unknown>;
  assert.equal(toolBody.tool, 'status');

  const byText = await commandCenterToolPOST(req('/api/command-center/tool', jsonBody('POST', { telegramText: '/rooms' })));
  const textBody = await byText.json() as Record<string, unknown>;
  assert.equal(textBody.tool, 'rooms');

  const unknown = await commandCenterToolPOST(req('/api/command-center/tool', jsonBody('POST', { telegramText: '/nope' })));
  assert.equal(unknown.status, 400);

  const badJson = await commandCenterToolPOST(req('/api/command-center/tool', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: '{oops',
  }));
  assert.equal(badJson.status, 400);

  const array = await commandCenterToolPOST(req('/api/command-center/tool', jsonBody('POST', [1, 2])));
  assert.equal(array.status, 400);

  const extra = await commandCenterToolPOST(req('/api/command-center/tool', jsonBody('POST', { tool: 'status', x: 1 })));
  assert.equal(extra.status, 400);
});

// ── pipeline/plan ────────────────────────────────────────────────────────────

test('pipeline/plan GET returns default plan; POST validates and sanitizes', async () => {
  const getRes = await pipelineGET();
  const plan = await getRes.json() as Record<string, unknown>;
  assert.equal(plan.objective, 'restore_sirinx_public_website_and_sales_pipeline');

  const postRes = await pipelinePOST(req('/api/pipeline/plan', jsonBody('POST', {
    businessName: '<script>alert(1)</script>Factory',
    province: 'Phitsanulok',
    monthlyBillThb: 50000,
    roofAreaSqm: 300,
    serviceInterest: 'solar',
    urgency: 'high',
    source: 'web',
  })));
  assert.equal(postRes.status, 200);
  const body = await postRes.json() as { leadFacts: Record<string, unknown>; stages: Array<{ status: string }> };
  assert.equal(body.leadFacts.businessName, 'Factory');
  assert.ok(body.stages.every((s) => s.status === 'ready'));

  const extra = await pipelinePOST(req('/api/pipeline/plan', jsonBody('POST', { businessName: 'x', api_key: 'k' })));
  assert.equal(extra.status, 400);
});

// ── ai-customize ─────────────────────────────────────────────────────────────

test('ai-customize POST rejects unknown model with 400', async () => {
  const res = await aiCustomizePOST(req('/api/ai-customize', jsonBody('POST', { model: 'not-a-model', prompt: 'hi' })));
  assert.equal(res.status, 400);
  const body = await res.json() as { error: string };
  assert.equal(body.error, 'Unknown model');
});

test('ai-customize POST falls back to localFallback when model unreachable', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => { throw new Error('connection refused'); };
  try {
    const res = await aiCustomizePOST(req('/api/ai-customize', jsonBody('POST', { model: 'ollama', prompt: 'activate L1' })));
    assert.equal(res.status, 200);
    const body = await res.json() as { message: string };
    assert.equal(body.message, 'L1 Perception กำลังสแกนข้อมูล 📡');
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('ai-customize POST returns 400 for malformed JSON (regression: was 500)', async () => {
  const res = await aiCustomizePOST(req('/api/ai-customize', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: '{not json',
  }));
  assert.equal(res.status, 400);
});

test('ai-customize POST with missing prompt returns 400 (regression: was 500 crash)', async () => {
  const res = await aiCustomizePOST(req('/api/ai-customize', jsonBody('POST', { model: 'ollama' })));
  assert.equal(res.status, 400);
  const body = await res.json() as { error: string };
  assert.equal(body.error, 'prompt must be a non-empty string');
});

// ── openclaw/run ─────────────────────────────────────────────────────────────

test('openclaw/run GET lists commands; POST rejects blocked fields and unknown commands', async () => {
  const getRes = await openclawGET();
  const list = await getRes.json() as { availableCommands: string[]; configured: boolean };
  assert.ok(list.availableCommands.includes('status'));
  assert.equal(list.configured, false);

  const blocked = await openclawPOST(req('/api/openclaw/run', jsonBody('POST', { command: 'status', argv: ['x'] })));
  assert.equal(blocked.status, 400);
  const blockedBody = await blocked.json() as { error: string };
  assert.equal(blockedBody.error, 'Field "argv" is not permitted');

  // Unknown commands are rejected with 400 even when the executable is unset
  // (allowlist validated before the executable check, mirroring the Worker).
  const unknown = await openclawPOST(req('/api/openclaw/run', jsonBody('POST', { command: 'rm -rf /' })));
  assert.equal(unknown.status, 400);

  const noExe = await openclawPOST(req('/api/openclaw/run', jsonBody('POST', { command: 'status' })));
  assert.equal(noExe.status, 503);
  const noExeBody = await noExe.json() as { success: boolean };
  assert.equal(noExeBody.success, false);
});

// ── vision/analyze ───────────────────────────────────────────────────────────

test('vision/analyze POST validates images and prompt', async () => {
  const emptyImages = await visionPOST(req('/api/vision/analyze', jsonBody('POST', { type: 'general', images: [], prompt: 'x' })));
  assert.equal(emptyImages.status, 400);

  const tooMany = await visionPOST(req('/api/vision/analyze', jsonBody('POST', { type: 'general', images: Array(11).fill('a'), prompt: 'x' })));
  assert.equal(tooMany.status, 400);

  const missingPrompt = await visionPOST(req('/api/vision/analyze', jsonBody('POST', { type: 'general', images: ['a'] })));
  assert.equal(missingPrompt.status, 400);

  const badJson = await visionPOST(req('/api/vision/analyze', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: '{oops',
  }));
  assert.equal(badJson.status, 400);
});

test('vision/analyze POST returns 503 when no provider key configured', async () => {
  const savedZ = process.env.ZHIPU_API_KEY;
  const savedO = process.env.OPENROUTER_API_KEY;
  delete process.env.ZHIPU_API_KEY;
  delete process.env.OPENROUTER_API_KEY;
  try {
    const res = await visionPOST(req('/api/vision/analyze', jsonBody('POST', { type: 'roof_analysis', images: ['a'] })));
    assert.equal(res.status, 503);
  } finally {
    if (savedZ) process.env.ZHIPU_API_KEY = savedZ;
    if (savedO) process.env.OPENROUTER_API_KEY = savedO;
  }
});

test('vision/analyze POST calls the provider and returns parsed JSON', async () => {
  const savedZ = process.env.ZHIPU_API_KEY;
  process.env.ZHIPU_API_KEY = 'z-key';
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response(JSON.stringify({
    choices: [{ message: { content: '{"roofArea":{"total":100,"usable":80,"unit":"sqm"},"orientation":{"direction":"south","tiltAngle":15},"obstructions":[],"roofCondition":{"material":"tile","estimatedAge":3,"strength":"good"},"solarPotential":{"estimatedKwp":18,"annualKwh":25000,"suitabilityScore":88},"recommendations":[],"notes":"ok"}' }, finish_reason: 'stop' }],
    usage: { prompt_tokens: 10, completion_tokens: 8 },
    model: 'glm-5v-turbo',
  }), { status: 200, headers: { 'content-type': 'application/json' } });
  try {
    const res = await visionPOST(req('/api/vision/analyze', jsonBody('POST', { type: 'roof_analysis', images: ['img'] })));
    assert.equal(res.status, 200);
    const body = await res.json() as { success: boolean; parsed: { solarPotential: { estimatedKwp: number } } };
    assert.equal(body.success, true);
    assert.equal(body.parsed.solarPotential.estimatedKwp, 18);
  } finally {
    globalThis.fetch = originalFetch;
    if (savedZ) process.env.ZHIPU_API_KEY = savedZ; else delete process.env.ZHIPU_API_KEY;
  }
});

// ── models ───────────────────────────────────────────────────────────────────

test('models GET returns local offline + cloud provider list without throwing', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => { throw new Error('offline'); };
  try {
    const res = await modelsGET();
    assert.equal(res.status, 200);
    const body = await res.json() as { models: Array<{ type: string; status: string }> };
    const locals = body.models.filter((m) => m.type === 'local');
    assert.equal(locals.length, 4);
    assert.ok(locals.every((m) => m.status === 'offline'));
    const clouds = body.models.filter((m) => m.type === 'cloud');
    assert.equal(clouds.length, 3);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
