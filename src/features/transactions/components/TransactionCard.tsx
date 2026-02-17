import { memo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import type { Transaction, TransactionType } from "../../../types/transactions";
import type { TransactionLifecycleStatus, ActivityItem } from "../types";
import { StatusBadge } from "../../../components/dashboard/shared/StatusBadge";

interface TransactionCardProps {
  transaction: Transaction;
  lifecycleStatus?: TransactionLifecycleStatus;
  planName?: string;
  taxType?: string;
  settlementDate?: string;
  estimatedRetirementImpact?: number;
}

const typeLabel: Record<TransactionType, string> = {
  loan: "Loan",
  withdrawal: "Withdrawal",
  distribution: "Distribution",
  rollover: "Rollover",
  transfer: "Transfer",
  rebalance: "Rebalance",
};

const statusLabel: Record<TransactionLifecycleStatus, string> = {
  pending: "Pending",
  processing: "Processing",
  completed: "Completed",
  failed: "Failed",
  scheduled: "Scheduled",
};

const statusVariant: Record<TransactionLifecycleStatus, "success" | "warning" | "danger" | "neutral" | "primary"> = {
  pending: "neutral",
  processing: "primary",
  completed: "success",
  failed: "danger",
  scheduled: "warning",
};

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

const mapStatus = (s: Transaction["status"]): TransactionLifecycleStatus =>
  s === "draft" ? "pending" : s === "active" ? "processing" : s === "completed" ? "completed" : "failed";

export const TransactionCard = memo(function TransactionCard({
  transaction,
  lifecycleStatus,
  planName,
  taxType,
  settlementDate,
  estimatedRetirementImpact,
}: TransactionCardProps) {
  const navigate = useNavigate();
  const reduced = !!useReducedMotion();
  const [expanded, setExpanded] = useState(false);
  const status = lifecycleStatus ?? mapStatus(transaction.status);
  const displayName = transaction.displayName ?? typeLabel[transaction.type];
  const amount = transaction.amount ?? 0;
  const isNegative = transaction.amountNegative ?? ["withdrawal", "distribution", "loan"].includes(transaction.type);
  const impact = estimatedRetirementImpact ?? (transaction as ActivityItem).estimatedRetirementImpact;
  const settle = settlementDate ?? (transaction as ActivityItem).settlementDate ?? transaction.dateCompleted;

  const handleRowClick = () => {
    if (transaction.status === "draft" || transaction.status === "active") {
      navigate(`/transactions/${transaction.type}/${transaction.id}`);
    } else {
      navigate(`/transactions/${transaction.id}`);
    }
  };

  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded((v) => !v);
  };

  return (
    <motion.article
      layout
      initial={reduced ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="rounded-[var(--radius-lg)] border border-[var(--color-border)] overflow-hidden"
      style={{ background: "var(--color-surface)", boxShadow: "var(--shadow-sm)" }}
    >
      <div className="flex items-center gap-3 p-[var(--spacing-4)]">
        <button
          type="button"
          onClick={handleRowClick}
          className="flex min-w-0 flex-1 items-center gap-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-primary)]"
        >
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-md)]"
          style={{ background: "var(--color-background-secondary)", color: "var(--color-primary)" }}
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium" style={{ color: "var(--color-text)" }}>
            {displayName}
          </p>
          <p className="truncate text-xs" style={{ color: "var(--color-text-secondary)" }}>
            {planName ?? transaction.accountType ?? "—"} {taxType ? `· ${taxType}` : ""}
          </p>
        </div>
        <StatusBadge label={statusLabel[status]} variant={statusVariant[status]} />
        <span
          className="shrink-0 text-sm font-semibold"
          style={{ color: isNegative ? "var(--color-danger)" : "var(--color-success)" }}
        >
          {isNegative ? "-" : "+"}
          {formatCurrency(amount)}
        </span>
        <span className="shrink-0" style={{ color: "var(--color-text-tertiary)" }}>
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
        </button>
        <button
          type="button"
          onClick={handleExpandClick}
          className="shrink-0 rounded-[var(--radius-md)] p-1 text-xs font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
          style={{ color: "var(--color-primary)" }}
        >
          {expanded ? "Less" : "Details"}
        </button>
      </div>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="border-t border-[var(--color-border)] px-[var(--spacing-4)] py-3 space-y-2"
            style={{ background: "var(--color-background-secondary)" }}
          >
            {settle && (
              <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                Settlement date: {settle}
              </p>
            )}
            <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
              Tax classification: {taxType ?? "—"}
            </p>
            <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
              Impact on retirement: {transaction.retirementImpact?.rationale ?? (impact != null ? `$${impact.toLocaleString()}` : "—")}
            </p>
            <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
              Plan: {planName ?? transaction.accountType ?? "—"}
            </p>
            <button
              type="button"
              className="text-xs font-medium"
              style={{ color: "var(--color-primary)" }}
            >
              Download confirmation
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
});
