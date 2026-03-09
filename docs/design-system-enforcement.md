# Design System Enforcement Report

**Date:** March 8, 2025  
**Scope:** Second refactor pass — Button variants, token-only styling, no Tailwind color overrides on buttons.

---

## 1. Button Component Updated

**File:** `src/components/ui/Button.tsx`

- **Variants:** `primary` | `secondary` | `outline` | `ghost`
- **Primary:** Uses `background: var(--color-primary)`, `hover: var(--color-primary-hover)`, `active: var(--color-primary-active)` (via CSS classes `button button--primary`).
- **Secondary:** `background: var(--color-background-secondary)`, `border: var(--color-border)`.
- **Outline:** Transparent background, `border: 2px solid var(--color-border)`, hover uses `var(--color-background-secondary)`.
- **Ghost:** Transparent, hover uses `var(--color-surface-elevated)`.
- **Rule:** `className` may only add layout/size (e.g. `h-11 px-5`); no Tailwind color classes (e.g. `bg-green-600`, `text-blue-500`) are allowed on Button usage.

**File:** `src/index.css`

- Replaced single `.button` block with variant-specific blocks:
  - `.button--primary`, `.button--secondary`, `.button--outline`, `.button--ghost`
- All use CSS variables only; no hex or Tailwind palette.

---

## 2. Buttons Fixed (variant system, no hardcoded colors)

| Location | Change |
|----------|--------|
| **HeroSection** (Dashboard hero CTA) | Primary CTA: was `<motion.button className="... bg-emerald-600 hover:bg-emerald-700 ...">` → **`<Button variant="primary">`**. Link primary CTA uses class **`button button--primary`**. Secondary CTA: **`<Button variant="outline">`**. No Tailwind color classes on either. |
| **DashboardHeader** | "Start Enrollment" link: was `className="... bg-emerald-600 hover:bg-emerald-700 ..."` → **`className="button button--primary ..."`** (link styled as primary button). |
| **EnrollmentConfirmModal** | "Got It!" was `<button className="... from-blue-600 to-cyan-600 ...">` → **`<Button variant="primary">`** with i18n `t("enrollment.gotIt")`. |

All other button usages that were already using `<Button>` remain; no new Tailwind color overrides were added to Button `className` props.

---

## 3. Hardcoded Colors Removed (replaced with CSS variables)

| File | Before | After |
|------|--------|-------|
| **HeroSection** | Badge: `bg-emerald-500/10`, `border-emerald-500/20`, `text-emerald-700`, dot `bg-emerald-500` | `bg-[var(--color-success)]/10`, `border-[var(--color-success)]/20`, `text-[var(--color-success)]`, dot `bg-[var(--color-success)]` |
| **ContributionLayoutV2** | Match card: `bg-green-50 border-green-200` | `bg-[var(--color-success)]/10 border-[var(--color-success)]/30` |
| **AllocationBySourceCard** | Chip: `bg-blue-500/5`, `text-[#364153]`, `hover:bg-blue-500/10` | `bg-[var(--color-primary)]/5`, `text-[var(--color-text-primary)]`, `hover:bg-[var(--color-primary)]/10` |
| **InvestmentSummaryCard** | Edit button: `border-[#c6d2ff] text-[#432dd7] hover:bg-indigo-50` | `border-[var(--color-border)] text-[var(--color-primary)] hover:bg-[var(--color-background-secondary)]` |
| **EnrollmentConfirmModal** | Bullet dot: `bg-blue-500`; top bar: `from-blue-500 via-cyan-500 to-indigo-500` | Bullet: `bg-[var(--color-primary)]`; bar: `bg-[var(--color-primary)]` |
| **InvestmentStrategyCard** | Allocation bars: `bg-blue-500`, `bg-emerald-500` | `bg-[var(--color-primary)]`, `bg-[var(--color-success)]` |
| **Stepper** | Step circle: `bg-green-500`, `bg-[#2563EB]`, `bg-gray-200`, `text-gray-500/900/400`; connector: `bg-green-500`, `bg-gray-200` | `bg-[var(--color-success)]`, `bg-[var(--color-primary)]`, `bg-[var(--color-background-tertiary)]`, `text-[var(--color-text-primary)]` / `text-[var(--color-text-secondary)]`, `text-[var(--color-text-inverse)]` |
| **InsightCards** | Employer match: `bg-emerald-100`, `text-emerald-600`, progress bar `bg-emerald-500`; Growth: `bg-blue-100`, `text-blue-600` | `bg-[var(--color-success)]/10`, `text-[var(--color-success)]`, bar `bg-[var(--color-success)]`; `bg-[var(--color-primary)]/10`, `text-[var(--color-primary)]` |
| **PersonalizePlanModal** | Timeline dot: `bg-blue-500`; badge: `bg-blue-500/10 text-blue-600` | `bg-[var(--color-primary)]`, `bg-[var(--color-primary)]/10 text-[var(--color-primary)]` |
| **AllocationSummaryChart** | Valid badge: `bg-emerald-50 border-emerald-200`, `text-emerald-600/700`, `text-gray-400/600` | `bg-[var(--color-success)]/10 border-[var(--color-success)]/30`, `text-[var(--color-success)]`, `text-[var(--color-text-secondary)]` |
| **ContributionQuickSelect** | Active preset: `!bg-green-100 !border-green-400 !text-green-700`; default: `bg-white hover:bg-gray-50 border-gray-200`, `text-gray-700` | Active: `!bg-[var(--color-success)]/15 !border-[var(--color-success)]/50 !text-[var(--color-success)]`; default: `bg-[var(--color-surface)]`, `hover:bg-[var(--color-background-secondary)]`, `border-[var(--color-border)]`, `text-[var(--color-text-primary)]` |
| **LocationStep** | Cost badges: `bg-green-100 text-green-700`, `bg-yellow-100 text-yellow-700`, `bg-red-100 text-red-700`; Check icon: `text-[#2563EB]` | `bg-[var(--color-success)]/10 text-[var(--color-success)]`, `bg-[var(--color-warning)]/10 text-[var(--color-warning)]`, `bg-[var(--color-danger)]/10 text-[var(--color-danger)]`; `text-[var(--color-primary)]` |

