# Enrollment V2 — Integration Output (Phase 8)

**Date:** March 3, 2026  
**Mode:** Architecture safe — no core contracts modified.

---

## 1. File structure created

```
src/
  config/
    featureFlags.ts                    # USE_ENROLLMENT_V2 (default true)
  enrollment-v2/
    config/
      stepConfig.ts                    # ENROLLMENT_V2_STEP_PATHS (6 steps), getV2StepIndex, isEnrollmentV2Path
    components/
      StepIndicatorV2.tsx              # 6-step indicator from pathname; theme tokens
      PlanCardV2.tsx                   # Plan card; theme tokens; optional Ask AI
      ContributionCardV2.tsx            # Card wrapper for contribution content
      InvestmentCardV2.tsx              # Card for investment profile option
    pages/
      ChoosePlanPage.tsx
      ContributionPage.tsx
      AutoIncreasePage.tsx
      InvestmentPage.tsx
      ReadinessPage.tsx
      ReviewPage.tsx
    EnrollmentLayoutV2.tsx              # EnrollmentProvider + 6-step stepper + Outlet
    EnrollmentRedirectWhenV2.tsx        # When USE_ENROLLMENT_V2, redirect /enrollment/* step → /enrollment-v2/*
docs/
  ENROLLMENT_V2_FIGMA_ANALYSIS.md       # Phase 1 analysis (Figma dump)
  ENROLLMENT_V2_INTEGRATION_OUTPUT.md  # This file
```

**Router (src/app/router.tsx):**

- `/enrollment` element: `EnrollmentRedirectWhenV2` (redirects step paths to V2 when flag is true; else renders `EnrollmentLayout`).
- New route tree: `/enrollment-v2` with `ProtectedRoute` + `EnrollmentLayoutV2`, children: index → redirect to choose-plan, choose-plan, contribution, auto-increase, investment, readiness, review.

**Footer (src/components/enrollment/EnrollmentFooter.tsx):**

- Optional prop `stepPaths?: readonly string[]`. When provided (e.g. `ENROLLMENT_V2_STEP_PATHS`), next/back use these paths; contribution page styling also applied for `/enrollment-v2/contribution`.

**Locales:**

- `enrollment.stepperReadiness` added in `src/locales/en/common.json` for V2 stepper.

---

## 2. Reused components

| Component | Location | Usage in V2 |
|-----------|----------|-------------|
| Button | components/ui/Button | PlanCardV2, EnrollmentFooter (via existing) |
| Card / layout | components/ui/card (if needed) | Via EnrollmentPageContent |
| EnrollmentPageContent | components/enrollment/EnrollmentPageContent | All 6 V2 pages |
| EnrollmentFooter | components/enrollment/EnrollmentFooter | All 6 V2 pages (with stepPaths) |
| EnrollmentHeaderWithStepper | components/enrollment/EnrollmentHeaderWithStepper | EnrollmentLayoutV2 (with 6 stepLabels) |
| DashboardLayout | layouts/DashboardLayout | EnrollmentLayoutV2 |
| DashboardHeader | components/dashboard/DashboardHeader | EnrollmentLayoutV2 |
| EnrollmentProvider | enrollment/context/EnrollmentContext | EnrollmentLayoutV2 |
| ProtectedRoute | components/auth/ProtectedRoute | Router (enrollment and enrollment-v2) |

---

## 3. New components created

| Component | Purpose |
|-----------|--------|
| StepIndicatorV2 | 6-step indicator driven by pathname; theme tokens; responsive (sm breakpoints) |
| PlanCardV2 | Plan selection card; theme tokens; optional Ask AI button |
| ContributionCardV2 | Wrapper card for contribution step content |
| InvestmentCardV2 | Card for investment profile option (selectable) |
| EnrollmentLayoutV2 | V2 layout: EnrollmentProvider + 6-step stepper + Outlet |
| EnrollmentRedirectWhenV2 | Redirects /enrollment step paths to /enrollment-v2 when USE_ENROLLMENT_V2 |

---

