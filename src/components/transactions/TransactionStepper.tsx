import { FigmaFlowProgress, type FigmaFlowProgressProps } from "./figma/FigmaFlowProgress";

export type TransactionStepperProps = FigmaFlowProgressProps;

/**
 * Horizontal stepper for transaction flows — Figma-aligned (mobile bar + dots, desktop nodes).
 */
export function TransactionStepper(props: TransactionStepperProps) {
  return (
    <div className="tx-flow-stepper">
      <FigmaFlowProgress {...props} />
    </div>
  );
}
