import type { ChangeEvent } from "react";

export interface ContributionSliderProps {
  min: number;
  max: number;
  value: number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  ariaLabel: string;
}

/**
 * Range slider 1–25% (or configurable). Synced with contribution input.
 * Uses design tokens for track and fill.
 */
export function ContributionSlider({
  min,
  max,
  value,
  onChange,
  ariaLabel,
}: ContributionSliderProps) {
  const clamped = Math.min(max, Math.max(min, value));
  const fillPercent = ((clamped - min) / (max - min)) * 100;

  return (
    <div className="space-y-2">
      <input
        type="range"
        min={min}
        max={max}
        value={clamped}
        onChange={onChange}
        aria-label={ariaLabel}
        className="contribution-slider w-full"
        style={{ ["--slider-pct" as string]: `${fillPercent}%` } as React.CSSProperties}
      />
    </div>
  );
}
