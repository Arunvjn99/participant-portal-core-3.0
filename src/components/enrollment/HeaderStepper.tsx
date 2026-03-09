import * as React from "react";

const DEFAULT_STEPS = ["Plan", "Contribution", "Auto Increase", "Investment", "Review"];

const COMPLETED_BG = "var(--color-success, #10b981)";
const ACTIVE_BG = "var(--enroll-brand, #4f46e5)";
const CONNECTOR_DONE = "var(--color-success, #10b981)";
const CONNECTOR_UPCOMING = "var(--enroll-card-border, #e5e7eb)";
const LABEL_ACTIVE = "var(--enroll-text-primary, #111827)";
const LABEL_UPCOMING = "var(--enroll-text-secondary, #6b7280)";

export interface HeaderStepperProps {
  /** Current step index (0-based). */
  activeStep: number;
  /** When true, show compact "Step X of Y" instead of full labels (e.g. small screens). */
  compact?: boolean;
  /** Step labels (default: Plan, Contribution, Auto Increase, Investment, Review). Use for 6-step flow to include Readiness. */
  stepLabels?: string[];
}

function Connector({ completed }: { completed: boolean }) {
  return (
    <div
      className="header-stepper__connector"
      style={{
        backgroundColor: completed ? CONNECTOR_DONE : CONNECTOR_UPCOMING,
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
          backgroundColor: isCompleted ? COMPLETED_BG : isActive ? ACTIVE_BG : "transparent",
          borderColor: isCompleted || isActive ? "transparent" : CONNECTOR_UPCOMING,
          color: isCompleted || isActive ? "var(--color-text-inverse, #fff)" : LABEL_UPCOMING,
        }}
        aria-hidden
      >
        {isCompleted ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
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
            color: isActive ? LABEL_ACTIVE : LABEL_UPCOMING,
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
export function HeaderStepper({
  activeStep,
  compact = false,
  stepLabels = DEFAULT_STEPS,
}: HeaderStepperProps) {
  const steps = stepLabels.length > 0 ? stepLabels : DEFAULT_STEPS;
  const safeActive = Math.min(Math.max(activeStep, 0), steps.length - 1);

  return (
    <div
      className="header-stepper"
      role="progressbar"
      aria-valuenow={safeActive + 1}
      aria-valuemin={1}
      aria-valuemax={steps.length}
      aria-label={compact ? `Step ${safeActive + 1} of ${steps.length}` : undefined}
    >
      {compact ? (
        <span className="header-stepper__compact">
          Step {safeActive + 1} of {steps.length}
        </span>
      ) : (
        <div className="header-stepper__track">
          {steps.map((label, index) => {
            const status =
              index < safeActive ? "completed" : index === safeActive ? "active" : "upcoming";
            return (
              <React.Fragment key={`${label}-${index}`}>
                <StepNode
                  stepIndex={index}
                  status={status}
                  label={label}
                  compact={compact}
                />
                {index < steps.length - 1 && (
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
