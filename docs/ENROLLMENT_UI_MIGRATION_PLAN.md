# Enrollment UI Migration Plan — Design Reference Integration

**Design reference:** `src/figma-dump/Retirement Plan Selection App1` (read-only; never import from here)  
**Production:** `src/features/enrollment`, `src/enrollment-v2`  
**Shared UI:** `src/components/ui` (reuse only; do not replace with Figma components)

---

## Constraints (do not modify)

| Area | Do not modify |
|------|----------------|
| **Pages** | `ChoosePlanPage`, `InvestmentPage` |
| **Routing** | `router.tsx`, `stepConfig.ts`, `ENROLLMENT_V2_STEP_PATHS` |
| **State & data** | `EnrollmentContext`, draft persistence, Supabase logic |
| **Navigation** | `EnrollmentFooter` logic, step navigation behavior, Continue/Back handlers |
| **Calculations** | All projection, contribution, readiness, and allocation logic |

**Scope of migration:** Contribution, Auto Increase, Readiness, Review — **UI and visual only**. All event handlers, state updates, and data flow remain in production.

---

## Reusable building blocks

- **From `src/components/ui`:** `Button`, `Modal`, `Input`, `label`, `card`, `SectionHeadingWithAccent`, `InsightCard` (if applicable). Use these; do not introduce new primitives from the Figma dump.
- **From `src/enrollment-v2`:** `AIInsightBanner`, `ContributionQuickSelect`, `ContributionSourceCard`, `ContributionProjectionCard`, `PlanSummary`, `ReadinessSummary`, `ContributionSummary`, `AutoIncreaseSummary`, `InvestmentSummary`, `EnrollmentConfirmModal`. These may be **updated in place** (styling, structure, optional props); do not replace with Figma copies.
- **Never:** `import ... from "src/figma-dump/..."` or any path under `figma-dump`.

---

## Phase 0: Preparation

1. **Token audit**  
   Ensure enrollment tokens in `src/theme/` (e.g. `--enroll-*`, `--contrib-*`, `--success`) cover: preset active state (e.g. “match” green), source accents (preTax/Roth/afterTax), danger for “Potential Missed Savings,” badge colors. Add only if missing; do not remove or repurpose existing tokens for non-enrollment features.

2. **Reference only**  
   Keep the Figma dump as reference. All new/updated code lives under `src/features/enrollment` and `src/enrollment-v2` (and `src/components/ui` for shared pieces). No duplication of logic from the dump.

---

## Step 1: Contribution

### 1.1 UI elements to migrate

| Element | Current | Target (visual only) |
|--------|---------|----------------------|
| Preset chips | Generic active state (green tint) | Distinct “match” state for 6% (e.g. stronger green border/background via token), other presets keep current active style. |
| Edit Contribution Split | Text button “Edit” / “Done” | When in edit mode: “Done” uses primary-style button (same handler; visual only). |
| Source rows | Single accent var per row | Align accent usage: Pre-Tax → brand/blue, Roth → accent/purple, After-Tax → success/green (already passed as `accentVar`; ensure layout uses them consistently). |
| Main contribution display | Standard size | Optional: slightly larger typography for the primary percentage/dollar value (e.g. one step up in scale) using existing tokens. |

### 1.2 Components to update

| Component | Location | Changes |
|-----------|----------|--------|
| **ContributionQuickSelect** | `src/enrollment-v2/components/ContributionQuickSelect.tsx` | Add optional “match” preset styling: accept optional `matchValue?: number` (e.g. 6). When `selectedValue === matchValue`, apply a distinct class/token (e.g. `--enroll-match-preset-bg`, `--enroll-match-preset-border`) so 6% chip is visually “recommended” without changing `onSelect` or options. |
| **ContributionLayoutV2** | `src/features/enrollment/contribution/ContributionLayoutV2.tsx` | (1) Pass `matchValue={6}` to `ContributionQuickSelect` if preset 6 exists in options. (2) Tax Strategy: when `sourcesEditMode === true`, render “Done” as `<Button variant="primary">` (or equivalent from `components/ui/Button`); when false, keep current “Edit Contribution Split” button. Same `onToggleEdit` handler. (3) Optional: increase class for the main contribution number (e.g. `text-4xl` → `text-5xl` on large screens) if design calls for it. |
| **ContributionSourceCard** | `src/enrollment-v2/components/ContributionSourceCard.tsx` | No API change. Ensure each source uses the correct `accentVar` (callers already pass it). Optionally add a small left border or dot using `accentVar` for clearer hierarchy. |

