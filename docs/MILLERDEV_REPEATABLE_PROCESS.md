# MillerDev Repeatable Process

กระบวนการนี้ใช้ซ้ำได้ทุกครั้งเมื่อต้องให้ AI agent ทำงานแบบ MillerDev: อ่านบริบทก่อน, คุม token, แยก agent/role/sub-pipeline, ใช้ MCP tool call อย่างมีแผน, แล้วตรวจผลก่อนส่งมอบ

## 0. Master Trigger

ใช้ prompt นี้เพื่อเริ่มงานกับ AI ทุกตัว:

```text
[MILLERDEV-BRAIN][MCP-TOOL-CALL][4-PILLAR-PLAN]

Act as a MillerDev AI Developer.
Read context first, infer the real goal, plan with 4 pillars, use MCP/tool calls deliberately, implement focused production-grade changes, verify, and report clearly.

Do not guess. Do not refactor unrelated code. Do not delete user work. Do not expose secrets.
```

เวอร์ชันไทย:

```text
[MILLERDEV-BRAIN][MCP-TOOL-CALL][4-PILLAR-PLAN]

ให้คิดแบบ MillerDev AI Developer:
อ่านบริบทก่อน เข้าใจเป้าหมายจริง วางแผน 4 pillars เรียก tool เท่าที่จำเป็น แก้แบบ production-grade ตรวจผล แล้วสรุปชัดเจน

ห้ามเดาสุ่ม ห้าม refactor มั่ว ห้ามลบงาน user ห้ามใส่ secret
```

## 1. Context Intake

เป้าหมาย: ให้ AI รู้ว่ากำลังทำงานกับอะไร ก่อนลงมือ

Checklist:

- อ่าน `README.md`
- อ่าน docs ที่เกี่ยวข้องใน `docs/`
- อ่าน skill ที่เกี่ยวข้องใน `skills/`
- อ่านหน้า/ไฟล์เป้าหมายใน `apps/sirinx-app/src/`
- ตรวจ git status เพื่อไม่ทับงานเดิม
- จำกัด scope เฉพาะไฟล์ที่จำเป็นและเข้าถึงได้

ตัวอย่าง command:

```sh
git status --short
rg -n "MillerDev|prompt pack|MCP|agent|token|character" docs skills apps/sirinx-app/src -S
sed -n '1,220p' docs/MILLERDEV_BRAIN_COMMAND.md
sed -n '1,260p' docs/MILLERDEV_MCP_4_PILLAR_PLAN.md
```

Output ที่ต้องได้:

- facts
- constraints
- target files
- unknowns

## 2. MillerDev Brain Command

ไฟล์หลัก:

```text
docs/MILLERDEV_BRAIN_COMMAND.md
```

หน้าที่:

- สั่งให้ AI ทำงานแบบ senior AI developer
- อ่านก่อนแก้
- เข้าใจเป้าหมายจริง
- ใช้ pattern เดิมของ codebase
- แก้เฉพาะจุด
- ตรวจผล
- รายงาน risk

One-line trigger:

```text
Use MillerDev Brain Command: read context first, infer the real goal, implement focused production-grade code, verify it, and report clearly.
```

## 3. Prompt Pack Standard

ไฟล์หลัก:

```text
docs/MILLERDEV_PROMPT_PACK.md
skills/sirinx-master-gem/SKILL.md
```

ใช้เมื่อ:

- สร้าง image prompt
- สร้าง campaign
- เขียน SEO/AEO copy
- ทำ deck, social ads, visual concept
- คุม brand SIRINX

Prompt mode สำคัญ:

```text
[VISUAL][PROMPT-PACK][BRAND-LOCKED]
[PROMPT-PACK][VISUAL][FULL]
[COPY][BRAND-LOCKED]
[CAMPAIGN][FULL][SALES-FIRST]
```

Output ทุก prompt pack ควรมี:

- `prompt_id`
- `category`
- `target_page` หรือ `target_asset`
- `platform`
- `aspect_ratio`
- `prompt`
- `negative_guidance`
- `brand_notes`

## 4. MCP 4-Pillar Plan

ไฟล์หลัก:

```text
docs/MILLERDEV_MCP_4_PILLAR_PLAN.md
```

### Pillar 1: Context Intelligence

อ่าน repo/docs/files ก่อน

Tool intent:

```json
{
  "pillar": "context_intelligence",
  "tools": ["repo_search", "file_read", "git_status", "knowledge_lookup"]
}
```

### Pillar 2: Plan And Route

แตกงาน, เลือก agent/tool, ตั้ง done criteria

Tool intent:

```json
{
  "pillar": "plan_and_route",
  "tools": ["task_planner", "agent_router", "kanban_create_or_update"]
}
```

### Pillar 3: Execute Tool Calls

แก้ไฟล์หรือเรียก automation อย่างมีขอบเขต

Tool intent:

```json
{
  "pillar": "execute_tool_calls",
  "tools": ["file_edit", "safe_command", "mcp_call", "n8n_trigger", "llm_route"]
}
```

### Pillar 4: Verify, Memory, Report

ตรวจ, เขียน memory เฉพาะข้อมูล durable, รายงานผล

Tool intent:

```json
{
  "pillar": "verify_memory_report",
  "tools": ["typecheck", "test", "lint", "runtime_check", "memory_write", "final_report"]
}
```

