# LAYOUT AUDIT REPORT — Read-Only Analysis
**Figma reference:** https://www.figma.com/design/ydVeg09j0IRQ9y6GaIlzjs/Participants-Portal-Playground?node-id=519-4705  
**Source of truth:** Enrollment → Plans page (ChoosePlan.tsx)  
**Status:** NO CODE CHANGES — Analysis only

---

# Task Part 1 — Audit (Read-Only)

## 1.1 PLANS PAGE — Exact Layout Behavior

### DOM / Component Structure
```
DashboardLayout
├── header (DashboardHeader)
└── main.dashboard-layout__main
    └── div.flex.flex-col.gap-6.mx-auto.w-full.max-w-[1440px].px-6.lg:px-8  ← CONTAINER (in DashboardLayout.tsx)
        └── div.choose-plan  ← PAGE WRAPPER
            ├── div.enrollment-stepper-section.choose-plan__progress
            ├── div.choose-plan__content  ← GRID CONTAINER (CSS)
            │   ├── div.choose-plan__left  ← MAIN COLUMN
            │   │   └── div.choose-plan__plans
            │   └── aside.choose-plan__right  ← SIDEBAR
            └── EnrollmentFooter
```

### a) Page max-width
| Location | Value | Source |
|----------|-------|--------|
| **Content container** | `max-w-[1440px]` | DashboardLayout.tsx line 17 (inline Tailwind) |
| **Plans page itself** | None | `.choose-plan` has no max-width; inherits from parent |

**Effective max-width:** 1440px (from DashboardLayout wrapper)

### b) Horizontal padding at breakpoints
| Breakpoint | Padding | Source |
|------------|---------|--------|
| **Base (< 1024px)** | `px-6` (24px) | DashboardLayout.tsx |
| **lg (≥ 1024px)** | `lg:px-8` (32px) | DashboardLayout.tsx |

**Note:** `.dashboard-layout__main` has NO horizontal padding (was removed). All horizontal padding comes from the inner div.

### c) Grid or flex structure
| Element | Type | Columns | Gap | Breakpoint |
|---------|------|---------|-----|------------|
| **DashboardLayout inner** | Flex | N/A | `gap-6` (24px) | All |
| **.choose-plan__content** | **Grid** | `1fr` | `gap: var(--spacing-6)` (24px) | < 1024px |
| **.choose-plan__content** | **Grid** | **65fr 35fr** | `gap: var(--spacing-8)` (32px) | ≥ 1024px |
| **.choose-plan__plans** | Flex | N/A | `gap: var(--spacing-4)` (16px) | All |
| **.choose-plan__right** | Flex | N/A | `gap: var(--spacing-4)` (16px) | All |

**Plans grid at lg+:** `grid-template-columns: 65fr 35fr` — fractional, NOT fixed px.

### d) Sidebar behavior
| Property | Value | Source |
|----------|-------|--------|
| **Width** | 35fr (fluid, ~35% of container) | index.css .choose-plan__content |
| **Breakpoint** | lg (1024px) | @media (min-width: 1024px) |
| **Position** | `position: sticky` | .choose-plan__right |
| **Top offset** | `top: var(--spacing-6)` (24px) | .choose-plan__right |
| **Alignment** | `align-self: start` | .choose-plan__content |

**At 1440px container:** 35fr ≈ 504px sidebar width.  
**At 1280px container:** 35fr ≈ 448px sidebar width.

### e) Where centering happens
| Element | Centering | Mechanism |
|---------|-----------|------------|
| **Content** | Yes | `mx-auto` on DashboardLayout inner div |
| **Max-width** | 1440px | `max-w-[1440px]` on same div |
| **Page content** | Inherits | Plans page (.choose-plan) is a child; no own centering |

**Centering:** Layout-owned (DashboardLayout inner div). Page content does not add centering.

---

## 1.2 Comparison Table — Each Page vs Plans

