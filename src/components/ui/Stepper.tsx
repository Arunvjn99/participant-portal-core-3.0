import { Check } from "lucide-react";

export interface StepperStep {
  id: number;
  label: string;
}

export interface StepperProps {
  steps: StepperStep[];
  currentStep: number;
  onStepClick?: (stepId: number) => void;
  "aria-label"?: string;
}

/** Completed: green circle + check. Active: blue circle (#2563EB) + number. Inactive: gray circle. */
export function Stepper({ steps, currentStep, onStepClick, "aria-label": ariaLabel }: StepperProps) {
  return (
    <nav
      className="flex items-center justify-center gap-2 py-3 sm:gap-4"
      role="progressbar"
      aria-valuenow={currentStep}
      aria-valuemin={1}
      aria-valuemax={steps.length}
      aria-label={ariaLabel ?? "Progress"}
    >
      {steps.map((step, index) => {
        const isCompleted = currentStep > step.id;
        const isCurrent = currentStep === step.id;
        const isClickable = onStepClick && (isCompleted || isCurrent);

        return (
          <div key={step.id} className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => isClickable && onStepClick(step.id)}
              disabled={!isClickable}
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-all sm:inline-flex ${
                isCompleted
                  ? "bg-[var(--color-success)] text-[var(--color-text-inverse)]"
                  : isCurrent
                    ? "bg-[var(--color-primary)] text-[var(--color-text-inverse)]"
                    : "bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)]"
              } ${isClickable ? "cursor-pointer hover:opacity-90" : "cursor-default"}`}
              aria-label={`Step ${step.id}: ${step.label}`}
              aria-current={isCurrent ? "step" : undefined}
            >
              {isCompleted ? <Check className="h-5 w-5" aria-hidden /> : step.id}
            </button>
            <span
              className={`hidden font-medium sm:inline-block text-xs sm:text-sm ${
                currentStep >= step.id ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-secondary)]"
              }`}
            >
              {step.label}
            </span>
            {index < steps.length - 1 && (
              <div
                className={`h-0.5 w-6 sm:w-10 shrink-0 transition-colors ${
                  isCompleted ? "bg-[var(--color-success)]" : "bg-[var(--color-border)]"
                }`}
                aria-hidden
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}
