import { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { DashboardLayout } from "../../layouts/DashboardLayout";
import { DashboardHeader } from "../../components/dashboard/DashboardHeader";
import { PlanSwitcher } from "./components/PlanSwitcher";
import { ActivityHero } from "./components/ActivityHero";
import { ActivityInsights } from "./components/ActivityInsights";
import { ActionHub } from "./components/ActionHub";
import { StatusTracker } from "./components/StatusTracker";
import { MonthlySummary } from "./components/MonthlySummary";
import { TransactionTimeline } from "./components/TransactionTimeline";
import { TaxImpactPanel } from "./components/TaxImpactPanel";
import { useMultiPlanFilter } from "./hooks/useMultiPlanFilter";
import { useTransactionSummary } from "./hooks/useTransactionSummary";
import { useActivityInsights } from "./hooks/useActivityInsights";

const pageVariants = {
  hidden: { opacity: 0 },
  visible: (reduced: boolean) => ({
    opacity: 1,
    transition: {
      duration: reduced ? 0 : 0.3,
      ease: "easeOut",
      staggerChildren: reduced ? 0 : 0.05,
      delayChildren: reduced ? 0 : 0.02,
    },
  }),
};

const sectionVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (reduced: boolean) => ({
    opacity: 1,
    y: 0,
    transition: { duration: reduced ? 0 : 0.25, ease: "easeOut" },
  }),
};

/**
 * Retirement Activity Intelligence Center
 * Enterprise transaction hub with multi-plan support, insights, and status lifecycle.
 */
export const TransactionsPage = memo(function TransactionsPage() {
  const reduced = !!useReducedMotion();
  const { plans, selectedPlanId, setPlan, hasMultiplePlans } = useMultiPlanFilter();
  const summary = useTransactionSummary(selectedPlanId);
  const insights = useActivityInsights(selectedPlanId);

  return (
    <DashboardLayout header={<DashboardHeader />}>
      <motion.div
        className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8"
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        custom={reduced}
      >
        <motion.header className="mb-6" variants={sectionVariants} custom={reduced}>
          <h1 className="text-xl font-semibold md:text-2xl" style={{ color: "var(--color-text)" }}>
            Retirement Activity
          </h1>
          <p className="mt-0.5 text-sm" style={{ color: "var(--color-text-secondary)" }}>
            Your retirement activity and transaction intelligence.
          </p>
          {hasMultiplePlans && (
            <div className="mt-4">
              <PlanSwitcher
                plans={plans}
                selectedPlanId={selectedPlanId}
                onSelect={setPlan}
                hasMultiplePlans={hasMultiplePlans}
              />
            </div>
          )}
        </motion.header>

        <motion.div variants={sectionVariants} custom={reduced} className="mb-6">
          <ActivityHero
            totalBalance={summary.totalBalance}
            ytdReturnPercent={summary.ytdReturnPercent}
            netFlowThisMonth={summary.netFlowThisMonth}
            chartData={summary.chartData}
          />
        </motion.div>

        <motion.div variants={sectionVariants} custom={reduced} className="mb-6">
          <ActivityInsights insights={insights} />
        </motion.div>

        <motion.div variants={sectionVariants} custom={reduced} className="mb-6">
          <ActionHub />
        </motion.div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-8">
            <motion.div variants={sectionVariants} custom={reduced}>
              <TransactionTimeline />
            </motion.div>
            <motion.div variants={sectionVariants} custom={reduced}>
              <MonthlySummary rows={summary.monthlyBreakdown} />
            </motion.div>
          </div>
          <div className="space-y-6 lg:col-span-4">
            <motion.div variants={sectionVariants} custom={reduced}>
              <StatusTracker />
            </motion.div>
            <motion.div variants={sectionVariants} custom={reduced}>
              <TaxImpactPanel />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
});
