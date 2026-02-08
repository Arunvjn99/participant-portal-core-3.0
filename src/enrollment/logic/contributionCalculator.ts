import type {
  ContributionInput,
  MonthlyContribution,
  ContributionAssumptions,
} from "./types";

/** Bi-weekly pay frequency: 26 paychecks per year */
export const PAYCHECKS_PER_YEAR = 26;

/** Default paychecks per year (12 = monthly pay) */
export const DEFAULT_PAYCHECKS_PER_YEAR = 12;

/**
 * Calculate monthly contribution amounts based on input
 *
 * Contribution amounts are interpreted as:
 * - percentage → annual percentage of salary (e.g., 6% = 6% of annual salary)
 * - fixed → per-paycheck dollar amount (bi-weekly, 26 paychecks/year)
 *
 * Employer match: 100% up to N% of salary (placeholder). Match is applied to
 * the lesser of actual contribution or cap.
 */
export const calculateMonthlyContribution = (
  input: ContributionInput,
  assumptions: ContributionAssumptions
): MonthlyContribution => {
  // Calculate annual employee contribution
  // Percentage: contributionAmount is annual % of salary
  // Fixed: contributionAmount is per-paycheck $, multiply by 26 for annual
  const employeeAnnualContribution =
    input.contributionType === "percentage"
      ? (input.salary * input.contributionAmount) / 100
      : input.contributionAmount * PAYCHECKS_PER_YEAR;

  // Calculate monthly employee contribution
  const monthlyEmployee = employeeAnnualContribution / 12;

  // Calculate employer match annually
  // Note: Employer match is always pre-tax, regardless of contribution source (preTax, afterTax, or roth)
  let employerAnnualMatch = 0;
  if (assumptions.employerMatchPercentage > 0) {
    // Maximum contribution that can be matched (as percentage of salary)
    const maxMatchedContribution = (input.salary * assumptions.employerMatchCap) / 100;
    
    // Employer match is based on the lesser of:
    // 1. Actual employee annual contribution
    // 2. Maximum matched contribution (cap)
    const matchedContribution = Math.min(employeeAnnualContribution, maxMatchedContribution);
    
    // Calculate employer annual match
    employerAnnualMatch = (matchedContribution * assumptions.employerMatchPercentage) / 100;
  }

  // Convert employer match to monthly
  const monthlyEmployer = employerAnnualMatch / 12;

  return {
    employee: monthlyEmployee,
    employer: monthlyEmployer,
    total: monthlyEmployee + monthlyEmployer,
  };
};

/**
 * Calculate per-paycheck contribution (bi-weekly, 26 paychecks/year)
 */
export const calculatePerPaycheckContribution = (
  salary: number,
  contributionType: "percentage" | "fixed",
  contributionAmount: number
): number => {
  if (contributionType === "percentage") {
    return ((salary / PAYCHECKS_PER_YEAR) * contributionAmount) / 100;
  }
  return contributionAmount; // Fixed = per-paycheck amount
};

/**
 * Convert percentage contribution to annual dollar amount
 * 
 * @param salary Annual salary
 * @param percentage Annual contribution percentage (0-100)
 * @returns Annual contribution amount in dollars
 */
export const percentageToAnnualAmount = (
  salary: number,
  percentage: number
): number => {
  return (salary * percentage) / 100;
};

/**
 * Convert annual dollar amount to percentage of salary
 * 
 * @param salary Annual salary
 * @param annualAmount Annual contribution amount in dollars
 * @returns Contribution percentage (0-100)
 */
export const annualAmountToPercentage = (
  salary: number,
  annualAmount: number
): number => {
  if (salary === 0) return 0;
  return (annualAmount / salary) * 100;
};

/**
 * Validate contribution input
 * - Percentage: 0–100 (IRR/plan limits placeholder)
 * - Fixed: 0 to per-paycheck gross salary
 * @param paychecksPerYear Optional; defaults to PAYCHECKS_PER_YEAR (26)
 */
