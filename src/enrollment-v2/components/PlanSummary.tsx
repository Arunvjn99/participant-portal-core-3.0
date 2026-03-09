/**
 * Plan overview card: gradient background, 3 cells (Selected Plan, Projected by Age X, Annual Contribution),
 * optional flow strip (Contribution → Growth → Projected Value), disclaimer.
 */
import { motion } from "framer-motion";
import { ShieldCheck, TrendingUp, DollarSign, AlertCircle, ChevronRight } from "lucide-react";

export interface PlanSummaryCell {
  label: string;
  value: string;
}

export interface PlanFlowStep {
  label: string;
  value: string;
}

export interface PlanSummaryProps {
  cells: PlanSummaryCell[];
  /** Optional horizontal flow: e.g. Annual Contribution → Growth ~7% APY → Projected Value */
  flowSteps?: PlanFlowStep[];
  disclaimer?: string;
  className?: string;
}

const ICONS = [ShieldCheck, TrendingUp, DollarSign];

export function PlanSummary({ cells, flowSteps, disclaimer, className = "" }: PlanSummaryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`rounded-xl p-6 border ${className}`}
      style={{
        background: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
        {cells.slice(0, 3).map((cell, i) => {
          const Icon = ICONS[i];
          return (
            <div key={cell.label} className="flex items-center gap-3">
              <div
                className="rounded-xl p-3 border flex-shrink-0"
                style={{
                  background: "var(--color-surface)",
                  borderColor: "var(--color-border)",
                }}
              >
                <Icon className="w-6 h-6 text-[var(--color-primary)]" aria-hidden />
              </div>
              <div>
                <div className="text-xs mb-0.5 text-[var(--color-text-secondary)]">
                  {cell.label}
                </div>
                <div className="text-lg font-bold text-[var(--color-text-primary)]">
                  {cell.value}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {flowSteps != null && flowSteps.length > 0 && (
        <div
          className="mb-4 py-4 px-4 rounded-xl border"
          style={{
            borderColor: "var(--color-border)",
            background: "var(--color-surface)",
          }}
        >
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
            {flowSteps.map((step, i) => (
              <span key={step.label} className="flex items-center gap-2 sm:gap-4">
                <span className="text-center">
                  <div className="text-[10px] sm:text-xs font-medium text-[var(--color-text-secondary)]">{step.label}</div>
                  <div className="text-sm sm:text-base font-bold text-[var(--color-text-primary)]">{step.value}</div>
                </span>
                {i < flowSteps.length - 1 && (
                  <ChevronRight className="w-4 h-4 flex-shrink-0 text-[var(--color-text-secondary)]" aria-hidden />
                )}
              </span>
            ))}
          </div>
        </div>
      )}
      {disclaimer && (
        <div
          className="pt-4 border-t flex items-start gap-2"
          style={{ borderColor: "var(--color-border)" }}
        >
          <AlertCircle className="w-4 h-4 text-[var(--color-warning)] flex-shrink-0 mt-0.5" aria-hidden />
          <p className="text-[10px] leading-relaxed text-[var(--color-text-secondary)]">
            <span className="font-semibold text-[var(--color-text-primary)]">
              Disclaimer:
            </span>{" "}
            {disclaimer}
          </p>
        </div>
      )}
    </motion.div>
  );
}
