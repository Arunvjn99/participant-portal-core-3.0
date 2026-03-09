import { Info, LineChart } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export interface ContributionProjectionCardProps {
  /** Chart data: year label, balance (value), contributions */
  chartData: Array<{ year: string; value: number; contributions: number }>;
  /** Projected balance at end of period */
  finalProjectedValue: number;
  /** Years to retirement (for subtitle) */
  yearsToRetire: number;
  /** Total contributions over the period */
  totalContributionsOverTime: number;
  className?: string;
}

/**
 * Projection card for the contribution step: chart, projected value, Contributions/Growth stat cards, disclaimer.
 * Stat cards use bg-gray-50 (dark: var(--surface-2)). Chart container spacing and typography match figma.
 */
export function ContributionProjectionCard({
  chartData,
  finalProjectedValue,
  yearsToRetire,
  totalContributionsOverTime,
  className = "",
}: ContributionProjectionCardProps) {
  const growth = Math.round(finalProjectedValue - totalContributionsOverTime);

  return (
    <div
      className={
        `rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:bg-[var(--surface-1)] dark:border-[var(--border-subtle)] ${className}`
      }
    >
      <div className="flex items-center gap-2 mb-4">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-50 border border-gray-200 dark:bg-[var(--surface-2)] dark:border-[var(--border-subtle)]"
          aria-hidden
        >
          <LineChart className="w-4 h-4 text-[var(--success)]" />
        </div>
        <h3 className="font-semibold text-[var(--text-primary)]">
          Retirement Projection
        </h3>
      </div>

      <div className="mb-4">
        <div className="text-sm mb-1 text-[var(--text-secondary)]">
          Projected value in {yearsToRetire} years
        </div>
        <div className="text-2xl md:text-3xl font-bold text-[var(--success)]">
          ${Math.round(finalProjectedValue).toLocaleString()}
        </div>
      </div>

      {chartData.length > 0 && (
        <div className="mb-5 h-[200px] min-h-[200px] w-full">
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData} isAnimationActive={false}>
              <defs>
                <linearGradient id="contribProjV2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--brand-primary)" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="var(--brand-primary)" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="valueProjV2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--success)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--success)" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} tickLine={false} />
              <YAxis
                tick={{ fontSize: 11 }}
                tickLine={false}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--surface-1)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, ""]}
              />
              <Area
                type="monotone"
                dataKey="contributions"
                stroke="var(--brand-primary)"
                fill="url(#contribProjV2)"
                name="Contributions"
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="var(--success)"
                fill="url(#valueProjV2)"
                name="Total Value"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* LEVEL 2 — Stat cards */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:bg-[var(--surface-2)] dark:border-[var(--border-subtle)]">
          <div className="text-xs mb-1 text-[var(--text-secondary)]">
            Contributions
          </div>
          <div className="font-bold text-[var(--brand-primary)]">
            ${totalContributionsOverTime.toLocaleString()}
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:bg-[var(--surface-2)] dark:border-[var(--border-subtle)]">
          <div className="text-xs mb-1 text-[var(--text-secondary)]">Growth</div>
          <div className="font-bold text-[var(--success)]">
            ${growth.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 flex items-start gap-2 dark:bg-[var(--surface-2)] dark:border-[var(--border-subtle)]">
        <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-[var(--text-secondary)]" />
        <p className="text-xs text-[var(--text-secondary)]">
          Projection is an estimate. Actual results may vary. Investments involve risk.
        </p>
      </div>
    </div>
  );
}
