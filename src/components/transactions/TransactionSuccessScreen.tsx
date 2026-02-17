import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type SuccessType = "Loan" | "Withdrawal" | "Transfer" | "Rollover";

interface SuccessState {
  type: SuccessType;
  amount?: number;
}

/**
 * Success screen shown after completing a transaction flow.
 * Uses enrollment/transaction design tokens only.
 */
export function TransactionSuccessScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { success?: SuccessState } | null;
  const success = state?.success;

  if (!success) return null;

  const { type, amount } = success;

  const handleReturn = () => {
    navigate("/transactions", { replace: true, state: {} });
  };

  const getMessage = () => {
    const amountText = amount ? ` for ${amount.toLocaleString("en-US", { style: "currency", currency: "USD" })}` : "";
    const base = `Your request${amountText} has been securely received.`;
    switch (type) {
      case "Transfer":
        return `${base} Your portfolio will be rebalanced at the next market close (4:00 PM ET).`;
      case "Rollover":
        return `${base} We are awaiting funds from your external provider.`;
      default:
        return `${base} Funds typically arrive in 2-3 business days.`;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="mx-auto max-w-lg py-20 text-center"
      >
        <div
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full"
          style={{ background: "var(--color-success-light)" }}
        >
          <CheckCircle2 className="h-10 w-10" style={{ color: "var(--color-success)" }} />
        </div>
        <h2 className="mb-2 text-3xl font-bold" style={{ color: "var(--color-text)" }}>
          {type} Request Submitted
        </h2>
        <p className="mb-8 text-[var(--color-text-secondary)]">{getMessage()}</p>
        <button
          type="button"
          onClick={handleReturn}
          className="rounded-lg px-8 py-3 font-semibold text-white transition-colors hover:opacity-90"
          style={{ background: "var(--enroll-brand)" }}
        >
          Return to Dashboard
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
