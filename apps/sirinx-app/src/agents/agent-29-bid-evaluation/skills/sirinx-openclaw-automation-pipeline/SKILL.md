---
name: sirinx-openclaw-automation-pipeline
description: >
  SIRINX OpenClaw Automation Pipeline — CI/CD และ deployment automation สำหรับ OpenClaw runtime
  Auto-deploy agents, version management, rollback, health checks, และ monitoring
  Triggers on: openclaw pipeline, CI/CD, deploy, automation pipeline, deployment, release
---

# SIRINX OpenClaw Automation Pipeline — v1.0

**Mission:** Automate deployment และ lifecycle management ของ OpenClaw AI runtime และ 47 agents

## Pipeline Stages

```
Code Push (GitHub)
       ↓
GitHub Actions CI
  ├── TypeScript compile (tsc --noEmit)
  ├── ESLint check
  ├── Unit tests (Jest)
  └── Build (next build)
       ↓
Docker Build + Push (Alibaba ACR)
       ↓
Staging Deploy (ECS staging)
       ↓
Smoke Tests (agent health checks)
       ↓
Production Deploy (ECS prod) ← Manual approval
       ↓
Health Monitor (30 min)
       ↓
✓ Deploy complete / ✗ Auto-rollback
```

## OpenClaw CLI Commands

```bash
# Deploy specific agent
openclaw deploy --agent kuranosuke --version 1.2.0

# Health check all agents
openclaw health --all

# Scale agent instances
openclaw scale --agent layer1 --replicas 3

# View logs
openclaw logs --agent gengo --tail 100

# Rollback
openclaw rollback --to 1.1.0
```

## Environment Config

```env
# Environments
OPENCLAW_ENV=production|staging|dev
OPENCLAW_GATEWAY_URL=https://openclaw.sirinx.ai
OPENCLAW_API_KEY=sk-...

# Alibaba Cloud
ALICLOUD_REGION=ap-southeast-7
ALICLOUD_ECS_ID=...
ALICLOUD_ACR_REGISTRY=registry.ap-southeast-7.aliyuncs.com
```

## Monitoring Alerts

| Event | Action |
|-------|--------|
| Deploy failed | Slack + Telegram alert |
| Health check failed | Auto-rollback |
| High CPU (>85%) | Scale out ECS |
| High cost (>฿500/day) | Alert + throttle |

## Status
🚧 **Stub** — Pipeline designed, ต้องการ GitHub Actions workflows
