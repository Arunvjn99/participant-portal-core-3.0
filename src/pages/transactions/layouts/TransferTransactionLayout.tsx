import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { getRoutingVersion, withVersion } from "@/core/version";
import { TransactionFlowLayout } from "@/components/transactions/TransactionFlowLayout";
import { TxIconTransfer } from "@/components/icons/transaction-icons";
import { TransferFlowProvider } from "../contexts/TransferFlowContext";

const STEP_LABELS = ["Type", "Source", "Destination", "Amount", "Impact", "Review"] as const;

function currentStep(pathname: string): number {
  const s = pathname.replace(/^\/v\d+/, "");
  if (/\/transactions\/transfer$/.test(s)) return 1;
  const m = s.match(/\/transfer\/([^/]+)$/);
  const seg = m?.[1];
  const map: Record<string, number> = { source: 2, destination: 3, amount: 4, impact: 5, review: 6 };
  return seg ? map[seg] ?? 1 : 1;
}

export function TransferTransactionLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const version = getRoutingVersion(pathname);
  const step = currentStep(pathname);
  const exit = () => navigate(withVersion(version, "/transactions"));

  return (
    <TransferFlowProvider>
      <TransactionFlowLayout
        flowTitle="Transfer funds"
        stepLabels={STEP_LABELS}
        currentStep={step}
        onExit={exit}
        brandIcon={<TxIconTransfer size={16} />}
        exitAriaLabel="Close and return to transaction center"
      >
        <Outlet />
      </TransactionFlowLayout>
    </TransferFlowProvider>
  );
}
