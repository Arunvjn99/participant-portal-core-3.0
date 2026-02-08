import {
  calculateMaxLoan,
  calculateLoanTerms,
  validateLoanAmount,
  validateLoanTerm,
  LOAN_MIN_AMOUNT,
  DEFAULT_LOAN_ANNUAL_RATE,
} from "../lib/loanCalculator";

/**
 * Loan Application Agent
 * 
 * A deterministic, state-driven loan application flow for Voice Assistant.
 * This is NOT a free chat - it follows a strict workflow with state transitions.
 * 
 * Why loan flows must be deterministic:
 * - Financial transactions require regulatory compliance
 * - Must collect specific information in a fixed order
 * - Cannot allow AI to skip steps or modify workflow
 * - Ensures data accuracy and auditability
 * - Prevents incomplete or invalid submissions
 * 
 * Why Gemini is sandboxed as read-only fallback:
 * - Gemini responses are non-deterministic (same input ≠ same output)
 * - Cannot modify application state or interfere with workflows
 * - Only used when no scripted flow is active (activeMode === 'NONE')
 * - Provides informational answers only, never transactional guidance
 * 
 * Why advice and comparisons are blocked:
 * - Financial advice requires licensed professionals; comparisons (e.g. loan vs withdrawal)
 *   imply recommendations. Blocking both prevents liability and keeps compliance.
 * - Users must make decisions independently; we only process applications.
 * 
 * Rules:
 * - Fixed loan application workflow with no step skipping
 * - Deterministic state transitions (same input = same output)
 * - No AI libraries - pure business logic
 * - Validates input at each step
 * - Rejects financial advice requests with standardized refusals
 * - Redirects unrelated questions politely (no Gemini call)
 * - Cancel/exit flow resets state cleanly
 * - No financial advice provided - only processes applications
 */

/**
 * Loan Step Union Type
 * Defines all possible steps in the loan application workflow
 */
export type LoanStep =
  | 'START'
  | 'ELIGIBILITY'
  | 'RULES'
  | 'AMOUNT'
  | 'PURPOSE'
  | 'TERM'
  | 'REVIEW'
  | 'CONFIRMED';

/**
 * Loan State Interface
 * Tracks the current state and collected data throughout the loan application process
 */
export interface LoanState {
  /** Current step in the loan application workflow */
  step: LoanStep;
  
  /** User's vested balance (used to calculate max loan) */
  vestedBalance: number;
  
  /** Maximum loan amount (50% of vested balance or $50,000, whichever is less) */
  maxLoan: number;
  
  /** Whether user is eligible for a loan */
  isEligible?: boolean;
  
  /** Requested loan amount */
  loanAmount?: number;
  
  /** Loan purpose (optional, no validation) */
  loanPurpose?: string;
  
  /** Repayment term in years (1-5 years) */
  repaymentTerm?: number;
  
  /** Collected data for review (includes computed loan terms) */
  collectedData: {
    loanAmount?: number;
    loanPurpose?: string;
    repaymentTerm?: number;
    /** Monthly payment (from loan calculator) */
    monthlyPayment?: number;
    /** Total repayment (principal + interest) */
    totalRepayment?: number;
    /** Total interest over life of loan */
    totalInterest?: number;
  };
}

/**
 * Loan Response
 * Returned by getLoanResponse function
 */
export interface LoanResponse {
  /** Next state after processing user input */
  nextState: LoanState;
  
  /** Message to speak/display to the user */
  message: string;
  
  /** Whether the loan application is complete */
  isComplete: boolean;
  
  /** True when user cancelled/reset; VoiceAssistant must clear loan state and mode */
  isCancelled?: boolean;
}

/**
 * Create Initial Loan State
 * Returns the starting state for a new loan application session
 * 
 * Uses loan calculator for max: 50% of vested or $50,000, whichever is less.
 * 
 * @param vestedBalance - Optional. Default 80,000. Used to compute maxLoan.
 */
export function createInitialLoanState(vestedBalance: number = 80_000): LoanState {
  const maxLoan = calculateMaxLoan(vestedBalance);
  
  return {
    step: 'START',
    vestedBalance,
    maxLoan,
    collectedData: {},
  };
}

/**
 * Get Loan Response
 * 
 * Processes user input based on current state and returns next state + message.
 * This is a deterministic state machine - no AI, pure business logic.
 * 
 * State Machine Behavior:
 * - No step skipping: Each step must complete before advancing
 * - No advancement on invalid input: State remains unchanged
 * - Cancel resets loan state cleanly: Returns to initial state
 * 
 * Guardrails (enforced BEFORE processing; do NOT call Gemini during active loan flow):
 * - Financial advice / comparisons → Fixed refusal (no Gemini)
 * - Unrelated questions → Flow-protection message (no Gemini)
 * - Gemini is sandboxed as fallback only when activeMode === 'NONE' (VoiceAssistant).
 * 
 * @param state - Current loan application state
 * @param userInput - User's voice/text input
 * @returns LoanResponse with next state and message
 */
