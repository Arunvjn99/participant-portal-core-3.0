import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "framer-motion";

interface LoanReviewSectionProps {
  title: string;
  children: ReactNode;
  onEdit?: () => void;
  /** Step index to navigate back to */
  editStepIndex?: number;
  className?: string;
}

/**
 * Review screen section with Edit button that navigates back to step.
 */
export function LoanReviewSection({
  title,
  children,
  onEdit,
  className = "",
}: LoanReviewSectionProps) {
  const reduced = useReducedMotion();

  return (
    <motion.section
      className={`rounded-2xl border p-6 ${className}`}
      style={{
        borderColor: "var(--enroll-card-border)",
        background: "var(--enroll-card-bg)",
        boxShadow: "var(--enroll-elevation-1)",
      }}
      initial={reduced ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      aria-labelledby={`review-section-${title.replace(/\s/g, "-")}`}
    >
      <div className="mb-4 flex items-center justify-between gap-4" style={{ marginBottom: "var(--spacing-4)" }}>
        <h3
          id={`review-section-${title.replace(/\s/g, "-")}`}
          className="text-lg font-semibold"
          style={{ color: "var(--enroll-text-primary)" }}
        >
          {title}
        </h3>
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="text-sm font-medium hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ color: "var(--enroll-brand)" }}
            aria-label={`Edit ${title}`}
          >
            Edit
          </button>
        )}
      </div>
      <div className="text-sm" style={{ color: "var(--enroll-text-secondary)" }}>{children}</div>
    </motion.section>
  );
}
