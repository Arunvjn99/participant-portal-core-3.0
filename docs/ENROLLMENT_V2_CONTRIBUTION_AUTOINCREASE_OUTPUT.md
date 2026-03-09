# Force Extraction — Contribution & Auto Increase (UI Only) — Output

## STEP 6 — Output

### 1. New files created

| File | Purpose |
|------|--------|
| `src/enrollment-v2/components/ContributionLayoutV2.tsx` | UI-only layout: header, AI insight, main contribution card (presets, %/$ toggle, slider, tax strategy rows + split bar), right column (projection chart, paycheck impact). All props; no state/calculations. |
| `src/enrollment-v2/components/AutoIncreaseLayoutV2.tsx` | UI-only layout: education phase (two cards + difference + pills), configure phase (frequency, increase amount, max cap, projection chart), skipped phase (message + reconsider). All props; no state/calculations. |
| `docs/ENROLLMENT_V2_CONTRIBUTION_AUTOINCREASE_ANALYSIS.md` | Step 1 analysis: Figma components, local state, calculations, mock data, UI components. |
| `docs/ENROLLMENT_V2_CONTRIBUTION_AUTOINCREASE_OUTPUT.md` | This file. |

**Updated (not replaced):**

| File | Change |
|------|--------|
| `src/enrollment-v2/pages/ContributionPage.tsx` | Uses `ContributionLayoutV2` and `useContributionStore()` + `useEnrollment()`. Builds `projectionChartData` from `projectionBaseline.dataPoints`, passes all layout props and draft/footer. |
| `src/enrollment-v2/pages/AutoIncreasePage.tsx` | Uses `AutoIncreaseLayoutV2` with local `phase` state only. Derives projection data via `calculateProjection()`; passes `setAutoIncrease` handlers and existing draft/footer. |

---

### 2. Figma logic removed

**ContributionStep (Figma):**

- Removed: all `useState` (contributionMode, percentage, monthlyDollar, sources, isModifyingSplit).
- Removed: all local calculations (yearlyContribution, monthlyContribution, perPaycheck*, employerMatch, totalAnnualContribution, futureValue, projectionData loop, preTaxAmount/rothAmount/afterTaxAmount).
- Removed: handlers (handlePercentageChange, handleDollarChange, setPreset, toggleSource, handleSourcePercentageChange).
- Removed: mock data (contributionLimit 23000, employerMatchRate 6, payPeriodsPerYear 12, yearsToRetire 8, annualReturn 0.07).
- Removed: step navigation (handled by EnrollmentFooter).
- Removed: `alert()` help (replaced with optional Core AI prompts).

**AutoIncreaseStep (Figma):**

- Removed: all local state in EducationScreen and ConfigurationScreen (comparisonData, increaseAmount, maxCap, frequency, startMonth, showAdvanced).
- Removed: all local projection loops and constants (yearsToProject 10, annualReturn 0.07, employerMatchRate 6, frequencies, increasePresets, contributionLimit 25, currentAge 35, retirementAge 65).
- Removed: main `phase` from Figma (replaced by single `phase` in page for UI flow only; enable/skip/configure drive context, not local math).
- Removed: step navigation (handled by EnrollmentFooter).

---

### 3. Confirmation: no new state store created

- **Contribution:** Uses existing `useContributionStore()` and `useEnrollment()`. No new store.
- **Auto Increase:** Uses existing `useEnrollment()` for `state.autoIncrease` and `setAutoIncrease`. Only new state is one `useState<AutoIncreasePhase>("education")` in the page for which screen to show (education / configure / skipped). No new store.

---

### 4. Confirmation: draft store untouched

- Both pages use existing `loadEnrollmentDraft()` and `saveEnrollmentDraft()` and pass `getDraftSnapshot` to `EnrollmentFooter`. No new draft system; no changes to `enrollmentDraftStore.ts`.

---

### 5. Confirmation: EnrollmentContext untouched

- No changes to `EnrollmentContext.tsx`. All enrollment state and setters come from existing `useEnrollment()` and (for contribution) `useContributionStore()`.

---

### 6. Styling and behaviour

- **ContributionLayoutV2 / AutoIncreaseLayoutV2:** Use only CSS variables (`var(--text-primary)`, `var(--surface-1)`, `var(--border-subtle)`, `var(--brand-primary)`, `var(--success)`, `var(--enroll-accent)`, `var(--danger)`). No Figma CSS or theme.css imported. Dark mode via existing `.dark` tokens.
- **Components reused:** `Button`, `Input` from `components/ui`; Recharts for area charts (already in package.json).
- **Sliders:** Native `<input type="range">` with gradient fill via inline style using CSS variables. No Figma custom-slider class.
- **Mobile:** Layouts use responsive classes (`grid-cols-1 lg:grid-cols-3`, `flex-wrap`, `md:text-4xl`, etc.).

---

### 7. Engine usage

- **Contribution:** `useContributionStore()` provides `derived`, `projectionBaseline`, `sourceAllocation`, `handleSourcePercentChange`, `setContributionType`, `setContributionAmount`, `setSourcesEditMode`. Chart data built from `projectionBaseline.dataPoints`. Per-paycheck from `derived.perPaycheck` and `derived.employerMatchMonthly * (12 / PAYCHECKS_PER_YEAR)`.
- **Auto Increase:** `calculateProjection()` from `enrollment/logic/projectionCalculator` with and without `autoIncrease` for education and configure. `setAutoIncrease({ enabled, percentage, maxPercentage })` from context. Frequency options are UI-only (engine uses annual); `onFrequencyChange` no-op for now.
