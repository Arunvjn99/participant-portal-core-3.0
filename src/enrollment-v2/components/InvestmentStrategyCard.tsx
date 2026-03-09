/**
 * Investment strategy card — Figma PortfolioCard parity.
 * Hover elevation, selected ring, allocation bar, optional stats and recommended badge.
 */
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface InvestmentStrategyCardOption {
  id: string;
  label: string;
  riskLabel: string;
  description: string;
  isRecommended?: boolean;
  /** Optional display: target return % */
  targetReturn?: number;
  /** Optional: e.g. "30s - 40s" */
  ageRange?: string;
  /** Optional: e.g. "15-25 years" */
  yearsToRetirement?: string;
  /** Optional: stocks / bonds / other % for allocation bar */
  allocation?: { stocks: number; bonds: number; other: number };
  /** Tailwind gradient for icon bg, e.g. "from-red-500 to-orange-500" */
  gradient?: string;
}

export interface InvestmentStrategyCardProps {
  option: InvestmentStrategyCardOption;
  isSelected: boolean;
  onSelect: () => void;
  icon?: LucideIcon;
}

export function InvestmentStrategyCard({
  option,
  isSelected,
  onSelect,
  icon: Icon = Sparkles,
}: InvestmentStrategyCardProps) {
  const allocation = option.allocation ?? { stocks: 60, bonds: 30, other: 10 };

  return (
    <motion.div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelect()}
      whileHover={{ scale: 1.01, y: -2 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.2 }}
      className={
        `relative bg-white dark:bg-[var(--surface-1)] rounded-2xl border-2 transition-all duration-300 cursor-pointer overflow-hidden ` +
        (isSelected
          ? "border-indigo-500 shadow-xl ring-4 ring-indigo-100 dark:ring-indigo-900/30 dark:border-[var(--brand-primary)]"
          : "border-gray-200 shadow-md hover:shadow-lg hover:border-indigo-300 dark:border-[var(--border-subtle)] dark:hover:border-indigo-500/50")
      }
    >
      {option.isRecommended && (
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-md">
            <Sparkles className="w-3 h-3" />
            Recommended
          </div>
        </div>
      )}

      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md ${
                option.gradient
                  ? `bg-gradient-to-br ${option.gradient}`
                  : "bg-[var(--brand-primary)]"
              }`}
            >
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-[var(--text-primary)]">
                {option.label}
              </h3>
              <p className="text-sm text-gray-500 dark:text-[var(--text-secondary)]">
                {option.riskLabel} Risk
              </p>
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-600 dark:text-[var(--text-secondary)] mb-4 leading-relaxed">
          {option.description}
        </p>

        {(option.targetReturn != null || option.ageRange || option.yearsToRetirement) && (
          <div className="grid grid-cols-3 gap-4 mb-4">
            {option.targetReturn != null && (
              <div className="bg-gray-50 dark:bg-[var(--surface-2)] rounded-lg p-3">
                <div className="text-xs text-gray-500 dark:text-[var(--text-secondary)] mb-1">
                  Target Return
                </div>
                <div className="text-lg font-black text-gray-900 dark:text-[var(--text-primary)]">
                  {option.targetReturn}%
                </div>
              </div>
            )}
            {option.ageRange && (
              <div className="bg-gray-50 dark:bg-[var(--surface-2)] rounded-lg p-3">
                <div className="text-xs text-gray-500 dark:text-[var(--text-secondary)] mb-1">
                  Age Range
                </div>
                <div className="text-sm font-bold text-gray-900 dark:text-[var(--text-primary)]">
                  {option.ageRange}
                </div>
              </div>
            )}
            {option.yearsToRetirement && (
              <div className="bg-gray-50 dark:bg-[var(--surface-2)] rounded-lg p-3">
                <div className="text-xs text-gray-500 dark:text-[var(--text-secondary)] mb-1">
                  Timeline
                </div>
                <div className="text-xs font-bold text-gray-900 dark:text-[var(--text-primary)]">
                  {option.yearsToRetirement}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-[var(--border-subtle)]">
          <div className="text-xs text-gray-600 dark:text-[var(--text-secondary)]">Allocation:</div>
          <div className="flex items-center gap-2 flex-1">
            <div className="flex-1 h-2 bg-gray-200 dark:bg-[var(--surface-2)] rounded-full overflow-hidden flex">
              <div
                style={{ width: `${allocation.stocks}%` }}
                className="bg-[var(--color-primary)] rounded-l-full"
              />
              <div style={{ width: `${allocation.bonds}%` }} className="bg-[var(--color-success)]" />
              <div
                style={{ width: `${allocation.other}%` }}
                className="bg-amber-500 rounded-r-full"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              {allocation.stocks}%
            </span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              {allocation.bonds}%
            </span>
            <span className="font-semibold text-amber-600 dark:text-amber-400">
              {allocation.other}%
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
