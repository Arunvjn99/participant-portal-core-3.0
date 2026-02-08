/**
 * Withdrawal Info Agent
 *
 * A deterministic, informational-only flow for "How much can I withdraw?"
 * No financial advice, no dollar amounts, no tax/penalty calculations.
 *
 * Why withdrawals are informational-only:
 * - Exact withdrawal amounts depend on balance, plan rules, and tax situation.
 * - Providing amounts would imply advice; we only explain general rules.
 * - Users must get personalized numbers from their plan or a licensed professional.
 *
 * Why exact amounts are not shown:
 * - We do not have access to the user's balance or plan-specific limits.
 * - Tax and penalty implications vary by situation; we avoid any calculation.
 * - Fabricated or illustrative amounts could be misused as advice.
 *
 * Why numeric age input is accepted:
 * - Users naturally state their age (e.g., "62", "60") rather than "yes" or "no".
 * - Parsing numeric ages (>= 59.5 = yes, < 59.5 = no) reduces friction.
 * - Still accepts explicit "yes"/"no" for flexibility.
 *
 * Rules:
 * - Deterministic state transitions; no step skipping.
 * - No Gemini usage; pure business logic.
 * - Refuse advice requests with a fixed message.
 * - Clear, conversational language; minimal "say continue" prompts.
 */

export type WithdrawalStep =
  | 'START'
  | 'AGE_CHECK'
  | 'EMPLOYMENT_CHECK'
  | 'ELIGIBILITY_SUMMARY'
  | 'NEXT_STEPS';

export interface WithdrawalState {
  step: WithdrawalStep;
  /** Used only to tailor eligibility/rules wording; never for amounts or advice. */
  is59OrOlder?: boolean;
  isEmployed?: boolean;
}

export interface WithdrawalResponse {
  nextState: WithdrawalState;
  message: string;
  /** True when the flow has reached NEXT_STEPS (next-step options given). VoiceAssistant may clear withdrawal state. */
  isComplete?: boolean;
}

/**
 * Create initial withdrawal info state.
 */
export function createInitialWithdrawalState(): WithdrawalState {
  return { step: 'START' };
}

/**
 * Check if input looks like a request for advice (should I withdraw, recommend, etc.).
 */
function isAdviceRequest(input: string): boolean {
  const t = input.toLowerCase().trim();
  const patterns = [
    /should i (withdraw|take out|take)/i,
    /(recommend|suggest|advice|advise|better|best|worst)/i,
    /(withdraw|withdrawal) or (loan|borrow)/i,
    /(loan|borrow) or (withdraw|withdrawal)/i,
    /what (do you recommend|would you do|should i do)/i,
    /is it (better|good|bad|wise) to/i,
  ];
  return patterns.some((p) => p.test(t));
}

function matchesPattern(input: string, patterns: string[]): boolean {
  const t = input.toLowerCase().trim();
  return patterns.some((p) => t.includes(p.toLowerCase()));
}

const ADVICE_REFUSAL =
  "I can't provide financial advice. I'm only explaining general withdrawal rules. " +
  "For guidance on your situation, please talk to a licensed professional or your plan administrator. " +
  "Would you like to continue learning about withdrawal rules?";

/**
 * Process user input and return next state and message.
 * Deterministic; no step skipping; no amounts or advice.
 */
export function getWithdrawalResponse(
  state: WithdrawalState,
  userInput: string
): WithdrawalResponse {
  const input = userInput.trim();

  if (isAdviceRequest(input)) {
    return {
      nextState: state,
      message: ADVICE_REFUSAL,
    };
  }

  switch (state.step) {
    case 'START':
      return handleStart(state, input);
    case 'AGE_CHECK':
      return handleAgeCheck(state, input);
    case 'EMPLOYMENT_CHECK':
      return handleEmploymentCheck(state, input);
    case 'ELIGIBILITY_SUMMARY':
      return handleEligibilitySummary(state, input);
    case 'NEXT_STEPS':
      return handleNextSteps(state, input);
    default:
      return {
        nextState: createInitialWithdrawalState(),
        message: "Let's start over. You can ask 'How much can I withdraw?' to learn about withdrawal rules.",
      };
  }
}

const START_EXPLANATION =
  "Withdrawals from your 401(k) depend on your age and whether you're still employed with the plan sponsor. " +
  "I can walk you through the general rules—no dollar amounts or tax advice. " +
  "Ready to get started?";

function handleStart(state: WithdrawalState, input: string): WithdrawalResponse {
  const proceed = matchesPattern(input, [
    'yes', 'yeah', 'yep', 'sure', 'okay', 'ok', 'continue', 'go', 'next', 'ready', 'tell me', 'start',
  ]);
  if (proceed) {
    return {
      nextState: { ...state, step: 'AGE_CHECK' },
      message: "Are you 59½ or older? You can say your age (like '62' or '60') or 'yes' or 'no'.",
    };
  }

  return {
    nextState: state,
    message: START_EXPLANATION,
  };
}

/**
 * Parse numeric age from input (e.g., "62", "60", "59.5").
 * Returns the numeric age if found, otherwise null.
 */
function parseNumericAge(input: string): number | null {
  // Match numbers like 59, 59.5, 60, 62, etc.
  const match = input.match(/\b(\d+\.?\d*)\b/);
  if (match) {
    const age = parseFloat(match[1]);
    // Reasonable age range for 401(k) participants (18-100)
    if (age >= 18 && age <= 100) {
      return age;
    }
  }
  return null;
}

