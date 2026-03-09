# Enrollment Flow — UI Audit & Refactor Report

**Date:** March 2025  
**Scope:** Plan, Contribution, Auto Increase, Investment, Readiness, Review  
**Constraint:** White-label SaaS — no hardcoded colors; all styling uses existing CSS variables.

---

## 1. Files Modified

| File | Changes |
|------|--------|
| `src/components/enrollment/EnrollmentPageContent.tsx` | Uses `PageHeader` for title/subtitle; single container `max-w-6xl mx-auto px-6 py-8`; removed duplicate header markup. |
| `src/enrollment-v2/pages/ChoosePlanPage.tsx` | Replaced custom heading with `PageHeader`; removed hardcoded gradients/hex; background uses `var(--surface-1)`; added `min-w-0` on section. |
| `src/enrollment-v2/components/ContributionHeader.tsx` | Now composes `PageHeader` for consistent typography (text-3xl font-semibold, text-base subtitle). |
| `src/features/enrollment/contribution/ContributionLayoutV2.tsx` | Card backgrounds/borders use `var(--surface-1)`, `var(--border-subtle)`; grid already 12-col (col-span-8/4); section title "Set Your Contribution" → text-lg font-medium; Paycheck card token-based; "Building Your Future" callout token-based; contribution inputs use `min-w-0`, `tabular-nums`, smaller responsive text; right column `min-w-0`. |
| `src/features/enrollment/autoIncrease/AutoIncreaseLayoutV2.tsx` | Section headings (h2/h3) set to `text-lg font-medium` for consistency. |
| `src/features/enrollment/investment/InvestmentLayoutV2.tsx` | Removed duplicate in-layout title/subtitle (page header is from EnrollmentPageContent); outer background `var(--surface-1)`; grid 12-col with `min-w-0` on both columns; `SOURCE_ROW`, `defaultAllocationData`, `defaultFundLabels` use `var(--chart-1/2/3)`; "Your portfolio includes" card and list items use tokens; list items use `flex items-center gap-2`; section title "Your portfolio includes" → text-lg font-medium. |
| `src/features/enrollment/readiness/ReadinessLayoutV2.tsx` | Content title (h2) set to `text-lg font-medium`. |
| `src/features/enrollment/review/ReviewLayoutV2.tsx` | Sticky card uses `var(--surface-1)`, `var(--border-subtle)`; checkbox uses `accent-[var(--brand-primary)]` and token for border; terms label uses `var(--text-secondary)`; added `min-w-0` on sticky card. |

---

## 2. Components Created

| Component | Purpose |
|-----------|--------|
| `src/enrollment-v2/components/PageHeader.tsx` | Single typography for enrollment: title `text-3xl font-semibold tracking-tight`, subtitle `text-base`; colors from `var(--text-primary)`, `var(--text-secondary)`. |
| `src/enrollment-v2/components/EnrollmentContainer.tsx` | Layout wrapper: `max-w-6xl mx-auto px-6 py-8`. Available for use; same dimensions applied in `EnrollmentPageContent` so pages do not double-wrap. |
| `src/enrollment-v2/components/BaseCard.tsx` | Reusable card: `rounded-xl border shadow-sm p-6` with `var(--surface-1)` and `var(--border-subtle)` (no hardcoded colors). |

---

## 3. Typography Fixes Applied

- **Page title (H1):** All enrollment steps now use the same scale via `PageHeader` or `EnrollmentPageContent` (title/subtitle): `text-3xl font-semibold tracking-tight`; color `var(--text-primary)`.
- **Subtitle:** `text-base`; color `var(--text-secondary)`.
- **Section titles:** Standardized to `text-lg font-medium` where applicable (Set Your Contribution, Configure Auto Increase, Auto Increase Skipped, No Auto Increase Configured, Your portfolio includes, Readiness content title).
- **Body text:** Left at `text-sm` where already used; new/updated copy uses tokens for color.
- **ContributionHeader:** Now delegates to `PageHeader`, so Contribution step matches other steps.
- **ChoosePlanPage:** Custom gradient H1 removed; uses `PageHeader` for consistency.
- **InvestmentLayoutV2:** In-layout duplicate H1/subtitle removed; page header from parent is the single source.

---

## 4. Layout Fixes Applied

- **EnrollmentPageContent:** Inner container set to `max-w-6xl mx-auto px-6 py-8` (replacing `max-w-7xl` and variable padding) so all steps share one page container.
- **ContributionLayoutV2:** Grid already `grid-cols-1 lg:grid-cols-12 gap-8` with `lg:col-span-8` / `lg:col-span-4`; added `min-w-0` on both columns and on the wrapper to avoid overflow.
- **InvestmentLayoutV2:** Grid `grid-cols-1 lg:grid-cols-12 gap-8`, `lg:col-span-8` and `lg:col-span-4`; both columns and outer wrapper have `min-w-0`.
- **ChoosePlanPage:** Removed extra max-width wrapper; content lives in the shared container from `EnrollmentPageContent`.

---

## 5. Responsive Fixes Applied

