/**
 * Moderate investor chip – Tailwind-only component for the "MODERATE INVESTOR" badge
 * and the "Medium" risk level pill.
 */
interface ModerateInvestorChipProps {
  /** "badge" = MODERATE INVESTOR label; "pill" = Medium risk level */
  variant?: "badge" | "pill";
  /** Chip content */
  children: React.ReactNode;
  /** Optional extra class names */
  className?: string;
}

const variantClasses = {
  badge:
    "rounded-md bg-[var(--color-background)] px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-[var(--color-text)]",
  pill:
    "inline-block w-fit rounded-full bg-[var(--color-background)] px-2.5 py-0.5 text-sm font-semibold text-[var(--color-text)]",
} as const;

export const ModerateInvestorChip = ({
  variant = "pill",
  children,
  className = "",
}: ModerateInvestorChipProps) => {
  return (
    <span className={`${variantClasses[variant]} ${className}`.trim()}>
      {children}
    </span>
  );
};
