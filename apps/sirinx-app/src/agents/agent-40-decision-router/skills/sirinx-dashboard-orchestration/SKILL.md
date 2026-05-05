---
name: sirinx-dashboard-orchestration
description: >
  SIRINX Dashboard Orchestration — CEO/WARROOM real-time dashboard สำหรับ monitor ทุก system
  KPIs, agent status, sales pipeline, system health ในหน้าเดียว
  Triggers on: dashboard, warroom, CEO view, KPI, monitor, real-time, ดู status, overview
---

# SIRINX Dashboard Orchestration — v1.0

**Mission:** สร้าง unified WARROOM dashboard สำหรับ CEO ดู real-time status ทุก system ของ SIRINX

---

## Dashboard Architecture

### WARROOM CEO View

```
┌─────────────────────────────────────────────────────────────┐
│  SIRINX WARROOM                               [2026-04-01]  │
├──────────────┬──────────────┬──────────────┬────────────────┤
│  SYSTEM      │  SALES       │  AGENTS      │  ALERTS        │
│  ● OpenClaw  │  Pipeline: ฿│  47/47 ✓     │  ⚠ 2 warnings  │
│  ● Supabase  │  Leads: 42  │  L1: 16 ✓    │                 │
│  ● Web App   │  MRR: ฿XXX  │  L2: 9 ✓     │                 │
└──────────────┴──────────────┴──────────────┴────────────────┘
```

## Panels

### 1. System Health
- OpenClaw Gateway: UP/DOWN + latency
- Supabase: connections, query time
- sirinx-web: uptime, requests/min
- Alibaba Cloud: ECS CPU/RAM

### 2. Sales Pipeline
- Total leads (today/week/month)
- Pipeline value (฿)
- Conversion funnel: Lead → SQL → Proposal → Won
- Top opportunities

### 3. Agent Monitor (47 Ronin)
- Layer status grid (L1-L5)
- Last run timestamps
- Error rates
- Token usage (cost)

### 4. Marketing Performance
- FB Ads: Impressions, CPL, Leads
- YouTube: Views, Watch time
- TikTok: Views, Followers
- Website: Sessions, Leads

### 5. Financial Overview
- Revenue (MRR/ARR)
- Cost breakdown (AI, Cloud, Labor)
- Solar installations (this month)
- Collections status

## Tech Stack

```typescript
// Real-time via Supabase Realtime
const subscription = supabase
  .channel('warroom')
  .on('postgres_changes', { event: '*', schema: 'public' }, handler)
  .subscribe()

// Refresh intervals
const INTERVALS = {
  systemHealth: 10_000,  // 10s
  agentStatus: 30_000,   // 30s
  salesPipeline: 60_000, // 1m
  financials: 300_000,   // 5m
}
```

## Route

`/warroom` — CEO-only, protected by Supabase RLS (RBAC: `ceo` role)

## Status

🚧 **Stub** — UI mockup complete (PixelOfficeView exists), ต้องการ real-time data connections
