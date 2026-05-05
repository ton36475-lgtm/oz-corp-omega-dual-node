---
name: sirinx-shopee-video-ai
description: >
  SIRINX Shopee Video AI — สร้างและจัดการ video content สำหรับ Shopee, TikTok Shop, และ e-commerce
  AI-generated product videos, solar installation showcases, testimonials
  Triggers on: shopee, video ai, product video, e-commerce, TikTok shop, วิดีโอสินค้า
---

# SIRINX Shopee Video AI — v1.0

**Mission:** สร้าง AI-powered video content สำหรับ Shopee และ TikTok Shop ช่วย convert leads เป็นลูกค้า

---

## Video Types

### 1. Product Showcase
- แผงโซลาร์ specifications visual
- Inverter brand comparisons
- Battery storage options
- Duration: 15-30 วินาที

### 2. Installation Timelapse
- Before/After transformation
- Professional installation process
- System commissioning
- Duration: 60-90 วินาที

### 3. ROI Calculator Video
- Interactive "ค่าไฟลดได้เท่าไหร่?"
- Personalized numbers overlay
- CTA: "คำนวณฟรี"
- Duration: 30-45 วินาที

### 4. Customer Testimonials
- Real customer interviews
- Electricity bill comparison
- AI-enhanced quality
- Duration: 60-120 วินาที

## AI Video Pipeline

```
Brief Input (product/installation type)
       ↓
Script Generation (Claude Sonnet)
       ↓
Visual Storyboard (DALL-E/Midjourney)
       ↓
Video Assembly (RunwayML/Sora)
       ↓
Thai Voice-over (ElevenLabs TH)
       ↓
Caption Generation
       ↓
Platform Optimization (1:1, 9:16, 16:9)
       ↓
Publish (Shopee/TikTok/YouTube)
```

## Platform Specs

| Platform | Ratio | Duration | Size |
|----------|-------|----------|------|
| Shopee Video | 9:16 | 15-60s | < 50MB |
| TikTok | 9:16 | 15-60s | < 287MB |
| TikTok Shop | 9:16 | 15-60s | < 50MB |
| YouTube Shorts | 9:16 | < 60s | < 256MB |
| Facebook | 4:5 | 15-90s | < 4GB |

## Metrics

| KPI | Target |
|-----|--------|
| View Rate | > 50% |
| Engagement | > 3% |
| Lead CTR | > 1% |
| CPV | < 1 บาท |

## Agent Integration

- **Matanojō #13** — YouTube Scanner (trend research)
- **Genzō #12** — Instagram Scanner (aesthetic trends)
- Content Pipeline (sirinx-content-pipeline)

## Status

🚧 **Stub** — Pipeline designed, ต้องการ video AI API integrations
