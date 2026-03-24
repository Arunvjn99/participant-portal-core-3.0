import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { getRoutingVersion, withVersion } from "@/core/version";
import { TransactionFlowLayout } from "@/components/transactions/TransactionFlowLayout";
import { TxIconWithdraw } from "@/components/icons/transaction-icons";
import { WithdrawFlowProvider } from "../contexts/WithdrawFlowContext";

const STEP_LABELS = ["Eligibility", "Type", "Source", "Fees", "Payment", "Review"] as const;

function currentStep(pathname: string): number {
  const s = pathname.replace(/^\/v\d+/, "");
  if (/\/transactions\/withdraw$/.test(s)) return 1;
  const m = s.match(/\/withdraw\/([^/]+)$/);
  const seg = m?.[1];
  const map: Record<string, number> = { type: 2, source: 3, fees: 4, payment: 5, review: 6 };
  return seg ? map[seg] ?? 1 : 1;
}

export function WithdrawTransactionLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const version = getRoutingVersion(pathname);
  const step = currentStep(pathname);
  const exit = () => navigate(withVersion(version, "/transactions"));

  return (
    <WithdrawFlowProvider>
      <TransactionFlowLayout
        flowTitle="Withdrawal request"
        stepLabels={STEP_LABELS}
        currentStep={step}
        onExit={exit}
        brandIcon={<TxIconWithdraw size={16} />}
        exitAriaLabel="Close and return to transaction center"
      >
        <Outlet />
      </TransactionFlowLayout>
    </WithdrawFlowProvider>
  );
}
