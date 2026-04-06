import { useId } from "react";
import { motion } from "framer-motion";
import { TrendingDown, TrendingUp } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { useTranslation } from "react-i18next";
import type { PerformancePoint, PostEnrollmentOverviewMetrics } from "@/stores/postEnrollmentDashboardStore";
import { cn } from "@/lib/utils";

const ease = [0.25, 0.1, 0.25, 1] as const;

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

type BalanceRow = { month: string; balance: number };

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-md">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold text-foreground">{currency.format(payload[0].value)}</p>
    </div>
  );
}

type Props = {
  balance: number;
  growthPercent: number;
  overview: PostEnrollmentOverviewMetrics;
  performance: PerformancePoint[];
  onTrackVisual: boolean;
  readinessLabelKey: string;
  className?: string;
};

export function PortfolioSummaryCard({
  balance,
  growthPercent,
  overview,
  performance,
  onTrackVisual,
  readinessLabelKey,
  className,
}: Props) {
  const { t } = useTranslation();
  const gid = useId().replace(/:/g, "");
  const gradId = `pe-portfolio-grad-${gid}`;
  const growthPositive = growthPercent >= 0;
  const TrendIcon = growthPositive ? TrendingUp : TrendingDown;

  const balanceHistory: BalanceRow[] = performance.map((p) => ({
    month: p.label,
    balance: p.value,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease }}
      className={cn("rounded-2xl border border-border bg-card p-6 shadow-sm", className)}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t("dashboard.postEnrollment.totalBalance")}
          </p>
          <p className="mt-1 text-4xl font-bold tracking-tight text-foreground">{currency.format(balance)}</p>
        </div>
        <span
          className={cn(
            "inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
            onTrackVisual
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              : "bg-amber-500/15 text-amber-800 dark:text-amber-200",
          )}
        >
          {onTrackVisual ? t("dashboard.postEnrollment.onTrackStatus") : t(readinessLabelKey)}
        </span>
      </div>

      <div className="mt-2 flex items-center gap-1.5">
        <TrendIcon
          className={cn("h-4 w-4", growthPositive ? "text-emerald-500" : "text-red-500")}
          aria-hidden
        />
        <span
          className={cn(
            "text-sm font-medium",
            growthPositive ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400",
          )}
        >
          {growthPositive ? "+" : ""}
          {growthPercent}% {t("dashboard.postEnrollment.overviewGrowthSuffix")}
        </span>
      </div>

      <div className="mt-5 h-40">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={balanceHistory} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.35} />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              interval="preserveStartEnd"
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="balance"
              stroke="var(--primary)"
              strokeWidth={2}
              fill={`url(#${gradId})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-border pt-4 text-sm text-muted-foreground">
        <span>
          {t("dashboard.postEnrollment.vestedBalance")}
          {": "}
          <span className="font-medium text-foreground">{currency.format(overview.vestedBalance)}</span>
        </span>
        <span className="hidden text-border sm:inline">|</span>
        <span>
          {t("dashboard.postEnrollment.retirementShort")}
          {": "}
          <span className="font-medium text-foreground">
            {t("dashboard.postEnrollment.retirementEstPrefix")} {overview.retirementYear}
          </span>
        </span>
        <span className="hidden text-border sm:inline">|</span>
        <span>
          {t("dashboard.postEnrollment.vestedPercentLabel")}
          {": "}
          <span className="font-medium text-foreground">{overview.vestedPercent}%</span>
        </span>
      </div>
    </motion.div>
  );
}
