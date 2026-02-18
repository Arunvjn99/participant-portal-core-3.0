import { memo } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { DashboardLayout } from "../../layouts/DashboardLayout";
import { TransactionSuccessScreen } from "../../components/transactions/TransactionSuccessScreen";
import { DashboardHeader } from "../../components/dashboard/DashboardHeader";
import { TransactionsHeader } from "./components/TransactionsHeader";
import { TransactionsOverviewCard } from "./components/TransactionsOverviewCard";
import { TransactionInsights } from "./components/TransactionInsights";
import { QuickActionsPanel } from "./components/QuickActionsPanel";
import { ActivityTimeline } from "./components/ActivityTimeline";
import { ActivityRiskOverview } from "../../features/transactions/components/ActivityRiskOverview";
import { LoanWidget } from "./components/LoanWidget";
import { WithdrawalWidget } from "./components/WithdrawalWidget";
import { RolloverWidget } from "./components/RolloverWidget";
import { useMultiPlanFilter } from "../../features/transactions/hooks/useMultiPlanFilter";
import { useTransactionSummary } from "../../features/transactions/hooks/useTransactionSummary";
import { useActivityInsights } from "../../features/transactions/hooks/useActivityInsights";

const sectionVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (reduced: boolean) => ({
    opacity: 1,
    y: 0,
    transition: { duration: reduced ? 0 : 0.25, ease: "easeOut" },
  }),
};

const contentVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
};

/**
 * Transactions screen — Retirement Activity Command Center.
 * Uses global tokens and shared components only.
 * Flow: Awareness → Understanding → Action → Monitoring → History.
 */
export const TransactionsPage = memo(function TransactionsPage() {
  const { t } = useTranslation();
  const reduced = !!useReducedMotion();
  const location = useLocation();
  const { plans, selectedPlanId, setPlan, hasMultiplePlans } = useMultiPlanFilter();
  const summary = useTransactionSummary(selectedPlanId);
  const insights = useActivityInsights(selectedPlanId, t);

  const pageVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: reduced ? 0 : 0.3 } },
  };

  const successState = (location.state as { success?: { type: string; amount?: number } } | null)?.success;

  return (
    <DashboardLayout header={<DashboardHeader />}>
      {successState && (
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <TransactionSuccessScreen />
        </div>
      )}
      {!successState && (
      <motion.div
        className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8"
        initial="hidden"
        animate="visible"
        variants={pageVariants}
      >
        <motion.div variants={sectionVariants} custom={reduced}>
          <TransactionsHeader
            title={t("transactions.title")}
            subtitle={t("transactions.subtitle")}
            plans={plans}
            selectedPlanId={selectedPlanId}
            onPlanSelect={setPlan}
            hasMultiplePlans={hasMultiplePlans}
          />
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={selectedPlanId ?? "all"}
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: reduced ? 0 : 0.2, ease: "easeOut" }}
            className="space-y-6"
          >
            <motion.section variants={sectionVariants} custom={reduced}>
              <TransactionsOverviewCard
                totalBalance={summary.totalBalance}
                ytdReturnPercent={summary.ytdReturnPercent}
                netFlowThisMonth={summary.netFlowThisMonth}
                contributionsYtd={summary.contributionsYtd}
                withdrawalsYtd={summary.withdrawalsYtd}
                chartData={summary.chartData}
                momentumChartData={summary.momentumChartData}
              />
            </motion.section>

            <motion.section variants={sectionVariants} custom={reduced}>
              <TransactionInsights insights={insights} />
            </motion.section>

            <motion.section variants={sectionVariants} custom={reduced}>
              <QuickActionsPanel />
            </motion.section>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              <div className="space-y-6 lg:col-span-8">
                <motion.section variants={sectionVariants} custom={reduced}>
                  <ActivityTimeline />
                </motion.section>
              </div>
              <aside className="space-y-6 lg:col-span-4">
                <motion.section variants={sectionVariants} custom={reduced}>
                  <ActivityRiskOverview />
                </motion.section>
                <motion.section variants={sectionVariants} custom={reduced} className="space-y-4">
                  <LoanWidget />
                  <WithdrawalWidget />
                  <RolloverWidget />
                </motion.section>
              </aside>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
      )}
    </DashboardLayout>
  );
});
