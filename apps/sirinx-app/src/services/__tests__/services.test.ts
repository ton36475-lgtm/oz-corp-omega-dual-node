import assert from 'node:assert/strict';
import test from 'node:test';

// Mock-mode service tests: run with NEXT_PUBLIC_SUPABASE_URL /
// NEXT_PUBLIC_SUPABASE_ANON_KEY unset so every service falls back to its
// in-memory mock data. This pins mock/DB shape parity and CRUD behavior.
import { getLeads, getLeadById, createLead, updateLead, deleteLead, getLeadsCount, getLeadsByStatus } from '@/services/leads';
import { getCustomers, getCustomerById, createCustomer, updateCustomer, getTotalMRR } from '@/services/customers';
import { getInstallations, getInstallationById, createInstallation, updateInstallation, getInstallationsByProvince } from '@/services/installations';
import { getContractors, getContractorById, createContractor, updateContractor } from '@/services/contractors';
import { getCampaigns, getCampaignById, createCampaign, updateCampaign, getCampaignSummary } from '@/services/campaigns';
import { getLatestMetric, getMetricHistory, recordMetric, getDashboardKPIs } from '@/services/metrics';
import { getAgentTasks, createAgentTask, updateAgentTask, completeAgentTask, getAgentTaskSummary } from '@/services/agents';
import type { LeadInsert, CustomerInsert, InstallationInsert, ContractorInsert, CampaignInsert, SystemMetricInsert, AgentTaskInsert } from '@/lib/database.types';

// The *Insert types require every column, but the services default most
// columns at runtime (see create* mock branches). The inserts below are cast
// to the Insert type to reflect that runtime contract; this mismatch itself
// is a finding: Insert types should make defaulted columns optional.
const asInsert = <T,>(value: unknown) => value as T;

// ── leads ───────────────────────────────────────────────────────────────────

test('leads: getLeads returns all mock leads in order', async () => {
  const leads = await getLeads();
  assert.equal(leads.length, 5);
  assert.equal(leads[0].status, 'new');
});

test('leads: getLeads filters by status and province', async () => {
  const won = await getLeads({ status: 'won' });
  assert.equal(won.length, 1);
  assert.equal(won[0].company, 'นิคมอุตสาหกรรม ABC');

  const chonburi = await getLeads({ province: 'ชลบุรี' });
  assert.equal(chonburi.length, 1);
  assert.equal(chonburi[0].name, 'คุณสมชาย ใจดี');
});

test('leads: getLeads honors limit', async () => {
  const limited = await getLeads({ limit: 2 });
  assert.equal(limited.length, 2);
});

test('leads: getLeads honors offset pagination (regression: mock ignored offset)', async () => {
  const page2 = await getLeads({ limit: 2, offset: 2 });
  assert.equal(page2.length, 2);
  assert.equal(page2[0].company, 'นิคมอุตสาหกรรม ABC');
  assert.equal(page2[1].company, 'โรงงานน้ำตาลไทย');

  // Offset without limit uses the 50-row default page.
  const offsetOnly = await getLeads({ offset: 3 });
  assert.equal(offsetOnly.length, 2);
  assert.equal(offsetOnly[0].company, 'โรงงานน้ำตาลไทย');
  assert.equal(offsetOnly[1].company, 'ห้างสรรพสินค้า Future Park');
});

test('leads: getLeadById finds existing and null for missing', async () => {
  assert.equal((await getLeadById('1'))?.name, 'คุณสมชาย ใจดี');
  assert.equal(await getLeadById('nope'), null);
});

test('leads: createLead applies defaults and prepends', async () => {
  const created = await createLead(asInsert<LeadInsert>({ name: 'คุณใหม่ ทดสอบ', score: 90, status: 'qualified' }));
  assert.ok(typeof created.id === 'string' && created.id.length > 0);
  assert.equal(created.status, 'qualified');
  assert.equal(created.company, null);
  assert.ok(created.created_at);
  const all = await getLeads();
  assert.equal(all.length, 6);
  assert.equal(all[0].name, 'คุณใหม่ ทดสอบ');
  await deleteLead(created.id);
  assert.equal(await getLeadById(created.id), null);
});