export const validateContribution = (
  input: ContributionInput,
  _currentAge?: number,
  _retirementAge?: number,
  paychecksPerYear: number = PAYCHECKS_PER_YEAR
): { valid: boolean; error?: string } => {
  if (input.salary <= 0) {
    return { valid: false, error: "Salary must be greater than 0" };
  }

  if (input.contributionType === "percentage") {
    if (input.contributionAmount < 0 || input.contributionAmount > 100) {
      return {
        valid: false,
        error: "Contribution percentage must be between 0 and 100",
      };
    }
  } else {
    if (input.contributionAmount < 0) {
      return { valid: false, error: "Contribution amount must be positive" };
    }
    const perPaycheckSalary = input.salary / paychecksPerYear;
    if (input.contributionAmount > perPaycheckSalary) {
      return {
        valid: false,
        error: `Amount cannot exceed per-paycheck salary (${Math.round(perPaycheckSalary)}/paycheck)`,
      };
    }
  }

  return { valid: true };
};

/**
 * Contribution page derivation - single source of truth per Figma spec.
 * All values derived from: contributionType, contributionValue, annualSalary,
 * paychecksPerYear, employerMatchPercent, currentAge, retirementAge.
 */
export interface ContributionDerivationInput {
  contributionType: "percentage" | "fixed";
  contributionValue: number;
  annualSalary: number;
  paychecksPerYear?: number;
  employerMatchCap?: number; // Max % of salary that can be matched
  employerMatchPercentage?: number; // % of matched amount employer adds (e.g. 100 = 100%)
  employerMatchEnabled?: boolean;
  currentAge: number;
  retirementAge: number;
}

export interface ContributionDerivation {
  perPaycheck: number;
  monthlyContribution: number;
  employerMatchMonthly: number;
  totalMonthlyInvestment: number;
  estimatedRetirementBalance: number;
}

export function deriveContribution(input: ContributionDerivationInput): ContributionDerivation {
  const paychecksPerYear = input.paychecksPerYear ?? PAYCHECKS_PER_YEAR;
  const employerMatchEnabled = input.employerMatchEnabled ?? true;
  const employerMatchCap = input.employerMatchCap ?? 6;
  const employerMatchPercentage = input.employerMatchPercentage ?? 100;

  let perPaycheck: number;
  if (input.contributionType === "percentage") {
    perPaycheck =
      input.annualSalary > 0 && paychecksPerYear > 0
        ? (input.annualSalary / paychecksPerYear) * (input.contributionValue / 100)
        : 0;
  } else {
    perPaycheck = input.contributionValue >= 0 ? input.contributionValue : 0;
  }

  const monthlyContribution = perPaycheck * (paychecksPerYear / 12);

  let employerMatchMonthly = 0;
  if (employerMatchEnabled && input.annualSalary > 0) {
    const maxMatchedMonthly = (input.annualSalary * employerMatchCap) / 100 / 12;
    const matchedMonthly = Math.min(monthlyContribution, maxMatchedMonthly);
    employerMatchMonthly = matchedMonthly * (employerMatchPercentage / 100);
  }

  const totalMonthlyInvestment = monthlyContribution + employerMatchMonthly;

  const yearsToRetirement = Math.max(0, input.retirementAge - input.currentAge);
  const estimatedRetirementBalance = totalMonthlyInvestment * 12 * yearsToRetirement;

  return {
    perPaycheck: Number.isFinite(perPaycheck) ? perPaycheck : 0,
    monthlyContribution: Number.isFinite(monthlyContribution) ? monthlyContribution : 0,
    employerMatchMonthly: Number.isFinite(employerMatchMonthly) ? employerMatchMonthly : 0,
    totalMonthlyInvestment: Number.isFinite(totalMonthlyInvestment) ? totalMonthlyInvestment : 0,
    estimatedRetirementBalance: Number.isFinite(estimatedRetirementBalance)
      ? Math.max(0, estimatedRetirementBalance)
      : 0,
  };
}
