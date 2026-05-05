---
name: sirinx-security-gate
description: "SIRINX Security Gate — Security review สำหรับทุก agent action และ API call. ใช้ทุกครั้งที่ต้อง validate API keys, ตรวจสอบ permissions, scan for vulnerabilities, หรือ audit agent behavior"
---

# SIRINX Security Gate — Agent Security Layer

## Purpose
ป้องกันการรั่วไหลของข้อมูล, API key exposure, และ unauthorized actions
ทุก external call ต้องผ่าน Security Gate

## When to Use
- Agent ต้องเรียก external API
- มีการจัดการ credentials/tokens
- Agent ต้อง access sensitive data
- Deploy code หรือ infrastructure changes
- ก่อน publish content ที่มีข้อมูลลูกค้า

## Security Checks

### 1. API Key Protection
- ห้ามใส่ key ใน code/commit
- ใช้ env variables เท่านั้น
- Rotate keys ทุก 90 วัน
- Monitor usage anomalies

### 2. Data Classification
| Level | ข้อมูล | การจัดการ |
|-------|--------|----------|
| PUBLIC | Product info, pricing tiers | เผยแพร่ได้ |
| INTERNAL | Agent configs, schedules | เฉพาะ team |
| CONFIDENTIAL | Customer data, financials | Encrypted |
| RESTRICTED | API keys, passwords | Vault only |

### 3. Agent Permissions
```
L1 Perception: READ public + internal
L2 Analysis: READ all, WRITE analysis results
L3 Decision: READ/WRITE all except restricted
L4 Coordination: Full access with audit
L5 Research: READ external, WRITE research
```

### 4. Request Validation
```
Before External Call:
1. Verify agent has permission
2. Check rate limits
3. Sanitize payload (no PII leaks)
4. Log request metadata
5. Verify destination is whitelisted

After Response:
1. Scan for sensitive data in response
2. Redact if necessary
3. Store only what's needed
4. Update audit log
```

## Threat Model
- **API Key Leak:** Auto-detect in git commits, logs, outputs
- **Prompt Injection:** Sanitize all user inputs before agent processing
- **Data Exfiltration:** Monitor outbound data volume
- **Unauthorized Escalation:** Agent ห้ามข้ามชั้น (L1→L3 ไม่ได้)
- **Resource Abuse:** Token budget enforcement per agent

## Incident Response
1. DETECT → Log anomaly
2. CONTAIN → Disable affected agent
3. NOTIFY → Alert L4 + Tony via Telegram
4. INVESTIGATE → Root cause analysis
5. REMEDIATE → Fix + update rules
6. REVIEW → Post-incident report

## Rules
1. ทุก external API call ต้อง log
2. Failed auth attempts > 3 → lock agent
3. API keys ห้ามอยู่ใน memory/context
4. Customer data ต้อง encrypt at rest + transit
5. Weekly security audit by L5 Research
