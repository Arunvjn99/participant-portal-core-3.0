export type LoanAIStep =
  | "eligibility"
  | "simulation"
  | "configuration"
  | "fees"
  | "documents"
  | "review";

export type LoanAIState = {
  step: LoanAIStep;
  data: {
    amount?: number;
    /** Set from loan simulator (months). */
    tenureMonths?: number;
    purpose?: string;
    paymentMethod?: string;
  };
};

/** Context key for `LocalFlowState.context` — full guided 6-step loan chat. */
export const LOAN_AI_STATE_KEY = "loanAI" as const;

export const LOAN_PROCESSING_FEE = 50;
export const LOAN_OTHER_CHARGES = 50;

export function netLoanAmount(principal: number): number {
  return Math.max(0, Math.round((principal - LOAN_PROCESSING_FEE - LOAN_OTHER_CHARGES) * 100) / 100);
}
