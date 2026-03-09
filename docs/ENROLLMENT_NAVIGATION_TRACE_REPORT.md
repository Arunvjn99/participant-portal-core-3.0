# Enrollment Flow Debug — Navigation Trace Report

## PHASE 1 — Navigation source

### 1. EnrollmentFooter location
- **File:** `src/components/enrollment/EnrollmentFooter.tsx`
- **Next button:** The footer does **not** compute Next. It renders a primary button that calls `onPrimary` (line 106). So the **route taken on "Next" is determined by the parent** that passes `onPrimary`.

### 2. Exact function triggered on "Next" (per page)
| Page | File | Handler | Computed next route |
|------|------|---------|----------------------|
| Choose Plan | `ChoosePlan.tsx` | `handleContinue` | **Hardcoded** `navigate("/enrollment/contribution")` |
| Contribution | `Contribution.tsx` | `handleNext` | `navigate(nextStepPath ?? "/enrollment/future-contributions")` where `nextStepPath = steps[contributionStepIndex + 1]` |
| Future Contributions | `FutureContributions.tsx` | `handleContinue` | **Hardcoded** `navigate("/enrollment/investments")` |
| Investments | `InvestmentsFooter.tsx` | `handleContinue` | **Hardcoded** `navigate("/enrollment/review")` |
| Review | `Review.tsx` | `onPrimary` | Opens modal (no route change) |

### 3. Logged values (when debug logs are enabled)
- **EnrollmentFooter** (every render when on step path): `pathname`, `stepIndex`, `stepArray`, `includeAutoIncreaseStep`, `backWouldGoTo`.
- **Contribution handleNext** (when Next is clicked): `pathname`, `stepIndex` (contributionStepIndex), `stepArray`, `includeAutoIncreaseStep`, `computedNextRoute`.

---

## PHASE 2 — Step source

### Where step paths are defined
- **File:** `src/enrollment/enrollmentStepPaths.ts`
- **ENROLLMENT_STEP_PATHS** (lines 10–16): Static array of 5 paths. Auto-increase step is **always** in this array.
- **getEnrollmentSteps(includeAutoIncrease: boolean)** (lines 37–46): Returns 5-step array when `true`, 4-step array (no future-contributions) when `false`.
- **getStepIndex(pathname, steps)** (lines 52–58): Returns 0-based index of pathname in the given `steps` array; 0 if not found.
- **pathToStep(pathname)** (lines 61–65): Uses **static** ENROLLMENT_STEP_PATHS; legacy.

### Step index / currentStep usage
| Location | Source of step index | Static? |
|----------|----------------------|--------|
| EnrollmentLayout | `getStepIndex(pathname, getEnrollmentSteps(state.includeAutoIncreaseStep))` | No |
| EnrollmentFooter | `pathDerivedStep = getStepIndex(pathname, steps)`; overrides prop when on step path | No (but receives step **prop** from parent) |
| Contribution | `contributionStepIndex = steps.indexOf("/enrollment/contribution")`; `nextStepPath = steps[contributionStepIndex + 1]` | No |
| InvestmentsFooter | **step={3}** passed to EnrollmentFooter | **Yes — hardcoded** |
| Review | **step={4}** passed to EnrollmentFooter | **Yes — hardcoded** |

### Pathname → index mapping
- Index is **derived from pathname** via `getStepIndex(pathname, steps)` when the footer/layout use resolved `steps`.
- When parent passes a **hardcoded** step (Review `step={4}`, InvestmentsFooter `step={3}`), the footer **overrides** it with `pathDerivedStep` when `onStepPath` is true. So **Back** uses the correct index. The bug is **inconsistency** and wrong behavior if `onStepPath` were ever false on those routes.

### Is step array static?
- **ENROLLMENT_STEP_PATHS** is static (5 steps).
- **getEnrollmentSteps(includeAutoIncrease)** returns a **dynamic** list (4 or 5 steps) used by layout, footer, and Contribution.

### Is auto-increase step always included?
- In **ENROLLMENT_STEP_PATHS**: yes.
- In **getEnrollmentSteps(false)**: no (omitted).

### Is index calculated from static list?
- Layout and Footer use **resolved** steps (from `getEnrollmentSteps(state.includeAutoIncreaseStep)`), so index is from the **dynamic** list.
- **pathToStep** uses the static list (legacy).

### URL driving step vs index driving route
- **URL is source of truth**: which page is shown is determined by the route (pathname).
- **Index** is derived **from pathname** (and resolved steps) for stepper display and Back.
- **Next** on Contribution is computed as `steps[currentIndex + 1]` where currentIndex is from `steps.indexOf("/enrollment/contribution")`, so **next route is driven by resolved steps**, not by a raw index.

---

## PHASE 3 — Root cause report

