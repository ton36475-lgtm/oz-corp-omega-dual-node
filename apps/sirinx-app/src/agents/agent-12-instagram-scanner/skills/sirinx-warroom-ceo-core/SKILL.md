---
name: sirinx-warroom-ceo-core
description: >
  SIRINX WARROOM CEO Core — CEO-level command interface และ strategic dashboard
  Full system control, cross-department visibility, strategic AI advisor
  Triggers on: warroom, CEO core, CEO dashboard, command center, ผู้บริหาร, สั่งการ
---

# SIRINX WARROOM CEO Core — v1.0

**Mission:** CEO-level command interface สำหรับควบคุมและตัดสินใจด้วย AI support ทั้งระบบ SIRINX

## WARROOM Capabilities

### Command Interface
```
/warroom status          — Full system overview
/warroom brief           — Morning briefing
/warroom leads           — Sales pipeline
/warroom deploy <system> — Deploy system
/warroom alert <level>   — Set alert threshold
/warroom ask <question>  — Strategic AI advisor
```

### Strategic AI Advisor
- Context: ข้อมูล real-time จากทุก agent layer
- Model: claude-opus-4-6 (สำหรับ CEO-level decisions)
- Persona: "Strategic advisor สำหรับ B2B Solar CEO"
- Memory: 30-day context window

### Integrated Views

| View | Route | Data Source |
|------|-------|-------------|
| Executive Summary | `/warroom` | All agents |
| Sales Command | `/warroom/sales` | L3 agents |
| Tech Operations | `/warroom/ops` | L1+L4 agents |
| Financial | `/warroom/finance` | Finance agent |
| Marketing | `/warroom/marketing` | L1 social agents |

### WARROOM + Andromeda Integration
```
WARROOM CEO Core (UI layer)
          ↓
Andromeda Dark Neural Fabric (intelligence layer)
          ↓
Creator Core  →  Coder Core  →  Operator Core
          ↓
47 Ronin Agents (execution layer)
```

## Access Control

```typescript
// RBAC: CEO role only
middleware: require_role('ceo')
// MFA required for destructive actions
// Audit log: all CEO commands logged to Supabase
```

## Status
🚧 **Stub** — Interface designed, ต้องการ real-time data connections + Andromeda integration
