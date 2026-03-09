import type { ReactNode } from "react";

export interface ContributionCardV2Props {
  title: string;
  children: ReactNode;
  /** Optional summary line (e.g. monthly total) */
  summary?: string;
  className?: string;
}

/**
 * Card wrapper for contribution step content. Theme tokens only.
 */
export function ContributionCardV2({ title, children, summary, className = "" }: ContributionCardV2Props) {
  return (
    <div
      className={`rounded-2xl border p-6 ${className}`}
      style={{
        background: "var(--surface-1)",
        borderColor: "var(--border-subtle)",
      }}
    >
      <h3 className="text-lg font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
        {title}
      </h3>
      {children}
      {summary != null && (
        <p className="mt-4 text-sm" style={{ color: "var(--text-secondary)" }}>
          {summary}
        </p>
      )}
    </div>
  );
}
