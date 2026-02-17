import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { PlanOption } from "../types";

interface PlanSwitcherProps {
  plans: PlanOption[];
  selectedPlanId: string | null;
  onSelect: (id: string | null) => void;
  hasMultiplePlans: boolean;
}

const tabVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

export const PlanSwitcher = memo(function PlanSwitcher({
  plans,
  selectedPlanId,
  onSelect,
  hasMultiplePlans,
}: PlanSwitcherProps) {
  if (!hasMultiplePlans) return null;

  return (
    <nav
      className="flex gap-0 rounded-[var(--radius-lg)] border border-[var(--color-border)] p-[var(--spacing-1)]"
      style={{ background: "var(--color-surface)" }}
      role="tablist"
    >
      {plans.map((plan) => {
        const isSelected = selectedPlanId === plan.id;
        return (
          <button
            key={plan.id}
            type="button"
            role="tab"
            aria-selected={isSelected}
            onClick={() => onSelect(plan.id)}
            className="relative min-w-[120px] rounded-[var(--radius-md)] px-[var(--spacing-4)] py-[var(--spacing-2)] text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
            style={{
              color: isSelected ? "var(--color-text)" : "var(--color-text-secondary)",
            }}
          >
            {isSelected && (
              <motion.span
                layoutId="plan-tab"
                className="absolute inset-0 rounded-[var(--radius-md)]"
                style={{
                  background: "var(--color-surface-elevated)",
                  boxShadow: "var(--shadow-sm)",
                }}
                transition={{ type: "tween", duration: 0.2, ease: "easeOut" }}
              />
            )}
            <span className="relative z-10 truncate">{plan.label}</span>
          </button>
        );
      })}
    </nav>
  );
});
