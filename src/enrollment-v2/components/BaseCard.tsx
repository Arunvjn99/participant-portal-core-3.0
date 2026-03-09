import type { ReactNode } from "react";

export interface BaseCardProps {
  children: ReactNode;
  /** Optional class for the card wrapper */
  className?: string;
}

/**
 * Reusable card for enrollment flow. Token-based styling only.
 * Uses: --surface-1, --border-subtle. No hardcoded colors.
 */
export function BaseCard({ children, className = "" }: BaseCardProps) {
  return (
    <div
      className={`rounded-xl border shadow-sm p-6 ${className}`}
      style={{
        background: "var(--surface-1)",
        borderColor: "var(--border-subtle)",
      }}
    >
      {children}
    </div>
  );
}
