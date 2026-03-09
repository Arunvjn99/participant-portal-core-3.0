# UI Design System Audit Report

**Date:** March 8, 2025  
**Scope:** Full project (excluding `src/figma-dump/` reference code)  
**Focus areas:** Dashboard, Enrollment flow, Wizard components, then rest of application

---

## 1. Hardcoded Colors

### 1.1 Hex / RGB in TSX/JSX

| File | Line(s) | Example | Suggested token |
|------|---------|---------|-----------------|
| `enrollment-v2/components/NeedInvestmentHelpCard.tsx` | 24–25, 44 | `#0043aa`, `#155dfc`, `from-[#0043aa] to-[#155dfc]`, `text-[#0043aa]` | `--color-primary`, `--enroll-brand` |
| `enrollment-v2/components/DiversifiedTaxStrategyCallout.tsx` | 14, 18, 22, 25 | `#a2f4fd`, `#ecfeff`, `#00b8db`, `#104e64`, `#007595` | Semantic tokens (e.g. `--color-info-soft`, `--color-info`) |
| `enrollment-v2/components/EnrollmentConfirmModal.tsx` | 128 | `#3B82F6`, `#06B6D4`, `#6366F1` (inline style) | `--color-primary`, chart tokens |
| `enrollment-v2/components/AllocationSummaryChart.tsx` | 31, 54, 58–61, 149–160 | `#2b7fff`, `#00bc7d`, `#fe9a00`, `#101828`, `#6a7282`, `#ecfdf5`, `#a4f4cf`, `#065f46`, `#047857` | Chart + text + success tokens |
| `enrollment-v2/components/InvestmentSummaryCard.tsx` | 63, 66, 95 | `#4a5565`, `#101828`, `#c6d2ff`, `#432dd7` | `--text-secondary`, `--text-primary`, `--enroll-brand` variants |
| `enrollment-v2/components/AllocationBySourceCard.tsx` | 36, 44, 47, 56, 72, 105, 108 | `#101828`, `#6a7282`, `#364153`, `rgba(...)` in shadow | Text/surface tokens, `--shadow-*` |
| `features/enrollment/personalize/SavingsStep.tsx` | 68 | `focus:border-[#2563EB]`, `focus:ring-[#2563EB]/20` | `--color-primary`, `--color-primary-rgb` |
| `components/ui/AgeSelector.tsx` | 83 | `border-[#2563EB]`, `bg-white` (thumb) | `--color-primary`, `--color-surface` |
| `layouts/DashboardLayout.tsx` | 60 | `bg-gray-50` | `--color-background-secondary` or `--surface-2` |

### 1.2 Tailwind color classes (non-token)

Widespread use of raw Tailwind palette classes that should use CSS variables for theme/dark mode:

- **Gray:** `text-gray-400`–`text-gray-900`, `bg-gray-50`–`bg-gray-200`, `border-gray-200`, etc.  
  **Files:** `InvestmentStrategyCard.tsx`, `ContributionProjectionCard.tsx`, `AllocationSummaryChart.tsx`, `AllocationBySourceCard.tsx`, `EnrollmentConfirmModal.tsx`, `ContributionLayoutV2.tsx`, `HeroSection.tsx`, `Stepper.tsx`, `InsightCards.tsx`, `SavingsStep.tsx`, `LocationStep.tsx`, `AgentModeLab.tsx`, and others.
- **Blue:** `bg-blue-500`, `text-blue-600`, `border-blue-200`, `hover:bg-blue-50`, `from-blue-50`, etc.  
  **Files:** `NeedInvestmentHelpCard.tsx`, `PersonalizePlanModal.tsx`, `EnrollmentConfirmModal.tsx`, `AllocationBySourceCard.tsx`, `InvestmentStrategyCard.tsx`, `ContributionQuickSelect.tsx`.
- **Green / Emerald:** `text-green-600`, `bg-green-50`, `border-green-200`, `text-emerald-600`, etc.  
  **Files:** `BenefitChip.tsx`, `ContributionLayoutV2.tsx`, `AllocationSummaryChart.tsx`, `HeroSection.tsx`, `DashboardHeader.tsx`.
