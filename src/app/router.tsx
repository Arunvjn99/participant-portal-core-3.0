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
import { TransactionApplicationRouter } from "../pages/transactions/applications/TransactionApplicationRouter";
import { InvestmentProvider } from "../context/InvestmentContext";
import InvestmentsLayout from "../app/investments/layout";
import InvestmentsPage from "../app/investments/page";
import { RootLayout } from "../layouts/RootLayout";
import { ProtectedRoute } from "../components/auth/ProtectedRoute";
import { ThemeSettings } from "../pages/settings/ThemeSettings";
import { SettingsHub } from "../pages/settings/SettingsHub";
import { PreEnrollmentDashboardTest } from "../pages/PreEnrollmentDashboardTest";
import { AIAssetsPage } from "../pages/ai-assets";

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
            path: "loan/new",
            element: <Navigate to="loan/start" replace />,
          },
          {
            path: ":transactionType/start",
            element: <TransactionApplicationRouter />,
          },
          {
            path: ":transactionType/:transactionId",
            element: <TransactionApplicationRouter />,
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
