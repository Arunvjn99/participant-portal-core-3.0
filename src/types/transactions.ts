/**
 * Transaction types and status definitions
 */

export type TransactionType = "loan" | "withdrawal" | "distribution" | "rollover" | "transfer" | "rebalance";

export type TransactionStatus = "draft" | "active" | "completed" | "cancelled";

export type RetirementImpactLevel = "low" | "medium" | "high";

export interface Transaction {
  id: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  grossAmount?: number;
  netAmount?: number;
  fees?: number;
  taxWithholding?: number;
  dateInitiated: string;
  dateCompleted?: string;
  processingTime?: string;
  repaymentInfo?: {
    monthlyPayment: number;
    termMonths: number;
    interestRate: number;
  };
  milestones?: {
    submitted?: string;
    processing?: string;
    completed?: string;
  };
  retirementImpact: {
    level: RetirementImpactLevel;
    rationale: string;
  };
  isIrreversible: boolean;
  legalConfirmations: string[];
  /** Optional display name for activity list (e.g. "Loan Repayment", "Dividend Credit") */
  displayName?: string;
  /** Optional account label (e.g. "Traditional 401(k)") */
  accountType?: string;
  /** When true, amount is shown as negative in activity list */
  amountNegative?: boolean;
  /** Plan ID for multi-plan filtering (e.g. "current", "previous", "ira") */
  planId?: string;
}
