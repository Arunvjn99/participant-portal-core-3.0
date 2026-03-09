import { Plus, Minus } from "lucide-react";

export interface AgeSelectorProps {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  label?: string;
  /** Optional secondary line under the number (e.g. "I plan to retire at") */
  valueSubline?: string;
  /** Show slider below the controls */
  showSlider?: boolean;
  className?: string;
}

export function AgeSelector({
  value,
  min,
  max,
  onChange,
  label,
  valueSubline,
  showSlider = true,
  className = "",
}: AgeSelectorProps) {
  const clamped = Math.min(max, Math.max(min, value));

  return (
    <div className={`space-y-4 ${className}`}>
      {label && (
        <h2 className="text-center text-lg font-bold text-[var(--color-text-primary)]" id="age-selector-heading">
          {label}
        </h2>
      )}
      <div
        className="flex items-center justify-center gap-4 py-2"
        role="group"
        aria-labelledby={label ? "age-selector-heading" : undefined}
      >
        <button
          type="button"
          onClick={() => onChange(clamped - 1)}
          disabled={clamped <= min}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-background-secondary)] text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed sm:h-12 sm:w-12"
          aria-label={`Decrease. Current: ${clamped}`}
          aria-controls="age-selector-value"
        >
          <Minus className="h-5 w-5" aria-hidden />
        </button>
        <div className="text-center">
          {valueSubline && (
            <div className="mb-0.5 text-xs text-[var(--color-text-secondary)] sm:text-sm">
              {valueSubline}
            </div>
          )}
          <div
            id="age-selector-value"
            className="text-4xl font-bold text-[var(--color-primary)] sm:text-5xl"
            aria-live="polite"
          >
            {clamped}
          </div>
        </div>
        <button
          type="button"
          onClick={() => onChange(clamped + 1)}
          disabled={clamped >= max}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-background-secondary)] text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed sm:h-12 sm:w-12"
          aria-label={`Increase. Current: ${clamped}`}
          aria-controls="age-selector-value"
        >
          <Plus className="h-5 w-5" aria-hidden />
        </button>
      </div>
      {showSlider && (
        <div className="px-2 sm:px-4">
          <input
            type="range"
            min={min}
            max={max}
            value={clamped}
            onChange={(e) => onChange(Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[var(--color-border)] [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[var(--color-primary)] [&::-webkit-slider-thumb]:bg-[var(--color-primary)] [&::-webkit-slider-thumb]:shadow-md"
            style={{
              background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${((clamped - min) / (max - min)) * 100}%, var(--color-border) ${((clamped - min) / (max - min)) * 100}%, var(--color-border) 100%)`,
            }}
            aria-label={`Select age. Current: ${clamped}`}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={clamped}
          />
          <div className="mt-1 flex justify-between text-xs text-[var(--color-text-secondary)]" aria-hidden>
            <span>{min}</span>
            <span>{max}</span>
          </div>
        </div>
      )}
    </div>
  );
}
