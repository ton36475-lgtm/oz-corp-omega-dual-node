---
name: sirinx-memory-architect
description: "SIRINX Memory Architect — Long-term memory management และ context persistence สำหรับ agent system. ใช้ทุกครั้งที่ต้องจัดการ memory, บันทึก learned patterns, หรือ share context ระหว่าง agents"
---

# SIRINX Memory Architect — Persistent Knowledge Layer

## Purpose
จัดการ long-term memory ของ 47 Ronin agents — ให้ agents จำสิ่งที่เรียนรู้ได้
แก้ปัญหา "agents ลืมทุกอย่างทุก session"

## When to Use
- Agent เรียนรู้ pattern ใหม่ที่ควรจำ
- ต้องการ share context ระหว่าง agents
- Customer interaction history ที่ต้อง persist
- Workflow results ที่เป็น baseline สำหรับอนาคต
- Error patterns ที่ต้องจำเพื่อหลีกเลี่ยง

## Memory Types

### 1. Episodic Memory (เหตุการณ์)
- Customer interactions
- Campaign results
- System incidents
- Agent decisions + outcomes
```json
{
  "type": "episodic",
  "timestamp": "2026-04-05T10:30:00+07:00",
  "agent": "junai-17",
  "event": "lead_scored",
  "context": { "leadId": "L-001", "score": 85 },
  "outcome": "converted_in_7_days"
}
```

### 2. Semantic Memory (ความรู้)
- Product knowledge updates
- Market insights
- Competitive intelligence
- Best practices

### 3. Procedural Memory (วิธีทำ)
- Successful workflow patterns
- Optimal agent routing
- Content templates ที่ work
- Pricing strategies ที่ได้ผล

## Storage Architecture
```
Supabase Tables:
├── agent_memory_episodic    (timestamped events)
├── agent_memory_semantic    (knowledge base)
├── agent_memory_procedural  (how-to patterns)
├── agent_context_shared     (cross-agent context)
└── agent_memory_index       (fast lookup)
```

## Memory Operations
```
Memory.store(type, data, ttl) → memoryId
Memory.recall(query, agentId, limit) → memories[]
Memory.forget(memoryId) → void  // explicit garbage collection
Memory.consolidate() → merge similar memories
Memory.share(memoryId, targetAgents[]) → void
```

## Retention Policy
| Type | TTL | Consolidation |
|------|-----|---------------|
| Episodic | 90 days | Monthly merge |
| Semantic | Permanent | Quarterly review |
| Procedural | Permanent | When superseded |
| Shared Context | 24 hours | Auto-cleanup |

## Rules
1. Memory write ต้องมี relevance score > 0.7
2. Duplicate detection ก่อน store
3. PII ต้อง encrypt ก่อน store
4. Memory budget: 10MB per agent per month
5. Consolidation ทุกสัปดาห์โดย L4
