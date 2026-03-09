# Enrollment Wizard Routing — Structural Audit Report

## Phase 1 — Audit

### 1. ENROLLMENT_STEP_PATHS constant

**File:** `src/enrollment/enrollmentStepPaths.ts`

- **Current step order:** Fixed array of 5 paths:
  1. `/enrollment/choose-plan`
  2. `/enrollment/contribution`
  3. `/enrollment/future-contributions`
  4. `/enrollment/investments`
  5. `/enrollment/review`

- **Issue:** Auto-increase (future-contributions) is always included. There is no conditional step; the array is static. `pathToStep(pathname)` returns index into this fixed array, so step index is always 0–4 regardless of whether the user skipped auto-increase.

---

### 2. EnrollmentLayout stepper logic

**File:** `src/layouts/EnrollmentLayout.tsx`

- **Current logic:** `EnrollmentStepLayout` uses `pathToStep(pathname)` to get `step` and passes it to `EnrollmentHeaderWithStepper` as `activeStep={step}`.
- **Issue:** Step index is derived from the fixed 5-step list. When auto-increase is skipped (Contribution → Investments), the user is on `/enrollment/investments` but the stepper still shows step 3 of 5, with “Auto Increase” as step 2. So the stepper shows a step that was never visited and review appears as step 4 of 5 instead of 3 of 4.
- **Result:** Review step index is wrong when auto-increase is skipped (shows 4/5 instead of 3/4).

---

### 3. EnrollmentFooter Next/Back navigation

**File:** `src/components/enrollment/EnrollmentFooter.tsx`

- **Back logic:** `handleBack` uses `ENROLLMENT_STEP_PATHS[step - 1]`. So from investments (step 3), Back goes to `ENROLLMENT_STEP_PATHS[2]` = `/enrollment/future-contributions`.
- **Issue:** When the user skipped auto-increase (went Contribution → Investments), Back from Investments should go to Contribution, not Future Contributions. So Back does not respect the branch.
- **Next:** Footer does not own “Next”; each page has its own primary CTA and `onPrimary`. So Next is correct per-page, but Contribution’s Next always goes to future-contributions (see below).

---

### 4. Where autoIncreaseEnabled state is stored

- **Context:** `state.autoIncrease.enabled` in `EnrollmentContext` (set on Future Contributions page when user enables or skips).
- **Draft:** `draft.autoIncrease?.enabled` in `enrollmentDraftStore`.
- **Issue:** The decision “include auto-increase step or go straight to investments” is intended at **Contribution** (authoritative flow: IF autoIncreaseEnabled === false → investments; IF true → auto-increase). There is no `includeAutoIncreaseStep` (or equivalent) set at Contribution time. Contribution always navigates to future-contributions; the flow never branches at Contribution. So auto-increase is not conditional from Contribution’s perspective.

---

### 5. Summary of findings

| Question | Answer |
|----------|--------|
| Is auto-increase treated as a fixed step? | **Yes.** It is always in `ENROLLMENT_STEP_PATHS` and in the stepper. |
| Is step index hardcoded? | **Yes.** `pathToStep` uses a fixed array index; no resolution based on “which steps are in the flow.” |
| Is routing conditional? | **No.** Contribution always navigates to future-contributions. |
| Does URL determine step? | **Partially.** URL determines which page is shown, but step index is always from the fixed 5-step list. |
| Are steps dynamically inserted? | **No.** Steps are static. |
| Is review step index wrong when auto-increase is skipped? | **Yes.** When skipped, we have 4 logical steps but the stepper still shows 5 and review as step 4 of 5. |

---

### Files responsible

| File | Responsibility |
|------|----------------|
| `src/enrollment/enrollmentStepPaths.ts` | Fixed step list; no `getEnrollmentSteps(includeAutoIncrease)`; `pathToStep` ignores branch. |
| `src/layouts/EnrollmentLayout.tsx` | Passes `pathToStep(pathname)` as activeStep; no dynamic steps or totalSteps. |
| `src/components/enrollment/EnrollmentHeaderWithStepper.tsx` | Uses fixed 5 labels; no `totalSteps` from resolved steps. |
| `src/components/enrollment/EnrollmentFooter.tsx` | Back uses `ENROLLMENT_STEP_PATHS[step - 1]` (fixed list). |
| `src/pages/enrollment/Contribution.tsx` | `handleNext` always `navigate("/enrollment/future-contributions")`; no branch. |
| `src/enrollment/context/EnrollmentContext.tsx` | No `includeAutoIncreaseStep`; branch not represented in state. |
| `src/enrollment/enrollmentDraftStore.ts` | No `includeAutoIncreaseStep` in draft. |

