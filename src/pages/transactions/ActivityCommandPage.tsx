import { memo } from "react";
import { useTranslation } from "react-i18next";
import { motion, useReducedMotion } from "framer-motion";
import { DashboardLayout } from "../../layouts/DashboardLayout";
import { DashboardHeader } from "../../components/dashboard/DashboardHeader";
import { PlanSwitcher } from "../../features/transactions/components/PlanSwitcher";
import { ActivityHero } from "../../features/transactions/components/ActivityHero";
import { ActionHub } from "../../features/transactions/components/ActionHub";
import { ActivityInsights } from "../../features/transactions/components/ActivityInsights";
import { ActivityRiskOverview } from "../../features/transactions/components/ActivityRiskOverview";
import { TransactionTimeline } from "../../features/transactions/components/TransactionTimeline";
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

/**
 * Retirement Activity Command Center — single dashboard view for plan activity,
 * momentum hero, actions, insights, and timeline. Composes existing transaction
 * feature components only. All styling via existing CSS variables (--color-*,
 * --enroll-*). No new tokens, no hardcoded colors, white-label and dark-mode safe.
 */
export const ActivityCommandPage = memo(function ActivityCommandPage() {
  const { t } = useTranslation();
  const reduced = !!useReducedMotion();
  const { plans, selectedPlanId, setPlan, hasMultiplePlans } = useMultiPlanFilter();
  const summary = useTransactionSummary(selectedPlanId);
  const insights = useActivityInsights(selectedPlanId, t);

  return (
    <DashboardLayout header={<DashboardHeader />}>
      <motion.div
        className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { duration: reduced ? 0 : 0.3 },
          },
        }}
      >
        {hasMultiplePlans && (
          <motion.div className="mb-6" variants={sectionVariants} custom={reduced}>
            <PlanSwitcher
              plans={plans}
              selectedPlanId={selectedPlanId}
              onSelect={setPlan}
              hasMultiplePlans={hasMultiplePlans}
            />
          </motion.div>
        )}

        <motion.div variants={sectionVariants} custom={reduced}>
          <ActivityHero
            totalBalance={summary.totalBalance}
            ytdReturnPercent={summary.ytdReturnPercent}
            netFlowThisMonth={summary.netFlowThisMonth}
            contributionsYtd={summary.contributionsYtd}
            withdrawalsYtd={summary.withdrawalsYtd}
            chartData={summary.chartData}
            momentumChartData={summary.momentumChartData}
          />
        </motion.div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="space-y-8 lg:col-span-8">
            <motion.section variants={sectionVariants} custom={reduced}>
              <ActionHub />
            </motion.section>

            {insights.length > 0 && (
              <motion.section variants={sectionVariants} custom={reduced}>
                <ActivityInsights insights={insights} />
              </motion.section>
            )}

            <motion.section variants={sectionVariants} custom={reduced}>
              <h3
                className="mb-4 text-sm font-semibold uppercase tracking-wider"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {t("transactions.timeline.detailedActivity")}
              </h3>
              <TransactionTimeline />
            </motion.section>
          </div>

          <div className="lg:col-span-4">
            <motion.aside
              className="space-y-6"
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.1, ease: "easeOut" }}
            >
              <ActivityRiskOverview />
            </motion.aside>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
});
