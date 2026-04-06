export type TransactionType = "loan" | "withdraw" | "transfer" | "rollover";

export const FLOW_STEP_LABELS: Record<TransactionType, string[]> = {
  loan: ["Eligibility", "Simulator", "Configuration", "Fees", "Documents", "Review", "Confirmation"],
  withdraw: ["Eligibility", "Type", "Source", "Fees", "Payment", "Review", "Confirmation"],
  transfer: ["Type", "Source", "Amount", "Destination", "Impact", "Review", "Confirmation"],
  rollover: ["Plan Details", "Validation", "Documents", "Allocation", "Review", "Confirmation"],
};

export type LoanData = {
  amount: number;
  term: number;
  loanType: "general" | "residential" | "refinance";
  reason: string;
  disbursementMethod: "eft" | "check";
  repaymentFrequency: "weekly" | "biweekly" | "monthly";
  repaymentMethod: "payroll" | "ach" | "manual";
  monthlyPayment: number;
  totalInterest: number;
  totalPayback: number;
  interestRate: number;
  documentsComplete: boolean;
};

export type WithdrawData = {
  amount: number;
  withdrawalType: "hardship" | "in-service" | "termination" | "rmd" | "one-time" | "full-balance";
  paymentMethod: "ach" | "check";
  taxWithholding: number;
  netAmount: number;
  fees: number;
  sources: Record<string, number>;
};

export type TransferData = {
  transferType: "existing" | "future";
  fromFund: string;
  toFund: string;
  amount: number;
  percentage: number;
  mode: "dollar" | "percent";
};

export type RolloverData = {
  previousEmployer: string;
  planAdministrator: string;
  accountNumber: string;
  estimatedAmount: number;
  rolloverType: "traditional" | "roth" | "ira";
  allocationMethod: "match" | "target" | "custom";
  documentsComplete: boolean;
};

export type TransactionFlowData = {
  loan: Partial<LoanData>;
  withdraw: Partial<WithdrawData>;
  transfer: Partial<TransferData>;
  rollover: Partial<RolloverData>;
};

export type DraftTransaction = {
  id: string;
  type: TransactionType;
  step: number;
  data: Partial<TransactionFlowData[TransactionType]>;
  updatedAt: string;
  label: string;
  progress: number;
};

export type RecentTransaction = {
  id: string;
  type: TransactionType | "rebalance";
  description: string;
  amount: string;
  status: "completed" | "processing" | "cancelled";
  date: string;
};

export type AttentionItem = {
  id: string;
  title: string;
  amount: string;
  status: "pending" | "action-required" | "expiring";
  statusLabel: string;
  description: string;
};

export type PlanSummary = {
  planName: string;
  balance: number;
  vestedBalance: number;
  vestedPct: number;
  accountNumber: string;
};

export const MOCK_PLAN: PlanSummary = {
  planName: "401(k) Retirement Plan",
  balance: 30_000,
  vestedBalance: 25_000,
  vestedPct: 83.3,
  accountNumber: "****4821",
};

export const MOCK_ATTENTION: AttentionItem[] = [
  {
    id: "att-1",
    title: "Required Minimum Distribution",
    amount: "$1,125",
    status: "action-required",
    statusLabel: "Action Required",
    description: "RMD deadline approaching — distribute by Dec 31",
  },
  {
    id: "att-2",
    title: "Loan Repayment Overdue",
    amount: "$203",
    status: "pending",
    statusLabel: "Overdue",
    description: "Monthly payment was due on Mar 15",
  },
];

export const MOCK_RECENT: RecentTransaction[] = [
  { id: "txn-001", type: "loan", description: "General Purpose Loan", amount: "$5,000", status: "completed", date: "2026-02-15" },
  { id: "txn-002", type: "withdraw", description: "Hardship Withdrawal", amount: "$2,500", status: "processing", date: "2026-03-01" },
  { id: "txn-003", type: "rollover", description: "Rollover from Acme Corp", amount: "$48,500", status: "completed", date: "2026-01-20" },
  { id: "txn-004", type: "transfer", description: "Fund Rebalance", amount: "$4,200", status: "completed", date: "2026-03-10" },
  { id: "txn-005", type: "withdraw", description: "In-Service Withdrawal", amount: "$1,000", status: "cancelled", date: "2025-12-05" },
];

export const LOAN_CONFIG = {
  maxAmount: 10_000,
  minAmount: 1_000,
  maxTerm: 5,
  minTerm: 1,
  interestRate: 0.08,
  originationFee: 50,
  processingFee: 25,
  recordkeepingFee: 10,
  checkFee: 15,
} as const;

export const WITHDRAW_CONFIG = {
  availableAmount: 5_000,
  vestedBalance: 25_000,
  federalWithholding: 0.2,
  stateWithholding: 0.05,
  earlyPenalty: 0.1,
  processingFee: 25,
} as const;

export const WITHDRAW_SOURCES = [
  { id: "pretax", label: "Pre-Tax Contributions", sublabel: "Traditional 401(k) deferrals", max: 3_500, taxNote: "Subject to ordinary income tax" },
  { id: "roth", label: "Roth Contributions", sublabel: "After-tax Roth 401(k) deferrals", max: 1_200, taxNote: "Tax-free if qualified" },
  { id: "employer", label: "Employer Contributions", sublabel: "Matching and profit sharing", max: 2_000, taxNote: "Subject to ordinary income tax" },
  { id: "aftertax", label: "After-Tax Contributions", sublabel: "Non-Roth after-tax deferrals", max: 800, taxNote: "Only earnings are taxable" },
] as const;

export const TRANSFER_FUNDS = [
  { id: "stable-value", name: "Stable Value Fund", balance: 12_400, pct: 18, color: "bg-blue-500" },
  { id: "target-2055", name: "Target Date 2055", balance: 48_200, pct: 55, color: "bg-violet-500" },
  { id: "sp500-index", name: "S&P 500 Index", balance: 23_400, pct: 27, color: "bg-emerald-500" },
] as const;

export const TRANSFER_DEST_FUNDS = [
  { id: "target-2055", name: "Target Date 2055", desc: "Diversified fund aligned to 2055 retirement", color: "bg-violet-500" },
  { id: "sp500-index", name: "S&P 500 Index", desc: "Broad U.S. large-cap equity exposure", color: "bg-emerald-500" },
  { id: "intl-equity", name: "International Equity", desc: "Diversified international stock exposure", color: "bg-amber-500" },
  { id: "bond-index", name: "Bond Index", desc: "U.S. investment-grade bond exposure", color: "bg-cyan-500" },
] as const;
