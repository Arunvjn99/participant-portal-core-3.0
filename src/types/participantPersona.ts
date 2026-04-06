/** Demo / scenario persona shape persisted in localStorage (`demoUser`). */

export type PersonaType =
  | "pre_enrollment"
  | "new_enrollee"
  | "young_accumulator"
  | "mid_career"
  | "pre_retiree"
  | "at_risk"
  | "loan_active"
  | "retired";

export interface PersonaProfile {
  id: string;
  email: string;
  name: string;
  age: number;
  balance: number;
  contributionRate: number;
  employerMatchRate: number;
  retirementScore: number;
  enrollmentStatus: "not_enrolled" | "enrolled" | "retired";
  scenario: PersonaType;
  flags: {
    autoEnrollment?: boolean;
    loanActive?: boolean;
    lowContribution?: boolean;
    lifeEvent?: "marriage" | "child" | "home" | null;
    demoTransactions?: boolean;
    demoLoan?: boolean;
    demoWithdrawals?: boolean;
    hasInvestments?: boolean;
  };
}
