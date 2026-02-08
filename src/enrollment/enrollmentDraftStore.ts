import type { SelectedPlanId } from "./context/EnrollmentContext";
import type { ContributionType } from "./logic/types";

/**
 * Enrollment draft - single source of truth for wizard data.
 * Persisted to sessionStorage for reuse across wizard → plans flow.
 */
export interface EnrollmentDraft {
  currentAge: number;
  retirementAge: number;
  yearsToRetire: number;
  annualSalary: number;
  retirementLocation: string;
  otherSavings?: {
    type: string | null;
    amount: number | null;
  };
  /** Selected plan on plans page - persisted on Save & Exit */
  selectedPlanId?: SelectedPlanId | null;
  /** Contribution settings - persisted on Save & Exit from Contribution step */
  contributionType?: ContributionType;
  contributionAmount?: number;
}

const STORAGE_KEY = "enrollment-draft";

export function loadEnrollmentDraft(): EnrollmentDraft | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as EnrollmentDraft;
  } catch {
    return null;
  }
}

export function saveEnrollmentDraft(draft: EnrollmentDraft): void {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
}

export function clearEnrollmentDraft(): void {
  sessionStorage.removeItem(STORAGE_KEY);
}
