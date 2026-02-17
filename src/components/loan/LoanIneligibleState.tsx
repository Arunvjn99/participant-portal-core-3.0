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
      className="rounded-2xl border p-8"
      style={{
        borderColor: "var(--enroll-card-border)",
        background: "var(--enroll-card-bg)",
        boxShadow: "var(--enroll-elevation-1)",
      }}
      initial={reduced ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      role="alert"
      aria-live="polite"
    >
      <h2 className="mb-2 text-xl font-semibold" style={{ color: "var(--enroll-text-primary)" }}>
        You're not eligible for a loan at this time
      </h2>
      <p className="mb-4" style={{ color: "var(--enroll-text-secondary)" }}>
        Based on your account and plan rules, we couldn't approve a loan request. Reasons:
      </p>
      <ul className="mb-6 list-inside list-disc space-y-1 text-sm" style={{ color: "var(--enroll-text-secondary)" }}>
        {reasons.map((r) => (
          <li key={r}>{r}</li>
        ))}
      </ul>
      <button
        type="button"
        onClick={handleBack}
        className="rounded-xl border px-6 py-3 text-sm font-medium transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        style={{
          borderColor: "var(--enroll-card-border)",
          background: "var(--enroll-card-bg)",
          color: "var(--enroll-text-primary)",
        }}
        aria-label="Back to transactions"
      >
        Back to Transactions
      </button>
    </motion.div>
  );
}
