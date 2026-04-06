import type { EnrollmentSnapshot, EnrollmentStepId } from "../types";

const STEPS: EnrollmentStepId[] = [
  "plan", "contribution", "source", "autoIncrease",
  "investment", "readiness", "review",
];

export function isStepValid(
  stepIndex: number,
  state: EnrollmentSnapshot,
): boolean {
  const id = STEPS[stepIndex];
  if (!id) return false;

  switch (id) {
    case "plan":
      return state.selectedPlan != null;
    case "contribution":
      return state.contribution >= 1 && state.contribution <= 25;
    case "source": {
      const total = state.contributionSources.preTax +
        state.contributionSources.roth +
        state.contributionSources.afterTax;
      return Math.abs(total - 100) < 0.001;
    }
    case "autoIncrease":
      if (!state.autoIncrease) return state.autoIncreaseStepResolved;
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

export function getStepErrors(
  stepIndex: number,
  state: EnrollmentSnapshot,
): string[] {
  const id = STEPS[stepIndex];
  if (!id) return ["Unknown step"];
  const errors: string[] = [];

  switch (id) {
    case "plan":
      if (!state.selectedPlan) errors.push("Please select a plan type");
      break;
    case "contribution":
      if (state.contribution < 1) errors.push("Contribution must be at least 1%");
      if (state.contribution > 25) errors.push("Contribution cannot exceed 25%");
      break;
    case "source": {
      const total = state.contributionSources.preTax +
        state.contributionSources.roth +
        state.contributionSources.afterTax;
      if (Math.abs(total - 100) >= 0.001)
        errors.push("Source allocations must total 100%");
      break;
    }
    case "autoIncrease":
      if (state.autoIncrease) {
        if (state.autoIncreaseRate <= 0 || state.autoIncreaseRate > 3)
          errors.push("Annual increase must be between 0.5% and 3%");
        if (state.autoIncreaseMax < 10 || state.autoIncreaseMax > 15)
          errors.push("Maximum contribution must be between 10% and 15%");
      } else if (!state.autoIncreaseStepResolved) {
        errors.push("Please choose to enable or skip auto-increase");
      }
      break;
    case "investment":
      if (!state.riskLevel) errors.push("Please select an investment strategy");
      break;
    case "review":
      if (!state.agreedToTerms) errors.push("You must agree to the terms to continue");
      break;
  }
  return errors;
}
