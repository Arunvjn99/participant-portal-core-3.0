import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { getRoutingVersion, withVersion } from "@/core/version";
import { TransactionFlowLayout } from "@/components/transactions/TransactionFlowLayout";
import { TxIconRollover } from "@/components/icons/transaction-icons";
import { RolloverFlowProvider } from "../contexts/RolloverFlowContext";

const STEP_LABELS = ["Plan details", "Validation", "Allocation", "Documents", "Review"] as const;

function currentStep(pathname: string): number {
  const s = pathname.replace(/^\/v\d+/, "");
  if (/\/transactions\/rollover$/.test(s)) return 1;
  const m = s.match(/\/rollover\/([^/]+)$/);
  const seg = m?.[1];
  const map: Record<string, number> = { validation: 2, allocation: 3, documents: 4, review: 5 };
  return seg ? map[seg] ?? 1 : 1;
}

export function RolloverTransactionLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const version = getRoutingVersion(pathname);
  const step = currentStep(pathname);
  const exit = () => navigate(withVersion(version, "/transactions"));

  return (
    <RolloverFlowProvider>
      <TransactionFlowLayout
        flowTitle="Rollover request"
        stepLabels={STEP_LABELS}
        currentStep={step}
        onExit={exit}
        brandIcon={<TxIconRollover size={16} />}
        exitAriaLabel="Close and return to transaction center"
      >
        <Outlet />
      </TransactionFlowLayout>
    </RolloverFlowProvider>
  );
}
