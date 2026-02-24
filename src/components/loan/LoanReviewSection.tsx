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
      className={`rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm ${className}`}
      initial={reduced ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      aria-labelledby={`review-section-${title.replace(/\s/g, "-")}`}
    >
      <div className="mb-4 flex items-center justify-between gap-4">
        <h3 id={`review-section-${title.replace(/\s/g, "-")}`} className="text-lg font-semibold text-[var(--color-text)]">
          {title}
        </h3>
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="text-sm font-medium text-[var(--color-primary)] hover:underline"
            aria-label={`Edit ${title}`}
          >
            Edit
          </button>
        )}
      </div>
      <div className="text-sm text-[var(--color-text)]">{children}</div>
    </motion.section>
  );
}
