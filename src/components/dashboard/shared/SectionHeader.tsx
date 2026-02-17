import { memo } from "react";

interface SectionHeaderProps {
  title: string;
  /** Optional action (e.g. "Edit" link or button) */
  action?: React.ReactNode;
  /** Optional subtitle */
  subtitle?: string;
}

/**
 * Section header for dashboard and transactions. Uses design tokens only.
 */
export const SectionHeader = memo(function SectionHeader({
  title,
  action,
  subtitle,
}: SectionHeaderProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-2 mb-4">
      <div>
        <h2 className="text-base font-semibold" style={{ color: "var(--color-text)" }}>
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm mt-0.5" style={{ color: "var(--color-text-secondary)" }}>
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  );
});
