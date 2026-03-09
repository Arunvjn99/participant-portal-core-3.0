# Personalize Plan Modal – Upgrade Validation Checklist

**Component:** `src/components/enrollment/PersonalizePlanModal.tsx`  
**Related:** `utils/personalizeCalculations.ts`, `data/usStates.ts`, `enrollment/logic/personalizeInsights.ts`  
**Date:** 2025-03-03

---

## Phase 1 – Step 1 (Age) logic and slider

| # | Item | Status |
|---|------|--------|
| 1 | `calculateCurrentAge(dateOfBirth)` used; age derived via useMemo only | ☐ |
| 2 | `calculateYearsToRetire` and `calculateRetirementYear` used for summary/timeline | ☐ |
| 3 | Retirement age clamped 32–75; slider min = max(32, currentAge + 1) | ☐ |
| 4 | If retirementAge ≤ currentAge: Continue disabled, validation message (i18n) shown | ☐ |
| 5 | Slider value in sync with +/- buttons and typed value; no thumb offset | ☐ |
| 6 | Slider updates use requestAnimationFrame (or sync) for smooth UI | ☐ |
| 7 | Slider has aria-valuemin, aria-valuemax, aria-valuenow, aria-invalid when invalid | ☐ |
| 8 | Static “Most people retire at 58” replaced with dynamic age insight (getAgeInsight) | ☐ |
| 9 | Age insight shows early / standard / longevity message per rules; i18n keys | ☐ |

---

## Phase 2 – Step 2 (Location) full dataset and insight

| # | Item | Status |
|---|------|--------|
| 1 | All 50 US states in `data/usStates.ts` (name, abbreviation, costIndex, incomeTax, climate, retirementPopularityScore) | ☐ |
| 2 | Search filters full list; partial match on name and abbreviation | ☐ |
| 3 | Selection and search field stay in sync (select updates both; blur resolves) | ☐ |
| 4 | Location insight (getLocationInsight) shown below selection when state selected | ☐ |
| 5 | Insight rules: tax-friendly (none), cost warning (high), popular (score > 7); i18n | ☐ |

---

## Phase 3 – Step 3 (Savings) AI engine

| # | Item | Status |
|---|------|--------|
| 1 | `getSavingsInsight({ age, retirementAge, savings })` with benchmark = age × 10000 | ☐ |
| 2 | Behind (<50%), on track (50–120%), strong (>120%); dynamic insight card | ☐ |
| 3 | Insight updates live as user types; savings input debounced 300 ms | ☐ |
| 4 | All insight titles/messages use i18n keys | ☐ |

---

## Phase 4 – State architecture

| # | Item | Status |
|---|------|--------|
| 1 | Single reducer; state shape includes dateOfBirth, retirementAge, retirementLocation, savingsAmount | ☐ |
| 2 | currentAge derived via useMemo from dateOfBirth only; no duplicated age state | ☐ |
| 3 | No duplicated state; derived values only via useMemo | ☐ |

---

## Phase 5 – Performance and safety

| # | Item | Status |
|---|------|--------|
| 1 | Heavy calculations (insights, filter) memoized | ☐ |
| 2 | No unnecessary re-renders | ☐ |
| 3 | Dark mode: wizard uses CSS tokens (no inline theme conditionals) | ☐ |
| 4 | All new insight messages use i18n keys; no hardcoded strings | ☐ |

---

## Phase 6 – Validation (manual)

| # | Item | Status |
|---|------|--------|
| 1 | Step 1: Slider sync – moving slider updates big number and +/-; typing in range stays in sync | ☐ |
| 2 | Step 1: Retirement age cannot be ≤ current age (Continue disabled + message) | ☐ |
| 3 | Step 2: All 50 states searchable; partial match works | ☐ |
| 4 | Step 2: Location insight changes when selecting different states (tax/cost/popular) | ☐ |
| 5 | Step 3: Savings insight updates live as user types; debounce does not break UX | ☐ |
| 6 | Dark mode: wizard and insight cards use theme tokens | ☐ |
| 7 | Language switch (en ↔ es): all step and insight text updates | ☐ |
| 8 | No routing regression: View My Plan → `/enrollment/choose-plan` | ☐ |

---

## Deliverables

- [x] `utils/personalizeCalculations.ts` – age and retirement helpers, clamp, slider min
- [x] `data/usStates.ts` – full 50 states with costIndex, incomeTax, climate, retirementPopularityScore
- [x] Insight logic: `getAgeInsight`, `getLocationInsight`, `getSavingsInsight` in `enrollment/logic/personalizeInsights.ts`
- [x] Updated `PersonalizePlanModal.tsx` – reducer state, Step 1/2/3 wired to calculations and insights
- [x] i18n keys in `enrollment.personalizePlan` (en + es for new insight and step2MatchCount)
- [x] This validation checklist