- **Indigo / Purple:** `border-indigo-500`, `text-indigo-600`, `from-indigo-500`, `text-purple-400`, etc.  
  **Files:** `InvestmentStrategyCard.tsx`, `InvestmentSummaryCard.tsx`, `EnrollmentConfirmModal.tsx`, `SavingsStep.tsx`, `LocationStep.tsx`.
- **Cyan:** `dark:bg-cyan-900/20`, `dark:text-cyan-200` in `DiversifiedTaxStrategyCallout.tsx`.

**Recommendation:** Replace with semantic tokens (e.g. `var(--color-text-primary)`, `var(--color-surface-elevated)`, `var(--color-primary)`, `var(--color-success)`).

---

## 2. Hardcoded Typography

### 2.1 Inconsistent scale

- **Font sizes:** Mixed use of `text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`, `text-3xl`, `text-4xl`, and arbitrary `text-[11px]`, `text-[12px]` without a single typography scale.
- **Files with arbitrary sizes:**  
  `DiversifiedTaxStrategyCallout.tsx` (`text-[12px]`, `text-[11px]`),  
  `AllocationBySourceCard.tsx` (`text-[11px]`, `text-[10px]`),  
  `InvestmentSummaryCard.tsx` (similar),  
  `DashboardHeader.tsx` (`text-[11px]`).
- **Weights:** Mixed `font-medium`, `font-semibold`, `font-bold`, `font-black` without mapping to named roles (e.g. body, caption, heading).

### 2.2 Recommended typography scale

Define and use utility classes or tokens:

- **Heading XL/LG/MD/SM** → e.g. `.text-heading-xl` … `.text-heading-sm`
- **Body** → `.text-body` (base), `.text-body-sm`
- **Caption** → `.text-caption`

Ensure all `text-*` and `font-*` map to this scale (and avoid raw `text-[Npx]` except where design system explicitly allows).

---

## 3. Hardcoded Spacing

### 3.1 Arbitrary values

- **Border radius:** `rounded-[10px]`, `rounded-[14px]`, `rounded-[20px]` in enrollment-v2, readiness, auto-increase, FutureContributions, AIInsightBanner, etc. Should align to token scale: `--radius-sm` … `--radius-2xl` (e.g. 4, 8, 12, 16).
- **Padding/margin:** Mixed `p-3`, `p-4`, `p-5`, `p-6`, `p-8`, `mb-4`, `mb-5`, `mb-6`, `mt-3`, `gap-2`, `gap-3`, `gap-4`, `gap-8`, and one-off values like `top-10`, `mb-10`.
- **Component-level:** `EnrollmentConfirmModal`: `top-10 left-10`, `top-10 right-10`; `ContributionLayoutV2`: `space-y-6`, `gap-8`; `AuthRightPanel`: `p-6 md:p-8 lg:p-10` (could use spacing scale).

### 3.2 Recommended spacing scale

Use a single scale (e.g. 4, 8, 12, 16, 24, 32, 48) via `--spacing-*` and Tailwind config so that classes like `p-5`, `p-7` are replaced by scale steps (e.g. `p-4` = 16px, `p-6` = 24px).

---

## 4. i18n Violations

User-facing strings that are not using `t()` from react-i18next:

