import { buildResponse } from "./responseBuilder";
import { resolveIntent } from "./intentResolver";
import { assistantMessage } from "./messageUtils";
import { runFlow } from "./flowEngine";
import type { CoreAIStructuredPayload } from "./interactive/types";
import type { LocalAIResult, LocalFlowState } from "./types";
import { parseLoanInput } from "./utils/parseLoanInput";

const FALLBACK_SUGGESTIONS = [
  "Apply for a loan",
  "Withdraw money",
  "Start enrollment",
  "What is my vested balance?",
];

/**
 * Deterministic local “AI”: scripted flows, search scenarios, navigation, and actions.
 * No network calls.
 */
export function handleLocalAI(
  input: string,
  flowState: LocalFlowState | null,
  structured: CoreAIStructuredPayload | null = null,
): LocalAIResult {
  if (structured) {
    if (!flowState?.type) {
      return { messages: [], nextState: flowState };
    }
    return runFlow(flowState, "", structured);
  }

  const trimmed = input.trim();
  if (!trimmed) {
    return { messages: [], nextState: flowState };
  }

  if (/^(cancel|stop|never mind|forget it)\b/i.test(trimmed)) {
    return {
      messages: [assistantMessage("No problem — ask me anything about your plan when you’re ready.")],
      nextState: null,
    };
  }

  if (flowState?.type) {
    return runFlow(flowState, trimmed, null);
  }

  /* Discovery: “apply loan”, “loan options”, “take a loan” — no amount required */
  const loanDiscovery =
    /\b(apply|take|get|need)\s+(a\s+)?loan\b|\bloan\s+options?\b|\bhow\s+(do|can)\s+i\s+borrow\b|\bcan\s+i\s+take\s+(?:out\s+)?(?:a\s+)?loan\b/i.test(
      trimmed,
    );
  if (loanDiscovery) {
    return runFlow({ type: "loan", step: 0, context: {} }, trimmed, null);
  }

  /* Amount + loan language, or amount + non-general purpose (e.g. “7000 for medical”) */
  const parsedLoan = parseLoanInput(trimmed);
  if (
    parsedLoan.amount != null &&
    (/\b(loan|borrow|401\s*k|lending|lend)\b/i.test(trimmed) ||
      (parsedLoan.purpose !== "general" && !/\b(contribution|deferral|enroll|withdraw|distribution)\b/i.test(trimmed)))
  ) {
    return runFlow({ type: "loan", step: 0, context: {} }, trimmed, null);
  }

  const intent = resolveIntent(trimmed);

  if (intent.kind === "flow") {
    return runFlow({ type: intent.flow, step: 0, context: {} }, trimmed, null);
  }

  if (intent.kind === "answer") {
    return buildResponse(intent);
  }

  if (intent.kind === "navigate" || intent.kind === "action") {
    return buildResponse(intent);
  }

  return {
    messages: [
      assistantMessage(
        "I can help with **loans**, **withdrawals**, **enrollment**, **vesting**, contributions, and common plan questions. What would you like to do?",
        { suggestions: FALLBACK_SUGGESTIONS },
      ),
    ],
    nextState: null,
  };
}
