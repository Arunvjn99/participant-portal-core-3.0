import type { TransactionType } from "../types/transactions";

/**
 * Translation keys for step labels (transactions namespace).
 * Use with useTranslation('transactions'): getStepLabelKeys(type).map((key) => t(key))
 */
export const TRANSACTION_STEP_KEYS: Record<TransactionType, string[]> = {
  loan: ["loan.steps.eligibility", "loan.steps.loanAmount", "loan.steps.repaymentTerms", "loan.steps.reviewSubmit"],
  withdrawal: ["withdrawal.steps.eligibility", "withdrawal.steps.withdrawalAmount", "withdrawal.steps.taxInformation", "withdrawal.steps.reviewSubmit"],
  distribution: ["distribution.steps.eligibility", "distribution.steps.distributionAmount", "distribution.steps.taxWithholding", "distribution.steps.reviewSubmit"],
  rollover: ["rollover.steps.eligibility", "rollover.steps.rolloverAmount", "rollover.steps.destinationAccount", "rollover.steps.reviewSubmit"],
  transfer: ["transfer.steps.eligibility", "transfer.steps.transferDetails", "transfer.steps.investmentSelection", "transfer.steps.reviewSubmit"],
  rebalance: ["rebalance.steps.eligibility", "rebalance.steps.currentAllocation", "rebalance.steps.targetAllocation", "rebalance.steps.reviewSubmit"],
};

/** @deprecated Use getStepLabelKeys + t() for i18n */
export const TRANSACTION_STEPS: Record<TransactionType, string[]> = {
  loan: ["Eligibility", "Loan Amount", "Repayment Terms", "Review & Submit"],
  withdrawal: ["Eligibility", "Withdrawal Amount", "Tax Information", "Review & Submit"],
  distribution: ["Eligibility", "Distribution Amount", "Tax Withholding", "Review & Submit"],
  rollover: ["Eligibility", "Rollover Amount", "Destination Account", "Review & Submit"],
  transfer: ["Eligibility", "Transfer Details", "Investment Selection", "Review & Submit"],
  rebalance: ["Eligibility", "Current Allocation", "Target Allocation", "Review & Submit"],
};

/**
 * Get translation keys for step labels.
 * Use with useTranslation('transactions'): getStepLabelKeys(type).map((k) => t(k)).
 */
export const getStepLabelKeys = (type: TransactionType): string[] => {
  return TRANSACTION_STEP_KEYS[type] ?? [];
};

/**
 * Get step labels for a transaction type (English fallback; prefer getStepLabelKeys + t() for i18n)
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
