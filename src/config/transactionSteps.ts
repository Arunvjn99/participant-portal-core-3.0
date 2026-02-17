import type { TransactionType } from "../types/transactions";

/**
 * Step label configuration for all transaction types.
 * Values are i18n keys; translate with t(key) where labels are rendered.
 */
export const TRANSACTION_STEPS: Record<TransactionType, string[]> = {
  loan: [
    "transactions.stepsLoan0",
    "transactions.stepsLoan1",
    "transactions.stepsLoan2",
    "transactions.stepsLoan3",
  ],
  withdrawal: [
    "transactions.stepsWithdrawal0",
    "transactions.stepsWithdrawal1",
    "transactions.stepsWithdrawal2",
    "transactions.stepsWithdrawal3",
  ],
  distribution: [
    "transactions.stepsWithdrawal0",
    "transactions.stepsWithdrawal1",
    "transactions.stepsWithdrawal2",
    "transactions.stepsWithdrawal3",
  ],
  rollover: [
    "transactions.stepsRollover0",
    "transactions.stepsRollover1",
    "transactions.stepsRollover2",
    "transactions.stepsRollover3",
  ],
  transfer: [
    "transactions.stepsTransfer0",
    "transactions.stepsTransfer1",
    "transactions.stepsTransfer2",
    "transactions.stepsTransfer3",
  ],
  rebalance: [
    "transactions.stepsRollover0",
    "transactions.stepsRollover1",
    "transactions.stepsRollover2",
    "transactions.stepsRollover3",
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
