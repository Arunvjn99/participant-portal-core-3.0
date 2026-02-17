import { memo } from "react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

/**
 * Section header for consistent typography across dashboard and transactions.
 * Uses design tokens only.
 */
export const SectionHeader = memo(function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <header className="space-y-0.5">
      <h2 className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>
        {title}
      </h2>
      {subtitle && (
        <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
          {subtitle}
        </p>
      )}
    </header>
  );
});
