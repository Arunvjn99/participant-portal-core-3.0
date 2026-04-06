import { Routes, Route, Navigate } from "react-router-dom";
import { TransactionsToV1Redirect } from "./TransactionsToV1Redirect";
import { Login } from "../pages/auth/Login";
import { VerifyCode } from "../pages/auth/VerifyCode";
import { ForgotPassword } from "../pages/auth/ForgotPassword";
import { ResetPassword } from "../pages/auth/ResetPassword";
import { HelpCenter } from "@/pages/auth/HelpCenter";
import { ChoosePlan } from "../pages/enrollment/ChoosePlan";
import { Contribution } from "../pages/enrollment/Contribution";
import { EnrollmentLayout } from "../layouts/EnrollmentLayout";
import InvestmentsLayout from "../app/investments/layout";
import { StandaloneInvestmentPortfolioPage } from "../pages/investments";
import { EnrollmentV1Layout } from "@/modules/enrollment/v1/layout/EnrollmentLayout";
import { V1_WIZARD_SEGMENTS } from "@/modules/enrollment/v1/flow/v1WizardPaths";

/** Mirror `src/app/router.tsx` wizard paths when using AppRoutes (main app uses RouterProvider + router). */
export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/verify" element={<VerifyCode />} />
      <Route path="/forgot" element={<ForgotPassword />} />
      <Route path="/reset" element={<ResetPassword />} />
      <Route path="/help" element={<HelpCenter />} />
      <Route path="/dashboard" element={<Navigate to="/dashboard/pre-enrollment" replace />} />
      <Route path="/v1/enrollment/auto-increase/config" element={<EnrollmentV1Layout />} />
      <Route path="/v1/enrollment/auto-increase/skip" element={<EnrollmentV1Layout />} />
      {V1_WIZARD_SEGMENTS.filter((slug) => slug !== "auto-increase").map((slug) => (
        <Route
          key={slug}
          path={`/v1/enrollment/${slug}`}
          element={<EnrollmentV1Layout />}
        />
      ))}
      <Route path="/v1/enrollment/auto-increase" element={<EnrollmentV1Layout />} />
      <Route
        path="/enrollment"
        element={<EnrollmentLayout />}
      >
        <Route path="choose-plan" element={<ChoosePlan />} />
        <Route path="contribution" element={<Contribution />} />
      </Route>
      <Route path="/transactions/*" element={<TransactionsToV1Redirect />} />
      {/* Investments route */}
      <Route
        path="/investments"
        element={
          <InvestmentsLayout>
            <StandaloneInvestmentPortfolioPage />
          </InvestmentsLayout>
        }
      />
    </Routes>
  );
};