| Page | Container | Grid/Flex | Max-width | Padding | Why it diverges from Plans |
|------|-----------|-----------|-----------|---------|----------------------------|
| **Plans** | DashboardLayout inner div | Grid 65fr 35fr (CSS) | max-w-[1440px] | px-6 lg:px-8 | **CANONICAL** |
| **Dashboard** | Same (DashboardLayout) | Grid minmax(0,1fr) 360px / 400px / 420px (Tailwind) | Same | Same | **Grid pattern differs:** Plans uses 65fr/35fr; Dashboard uses fixed px sidebar (360/400/420). Sidebar is NOT fluid. |
| **PostEnrollmentDashboard** | Same (DashboardLayout) | Grid minmax(0,1fr) 360px / 400px / 420px (Tailwind) | Same | Same | **Grid pattern differs:** Same as Dashboard. Uses fixed sidebar widths. Figma 519-4705 may specify different layout. |
| **Review** | Same (DashboardLayout) | Grid minmax(0,1fr) 360px / 400px / 420px (Tailwind) | Same | Same | **Grid pattern differs:** Same as Dashboard. Fixed sidebar, not 65fr/35fr. |
| **Contribution** | Same (DashboardLayout) | Grid **58% 1fr** (Tailwind) | Same | Same | **Grid pattern differs:** Uses percentage + fr. Sidebar is 1fr (fluid). Main is 58%. Completely different from Plans. |

### Divergence Summary
- **Container:** All pages use the same DashboardLayout wrapper ✅
- **Max-width:** All use 1440px ✅
- **Padding:** All inherit px-6 lg:px-8 ✅
- **Grid:** Plans = 65fr/35fr (CSS). Others = minmax+fixed px or %+fr ❌

**Root cause:** Plans defines grid via CSS (`.choose-plan__content`), others use inline Tailwind with different column definitions.

---

# Task Part 2 — Lock the Rules (Comments Only)

## Canonical Layout Rules (Based on Plans)

```markdown
// ========== CANONICAL LAYOUT RULES (from Plans page) ==========
// DO NOT MODIFY. These rules are the ONLY source of truth.

// 1. PAGE CONTAINER (Layout-owned, in DashboardLayout)
//    - One wrapper: mx-auto w-full max-w-[1440px] px-6 lg:px-8
//    - Centering: mx-auto
//    - Max-width: 1440px (explicit)
//    - Horizontal padding: 24px base, 32px at lg+

// 2. GRID OWNERSHIP
//    - Page owns the grid (main + sidebar columns)
//    - Layout never enforces columns
//    - Layout only: header, footer, vertical stacking, container width

// 3. DESKTOP GRID (≥1024px) — Plans pattern
//    - grid-template-columns: 65fr 35fr
//    - gap: var(--spacing-8) (32px)
//    - align-items: start
//    - Sidebar: fluid (35fr), not fixed px

// 4. SIDEBAR BEHAVIOR
//    - position: sticky
//    - top: var(--spacing-6) (24px)
//    - align-self: start

// 5. RESPONSIVE BREAKPOINTS
//    - < 1024px: Single column (grid-template-columns: 1fr), gap 24px
//    - ≥ 1024px: Two columns (65fr 35fr), gap 32px
//    - No breakpoint-specific column changes at xl/2xl for Plans

// 6. FULL-WIDTH ELEMENTS (e.g. gradient hero)
//    - Must span full width of container (max 1440px)
//    - Must align with grid edges (no extra margin)
//    - Padding from container applies
```

### If a page already matches Plans → LEAVE IT UNTOUCHED
- **Plans:** Matches (by definition). **DO NOT MODIFY.**

---

# Task Part 3 — Minimal Fix Implementation (AFTER RULES)

## 3.1 Extract Plans Container + Grid Logic

**Plans uses:**
- **Container:** Provided by DashboardLayout (already shared)
- **Grid:** CSS class `.choose-plan__content` with:
  - Base: `grid-template-columns: 1fr`, `gap: var(--spacing-6)`
  - lg+: `grid-template-columns: 65fr 35fr`, `gap: var(--spacing-8)`
