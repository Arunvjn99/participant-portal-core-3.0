import Button from "../ui/Button";

interface TransactionFlowFooterProps {
  currentStep: number;
  totalSteps: number;
  primaryLabel: string;
  primaryDisabled?: boolean;
  onPrimary: () => void;
  onBack: () => void;
  onSaveAndExit: () => void;
  summaryText?: string;
  summaryError?: boolean;
}

/**
 * Transaction flow footer — mirrors EnrollmentFooter layout and tokens.
 * Back | (summary) | Save & Exit + Primary CTA
 */
export function TransactionFlowFooter({
  currentStep,
  totalSteps,
  primaryLabel,
  primaryDisabled = false,
  onPrimary,
  onBack,
  onSaveAndExit,
  summaryText,
  summaryError = false,
}: TransactionFlowFooterProps) {
  const isFirstStep = currentStep === 0;

  return (
    <footer
      className="transaction-flow-footer"
      role="contentinfo"
      aria-label="Transaction step actions"
    >
      <div className="transaction-flow-footer__inner">
        <div className="transaction-flow-footer__left">
          <Button
            type="button"
            onClick={onBack}
            disabled={isFirstStep}
            className="transaction-flow-footer__back"
            aria-label={isFirstStep ? "Back (disabled)" : "Back to previous step"}
          >
            Back
          </Button>
        </div>
        <div className="transaction-flow-footer__center" aria-live="polite">
          {summaryText && (
            <span
              className={`transaction-flow-footer__summary ${summaryError ? "transaction-flow-footer__summary--error" : ""}`}
            >
              {summaryText}
            </span>
          )}
        </div>
        <div className="transaction-flow-footer__right">
          <Button
            type="button"
            onClick={onSaveAndExit}
            className="transaction-flow-footer__save-exit"
          >
            Save & Exit
          </Button>
          <Button
            type="button"
            onClick={onPrimary}
            disabled={primaryDisabled}
            className="transaction-flow-footer__primary"
          >
            {primaryLabel}
          </Button>
        </div>
      </div>
    </footer>
  );
}
