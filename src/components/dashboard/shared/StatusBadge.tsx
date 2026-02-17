import { memo } from "react";

export type StatusBadgeVariant = "success" | "warning" | "danger" | "neutral" | "primary";

interface StatusBadgeProps {
  label: string;
  variant?: StatusBadgeVariant;
}

const variantStyles: Record<StatusBadgeVariant, { bg: string; color: string }> = {
  success: { bg: "var(--color-success-light)", color: "var(--color-success)" },
  warning: { bg: "var(--color-warning-light)", color: "var(--color-warning)" },
  danger: { bg: "var(--color-danger)", color: "var(--color-text-inverse)" },
  neutral: { bg: "var(--color-background-secondary)", color: "var(--color-text-secondary)" },
  primary: { bg: "rgb(var(--color-primary-rgb) / 0.12)", color: "var(--color-primary)" },
};

/**
 * Reusable status badge. Uses design tokens only.
 */
export const StatusBadge = memo(function StatusBadge({ label, variant = "neutral" }: StatusBadgeProps) {
  const style = variantStyles[variant];
  return (
    <span
      className="inline-flex items-center rounded-[var(--radius-md)] px-2 py-0.5 text-xs font-medium"
      style={{ background: style.bg, color: style.color }}
    >
      {label}
    </span>
  );
});
