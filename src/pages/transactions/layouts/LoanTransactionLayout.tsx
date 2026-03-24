import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { getRoutingVersion, withVersion } from "@/core/version";
import { TransactionFlowLayout } from "@/components/transactions/TransactionFlowLayout";
import { TxIconLoan } from "@/components/icons/transaction-icons";
import { LoanFlowProvider } from "../contexts/LoanFlowContext";

const STEP_LABELS = ["Eligibility", "Simulator", "Configuration", "Fees", "Documents", "Review"] as const;
const SEGMENTS = ["eligibility", "simulator", "configuration", "fees", "documents", "review"] as const;

function currentLoanStep(pathname: string): number {
  const s = pathname.replace(/^\/v\d+/, "");
  for (let i = 0; i < SEGMENTS.length; i++) {
    if (s.includes(`/loan/${SEGMENTS[i]}`)) return i + 1;
  }
  return 1;
}

export function LoanTransactionLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const version = getRoutingVersion(pathname);
  const step = currentLoanStep(pathname);
  const exit = () => navigate(withVersion(version, "/transactions"));

  return (
    <LoanFlowProvider>
      <TransactionFlowLayout
        flowTitle="Loan request"
        stepLabels={STEP_LABELS}
        currentStep={step}
        onExit={exit}
        brandIcon={<TxIconLoan size={16} className="text-inherit" />}
        exitAriaLabel="Close and return to transaction center"
      >
        <Outlet />
      </TransactionFlowLayout>
    </LoanFlowProvider>
  );
}
