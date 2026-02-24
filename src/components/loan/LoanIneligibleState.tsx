import { motion } from "framer-motion";
import { useReducedMotion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface LoanIneligibleStateProps {
  reasons: string[];
  onBack?: () => void;
}

/**
 * Rendered when eligibility pre-check fails. No step 1.
 */
export function LoanIneligibleState({ reasons, onBack }: LoanIneligibleStateProps) {
  const navigate = useNavigate();
  const reduced = useReducedMotion();

  const handleBack = () => {
    if (onBack) onBack();
    else navigate("/transactions");
  };

  return (
    <motion.div
      className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-sm"
      initial={reduced ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      role="alert"
      aria-live="polite"
    >
      <h2 className="mb-2 text-xl font-semibold text-[var(--color-text)]">
        You're not eligible for a loan at this time
      </h2>
      <p className="mb-4 text-[var(--color-textSecondary)]">
        Based on your account and plan rules, we couldn't approve a loan request. Reasons:
      </p>
      <ul className="mb-6 list-inside list-disc space-y-1 text-[var(--color-text)]">
        {reasons.map((r) => (
          <li key={r}>{r}</li>
        ))}
      </ul>
      <button
        type="button"
        onClick={handleBack}
        className="rounded-lg bg-[var(--color-background)] px-4 py-2 text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-background)]"
        aria-label="Back to transactions"
      >
        Back to Transactions
      </button>
    </motion.div>
  );
}
