/**
 * Calculate Equated Monthly Installment (EMI)
 * Formula: EMI = [P * r * (1+r)^n] / [(1+r)^n - 1]
 * where P = principal, r = monthly interest rate, n = number of months
 */
export function calculateEMI(
  principal: number,
  annualRate: number,
  termMonths: number,
): number {
  if (principal <= 0 || termMonths <= 0) {
    return 0;
  }

  if (annualRate === 0) {
    return principal / termMonths;
  }

  const monthlyRate = annualRate / 12;
  const numerator = principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths);
  const denominator = Math.pow(1 + monthlyRate, termMonths) - 1;

  return numerator / denominator;
}

/**
 * Calculate opportunity cost of withdrawing/borrowing funds
 * Formula: future_value = amount * (1 + avg_return)^years_remaining
 */
export function calculateOpportunityCost(
  amount: number,
  avgReturn: number,
  yearsRemaining: number,
): number {
  if (amount <= 0 || yearsRemaining <= 0) {
    return 0;
  }

  return amount * Math.pow(1 + avgReturn, yearsRemaining) - amount;
}

/**
 * Calculate retirement delay in months based on lost growth
 * Formula: impact_ratio = lost_growth / projected_balance; months_delay = impact_ratio * 12
 */
export function calculateRetirementDelay(
  lostGrowth: number,
  projectedBalance: number,
): number {
  if (projectedBalance <= 0 || lostGrowth <= 0) {
    return 0;
  }

  const impactRatio = lostGrowth / projectedBalance;
  return impactRatio * 12;
}

/**
 * Calculate payroll deduction as percentage of monthly gross salary
 */
export function calculatePayrollDeduction(
  monthlyPayment: number,
  monthlySalary: number,
): number {
  if (monthlySalary <= 0) {
    return 0;
  }

  return (monthlyPayment / monthlySalary) * 100;
}

/**
 * Calculate withdrawal net payout after taxes and penalties
 */
export function calculateWithdrawalNet(
  amount: number,
  federalRate: number,
  stateRate: number,
  penaltyRate: number,
  isEarlyWithdrawal: boolean,
): {
  federalTax: number;
  stateTax: number;
  penalty: number;
  netPayout: number;
} {
  const federalTax = amount * federalRate;
  const stateTax = amount * stateRate;
  const penalty = isEarlyWithdrawal ? amount * penaltyRate : 0;
  const netPayout = amount - federalTax - stateTax - penalty;

  return {
    federalTax,
    stateTax,
    penalty,
    netPayout,
  };
}

/**
 * Calculate volatility reduction estimate from rebalancing
 * Based on portfolio drift percentage
 */
export function calculateVolatilityReduction(currentDrift: number): number {
  // Volatility reduction is inversely related to drift
  // Higher drift = more volatility, rebalancing reduces it
  // Simple model: reduction = drift * 0.15 (15% reduction per 1% drift)
  return Math.max(0, currentDrift * 0.15);
}

/**
 * Calculate contribution impact on paycheck and retirement
 */
export function calculateContributionImpact(
  annualSalary: number,
  currentRate: number,
  newRate: number,
  federalTaxRate: number,
  projectedBalance: number,
  avgReturn: number,
  yearsToRetirement: number,
): {
  monthlyPaycheckDelta: number;
  annualTaxSavings: number;
  retirementAgeDelta: number;
  projectedBalanceDelta: number;
} {
  const monthlySalary = annualSalary / 12;
  const currentMonthlyContribution = (annualSalary * currentRate) / 100 / 12;
  const newMonthlyContribution = (annualSalary * newRate) / 100 / 12;
  const monthlyPaycheckDelta = currentMonthlyContribution - newMonthlyContribution;

  // Tax savings from increased contribution (pre-tax)
  const annualContributionDelta = (annualSalary * (newRate - currentRate)) / 100;
  const annualTaxSavings = annualContributionDelta * federalTaxRate;

  // Projected balance delta using future value formula
  const monthlyReturn = avgReturn / 12;
  const totalMonths = yearsToRetirement * 12;
  const contributionDelta = newMonthlyContribution - currentMonthlyContribution;

  // Future value of annuity: FV = PMT * [((1 + r)^n - 1) / r]
  let projectedBalanceDelta = 0;
  if (monthlyReturn > 0) {
    const fvAnnuity = contributionDelta * ((Math.pow(1 + monthlyReturn, totalMonths) - 1) / monthlyReturn);
    projectedBalanceDelta = fvAnnuity;
  } else {
    projectedBalanceDelta = contributionDelta * totalMonths;
  }

  // Estimate retirement age delta based on balance impact
  // Simplified: if balance increases by X%, retirement could come X% earlier
  const balanceImpactRatio = projectedBalanceDelta / projectedBalance;
  const retirementAgeDelta = balanceImpactRatio * yearsToRetirement * 12; // in months

  return {
    monthlyPaycheckDelta,
    annualTaxSavings,
    retirementAgeDelta,
    projectedBalanceDelta,
  };
}

/**
 * Generate projection data for charts
 * Returns monthly balance projections over specified months (default 12)
 */
export function generateProjectionData(
  currentBalance: number,
  monthlyContribution: number,
  avgReturn: number,
  months: number = 12,
): { month: number; balance: number }[] {
  const monthlyReturn = avgReturn / 12;
  const projection: { month: number; balance: number }[] = [];

  let balance = currentBalance;

  for (let month = 0; month <= months; month++) {
    projection.push({
      month,
      balance: Math.round(balance * 100) / 100,
    });

    // Calculate next month's balance: (current + contribution) * (1 + return)
    balance = (balance + monthlyContribution) * (1 + monthlyReturn);
  }

  return projection;
}
