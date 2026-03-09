# Personalize Wizard UI — Design System Refactor Summary

**Target:** `src/features/enrollment/personalize/` (PersonalizeWizard, AgeStep, LocationStep, SavingsStep) and related UI (WizardModal, Stepper, GradientHeader, AgeSelector).

**Date:** March 2025

---

## 1. Hardcoded styles removed

| Before | After |
|--------|--------|
| `#2563EB`, `#7C3AED` | `var(--color-primary)`, `var(--color-primary-light)` |
| `bg-blue`, `bg-red`, `bg-purple`, `bg-gray` | `var(--color-surface)`, `var(--color-primary)` |
| `text-gray`, `text-gray-400` | `var(--color-text-primary)`, `var(--color-text-secondary)` |
| `border-gray`, `border-gray-200`, `border-gray-300` | `var(--color-border)` |
| `bg-purple-50`, `border-purple-200` | Card + token-based styling |
| `rgba()` for focus rings | `var(--color-primary)` / `var(--color-primary)/20` |

**Files updated:** PersonalizeWizard.tsx, AgeStep.tsx, LocationStep.tsx, SavingsStep.tsx, AgeSelector.tsx.

---

## 2. Wizard header gradient

- **Before:** Hardcoded gradient or Tailwind gradient classes.
- **After:** `GradientHeader` with:
  - `background="linear-gradient(135deg, var(--color-primary), var(--color-primary-light))"`
- **File:** `src/components/ui/GradientHeader.tsx` (default), `PersonalizeWizard.tsx` (passes same gradient).

No Tailwind gradient utilities used for the header.

---

## 3. Step indicator system

- **Active step:** `background: var(--color-primary)` (Stepper already used this).
- **Completed step:** `background: var(--color-success)` (unchanged).
- **Inactive step:** `background: var(--color-surface)`, `border: 1px solid var(--color-border)`.
- **Connector (not completed):** `var(--color-border)`.

**File:** `src/components/ui/Stepper.tsx`.

---

## 4. Button component enforcement

- **Footer actions:**
  - **Save & Exit:** `<Button variant="secondary">`
  - **Back:** `<Button variant="secondary">`
  - **Continue / Next Step / View My Plan:** `<Button variant="primary">`
- Raw `<button>` elements with inline styles removed in favor of shared `Button` component.
- **File:** `src/features/enrollment/personalize/PersonalizeWizard.tsx`.

---

## 5. i18n

- Wizard shell copy moved to `src/locales/en/common.json` under `wizard`:
  - `wizard.title`, `wizard.subtitle`, `wizard.saveExit`, `wizard.continue`, `wizard.back`, `wizard.viewMyPlan`, `wizard.progress`
- Usage: `t("wizard.title")`, etc.
- Step-specific and personalize copy remain under existing keys (e.g. `personalize.*`, enrollment wizard keys in common).

---

## 6. Slider styling (AgeSelector)

- **Track:** `background: var(--color-border)`.
- **Filled portion:** `background: var(--color-primary)` (linear-gradient from primary to border).
- **Thumb:** `background: var(--color-primary)`, `border: 2px solid var(--color-primary)`.
- **File:** `src/components/ui/AgeSelector.tsx`.

---

## 7. Card component

- **AgeStep:** Summary/retirement info wrapped in `<Card>` and `<CardContent>`; removed ad-hoc `bg-*` / `border-*` / `shadow-*`.
- **SavingsStep:** Encouragement block (“Great Start!”) wrapped in `<Card>` and `<CardContent>`; gradient icon uses `var(--color-primary)` and `var(--color-primary-light)`; text uses `--color-text-primary` and `--color-text-secondary`.
- Raw `bg-white`, `border-gray-200`, `shadow-sm` removed where replaced by Card.

---

## 8. Responsiveness

- **Wizard width:** `max-w-lg` applied via `WizardModal` (`src/components/ui/WizardModal.tsx`).
- **Mobile padding:** Main content and footer use `p-4 sm:p-6` in `PersonalizeWizard.tsx`.

---

## 9. Verification checklist

| Item | Status |
|------|--------|
| No hardcoded colors (hex/rgba/Tailwind color classes) in wizard steps | Done |
| Buttons use `Button` with `variant="primary"` or `variant="secondary"` | Done |
| All wizard shell text uses i18n (`wizard.*` or existing keys) | Done |
| Wizard header uses token-based gradient (no Tailwind gradients) | Done |
| Step indicator uses primary / success / surface+border tokens | Done |
| Slider uses primary and border tokens for track/fill/thumb | Done |
| Cards use shared `Card` / `CardContent` where appropriate | Done |
| Wizard max-width and padding (max-w-lg, p-4 sm:p-6) | Done |

---

## Files touched

- `src/features/enrollment/personalize/PersonalizeWizard.tsx`
- `src/features/enrollment/personalize/AgeStep.tsx`
- `src/features/enrollment/personalize/LocationStep.tsx`
- `src/features/enrollment/personalize/SavingsStep.tsx`
- `src/components/ui/AgeSelector.tsx`
- `src/components/ui/GradientHeader.tsx`
- `src/components/ui/WizardModal.tsx`
- `src/components/ui/Stepper.tsx`
- `src/locales/en/common.json` (wizard block)

No new lint or runtime issues introduced; token names align with existing design system (`--color-primary`, `--color-primary-light`, `--color-success`, `--color-surface`, `--color-border`, `--color-text-primary`, `--color-text-secondary`).