export function getLoanResponse(
  state: LoanState,
  userInput: string
): LoanResponse {
  const input = userInput.trim().toLowerCase();
  
  // GUARDRAIL 1: Cancel/exit at any step. Clean reset; VoiceAssistant sets isApplyingForLoan=false, loanState=null.
  if (isCancelRequest(input)) {
    return {
      nextState: createInitialLoanState(state.vestedBalance),
      message: "Loan application cancelled. If you'd like to start over, just say 'I want to apply for a loan'.",
      isComplete: false,
      isCancelled: true,
    };
  }
  
  // GUARDRAIL 2: Check for financial advice requests
  // Standardized refusal - do NOT call Gemini, respond with refusal message
  if (isFinancialAdviceRequest(input)) {
    return {
      nextState: state,
      message: getFinancialAdviceRefusal(state.step),
      isComplete: false,
    };
  }
  
  // GUARDRAIL 3: Handle unrelated questions politely
  // Flow-protection message - do NOT call Gemini, redirect back to flow
  if (isUnrelatedQuestion(input, state.step)) {
    return {
      nextState: state,
      message: getUnrelatedQuestionResponse(state.step),
      isComplete: false,
    };
  }
  
  // Process based on current step
  switch (state.step) {
    case 'START':
      return handleStartStep(state, input);
    
    case 'ELIGIBILITY':
      return handleEligibilityStep(state, input);
    
    case 'RULES':
      return handleRulesStep(state, input);
    
    case 'AMOUNT':
      return handleAmountStep(state, input);
    
    case 'PURPOSE':
      return handlePurposeStep(state, input);
    
    case 'TERM':
      return handleTermStep(state, input);
    
    case 'REVIEW':
      return handleReviewStep(state, input);
    
    case 'CONFIRMED':
      return {
        nextState: state,
        message: "Your loan application has been submitted successfully. You'll receive a confirmation email within 1-2 business days. Thank you for using our loan service!",
        isComplete: true,
      };
    
    default:
      return {
        nextState: state,
        message: "I'm not sure what you mean. Let's start over. Would you like to apply for a 401(k) loan?",
        isComplete: false,
      };
  }
}

/**
 * Handle START Step
 * Confirms user wants to apply. Indirect intents (e.g. "need cash urgently") require
 * explicit "yes" here; we do not match vague "want"/"need" so they get the confirmation prompt.
 */
function handleStartStep(state: LoanState, input: string): LoanResponse {
  // Explicit confirmation only: yes, apply, loan, please (e.g. "yes please"). No "want"/"need".
  if (matchesPattern(input, ['yes', 'yeah', 'yep', 'sure', 'okay', 'ok', 'apply', 'loan', 'please'])) {
    return {
      nextState: {
        ...state,
        step: 'ELIGIBILITY',
      },
      message: "Great! Let's start your loan application. First, I need to confirm your eligibility. Are you currently enrolled in the 401(k) plan and have a vested balance?",
      isComplete: false,
    };
  }
  
  // Check for negative response
  if (matchesPattern(input, ['no', 'nope', 'not', "don't", "can't", "cannot"])) {
    return {
      nextState: state,
      message: "No problem. If you change your mind, just say 'I want to apply for a loan' to get started.",
      isComplete: false,
    };
  }
  
  // Invalid input - repeat the question
  return {
    nextState: state,
    message: "I need to know if you'd like to apply for a loan. Please say 'yes' to continue or 'no' to cancel.",
    isComplete: false,
  };
}

/**
 * Handle ELIGIBILITY Step
 * Confirms user eligibility for a loan with detailed eligibility questions
 * 
 * Eligibility Requirements:
 * - Must be enrolled in the 401(k) plan
 * - Must have a vested balance
 * - Must meet plan-specific requirements
 * 
 * State Machine Behavior:
 * - No advancement on invalid input (state remains unchanged)
 * - Only advances when eligibility is confirmed
 */
