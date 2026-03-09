/**
 * Retirement calculation utilities — production-ready, reusable.
 * No UI; used by enrollment context and Contribution page.
 * Employer match: 100% up to matchCap % of salary.
 */

/** Paychecks per year (bi-weekly) */
export const PAYCHECKS_PER_YEAR = 26;

/**
 * Monthly employee contribution from salary and percent.
 * percent is annual contribution percentage (e.g. 6 = 6% of salary).
 */
export function calculateMonthlyContribution(salary: number, percent: number): number {
  if (!Number.isFinite(salary) || salary <= 0) return 0;
  const annual = (salary * Math.max(0, percent)) / 100;
  return annual / 12;
}

/**
 * Employer match: 100% up to matchCap % of salary.
 * If percent <= matchCap: employer matches full percent of salary (as dollar amount).
 * If percent > matchCap: employer matches only up to matchCap % of salary.
 * Returns annual employer match in dollars.
 */
export function calculateEmployerMatch(
  salary: number,
  percent: number,
  matchCap: number = 6
): number {
  if (!Number.isFinite(salary) || salary <= 0) return 0;
  const effectivePercent = Math.min(Math.max(0, percent), matchCap);
  return (salary * effectivePercent) / 100;
}

/**
 * Annual contribution from monthly amount.
 */
export function calculateAnnualContribution(monthlyAmount: number): number {
  return Number.isFinite(monthlyAmount) && monthlyAmount >= 0 ? monthlyAmount * 12 : 0;
}

/**
 * Future value of a series of monthly contributions with compound growth.
 * FV = PMT * [((1 + r)^n - 1) / r]
 * where r = monthly rate, n = number of months.
 */
export interface ProjectedValueInput {
  salary: number;
  percent: number;
  years: number;
  annualReturn: number;
  /** Employer match cap (default 6). Match is 100% up to cap. */
  employerMatchCap?: number;
}

export interface ProjectedValueResult {
  /** Total projected balance at end of period */
  futureValue: number;
  /** Sum of employee contributions (no growth) */
  totalEmployeeContributions: number;
  /** Sum of employer match contributions (no growth) */
  totalEmployerMatch: number;
  /** Monthly employee contribution */
  monthlyContribution: number;
  /** Monthly employer match */
  monthlyEmployerMatch: number;
}

export function calculateProjectedValue(input: ProjectedValueInput): ProjectedValueResult {
  const {
    salary,
    percent,
    years,
    annualReturn,
    employerMatchCap = 6,
  } = input;

  const monthlyEmployee = calculateMonthlyContribution(salary, percent);
  const annualEmployer = calculateEmployerMatch(salary, percent, employerMatchCap);
  const monthlyEmployer = annualEmployer / 12;
  const totalMonthly = monthlyEmployee + monthlyEmployer;

  const months = Math.max(0, Math.floor(years * 12));
  const r = Number.isFinite(annualReturn) ? annualReturn / 100 / 12 : 0;

  let futureValue: number;
  if (r <= 0 || months === 0) {
    futureValue = totalMonthly * months;
  } else {
    // FV = PMT * [((1 + r)^n - 1) / r]
    futureValue = totalMonthly * (Math.pow(1 + r, months) - 1) / r;
  }

  const totalEmployeeContributions = monthlyEmployee * months;
  const totalEmployerMatch = monthlyEmployer * months;

  return {
    futureValue: Number.isFinite(futureValue) ? Math.max(0, futureValue) : 0,
    totalEmployeeContributions,
    totalEmployerMatch,
    monthlyContribution: monthlyEmployee,
    monthlyEmployerMatch: monthlyEmployer,
  };
}

/**
 * Validate tax split: preTax + roth + afterTax must equal 100.
 */
export function validateTaxSplit(alloc: {
  preTax: number;
  roth: number;
  afterTax: number;
}): { valid: boolean; error?: string } {
  const sum = alloc.preTax + alloc.roth + alloc.afterTax;
  const diff = Math.abs(sum - 100);
  if (diff >= 0.01) {
    return {
      valid: false,
      error: "preTax + roth + afterTax must equal 100%",
    };
  }
  if (
    alloc.preTax < 0 ||
    alloc.roth < 0 ||
    alloc.afterTax < 0 ||
    alloc.preTax > 100 ||
    alloc.roth > 100 ||
    alloc.afterTax > 100
  ) {
    return {
      valid: false,
      error: "Each split must be between 0 and 100",
    };
  }
  return { valid: true };
}

/**
 * Normalize allocation so preTax + roth + afterTax = 100.
 * Scales proportionally; if sum is 0 returns 100% preTax.
 */
export function normalizeTaxSplit(alloc: {
  preTax: number;
  roth: number;
  afterTax: number;
}): { preTax: number; roth: number; afterTax: number } {
  const preTax = Math.max(0, Math.min(100, alloc.preTax));
  const roth = Math.max(0, Math.min(100, alloc.roth));
  const afterTax = Math.max(0, Math.min(100, alloc.afterTax));
  const sum = preTax + roth + afterTax;
  if (sum <= 0) return { preTax: 100, roth: 0, afterTax: 0 };
  const scale = 100 / sum;
  const p = Math.round(preTax * scale * 100) / 100;
  const r = Math.round(roth * scale * 100) / 100;
  const a = 100 - p - r;
  return { preTax: p, roth: r, afterTax: a };
}
