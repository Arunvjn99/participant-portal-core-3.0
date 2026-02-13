import type { PlanRecommendation } from "../../types/enrollment";

export interface PlanRecommendationInput {
  currentAge: number;
  retirementAge: number;
  salary: number;
  /** Current retirement savings balance (from personalize wizard "other savings") */
  currentBalance?: number;
}

/**
 * Derives plan recommendation from personalize wizard profile (age, retirement, salary, savings).
 * Used by the plan page to show best-fit and fit scores based on actual user data.
 */
export function getPlanRecommendation(input: PlanRecommendationInput): PlanRecommendation {
  const { currentAge, retirementAge, salary, currentBalance = 0 } = input;
  const yearsToRetire = Math.max(0, retirementAge - currentAge);
  const age = currentAge;
  const salaryNum = typeof salary === "number" ? salary : 0;

  // Heuristics aligned with common guidance (not advice):
  // - Roth: better when young, long horizon, expect higher bracket in retirement
  // - Traditional: better when high salary now, want immediate tax relief, or expect lower bracket later
  const rothScore =
    (yearsToRetire >= 25 ? 25 : yearsToRetire >= 15 ? 15 : 0) +
    (age < 40 ? 25 : age < 50 ? 15 : 0) +
    (salaryNum < 100_000 ? 20 : salaryNum < 150_000 ? 10 : 0);
  const tradScore =
    (salaryNum >= 100_000 ? 20 : 0) +
    (age >= 45 ? 15 : 0) +
    (yearsToRetire < 20 ? 15 : 0);

  let recommendedPlanId: string;
  let fitScore: number;
  let rationale: string;

  if (rothScore >= tradScore) {
    recommendedPlanId = "roth-401k";
    fitScore = Math.min(98, Math.max(72, 70 + Math.floor(rothScore / 2)));
    rationale =
      yearsToRetire >= 25 && age < 45
        ? `With ${yearsToRetire} years to retirement and your current age, paying taxes now and letting growth compound tax-free often works well.`
        : salaryNum < 100_000
          ? "Based on your income and timeline, locking in today's tax rate with tax-free growth can be a strong fit."
          : "Based on your age and retirement timeline, a Roth 401(k) can offer strong long-term tax-free growth.";
  } else {
    recommendedPlanId = "traditional-401k";
    fitScore = Math.min(95, Math.max(70, 68 + Math.floor(tradScore / 2)));
    rationale =
      salaryNum >= 100_000
        ? "With your current salary, reducing taxable income now with pre-tax contributions can lower your tax bill today."
        : "A traditional 401(k) can help lower your taxable income now while you save for retirement.";
  }

  return {
    recommendedPlanId,
    fitScore,
    rationale,
    profileSnapshot: {
      age: currentAge,
      retirementAge,
      salary: salaryNum,
      riskLevel: "Moderate",
    },
  };
}
