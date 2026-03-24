import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type EnrollmentContainerProps = {
  /** Enrollment stepper (e.g. `EnrollmentHeaderWithStepper`) — pinned above scrollable content. */
  stepper?: ReactNode;
  children: ReactNode;
  /** Back / Next — pinned below scroll area so it stays visible without scrolling. */
  footer?: ReactNode;
  className?: string;
};

/**
 * V1 enrollment shell: max-w-2xl, stepper on top, dense scrollable body, non-scrolling footer.
 * Fills available height under the dashboard header when parent uses `h-full min-h-0`.
 */
export function EnrollmentContainer({
  stepper,
  children,
  footer,
  className,
}: EnrollmentContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto flex min-h-0 w-full max-w-6xl flex-col px-4",
        className,
      )}
    >
      {stepper != null ? <div className="shrink-0">{stepper}</div> : null}

      <div className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto py-2">{children}</div>

        {footer != null ? (
          <div
            className={cn(
              "shrink-0 border-t border-border bg-[var(--color-background)]",
              "pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3",
            )}
          >
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}
