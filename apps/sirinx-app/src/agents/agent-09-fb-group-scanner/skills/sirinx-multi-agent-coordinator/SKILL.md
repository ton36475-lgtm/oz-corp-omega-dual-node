---
name: sirinx-multi-agent-coordinator
description: "SIRINX Multi-Agent Coordinator — Cross-agent orchestration, task routing, conflict resolution. ใช้ทุกครั้งที่ต้อง coordinate หลาย agents, route tasks, resolve conflicts, หรือ manage parallel workflows"
---

# SIRINX Multi-Agent Coordinator — Orchestration Hub

## Purpose
จัดการ 47 agents ให้ทำงานร่วมกันราบรื่น — route tasks ไปถูก agent,
resolve conflicts เมื่อหลาย agents ต้องการ resource เดียวกัน

## When to Use
- Task ที่ต้องใช้หลาย agents ร่วมกัน
- Agent conflict (ต้องการ resource เดียวกัน)
- Load balancing ระหว่าง agents ใน layer เดียว
- Workflow ที่ cross หลาย layers
- Emergency rerouting เมื่อ agent down

## Routing Rules

### Layer Hierarchy (ห้ามข้าม!)
```
L1 Perception → L2 Analysis → L3 Decision → L4 Coordination
     ↓               ↓              ↓              ↓
   Collect        Process        Decide         Execute
```

### Task Router
```
Input Task → Classify → Match Agent → Check Availability → Assign
                                            ↓ (if busy)
                                      Queue / Redirect
```

### Agent Selection Criteria
1. **Capability Match** — agent มี skill ที่ต้องการ
2. **Current Load** — เลือก agent ที่ว่างก่อน
3. **Past Performance** — agent ที่ทำ task คล้ายๆ ได้ดี
4. **Cost** — เลือก option ที่ถูกกว่า (ถ้า quality เท่ากัน)

## Common Workflows

### Lead Processing Pipeline
```
FB Scan (L1 #01) → Lead Score (L2 #17) → Qualify (L3 #26) → Assign (L4 #35)
                                                    ↓
                                              Auto-respond (Kai)
```

### Content Creation Pipeline
```
Research (L5 #44) → Draft (L2 #20) → Review (L3 #30) → Post (L4 #38)
                                         ↓ (fail)
                                    Revise + Re-review
```

### Customer Response Pipeline
```
Receive (Kai) → Classify (L2 #17) → Route:
  - Technical → L2 #19 (analysis) → L3 #28 (solution)
  - Pricing → L3 #26 (proposal) → L4 #35 (send)
  - Complaint → L3 #30 (review) → L4 #35 (escalate to Tony)
```

## Conflict Resolution

### Resource Conflicts
```
Scenario: 2 agents need Ollama at the same time
Resolution:
  1. Priority-based (higher layer wins)
  2. Queue lower priority (max wait 30s)
  3. If both same layer → first-come-first-served
  4. If urgent → use API model as fallback
```

### Output Conflicts
```
Scenario: 2 agents produce contradictory analysis
Resolution:
  1. Send both to L3 Decision agent
  2. L3 evaluates evidence from both
  3. Pick winner + document reasoning
  4. Feed back to losing agent for learning
```

## Parallel Execution Rules
- Max 5 agents active simultaneously
- Shared resources (LLM, DB) need locks
- Independent tasks can run in parallel
- Dependent tasks must be sequential
- All parallel tasks need join point

## Communication Protocol
```
Agent-to-Agent Message:
{
  "from": "kuranosuke-01",
  "to": "junai-17",
  "type": "task_handoff",
  "payload": { ... },
  "priority": "normal",
  "deadline": "2026-04-05T10:00:00+07:00",
  "replyTo": "kuranosuke-01"
}
```

## Monitoring Dashboard
- Active agents count + status
- Task queue depth per layer
- Average wait time
- Conflict count (daily)
- Throughput (tasks/hour)

## Rules
1. ห้ามข้ามชั้น agent — L1→L2→L3→L4 เท่านั้น
2. ทุก task handoff ต้อง log
3. Max queue depth: 50 tasks (ถ้าเกิน → alert)
4. Agent offline > 5 min → auto-reroute tasks
5. Daily coordination report to CEO Dashboard
