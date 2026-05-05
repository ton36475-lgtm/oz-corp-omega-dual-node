---
name: sirinx-pixle-office-ai
description: >
  SIRINX Pixle Office AI — Virtual AI company structure with departments, RBAC, FastAPI manager
  47 Ronin agents organized as departments in a pixel art office environment
  Triggers on: pixel office, pixle office, virtual office, departments, RBAC, agent office
---

# SIRINX Pixle Office AI — v1.0

**Mission:** จัดระเบียบ 47 Ronin agents ให้เป็น virtual company departments พร้อม RBAC และ visual interface

---

## Office Departments

| Department | Floor | Agents | Head |
|-----------|-------|--------|------|
| Perception Lab | 1 | #01-#16 (L1) | Kuranosuke |
| Analysis Center | 2 | #17-#25 (L2) | Jūnai |
| Decision Room | 3 | #26-#34 (L3) | Kihei |
| Command HQ | 4 | #35-#42 (L4) | Gengo (CEO) |
| Research Institute | 5 | #44-#47 (L5) | Mimura |
| Chatbot Reception | G | Kai | Kai |

## RBAC Roles

```typescript
type Role =
  | 'ceo'        // Full access, all agents
  | 'manager'    // L3-L4 agents, reports
  | 'analyst'    // L2 agents, read-only L3
  | 'operator'   // L1 agents, monitoring only
  | 'customer'   // Kai chatbot only
```

## FastAPI Manager

```python
# Python FastAPI for agent orchestration
from fastapi import FastAPI, Depends
from sirinx.auth import require_role

app = FastAPI()

@app.post("/agents/{agent_id}/execute")
async def execute_agent(
    agent_id: str,
    input: AgentInput,
    user = Depends(require_role("manager"))
):
    return await agent_factory.execute(agent_id, input)
```

## Pixel Office Layout (`.pixel-agents/`)

- `sirinx-office-layout.json` — Grid positions สำหรับ all 47 agents
- `sirinx-characters.json` — Agent character definitions, colors, roles

## Component

`apps/sirinx-web/src/components/agents/PixelOfficeView.tsx` — Visual pixel office

## Status
🚧 **Stub** — Layout defined, ต้องการ RBAC middleware และ FastAPI integration
