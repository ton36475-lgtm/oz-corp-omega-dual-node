# Skill: PR Review

## ชื่อ Skill
`pr-review`

## วัตถุประสงค์
ตรวจสอบ Pull Request อย่างเป็นระบบก่อนส่งให้ Reviewer agent
ทำ preliminary check เพื่อกรอง obvious issues ก่อน formal review

## เมื่อไรใช้ Skill นี้
- หลังจาก codex_implementer และ codex_test_engineer เสร็จงาน
- ก่อนส่ง artifacts ให้ reviewer agent
- เมื่อต้องการ quick sanity check บน diff

## Input ที่ต้องการ
```
- git diff (worktree branch vs base branch)
- spec.md (acceptance criteria)
- test_results.json
```

## Output ที่ผลิต
```
- preliminary_review.md (state/jobs/{job_id}/preliminary_review.md)
```

## ขั้นตอนการทำงาน

### Step 1: Get the Diff
```bash
cd .worktrees/job-{job_id}
git diff main...HEAD --stat
git diff main...HEAD
```

### Step 2: Quick Checks (Automated)

#### Check A: Sensitive Files
```bash
git diff main...HEAD --name-only | grep -E "\.env|secret|password|migration|production"
# ถ้าพบ → FLAG ทันที
```

#### Check B: Debug Code Left
```bash
git diff main...HEAD | grep "^\+" | grep -E "console\.log|debugger|TODO:|FIXME:|console\.error"
# Flag รายการที่พบ
```

#### Check C: Large Files
```bash
git diff main...HEAD --stat | awk '{print $1}' | sort -n | tail -5
# ถ้าไฟล์ไหนเปลี่ยนมากกว่า 300 lines → flag
```

#### Check D: Test Files Changed?
```bash
git diff main...HEAD --name-only | grep -E "\.test\.|\.spec\."
# ต้องมี test files ถ้า production code เปลี่ยน
```

### Step 3: Acceptance Criteria Check
อ่าน spec.md → แต่ละ AC ตรวจว่า:
- [ ] มี code ที่ implement AC นี้
- [ ] มี test ที่ cover AC นี้

### Step 4: Scope Check
```bash
git diff main...HEAD --name-only
# เปรียบกับ repo_map.affected_files
# ถ้าพบไฟล์นอก scope → flag
```

### Step 5: สร้าง preliminary_review.md

```markdown
# Preliminary Review: {job_id}
**Date:** {datetime}
**Branch:** {branch}
**Files Changed:** {n}

## Quick Check Results
| Check | Status | Notes |
|-------|--------|-------|
| No sensitive files | ✅/❌ | ... |
| No debug code | ✅/❌ | ... |
| Tests included | ✅/❌ | ... |
| Stays in scope | ✅/❌ | ... |

## Acceptance Criteria Coverage
| AC | Code? | Test? |
|----|-------|-------|
| AC-1 | ✅ | ✅ |
| AC-2 | ✅ | ⚠️ partial |

## Flags for Reviewer
- [flag_1]: ...
- [flag_2]: ...

## Preliminary Verdict
READY_FOR_REVIEW / NEEDS_FIXES_FIRST
```

## หมายเหตุ
- Skill นี้ทำ preliminary check เท่านั้น — ไม่ใช่ formal review
- Issues ที่พบส่งต่อให้ reviewer agent ทำ formal review
- ถ้าพบ sensitive files → หยุดทันทีและรายงาน Orchestrator
