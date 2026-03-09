# Layouts

Shared layout components used across the app. Full source below.

---

## 1. RootLayout

**Path**: `src/layouts/RootLayout.tsx`  
**Purpose**: Wraps all routes. Renders main (Outlet + RouteErrorBoundary), GlobalFooter, CoreAIFab (when enabled), DemoSwitcher.

```tsx
import { Outlet, useLocation } from "react-router-dom";
import { CoreAIFab } from "../components/ai/CoreAIFab";
import { DemoSwitcher } from "../components/demo/DemoSwitcher";
import { GlobalFooter } from "../components/GlobalFooter";
import { RouteErrorBoundary } from "../components/RouteErrorBoundary";
import { useAISettings } from "../context/AISettingsContext";
import { CoreAIModalProvider } from "../context/CoreAIModalContext";

const HIDE_CORE_AI_PATHS = ["/"];

export const RootLayout = () => {
  const { pathname } = useLocation();
  const { coreAIEnabled } = useAISettings();
  const showCoreAI =
    coreAIEnabled && !HIDE_CORE_AI_PATHS.includes(pathname);

  return (
    <CoreAIModalProvider>
      <div className="flex min-h-screen flex-col">
        <main className="flex-1">
          <RouteErrorBoundary>
            <Outlet />
          </RouteErrorBoundary>
        </main>
        <GlobalFooter />
      </div>
      {showCoreAI && <CoreAIFab />}
      <DemoSwitcher />
    </CoreAIModalProvider>
  );
};
```

---

## 2. DashboardLayout

**Path**: `src/layouts/DashboardLayout.tsx`  
**Purpose**: Shared header base: optional header + subHeader (e.g. stepper), main content area with max-w-7xl. Supports transparentBackground and mainCompactTop.

```tsx
import type { ReactNode } from "react";

interface DashboardLayoutProps {
  header?: ReactNode;
  subHeader?: ReactNode;
  children: ReactNode;
  mainCompactTop?: boolean;
  transparentBackground?: boolean;
}

const HEADER_BASE =
  "relative sticky top-0 z-40 shrink-0 bg-[var(--color-background)]/80 backdrop-blur-md supports-[backdrop-filter]:bg-[var(--color-background)]/80 pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]";
const HEADER_WITH_BORDER = "border-b border-[var(--color-border)]";
const HEADER_FIXED_H = "h-14 lg:h-16";

export const DashboardLayout = ({
  header,
  subHeader,
  children,
  mainCompactTop = false,
  transparentBackground = false,
}: DashboardLayoutProps) => {
  const mainPadding = mainCompactTop
    ? "pt-3 pb-12 md:pt-4 md:pb-12"
    : "py-6 pb-12 md:py-8 md:pb-12";

  const headerClass = subHeader
    ? HEADER_BASE
    : `${HEADER_BASE} ${HEADER_WITH_BORDER} ${HEADER_FIXED_H}`;

  if (transparentBackground) {
    return (
      <div className="dashboard-layout flex min-h-screen flex-col bg-transparent">
        {(header || subHeader) && (
          <header className={headerClass}>
            {header}
            {subHeader}
          </header>
        )}
        <div className="flex-1 min-h-0 overflow-x-hidden bg-[var(--color-background)]">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 pt-4 pb-12 sm:px-6 md:pb-16 lg:px-8">
            {children}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout flex min-h-screen flex-col bg-background">
      {(header || subHeader) && (
        <header className={headerClass}>
          {header}
          {subHeader}
        </header>
      )}
      <main
        className={`dashboard-layout__main flex-1 min-h-0 overflow-x-hidden ${mainPadding}`}
      >
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 sm:gap-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
};
```

---

## 3. EnrollmentLayout

**Path**: `src/layouts/EnrollmentLayout.tsx`  
**Purpose**: Wraps enrollment routes with EnrollmentProvider. For step paths (choose-plan, contribution, future-contributions, investments, review) uses DashboardLayout with DashboardHeader + EnrollmentHeaderWithStepper; otherwise just Outlet.

```tsx
import { Outlet, useLocation } from "react-router-dom";
import { DashboardLayout } from "./DashboardLayout";
import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { EnrollmentHeaderWithStepper } from "../components/enrollment/EnrollmentHeaderWithStepper";
import { EnrollmentProvider } from "../enrollment/context/EnrollmentContext";
import { loadEnrollmentDraft } from "../enrollment/enrollmentDraftStore";

const ENROLLMENT_STEP_PATHS = [
  "/enrollment/choose-plan",
  "/enrollment/contribution",
  "/enrollment/future-contributions",
  "/enrollment/investments",
  "/enrollment/review",
] as const;

function pathToStep(pathname: string): number {
  const i = ENROLLMENT_STEP_PATHS.indexOf(pathname as (typeof ENROLLMENT_STEP_PATHS)[number]);
  return i >= 0 ? i : 0;
}

function useIsEnrollmentStepPath(): boolean {
  const { pathname } = useLocation();
  return ENROLLMENT_STEP_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

function EnrollmentStepLayout() {
  const location = useLocation();
  const isStep = useIsEnrollmentStepPath();
  const pathname = location.pathname;
  const step = pathToStep(pathname);

  if (isStep) {
    return (
      <DashboardLayout
        header={<DashboardHeader />}
        subHeader={<EnrollmentHeaderWithStepper activeStep={step} />}
        transparentBackground
      >
        <div>
          <Outlet />
        </div>
      </DashboardLayout>
    );
  }
  return (
    <div>
      <Outlet />
    </div>
  );
}

export const EnrollmentLayout = () => {
  const draft = loadEnrollmentDraft();

  return (
    <EnrollmentProvider
      initialSalary={draft?.annualSalary}
      initialAge={draft?.currentAge}
      initialRetirementAge={draft?.retirementAge}
      initialBalance={draft?.otherSavings?.amount ?? undefined}
      initialSelectedPlan={draft?.selectedPlanId ?? undefined}
      initialContributionType={draft?.contributionType}
      initialContributionAmount={draft?.contributionAmount}
      initialSourceAllocation={draft?.sourceAllocation}
      initialInvestmentProfile={draft?.investmentProfile}
      initialInvestmentProfileCompleted={draft?.investmentProfileCompleted}
    >
      <EnrollmentStepLayout />
    </EnrollmentProvider>
  );
};
```

---

## 4. GlobalFooter

**Path**: `src/components/GlobalFooter.tsx`  
**Purpose**: App-wide footer; centered "© {year} CORE All rights reserved." (branding.authAppName).

```tsx
import { branding } from "../config/branding";

export const GlobalFooter = () => {
  const year = new Date().getFullYear();

  return (
    <footer
      className="mt-auto flex w-full flex-shrink-0 justify-center px-4 py-8"
      role="contentinfo"
      style={{ background: "var(--surface-primary, #fff)" }}
    >
      <p
        className="text-center text-sm font-normal"
        style={{ color: "var(--color-textSecondary, #64748b)" }}
      >
        © {year} {branding.authAppName} All rights reserved.
      </p>
    </footer>
  );
};
```

---

## 5. InvestmentsLayout

**Path**: `src/app/investments/layout.tsx`  
**Purpose**: Wraps `/investments` page (InvestmentsPage). Read this file for full JSX when designing investments UI.
