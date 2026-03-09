# Figma-Dump Extraction and Integration Report

This document records the structured extraction and integration of the Retirement Plan Selection App (figma-dump) into the existing participant portal architecture. Per **INTEGRATION_RULES.md**, figma-dump is used as **reference only**; no components are copied or imported from figma-dump into production.

---

## STEP 1 — Figma-Dump Structure (Analyzed)

### Location
- `src/figma-dump/Retirement Plan Selection App (2)/`

### Page components (step content)
| Figma component       | Path | Purpose |
|-----------------------|------|--------|
| Plan (inline in App)  | App.tsx (currentStep === 0) | Choose plan: plan cards + “Need help deciding?” section |
| ContributionStep      | src/app/components/ContributionStep.tsx | Contribution %, tax split, projection chart |
| AutoIncreaseStep      | src/app/components/AutoIncreaseStep.tsx | Education → Configure → Skipped flow |
| InvestmentStep        | src/app/components/InvestmentStep.tsx | Portfolio cards, fund allocation, summary |
| RetirementReadinessStep | src/app/components/RetirementReadinessStep.tsx | Readiness (not in our stepper) |
| ReviewStep            | src/app/components/ReviewStep.tsx | Review (we have EnrollmentReviewContent) |

### Shared UI in figma-dump
- **StepIndicator** – step progress (we use EnrollmentStepper / EnrollmentHeaderWithStepper).
- **PlanCard** – plan tile with benefits (we have our own PlanCard in components/enrollment).
- **PlanSidebar** – not used in our flow.
- **AskAIButton** – (we use Core AI modal).
- **ui/** – button, badge, card, slider, form, etc. (we use our design system).

### Layout wrappers in figma-dump
- **App.tsx**: Full-screen wrapper with `min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50`, decorative blurs, **StepIndicator**, and **Back/Continue** nav. All of this is replaced by our EnrollmentLayout + EnrollmentPageContent + EnrollmentFooter.
- **RetirementPlanSelectionApp.tsx** (imports): Another full-page export with its own stepper and hardcoded layout; not used.

### Local theme in figma-dump
- `src/styles/theme.css`
- `src/styles/tailwind.css`
- `src/styles/index.css`  
**Action:** Not used. We use `src/theme/tokens.css`, `src/theme/enrollment-dark.css`, and `src/index.css` with `--enroll-*` and global tokens.

### Mock data in figma-dump
- **App.tsx**: `planOptions` (Roth 401k, Traditional 401k), `userDetails` (age 31, salary 45000, etc.), `steps` array.  
**Action:** We use EnrollmentContext, useContributionStore, and enrollment draft; no mock data from figma.

### Local state in figma-dump
- **App.tsx**: `useState` for `currentStep`, `selectedPlanId`, `showEditDetails`.  
**Action:** We use URL-based routing and EnrollmentContext/useContributionStore; no local step state.

---

## STEP 2 — Mapping to Current Architecture

| Figma “page”   | Our route                    | Our component(s) | Layout / theme / state |
|----------------|------------------------------|------------------|-------------------------|
| Plan           | `/enrollment/choose-plan`    | **ChoosePlan**   | EnrollmentLayout → DashboardLayout + stepper → EnrollmentPageContent; EnrollmentContext; theme tokens |
| Contribution   | `/enrollment/contribution`   | **Contribution** | Same; useContributionStore + EnrollmentContext; contribution calculator + projection |
| Auto Increase  | `/enrollment/auto-increase`  | **FutureContributions** | Same; EnrollmentContext + contribution/projection logic; education/configure/skip flow |
| Investment     | `/enrollment/investments`   | **EnrollmentInvestmentsContent** → InvestmentProvider → **InvestmentsLayout** → **InvestmentsPage** (ManualBuilder) | EnrollmentLayout (no sub-stepper for investments); InvestmentWizardContext; enrollment profile |

- **Layout:** Single system. Enrollment steps use `EnrollmentLayout` → `EnrollmentStepLayout` → `DashboardLayout` (header + EnrollmentHeaderWithStepper) → `<Outlet />`. No duplicate app shell or step wrapper from figma.
- **Theme:** Global tokens and `--enroll-*` only. No figma theme files or providers.
- **Routing:** `src/app/router.tsx` and `src/enrollment/enrollmentStepPaths.ts` define step order; no figma local navigation.
- **State:** EnrollmentContext, useContributionStore, enrollmentDraftStore, InvestmentProvider/InvestmentWizardContext. No duplicate stores.

---

## STEP 3 — Extracted “Page” Content (Normalized)

We do **not** create new `features/enrollment/PlanPage.tsx` etc. by copying from figma. Existing pages **are** the integrated pages:

| Route/step        | File(s) | Content source |
|--------------------|--------|----------------|
| Plan               | `src/pages/enrollment/ChoosePlan.tsx` | Already uses EnrollmentPageContent, PlanCard, HelpSectionCard, enrollment context, theme tokens. Reference: figma App.tsx plan section + PlanCard. |
| Contribution       | `src/pages/enrollment/Contribution.tsx` | Already uses EnrollmentPageContent, contribution components (SliderSection, TaxSplitSection, etc.), useContributionStore, projection. Reference: figma ContributionStep. |
| Auto Increase      | `src/pages/enrollment/FutureContributions.tsx` | Already has education screen (two-card comparison), configure (frequency, increase %, max cap), skip flow. Reference: figma AutoIncreaseStep. |
| Investment         | `src/components/enrollment/EnrollmentInvestmentsContent.tsx` + `src/app/investments/layout.tsx` + `src/app/investments/page.tsx` (ManualBuilder) | Enrollment investments guard, InvestmentProvider, InvestmentsLayout, ManualBuilder, AllocationSummary. Reference: figma InvestmentStep for UX only; we use existing investment wizard and allocation. |

No new page files were added. No code was copied from figma-dump into `src/pages`, `src/components`, or `src/features`.

---

## STEP 4 — Global Theme Usage

- **ChoosePlan:** Uses `var(--enroll-brand)`, `var(--enroll-accent)`, `var(--enroll-text-secondary)` (and similar) for gradients and text. Compliant.
- **Contribution:** Uses enrollment and contribution tokens; compliant.
- **FutureContributions:** Had a few hardcoded hex/rgba (e.g. `#d0fae5`, `#a4f4cf`, `rgba(236,253,245,0.5)`). Replaced with token-based or `rgb(var(--enroll-*))` where applicable.
- **EnrollmentStepper:** Had hardcoded `#155dfc`, `#99a1af`, `#101828`, `#d1d5dc`. Replaced with enrollment/theme tokens.

No new theme context or token files were added.

---

## STEP 5 — State and Stores

- **Plan:** `useEnrollment()` (EnrollmentContext) for `selectedPlan`, `setSelectedPlan`; draft via loadEnrollmentDraft/saveEnrollmentDraft.
- **Contribution:** `useContributionStore()` for percentage, source allocation, etc.; enrollment context for plan name; projection from enrollment logic.
- **Auto Increase:** Enrollment context + contribution/projection calculators; auto-increase settings in enrollment state/draft.
- **Investment:** EnrollmentInvestmentsContent reads EnrollmentContext; InvestmentProvider/InvestmentWizardContext for wizard and allocation.

No duplicate stores or figma local state retained.

---

## STEP 6 — Routing and Stepper

- **Routes:** Already defined in `src/app/router.tsx` under `path: "/enrollment"` with `EnrollmentLayout`:
  - `choose-plan` → ChoosePlan  
  - `contribution` → Contribution  
  - `auto-increase` → FutureContributions  
  - `future-contributions` → redirect to `auto-increase`  
  - `investments` → EnrollmentInvestmentsGuard + EnrollmentInvestmentsContent  
  - `review` → EnrollmentReviewContent  

- **Stepper:** `ENROLLMENT_STEP_PATHS` and `ENROLLMENT_STEP_LABEL_KEYS` in `src/enrollment/enrollmentStepPaths.ts` match the above. EnrollmentHeaderWithStepper uses `getStepIndex(pathname)` and these paths. No figma local navigation.

---

## STEP 7 — Cleanup

- **Imports from figma-dump:** None. Grep confirms no production code imports from `figma-dump` or “Retirement Plan Selection”.
- **Duplicate layout:** None. Only EnrollmentLayout and EnrollmentPageContent/DashboardLayout are used for enrollment steps.
- **Duplicate theme:** None. Only global theme and enrollment tokens.
- **Duplicate providers:** None. Single EnrollmentProvider, ThemeContext, etc.
- **Figma-dump folder:** Retained as **reference only**. Can be moved to `docs/figma-reference/` or archived later if desired. Not deleted so designers/devs can still compare.

---

## STEP 8 — Validation Checklist

| Check | Status |
|-------|--------|
| Pages render inside existing layout (EnrollmentLayout → Outlet) | Yes |
| Theme tokens used; dark mode supported | Yes (tokens + enrollment-dark.css) |
| No styling conflicts from figma-dump | Yes (no figma CSS imported) |
| No duplicate providers | Yes |
| No console errors from integration | N/A (no code added from figma) |
| State persists across steps (draft + context) | Yes |

---

## File Structure Summary

### No new files created for “Plan / Contribution / Auto Increase / Investment” pages
- Plan → existing `src/pages/enrollment/ChoosePlan.tsx`
- Contribution → existing `src/pages/enrollment/Contribution.tsx`
- Auto Increase → existing `src/pages/enrollment/FutureContributions.tsx`
- Investment → existing `EnrollmentInvestmentsContent` + `src/app/investments/` (layout + page)

### Files modified (theme compliance)
- **`src/pages/enrollment/FutureContributions.tsx`** – Replaced hardcoded hex/rgba (`#d0fae5`, `#a4f4cf`, `#dbeafe`, `#e0e7ff`, `rgba(236,253,245,0.5)` etc.) with token-based values (`rgb(var(--enroll-accent-rgb) / …)`, `rgb(var(--enroll-brand-rgb) / …)`). Removed fallback hex from `var(--enroll-accent, #2b7fff)` and `var(--enroll-accent, #9810fa)`.
- **`src/components/enrollment/EnrollmentStepper.tsx`** – Replaced hardcoded hex (`#155dfc`, `#99a1af`, `#101828`, `#d1d5dc`) with `var(--enroll-brand)`, `var(--enroll-text-muted)`, `var(--enroll-text-primary)`, `var(--enroll-card-border)`.

### New files created
- **`docs/FIGMA_DUMP_EXTRACTION_AND_INTEGRATION.md`** – This report (analysis, mapping, validation, cleanup).

### Deleted files
- **None.** Figma-dump folder was not deleted; it remains as reference only. No production files were removed.

### Integration points
- **Router:** `src/app/router.tsx` (enrollment children).
- **Step paths:** `src/enrollment/enrollmentStepPaths.ts`.
- **Layout:** `src/layouts/EnrollmentLayout.tsx`, `src/components/enrollment/EnrollmentHeaderWithStepper.tsx`, `src/components/enrollment/EnrollmentFooter.tsx`.
- **State:** `src/enrollment/context/EnrollmentContext.tsx`, `src/enrollment/context/useContributionStore.ts`, `src/enrollment/enrollmentDraftStore.ts`.
- **Theme:** `src/theme/tokens.css`, `src/theme/enrollment-dark.css`, `src/index.css`.

---

## Architectural Conflicts Resolved

1. **Two layouts:** Figma App has its own full-page layout and step indicator. We use a single EnrollmentLayout and URL-based steps; figma layout is not used.
2. **Two theme systems:** Figma has local theme.css/tailwind. We use only global tokens and enrollment tokens; no figma theme imported.
3. **Local step state vs URL:** Figma uses `currentStep` in state. We use route paths and `getStepIndex(pathname)`; no conflict.
4. **Mock data:** Figma uses inline planOptions/userDetails. We use EnrollmentContext and draft store; no mock data from figma.

---

## Summary

- **Extraction:** Figma-dump structure was analyzed and documented; no copy-paste of components.
- **Normalization:** Existing enrollment pages already use shared layout, theme, and state; a few hardcoded colors in FutureContributions and EnrollmentStepper were replaced with tokens.
- **Integration:** Plan = ChoosePlan, Contribution = Contribution, Auto Increase = FutureContributions, Investment = EnrollmentInvestmentsContent + investments app; routing and stepper already aligned.
- **Cleanup:** No imports from figma-dump; no duplicate layout/theme/providers; figma-dump retained as reference only.
