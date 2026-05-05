# Skill: Repo Map

## ชื่อ Skill
`repo-map`

## วัตถุประสงค์
สร้าง map โครงสร้าง repository ที่ครอบคลุม — ระบุไฟล์ที่เกี่ยวข้องกับ task ที่กำหนด,
dependency chain และ risk flags สำหรับใช้เป็น input ของ codex_implementer

## เมื่อไรใช้ Skill นี้
- เมื่อต้องเริ่ม job ใหม่และยังไม่มี repo_map.yaml
- เมื่อ codebase เปลี่ยนแปลงมากและ map เก่าไม่สดใหม่แล้ว
- เมื่อ task ครอบคลุม modules หลายชุดและต้องการ dependency analysis

## Input ที่ต้องการ
```
- spec.md หรือ job description (keywords ที่ต้องการ map)
- repo root directory path
```

## Output ที่ผลิต
```
- state/jobs/{job_id}/repo_map.yaml
```

## ขั้นตอนการทำงาน

### Step 1: Scan Directory Structure
```bash
# สร้าง directory tree (depth 3)
find . -type f -name "*.ts" -o -name "*.tsx" -o -name "*.js" \
  | grep -v node_modules | grep -v .next | grep -v dist \
  | head -200
```

### Step 2: Extract Keywords จาก Spec
จาก spec.md ดึง:
- Component names (เช่น "Chart", "Dashboard")
- Function names
- File names ที่ mention
- Feature areas (เช่น "authentication", "payment")

### Step 3: Search for Relevant Files
```bash
# ค้นหาไฟล์ที่เกี่ยวข้องกับ keywords
grep -rl "ChartWrapper\|Dashboard\|chart" src/ --include="*.tsx"
grep -rl "ChartWrapper\|Dashboard\|chart" src/ --include="*.ts"
```

### Step 4: Analyze Imports/Exports
สำหรับแต่ละไฟล์ที่พบ:
```bash
# ดู imports
grep "^import" src/components/Dashboard/Chart.tsx

# ดูว่าใครใช้ไฟล์นี้
grep -rl "from.*Chart" src/ --include="*.tsx"
```

### Step 5: Flag Risk Files
```bash
# ค้นหาไฟล์ sensitive
find . -name "*.env*" -not -path "*/node_modules/*"
find . -name "*auth*" -not -path "*/node_modules/*"
find . -name "*payment*" -not -path "*/node_modules/*"
find . -name "*migration*" -not -path "*/node_modules/*"
```

### Step 6: Find Test Files
```bash
# ค้นหา test files ที่เกี่ยวข้อง
find . -name "*.test.ts" -o -name "*.test.tsx" -o -name "*.spec.ts" \
  | xargs grep -l "Chart\|Dashboard" 2>/dev/null
```

### Step 7: สร้าง repo_map.yaml
รวบรวมข้อมูลทั้งหมดแล้วเขียน repo_map.yaml ตาม schema ใน `.openclaw/schemas/artifact.schema.yaml`

## Output Template
ดู `.openclaw/schemas/artifact.schema.yaml` → section `repo_map`

## หมายเหตุ
- ถ้า repo มีไฟล์มากกว่า 1000 ไฟล์ → จำกัด scan ที่ `src/` directory
- ถ้าพบ circular imports → flag ไว้ใน `risk_flags` ด้วย
- ความแม่นยำสำคัญกว่าความครอบคลุม — ถ้าไม่แน่ใจ รวมไว้ก่อน