### 1.3 Components that must remain unchanged

- **ContributionPage** (`src/features/enrollment/contribution/ContributionPage.tsx`): No changes to state, `useEnrollment`, `useContributionStore`, `loadEnrollmentDraft`/`saveEnrollmentDraft`, or navigation.
- **EnrollmentContext**, **useContributionStore**, **contributionCalculator**, **projectionCalculator**: No changes.
- **ContributionProjectionCard**, **AIInsightBanner**: Only optional token/class tweaks for consistency; no prop or behavior changes required for this step.

### 1.4 Interaction patterns to recreate visually

- **Preset chips:** User still clicks a chip → `onSelect(value)`; only the active and “match” chip styling change.
- **Edit Split:** User still clicks “Edit Contribution Split” / “Done” → `onToggleEdit()`; “Done” looks like a primary action when active.
- **Source rows:** Checkbox, slider (in edit mode), Ask AI — all handlers unchanged; visual hierarchy and accent colors aligned with design.

### 1.5 Logic that must remain from production

- Percentage ↔ dollar sync and all contribution math.
- Source allocation (enabled, percentage, redistribution) from store/context.
- Pay frequency (e.g. 26 pay periods) and employer match from assumptions.
- Draft save/load and step navigation.

---

## Step 2: Auto Increase

### 2.1 UI elements to migrate

| Element | Current | Target |
|--------|---------|--------|
| Frequency options | Three buttons, no checkmark | Add checkmark (e.g. Check icon) on the selected frequency option only. |
| Increase amount | Slider + numeric input only | Add quick preset chips: 1%, 2%, 3% (labels optional: Conservative / Recommended / Aggressive). Clicking a chip calls existing `onIncreaseAmountChange`. |
| Max cap slider | Min/max labels only | Add “IRS Max” (or similar) label near the 25% end of the slider (e.g. right side or tooltip). |
| Configure cards | No per-card AI insight | Optional: add a small AI insight strip below card title for frequency, increase amount, and max cap (content from copy; use existing `AIInsightBanner` or a compact variant with same tokens). |
| Skipped phase | “Potential Missed Savings” box | Keep current `missedSavingsMessage` and red box; ensure styling is clear (danger token, icon optional). |

### 2.2 Components to update

| Component | Location | Changes |
|-----------|----------|--------|
| **AutoIncreaseLayoutV2** | `src/features/enrollment/autoIncrease/AutoIncreaseLayoutV2.tsx` | (1) **Frequency:** In the frequency card, for the selected option, render a small checkmark (e.g. `Check` from lucide-react) in the corner. Same `onFrequencyChange`. (2) **Increase amount:** Above or beside the slider, add three preset buttons (1%, 2%, 3%); onClick calls `onIncreaseAmountChange(1)`, `onIncreaseAmountChange(2)`, `onIncreaseAmountChange(3)`. Style active state with existing tokens. (3) **Max cap:** Next to “5%” or at the slider’s max end, add a short label “IRS Max” (or product-approved copy). (4) **Optional:** In each configure card (frequency, increase, max cap), add a single line or small block of AI insight text (prop or constant); use same visual style as `AIInsightBanner` but compact (e.g. smaller padding, same icon/color tokens). (5) **Skipped:** No logic change; ensure “Potential Missed Savings” uses `--danger` and is readable. |

### 2.3 Components that must remain unchanged

- **AutoIncreasePage**: No changes to phase state, `onPhaseChange`, `state.autoIncrease`, `calculateProjection`, or navigation.
- **EnrollmentContext**, **projectionCalculator**, step config: No changes.

### 2.4 Interaction patterns to recreate visually

- **Frequency:** User selects an option → `onFrequencyChange(id)`; selected option shows checkmark.
- **Increase amount:** User can use slider, numeric input, or new preset chips; all call `onIncreaseAmountChange`.
- **Skipped:** “Reconsider Auto Increase” still calls `onPhaseChange("education")`; “Potential Missed Savings” remains presentational (message from page).