- **Overflow:** `min-w-0` added on grid columns and key wrappers (Contribution and Investment left/right columns, Investment outer wrapper, Review sticky card, ChoosePlan section) to prevent flex/grid overflow.
- **Text:** Contribution amount inputs use `min-w-0`, `tabular-nums`, and responsive font size `text-xl md:text-2xl`; Total paycheck line uses `truncate` and `min-w-0` where needed.
- **Grid:** All two-column layouts use `grid-cols-1` at small breakpoints and `lg:grid-cols-12` with `lg:col-span-8` / `lg:col-span-4` so they stack on mobile/tablet.
- No change to breakpoint strategy (Tailwind `sm`, `md`, `lg` as already used).

---

## 6. Overflow Issues Resolved

- Contribution: Left/right columns and main wrapper have `min-w-0`; contribution inputs and Total line use `tabular-nums` / `min-w-0` / `truncate` to avoid number overflow.
- Investment: Both columns and outer layout have `min-w-0`; list items use `min-w-0` on text spans.
- Review: Sticky terms card has `min-w-0`.
- ChoosePlan: Section has `min-w-0`.
- **Not introduced:** No new `overflow-hidden` that would clip content; `break-words` applied only where already present or where long words could break layout.

---

## 7. Card & Color Token Usage

- **Cards:** Contribution main card, Paycheck Impact card, Investment "Your portfolio includes" card, Review sticky card, and Contribution "Building Your Future" callout now use only `var(--surface-1)`, `var(--surface-2)`, `var(--border-subtle)` (and existing success/brand where needed). No `bg-white`, `border-gray-200`, or hex.
- **Charts/allocations:** Review allocation segments use `var(--chart-1/2/3)`; Investment `SOURCE_ROW`, default allocation data, and fund labels use `var(--chart-1)`, `var(--chart-2)`, `var(--chart-3)`.
- **Buttons:** Not refactored to a new shared component; existing `Button` and token-based classes (e.g. `var(--brand-primary)`, `var(--surface-2)`) retained. No `bg-blue-600` or other hardcoded button colors added.
- **BaseCard:** Implemented with tokens only; can be adopted incrementally where a simple card wrapper is needed.

---

## 8. Spacing & Icon Alignment

- **Spacing:** Enrollment pages use `space-y-6` or `gap-6` for section spacing, `space-y-4` for card-internal spacing, and `gap-2` for inline elements where applicable. `EnrollmentPageContent` header uses `mb-6`.
- **Icons:** Investment "Your portfolio includes" list items updated to `flex items-center gap-2`; icon wrappers use `flex-shrink-0` and token color. Contribution AI banner and Building Your Future callout use `flex` and `gap-2` with `flex-shrink-0` on icons.

---

## 9. Screen-by-Screen Summary

| Page | H1 | Layout / Grid | Cards | Overflow | Responsive |
|------|----|----------------|-------|----------|------------|
| ChoosePlanPage | PageHeader | Single column in shared container | N/A (PlanCard, HelpDecisionCard unchanged) | min-w-0 on section | Yes |
| ContributionPage | ContributionHeader → PageHeader | 12-col, 8+4, min-w-0 | Tokens on main card + Paycheck card + callout | min-w-0, tabular-nums, truncate | Yes |
| AutoIncreasePage | title/subtitle → PageHeader | Layout unchanged | N/A | N/A | Yes |
| InvestmentPage | title/subtitle → PageHeader | 12-col, 8+4, min-w-0 | Tokens on portfolio card; chart colors tokens | min-w-0 on columns and list text | Yes |
| ReadinessPage | title/subtitle → PageHeader | Unchanged | Unchanged (already token-based) | N/A | Yes |
| ReviewPage | title/subtitle → PageHeader | Unchanged | Sticky card tokens; checkbox/label tokens | min-w-0 on sticky card | Yes |

---

## 10. What Was Not Changed

- **Business logic, stores, enrollment state:** Unchanged.
- **ThemeContext, EnrollmentContext, router, design token files, global CSS:** Unchanged.
- **EnrollmentLayoutV2 (stepper, footer):** Unchanged.
- **PlanCard, HelpDecisionCard, EnrollmentFooter, and other enrollment-v2 components:** Not refactored except where noted (ContributionHeader, Investment SOURCE_ROW/allocation colors).
- **Auto Increase "Extra Savings" card:** Still uses `text-white` / `bg-white/20` for contrast on green; could be switched to `var(--color-text-inverse)` and a token-based overlay in a follow-up if desired.

---

## 11. Confirmation

- **No new hardcoded colors:** All new or updated UI uses `var(--...)` (e.g. `--text-primary`, `--text-secondary`, `--surface-1`, `--surface-2`, `--border-subtle`, `--brand-primary`, `--chart-1`, `--chart-2`, `--chart-3`, `--success`).
- **Dark mode:** All updated styles rely on existing theme variables that switch in dark mode; no new hex or fixed Tailwind color classes for surfaces/borders/text.
- **White-label:** No new design tokens; only existing CSS variables are used.
