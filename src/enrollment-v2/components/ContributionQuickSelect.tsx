export interface QuickSelectOption {
  value: number;
  label: string;
}

export interface ContributionQuickSelectProps {
  options: QuickSelectOption[];
  /** Current contribution amount (percentage) when in percentage mode */
  selectedValue: number;
  contributionType: "percentage" | "fixed";
  onSelect: (value: number) => void;
  /** When selected and in percentage mode, this value gets "employer match" styling (e.g. 6) */
  matchValue?: number;
  className?: string;
  disabled?: boolean;
}

/**
 * Chip-style quick select for contribution presets.
 * Active state: success tokens. When matchValue is set and selected, uses stronger "match" styling.
 */
export function ContributionQuickSelect({
  options,
  selectedValue,
  contributionType,
  onSelect,
  matchValue,
  className = "",
  disabled = false,
}: ContributionQuickSelectProps) {
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {options.map((opt) => {
        const isActive =
          contributionType === "percentage" && selectedValue === opt.value;
        const isMatch = isActive && matchValue != null && opt.value === matchValue;
        return (
          <button
            key={opt.value}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(opt.value)}
            className={
              "rounded-full border px-3 py-1.5 text-sm font-medium transition-all duration-150 ease-out " +
              "bg-[var(--color-surface)] border-[var(--color-border)] " +
              (disabled
                ? "opacity-60 cursor-not-allowed"
                : "hover:bg-[var(--color-background-secondary)] hover:scale-[1.02] ") +
              (isMatch
                ? "!bg-[var(--enroll-success-tint-bg)] !border-[var(--enroll-success-tint-border)] !text-[var(--enroll-accent)] dark:!bg-[var(--enroll-success-tint-bg)] dark:!border-[var(--enroll-success-tint-border)] dark:!text-[var(--enroll-accent)]"
                : isActive
                  ? "!bg-[var(--color-success)]/15 !border-[var(--color-success)]/50 !text-[var(--color-success)] scale-[1.02]"
                  : "text-[var(--color-text-primary)]")
            }
            style={isMatch ? { boxShadow: "0 0 14px rgb(var(--enroll-accent-rgb) / 0.3)" } : undefined}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
