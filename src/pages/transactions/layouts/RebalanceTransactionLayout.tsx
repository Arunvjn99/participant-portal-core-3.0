import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { getRoutingVersion, withVersion } from "@/core/version";
import { TransactionFlowLayout } from "@/components/transactions/TransactionFlowLayout";
import { TxIconRebalance } from "@/components/icons/transaction-icons";
import { RebalanceFlowProvider } from "../contexts/RebalanceFlowContext";

const STEP_LABELS = ["Current", "Target", "Trades", "Review"] as const;

function currentStep(pathname: string): number {
  const s = pathname.replace(/^\/v\d+/, "");
  if (/\/transactions\/rebalance$/.test(s)) return 1;
  const m = s.match(/\/rebalance\/([^/]+)$/);
  const seg = m?.[1];
  const map: Record<string, number> = { adjust: 2, trades: 3, review: 4 };
  return seg ? map[seg] ?? 1 : 1;
}

export function RebalanceTransactionLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const version = getRoutingVersion(pathname);
  const step = currentStep(pathname);
  const exit = () => navigate(withVersion(version, "/transactions"));

  return (
    <RebalanceFlowProvider>
      <TransactionFlowLayout
        flowTitle="Rebalance portfolio"
        stepLabels={STEP_LABELS}
        currentStep={step}
        onExit={exit}
        brandIcon={<TxIconRebalance size={16} />}
        exitAriaLabel="Close and return to transaction center"
      >
        <Outlet />
      </TransactionFlowLayout>
    </RebalanceFlowProvider>
  );
}
