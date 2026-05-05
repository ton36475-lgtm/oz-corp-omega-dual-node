---
name: sirinx-telegram-integration
description: >
  SIRINX Telegram Integration — Telegram Bot สำหรับ alert, notification, และ agent commands
  CEO alerts, sales notifications, agent status, และ command interface ผ่าน Telegram
  Triggers on: telegram, bot, notification, alert, LINE, messaging, แจ้งเตือน
---

# SIRINX Telegram Integration — v1.0

**Mission:** เชื่อม SIRINX agents เข้ากับ Telegram สำหรับ real-time alerts และ command interface

---

## Bot Commands

```
/status          — System health overview
/agents          — 47 Ronin status summary
/leads           — Today's new leads
/alerts          — Active alerts & warnings
/pipeline        — Sales pipeline snapshot
/deploy <agent>  — Restart specific agent
/ask <question>  — Chat with Kai (SIRINX AI)
```

## Alert Types

| Type | Trigger | Urgency |
|------|---------|---------|
| 🔴 Critical | System down, agent crash | Immediate |
| 🟡 Warning | High token cost, slow latency | < 1 hour |
| 🟢 Info | New lead, proposal sent | Daily digest |
| 💰 Revenue | Deal won, payment received | Immediate |

## Alert Templates

```
🔴 SIRINX ALERT
System: OpenClaw Gateway
Status: DOWN (5 min)
Action: Auto-restart attempted
Time: 02:34 UTC+7

---

💰 NEW DEAL WON
Company: บริษัทโรงงาน ABC
System: 250 kWp
Value: ฿3,750,000
ROI: 28 months
Agent: Tōzaemon #22
```

## Integration Architecture

```
47 Ronin Events (publishEvent)
         ↓
    Alert Router
    /   |   \
Telegram  Line  Slack
   ↓
CEO/Admin Groups
```

## Notification Groups

| Group | Members | Alerts |
|-------|---------|--------|
| @sirinx_ceo | CEO | All critical + revenue |
| @sirinx_sales | Sales team | Leads, proposals, deals |
| @sirinx_tech | Dev team | System errors, deploys |
| @sirinx_ops | Operations | Agent status, maintenance |

## Implementation

```typescript
// Telegram Bot setup
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN)

// Agent event hook
eventBus.subscribe('*', async (event) => {
  if (event.priority === 'critical') {
    await bot.telegram.sendMessage(CEO_CHAT_ID, formatAlert(event))
  }
})
```

## Status

🚧 **Stub** — Architecture defined, ต้องการ Telegram Bot token และ webhook setup
