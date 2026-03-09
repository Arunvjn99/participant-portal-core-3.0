import { Check } from "lucide-react";

export interface PlanBenefitChipProps {
  label: string;
  /** Optional: use for list key */
  id?: string;
  className?: string;
}

/**
 * Chip-style benefit label (non-interactive). Matches Figma: rounded pill,
 * soft background, check icon. Theme tokens only; dark-mode compatible.
 */
export function PlanBenefitChip({ label, id, className = "" }: PlanBenefitChipProps) {
  return (
    <span
      id={id}
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium ${className}`}
      style={{
        background: "var(--surface-2)",
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: "var(--border-subtle)",
        color: "var(--text-primary)",
      }}
    >
      <Check
        className="w-4 h-4 flex-shrink-0"
        style={{ color: "var(--success)" }}
        aria-hidden
      />
      {label}
    </span>
  );
}
