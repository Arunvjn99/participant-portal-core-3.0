import { memo } from "react";
import { useTranslation } from "react-i18next";
import { motion, useReducedMotion } from "framer-motion";
import { Card, CardContent } from "../../../components/ui/card";
import { ProgressBar } from "../../../components/dashboard/shared/ProgressBar";
import { Clock, CheckCircle2, AlertCircle, ShieldCheck, TrendingUp } from "lucide-react";

/**
 * Activity & Status + Risk & Projection sidebar panel.
 * Uses enrollment/transaction design tokens only.
 */
export const ActivityRiskOverview = memo(function ActivityRiskOverview() {
  const { t } = useTranslation();
  const reduced = !!useReducedMotion();

  return (
    <div className="space-y-6">
      {/* Section 1: Activity & Status */}
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <Card className="sticky top-6 border-[var(--color-border)]" style={{ boxShadow: "var(--shadow-soft)" }}>
          <div className="border-b px-4 py-4" style={{ borderColor: "var(--color-border)" }}>
            <h3 className="text-base font-semibold" style={{ color: "var(--color-text)" }}>
              {t("transactions.riskOverview.activityStatus")}
            </h3>
          </div>
          <CardContent className="space-y-6 p-4">
            {/* Rollover Verification */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium" style={{ color: "var(--color-text)" }}>
                  {t("transactions.riskOverview.rolloverVerification")}
                </span>
                <span
                  className="rounded px-1.5 py-0.5 text-xs font-bold"
                  style={{ background: "var(--txn-brand-soft)", color: "var(--enroll-brand)" }}
                >
                  {t("transactions.riskOverview.inProgress")}
                </span>
              </div>
              <ProgressBar value={75} max={100} height={6} barColor="var(--enroll-brand)" />
              <div className="mt-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs" style={{ color: "var(--color-text-secondary)" }}>
                  <Clock className="h-3 w-3" style={{ color: "var(--color-text-tertiary)" }} /> {t("transactions.riskOverview.etaDays", { days: 3 })}
                </span>
                <span className="text-xs font-medium" style={{ color: "var(--color-text-tertiary)" }}>
                  {t("transactions.riskOverview.stepOf", { current: 3, total: 4 })}
                </span>
              </div>
            </div>

            <div className="h-px" style={{ background: "var(--color-border)" }} />

            {/* Pending Withdrawal */}
            <div>
              <div className="mb-2 flex items-start justify-between">
                <div>
                  <span className="block text-sm font-medium" style={{ color: "var(--color-text)" }}>
                    {t("transactions.riskOverview.pendingWithdrawal")}
                  </span>
                  <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                    Hardship Request #W992
                  </span>
                </div>
                <div
                  className="mt-1.5 h-2 w-2 animate-pulse rounded-full"
                  style={{ background: "var(--color-warning)", boxShadow: "0 0 8px rgb(var(--color-warning-rgb) / 0.5)" }}
                />
              </div>
              <div
                className="mt-2 flex items-start gap-2 rounded-md border p-2 text-xs"
                style={{
                  background: "var(--color-warning-light)",
                  borderColor: "var(--color-warning)",
                  color: "var(--color-warning)",
                }}
              >
                <AlertCircle className="mt-0.5 h-3 w-3 flex-shrink-0" />
                <span>{t("transactions.riskOverview.awaitingApproval")}</span>
              </div>
            </div>

            <div className="h-px" style={{ background: "var(--color-border)" }} />

            {/* Completed */}
            <div className="flex cursor-default items-start gap-3 opacity-60 transition-opacity hover:opacity-100">
              <CheckCircle2 className="h-5 w-5 flex-shrink-0" style={{ color: "var(--color-success)" }} />
              <div>
                <span className="block text-sm font-medium line-through" style={{ color: "var(--color-text)" }}>
                  {t("transactions.riskOverview.quarterlyRebalancing")}
                </span>
                <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                  {t("transactions.riskOverview.completedDate")}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Section 2: Risk & Projection (Dark Card) */}
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.05, ease: "easeOut" }}
      >
        <Card
          className="overflow-hidden"
          style={{
            background: "var(--color-text)",
            borderColor: "var(--color-border)",
            boxShadow: "var(--shadow-medium)",
          }}
        >
          <div
            className="absolute -top-1/2 right-0 h-32 w-32 rounded-full blur-3xl translate-x-1/2"
            style={{ background: "rgb(79 70 229 / 0.2)" }}
          />
            <div className="relative z-10 border-b px-4 py-4" style={{ borderColor: "rgb(255 255 255 / 0.1)" }}>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold" style={{ color: "var(--color-text-inverse)" }}>{t("transactions.riskOverview.riskProjection")}</h3>
              <ShieldCheck className="h-5 w-5" style={{ color: "var(--color-success)" }} />
            </div>
          </div>
          <CardContent className="relative z-10 space-y-5 p-4">
            <div className="flex items-start gap-3">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-lg border"
                style={{
                  background: "rgb(34 197 94 / 0.1)",
                  borderColor: "rgb(34 197 94 / 0.2)",
                  color: "var(--color-success)",
                }}
              >
                <TrendingUp className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--color-text-inverse)" }}>{t("transactions.riskOverview.growthProjection")}</p>
                <p className="mt-1 text-xs leading-relaxed" style={{ color: "var(--color-text-inverse-muted)" }}>
                  {t("transactions.riskOverview.growthProjectionDesc", { amount: "$18,400" })}
                </p>
              </div>
            </div>

            <div className="h-px" style={{ background: "rgb(255 255 255 / 0.1)" }} />

            <div className="flex items-start gap-3">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-lg border"
                style={{
                  background: "rgb(245 158 11 / 0.1)",
                  borderColor: "rgb(245 158 11 / 0.2)",
                  color: "var(--color-warning)",
                }}
              >
                <AlertCircle className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--color-text-inverse)" }}>{t("transactions.riskOverview.taxAwareness")}</p>
                <p className="mt-1 text-xs leading-relaxed" style={{ color: "var(--color-text-inverse-muted)" }}>
                  {t("transactions.riskOverview.taxAwarenessDesc")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
});
