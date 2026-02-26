/**
 * Intent resolver — lightweight keyword-based classification for Core AI.
 * Maps user message to one of the data-backed intents or general_retirement_knowledge.
 */

export const INTENTS = [
  "balance_query",
  "loan_query",
  "withdrawal_query",
  "contribution_query",
  "enrollment_status",
  "plan_rules_query",
  "transaction_history",
  "general_retirement_knowledge",
];

const PATTERNS = [
  {
    intent: "balance_query",
    keywords: [
      "balance",
      "how much",
      "total balance",
      "account value",
      "vested balance",
      "vested",
      "current balance",
      "my balance",
      "account total",
    ],
  },
  {
    intent: "loan_query",
    keywords: [
      "loan",
      "borrow",
      "borrow from",
      "401k loan",
      "plan loan",
      "take a loan",
      "loan amount",
      "eligible for loan",
      "loan limit",
    ],
  },
  {
    intent: "withdrawal_query",
    keywords: [
      "withdraw",
      "withdrawal",
      "withdraw money",
      "cash out",
      "take money out",
      "hardship",
      "distribution",
      "early withdrawal",
    ],
  },
  {
    intent: "contribution_query",
    keywords: [
      "contribution",
      "contribute",
      "contributing",
      "contribution rate",
      "percent",
      "paycheck",
      "salary deferral",
      "how much to contribute",
      "change contribution",
    ],
  },
  {
    intent: "enrollment_status",
    keywords: [
      "enrolled",
      "enrollment",
      "enroll",
      "enrollment status",
      "am i enrolled",
      "signed up",
      "join the plan",
      "start enrollment",
    ],
  },
  {
    intent: "plan_rules_query",
    keywords: [
      "plan rules",
      "match",
      "employer match",
      "vesting",
      "vesting schedule",
      "match percentage",
      "match limit",
      "loan allowed",
      "max loan",
      "plan details",
      "rules",
    ],
  },
  {
    intent: "transaction_history",
    keywords: [
      "transaction",
      "transactions",
      "history",
      "recent",
      "activity",
      "statement",
      "contributions history",
      "payment history",
    ],
  },
];

/**
 * Detect intent from user message. Returns one of INTENTS or "general_retirement_knowledge".
 * @param {string} message - User question
 * @returns {string} intent
 */
export function resolveIntent(message) {
  if (!message || typeof message !== "string") return "general_retirement_knowledge";
  const lower = message.trim().toLowerCase();
  if (lower.length === 0) return "general_retirement_knowledge";

  for (const { intent, keywords } of PATTERNS) {
    if (keywords.some((k) => lower.includes(k))) return intent;
  }

  return "general_retirement_knowledge";
}
