import type { ReactNode } from "react";

export interface PageHeaderProps {
  /** Page title (H1) — uses single typography scale: text-3xl font-semibold tracking-tight */
  title: string;
  /** Optional subtitle — text-base, muted */
  subtitle?: string;
  /** Optional badge or accent above the title */
  badge?: ReactNode;
  /** Optional class for the wrapper */
  className?: string;
}

/**
 * Reusable page header for enrollment flow.
 * Enforces consistent typography: H1 (text-3xl font-semibold tracking-tight), subtitle (text-base muted).
 * All colors use design tokens for white-label and dark mode.
 */
export function PageHeader({ title, subtitle, badge, className = "" }: PageHeaderProps) {
  return (
    <header className={`space-y-1 ${className}`}>
      {badge != null && <div className="mb-2">{badge}</div>}
      <h1
        className="text-3xl font-semibold tracking-tight"
        style={{ color: "var(--text-primary)" }}
      >
        {title}
      </h1>
      {subtitle != null && (
        <p
          className="text-base"
          style={{ color: "var(--text-secondary)" }}
        >
          {subtitle}
        </p>
      )}
    </header>
  );
}
