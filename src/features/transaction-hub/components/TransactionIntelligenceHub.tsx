import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { DashboardLayout } from "../../../layouts/DashboardLayout";
import { DashboardHeader } from "../../../components/dashboard/DashboardHeader";
import { MOCK_HUB_DATA } from "../data/mockHubData";
import { FinancialSnapshotStrip } from "./FinancialSnapshotStrip";
import { ActionCommandGrid, type ActionType } from "./ActionCommandGrid";
import { TransactionTimeline } from "./TransactionTimeline";
import { TransactionHistoryTable } from "./TransactionHistoryTable";
import { ImpactInsightPanel } from "./ImpactInsightPanel";
import { LoanGuidedFlow } from "./flows/LoanGuidedFlow";
import { WithdrawalGuidedFlow } from "./flows/WithdrawalGuidedFlow";
import { RebalanceGuidedFlow } from "./flows/RebalanceGuidedFlow";
import { ContributionGuidedFlow } from "./flows/ContributionGuidedFlow";
import { RolloverGuidedFlow } from "./flows/RolloverGuidedFlow";

export function TransactionIntelligenceHub() {
  const { t } = useTranslation();
  const [activeFlow, setActiveFlow] = useState<ActionType | null>(null);

  const data = MOCK_HUB_DATA;

  const openFlow = useCallback((action: ActionType) => {
    setActiveFlow(action);
  }, []);

  const closeFlow = useCallback(() => {
    setActiveFlow(null);
  }, []);

  const handleSnapshotAction = useCallback((tab: string) => {
    const map: Record<string, ActionType> = {
      loan: "loan",
      withdraw: "withdraw",
      rebalance: "rebalance",
      contribution: "contribution",
      rollover: "rollover",
    };
    const action = map[tab];
    if (action) setActiveFlow(action);
  }, []);

  return (
    <DashboardLayout header={<DashboardHeader />}>
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-[var(--color-text)] sm:text-3xl">
          {t("transactionHub.pageTitle")}
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)] sm:text-base">
          {t("transactionHub.pageSubtitle")}
        </p>
      </div>

      {/* Zone 1: Financial Snapshot Strip */}
      <FinancialSnapshotStrip data={data} onTabSelect={handleSnapshotAction} />

      {/* Zone 2: Action Command Grid */}
      <ActionCommandGrid data={data} onAction={openFlow} />

      {/* Zone 3: Active Transactions + History */}
      <div className="grid gap-6 xl:grid-cols-5">
        <div className="xl:col-span-2">
          <TransactionTimeline transactions={data.activeTransactions} />
        </div>
        <div className="xl:col-span-3">
          <TransactionHistoryTable transactions={data.transactionHistory} />
        </div>
      </div>

      {/* Zone 4: Insights */}
      <ImpactInsightPanel data={data} />

      {/* Guided Flow Drawers */}
      <LoanGuidedFlow open={activeFlow === "loan"} onClose={closeFlow} data={data} />
      <WithdrawalGuidedFlow open={activeFlow === "withdraw"} onClose={closeFlow} data={data} />
      <RebalanceGuidedFlow open={activeFlow === "rebalance"} onClose={closeFlow} data={data} />
      <ContributionGuidedFlow open={activeFlow === "contribution"} onClose={closeFlow} data={data} />
      <RolloverGuidedFlow open={activeFlow === "rollover"} onClose={closeFlow} data={data} />
    </DashboardLayout>
  );
}
