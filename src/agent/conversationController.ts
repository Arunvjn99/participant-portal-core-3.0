import { ParticipantState } from "./participantState";
import { resolveNextStep } from "./resolveNextStep";

export function handleUserInput(
  state: ParticipantState,
  input: string
): {
  updatedState: ParticipantState;
  error?: string;
} {
  switch (state.currentStep) {
    case "PLAN_SELECTION": {
      const trimmedInput = input.trim();
      if (!trimmedInput) {
        return {
          updatedState: state,
          error: "Plan selection cannot be empty",
        };
      }

      const updatedState: ParticipantState = {
        ...state,
        planId: trimmedInput,
        currentStep: resolveNextStep({
          ...state,
          planId: trimmedInput,
        }),
      };

      return { updatedState };
    }

    case "CONTRIBUTION_TYPE": {
      const trimmedInput = input.trim().toLowerCase();
      if (trimmedInput !== "percentage" && trimmedInput !== "flat") {
        return {
          updatedState: state,
          error: 'Contribution type must be "percentage" or "flat"',
        };
      }

      const contributionType = trimmedInput as "percentage" | "flat";
      const updatedState: ParticipantState = {
        ...state,
        contribution: {
          ...state.contribution,
          type: contributionType,
          value: state.contribution?.value ?? 0,
        },
        currentStep: resolveNextStep({
          ...state,
          contribution: {
            ...state.contribution,
            type: contributionType,
            value: state.contribution?.value ?? 0,
          },
        }),
      };

      return { updatedState };
    }

    case "CONTRIBUTION_VALUE": {
      const trimmedInput = input.trim();
      const numericValue = Number(trimmedInput);

      if (isNaN(numericValue) || numericValue <= 0 || numericValue > 50) {
        return {
          updatedState: state,
          error: "Contribution value must be a number greater than 0 and less than or equal to 50",
        };
      }

      const updatedState: ParticipantState = {
        ...state,
        contribution: {
          ...state.contribution!,
          value: numericValue,
        },
        currentStep: resolveNextStep({
          ...state,
          contribution: {
            ...state.contribution!,
            value: numericValue,
          },
        }),
      };

      return { updatedState };
    }

    case "INVESTMENT_MODE": {
      const trimmedInput = input.trim().toLowerCase();
      if (
        trimmedInput !== "default" &&
        trimmedInput !== "manual" &&
        trimmedInput !== "advisor"
      ) {
        return {
          updatedState: state,
          error: 'Investment mode must be "default", "manual", or "advisor"',
        };
      }

      const investmentMode = trimmedInput as "default" | "manual" | "advisor";
      const updatedState: ParticipantState = {
        ...state,
        investment: {
          ...state.investment,
          mode: investmentMode,
        },
        currentStep: resolveNextStep({
          ...state,
          investment: {
            ...state.investment,
            mode: investmentMode,
          },
        }),
      };

      return { updatedState };
    }

    case "GREETING":
    case "SUMMARY":
    case "CONFIRMATION":
    default:
      return {
        updatedState: state,
        error: `Input not expected at step: ${state.currentStep}`,
      };
  }
}
