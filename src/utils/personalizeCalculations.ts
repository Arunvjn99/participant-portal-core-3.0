/**
 * Centralized age and retirement calculations for the Personalize Plan wizard.
 * Single source of truth for current age, years to retire, and retirement year.
 */

/**
 * Calculate current age from date of birth (ISO date string YYYY-MM-DD).
 * Returns age in [18, 74] for display; raw calculation can exceed for internal use.
 */
export function calculateCurrentAge(dateOfBirth: string): number {
  const d = new Date(dateOfBirth);
  if (Number.isNaN(d.getTime())) return 30;
  const today = new Date();
  let age = today.getFullYear() - d.getFullYear();
  const m = today.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age -= 1;
  return Math.max(0, age);
}

/**
 * Years until retirement. Clamped to >= 0.
 */
export function calculateYearsToRetire(currentAge: number, retirementAge: number): number {
  return Math.max(0, retirementAge - currentAge);
}

/**
 * Calendar year when user will reach retirement age.
 */
export function calculateRetirementYear(currentAge: number, retirementAge: number): number {
  const years = calculateYearsToRetire(currentAge, retirementAge);
  return new Date().getFullYear() + years;
}

/** Slider bounds for retirement age (inclusive). */
export const RETIREMENT_AGE_MIN = 32;
export const RETIREMENT_AGE_MAX = 75;

/**
 * Clamp retirement age to valid range [min, max] where min is at least currentAge + 1.
 */
export function clampRetirementAge(
  retirementAge: number,
  currentAge: number,
): number {
  const min = Math.min(RETIREMENT_AGE_MAX, Math.max(RETIREMENT_AGE_MIN, currentAge + 1));
  const max = RETIREMENT_AGE_MAX;
  return Math.min(max, Math.max(min, retirementAge));
}

/**
 * Minimum allowed retirement age given current age (for slider min).
 */
export function getRetirementAgeSliderMin(currentAge: number): number {
  return Math.min(RETIREMENT_AGE_MAX, Math.max(RETIREMENT_AGE_MIN, currentAge + 1));
}
