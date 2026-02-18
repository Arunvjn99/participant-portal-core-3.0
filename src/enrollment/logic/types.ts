/**
 * Type definitions for contribution and projection calculations
 */

export type ContributionType = "percentage" | "fixed";
export type ContributionSource = "preTax" | "afterTax" | "roth";

export interface ContributionInput {
  salary: number;
  contributionType: ContributionType;
  contributionAmount: number; // Percentage (0-100) or fixed dollar amount
  source?: ContributionSource; // Tax treatment of contribution
}

export interface ContributionPreset {
  id: string;
  label: string;
  percentage: number;
}

export interface MonthlyContribution {
  employee: number;
  employer: number;
  total: number;
}

export interface ProjectionInput {
  currentAge: number;
  retirementAge: number;
  currentBalance: number;
  monthlyContribution: number;
  employerMatch?: number;
  annualReturnRate: number;
  inflationRate: number;
  autoIncrease?: {
    enabled: boolean;
    initialPercentage: number;
    increasePercentage: number;
    maxPercentage: number;
    salary: number;
    contributionType: ContributionType;
    assumptions: ContributionAssumptions;
  };
}

export interface ProjectionDataPoint {
  age: number;
  year: number;
  balance: number;
  contributions: number;
  growth: number;
}

export interface ProjectionResult {
  dataPoints: ProjectionDataPoint[];
  finalBalance: number;
  totalContributions: number;
  totalGrowth: number;
}

export interface ProjectionComparison {
  baseline: ProjectionResult;
  withAutoIncrease: ProjectionResult;
}

export type IncrementCycle = "calendar_year" | "plan_enroll_date" | "plan_year";

export interface AutoIncreaseSettings {
  enabled: boolean;
  percentage: number; // Annual increase percentage (e.g., 2 = 2% per year)
  /** Stop increasing at this contribution % (cap). Used in projection. */
  maxPercentage: number;
  /** Optional minimum contribution floor; contribution will not go below this %. */
  minimumFloor?: number;
  incrementCycle: IncrementCycle;
  /** Per-source increase (2 = 2% or $2/mo depending on view mode) */
  preTaxIncrease: number;
  rothIncrease: number;
  afterTaxIncrease: number;
}

export interface ContributionAssumptions {
  employerMatchPercentage: number;
  employerMatchCap: number; // Maximum salary percentage matched
  annualReturnRate: number;
  inflationRate: number;
}
