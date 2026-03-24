import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type StepFooterProps = {
  onBack: () => void;
  onNext: () => void;
  nextLabel?: string;
  backLabel?: string;
  nextDisabled?: boolean;
  isFirstStep?: boolean;
  isLastStep?: boolean;
  className?: string;
  /** Optional center slot (e.g. Core AI FAB). Hidden on narrow viewports. */
  center?: ReactNode;
};

export function StepFooter({
  onBack,
  onNext,
  nextLabel = "Next",
  backLabel = "Back",
  nextDisabled = false,
  isFirstStep = false,
  isLastStep = false,
  className,
  center,
}: StepFooterProps) {
  return (
    <footer className={cn("footer-actions--triple", className)}>
      <div className="footer-actions__left">
        <button
          type="button"
          onClick={onBack}
          disabled={isFirstStep}
          className="btn btn-outline min-w-[6.5rem] sm:min-w-0"
        >
          {backLabel}
        </button>
      </div>
      <div className="footer-actions__center">{center ?? null}</div>
      <div className="footer-actions__right">
        <button
          type="button"
          onClick={onNext}
          disabled={nextDisabled}
          className="btn btn-primary min-w-[6.5rem] sm:min-w-0"
        >
          {isLastStep ? "Finish" : nextLabel}
        </button>
      </div>
    </footer>
  );
}
