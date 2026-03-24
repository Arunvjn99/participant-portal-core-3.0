import type { ChatMessage } from "@/components/core-ai/MessageBubble";

/** Scripted multi-step flows inside Core AI (local only). */
export type LocalFlowType = "loan" | "withdrawal" | "enrollment" | "vesting";

export interface LocalFlowState {
  type: LocalFlowType;
  step: number;
  context: Record<string, unknown>;
}

export type ResolvedIntent =
  | { kind: "flow"; flow: LocalFlowType }
  | { kind: "answer"; content: string; title?: string }
  | { kind: "action"; action: string }
  | { kind: "navigate"; route: string }
  | { kind: "fallback" };

/** Prefill payload when user taps “Apply now” after AI eligibility (CoreAssistantModal applies before navigate). */
export type LoanApplyPayload = {
  amount: number;
  purpose: string | null;
  loanType: string;
};

export interface LocalAIResult {
  messages: ChatMessage[];
  nextState: LocalFlowState | null;
  /** Registered in `buildActionHandlers` (e.g. OPEN_LOAN_FLOW). */
  action?: string;
  /** App route — modal applies `withVersionIfEnrollment`. */
  navigate?: string;
  /** When set with eligible loan CTA, modal calls `useLoanStore.initializeLoan` before navigation. */
  loanApplyPayload?: LoanApplyPayload;
}

/** `ChatMessage.primaryAction.route` sentinel — handled in CoreAssistantModal (versioned loan configuration). */
export const CORE_AI_LOAN_APPLY_ROUTE = "coreai:loan-configuration";
