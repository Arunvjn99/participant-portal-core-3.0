import type { CoreAIInteractiveMessageType, CoreAIStructuredPayload } from "@/core/ai/interactive/types";
import type {
  DocumentUploadCardPayload,
  FeesCardPayload,
  LoanSimulatorCardPayload,
  ReviewCardPayload,
  SelectionCardPayload,
} from "@/core/ai/interactive/types";
import { DocumentUploadCard } from "./DocumentUploadCard";
import { FeesCard } from "./FeesCard";
import { LoanSimulatorCard } from "./LoanSimulatorCard";
import { ReviewCard } from "./ReviewCard";
import { SelectionCard } from "./SelectionCard";

export interface CoreAiInteractiveHostProps {
  type: CoreAIInteractiveMessageType;
  payload: unknown;
  onStructuredAction: (payload: CoreAIStructuredPayload) => void;
}

export function CoreAiInteractiveHost({ type, payload, onStructuredAction }: CoreAiInteractiveHostProps) {
  switch (type) {
    case "loan_simulator_card":
      return <LoanSimulatorCard payload={payload as LoanSimulatorCardPayload} onAction={onStructuredAction} />;
    case "selection_card":
      return <SelectionCard payload={payload as SelectionCardPayload} onAction={onStructuredAction} />;
    case "fees_card":
      return <FeesCard payload={payload as FeesCardPayload} onAction={onStructuredAction} />;
    case "document_upload_card":
      return <DocumentUploadCard payload={payload as DocumentUploadCardPayload} onAction={onStructuredAction} />;
    case "review_card":
      return <ReviewCard payload={payload as ReviewCardPayload} onAction={onStructuredAction} />;
    default:
      return null;
  }
}
