# Enrollment Business Logic — Validation Checklist

## 1. Plan selection persists
- **State:** `enrollment.state.selectedPlan` and `enrollment.state.planType` ("roth" | "traditional" | null).
- **Derivation:** `planType` is set when `setSelectedPlan(planId)` is called: roth_401k/roth_ira → "roth", traditional_401k → "traditional".
- **Draft:** Draft loads `selectedPlanId`; initial state derives `planType` via `planTypeFromPlanId(selectedPlan)`.
- **Continue disabled:** ChoosePlan uses `primaryDisabled={selectedPlan == null}`.

## 2. Contribution updates graph live
- **Deferred updates:** `useDeferredValue(contributionPct)` drives `derivedForProjection` and `projectionBaseline`, so the chart updates without blocking the slider.
- **Compound growth:** `projectionCalculator` uses monthly compounding: `balance = balance * (1+r)^12 + annualContribution` per year.

## 3. Employer match logic correct
- **Rule:** 100% match up to 6% of salary (configurable via `assumptions.employerMatchCap`).
- **Implementation:** `utils/retirementCalculations.ts` → `calculateEmployerMatch(salary, percent, matchCap)`; `enrollment/logic/contributionCalculator.ts` → same logic (min of contribution and cap, then × match rate).

## 4. AI insight changes dynamically
- **Engine:** `enrollment/logic/contributionInsightEngine.ts` → `getContributionInsight(percent, salary, employerMatchCap)`.
- **Rules:** &lt; cap → warning; = cap → positive; &gt; 15% → aggressive (positive); ≥ 20% → high-impact (positive).
- **UI:** Contribution page header shows a tone-based banner (warning / positive / neutral) using i18n keys from `enrollment.insight.*`.

## 5. Slider animates smoothly
- **Fill:** CSS `transition: background 0.2s ease-out` on the contribution range input so the track fill animates when value changes.
- **Calculations:** Deferred via `useDeferredValue` so heavy work doesn’t block interaction.

## 6. Tax split always totals 100%
- **Validation:** `utils/retirementCalculations.ts` → `validateTaxSplit(alloc)` returns `{ valid, error? }`; used on Contribution page for allocation validity and error message.
- **Rebalance:** Existing `sourceAllocationEngine` (`rebalanceSources`, etc.) keeps preTax + roth + afterTax = 100%; error message uses `t("enrollment.allocationMustTotal")`.

## 7. No hardcoded values added
- **Copy:** All user-facing strings use i18n keys (`enrollment.*`, `enrollment.insight.*`).
- **Numbers:** Slider min/max (1–25), match cap (6), etc. come from constants or `state.assumptions`; tokens used for colors (`var(--enroll-brand)`, `var(--color-warning)`, etc.).

## 8. Wizard routing unaffected
- **Routes:** No route or path changes. Contribution still redirects to `/enrollment/choose-plan` when `selectedPlanId` is null.
- **Footer:** EnrollmentFooter and step flow unchanged.

---

## Files touched

| File | Purpose |
|------|--------|
| `src/utils/retirementCalculations.ts` | `calculateMonthlyContribution`, `calculateEmployerMatch`, `calculateAnnualContribution`, `calculateProjectedValue`, `validateTaxSplit`, `normalizeTaxSplit` |
| `src/enrollment/logic/contributionInsightEngine.ts` | `getContributionInsight(percent, salary, employerMatchCap)` → `{ titleKey, messageKey, tone }` |
| `src/enrollment/context/EnrollmentContext.tsx` | `planType` in state; `planTypeFromPlanId`; set in `setSelectedPlan` and `getInitialEnrollmentState` |
| `src/enrollment/logic/projectionCalculator.ts` | Monthly compound growth: `yearGrowthFactor`, `currentBalance * growthFactor + annualContribution` |
| `src/pages/enrollment/Contribution.tsx` | Deferred projection, insight banner, `validateTaxSplit`, chart path animation, slider fill transition, i18n prompt |
| `src/locales/en/enrollment.json` | `enrollment.insight.*`, `whatIsContributionPrompt` |
