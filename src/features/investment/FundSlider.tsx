interface FundSliderProps {
  /** Value 0–100 */
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  ariaLabel?: string;
}

/**
 * Allocation slider 0→100. Changing slider updates allocation.
 * Uses design tokens only.
 */
export function FundSlider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 0.5,
  ariaLabel = "Allocation",
}: FundSliderProps) {
  const clamped = Math.min(max, Math.max(min, value));
  const displayValue = Number.isNaN(clamped) ? min : clamped;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    if (!Number.isNaN(v)) onChange(v);
  };

  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={displayValue}
      onChange={handleChange}
      className="w-24 h-2 rounded-full cursor-pointer"
      style={{ accentColor: "var(--brand-primary)" }}
      aria-label={ariaLabel}
    />
  );
}
