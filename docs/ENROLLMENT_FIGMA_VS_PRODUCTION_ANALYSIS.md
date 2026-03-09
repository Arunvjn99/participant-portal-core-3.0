# Enrollment: Figma Design Reference vs Production — Analysis

**Design reference:** `src/figma-dump/Retirement Plan Selection App1`  
**Production:** `src/features/enrollment`, `src/enrollment-v2`  
**Scope:** Contribution, Auto Increase, Readiness, Review only (Choose Plan and Investment are finalized and must NOT be modified).

---

## 1. Contribution Step

### 1.1 Layout structure

| Aspect | Figma reference (`ContributionStep.tsx`) | Production (`ContributionPage` + `ContributionLayoutV2`) |
|--------|------------------------------------------|----------------------------------------------------------|
| **Page header** | Inline: left accent bar (gradient blue→purple), `h2` "How much would you like to contribute?", subtitle "to your {selectedPlan}". | `SectionHeadingWithAccent` in page; same conceptual title/subtitle. |
| **Grid** | `grid grid-cols-1 lg:grid-cols-3 gap-6`; left `lg:col-span-2`, right `space-y-6`. | Same: `lg:grid-cols-3`, main `lg:col-span-2`, side `lg:col-span-1`. |
| **Left column order** | 1) AI Insight banner, 2) Main contribution card (Set Your Contribution), 3) (no separate Tax Strategy card; it’s inside the same card). | Same: AIInsightBanner → main card (slider + Tax Strategy section inside). |
| **Right column** | 1) Retirement Projection card (chart + projected value + Contributions/Growth boxes + disclaimer), 2) Paycheck Impact card (You + Employer = Total, progress bar, pay periods text). | Same: ContributionProjectionCard then paycheck breakdown card. |

**Conclusion:** Layout and component hierarchy are already aligned. No structural migration needed.

---

### 1.2 UI differences (visual only)

- **Figma:** AI banner uses hardcoded gradient `from-purple-50 via-blue-50 to-indigo-50`, blur orb, icon in `from-purple-500 to-blue-500` box. Production uses design tokens (`--contrib-ai-banner-*`, `--enroll-*`). **Action:** Keep production tokens; optionally align gradient feel (still via tokens).
- **Figma:** Main card title row has "Ask AI" as a small button with `alert()` for tooltip. Production uses `Button` + `onAskAIContribution` (Core AI). **Action:** Keep production behavior (real AI); no copy of `alert()`.
- **Figma:** Quick presets are separate `Button` components with conditional border/background (e.g. 6% = green). Production uses `ContributionQuickSelect` with different styling. **Action:** Optional UI polish to give preset chips distinct active colors (e.g. 6% Match green) while keeping production component.
- **Figma:** Slider + numeric input: large numeric input (e.g. `text-5xl` / `text-4xl`) with blue border; "Building Your Future" box is `bg-emerald-50` with PiggyBank. Production has similar layout with enrollment tokens. **Action:** Optional typography/size alignment; keep production tokens.
- **Figma:** Tax Strategy: "Edit Contribution Split" button toggles `isModifyingSplit`; when true, button shows "Done" and has blue gradient + pulse. Production has `sourcesEditMode` and "Edit Contribution Split" / "Done". **Action:** Optional: stronger visual state for "editing" (e.g. primary-style "Done") without changing logic.
- **Figma:** Source rows: checkbox, label, per-source "Ask AI" (alert), Active dot, percentage + $/mo; when editing, slider per source. Production uses `ContributionSourceCard` with similar behavior and `onAskAI*`. **Action:** Keep production; optionally align label/checkbox layout and accent colors (preTax blue, Roth purple, afterTax emerald) to match Figma.
- **Figma:** Split bar is single row with blue/purple/emerald segments. Production has same. **Action:** None.
- **Figma:** Right side projection card shows "Projected value at age 39" (hardcoded). Production uses `yearsToRetire` and projection from context. **Action:** Do not copy hardcoded age; keep production dynamic value.
- **Figma:** Chart has two areas (contributions + value) and legend "Your Contributions" / "Total Value". Production `ContributionProjectionCard` has same. **Action:** None.

---

### 1.3 Interaction logic in the Figma design

