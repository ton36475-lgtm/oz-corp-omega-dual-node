---
name: sirinx-research-loop
description: "SIRINX Research Loop — Continuous research และ learning จาก external sources. ใช้ทุกครั้งที่ต้อง research ตลาด, ติดตาม AI trends, competitive intelligence, หรือ market analysis"
---

# SIRINX Research Loop — Continuous Intelligence Engine

## Purpose
L5 Research layer ต้องเรียนรู้ตลอด — ไม่ใช่รอคำสั่ง
Auto-research trends, competitors, regulations, technology

## When to Use
- ต้องการ market intelligence ล่าสุด
- Competitive analysis update
- AI/technology trend tracking
- Solar industry news monitoring
- Regulatory/policy changes ที่กระทบธุรกิจ

## Research Domains

### 1. Solar Market Thailand
- Government incentives & subsidies
- New regulations (ERC, PEA, MEA)
- Competitor pricing & offerings
- Large project announcements
- Import/export tariffs (panels, inverters)

### 2. AI & Technology
- New LLM models & capabilities
- Agent framework updates
- Automation tools & platforms
- Cost reduction opportunities
- Open source alternatives

### 3. Competitive Intelligence
- Competitor campaigns & messaging
- New market entrants
- Partnership announcements
- Technology adoption patterns

### 4. Customer Insights
- Industry pain points evolution
- Budget cycle patterns
- Decision-maker changes
- Procurement trends

## Research Cycle
```
Schedule → Collect → Filter → Analyze → Distribute → Archive
  ↑                                         |
  └─────────── Feedback Loop ───────────────┘
```

### Cadence
| Research Type | Frequency | Agent |
|--------------|-----------|-------|
| Market News | Daily | Mimura (#44) |
| Competitor Watch | Weekly | Yokogawa (#45) |
| Tech Trends | Weekly | Kayano (#46) |
| Deep Analysis | Monthly | Terasaka (#47) |

## Output Format
```json
{
  "researchId": "RES-20260405-001",
  "domain": "solar_market_th",
  "title": "BOI ขยาย incentive สำหรับ solar rooftop 2026",
  "summary": "...",
  "impact": "high",
  "actionRequired": true,
  "suggestedAction": "Update pricing deck + sales talk track",
  "sources": ["..."],
  "confidence": 0.85,
  "expiresAt": "2026-05-05"
}
```

## Distribution
- HIGH impact → Telegram alert + CEO Dashboard
- MEDIUM impact → Daily digest to L3
- LOW impact → Archive for future reference
- ทุก research ถูก index ใน Company Brain

## Rules
1. ทุก claim ต้องมี source + confidence score
2. Competitor data ต้อง verify จาก 2+ sources
3. Research budget: 50 API calls/day
4. Archive ทุก research — อย่าทิ้ง
5. Monthly research ROI report
