import { PERFORMANCE_TIME_RANGES, type PerformanceTimeRange } from "@/modules/investment/data/mockPortfolioDashboard";
import { cn } from "@/lib/utils";

type TimeFilterProps = {
  value: PerformanceTimeRange;
  onChange: (next: PerformanceTimeRange) => void;
  /** Figma-style segmented control (single muted track, elevated active tab). */
  variant?: "default" | "segmented";
};

/**
 * Range pills for portfolio performance (1M / 3M / YTD / 1Y / 5Y).
 */
export function TimeFilter({ value, onChange, variant = "segmented" }: TimeFilterProps) {
  return (
    <div
      className={cn(
        "inv-portfolio-time-filter",
        variant === "segmented" && "inv-portfolio-time-filter--segmented",
      )}
      role="group"
      aria-label="Performance time range"
    >
      {PERFORMANCE_TIME_RANGES.map((r) => (
        <button
          key={r}
          type="button"
          className={cn("inv-portfolio-time-filter__btn", value === r && "inv-portfolio-time-filter__btn--active")}
          onClick={() => onChange(r)}
          aria-pressed={value === r}
        >
          {r}
        </button>
      ))}
    </div>
  );
}
