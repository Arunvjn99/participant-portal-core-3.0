export type AttentionAlert = {
  id: string;
  title: string;
  amount: string;
  message: string;
};

export type DraftTransaction = {
  id: string;
  title: string;
  progressPct: number;
};

export const MOCK_ATTENTION_ALERTS: AttentionAlert[] = [
  {
    id: "att-1",
    title: "Loan request — documents needed",
    amount: "$5,000",
    message: "Upload proof of employment and recent pay stubs to continue processing.",
  },
  {
    id: "att-2",
    title: "Bank verification pending",
    amount: "—",
    message: "Verify the account ending in 1234 to enable EFT disbursement for your withdrawal.",
  },
  {
    id: "att-3",
    title: "Rollover check deposited",
    amount: "$12,400",
    message: "Funds are being allocated to your target funds; expect completion in 2–3 business days.",
  },
  {
    id: "att-4",
    title: "Rebalance confirmation",
    amount: "—",
    message: "Confirm your new allocation before the next trade window closes.",
  },
];

export const MOCK_DRAFT_TRANSACTIONS: DraftTransaction[] = [
  {
    id: "dr-1",
    title: "Hardship withdrawal",
    progressPct: 35,
  },
  {
    id: "dr-2",
    title: "In-plan Roth conversion",
    progressPct: 60,
  },
];

export const MOCK_PLAN_SUMMARY = {
  planName: "401(k) Retirement Plan",
  planBalance: 30_000,
  vestedBalance: 25_000,
  vestedPct: "83.3%",
};
