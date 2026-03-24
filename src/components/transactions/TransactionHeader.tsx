import { X } from "lucide-react";
import type { ReactNode } from "react";

export type TransactionShellHeaderProps = {
  flowTitle: string;
  currentStep: number;
  totalSteps: number;
  onExit: () => void;
  brandIcon: ReactNode;
  exitAriaLabel?: string;
};

/**
 * Sticky shell header for all versioned transaction flows (Figma dump: loan / withdraw / transfer / rebalance / rollover).
 */
export function TransactionHeader({
  flowTitle,
  currentStep,
  totalSteps,
  onExit,
  brandIcon,
  exitAriaLabel = "Close",
}: TransactionShellHeaderProps) {
  return (
    <header className="fig-tx-shell__header tx-flow-header">
      <div className="fig-tx-shell__header-inner tx-flow-header__inner">
        <div className="fig-tx-shell__brand">
          <div className="fig-tx-shell__brand-icon" aria-hidden>
            {brandIcon}
          </div>
          <div>
            <p className="fig-tx-shell__title">{flowTitle}</p>
            <p className="fig-tx-shell__meta">
              Step {currentStep} of {totalSteps}
            </p>
          </div>
        </div>
        <button type="button" className="fig-tx-shell__close" onClick={onExit} aria-label={exitAriaLabel}>
          <X className="txn-icon--16" strokeWidth={2} aria-hidden />
        </button>
      </div>
    </header>
  );
}
