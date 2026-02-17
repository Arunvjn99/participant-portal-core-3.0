import { memo } from "react";

type StatusVariant = "success" | "warning" | "danger" | "neutral" | "primary";

interface StatusBadgeProps {
  label: string;
  variant?: StatusVariant;
}

const variantStyles: Record<StatusVariant, React.CSSProperties> = {
  success: {
    background: "var(--color-success-light)",
    color: "var(--color-success)",
  },
  warning: {
    background: "var(--color-warning-light)",
    color: "var(--color-warning)",
  },
  danger: {
    background: "var(--color-danger-light)",
    color: "var(--color-danger)",
  },
  neutral: {
    background: "var(--color-background-secondary)",
    color: "var(--color-text-secondary)",
  },
  primary: {
    background: "var(--color-primary)",
    color: "var(--color-text-inverse)",
  },
};

/**
 * Status badge for lifecycle states (pending, processing, completed, etc.).
 * Uses design tokens only.
 */
export const StatusBadge = memo(function StatusBadge({ label, variant = "neutral" }: StatusBadgeProps) {
  return (
    <span
      className="inline-flex items-center rounded-[var(--radius-sm)] px-2 py-0.5 text-[10px] font-medium"
      style={variantStyles[variant]}
    >
      {label}
    </span>
  );
});
