/**
 * Enrollment V2 step paths — 6 steps including readiness.
 * Order matches wizard flow; do not reorder without updating stepper and footer.
 * Does NOT replace or modify src/enrollment/enrollmentStepPaths.ts.
 */

export const ENROLLMENT_V2_STEP_PATHS = [
  "/enrollment-v2/choose-plan",
  "/enrollment-v2/contribution",
  "/enrollment-v2/auto-increase",
  "/enrollment-v2/investment",
  "/enrollment-v2/readiness",
  "/enrollment-v2/review",
] as const;

export type EnrollmentV2StepPath = (typeof ENROLLMENT_V2_STEP_PATHS)[number];

/** i18n keys for V2 stepper labels (6 steps). */
export const ENROLLMENT_V2_STEP_LABEL_KEYS: Record<string, string> = {
  "/enrollment-v2/choose-plan": "enrollment.stepperPlan",
  "/enrollment-v2/contribution": "enrollment.stepperContribution",
  "/enrollment-v2/auto-increase": "enrollment.stepperAutoIncrease",
  "/enrollment-v2/investment": "enrollment.stepperInvestment",
  "/enrollment-v2/readiness": "enrollment.stepperReadiness",
  "/enrollment-v2/review": "enrollment.stepperReview",
};

function normalizePath(pathname: string): string {
  return pathname.replace(/\/$/, "") || "/";
}

/** 0-based step index for V2 pathname. */
export function getV2StepIndex(pathname: string): number {
  const normalized = normalizePath(pathname);
  const i = ENROLLMENT_V2_STEP_PATHS.findIndex(
    (p) => normalized === p || normalized.startsWith(p + "/")
  );
  return i >= 0 ? i : 0;
}

export function isEnrollmentV2Path(pathname: string): boolean {
  const normalized = normalizePath(pathname);
  return ENROLLMENT_V2_STEP_PATHS.some(
    (p) => normalized === p || normalized.startsWith(p + "/")
  );
}

/** Generic step index from pathname and path list (for footer reuse). */
export function getStepIndexForPaths(
  pathname: string,
  paths: readonly string[]
): number {
  const normalized = normalizePath(pathname);
  const i = paths.findIndex(
    (p) => normalized === p || normalized.startsWith(p + "/")
  );
  return i >= 0 ? i : 0;
}
