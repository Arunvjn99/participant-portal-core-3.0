import { useLocation, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { TransactionSuccessPanel } from "@/components/transactions/TransactionSuccessPanel";
import { TransactionCenterFigmaBody, type RecentListRow } from "@/components/transactions/center";
import { useVersionedTxNavigate } from "./lib/nav";
import { MOCK_PLAN_SUMMARY } from "./data/mockTransactionCenter";
import { listTransactions } from "@/services/transactionService";
import { getRoutingVersion, withVersion } from "@/core/version";
import type { Transaction } from "@/types/transactions";

function formatMoney(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

function mapTxToRecentRow(t: Transaction): RecentListRow {
  const typeMap: Record<Transaction["type"], RecentListRow["type"]> = {
    loan: "Loan",
    withdrawal: "Withdrawal",
    distribution: "Withdrawal",
    transfer: "Transfer",
    rebalance: "Rebalance",
    rollover: "Rollover",
  };
  const status: RecentListRow["status"] =
    t.status === "completed" || t.status === "funded"
      ? "Completed"
      : t.status === "rejected" || t.status === "cancelled"
        ? "Cancelled"
        : "Processing";

  return {
    id: t.id,
    type: typeMap[t.type] ?? "Transfer",
    amount: t.type === "rebalance" && !t.amount ? "—" : formatMoney(t.amount),
    status,
    date: t.dateInitiated,
    description: t.displayName ?? t.type,
    transactionId: t.id,
  };
}

/**
 * Transaction center — Figma “Implement Current Design (Copy)” layout + versioned flow routes.
 */
export function TransactionsPage() {
  const location = useLocation();
  const go = useVersionedTxNavigate();
  const navigate = useNavigate();
  const version = getRoutingVersion(location.pathname);
  const successState = (location.state as { success?: unknown } | null)?.success;
  const apiRecent = listTransactions().map(mapTxToRecentRow);

  return (
    <DashboardLayout header={<DashboardHeader />}>
      {successState ? <TransactionSuccessPanel /> : null}
      <TransactionCenterFigmaBody
        planName={MOCK_PLAN_SUMMARY.planName}
        planBalanceLabel={formatMoney(MOCK_PLAN_SUMMARY.planBalance)}
        vestedBalanceLabel={formatMoney(MOCK_PLAN_SUMMARY.vestedBalance)}
        vestedPctLabel={`${MOCK_PLAN_SUMMARY.vestedPct} vested`}
        onQuickLoan={() => go("loan/eligibility")}
        onQuickWithdraw={() => go("withdraw")}
        onQuickTransfer={() => go("transfer")}
        onQuickRebalance={() => go("rebalance")}
        onQuickRollover={() => go("rollover")}
        onResumeDraft={(relativePath) => go(relativePath)}
        onResolveAttention={() => go("loan/documents")}
        recentRows={apiRecent.length > 0 ? apiRecent : undefined}
        onRecentRowClick={(id) => navigate(withVersion(version, `/transactions/${id}`))}
      />
    </DashboardLayout>
  );
}

export default TransactionsPage;
