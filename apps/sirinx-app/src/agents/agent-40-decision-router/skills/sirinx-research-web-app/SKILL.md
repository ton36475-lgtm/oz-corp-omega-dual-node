---
name: sirinx-research-web-app
description: >
  SIRINX Research Web App — Architecture และ implementation ของ research-focused web application
  Layer 5 research agents UI, competitor analysis dashboard, technology radar
  Triggers on: research app, research web, layer 5, technology radar, research dashboard
---

# SIRINX Research Web App — v1.0

**Mission:** Web application สำหรับ Layer 5 research agents (Mimura/Yokogawa/Kayano/Terasaka)

## Architecture

```
/research — Research Hub
├── /trends       ← Mimura #44: AI trend scanning
├── /codebase     ← Yokogawa #45: Code evolution
├── /benchmarks   ← Kayano #46: Performance benchmarks
└── /integrations ← Terasaka #47: Integration discovery
```

## Key Features

### AI Trend Dashboard (Mimura #44)
- GitHub trending repos (solar, AI, agents)
- HuggingFace model releases
- arXiv papers summary
- Weekly digest email

### Code Evolution (Yokogawa #45)
- Dependency health scores
- Security vulnerabilities
- Best practice violations
- Upgrade proposals (PR-ready)

### Benchmark Center (Kayano #46)
- Lighthouse scores tracking
- API latency (p50/p95/p99)
- DB query performance
- Competitor comparison table

### Integration Discovery (Terasaka #47)
- Available APIs catalog (PromptPay, Sungrow, LINE…)
- MCP server registry
- Integration complexity scores
- Auto-generated connection code

## Tech Stack

```typescript
// Shared with sirinx-web
Next.js 15 + TypeScript + Tailwind
Supabase (research_* tables)
Claude API for analysis
```

## Status
🚧 **Stub** — Routes planned, ต้องการ L5 agent implementations