test('leads: updateLead modifies record and bumps updated_at; throws on missing', async () => {
  const updated = await updateLead('1', { status: 'contacted', score: 90 });
  assert.equal(updated.status, 'contacted');
  assert.equal(updated.score, 90);
  assert.ok(updated.updated_at > '2026');
  await assert.rejects(() => updateLead('missing', { status: 'new' }), /Lead not found/);
});

test('leads: deleteLead removes and is silent on missing', async () => {
  await deleteLead('5');
  assert.equal((await getLeads()).length, 4);
  await deleteLead('does-not-exist'); // no throw
});

test('leads: getLeadsCount and getLeadsByStatus aggregate', async () => {
  assert.equal(await getLeadsCount(), 4);
  const byStatus = await getLeadsByStatus();
  // lead 1 was flipped to contacted earlier; lead 5 was deleted
  assert.deepEqual(byStatus, { new: 0, contacted: 1, qualified: 1, proposal: 1, won: 1, lost: 0 });
});

// ── customers ───────────────────────────────────────────────────────────────

test('customers: getCustomers returns all, getById finds/misses', async () => {
  assert.equal((await getCustomers()).length, 2);
  assert.equal((await getCustomerById('c1'))?.company, 'นิคมอุตสาหกรรม ABC');
  assert.equal(await getCustomerById('missing'), null);
});

test('customers: createCustomer applies defaults', async () => {
  const created = await createCustomer(asInsert<CustomerInsert>({ name: 'คุณใหม่ ลูกค้า' }));
  assert.equal(created.mrr, 0);
  assert.equal(created.status, 'active');
  assert.equal(created.plan, null);
  assert.ok(created.created_at);
  assert.equal((await getCustomers()).length, 3);
  await updateCustomer(created.id, { status: 'churned' });
  assert.equal((await getCustomerById(created.id))?.status, 'churned');
});

test('customers: updateCustomer throws on missing; getTotalMRR sums active', async () => {
  await assert.rejects(() => updateCustomer('missing', { mrr: 1 }), /Customer not found/);
  assert.equal(await getTotalMRR(), 45000 + 28000 + 0);
});

// ── installations ───────────────────────────────────────────────────────────

test('installations: getInstallations filters by status', async () => {
  assert.equal((await getInstallations()).length, 2);
  const monitoring = await getInstallations('monitoring');
  assert.equal(monitoring.length, 1);
  assert.equal(monitoring[0].inverter_type, 'Sungrow SG250HX');
});

test('installations: CRUD and province counts', async () => {
  assert.equal((await getInstallationById('i1'))?.system_size_kw, 500);
  assert.equal(await getInstallationById('missing'), null);

  const created = await createInstallation(asInsert<InstallationInsert>({ province: 'เชียงใหม่', system_size_kw: 100 }));
  assert.equal(created.status, 'planned');
  assert.equal((await getInstallations()).length, 3);

  await assert.rejects(() => updateInstallation('missing', { status: 'completed' }), /Installation not found/);

  const byProvince = await getInstallationsByProvince();
  assert.equal(byProvince['ระยอง'], 1);
  assert.equal(byProvince['เชียงใหม่'], 1);
});

// ── contractors ─────────────────────────────────────────────────────────────

test('contractors: getContractors filters by province membership', async () => {
  assert.equal((await getContractors()).length, 3);
  const chonburi = await getContractors('ชลบุรี');
  assert.equal(chonburi.length, 1);
  assert.equal(chonburi[0].company, 'Solar Tech Thailand');
  assert.equal((await getContractors('เชียงใหม่')).length, 1);
});

test('contractors: CRUD defaults and missing-id errors', async () => {
  assert.equal((await getContractorById('con1'))?.rating, 4.8);
  assert.equal(await getContractorById('missing'), null);

  const created = await createContractor(asInsert<ContractorInsert>({ name: 'คุณใหม่ ช่าง' }));
  assert.equal(created.rating, 0);
  assert.equal(created.jobs_completed, 0);
  assert.equal(created.status, 'active');
  assert.equal((await getContractors()).length, 4);

  await assert.rejects(() => updateContractor('missing', { rating: 5 }), /Contractor not found/);
});

