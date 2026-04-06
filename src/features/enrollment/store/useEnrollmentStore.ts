/**
 * Re-export the canonical V1 enrollment store so that rebuilt V2 step
 * components share the same Zustand instance as the V1 wizard layout.
 *
 * The V1 store shape (`EnrollmentV1Snapshot`) is structurally identical to
 * the V2 `EnrollmentSnapshot` type — same fields, same types.  By re-exporting
 * we avoid two separate persisted stores fighting over the same user state.
 */
export {
  useEnrollmentStore,
} from "@/modules/enrollment/v1/store/useEnrollmentStore";

export type {
  EnrollmentV1Store as EnrollmentStore,
} from "@/modules/enrollment/v1/store/useEnrollmentStore";

export const STEP_SEGMENTS = [
  "plan", "contribution", "source", "auto-increase",
  "investment", "readiness", "review",
] as const;

export type StepSegment = (typeof STEP_SEGMENTS)[number];

export const STEP_COUNT = 7;