### 2.5 Logic that must remain from production

- Phase (education / configure / skipped) and persistence.
- All projection and auto-increase math (increase %, max cap, frequency).
- Chart data and comparison values from page/context.

---

## Step 3: Readiness

### 3.1 UI elements to migrate

| Element | Current | Target |
|--------|---------|--------|
| Left column order | Funding summary first (if present), then score ring, status, understanding | Optional: reorder to match Figma (score ring first, then status, then “Understanding your score,” then Funding Summary) for visual hierarchy; or keep order and only add the “Not Ready” card. |
| “Not Ready” card | Not present | When `statusLabel` indicates low readiness (e.g. “Needs Attention” or score &lt; 70), show a single card: “You’re Not Ready Yet” or “Action Required” with short copy and key stats (e.g. Current Gap, Time Left) from existing `fundingSummary` / props. No new calculations. |
| Score ring | Gradient ring, 0.75s animation | Optional: subtle sparkles or a small dot at the progress end; keep animation duration. |
| Recommendation cards | Icon, title, description, impact type, Apply | Optional: add “AI” badge and “+X pts” when `scoreIncrease` is provided (already in `ReadinessImprovementCard`); ensure layout stays consistent. |

### 3.2 Components to update

| Component | Location | Changes |
|-----------|----------|--------|
| **ReadinessLayoutV2** | `src/features/enrollment/readiness/ReadinessLayoutV2.tsx` | (1) **Not Ready card:** When `statusLabel === "Needs Attention"` (or a new optional prop `showNotReadyCard?: boolean`), render a card above or below the recommendations section: title “You’re Not Ready Yet” / “Action Required,” body using `fundingSummary` (savings gap, optional time left if passed). Use existing card styling and danger/warning tokens. (2) **Order:** Optionally reorder left column to: score ring → status pill → understanding text → Funding Summary. (3) **Score ring:** Optional small dot or decoration at progress end (CSS or small SVG); keep motion duration. (4) **Recommendations:** Already support `scoreIncrease` and impact; ensure “+X pts” and optional “AI” badge are visible when data exists. |

### 3.3 Components that must remain unchanged

- **ReadinessPage**: No changes to score formula, `estimatedRetirementBalance`, `incomeGoal`, `improvements` list logic, or `onApplyRecommendation` (navigation).
- **EnrollmentContext**: No changes.

### 3.4 Interaction patterns to recreate visually

- **Apply:** Still calls `onApplyRecommendation(card.id)`; no change.
- **Not Ready card:** Purely informational; no new actions or navigation.

### 3.5 Logic that must remain from production

- Score = f(estimatedRetirementBalance, incomeGoal).
- Dynamic improvements list (e.g. enable auto-increase, increase contribution) and Apply navigation.

---

## Step 4: Review

### 4.1 UI elements to migrate

| Element | Current | Target |
|--------|---------|--------|
| Plan overview | PlanSummary: 3 cells (plan, projected age, annual contribution) | Optional: add a “flow” strip below or within PlanSummary: “Annual Contribution” → “Growth ~7% APY” → “Projected Value” using existing data (contribution from context, growth copy, projected value from context). Visual only; no new state. |
| Summary cards | Readiness, Contribution, Auto-Increase, Investment with Edit links | Keep structure; ensure card hierarchy and “Edit” link styling are consistent (e.g. same icon, underline or chevron). |
| Success modal | EnrollmentConfirmModal with nextSteps | Modal already supports `nextSteps`. Ensure ReviewPage passes `nextSteps` (or leave default) and optional success title/message; no logic change. |
| Confirm button | Full-width in sticky card | Keep; optional: on small screens ensure full-width and prominence. |

### 4.2 Components to update

