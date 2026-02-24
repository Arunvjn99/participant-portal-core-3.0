# Theme Token Migration Audit

## 1. Files Modified (Phase 1 – Critical Path)

| File | Changes |
|------|---------|
| `src/theme/utils.ts` | Added `--color-text-primary` (alias for primary text). Added to `clearThemeFromDOM` list. |
| `src/theme/tokens.css` | Added `--color-text-primary: var(--color-text)` fallback. |
| `src/layouts/DashboardLayout.tsx` | Replaced `border-slate-200`, `bg-white/80`, `dark:border-slate-700`, `dark:bg-slate-900/80` with `border-[var(--color-border)]`, `bg-[var(--color-background)]/80`. Replaced `bg-slate-50 dark:bg-slate-900` with `bg-[var(--color-background)]`. Removed all `dark:` variants. |
| `src/components/dashboard/DashboardHeader.tsx` | Replaced all `text-slate-*`, `bg-slate-*`, `border-slate-*`, `text-amber-*`, `bg-amber-*`, `bg-red-500`, `ring-white`, `dark:*` with theme tokens (`--color-text-primary`, `--color-text-secondary`, `--color-border`, `--color-surface`, `--color-warning`, `--color-danger`, `--color-background`, `--shadow-lg`). Removed all `dark:` variants. |
| `src/components/RouteErrorBoundary.tsx` | Replaced `bg-slate-50`, `border-slate-200`, `bg-white`, `text-slate-900`, `text-slate-600`, `border-slate-300`, `text-slate-700`, `hover:bg-slate-50`, and all `dark:*` with theme tokens. |
| `src/components/ui/ThemeToggle.tsx` | Replaced `text-slate-600`, `hover:bg-slate-100`, `hover:text-slate-900`, `focus:ring-blue-500`, and all `dark:*` with theme tokens. |
| `src/components/common/LanguageSwitcher.tsx` | Replaced `border-slate-200`, `bg-white`, `text-slate-500`, `hover:border-slate-300`, and all `dark:*` with theme tokens. Removed inline `style` for active language (now in class). |
| `src/components/ui/SaveToast.tsx` | Replaced `border-emerald-*`, `bg-emerald-*`, `text-emerald-*`, and all `dark:*` with `--color-success`, `--color-success-light`, `--shadow-lg`. |

**Approximate color replacements in modified files:** 50+ (hardcoded Tailwind/slate/amber/emerald and dark: variants).

---

## 2. Standardized Design Tokens (Central)

Tokens are defined or overridden by `applyThemeToDOM()` in `src/theme/utils.ts` and fallbacks in `src/theme/tokens.css`:

- `--color-primary`
- `--color-secondary`
- `--color-accent`
- `--color-background`
- `--color-surface`
- `--color-border`
- `--color-text` (primary text)
- `--color-text-primary` (alias, added in this audit)
- `--color-text-secondary`
- `--color-success`
- `--color-warning`
- `--color-danger`
- `--color-background-secondary`
- `--color-surface-elevated`
- `--shadow-lg`, `--shadow-md`, etc. (in tokens.css)

---

## 3. Remaining Hardcoded Colors / `dark:` (Not Yet Refactored)

These files still contain hardcoded Tailwind colors (e.g. `text-gray-*`, `bg-gray-*`, `text-slate-*`, `bg-slate-*`, `text-white`, `bg-white`, `text-blue-*`, `border-gray-*`) and/or `dark:` prefixed classes. They should be migrated in a follow-up pass using the same pattern:

- **Auth:** `AuthButton.tsx`, `AuthInput.tsx`, `AuthPasswordInput.tsx`, `AuthOTPInput.tsx`, `AuthLeftPanel.tsx`, `AuthRightPanel.tsx`, `AuthFooter.tsx`, `AuthFormShell.tsx`, `Login.tsx`, `Signup.tsx`, `ForgotPassword.tsx`, `ForgotPasswordVerify.tsx`, `ResetPassword.tsx`, `VerifyCode.tsx`, `HelpCenter.tsx`
- **Dashboard:** `DashboardCard.tsx`, `DashboardSection.tsx`, `PlanOverviewCard.tsx`, `RateOfReturnCard.tsx`, `PortfolioTable.tsx`, `AdvisorCard.tsx`, `HeroEnrollmentCard.tsx`, `LearningResourceCard.tsx`, `LearningResourcesCarousel.tsx`, `ResourceCard.tsx`, `QuickActionsCard.tsx`, `RecentTransactionsCard.tsx`, `GoalSimulatorCard.tsx`, `ScoreUnlockCard.tsx`, `PersonalizedScoreCard.tsx`, `ValuePropCard.tsx`, `Dashboard.tsx`, `DemoDashboard.tsx`
- **Enrollment:** `EnrollmentManagement.tsx`, `EnrollmentStepper.tsx`, `PlanRail.tsx`, `PlanSelectionCard.tsx`, `PersonalizePlanModal.tsx`, `SuccessEnrollmentModal.tsx`, `EnrollmentHeaderWithStepper.tsx`, `PlanDetailsPanel.tsx`, `AIAdvisorModal.tsx`, `InvestmentProfileWizard.tsx`
- **Pre-enrollment:** `HeroSection.tsx`, `AdvisorSection.tsx`, `LearningSection.tsx`, `FloatingCards.tsx`
- **Scenarios:** `ScenarioShell.tsx`, `PreEnrollmentScenario.tsx`, `YoungAccumulatorScenario.tsx`, `RetiredScenario.tsx`, `AtRiskScenario.tsx`, `MidCareerScenario.tsx`
- **Loan:** `LoanBasicsStep.tsx`, `InvestmentBreakdownStep.tsx`, `ConfirmationStep.tsx`, `PaymentSetupStep.tsx`, `LoanReviewStep.tsx`, `DocumentsComplianceStep.tsx`, `AmortizationTable.tsx`, `BankDetailsForm.tsx`, `DocumentUploadCard.tsx`, `LoanReviewSection.tsx`, `LoanIneligibleState.tsx`, `LoanSummaryCard.tsx`, `InvestmentBreakdownTable.tsx`, `DisclosureAccordion.tsx`, `LoanAmountSlider.tsx`
- **Investments:** `AddInvestmentModal.tsx`, `AdvisorHelpWizard.tsx`, `FundAllocationSection.tsx`, `ModerateInvestorChip.tsx`
- **Investment portfolio:** `AIInsightsPanel.tsx`, `SourceOfWealth.tsx`
- **Core AI / Bella:** `MessageInput.tsx`, `MessageBubble.tsx`, `MessageActions.tsx`, `MessageList.tsx`, `CoreAssistantModal.tsx`, `SummaryCard.tsx`, `InteractiveChipGroup.tsx`, `InteractiveOption.tsx`, `SuccessCard.tsx`, `InteractiveCard.tsx`, `AmountSlider.tsx`, `loanFlow.tsx`, `BellaScreen.tsx`, `EnrollmentDecisionUI.tsx`, `ManualInvestmentUI.tsx`
- **UI:** `Input.tsx`, `Dropdown.tsx`, `Switch.tsx`, `card.tsx`, `PasswordStrength.tsx`, `input-otp.tsx`, `FuturisticSearch.tsx`
- **Other:** `FeedbackModal.tsx`, `DemoSwitcher.tsx`, `CoreProductBranding.tsx`, `CoreLogo.tsx`, `CoreAIFab.tsx`, `TransactionSuccessScreen.tsx`, `HeroIllustration.tsx`, `ThemeSettings.tsx`, `AdvancedJsonSection.tsx`, `LivePreviewPanel.tsx`
- **Theme/CSS (intentional):** `theme/defaultThemes.ts` (hex values for theme definitions), `theme/themeManager.ts`, `theme/utils.ts`, `theme/enrollment-dark.css`, `theme/tokens.css` (fallback values), `index.css` (global utilities)

---

## 4. Replacement Pattern (For Remaining Files)

Use these mappings and remove every `dark:` variant:

| Hardcoded | Token-based |
|-----------|-------------|
| `text-gray-900`, `text-slate-900`, `text-slate-700`, `text-slate-800` | `text-[var(--color-text-primary)]` |
| `text-gray-600`, `text-slate-600`, `text-slate-500`, `text-slate-400` | `text-[var(--color-text-secondary)]` |
| `bg-white`, `bg-slate-50` | `bg-[var(--color-background)]` or `bg-[var(--color-surface)]` |
| `bg-slate-100`, `hover:bg-slate-50` | `bg-[var(--color-surface)]` or `hover:bg-[var(--color-background-secondary)]` |
| `border-gray-200`, `border-slate-200`, `border-slate-300` | `border-[var(--color-border)]` |
| `bg-blue-600`, `bg-blue-500` | `bg-[var(--color-primary)]` |
| `text-blue-600`, `text-blue-500` | `text-[var(--color-primary)]` |
| `text-white` (on primary buttons) | `text-white` (keep for contrast) or use a future `--color-primary-contrast` |
| `shadow-lg`, `shadow-sm` | `shadow-[var(--shadow-lg)]`, `shadow-[var(--shadow-sm)]` |
| `dark:*` | Remove; theme context switches variables. |

---

## 5. Preview Override and Dark Classes

- **Preview override:** The temporary theme override in `ThemeContext` (`overrideTheme` → `activeTheme`) drives `currentColors`, and `applyThemeToDOM(currentColors)` updates all CSS variables. So **any component that uses `var(--color-*)` tokens will update when “Preview Globally” is active.** The modified files (layout, header, error boundary, theme toggle, language switcher, save toast) now use only these tokens and therefore respond to the preview.
- **Dark classes:** All `dark:` variants were removed from the modified files. **Many other files still contain `dark:`**; they were not changed in this phase. Those components will not reflect the temporary override for the dark-mode parts until they are refactored to use theme tokens only (no `dark:`).

---

## 6. Verification Checklist

- [x] Layout and header use theme tokens only (no hardcoded slate/white/dark).
- [x] RouteErrorBoundary uses theme tokens only.
- [x] ThemeToggle and LanguageSwitcher use theme tokens only; no `dark:`.
- [x] SaveToast uses semantic tokens only; no `dark:`.
- [x] `--color-text-primary` added and used where appropriate.
- [ ] Remaining files (list above) still to be migrated.
- [ ] After full migration: no `dark:` classes remain; preview override affects entire app.

---

## 7. Do Not Break

- No routing changes.
- No i18n changes.
- No AI system changes.
- No layout or spacing changes; only color-related classes and token usage.
- ThemeToggle behavior unchanged (still toggles light/dark via ThemeContext).