## 5. Token, Agent, Role, Sub-Pipeline

ไฟล์หลัก:

```text
docs/SIRINX_TOKEN_AGENT_PIPELINE.md
apps/sirinx-app/src/lib/sirinx-pipeline.ts
apps/sirinx-app/src/app/api/pipeline/plan/route.ts
docs/HERMES_THCLAW_UTILITY_TOOL.md
```

หลักการ:

- ไม่ส่ง raw context ทั้งหมดเข้า LLM
- ทำ file index ก่อน
- ให้ agent ขอเฉพาะไฟล์ที่ต้องใช้
- สรุป context เป็น structured facts
- แยก token budget ตาม stage

Token budget:

| Stage | Budget |
|---|---:|
| Lead intake | 1.5k |
| Site intelligence | 3k |
| ROI proposal | 4k |
| Human approval | 800 |
| Memory write | 500 |

Agent-role map:

| Role | Agents |
|---|---|
| Intake | `agent-24-lead-qualification`, `chatbot-kai` |
| Research | `agent-05-site-survey`, `agent-15-google-maps`, `agent-25-competitor-intel` |
| Financial | `agent-18-financial-analysis`, `agent-19-tax-optimization` |
| Proposal | `agent-26-proposal-gen`, `agent-30-promotion-engine` |
| Orchestration | `agent-35-orchestrator`, `agent-40-decision-router`, `agent-41-state-manager` |
| Verification | `agent-32-verification`, `agent-43-security` |

Repeatable n8n flow:

```text
Webhook/Form Trigger
  -> Normalize Lead
  -> File Index / Allowed Context Lookup
  -> Token Budget Gate
  -> Enrich Site Context
  -> Score Opportunity
  -> Generate ROI Snapshot
  -> Generate Proposal Draft
  -> Human Approval
  -> Send LINE/Email
  -> Write CRM + Memory
```

Real API:

```sh
curl -s http://localhost:3002/api/pipeline/plan
curl -s http://localhost:3002/api/pipeline/plan \
  -H 'Content-Type: application/json' \
  -d '{"businessName":"Example Factory","province":"Phitsanulok","monthlyBillThb":250000,"roofAreaSqm":1800,"serviceInterest":"solar","urgency":"high","source":"website"}'
```

Hermes/thCLAW utility tool:

```sh
pnpm -C services/hermes-agent check
python3 -m py_compile services/openclaw-worker/orchestrator.py
python3 services/openclaw-worker/orchestrator.py --utility check_plan
python3 services/openclaw-worker/orchestrator.py --mode batch --tasks 1
```

Telegram command center bridge:

```sh
bash scripts/setup_telegram_command_center.sh
node services/telegram-command-bot/index.mjs --dry-run
curl -s http://127.0.0.1:3002/api/command-center/tool \
  -H 'Content-Type: application/json' \
  -d '{"telegramText":"/status"}'
```

## 6. Character Creator Layer

ไฟล์หลัก:

```text
apps/sirinx-app/src/data/agent-dna-data.ts
apps/sirinx-app/src/components/agents/PixelOfficeView.tsx
apps/sirinx-app/src/app/agents/page.tsx
```

แนวคิด:

- แต่ละ agent คือ game character
- `codename` = identity
- `layer` / `role` = class
- `mission` = quest
- `personality` = behavior style
- `strengths` / `limitations` = stats
- `tokenBudget` = mana budget
- `triggerConditions` = activation rules
- `outputFormat` = required output

ใช้ซ้ำอย่างไร:

```text
When creating or routing work, first select the character/agent whose DNA matches the task. Use its tokenBudget, triggers, mission, and outputFormat as the execution contract.
```

หน้า UI:

```text
/agents
```

มี 2 mode:

- DNA Command Center
- Pixel Office

## 7. Website Restore Process

เป้าหมาย: bring `sirinx.co` back with real design

ไฟล์หลัก:

```text
apps/sirinx-app/src/app/page.tsx
apps/sirinx-app/src/app/globals.css
```

หลัก design:

- Thai-first B2B solar copy
- Real energy image in hero
- Clear CTA: ROI calculator and solar page
- Service sections: Solar EPC, ESS, EV, AI WarRoom
- Token-managed pipeline section
- Agent character preview linking to `/agents`
- Contact block

Verification commands:

```sh
pnpm -C apps/sirinx-app build
pnpm -C apps/sirinx-app typecheck
pnpm -C apps/sirinx-app dev
```

Preview URL:

```text
http://localhost:3002
```

## 8. Repeatable Delivery Report

ทุกครั้งที่จบงาน ให้ตอบรูปแบบนี้:

```text
Changed:
- file/path
- file/path

Verified:
- command: result
- command: result

Reusable commands:
- prompt/command

Remaining risk:
- anything not verified
```

## 9. Safety Rules

- อ่านก่อนแก้
- ห้ามลบงาน user
- ห้ามแตะไฟล์นอก scope
- ห้ามใส่ secret ใน docs/code/log
- ใช้ local files เฉพาะที่เข้าถึงได้และเกี่ยวข้อง
- ถ้าต้องต่อเครื่องอื่น ให้ใช้ allowed file index ก่อน ไม่ ingest ทั้งเครื่อง
- ถ้าต้องใช้ network หรือ deploy ให้ขอ approval ก่อน