### 1. Current step array order
- **When includeAutoIncreaseStep === true (default):**  
  [choose-plan, contribution, future-contributions, investments, review] (5 steps)
- **When includeAutoIncreaseStep === false:**  
  [choose-plan, contribution, investments, review] (4 steps)

### 2. Current pathname
- Varies by page; e.g. `/enrollment/contribution`, `/enrollment/future-contributions`, etc.

### 3. Calculated index
- Contribution: always index **1** (contribution is always second in both 4- and 5-step arrays).
- Investments: index **2** in 4-step flow, **3** in 5-step flow.
- Review: index **3** in 4-step flow, **4** in 5-step flow.

### 4. Calculated next route (Contribution only)
- **Next from Contribution:** `nextStepPath = steps[1 + 1] = steps[2]`.
  - If 5-step: `steps[2]` = `/enrollment/future-contributions` (correct).
  - If 4-step: `steps[2]` = `/enrollment/investments` (correct).

### 5. Why next route can be wrong
- **includeAutoIncreaseStep is never set to false** when the user skips auto-increase on the Future Contributions page. So it stays `true` (default). Therefore:
  - **Steps are always 5**, and from Contribution, Next is always `future-contributions`.
  - If the user previously skipped auto-increase and expects to go **directly to investments** the next time they are on Contribution, they still get sent to **future-contributions** because `includeAutoIncreaseStep` was never persisted as `false`.
- **Hardcoded step props:** `InvestmentsFooter` passes `step={3}` and Review passes `step={4}`. The footer overwrites these with `pathDerivedStep` when on a step path, so Back is correct in practice. But:
  - If the flow ever had 4 steps (e.g. after we persist `includeAutoIncreaseStep: false`), the **correct** indices would be 2 and 3. Passing 3 and 4 would be wrong when the footer did **not** override (e.g. off-path or bug). So the **root cause** is: **static step props** and **includeAutoIncreaseStep not updated when user skips**.

### 6. Exact file + line causing bug
| Issue | File | Line |
|-------|------|------|
| includeAutoIncreaseStep never set to false when user skips | `FutureContributions.tsx` | handleSkipAnyway / handleContinue do not set or persist `includeAutoIncreaseStep: false` |
| Hardcoded step index for Investments | `InvestmentsFooter.tsx` | 40: `step={3}` |
| Hardcoded step index for Review | `Review.tsx` | 473: `step={4}` |

---

## PHASE 4 — Fix (implemented)

### Code changes

1. **InvestmentsFooter** (`src/components/investments/InvestmentsFooter.tsx`): Use `useEnrollment()`, `getEnrollmentSteps(state.includeAutoIncreaseStep)`, `getStepIndex(location.pathname, steps)`. Pass `step={investmentsStep}` instead of `step={3}`.
2. **Review** (`src/pages/enrollment/Review.tsx`): Use `useLocation()`, `getEnrollmentSteps(enrollment.state.includeAutoIncreaseStep)`, `getStepIndex(pathname, steps)`. Pass `step={reviewStep}` instead of `step={4}`.
3. **FutureContributions** (`src/pages/enrollment/FutureContributions.tsx`):
   - In **handleSkipAnyway**: Call `setIncludeAutoIncreaseStep(false)` and save draft with `includeAutoIncreaseStep: false` so the flow becomes 4-step for the next time.
   - In **handleContinue**: When saving the draft, set `includeAutoIncreaseStep: autoIncreaseEnabled` (and when !autoIncreaseEnabled call `setIncludeAutoIncreaseStep(false)` so next time Contribution Next goes to investments).
4. **Debug logs**: Removed temporary console logs from EnrollmentFooter and Contribution.

### Correct flow order after fix

- **5-step** (includeAutoIncreaseStep === true): choose-plan → contribution → future-contributions → investments → review → dashboard.
- **4-step** (includeAutoIncreaseStep === false, e.g. after Skip): choose-plan → contribution → investments → review → dashboard.
- **Next** = resolvedSteps[currentIndex + 1] (Contribution uses this; others hardcode correct single target).
- **Back** = resolvedSteps[currentIndex - 1] (EnrollmentFooter uses pathname + resolved steps).
- **Index** derived from pathname via `getStepIndex(pathname, steps)` everywhere; no hardcoded step numbers for enrollment steps.

### Edge case validation

- **User skips auto-increase:** handleSkipAnyway and handleContinue persist `includeAutoIncreaseStep: false`. On next run, Contribution Next goes to investments; stepper shows 4 steps; Back from investments goes to contribution.
- **User enables auto-increase:** handleContinue saves `includeAutoIncreaseStep: true` (via not setting false). Flow stays 5-step.
- **Review / Investments step prop:** Derived from pathname + resolved steps, so Back and stepper stay correct for both 4- and 5-step flows.
