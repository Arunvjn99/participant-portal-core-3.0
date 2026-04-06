/**
 * Scenario engine — types, persona bridge, and flow rules for demo/scenario mode.
 * Production data still comes from Supabase; when `isDemoMode`, consumers read scenario payloads instead.
 */

import type { PersonaProfile, PersonaType } from "@/types/participantPersona";

export type ScenarioStage =
  | "pre_enrollment"
  | "enrollment_in_progress"
  | "post_enrollment"
  | "mid_career"
  | "at_risk"
  | "retired";

/** Activity row shape aligned with Transaction Center “recent” list. */
export type ScenarioActivity = {
  id: string;
  type: "loan" | "withdraw" | "transfer" | "rollover" | "rebalance";
  description: string;
  amount: string;
  status: "completed" | "processing" | "cancelled";
  date: string;
};

export type ScenarioPortfolioHolding = {
  id: string;
  label: string;
  pct: number;
};

export type ScenarioLoan = {
  id: string;
  productName: string;
  remainingPrincipal: number;
  originalPrincipal: number;
  paidPrincipal: number;
  nextPaymentDate: string;
  nextPaymentAmount: number;
};

export type ScenarioPermissions = {
  canAccessEnrollment: boolean;
  canAccessTransactions: boolean;
  canAccessInvestments: boolean;
  canWithdraw: boolean;
  canTakeLoan: boolean;
};

export type ScenarioAiTone =
  | "default"
  | "at_risk"
  | "early_investor"
  | "retired"
  | "start_saving"
  | "increase_contribution"
  | "manage_withdrawals";

export type ScenarioFinancial = {
  balance: number;
  contribution: number;
  employerMatch: number;
  riskScore: number;
  retirementAgeDefault?: number;
  investmentComfort?: "conservative" | "balanced" | "growth" | "aggressive";
  annualSalaryForEnrollment?: number;
  aiTone?: ScenarioAiTone;
};

export type ScenarioAccount = {
  isEnrolled: boolean;
  plan: string;
};

export type ScenarioUiFlags = {
  showWarnings: boolean;
  showAIInsights: boolean;
  /** Next-best-action cards on post-enrollment dashboard */
  showNextActions: boolean;
  /** Quick action tiles (loan / withdraw / …) */
  showQuickActions: boolean;
};

/**
 * End-to-end demo scenario: canonical nested shape.
 * Use {@link scenarioRuntimePayload} for the flat “data” view hooks and hydration expect.
 */
export type Scenario = {
  id: string;
  stage: ScenarioStage;
  user: { name: string; age: number };
  account: ScenarioAccount;
  financial: ScenarioFinancial;
  portfolio: ScenarioPortfolioHolding[];
  transactions: ScenarioActivity[];
  loans: ScenarioLoan[];
  permissions: ScenarioPermissions;
  ui: ScenarioUiFlags;
  /** Maps to legacy nav colors / badges */
  personaKey: PersonaType;
};

export type ScenarioId = Scenario["id"];

/** Flat slice used by dashboard / transactions / investments hydration (legacy shape). */
export type ScenarioRuntimeData = {
  balance: number;
  contribution: number;
  employerMatch: number;
  riskScore: number;
  investments: ScenarioPortfolioHolding[];
  transactions: ScenarioActivity[];
  loans?: ScenarioLoan[];
  retirementAgeDefault?: number;
  investmentComfort?: ScenarioFinancial["investmentComfort"];
  annualSalaryForEnrollment?: number;
  aiTone?: ScenarioAiTone;
};

export function scenarioRuntimePayload(scenario: Scenario): ScenarioRuntimeData {
  return {
    balance: scenario.financial.balance,
    contribution: scenario.financial.contribution,
    employerMatch: scenario.financial.employerMatch,
    riskScore: scenario.financial.riskScore,
    investments: scenario.portfolio,
    transactions: scenario.transactions,
    loans: scenario.loans.length > 0 ? scenario.loans : undefined,
    retirementAgeDefault: scenario.financial.retirementAgeDefault,
    investmentComfort: scenario.financial.investmentComfort,
    annualSalaryForEnrollment: scenario.financial.annualSalaryForEnrollment,
    aiTone: scenario.financial.aiTone,
  };
}

/** Map full scenario → persisted demo persona (UserContext + hooks). */
export function scenarioToPersonaProfile(scenario: Scenario): PersonaProfile {
  const d = scenarioRuntimePayload(scenario);
  const enrolled = scenario.account.isEnrolled;
  const retired = scenario.stage === "retired";

  return {
    id: `demo_${scenario.id}`,
    email: `${scenario.id}@demo.local`,
    name: scenario.user.name,
    age: scenario.user.age,
    balance: d.balance,
    contributionRate: d.contribution,
    employerMatchRate: d.employerMatch,
    retirementScore: d.riskScore,
    enrollmentStatus: retired ? "retired" : enrolled ? "enrolled" : "not_enrolled",
    scenario: scenario.personaKey,
    flags: {
      autoEnrollment: scenario.id === "sarah",
      loanActive: (d.loans?.length ?? 0) > 0,
      lowContribution: scenario.stage === "at_risk",
      demoTransactions: d.transactions.length > 0 && scenario.stage === "mid_career",
      demoLoan: (d.loans?.length ?? 0) > 0,
      demoWithdrawals: scenario.stage === "retired",
      hasInvestments: d.investments.length > 0,
    },
  };
}

export function logActiveScenario(scenario: Scenario | null): void {
  if (import.meta.env.DEV && scenario) {
    console.log("Active Scenario:", scenario.id);
  }
}
