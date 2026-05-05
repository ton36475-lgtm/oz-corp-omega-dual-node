---
name: sirinx-context-engineering
description: >
  SIRINX Context Engineering — Token optimization, context window management, prompt compression
  สำหรับ 47 Ronin agents ให้ทำงาน efficient ภายใต้ token limits
  Triggers on: context, tokens, prompt engineering, compress, optimize context, token limit
---

# SIRINX Context Engineering — v1.0

**Mission:** จัดการ context window อย่าง efficient เพื่อให้ 47 Ronin agents ทำงานได้ภายใต้ token constraints

---

## Core Techniques

### 1. Context Compression
- ย่อ agent history เหลือ key facts เท่านั้น
- ใช้ structured JSON แทน prose สำหรับ data passing
- Rolling window: เก็บ 10 recent turns, archive ที่เหลือ

### 2. Prompt Caching
- Cache system prompts สำหรับ agents ที่เรียกบ่อย (L1 layer)
- Anthropic prompt caching: `cache_control: { type: 'ephemeral' }`
- ประหยัด ~90% cost สำหรับ repeated agent calls

### 3. Hierarchical Summarization
```
Full History → Summary → Key Points → Single Line
100K tokens    10K tokens  1K tokens    100 tokens
```

### 4. Agent Memory Tiers
| Tier | Storage | TTL | Size |
|------|---------|-----|------|
| Working | In-memory | Session | 32K tokens |
| Short-term | Redis | 24h | 128K tokens |
| Long-term | Supabase | Permanent | Unlimited |
| Archive | OSS | Permanent | Unlimited |

## Token Budget per Agent Layer

| Layer | Budget | Strategy |
|-------|--------|----------|
| L1 Perception | 4K | Raw data only |
| L2 Analysis | 8K | Structured output |
| L3 Decision | 16K | With context |
| L4 Coordination | 32K | Full context |
| L5 Research | 128K | Extended context |

## Implementation

```typescript
// Context budget enforcement
interface AgentContext {
  systemPrompt: string      // cached
  workingMemory: string[]   // rolling 10
  taskContext: string       // compressed
  toolResults: unknown[]    // last 5 only
}
```

## Status

🚧 **Stub** — Patterns defined, ต้องการ BaseAgent context middleware implementation
