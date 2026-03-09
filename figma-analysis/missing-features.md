# Missing Features — Figma vs Participant Portal

Comparison of the Figma Retirement Plan Selections App with the existing participant portal enrollment V2 flow.

---

## Areas compared

- **Enrollment:** Plan, Contribution, Auto Increase, Investment, Readiness, Review  
- **Dashboard:** Not in Figma reference (out of scope for this comparison)

---

## 1. Enrollment flow

| Feature | Figma reference | Portal V2 | Status |
|--------|------------------|-----------|--------|
| Step order | Plan → Contribution → Auto Increase → Investment → Readiness → Review | Same (ENROLLMENT_V2_STEP_PATHS) | ✅ Aligned |
| Plan selection | Roth vs Traditional; benefits; Ask AI; View Detailed Comparison | ChoosePlanPage; PlanCard; HelpDecisionCard | ✅ Present |
| Contribution | % / $; presets (4%, 6%, 15%); slider; source split (Pre-tax/Roth/After-tax); projection chart | ContributionPage; source allocation; sliders | ✅ Present |
| Auto Increase | Keep it Steady / Grow Gradually; Skip; Enable | AutoIncreasePage | ✅ Present |
| Investment | AI recommendation; fund allocation by source; risk profiles; Edit Allocation; allocation summary | InvestmentPage; portfolio state; AllocationEditorModal; chart | ✅ Present |
| Readiness | Score; Funding Summary (Income Goal, Contributions, Savings Gap); AI recommendations with **Apply** | ReadinessPage; score; improvements list; **no Apply; no Funding Summary** | ⚠️ Gaps |
| Review | Summary cards; Edit per section; terms checkbox; Confirm disabled until agreed; success modal | ReviewPage; terms; confirm; success modal; **allocation colors hardcoded** | ⚠️ Token fix |

---

## 2. Missing or different UI

- **Readiness — Funding Summary:** Figma shows an “Annual Funding Summary” (Income Goal, Annual Contributions, Savings Gap). Portal has score and recommendations but no explicit funding summary card. **Add:** optional Funding Summary block (income goal, contributions, gap) using tokens.
- **Readiness — Apply on recommendations:** Figma has “Apply” on each AI recommendation (e.g. “Increase Contributions by 3%”, “Maximize Employer Match”). Portal shows recommendations only. **Add:** optional “Apply” that navigates to the relevant step (e.g. Contribution or Auto Increase).
- **Review — Allocation colors:** Portal uses hardcoded hex for allocation items (`#3B82F6`, `#10B981`, `#F59E0B`). **Fix:** use design tokens (e.g. `var(--chart-1)`, `var(--chart-2)`, `var(--chart-3)`).

---

## 3. Missing or different logic

- **Contribution:** Source split must total 100%; redistribution when one source changes — already implemented in portal (contribution/source allocation).
- **Investment:** Allocation total 100%; validation in AllocationEditorModal — already implemented.
- **Readiness score:** Figma uses something like `min(round(projectedValue / 4000000 * 100), 100)`. Portal uses `(estimatedRetirementBalance / (salary * 20)) * 100` — different formula but same idea. No change required unless product asks for exact parity.
- **Savings gap:** Figma shows `Income Goal - Annual Contributions`. Portal does not show this explicitly. **Add:** in Readiness Funding Summary, show optional income goal and gap when desired.

---

## 4. Missing validations

- Contribution and investment validation already present (totals, limits).
- Review: Confirm disabled until terms agreed — already present.

---

## 5. Missing components (conceptual)

- **Funding Summary card:** Income Goal, Annual Contributions, Savings Gap — add to Readiness using existing Card/layout and tokens.
- **Apply button on recommendation cards:** Link/button that routes to the step that can address that recommendation (e.g. “Increase contribution” → Contribution step).

---

## 6. Interactions

- **Edit from Review:** Figma uses Edit to jump back to a step index. Portal uses Edit links with ENROLLMENT_V2_STEP_PATHS — already equivalent.
- **Modals:** Success modal on confirm — present. No other modals required for parity.

---

## 7. Charts

- Contribution projection chart — portal has or can use existing chart components.
- Investment allocation (donut/summary) — present in InvestmentPage.
- Readiness score gauge — portal uses numeric score; Figma uses circular gauge. Optional enhancement only.

---

## Implementation summary

1. **Review:** Replace hardcoded allocation colors with `var(--chart-1)`, `var(--chart-2)`, `var(--chart-3)` (or equivalent theme tokens).
2. **Readiness:** Add optional Funding Summary section (income goal, annual contributions, savings gap) using tokens.
3. **Readiness:** Add optional “Apply” action per recommendation that navigates to the relevant step (Contribution or Auto Increase).

No new design tokens; use existing `--color-*`, `--enroll-*`, `--chart-*`, and layout/typography tokens. Keep styling token-based and responsive.

---

## Implemented (post-audit)

1. **Review — Allocation colors**  
   `src/features/enrollment/review/ReviewPage.tsx`: `allocationItems` now use `var(--chart-1)`, `var(--chart-2)`, `var(--chart-3)` instead of hex. No hardcoded colors.

2. **Readiness — Funding Summary**  
   `ReadinessLayoutV2.tsx`: Added optional `fundingSummary?: { incomeGoal, annualContributions, savingsGap }`. Renders an "Annual Funding Summary" card with token-based styles (`--surface-1`, `--border-subtle`, `--text-primary`, `--text-secondary`, `--danger` for gap).  
   `ReadinessPage.tsx`: Computes and passes `fundingSummary` (incomeGoal = salary × 20, annualContributions from contribution %, savingsGap = max(0, incomeGoal − estimatedRetirementBalance)).

3. **Readiness — Apply on recommendations**  
   `ReadinessLayoutV2.tsx`: Added optional `onApplyRecommendation?: (id: string) => void`. When set, each recommendation card shows an "Apply" button (token-styled).  
   `ReadinessPage.tsx`: `onApplyRecommendation` navigates via `ENROLLMENT_V2_STEP_PATHS` — `contribution` → contribution step, `auto-increase` → auto-increase step.

**Confirmation:** No new design tokens or hardcoded colors were introduced. All new UI uses the global theme system.
