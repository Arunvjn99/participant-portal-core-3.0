export interface HubFinancialData {
  maxLoanEligible: number;
  projectedBalance: number;
  avgReturnRate: number;
  yearsToRetirement: number;
  currentContributionRate: number;
  annualSalary: number;
  federalTaxRate: number;
  stateTaxRate: number;
  earlyWithdrawalPenalty: number;
  portfolioDriftPercent: number;
  currentAllocation: { stocks: number; bonds: number; cash: number; other: number };
  targetAllocation: { stocks: number; bonds: number; cash: number; other: number };
  riskScore: number;
  sparklineData: number[];
  activeTransactions: ActiveTransaction[];
  transactionHistory: HistoryTransaction[];
}

export interface ActiveTransaction {
  id: string;
  type: string;
  displayName: string;
  status: "draft" | "pending" | "processing" | "completed" | "cancelled";
  amount: number;
  dateInitiated: string;
  eta: string;
  currentStep: number;
  totalSteps: number;
  requiredDocuments: string[];
}

export interface HistoryTransaction {
  id: string;
  date: string;
  type: string;
  amount: number;
  taxImpact: number;
  status: "completed" | "cancelled";
  planId: string;
}

export const MOCK_HUB_DATA: HubFinancialData = {
  maxLoanEligible: 50000,
  projectedBalance: 485000,
  avgReturnRate: 0.07,
  yearsToRetirement: 22,
  currentContributionRate: 8,
  annualSalary: 95000,
  federalTaxRate: 0.22,
  stateTaxRate: 0.05,
  earlyWithdrawalPenalty: 0.10,
  portfolioDriftPercent: 4.2,
  currentAllocation: {
    stocks: 68,
    bonds: 22,
    cash: 7,
    other: 3,
  },
  targetAllocation: {
    stocks: 60,
    bonds: 30,
    cash: 5,
    other: 5,
  },
  riskScore: 72,
  sparklineData: [
    420000, 425000, 432000, 438000, 442000, 448000, 453000, 460000, 465000, 472000, 478000, 485000,
  ],
  activeTransactions: [
    {
      id: "txn-001",
      type: "loan",
      displayName: "401(k) Loan Application",
      status: "processing",
      amount: 25000,
      dateInitiated: "2026-01-15",
      eta: "2026-02-05",
      currentStep: 2,
      totalSteps: 4,
      requiredDocuments: ["Loan Application Form", "Income Verification"],
    },
    {
      id: "txn-002",
      type: "withdrawal",
      displayName: "Hardship Withdrawal Request",
      status: "pending",
      amount: 15000,
      dateInitiated: "2026-02-10",
      eta: "2026-02-28",
      currentStep: 1,
      totalSteps: 3,
      requiredDocuments: ["Hardship Declaration", "Supporting Documentation"],
    },
    {
      id: "txn-003",
      type: "rollover",
      displayName: "IRA Rollover",
      status: "draft",
      amount: 35000,
      dateInitiated: "2026-02-20",
      eta: "2026-03-15",
      currentStep: 0,
      totalSteps: 5,
      requiredDocuments: ["Rollover Form", "Account Statements"],
    },
  ],
  transactionHistory: [
    {
      id: "hist-001",
      date: "2024-03-15",
      type: "loan",
      amount: 20000,
      taxImpact: 0,
      status: "completed",
      planId: "plan-401k-001",
    },
    {
      id: "hist-002",
      date: "2024-06-22",
      type: "withdrawal",
      amount: 12000,
      taxImpact: 3240,
      status: "completed",
      planId: "plan-401k-001",
    },
    {
      id: "hist-003",
      date: "2024-09-10",
      type: "rollover",
      amount: 45000,
      taxImpact: 0,
      status: "completed",
      planId: "plan-401k-001",
    },
    {
      id: "hist-004",
      date: "2024-11-05",
      type: "distribution",
      amount: 8000,
      taxImpact: 2160,
      status: "completed",
      planId: "plan-401k-001",
    },
    {
      id: "hist-005",
      date: "2025-02-18",
      type: "rebalance",
      amount: 0,
      taxImpact: 0,
      status: "completed",
      planId: "plan-401k-001",
    },
    {
      id: "hist-006",
      date: "2025-05-30",
      type: "loan",
      amount: 15000,
      taxImpact: 0,
      status: "completed",
      planId: "plan-401k-001",
    },
    {
      id: "hist-007",
      date: "2025-08-12",
      type: "withdrawal",
      amount: 10000,
      taxImpact: 2700,
      status: "completed",
      planId: "plan-401k-001",
    },
    {
      id: "hist-008",
      date: "2025-12-01",
      type: "rollover",
      amount: 28000,
      taxImpact: 0,
      status: "completed",
      planId: "plan-401k-001",
    },
  ],
};