- **Percentage ↔ dollar sync:** When percentage changes, `setMonthlyDollar` from salary; when dollar changes, `setPercentage` from salary. Production already does this via `useContributionStore` and derived state. **Do not copy:** production logic is the source of truth.
- **Presets:** `setPreset(4|6|15)` sets percentage and recomputes monthly dollar. Production `onPreset` does equivalent. **Do not copy.**
- **Source toggles:** Toggle off sets percentage to 0 and, if only one source left, sets that to 100%. Toggle on distributes evenly. Production has `onSourceEnabledChange` and `handleSourcePercentChange`; distribution may differ. **Do not copy:** keep production allocation logic (and any rounding rules).
- **Source percentage change:** Figma recalculates other sources so total stays 100% with complex distribution. Production has `handleSourcePercentChange` from store. **Do not copy:** production must remain source of truth for persistence and API.
- **Pay periods:** Figma uses `payPeriodsPerYear = 12`. Production uses `PAYCHECKS_PER_YEAR` (e.g. 26) from contribution calculator. **Do not copy:** production pay frequency is correct.

---

### 1.4 What to migrate (Contribution)

- **Optional UI only:**  
  - Preset chip active states (e.g. 6% Match green) in `ContributionQuickSelect` or layout.  
  - "Edit Contribution Split" / "Done" button more prominent when in edit mode.  
  - Per-source row colors (preTax/Roth/afterTax) to match Figma accents.  
  - Slightly larger display for the main contribution number if desired.  
- **Do not migrate:** Any calculation, state shape, pay frequency, or allocation logic from Figma; keep using EnrollmentContext, useContributionStore, contributionCalculator, and draft persistence.

---

## 2. Auto Increase Step

### 2.1 Layout structure

| Aspect | Figma reference (`AutoIncreaseStep.tsx`) | Production (`AutoIncreasePage` + `AutoIncreaseLayoutV2`) |
|--------|------------------------------------------|----------------------------------------------------------|
| **Phases** | Three phases: `education` \| `configure` \| `skipped`; `AnimatePresence` with enter/exit. | Same phases and phase-driven layout. |
| **Education** | Header (accent bar, title, subtitle) → AI Insight → main card (two-column comparison + difference strip + benefit pills + footer text). | Same: SectionHeadingWithAccent at page level; AIInsightBanner; main card with Keep it Steady / Grow Gradually, difference strip, pills, footer text. |
| **Configure** | Header with "ENABLED" badge → grid `lg:grid-cols-3`, left `lg:col-span-2` (frequency card, increase amount card, max cap card), right (projection card). | Same grid and column split; same card order. |
| **Skipped** | Centered card with icon, title, "Potential Missed Savings" red box, Reconsider button. | Same; production has `missedSavingsMessage` and "Reconsider Auto Increase". |

**Conclusion:** Structure matches. Only visual and copy details differ.

---

### 2.2 UI differences (visual only)

- **Figma:** Education AI banner uses hex gradients (`#eef2ff`, `#c6d2ff`, etc.). Production uses AIInsightBanner with tokens. **Action:** Keep tokens.
- **Figma:** Comparison cards: "Keep it Steady" / "Grow Gradually" with specific gray and green tints; RECOMMENDED badge; two-line primary button "Enable Auto Increase" + "Yes, Increase My Contributions". Production has same content and styling with enrollment tokens. **Action:** Optional micro-tweaks to match gradient/tone; do not replace tokens.
- **Figma:** Benefit pills (Only $X/mo more, Pause anytime, Fully automatic) with fixed heights and colors. Production has same three pills with tokens. **Action:** None.
- **Figma:** Configure header has gradient accent bar (emerald→blue) and "ENABLED" badge. Production has SectionHeadingWithAccent at page level and badge in layout. **Action:** Ensure badge styling is consistent (e.g. pill with success color).
- **Figma:** Frequency card has 3 options; selected shows checkmark in corner. Production has frequency buttons without checkmark. **Action:** Optional: add checkmark on selected frequency for parity.
- **Figma:** Increase amount: "Quick" presets (1%, 2%, 3% with Conservative/Recommended/Aggressive). Production has slider + numeric input only. **Action:** Optional: add quick preset chips for 1%/2%/3% in configure.
- **Figma:** Per-card AI Insight strips (e.g. for frequency, for increase amount, for max cap) with contextual copy. Production has one AI banner in education and no per-card insights in configure. **Action:** Optional: add small AI insight callouts in configure (content only; use existing AIInsightBanner or small variant) without changing logic.
- **Figma:** Max cap slider label "IRS Max" at 25%. Production uses same cap. **Action:** Optional label "IRS Max" at max end.
- **Figma:** Skipped phase: red "Potential Missed Savings" box with computed dollar amount. Production passes `missedSavingsMessage`. **Action:** Keep production (message from page); ensure styling is clear.

