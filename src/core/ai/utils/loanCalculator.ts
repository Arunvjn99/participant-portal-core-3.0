import { userProfile } from "../mock/userProfile";

export type LoanEligibilityResult = {
  maxLoan: number;
  requested: number;
  isEligible: boolean;
};

export function calculateLoanEligibility(
  profile: { vestedBalance: number },
  amount: number | null,
): LoanEligibilityResult {
  const maxLoan = Math.round(profile.vestedBalance * 0.5);
  if (amount == null || Number.isNaN(amount)) {
    return { maxLoan, requested: 0, isEligible: false };
  }
  return {
    maxLoan,
    requested: amount,
    isEligible: amount <= maxLoan,
  };
}

export { userProfile };
