import type { ReactNode } from "react";

export interface AdvisorOptionCardProps {
  title: string;
  description: string;
  badge: string;
  primaryAction: { label: string; onClick: () => void };
  secondaryAction?: { label: string; onClick: () => void };
  icon: ReactNode;
  highlight?: boolean;
  /** Left border accent: 'purple' for AI card, 'blue' for advisor card */
  borderAccent?: "purple" | "blue";
}

/**
 * Reusable dual-option guidance card. Layout: flex flex-col justify-between,
 * rounded-2xl border p-6, equal height in grid.
 */
const borderAccentClasses = {
  purple: "border-l-4 border-l-violet-500",
  blue: "border-l-4 border-l-blue-500",
};

export function AdvisorOptionCard({
  title,
  description,
  badge,
  primaryAction,
  secondaryAction,
  icon,
  highlight = false,
  borderAccent,
}: AdvisorOptionCardProps) {
  const accentClass = borderAccent ? borderAccentClasses[borderAccent] : "";
  return (
    <div
      className={`flex flex-col justify-between h-full rounded-2xl border p-4 min-w-0 transition-colors ${accentClass} ${
        highlight
          ? "border-[var(--color-primary)]/30 bg-[var(--color-primary)]/5 hover:bg-[var(--color-primary)]/10"
          : "border-[var(--color-border)] bg-[var(--color-surface)]/80 hover:bg-brand-50/50 hover:border-brand-100 hover:shadow-lg shadow-sm"
      }`}
    >
      <div className="flex flex-col flex-1 min-h-0">
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[var(--color-background-secondary)] px-2.5 py-1 text-xs font-medium text-[var(--color-textSecondary)] mb-3">
          {badge}
        </span>
        <div className="flex items-start gap-3 mb-3">
          <div className="shrink-0 flex items-center justify-center">{icon}</div>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-semibold text-[var(--color-text)] mb-1.5">{title}</h3>
            <p className="text-sm text-[var(--color-textSecondary)] leading-relaxed">{description}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 w-full shrink-0 mt-3 pt-3 border-t border-[var(--color-border)]">
        <button
          type="button"
          onClick={primaryAction.onClick}
          className={`h-10 px-4 rounded-xl bg-primary text-white font-medium text-sm hover:bg-primary-hover transition-colors inline-flex items-center justify-center gap-2 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 whitespace-nowrap ${secondaryAction ? "flex-1" : "w-full"}`}
        >
          {primaryAction.label}
        </button>
        {secondaryAction && (
          <button
            type="button"
            onClick={secondaryAction.onClick}
            className="flex-1 h-10 px-4 rounded-xl bg-[var(--color-surface)] border-2 border-[var(--color-border)] text-[var(--color-text)] font-medium text-sm hover:border-brand-300 hover:text-brand-600 transition-colors inline-flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[var(--border-subtle)] focus:ring-offset-2 whitespace-nowrap"
          >
            {secondaryAction.label}
          </button>
        )}
      </div>
    </div>
  );
}
