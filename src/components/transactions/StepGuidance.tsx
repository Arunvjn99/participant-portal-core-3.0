import type { ReactNode } from "react";

interface StepGuidanceProps {
  children: ReactNode;
  className?: string;
}

/**
 * Enrollment-style helper block at the top of each step.
 * Uses tokenized colors and subtle info card style.
 */
export function StepGuidance({ children, className = "" }: StepGuidanceProps) {
  return (
    <div
      className={`rounded-2xl border p-4 md:p-5 ${className}`}
      style={{
        borderColor: "var(--enroll-card-border)",
        background: "var(--enroll-soft-bg)",
        color: "var(--enroll-text-primary)",
      }}
      role="status"
    >
      <p className="text-sm leading-relaxed" style={{ color: "var(--enroll-text-secondary)" }}>
        {children}
      </p>
    </div>
  );
}
