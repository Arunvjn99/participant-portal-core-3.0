import type { ReactNode } from "react";
import { createBrowserRouter, Navigate, Outlet, useLocation, useParams } from "react-router-dom";
import { isValidVersion } from "@/core/version";
import { Login } from "../pages/auth/Login";
import { VerifyCode } from "../pages/auth/VerifyCode";
import { ForgotPassword } from "../pages/auth/ForgotPassword";
import { ForgotPasswordVerify } from "../pages/auth/ForgotPasswordVerify";
import { ResetPassword } from "../pages/auth/ResetPassword";
import { HelpCenter } from "../pages/auth/HelpCenter";
import { Signup } from "../pages/auth/Signup";
import { VersionedDashboard } from "../pages/dashboard/VersionedDashboard";
import { PostEnrollmentDashboard } from "../pages/dashboard/PostEnrollmentDashboard";
import { PreEnrollmentDashboard } from "../pages/dashboard/PreEnrollmentDashboard";
import { ParticipantsOverviewDashboard } from "../pages/dashboard/ParticipantsOverviewDashboard";
import { DemoDashboard } from "../pages/dashboard/DemoDashboard";
import { InvestmentPortfolioPage } from "../pages/dashboard/InvestmentPortfolioPage";
import { Profile } from "../pages/profile/Profile";
import { EnrollmentManagement } from "../pages/enrollment/EnrollmentManagement";
import { PlanDetailManagement } from "../pages/enrollment/PlanDetailManagement";
import { PlansPage } from "../pages/enrollment/PlansPage";
import {
  VersionedChoosePlan,
  VersionedContribution,
  VersionedEnrollmentInvestments,
  VersionedEnrollmentReviewContent,
} from "../pages/enrollment/VersionedEnrollmentSteps";
import { VersionedEnrollment } from "../pages/enrollment/VersionedEnrollment";
import { FutureContributions } from "../pages/enrollment/FutureContributions";
import { AutoIncreaseSkipConfirm } from "../pages/enrollment/AutoIncreaseSkipConfirm";
import { TransactionsPage } from "../pages/transactions/TransactionsPage";
import { TransactionAnalysis } from "../pages/transactions/TransactionAnalysis";
import { RebalanceTransactionLayout } from "../pages/transactions/layouts/RebalanceTransactionLayout";
import RebalanceCurrentAllocationPage from "../pages/transactions/rebalance/RebalanceCurrentAllocation";
import RebalanceAdjustAllocationPage from "../pages/transactions/rebalance/RebalanceAdjustAllocation";
import RebalanceTradePreviewPage from "../pages/transactions/rebalance/RebalanceTradePreview";
import RebalanceReviewPage from "../pages/transactions/rebalance/RebalanceReview";
import {
  CrpTransactionFlowPageLayout,
  LoanFlowClient,
  WithdrawFlowClient,
  TransferFlowClient,
  RolloverFlowClient,
} from "@/features/crp-transactions";
import { InvestmentProvider } from "../context/InvestmentContext";
import InvestmentsLayout from "../app/investments/layout";
import { StandaloneInvestmentPortfolioPage } from "../pages/investments";
import { RootLayout } from "../layouts/RootLayout";
import { ProtectedRoute } from "../components/auth/ProtectedRoute";
import { ThemeSettings } from "../pages/settings/ThemeSettings";
import { SettingsHub } from "../pages/settings/SettingsHub";
import { PreEnrollmentDashboardTest } from "../pages/PreEnrollmentDashboardTest";
import { AIAssetsPage } from "../pages/ai-assets";
import { EnrollmentV1Layout } from "@/modules/enrollment/v1/layout/EnrollmentLayout";
import { V1_WIZARD_SEGMENTS } from "@/modules/enrollment/v1/flow/v1WizardPaths";
import { EnrollmentWizard } from "@/features/enrollment";

/** Redirects `/enrollment` and `/enrollment/*` to `/v1/enrollment` equivalents (preserves subpath + query). */
function LegacyEnrollmentRedirect() {
  const { pathname, search } = useLocation();
  const sub = pathname.startsWith("/enrollment/") ? pathname.slice("/enrollment".length) : "";
  const to = sub ? `/v1/enrollment${sub}` : "/v1/enrollment";
  return <Navigate to={`${to}${search}`} replace />;
}

