import type { EnrollmentV1Snapshot } from "../store/useEnrollmentStore";
import { ENROLLMENT_STEPS } from "./steps";

function sourcesTotal(s: EnrollmentV1Snapshot["contributionSources"]) {
  return s.preTax + s.roth + s.afterTax;
}

export function isEnrollmentStepValid(
  stepIndex: number,
  state: EnrollmentV1Snapshot,
): boolean {
  const id = ENROLLMENT_STEPS[stepIndex];
  if (id == null) return false;

  switch (id) {
    case "plan":
      return state.selectedPlan != null;
    case "contribution":
      return state.contribution >= 1 && state.contribution <= 25;
    case "source": {
      const t = sourcesTotal(state.contributionSources);
      return Math.abs(t - 100) < 0.001;
    }
    case "autoIncrease":
      if (!state.autoIncreaseStepResolved) return false;
      if (!state.autoIncrease) return true;
      return (
        state.autoIncreaseRate > 0 &&
        state.autoIncreaseRate <= 3 &&
        state.autoIncreaseMax >= 10 &&
        state.autoIncreaseMax <= 15
      );
    case "investment":
      return state.riskLevel != null;
    case "readiness":
      return true;
    case "review":
      return state.agreedToTerms;
    default:
      return false;
  }
}
