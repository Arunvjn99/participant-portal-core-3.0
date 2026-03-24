import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DesktopStepperProps {
  currentStepIndex: number;
  steps: readonly string[];
  /** When set, each step is a button (keyboard + hover affordances). */
  onStepClick?: (index: number) => void;
  /** Tighter nodes and labels (e.g. wizard header). */
  dense?: boolean;
  className?: string;
}

function clampIndex(index: number, length: number) {
  if (length <= 0) return 0;
  return Math.min(Math.max(index, 0), length - 1);
}

export function DesktopStepper({
  currentStepIndex,
  steps,
  onStepClick,
  dense = false,
  className,
}: DesktopStepperProps) {
  const n = steps.length;
  const safeIndex = clampIndex(currentStepIndex, n);

  const dotBase = dense
    ? "h-5 w-5 min-h-5 min-w-5 text-[10px]"
    : "h-6 w-6 min-h-6 min-w-6 text-xs";
  const iconSize = dense ? 10 : 12;
  const labelClass = dense
    ? "max-w-[5rem] text-center text-[11px] leading-tight"
    : "max-w-[6.5rem] text-center text-xs leading-tight sm:max-w-[8rem] sm:text-sm";

  if (n === 0) return null;

  const renderStepBody = (label: string, index: number) => {
    const isCompleted = index < safeIndex;
    const isCurrent = index === safeIndex;

    const circle = (
      <div
        className={cn(
          "flex items-center justify-center rounded-full font-semibold transition-all duration-300 ease-out motion-reduce:transition-none",
          dotBase,
          isCompleted && "bg-primary text-background scale-100",
          isCurrent &&
            "bg-primary text-background scale-110 ring-2 ring-primary/30 motion-safe:transition-transform",
          isCurrent &&
            onStepClick &&
            "motion-safe:group-hover:scale-[1.12]",
          !isCompleted &&
            !isCurrent &&
            "bg-transparent text-muted-foreground ring-1 ring-border/35 ring-inset scale-100 motion-safe:group-hover:ring-border/55 motion-safe:group-hover:text-foreground",
          onStepClick && !isCurrent && "motion-safe:group-hover:scale-105",
        )}
      >
        {isCompleted ? (
          <Check size={iconSize} strokeWidth={2.5} className="shrink-0" aria-hidden />
        ) : (
          <span className="tabular-nums">{index + 1}</span>
        )}
      </div>
    );

    const labelEl = (
      <span
        className={cn(
          "truncate text-center transition-colors duration-300 motion-reduce:transition-none",
          labelClass,
          isCurrent && "font-semibold text-foreground",
          isCompleted && "text-muted-foreground",
          !isCompleted && !isCurrent && "text-muted-foreground",
          onStepClick && "group-hover:text-foreground",
        )}
        title={label}
      >
        {label}
      </span>
    );

    return (
      <div className="flex flex-col items-center gap-1">
        {circle}
        {labelEl}
      </div>
    );
  };

  return (
    <div className={cn("mx-auto w-full max-w-5xl bg-transparent", className)}>
      <div className="flex w-full items-center gap-3 md:gap-4">
        {steps.map((label, index) => {
          const isLast = index === n - 1;
          const showFill = index < safeIndex;

          const clusterClass =
            "group flex min-w-0 shrink-0 flex-col items-center px-0.5";

          const cluster = onStepClick ? (
            <button
              type="button"
              onClick={() => onStepClick(index)}
              className={cn(
                clusterClass,
                "rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0",
              )}
            >
              {renderStepBody(label, index)}
            </button>
          ) : (
            <div className={clusterClass}>{renderStepBody(label, index)}</div>
          );

          return (
            <React.Fragment key={`${label}-${index}`}>
              {cluster}
              {!isLast && (
                <div
                  className="relative h-[2px] min-w-[0.5rem] flex-1 self-center overflow-hidden rounded-full bg-muted/60"
                  aria-hidden
                >
                  <div
                    className={cn(
                      "absolute inset-y-0 left-0 rounded-full bg-primary transition-all duration-300 ease-out motion-reduce:transition-none",
                      showFill ? "w-full" : "w-0",
                    )}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
