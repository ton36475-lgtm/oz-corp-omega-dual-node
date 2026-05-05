---
name: SIRINX Multi-Model Critique System
description: Open Core multi-model collaboration system. Draft with cheap models (Qwen/GLM), review with mid-tier (GPT/Sonnet), approve with premium (Claude). Inspired by Microsoft Copilot Cowork Critique but with 47-agent architecture. Supports multi-model routing, critique loops, and quality gates.
triggers:
  - critique
  - multi-model
  - review content
  - quality check
  - draft and review
  - open core
  - model switching
---

# SIRINX Multi-Model Critique System — Skill #32

> **Open Core Advantage:** Microsoft Copilot Cowork ใช้ 2 models (GPT + Claude) — SIRINX ใช้ 5+ models พร้อม 47 agents เฉพาะทาง ด้วยต้นทุน ~1,400 THB/เดือน

---

## Section 1: Concept — Open Core Multi-Model Critique

SIRINX ไม่ lock กับ AI เจ้าเดียว แต่ route งานไปยัง model ที่เหมาะสมที่สุดตามต้นทุนและคุณภาพ

**Critique Pattern:** Draft → Review → Refine
(เหมือน academic peer review แต่ทำโดย AI หลายตัวใน pipeline เดียว)

### หลักการสำคัญ:
- **Draft** — ใช้ Economy model (เร็ว ถูก) สร้าง first draft
- **Review** — ใช้ Standard model ตรวจความถูกต้อง + brand voice
- **Approve** — ใช้ Premium model อนุมัติขั้นสุดท้าย เฉพาะงานสำคัญ
- **5-layer vs 2-layer** — SIRINX รองรับ critique loop สูงสุด 5 ชั้น vs Microsoft 2 ชั้น

---

## Section 2: 3-Tier Model Strategy

| Tier | Models | Usage % | Cost/Month | Role in Critique |
|------|--------|---------|-----------|-----------------|
| **Economy (80%)** | Qwen 2.5, GLM-4, Kimi K2, DeepSeek V3 | 80% | ~1,120 THB | Drafter — bulk content, Thai translation, data extraction |
| **Standard (15%)** | GPT-4o, Claude Sonnet 4.6 | 15% | ~210 THB | Reviewer — analysis, complex reasoning, brand check |
| **Premium (5%)** | Claude Opus 4.6, GPT-4 Turbo | 5% | ~70 THB | Approver — final sign-off, strategy, financial calculations |

**รวม: ~1,400 THB/เดือน สำหรับ 47 agents ทำงาน 24/7**

### Model Selection Logic:
```
Thai language tasks     → Qwen 2.5 / Kimi K2 (native Thai optimization)
Logic / math / finance  → Claude (strongest reasoning)
Code generation         → DeepSeek V3 / Qwen Coder (cost-efficient)
English content         → GPT-4o (fluency + speed)
Final approval          → Claude Opus (highest accuracy)
Image prompts           → Gemini Flash (multimodal)
```

---

## Section 3: Critique Workflows

### Workflow A — Content Critique (SEO / Marketing)
```
1. Qwen 2.5        → drafts Thai content (fast, <0.01 THB/task)
2. Claude Sonnet   → reviews accuracy + SIRINX brand voice
3. Claude Opus     → approves final version + SEO compliance
─────────────────────────────────────────────
Output: Published content with confidence score ≥85%
Agent assignment: Kuranosuke-01 (draft) → Jūnai-17 (review) → Kihei-26 (approve)
```

### Workflow B — Proposal Critique (Sales)
```
1. GPT-4o          → generates proposal structure + SPIN selling framework
2. Claude Sonnet   → reviews financial logic (NPV, IRR, payback calculations)
3. Qwen 2.5        → translates to professional Thai (C-level language)
4. Claude Opus     → final brand + accuracy check
─────────────────────────────────────────────
Output: Executive-ready solar proposal in Thai + English
Agent assignment: Jūrōzaemon-25 (draft) → Kihei-26 (finance) → Yogorō-42 (approve)
```

### Workflow C — Code Critique (Development)
```
1. DeepSeek V3     → writes initial implementation (80% token savings vs Claude)
2. Claude Sonnet   → reviews for bugs, security vulnerabilities, TypeScript types
3. Claude Opus     → reviews architecture decisions + agent layer compliance
─────────────────────────────────────────────
Output: Production-ready code with security clearance
Quality gate: No TS errors, no layer violations (L1→L2→L3→L4 only)
```

### Workflow D — Image Prompt Critique
```
1. Qwen 2.5        → generates initial prompt from Master GEM brand guidelines
2. GPT-4o          → enhances visual descriptions, composition, lighting
3. Gemini Flash    → generates the actual image (multimodal)
4. Claude Sonnet   → reviews brand compliance (colors, logo, tone)
─────────────────────────────────────────────
Output: On-brand visual asset with compliance score
Brand check: Deep Navy #0A2342, Solar Gold #F5A623, Emerald Green #10B981
```

