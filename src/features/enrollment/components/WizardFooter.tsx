import { ArrowLeft, ArrowRight } from "lucide-react";

type Props = {
  onBack: () => void;
  onNext: () => void;
  backDisabled?: boolean;
  nextDisabled?: boolean;
  nextLabel?: string;
};

export function WizardFooter({
  onBack,
  onNext,
  backDisabled,
  nextDisabled,
  nextLabel = "Continue",
}: Props) {
  return (
    <footer className="ew-footer">
      <button
        type="button"
        className="ew-footer__btn ew-footer__btn--back"
        onClick={onBack}
        disabled={backDisabled}
      >
        <ArrowLeft size={16} />
        <span>Back</span>
      </button>

      <button
        type="button"
        className="ew-footer__btn ew-footer__btn--next"
        onClick={onNext}
        disabled={nextDisabled}
      >
        <span>{nextLabel}</span>
        <ArrowRight size={16} />
      </button>
    </footer>
  );
}
