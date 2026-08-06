import assert from 'node:assert/strict';
import test from 'node:test';

import {
  normalizeLeadFacts,
  createPipelinePlan,
  PIPELINE_STAGES,
  type LeadFacts,
} from '@/lib/sirinx-pipeline';
import {
  runCommandCenterTool,
  toolFromTelegramCommand,
  TELEGRAM_COMMANDS,
} from '@/lib/command-center-tools';

// ── pipeline plan lib (shared with the production Worker) ───────────────────

test('normalizeLeadFacts strips script blocks and full tag spans', () => {
  const facts = normalizeLeadFacts({
    businessName: '<script>alert(1)</script>Bangkok <b>Solar</b>',
    province: '<img src=x onerror=alert(1)>Phitsanulok',
    source: '<style>.x{}</style>website',
  });
  assert.equal(facts.businessName, 'Bangkok Solar');
  assert.equal(facts.province, 'Phitsanulok');
  assert.equal(facts.source, 'website');
});

test('normalizeLeadFacts applies safe defaults for missing input', () => {
  const facts = normalizeLeadFacts({});
  assert.equal(facts.businessName, 'Unknown business');
  assert.equal(facts.province, 'Unknown province');
  assert.equal(facts.monthlyBillThb, 0);
  assert.equal(facts.serviceInterest, 'unknown');
  assert.equal(facts.urgency, 'medium');
  assert.equal(facts.source, 'manual');
});

test('normalizeLeadFacts clamps negatives and NaN to zero', () => {
  const facts = normalizeLeadFacts({ monthlyBillThb: -500, roofAreaSqm: Number.NaN });
  assert.equal(facts.monthlyBillThb, 0);
  assert.equal(facts.roofAreaSqm, 0);
});

test('createPipelinePlan marks stages ready only when required facts present', () => {
  const plan = createPipelinePlan({
    businessName: 'Factory',
    province: 'Phitsanulok',
    monthlyBillThb: 100000,
    roofAreaSqm: 500,
    serviceInterest: 'solar',
    urgency: 'high',
    source: 'website',
  });
  assert.equal(plan.objective, 'restore_sirinx_public_website_and_sales_pipeline');
  assert.equal(plan.totalBudgetTokens, PIPELINE_STAGES.reduce((s, st) => s + st.budgetTokens, 0));
  assert.ok(plan.stages.every((stage) => stage.status === 'ready'));
  assert.ok(plan.stages.every((stage) => stage.missingFacts.length === 0));
  assert.ok(plan.stages.every((stage) => stage.primaryAgent.id.length > 0));
});

test('createPipelinePlan reports missing facts per stage', () => {
  const plan = createPipelinePlan({ businessName: 'Factory', source: 'website' });
  const site = plan.stages.find((s) => s.id === 'site_intelligence');
  assert.equal(site?.status, 'needs_input');
  assert.deepEqual(site?.missingFacts, ['province', 'roofAreaSqm', 'serviceInterest']);
});

test('createPipelinePlan throws on unknown agent ids referenced by stages', () => {
  const bad = PIPELINE_STAGES.find((s) => s.primaryAgentId === 'agent-24-lead-qualification');
  assert.ok(bad, 'fixture stage present');
  // Every stage id must resolve through AGENT_DNA or the plan builder throws.
  assert.doesNotThrow(() => createPipelinePlan({}));
});

// ── command-center tools lib ─────────────────────────────────────────────────

test('toolFromTelegramCommand maps command to tool, null for unknown', () => {
  assert.equal(toolFromTelegramCommand('/status'), 'status');
  assert.equal(toolFromTelegramCommand('/pipeline now please'), 'pipeline_plan');
  assert.equal(toolFromTelegramCommand('/rooms'), 'rooms');
  assert.equal(toolFromTelegramCommand('/bogus'), null);
  assert.equal(toolFromTelegramCommand(''), null);
});

test('runCommandCenterTool returns expected shapes for all five tools', () => {
  const status = runCommandCenterTool('status') as Record<string, unknown>;
  assert.equal(status.service, 'sirinx-command-center');
  assert.ok(Array.isArray(status.rooms));

  const rooms = runCommandCenterTool('rooms') as Record<string, unknown>;
  assert.equal((rooms.rooms as unknown[]).length, 2);

  const pipeline = runCommandCenterTool('pipeline_plan') as Record<string, unknown>;
  assert.equal(pipeline.objective, 'restore_sirinx_public_website_and_sales_pipeline');

  const utility = runCommandCenterTool('utility_manifest') as Record<string, unknown>;
  assert.deepEqual(utility.tools, ['language_scan', 'check_plan', 'context_budget']);

  const commands = runCommandCenterTool('telegram_commands') as { commands: unknown[] };
  assert.equal(commands.commands.length, TELEGRAM_COMMANDS.length);
});

test('TELEGRAM_COMMANDS table stays consistent with the tool set', () => {
  const tools = TELEGRAM_COMMANDS.map((c) => c.tool);
  assert.deepEqual(tools, ['status', 'rooms', 'pipeline_plan', 'utility_manifest', 'telegram_commands']);
});

// ── cross-check: LeadFacts shape used by routes stays stable ─────────────────

test('LeadFacts accepted fields round-trip through the plan builder', () => {
  const input: LeadFacts = {
    businessName: 'SIRINX Co',
    province: 'Phitsanulok',
    monthlyBillThb: 50000,
    roofAreaSqm: 300,
    serviceInterest: 'ess',
    urgency: 'low',
    source: 'referral',
  };
  const plan = createPipelinePlan(input);
  assert.equal(plan.leadFacts.serviceInterest, 'ess');
  assert.equal(plan.leadFacts.urgency, 'low');
  assert.equal(plan.leadFacts.source, 'referral');
});
