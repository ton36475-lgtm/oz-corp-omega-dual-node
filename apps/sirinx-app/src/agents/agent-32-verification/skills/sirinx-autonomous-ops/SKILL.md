---
name: sirinx-autonomous-ops
description: "SIRINX Autonomous Operations — 24/7 autonomous operation, self-healing, auto-escalation. ใช้ทุกครั้งที่ต้อง setup autonomous workflows, self-healing systems, หรือ configure 24/7 operations แบบไม่ต้องคนสั่ง"
---

# SIRINX Autonomous Operations — Zero-Human-Touch System

## Purpose
ระบบต้องทำงาน 24/7 โดยไม่ต้องรอคำสั่ง — Tony ตื่นมาต้องเห็นผลงาน
"ทำงานเหมือนทุกวันเป็นวันสุดท้ายของโลกใบนี้"

## When to Use
- Setup daily autonomous routines
- Configure self-healing mechanisms
- Design escalation paths
- Monitor system health 24/7
- Ensure continuous revenue generation

## Daily Autonomous Schedule

### 00:00 - 06:00 (Maintenance Window)
```
00:00 — Memory consolidation (L5)
01:00 — Database backup & cleanup
02:00 — Log rotation & archival
03:00 — Model performance benchmarks
04:00 — Security scan
05:00 — Prepare morning report
```

### 06:00 - 09:00 (Morning Prep)
```
06:00 — Generate daily targets
06:30 — Scan overnight leads
07:00 — Create social media content
07:30 — Queue FB posts for the day
08:00 — Send morning brief to Tony (Telegram)
08:30 — Review pipeline + flag stale deals
```

### 09:00 - 18:00 (Business Hours)
```
Every hour:
  - Check new leads + auto-respond
  - Monitor FB/LINE messages
  - Update pipeline status
  - Track revenue vs target

Every 3 hours:
  - Post scheduled content
  - Agent health check
  - Performance report

At 12:00:
  - Midday revenue update
  - Competitor scan
```

### 18:00 - 24:00 (Evening Ops)
```
18:00 — End-of-day revenue report
19:00 — Tomorrow's content prep
20:00 — Weekly analysis (if Friday)
21:00 — Agent performance review
22:00 — Research queue processing
23:00 — System optimization
```

## Self-Healing Protocol

### Health Checks
```
Every 5 min:
  - PM2 process status
  - Ollama model responding
  - API endpoints live
  - Database connection ok

Every 30 min:
  - Token budget remaining
  - Queue depth normal
  - Memory usage acceptable
  - Disk space sufficient
```

### Auto-Recovery Actions
| Issue | Detection | Auto-Fix | Escalation |
|-------|-----------|----------|------------|
| PM2 process down | healthcheck | pm2 restart <name> | If 3 fails → Telegram |
| Ollama not responding | API timeout | restart Ollama service | If persists → use API |
| High memory usage | >80% RAM | Clear caches + GC | >95% → alert + throttle |
| Disk full | >90% | Clean logs + temp | >95% → stop non-critical |
| Agent stuck | No output 15min | Kill + restart task | If repeat → disable agent |

## Escalation Matrix
```
Level 0: Auto-fix (no human)
Level 1: Telegram notification to Tony
Level 2: Telegram + pause affected service
Level 3: Telegram + pause ALL + wait for manual fix
```

### Escalation Triggers
- Revenue: 0 THB by noon → Level 1
- System: >50% agents offline → Level 2
- Security: Unauthorized access → Level 3
- Data: Supabase connection lost > 30min → Level 2

## Key Metrics for Autonomous Quality
- **Uptime:** > 99.5% per month
- **Auto-Recovery Rate:** > 90% (no human needed)
- **Mean Time to Detect:** < 5 minutes
- **Mean Time to Recover:** < 15 minutes
- **Daily Tasks Completed:** > 95% of scheduled

## Rules
1. ทุก scheduled task ต้องมี timeout + fallback
2. Self-healing ต้อง try 3 ครั้ง ก่อน escalate
3. ห้าม auto-fix ที่ทำลายข้อมูล
4. Morning report ต้องส่งก่อน 08:30 ทุกวัน
5. Revenue update ต้องส่งอย่างน้อยวันละ 3 ครั้ง
