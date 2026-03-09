# Enrollment Wizard Structural Stabilization — Summary

## 1. Files modified

| File | Changes |
|------|--------|
| `src/enrollment/enrollmentStepPaths.ts` | Replaced with fixed 5-step array; removed `getEnrollmentSteps()`, `getStepIndex(pathname, steps)`, `pathToStep`; added `getStepIndex(pathname)`; step 3 path set to `/enrollment/auto-increase`. |
| `src/app/router.tsx` | Route `future-contributions` → `auto-increase`; added redirect `future-contributions` → `auto-increase` for backward compatibility. |
| `src/layouts/EnrollmentLayout.tsx` | Uses `getStepIndex(pathname)` and fixed `ENROLLMENT_STEP_PATHS`; removed `useEnrollment`, `getEnrollmentSteps`, `includeAutoIncreaseStep`; step content case `/enrollment/auto-increase`. |
| `src/components/enrollment/EnrollmentFooter.tsx` | Rewritten: pathname-only; `getStepIndex(pathname)`; `nextPath` / `prevPath` from `ENROLLMENT_STEP_PATHS`; Primary runs `onPrimary` then `navigate(nextPath)`; Back runs `navigate(prevPath)`; no `step` prop. |
| `src/pages/enrollment/Contribution.tsx` | Removed `getEnrollmentSteps`, `nextStepPath`, `contributionStepIndex`, `includeAutoIncreaseStep` from draft; replaced inline footer with `EnrollmentFooter`; `onPrimary` only saves draft (footer navigates). |
| `src/pages/enrollment/ChoosePlan.tsx` | `handleContinue` no longer navigates (only saves); replaced custom footer with `EnrollmentFooter`; footer drives Next to contribution. |
| `src/pages/enrollment/FutureContributions.tsx` | Removed `setIncludeAutoIncreaseStep`, `includeAutoIncreaseStep` from draft/state; added disabled state when `state.autoIncrease.enabled === false` and user chose skip or draft has `autoIncrease.enabled === false`; replaced inline footer with `EnrollmentFooter`; `handleContinue` only saves; removed `handleBack` / `handleSaveAndExit`; no redirect on mount. |
| `src/components/investments/InvestmentsFooter.tsx` | Removed `step` prop, `getEnrollmentSteps`, `getStepIndex`, `useEnrollment`, `navigate`; `handleContinue` only saves (footer navigates to review). |
| `src/pages/enrollment/Review.tsx` | Removed `step` prop, `getEnrollmentSteps`, `getStepIndex`, `useLocation`; Edit Auto Increase link → `/enrollment/auto-increase`. |
| `src/enrollment/context/EnrollmentContext.tsx` | Removed `includeAutoIncreaseStep` from state, default state, initial state from draft, and `setIncludeAutoIncreaseStep`. |
| `src/enrollment/enrollmentDraftStore.ts` | Removed `includeAutoIncreaseStep` from `EnrollmentDraft`. |
| `src/locales/en/enrollment.json` | Added `autoIncreaseNotEnabledTitle`, `autoIncreaseNotEnabledDescription` for disabled state. |
| `src/components/enrollment/EnrollmentInvestmentsGuard.tsx` | Comment updated (auto-increase only). |

---

## 2. Confirmation: dynamic logic removed

- **`getEnrollmentSteps(includeAutoIncrease)`** — deleted.
- **Dynamic step arrays** — removed; only fixed `ENROLLMENT_STEP_PATHS` remains.
- **`includeAutoIncreaseStep`** — removed from context, draft, and all step resolution.
- **Conditional insert/remove of steps** — removed; step list is always 5.
- **Hardcoded step numbers** — removed from InvestmentsFooter and Review; no `step={3}` or `step={4}`.

---

## 3. Confirmation: footer is fully pathname-driven

- **EnrollmentFooter** uses `useLocation()` and `getStepIndex(pathname)` for `currentStepIndex`.
- **Next:** `nextPath = ENROLLMENT_STEP_PATHS[currentStepIndex + 1]`; Primary click runs `onPrimary?.()` then `navigate(nextPath)` when `nextPath` is defined.
- **Back:** `prevPath = ENROLLMENT_STEP_PATHS[currentStepIndex - 1]`; Back click runs `navigate(prevPath)`.
- **No step prop** — footer does not accept or use a step index from parents.
- **Pages** do not compute next/prev; they only provide `onPrimary` (e.g. save draft). Navigation is entirely in the footer from pathname.

---

## 4. Confirmation: Auto Increase disabled state implemented

- **Source of truth:** `state.autoIncrease.enabled` (and draft when returning to the step).
- **Disabled state when:** `(state.autoIncrease.enabled === false && userSkippedAutoIncrease) || (draft?.autoIncrease != null && draft.autoIncrease.enabled === false)`.
- **Disabled UI:** Title "Auto Increase Not Enabled", description "You chose not to enable automatic contribution increases.", plus footer with CTA "Continue to Investment Election".
- **Continue** from disabled state: `onPrimary` saves draft; footer navigates to `/enrollment/auto-increase` → next path = `/enrollment/investments`.
- **No redirect on mount** — user must click Continue.
- **When enabled:** Full configuration UI; Continue again saves and footer navigates to investments.

---

## 5. Final verified flow order

1. **Choose Plan** — `/enrollment/choose-plan`
2. **Contribution** — `/enrollment/contribution` (Next always goes to auto-increase)
3. **Auto Increase** — `/enrollment/auto-increase` (disabled state or full config; Continue → investments)
4. **Investments** — `/enrollment/investments`
5. **Review** — `/enrollment/review` (Submit opens modal; after success → dashboard)

**After review:** Dashboard (or post-enrollment dashboard).

**Back navigation:** Valid on all steps via `prevPath` from `ENROLLMENT_STEP_PATHS[currentStepIndex - 1]`.

**Stepper:** Always 5 steps; `activeStep = getStepIndex(pathname)`; no step index shifting or conditional step removal.

**Redirect:** `/enrollment/future-contributions` → `/enrollment/auto-increase` (replace) for backward compatibility.
