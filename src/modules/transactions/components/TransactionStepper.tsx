import { cn } from "@/lib/utils";

export type TransactionStepperProps = {
  stepLabels: string[];
  currentStep: number;
  totalSteps: number;
};

/**
 * Horizontal stepper with connector segments — scrollable on small viewports.
 */
export function TransactionStepper({ stepLabels, currentStep, totalSteps }: TransactionStepperProps) {
  return (
    <nav className="tx-stepper" aria-label="Transaction progress">
      <ol className="tx-stepper__track">
        {stepLabels.map((label, index) => {
          const done = index < currentStep;
          const active = index === currentStep;
          const last = index === totalSteps - 1;
          return (
            <li key={label} className={cn("tx-stepper__item", active && "tx-stepper__item--active", done && "tx-stepper__item--done")}>
              <div className="tx-stepper__node-wrap">
                {!last ? <span className={cn("tx-stepper__line", done || active ? "tx-stepper__line--fill" : "")} aria-hidden /> : null}
                <span className="tx-stepper__node" aria-current={active ? "step" : undefined}>
                  {index + 1}
                </span>
              </div>
              <span className="tx-stepper__label">{label}</span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
