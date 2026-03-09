import type { PersonalizationStep } from "../types";
import { PERSONALIZATION_STEPS } from "../types";
import { usePersonalizationWizard } from "../context/PersonalizationWizardContext";
import { CheckIcon } from "./icons";

const STEP_LABELS: Record<PersonalizationStep, string> = {
  age: "Age",
  location: "Location",
  savings: "Savings",
};

export function WizardSteps() {
  const { state, goToStep, stepIndex } = usePersonalizationWizard();

  return (
    <nav className="personalization-wizard__steps" aria-label="Progress">
      <ol className="personalization-wizard__steps-list" style={{ listStyle: "none" }}>
        {PERSONALIZATION_STEPS.map((step, i) => {
          const isActive = state.currentStep === step;
          const isCompleted = stepIndex > i;
          return (
            <li key={step} className="personalization-wizard__steps-item">
              {i > 0 && (
                <span
                  className="personalization-wizard__steps-connector"
                  style={{
                    background: isCompleted ? "var(--color-primary)" : "var(--color-border)",
                  }}
                  aria-hidden
                />
              )}
              <button
                type="button"
                onClick={() => goToStep(step)}
                className="personalization-wizard__steps-step"
                aria-current={isActive ? "step" : undefined}
                aria-label={`Step ${i + 1}: ${STEP_LABELS[step]}${isCompleted ? ", completed" : ""}`}
                style={{
                  background: isActive ? "var(--color-primary)" : isCompleted ? "var(--color-success)" : "var(--color-surface)",
                  color: isActive || isCompleted ? "var(--color-text-inverse)" : "var(--color-text-secondary)",
                  borderColor: isActive ? "var(--color-primary)" : "var(--color-border)",
                }}
              >
                <span className="personalization-wizard__steps-num">
                  {isCompleted ? <CheckIcon /> : i + 1}
                </span>
                <span className="personalization-wizard__steps-label">{STEP_LABELS[step]}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
