# Enrollment Flow — Verification and Cleanup Report

**Target folders:** `src/features/enrollment`, `src/enrollment-v2`, `src/components/enrollment`  
**Steps in scope:** Contribution, Auto Increase, Readiness, Review

---

## 1. Figma imports

**Finding:** No production code imports from `src/figma-dump`.

- **features/enrollment:** All imports are from `../../../enrollment`, `../../../enrollment-v2`, `../../../components/ui`, `../config/stepConfig`, etc. No figma-dump.
- **enrollment-v2:** No imports from figma-dump. One comment in `ContributionProjectionCard.tsx` references "figma" (design reference only).
- **components/enrollment:** No imports from figma-dump. Uses of the word "figma" are **CSS class names** (e.g. `contrib-tax-figma`, `projection-card-figma`) and **prop names** (`variant="figma"`) for styling variants, not module imports.

**Conclusion:** Figma dump remains reference-only. No change required.

---

## 2. Production logic integrity

**Finding:** Unchanged.

- **router.tsx / stepConfig.ts:** Not under target folders; step paths and order remain as in `ENROLLMENT_V2_STEP_PATHS` (choose-plan → contribution → auto-increase → investment → readiness → review).
- **EnrollmentContext / EnrollmentFooter / Supabase / draft:** All step pages still use `useEnrollment`, `loadEnrollmentDraft`, `saveEnrollmentDraft`; handlers and navigation come from pages and context. No logic was moved into layout components.
- **Calculations:** Contribution (useContributionStore, contributionCalculator), Auto Increase (calculateProjection, state.autoIncrease), Readiness (score from estimatedRetirementBalance/incomeGoal), Review (data from context) — all unchanged.

**Conclusion:** No fixes required.

---

## 3. UI token usage

**Inconsistencies:**

| Location | Issue | Fix |
|----------|--------|-----|
| **ReviewLayoutV2.tsx** | Sticky card: `boxShadow: "0 4px 20px rgba(0,0,0,0.08)"` | Use `var(--enroll-elevation-2)` (or `var(--shadow-medium)`) |
| **ReviewLayoutV2.tsx** | Confirm button: `color: "var(--contrib-footer-primary-color, #fff)"`, `boxShadow: "0 4px 14px rgba(0,0,0,0.15)"` | Use `var(--contrib-footer-primary-color)` and `var(--contrib-footer-primary-shadow)` (no raw #fff or rgba) |
| **ReadinessLayoutV2.tsx** | "Not Ready" icon container: `background: "rgba(239, 68, 68, 0.15)"` | Use `rgb(var(--color-danger-rgb) / 0.15)` |
| **AutoIncreaseLayoutV2.tsx** | "Potential Missed Savings" icon container: `background: "rgba(239, 68, 68, 0.15)"` | Use `rgb(var(--color-danger-rgb) / 0.15)` |

**Conclusion:** Replace raw colors with the tokens above in the four updated step files only. Other enrollment-v2 components (e.g. PlanCard, NeedInvestmentHelpCard) contain raw colors but were not part of this migration; leave them for a separate pass.

---

## 4. Layout consistency

**Finding:**

- **Container:** `EnrollmentPageContent` already provides `max-w-6xl mx-auto px-6 py-8`. Step layout components render inside that.
- **ContributionLayoutV2** root is `w-full mx-auto space-y-6 min-w-0`; **Review, Readiness, Auto Increase** use `max-w-6xl mx-auto space-y-6`. So only Contribution does not repeat `max-w-6xl`.

**Fix:** Add `max-w-6xl` to ContributionLayoutV2 root so all four steps use the same root pattern (`max-w-6xl mx-auto ...`). This keeps behavior correct (parent already constrains width) and aligns the four steps.

- **Cards:** All use `rounded-2xl`, `border border-[var(--enroll-card-border)]`, `background: var(--enroll-card-bg)`, `shadow-sm` where applicable. Consistent.
- **Grid:** All use `grid grid-cols-1 lg:grid-cols-3 gap-6`, main `lg:col-span-2`, side `lg:col-span-1`. Consistent.

**Conclusion:** One change: add `max-w-6xl` to ContributionLayoutV2 root.

---

## 5. Component reuse

**Finding:** No problematic duplication.

- **AI insight:** Contribution and Auto Increase use shared `AIInsightBanner` (enrollment-v2). Auto Increase also has short inline insight lines in configure; these are one-line copy and could stay as-is.
- **Cards:** Each step uses the appropriate summary/insight components (ContributionProjectionCard, PlanSummary, ReviewSummaryCard, etc.). No duplicate card markup that should be extracted.

**Conclusion:** No change required.

---

## 6. Responsiveness

**Finding:** Layouts are responsive.

- Grid: `grid-cols-1 lg:grid-cols-3`; no fixed widths on main content.
- ContributionLayoutV2, AutoIncreaseLayoutV2, ReadinessLayoutV2, ReviewLayoutV2 use `min-w-0` where needed and flex/grid that stacks on small screens.

**Conclusion:** No change required.

---

## 7. Summary of fixes applied

1. **ReviewLayoutV2:** Replace raw boxShadow and color with `--enroll-elevation-2`, `--contrib-footer-primary-color`, `--contrib-footer-primary-shadow`.
2. **ReadinessLayoutV2:** Replace `rgba(239, 68, 68, 0.15)` with `rgb(var(--color-danger-rgb) / 0.15)`.
3. **AutoIncreaseLayoutV2:** Same danger-tint replacement.
4. **ContributionLayoutV2:** Add `max-w-6xl` to root div for consistency with other steps.

All changes are UI/token/layout only; no logic or imports are modified.
