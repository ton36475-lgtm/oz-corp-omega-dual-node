---
name: sirinx-fb-group-scanner
description: >
  SIRINX Facebook Group Scanner — สแกนและวิเคราะห์ posts ใน FB groups เพื่อหา leads
  Monitor keywords, sentiment, intent signals สำหรับ solar B2B prospects
  Triggers on: fb group, facebook group, สแกน facebook, monitor social, ค้นหา leads
---

# SIRINX Facebook Group Scanner — v1.0

**Mission:** สแกน Facebook Groups เพื่อหา potential leads ที่มีความสนใจด้านโซลาร์เซลล์

---

## Target Groups

| Group Type | Examples | Target |
|-----------|---------|--------|
| โรงงาน/อุตสาหกรรม | กลุ่มโรงงานไทย, นิคมอุตสาหกรรม | เจ้าของ, ผู้จัดการ |
| พลังงาน/ESG | กลุ่มพลังงานสะอาด, ESG Thailand | นักลงทุน, CFO |
| ผู้ประกอบการ | SME Thailand, เจ้าของธุรกิจ | Business owners |
| อสังหาริมทรัพย์ | กลุ่มโกดัง, โรงแรม | Property managers |

## Keyword Triggers

**High Intent (🔥)**
- "ค่าไฟแพง", "ลดค่าไฟ", "สนใจโซลาร์"
- "ติดตั้งโซลาร์", "ราคาโซลาร์", "ROI โซลาร์"
- "solar cell ราคา", "แผงโซลาร์ราคาถูก"

**Medium Intent (⚡)**
- "ค่าไฟเพิ่มขึ้น", "พลังงานแสงอาทิตย์"
- "ประหยัดพลังงาน", "green energy"

**Low Intent (💡)**
- "พลังงานทดแทน", "ESG", "carbon neutral"

## Scanning Pipeline

```
FB API / Scraper
      ↓
Keyword Filter (Kanroku #09)
      ↓
Sentiment Analysis (L2 agents)
      ↓
Lead Scoring (Kihei #26)
      ↓
CRM Integration (Supabase leads table)
      ↓
Alert → Sales Team
```

## Output Format

```json
{
  "leadId": "fb_[timestamp]",
  "groupName": "กลุ่มโรงงานไทย",
  "postContent": "...",
  "authorInfo": { "name": "...", "businessType": "..." },
  "intentScore": 85,
  "keywords": ["ค่าไฟแพง", "สนใจโซลาร์"],
  "recommendedAction": "ส่ง proposal ทันที"
}
```

## Agent Mapping

- **Kanroku #09** — Primary FB Group Scanner (L1)
- **Kyūdayū #10** — Comment thread scanner (L1)
- **Okaemon #19** — Sentiment analysis (L2)
- **Kihei #26** — Lead scoring (L3)

## Status

🚧 **Stub** — ดูเพิ่มเติมที่ `anthropic-skills:sirinx-fb-group-scanner`
