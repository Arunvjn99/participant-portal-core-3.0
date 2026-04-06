export type PlanType = "traditional" | "roth";

export type RiskLevel = "conservative" | "balanced" | "growth" | "aggressive";

export type IncrementCycle = "calendar" | "participant" | "plan";

export type ContributionSources = {
  preTax: number;
  roth: number;
  afterTax: number;
};

export type RetirementProjection = {
  estimatedValue: number;
  monthlyIncome: number;
};

export type EnrollmentSnapshot = {
  currentStep: number;
  selectedPlan: PlanType | null;
  contribution: number;
  salary: number;
  monthlyPaycheck: number;
  monthlyContribution: number;
  employerMatch: number;
  projectedBalance: number;
  projectedBalanceNoAutoIncrease: number;
  readinessScore: number;
  contributionSources: ContributionSources;
  supportsAfterTax: boolean;
  companyPlans: PlanType[];
  autoIncrease: boolean;
  autoIncreaseStepResolved: boolean;
  autoIncreaseRate: number;
  autoIncreaseMax: number;
  incrementCycle: IncrementCycle;
  riskLevel: RiskLevel | null;
  useRecommendedPortfolio: boolean;
  agreedToTerms: boolean;
  retirementAge: number;
  currentAge: number;
  currentSavings: number;
  retirementProjection: RetirementProjection;
};

export type EnrollmentStepId =
  | "plan"
  | "contribution"
  | "source"
  | "autoIncrease"
  | "investment"
  | "readiness"
  | "review";

export type StepConfig = {
  id: EnrollmentStepId;
  label: string;
  segment: string;
};

export type PlanOption = {
  id: string;
  title: string;
  matchInfo: string;
  description: string;
  benefits: string[];
  isEligible: boolean;
  isRecommended?: boolean;
};