## 4. Mapping: Figma → new components

| Figma (reference) | V2 implementation |
|------------------|-------------------|
| App.tsx step list + StepIndicator | ENROLLMENT_V2_STEP_PATHS + EnrollmentHeaderWithStepper (6 labels) |
| PlanCard | PlanCardV2 (layout + benefits; selection from useEnrollment) |
| ContributionStep layout | ContributionPage + ContributionCardV2 (state from useEnrollment) |
| AutoIncreaseStep layout | AutoIncreasePage (state from state.autoIncrease) |
| InvestmentStep cards | InvestmentPage + InvestmentCardV2 (state from state.investmentProfile) |
| RetirementReadinessStep | ReadinessPage (derived from context; TODO: wire readiness score UI) |
| ReviewStep | ReviewPage (summary from context) |
| In-App Back/Continue | EnrollmentFooter with stepPaths=ENROLLMENT_V2_STEP_PATHS |

---

## 5. Confirmation: no core contracts modified

- **EnrollmentContext:** Not modified. V2 uses existing `useEnrollment()` and same state/setters.
- **enrollmentDraftStore:** Not modified. V2 uses `loadEnrollmentDraft`, `saveEnrollmentDraft`, same `EnrollmentDraft` shape.
- **enrollmentStepPaths:** Not modified. V2 uses its own `enrollment-v2/config/stepConfig.ts` (ENROLLMENT_V2_STEP_PATHS, getV2StepIndex).
- **enrollmentStepPaths / AI:** Existing ENROLLMENT_STEP_PATHS and step enums unchanged; no changes to planEnrollmentAgent or AI flows.
- **ThemeContext / AuthContext / supabase:** Not modified.
- **EnrollmentFooter:** Extended with optional `stepPaths` and V2 contribution path for styling only; default behavior unchanged when `stepPaths` is not passed.

---

## 6. Confirmation: AI not affected

- No changes to `planEnrollmentAgent`, Core AI, or AI step enums.
- No new AI-specific routes or context.
- V2 uses existing Core AI optional hook for “Ask AI” on plan cards where provided.

---

## 7. Feature flag and redirect

- **USE_ENROLLMENT_V2:** `src/config/featureFlags.ts`. Default `true`; can be set via `VITE_USE_ENROLLMENT_V2=false` to use old flow.
- When `true`: visiting `/enrollment/choose-plan`, `/enrollment/contribution`, `/enrollment/auto-increase`, `/enrollment/investments`, or `/enrollment/review` redirects to the corresponding `/enrollment-v2/*` path (investments → investment).
- When `false`: no redirect; existing enrollment flow is used.
- Old flow is intact: all existing enrollment routes and components remain; redirect only swaps which layout/pages are shown for step paths.

---

## 8. Responsive and theme

- **Theme:** V2 components use CSS variables only: `var(--text-primary)`, `var(--text-secondary)`, `var(--surface-1)`, `var(--border-subtle)`, `var(--brand-primary)`, `var(--success)`. No hardcoded hex. Dark mode uses existing `.dark` tokens.
- **Responsive:** StepIndicatorV2 uses `flex-wrap`, `min-w-0`, `truncate`, `sm:gap-3`, `sm:w-9 sm:h-9`, `sm:min-w-8`, `hidden sm:block` for connector lines. EnrollmentPageContent and existing layout provide max-width and padding.
- **Tailwind:** Existing config and breakpoints only; no Figma Tailwind or theme.css imported.

---

## 9. Optional next steps (not done in this pass)

- Wire ContributionPage to full contribution UI (slider, %/dollar, source split) using existing logic.
- Wire AutoIncreasePage to enable/skip and presets using `setAutoIncrease`.
- Wire InvestmentPage to investment profile selection / wizard using `setInvestmentProfile`.
- Wire ReadinessPage to readiness score and improvement cards from existing/derived logic.
- Wire ReviewPage submit to existing enrollment submit and success navigation.
- Add `enrollment.stepperReadiness` (and any other missing keys) to other locales (es, fr, etc.) if needed.
