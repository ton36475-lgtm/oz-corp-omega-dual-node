---
name: sirinx-manus-portfolio
description: >
  SIRINX Manus Project Portfolio — TDD standards, project scripts, และ portfolio management
  สำหรับ track โปรเจ็คทั้งหมดของ SIRINX ด้วย Test-Driven Development standards
  Triggers on: manus, portfolio, TDD, test driven, project tracking, sprint
---

# SIRINX Manus Project Portfolio — v1.0

**Mission:** จัดการ project portfolio ของ SIRINX ด้วย TDD standards และ Manus-style automation

---

## TDD Standards

### Testing Pyramid
```
        E2E Tests (5%)
       Integration (15%)
      Unit Tests (80%)
```

### Naming Convention
```typescript
describe('AgentName', () => {
  it('should <behavior> when <condition>', () => {})
})
```

### Coverage Requirements
| Type | Minimum |
|------|---------|
| Unit | 80% |
| Integration | 60% |
| E2E | Key flows only |

## Project Scripts

```bash
# Run all tests
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# Type check
npm run typecheck

# Lint
npm run lint
```

## Active Projects

| Project | Status | Priority |
|---------|--------|----------|
| SIRINX Web (sirinx-web) | Active | P0 |
| Desktop App (sirinx-desktop) | Active | P1 |
| 47 Ronin Agents | In Progress | P0 |
| OpenClaw Integration | Active | P1 |
| Supabase Schema | Active | P1 |
| Andromeda UI | Planning | P2 |

## Sprint Template

```markdown
## Sprint [N] — [Date Range]

### Goals
- [ ] Feature X
- [ ] Bug Y
- [ ] Infra Z

### Agents Involved
- [Agent codename]: [task]

### Definition of Done
- [ ] Tests passing
- [ ] TypeScript strict
- [ ] Reviewed
```

## Status

🚧 **Stub** — Standards defined, ต้องการ test setup (Jest/Vitest) สำหรับ sirinx-web
