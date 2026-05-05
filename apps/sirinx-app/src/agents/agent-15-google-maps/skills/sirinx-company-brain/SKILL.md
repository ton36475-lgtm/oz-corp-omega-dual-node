---
name: sirinx-company-brain
description: "SIRINX Company Brain — Central knowledge base and single source of truth for all 47 Ronin agents. ใช้ skill นี้ทุกครั้งที่ต้องค้นหาข้อมูลบริษัท, ตรวจสอบ facts, หรือ sync knowledge ระหว่าง agents"
---

# SIRINX Company Brain — Central Knowledge Hub

## Purpose
Single source of truth สำหรับข้อมูลทั้งหมดของ SIRINX Solar Energy
ทุก agent ต้องอ้างอิงจาก Brain ก่อน — ห้ามสร้าง knowledge ซ้ำ

## When to Use
- Agent ต้องการข้อมูลบริษัท (pricing, products, ICP, team)
- ต้องการ verify facts ก่อนส่งให้ลูกค้า
- Cross-agent query ที่ต้องการ consistent data
- สร้าง content ที่ต้อง brand-aligned

## Knowledge Domains

### 1. Company Profile
- **ชื่อบริษัท:** SIRINX Solar Energy
- **ธุรกิจ:** B2B EPC Solar Installation + O&M + AI Platform (SaaS)
- **ICP:** โรงงาน/คลังสินค้า/โรงแรม ค่าไฟ > 50K THB/เดือน
- **พื้นที่:** ประเทศไทย (เน้น B2B industrial)

### 2. Product Catalog
- Solar Panel Systems: 10kWp - 5MWp
- Inverter Solutions: String/Central/Micro
- Monitoring: AI-powered real-time monitoring
- O&M Contracts: Preventive + Corrective maintenance
- SIRINX Platform: CEO WarRoom Dashboard + 47 Ronin AI

### 3. Pricing Framework
- ติดตั้ง: ≈ 25,000 - 35,000 THB/kWp (ขึ้นกับขนาด)
- ROI: 3-5 ปี payback period
- O&M: 800-1,200 THB/kWp/ปี
- Platform: SaaS subscription model

### 4. Competitive Advantages
- AI-powered 47 Ronin agent system
- Automated lead-to-close pipeline
- Real-time performance monitoring
- Cost reduction through automation

## Integration with 47 Ronin

| Agent | ใช้ Brain อย่างไร |
|-------|------------------|
| L1 Perception | ดึง baseline data สำหรับ comparison |
| L2 Analysis | ข้อมูล benchmark สำหรับ scoring |
| L3 Decision | Company policies สำหรับ approval |
| L4 Coordination | Resource data สำหรับ scheduling |
| L5 Research | Historical data สำหรับ trend analysis |
| Kai Chatbot | Product info สำหรับตอบลูกค้า |

## Data Access Patterns
```
Brain.query(domain, key) → authoritative answer
Brain.verify(claim) → true/false + source
Brain.sync(agentId) → latest knowledge snapshot
Brain.update(domain, key, value, source) → versioned update
```

## Rules
1. Brain เป็น read-heavy, write-controlled — เฉพาะ L3+ เขียนได้
2. ทุกการเปลี่ยนแปลงต้อง versioned + audit trail
3. Conflict resolution: latest verified source wins
4. Cache TTL: 1 hour สำหรับ dynamic data, 24h สำหรับ static
