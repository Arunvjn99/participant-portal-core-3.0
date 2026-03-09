# Page dependency trees

Use these trees to know which files to pass as `--context-file` when designing a page. Trace from entry → all local imports (skip node_modules). Include every file in the tree when running Superdesign create-design-draft or iterate-design-draft for that page. Also add: `src/index.css` (or relevant sections), `tailwind.config.js`, `.superdesign/design-system.md` when it exists.

---

## / (Login)

**Entry**: `src/pages/auth/Login.tsx`

**Dependencies**:
- `src/components/auth/index.ts` (barrel: AuthLayout, AuthFormShell, AuthInput, AuthPasswordInput, AuthButton)
- `src/components/auth/AuthLayout.tsx`
  - `src/components/auth/AuthLeftPanel.tsx`
    - `src/components/auth/LeftPanelCarousel.tsx`
  - `src/components/auth/AuthRightPanel.tsx`
    - `src/components/ui/ThemeToggle.tsx`
    - `src/components/auth/AuthFooter.tsx`
      - `src/config/branding.ts`
- `src/components/auth/AuthFormShell.tsx`
- `src/components/auth/AuthInput.tsx` (uses @radix-ui/react-label)
- `src/components/auth/AuthPasswordInput.tsx` (uses @radix-ui/react-label, lucide-react)
- `src/components/auth/AuthButton.tsx` (uses @radix-ui/react-slot)
- `src/components/brand/Logo.tsx`
- `src/context/AuthContext.tsx` (logic; optional to skip with line range for UI-only)
- `src/context/OtpContext.tsx` (logic)
- `src/lib/network/networkContext.tsx` (logic)
- `src/lib/supabase.ts` (logic)
- `src/config/branding.ts`

**Also include**: `src/theme/tokens.css`, `src/index.css` (or CSS variable + button/auth sections), `tailwind.config.js`, `src/layouts/RootLayout.tsx`, `src/components/GlobalFooter.tsx`.

---

## /dashboard (PreEnrollment)

**Entry**: `src/pages/dashboard/PreEnrollment.tsx`

**Dependencies**:
- `src/layouts/DashboardLayout.tsx`
- `src/components/dashboard/DashboardHeader.tsx`
  - `src/components/common/LanguageSwitcher.tsx` (if exists)
  - `src/components/ui/ThemeToggle.tsx`
  - `src/components/feedback/FeedbackModal.tsx`
  - `src/components/dashboard/NotificationPanel.tsx`
- `src/components/pre-enrollment/HeroSection.tsx`
  - `src/components/pre-enrollment/FloatingCards.tsx`
  - `src/components/enrollment/PersonalizePlanModal.tsx`
- `src/components/pre-enrollment/LearningSection.tsx`
  - `src/components/pre-enrollment/constants.ts`
  - `src/components/pre-enrollment/types.ts` (if exists)
- `src/components/pre-enrollment/AdvisorSection.tsx`
  - `src/components/pre-enrollment/constants.ts`

**Also include**: `src/theme/tokens.css`, `src/index.css` (elevation, hero, glass-card), `tailwind.config.js`, `src/layouts/RootLayout.tsx`, `src/components/GlobalFooter.tsx`.

---

## /enrollment/contribution (Contribution)

**Entry**: `src/pages/enrollment/Contribution.tsx`

**Dependencies**:
- `src/components/enrollment/EnrollmentPageContent.tsx`
- `src/enrollment/context/EnrollmentContext.tsx` (logic; use line range to skip hooks if needed)
- `src/enrollment/enrollmentDraftStore.ts` (logic)
- `src/enrollment/logic/contributionCalculator.ts`
- `src/enrollment/logic/projectionCalculator.ts`
- `src/enrollment/logic/sourceAllocationEngine.ts`
- `src/enrollment/logic/types.ts`
- `src/utils/projectionChartAxis.ts`
- (Contribution also uses inline PaycheckCell and ProjectionLineChart — same file)

**Layout (enrollment step)**:
- `src/layouts/EnrollmentLayout.tsx`
- `src/layouts/DashboardLayout.tsx`
- `src/components/dashboard/DashboardHeader.tsx`
- `src/components/enrollment/EnrollmentHeaderWithStepper.tsx`
  - `src/components/enrollment/EnrollmentStepper.tsx` (or CustomStepper)

**Also include**: `src/theme/tokens.css`, `src/index.css` (enrollment, slider, button), `tailwind.config.js`, `src/components/GlobalFooter.tsx`, `.superdesign/design-system.md` when present.

---

## /enrollment/choose-plan (ChoosePlan)

**Entry**: `src/pages/enrollment/ChoosePlan.tsx`  
Trace its imports (e.g. EnrollmentPageContent, PlanSelectionCard, PlanDetailsPanel, PlanRail, EnrollmentFooter) and add all under `src/components/enrollment/`, plus layouts and theme as above.

---

## /enrollment/plans (PlansPage)

**Entry**: `src/pages/enrollment/PlansPage.tsx`  
Same pattern: EnrollmentPageContent, plan components, EnrollmentLayout, DashboardLayout, DashboardHeader, EnrollmentHeaderWithStepper, theme, globals.

---

## Other key pages

- **Post-enrollment dashboard**: `src/pages/dashboard/PostEnrollmentDashboard.tsx` — depends on dashboard cards, DashboardLayout, DashboardHeader.
- **Transactions hub**: `src/features/transaction-hub/components/TransactionIntelligenceHub.tsx` — plus transaction-hub subcomponents, layouts, theme.
- **Investments**: `src/app/investments/page.tsx` + `src/app/investments/layout.tsx` — investments-specific components and layout.

For any page not listed, start from the route component file and recursively collect all local (non-node_modules) imports; include layout chain (RootLayout → EnrollmentLayout/DashboardLayout/InvestmentsLayout as applicable) and theme/globals.
