/**
 * URL segments for the Zustand V1 wizard under `/v1/enrollment/<segment>`.
 * Order matches `ENROLLMENT_STEPS` in steps.ts.
 */
export const V1_WIZARD_SEGMENTS = [
  "choose-plan",
  "contribution",
  "source",
  "auto-increase",
  "investments",
  "readiness",
  "review",
] as const;

export type V1WizardSegment = (typeof V1_WIZARD_SEGMENTS)[number];

export function isV1WizardSegment(s: string): s is V1WizardSegment {
  return (V1_WIZARD_SEGMENTS as readonly string[]).includes(s);
}

export function wizardStepIndexFromSegment(
  segment: string | undefined,
): number | null {
  if (segment == null || segment === "") return null;
  const i = (V1_WIZARD_SEGMENTS as readonly string[]).indexOf(segment);
  return i >= 0 ? i : null;
}

export function segmentForWizardStep(stepIndex: number): V1WizardSegment {
  return (
    V1_WIZARD_SEGMENTS[stepIndex] ?? V1_WIZARD_SEGMENTS[0]
  );
}

export function pathForWizardStep(stepIndex: number): string {
  return `/v1/enrollment/${segmentForWizardStep(stepIndex)}`;
}