function handleAgeCheck(state: WithdrawalState, input: string): WithdrawalResponse {
  // Check for numeric age input first (e.g., "62", "60", "59.5")
  const numericAge = parseNumericAge(input);
  if (numericAge !== null) {
    const is59OrOlder = numericAge >= 59.5;
    return {
      nextState: { ...state, step: 'EMPLOYMENT_CHECK', is59OrOlder },
      message: "Got it. Are you currently employed by the company that holds this 401(k)?",
    };
  }

  // Check for explicit "yes" responses
  if (matchesPattern(input, ['yes', 'yeah', 'yep', 'sure', 'okay', 'ok', 'older', 'over', '59'])) {
    return {
      nextState: { ...state, step: 'EMPLOYMENT_CHECK', is59OrOlder: true },
      message: "Got it. Are you currently employed by the company that holds this 401(k)?",
    };
  }

  // Check for explicit "no" responses
  if (matchesPattern(input, ['no', 'nope', 'not', "don't", "can't", 'under', 'younger'])) {
    return {
      nextState: { ...state, step: 'EMPLOYMENT_CHECK', is59OrOlder: false },
      message: "Got it. Are you currently employed by the company that holds this 401(k)?",
    };
  }

  return {
    nextState: state,
    message: "I need to know if you're 59½ or older. You can say your age (like '62' or '60') or 'yes' or 'no'.",
  };
}

function handleEmploymentCheck(state: WithdrawalState, input: string): WithdrawalResponse {
  // Automatically advance to eligibility summary once employment status is determined
  if (matchesPattern(input, ['yes', 'yeah', 'yep', 'sure', 'okay', 'ok', 'employed', 'still work', 'work there', 'still employed'])) {
    const next = { ...state, step: 'ELIGIBILITY_SUMMARY' as const, isEmployed: true };
    return { nextState: next, message: getEligibilitySummary(next) };
  }
  if (matchesPattern(input, ['no', 'nope', 'not', "don't", "can't", 'left', 'retired', 'separated', 'no longer', 'not employed'])) {
    const next = { ...state, step: 'ELIGIBILITY_SUMMARY' as const, isEmployed: false };
    return { nextState: next, message: getEligibilitySummary(next) };
  }

  return {
    nextState: state,
    message: "Are you currently employed by the company that holds this 401(k)? Say 'yes' or 'no'.",
  };
}

/**
 * Generate a clear, conversational eligibility summary based on age and employment status.
 * Always presents a plain-English summary after collecting required information.
 */
function getEligibilitySummary(state: WithdrawalState): string {
  const employed = state.isEmployed ?? false;
  const age59Plus = state.is59OrOlder ?? false;

  let summary = "";

  if (age59Plus && employed) {
    summary =
      "Because you're over 59½ and still employed, your plan may allow in-service withdrawals. " +
      "The exact amount depends on your vested balance and plan rules. " +
      "I can't give you specific dollar amounts, but your plan administrator can tell you how much you're eligible to withdraw.";
  } else if (age59Plus && !employed) {
    summary =
      "Because you're over 59½ and no longer employed, you generally have more flexibility with withdrawals. " +
      "The exact amount depends on your vested balance and plan rules. " +
      "I can't give you specific dollar amounts, but your plan administrator can tell you how much you're eligible to withdraw.";
  } else if (!age59Plus && employed) {
    summary =
      "Because you're under 59½ and still employed, plan rules often limit withdrawals to specific situations like hardship. " +
      "The exact amount depends on your vested balance and plan rules. " +
      "I can't give you specific dollar amounts, but your plan administrator can tell you what options are available.";
  } else {
    // !age59Plus && !employed
    summary =
      "Because you're under 59½ and no longer employed, different withdrawal options may apply depending on your plan. " +
      "The exact amount depends on your vested balance and plan rules. " +
      "I can't give you specific dollar amounts, but your plan administrator can tell you what options are available.";
  }

  // Add general context about penalties/taxes (informational only, no calculations)
  summary +=
    " Keep in mind that withdrawals before 59½ may be subject to taxes and an early-withdrawal penalty, " +
    "while withdrawals after 59½ typically avoid the penalty (taxes still apply). " +
    "Your plan administrator can provide details about your specific situation.";

  return summary;
}

/**
 * Handle eligibility summary step. After showing the summary, automatically advance to next steps.
 * User can acknowledge or ask questions, but we proceed regardless to keep the flow moving.
 */
function handleEligibilitySummary(state: WithdrawalState, input: string): WithdrawalResponse {
  // Automatically advance to next steps after showing summary
  // Accept any input (acknowledgment, questions, etc.) and proceed
  return {
    nextState: { ...state, step: 'NEXT_STEPS' },
    message: getNextStepsMessage(),
    isComplete: true,
  };
}

function getNextStepsMessage(): string {
  return (
    "Here are some next steps you can take: " +
    "Ask 'I want to apply for a loan' to explore a 401(k) loan. " +
    "Ask about rollovers if you've left your job. " +
    "You can also check your dashboard for your balance and plan-specific tools. " +
    "For exact amounts or advice, contact your plan administrator or a licensed professional."
  );
}

function handleNextSteps(state: WithdrawalState, input: string): WithdrawalResponse {
  if (matchesPattern(input, ['restart', 'again', 'start over', 'over', 'reset'])) {
    return {
      nextState: createInitialWithdrawalState(),
      message:
        "You can ask 'How much can I withdraw?' again to learn about withdrawal rules, or try 'I want to apply for a loan' or 'rollover'.",
    };
  }

  // Flow is complete; return helpful message
  return {
    nextState: state,
    message:
      "You can ask 'I want to apply for a loan,' 'rollover,' or go to your dashboard. " +
      "For specific amounts or advice, contact your plan administrator or a licensed professional.",
  };
}
