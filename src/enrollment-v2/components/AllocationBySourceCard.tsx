/**
 * Allocation by Source card — Figma: Pre-tax / Roth / After-tax rows with progress bars and "I choose my own investments".
 */
import { motion } from "framer-motion";
import { PieChart, Edit3 } from "lucide-react";

export interface AllocationBySourceRow {
  label: string;
  percent: number;
  fundsLabel: string;
  color: string;
  barColorFrom: string;
  barColorTo: string;
  pillBg: string;
  pillText: string;
}

export interface AllocationBySourceCardProps {
  rows: AllocationBySourceRow[];
  onChooseMyOwn?: () => void;
  className?: string;
}

export function AllocationBySourceCard({
  rows,
  onChooseMyOwn,
  className = "",
}: AllocationBySourceCardProps) {
  const total = rows.reduce((s, r) => s + r.percent, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.05 }}
      className={`bg-white dark:bg-[var(--surface-1)] border border-gray-200 dark:border-[var(--border-subtle)] rounded-2xl p-5 shadow-[0px_10px_15px_0px_rgba(0,0,0,0.1),0px_4px_6px_0px_rgba(0,0,0,0.1)] ${className}`}
    >
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-[var(--border-subtle)] pb-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#00b8db] to-[#2b7fff] text-white shadow-sm">
            <PieChart className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-[#101828] dark:text-[var(--text-primary)]">
              Allocation by Source
            </h3>
            <p className="text-[11px] text-[#6a7282] dark:text-[var(--text-secondary)]">
              Distribution across account types
            </p>
          </div>
        </div>
        {onChooseMyOwn && (
          <button
            type="button"
            onClick={onChooseMyOwn}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--color-primary)]/5 border border-transparent text-[var(--color-text-primary)] text-[11px] font-semibold hover:bg-[var(--color-primary)]/10 transition-colors"
          >
            <Edit3 className="w-3 h-3" />
            I choose my own investments
          </button>
        )}
      </div>
      <div className="space-y-4">
        {rows.map((row, i) => (
          <div key={row.label}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: row.color }}
                />
                <span className="font-bold text-sm text-[#364153] dark:text-[var(--text-primary)]">
                  {row.label}
                </span>
                <span
                  className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                  style={{ backgroundColor: row.pillBg, color: row.pillText }}
                >
                  {row.fundsLabel}
                </span>
              </div>
              <span
                className="font-bold text-lg"
                style={{ color: row.barColorTo }}
              >
                {row.percent}%
              </span>
            </div>
            <div className="h-2 bg-gray-100 dark:bg-[var(--surface-2)] rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: `linear-gradient(to right, ${row.barColorFrom}, ${row.barColorTo})`,
                }}
                initial={{ width: 0 }}
                animate={{ width: `${row.percent}%` }}
                transition={{ duration: 0.8, delay: 0.2 + i * 0.1, ease: "easeOut" }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-[var(--border-subtle)]">
        <div className="flex items-center justify-between mb-3">
          <span className="font-semibold text-sm text-[#364153] dark:text-[var(--text-primary)]">
            Total Allocation
          </span>
          <span className="font-black text-2xl text-[#101828] dark:text-[var(--text-primary)]">
            {total}%
          </span>
        </div>
        <div className="h-2 rounded-full overflow-hidden flex bg-gray-100 dark:bg-[var(--surface-2)] shadow-sm">
          {rows.map((row) => (
            <div
              key={row.label}
              className="h-full transition-all"
              style={{ width: `${row.percent}%`, backgroundColor: row.color }}
            />
          ))}
        </div>
        <div className="flex items-center justify-center gap-4 mt-2 flex-wrap">
          {rows.map((row) => (
            <div key={row.label} className="flex items-center gap-1.5">
              <div
                className="w-2.5 h-2.5 rounded-md flex-shrink-0"
                style={{ backgroundColor: row.color }}
              />
              <span className="text-[11px] text-[#4a5565] dark:text-[var(--text-secondary)]">
                {row.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
