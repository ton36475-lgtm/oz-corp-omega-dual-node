---
name: sirinx-content-pipeline
description: >
  SIRINX Content Pipeline — Automated content creation และ publishing workflow
  ตั้งแต่ ideation, creation, review, scheduling, publishing ข้ามหลาย channels
  Triggers on: content pipeline, content creation, สร้าง content, publish, content calendar
---

# SIRINX Content Pipeline — v1.0

**Mission:** สร้าง automated pipeline สำหรับ content production ครบวงจร ตั้งแต่ idea จนถึง publish

---

## Pipeline Stages

```
IDEATION → BRIEF → CREATE → REVIEW → SCHEDULE → PUBLISH → ANALYZE
   ↑                                                          |
   └──────────────── Feedback Loop ───────────────────────────
```

### Stage 1: Ideation
- AI-generated topics จาก trending keywords (Magokurō #11, Genzō #12)
- Competitor gap analysis (Benchmark agent #46)
- Customer pain points จาก CRM

### Stage 2: Brief
```json
{
  "title": "...",
  "channel": "facebook|youtube|tiktok|line|blog",
  "format": "video|image|carousel|article",
  "target": "factory_owner|warehouse_manager|hotel_gm",
  "hook": "...",
  "keyMessage": "...",
  "cta": "..."
}
```

### Stage 3: Creation
- **Text**: Claude Sonnet → Thai copywriter voice
- **Image**: Midjourney/DALL-E → Solar + factory aesthetic
- **Video Script**: Shot list + narration
- **Thumbnail**: Canva template automation

### Stage 4: Review
- Brand voice check (Glassmorphism, Deep Navy, Solar Gold)
- Fact-checking (Solar specs, ROI numbers)
- Legal compliance (Thai advertising laws)

### Stage 5: Schedule & Publish
```
Facebook: 10:00, 18:00 (Tue, Thu, Sat)
YouTube:  15:00 (Wed)
TikTok:   19:00 (Mon, Wed, Fri)
Line OA:  08:00 (Mon, Wed)
Blog:     09:00 (Mon)
```

## Content Types

| Type | Frequency | Avg Time |
|------|-----------|----------|
| FB Post | 3x/week | 30 min |
| YouTube Video | 1x/week | 4 hours |
| TikTok Short | 3x/week | 1 hour |
| Blog Article | 1x/week | 2 hours |
| Case Study | 1x/month | 8 hours |

## Integration

- **n8n** — Automation workflow (sirinx-n8n-automation)
- **Shopee Video** — Product showcase (sirinx-shopee-video-ai)
- **Meta Ads** — Boost top posts (sirinx-meta-ads-marketing)

## Status

🚧 **Stub** — Framework defined, ต้องการ n8n workflow implementation
