import type { RiskLevel } from "../types";

const GROWTH_RATES: Record<RiskLevel, number> = {
  conservative: 0.045,
  balanced: 0.068,
  growth: 0.082,
  aggressive: 0.095,
};

export function getGrowthRate(risk: RiskLevel | null): number {
  return GROWTH_RATES[risk ?? "balanced"] ?? 0.068;
}

export function computeProjectedBalancePure(
  salary: number,
  currentSavings: number,
  contribPct: number,
  years: number,
  rate: number,
): number {
  const annualEmp = Math.round((salary * contribPct) / 100);
  const matchCap = Math.min(contribPct, 6);
  const annualEr = Math.round((salary * matchCap) / 100);
  let balance = currentSavings;
  for (let i = 0; i < years; i++) {
    balance = (balance + annualEmp + annualEr) * (1 + rate);
  }
  return balance;
}

export function projectBalanceWithAutoIncrease(
  salary: number,
  currentSavings: number,
  startPct: number,
  years: number,
  baseRate: number,
  stepPct: number,
  maxPct: number,
): number {
  let balance = currentSavings;
  let pct = startPct;
  for (let y = 0; y < years; y++) {
    const annualEmp = Math.round((salary * pct) / 100);
    const matchCap = Math.min(pct, 6);
    const annualEr = Math.round((salary * matchCap) / 100);
    balance = (balance + annualEmp + annualEr) * (1 + baseRate);
    pct = Math.min(pct + stepPct, maxPct);
  }
  return balance;
}

export function computeReadinessScore(
  contributionPercent: number,
  yearsToRetirement: number,
  projectedBalance: number,
): number {
  const raw =
    contributionPercent * 5 +
    yearsToRetirement * 1.2 +
    projectedBalance / 100_000;
  return Math.min(100, Math.max(0, Math.round(raw)));
}

export type DerivedInput = {
  monthlyPaycheck: number;
  salaryAnnual: number;
  contributionPercent: number;
  currentSavings: number;
  currentAge: number;
  retirementAge: number;
  growthRateAnnual: number;
  autoIncreaseEnabled: boolean;
  autoIncreaseRate: number;
  autoIncreaseMax: number;
};

export type DerivedResult = {
  monthlyPaycheck: number;
  salaryAnnual: number;
  monthlyContribution: number;
  employerMatch: number;
  projectedBalance: number;
  projectedBalanceNoAutoIncrease: number;
  readinessScore: number;
  retirementProjection: { estimatedValue: number; monthlyIncome: number };
};

export function buildDerived(input: DerivedInput): DerivedResult {
  let salaryAnnual = Math.max(0, Math.round(input.salaryAnnual));
  let monthlyPaycheck = Math.max(0, Math.round(input.monthlyPaycheck));

  if (salaryAnnual > 0 && monthlyPaycheck <= 0) {
    monthlyPaycheck = Math.round(salaryAnnual / 12);
  } else if (monthlyPaycheck > 0 && salaryAnnual <= 0) {
    salaryAnnual = monthlyPaycheck * 12;
  } else if (salaryAnnual > 0 && monthlyPaycheck > 0) {
    monthlyPaycheck = Math.round(salaryAnnual / 12);
  }

  const pct = input.contributionPercent;
  const monthlyContribution = (monthlyPaycheck * pct) / 100;
  const employerMatch = (monthlyPaycheck * Math.min(pct, 6)) / 100;
  const years = Math.max(0, input.retirementAge - input.currentAge);

  const pbNoAuto = computeProjectedBalancePure(
    salaryAnnual, input.currentSavings, pct, years, input.growthRateAnnual,
  );
  const pb = input.autoIncreaseEnabled
    ? projectBalanceWithAutoIncrease(
        salaryAnnual, input.currentSavings, pct, years,
        input.growthRateAnnual, input.autoIncreaseRate, input.autoIncreaseMax,
      )
    : pbNoAuto;

  const readinessScore = computeReadinessScore(pct, years, pb);
  const projectedBalance = Math.round(pb);

  return {
    monthlyPaycheck,
    salaryAnnual,
    monthlyContribution: Math.round(monthlyContribution),
    employerMatch: Math.round(employerMatch),
    projectedBalance,
    projectedBalanceNoAutoIncrease: Math.round(pbNoAuto),
    readinessScore,
    retirementProjection: {
      estimatedValue: projectedBalance,
      monthlyIncome: Math.round((projectedBalance * 0.04) / 12),
    },
  };
}

export function generateProjectionCurve(
  percent: number,
  salary: number,
  annualGrowthRate = 0.07,
) {
  const annual = salary * (percent / 100);
  const matchPercent = Math.min(percent, 6);
  const matchAnnual = salary * (matchPercent / 100);
  const data: { year: string; value: number; contributions: number; marketGain: number }[] = [];
  let total = 0;
  let contributions = 0;
  for (let year = 0; year <= 30; year++) {
    const yearlyContribution = annual + matchAnnual;
    contributions += yearlyContribution;
    total = (total + yearlyContribution) * (1 + annualGrowthRate);
    data.push({
      year: `${year}yr`,
      value: Math.round(total),
      contributions: Math.round(contributions),
      marketGain: Math.round(total - contributions),
    });
  }
  return data;
}
