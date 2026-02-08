import { Step } from "./steps";

export function getStepMessageIntent(step: Step): string {
  switch (step) {
    case "GREETING":
      return "Greet the user and explain you will guide enrollment";
    case "PLAN_SELECTION":
      return "Ask the user to choose a retirement plan";
    case "CONTRIBUTION_TYPE":
      return "Ask whether contribution is percentage or flat";
    case "CONTRIBUTION_VALUE":
      return "Ask for the contribution value";
    case "INVESTMENT_MODE":
      return "Ask to choose default, manual, or advisor";
    case "SUMMARY":
      return "Explain you will show a summary and ask for confirmation";
    case "CONFIRMATION":
      return "Confirm enrollment completion";
  }
}
