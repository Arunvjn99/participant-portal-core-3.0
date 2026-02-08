import { ParticipantState } from "./participantState";
import { Step } from "./steps";

export function resolveNextStep(state: ParticipantState): Step {
  if (state.currentStep === "GREETING") {
    return "PLAN_SELECTION";
  }

  if (!state.planId) {
    return "PLAN_SELECTION";
  }

  if (!state.contribution?.type) {
    return "CONTRIBUTION_TYPE";
  }

  if (!state.contribution?.value) {
    return "CONTRIBUTION_VALUE";
  }

  if (!state.investment?.mode) {
    return "INVESTMENT_MODE";
  }

  return "SUMMARY";
}