| Component | Location | Changes |
|-----------|----------|--------|
| **PlanSummary** | `src/enrollment-v2/components/PlanSummary.tsx` | Optional: add an optional prop `flowSteps?: Array<{ label: string; value: string }>` (e.g. `[{ label: "Annual Contribution", value: "$X" }, { label: "Growth ~7% APY", value: "—" }, { label: "Projected Value", value: "$Y" }]`). When provided, render a horizontal flow (e.g. flex with arrows or connectors) below the 3-cell grid. ReviewPage would compute and pass this from existing context data. |
| **ReviewLayoutV2** | `src/features/enrollment/review/ReviewLayoutV2.tsx` | (1) If PlanSummary supports flow, pass `flowSteps` from props (ReviewPage computes from planOverviewCells / contribution / projected value). (2) Ensure summary cards use consistent “Edit” styling (already use editHref). (3) No change to terms, confirm, or modal open/close. |
| **ReviewPage** | `src/features/enrollment/review/ReviewPage.tsx` | Optional: compute `flowSteps` for PlanSummary (contribution total, “Growth ~7% APY,” projected value) and pass to layout; pass `nextSteps` to EnrollmentConfirmModal if copy differs from default. |
| **EnrollmentConfirmModal** | `src/enrollment-v2/components/EnrollmentConfirmModal.tsx` | Already has `nextSteps`; no change unless copy updates. |

### 4.3 Components that must remain unchanged

- **ReviewPage** logic: All data from `useEnrollment`, edit links from `ENROLLMENT_V2_STEP_PATHS`, confirm and modal state.
- **Router**, **stepConfig**, **EnrollmentContext**: No changes.

### 4.4 Interaction patterns to recreate visually

- **Edit links:** Still navigate to the correct step; only ensure visual consistency (e.g. “Edit” + ChevronRight).
- **Confirm:** Same `onConfirm`, terms checkbox, disabled state.
- **Success modal:** Same `onCloseSuccess`; content can be tuned via props.

### 4.5 Logic that must remain from production

- All summary data from context; edit routing; terms and confirm flow; success modal close.

---

## Implementation order (recommended)

1. **Phase 0** — Token audit; add any missing enrollment tokens.
2. **Contribution** — ContributionQuickSelect match preset; ContributionLayoutV2 Edit/Done button and optional display size; ContributionSourceCard accent consistency.
3. **Auto Increase** — Frequency checkmark; increase-amount presets (1/2/3%); IRS Max label; optional per-card AI insight; skipped phase styling check.
4. **Readiness** — Not Ready card; optional left-column order and score ring polish; recommendation card badges.
5. **Review** — Optional PlanSummary flow; confirm nextSteps/copy if needed; summary card Edit styling consistency.

---

## Verification checklist (per step)

- [ ] No imports from `src/figma-dump` or any path under `figma-dump`.
- [ ] No changes to EnrollmentContext, router, stepConfig, EnrollmentFooter behavior, Supabase, or draft persistence.
- [ ] No changes to ChoosePlanPage or InvestmentPage.
- [ ] Event handlers (onSelect, onPhaseChange, onApplyRecommendation, onConfirm, etc.) unchanged; only UI and optional props added.
- [ ] All new or updated components use existing design tokens and `src/components/ui` where applicable.
- [ ] Contribution: useContributionStore and contribution math untouched.
- [ ] Auto Increase: phase and projection logic untouched.
- [ ] Readiness: score and improvements logic untouched.
- [ ] Review: data and edit routing untouched.

---

## Summary

| Step | UI focus | Components to update | Logic to preserve |
|------|----------|----------------------|-------------------|
| **Contribution** | Preset chip styling (match), Edit/Done emphasis, source accents, display size | ContributionQuickSelect, ContributionLayoutV2, optional ContributionSourceCard | Store, context, calculator, draft, navigation |
| **Auto Increase** | Frequency checkmark, 1/2/3% presets, IRS Max label, optional AI strips, skipped styling | AutoIncreaseLayoutV2 | Phase, projection, context |
| **Readiness** | Not Ready card, column order, score ring polish, recommendation badges | ReadinessLayoutV2 | Score formula, improvements, Apply navigation |
| **Review** | Plan flow strip, success modal copy, Edit link consistency | PlanSummary (optional), ReviewLayoutV2, ReviewPage (optional props) | Data, edit routes, confirm flow |

This plan limits changes to **layout, card hierarchy, preset chip styling, AI insight UI, visual flow elements, summary card structure, and action indicators**, while reusing `src/components/ui` and never importing from the Figma dump. All production logic remains unchanged.
