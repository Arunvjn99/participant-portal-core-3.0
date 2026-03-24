import * as React from "react";
import { PlanCard, type PlanCardVariant } from "./PlanCard";
import type { PlanOption } from "@/types/enrollment";

export interface PlanSelectionLayoutProps {
  plans: PlanOption[];
  selectedPlanId: string | null;
  onSelect: (planId: string) => void;
}

/**
 * Renders plan cards in a premium unified layout.
 * - Single-plan mode (plans.length === 1): one full-width card; user must select before Continue.
 * - Multi-plan mode (plans.length > 1): 2-column grid on desktop, stacked on mobile.
 * No "Recommended" / "AI Recommended"; uses "Plan Highlight" and "Key Advantages" only.
 */
export const PlanSelectionLayout = ({ plans, selectedPlanId, onSelect }: PlanSelectionLayoutProps) => {
  const variant: PlanCardVariant = plans.length === 1 ? "single" : "multi";

  if (plans.length === 0) {
    return null;
  }

  if (plans.length === 1) {
    const plan = plans[0];
    return (
      <div className="w-full" data-plan-mode="single">
        <PlanCard
          plan={plan}
          isSelected={selectedPlanId === plan.id}
          onSelect={() => onSelect(plan.id)}
          variant="single"
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-plan-mode="multi">
      {plans.map((plan) => (
        <PlanCard
          key={plan.id}
          plan={plan}
          isSelected={selectedPlanId === plan.id}
          onSelect={() => onSelect(plan.id)}
          variant="multi"
        />
      ))}
    </div>
  );
};
