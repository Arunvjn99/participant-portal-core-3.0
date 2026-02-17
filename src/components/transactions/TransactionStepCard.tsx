import type { ReactNode } from "react";

interface TransactionStepCardProps {
  title: string;
  children: ReactNode;
  action?: ReactNode;
}

/**
 * Step card — uses enrollment tokens only (no hardcoded colors).
 */
export function TransactionStepCard({ title, children, action }: TransactionStepCardProps) {
  return (
    <article
      className="overflow-hidden rounded-[var(--enroll-card-radius)] border p-4 sm:p-6 md:p-8 transition-shadow"
      style={{
        background: "var(--enroll-card-bg)",
        borderColor: "var(--enroll-card-border)",
        boxShadow: "var(--enroll-elevation-2)",
      }}
    >
      <header className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2
          className="text-lg font-semibold"
          style={{ color: "var(--enroll-text-primary)" }}
        >
          {title}
        </h2>
        {action && <div className="shrink-0">{action}</div>}
      </header>
      <div style={{ color: "var(--enroll-text-secondary)" }}>{children}</div>
    </article>
  );
}
