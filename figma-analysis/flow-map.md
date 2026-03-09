# Figma Retirement Plan Selections App — Flow Map

**Reference app:** `src/figma-dump/Retirement Plan Selections App`  
**Entry:** Single-page wizard with step state (no router).  
**Screenshots:** `figma-analysis/screenshots/` (01–06).

---

## Screen hierarchy and user flow

| Step | Screen | Key content |
|------|--------|-------------|
| 0 | **Plan selection** | Choose Your Retirement Plan; Roth 401(k) vs Traditional 401(k); benefits; “View Detailed Comparison”; Back / Continue to Contribution |
| 1 | **Contribution** | How much to contribute; % or $; presets (4% Safe, 6% Match, 15% Aggressive); slider; Edit Contribution Split (Pre-tax / Roth / After-tax); AI insight; retirement projection chart; Back / Continue to Auto Increase |
| 2 | **Auto Increase** | Keep it Steady vs Grow Gradually; projected values; “Enable Auto Increase”; “Skip for Now”; Back / Continue to Investment |
| 3 | **Investment** | Choose Your Investment Strategy; AI recommendation; Fund Allocation (Roth, Pretax, After Tax) with Edit; risk profiles (Aggressive Growth, Growth, Moderate, Conservative, Income Focus); Allocation Summary; Need Expert Help (Chat / Connect); Back / Continue to Readiness |
| 4 | **Readiness** | Retirement Readiness Score; score gauge; Understanding Your Score; Annual Funding Summary (Income Goal, Contributions, Savings Gap); AI Recommendations with “Apply” (Increase Contributions, Auto-Increase, Maximize Match); Back / Continue to Review |
| 5 | **Review** | You’re Almost Done; plan overview; Your Contributions; Auto-Increase (ADI); Asset Class Distribution; terms checkbox; Edit per section; Confirm Enrollment (disabled until terms agreed); Back / Continue to Next |

---

## Flow order

```
Landing (Plan) → Contribution → Auto Increase → Investment → Readiness → Review → Confirm
```

- **Navigation:** Back (disabled on step 0); Continue to [Next step] (disabled on last step).
- **No URL routing:** Step index in React state only.

---

## Key components (Figma app)

- **StepIndicator** — horizontal stepper (Plan, Contribution, Auto Increase, Investment, Readiness, Review).
- **PlanCard** — plan option with benefits, “Ask AI”, Select/Selected.
- **ContributionStep** — percentage/dollar mode, presets, slider, source split (preTax/roth/afterTax), projection chart.
- **AutoIncreaseStep** — two options (Keep it Steady / Grow Gradually), projected values, Enable / Skip.
- **InvestmentStep** — AI recommendation, fund allocation by source, risk portfolio cards, allocation summary, help CTA.
- **RetirementReadinessStep** — score gauge, funding summary, AI recommendation cards with “Apply”.
- **ReviewStep** — summary cards with Edit, terms checkbox, Confirm Enrollment.

---

## Business logic (from Figma code)

### Contribution

- **Modes:** percentage vs dollar; sync: `yearly = salary * pct / 100` or `yearly = monthly * 12`.
- **Presets:** set percentage (e.g. 4, 6, 15) and derive monthly.
- **Source split:** preTax / roth / afterTax; enabled flags; percentages sum to 100; when one source changes, redistribute among others; single enabled → 100%.
- **Employer match:** `min(salary * matchRate / 100, yearlyContribution)`.
- **Projection:** year-by-year balance with annual return (e.g. 7%); chart: contributions vs total value.

### Auto Increase

- **Options:** no increase vs enable auto-increase; projected value differs by scenario.
- **Copy:** “Skip for Now” vs “Enable Auto Increase”.

### Investment

- **Risk profiles:** Aggressive Growth, Growth, Moderate, Conservative, Income Focus (stocks/bonds/other %, target return, age range).
- **Recommendation:** by age (e.g. &lt;35 → aggressive).
- **Fund allocation:** by source (Roth, Pretax, After Tax); “Edit Allocation” opens editor.
- **Allocation summary:** reflects selected profile / custom allocation.

### Readiness

- **Score:** derived from projected value (e.g. `min(round(projectedValue / 4000000 * 100), 100)`).
- **Funding summary:** Income Goal, Annual Contributions, Savings Gap (goal − contributions).
- **AI recommendations:** list with impact ($) and score delta; “Apply” toggles or applies recommendation.

### Review

- **Terms:** checkbox “I agree to the terms…”; Confirm Enrollment disabled until checked.
- **Edit:** per section (Plan, Contribution, Auto Increase, Investment) jumps back to that step index.
- **Summary:** plan name, retirement age, contribution breakdown, projected value, auto-increase, asset class distribution.

---

## Calculations

- **Yearly contribution:** `salary * contributionPercent / 100` or `monthlyDollar * 12`.
- **Employer match:** `min(salary * matchRate / 100, yearlyContribution)`.
- **Projected value (simplified):** `(annualContribution + employerMatch) * yearsToRetire * (1 + rate)^(years/2)` or year-by-year compound.
- **Readiness score:** `min(round(projectedValue / 4000000 * 100), 100)`.
- **Savings gap:** `incomeGoal - annualContributions`.

---

## Validations

- Contribution: percentage/dollar within limits; source split totals 100%.
- Investment: allocation total 100% (in editor).
- Review: terms must be agreed to enable Confirm.

---

## Modals / interactions

- **Plan:** “Ask AI about this plan”; “View Detailed Comparison” (no modal in reference).
- **Contribution:** “Edit Contribution Split” (inline or modal for source %).
- **Investment:** “Edit Allocation” (modal/sheet for fund allocation); “Chat with AI Advisor” / “Connect with Advisor”.
- **Readiness:** “Apply” on each AI recommendation.
- **Review:** Success modal after Confirm Enrollment.

---

## Charts

- **Contribution:** Area chart — “Your Contributions” and “Total Value” over years.
- **Investment:** Donut/pie for allocation (stocks/bonds/other or by fund).
- **Readiness:** Circular score gauge (e.g. 0–100).
- **Review:** Asset class distribution bars.

---

## Toggles / controls

- Contribution: percentage vs dollar mode.
- Source toggles: Pre-tax, Roth, After-tax enabled/disabled.
- Auto Increase: Keep it Steady vs Enable.
- Review: terms checkbox.
