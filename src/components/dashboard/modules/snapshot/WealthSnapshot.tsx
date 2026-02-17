import { memo } from "react";
import { useTranslation } from "react-i18next";
import { MetricCard } from "../../shared/MetricCard";
import { CARD_STYLE, fmtCurrency } from "../../core/types";
import type { ModuleProps } from "../../core/types";

/**
 * WealthSnapshot — Plan overview with balance breakdown and key metrics.
 */
const localeForDate = (lng: string) => (lng && lng !== "en" ? lng : "en-US");

export const WealthSnapshot = memo(function WealthSnapshot({ engine, data }: ModuleProps) {
  const { t, i18n } = useTranslation();
  const plan = data.planDetails;
  if (!plan) return null;
  const dateLocale = localeForDate(i18n.language);

  return (
    <div className="p-6" style={CARD_STYLE}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p
            className="text-[10px] font-bold uppercase tracking-widest"
            style={{ color: "var(--enroll-text-muted)" }}
          >
            {t("dashboard.snapshotYourPlan")}
          </p>
          <p
            className="text-base font-bold mt-0.5"
            style={{ color: "var(--enroll-text-primary)" }}
          >
            {plan.planName}
          </p>
        </div>
        <span
          className="text-xs font-semibold px-2.5 py-1 rounded-full"
          style={{
            background: "rgb(var(--enroll-accent-rgb) / 0.08)",
            color: "var(--enroll-accent)",
          }}
        >
          {t("dashboard.snapshotMatchUpTo", { pct: engine.employerMatch.pct, cap: engine.employerMatch.cap })}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricCard
          label={t("dashboard.snapshotTotalBalance")}
          value={fmtCurrency(plan.totalBalance)}
          accent
        />
        <MetricCard
          label={t("dashboard.snapshotYtdReturn")}
          value={`+${plan.ytdReturn}%`}
          trend={{ direction: plan.ytdReturn >= 0 ? "up" : "down", label: t("dashboard.snapshotThisYear") }}
        />
        <MetricCard
          label={t("dashboard.snapshotContribution")}
          value={`${plan.contributionRate}%`}
        />
        <MetricCard
          label={t("dashboard.snapshotEnrolled")}
          value={new Date(plan.enrolledAt + "T00:00:00").toLocaleDateString(dateLocale, {
            month: "short",
            year: "numeric",
          })}
        />
      </div>
    </div>
  );
});
