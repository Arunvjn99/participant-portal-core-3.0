# Personalize Plan Modal – Stabilization Validation Checklist

**Component:** `src/components/enrollment/PersonalizePlanModal.tsx`  
**Date:** 2025-03-03

---

## Phase 1 – Logic

| # | Item | Status |
|---|------|--------|
| 1 | Step 2: When search input is cleared, `onChange("")` is called and selection clears | ✅ |
| 2 | Step 2: Value and search stay in sync (useEffect + handleBlur) | ✅ |
| 3 | Back → does NOT persist | ✅ |
| 4 | Continue (steps 1–2) → does NOT persist | ✅ |
| 5 | Save & Exit → persists then closes | ✅ |
| 6 | Exit Setup (confirm) → persists then closes | ✅ |
| 7 | Step 3 View My Plan → persists then navigates to `/enrollment/choose-plan` | ✅ |
| 8 | `isStepValid(2)` requires non-empty location; Continue disabled when invalid | ✅ |
| 9 | Step 3 savings clamped to ≥ 0 | ✅ |
| 10 | Validation message (i18n) shown when step 2 invalid | ✅ |

---

## Phase 2 – Accessibility

| # | Item | Status |
|---|------|--------|
| 1 | Stepper: `aria-current="step"` on current step | ✅ |
| 2 | Stepper: `aria-label` on nav describing progress | ✅ |
| 3 | Exit confirmation: `role="alertdialog"`, `aria-labelledby`, `aria-describedby` | ✅ |
| 4 | Exit confirmation: focus moved to first button on open | ✅ |
| 5 | Slider: `aria-valuemin`, `aria-valuemax`, `aria-valuenow` | ✅ |
| 6 | Buttons: accessible labels (aria-label or visible text) | ✅ |

---

## Phase 3 – Dark / Light

| # | Item | Status |
|---|------|--------|
| 1 | Wizard uses CSS tokens (`--wizard-accent`, `--wizard-success`, `--wizard-border`, etc.) | ✅ |
| 2 | Tokens defined in `styles/tokens.css` with `[data-theme="dark"]` overrides | ✅ |
| 3 | No inline theme conditionals in component | ✅ |

---

## Phase 4 – i18n

| # | Item | Status |
|---|------|--------|
| 1 | All modal strings use `t("enrollment.personalizePlan.xxx")` | ✅ |
| 2 | Keys in `locales/en/enrollment.json` under `personalizePlan` | ✅ |
| 3 | Spanish in `locales/es/common.json` under `enrollment.personalizePlan` | ✅ |
| 4 | Language switch updates modal (no hardcoded text) | ✅ |

---

## Phase 5 – Responsive

| # | Item | Status |
|---|------|--------|
| 1 | `.premium-wizard__dialog--responsive` added to modal | ✅ |
| 2 | Mobile (≤768px): full width, scrollable body, fixed footer | ✅ |
| 3 | Tablet (769–1024px): max-width 90vw, reduced padding | ✅ |
| 4 | No horizontal scroll / overflow clipping | ✅ |

---

## Phase 6 – State

| # | Item | Status |
|---|------|--------|
| 1 | Single `useReducer` (wizardReducer) for step, form, editingAge, showExitConfirm | ✅ |
| 2 | `isStepValid(stepNumber, form, currentAge)` implemented | ✅ |
| 3 | Derived values (currentAge, stepLabels) via useMemo | ✅ |
| 4 | No redundant state | ✅ |

---

## Phase 7 – Performance & Cleanup

| # | Item | Status |
|---|------|--------|
| 1 | Unused imports removed (createPortal removed) | ✅ |
| 2 | No debug logs | ✅ |
| 3 | Memoized stepLabels, persistDraft, update | ✅ |
| 4 | No duplicate persistence calls | ✅ |

---

## Phase 8 – Regression

| # | Item | Status |
|---|------|--------|
| 1 | Draft load on open still works | ✅ |
| 2 | Routing: View My Plan → `/enrollment/choose-plan` | ✅ |
| 3 | No UI redesign; no enrollment flow change | ✅ |
| 4 | Existing features (steps 1–3, exit confirm, Save & Exit) retained | ✅ |

---

## Manual verification

- [ ] Step 2: Select location, then clear search → selection clears.
- [ ] Toggle dark mode → wizard colors update (header, stepper, cards).
- [ ] Switch language (en ↔ es) → all modal text updates.
- [ ] Resize to mobile width → modal full width, content scrolls, footer fixed.
- [ ] Step 2: Leave location empty → Continue disabled, validation message shown.
- [ ] Screen reader: stepper and exit dialog announce correctly.
