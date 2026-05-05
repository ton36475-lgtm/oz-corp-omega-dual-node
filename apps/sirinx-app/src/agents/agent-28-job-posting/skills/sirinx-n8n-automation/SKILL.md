---
name: sirinx-n8n-automation
description: >
  SIRINX n8n Automation — Workflow automation ด้วย n8n สำหรับ integrate ทุก SIRINX services
  Connect agents, CRM, social media, notifications, และ external APIs อัตโนมัติ
  Triggers on: n8n, automation, workflow, automate, ระบบอัตโนมัติ, integrate
---

# SIRINX n8n Automation — v1.0

**Mission:** Automate workflows ทั้งหมดของ SIRINX ด้วย n8n self-hosted บน Alibaba Cloud

---

## Core Workflows

### 1. Lead Capture Pipeline
```
FB Lead Ad → Webhook → n8n
              ↓
         Supabase (insert lead)
              ↓
         Sirinx Agent #26 (score)
              ↓
         Salesforce (create lead)
              ↓
         Telegram Alert (sales team)
              ↓
         Line OA (welcome message to prospect)
```

### 2. Daily Agent Report
```
Schedule: 08:00 UTC+7
    ↓
HTTP → sirinx-web /api/agents/status
    ↓
Format report (Claude Haiku)
    ↓
Send → Telegram @sirinx_ceo
    ↓
Save → Supabase daily_reports
```

### 3. Content Publishing
```
Airtable (content calendar)
    ↓
n8n Schedule Trigger
    ↓
Fetch content + media
    ↓
Post to: Facebook API / TikTok API / Line OA
    ↓
Log engagement after 24h
```

### 4. Solar Monitoring Alert
```
Inverter API (every 15min)
    ↓
Compare vs expected output
    ↓
If deviation > 10%:
    → Create Supabase alert
    → Telegram to tech team
    → Agent Kuranosuke #01 analyze
```

## n8n Setup

```yaml
# docker-compose.yml (Alibaba ECS)
services:
  n8n:
    image: n8nio/n8n
    ports: ["5678:5678"]
    environment:
      N8N_BASIC_AUTH_ACTIVE: true
      N8N_HOST: n8n.sirinx.ai
      WEBHOOK_URL: https://n8n.sirinx.ai/
    volumes:
      - n8n_data:/home/node/.n8n
```

## Credentials Needed

| Service | Type | Status |
|---------|------|--------|
| Supabase | Service Key | ✓ |
| Facebook Graph API | Token | Needed |
| Telegram Bot | Token | Needed |
| Line OA | Channel Token | Needed |
| TikTok API | App credentials | Needed |
| Salesforce | Connected App | Needed |

## Status

🚧 **Stub** — Workflows designed, ต้องการ n8n deployment บน ECS
