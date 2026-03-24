export type ScenarioType = "navigation" | "action" | "ai";

export interface SearchScenario {
  id: string;
  keywords: string[];
  queries: string[];
  type: ScenarioType;
  /** Shown in command palette subtitle */
  subtitle?: string;
  route?: string;
  action?: string;
  /** Short deterministic answer for inline / toast UX (paired with type "ai"). */
  quickAnswer?: string;
}

/**
 * Scripted search / command palette / hero typeahead — 75 participant-life scenarios.
 * Routes: `/enrollment` and `/transactions` are versioned at execution via `withVersionIfEnrollment`.
 */
export const SEARCH_SCENARIOS: SearchScenario[] = [
  // ─── Enrollment (10) ───
  {
    id: "start_enrollment",
    keywords: ["enroll", "start enrollment", "sign up", "join plan", "401k enrollment"],
    queries: ["Start enrollment", "How to enroll?", "Begin my 401k"],
    subtitle: "Enrollment",
    type: "navigation",
    route: "/enrollment",
  },
  {
    id: "enrollment_status",
    keywords: ["enrollment status", "am i enrolled", "already enrolled"],
    queries: ["Check enrollment status", "Am I enrolled?"],
    subtitle: "Enrollment",
    type: "navigation",
    route: "/enrollment",
  },
  {
    id: "enrollment_time",
    keywords: ["how long enrollment", "enrollment take"],
    queries: ["How long does enrollment take?"],
    subtitle: "Quick answer",
    type: "ai",
    quickAnswer:
      "Enrollment usually takes about 5–15 minutes if you have your personal and beneficiary information ready.",
  },
  {
    id: "mandatory_enrollment",
    keywords: ["mandatory enrollment", "required to enroll"],
    queries: ["Is enrollment mandatory?"],
    subtitle: "Quick answer",
    type: "ai",
    quickAnswer:
      "Rules vary by employer. Some plans auto-enroll or require participation; check your summary plan description or HR.",
  },
  {
    id: "auto_enrollment",
    keywords: ["auto enroll", "automatic enrollment"],
    queries: ["Am I automatically enrolled?"],
    subtitle: "Quick answer",
    type: "ai",
    quickAnswer:
      "Many employers auto-enroll new hires at a default deferral unless you opt out. Confirm in your plan materials.",
  },
  {
    id: "resume_enrollment",
    keywords: ["continue enrollment", "resume enrollment", "finish enrollment"],
    queries: ["Continue enrollment", "Resume where I left off"],
    subtitle: "Enrollment",
    type: "navigation",
    route: "/enrollment",
  },
  {
    id: "choose_plan_help",
    keywords: ["choose plan", "which plan", "roth or traditional"],
    queries: ["Help me choose a plan", "Roth vs traditional 401k?"],
    subtitle: "Ask Core AI",
    type: "ai",
  },
  {
    id: "enrollment_deadline",
    keywords: ["deadline", "enroll by"],
    queries: ["When is the enrollment deadline?"],
    subtitle: "Quick answer",
    type: "ai",
    quickAnswer: "Deadlines depend on your employer and plan year. Ask HR or check your plan’s enrollment materials.",
  },
  {
    id: "beneficiary_enrollment",
    keywords: ["beneficiary enrollment", "name beneficiary"],
    queries: ["Add beneficiary during enrollment"],
    subtitle: "Profile",
    type: "navigation",
    route: "/profile",
  },
  {
    id: "enrollment_investments",
    keywords: ["pick investments enrollment", "investment election"],
    queries: ["Choose investments in enrollment"],
    subtitle: "Enrollment",
    type: "navigation",
    route: "/enrollment/investments",
  },

  // ─── Contribution (12) ───
  {
    id: "increase_contribution",
    keywords: ["increase contribution", "raise deferral", "save more paycheck"],
    queries: ["Increase contribution", "Change contribution percentage"],
    subtitle: "Contributions",
    type: "action",
    action: "OPEN_CONTRIBUTION_FLOW",
  },
  {
    id: "contribution_limit",
    keywords: ["contribution limit", "401k limit", "irs limit", "max deferral"],
    queries: ["Contribution limit", "Max 401k contribution"],
    subtitle: "Quick answer",
    type: "ai",
    quickAnswer:
      "IRS sets annual elective deferral limits and catch-up amounts for 50+. Your plan may also impose limits—check your plan summary.",
  },
  {
    id: "recommended_contribution",
    keywords: ["how much contribute", "how much should i save"],
    queries: ["How much should I contribute?"],
    subtitle: "Ask Core AI",
    type: "ai",
  },
  {
    id: "employer_match",
    keywords: ["employer match", "company match", "free money"],
    queries: ["Does my employer match?", "Explain employer match"],
    subtitle: "Quick answer",
    type: "ai",
    quickAnswer:
      "Many plans match a portion of your contributions (e.g. 50% up to 6% of pay). Match formulas vary—see your plan document.",
  },
  {
    id: "stop_contribution",
    keywords: ["stop contribution", "pause contribution", "reduce to zero"],
    queries: ["Stop my contributions", "Pause deferrals"],
    subtitle: "Contributions",
    type: "action",
    action: "OPEN_CONTRIBUTION_FLOW",
  },
  {
    id: "edit_contribution",
    keywords: ["edit contribution", "change deferral amount"],
    queries: ["Edit contribution amount"],
    subtitle: "Contributions",
    type: "action",
    action: "OPEN_CONTRIBUTION_FLOW",
  },
  {
    id: "contribution_frequency",
    keywords: ["payroll deduction", "how often contributed"],
    queries: ["How often are contributions taken?"],
    subtitle: "Quick answer",
    type: "ai",
    quickAnswer: "Most plans deduct retirement contributions each pay period through payroll.",
  },
  {
    id: "pre_tax_vs_roth",
    keywords: ["roth 401k", "pre-tax vs roth", "traditional vs roth"],
    queries: ["Roth vs traditional", "Pre-tax vs Roth"],
    subtitle: "Quick answer",
    type: "ai",
    quickAnswer:
      "Traditional deferrals reduce taxable income now; Roth is taxed now and qualified withdrawals may be tax-free later. Your situation determines which fits best.",
  },
  {
    id: "catch_up_contributions",
    keywords: ["catch-up", "age 50", "over 50 contribution"],
    queries: ["Catch-up contributions"],
    subtitle: "Quick answer",
    type: "ai",
    quickAnswer:
      "Participants 50+ may contribute extra above the normal deferral limit—see current IRS catch-up limits for the year.",
  },
  {
    id: "auto_increase",
    keywords: ["auto increase", "automatic escalation", "annual increase"],
    queries: ["Turn on automatic contribution increases"],
    subtitle: "Enrollment",
    type: "navigation",
    route: "/enrollment/auto-increase",
  },
  {
    id: "payroll_dates",
    keywords: ["when contribution hits", "contribution effective date"],
    queries: ["When do my contributions invest?"],
    subtitle: "Quick answer",
    type: "ai",
    quickAnswer:
      "Payroll contributions are usually invested shortly after each pay date per your plan’s trading schedule.",
  },
  {
    id: "after_tax_contribution",
    keywords: ["after tax", "mega backdoor"],
    queries: ["After-tax contributions"],
    subtitle: "Ask Core AI",
    type: "ai",
  },

  // ─── Loans (8) ───
  {
    id: "apply_loan",
    keywords: ["loan", "apply loan", "borrow", "401k loan"],
    queries: ["Apply for a loan", "How to take a 401k loan"],
    subtitle: "Loans",
    type: "action",
    action: "OPEN_LOAN_FLOW",
  },
  {
    id: "loan_eligibility",
    keywords: ["loan eligibility", "can i borrow"],
    queries: ["Am I eligible for a loan?"],
    subtitle: "Quick answer",
    type: "ai",
    quickAnswer:
      "Eligibility usually depends on vested balance, outstanding loans, and plan rules—not all plans allow loans.",
  },
  {
    id: "loan_limit",
    keywords: ["loan limit", "maximum loan", "how much borrow"],
    queries: ["How much can I borrow from my 401k?"],
    subtitle: "Quick answer",
    type: "ai",
    quickAnswer:
      "IRS rules cap loans (often the lesser of 50% of your vested balance or $50,000, reduced by other loans). Your plan may be stricter.",
  },
  {
    id: "loan_interest",
    keywords: ["loan interest rate", "401k loan rate"],
    queries: ["What is my loan interest rate?"],
    subtitle: "Quick answer",
    type: "ai",
    quickAnswer: "Rates are set by the plan (often prime-based). You pay interest to your own account, not a bank.",
  },
  {
    id: "loan_repayment",
    keywords: ["loan repayment", "pay back loan", "loan payroll"],
    queries: ["How do I repay my loan?"],
    subtitle: "Quick answer",
    type: "ai",
    quickAnswer: "Repayment is typically through payroll deductions over a term allowed by your plan (often up to 5 years for general loans).",
  },
  {
    id: "loan_status",
    keywords: ["loan status", "outstanding loan", "loan balance"],
    queries: ["Check my loan status", "Loan balance"],
    subtitle: "Loans",
    type: "navigation",
    route: "/transactions/loan",
  },
  {
    id: "loan_default",
    keywords: ["default on loan", "miss loan payment"],
    queries: ["What if I default on my 401k loan?"],
    subtitle: "Ask Core AI",
    type: "ai",
  },
  {
    id: "multiple_loans",
    keywords: ["second loan", "multiple loans"],
    queries: ["Can I have more than one loan?"],
    subtitle: "Quick answer",
    type: "ai",
    quickAnswer: "Some plans allow multiple loans; others limit you to one at a time. Check your plan’s loan policy.",
  },

  // ─── Withdrawals & distributions (10) ───
  {
    id: "withdraw_money",
    keywords: ["withdraw", "take money out", "distribution"],
    queries: ["Withdraw money", "Take a withdrawal"],
    subtitle: "Withdrawals",
    type: "action",
    action: "OPEN_WITHDRAWAL_FLOW",
  },
  {
    id: "withdrawal_rules",
    keywords: ["withdrawal rules", "when can i withdraw"],
    queries: ["Withdrawal rules"],
    subtitle: "Ask Core AI",
    type: "ai",
  },
  {
    id: "early_penalty",
    keywords: ["early withdrawal", "penalty 59", "59 and a half"],
    queries: ["Early withdrawal penalty"],
    subtitle: "Quick answer",
    type: "ai",
    quickAnswer:
      "Taking taxable distributions before age 59½ often triggers a 10% federal additional tax, with exceptions (hardship, separation, etc.).",
  },
  {
    id: "withdrawal_tax",
    keywords: ["tax on withdrawal", "withholding"],
    queries: ["Tax on withdrawal"],
    subtitle: "Quick answer",
    type: "ai",
    quickAnswer:
      "Traditional balances are generally taxable when distributed; Roth may be tax-free if qualified. Mandatory withholding often applies.",
  },
  {
    id: "withdrawal_status",
    keywords: ["withdrawal status", "distribution pending"],
    queries: ["Check withdrawal status"],
    subtitle: "Transactions",
    type: "navigation",
    route: "/transactions",
  },
  {
    id: "full_withdrawal",
    keywords: ["close account", "cash out entire", "lump sum"],
    queries: ["Withdraw my full balance", "Cash out 401k"],
    subtitle: "Withdrawals",
    type: "action",
    action: "OPEN_WITHDRAWAL_FLOW",
  },
  {
    id: "withdrawal_time",
    keywords: ["how long withdrawal", "processing time withdrawal"],
    queries: ["How long does a withdrawal take?"],
    subtitle: "Quick answer",
    type: "ai",
    quickAnswer: "Many plans process within several business days after approval; timing varies by payment method and custodian.",
  },
  {
    id: "hardship_withdrawal",
    keywords: ["hardship", "emergency withdrawal"],
    queries: ["Hardship withdrawal"],
    subtitle: "Ask Core AI",
    type: "ai",
  },
  {
    id: "required_minimum",
    keywords: ["rmd", "required minimum distribution"],
    queries: ["Required minimum distribution"],
    subtitle: "Ask Core AI",
    type: "ai",
  },
  {
    id: "in_service_withdrawal",
    keywords: ["in-service", "while employed"],
    queries: ["Can I withdraw while still working?"],
    subtitle: "Ask Core AI",
    type: "ai",
  },

  // ─── Investments & portfolio (10) ───
  {
    id: "view_portfolio",
    keywords: ["portfolio", "my investments", "holdings"],
    queries: ["View my portfolio", "See my investments"],
    subtitle: "Investments",
    type: "navigation",
    route: "/dashboard/investment-portfolio",
  },
  {
    id: "change_investments",
    keywords: ["change investments", "switch funds", "reallocate"],
    queries: ["Change my investments"],
    subtitle: "Investments",
    type: "navigation",
    route: "/dashboard/investment-portfolio",
  },
  {
    id: "fund_performance",
    keywords: ["fund performance", "returns", "performance ytd"],
    queries: ["Fund performance", "How are my funds doing?"],
    subtitle: "Investments",
    type: "navigation",
    route: "/investments",
  },
  {
    id: "risk_level",
    keywords: ["risk tolerance", "how risky", "aggressive conservative"],
    queries: ["What is my risk level?"],
    subtitle: "Ask Core AI",
    type: "ai",
  },
  {
    id: "rebalance",
    keywords: ["rebalance", "rebalancing"],
    queries: ["Rebalance my portfolio"],
    subtitle: "Rebalance",
    type: "action",
    action: "OPEN_REBALANCE_FLOW",
  },
  {
    id: "target_date_funds",
    keywords: ["target date", "lifecycle fund"],
    queries: ["What are target date funds?"],
    subtitle: "Quick answer",
    type: "ai",
    quickAnswer:
      "Target-date funds gradually shift from stocks to bonds as the target retirement year approaches—one-stop diversification, not personalized advice.",
  },
  {
    id: "investment_options",
    keywords: ["fund lineup", "investment options", "available funds"],
    queries: ["What funds can I choose?"],
    subtitle: "Investments",
    type: "navigation",
    route: "/investments",
  },
  {
    id: "expense_ratio",
    keywords: ["expense ratio", "fund fees"],
    queries: ["What are fund fees?"],
    subtitle: "Ask Core AI",
    type: "ai",
  },
  {
    id: "diversification",
    keywords: ["diversified", "too much stock"],
    queries: ["Am I diversified enough?"],
    subtitle: "Ask Core AI",
    type: "ai",
  },
  {
    id: "company_stock",
    keywords: ["employer stock", "company stock fund"],
    queries: ["Employer stock in my 401k"],
    subtitle: "Ask Core AI",
    type: "ai",
  },

  // ─── Transfers & rollover (6) ───
  {
    id: "transfer_money",
    keywords: ["transfer between accounts", "move money plan"],
    queries: ["Transfer between accounts"],
    subtitle: "Transfer",
    type: "action",
    action: "OPEN_TRANSFER_FLOW",
  },
  {
    id: "rollover_in",
    keywords: ["rollover in", "roll old 401k"],
    queries: ["Roll over an old 401k"],
    subtitle: "Rollover",
    type: "action",
    action: "OPEN_ROLLOVER_FLOW",
  },
  {
    id: "rollover_out",
    keywords: ["rollover out", "leave employer", "new job"],
    queries: ["Roll my balance to an IRA"],
    subtitle: "Ask Core AI",
    type: "ai",
  },
  {
    id: "direct_rollover",
    keywords: ["direct rollover", "trustee to trustee"],
    queries: ["What is a direct rollover?"],
    subtitle: "Quick answer",
    type: "ai",
    quickAnswer:
      "A direct rollover sends funds straight to another retirement account, often avoiding mandatory withholding that applies to some distributions.",
  },
  {
    id: "transaction_history",
    keywords: ["history", "past transactions", "activity"],
    queries: ["Transaction history"],
    subtitle: "Transactions",
    type: "navigation",
    route: "/transactions",
  },
  {
    id: "pending_transaction",
    keywords: ["pending trade", "trade status"],
    queries: ["Pending transactions"],
    subtitle: "Transactions",
    type: "navigation",
    route: "/transactions",
  },

  // ─── Account, statements, profile (10) ───
  {
    id: "view_balance",
    keywords: ["balance", "account balance", "how much saved"],
    queries: ["Check my balance", "View account balance"],
    subtitle: "Dashboard",
    type: "navigation",
    route: "/dashboard",
  },
  {
    id: "vested_balance",
    keywords: ["vested", "vesting", "vested balance"],
    queries: ["What is my vested balance?"],
    subtitle: "Ask Core AI",
    type: "ai",
  },
  {
    id: "transactions_hub",
    keywords: ["transactions", "loans transfers"],
    queries: ["Transactions", "Money in and out"],
    subtitle: "Transactions",
    type: "navigation",
    route: "/transactions",
  },
  {
    id: "update_profile",
    keywords: ["profile", "update address", "personal info"],
    queries: ["Update my profile"],
    subtitle: "Profile",
    type: "navigation",
    route: "/profile",
  },
  {
    id: "beneficiaries",
    keywords: ["beneficiary", "beneficiaries"],
    queries: ["Update beneficiaries", "Add beneficiary"],
    subtitle: "Profile",
    type: "navigation",
    route: "/profile",
  },
  {
    id: "download_statement",
    keywords: ["statement", "quarterly statement", "download pdf"],
    queries: ["Download statement", "Account statement"],
    subtitle: "Ask Core AI",
    type: "ai",
  },
  {
    id: "contact_support",
    keywords: ["help", "support", "contact"],
    queries: ["Contact support", "Get help"],
    subtitle: "Help",
    type: "navigation",
    route: "/help",
  },
  {
    id: "settings_hub",
    keywords: ["settings", "preferences", "notifications"],
    queries: ["Open settings"],
    subtitle: "Settings",
    type: "navigation",
    route: "/settings",
  },
  {
    id: "change_password",
    keywords: ["password", "reset login"],
    queries: ["Change password"],
    subtitle: "Settings",
    type: "navigation",
    route: "/settings",
  },
  {
    id: "two_factor",
    keywords: ["two factor", "2fa", "mfa"],
    queries: ["Two-factor authentication"],
    subtitle: "Settings",
    type: "navigation",
    route: "/settings",
  },

  // ─── Retirement planning & life stages (9) ───
  {
    id: "retirement_readiness",
    keywords: ["retirement readiness", "on track", "replace income"],
    queries: ["Am I on track for retirement?"],
    subtitle: "Ask Core AI",
    type: "ai",
  },
  {
    id: "social_security",
    keywords: ["social security", "ssa"],
    queries: ["How does Social Security fit in?"],
    subtitle: "Ask Core AI",
    type: "ai",
  },
  {
    id: "part_time_retirement",
    keywords: ["semi retire", "phased retirement"],
    queries: ["Phased retirement options"],
    subtitle: "Ask Core AI",
    type: "ai",
  },
  {
    id: "job_change",
    keywords: ["new job", "left employer", "quit job"],
    queries: ["I changed jobs—what about my 401k?"],
    subtitle: "Ask Core AI",
    type: "ai",
  },
  {
    id: "divorce_qdro",
    keywords: ["divorce", "qdro"],
    queries: ["401k and divorce"],
    subtitle: "Ask Core AI",
    type: "ai",
  },
  {
    id: "leave_of_absence",
    keywords: ["leave of absence", "fmla", "unpaid leave"],
    queries: ["Leave of absence and contributions"],
    subtitle: "Ask Core AI",
    type: "ai",
  },
  {
    id: "compare_roth_ira",
    keywords: ["roth ira vs 401k"],
    queries: ["Roth IRA vs Roth 401k"],
    subtitle: "Ask Core AI",
    type: "ai",
  },
  {
    id: "fees_plan",
    keywords: ["plan fees", "administrative fees"],
    queries: ["What fees does my plan charge?"],
    subtitle: "Ask Core AI",
    type: "ai",
  },
  {
    id: "fiduciary_advice",
    keywords: ["advisor", "financial advisor", "personalized advice"],
    queries: ["Do I get financial advice?"],
    subtitle: "Quick answer",
    type: "ai",
    quickAnswer:
      "Plans may offer education, tools, or optional advisory services. Personalized advice may cost extra—check your plan’s service menu.",
  },
];

export function getScenarioById(id: string): SearchScenario | undefined {
  return SEARCH_SCENARIOS.find((s) => s.id === id);
}