---

### 2.3 Interaction logic in the Figma design

- **Phase transitions:** `setPhase("education"|"configure"|"skipped")` on Enable / Skip / Reconsider. Production does the same via `onPhaseChange`; state for "enabled" is persisted in context when user continues. **Do not copy:** production owns phase and persistence.
- **Education math:** 10-year projection with flat vs auto-increase, 7% return, 6% match, 2% auto increase, 15% cap. Production uses `calculateProjection` and context assumptions. **Do not copy:** keep production projection and assumptions.
- **Configure:** Local state for `increaseAmount`, `maxCap`, `frequency`, `startMonth`, `showAdvanced`. Production drives these from `state.autoIncrease` and handlers that update context. **Do not copy:** production state and handlers are authoritative.
- **Chart data:** Figma builds projection array in configure with `increasesPerYear` from frequency. Production builds `projectionChartData` in page and passes down. **Do not copy.**

---

### 2.4 What to migrate (Auto Increase)

- **Optional UI:**  
  - Checkmark on selected frequency option.  
  - Quick presets (1% / 2% / 3%) in configure for increase amount.  
  - Short AI insight snippets in configure (frequency / amount / cap) if product wants them; use existing design system.  
  - "IRS Max" or similar label at max cap end.  
- **Do not migrate:** Phase state, projection math, frequency/increase/cap state, or any persistence; keep EnrollmentContext and projectionCalculator.

---

## 3. Readiness Step

### 3.1 Layout structure

| Aspect | Figma reference (`RetirementReadinessStep.tsx`) | Production (`ReadinessPage` + `ReadinessLayoutV2`) |
|--------|--------------------------------------------------|---------------------------------------------------|
| **Header** | Centered; title "Your Retirement Readiness Score", gradient subtitle. | SectionHeadingWithAccent (left accent) with same title and subtitle. |
| **Grid** | `grid-cols-1 lg:grid-cols-[410px_1fr]`; left = score card, right = "Not Ready" card + AI Recommendations. | `lg:grid-cols-3`; left column (score + status + understanding), right `lg:col-span-2` (Recommendations). |
| **Left card** | "Readiness Score" heading → large SVG score ring (gradient, animated) → status badge → "Understanding Your Score" → Annual Funding Summary. | Funding summary first (when present), then score circle, status pill, understanding text. Order differs. |
| **Right** | "You're Not Ready Yet" card (action required) then "AI Recommendations" list with Apply buttons. | Only "Recommendations" section with improvement cards and Apply. |

**Conclusion:** Figma has an extra "You're Not Ready Yet" / "Action Required" card and a different left-column order. Production does not have a separate "Not Ready" card.

---

### 3.2 UI differences (visual only)

- **Figma:** Score ring is SVG with gradient stroke, glow filter, animated progress (2s), sparkles and pulsing dot at progress end. Production has SVG ring with motion, 0.75s animation, no sparkles/dot. **Action:** Optional: add subtle sparkles or dot for polish; keep production animation duration if preferred.
- **Figma:** Status badge: "Needs Attention" with amber styling and pulse dot. Production has status pill with enrollment tokens. **Action:** Keep production; optional amber tone for "Needs Attention."
- **Figma:** "Understanding Your Score" is a small info block above Funding Summary. Production has understanding text below the score. **Action:** Optional: move or duplicate "Understanding" next to funding summary for hierarchy; no logic change.
- **Figma:** Annual Funding Summary: "Retirement Income Goal", "Current Annual Contributions", "Annual Savings Gap" with colored dots. Production: "Income Goal", "Annual Contributions", "Savings Gap" in a 3-column card. **Action:** Optional: align labels ("Retirement Income Goal" vs "Income Goal") and layout; keep production data source.
- **Figma:** "You're Not Ready Yet" card: red/orange gradient, "Action Required" badge, Current Gap / Time Left / Readiness stats, "Act now" tip. Production has no equivalent card. **Action:** Optional migration: add a single "Not Ready" / "Action Required" card when score is below a threshold, using existing `statusLabel` and funding summary; content only, no new logic.
- **Figma:** AI Recommendations: each item has icon, title, AI badge, impact type badge, description, impact + score increase, Apply button. Production has improvement cards with icon, title, description, impact type, Apply. **Action:** Optional: add "AI" badge and explicit "+X pts" if desired; keep production improvement list and `onApplyRecommendation` navigation.

