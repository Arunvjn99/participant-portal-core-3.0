import { useMemo, useState, useCallback } from "react";
import type { PlanOption } from "../types";

const DEFAULT_PLANS: PlanOption[] = [
  { id: "current", label: "Current Employer 401(k)", type: "current" },
  { id: "previous", label: "Previous Employer 401(k)", type: "previous" },
  { id: "ira", label: "IRA / Rollover", type: "ira" },
];

/**
 * Multi-plan switcher state. If only one plan (or no plans), switcher can be hidden.
 */
export function useMultiPlanFilter() {
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>("current");

  const plans = useMemo(() => DEFAULT_PLANS, []);
  const hasMultiplePlans = plans.length > 1;

  const setPlan = useCallback((id: string | null) => {
    setSelectedPlanId(id);
  }, []);

  return {
    plans,
    selectedPlanId,
    setPlan,
    hasMultiplePlans,
  };
}
