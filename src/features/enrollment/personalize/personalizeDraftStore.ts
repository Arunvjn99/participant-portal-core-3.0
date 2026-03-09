/**
 * Personalize wizard draft – persisted to sessionStorage.
 * Consumed by EnrollmentContext to initialize retirementAge, projection, and income.
 */

export interface PersonalizeDraft {
  dateOfBirth: string;
  retirementAge: number;
  country: string;
  state: string;
  salaryRange: string;
  savingsEstimate: string;
  /** Step 3 currency amount (current retirement savings in dollars) */
  savingsAmount?: number;
}

const STORAGE_KEY = "personalize-draft";

export function loadPersonalizeDraft(): PersonalizeDraft | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PersonalizeDraft;
  } catch (err) {
    if (import.meta.env.DEV) console.error("[personalizeDraftStore] loadPersonalizeDraft parse failed:", err);
    return null;
  }
}

export function savePersonalizeDraft(draft: PersonalizeDraft): void {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
}

export function clearPersonalizeDraft(): void {
  sessionStorage.removeItem(STORAGE_KEY);
}

/** Map wizard salary range to approximate annual salary for enrollment. */
export function salaryRangeToAnnualSalary(salaryRange: string): number {
  const map: Record<string, number> = {
    under_50k: 37_500,
    "50k_75k": 62_500,
    "75k_100k": 87_500,
    "100k_150k": 125_000,
    over_150k: 175_000,
  };
  return map[salaryRange] ?? 0;
}

/** Map wizard savings estimate to approximate current balance for enrollment. */
export function savingsEstimateToBalance(savingsEstimate: string): number {
  const map: Record<string, number> = {
    just_starting: 0,
    under_25k: 12_500,
    "25k_100k": 62_500,
    "100k_250k": 175_000,
    over_250k: 300_000,
  };
  return map[savingsEstimate] ?? 0;
}