### Workflow E — Decision Critique (Strategy)
```
1. Qwen 2.5   → analyzes from cost-efficiency angle
2. GPT-4o     → analyzes from market/competitive angle
3. DeepSeek   → analyzes from technical feasibility angle
4. [Compare]  → conflicts and agreements flagged automatically
5. Claude Opus → makes final judgment + preserves dissenting opinions
─────────────────────────────────────────────
Output: Decision memo with multi-model consensus score
CEO review: Dissenting opinions preserved for Tony's final call
```

---

## Section 4: Agent-to-Model Assignment

### Layer 1 — Perception (Agents 01–16) → Economy Tier
```
Agents: Kuranosuke(01) → Kin'emon(16)
Models: Qwen 2.5, DeepSeek V3, Kimi K2
Tasks:  Web scraping, Thai content ingestion, price monitoring,
        social media scanning, form data extraction, lead capture
Cost:   <0.001 THB/task average
```

### Layer 2 — Analysis (Agents 17–25) → Standard Tier
```
Agents: Jūnai(17) → Jūrōzaemon(25)
Models: Claude Sonnet 4.6, GPT-4o
Tasks:  Pattern recognition, lead scoring, sentiment analysis,
        competitor benchmarking, ROI preliminary calculations
Cost:   ~0.05 THB/task average
```

### Layer 3 — Decision (Agents 26–34, 43) → Premium Tier
```
Agents: Kihei(26) → Yasoemon(43)
Models: Claude Opus 4.6
Tasks:  Strategy formulation, proposal approval, financial sign-off,
        risk assessment, investment decisions
Cost:   ~0.20 THB/task average (used sparingly — 5% of total)
```

### Layer 4 — Coordination (Agents 35–42) → Standard Tier
```
Agents: Gengo(35-Orchestrator) → Yogorō(42)
Models: Claude Sonnet 4.6, GPT-4o
Tasks:  Cross-agent orchestration, pipeline scheduling,
        output formatting, delivery coordination
Cost:   ~0.05 THB/task average
```

### Layer 5 — R&D (Agents 44–47) → Mixed Tier
```
Agents: Mimura(44), Yokogawa(45), Kayano(46), Terasaka(47)
Models: Economy for research sweep → Premium for breakthrough synthesis
Tasks:  AI trend monitoring (Economy), competitive benchmarks (Standard),
        strategic R&D insights (Premium)
Cost:   Variable — budget-capped at 100 THB/week
```

---

## Section 5: Quality Gates

ทุก critique loop ผ่าน quality gate ก่อน publish:

| Gate | Threshold | Model | Action if Fail |
|------|-----------|-------|----------------|
| **Accuracy Score** | ≥85% | Claude Sonnet | Re-draft with Economy model |
| **Brand Compliance** | ≥90% | Claude Sonnet | Flag for manual review |
| **Revenue Impact** | Measurable | Claude Opus | Escalate to CEO dashboard |
| **Thai Language Quality** | Native-level | Qwen 2.5 + human spot-check | Rephrase loop (max 3x) |
| **Technical Correctness** | Zero critical errors | DeepSeek + Claude | Block deployment |
| **Cost Per Task** | <5 THB | OpenClaw tracker | Switch to lower tier |

### Gate Failure Protocol:
```
Gate fail → retry with next tier up (max 2 retries)
3rd failure → escalate to L3 Decision agent
Critical fail → alert Tony via Telegram bot immediately
```

---

## Section 6: OpenClaw Integration

OpenClaw routes tasks between models automatically:

```yaml
# OpenClaw routing config (~/.openclaw/openclaw.json)
critique_routing:
  rules:
    - condition: task_complexity == "simple"
      model: qwen-2.5-72b
      tier: economy

    - condition: language == "thai" AND task_type == "content"
      model: qwen-2.5-72b
      tier: economy

    - condition: task_type IN ["analysis", "review"]
      model: claude-sonnet-4-6
      tier: standard

    - condition: task_type IN ["approval", "strategy", "financial"]
      model: claude-opus-4-6
      tier: premium

    - condition: speed == "urgent"
      model: gpt-4o  # fastest response time
      tier: standard

  cost_guard:
    daily_limit_thb: 50
    alert_at_percent: 80
    hard_stop_at_percent: 100
```

### OpenClaw Critique Pipeline Command:
```bash
# Run full critique cycle
openclaw critique --workflow=content --input="[file or text]" --output=./output/

# Single-model quick draft
openclaw draft --model=qwen --topic="[topic]"

# Multi-model comparison
openclaw compare --question="[question]" --models=qwen,gpt4o,claude-sonnet
```

