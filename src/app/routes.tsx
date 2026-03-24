import { Routes, Route } from "react-router-dom";
import { TransactionsToV1Redirect } from "./TransactionsToV1Redirect";
import { Login } from "../pages/auth/Login";
import { VerifyCode } from "../pages/auth/VerifyCode";
import { ForgotPassword } from "../pages/auth/ForgotPassword";
import { ResetPassword } from "../pages/auth/ResetPassword";
import { HelpCenter } from "@/pages/auth/HelpCenter";
import { Dashboard } from "../pages/dashboard/Dashboard";
import { ChoosePlan } from "../pages/enrollment/ChoosePlan";
import { Contribution } from "../pages/enrollment/Contribution";
import { EnrollmentLayout } from "../layouts/EnrollmentLayout";
import InvestmentsLayout from "../app/investments/layout";
import InvestmentsPage from "../app/investments/page";
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
      <Route path="/dashboard" element={<Dashboard />} />
      {V1_WIZARD_SEGMENTS.map((slug) => (
        <Route
          key={slug}
          path={`/v1/enrollment/${slug}`}
          element={<EnrollmentV1Layout />}
        />
      ))}
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
            <InvestmentsPage />
          </InvestmentsLayout>
        }
      />
    </Routes>
  );
};
