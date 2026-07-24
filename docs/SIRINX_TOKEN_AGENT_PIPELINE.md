# SIRINX Token, Agent, Role, Sub-Pipeline Plan

This is the operating structure for bringing `sirinx.co` back as a real public website backed by controlled AI operations.

## Objective

Restore the website as a credible B2B energy front door, then connect it to AI-assisted sales operations without uncontrolled token spend.

## Token Control

| Stage | Token Budget | Control |
|---|---:|---|
| Lead intake | 1.5k | Extract only contact, business type, province, monthly bill, urgency |
| Site intelligence | 3k | Summarize roof, tariff, province, usage, constraints |
| ROI proposal | 4k | Use structured facts only, no raw chat history |
| Human approval | 800 | Short risk summary and final action |
| Memory write | 500 | Store durable facts only |

## Agent And Role Map

| Role | Agents | Responsibility |
|---|---|---|
| Intake | `agent-24-lead-qualification`, `chatbot-kai` | Capture and normalize lead data |
| Research | `agent-05-site-survey`, `agent-15-google-maps`, `agent-25-competitor-intel` | Enrich location, roof, competitor, and market context |
| Financial | `agent-18-financial-analysis`, `agent-19-tax-optimization` | ROI, BOI, tax and payback logic |
| Proposal | `agent-26-proposal-gen`, `agent-30-promotion-engine` | Customer-ready copy, deck, offer, visuals |
| Orchestration | `agent-35-orchestrator`, `agent-40-decision-router`, `agent-41-state-manager` | Route work, manage state, decide fallback |
| Verification | `agent-32-verification`, `agent-43-security` | Check facts, safety, secrets, and approval gate |

## Character Creator Layer

The character system comes from:

```text
apps/sirinx-app/src/data/agent-dna-data.ts
apps/sirinx-app/src/components/agents/PixelOfficeView.tsx
apps/sirinx-app/src/app/agents/page.tsx
```

Use each agent DNA profile as a game-style character sheet:

- `codename` = character identity
- `layer` and `role` = class/job
- `mission` = quest objective
- `personality` = behavior style
- `strengths` and `limitations` = build stats
- `tokenBudget` = mana/energy budget
- `triggerConditions` = activation rules
- `outputFormat` = required skill output

When wiring new files or machines, do not ingest everything into the prompt. First create a compact file index, then let the right agent request only the exact file paths it needs.

## n8n Sub-Pipeline Shape

```text
Webhook/Form Trigger
  -> Normalize Lead
  -> File Index / Allowed Context Lookup
  -> Token Budget Gate
  -> Enrich Site Context
  -> Score Opportunity
  -> Generate ROI Snapshot
  -> Generate Proposal Draft
  -> Human Approval
  -> Send LINE/Email
  -> Write CRM + Memory
```

## MCP Tool-Call Contract

Live local endpoint:

```text
GET  /api/pipeline/plan
POST /api/pipeline/plan
```

Allowed POST body fields:

```json
{
  "businessName": "Example Factory",
  "province": "Phitsanulok",
  "monthlyBillThb": 250000,
  "roofAreaSqm": 1800,
  "serviceInterest": "solar",
  "urgency": "high",
  "source": "website"
}
```

```json
{
  "objective": "restore_sirinx_public_website_and_sales_pipeline",
  "token_budget": {
    "lead_intake": 1500,
    "site_intelligence": 3000,
    "proposal": 4000,
    "approval": 800,
    "memory": 500
  },
  "roles": [
    "intake",
    "research",
    "financial",
    "proposal",
    "orchestration",
    "verification"
  ],
  "required_outputs": [
    "public_website",
    "agent_character_sheet",
    "lead_payload",
    "roi_snapshot",
    "proposal_draft",
    "approval_summary",
    "memory_note"
  ]
}
```

## Done Criteria

- Public homepage explains SIRINX in one screen.
- CTA routes to ROI calculator and solar pages.
- Design uses SIRINX brand colors, Thai-first copy, and real energy imagery.
- AI operations are described as a controlled pipeline, not a vague agent swarm.
- Token budgets exist before n8n/MCP automation is wired.
