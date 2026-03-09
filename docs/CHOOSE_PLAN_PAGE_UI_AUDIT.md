# Choose Plan Page — UI Audit Report (Phase 1)

**Page:** `src/enrollment-v2/pages/ChoosePlanPage.tsx`  
**Related:** PlanCard, HelpDecisionCard, EnrollmentFooter, EnrollmentPageContent, BenefitChip  
**Date:** Pre-fix structural audit

---

## 1. Layout Container

| Check | Expected | Actual | Status |
|-------|----------|--------|--------|
| Max width | max-w-6xl | max-w-4xl (line 80) | **ISSUE** — Container too narrow |
| mx-auto | Yes | Yes | OK |
| Responsive padding | px-4 md:px-6 | px-4 py-8 only (no md:px-6) | **ISSUE** — Missing responsive padding |

**Finding:** Inner content div uses `max-w-4xl`; spec expects `max-w-6xl`. Padding is fixed `px-4 py-8` with no md progression.

---

## 2. Layout System

| Check | Expected | Actual | Status |
|-------|----------|--------|--------|
| Page content layout | grid gap-8 | flex flex-col gap-8 (line 80) | **ISSUE** — Flex instead of grid |
| Section (plan cards) | grid gap-6 md:gap-8 | flex flex-col gap-8 (lines 82–83) | **ISSUE** — Flex; no responsive gap |

**Finding:** Page and section use flex column. Grid would give more predictable alignment and responsive behavior.

---

## 3. Plan Card Layout (PlanCard.tsx)

| Check | Expected | Actual | Status |
|-------|----------|--------|--------|
| Internal layout | grid md:grid-cols-2 gap-8 | flex flex-col md:flex-row gap-8 (line 78) | **ISSUE** — Flexbox used |
| Left column | icon, title, description, Ask AI, Select Plan | Same content in md:flex-1 | OK (content correct) |
| Right column | benefits list + chips | md:w-2/5 md:min-w-[240px] | OK (content correct) |

**Finding:** Card interior uses flexbox; spec recommends `grid md:grid-cols-2 gap-8` for clear two-column layout and alignment.

---

## 4. Responsive Behavior

| Breakpoint | Expected | Actual |
|------------|----------|--------|
| Desktop | grid-cols-2 layout (card interior) | md:flex-row in PlanCard |
| Tablet | grid-cols-1 | flex-col below md |
| Mobile | Stacked | flex-col, stacked |

**Finding:** Responsive behavior is correct (stacked on small, two columns on md+). No explicit grid-cols-2; flex is used. Responsive gap (gap-6 md:gap-8) not applied to section.

---

## 5. Benefit Chips

| Check | Expected | Actual | Status |
|-------|----------|--------|--------|
| Container | flex flex-wrap gap-2 | flex flex-wrap gap-3 (PlanCard line 152) | **ISSUE** — gap-3 instead of gap-2 |

**Finding:** Chips wrap correctly; only gap value is wrong (gap-3 vs gap-2).

---

## 6. Button Hierarchy

| Button | Expected | Actual | Status |
|--------|----------|--------|--------|
| Ask AI | Secondary | border, transparent, hover surface-2 | OK |
| Select Plan | Primary | brand-primary when not selected | OK |
| Selected | Success | success green + check | OK |

**Finding:** Hierarchy correct; no changes needed.

---

## 7. Selected State

| Check | Expected | Actual | Status |
|-------|----------|--------|--------|
| Only one selected | Yes | Single state.selectedPlan | OK |
| Border highlight | Yes | border-brand-primary ring-2 | OK |
| Selected badge | Yes | Top-right green badge | OK |
| Selected button | Yes | Green "Selected" + check | OK |

**Finding:** No inconsistencies.

---

## 8. Accessibility

| Check | Expected | Actual | Status |
|-------|----------|--------|--------|
| role="radio" | Yes | Yes (PlanCard line 41) | OK |
| aria-checked | Yes | aria-checked={isSelected} (line 43) | OK |
| tabIndex | Yes | tabIndex={0} (line 44) | OK |
| radiogroup | Yes | role="radiogroup" + aria-label on section | OK |

**Finding:** Plan cards behave as radios; attributes present.

---

## 9. Footer Layout

| Check | Expected | Actual (CSS) | Status |
|-------|----------|--------------|--------|
| flex | Yes | display: flex | OK |
| justify-between | Yes | justify-content: space-between | OK |
| items-center | Yes | align-items: center | OK |
| Back left / Continue right | Yes | Left/right divs | OK |

**Finding:** Footer layout matches spec.

---

## 10. Background Decorations

