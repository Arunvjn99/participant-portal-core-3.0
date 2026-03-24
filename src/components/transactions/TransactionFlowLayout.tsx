import type { ReactNode } from "react";
import { TransactionHeader } from "./TransactionHeader";
import { TransactionStepper } from "./TransactionStepper";

export type TransactionFlowLayoutProps = {
  flowTitle: string;
  stepLabels: readonly string[];
  currentStep: number;
  onExit: () => void;
  brandIcon: ReactNode;
  exitAriaLabel?: string;
  children: ReactNode;
};

/**
 * Shared shell for every transaction sub-flow — matches Figma dump structure (header + stepper + main).
 */
export function TransactionFlowLayout({
  flowTitle,
  stepLabels,
  currentStep,
  onExit,
  brandIcon,
  exitAriaLabel,
  children,
}: TransactionFlowLayoutProps) {
  return (
    <div className="fig-tx-shell tx-flow-root">
      <TransactionHeader
        flowTitle={flowTitle}
        currentStep={currentStep}
        totalSteps={stepLabels.length}
        onExit={onExit}
        brandIcon={brandIcon}
        exitAriaLabel={exitAriaLabel}
      />
      <div className="fig-tx-shell__progress-band tx-flow-stepper-band">
        <div className="fig-tx-shell__progress-inner tx-flow-stepper-inner">
          <TransactionStepper stepLabels={stepLabels} currentStep={currentStep} />
        </div>
      </div>
      <main className="tx-flow-main">{children}</main>
    </div>
  );
}
