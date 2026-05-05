---
name: sirinx-agentation-ui-review
description: >
  SIRINX Agentation UI Review — Review และ improve UI/UX ของ SIRINX platform
  Glassmorphism design system, accessibility, responsiveness, agent interaction patterns
  Triggers on: UI review, UX, design review, agentation, interface, glassmorphism, ตรวจ UI
---

# SIRINX Agentation UI Review — v1.0

**Mission:** ตรวจสอบและ improve UI/UX ของ SIRINX platform ให้ตรงตาม design system และ agentic UX patterns

---

## Design System

### Color Palette
```css
--deep-navy:     #0A2342;  /* Background primary */
--solar-gold:    #F5A623;  /* Accent, CTA, highlights */
--emerald-green: #10B981;  /* Success, active states */
--glass-white:   rgba(255,255,255,0.08);  /* Card backgrounds */
--glass-border:  rgba(255,255,255,0.12);  /* Card borders */
```

### Typography
```css
font-family: 'Sarabun', sans-serif;  /* Thai + English */
--fs-display: 2.5rem;   /* Hero headlines */
--fs-heading: 1.5rem;   /* Section titles */
--fs-body: 1rem;        /* Content */
--fs-small: 0.875rem;   /* Labels, captions */
```

### Glassmorphism Components
```css
.glass-card {
  background: rgba(255,255,255,0.08);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 16px;
}
```

## UI Review Checklist

### Visual Consistency
- [ ] Deep Navy backgrounds throughout
- [ ] Solar Gold untuk CTAs only
- [ ] Glassmorphism effects on all cards
- [ ] Sarabun font loaded globally

### Agentic UX Patterns
- [ ] Agent status indicators (live/idle/error)
- [ ] Real-time streaming responses
- [ ] Agent "thinking" animations
- [ ] Layer visualization (L1-L5)
- [ ] 47 Ronin character avatars

### Accessibility
- [ ] WCAG 2.1 AA contrast ratios
- [ ] Keyboard navigation
- [ ] Screen reader labels
- [ ] Thai language support

### Responsive
- [ ] Mobile (375px): Single column
- [ ] Tablet (768px): 2-column grid
- [ ] Desktop (1440px): Full layout
- [ ] 4K (2560px): Max-width container

## Pages to Review

| Page | Route | Status |
|------|-------|--------|
| Agent DNA Command Center | `/agents` | Exists |
| Pixel Office View | `/agents` (component) | Exists |
| OpenClaw Commander | `/openclaw` | Exists |
| WARROOM CEO | `/warroom` | Planned |
| Lead Dashboard | `/leads` | Planned |
| Andromeda UI | `/andromeda` | Planned |

## Status

🚧 **Stub** — Design system defined, ต้องการ systematic UI audit pass
