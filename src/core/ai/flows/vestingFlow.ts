import { assistantMessage } from "../messageUtils";
import type { LocalAIResult, LocalFlowState } from "../types";

export function vestingFlow(state: LocalFlowState, input: string): LocalAIResult {
  const step = state.step;

  if (step === 0) {
    return {
      messages: [
        assistantMessage(
          "**Vested** money is yours to keep under plan rules, even if you leave your employer. Employer contributions often vest over a schedule (cliff or graded). Want to view balances on your dashboard?",
        ),
      ],
      nextState: { type: "vesting", step: 1, context: {} },
    };
  }

  if (step === 1) {
    const t = input.trim();
    if (/^(yes|yeah|yep|sure|ok|okay|show|open|go)/i.test(t)) {
      return {
        messages: [assistantMessage("Opening your dashboard.")],
        nextState: null,
        navigate: "/dashboard",
      };
    }
    if (/^(no|nope|not now|cancel)/i.test(t)) {
      return {
        messages: [assistantMessage("Alright. You can check balances anytime from the dashboard.")],
        nextState: null,
      };
    }
    return {
      messages: [assistantMessage("Reply **yes** to open the dashboard, or **no** to stay here.")],
      nextState: { type: "vesting", step: 1, context: state.context },
    };
  }

  return { messages: [], nextState: null };
}