---

## Section 7: Telegram Bot Commands

Integration กับ @MultiAgentAiCompany_bot ผ่าน OpenClaw channel:

```
/critique [text]     — รัน full critique cycle (Draft→Review→Approve)
/draft [topic]       — Quick draft ด้วย Economy model (Qwen)
/review [content]    — Review existing content ด้วย Standard model
/approve [content]   — Final approval ด้วย Premium model (Claude Opus)
/compare [question]  — รับคำตอบจาก 3 models แล้ว compare
/cost                — ดูต้นทุน AI วันนี้ vs daily limit (50 THB)
/workflow [A-E]      — เลือก workflow เฉพาะ (A=content, B=sales, C=code, D=image, E=strategy)
/status              — ดูสถานะ critique queue และ quality gate results
```

---

## Section 8: Cost Optimization Rules

### กฎที่ต้องปฏิบัติตามเสมอ:
1. **ห้าม** ใช้ Premium model สำหรับ first draft เด็ดขาด
2. Economy models ต้องครอง 80%+ ของ total tasks ทุกเดือน
3. Premium model ใช้เฉพาะ: final approval, strategy, financial calculations
4. Track cost per task ทุกวัน — optimize routing รายเดือน
5. Target: **<50 THB/วัน** average

### Monthly Cost Breakdown Target:
```
Economy tier (Qwen/GLM/DeepSeek):  ~1,120 THB  (80%)
Standard tier (Sonnet/GPT-4o):       ~210 THB  (15%)
Premium tier (Opus/GPT-4 Turbo):      ~70 THB   (5%)
─────────────────────────────────────────────────
Total target:                       1,400 THB/month
Per-day average:                      ~47 THB/day ✓
```

### Cost Escalation Triggers:
- >80% of daily budget used → switch all non-critical tasks to Economy
- >100% of daily budget → pause Standard/Premium tasks, Economy only
- Monthly overage >10% → audit top-cost task types, optimize routing

---

## Section 9: Competitive Advantage vs Microsoft Copilot Cowork

| Feature | Microsoft Copilot Cowork | SIRINX Open Core Critique |
|---------|--------------------------|--------------------------|
| **Models available** | 2 (GPT-4o + Claude) | 5+ (Qwen, GLM, Kimi, GPT-4o, Sonnet, Opus) |
| **Critique layers** | 2 | Up to 5 |
| **Cost** | $30/user/month (~1,050 THB) | ~1,400 THB/month **total for 47 agents** |
| **Per-agent cost** | $30/agent/month | ~30 THB/agent/month (**35x cheaper**) |
| **Agent specialization** | 1 generic Copilot | 47 Ronin domain specialists |
| **Thai language** | Basic translation | Native (Qwen + Kimi K2 Thai-optimized) |
| **Industry focus** | Generic office tasks | Solar energy B2B specialized |
| **Customization** | Limited templates | Full control via OpenClaw routing |
| **Model switching** | Fixed (GPT→Claude) | Dynamic by task type, cost, speed |
| **Open source** | No | Partial (OpenClaw layer) |
| **On-premise option** | No | Yes (Alibaba Bangkok ap-southeast-7) |
| **Dissenting opinion** | No | Yes — preserved for CEO review |

### สรุปสำหรับ Executive Presentation:
> Microsoft เสียค่าใช้จ่าย $30/user สำหรับ 1 Copilot ที่ทำงานทั่วไป
> SIRINX เสียค่าใช้จ่าย ~1,400 THB/เดือน สำหรับ **47 specialists** ที่เชี่ยวชาญเฉพาะด้าน Solar Energy Thailand
> นี่คือ **Open Core Advantage** — ไม่ใช่แค่ถูกกว่า แต่ดีกว่าสำหรับ use case ของเรา

---

## Section 10: Implementation Checklist

- [ ] เพิ่ม critique routing rules ใน `~/.openclaw/openclaw.json`
- [ ] ติดตั้ง Telegram bot commands `/critique`, `/draft`, `/review`, `/approve`, `/compare`
- [ ] สร้าง cost tracking dashboard ใน CEO WarRoom (`/dashboard`)
- [ ] Map 47 Ronin agents ไปยัง model tiers ใน `src/data/agents.ts`
- [ ] เขียน `CritiqueOrchestrator` class ใน `src/agents/` (extends BaseAgent)
- [ ] เพิ่ม quality gate scoring ใน L2 Analysis agents
- [ ] สร้าง `/api/critique/run` endpoint สำหรับ web UI

---

*Skill #32 — SIRINX AI-WarRoom — Created 2026-04-02*
*Inspired by Microsoft Copilot Cowork "Critique" feature, adapted for SIRINX 47-agent Open Core architecture*