---

### Why the flow breaks

1. **Branch at Contribution:** The authoritative flow requires: from Contribution, go to investments when auto-increase is disabled and to auto-increase when enabled. Currently, Next always goes to future-contributions, so the branch is missing.
2. **Stepper/Back use fixed list:** Even if we added the branch, the stepper and Back would still use the fixed 5-step array, so Back from Investments would go to Future Contributions and the stepper would show the wrong total and current step when auto-increase is skipped.
3. **No “include auto-increase step” flag:** There is no state or draft field set at Contribution that means “include the auto-increase step in the flow,” so the app cannot resolve a dynamic step list.

---

## Phase 2 — Correction (implemented)

### 1. Current issue summary

- **Fixed 5-step list:** Auto-increase was always included; step index and Back ignored branch.
- **Contribution always went to future-contributions:** No conditional routing.
- **Back from Investments:** Went to future-contributions even when auto-increase was skipped.
- **Review step index:** Showed 4 of 5 when auto-increase was skipped instead of 3 of 4.

### 2. Updated step resolver

**File:** `src/enrollment/enrollmentStepPaths.ts`

- **`getEnrollmentSteps(includeAutoIncrease: boolean): readonly string[]`**  
  Returns 5 paths when `includeAutoIncrease` is true (choose-plan, contribution, future-contributions, investments, review).  
  Returns 4 paths when false (choose-plan, contribution, investments, review).

- **`getStepIndex(pathname: string, steps: readonly string[]): number`**  
  Returns 0-based index of pathname in the given steps array; 0 if not found.

- **`ENROLLMENT_STEP_LABEL_KEYS`**  
  Map from path to translation key for dynamic stepper labels.

- **`pathToStep(pathname)`** retained for legacy; new code uses `getStepIndex(pathname, getEnrollmentSteps(...))`.

### 3. Updated footer navigation

**File:** `src/components/enrollment/EnrollmentFooter.tsx`

- Uses **`useEnrollment()`** to read `state.includeAutoIncreaseStep`.
- **Resolved steps:** `steps = getEnrollmentSteps(state.includeAutoIncreaseStep)`.
- **Step index:** `pathDerivedStep = getStepIndex(pathname, steps)`.
- **Back:** `handleBack` navigates to `steps[step - 1]`, so Back respects the branch (from Investments goes to Contribution when auto-increase was skipped, to Future Contributions when it was included).

### 4. Confirmation of corrected flow

| Scenario | Steps | Contribution Next | Back from Investments | Stepper |
|----------|--------|-------------------|------------------------|--------|
| `includeAutoIncreaseStep === true` (default) | 5 | → future-contributions | → future-contributions | 5 steps; Review = 4 of 5 |
| `includeAutoIncreaseStep === false` | 4 | → investments | → contribution | 4 steps; Review = 3 of 4 |

- **Choose-plan** → Contribution (unchanged).
- **Contribution** → Next goes to `steps[contributionIndex + 1]` (future-contributions or investments).
- **Future-contributions** → Investments (unchanged).
- **Investments** → Review (unchanged).
- **Review** → Dashboard / post-enrollment (unchanged).
- **Back** always goes to the previous step in the resolved list.
- **URL** remains source of truth; routes are not duplicated; step count and indices are derived from resolved steps.

### 5. Edge case handling

- **`includeAutoIncreaseStep` default:** `true` in context and draft (`draft.includeAutoIncreaseStep ?? true`), so existing behavior (always 5 steps, Contribution → future-contributions) is unchanged until a control sets it to false (e.g. future checkbox on Contribution).
- **Draft persistence:** Contribution step saves `includeAutoIncreaseStep` in the draft on Next and Save & Exit so the flag survives refresh and re-entry.
- **Path not in resolved steps:** If the user is on a path that is not in the current resolved steps (e.g. they navigated to `/enrollment/future-contributions` via Review “Edit” while in a 4-step flow), `getStepIndex` returns 0; Back is disabled at step 0. No redirect; URL stays source of truth.
- **Review “Edit” links:** Edit Contribution / Auto Increase / Investment still navigate to their URLs; those routes remain valid. Stepper and Back use the resolved steps for the current `includeAutoIncreaseStep`; if the user is on a step that is “out of flow” for the current branch, the stepper may show an earlier step until they navigate.
- **No UI changes:** No new controls or styling; only flow, routing, and state (draft + context) were updated.
