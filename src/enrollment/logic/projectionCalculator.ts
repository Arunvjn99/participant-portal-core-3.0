import type {
  ProjectionInput,
  ProjectionResult,
  ProjectionDataPoint,
  ContributionInput,
} from "./types";
import { calculateMonthlyContribution } from "./contributionCalculator";
import { applyAutoIncrease } from "./applyAutoIncrease";

/**
 * Calculate retirement projection based on contribution and assumptions
 * 
 * If auto-increase is enabled, contribution amounts increase each year
 * according to the auto-increase settings.
 */
export const calculateProjection = (input: ProjectionInput): ProjectionResult => {
  const yearsToRetirement = Math.max(0, input.retirementAge - input.currentAge);
  const dataPoints: ProjectionDataPoint[] = [];
  let currentBalance = Number.isFinite(input.currentBalance) ? input.currentBalance : 0;
  let totalContributions = 0;
  const monthlyEmployerMatch = Number.isFinite(input.employerMatch) ? (input.employerMatch || 0) : 0;

  // If auto-increase is enabled, calculate yearly contribution percentages
  let yearlyPercentages: number[] | null = null;
  if (input.autoIncrease?.enabled && input.autoIncrease.contributionType === "percentage") {
    yearlyPercentages = applyAutoIncrease(
      input.autoIncrease.initialPercentage,
      input.autoIncrease.increasePercentage,
      input.autoIncrease.maxPercentage,
      yearsToRetirement
    );
  }

  for (let year = 0; year <= yearsToRetirement; year++) {
    const age = input.currentAge + year;

    // Calculate contribution for this year
    let monthlyContribution = input.monthlyContribution;
    let monthlyEmployer = monthlyEmployerMatch;

    if (yearlyPercentages && input.autoIncrease) {
      // Use auto-increase percentage for this year
      const yearPercentage = yearlyPercentages[year] || yearlyPercentages[yearlyPercentages.length - 1];
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
    const annualContribution = totalMonthlyContribution * 12;
    totalContributions += annualContribution;

    // Apply growth for the year
    currentBalance = currentBalance * (1 + input.annualReturnRate / 100);
    currentBalance += annualContribution;

    dataPoints.push({
      age,
      year,
      balance: currentBalance,
      contributions: totalContributions,
      growth: currentBalance - input.currentBalance - totalContributions,
    });
  }

  const totalGrowth = currentBalance - (Number.isFinite(input.currentBalance) ? input.currentBalance : 0) - totalContributions;

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
