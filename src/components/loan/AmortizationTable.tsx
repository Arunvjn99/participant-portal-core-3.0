import { useState } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "framer-motion";
import type { AmortizationRow } from "../../utils/loanCalculator";

interface AmortizationTableProps {
  rows: AmortizationRow[];
  /** Show first N rows by default; "Show more" reveals rest */
  initialVisible?: number;
  className?: string;
}

function formatCurrency(n: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(n);
}

/**
 * Table reveal animation. Collapsible for long schedules.
 */
export function AmortizationTable({
  rows,
  initialVisible = 12,
  className = "",
}: AmortizationTableProps) {
  const reduced = useReducedMotion();
  const [expanded, setExpanded] = useState(false);
  const visibleRows = expanded ? rows : rows.slice(0, initialVisible);
  const hasMore = rows.length > initialVisible;

  return (
    <div
      className={`overflow-hidden rounded-2xl border ${className}`}
      style={{
        borderColor: "var(--enroll-card-border)",
        background: "var(--enroll-card-bg)",
        boxShadow: "var(--enroll-elevation-1)",
      }}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm" role="table" aria-label="Amortization schedule">
          <thead>
            <tr
              className="border-b px-4 py-3 font-medium"
              style={{
                borderColor: "var(--enroll-card-border)",
                background: "var(--enroll-soft-bg)",
                color: "var(--enroll-text-secondary)",
              }}
            >
              <th>#</th>
              <th>Payment</th>
              <th>Principal</th>
              <th>Interest</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row, i) => (
              <motion.tr
                key={row.paymentNumber}
                initial={reduced ? false : { opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.02, duration: 0.2 }}
                className="border-b px-4 py-2"
                style={{ borderColor: "var(--enroll-card-border)" }}
              >
                <td className="tabular-nums" style={{ color: "var(--enroll-text-muted)" }}>{row.paymentNumber}</td>
                <td className="tabular-nums" style={{ color: "var(--enroll-text-primary)" }}>{formatCurrency(row.payment)}</td>
                <td className="tabular-nums" style={{ color: "var(--enroll-text-secondary)" }}>{formatCurrency(row.principal)}</td>
                <td className="tabular-nums" style={{ color: "var(--enroll-text-secondary)" }}>{formatCurrency(row.interest)}</td>
                <td className="tabular-nums font-medium" style={{ color: "var(--enroll-text-primary)" }}>{formatCurrency(row.balance)}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      {hasMore && (
        <div
          className="border-t p-2"
          style={{ borderColor: "var(--enroll-card-border)" }}
        >
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="text-sm font-medium hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ color: "var(--enroll-brand)" }}
            aria-expanded={expanded}
          >
            {expanded ? "Show less" : `Show more (${rows.length - initialVisible} rows)`}
          </button>
        </div>
      )}
    </div>
  );
}
