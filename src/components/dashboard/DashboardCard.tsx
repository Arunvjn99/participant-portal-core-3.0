import type { ReactNode } from "react";

interface DashboardCardProps {
  children: ReactNode;
  title?: string;
  action?: ReactNode;
  className?: string;
  /** @deprecated Use isSelected for plan card highlight. Badge is controlled by PlanSelectionCard. */
  isRecommended?: boolean;
  /** Selected state - ONLY ONE plan. Controls ALL visual highlight. Per Figma. */
  isSelected?: boolean;
}

/**
 * Card styling rules:
 * - isSelected=true: Single primary border, soft tint, elevated shadow. NO inner stroke.
 * - isSelected=false: Default styling (same for recommended and non-recommended).
 * - isRecommended: Does NOT affect card styling. Badge only (handled by PlanSelectionCard).
 */
/**
 * Dashboard card with HeroUI-inspired base styling (v3.heroui.com).
 * Rounded-xl, consistent shadow, selected state for plan selection.
 */
export const DashboardCard = ({ children, title, action, isSelected, className }: DashboardCardProps) => {
  return (
    <article
      className={`overflow-hidden rounded-xl border p-4 sm:p-6 md:p-8 transition-shadow duration-200 ${
        isSelected
          ? "border-primary bg-primary/5 shadow-[var(--heroui-card-hover-shadow)]"
          : "border-[var(--color-border)] bg-card shadow-[var(--heroui-card-shadow)] hover:shadow-[var(--heroui-card-hover-shadow)]"
      } ${className ?? ""}`}
    >
      {(title || action) && (
        <header className="mb-4 flex flex-wrap items-center justify-between gap-2">
          {title && (
            <h2 className="text-lg font-semibold text-[var(--color-text)]">{title}</h2>
          )}
          {action && <div className="shrink-0">{action}</div>}
        </header>
      )}
      <div className="text-[var(--color-textSecondary)]">{children}</div>
    </article>
  );
};
