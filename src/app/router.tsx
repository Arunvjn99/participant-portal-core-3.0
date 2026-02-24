import { createBrowserRouter } from "react-router-dom";
import { Login } from "../pages/auth/Login";
import { VerifyCode } from "../pages/auth/VerifyCode";
import { ForgotPassword } from "../pages/auth/ForgotPassword";
import { ForgotPasswordVerify } from "../pages/auth/ForgotPasswordVerify";
import { ResetPassword } from "../pages/auth/ResetPassword";
import { HelpCenter } from "../pages/auth/HelpCenter";
import { Signup } from "../pages/auth/Signup";
import { PreEnrollment } from "../pages/dashboard/PreEnrollment";
import { Dashboard } from "../pages/dashboard/Dashboard";
import { PostEnrollmentDashboard } from "../pages/dashboard/PostEnrollmentDashboard";
import { DemoDashboard } from "../pages/dashboard/DemoDashboard";
import { InvestmentPortfolioPage } from "../pages/dashboard/InvestmentPortfolioPage";
import { Profile } from "../pages/profile/Profile";
import { EnrollmentManagement } from "../pages/enrollment/EnrollmentManagement";
import { PlanDetailManagement } from "../pages/enrollment/PlanDetailManagement";
import { ChoosePlan } from "../pages/enrollment/ChoosePlan";
import { PlansPage } from "../pages/enrollment/PlansPage";
import { Contribution } from "../pages/enrollment/Contribution";
import { FutureContributions } from "../pages/enrollment/FutureContributions";
import { TransactionsPage } from "../pages/transactions/TransactionsPage";
import { TransactionIntelligenceHub } from "../features/transaction-hub/components/TransactionIntelligenceHub";
import { TransactionAnalysis } from "../pages/transactions/TransactionAnalysis";
import { TransactionApplicationRouter } from "../pages/transactions/applications/TransactionApplicationRouter";
import { EnrollmentLayout } from "../layouts/EnrollmentLayout";
import { InvestmentProvider } from "../context/InvestmentContext";
import InvestmentsLayout from "../app/investments/layout";
import InvestmentsPage from "../app/investments/page";
import { EnrollmentInvestmentsGuard } from "../components/enrollment/EnrollmentInvestmentsGuard";
import { EnrollmentInvestmentsContent } from "../components/enrollment/EnrollmentInvestmentsContent";
import { EnrollmentReviewContent } from "../components/enrollment/EnrollmentReviewContent";
import { RootLayout } from "../layouts/RootLayout";
import { ProtectedRoute } from "../components/auth/ProtectedRoute";
import { ThemeSettings } from "../pages/settings/ThemeSettings";
import { SettingsHub } from "../pages/settings/SettingsHub";

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
        element: <Login />,
      },
      {
        path: "/verify",
        element: <VerifyCode />,
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
        element: <ProtectedRoute><PreEnrollment /></ProtectedRoute>,
      },
      {
        path: "/demo",
        element: <DemoDashboard />,
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
        element: <ProtectedRoute><EnrollmentLayout /></ProtectedRoute>,
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
            element: <ChoosePlan />,
          },
          {
            path: "plans",
            element: <PlansPage />,
          },
          {
            path: "contribution",
            element: <Contribution />,
          },
          {
            path: "future-contributions",
            element: <FutureContributions />,
          },
          {
            path: "investments",
            element: (
              <EnrollmentInvestmentsGuard>
                <EnrollmentInvestmentsContent />
              </EnrollmentInvestmentsGuard>
            ),
          },
          {
            path: "review",
            element: <EnrollmentReviewContent />,
          },
        ],
      },
      {
        path: "/transactions",
        element: <ProtectedRoute><TransactionIntelligenceHub /></ProtectedRoute>,
      },
      {
        path: "/transactions/legacy",
        element: <ProtectedRoute><TransactionsPage /></ProtectedRoute>,
      },
      {
        path: "/transactions/:transactionType/start",
        element: <ProtectedRoute><TransactionApplicationRouter /></ProtectedRoute>,
      },
      {
        path: "/transactions/:transactionType/:transactionId",
        element: <ProtectedRoute><TransactionApplicationRouter /></ProtectedRoute>,
      },
      {
        path: "/transactions/:transactionId",
        element: <ProtectedRoute><TransactionAnalysis /></ProtectedRoute>,
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
