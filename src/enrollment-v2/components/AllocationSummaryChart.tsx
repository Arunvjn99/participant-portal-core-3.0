/**
 * Allocation summary: donut chart, legend, optional estimated value and disclaimer.
 * Figma parity for right column "Allocation Summary" card.
 */
import { motion } from "framer-motion";
import { BarChart3, CheckCircle2, Info, ArrowUpRight } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

export interface AllocationSummaryChartProps {
  /** Donut segments: name, value (%), color */
  allocationData: Array<{ name: string; value: number; color: string }>;
  /** Optional: estimated balance at retirement */
  estimatedAtRetirement?: number;
  /** Optional: years to retirement for subtitle */
  yearsToRetirement?: number;
  /** Optional: avg return % for subtitle */
  avgReturnPercent?: number;
  /** Legend labels: fund name shown next to color dot */
  fundLabels?: Array<{ name: string; color: string }>;
  /** Show "Valid Allocation" badge when total is 100 */
  showValidBadge?: boolean;
  className?: string;
}

/** Figma: Pre-tax blue, Roth green, After-tax orange */
const DEFAULT_COLORS = ["#2b7fff", "#00bc7d", "#fe9a00"];

export function AllocationSummaryChart({
  allocationData,
  estimatedAtRetirement,
  yearsToRetirement,
  avgReturnPercent,
  fundLabels,
  showValidBadge = true,
  className = "",
}: AllocationSummaryChartProps) {
  const total = allocationData.reduce((s, d) => s + d.value, 0);
  const isValid = total === 100;
  const labels = fundLabels ?? allocationData.map((d) => ({ name: d.name, color: d.color }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className={`bg-white dark:bg-[var(--surface-1)] rounded-2xl shadow-xl border border-gray-200 dark:border-[var(--border-subtle)] p-6 sticky top-6 ${className}`}
    >
      <div className="mb-6 flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#00b8db] to-[#2b7fff] text-white shadow-sm">
          <BarChart3 className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-[#101828] dark:text-[var(--text-primary)] mb-0.5">
            Allocation Summary
          </h3>
          <p className="text-sm text-[#6a7282] dark:text-[var(--text-secondary)]">
            Real-time impact of your elections.
          </p>
        </div>
      </div>

      <div className="mb-5">
        <div className="flex items-center justify-center mb-4 relative h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={allocationData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={95}
                paddingAngle={3}
                dataKey="value"
                startAngle={90}
                endAngle={450}
              >
                {allocationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <div className="text-4xl font-black text-gray-900 dark:text-[var(--text-primary)] mb-1">
                100%
              </div>
              <div className="text-xs font-semibold text-gray-500 dark:text-[var(--text-secondary)] tracking-wider">
                TOTAL
              </div>
            </div>
          </div>
        </div>

        {showValidBadge && (
          <div className="flex justify-center mb-5">
            <div
              className={`px-5 py-2 rounded-full flex items-center gap-2 ${
                isValid
                  ? "bg-[var(--color-success)]/10 border-2 border-[var(--color-success)]/30"
                  : "bg-[var(--color-background-secondary)] border-2 border-[var(--color-border)]"
              }`}
            >
              <CheckCircle2
                className={`w-4 h-4 ${
                  isValid ? "text-[var(--color-success)]" : "text-[var(--color-text-secondary)]"
                }`}
              />
              <span
                className={`text-sm font-bold ${
                  isValid ? "text-[var(--color-success)]" : "text-[var(--color-text-secondary)]"
                }`}
              >
                {isValid ? "Valid Allocation" : "Allocation"}
              </span>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {allocationData.map((d, i) => (
            <div
              key={d.name}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: d.color }}
                />
                <span className="text-sm font-medium text-gray-700 dark:text-[var(--text-secondary)]">
                  {labels[i]?.name ?? d.name}
                </span>
              </div>
              <span className="text-sm font-bold text-gray-900 dark:text-[var(--text-primary)]">
                {d.value}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {estimatedAtRetirement != null && estimatedAtRetirement > 0 && (
        <div className="bg-gradient-to-r from-[#ecfdf5] to-[#f0fdfa] border-2 border-[#a4f4cf] rounded-xl p-5 mt-6 dark:from-emerald-900/30 dark:to-teal-900/30 dark:border-emerald-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-[#065f46] dark:text-emerald-200">
              Estimated at Retirement
            </span>
            <ArrowUpRight className="w-5 h-5 text-[#059669] dark:text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-[#047857] dark:text-emerald-100 mb-1">
            ${estimatedAtRetirement.toLocaleString()}
          </div>
          {(yearsToRetirement != null || avgReturnPercent != null) && (
            <div className="text-xs text-[#047857]/80 dark:text-emerald-300/80">
              {[
                yearsToRetirement != null && `${yearsToRetirement} years`,
                avgReturnPercent != null && `${avgReturnPercent}% avg. return`,
              ]
                .filter(Boolean)
                .join(" at ")}
            </div>
          )}
        </div>
      )}

      <div className="mt-5 pt-5 border-t border-gray-200 dark:border-[var(--border-subtle)]">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-gray-400 dark:text-[var(--text-secondary)] flex-shrink-0 mt-0.5" />
          <p className="text-xs text-gray-500 dark:text-[var(--text-secondary)] leading-relaxed">
            Projections are estimates only. Actual returns will vary based on market performance and
            investment choices.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