---

### 3.3 Interaction logic in the Figma design

- **Score:** `currentScore = min(100, round((projectedValue / 4000000) * 100))`. Production uses `estimatedRetirementBalance` and `incomeGoal` (e.g. salary * 20). **Do not copy:** production formula and context are source of truth.
- **Improvements:** Figma uses a fixed list (contribution, auto-increase, employer match) with hardcoded impact and scoreIncrease. Production builds list from state (e.g. no auto-increase → suggest it; low contribution → suggest increase). **Do not copy:** keep production dynamic list and navigation.
- **Apply:** Figma Apply does nothing (no navigation). Production Apply calls `onApplyRecommendation(id)` and navigates to the right step. **Do not copy:** keep production behavior.

---

### 3.4 What to migrate (Readiness)

- **Optional UI:**  
  - "You're Not Ready Yet" / "Action Required" card when score is low (e.g. &lt; 70), using existing `statusLabel` and funding summary; no new calculations.  
  - Score ring: optional sparkles or end dot; keep production animation.  
  - Funding summary labels and layout alignment.  
  - Recommendation cards: optional "AI" and "+X pts" display if data exists.  
- **Do not migrate:** Score formula, income goal, improvement list logic, or Apply behavior; keep ReadinessPage and EnrollmentContext.

---

## 4. Review Step

### 4.1 Layout structure

| Aspect | Figma reference (`ReviewStep.tsx`) | Production (`ReviewPage` + `ReviewLayoutV2`) |
|--------|------------------------------------|---------------------------------------------|
| **Header** | "You're Almost Done! 🎉" + subtitle. | SectionHeadingWithAccent with same idea (e.g. "You're Almost Done!"). |
| **Top block** | Single "Plan Overview" card: gradient strip (Your Plan, Retirement Age) then horizontal flow (Annual Contribution → Growth ~7% APY → Projected Value). | PlanSummary (full-width) with cells (Selected Plan, Projected by Age X, Annual Contribution); no horizontal flow. |
| **Summary grid** | `md:grid-cols-2`: Readiness card, Contributions card; then second row: Auto-Increase card, Investment allocation card. | `lg:grid-cols-3`, left `lg:col-span-2`: two rows of 2 cards (Readiness, Contribution; AutoIncrease, Investment). Same conceptual blocks. |
| **Terms + Confirm** | Checkbox + label, then full-width Confirm button. | Right column `lg:col-span-1`: sticky card with Final confirmation, checkbox, Confirm button. |

**Conclusion:** Figma uses a single plan overview card with a horizontal "flow" (Contribution → Growth → Projected Value). Production uses a single PlanSummary with three cells and separate summary cards. Edit links and confirm block are similar in purpose.

---

### 4.2 UI differences (visual only)

- **Figma:** Plan overview is one card with header strip (Your Plan, Retirement Age) and a flow: Annual Contribution (purple) → "Growth ~7% APY" connector → Projected Value (emerald). Production uses PlanSummary (gradient, 3 cells, disclaimer). **Action:** Optional: introduce a "flow" visual (contribution → growth → projected) inside or above PlanSummary for visual hierarchy; keep PlanSummary data from context.
- **Figma:** Readiness card: small circular score (SVG), "Needs Attention" badge, years to retirement, projected value, Edit. Production ReadinessSummary has same. **Action:** None.
- **Figma:** Contributions card: Total Rate + Per Year in gradient box, then Your Contribution / Employer Match rows. Production ContributionSummary has same. **Action:** None.
- **Figma:** Auto-Increase card: +X% per year, Y% cap, progress bar "Starting at … Reaching 15% in N years". Production AutoIncreaseSummary has same. **Action:** None.
- **Figma:** Investment card: Asset class bars (Stocks, Bonds, Real Estate) with percentages. Production InvestmentSummary has allocation items. **Action:** None.
- **Figma:** Terms in a white card; Confirm button full-width below. Production: terms + confirm in a sticky right card. **Action:** Keep production sticky card; optional full-width confirm on small screens.

---

### 4.3 Interaction logic in the Figma design

