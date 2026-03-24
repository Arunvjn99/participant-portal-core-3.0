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
import { Dashboard } from "../pages/dashboard/Dashboard";
import { VersionedDashboard } from "../pages/dashboard/VersionedDashboard";
import { PostEnrollmentDashboard } from "../pages/dashboard/PostEnrollmentDashboard";
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
import { TransactionsPage } from "../pages/transactions/TransactionsPage";
import { TransactionAnalysis } from "../pages/transactions/TransactionAnalysis";
import { LoanTransactionLayout } from "../pages/transactions/layouts/LoanTransactionLayout";
import { WithdrawTransactionLayout } from "../pages/transactions/layouts/WithdrawTransactionLayout";
import { TransferTransactionLayout } from "../pages/transactions/layouts/TransferTransactionLayout";
import { RebalanceTransactionLayout } from "../pages/transactions/layouts/RebalanceTransactionLayout";
import { RolloverTransactionLayout } from "../pages/transactions/layouts/RolloverTransactionLayout";
import LoanEligibilityPage from "../pages/transactions/loan/eligibility";
import LoanSimulatorPage from "../pages/transactions/loan/simulator";
import LoanConfigurationPage from "../pages/transactions/loan/configuration";
import LoanFeesPage from "../pages/transactions/loan/fees";
import LoanDocumentsPage from "../pages/transactions/loan/documents";
import LoanReviewPage from "../pages/transactions/loan/review";
import WithdrawEligibilityPage from "../pages/transactions/withdraw/WithdrawEligibility";
import WithdrawTypePage from "../pages/transactions/withdraw/WithdrawType";
import WithdrawSourcePage from "../pages/transactions/withdraw/WithdrawSource";
import WithdrawFeesPage from "../pages/transactions/withdraw/WithdrawFees";
import WithdrawPaymentPage from "../pages/transactions/withdraw/WithdrawPayment";
import WithdrawReviewPage from "../pages/transactions/withdraw/WithdrawReview";
import TransferTypePage from "../pages/transactions/transfer/TransferType";
import TransferSourceFundsPage from "../pages/transactions/transfer/TransferSourceFunds";
import TransferDestinationPage from "../pages/transactions/transfer/TransferDestination";
import TransferAmountPage from "../pages/transactions/transfer/TransferAmount";
import TransferImpactPage from "../pages/transactions/transfer/TransferImpact";
import TransferReviewPage from "../pages/transactions/transfer/TransferReview";
import RebalanceCurrentAllocationPage from "../pages/transactions/rebalance/RebalanceCurrentAllocation";
import RebalanceAdjustAllocationPage from "../pages/transactions/rebalance/RebalanceAdjustAllocation";
import RebalanceTradePreviewPage from "../pages/transactions/rebalance/RebalanceTradePreview";
import RebalanceReviewPage from "../pages/transactions/rebalance/RebalanceReview";
import RolloverPlanDetailsPage from "../pages/transactions/rollover/RolloverPlanDetails";
import RolloverValidationPage from "../pages/transactions/rollover/RolloverValidation";
import RolloverAllocationPage from "../pages/transactions/rollover/RolloverAllocation";
import RolloverDocumentsPage from "../pages/transactions/rollover/RolloverDocuments";
import RolloverReviewPage from "../pages/transactions/rollover/RolloverReview";
import { InvestmentProvider } from "../context/InvestmentContext";
import InvestmentsLayout from "../app/investments/layout";
import InvestmentsPage from "../app/investments/page";
import { RootLayout } from "../layouts/RootLayout";
import { ProtectedRoute } from "../components/auth/ProtectedRoute";
import { ThemeSettings } from "../pages/settings/ThemeSettings";
import { SettingsHub } from "../pages/settings/SettingsHub";
import { PreEnrollmentDashboardTest } from "../pages/PreEnrollmentDashboardTest";
import { AIAssetsPage } from "../pages/ai-assets";
import { EnrollmentV1Layout } from "@/modules/enrollment/v1/layout/EnrollmentLayout";
import { V1_WIZARD_SEGMENTS } from "@/modules/enrollment/v1/flow/v1WizardPaths";

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
            <Navigate to="/v1/dashboard" replace />
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
        element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
      },
      {
        path: "/dashboard/post-enrollment",
        element: <ProtectedRoute><PostEnrollmentDashboard /></ProtectedRoute>,
      },
      {
        path: "/dashboard/overview",
        element: (
          <ProtectedRoute>
            <ParticipantsOverviewDashboard />
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
      ...V1_WIZARD_SEGMENTS.map((slug) => ({
        path: `/v1/enrollment/${slug}`,
        element: (
          <ProtectedRoute>
            <EnrollmentV1Layout />
          </ProtectedRoute>
        ),
      })),
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
            path: "loan",
            element: <LoanTransactionLayout />,
            children: [
              { index: true, element: <Navigate to="eligibility" replace /> },
              { path: "new", element: <Navigate to="eligibility" replace /> },
              { path: "eligibility", element: <LoanEligibilityPage /> },
              { path: "simulator", element: <LoanSimulatorPage /> },
              { path: "configuration", element: <LoanConfigurationPage /> },
              { path: "fees", element: <LoanFeesPage /> },
              { path: "documents", element: <LoanDocumentsPage /> },
              { path: "review", element: <LoanReviewPage /> },
            ],
          },
          {
            path: "withdrawal",
            element: <Navigate to="withdraw" replace />,
          },
          {
            path: "withdraw",
            element: <WithdrawTransactionLayout />,
            children: [
              { index: true, element: <WithdrawEligibilityPage /> },
              { path: "type", element: <WithdrawTypePage /> },
              { path: "source", element: <WithdrawSourcePage /> },
              { path: "fees", element: <WithdrawFeesPage /> },
              { path: "payment", element: <WithdrawPaymentPage /> },
              { path: "review", element: <WithdrawReviewPage /> },
            ],
          },
          {
            path: "transfer",
            element: <TransferTransactionLayout />,
            children: [
              { index: true, element: <TransferTypePage /> },
              { path: "source", element: <TransferSourceFundsPage /> },
              { path: "destination", element: <TransferDestinationPage /> },
              { path: "amount", element: <TransferAmountPage /> },
              { path: "impact", element: <TransferImpactPage /> },
              { path: "review", element: <TransferReviewPage /> },
            ],
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
            path: "rollover",
            element: <RolloverTransactionLayout />,
            children: [
              { index: true, element: <RolloverPlanDetailsPage /> },
              { path: "validation", element: <RolloverValidationPage /> },
              { path: "allocation", element: <RolloverAllocationPage /> },
              { path: "documents", element: <RolloverDocumentsPage /> },
              { path: "review", element: <RolloverReviewPage /> },
            ],
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
            <InvestmentProvider>
              <InvestmentsLayout>
                <InvestmentsPage />
              </InvestmentsLayout>
            </InvestmentProvider>
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
