---
name: sirinx-benchmark-guard
description: "SIRINX Benchmark Guard — Quality gate ที่ validate ทุก output ก่อนส่งมอบ ใช้ทุกครั้งที่ต้อง review quality, ตรวจสอบ content ก่อนเผยแพร่, หรือ validate agent output ก่อน delivery"
---

# SIRINX Benchmark Guard — Quality Gate System

## Purpose
ป้องกันไม่ให้ output คุณภาพต่ำหลุดออกไป — ทุก deliverable ต้องผ่าน Guard

## When to Use
- ก่อน post content ไป social media
- ก่อนส่ง quote/proposal ให้ลูกค้า
- ก่อน deploy code to production
- ก่อน agent output ส่งต่อ layer ถัดไป
- รายงานที่ต้องส่ง CEO/management

## Quality Dimensions

### 1. Accuracy (ความถูกต้อง)
- ข้อมูลตัวเลขตรงกับ source
- Technical specs ถูกต้อง
- Legal/compliance ไม่มีปัญหา

### 2. Completeness (ความครบถ้วน)
- ครบทุก section ที่กำหนด
- ไม่มี placeholder/TODO
- References ครบ

### 3. Brand Alignment (ตรงแบรนด์)
- ใช้ภาษาตาม brand voice
- Visual identity ตรง (colors, fonts)
- Tone เหมาะกับ audience

### 4. Performance (ประสิทธิภาพ)
- Response time ตาม SLA
- Resource usage ไม่เกิน budget
- Token cost ไม่เกิน limit

## Scoring System
```
Score 90-100: ✅ PASS — deliver immediately
Score 70-89:  ⚠️ REVIEW — minor fixes needed
Score 50-69:  🔄 REVISE — significant rework
Score < 50:   ❌ REJECT — redo from scratch
```

## Guard Process
```
Input → Check Accuracy → Check Completeness → Check Brand → Score → Decision
                                                                      ↓
                                                          PASS → Deliver
                                                          REVIEW → Fix + Re-check
                                                          REVISE → Return to agent
                                                          REJECT → Escalate to L3
```

## Rules
1. Guard ห้ามแก้ไข output เอง — ส่งกลับให้ agent แก้
2. Score ต้องมี explanation สำหรับทุก dimension
3. REJECT ต้อง notify L4 Coordinator
4. Content ที่เกี่ยวกับ pricing/legal ต้อง score > 95
5. Social media content ต้อง brand check + image verify
