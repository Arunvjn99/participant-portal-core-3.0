import { Check } from "lucide-react";

type Props = {
  steps: string[];
  currentStep: number;
  onStepClick: (index: number) => void;
};

export function StepIndicator({ steps, currentStep, onStepClick }: Props) {
  return (
    <nav className="ew-stepper" aria-label="Enrollment progress">
      <ol className="ew-stepper__list">
        {steps.map((label, i) => {
          const isCompleted = i < currentStep;
          const isCurrent = i === currentStep;
          const isClickable = i < currentStep;

          return (
            <li key={label} className="ew-stepper__item">
              {i > 0 && (
                <div
                  className={`ew-stepper__connector ${isCompleted ? "ew-stepper__connector--done" : ""}`}
                  aria-hidden
                />
              )}
              <button
                type="button"
                className={`ew-stepper__dot ${
                  isCurrent ? "ew-stepper__dot--active" : ""
                } ${isCompleted ? "ew-stepper__dot--done" : ""}`}
                onClick={() => isClickable && onStepClick(i)}
                disabled={!isClickable}
                aria-current={isCurrent ? "step" : undefined}
                aria-label={`${label}${isCompleted ? " (completed)" : isCurrent ? " (current)" : ""}`}
              >
                {isCompleted ? (
                  <Check size={14} strokeWidth={3} />
                ) : (
                  <span>{i + 1}</span>
                )}
              </button>
              <span
                className={`ew-stepper__label ${
                  isCurrent ? "ew-stepper__label--active" : ""
                } ${isCompleted ? "ew-stepper__label--done" : ""}`}
              >
                {label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
