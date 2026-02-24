import * as React from "react";

const STEPS = ["Plan", "Contribution", "Auto Increase", "Investment", "Review"];

const GREEN = "var(--color-success, #10b981)";
const PRIMARY = "var(--color-primary, #2563eb)";
const GREY_LINE = "var(--color-border, #e5e7eb)";
const GREY_LABEL = "var(--color-text-secondary, #6b7280)";
const LABEL_ACTIVE = "var(--color-text, #111827)";

export interface HeaderStepperProps {
  /** Current step index (0-based). */
  activeStep: number;
  /** When true, show compact "Step X of Y" instead of full labels (e.g. small screens). */
  compact?: boolean;
}

function Connector({ completed }: { completed: boolean }) {
  return (
    <div
      className="header-stepper__connector"
      style={{
        backgroundColor: completed ? GREEN : GREY_LINE,
      }}
      aria-hidden
    />
  );
}

function StepNode({
  stepIndex,
  status,
  label,
  compact,
}: {
  stepIndex: number;
  status: "completed" | "active" | "upcoming";
  label: string;
  compact?: boolean;
}) {
  const isCompleted = status === "completed";
  const isActive = status === "active";

  return (
    <div className="header-stepper__step">
      <div
        className="header-stepper__node"
        style={{
          backgroundColor: isCompleted ? GREEN : isActive ? PRIMARY : "transparent",
          borderColor: isCompleted || isActive ? "transparent" : GREY_LINE,
          color: isCompleted || isActive ? "var(--color-text-inverse)" : GREY_LABEL,
        }}
        aria-hidden
      >
        {isCompleted ? (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <span className="header-stepper__node-num">{stepIndex + 1}</span>
        )}
      </div>
      {!compact && (
        <span
          className="header-stepper__label"
          style={{
            color: isActive ? LABEL_ACTIVE : GREY_LABEL,
            fontWeight: isActive ? 600 : 400,
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
}

/**
 * DealShip-style header stepper: horizontal, small circles, thin connectors.
 * Completed = green + check; Active = primary + number; Upcoming = grey outline.
 * Labels inline; non-clickable; flat, no gradients/shadows.
 */
export function HeaderStepper({ activeStep, compact = false }: HeaderStepperProps) {
  const safeActive = Math.min(Math.max(activeStep, 0), STEPS.length - 1);

  return (
    <div
      className="header-stepper"
      role="progressbar"
      aria-valuenow={safeActive + 1}
      aria-valuemin={1}
      aria-valuemax={STEPS.length}
      aria-label={compact ? `Step ${safeActive + 1} of ${STEPS.length}` : undefined}
    >
      {compact ? (
        <span className="header-stepper__compact">
          Step {safeActive + 1} of {STEPS.length}
        </span>
      ) : (
        <div className="header-stepper__track">
          {STEPS.map((label, index) => {
            const status =
              index < safeActive ? "completed" : index === safeActive ? "active" : "upcoming";
            return (
              <React.Fragment key={label}>
                <StepNode
                  stepIndex={index}
                  status={status}
                  label={label}
                  compact={compact}
                />
                {index < STEPS.length - 1 && (
                  <Connector completed={index < safeActive} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
}
