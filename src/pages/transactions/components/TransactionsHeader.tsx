import { memo } from "react";
import { SectionHeader } from "../../../components/dashboard/shared/SectionHeader";
import type { PlanOption } from "../../../features/transactions/types";
import { PlanSwitcher } from "../../../features/transactions/components/PlanSwitcher";

interface TransactionsHeaderProps {
  title?: string;
  subtitle?: string;
  plans?: PlanOption[];
  selectedPlanId: string | null;
  onPlanSelect: (id: string | null) => void;
  hasMultiplePlans: boolean;
}

/**
 * Transactions screen header: title, subtitle, optional plan switcher.
 * Uses global design tokens and shared SectionHeader.
 */
export const TransactionsHeader = memo(function TransactionsHeader({
  title = "Retirement Activity",
  subtitle = "Your retirement activity and transaction intelligence.",
  plans = [],
  selectedPlanId,
  onPlanSelect,
  hasMultiplePlans,
}: TransactionsHeaderProps) {
  return (
    <header className="mb-6 space-y-4">
      <div>
        <h1
          className="text-xl font-semibold md:text-2xl"
          style={{ color: "var(--color-text)" }}
        >
          {title}
        </h1>
        <p
          className="mt-0.5 text-sm"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {subtitle}
        </p>
      </div>
      {hasMultiplePlans && plans.length > 0 && (
        <PlanSwitcher
          plans={plans}
          selectedPlanId={selectedPlanId}
          onSelect={onPlanSelect}
          hasMultiplePlans={hasMultiplePlans}
        />
      )}
    </header>
  );
});
