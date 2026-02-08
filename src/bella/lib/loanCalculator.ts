/**
 * Loan Calculator - 401(k) Loan Calculation Logic
 *
 * Implements IRS/plan rules for 401(k) participant loans:
 * - Max: 50% of vested balance or $50,000, whichever is less
 * - Min: $1,000 (plan-specific, common default)
 * - Term: 1-5 years
 * - Interest: Typically Prime + 1% (goes back to participant's account)
 *
 * All calculations are deterministic. No AI. Pure business logic.
 */

/** IRS maximum 401(k) loan amount (regardless of balance) */
export const LOAN_MAX_ABSOLUTE = 50_000;

/** 401(k) loan limit as fraction of vested balance (50%) */
export const LOAN_MAX_PCT_OF_VESTED = 0.5;

/** Minimum loan amount (common plan default) */
export const LOAN_MIN_AMOUNT = 1_000;

/** Min/max repayment term in years */
export const LOAN_TERM_YEARS_MIN = 1;
export const LOAN_TERM_YEARS_MAX = 5;

/**
 * Default annual interest rate for 401(k) loans.
 * Many plans use Prime + 1%. This is a reasonable default; plans may override.
 */
export const DEFAULT_LOAN_ANNUAL_RATE = 0.085; // 8.5% APR

/** Number of payments per year (monthly) */
const PAYMENTS_PER_YEAR = 12;

export interface LoanTermsInput {
  /** Loan amount in dollars */
  amount: number;
  /** Repayment term in years (1-5) */
  termYears: number;
  /** Annual interest rate (e.g. 0.085 for 8.5%). Optional; uses default if not provided. */
  annualRate?: number;
}

export interface LoanTerms {
  /** Loan principal */
  amount: number;
  /** Term in years */
  termYears: number;
  /** Annual interest rate (decimal) */
  annualRate: number;
  /** Monthly payment amount */
  monthlyPayment: number;
  /** Total amount to be repaid (principal + interest) */
  totalRepayment: number;
  /** Total interest over life of loan */
  totalInterest: number;
  /** Number of payments */
  numberOfPayments: number;
}

/**
 * Round to 2 decimal places for currency
 */
function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * Calculate maximum 401(k) loan amount.
 */
export function calculateMaxLoan(vestedBalance: number): number {
  if (vestedBalance <= 0) return 0;
  const fromVested = vestedBalance * LOAN_MAX_PCT_OF_VESTED;
  return Math.min(fromVested, LOAN_MAX_ABSOLUTE);
}

/**
 * Validate loan amount against plan limits.
 */
export function validateLoanAmount(
  amount: number,
  maxLoan: number
): { valid: boolean; error?: string } {
  if (isNaN(amount) || amount <= 0) {
    return { valid: false, error: 'Amount must be a positive number.' };
  }
  if (amount < LOAN_MIN_AMOUNT) {
    return { valid: false, error: `Minimum loan amount is $${LOAN_MIN_AMOUNT.toLocaleString()}.` };
  }
  if (amount > maxLoan) {
    return { valid: false, error: `Maximum loan amount is $${maxLoan.toLocaleString()}.` };
  }
  return { valid: true };
}

/**
 * Validate repayment term.
 */
export function validateLoanTerm(termYears: number): { valid: boolean; error?: string } {
  if (isNaN(termYears) || termYears <= 0) {
    return { valid: false, error: 'Term must be a positive number of years.' };
  }
  if (termYears < LOAN_TERM_YEARS_MIN || termYears > LOAN_TERM_YEARS_MAX) {
    return {
      valid: false,
      error: `Repayment term must be between ${LOAN_TERM_YEARS_MIN} and ${LOAN_TERM_YEARS_MAX} years.`,
    };
  }
  return { valid: true };
}

/**
 * Calculate monthly payment using standard amortization.
 */
export function calculateMonthlyPayment(
  principal: number,
  annualRate: number,
  termYears: number
): number {
  if (principal <= 0) return 0;
  const n = termYears * PAYMENTS_PER_YEAR;
  const r = annualRate / PAYMENTS_PER_YEAR;

  if (r === 0) return round2(principal / n);
  const factor = Math.pow(1 + r, n);
  return round2((principal * r * factor) / (factor - 1));
}

/**
 * Compute full loan terms: monthly payment, total repayment, total interest.
 */
export function calculateLoanTerms(input: LoanTermsInput): LoanTerms {
  const { amount, termYears } = input;
  const annualRate = input.annualRate ?? DEFAULT_LOAN_ANNUAL_RATE;

  const monthlyPayment = calculateMonthlyPayment(amount, annualRate, termYears);
  const numberOfPayments = termYears * PAYMENTS_PER_YEAR;
  const totalRepayment = round2(monthlyPayment * numberOfPayments);
  const totalInterest = round2(totalRepayment - amount);

  return {
    amount,
    termYears,
    annualRate,
    monthlyPayment,
    totalRepayment,
    totalInterest,
    numberOfPayments,
  };
}

/**
 * Get amortization schedule (optional, for display).
 */
export interface AmortizationRow {
  paymentNumber: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

export function getAmortizationSchedule(input: LoanTermsInput): AmortizationRow[] {
  const terms = calculateLoanTerms(input);
  const rows: AmortizationRow[] = [];
  const monthlyRate = terms.annualRate / PAYMENTS_PER_YEAR;
  let balance = terms.amount;

  for (let i = 1; i <= terms.numberOfPayments; i++) {
    const interest = round2(balance * monthlyRate);
    const principal = round2(terms.monthlyPayment - interest);
    balance = round2(Math.max(0, balance - principal));

    rows.push({
      paymentNumber: i,
      payment: terms.monthlyPayment,
      principal,
      interest,
      balance,
    });
  }

  return rows;
}
