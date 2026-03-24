import { BarChart3, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PerformanceTimeRange, PortfolioSummary } from "../data/mockPortfolioDashboard";
import { PERFORMANCE_TIME_RANGES } from "../data/mockPortfolioDashboard";

type Props = {
  summary: PortfolioSummary;
  activeRange: PerformanceTimeRange;
  onRangeChange: (range: PerformanceTimeRange) => void;
};

export function PortfolioSummaryCard({ summary, activeRange, onRangeChange }: Props) {
  const intPart = Math.floor(summary.totalBalance);
  const frac = (summary.totalBalance % 1).toFixed(2).slice(2);

  return (
    <section
      className={cn(
        "col-span-12 overflow-hidden rounded-xl border border-border bg-card shadow-sm",
        "dark:border-border/80 dark:shadow-none dark:ring-1 dark:ring-white/5",
      )}
    >
      <div className="p-5 sm:p-7">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 dark:bg-primary/20">
              <BarChart3 className="h-4 w-4 text-primary" aria-hidden />
            </div>
            <div>
              <h2 className="text-sm font-medium text-foreground">Portfolio summary</h2>
              <p className="text-[11px] text-muted-foreground">{summary.asOfLabel}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1 rounded-lg bg-muted/60 p-1 dark:bg-muted/30">
            {PERFORMANCE_TIME_RANGES.map((range) => (
              <button
                key={range}
                type="button"
                onClick={() => onRangeChange(range)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-medium transition-all",
                  activeRange === range
                    ? "bg-card text-foreground shadow-sm dark:bg-card/90"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Total portfolio balance
          </p>
          <div className="flex flex-wrap items-baseline gap-3">
            <p
              className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl"
              style={{ letterSpacing: "-0.02em" }}
            >
              ${intPart.toLocaleString()}
              <span className="text-xl font-normal text-muted-foreground/80">.{frac}</span>
            </p>
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
                "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
              )}
            >
              <TrendingUp className="h-3 w-3" aria-hidden />
              +{summary.growthPercentYtd}% YTD
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Metric
            label="Total invested"
            value={`$${summary.totalInvested.toLocaleString("en-US")}`}
            detail="Contributions + rollovers"
          />
          <Metric
            label="Total gain"
            value={`+$${Math.round(summary.totalGain).toLocaleString()}`}
            detail={`+${summary.gainPercentAllTime}% all time`}
            positive
          />
          <Metric
            label="YTD return"
            value={`+${summary.growthPercentYtd}%`}
            detail="Calendar year to date"
            positive
          />
          <Metric
            label="vs S&P 500"
            value={`+${summary.vsSp500Percent}%`}
            detail="Vs benchmark (illustrative)"
            accent
          />
        </div>
      </div>
    </section>
  );
}

function Metric({
  label,
  value,
  detail,
  positive,
  accent,
}: {
  label: string;
  value: string;
  detail: string;
  positive?: boolean;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-transparent bg-muted/40 p-3.5 dark:bg-muted/20",
        accent && "ring-1 ring-primary/15 dark:ring-primary/25",
      )}
    >
      <p className="mb-1.5 text-[11px] text-muted-foreground">{label}</p>
      <p
        className={cn(
          "text-base font-semibold tracking-tight sm:text-lg",
          positive && "text-emerald-600 dark:text-emerald-400",
          accent && "text-primary",
          !positive && !accent && "text-foreground",
        )}
      >
        {value}
      </p>
      <p className="mt-0.5 text-[10px] text-muted-foreground">{detail}</p>
    </div>
  );
}
