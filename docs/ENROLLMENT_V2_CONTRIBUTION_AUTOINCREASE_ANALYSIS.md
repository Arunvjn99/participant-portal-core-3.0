# Force extraction — Contribution & Auto Increase (UI only)

## STEP 1 — Analysis

### 1. ContributionStep

**File:** `src/figma-dump/Retirement Plan Selections App/src/app/components/ContributionStep.tsx`

**Local state (to remove):**
- `contributionMode` — "percentage" | "dollar"
- `percentage` — number (default 6)
- `monthlyDollar` — number (default 225)
- `sources` — `{ preTax: { enabled, percentage }, roth: { enabled, percentage }, afterTax: { enabled, percentage } }`
- `isModifyingSplit` — boolean

**Calculations (to remove / replace with existing engine):**
- `yearlyContribution`, `monthlyContribution`, `perPaycheckContribution`, `perPaycheckEmployerMatch`, `perPaycheckTotal`
- `employerMatch`, `totalAnnualContribution`
- `futureValue` (compound interest formula)
- `projectionData` — year-by-year loop for chart
- `preTaxAmount`, `rothAmount`, `afterTaxAmount`
- `handlePercentageChange`, `handleDollarChange`, `setPreset`
- `toggleSource`, `handleSourcePercentageChange` (rebalance logic)

**Mock data (to remove):**
- `contributionLimit = 23000`, `monthlyContributionLimit`
- `employerMatchRate = 6`, `payPeriodsPerYear = 12`
- `yearsToRetire = 8`, `annualReturn = 0.07`
- `salary` / `selectedPlan` from props (replace with context)

**UI structure to keep (layout only):**
- Header: title "How much would you like to contribute?", subtitle to plan
- Main grid: `grid-cols-1 lg:grid-cols-3`, left `lg:col-span-2`, right column
- Left: AI insight card → Main contribution card (title, monthly paycheck, %/$ toggle, presets 4% / 6% / 15%, slider + number input, "Building Your Future" summary, Tax Strategy section with Edit split button, Pre-tax / Roth / After-tax cards with checkbox + % + slider, visual split bar)
- Right: Retirement Projection card (projected value, area chart, legend, contributions/growth grid, disclaimer), Paycheck Impact card (You + Employer = Total, progress bar, pay periods note)
- UI components used: Button, motion, input type="range" and number, checkbox, Recharts AreaChart

---

### 2. AutoIncreaseStep

**File:** `src/figma-dump/Retirement Plan Selections App/src/app/components/AutoIncreaseStep.tsx`

**Subcomponents:** `EducationScreen`, `ConfigurationScreen`; main exports `AutoIncreaseStep` with phase state.

**Local state (to remove):**
- Main: `phase` — "education" | "configure" | "skipped"
- EducationScreen: none (but computes comparison data internally)
- ConfigurationScreen: `increaseAmount`, `maxCap`, `frequency`, `startMonth`, `showAdvanced`

**Calculations (to remove):**
- EducationScreen: `yearsToProject = 10`, `annualReturn = 0.07`, `employerMatchRate = 6`, `autoIncreaseRate = 2`, `maxCap = 15`; loop for `comparisonData`, `finalFlat`, `finalAuto`, `difference`, `monthlyImpact`
- ConfigurationScreen: `contributionLimit = 25`, `currentAge = 35`, `retirementAge = 65`, `yearsToProject = 10`, projection loop, `finalBalanceWithAuto`, `finalBalanceWithoutAuto`, `difference`, `yearsToReachCap`, etc.
- Skipped phase: inline IIFE recalculating missed savings

**Mock data / constants (to remove):**
- `frequencies` — Annually, Semi-Annually, Quarterly
- `increasePresets` — 1%, 2%, 3% with labels/colors
- All hardcoded rates, ages, limits

**UI structure to keep (layout only):**
- **Education:** Header (title, subtitle) → AI Insight banner → Main card with two columns: "Keep it Steady" (without auto) vs "Grow Gradually" (with auto), difference highlight, benefit pills, "Skip for Now" / "Enable Auto Increase"
- **Configure:** Header + ENABLED badge → Grid lg:grid-cols-3: left — Frequency card (3 options, AI insight), Increase amount card (presets, slider, input, AI insight), Max limit card (slider, input, AI insight); right — Retirement Projection (chart, without/with cards, extra savings banner, disclaimer)
- **Skipped:** Header "Auto Increase Skipped" → centered card with icon, message, "Potential Missed Savings" warning, "Reconsider" button
- UI: Button, motion, AnimatePresence, Recharts AreaChart, gradient divs, pills

---

### 3. UI components they rely on

- **ContributionStep:** Figma `./ui/button`, `motion` (motion/react), `AreaChart` (recharts), `AskAIButton` (replaced with help pattern or Core AI)
- **AutoIncreaseStep:** Figma `./ui/button`, `motion`, `AnimatePresence`, `AreaChart` (recharts)

Production: use `components/ui/Button`, `components/ui/Input`; keep Recharts for charts (already in package.json); no Figma theme or motion required (optional for animations).
