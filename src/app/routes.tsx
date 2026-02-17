import { Routes, Route } from "react-router-dom";
import { Login } from "../pages/auth/Login";
import { VerifyCode } from "../pages/auth/VerifyCode";
import { ForgotPassword } from "../pages/auth/ForgotPassword";
import { ResetPassword } from "../pages/auth/ResetPassword";
import { HelpCenter } from "@/pages/auth/HelpCenter";
import { Dashboard } from "../pages/dashboard/Dashboard";
import { ChoosePlan } from "../pages/enrollment/ChoosePlan";
import { Contribution } from "../pages/enrollment/Contribution";
import { TransactionsPage } from "../features/transactions/TransactionsPage";
import { TransactionAnalysis } from "../pages/transactions/TransactionAnalysis";
import { TransactionApplicationRouter } from "../pages/transactions/applications/TransactionApplicationRouter";
import { EnrollmentLayout } from "../layouts/EnrollmentLayout";
import InvestmentsLayout from "../app/investments/layout";
import InvestmentsPage from "../app/investments/page";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/verify" element={<VerifyCode />} />
      <Route path="/forgot" element={<ForgotPassword />} />
      <Route path="/reset" element={<ResetPassword />} />
      <Route path="/help" element={<HelpCenter />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route
        path="/enrollment"
        element={<EnrollmentLayout />}
      >
        <Route path="choose-plan" element={<ChoosePlan />} />
        <Route path="contribution" element={<Contribution />} />
      </Route>
      <Route path="/transactions" element={<TransactionsPage />} />
      {/* Generic route handler for all transaction application flows - must come before /transactions/:transactionId */}
      <Route path="/transactions/:transactionType/start" element={<TransactionApplicationRouter />} />
      <Route path="/transactions/:transactionType/:transactionId" element={<TransactionApplicationRouter />} />
      {/* View transaction details - must come after transaction type routes to avoid conflicts */}
      <Route path="/transactions/:transactionId" element={<TransactionAnalysis />} />
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
