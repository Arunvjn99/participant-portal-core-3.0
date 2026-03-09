import { usePersonalizationWizard } from "../context/PersonalizationWizardContext";
import { RetirementSlider } from "./RetirementSlider";
import { InsightCard } from "./InsightCard";
import { CalendarIcon, LayersIcon } from "./icons";
import { RETIREMENT_AGE_MIN, RETIREMENT_AGE_MAX } from "../types";

export function AgeStep() {
  const { state, setRetirementAge } = usePersonalizationWizard();
  const currentYear = new Date().getFullYear();
  const yearsUntilRetirement = Math.max(0, state.retirementAge - state.currentAge);
  const retirementYear = currentYear + yearsUntilRetirement;

  return (
    <div className="personalization-wizard__body-inner personalization-wizard__step-content">
      {/* Age card */}
      <div
        className="personalization-wizard__age-card"
        style={{
          border: "1px solid rgb(var(--color-primary-rgb) / 0.25)",
          borderRadius: "var(--radius-2xl)",
          background: "linear-gradient(172deg, rgb(var(--color-primary-rgb) / 0.06) 0%, rgb(var(--color-primary-rgb) / 0.03) 100%)",
          padding: "var(--spacing-4)",
        }}
      >
        <div className="personalization-wizard__age-card-inner">
          <div
            className="personalization-wizard__age-avatar"
            style={{
              width: 40,
              height: 40,
              borderRadius: "var(--radius-full)",
              background: "var(--color-surface)",
              boxShadow: "var(--shadow-sm)",
              color: "var(--color-primary)",
            }}
          >
            <CalendarIcon />
          </div>
          <div className="personalization-wizard__age-content">
            <h2 className="personalization-wizard__age-title" style={{ color: "var(--color-text)" }}>
              You're {state.currentAge} years old
            </h2>
            <p className="personalization-wizard__age-meta" style={{ color: "var(--color-text-secondary)" }}>
              Born on {state.birthDateDisplay}
            </p>
            <button type="button" className="personalization-wizard__edit-link" style={{ color: "var(--color-primary)" }} aria-label="Edit birth date">
              Edit
            </button>
          </div>
        </div>
      </div>

      {/* Question */}
      <p className="personalization-wizard__question" style={{ color: "var(--color-text)" }}>
        At what age would you like to retire?
      </p>

      {/* Stepper + big number */}
      <div className="personalization-wizard__stepper">
        <button
          type="button"
          onClick={() => setRetirementAge(state.retirementAge - 1)}
          disabled={state.retirementAge <= RETIREMENT_AGE_MIN}
          className="personalization-wizard__stepper-btn"
          style={{
            background: "var(--color-background-tertiary)",
            color: "var(--color-text-secondary)",
            border: "none",
            borderRadius: "var(--radius-full)",
          }}
          aria-label="Decrease retirement age"
        >
          −
        </button>
        <div className="personalization-wizard__stepper-value">
          <span className="personalization-wizard__stepper-big" style={{ color: "var(--color-primary)" }}>
            {state.retirementAge}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setRetirementAge(state.retirementAge + 1)}
          disabled={state.retirementAge >= RETIREMENT_AGE_MAX}
          className="personalization-wizard__stepper-btn"
          style={{
            background: "var(--color-background-tertiary)",
            color: "var(--color-text-secondary)",
            border: "none",
            borderRadius: "var(--radius-full)",
          }}
          aria-label="Increase retirement age"
        >
          +
        </button>
      </div>

      {/* Slider */}
      <RetirementSlider />

      {/* Calculation */}
      <p className="personalization-wizard__calc" style={{ color: "var(--color-text-secondary)" }}>
        Retiring at {state.retirementAge} means you have <strong style={{ color: "var(--color-text)" }}>{yearsUntilRetirement} years</strong> until retirement.
      </p>
      <p className="personalization-wizard__calc-year" style={{ color: "var(--color-text-secondary)" }}>
        Your estimated retirement year: <strong style={{ color: "var(--color-primary)" }}>{retirementYear}</strong>
      </p>

      {/* AI Insight – shown immediately (age exists in profile) */}
      <InsightCard
        title="Most people retire at 65"
        subtitle="Based on 2.4M users"
        icon={<LayersIcon />}
      />
    </div>
  );
}