| File | String(s) | Suggested key |
|------|-----------|----------------|
| `pages/dashboard/PreEnrollmentDashboard.tsx` | `"Need help deciding?"` | Already exists: `dashboard.needHelpDecidingTitle` or `enrollment.needHelpDecidingTitle` |
| `enrollment-v2/components/NeedInvestmentHelpCard.tsx` | `"Need investment help?"`, `"Chat with AI experts instantly"` | e.g. `enrollment.needInvestmentHelp`, `enrollment.chatWithAI` |
| `enrollment-v2/components/EnrollmentConfirmModal.tsx` | `"What Happens Next"`, `"Got it"` (if literal) | e.g. `enrollment.whatHappensNext`, `common.gotIt` |
| `enrollment-v2/components/ContributionLayoutV2.tsx` | `"You"`, `"Employer"`, `"Total"`, `"Edit Contribution Split"`, `"Done"` | e.g. `contribution.you`, `contribution.employer`, `contribution.total`, `contribution.editSplit`, `common.done` |
| `enrollment-v2/components/AllocationSummaryChart.tsx` | `"Allocation Summary"`, `"Valid Allocation"`, `"Allocation"` | e.g. `enrollment.allocationSummary`, `enrollment.validAllocation` |
| `enrollment-v2/components/AllocationBySourceCard.tsx` | `"Allocation by Source"`, `"Total Allocation"` | e.g. `enrollment.allocationBySource`, `enrollment.totalAllocation` |
| `enrollment-v2/components/InvestmentStrategyCard.tsx` | `"Allocation:"` | e.g. `enrollment.allocation` |
| `enrollment-v2/components/InvestmentSummaryCard.tsx` | `"You belong to:"`, `"Edit"` | e.g. `enrollment.youBelongTo`, `common.edit` |
| `enrollment-v2/components/ContributionProjectionCard.tsx` | `"Total Value"`, `"Growth"` | e.g. `contribution.totalValue`, `contribution.growth` |
| `features/personalization/components/AgeStep.tsx` | `"Edit"` (button) | `common.edit` or existing personalize key |
| `features/personalization/components/WizardHeader.tsx` | `closeLabel = "Close"` default | `common.close` |
| `features/personalization/components/WizardFooter.tsx` | `"Save & Exit"` | Already in enrollment: `enrollment.footerSaveAndExit` / `personalize.saveAndExit` |
| `pages/AgentModeLab.tsx` | All card titles, labels, options (e.g. "Choose your plan", "Roth", "Traditional", "Contribution", "Auto Increase", "Keep steady", "Grow gradually") | Add `agentModeLab.*` or reuse existing keys |

Ensure all UI copy is keyed in `src/locales/en/common.json` (and other locales) and referenced via `t("...")`.

---

## 5. Component Inconsistencies

### 5.1 Buttons

- **Custom `<button>` instead of `Button`:**  
  Many flows use raw `<button>` with ad-hoc classes instead of `@/components/ui/Button`.  
  **Examples:**  
  `NeedInvestmentHelpCard.tsx`, `EnrollmentConfirmModal.tsx`, `ContributionLayoutV2.tsx` (segmented toggles, "Edit Contribution Split"), `PersonalizePlanModal.tsx` (exit dialog, edit, stepper, close, save & exit), `DashboardHeader.tsx` (nav, user menu, mobile), `ContributionQuickSelect.tsx`, `AllocationBySourceCard.tsx`, `PlanCard.tsx` (enrollment-v2), `AIRecommendationBanner.tsx`, `WizardFooter.tsx`, `WizardHeader.tsx`, `AgeStep.tsx`, `LocationStep.tsx`, `SavingsStep.tsx`, `WizardSteps.tsx`, `InsightCard.tsx`, `AgeSelector.tsx`, `Stepper.tsx`, `FAQSection.tsx`, `AdvisorOptionCard.tsx`, `CoreAssistantModal.tsx`, `DashboardSectionTab.tsx`, `PostEnrollmentDashboard.tsx`, `PostEnrollmentTopBanner.tsx`, `PortfolioHeroSummary.tsx`, `FutureContributions.tsx`, `AllocationEditorModal.tsx`, `InvestorProfileCard.tsx`, `TaxSplitSection.tsx`, `PortfolioScenarioSimulator.tsx`, `EnrollmentFooter` (already uses `Button` for primary/back; verify all CTAs), `PlanCard.tsx` (enrollment), `Login.tsx`.
- **Button styling:** Mix of `bg-emerald-600`, `bg-white`, gradients, and inline styles. Standardize on `Button` variants (e.g. primary, secondary, outline, ghost) that use design tokens.

### 5.2 Cards