function handleEligibilityStep(state: LoanState, input: string): LoanResponse {
  // Accept any positive response
  if (matchesPattern(input, ['yes', 'yeah', 'yep', 'sure', 'okay', 'ok', 'eligible', 'enrolled', 'correct', 'right', 'have', 'do', 'meet', 'qualify'])) {
    return {
      nextState: {
        ...state,
        step: 'RULES',
        isEligible: true,
      },
      message: "Perfect! You're eligible. Let me explain the loan rules. You can borrow up to 50% of your vested balance, with a maximum of $50,000. Based on your account, you can borrow up to $" + state.maxLoan.toLocaleString() + ". The repayment is typically over 1 to 5 years through payroll deduction. Interest goes back into your account. Does this sound good?",
      isComplete: false,
    };
  }
  
  // Negative response - provide guidance and eligibility requirements
  if (matchesPattern(input, ['no', 'nope', 'not', "don't", "can't", "cannot", 'uneligible', 'not eligible'])) {
    return {
      nextState: state,
      message: "To be eligible for a loan, you need to be enrolled in the 401(k) plan and have a vested balance. If you're not currently eligible, please contact your plan administrator. Would you like to check your eligibility again?",
      isComplete: false,
    };
  }
  
  // Check for eligibility questions (user asking about eligibility)
  // Handles: "am I eligible", "can I get a loan", "do I qualify", "what are the requirements"
  if (matchesPattern(input, ['what', 'how', 'eligibility', 'requirements', 'qualify', 'need', 'am i', 'can i', 'do i', 'am i eligible', 'can i get', 'do i qualify'])) {
    return {
      nextState: state,
      message: "To be eligible for a 401(k) loan, you must be enrolled in the plan and have a vested balance. Are you currently enrolled in the 401(k) plan and have a vested balance?",
      isComplete: false,
    };
  }
  
  // Invalid input - repeat the question (no state advancement)
  return {
    nextState: state,
    message: "Please confirm your eligibility. Say 'yes' if you're enrolled in the 401(k) plan and have a vested balance, or 'no' if you're not sure.",
    isComplete: false,
  };
}

/**
 * Handle RULES Step
 * Explains loan rules with detailed clarification and confirms understanding
 * 
 * Loan Rule Clarification:
 * - Limits: 50% of vested balance, max $50,000
 * - Interest: Goes back into your account
 * - Repayment: 1-5 years through payroll deduction
 * - Default: If you leave employment, loan becomes due
 * 
 * State Machine Behavior:
 * - No advancement on invalid input (state remains unchanged)
 * - Only advances when user confirms understanding
 */
function handleRulesStep(state: LoanState, input: string): LoanResponse {
  // Check for rule clarification questions
  // Handles: "what are the limits", "how much can I borrow", "what's the interest rate", "how long do I have to repay"
  if (matchesPattern(input, ['what', 'how', 'explain', 'tell me', 'clarify', 'limit', 'interest', 'repayment', 'term', 'years', 'maximum', 'minimum', 'how much', 'what are', 'what is', 'what\'s', 'how long', 'borrow', 'rate'])) {
    return {
      nextState: state,
      message: "Here are the key loan rules: You can borrow up to 50% of your vested balance, with a maximum of $50,000. Based on your account, that's up to $" + state.maxLoan.toLocaleString() + ". Repayment is 1 to 5 years through payroll deduction. Interest goes back into your account. If you leave employment, the loan becomes due. Does this sound good?",
      isComplete: false,
    };
  }
  
  // Accept any positive response to proceed
  if (matchesPattern(input, ['yes', 'yeah', 'yep', 'sure', 'okay', 'ok', 'good', 'fine', 'understood', 'got it', 'continue', 'proceed', 'next', 'clear'])) {
    return {
      nextState: {
        ...state,
        step: 'AMOUNT',
      },
      message: "Great! How much would you like to borrow? You can request any amount from $1,000 up to $" + state.maxLoan.toLocaleString() + ".",
      isComplete: false,
    };
  }
  
  // Invalid input - repeat the question (no state advancement)
  return {
    nextState: state,
    message: "Please confirm you understand the loan rules. Say 'yes' to continue with your application, or ask me to explain any part of the rules.",
    isComplete: false,
  };
}

/**
 * Vague numeric input: "maximum", "as much as possible", etc.
 * Only when there is no parseable number (parseLoanAmount returns null).
 * Call when amount is null to choose a specific refusal message.
 */