- **Values:** All from props (selectedPlan, currentContribution, salary, userAge). Production gets same from ReviewPage via useEnrollment and derived data. **Do not copy.**
- **onEdit(step):** Figma uses numeric step index. Production uses ENROLLMENT_V2_STEP_PATHS and edit links to routes. **Do not copy:** keep production routing.
- **Success modal:** Figma shows modal with confetti, "What Happens Next" list. Production has EnrollmentConfirmModal. **Action:** Optional: add "What Happens Next" copy or list inside existing modal; no logic change.

---

### 4.4 What to migrate (Review)

- **Optional UI:**  
  - Plan overview: optional visual "flow" (contribution → growth → projected) using existing plan/contribution/projected data; keep PlanSummary and context.  
  - Success modal: optional "What Happens Next" section in EnrollmentConfirmModal.  
- **Do not migrate:** Data sources, edit routing, terms/confirm logic, or success modal close behavior.

---

## 5. Cross-cutting

### 5.1 Slider behavior

- **Figma:** Uses `custom-slider` class; track as linear-gradient (filled vs unfilled); no explicit thumb size in the snippet. Production uses `contrib-slider-v2` with enrollment tokens and consistent thumb. **Action:** Keep production sliders and tokens; no logic from Figma.
- **Numeric input + slider:** Both keep value in sync. Production already does. **Do not copy.**

### 5.2 Calculations and preview logic

- **Figma:** Uses local state and inline formulas (e.g. compound interest, employer match, projection arrays). Production uses contributionCalculator, projectionCalculator, and EnrollmentContext. **Do not copy any calculation or projection logic from Figma.**

### 5.3 State transitions

- **Contribution:** Figma uses local `useState` for mode, percentage, dollar, sources, isModifyingSplit. Production uses useContributionStore and EnrollmentContext. **Do not copy.**  
- **Auto Increase:** Figma uses local phase and configure state. Production uses phase in page + state.autoIncrease in context. **Do not copy.**  
- **Readiness:** Figma uses static improvements and no real Apply. Production uses dynamic improvements and navigation. **Do not copy.**  
- **Review:** Figma uses local agreedToTerms and showSuccessModal. Production same. **Do not copy:** keep production confirm and modal flow.

### 5.4 Card hierarchy and grid

- Production already follows a clear hierarchy: page → SectionHeadingWithAccent, then main content grid with cards. Figma uses similar grids (3 columns for Contribution/Review, 2-column or custom for Readiness). **Action:** Only optional tweaks (e.g. Readiness left column width or order) for visual balance; no structural change required.

### 5.5 Spacing and typography

- Figma uses Tailwind (e.g. `space-y-6`, `gap-6`, `text-3xl`, `text-sm`). Production uses design tokens and Tailwind. **Action:** Optional: align heading sizes and spacing to Figma where it improves consistency; keep tokens for colors and borders.

---

## 6. Summary table

| Step        | UI differences to consider migrating (optional) | Logic to NOT copy |
|------------|--------------------------------------------------|-------------------|
| **Contribution** | Preset chip active colors; Edit Split button emphasis; source row accent colors; main number size. | All calculations; percentage/dollar sync; source allocation; pay frequency. |
| **Auto Increase** | Checkmark on frequency; quick presets (1/2/3%) in configure; per-card AI insights; "IRS Max" label. | Phase state; projection math; increase/cap/frequency state. |
| **Readiness**     | "Not Ready" / "Action Required" card when score low; score ring sparkles/dot; funding summary labels; AI/+pts on recommendations. | Score formula; income goal; improvement list build; Apply navigation. |
| **Review**        | Plan overview "flow" visual; "What Happens Next" in success modal. | All data; edit routing; confirm/terms logic. |

---

## 7. What production already handles (do not replace)

- **Router, stepConfig, EnrollmentFooter, EnrollmentContext:** Step order, paths, footer navigation, global state.  
- **Supabase and draft persistence:** Saving/loading draft; do not introduce local-only state that bypasses draft.  
- **Contribution:** useContributionStore, contributionCalculator, PAYCHECKS_PER_YEAR, employer match from assumptions, projection from projectionBaseline.  
- **Auto Increase:** calculateProjection with autoIncrease params, state.autoIncrease, frequency options from config.  
- **Readiness:** estimatedRetirementBalance, incomeGoal (e.g. salary * 20), dynamic improvements from state, onApplyRecommendation → navigate.  
- **Review:** planOverviewCells, allocationItems, and all summary data from context; ENROLLMENT_V2_STEP_PATHS for edit links; EnrollmentConfirmModal.

Any migration from the Figma reference should be **UI and copy only**, using existing production data and event handlers.
