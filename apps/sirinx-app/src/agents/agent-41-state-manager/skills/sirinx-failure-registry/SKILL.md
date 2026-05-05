---
name: sirinx-failure-registry
description: "SIRINX Failure Registry — Error tracking, failure patterns, และ auto-recovery. ใช้ทุกครั้งที่ agent เจอ error, ต้องวิเคราะห์ failure pattern, หรือ setup auto-recovery mechanism"
---

# SIRINX Failure Registry — Error Intelligence System

## Purpose
บันทึกทุก failure ในระบบ, วิเคราะห์ patterns, และ auto-recover
เปลี่ยน "fail → retry blindly" เป็น "fail → learn → prevent"

## When to Use
- Agent encounter error/exception
- API call fails
- Workflow breaks at any step
- Performance degrades
- Repeated failures need investigation

## Failure Categories

### 1. Transient (ชั่วคราว)
- Network timeout → Auto-retry with backoff
- Rate limit hit → Queue + wait
- Service unavailable → Switch fallback

### 2. Systematic (เชิงระบบ)
- Wrong API format → Fix + update schema
- Auth expired → Refresh token
- Schema mismatch → Version check

### 3. Logic (ตรรกะ)
- Agent produced wrong output → Re-evaluate prompt
- Decision tree failed → Review rules
- Scoring anomaly → Recalibrate model

### 4. Resource (ทรัพยากร)
- Token budget exceeded → Optimize or escalate
- Memory full → Garbage collect
- CPU spike → Throttle agents

## Failure Record Schema
```json
{
  "failureId": "FAIL-20260405-001",
  "timestamp": "2026-04-05T14:30:00+07:00",
  "agent": "kuranosuke-01",
  "category": "transient",
  "error": "TIMEOUT: Ollama /api/generate",
  "context": {
    "model": "gemma3:4b",
    "inputTokens": 2048,
    "timeout": 30000
  },
  "recovery": {
    "action": "retry_with_backoff",
    "attempts": 3,
    "resolved": true
  },
  "pattern": "ollama_timeout_heavy_load",
  "frequency": 12,
  "lastSeen": "2026-04-05T14:30:00+07:00"
}
```

## Auto-Recovery Playbook

| Pattern | Detection | Recovery | Escalation |
|---------|-----------|----------|------------|
| API Timeout | 3 consecutive fails | Retry backoff 1s→5s→15s | After 5 retries → L4 |
| Token Exceeded | Budget monitor | Truncate input / switch model | If critical → L3 |
| Auth Expired | 401 response | Auto-refresh token | If refresh fails → Alert Tony |
| LLM Hallucination | Benchmark Guard | Re-prompt with constraints | 2 fails → human review |
| Workflow Break | Step timeout | Rollback to checkpoint | If no checkpoint → L4 |

## Pattern Analysis
- ทุก failure ถูก cluster by similarity
- Recurring patterns (>3 times/day) auto-create prevention rule
- Weekly failure report to CEO Dashboard
- Monthly failure trend analysis by L5

## Rules
1. ทุก error ต้อง log — ห้าม swallow silently
2. Recovery ต้อง try ก่อน escalate
3. Pattern ที่เกิด >10 ครั้ง ต้องมี permanent fix
4. Critical failures → Telegram alert ทันที
5. Failure data retention: 180 วัน
