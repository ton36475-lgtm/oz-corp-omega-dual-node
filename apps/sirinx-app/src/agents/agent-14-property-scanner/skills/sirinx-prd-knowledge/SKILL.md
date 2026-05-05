---
name: sirinx-prd-knowledge
description: >
  SIRINX PRD Knowledge Base — Product Requirements Documents และ technical specs
  ครอบคลุม platform features, agent specs, API contracts, และ business rules
  Triggers on: PRD, product requirements, specs, requirements, feature spec, business rules
---

# SIRINX PRD Knowledge Base — v1.0

**Mission:** เก็บและจัดการ Product Requirements Documents ทั้งหมดของ SIRINX Platform

---

## PRD Index

### Platform PRDs
| Document | Version | Status |
|----------|---------|--------|
| SIRINX-Solar-PRD-v1.0 | 1.0 | Approved |
| Agent DNA System | 2.0 | Active |
| OpenClaw Integration | 1.2 | Active |
| Pixel Office UI | 3.0 | Active |
| Andromeda Dark Neural | 0.5 | Draft |

### Source Files
- `CrossDevice/.../SIRINX-Solar-PRD-v1.0.docx` — Main platform PRD
- `CrossDevice/.../SIRINX_MASTER_CONSOLIDATED_FINAL.md` — Consolidated specs
- `CrossDevice/.../SIRINX_OPENCLAW_MASTER_PROMPT.md` — OpenClaw prompts

## Core Business Rules

### Solar System Rules
1. **Arrhenius Degradation** — แผงเสื่อมสภาพ 0.5%/ปี (temp-adjusted)
2. **ROI Calculation** — `payback = capex / (annual_savings * (1 - 0.005)^year)`
3. **System Sizing** — `kWp = monthly_kwh / (peak_sun_hours * 30 * 0.8)`
4. **Min System Size** — 10kWp (residential), 50kWp (commercial)

### Agent Rules
1. **Layer Order** — L1→L2→L3→L4 ห้ามข้ามชั้น
2. **Event Bus** — ทุก cross-agent communication ผ่าน `publishEvent()`
3. **Singleton** — `AgentFactory.getAgent(id)` สร้าง instance เดียวเท่านั้น
4. **Context Limit** — แต่ละ layer ใช้ token ตาม sirinx-context-engineering

### API Contracts

```typescript
// Lead API
POST /api/leads
Body: { name, phone, email, businessType, electricityBill, systemSize }
Returns: { leadId, score, nextAction }

// Proposal API
POST /api/proposals/generate
Body: { leadId, siteData, systemSpec }
Returns: { proposalId, pdfUrl, roi, paybackYears }

// Agent Execute
POST /api/agents/:id/execute
Body: { input: AgentInput }
Returns: { output: AgentOutput, tokensUsed: number }
```

## Feature Flag Registry

| Flag | Default | Description |
|------|---------|-------------|
| `ENABLE_L5_RESEARCH` | false | Enable Layer 5 research agents |
| `ENABLE_TELEGRAM` | false | Telegram bot integration |
| `ENABLE_ROBOTICS` | false | IoT/Robotics agents |
| `ENABLE_WARROOM_CEO` | true | WARROOM CEO dashboard |

## Status

🚧 **Stub** — Index created, ต้องการ full PRD import จาก CrossDevice documents