| Check | Expected | Actual | Status |
|-------|----------|--------|--------|
| Gradient container | Yes | bg-gradient-to-br from-[#eff6ff] via-white to-[#faf5ff] | OK |
| Radial shapes | Yes | Two radial-gradient divs | OK |
| Blur | Soft blur | No blur class on radial divs | **ISSUE** — Missing blur-3xl |
| Opacity | Appropriate | 0.08, 0.06 (dark 0.12, 0.1) | OK |
| Min height | min-h-[70vh] suggested | min-h-[60vh] (line 75) | **ISSUE** — Could use 70vh |

**Finding:** Radial decorations present; add blur for softness and consider 70vh min-height.

---

## Summary of Issues to Fix (Phase 3)

1. **Container:** max-w-4xl → max-w-6xl; add px-4 md:px-6 and responsive py.
2. **Page layout:** flex flex-col gap-8 → grid gap-8.
3. **Section:** flex flex-col gap-8 → grid gap-6 md:gap-8.
4. **Background:** min-h-[60vh] → min-h-[70vh]; add blur-3xl to radial decorations.
5. **Spacing:** px-4 py-8 → px-4 md:px-6 py-6 md:py-8.
6. **Heading accent:** -left-4 → left-[-12px] md:left-[-16px]; h-14 → h-12 md:h-16.
7. **PlanCard:** Replace flex with grid md:grid-cols-2 gap-8; benefits in right column.
8. **Benefit chips:** gap-3 → gap-2.
9. **Footer:** Already has flex justify-between items-center in CSS; no code change needed unless adding inline classes.

---

*End of Phase 1 audit. No code was modified.*

---

## Phase 2 — Visual Check

**Attempted:** Dev server started (localhost:5177). Navigated to `/enrollment-v2/choose-plan`.

**Result:** App redirected to login; route is protected. Screenshot captured shows the login screen, not the Choose Plan page. Visual evaluation of spacing, card width, heading alignment, button alignment, benefit chips, and footer on the actual page could not be performed without authentication.

**Recommendation:** Run Phase 2 manually while logged in, or use a test user, then compare spacing/card width/heading/buttons/chips/footer to Figma.

---

## Phase 3 — Fixes Implemented

### 1. Container width (ChoosePlanPage.tsx)
- `max-w-4xl` → `max-w-6xl` on the main content container.
- Responsive padding: `px-4 py-8` → `px-4 md:px-6 py-6 md:py-8`.

### 2. Layout system (ChoosePlanPage.tsx)
- Main content wrapper: `flex flex-col gap-8` → `grid gap-8`.

### 3. Section layout (ChoosePlanPage.tsx)
- Plan cards section: `flex flex-col gap-8` → `grid gap-6 md:gap-8`.

### 4. Background height (ChoosePlanPage.tsx)
- Gradient container: `min-h-[60vh]` → `min-h-[70vh]`.

### 5. Radial decorations (ChoosePlanPage.tsx)
- Both radial gradient divs: added `blur-3xl` for softer edges.

### 6. Responsive spacing (ChoosePlanPage.tsx)
- Container: `px-4 md:px-6 py-6 md:py-8` (as in #1).

### 7. Heading accent bar (ChoosePlanPage.tsx)
- Position: `-left-4` → `left-[-12px] md:left-[-16px]`.
- Height: `h-14` → `h-12 md:h-16`.

### 8. PlanCard layout (PlanCard.tsx)
- Inner layout: `flex flex-col md:flex-row gap-8` → `grid grid-cols-1 md:grid-cols-2 gap-8`.
- Left column: removed `md:flex-1` (grid handles sizing).
- Right column: removed `md:w-2/5 md:min-w-[240px]`; kept `md:border-l md:pl-8` so benefits stay in the second column.

### 9. Benefit chip layout (PlanCard.tsx)
- Benefits container: `gap-3` → `gap-2`; kept `flex flex-wrap`.

### 10. Footer alignment
- No code change: `.enrollment-footer__inner` already has `display: flex`, `justify-content: space-between`, `align-items: center` in CSS.

---

## Responsive behavior after fixes

- **Desktop (md and up):** PlanCard uses a two-column grid (plan info + buttons | benefits); page container is `max-w-6xl` with `px-4 md:px-6`, `py-6 md:py-8`; section uses `gap-6 md:gap-8`.
- **Mobile/tablet (below md):** PlanCard stacks (grid-cols-1); section remains single column with responsive gap.
- **Background:** 70vh min-height and blurred radial shapes; accent bar scales with `h-12 md:h-16` and `left-[-12px] md:left-[-16px]`.