No logic was changed; only class names and inline styles were updated to use design tokens.

---

## 4. Components Standardized

| Component / area | Standardization |
|------------------|-----------------|
| **Button** | Single source of truth: four variants (primary, secondary, outline, ghost), all driven by CSS variables in `index.css`. No Tailwind color classes in default or variant styles. |
| **Dashboard hero CTA** | Primary CTA uses `<Button variant="primary">` (or Link with `button button--primary`). Secondary uses `<Button variant="outline">`. |
| **Header CTA** | Start Enrollment uses Link with `button button--primary` (same look as primary button). |
| **Enrollment success modal** | Got It uses `<Button variant="primary">` and i18n key `enrollment.gotIt`. |
| **Stepper / InsightCards / AllocationSummaryChart / ContributionQuickSelect / LocationStep / PersonalizePlanModal / InvestmentStrategyCard / AllocationBySourceCard / InvestmentSummaryCard** | All updated to use `var(--color-primary)`, `var(--color-success)`, `var(--color-warning)`, `var(--color-danger)`, `var(--color-text-primary)`, `var(--color-text-secondary)`, `var(--color-background-secondary)`, `var(--color-border)`, `var(--color-surface)` instead of Tailwind color classes or hex. |

---

## 5. Files Touched (production code only)

- `src/components/ui/Button.tsx` — variant API and class mapping
- `src/index.css` — button variant styles (tokens only)
- `src/components/pre-enrollment/HeroSection.tsx` — Button + tokens for badge
- `src/components/dashboard/DashboardHeader.tsx` — primary link style
- `src/enrollment-v2/components/EnrollmentConfirmModal.tsx` — Button + tokens + i18n
- `src/enrollment-v2/components/ContributionLayoutV2.tsx` — success token for match card
- `src/enrollment-v2/components/AllocationBySourceCard.tsx` — primary token for chip
- `src/enrollment-v2/components/InvestmentSummaryCard.tsx` — tokens for Edit button
- `src/enrollment-v2/components/InvestmentStrategyCard.tsx` — primary/success for bars
- `src/enrollment-v2/components/AllocationSummaryChart.tsx` — success/text tokens for badge
- `src/enrollment-v2/components/ContributionQuickSelect.tsx` — success/surface/border/text tokens
- `src/components/ui/Stepper.tsx` — success/primary/background/text tokens
- `src/components/pre-enrollment/InsightCards.tsx` — success/primary tokens
- `src/components/enrollment/PersonalizePlanModal.tsx` — primary token for timeline/badge
- `src/features/enrollment/personalize/LocationStep.tsx` — success/warning/danger/primary tokens

**Excluded:** `src/figma-dump/`, `src/pages/AgentModeLab.tsx` (prototype), and any other reference or lab code.

---

## 6. Verification Checklist

- [x] Button defines variants: primary, secondary, outline, ghost
- [x] Primary uses `var(--color-primary)` and `var(--color-primary-hover)`
- [x] No Tailwind color classes (`bg-*-*`, `text-*-*`) on Button usage; only variant + layout/size in `className`
- [x] Dashboard hero primary CTA uses `<Button variant="primary">` or Link with `button button--primary`
- [x] Hardcoded Tailwind colors and hex replaced with CSS variables in listed components
- [x] No business logic or routing changes

---

*End of design system enforcement report.*