/** Redirects `/transactions` and `/transactions/*` to `/v1/transactions` equivalents (preserves subpath + query). */
function LegacyTransactionsRedirect() {
  const { pathname, search } = useLocation();
  const sub = pathname.startsWith("/transactions/") ? pathname.slice("/transactions".length) : "";
  const to = sub ? `/v1/transactions${sub}` : "/v1/transactions";
  return <Navigate to={`${to}${search}`} replace />;
}

function ProtectedTransactionsOutlet() {
  return (
    <ProtectedRoute>
      <Outlet />
    </ProtectedRoute>
  );
}

/** Invalid `/:version/*` → same path under `/v1` (preserves subpath + query). */
function ValidatedVersionRoute({ children }: { children: ReactNode }) {
  const { version } = useParams();
  const { pathname, search } = useLocation();
  if (!isValidVersion(version ?? "")) {
    const to = pathname.replace(/^\/[^/]+/, "/v1");
    return <Navigate to={`${to}${search}`} replace />;
  }
  return <>{children}</>;
}

/**
 * Router configuration using createBrowserRouter (React Router v6+)
 * RootLayout wraps all routes and renders CoreAIFab on every screen.
 */
export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <Navigate to="/v1/login" replace />,
      },
      {
        path: "/login",
        element: <Navigate to="/v1/login" replace />,
      },
      {
        path: "/verify",
        element: <Navigate to="/v1/verify" replace />,
      },
      {
        path: "/:version/login",
        element: (
          <ValidatedVersionRoute>
            <Login />
          </ValidatedVersionRoute>
        ),
      },
      {
        path: "/:version/verify",
        element: (
          <ValidatedVersionRoute>
            <VerifyCode />
          </ValidatedVersionRoute>
        ),
      },
      {
        path: "/forgot",
        element: <ForgotPassword />,
      },
      {
        path: "/forgot/verify",
        element: <ForgotPasswordVerify />,
      },
      {
        path: "/reset",
        element: <ResetPassword />,
      },
      {
        path: "/help",
        element: <HelpCenter />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute>
            <Navigate to="/dashboard/pre-enrollment" replace />
          </ProtectedRoute>
        ),
      },
      {
        path: "/:version/dashboard",
        element: (
          <ValidatedVersionRoute>
            <ProtectedRoute>
              <VersionedDashboard />
            </ProtectedRoute>
          </ValidatedVersionRoute>
        ),
      },
      {
        path: "/demo",
        element: <DemoDashboard />,
      },
      {
        path: "/test/pre-enrollment-dashboard",
        element: <PreEnrollmentDashboardTest />,
      },
      {
        path: "/dashboard/classic",
        element: (
          <ProtectedRoute>
            <ParticipantsOverviewDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/pre-enrollment",
        element: (
          <ProtectedRoute>
            <PreEnrollmentDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/post-enrollment",
        element: (
          <ProtectedRoute>
            <PostEnrollmentDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/investment-portfolio",
        element: <ProtectedRoute><InvestmentPortfolioPage /></ProtectedRoute>,
      },
      {
        path: "/profile",
        element: <ProtectedRoute><Profile /></ProtectedRoute>,
      },
      {
        path: "/enrollment",
        element: <LegacyEnrollmentRedirect />,
      },
      {
        path: "/enrollment/*",
        element: <LegacyEnrollmentRedirect />,
      },
      /*
       * V1 wizard steps (/v1/enrollment/choose-plan, contribution, source, …):
       * These static paths mount `EnrollmentV1Layout` + `modules/enrollment/v1/screens/*`.
       * They take precedence over `/:version/enrollment/*` children, so edits to
       * `pages/enrollment/VersionedEnrollmentSteps` or `archive/enrollment-v0/*` do NOT apply here.
       *
       * V1 hub only: exact `/v1/enrollment` → `/:version/enrollment` index → `EnrollmentManagement`.
       * V2 steps: `/v2/enrollment/*` uses nested routes under `VersionedEnrollment` (no static override).
       *
       * Auto-increase: register `/auto-increase/config` and `/auto-increase/skip` before `/auto-increase`
       * so "Enable Auto Increase" navigates to the configure screen reliably (RR7 route ranking).
       */
      {
        path: "/v1/enrollment/auto-increase/config",
        element: (
          <ProtectedRoute>
            <EnrollmentV1Layout />
          </ProtectedRoute>
        ),
      },
      {
        path: "/v1/enrollment/auto-increase/skip",
        element: (
          <ProtectedRoute>
            <EnrollmentV1Layout />
          </ProtectedRoute>
        ),
      },
      ...V1_WIZARD_SEGMENTS.filter((slug) => slug !== "auto-increase").map((slug) => ({
        path: `/v1/enrollment/${slug}`,
        element: (
          <ProtectedRoute>
            <EnrollmentV1Layout />
          </ProtectedRoute>
        ),
      })),
      {
        path: "/v1/enrollment/auto-increase",
        element: (
          <ProtectedRoute>
            <EnrollmentV1Layout />
          </ProtectedRoute>
        ),
      },
      {
        path: "/:version/enrollment",
        element: (
          <ValidatedVersionRoute>
            <ProtectedRoute>
              <VersionedEnrollment />
            </ProtectedRoute>
          </ValidatedVersionRoute>
        ),
        children: [
          {
            index: true,
            element: <EnrollmentManagement />,
          },
          {
            path: "manage/:planId",
            element: <PlanDetailManagement />,
          },
          {
            path: "choose-plan",
            element: <VersionedChoosePlan />,
          },
          {
            path: "plans",
            element: <PlansPage />,
          },
          {
            path: "contribution",
            element: <VersionedContribution />,
          },
          {
            path: "auto-increase/skip",
            element: <AutoIncreaseSkipConfirm />,
          },
          {
            path: "auto-increase",
            element: <FutureContributions />,
          },
          {
            path: "future-contributions",
            element: <Navigate to="../auto-increase" replace />,
          },
          {
            path: "investments",
            element: <VersionedEnrollmentInvestments />,
          },
          {
            path: "review",
            element: <VersionedEnrollmentReviewContent />,
          },
        ],
      },
      {
        path: "/transactions",
        element: <LegacyTransactionsRedirect />,
      },
      {
        path: "/transactions/*",
        element: <LegacyTransactionsRedirect />,
      },
      {
        path: "/:version/transactions",
        element: (
          <ValidatedVersionRoute>
            <ProtectedTransactionsOutlet />
          </ValidatedVersionRoute>
        ),
        children: [
          {
            index: true,
            element: <TransactionsPage />,
          },
          {
            path: "loan/*",
            element: (
              <CrpTransactionFlowPageLayout>
                <LoanFlowClient />
              </CrpTransactionFlowPageLayout>
            ),
          },
          {
            path: "withdrawal",
            element: <Navigate to="withdraw" replace />,
          },
          {
            path: "withdrawal/start",
            element: <Navigate to="../withdraw" replace />,
          },
          {
            path: "withdraw/*",
            element: (
              <CrpTransactionFlowPageLayout>
                <WithdrawFlowClient />
              </CrpTransactionFlowPageLayout>
            ),
          },
          {
            path: "transfer/*",
            element: (
              <CrpTransactionFlowPageLayout>
                <TransferFlowClient />
              </CrpTransactionFlowPageLayout>
            ),
          },
          {
            path: "rebalance",
            element: <RebalanceTransactionLayout />,
            children: [
              { index: true, element: <RebalanceCurrentAllocationPage /> },
              { path: "adjust", element: <RebalanceAdjustAllocationPage /> },
              { path: "trades", element: <RebalanceTradePreviewPage /> },
              { path: "review", element: <RebalanceReviewPage /> },
            ],
          },
          {
            path: "rollover/*",
            element: (
              <CrpTransactionFlowPageLayout>
                <RolloverFlowClient />
              </CrpTransactionFlowPageLayout>
            ),
          },
          {
            path: "distribution",
            element: <Navigate to="withdraw" replace />,
          },
          {
            path: ":transactionId",
            element: <TransactionAnalysis />,
          },
        ],
      },
      {
        path: "/enrollment/:step",
        element: (
          <ProtectedRoute>
            <EnrollmentWizard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/settings",
        element: <ProtectedRoute><SettingsHub /></ProtectedRoute>,
      },
      {
        path: "/settings/theme",
        element: <ProtectedRoute><ThemeSettings /></ProtectedRoute>,
      },
      {
        path: "/ai-assets",
        element: (
          <ProtectedRoute>
            <AIAssetsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/investments",
        element: (
          <ProtectedRoute>
            <InvestmentsLayout>
              <StandaloneInvestmentPortfolioPage />
            </InvestmentsLayout>
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