- **Ad-hoc card layout:** Many sections use custom `rounded-xl border border-gray-200 bg-white p-5 shadow-sm` (or similar) instead of `@/components/ui/card` (or a shared Card that uses tokens).  
  **Files:** `ContributionProjectionCard.tsx`, `ContributionLayoutV2.tsx`, `AllocationSummaryChart.tsx`, `InvestmentSummaryCard.tsx`, `AllocationBySourceCard.tsx`, `EnrollmentConfirmModal.tsx`, `InvestmentStrategyCard.tsx`, `ContributionCardV2.tsx`, `PlanSummary.tsx`, `ReviewSummaryCard.tsx`, `ContributionQuickSelect.tsx`.
- **Card component:** `components/ui/card.tsx` uses semantic classes (`bg-surface-secondary`, `border-border-subtle`, `text-foreground-primary`). These need to be aligned with the same tokens used elsewhere (e.g. `--color-surface`, `--color-border`, `--color-text-primary`) and then adopted consistently.

### 5.3 Inputs

- **Raw inputs:** `SavingsStep.tsx`, `LocationStep.tsx`, and various wizards use `<input>` with custom classes instead of `@/components/ui/Input` where applicable. Standardize on Input for text/number and ensure focus ring and border use tokens.

### 5.4 Modals

- **Modal usage:** `Modal` from `@/components/ui/Modal` is used in some flows (e.g. PersonalizePlanModal, PersonalizeWizard). EnrollmentConfirmModal and CoreAssistantModal use custom overlay/dialog markup. Prefer shared `Modal` for overlay, focus trap, and escape behavior; style content with tokens.

### 5.5 Badges / chips

- **Ad-hoc badges:** Status and tags are often custom `span`/`div` with one-off colors (e.g. green/emerald for success, blue for primary). Introduce or use a shared Badge/Chip component that supports semantic variants (success, warning, primary, neutral) via tokens.

### 5.6 Dropdowns

- **Custom dropdowns:** DashboardHeader and others use custom dropdowns. Verify whether `@/components/ui/Dropdown` is used where appropriate and that styles use tokens.

---

## 6. Dark Mode Issues

### 6.1 Light-only colors

- **Explicit light surfaces:** `bg-white`, `bg-gray-50`, `border-gray-200` without `dark:` overrides break dark mode.  
  **Files:** `DashboardLayout.tsx` (`bg-gray-50`), `ContributionQuickSelect.tsx` (`bg-white hover:bg-gray-50`), `AgentModeLab.tsx` (multiple `bg-white` cards), `HeroSection.tsx` (`text-gray-500`, `text-gray-600`), and others listed in Hardcoded Colors.
- **Fixed hex on text:** Use of `text-[#101828]`, `text-[#6a7282]`, etc. with only `dark:text-[var(--text-primary)]` in some places; elsewhere no dark variant. Standardize on token-based classes so both themes use the same class (e.g. `text-[var(--color-text-primary)]`).

### 6.2 Partial dark overrides

- Many enrollment-v2 components use the pattern `bg-white dark:bg-[var(--surface-1)]` and `border-gray-200 dark:border-[var(--border-subtle)]`, which is correct in spirit but duplicates. Prefer a single token-based class (e.g. `bg-[var(--surface-1)]` and `border-[var(--border-subtle)]`) so light/dark are switched via `:root` / `.dark` only.
- **Overlay:** `bg-black/60`, `bg-black/50` for modals are acceptable for overlay; ensure no other `bg-black` or `text-white` is used for main UI without a semantic token.

---

## 7. Inconsistent Button Styles

- **Primary CTAs:** Mix of `bg-emerald-600`, `bg-gradient-to-r from-blue-600 to-cyan-600`, `bg-[var(--color-primary)]`, and custom gradients. Standardize on one primary style (e.g. `Button variant="primary"` using `--color-primary`).
- **Secondary/outline:** Mix of `border-2 border-white/50`, `border-[var(--color-border)]`, `hover:bg-indigo-50`, etc. Standardize on `Button variant="secondary"` / `variant="outline"` with tokens.
- **Stepper/icon buttons:** PersonalizePlanModal and others use custom `.premium-wizard__stepper-btn` / `.premium-wizard__exit-btn`. Prefer Button with a small/icon variant and token-based styles.

