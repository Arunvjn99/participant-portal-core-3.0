/**
 * Loan scenario engine — intent phases for the scripted assistant (no API).
 */
export type LoanIntentType =
  | "DISCOVERY"
  | "CHECK_ELIGIBILITY"
  | "REQUEST_AMOUNT"
  | "CONFIRMATION"
  | "REJECTION"
  | "PROCEED";

/** Mutable context carried through `LocalFlowState.context` for the loan flow. */
export type LoanContext = {
  amount?: number;
  /** When user agrees to borrow the plan max after an over-limit request. */
  suggestedAmount?: number;
  purpose?: string;
  maxLoan?: number;
  eligible?: boolean;
  /** True while waiting for yes/no to use max loan after over-limit. */
  awaitingMaxConfirm?: boolean;
  /** Last parsed purpose string (home | medical | education | general). */
  purposeLabel?: string;
};
