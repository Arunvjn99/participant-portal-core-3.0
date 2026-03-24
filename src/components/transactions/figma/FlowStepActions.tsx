import { ArrowLeft, ArrowRight } from "lucide-react";

export type FlowStepActionsProps = {
  backLabel?: string;
  nextLabel: string;
  onBack: () => void;
  onNext: () => void;
  nextDisabled?: boolean;
  isSubmitting?: boolean;
};

/**
 * Figma-aligned CTA row: secondary left, primary right.
 */
export function FlowStepActions({
  backLabel = "Back",
  nextLabel,
  onBack,
  onNext,
  nextDisabled,
  isSubmitting,
}: FlowStepActionsProps) {
  return (
    <div className="fig-flow-actions">
      <button type="button" className="btn btn-outline" onClick={onBack}>
        <ArrowLeft className="txn-icon--16" strokeWidth={2} aria-hidden />
        {backLabel}
      </button>
      <button type="button" className="btn btn-primary" onClick={onNext} disabled={nextDisabled || isSubmitting}>
        {isSubmitting ? "Submitting…" : nextLabel}
        {!isSubmitting ? <ArrowRight className="txn-icon--16" strokeWidth={2} aria-hidden /> : null}
      </button>
    </div>
  );
}
