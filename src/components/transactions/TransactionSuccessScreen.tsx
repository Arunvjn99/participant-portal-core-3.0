import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type SuccessType = "Loan" | "Withdrawal" | "Transfer" | "Rollover";

interface SuccessState {
  type: SuccessType;
  amount?: number;
}

const SUCCESS_TYPE_KEYS: Record<SuccessType, string> = {
  Loan: "transactions.success.typeLoan",
  Withdrawal: "transactions.success.typeWithdrawal",
  Transfer: "transactions.success.typeTransfer",
  Rollover: "transactions.success.typeRollover",
};

/**
 * Success screen shown after completing a transaction flow.
 * Uses enrollment/transaction design tokens only.
 */
export function TransactionSuccessScreen() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { success?: SuccessState } | null;
  const success = state?.success;

  if (!success) return null;

  const { type, amount } = success;

  const handleReturn = () => {
    navigate("/transactions", { replace: true, state: {} });
  };

  const amountFormatted = amount ? amount.toLocaleString(undefined, { style: "currency", currency: "USD" }) : "";
  const amountInterp = amountFormatted ? t("transactions.success.amountFor", { amount: amountFormatted }) : "";
  const base = t("transactions.success.requestReceivedBase", { amount: amountInterp });
  const getMessage = () => {
    switch (type) {
      case "Transfer":
        return `${base} ${t("transactions.success.transferMessage")}`;
      case "Rollover":
        return `${base} ${t("transactions.success.rolloverMessage")}`;
      default:
        return `${base} ${t("transactions.success.defaultMessage")}`;
    }
  };

  const typeLabel = t(SUCCESS_TYPE_KEYS[type]);

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
          {t("transactions.success.titleSubmitted", { type: typeLabel })}
        </h2>
        <p className="mb-8 text-[var(--color-text-secondary)]">{getMessage()}</p>
        <button
          type="button"
          onClick={handleReturn}
          className="rounded-lg px-8 py-3 font-semibold text-white transition-colors hover:opacity-90"
          style={{ background: "var(--enroll-brand)" }}
        >
          {t("transactions.success.returnToDashboard")}
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
