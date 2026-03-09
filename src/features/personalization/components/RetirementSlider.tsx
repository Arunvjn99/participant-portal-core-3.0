import { usePersonalizationWizard } from "../context/PersonalizationWizardContext";
import { RETIREMENT_AGE_MIN, RETIREMENT_AGE_MAX } from "../types";

export function RetirementSlider() {
  const { state, setRetirementAge } = usePersonalizationWizard();
  const value = state.retirementAge;
  const percent = ((value - RETIREMENT_AGE_MIN) / (RETIREMENT_AGE_MAX - RETIREMENT_AGE_MIN)) * 100;

  return (
    <div className="personalization-wizard__slider-wrap">
      <div
        className="personalization-wizard__slider-track"
        style={{
          background: "var(--color-border)",
          borderRadius: "var(--radius-full)",
        }}
      >
        <div
          className="personalization-wizard__slider-fill"
          style={{
            width: `${percent}%`,
            background: "var(--color-primary)",
            borderRadius: "var(--radius-full)",
          }}
        />
        <input
          type="range"
          min={RETIREMENT_AGE_MIN}
          max={RETIREMENT_AGE_MAX}
          value={value}
          onChange={(e) => setRetirementAge(Number(e.target.value))}
          className="personalization-wizard__slider-input"
          aria-label="Retirement age"
        />
      </div>
      <div className="personalization-wizard__slider-labels" style={{ color: "var(--color-text-tertiary)" }}>
        <span>{RETIREMENT_AGE_MIN}</span>
        <span>{RETIREMENT_AGE_MAX}</span>
      </div>
    </div>
  );
}
