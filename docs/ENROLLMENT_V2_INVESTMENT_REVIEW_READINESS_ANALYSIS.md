# Force Extraction — Investment, Review, Readiness (UI Only) — Analysis

## STEP 1 — Figma file analysis

### 1. InvestmentStep

**File:** `src/figma-dump/Retirement Plan Selections App/src/app/components/InvestmentStep.tsx`

**Local state (remove):**
- `selectedPortfolio` — string id (aggressive/growth/moderate/conservative/income)
- `isEditingAllocation` — boolean
- `fundAllocations` — { roth: { funds, percentage }, pretax: { funds, percentage }, afterTax: { funds, percentage } }
- `tempAllocations` — same shape for edit buffer

**Allocation logic (remove):**
- `handleEditAllocation`, `handleSaveAllocation`, `handleCancelAllocation`
- `updateAllocation(source, field, value)` — local percentage/funds tweaks
- `totalAllocation`, `isValidAllocation` checks

**Mock data (remove):**
- `portfolioOptions` — 5 hardcoded portfolios (aggressive, growth, moderate, conservative, income) with name, risk, riskLevel, targetReturn, description, allocation { stocks, bonds, other }, ageRange, yearsToRetirement, color, gradient, icon
- `getRecommendedPortfolio(age)` — returns id by age brackets

**Projection (remove):**
- `projectionData` loop (annualContribution, portfolio.targetReturn, balance)
- `finalBalance` from that loop

**UI structure to keep (layout only):**
- Header: title "Choose Your Investment Strategy", subtitle
- Left column (lg:col-span-2): AI insight card → Fund Allocation card (Roth / Pretax / After-tax rows with label, badge, funds count, allocation %)
- Right column: Portfolio cards grid (each card: icon, name, risk, description, target return / age range / timeline, allocation bar, "Recommended" badge) + projection chart
- No step navigation (footer handles)

**Replace with:** useEnrollment() — state.investmentProfile, setInvestmentProfile, setInvestmentProfileCompleted. Profile = { riskTolerance, investmentHorizon, investmentPreference }. No mock portfolios; show simple risk-level options that map to profile.

---

### 2. ReviewStep

**File:** `src/figma-dump/Retirement Plan Selections App/src/app/components/ReviewStep.tsx`

**Local state (remove):**
- `agreedToTerms` — boolean
- `showSuccessModal` — boolean

**Calculations (remove):**
- `annualContribution`, `employerMatch` (salary * 3 / 100), `yearsToRetirement` (65 - userAge), `projectedValue` (compound formula), `currentScore` (projectedValue / 4000000 * 100)

**Mock data (remove):**
- `fundAllocations` — hardcoded [{ name: "S&P 500 Index", allocation: 48.2, color }, ...]

**Step navigation (remove):**
- `onEdit(step: number)` — in Figma calls setCurrentStep(step) in App. In V2 must navigate to ENROLLMENT_V2_STEP_PATHS by index.

**UI structure to keep (layout only):**
- Header: "You're Almost Done!", subtitle
- Plan overview card: 3 cells (Selected Plan, Projected by Age 65, Annual Contribution) + disclaimer
- Grid 2 cols: Retirement Readiness card (circular score, "Needs Attention", years to retirement, projected value, Edit → readiness) | Contributions card (total rate, per year, breakdown, Edit → contribution)
- Second row: Auto-Increase card (Edit → auto-increase) | Asset class distribution card (Edit → investment)
- Terms checkbox + Confirm button
- Success modal (confetti, message, close)

**Replace with:** useEnrollment() for all display values. Edit links → ENROLLMENT_V2_STEP_PATHS[stepIndex]. Terms/submit in page; modal state can stay in page (UI only).

---

### 3. RetirementReadinessStep

**File:** `src/figma-dump/Retirement Plan Selections App/src/app/components/RetirementReadinessStep.tsx`

**Local state (remove):**
- `selectedImprovements` — string[]

**Calculations (remove):**
- `annualContribution`, `employerMatch` (3%), `yearsToRetirement` (65 - userAge), `projectedValue`, `currentScore` (projectedValue / 4000000 * 100)
- `potentialScore` (currentScore + sum of improvement scoreIncrease)

**Mock data (remove):**
- `improvements` — array of { id, icon, title, description, impact, scoreIncrease, impactType } (contribution +3%, auto-increase 1%, maximize match)

**UI structure to keep (layout only):**
- Header: "Your Retirement Readiness Score", subtitle
- Grid: left — Readiness score card (large circular progress, score, "out of 100"); right — improvement cards (each: icon, title, description, impact, "High/Medium Impact")
- Optional CTA / next

**Replace with:** useEnrollment() + existing projection (e.g. calculateProjection or derived estimatedRetirementBalance). Score derived in page from projection; improvement list from props or minimal static list (no hardcoded $).

---

### 4. Summary

| Figma component       | Local state / logic to remove                         | Data source in V2              |
|-----------------------|--------------------------------------------------------|---------------------------------|
| InvestmentStep        | selectedPortfolio, fundAllocations, tempAllocations, portfolioOptions, getRecommendedPortfolio, projection loop, allocation handlers | useEnrollment().investmentProfile, setInvestmentProfile |
| ReviewStep            | agreedToTerms, showSuccessModal, annualContribution, employerMatch, yearsToRetirement, projectedValue, currentScore, fundAllocations, onEdit(step) | useEnrollment(); Edit → ENROLLMENT_V2_STEP_PATHS |
| RetirementReadinessStep | selectedImprovements, annualContribution, employerMatch, projectedValue, currentScore, improvements array, potentialScore | useEnrollment() + projection from /enrollment/logic |

No new state store, no draft changes, no enrollmentStepPaths changes, no AI/theme changes.
