# Skill: Docs from Code

## ชื่อ Skill
`docs-from-code`

## วัตถุประสงค์
สร้าง documentation จาก code โดยตรง — อ่าน implementation จริงแล้วเขียน docs ที่ accurate
ไม่สร้าง docs จากความจำหรือ assumption

## เมื่อไรใช้ Skill นี้
- หลัง implement feature ใหม่ — สร้าง API/component docs
- เมื่อ refactor เสร็จ — อัพเดต architecture docs
- เมื่อต้องการ onboarding docs สำหรับ code ที่มีอยู่

## Input ที่ต้องการ
```
- source files ที่ต้องการสร้าง docs
- doc_type: api|component|architecture|runbook
- output path
```

## Output ที่ผลิต
```
- docs/{type}/{filename}.md
```

## ขั้นตอนการทำงาน

### สำหรับ API Docs

#### Step 1: อ่าน Route Definitions
```bash
# Next.js App Router
find src/app/api -name "route.ts" | sort
```

#### Step 2: สร้าง API Reference
```markdown
# API: POST /api/solar/calculate

## Description
[จาก comment ใน route.ts หรือ infer จาก logic]

## Request Body
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| kWp   | number | ✅ | ขนาดระบบ kWp |
| ...   | ...  | ...      | ...         |

## Response
| Field | Type | Description |
|-------|------|-------------|
| npv   | number | Net Present Value (THB) |

## Example
\`\`\`json
POST /api/solar/calculate
{
  "kWp": 100,
  "electricityRate": 4.5
}
\`\`\`

## Error Codes
| Code | Message | Cause |
|------|---------|-------|
| 400  | Invalid kWp | kWp <= 0 |
```

### สำหรับ Component Docs

#### Step 1: อ่าน Props Interface
```typescript
// ดู TypeScript interface/type
interface ChartWrapperProps {
  data: ChartData[]
  height?: number
  showLegend?: boolean
}
```

#### Step 2: สร้าง Component Reference
```markdown
# Component: ChartWrapper

## Overview
[infer จาก code + JSX structure]

## Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| data | ChartData[] | required | ข้อมูลกราฟ |
| height | number | 300 | ความสูง px |

## Usage
\`\`\`tsx
<ChartWrapper data={solarData} height={400} showLegend />
\`\`\`
```

### สำหรับ Architecture Docs

#### Step 1: สร้าง Directory Map
```bash
find src -type d | sort | head -30
```

#### Step 2: Trace Data Flow
อ่าน entry points (page.tsx) → อ่าน components ที่ import → สร้าง data flow diagram (text-based)

### กฎการเขียน Docs
- **อ่าน code ก่อนเขียน** — ห้าม assume
- **ภาษาไทยสำหรับ description** — English สำหรับ technical terms
- **ถ้าไม่แน่ใจ** → ระบุว่า "[อ่านจาก code — verify ก่อนใช้]"
- **ไม่สร้าง docs ที่ inaccurate** — ถ้าไม่รู้ ระบุว่าไม่รู้

## หมายเหตุ
- Skill นี้ทำงานใน worktree — docs files ถูก commit ใน branch เดิม
- ถ้า docs มีอยู่แล้ว → อัพเดตเฉพาะส่วนที่เปลี่ยน ไม่ overwrite ทั้งหมด
