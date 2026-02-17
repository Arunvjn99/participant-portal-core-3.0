export interface PlanRecommendation {
  recommendedPlanId: string;
  fitScore: number;
  /** Optional i18n key for rationale (e.g. enrollment.rationaleRothYoung). When set, UI should use t(rationaleKey). */
  rationaleKey?: string;
  /** Fallback rationale text when rationaleKey is not used (e.g. en-only or legacy). */
  rationale: string;
  profileSnapshot: {
    age: number;
    retirementAge: number;
    salary: number;
    riskLevel: string;
  };
}

export interface PlanOption {
  id: string;
  title: string;
  matchInfo: string;
  description: string;
  benefits: string[];
  isRecommended?: boolean;
  fitScore?: number;
  /** When false, plan is locked (e.g. profile criteria). Default true. */
  isEligible?: boolean;
  /** Shown when isEligible is false. */
  ineligibilityReason?: string;
}
