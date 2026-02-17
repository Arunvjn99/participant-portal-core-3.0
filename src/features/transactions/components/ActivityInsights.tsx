import { memo } from "react";
import { useTranslation } from "react-i18next";
import { motion, useReducedMotion } from "framer-motion";
import { Sparkles, ArrowRight, AlertTriangle, TrendingUp, Clock, Info } from "lucide-react";
import type { ActivityInsight, InsightImpactType } from "../types";

const IMPACT_KEYS: Record<string, string> = {
  Growth: "transactions.insights.impactGrowth",
  Risk: "transactions.insights.impactRisk",
  Pending: "transactions.insights.impactPending",
  Info: "transactions.insights.impactInfo",
};

interface ActivityInsightsProps {
  insights: ActivityInsight[];
}

const getImpactStyles = (type: InsightImpactType) => {
  switch (type) {
    case "Growth":
      return {
        bg: "var(--color-success-light)",
        border: "var(--color-success)",
        iconBg: "var(--color-success-light)",
        iconColor: "var(--color-success)",
        badge: "var(--color-success)",
        icon: <TrendingUp className="h-5 w-5" />,
      };
    case "Risk":
      return {
        bg: "var(--color-warning-light)",
        border: "var(--color-warning)",
        iconBg: "var(--color-warning-light)",
        iconColor: "var(--color-warning)",
        badge: "var(--color-warning)",
        icon: <AlertTriangle className="h-5 w-5" />,
      };
    case "Pending":
      return {
        bg: "rgb(59 130 246 / 0.1)",
        border: "var(--color-primary)",
        iconBg: "rgb(59 130 246 / 0.15)",
        iconColor: "var(--color-primary)",
        badge: "var(--color-primary)",
        icon: <Clock className="h-5 w-5" />,
      };
    default:
      return {
        bg: "var(--color-background-secondary)",
        border: "var(--color-border)",
        iconBg: "var(--color-background-secondary)",
        iconColor: "var(--color-text-secondary)",
        badge: "var(--color-text-secondary)",
        icon: <Info className="h-5 w-5" />,
      };
  }
};

export const ActivityInsights = memo(function ActivityInsights({ insights }: ActivityInsightsProps) {
  const { t } = useTranslation();
  const reduced = !!useReducedMotion();
  if (insights.length === 0) return null;

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4" style={{ color: "var(--enroll-brand)" }} />
          <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-secondary)" }}>
            {t("transactions.insights.smartPriorityInsights")}
          </h3>
        </div>
        <span
          className="rounded-md px-2 py-1 text-xs font-medium"
          style={{ background: "var(--color-background-secondary)", color: "var(--color-text-tertiary)" }}
        >
          {t("transactions.insights.aiGeneratedToday")}
        </span>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        {insights.map((insight, i) => {
          const impactType = (insight.impactType ?? "Info") as InsightImpactType;
          const styles = getImpactStyles(impactType);

          return (
            <motion.div
              key={insight.id}
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.06, ease: "easeOut" }}
              className="activity-insight-card group flex cursor-pointer flex-col justify-between rounded-[var(--enroll-card-radius)] border p-5 transition-all duration-300 hover:-translate-y-1"
              style={{
                background: "var(--enroll-card-bg)",
                borderColor: styles.border,
                boxShadow: "var(--enroll-elevation-1)",
              }}
            >
              <div className="mb-3 flex items-start justify-between">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-lg"
                  style={{ background: styles.iconBg, color: styles.iconColor }}
                >
                  {styles.icon}
                </div>
                <span
                  className="rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wide"
                  style={{ background: styles.bg, color: styles.badge }}
                >
                  {t(IMPACT_KEYS[impactType] ?? "transactions.insights.impactInfo")}
                </span>
              </div>

              <div>
                <h4 className="mb-2 font-semibold leading-snug" style={{ color: "var(--color-text)" }}>
                  {insight.title}
                </h4>
                <p className="mb-4 text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                  {insight.description}
                </p>
              </div>

              <div
                className="mt-auto flex items-center justify-between border-t pt-4"
                style={{ borderColor: "var(--color-background-secondary)" }}
              >
                {insight.value && (
                  <span
                    className="text-xs font-bold"
                    style={{ color: impactType === "Growth" ? "var(--color-success)" : "var(--color-text-secondary)" }}
                  >
                    {insight.value}
                  </span>
                )}
                {insight.actionLabel && (
                  <button
                    type="button"
                    onClick={insight.onAction}
                    className="flex items-center gap-1 text-xs font-semibold hover:underline"
                    style={{ color: "var(--enroll-brand)" }}
                  >
                    {insight.actionLabel}
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
});
