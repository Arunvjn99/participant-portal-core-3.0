import { assistantMessage } from "../messageUtils";
import type { LocalAIResult, LocalFlowState } from "../types";

export function withdrawalFlow(state: LocalFlowState, input: string): LocalAIResult {
  const step = state.step;

  if (step === 0) {
    return {
      messages: [
        assistantMessage(
          "Withdrawals depend on plan rules, your age, and tax treatment. What kind of amount are you thinking about (for example, a dollar amount or “estimate”)?",
        ),
      ],
      nextState: { type: "withdrawal", step: 1, context: {} },
    };
  }

  if (step === 1) {
    return {
      messages: [
        assistantMessage(
          `Thanks — I’ve noted **${input.trim()}**. Want to open the withdrawal flow in the app? (Reply **yes** or **no**.)`,
        ),
      ],
      nextState: { type: "withdrawal", step: 2, context: { ...state.context, note: input.trim() } },
    };
  }

  if (step === 2) {
    const t = input.trim();
    if (/^(yes|yeah|yep|sure|ok|okay|proceed|please|open|go|start)/i.test(t)) {
      return {
        messages: [assistantMessage("Opening withdrawals for you now.")],
        nextState: null,
        action: "OPEN_WITHDRAWAL_FLOW",
      };
    }
    if (/^(no|nope|cancel|stop|never mind|not now)/i.test(t)) {
      return {
        messages: [assistantMessage("Understood. You can explore withdrawals anytime from Transactions.")],
        nextState: null,
      };
    }
    return {
      messages: [assistantMessage("Reply **yes** to open withdrawals, or **no** to cancel.")],
      nextState: { type: "withdrawal", step: 2, context: state.context },
    };
  }

  return { messages: [], nextState: null };
}
