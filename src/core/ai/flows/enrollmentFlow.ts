import { assistantMessage } from "../messageUtils";
import type { LocalAIResult, LocalFlowState } from "../types";

export function enrollmentFlow(state: LocalFlowState, input: string): LocalAIResult {
  const step = state.step;

  if (step === 0) {
    return {
      messages: [
        assistantMessage(
          "Enrollment is where you choose your plan, contributions, and investments. When you’re ready, say **start** to open the guided enrollment experience.",
        ),
      ],
      nextState: { type: "enrollment", step: 1, context: {} },
    };
  }

  if (step === 1) {
    const t = input.trim();
    if (/^(start|yes|yeah|ok|okay|go|begin|open|proceed)/i.test(t)) {
      return {
        messages: [assistantMessage("Opening enrollment for you now.")],
        nextState: null,
        navigate: "/enrollment",
      };
    }
    return {
      messages: [assistantMessage("Say **start** when you want to open enrollment in the app.")],
      nextState: { type: "enrollment", step: 1, context: state.context },
    };
  }

  return { messages: [], nextState: null };
}
