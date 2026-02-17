import { memo, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { transactionStore } from "../../../data/transactionStore";

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);

export const TaxImpactPanel = memo(function TaxImpactPanel() {
  const reduced = !!useReducedMotion();
  const hasWithdrawal = useMemo(() => {
    const all = transactionStore.getAllTransactions();
    return all.some(
      (t) => (t.type === "withdrawal" || t.type === "distribution") && (t.status === "active" || t.status === "completed")
    );
  }, []);

  if (!hasWithdrawal) return null;

  const estimatedTax = 2400;
  const penalty = 1000;

  return (
    <motion.section
      initial={reduced ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="space-y-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] p-[var(--spacing-4)]"
      style={{
        background: "var(--color-surface)",
        boxShadow: "var(--shadow-sm)",
        borderLeftWidth: 4,
        borderLeftColor: "var(--color-warning)",
      }}
    >
      <h2 className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>
        Tax impact
      </h2>
      <ul className="space-y-2 text-sm" style={{ color: "var(--color-text-secondary)" }}>
        <li>Estimated tax: {formatCurrency(estimatedTax)}</li>
        <li>Early withdrawal penalty: {formatCurrency(penalty)}</li>
        <li>Tax diversification: Mixed (Pre-tax + Roth)</li>
      </ul>
      <p className="text-xs" style={{ color: "var(--color-warning)" }}>
        Withdrawals may be subject to income tax and an early withdrawal penalty if under 59½.
      </p>
    </motion.section>
  );
});
