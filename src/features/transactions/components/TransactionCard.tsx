import { memo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { StatusBadge } from "../../../components/dashboard/shared/StatusBadge";
import type { Transaction, TransactionType } from "../../../types/transactions";
import type { TransactionLifecycleStatus } from "../types";

const TYPE_KEYS: Record<TransactionType, string> = {
  loan: "transactions.card.typeLoan",
  withdrawal: "transactions.card.typeWithdrawal",
  distribution: "transactions.card.typeDistribution",
  rollover: "transactions.card.typeRollover",
  transfer: "transactions.card.typeTransfer",
  rebalance: "transactions.card.typeRebalance",
};

const STATUS_KEYS: Record<TransactionLifecycleStatus, string> = {
  pending: "transactions.card.statusPending",
  processing: "transactions.card.statusProcessing",
  completed: "transactions.card.statusCompleted",
  failed: "transactions.card.statusFailed",
  scheduled: "transactions.card.statusScheduled",
};

interface TransactionCardProps {
  transaction: Transaction;
  lifecycleStatus?: TransactionLifecycleStatus;
  planName?: string;
  taxType?: string;
}

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

const mapStatus = (s: Transaction["status"]): TransactionLifecycleStatus =>
  s === "draft" ? "pending" : s === "active" ? "processing" : s === "completed" ? "completed" : "failed";

export const TransactionCard = memo(function TransactionCard({
  transaction,
  lifecycleStatus,
  planName,
  taxType,
}: TransactionCardProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const reduced = !!useReducedMotion();
  const [expanded, setExpanded] = useState(false);
  const status = lifecycleStatus ?? mapStatus(transaction.status);
  const displayName = transaction.displayName ?? t(TYPE_KEYS[transaction.type]);
  const amount = transaction.amount ?? 0;
  const isNegative = transaction.amountNegative ?? ["withdrawal", "distribution", "loan"].includes(transaction.type);

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
        <StatusBadge
          label={t(STATUS_KEYS[status])}
          variant={
            status === "completed"
              ? "success"
              : status === "failed"
                ? "danger"
                : status === "processing"
                  ? "primary"
                  : "neutral"
          }
        />
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
          {expanded ? t("transactions.card.less") : t("transactions.card.details")}
        </button>
      </div>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="border-t border-[var(--color-border)] px-[var(--spacing-4)] py-3"
            style={{ background: "var(--color-background-secondary)" }}
          >
            <dl className="space-y-1.5 text-xs" style={{ color: "var(--color-text-secondary)" }}>
              <div>
                <dt className="font-medium" style={{ color: "var(--color-text)" }}>{t("transactions.card.settlementDate")}</dt>
                <dd>{transaction.dateCompleted ?? transaction.dateInitiated ?? "—"}</dd>
              </div>
              <div>
                <dt className="font-medium" style={{ color: "var(--color-text)" }}>{t("transactions.card.taxClassification")}</dt>
                <dd>{taxType ?? "—"}</dd>
              </div>
              <div>
                <dt className="font-medium" style={{ color: "var(--color-text)" }}>{t("transactions.card.impactOnRetirement")}</dt>
                <dd>{transaction.retirementImpact?.rationale ?? "—"}</dd>
              </div>
              {planName && (
                <div>
                  <dt className="font-medium" style={{ color: "var(--color-text)" }}>{t("transactions.card.relatedPlan")}</dt>
                  <dd>{planName}</dd>
                </div>
              )}
            </dl>
            <button
              type="button"
              className="mt-3 text-xs font-medium"
              style={{ color: "var(--color-primary)" }}
            >
              {t("transactions.card.downloadConfirmation")}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
});
