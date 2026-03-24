import { FlowStepActions, type FlowStepActionsProps } from "./figma/FlowStepActions";

export type TransactionFooterProps = FlowStepActionsProps;

/**
 * Sticky-style CTA row for flow steps — secondary back, primary next (Figma-aligned).
 */
export function TransactionFooter(props: FlowStepActionsProps) {
  return (
    <div className="tx-flow-footer">
      <FlowStepActions {...props} />
    </div>
  );
}
