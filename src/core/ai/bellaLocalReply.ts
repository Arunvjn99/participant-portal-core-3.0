import { resolveIntent } from "./intentResolver";

const FALLBACK =
  "I can help with enrollment, loans, withdrawals, and vesting using on-screen steps. For anything else, try the **Ask Core AI** button on the main experience for scripted plan answers.";

/**
 * One-shot text for Bella when no in-app Bella flow is active — no shared flow state with Core AI modal.
 */
export function getLocalAssistantReply(input: string): string {
  const intent = resolveIntent(input.trim());
  switch (intent.kind) {
    case "answer":
      return intent.content;
    case "navigate":
      return "That topic usually lives in a specific screen in your portal. Use search or the main menu to open the matching section (for example dashboard, transactions, or profile).";
    case "action":
      return "You can start that workflow from **Transactions** or **Enrollment** in the main app, depending on the task.";
    case "flow":
      return "For a short guided chat on that topic, open **Ask Core AI** from the floating button. Here I’ll keep helping with the voice and card flows on this screen.";
    case "fallback":
    default:
      return FALLBACK;
  }
}
