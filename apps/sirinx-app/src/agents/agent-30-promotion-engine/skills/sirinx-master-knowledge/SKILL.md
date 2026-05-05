---
name: sirinx-master-knowledge
description: >
  SIRINX Master Knowledge — Knowledge base รวมทุกอย่างของ SIRINX platform
  Quick reference สำหรับ architecture, agents, business rules, stack, และ decisions
  Triggers on: sirinx knowledge, master knowledge, reference, ข้อมูล sirinx, architecture overview
---

# SIRINX Master Knowledge — v1.0

**Mission:** Single source of truth สำหรับ SIRINX Solar Energy AI Platform

---

## Platform Identity

| | |
|--|--|
| **Company** | SIRINX Solar Energy |
| **Product** | B2B Solar AI Platform (Thailand) |
| **Version** | v10.0 "47 Ronin" |
| **Stack** | Next.js 15 + TypeScript + Tailwind + Supabase |
| **AI Runtime** | OpenClaw (Alibaba Cloud Bangkok) |
| **Agent Count** | 47 + Kai chatbot |
| **Design System** | Glassmorphism, Deep Navy, Solar Gold, Sarabun |

## Architecture Quick Reference

```
Users → sirinx-web (Next.js 15)
              ↓
    OpenClaw Gateway (:3002)
              ↓
    47 Ronin Agents (L1-L5)
              ↓
    Supabase (PostgreSQL + Realtime)
              ↓
    Alibaba Cloud Bangkok (ECS + OSS + CDN)
```

## Agent Layer Summary
- **L1 (16 agents)** — Perception: data collection, scanning
- **L2 (9 agents)** — Analysis: processing, scoring
- **L3 (10 agents)** — Decision: strategy, proposals
- **L4 (8 agents)** — Coordination: orchestration
- **L5 (4 agents)** — Research: AI trends, benchmarks
- **Kai** — Customer-facing chatbot (Chain of Thought)

## Key File Locations

| Component | Path |
|-----------|------|
| Agent Types | `apps/sirinx-web/src/agents/types.ts` |
| Agent Definitions | `apps/sirinx-web/src/agents/agent-definitions.ts` |
| Agent Factory | `apps/sirinx-web/src/agents/agent-factory.ts` |
| Base Agent | `apps/sirinx-web/src/agents/base-agent.ts` |
| Event Bus | `apps/sirinx-web/src/agents/event-bus.ts` |
| Pixel Office | `apps/sirinx-web/src/components/agents/PixelOfficeView.tsx` |
| Supabase Schema | `apps/sirinx-web/supabase/migrations/` |

## Business Rules

1. **Arrhenius** — แผงเสื่อม 0.5%/ปี (temperature-adjusted)
2. **ROI Calc** — payback = capex / annual_savings
3. **Min System** — 10kWp residential, 50kWp commercial
4. **ICP** — ค่าไฟ > 50,000/เดือน OR system > 50kWp
5. **Layer Order** — L1 → L2 → L3 → L4 (strict)
6. **Event Bus** — ทุก cross-agent comms ผ่าน publishEvent()

## ICP Segments

| Segment | Electricity Bill | ROI |
|---------|-----------------|-----|
| Large Factory | > 500K/เดือน | 24 เดือน |
| Medium Factory | 100-500K/เดือน | 30 เดือน |
| Warehouse | 50-200K/เดือน | 36 เดือน |
| Hotel | > 200K/เดือน | 28 เดือน |

## Status

✅ **Active** — Master reference document, อัปเดตตาม development
