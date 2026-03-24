import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { useTheme } from "@/context/ThemeContext";
import type { PerformancePoint, PerformanceTimeRange } from "../data/mockPortfolioDashboard";

type Props = {
  range: PerformanceTimeRange;
  data: PerformancePoint[];
};

export function PerformanceChart({ range, data }: Props) {
  const { currentColors, effectiveMode } = useTheme();
  const isDark = effectiveMode === "dark";

  const gridStroke = isDark ? "rgba(148,163,184,0.12)" : "#f3f4f6";
  const tickFill = isDark ? "#94a3b8" : "#9ca3af";
  const benchmarkStroke = isDark ? "rgba(148,163,184,0.55)" : "#d1d5db";

  return (
    <div
      className="h-full rounded-xl border border-border bg-card p-5 shadow-sm dark:border-border/80 dark:shadow-none dark:ring-1 dark:ring-white/5 sm:p-6"
    >
      <div className="mb-4">
        <h3 className="text-base font-semibold text-foreground">Portfolio performance</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Growth vs S&P 500 benchmark · {range}
        </p>
      </div>

      <div className="min-h-[240px] w-full" style={{ minWidth: 0 }}>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: tickFill }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: tickFill }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `$${v}k`}
              domain={["dataMin - 10", "dataMax + 5"]}
            />
            <Line
              type="monotone"
              dataKey="portfolio"
              name="Your portfolio"
              stroke={currentColors.primary}
              strokeWidth={2.5}
              dot={false}
              activeDot={{
                r: 5,
                strokeWidth: 2,
                fill: currentColors.surface,
                stroke: currentColors.primary,
              }}
            />
            <Line
              type="monotone"
              dataKey="sp500"
              name="S&P 500"
              stroke={benchmarkStroke}
              strokeWidth={1.5}
              strokeDasharray="5 5"
              dot={false}
              activeDot={{
                r: 4,
                strokeWidth: 2,
                fill: currentColors.surface,
                stroke: benchmarkStroke,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-5 border-t border-border pt-3 dark:border-border/80">
        <div className="flex items-center gap-2">
          <div className="h-0.5 w-4 rounded-full bg-primary" />
          <span className="text-[11px] text-muted-foreground">Your portfolio</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="h-0.5 w-4 rounded-full"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, currentColor 0 4px, transparent 4px 8px)",
              color: benchmarkStroke,
            }}
          />
          <span className="text-[11px] text-muted-foreground">S&P 500</span>
        </div>
      </div>
    </div>
  );
}
