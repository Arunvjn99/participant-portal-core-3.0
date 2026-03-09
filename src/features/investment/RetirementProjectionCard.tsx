interface RetirementProjectionCardProps {
  /** Formatted value, e.g. "$316,007" */
  value: string;
  /** Subtitle, e.g. "In 34 years at 9.5% average return." */
  subtitle: string;
}

/**
 * Card showing estimated value at retirement with subtitle.
 * Uses design tokens.
 */
export function RetirementProjectionCard({ value, subtitle }: RetirementProjectionCardProps) {
  return (
    <div
      className="p-5 rounded-[var(--radius-xl)] border"
      style={{
        background: "var(--surface-1)",
        borderColor: "var(--border-subtle)",
      }}
    >
      <p
        className="text-sm font-medium"
        style={{ color: "var(--text-secondary)" }}
      >
        Estimated at Retirement
      </p>
      <p
        className="mt-1 text-2xl font-bold tabular-nums"
        style={{ color: "var(--text-primary)" }}
      >
        {value}
      </p>
      <p
        className="mt-1 text-sm"
        style={{ color: "var(--text-secondary)" }}
      >
        {subtitle}
      </p>
    </div>
  );
}
