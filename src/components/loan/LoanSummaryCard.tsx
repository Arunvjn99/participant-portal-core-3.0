import { motion } from "framer-motion";
import { useReducedMotion } from "framer-motion";

export interface LoanSummaryRow {
  label: string;
  value: string;
}

interface LoanSummaryCardProps {
  title?: string;
  rows: LoanSummaryRow[];
  className?: string;
}

/**
 * Enrollment-style summary card. Uses global tokens only.
 */
export function LoanSummaryCard({ title = "Summary", rows, className = "" }: LoanSummaryCardProps) {
  const reduced = useReducedMotion();

  return (
    <motion.article
      className={`rounded-2xl border p-6 ${className}`}
      style={{
        borderColor: "var(--enroll-card-border)",
        background: "var(--enroll-soft-bg)",
        boxShadow: "var(--enroll-elevation-1)",
      }}
      initial={reduced ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <h3
        className="mb-4 text-sm font-semibold uppercase tracking-wide"
        style={{ color: "var(--enroll-text-muted)" }}
      >
        {title}
      </h3>
      <dl className="space-y-3" style={{ gap: "var(--spacing-3)" }}>
        {rows.map((row, i) => (
          <motion.div
            key={row.label}
            initial={reduced ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.2 }}
            className="flex justify-between gap-4 text-sm"
          >
            <dt style={{ color: "var(--enroll-text-secondary)" }}>{row.label}</dt>
            <dd className="font-medium" style={{ color: "var(--enroll-text-primary)" }}>{row.value}</dd>
          </motion.div>
        ))}
      </dl>
    </motion.article>
  );
}
