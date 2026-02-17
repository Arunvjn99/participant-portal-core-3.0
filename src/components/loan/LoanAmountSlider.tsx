import { motion } from "framer-motion";
import { useReducedMotion } from "framer-motion";

interface LoanAmountSliderProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  label: string;
  formatValue?: (v: number) => string;
  disabled?: boolean;
}

/**
 * Accessible slider for loan amount. aria-label on input.
 */
export function LoanAmountSlider({
  value,
  min,
  max,
  step = 100,
  onChange,
  label,
  formatValue = (v) => `$${v.toLocaleString()}`,
  disabled = false,
}: LoanAmountSliderProps) {
  const reduced = useReducedMotion();

  return (
    <div className="space-y-2" style={{ gap: "var(--spacing-2)" }}>
      <div className="flex justify-between">
        <label
          htmlFor="loan-amount-slider"
          className="text-sm font-medium"
          style={{ color: "var(--enroll-text-secondary)" }}
        >
          {label}
        </label>
        <motion.span
          className="font-semibold tabular-nums"
          style={{ color: "var(--enroll-text-primary)" }}
          key={value}
          initial={reduced ? false : { scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          {formatValue(value)}
        </motion.span>
      </div>
      <input
        id="loan-amount-slider"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
        className="h-2 w-full cursor-pointer appearance-none rounded-full disabled:opacity-50 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--enroll-brand)]"
        style={{
          background: "var(--inv-slider-track)",
        }}
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={formatValue(value)}
      />
    </div>
  );
}
