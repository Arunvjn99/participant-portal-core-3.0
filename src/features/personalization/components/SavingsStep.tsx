import { useState } from "react";
import { usePersonalizationWizard } from "../context/PersonalizationWizardContext";
import { SAVINGS_MIN, SAVINGS_MAX } from "../types";
import { PiggyBankIcon } from "./icons";
import { InsightCard } from "./InsightCard";

function formatCurrency(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

/** True if input contains any character that is not a digit (spaces allowed for readability). */
function hasNonNumericChars(s: string): boolean {
  return /\D/.test(s.replace(/\s/g, ""));
}

function parseCurrencyInput(s: string): number {
  const cleaned = s.replace(/[^0-9]/g, "");
  return Math.min(SAVINGS_MAX, Math.max(SAVINGS_MIN, Number(cleaned) || 0));
}

export type SavingsDisplayMode = "dollar" | "percent";

export function SavingsStep() {
  const { state, setSavings } = usePersonalizationWizard();
  const [inputValue, setInputValue] = useState(state.savings > 0 ? formatCurrency(state.savings) : "");
  const [displayMode, setDisplayMode] = useState<SavingsDisplayMode>("dollar");
  const [touched, setTouched] = useState(false);

  const hasInvalidChars = touched && inputValue.length > 0 && hasNonNumericChars(inputValue);
  const savingsValue = parseCurrencyInput(inputValue);
  const showInsight = savingsValue > 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setInputValue(raw);
    const num = parseCurrencyInput(raw);
    setSavings(num);
  };

  const handleBlur = () => {
    setTouched(true);
    setInputValue(formatCurrency(state.savings));
  };

  const percent = Math.min(100, (state.savings / 500_000) * 100);

  return (
    <div className="personalization-wizard__body-inner personalization-wizard__step-content">
      <h2 className="personalization-wizard__step-title" style={{ color: "var(--color-text)" }}>
        How much have you already saved for retirement?
      </h2>

      {/* Toggle $ / % */}
      <div className="personalization-wizard__savings-toggle" role="group" aria-label="Display format">
        <button
          type="button"
          onClick={() => setDisplayMode("dollar")}
          className="personalization-wizard__toggle-btn"
          aria-pressed={displayMode === "dollar"}
          style={{
            background: displayMode === "dollar" ? "var(--color-primary)" : "var(--color-background-tertiary)",
            color: displayMode === "dollar" ? "var(--color-text-inverse)" : "var(--color-text-secondary)",
            border: "1px solid " + (displayMode === "dollar" ? "var(--color-primary)" : "var(--color-border)"),
          }}
        >
          $
        </button>
        <button
          type="button"
          onClick={() => setDisplayMode("percent")}
          className="personalization-wizard__toggle-btn"
          aria-pressed={displayMode === "percent"}
          style={{
            background: displayMode === "percent" ? "var(--color-primary)" : "var(--color-background-tertiary)",
            color: displayMode === "percent" ? "var(--color-text-inverse)" : "var(--color-text-secondary)",
            border: "1px solid " + (displayMode === "percent" ? "var(--color-primary)" : "var(--color-border)"),
          }}
        >
          %
        </button>
      </div>

      <div
        className="personalization-wizard__savings-input-wrap"
        style={{
          border: "2px solid " + (hasInvalidChars ? "var(--color-danger)" : "var(--color-border)"),
          borderRadius: "var(--radius-2xl)",
          background: "var(--color-surface)",
          padding: "var(--spacing-4)",
        }}
      >
        <span
          className="personalization-wizard__savings-prefix"
          style={{ color: "var(--color-text-tertiary)" }}
        >
          $
        </span>
        <input
          type="text"
          inputMode="numeric"
          value={inputValue}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="0"
          className="personalization-wizard__savings-input"
          style={{
            background: "none",
            border: "none",
            color: "var(--color-text)",
            fontSize: "1.25rem",
            fontWeight: 600,
          }}
          aria-label="Savings amount in dollars"
          aria-invalid={hasInvalidChars}
          aria-describedby={hasInvalidChars ? "savings-helper-invalid" : "savings-helper"}
        />
      </div>

      {hasInvalidChars ? (
        <p id="savings-helper-invalid" className="personalization-wizard__savings-error" style={{ color: "var(--color-danger)" }} role="alert">
          Enter numbers only. No text or symbols.
        </p>
      ) : (
        <p id="savings-helper" className="personalization-wizard__savings-helper" style={{ color: "var(--color-text-secondary)" }}>
          Enter your total retirement savings.
        </p>
      )}

      {/* Optional slider */}
      <div className="personalization-wizard__savings-slider-wrap">
        <label className="personalization-wizard__savings-slider-label" style={{ color: "var(--color-text-secondary)" }}>
          Adjust with slider (up to $500,000)
        </label>
        <div className="personalization-wizard__savings-track personalization-wizard__slider-track">
          <div
            className="personalization-wizard__savings-fill"
            style={{
              width: `${percent}%`,
              background: "var(--color-primary)",
              borderRadius: "var(--radius-full)",
            }}
          />
          <input
            type="range"
            min={0}
            max={500_000}
            step={1000}
            value={Math.min(500_000, state.savings)}
            onChange={(e) => {
              const v = Number(e.target.value);
              setSavings(v);
              setInputValue(formatCurrency(v));
            }}
            className="personalization-wizard__savings-range"
            aria-label="Savings amount slider"
          />
        </div>
      </div>

      {/* Insight only when user has entered a valid savings value > 0 */}
      {showInsight && (
        <InsightCard
          title="You're building a strong foundation"
          subtitle="Every dollar saved today grows with compound interest."
          icon={<PiggyBankIcon />}
        />
      )}
    </div>
  );
}
