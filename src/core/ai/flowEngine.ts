import type { CoreAIStructuredPayload } from "./interactive/types";
import type { LocalAIResult, LocalFlowState } from "./types";
import { enrollmentFlow } from "./flows/enrollmentFlow";
import { loanFlow } from "./flows/loanFlow";
import { vestingFlow } from "./flows/vestingFlow";
import { withdrawalFlow } from "./flows/withdrawalFlow";

export function runFlow(
  state: LocalFlowState,
  input: string,
  structured: CoreAIStructuredPayload | null = null,
): LocalAIResult {
  switch (state.type) {
    case "loan":
      return loanFlow(state, input, structured);
    case "withdrawal":
      return withdrawalFlow(state, input);
    case "enrollment":
      return enrollmentFlow(state, input);
    case "vesting":
      return vestingFlow(state, input);
    default:
      return { messages: [], nextState: null };
  }
}
