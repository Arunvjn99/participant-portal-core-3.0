import { useMemo, useState, useCallback } from "react";
import type { PlanOption } from "../types";

const ALL_PLANS_ID = "all";

const DEFAULT_PLANS: PlanOption[] = [
  { id: ALL_PLANS_ID, label: "All Plans", type: "current" },
  { id: "current", label: "Current Employer 401(k)", type: "current" },
  { id: "previous", label: "Previous Employer 401(k)", type: "previous" },
  { id: "ira", label: "IRA / Rollover", type: "ira" },
];

/**
 * Multi-plan switcher state. Supports "All Plans" for aggregation.
 * When "All Plans" selected, selectedPlanId is "all" and data aggregates across plans.
 */
export function useMultiPlanFilter() {
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(ALL_PLANS_ID);

  const plans = useMemo(() => DEFAULT_PLANS, []);
  const hasMultiplePlans = plans.length > 1;

  const setPlan = useCallback((id: string | null) => {
    setSelectedPlanId(id ?? ALL_PLANS_ID);
  }, []);

  return {
    plans,
    selectedPlanId,
    setPlan,
    hasMultiplePlans,
  };
}
