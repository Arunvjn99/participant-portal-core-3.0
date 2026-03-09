export type PersonalizationStep = "age" | "location" | "savings";

export interface PersonalizationState {
  currentStep: PersonalizationStep;
  currentAge: number;
  retirementAge: number;
  /** State name (e.g. "California") */
  location: string;
  /** Saved amount in dollars */
  savings: number;
  /** Birth date for display (e.g. "April 16, 1994") */
  birthDateDisplay: string;
  /** Raw birth year for age calc */
  birthYear: number;
}

export const PERSONALIZATION_STEPS: PersonalizationStep[] = ["age", "location", "savings"];

export const RETIREMENT_AGE_MIN = 32;
export const RETIREMENT_AGE_MAX = 75;
export const SAVINGS_MIN = 0;
export const SAVINGS_MAX = 10_000_000;