// ── campaigns ───────────────────────────────────────────────────────────────

test('campaigns: getCampaigns filters by status', async () => {
  assert.equal((await getCampaigns()).length, 3);
  const ended = await getCampaigns('ended');
  assert.equal(ended.length, 1);
  assert.equal(ended[0].name, 'Google Ads Solar EPC');
});

test('campaigns: CRUD and summary aggregation', async () => {
  assert.equal((await getCampaignById('camp1'))?.budget, 50000);
  assert.equal(await getCampaignById('missing'), null);

  const created = await createCampaign(asInsert<CampaignInsert>({ name: 'Test Campaign', type: 'facebook' }));
  assert.equal(created.status, 'draft');
  assert.equal(created.spent, 0);
  assert.equal((await getCampaigns()).length, 4);

  await assert.rejects(() => updateCampaign('missing', { spent: 1 }), /Campaign not found/);

  const summary = await getCampaignSummary();
  assert.equal(summary.totalBudget, 50000 + 80000 + 30000 + 0);
  assert.equal(summary.totalSpent, 32000 + 80000 + 8000);
  assert.equal(summary.totalLeads, 28 + 45 + 9);
  assert.ok(Math.abs(summary.avgROI - (4.2 + 6.8 + 2.1) / 3) < 1e-9);
});

// ── metrics ─────────────────────────────────────────────────────────────────

test('metrics: getLatestMetric finds by name, null for missing', async () => {
  assert.equal((await getLatestMetric('total_leads_month'))?.metric_value, 127);
  assert.equal(await getLatestMetric('not_a_metric'), null);
});

test('metrics: getMetricHistory filters by name', async () => {
  const history = await getMetricHistory('revenue_month');
  assert.equal(history.length, 1);
  assert.equal(history[0].metric_value, 3200000);
});

test('metrics: recordMetric pushes with defaults', async () => {
  const recorded = await recordMetric(asInsert<SystemMetricInsert>({ metric_name: 'test_metric', metric_value: 42 }));
  assert.equal(recorded.metric_unit, null);
  assert.equal(recorded.agent_name, null);
  assert.ok(recorded.recorded_at);
  assert.equal((await getMetricHistory('test_metric')).length, 1);
});

test('metrics: getDashboardKPIs returns the fixture snapshot', async () => {
  const kpis = await getDashboardKPIs();
  assert.deepEqual(kpis, {
    totalLeads: 127,
    revenueMonth: 3200000,
    activeProjects: 8,
    conversionRate: 24.3,
    agentsOnline: 42,
  });
});

// ── agent tasks ─────────────────────────────────────────────────────────────

test('agents: getAgentTasks filters by status, layer, name, and limit', async () => {
  assert.equal((await getAgentTasks()).length, 4);
  assert.equal((await getAgentTasks({ status: 'in_progress' })).length, 2);
  assert.equal((await getAgentTasks({ agentLayer: 'decision' })).length, 1);
  assert.equal((await getAgentTasks({ agentName: 'Kuranosuke-01' })).length, 1);
  assert.equal((await getAgentTasks({ limit: 1 })).length, 1);
});

test('agents: createAgentTask applies defaults', async () => {
  const created = await createAgentTask(asInsert<AgentTaskInsert>({ agent_name: 'Kihei-26', task_type: 'generate_proposal' }));
  assert.equal(created.status, 'pending');
  assert.equal(created.priority, 5);
  assert.equal(created.revenue_impact, 0);
  assert.equal((await getAgentTasks()).length, 5);
});

test('agents: updateAgentTask throws on missing; completeAgentTask sets completion', async () => {
  await assert.rejects(() => updateAgentTask('missing', { status: 'failed' }), /Task not found/);

  const completed = await completeAgentTask('t2', { leads_scored: 12 });
  assert.equal(completed.status, 'completed');
  assert.equal(completed.result?.leads_scored, 12);
  assert.ok(completed.completed_at);
});

test('agents: getAgentTaskSummary aggregates statuses', async () => {
  const summary = await getAgentTaskSummary();
  assert.deepEqual(summary, { pending: 1, in_progress: 1, completed: 3, failed: 0 });
});
