import type {
  ProjectionInput,
  ProjectionResult,
  ProjectionDataPoint,
  ContributionInput,
} from "./types";
import { calculateMonthlyContribution } from "./contributionCalculator";
import { applyAutoIncrease } from "./applyAutoIncrease";

/**
 * Calculate retirement projection with monthly compounding.
 * Formula: FV = PMT * (((1 + r/12)^(n) - 1) / (r/12)) for each segment; we iterate monthly.
 * r = annualReturnRate (e.g. 7%), n = months to retirement.
 * Includes employer contribution in total monthly PMT.
 */
export const calculateProjection = (input: ProjectionInput): ProjectionResult => {
  const yearsToRetirement = Math.max(0, input.retirementAge - input.currentAge);
  const totalMonths = Math.floor(yearsToRetirement * 12);
  const dataPoints: ProjectionDataPoint[] = [];
  let currentBalance = Number.isFinite(input.currentBalance) ? input.currentBalance : 0;
  let totalContributions = 0;
  const monthlyEmployerMatch = Number.isFinite(input.employerMatch) ? (input.employerMatch || 0) : 0;
  const r = Number.isFinite(input.annualReturnRate) ? input.annualReturnRate / 100 : 0;
  const monthlyRate = r / 12;

  // If auto-increase is enabled, we still use yearly steps for dataPoints but compound monthly within each year
  let yearlyPercentages: number[] | null = null;
  if (input.autoIncrease?.enabled && input.autoIncrease.contributionType === "percentage") {
    yearlyPercentages = applyAutoIncrease(
      input.autoIncrease.initialPercentage,
      input.autoIncrease.increasePercentage,
      input.autoIncrease.maxPercentage,
      yearsToRetirement
    );
  }

  let monthIndex = 0;
  const initialBalance = currentBalance;

  for (let year = 0; year <= yearsToRetirement; year++) {
    const age = input.currentAge + year;

    let monthlyContribution = input.monthlyContribution;
    let monthlyEmployer = monthlyEmployerMatch;

    if (yearlyPercentages && input.autoIncrease) {
      const yearPercentage = yearlyPercentages[year] ?? yearlyPercentages[yearlyPercentages.length - 1];
      const contributionInput: ContributionInput = {
        salary: input.autoIncrease.salary,
        contributionType: "percentage",
        contributionAmount: yearPercentage,
      };
      const monthlyContributionData = calculateMonthlyContribution(
        contributionInput,
        input.autoIncrease.assumptions
      );
      monthlyContribution = monthlyContributionData.employee;
      monthlyEmployer = monthlyContributionData.employer;
    }

    const totalMonthlyContribution = monthlyContribution + monthlyEmployer;

    // Compound monthly for this year (12 months)
    const monthsThisYear = year < yearsToRetirement ? 12 : Math.max(0, totalMonths - year * 12);
    for (let m = 0; m < monthsThisYear; m++) {
      currentBalance = currentBalance * (1 + monthlyRate) + totalMonthlyContribution;
      totalContributions += totalMonthlyContribution;
      monthIndex++;
    }

    dataPoints.push({
      age,
      year,
      balance: currentBalance,
      contributions: totalContributions,
      growth: currentBalance - initialBalance - totalContributions,
    });
  }

  const totalGrowth = currentBalance - (Number.isFinite(initialBalance) ? initialBalance : 0) - totalContributions;

  return {
    dataPoints,
    finalBalance: Number.isFinite(currentBalance) ? currentBalance : 0,
    totalContributions: Number.isFinite(totalContributions) ? totalContributions : 0,
    totalGrowth: Number.isFinite(totalGrowth) ? totalGrowth : 0,
  };
};

/**
 * Calculate projected balance at retirement
 */
export const calculateFinalBalance = (input: ProjectionInput): number => {
  const projection = calculateProjection(input);
  return projection.finalBalance;
};

/**
 * Calculate total contributions over lifetime
 */
export const calculateTotalContributions = (input: ProjectionInput): number => {
  const projection = calculateProjection(input);
  return projection.totalContributions;
};