function isVagueNumericInput(input: string): boolean {
  const t = input.toLowerCase().replace(/\s+/g, ' ').trim();
  const vague = [
    /^(the\s+)?(max|maximum)(\s+amount)?\.?$/i,
    /^as\s+much\s+as\s+(possible|i\s+can|i\s+can\s+borrow)/i,
    /^whatever\s+i\s+can/i,
    /^(the\s+)?full\s+(amount|loan)?\.?$/i,
    /^all\s+(of\s+it|of\s+my\s+balance|i\s+can)/i,
    /^(full|all|max|maximum)\.?$/i,
    /^(i\s+want|i'd\s+like|give\s+me|can\s+i\s+get)\s+(the\s+)?(max|maximum|full\s+amount)\.?$/i,
  ];
  return vague.some((p) => p.test(t));
}

/**
 * Parse word numbers to numeric (limited support for common loan amounts)
 * Handles: "ten thousand" → 10000, "five thousand" → 5000, "twenty thousand" → 20000
 * This is a minimal implementation for common loan amount phrases.
 * 
 * @param input - User input string
 * @returns Parsed number or null if not recognized
 */
function parseWordsToNumber(input: string): number | null {
  const text = input.toLowerCase().trim();
  
  // Simple word-to-number mapping for common loan amounts
  const wordMap: Record<string, number> = {
    'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
    'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
    'eleven': 11, 'twelve': 12, 'thirteen': 13, 'fourteen': 14, 'fifteen': 15,
    'sixteen': 16, 'seventeen': 17, 'eighteen': 18, 'nineteen': 19,
    'twenty': 20, 'thirty': 30, 'forty': 40, 'fifty': 50,
    'sixty': 60, 'seventy': 70, 'eighty': 80, 'ninety': 90,
    'hundred': 100, 'thousand': 1000,
  };
  
  // Pattern: "ten thousand" or "ten thousand dollars"
  const thousandMatch = text.match(/(\w+)\s+thousand/);
  if (thousandMatch) {
    const numWord = thousandMatch[1];
    const num = wordMap[numWord];
    if (num != null) {
      return num * 1000;
    }
  }
  
  // Pattern: "twenty five thousand" or "twenty-five thousand"
  const compoundMatch = text.match(/(\w+)\s*(?:-|\s+)(\w+)\s+thousand/);
  if (compoundMatch) {
    const tens = wordMap[compoundMatch[1]];
    const ones = wordMap[compoundMatch[2]];
    if (tens != null && ones != null && tens >= 20 && ones < 10) {
      return (tens + ones) * 1000;
    }
  }
  
  return null;
}

/**
 * Parse Loan Amount Helper
 * 
 * Normalizes user input by stripping all non-numeric characters except decimal points,
 * then converts to a number. This handles various input formats like:
 * - "5000" → 5000
 * - "$10,000" → 10000
 * - "10000$" → 10000
 * - "  7500  " → 7500
 * 
 * Why normalization is required:
 * - Users may include currency symbols ($) in different positions
 * - Users may include commas for thousands separators
 * - Users may include whitespace
 * - Voice recognition may add extra characters
 * - We need consistent numeric validation regardless of formatting
 * 
 * @param input - Raw user input string
 * @returns Parsed number or null if parsing fails
 */
function parseLoanAmount(input: string): number | null {
  if (!input || typeof input !== 'string') {
    return null;
  }
  
  // Strip all non-numeric characters except decimal points
  // This handles: "$10,000" → "10000", "10000$" → "10000", "  5000  " → "5000"
  const cleaned = input.replace(/[^\d.]/g, '');
  
  // If no digits found, return null
  if (cleaned.length === 0) {
    return null;
  }
  
  // Convert to number
  const amount = parseFloat(cleaned);
  
  // Return null if parsing fails or results in NaN
  if (isNaN(amount) || !isFinite(amount)) {
    return null;
  }
  
  return amount;
}

/**
 * Handle AMOUNT Step
 * Validates requested loan amount
 * 
 * Uses parseLoanAmount() to normalize input before validation.
 * This ensures consistent parsing regardless of currency formatting.
 */
function handleAmountStep(state: LoanState, input: string): LoanResponse {
  // Parse amount first (handles mixed input like "What's the max? $20,000").
  // Formats: "5000", "$10,000", "10000$", "  7500  ".
  let amount = parseLoanAmount(input);
  
  // If numeric parsing failed, try word-to-number (e.g., "ten thousand" → 10000)
  if (amount === null) {
    amount = parseWordsToNumber(input);
  }

  // Reject null: either vague ("maximum", "as much as possible") or unparseable.
  if (amount === null) {
    const msg = isVagueNumericInput(input)
      ? "Please provide a specific amount in dollars, for example $10,000 or $20,000. You can borrow up to $" + state.maxLoan.toLocaleString() + "."
      : "I didn't understand that amount. Please tell me how much you'd like to borrow. You can request any amount from $" + LOAN_MIN_AMOUNT.toLocaleString() + " up to $" + state.maxLoan.toLocaleString() + ". For example, say '$10,000' or 'ten thousand dollars'.";
    return { nextState: state, message: msg, isComplete: false };
  }
  
  // Use loan calculator validation (min $1,000, max state.maxLoan)
  const amountValidation = validateLoanAmount(amount, state.maxLoan);
  if (!amountValidation.valid) {
    return {
      nextState: state,
      message: (amountValidation.error || "Invalid amount.") + " Please request an amount between $" + LOAN_MIN_AMOUNT.toLocaleString() + " and $" + state.maxLoan.toLocaleString() + ".",
      isComplete: false,
    };
  }
  
  // Valid amount - advance to PURPOSE step
  // If we have a previous purpose (from review edit), offer to keep it
  const purposeMessage = state.loanPurpose
    ? `Perfect! You're requesting a loan of $${amount.toLocaleString()}. Your previous purpose was "${state.loanPurpose}". Say 'same' to keep it, or tell me a new purpose.`
    : `Perfect! You're requesting a loan of $${amount.toLocaleString()}. What will you use this loan for? This is optional, but helps with planning.`;
  
  return {
    nextState: {
      ...state,
      step: 'PURPOSE',
      loanAmount: amount,
      collectedData: {
        ...state.collectedData,
        loanAmount: amount,
        // Clear computed fields when amount changes (will be recomputed at TERM)
        monthlyPayment: undefined,
        totalRepayment: undefined,
        totalInterest: undefined,
      },
    },
    message: purposeMessage,
    isComplete: false,
  };
}

/**
 * Handle PURPOSE Step
 * Captures loan purpose (neutral, no validation)
 * 
 * Purpose capture is neutral - accepts any input without validation.
 * This allows users to provide any purpose or skip if desired.
 * 
 * State Machine Behavior:
 * - Always advances to TERM step (no validation = no rejection)
 * - Accepts any input including "skip", "none", or empty
 */
function handlePurposeStep(state: LoanState, input: string): LoanResponse {
  // Check if user wants to keep previous purpose (from review edit)
  const normalizedInput = input.trim().toLowerCase();
  if (state.loanPurpose && matchesPattern(normalizedInput, ['same', 'keep', 'unchanged', 'keep it', 'same as before', 'keep the same'])) {
    // Use existing purpose
    const purpose = state.loanPurpose;
    const termMessage = state.repaymentTerm
      ? `Thank you. Your previous repayment term was ${state.repaymentTerm} ${state.repaymentTerm === 1 ? 'year' : 'years'}. Say 'same' to keep it, or choose 1 to 5 years.`
      : "Thank you. Now, how many years would you like to repay this loan? You can choose between 1 and 5 years. Most people choose 5 years for lower monthly payments.";
    
    return {
      nextState: {
        ...state,
        step: 'TERM',
        loanPurpose: purpose,
        collectedData: {
          ...state.collectedData,
          loanPurpose: purpose,
        },
      },
      message: termMessage,
      isComplete: false,
    };
  }
  
  // Accept any input as purpose (no validation required)
  // Even if user says "skip" or "none", we'll proceed
  const purpose = input.trim() || 'Not specified';
  
  // When advancing to TERM, if we have a previous term (from review edit), mention it
  const termMessage = state.repaymentTerm
    ? `Thank you. Your previous repayment term was ${state.repaymentTerm} ${state.repaymentTerm === 1 ? 'year' : 'years'}. Say 'same' to keep it, or choose 1 to 5 years.`
    : "Thank you. Now, how many years would you like to repay this loan? You can choose between 1 and 5 years. Most people choose 5 years for lower monthly payments.";
  
  return {
    nextState: {
      ...state,
      step: 'TERM',
      loanPurpose: purpose,
      collectedData: {
        ...state.collectedData,
        loanPurpose: purpose,
      },
    },
    message: termMessage,
    isComplete: false,
  };
}

/**
 * Build collectedData with loan terms (monthly payment, total repayment, interest).
 * Uses loan calculator. Call when we have both amount and termYears.
 */
function buildCollectedDataWithLoanTerms(
  state: LoanState,
  termYears: number
): LoanState['collectedData'] {
  const amount = state.loanAmount ?? 0;
  const terms = calculateLoanTerms({
    amount,
    termYears,
    annualRate: DEFAULT_LOAN_ANNUAL_RATE,
  });
  return {
    ...state.collectedData,
    loanAmount: amount,
    repaymentTerm: termYears,
    monthlyPayment: terms.monthlyPayment,
    totalRepayment: terms.totalRepayment,
    totalInterest: terms.totalInterest,
  };
}

/**
 * Handle TERM Step
 * Validates repayment term (1-5 years) via loan calculator.
 * On success, computes monthly payment and total repayment and stores in collectedData.
 * 
 * Repayment Term Validation:
 * - Minimum: 1 year, Maximum: 5 years (validateLoanTerm)
 * - Rejects terms outside this range
 * 
 * State Machine Behavior:
 * - No advancement on invalid input (state remains unchanged)
 * - Only advances when valid term (1-5 years) is provided
 */
function handleTermStep(state: LoanState, input: string): LoanResponse {
  // Check if user wants to keep previous term (from review edit)
  const normalizedInput = input.trim().toLowerCase();
  if (state.repaymentTerm != null && matchesPattern(normalizedInput, ['same', 'keep', 'keep it', 'same as before', 'keep the same'])) {
    // Use existing term
    const termYears = state.repaymentTerm;
    const collectedData = buildCollectedDataWithLoanTerms(state, termYears);
    const monthly = collectedData.monthlyPayment!;
    return {
      nextState: {
        ...state,
        step: 'REVIEW',
        repaymentTerm: termYears,
        collectedData,
      },
      message: `Perfect! You've chosen a ${termYears}-year repayment term. Your estimated monthly payment is $${monthly.toLocaleString()}. Let me review your loan application with you.`,
      isComplete: false,
    };
  }
  
  let termYears: number | null = null;

  // Try to extract number of years
  const yearMatch = input.match(/(\d+)\s*(?:year|yr|y)/i);
  if (yearMatch) termYears = parseInt(yearMatch[1], 10);

  if (termYears == null) {
    const numberMatch = input.match(/(\d+)/);
    if (numberMatch) termYears = parseInt(numberMatch[1], 10);
  }

  if (termYears == null) {
    if (matchesPattern(input, ['one', '1'])) termYears = 1;
    if (matchesPattern(input, ['five', '5', 'maximum', 'max', 'longest'])) termYears = 5;
  }

  if (termYears != null) {
    const termValidation = validateLoanTerm(termYears);
    if (termValidation.valid) {
      const collectedData = buildCollectedDataWithLoanTerms(state, termYears);
      const monthly = collectedData.monthlyPayment!;
      return {
        nextState: {
          ...state,
          step: 'REVIEW',
          repaymentTerm: termYears,
          collectedData,
        },
        message: `Perfect! You've chosen a ${termYears}-year repayment term. Your estimated monthly payment is $${monthly.toLocaleString()}. Let me review your loan application with you.`,
        isComplete: false,
      };
    }
  }

  // Invalid input - repeat the question (no state advancement)
  return {
    nextState: state,
    message: "Please choose a repayment term between 1 and 5 years. For example, say '3 years' or '5 years'. Most people choose 5 years for lower monthly payments.",
    isComplete: false,
  };
}

/**
 * Handle REVIEW Step
 * Summarizes loan details and asks for confirmation
 * 
 * Review and Confirmation:
 * - Displays complete loan summary
 * - Asks for final confirmation
 * - Allows restart if user wants changes
 * 
 * State Machine Behavior:
 * - Advances to CONFIRMED only on explicit confirmation
 * - Returns to START if user wants changes
 * - No advancement on invalid input
 */
function handleReviewStep(state: LoanState, input: string): LoanResponse {
  // Build summary message
  const summary = buildLoanSummary(state);
  
  // Check for confirmation
  if (matchesPattern(input, ['yes', 'yeah', 'yep', 'correct', 'right', 'confirm', 'proceed', 'submit', 'finish', 'complete', 'okay', 'ok'])) {
    return {
      nextState: { ...state, step: 'CONFIRMED' },
      message: "Perfect! Your loan application has been submitted successfully. You'll receive a confirmation email within 1-2 business days with next steps. Thank you for using our loan service!",
      isComplete: true,
    };
  }

  // Review edits: change amount → AMOUNT (clear amount and derived terms only)
  // Also handles "the amount" as follow-up to generic "change" question
  if (matchesPattern(input, ['change amount', 'change the amount', 'different amount', 'wrong amount', 'modify amount', 'edit amount', 'change the loan amount', 'the amount'])) {
    return {
      nextState: {
        ...state,
        step: 'AMOUNT',
        loanAmount: undefined,
        collectedData: {
          ...state.collectedData,
          loanAmount: undefined,
          monthlyPayment: undefined,
          totalRepayment: undefined,
          totalInterest: undefined,
        },
      },
      message: "No problem. How much would you like to borrow? You can request any amount from $" + LOAN_MIN_AMOUNT.toLocaleString() + " up to $" + state.maxLoan.toLocaleString() + ".",
      isComplete: false,
    };
  }

  // Review edits: change term → TERM (clear term and derived terms only)
  // Also handles "the term" as follow-up to generic "change" question
  if (matchesPattern(input, ['change term', 'change the term', 'different term', 'wrong term', 'modify term', 'edit term', 'change years', 'change repayment', 'the term', 'the years', 'the repayment'])) {
    return {
      nextState: {
        ...state,
        step: 'TERM',
        repaymentTerm: undefined,
        collectedData: {
          ...state.collectedData,
          repaymentTerm: undefined,
          monthlyPayment: undefined,
          totalRepayment: undefined,
          totalInterest: undefined,
        },
      },
      message: "No problem. How many years would you like to repay this loan? You can choose between 1 and 5 years.",
      isComplete: false,
    };
  }

  // Review edits: change purpose → PURPOSE (clear purpose only)
  // Also handles "the purpose" as follow-up to generic "change" question
  if (matchesPattern(input, ['change purpose', 'change the purpose', 'different purpose', 'wrong purpose', 'modify purpose', 'edit purpose', 'the purpose'])) {
    return {
      nextState: {
        ...state,
        step: 'PURPOSE',
        loanPurpose: undefined,
        collectedData: {
          ...state.collectedData,
          loanPurpose: undefined,
        },
      },
      message: "No problem. What will you use this loan for? This is optional, but helps with planning.",
      isComplete: false,
    };
  }

  // Generic "change", "edit", "modify" without specifying what → ask what to change
  // Stay in REVIEW and wait for follow-up ("the amount", "the term", "the purpose")
  if (matchesPattern(input, ['change', 'modify', 'edit', 'wrong', 'different']) && 
      !matchesPattern(input, ['amount', 'term', 'purpose', 'years', 'repayment', 'loan amount'])) {
    return {
      nextState: state,
      message: "What would you like to change? Say 'the amount', 'the term', or 'the purpose'. Or say 'start over' to begin from the beginning.",
      isComplete: false,
    };
  }

  // Start over: clear all and return to START
  if (matchesPattern(input, ['no', 'back', 'start over', 'begin again', 'restart'])) {
    return {
      nextState: {
        ...state,
        step: 'START',
        collectedData: {},
        loanAmount: undefined,
        loanPurpose: undefined,
        repaymentTerm: undefined,
      },
      message: "No problem! Let's start over. Would you like to apply for a 401(k) loan?",
      isComplete: false,
    };
  }

  // Show summary and ask for confirmation
  return {
    nextState: state,
    message: `${summary} Does this look correct? Say 'yes' to submit your application or 'no' to start over.`,
    isComplete: false,
  };
}

/**
 * Build Loan Summary
 * Creates a summary message of all collected loan data and computed loan terms.
 * Uses monthly payment and total repayment from loan calculator when available.
 */
function buildLoanSummary(state: LoanState): string {
  const d = state.collectedData;
  const parts: string[] = [];
  
  parts.push("Here's a summary of your loan application:");
  
  if (d.loanAmount !== undefined) {
    parts.push(`Loan amount: $${d.loanAmount.toLocaleString()}`);
  }
  
  if (d.loanPurpose) {
    parts.push(`Purpose: ${d.loanPurpose}`);
  }
  
  if (d.repaymentTerm !== undefined) {
    parts.push(`Repayment term: ${d.repaymentTerm} ${d.repaymentTerm === 1 ? 'year' : 'years'}`);
  }
  
  if (d.monthlyPayment !== undefined) {
    parts.push(`Estimated monthly payment: $${d.monthlyPayment.toLocaleString()}`);
  }
  
  if (d.totalRepayment !== undefined) {
    parts.push(`Total repayment: $${d.totalRepayment.toLocaleString()}`);
  }
  
  return parts.join(' ');
}

/**
 * Check if input is a cancel/exit request
 * Returns true if the user wants to cancel or exit the loan application flow
 * 
 * Cancel resets loan state cleanly - returns to initial state
 */
function isCancelRequest(input: string): boolean {
  const cancelPatterns = [
    /^cancel/i,
    /^exit/i,
    /^stop/i,
    /^quit/i,
    /^never mind/i,
    /^forget it/i,
    /^don't want/i,
    /^not interested/i,
    /^change my mind/i,
    /^no thanks/i,
    /^abort/i,
    /^go back/i,
    /^leave/i,
    /^start over$/i,
  ];
  return cancelPatterns.some((p) => p.test(input.trim()));
}

/**
 * Check if input is a financial advice request
 * Returns true if the input seems to be asking for financial advice
 * 
 * Standardized refusal responses prevent liability and ensure compliance
 */
function isFinancialAdviceRequest(input: string): boolean {
  const advicePatterns = [
    /should i (take|get|borrow|apply|use)/i,
    /is it (good|bad|wise|smart|better|worth)/i,
    /what (should|would|do you recommend|do you suggest)/i,
    /(recommend|suggest|advice|advise|opinion)/i,
    /(better|best|worst) (option|choice|decision|alternative)/i,
    /(good idea|bad idea|wise|smart|worth it)/i,
    /(compare|comparison|vs|versus|instead)/i,
    /(what if|what happens if|hypothetical)/i,
    /(loan vs|loan or|withdrawal vs|withdrawal or)/i,
  ];
  
  return advicePatterns.some(pattern => pattern.test(input));
}

/**
 * Get Standardized Financial Advice Refusal
 * 
 * Provides consistent refusal messages for financial advice requests.
 * Standardized responses prevent liability and ensure compliance.
 * 
 * Categories:
 * - Direct advice requests ("Should I take a loan?")
 * - Hypothetical outcomes ("What happens if...")
 * - Comparisons ("Loan vs withdrawal")
 */
function getFinancialAdviceRefusal(currentStep: LoanStep): string {
  const stepMessages: Record<LoanStep, string> = {
    'START': "I can help you apply for a loan, but I cannot provide financial advice. Financial decisions should be made with a licensed professional. Would you like to continue with your loan application?",
    'ELIGIBILITY': "I'm here to help you apply for a loan, but I cannot provide financial advice. For financial guidance, please consult a licensed financial advisor. Would you like to continue with your loan application?",
    'RULES': "I can help you apply for a loan, but I cannot provide financial advice or recommendations. For financial guidance, please consult a licensed financial advisor. Would you like to continue with your loan application?",
    'AMOUNT': "I can help you apply for a loan, but I cannot provide financial advice on loan amounts. For financial guidance, please consult a licensed financial advisor. Would you like to continue with your loan application?",
    'PURPOSE': "I can help you apply for a loan, but I cannot provide financial advice on loan purposes. For financial guidance, please consult a licensed financial advisor. Would you like to continue with your loan application?",
    'TERM': "I can help you apply for a loan, but I cannot provide financial advice on repayment terms. For financial guidance, please consult a licensed financial advisor. Would you like to continue with your loan application?",
    'REVIEW': "I can help you apply for a loan, but I cannot provide financial advice. For financial guidance, please consult a licensed financial advisor. Would you like to continue with your loan application?",
    'CONFIRMED': "Your loan application is complete. For financial advice, please consult a licensed financial advisor.",
  };
  
  return stepMessages[currentStep] || "I cannot provide financial advice. For financial guidance, please consult a licensed financial advisor.";
}

/**
 * Check if input is an unrelated question
 * Returns true if the input seems unrelated to the current loan application step
 */
function isUnrelatedQuestion(input: string, currentStep: LoanStep): boolean {
  // Common unrelated question patterns
  const unrelatedPatterns = [
    /^what (is|are|can|do|does|will|would|should|how)/i,
    /^how (do|does|can|will|would|should|much|many|long)/i,
    /^tell me (about|more)/i,
    /^explain/i,
    /^help (me|with)/i,
    /^can you (tell|explain|help|show)/i,
    /^i (want|need|would like) to (know|learn|understand|see)/i,
  ];
  
  // Allow questions that are relevant to loan application (incl. mixed "what's the max? $20,000")
  const loanKeywords = [
    'loan', 'borrow', 'amount', 'term', 'repay', 'repayment',
    'purpose', 'eligibility', 'eligible', 'vested', 'balance',
    'apply', 'application', 'confirm', 'review', 'submit',
    'max', 'maximum', 'limit', 'limits',
  ];
  
  // Check if it matches unrelated patterns
  const isUnrelatedPattern = unrelatedPatterns.some(pattern => pattern.test(input));
  
  // But allow if it contains loan keywords
  const hasLoanKeyword = loanKeywords.some(keyword => input.includes(keyword));
  
  return isUnrelatedPattern && !hasLoanKeyword;
}

/**
 * Get response for unrelated questions
 * Provides flow-protection message - redirects back to loan application flow
 * 
 * Flow-protection ensures:
 * - User stays in deterministic loan flow
 * - No Gemini calls during active flow
 * - Clear guidance back to current step
 */
function getUnrelatedQuestionResponse(currentStep: LoanStep): string {
  const stepMessages: Record<LoanStep, string> = {
    'START': "I'm currently helping you with your loan application. We can answer general questions after we finish this step. Would you like to start your loan application?",
    'ELIGIBILITY': "I'm currently helping you with your loan application. We can answer general questions after we finish this step. Are you currently enrolled in the 401(k) plan and have a vested balance?",
    'RULES': "I'm currently helping you with your loan application. We can answer general questions after we finish this step. Does the loan information sound good?",
    'AMOUNT': "I'm currently helping you with your loan application. We can answer general questions after we finish this step. How much would you like to borrow?",
    'PURPOSE': "I'm currently helping you with your loan application. We can answer general questions after we finish this step. What will you use this loan for?",
    'TERM': "I'm currently helping you with your loan application. We can answer general questions after we finish this step. How many years would you like to repay this loan?",
    'REVIEW': "I'm currently helping you with your loan application. We can answer general questions after we finish this step. Does the summary look correct?",
    'CONFIRMED': "Your loan application is complete. Is there anything else you'd like to know?",
  };
  
  return stepMessages[currentStep] || "I'm currently helping you with your loan application. We can answer general questions after we finish this step.";
}

/**
 * Matches Pattern Helper
 * Checks if input matches any of the given patterns (case-insensitive)
 */
function matchesPattern(input: string, patterns: string[]): boolean {
  return patterns.some(pattern => 
    input.includes(pattern.toLowerCase())
  );
}
