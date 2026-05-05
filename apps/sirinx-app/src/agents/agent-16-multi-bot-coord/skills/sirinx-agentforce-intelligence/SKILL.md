---
name: sirinx-agentforce-intelligence
description: >
  SIRINX Agentforce Intelligence — Salesforce Agentforce integration สำหรับ CRM automation
  Agent-powered CRM, lead management, และ sales automation ด้วย Salesforce ecosystem
  Triggers on: agentforce, salesforce, CRM, sales automation, lead management, SF
---

# SIRINX Agentforce Intelligence — v1.0

**Mission:** เชื่อม SIRINX 47 Ronin agents เข้ากับ Salesforce Agentforce สำหรับ enterprise CRM

---

## Agentforce Integration

### Salesforce Objects Mapped
| SIRINX | Salesforce Object | Sync |
|--------|-----------------|------|
| Lead | Lead | Bidirectional |
| Proposal | Opportunity | Bidirectional |
| Customer | Account + Contact | Bidirectional |
| Installation | Case | One-way → SF |
| Agent Event | Task/Activity | One-way → SF |

### Agent Actions → Salesforce

```apex
// Auto-created when Kihei #26 scores a lead
new Lead(
  Company = businessName,
  Phone = phoneNumber,
  SIRINX_Score__c = intentScore,
  Solar_System_Size__c = estimatedkWp,
  Monthly_Electric_Bill__c = electricityBill
)
```

### Agentforce Prompts

**Lead Qualification Prompt**
```
Context: {lead_info}
Task: ประเมิน lead นี้ตาม SIRINX ICP criteria
Output: score (0-100), tier (A/B/C), recommended action
```

**Follow-up Automation**
- Day 0: Initial contact + ROI calculator link
- Day 3: Case study relevant to their industry
- Day 7: Free site survey offer
- Day 14: Limited-time promotion

## Data Flow

```
SIRINX Agents
      ↓
Supabase (leads table)
      ↓
n8n Automation (sirinx-n8n-automation)
      ↓
Salesforce API
      ↓
Agentforce Actions
      ↓
Sales Team Notification
```

## Metrics Tracked

| Metric | Target | Current |
|--------|--------|---------|
| Lead Response Time | < 2 hours | - |
| SQL Conversion | > 20% | - |
| Proposal Win Rate | > 35% | - |
| Sales Cycle | < 60 days | - |

## Status

🚧 **Stub** — Integration architecture defined, ต้องการ Salesforce connected app credentials
