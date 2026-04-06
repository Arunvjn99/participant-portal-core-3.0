import { useMemo } from "react";

export type ReadinessScoreInput = {
  totalBalance: number;
  employeePercent: number;
  employerPercent: number;
  totalPerMonth: number;
};

export type ReadinessScoreResult = {
  score: number;
  label: "On Track" | "Needs Attention" | "At Risk" | "Critical";
  replacementPercent: number;
  color: string;
};

/**
 * Heuristic readiness score (aligned with core-retirement-platform).
 * Replace with actuarial data when a backend is available.
 */
export function useReadinessScore(
  input: ReadinessScoreInput | null,
  currentAge = 35,
  targetRetirementAge = 67,
  annualSalary = 75_000,
): ReadinessScoreResult {
  return useMemo(() => {
    if (!input) {
      return { score: 0, label: "Critical", replacementPercent: 0, color: "var(--destructive)" };
    }

    let score = 0;
    const totalContribRate = input.employeePercent + input.employerPercent;
    const contribScore = Math.min(30, (totalContribRate / 15) * 30);
    score += contribScore;

    const matchScore = input.employerPercent > 0 ? 15 : 0;
    score += matchScore;

    const yearsToRetirement = Math.max(0, targetRetirementAge - currentAge);
    const timeScore = Math.min(25, (yearsToRetirement / 35) * 25);
    score += timeScore;

    const targetBalance = annualSalary * 10;
    const projectedBalance =
      input.totalBalance * Math.pow(1.07, yearsToRetirement) +
      input.totalPerMonth * 12 * ((Math.pow(1.07, yearsToRetirement) - 1) / 0.07);
    const adequacyRatio = Math.min(1, projectedBalance / targetBalance);
    score += adequacyRatio * 30;

    const finalScore = Math.round(Math.min(100, Math.max(0, score)));
    const annualWithdrawal = projectedBalance * 0.04;
    const replacementPercent = Math.round((annualWithdrawal / annualSalary) * 100);

    let label: ReadinessScoreResult["label"];
    let color: string;

    if (finalScore >= 75) {
      label = "On Track";
      color = "#047857";
    } else if (finalScore >= 50) {
      label = "Needs Attention";
      color = "#d97706";
    } else if (finalScore >= 25) {
      label = "At Risk";
      color = "#dc2626";
    } else {
      label = "Critical";
      color = "#dc2626";
    }

    return { score: finalScore, label, replacementPercent, color };
  }, [input, currentAge, targetRetirementAge, annualSalary]);
}
