/**
 * Fixed enrollment wizard step paths. Structure is deterministic and never changes.
 * Used by EnrollmentLayout (stepper), EnrollmentFooter (Next/Back), and guards.
 */

export const ENROLLMENT_STEP_PATHS = [
  "/enrollment/choose-plan",
  "/enrollment/contribution",
  "/enrollment/auto-increase",
  "/enrollment/investments",
  "/enrollment/review",
] as const;

export type EnrollmentStepPath = (typeof ENROLLMENT_STEP_PATHS)[number];

/** Translation keys for stepper labels (fixed 5 steps). */
export const ENROLLMENT_STEP_LABEL_KEYS: Record<string, string> = {
  "/enrollment/choose-plan": "enrollment.stepperPlan",
  "/enrollment/contribution": "enrollment.stepperContribution",
  "/enrollment/auto-increase": "enrollment.stepperAutoIncrease",
  "/enrollment/investments": "enrollment.stepperInvestment",
  "/enrollment/review": "enrollment.stepperReview",
};

/**
 * 0-based step index from pathname. Uses fixed ENROLLMENT_STEP_PATHS.
 */
export function getStepIndex(pathname: string): number {
  const normalized = pathname.replace(/\/$/, "") || "/";
  const i = ENROLLMENT_STEP_PATHS.findIndex(
    (path) => normalized === path || normalized.startsWith(path + "/")
  );
  return i >= 0 ? i : 0;
}

export function isEnrollmentStepPath(pathname: string): boolean {
  const normalized = pathname.replace(/\/$/, "") || "/";
  return ENROLLMENT_STEP_PATHS.some(
    (p) => normalized === p || normalized.startsWith(p + "/")
  );
}
