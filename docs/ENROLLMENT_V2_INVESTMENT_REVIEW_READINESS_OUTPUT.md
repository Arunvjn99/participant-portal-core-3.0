# Force Extraction — Investment, Review, Readiness (UI Only) — Output

## 1. Files created

| File | Purpose |
|------|--------|
| `docs/ENROLLMENT_V2_INVESTMENT_REVIEW_READINESS_ANALYSIS.md` | STEP 1 analysis: Figma state/logic to remove, data sources for V2 |
| `src/enrollment-v2/components/SummarySectionV2.tsx` | Reusable summary block with optional Edit link (layout only) |
| `src/enrollment-v2/components/AllocationCardV2.tsx` | Asset allocation bars: title, optional Edit, list of label + percent + bar |
| `src/enrollment-v2/components/InvestmentLayoutV2.tsx` | Investment step layout: header, AI recommendation slot, profile cards grid |
| `src/enrollment-v2/components/ReviewLayoutV2.tsx` | Review step layout: plan overview, readiness, contributions, auto-increase, allocation, terms, confirm, success modal |
| `src/enrollment-v2/components/ReadinessLayoutV2.tsx` | Readiness step layout: score circle, status badge, improvement cards |

**Pages updated (not created):**

| File | Change |
|------|--------|
| `src/enrollment-v2/pages/InvestmentPage.tsx` | Uses `InvestmentLayoutV2`; profile options from risk 1–5; `setInvestmentProfile` from `useEnrollment()` |
| `src/enrollment-v2/pages/ReviewPage.tsx` | Uses `ReviewLayoutV2`; all data from `useEnrollment()`; Edit links = `ENROLLMENT_V2_STEP_PATHS[1..4]`; local UI state only: `agreedToTerms`, `showSuccessModal` |
| `src/enrollment-v2/pages/ReadinessPage.tsx` | Uses `ReadinessLayoutV2`; score from `estimatedRetirementBalance` / (salary * 20); improvements from context (auto-increase off, low contribution) |

---

## 2. Figma logic removed (not recreated in V2)

- **InvestmentStep:** `selectedPortfolio`, `isEditingAllocation`, `fundAllocations`, `tempAllocations`, `portfolioOptions`, `getRecommendedPortfolio(age)`, allocation handlers, local projection loop, mock portfolios.
- **ReviewStep:** `agreedToTerms` / `showSuccessModal` moved to page as UI-only state; hardcoded `annualContribution`, `employerMatch`, `projectedValue`, `currentScore`, `fundAllocations` removed; all values from context.
- **RetirementReadinessStep:** `selectedImprovements`, hardcoded `improvements`, `potentialScore`, local projection math removed; score from existing `estimatedRetirementBalance`; improvements derived from context (no mock list).

---

## 3. Mapping: Figma component → V2 component

| Figma | V2 component | Data source |
|-------|--------------|-------------|
| InvestmentStep (header, AI block, portfolio grid) | `InvestmentLayoutV2` | `useEnrollment().state.investmentProfile`, `setInvestmentProfile`; profile options = risk 1–5 labels |
| InvestmentStep (fund allocation card) | Not replicated | No fund-level allocation in core; investment = profile only. Source allocation (preTax/roth/afterTax) shown on Review. |
| ReviewStep (plan, readiness, contributions, auto-increase, allocation, terms, confirm, modal) | `ReviewLayoutV2` | `useEnrollment()` (state, monthlyContribution, estimatedRetirementBalance); Edit → `ENROLLMENT_V2_STEP_PATHS` |
| RetirementReadinessStep (score circle, improvements) | `ReadinessLayoutV2` | `useEnrollment()`; score = f(estimatedRetirementBalance, salary); improvements from state (auto-increase, contribution) |
| Summary blocks with Edit | `SummarySectionV2` | Props: title, editHref, children |
| Asset distribution bars | `AllocationCardV2` | Props: title, editHref, items (label, percent) |

---

## 4. Confirmations

- **No new state store created.** Only existing `EnrollmentContext` / `useEnrollment()` used.
- **No draft store modified.** `loadEnrollmentDraft` / `saveEnrollmentDraft` used as before; no new draft fields.
- **No `enrollmentStepPaths` modified.** V2 uses `ENROLLMENT_V2_STEP_PATHS` from `src/enrollment-v2/config/stepConfig.ts` only.
- **No AI files modified.** No changes to planEnrollmentAgent or other AI.
- **No theme files modified.** No imports from Figma CSS or theme; styling uses semantic tokens (`var(--surface-1)`, `var(--text-primary)`, `var(--brand-primary)`, etc.) and existing Tailwind.

---

## 5. Responsive + dark mode

- Layouts use Tailwind breakpoints (`sm`, `md`, `lg`) and semantic tokens only (no hardcoded hex).
- Dark mode: tokens resolve via `.dark` root (e.g. `--surface-1`, `--text-primary`, `--border-subtle`, `--brand-primary`).
- Confirmed: no `var(--...)` introduced that don’t exist in existing theme/tokens.

---

## 6. Routes

- Existing routes unchanged: `/enrollment-v2/investment`, `/enrollment-v2/readiness`, `/enrollment-v2/review` (under `EnrollmentLayoutV2`, `ProtectedRoute`).
- Old enrollment routes not removed.

---

## 7. Edit button mapping (Review page)

| Section | Edit target | Path |
|---------|-------------|------|
| Retirement Readiness | Readiness step | `ENROLLMENT_V2_STEP_PATHS[4]` = `/enrollment-v2/readiness` |
| Contributions | Contribution step | `ENROLLMENT_V2_STEP_PATHS[1]` = `/enrollment-v2/contribution` |
| Auto-Increase | Auto-increase step | `ENROLLMENT_V2_STEP_PATHS[2]` = `/enrollment-v2/auto-increase` |
| Investment / Asset distribution | Investment step | `ENROLLMENT_V2_STEP_PATHS[3]` = `/enrollment-v2/investment` |
