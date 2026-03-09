/**
 * Right-column summary card: selected strategy with gradient, risk bars, Edit button.
 * Figma parity: "Investment Strategy" card with strategy name and Edit Investment Strategy CTA.
 */
import { motion } from "framer-motion";
import { Edit3, Target } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface InvestmentSummaryCardOption {
  id: string;
  label: string;
  riskLabel: string;
  description: string;
  /** Risk level 1-5 for bar display */
  riskLevel?: number;
  /** Tailwind bg gradient, e.g. "from-blue-50 to-cyan-50" */
  bgGradient?: string;
  /** Tailwind gradient for icon, e.g. "from-blue-500 to-cyan-500" */
  gradient?: string;
}

export interface InvestmentSummaryCardProps {
  option: InvestmentSummaryCardOption;
  onEditStrategy?: () => void;
  icon?: LucideIcon;
}

export function InvestmentSummaryCard({
  option,
  onEditStrategy,
  icon: Icon = Target,
}: InvestmentSummaryCardProps) {
  const riskLevel = option.riskLevel ?? 3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="group relative bg-white dark:bg-[var(--surface-1)] rounded-[20px] border border-gray-200 dark:border-[var(--border-subtle)] shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      <div
        className={`relative p-8 ${
          option.bgGradient
            ? `bg-gradient-to-br ${option.bgGradient}`
            : "bg-[var(--surface-2)]"
        }`}
      >
        <div className="flex items-center gap-4 mb-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
            className={`flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300 ${
              option.gradient
                ? `bg-gradient-to-br ${option.gradient}`
                : "bg-[var(--brand-primary)]"
            }`}
          >
            <Icon className="w-8 h-8 text-white relative z-10" />
          </motion.div>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-[#4a5565] dark:text-[var(--text-secondary)] mb-1">
              You belong to:
            </div>
            <div className="text-xl font-bold text-[#101828] dark:text-[var(--text-primary)] mb-1">
              {option.label}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={`w-1 h-3 rounded-full transition-all duration-300 ${
                      i <= riskLevel
                        ? "bg-gradient-to-t from-gray-400 to-gray-600 dark:from-gray-500 dark:to-gray-700"
                        : "bg-gray-200 dark:bg-[var(--surface-2)]"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600 dark:text-[var(--text-secondary)]">
                {option.riskLabel}
              </span>
            </div>
          </div>
        </div>

        {onEditStrategy && (
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onEditStrategy}
            className="px-4 py-2 rounded-xl text-sm font-bold border-2 border-[var(--color-border)] text-[var(--color-primary)] hover:bg-[var(--color-background-secondary)] transition-all duration-200 flex items-center gap-2"
          >
            <Edit3 className="w-4 h-4" />
            Edit
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
