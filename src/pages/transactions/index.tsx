import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { TransactionSuccessPanel } from "@/components/transactions/TransactionSuccessPanel";
import { TransactionCenterClient } from "@/features/crp-transactions";
import { getRoutingVersion, withVersion } from "@/core/version";
import { useDemoUser } from "@/hooks/useDemoUser";
import { demoTransactionPlanForBalance } from "@/lib/demoTransactionSeed";
import { recentTransactionsFromScenario } from "@/lib/scenarioTransactionCenter";
import { listTransactions } from "@/services/transactionService";
import { useScenarioStore } from "@/store/scenarioStore";
import type { RecentTransaction as CrpRecent } from "@/features/crp-transactions";
import type { Transaction } from "@/types/transactions";

function formatMoney(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

/** Map API transactions into CRP-style recent rows for optional merge (same shape as MOCK_RECENT). */
function mapTxToCrpRecent(tx: Transaction): CrpRecent {
  const typeMap: Record<Transaction["type"], CrpRecent["type"]> = {
    loan: "loan",
    withdrawal: "withdraw",
    distribution: "withdraw",
    transfer: "transfer",
    rebalance: "transfer",
    rollover: "rollover",
  };
  const status: CrpRecent["status"] =
    tx.status === "completed" || tx.status === "funded"
      ? "completed"
      : tx.status === "rejected" || tx.status === "cancelled"
        ? "cancelled"
        : "processing";

  return {
    id: tx.id,
    type: typeMap[tx.type] ?? "transfer",
    description: tx.displayName ?? tx.type,
    amount: tx.type === "rebalance" && !tx.amount ? "—" : formatMoney(tx.amount),
    status,
    date: tx.dateInitiated,
  };
}

/**
 * Transaction center — core-retirement-platform `TransactionCenterClient` + versioned routes.
 * Optional: merge service transactions into recent list when present.
 */
export function TransactionsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const version = getRoutingVersion(location.pathname);
  const successState = (location.state as { success?: unknown } | null)?.success;
  const apiRecent = listTransactions().map((tx) => mapTxToCrpRecent(tx));
  const demoUser = useDemoUser();
  const scenario = useScenarioStore((s) => (s.isDemoMode ? s.scenarioData : null));
  const scenarioRecent = useMemo(() => recentTransactionsFromScenario(scenario), [scenario]);

  const planSummaryOverride = useMemo(() => {
    if (scenario?.permissions.canAccessTransactions) {
      return demoTransactionPlanForBalance(scenario.financial.balance);
    }
    if (demoUser?.flags.demoTransactions) {
      return demoTransactionPlanForBalance(demoUser.balance);
    }
    return undefined;
  }, [scenario, demoUser]);

  const recentOverride =
    scenarioRecent ?? (apiRecent.length > 0 ? apiRecent : undefined);

  return (
    <DashboardLayout header={<DashboardHeader />}>
      {successState ? <TransactionSuccessPanel /> : null}
      <TransactionCenterClient
        planSummaryOverride={planSummaryOverride}
        recentOverride={recentOverride}
        onRecentRowClick={(id) => navigate(withVersion(version, `/transactions/${id}`))}
      />
    </DashboardLayout>
  );
}

export default TransactionsPage;
