import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type FigmaFlowProgressProps = {
  stepLabels: readonly string[];
  /** 1-based */
  currentStep: number;
};

/**
 * Figma-style horizontal progress: mobile bar + dots, desktop line + numbered circles / checks.
 * Fill widths use preset classes `fig-fp-m--{total}-{step}` / `fig-fp-d--{total}-{step}` (totals 4–6).
 */
export function FigmaFlowProgress({ stepLabels, currentStep }: FigmaFlowProgressProps) {
  const total = stepLabels.length;
  const safeTotal = total >= 4 && total <= 6 ? total : 6;
  const step = Math.min(Math.max(currentStep, 1), safeTotal);
  const mobileFill = `fig-fp-m--${safeTotal}-${step}`;
  const desktopFill = `fig-fp-d--${safeTotal}-${step}`;
  const currentLabel = stepLabels[step - 1] ?? "";

  return (
    <div className="fig-flow-progress">
      <div className="fig-flow-progress__mobile-head">
        <span className="fig-flow-progress__mobile-step">
          Step {step} of {safeTotal}
        </span>
        <span className="fig-flow-progress__mobile-label">{currentLabel}</span>
      </div>
      <div className="fig-flow-progress__mobile-track" aria-hidden>
        <div className={cn("fig-flow-progress__mobile-fill", mobileFill)} />
      </div>
      <div className="fig-flow-progress__mobile-dots" aria-hidden>
        {stepLabels.map((_, i) => {
          const n = i + 1;
          const done = n < step;
          const cur = n === step;
          return (
            <span
              key={n}
              className={cn(
                "fig-flow-progress__dot",
                done && "fig-flow-progress__dot--done",
                cur && "fig-flow-progress__dot--current",
              )}
            />
          );
        })}
      </div>

      <div className="fig-flow-progress__desktop">
        <div className="fig-flow-progress__line-bg" aria-hidden />
        <div className={cn("fig-flow-progress__line-fill", desktopFill)} aria-hidden />
        <div className="fig-flow-progress__nodes">
          {stepLabels.map((label, i) => {
            const n = i + 1;
            const done = n < step;
            const active = n === step;
            return (
              <div key={n} className="fig-flow-progress__node">
                <div
                  className={cn(
                    "fig-flow-progress__circle",
                    done && "fig-flow-progress__circle--done",
                    active && "fig-flow-progress__circle--active",
                  )}
                  aria-current={active ? "step" : undefined}
                >
                  {done ? <Check className="fig-flow-progress__check" strokeWidth={2.5} aria-hidden /> : <span>{n}</span>}
                </div>
                <p
                  className={cn(
                    "fig-flow-progress__node-label",
                    (active || done) && "fig-flow-progress__node-label--strong",
                  )}
                >
                  {label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
