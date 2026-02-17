import type { TransactionType } from "../types/transactions";

/**
 * Step label configuration for all transaction types
 * Ensures consistency across all transaction flows
 */
export const TRANSACTION_STEPS: Record<TransactionType, string[]> = {
  loan: [
    "Strategy",
    "Money Flow",
    "Compliance",
    "Review",
  ],
  withdrawal: [
    "Eligibility",
    "Withdrawal Amount",
    "Tax Information",
    "Review & Submit",
  ],
  distribution: [
    "Eligibility",
    "Distribution Amount",
    "Tax Withholding",
    "Review & Submit",
  ],
  rollover: [
    "Eligibility",
    "Rollover Amount",
    "Destination Account",
    "Review & Submit",
  ],
  transfer: [
    "Eligibility",
    "Transfer Details",
    "Investment Selection",
    "Review & Submit",
  ],
  rebalance: [
    "Eligibility",
    "Current Allocation",
    "Target Allocation",
    "Review & Submit",
  ],
};

/**
 * Get step labels for a transaction type
 */
export const getStepLabels = (type: TransactionType): string[] => {
  return TRANSACTION_STEPS[type] || [];
};

/**
 * Get total number of steps for a transaction type
 */
export const getTotalSteps = (type: TransactionType): number => {
  return TRANSACTION_STEPS[type]?.length || 0;
};
