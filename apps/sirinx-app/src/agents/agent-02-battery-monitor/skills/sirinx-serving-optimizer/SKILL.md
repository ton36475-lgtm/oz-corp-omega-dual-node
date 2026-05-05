---
name: sirinx-serving-optimizer
description: "SIRINX Serving Optimizer — Model serving optimization และ latency reduction. ใช้ทุกครั้งที่ต้อง optimize LLM inference, ลด cost, เลือก model, หรือ tune performance ของ agent system"
---

# SIRINX Serving Optimizer — LLM Performance Engine

## Purpose
Optimize การใช้ LLM ของทุก agent — ลด cost, ลด latency, เพิ่ม quality
ทุกบาทที่ใช้กับ AI ต้องคุ้มค่า

## When to Use
- Agent response ช้าเกินไป (>5s)
- Token cost เกิน budget
- ต้องเลือก model สำหรับ task ใหม่
- Optimize prompt ให้สั้นลงแต่ quality เท่าเดิม
- Scale up/down ตาม workload

## Model Selection Matrix

### Available Models
| Model | Speed | Quality | Cost | Best For |
|-------|-------|---------|------|----------|
| Gemma 4 26B (Primary) | Medium | High | Free (local) | General tasks, Thai text |
| Gemma 3 4B | Fast | Medium | Free (local) | Simple queries, classification |
| Claude (API) | Medium | Highest | $$ | Complex reasoning, code |
| GPT-4o (API) | Medium | High | $$ | Vision, multimodal |

### Task-to-Model Routing
```
Simple query/classification → Gemma 3 4B (local)
Thai content generation → Gemma 4 26B (local)
Complex analysis/decision → Claude API
Image analysis → GPT-4o API
Fallback → Next cheaper model
```

## Optimization Techniques

### 1. Prompt Compression
- ลด system prompt ให้สั้นที่สุด
- ใช้ structured output (JSON) ลด verbose
- Cache common prompts
- Template interpolation แทน full prompt

### 2. Context Window Management
- Agent L1: 4K tokens max → เน้น concise
- Agent L2: 8K tokens → structured analysis
- Agent L3: 16K tokens → full context allowed
- Agent L4: 32K tokens → orchestration needs
- Agent L5: 128K tokens → research deep-dive

### 3. Batching & Caching
- Batch similar requests (same prompt template)
- Cache identical queries (TTL: 15 min)
- Pre-compute common analysis (daily stats)
- Warm model ก่อน peak hours

### 4. Cost Controls
```
Daily budget: 500 THB
Per-agent limits:
  L1: 50 THB/day (high volume, low cost)
  L2: 80 THB/day
  L3: 120 THB/day
  L4: 150 THB/day
  L5: 100 THB/day

Alert at 80% budget
Auto-throttle at 95%
Emergency override by CEO only
```

## Performance Metrics
- **P50 latency:** Target < 2s
- **P99 latency:** Target < 10s
- **Token efficiency:** Output quality / tokens used
- **Cost per task:** THB per completed task
- **Cache hit rate:** Target > 40%

## Rules
1. Local models first (Gemma) → API fallback
2. ห้ามใช้ 128K context ถ้าไม่จำเป็น
3. ทุก API call ต้อง log cost
4. Weekly cost optimization review
5. Auto-switch model ถ้า primary offline
