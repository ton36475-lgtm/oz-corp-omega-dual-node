---
name: sirinx-llm-switcher
description: >
  SIRINX LLM Switcher — Dynamic model routing ระหว่าง Claude, GPT-4, Qwen, DeepSeek, Gemini
  เลือก model ตาม task type, cost, latency, และ context length
  Triggers on: switch model, llm router, model selection, เปลี่ยน model, เลือก AI
---

# SIRINX LLM Switcher — v1.0

**Mission:** Route AI requests ไปยัง optimal model ตาม task complexity, cost, และ availability

---

## Supported Models

| Model | Provider | Use Case | Cost Tier |
|-------|----------|----------|-----------|
| claude-opus-4-6 | Anthropic | Complex reasoning, strategy | $$$ |
| claude-sonnet-4-6 | Anthropic | General purpose, coding | $$ |
| claude-haiku-4-5 | Anthropic | Fast responses, summarization | $ |
| gpt-4o | OpenAI | Vision, complex tasks | $$$ |
| qwen-max | Alibaba | Thai language, low latency | $$ |
| deepseek-r1 | DeepSeek | Math, analysis, reasoning | $ |
| gemini-1.5-pro | Google | Long context, multimodal | $$ |

## Routing Rules

```typescript
// Task-based routing
type TaskType =
  | 'strategy'      → claude-opus-4-6
  | 'coding'        → claude-sonnet-4-6
  | 'thai-content'  → qwen-max
  | 'math-analysis' → deepseek-r1
  | 'fast-reply'    → claude-haiku-4-5
  | 'vision'        → gpt-4o
  | 'long-doc'      → gemini-1.5-pro
```

## API Endpoint

```
POST /api/models/route
Body: { task: string, priority: 'cost' | 'quality' | 'speed' }
Returns: { model: string, provider: string, estimatedCost: number }
```

## Integration

- `src/app/api/models/route.ts` — Current model API
- `src/app/api/ai-customize/route.ts` — AI customization
- OpenClaw Gateway — proxies to selected model

## Fallback Chain

```
Primary → Failover → Emergency
claude-sonnet → claude-haiku → qwen-max
```

## Status

🚧 **Stub** — Model list defined, ต้องการ routing logic และ cost tracking implementation
