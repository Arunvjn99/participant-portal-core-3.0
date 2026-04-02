import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type EnrollmentContainerProps = {
  /** Enrollment stepper (e.g. `EnrollmentHeaderWithStepper`) — pinned above scrollable content. */
  stepper?: ReactNode;
  children: ReactNode;
  /** Back / Next — pinned below scroll area so it stays visible without scrolling. */
  footer?: ReactNode;
  className?: string;
  /** Extra classes on the scrollable body (e.g. horizontal padding inside wizard card). */
  contentClassName?: string;
  /** Figma wizard footer bar (tint + top border) vs default dashboard border. */
  footerSurface?: "default" | "wizard";
  /** When true, show a top border above Back/Next. Default off for a cleaner bar. */
  footerTopBorder?: boolean;
};

/**
 * V1 enrollment shell: max-w-5xl (Figma column width), stepper + dense body + footer.
 * Fills available height under the dashboard header when parent uses `h-full min-h-0`.
 */
export function EnrollmentContainer({
  stepper,
  children,
  footer,
  className,
  contentClassName,
  footerSurface = "default",
  footerTopBorder = false,
}: EnrollmentContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto flex min-h-0 w-full min-w-0 max-w-5xl flex-col px-4 sm:px-6",
        className,
      )}
    >
      {stepper != null ? <div className="shrink-0">{stepper}</div> : null}

      <div className="flex min-h-0 flex-1 flex-col">
        <div
          className={cn(
            "min-h-0 min-w-0 flex-1 overflow-y-auto py-1 [overflow-wrap:anywhere]",
            contentClassName,
          )}
        >
          {children}
        </div>

        {footer != null ? (
          <div
            className={cn(
              "shrink-0",
              footerSurface === "wizard"
                ? "enrollment-wizard-footer-bar"
                : cn(
                    "enrollment-footer-slot bg-background pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3",
                    footerTopBorder && "border-t border-border",
                  ),
            )}
          >
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}
