/**
 * Interactive Core AI message kinds — rendered as inline UI in the chat stream.
 * Payloads are JSON-serializable (built in flow layer, consumed by React cards).
 */
export type CoreAIInteractiveMessageType =
  | "loan_simulator_card"
  | "selection_card"
  | "fees_card"
  | "document_upload_card"
  | "review_card";

/** User → flow: structured actions from cards (no network). */
export type CoreAIStructuredPayload =
  | { action: "loan_simulator_continue"; amount: number; tenureMonths: number }
  | { action: "selection_card_pick"; value: "eft" | "check"; label: string }
  | { action: "fees_card_continue" }
  | { action: "document_upload_card_continue"; deferred?: boolean }
  | { action: "review_card_submit" };

export type LoanSimulatorCardPayload = {
  amount: number;
  minAmount: number;
  maxAmount: number;
  annualRatePercent: number;
  tenureMonths: number;
  minTenureMonths: number;
  maxTenureMonths: number;
  tenureStep: number;
  amountStep?: number;
};

export type SelectionCardPayload = {
  title: string;
  subtitle?: string;
  options: { label: string; value: "eft" | "check" }[];
};

export type FeesCardPayload = {
  title: string;
  processingFee: number;
  otherCharges: number;
  principal: number;
  netAmount: number;
  disbursementLabel: string;
};

export type DocumentUploadCardPayload = {
  title: string;
  items: string[];
  helper?: string;
};

export type ReviewCardPayload = {
  title: string;
  amount: number;
  netAmount: number;
  tenureMonths: number;
  monthlyPayment: number;
  annualRatePercent: number;
  disbursementLabel: string;
};

export function formatStructuredUserLine(payload: CoreAIStructuredPayload): string {
  switch (payload.action) {
    case "loan_simulator_continue":
      return `Loan preview: $${payload.amount.toLocaleString()} · ${payload.tenureMonths} mo`;
    case "selection_card_pick":
      return payload.label;
    case "fees_card_continue":
      return "Continue to documents";
    case "document_upload_card_continue":
      return payload.deferred ? "I'll upload documents later" : "Ready to review";
    case "review_card_submit":
      return "Submit loan application";
  }
}
