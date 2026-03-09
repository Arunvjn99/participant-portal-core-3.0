/**
 * Single source of truth for Contribution step.
 * All contribution/projection/tax state and derived values from enrollment context.
 * No duplicate calculations in components.
 */

import { useMemo, useCallback, useState, useRef, useEffect } from "react";
import { useEnrollment } from "./EnrollmentContext";
import {
  PAYCHECKS_PER_YEAR,
  percentageToAnnualAmount,
  annualAmountToPercentage,
  deriveContribution,
} from "../logic/contributionCalculator";
import { calculateProjection } from "../logic/projectionCalculator";
import {
  rebalanceSources,
  allocationToSources,
  mergeLocks,
  sourcesToAllocation,
  getLockedIds,
} from "../logic/sourceAllocationEngine";
const SOURCE_IDS = ["preTax", "roth", "afterTax"] as const;

export function useContributionStore() {
  const {
    state,
    setContributionType,
    setContributionAmount,
    setSourceAllocation,
    setSourcesEditMode,
    setSourcesViewMode,
  } = useEnrollment();

  const selectedPlanId = state.selectedPlan;
  const salary = state.salary || 72000;
  const currentAge = state.currentAge || 40;
  const retirementAge = state.retirementAge || 67;

  const contributionPct =
    state.contributionType === "percentage"
      ? state.contributionAmount
      : salary > 0
        ? annualAmountToPercentage(salary, state.contributionAmount * PAYCHECKS_PER_YEAR)
        : 0;

  const derived = useMemo(
    () =>
      deriveContribution({
        contributionType: "percentage",
        contributionValue: contributionPct,
        annualSalary: salary,
        paychecksPerYear: PAYCHECKS_PER_YEAR,
        employerMatchEnabled: state.employerMatchEnabled,
        employerMatchCap: state.assumptions.employerMatchCap,
        employerMatchPercentage: state.assumptions.employerMatchPercentage,
        currentAge,
        retirementAge,
      }),
    [
      contributionPct,
      salary,
      state.employerMatchEnabled,
      state.assumptions.employerMatchCap,
      state.assumptions.employerMatchPercentage,
      currentAge,
      retirementAge,
    ]
  );

  const projectionBaseline = useMemo(
    () =>
      calculateProjection({
        currentAge,
        retirementAge,
        currentBalance: state.currentBalance || 0,
        monthlyContribution: derived.monthlyContribution,
        employerMatch: state.employerMatchEnabled ? derived.employerMatchMonthly : 0,
        annualReturnRate: state.assumptions.annualReturnRate,
        inflationRate: state.assumptions.inflationRate,
      }),
    [
      currentAge,
      retirementAge,
      state.currentBalance,
      derived.monthlyContribution,
      derived.employerMatchMonthly,
      state.employerMatchEnabled,
      state.assumptions.annualReturnRate,
      state.assumptions.inflationRate,
    ]
  );

  const sourceTotal =
    state.sourceAllocation.preTax + state.sourceAllocation.roth + state.sourceAllocation.afterTax;
  const allocationValid = Math.abs(sourceTotal - 100) < 0.01;

  const [lockedSourceIds, setLockedSourceIds] = useState<Set<string>>(() => new Set());
  const hasUserEditedAllocationRef = useRef(false);
  const prevContributionPctRef = useRef<number | null>(null);
  const setSourceAllocationRef = useRef(setSourceAllocation);
  setSourceAllocationRef.current = setSourceAllocation;

  useEffect(() => {
    const prev = prevContributionPctRef.current;
    prevContributionPctRef.current = contributionPct;
    if (prev === null) return;
    if (!hasUserEditedAllocationRef.current) {
      setSourceAllocationRef.current({ preTax: 100, roth: 0, afterTax: 0 });
    }
  }, [contributionPct]);

  const handleSourcePercentChange = useCallback(
    (key: "preTax" | "roth" | "afterTax", value: number) => {
      const allocation = state.sourceAllocation;
      const sources = mergeLocks(
        allocationToSources(allocation, [...SOURCE_IDS]),
        lockedSourceIds
      );
      const result = rebalanceSources(sources, key, value);
      const newAllocation = sourcesToAllocation(result, [...SOURCE_IDS]) as {
        preTax: number;
        roth: number;
        afterTax: number;
      };
      hasUserEditedAllocationRef.current = true;
      setSourceAllocation(newAllocation);
      setLockedSourceIds(getLockedIds(result));
    },
    [state.sourceAllocation, lockedSourceIds, setSourceAllocation]
  );

  const handleSourceEffectivePctChange = useCallback(
    (key: "preTax" | "roth" | "afterTax", effectivePct: number) => {
      if (contributionPct <= 0) {
        handleSourcePercentChange(key, 0);
        return;
      }
      const splitValue = Math.min(100, Math.max(0, (effectivePct / contributionPct) * 100));
      handleSourcePercentChange(key, Math.round(splitValue * 100) / 100);
    },
    [contributionPct, handleSourcePercentChange]
  );

  const annualAmount = salary > 0 ? percentageToAnnualAmount(salary, contributionPct) : 0;
  const dollarInput = annualAmount;

  return {
    // State
    state,
    selectedPlanId,
    salary,
    currentAge,
    retirementAge,
    contributionPct,
    derived,
    projectionBaseline,
    sourceAllocation: state.sourceAllocation,
    allocationValid,
    lockedSourceIds,
    setLockedSourceIds,

    // Setters
    setContributionType,
    setContributionAmount,
    setSourceAllocation,
    setSourcesEditMode,
    setSourcesViewMode,

    // Handlers
    handleSourcePercentChange,
    handleSourceEffectivePctChange,
  };
}
