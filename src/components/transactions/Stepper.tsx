import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type StepperStep = { id: string; label: string };

export type StepperProps = {
  steps: readonly StepperStep[];
  currentIndex: number;
  ariaLabel?: string;
};

/**
 * Horizontal stepper: completed steps show a checkmark; active step highlighted.
 */
export function Stepper({ steps, currentIndex, ariaLabel = "Transaction progress" }: StepperProps) {
  const total = steps.length;

  return (
    <nav className="tx-stepper" aria-label={ariaLabel}>
      <ol className="tx-stepper__track">
        {steps.map((step, index) => {
          const done = index < currentIndex;
          const active = index === currentIndex;
          const last = index === total - 1;

          return (
            <li
              key={step.id}
              className={cn(
                "tx-stepper__item",
                active && "tx-stepper__item--active",
                done && "tx-stepper__item--done",
              )}
            >
              <div className="tx-stepper__node-wrap">
                {!last ? (
                  <span
                    className={cn(
                      "tx-stepper__line",
                      done || active ? "tx-stepper__line--fill" : undefined,
                    )}
                    aria-hidden
                  />
                ) : null}
                <span className="tx-stepper__node" aria-current={active ? "step" : undefined}>
                  {done ? (
                    <Check className="txn-stepper-node-icon" strokeWidth={2.25} aria-hidden />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </span>
              </div>
              <span className="tx-stepper__label">{step.label}</span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
