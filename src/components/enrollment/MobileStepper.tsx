import { cn } from "@/lib/utils";

export interface MobileStepperProps {
  currentStepIndex: number;
  steps: readonly string[];
  /** Localized string e.g. "Step 2 of 7". */
  progressLabel: string;
  className?: string;
}

function clampIndex(index: number, length: number) {
  if (length <= 0) return 0;
  return Math.min(Math.max(index, 0), length - 1);
}

export function MobileStepper({
  currentStepIndex,
  steps,
  progressLabel,
  className,
}: MobileStepperProps) {
  const n = steps.length;
  const safeIndex = clampIndex(currentStepIndex, n);
  const currentName = steps[safeIndex] ?? "";
  const pct = n > 0 ? ((safeIndex + 1) / n) * 100 : 0;

  if (n === 0) return null;

  return (
    <div className={cn("w-full space-y-2 bg-transparent", className)}>
      <div className="flex flex-col gap-0.5">
        <p className="text-xs font-medium text-muted-foreground">{progressLabel}</p>
        <p className="text-base font-semibold leading-snug text-foreground">{currentName}</p>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted/60" aria-hidden>
        <div
          className="h-full rounded-full bg-primary transition-all duration-300 ease-out motion-reduce:transition-none"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
