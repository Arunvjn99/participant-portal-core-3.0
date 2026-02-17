import { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { DashboardLayout } from "../../layouts/DashboardLayout";
import { DashboardHeader } from "../../components/dashboard/DashboardHeader";
import { PlanSwitcher } from "./components/PlanSwitcher";
import { ActivityHero } from "./components/ActivityHero";
import { ActivityInsights } from "./components/ActivityInsights";
import { ActionHub } from "./components/ActionHub";
import { StatusTracker } from "./components/StatusTracker";
import { TransactionTimeline } from "./components/TransactionTimeline";
import { ImpactPanel } from "./components/ImpactPanel";
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
 * Premium Retirement Activity Command Center
 * Flow: Awareness → Understanding → Action → Monitoring → History
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
        {/* 1. Plan context */}
        <motion.header className="mb-6" variants={sectionVariants} custom={reduced}>
          <h1 className="text-xl font-semibold md:text-2xl" style={{ color: "var(--color-text)" }}>
            Retirement Activity
          </h1>
          <p className="mt-0.5 text-sm" style={{ color: "var(--color-text-secondary)" }}>
            How your retirement activity is shaping your future.
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

        {/* 2. Financial activity hero (emotional entry) */}
        <motion.div variants={sectionVariants} custom={reduced} className="mb-6">
          <ActivityHero
            totalBalance={summary.totalBalance}
            ytdReturnPercent={summary.ytdReturnPercent}
            netFlowThisMonth={summary.netFlowThisMonth}
            totalContributionsThisYear={summary.totalContributionsThisYear}
            withdrawalsThisYear={summary.withdrawalsThisYear}
            chartData={summary.chartData}
          />
        </motion.div>

        {/* 3. Smart activity insights */}
        <motion.div variants={sectionVariants} custom={reduced} className="mb-6">
          <ActivityInsights insights={insights} />
        </motion.div>

        {/* 4. Action hub (context-aware) */}
        <motion.div variants={sectionVariants} custom={reduced} className="mb-6">
          <ActionHub />
        </motion.div>

        {/* 5. In-progress / status tracker */}
        <motion.div variants={sectionVariants} custom={reduced} className="mb-6">
          <StatusTracker />
        </motion.div>

        {/* 6 & 7. Timeline (left) + Impact (right) — 8/4 grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-8">
            <motion.div variants={sectionVariants} custom={reduced}>
              <TransactionTimeline />
            </motion.div>
          </div>
          <div className="space-y-6 lg:col-span-4">
            <motion.div variants={sectionVariants} custom={reduced}>
              <ImpactPanel monthlyBreakdown={summary.monthlyBreakdown} />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
});
