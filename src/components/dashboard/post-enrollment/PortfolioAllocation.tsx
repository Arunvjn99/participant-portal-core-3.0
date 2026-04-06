import { motion } from "framer-motion";
import { PieChart } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { PortfolioAllocationSlice } from "@/stores/postEnrollmentDashboardStore";
import { cn } from "@/lib/utils";

type Props = {
  portfolio: PortfolioAllocationSlice;
  totalBalance: number;
  onViewDetails?: () => void;
  viewDetailsDisabled?: boolean;
  className?: string;
};

const ease = [0.25, 0.1, 0.25, 1] as const;

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const SEGMENTS: {
  key: keyof PortfolioAllocationSlice;
  labelKey: string;
  color: string;
}[] = [
  { key: "usStocks", labelKey: "dashboard.postEnrollment.usEquities", color: "var(--chart-1)" },
  { key: "intlStocks", labelKey: "dashboard.postEnrollment.intlEquities", color: "var(--chart-2)" },
  { key: "bonds", labelKey: "dashboard.postEnrollment.fixedIncome", color: "var(--chart-3)" },
  { key: "cash", labelKey: "dashboard.postEnrollment.peCashLabel", color: "var(--chart-4)" },
];

export function PortfolioAllocation({
  portfolio,
  totalBalance,
  onViewDetails,
  viewDetailsDisabled = false,
  className,
}: Props) {
  const { t } = useTranslation();
  const equity = portfolio.usStocks + portfolio.intlStocks;
  const riskKey =
    equity >= 75
      ? "dashboard.postEnrollment.portfolioRiskModerateAggressive"
      : equity >= 50
        ? "dashboard.postEnrollment.portfolioRiskBalanced"
        : "dashboard.postEnrollment.portfolioRiskConservative";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease, delay: 0.1 }}
      className={cn("rounded-2xl border border-border bg-card p-6 shadow-sm", className)}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <PieChart className="h-4 w-4 text-muted-foreground" aria-hidden />
          <h3 className="text-sm font-semibold text-foreground">
            {t("dashboard.postEnrollment.portfolioAllocationTitle")}
          </h3>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-red-500" aria-hidden />
          <span className="text-xs text-muted-foreground">{t(riskKey)}</span>
        </div>
      </div>

      <p className="mt-1 text-xs text-muted-foreground">
        {t("dashboard.postEnrollment.portfolioAssetMixSubtitle")}
      </p>

      {onViewDetails ? (
        <div className="mt-2 flex justify-end">
          <button
            type="button"
            onClick={viewDetailsDisabled ? undefined : onViewDetails}
            disabled={viewDetailsDisabled}
            aria-disabled={viewDetailsDisabled}
            className={cn(
              "text-xs font-medium",
              viewDetailsDisabled ? "cursor-not-allowed text-muted-foreground" : "text-primary hover:underline",
            )}
          >
            {t("dashboard.postEnrollment.viewAll")}
          </button>
        </div>
      ) : null}

      <div className="mt-5 flex justify-between text-[10px] text-muted-foreground">
        <span>0%</span>
        <span>25%</span>
        <span>50%</span>
        <span>75%</span>
        <span>100%</span>
      </div>

      <div className="mt-1 flex h-4 w-full overflow-hidden rounded-full">
        {SEGMENTS.map((seg, i) => (
          <div
            key={seg.key}
            className="h-full transition-all"
            style={{
              width: `${portfolio[seg.key]}%`,
              backgroundColor: seg.color,
              borderTopLeftRadius: i === 0 ? 9999 : 0,
              borderBottomLeftRadius: i === 0 ? 9999 : 0,
              borderTopRightRadius: i === SEGMENTS.length - 1 ? 9999 : 0,
              borderBottomRightRadius: i === SEGMENTS.length - 1 ? 9999 : 0,
            }}
          />
        ))}
      </div>

      <ul className="mt-4 space-y-2">
        {SEGMENTS.map((seg) => {
          const pct = portfolio[seg.key];
          const value = Math.round((totalBalance * pct) / 100);
          return (
            <li key={seg.key} className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: seg.color }} />
                <span className="truncate text-sm text-foreground">{t(seg.labelKey)}</span>
              </div>
              <div className="flex shrink-0 items-center gap-3 text-sm">
                <span className="font-medium text-foreground">{pct}%</span>
                <span className="text-muted-foreground">{currency.format(value)}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </motion.div>
  );
}
