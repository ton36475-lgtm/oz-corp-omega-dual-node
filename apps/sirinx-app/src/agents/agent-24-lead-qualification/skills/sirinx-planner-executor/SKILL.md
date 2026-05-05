---
name: sirinx-planner-executor
description: "SIRINX Planner-Executor — Task decomposition and execution pattern. ใช้ทุกครั้งที่ต้อง break down complex tasks, วางแผนขั้นตอนงาน, หรือ coordinate multi-step operations ระหว่าง agents"
---

# SIRINX Planner-Executor Pattern

## Purpose
แยก "คิด" กับ "ทำ" ออกจากกัน — Planner วิเคราะห์และแตก task, Executor ลงมือทำ
ป้องกัน agent ทำงานไม่ตรง scope หรือข้าม step

## When to Use
- Task ที่มีมากกว่า 3 ขั้นตอน
- Cross-agent workflow ที่ต้อง orchestrate
- Long-running operations ที่ต้อง checkpoint
- Customer request ที่ซับซ้อน

## Architecture

### Planner Phase
```
Input → Analyze → Decompose → Sequence → Dependencies → Plan
```

1. **Analyze** — เข้าใจ goal และ constraints
2. **Decompose** — แตกเป็น atomic tasks
3. **Sequence** — จัดลำดับ + parallel paths
4. **Dependencies** — ระบุ input/output ของแต่ละ step
5. **Plan** — สร้าง execution plan + rollback strategy

### Executor Phase
```
Plan → Validate → Execute → Verify → Report
```

1. **Validate** — ตรวจ prerequisites
2. **Execute** — ทำ task ตาม plan
3. **Verify** — ตรวจผลลัพธ์ vs expected
4. **Report** — รายงาน status กลับ Planner

## Plan Schema
```json
{
  "planId": "PLN-20260405-001",
  "goal": "Install 100kWp solar system for Factory X",
  "steps": [
    {
      "stepId": 1,
      "action": "site_survey",
      "agent": "kuranosuke-01",
      "input": { "location": "..." },
      "expectedOutput": "survey_report",
      "timeout": "24h",
      "rollback": "notify_sales_team"
    }
  ],
  "checkpoints": [3, 6, 10],
  "deadline": "2026-04-30"
}
```

## Rules
1. Planner ห้ามทำ execution — วางแผนอย่างเดียว
2. Executor ห้ามเปลี่ยน plan — ถ้ามีปัญหาส่งกลับ Planner
3. ทุก step ต้องมี timeout + rollback
4. Checkpoint ทุก 3 steps หรือทุก 30 นาที
5. หาก step fail 2 ครั้ง → escalate to L3

## Integration
- L3 Decision agents ทำหน้าที่ Planner
- L1-L2 agents ทำหน้าที่ Executor
- L4 Coordination ดู overall progress
- L5 Research ช่วย Planner เรื่อง strategy
