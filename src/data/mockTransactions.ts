import type { Transaction } from "../types/transactions";

/**
 * Mock transaction data for POC
 */
export const MOCK_TRANSACTIONS: Record<string, Transaction> = {
  "txn-001": {
    id: "txn-001",
    type: "loan",
    planId: "current",
    status: "completed",
    amount: 50000,
    grossAmount: 50000,
    netAmount: 50000,
    fees: 0,
    taxWithholding: 0,
    dateInitiated: "2024-01-15",
    dateCompleted: "2024-01-20",
    processingTime: "5 business days",
    repaymentInfo: {
      monthlyPayment: 833.33,
      termMonths: 60,
      interestRate: 4.5,
    },
    milestones: {
      submitted: "2024-01-15",
      processing: "2024-01-16",
      completed: "2024-01-20",
    },
    retirementImpact: {
      level: "medium",
      rationale: "This loan reduces your retirement balance, but you'll repay it with interest over time.",
    },
    isIrreversible: false,
    legalConfirmations: ["Loan agreement signed", "Terms acknowledged"],
    displayName: "Loan Repayment",
    accountType: "Traditional 401(k)",
    amountNegative: true,
  },
  "txn-002": {
    id: "txn-002",
    type: "withdrawal",
    planId: "current",
    status: "active",
    amount: 10000,
    grossAmount: 10000,
    netAmount: 9000,
    fees: 100,
    taxWithholding: 900,
    dateInitiated: "2024-02-01",
    processingTime: "3-5 business days",
    milestones: {
      submitted: "2024-02-01",
      processing: "2024-02-02",
    },
    retirementImpact: {
      level: "high",
      rationale: "Withdrawals permanently reduce your retirement savings and may have tax implications.",
    },
    isIrreversible: true,
    legalConfirmations: ["Early withdrawal penalty acknowledged", "Tax implications understood"],
    displayName: "Withdrawal",
    accountType: "Roth 401(k)",
    amountNegative: true,
  },
  "txn-003": {
    id: "txn-003",
    type: "rollover",
    planId: "previous",
    status: "draft",
    amount: 25000,
    grossAmount: 25000,
    netAmount: 25000,
    fees: 0,
    taxWithholding: 0,
    dateInitiated: "2024-02-10",
    retirementImpact: {
      level: "low",
      rationale: "Rollovers preserve your retirement savings and maintain tax-deferred status.",
    },
    isIrreversible: false,
    legalConfirmations: [],
    displayName: "Start Rollover",
    accountType: "Traditional 401(k)",
  },
  "txn-004": {
    id: "txn-004",
    type: "distribution",
    planId: "ira",
    status: "completed",
    amount: 15000,
    grossAmount: 15000,
    netAmount: 12000,
    fees: 0,
    taxWithholding: 3000,
    dateInitiated: "2024-01-05",
    dateCompleted: "2024-01-10",
    processingTime: "5 business days",
    milestones: {
      submitted: "2024-01-05",
      processing: "2024-01-06",
      completed: "2024-01-10",
    },
    retirementImpact: {
      level: "high",
      rationale: "Distributions permanently reduce your retirement balance and are subject to taxes.",
    },
    isIrreversible: true,
    legalConfirmations: ["Required minimum distribution", "Tax withholding authorized"],
    displayName: "Dividend Credit",
    accountType: "Roth 401(k)",
  },
};

/**
 * Get transaction by ID
 */
export const getTransactionById = (id: string): Transaction | undefined => {
  return MOCK_TRANSACTIONS[id];
};
