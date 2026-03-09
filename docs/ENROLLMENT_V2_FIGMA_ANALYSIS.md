# Enrollment V2 — Figma Dump Analysis (Phase 1)

**Date:** March 3, 2026  
**Scope:** `src/figma-dump/Retirement Plan Selections App` — UI reference only.

---

## 1. Step components (Figma)

| Step | Figma component | Layout / structure | Notes |
|------|-----------------|--------------------|--------|
| 0 | Plan selection in `App.tsx` + `PlanCard` | Grid of plan cards, header with title/description, “Compare” CTA | Plan options from `planOptions` in App |
| 1 | `ContributionStep` | Slider + %/dollar toggle, source split (preTax/roth/afterTax), projection chart, presets | Receives `salary`, `selectedPlan` (string) |
| 2 | `AutoIncreaseStep` | Education screen then settings: frequency, presets (1%/2%/3%), chart comparison | Receives `currentContribution`, `salary`, `selectedPlan` |
| 3 | `InvestmentStep` | Portfolio cards (aggressive/growth/moderate/conservative/income), allocation pie, charts | Receives `currentContribution`, `salary`, `selectedPlan`, `userAge` |
| 4 | `RetirementReadinessStep` | Readiness score, improvement cards (contribution, auto-increase, employer match), CTA | Receives `currentContribution`, `salary`, `userAge`, `onNext` |
| 5 | `ReviewStep` | Summary cards (plan, projected balance, contribution), fund allocation, terms checkbox, success modal | Receives `selectedPlan`, `currentContribution`, `salary`, `userAge`, `onEdit(step)` |

---

## 2. Layout structure (Figma App)

- **Root:** Single `App.tsx` — no URL routing; step index in `useState(0)`.
- **Step indicator:** `<StepIndicator steps={steps} currentStep={currentStep} />` — horizontal steps with circles and labels.
- **Content:** One `currentStep === n` block per step; no `Outlet` or route-based rendering.
- **Navigation:** In-App Back/Continue buttons calling `setCurrentStep`; no `navigate()` or pathname.

---

## 3. Local state (to discard / replace with context)

| Location | State | Replace with |
|----------|--------|--------------|
| App | `currentStep`, `selectedPlanId`, `showEditDetails` | Route + `useEnrollment()` (selectedPlan), remove showEditDetails |
| App | `planOptions` (hardcoded array) | plansService / context |
| ContributionStep | `contributionMode`, `percentage`, `monthlyDollar`, `sources`, `isModifyingSplit` | `useEnrollment()` (contributionType, contributionAmount, sourceAllocation, etc.) |
| AutoIncreaseStep | Local enable/skip, frequency, preset, % | `useEnrollment().state.autoIncrease` + setters |
| InvestmentStep | Selected portfolio, local allocation | `useEnrollment().state.investmentProfile` + setInvestmentProfile |
| RetirementReadinessStep | `selectedImprovements` | Optional local UI state only; data from context |
| ReviewStep | `agreedToTerms`, `showSuccessModal` | Local UI only; summary from context |

---

## 4. Hardcoded data (to discard)

- **App:** `planOptions` (Roth 401k, Traditional 401k with fixed text), `userDetails` (age 31, salary 45000, etc.).
- **ContributionStep:** `contributionLimit = 23000`, `employerMatchRate = 6`, `payPeriodsPerYear = 12`, `yearsToRetire = 8`, `annualReturn = 0.07`.
- **AutoIncreaseStep:** `frequencies`, `increasePresets`, `yearsToProject = 10`, `annualReturn = 0.07`, `employerMatchRate = 6`, `autoIncreaseRate = 2`, `maxCap = 15`.
- **InvestmentStep:** `portfolioOptions` (aggressive/growth/moderate/conservative/income with colors, allocations, icons).
- **RetirementReadinessStep:** `employerMatch = 3%`, retirement age 65, `projectedValue` denominator `4000000`, improvement list (contribution +3%, auto-increase 1%, maximize match) with fixed copy.
- **ReviewStep:** `employerMatch = 3%`, age 65, same denominator, `fundAllocations` (S&P 500, Bond, International, Real Estate with fixed %).

Replace with: `plansService`, `EnrollmentContext` (salary, assumptions, contribution, autoIncrease, investmentProfile), enrollment logic (e.g. `deriveContribution`, existing calculators), and existing constants where applicable.

---

## 5. Local routing logic (discard)

- No routes: step switching via `setCurrentStep` and Back/Continue in App.
- No `window.location` or `navigate` in Figma app.
- V2 must use React Router paths and `EnrollmentFooter` (or V2 footer using same logic with V2 step paths); no local step index for navigation.

---

## 6. Duplicated UI components (do not copy)

- **Figma:** `src/app/components/ui/*` — button, card, badge, slider, dialog, etc. (Radix-based).
- **Production:** Use `src/components/ui/*` (Button, card, Input, Modal, etc.) and existing enrollment components. Do not copy `figma-dump` UI folder.

---

## 7. Style files that conflict with our theme

- **`theme.css`:** Defines `:root` and `.dark` CSS variables (e.g. `--background`, `--primary`, `--radius`) and `@theme inline` Tailwind mapping. Overlaps with our `theme/tokens.css` and `theme/dark.css`; do not import into main app.
- **`tailwind.css`:** Uses `@source '../**/*.{js,ts,jsx,tsx}'` and tw-animate; Figma-specific. Do not import; use existing Tailwind config and global CSS.
- **Figma base styles:** Custom slider (`.custom-slider`), `--font-size`, chart colors. Reimplement with our tokens (e.g. `var(--color-primary)`, `var(--slider-track-unfilled)`) where needed; do not import Figma theme.

---

## 8. Components safe for UI extraction (reference only)

- **StepIndicator** → New `StepIndicatorV2` (layout/styling only; steps from config, current from path).
- **PlanCard** → New `PlanCardV2` (layout/benefits; selection and data from context/plansService).
- **ContributionStep** layout (slider, %/dollar, source split, chart) → `ContributionPage` + optional `ContributionCardV2`.
- **AutoIncreaseStep** layout → `AutoIncreasePage` (education + settings; state from context).
- **InvestmentStep** cards/charts → `InvestmentPage` + `InvestmentCardV2` (profile from context).
- **RetirementReadinessStep** → `ReadinessPage` (score and improvements from context/derived).
- **ReviewStep** → `ReviewPage` (summary from context; terms/success modal local).

---

## 9. Logic to discard

- All `useState` for wizard data (plan, contribution, auto-increase, investment).
- All hardcoded plan list, user details, limits, match %, return %, denominators.
- Step index–based rendering and in-App Back/Continue (replace with route + footer).
- `alert()` help text (replace with existing Core AI / help patterns).
- Figma-specific `AskAIButton` wiring; use existing Core AI / HelpSectionCard where applicable.

---

## 10. UI components to reuse from `/components/ui`

- **Button** — `components/ui/Button.tsx`
- **Card** — `components/ui/card.tsx`
- **Input** — `components/ui/Input.tsx`
- **Modal** — `components/ui/Modal.tsx`
- **Switch** — `components/ui/Switch.tsx`
- **label** — `components/ui/label.tsx`
- **HelpSectionCard** — `components/ui/HelpSectionCard.tsx`
- **SectionHeadingWithAccent** — `components/ui/SectionHeadingWithAccent.tsx` (if needed for headings)

Use existing enrollment primitives (e.g. `EnrollmentPageContent`, `EnrollmentFooter`) where layout matches; for V2 add only V2-specific pieces (e.g. step config, optional footer step-path override) without duplicating the design system.