---

## 8. Suggested Fixes (Summary)

1. **Tokens:** Ensure `styles/tokens.css` (or `theme/tokens.css`) defines and exports a single set of semantic variables (e.g. `--color-primary`, `--color-primary-light`, `--color-background`, `--color-card`, `--color-border`, `--color-text-primary`, `--color-text-secondary`) and that both light and dark themes set them. Replace all hex/rgba and Tailwind color classes in UI with these tokens.
2. **Typography:** Introduce a small typography scale (heading-xl/lg/md/sm, body, caption) and map all text to it; remove arbitrary `text-[Npx]` and inconsistent `font-*`.
3. **Spacing:** Align padding, margin, gap, and radius to a single scale (e.g. 4, 8, 12, 16, 24, 32, 48) and use Tailwind config + tokens so no random values (e.g. `p-7`, `rounded-[14px]`) remain.
4. **i18n:** Move every user-visible string into locale files and use `t()`. Add missing keys for enrollment, contribution, allocation, personalization, and AgentModeLab.
5. **Components:** Use shared `Button`, `Card`, `Input`, `Modal`, `Badge`, `Dropdown` everywhere; refactor custom buttons and card wrappers to these components with variant props driven by tokens.
6. **Dark mode:** Remove hardcoded `bg-white` / `text-gray-*` / `border-gray-*`; use only token-based classes so `.dark` overrides in tokens.css handle theme switch.
7. **Buttons:** Consolidate all primary/secondary/ghost/icon actions into `Button` with variants and token-based styling.

---

## 9. Files to Update (Priority)

**High (Dashboard + Enrollment + Wizard):**

- `src/layouts/DashboardLayout.tsx`
- `src/pages/dashboard/Dashboard.tsx`
- `src/pages/dashboard/PreEnrollmentDashboard.tsx`
- `src/components/dashboard/DashboardHeader.tsx`
- `src/components/dashboard/DashboardSection.tsx`
- `src/components/pre-enrollment/HeroSection.tsx`
- `src/components/enrollment/EnrollmentFooter.tsx`
- `src/components/enrollment/EnrollmentHeaderWithStepper.tsx`
- `src/components/enrollment/PersonalizePlanModal.tsx`
- `src/components/enrollment/PlanCard.tsx`
- `src/enrollment-v2/components/*` (ContributionLayoutV2, AllocationSummaryChart, AllocationBySourceCard, InvestmentSummaryCard, InvestmentStrategyCard, ContributionProjectionCard, NeedInvestmentHelpCard, EnrollmentConfirmModal, BenefitChip, DiversifiedTaxStrategyCallout, ContributionQuickSelect, PlanSummary, ReviewSummaryCard, AIRecommendationBanner, AIInsightBanner)
- `src/features/enrollment/personalize/PersonalizeWizard.tsx`
- `src/features/enrollment/personalize/LocationStep.tsx`
- `src/features/enrollment/personalize/SavingsStep.tsx`
- `src/features/personalization/components/*` (WizardHeader, WizardFooter, AgeStep, WizardSteps)

**Medium:**

- `src/pages/dashboard/PostEnrollmentDashboard.tsx`
- `src/components/ui/Stepper.tsx`
- `src/components/ui/InsightCard.tsx`
- `src/components/ui/AgeSelector.tsx`
- `src/features/enrollment/plan/PlanCardV2.tsx`
- `src/features/enrollment/contribution/ContributionCardV2.tsx`
- `src/features/enrollment/autoIncrease/AutoIncreaseLayoutV2.tsx`
- `src/features/enrollment/readiness/ReadinessLayoutV2.tsx`
- `src/pages/enrollment/FutureContributions.tsx`
- `src/pages/enrollment/Contribution.tsx`

**Low / cleanup:**

- `src/index.css` (replace remaining hex/rgba with tokens where applicable)
- `src/pages/AgentModeLab.tsx` (tokens + i18n if kept)
- Remaining `src/components/*`, `src/features/*`, `src/pages/*` for tokens and components

---

*End of audit. Proceed to Phase 2: refactor using this report.*
