# Skill: Targeted Test Fix

## ชื่อ Skill
`targeted-test-fix`

## วัตถุประสงค์
วิเคราะห์ failing tests, ระบุสาเหตุที่แท้จริง และแก้ไขให้ผ่าน
โดยไม่แก้ test logic เพียงเพื่อให้ผ่าน ("test should reflect reality")

## เมื่อไรใช้ Skill นี้
- เมื่อ `npm test` มี failing tests หลังจาก implement feature ใหม่
- เมื่อ refactor ทำให้ tests พัง
- เมื่อต้องการ update tests ให้ตรงกับ changed API/interface

## Input ที่ต้องการ
```
- test_results.json (จาก codex_test_engineer) — รายการ failed tests
- git diff ของ implementation
- test files ที่พัง
```

## Output ที่ผลิต
```
- แก้ไข test files (committed ใน worktree)
- updated test_results.json (หลังแก้)
```

## ขั้นตอนการทำงาน

### Step 1: อ่าน Error Messages
```bash
npm test -- --verbose 2>&1 | grep -A 10 "FAIL\|●"
```

จาก error message ตรวจสอบ:
- ✅ Test expectation ผิด (เพราะ interface เปลี่ยน) → แก้ test
- ✅ Mock ไม่ตรงกับ implementation → แก้ mock
- ❌ Implementation bug → flag ให้ Implementer แก้
- ❌ Environment issue → รายงาน

### Step 2: ตรวจสอบ Root Cause
```bash
# รัน failing test เดี่ยวๆ เพื่อดู error ชัดๆ
npm test -- --testNamePattern "chart overflow" --verbose
```

### Step 3: วิเคราะห์ประเภทของ Failure

#### Type A: Interface Changed
```typescript
// เดิม: component รับ prop แบบหนึ่ง
<Chart data={data} />
// ใหม่: เปลี่ยน prop name
<Chart chartData={data} />

// Fix: อัพเดต test ให้ใช้ prop ใหม่
```

#### Type B: Mock Outdated
```typescript
// Mock ไม่ตรงกับ actual implementation
jest.mock('../utils/formatNumber', () => ({
  format: jest.fn().mockReturnValue('1,000') // ← ต้องอัพเดต
}))
```

#### Type C: Async Timing
```typescript
// รอ async operation ให้ครบ
await waitFor(() => {
  expect(screen.getByText('Dashboard')).toBeInTheDocument()
})
```

### Step 4: แก้ไข Tests
กฎ:
- แก้ tests ที่พังเพราะ **interface change** → ✅ ทำได้
- แก้ tests ที่ **verify wrong behavior** → ❌ flag ให้ Implementer
- เพิ่ม tests สำหรับ **new behavior** → ✅ ทำได้
- **ห้าม** `.skip()` หรือ mock away ที่ควรทดสอบ

### Step 5: ตรวจสอบผล
```bash
npm test -- --coverage
# ต้องผ่าน 100% ของ failed tests ก่อนหน้า
# coverage ต้องไม่ต่ำกว่า 70%
```

## Diagnostic Reference

| Error Pattern | สาเหตุที่น่าจะเป็น | Action |
|--------------|------------------|--------|
| `Cannot find module` | import path เปลี่ยน | อัพเดต import |
| `is not a function` | function signature เปลี่ยน | อัพเดต call |
| `Expected ... received` | behavior เปลี่ยน | วิเคราะห์ก่อน |
| `timeout exceeded` | async ไม่ resolve | เพิ่ม waitFor |
| `act() warning` | state update ไม่ wrap | เพิ่ม act() |

## หมายเหตุ
- ถ้าแก้ test แล้วยังไม่ผ่าน → รายงานใน test_failures.yaml
- ห้าม skip tests มากกว่า 2 ตัวโดยไม่มีเหตุผลชัดเจน