- **Sidebar:** `.choose-plan__right` with `sticky`, `top: var(--spacing-6)`

**Options for reuse:**
1. **Option A:** Create a shared CSS class (e.g. `.page-grid--main-sidebar`) that mirrors `.choose-plan__content` — apply to other pages.
2. **Option B:** Add Tailwind classes `grid grid-cols-1 gap-6 lg:grid-cols-[65fr_35fr] lg:gap-8 lg:items-start` to each page — matches Plans exactly.

**Recommendation:** Option B (inline Tailwind) — no new abstractions, matches Plans grid math exactly.

## 3.2 Pages to Fix

| Page | Current Grid | Required Change |
|------|--------------|----------------|
| **Dashboard** | `lg:grid-cols-[minmax(0,1fr)_360px]` etc. | Change to `lg:grid-cols-[65fr_35fr]` |
| **Review** | Same as Dashboard | Same |
| **PostEnrollmentDashboard** | Same as Dashboard | Same |
| **Contribution** | `lg:grid-cols-[58%_1fr]` | Change to `lg:grid-cols-[65fr_35fr]` |

## 3.3 Gradient Card (Figma)

- **Review page:** Investment Goal Simulator (blue gradient) — full width within container.
- **PostEnrollmentDashboard:** Top banner (ped-banner) — full width within grid.
- **Dashboard:** HeroEnrollmentCard — full width, no grid (different layout).

**Figma 519-4705:** Post-Enrollment Dashboard. Gradient hero must match Figma spacing and width. Audit does not change component internals — only outer layout containers.

## 3.4 If Whitespace Exists After Matching

**STOP and explain WHY.** Do not guess. Possible causes:
- Header (`max-w-[1200px]`) narrower than content (`max-w-[1440px]`) → misalignment
- Conflicting padding from multiple wrappers
- Figma specifies different max-width than implementation

---

# Task Part 4 — Validation Checklist

## Desktop (1440px / 1680px / 1920px)
- [ ] No side white space unless present in Plans
- [ ] Main content aligned with header nav
- [ ] Sidebar alignment identical to Plans

## Mobile & Tablet
- [ ] Zero regressions

## Visual Parity
- [ ] Gradient hero card width & alignment matches Figma
- [ ] Section vertical rhythm preserved

## Abort Conditions
- If ANY step risks breaking a working page → ABORT and explain.
- Figma is source of truth.
- Plans page is the only implementation reference.
- Do not improve anything.
- Do not be clever.
- Match exactly.

---

# Appendix: Key Code References

## Plans (ChoosePlan.tsx)
- Lines 104–196: Structure
- Grid: `.choose-plan__content` (index.css 1445–1460)
- Sidebar: `.choose-plan__right` (index.css 1475–1486)

## DashboardLayout.tsx
- Line 17: `mx-auto w-full max-w-[1440px] px-6 lg:px-8`

## DashboardHeader.tsx
- Line 69: `max-w-[1200px] mx-auto` — **Header is 1200px, content is 1440px. Potential misalignment.**

## index.css
- Lines 242–251: `.dashboard-layout__main` (neutral, no max-width)
- Lines 1445–1460: `.choose-plan__content` (Plans grid)
- Lines 1475–1486: `.choose-plan__right` (Plans sidebar)

---

# Appendix: Header vs Content Width Mismatch

| Element | Max-width | Centering |
|---------|-----------|-----------|
| **Header (DashboardHeader)** | 1200px | mx-auto |
| **Content (DashboardLayout)** | 1440px | mx-auto |

**At 1920px viewport:**
- Header: 1200px wide, centered → 360px white space per side
- Content: 1440px wide, centered → 240px white space per side

**Result:** Content is wider than header. Left/right edges do not align. This may be intentional (header nav constrained) or a bug. Figma should define the intended behavior.

---

**END OF AUDIT**  
**No code has been modified.**
