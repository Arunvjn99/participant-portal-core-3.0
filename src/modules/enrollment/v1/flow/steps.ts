export const ENROLLMENT_STEPS = [
  "plan",
  "contribution",
  "source",
  "autoIncrease",
  "investment",
  "readiness",
  "review",
] as const;

export type EnrollmentStepId = (typeof ENROLLMENT_STEPS)[number];

export const ENROLLMENT_STEP_COUNT = ENROLLMENT_STEPS.length;
