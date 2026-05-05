---
name: sirinx-ai-model-intelligence
description: >
  SIRINX AI Model Intelligence — ติดตาม, ประเมิน, และ recommend AI models สำหรับ platform
  Benchmark models, track releases, optimize model selection per use-case
  Triggers on: AI model, benchmark, model comparison, LLM evaluation, เปรียบเทียบ model
---

# SIRINX AI Model Intelligence — v1.0

**Mission:** ติดตามและประเมิน AI models ที่เหมาะสมสำหรับ SIRINX platform agents

---

## Model Registry

### Production Models (2026 Q1)

| Model | Provider | Context | Thai | Speed | Cost |
|-------|----------|---------|------|-------|------|
| claude-sonnet-4-6 | Anthropic | 200K | Good | Fast | $$ |
| claude-opus-4-6 | Anthropic | 200K | Good | Slow | $$$$ |
| claude-haiku-4-5 | Anthropic | 200K | OK | Fast | $ |
| qwen-max | Alibaba | 32K | Excellent | Fast | $$ |
| qwen-turbo | Alibaba | 128K | Excellent | VFast | $ |
| deepseek-r1 | DeepSeek | 64K | Good | Medium | $ |
| deepseek-v3 | DeepSeek | 128K | Good | Fast | $ |
| gemini-2.0-flash | Google | 1M | Good | VFast | $ |

### Model Assignment (47 Ronin Layers)

| Layer | Recommended Model | Reason |
|-------|------------------|--------|
| L1 Perception | claude-haiku-4-5 | Fast, cheap, structured output |
| L2 Analysis | claude-sonnet-4-6 | Balance cost/quality |
| L3 Decision | claude-sonnet-4-6 | Reasoning required |
| L4 Coordination | claude-opus-4-6 | Complex orchestration |
| L5 Research | gemini-2.0-flash | Long context needed |
| Thai Content | qwen-max | Best Thai language |
| Math/Finance | deepseek-r1 | Superior reasoning |

## Benchmark Metrics

### SIRINX-Specific Benchmarks
1. **Thai Solar ROI Calculation** — Accuracy test
2. **Thai B2B Proposal Generation** — Quality score
3. **Agent Coordination** — Multi-step task completion
4. **Code Generation** — TypeScript Next.js 15

## Monitoring

- Agent: Mimura #44 (AI Trend Scanner) — weekly GitHub/HuggingFace/arXiv
- Agent: Kayano #46 (Benchmark Research) — monthly benchmarks
- Alert: New model release → auto-benchmark → recommendation report

## Status

🚧 **Stub** — Registry defined, ต้องการ automated benchmark pipeline
