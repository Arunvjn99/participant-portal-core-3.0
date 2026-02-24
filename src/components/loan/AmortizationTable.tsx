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
    <div className={`overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm" role="table" aria-label="Amortization schedule">
          <thead>
            <tr className="border-b border-[var(--color-border)] bg-[var(--color-background)]">
              <th className="px-4 py-3 font-medium text-[var(--color-text)]">#</th>
              <th className="px-4 py-3 font-medium text-[var(--color-text)]">Payment</th>
              <th className="px-4 py-3 font-medium text-[var(--color-text)]">Principal</th>
              <th className="px-4 py-3 font-medium text-[var(--color-text)]">Interest</th>
              <th className="px-4 py-3 font-medium text-[var(--color-text)]">Balance</th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row, i) => (
              <motion.tr
                key={row.paymentNumber}
                initial={reduced ? false : { opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.02, duration: 0.2 }}
                className="border-b border-[var(--color-border)]"
              >
                <td className="px-4 py-2 tabular-nums text-[var(--color-textSecondary)]">{row.paymentNumber}</td>
                <td className="px-4 py-2 tabular-nums text-[var(--color-text)]">{formatCurrency(row.payment)}</td>
                <td className="px-4 py-2 tabular-nums text-[var(--color-text)]">{formatCurrency(row.principal)}</td>
                <td className="px-4 py-2 tabular-nums text-[var(--color-text)]">{formatCurrency(row.interest)}</td>
                <td className="px-4 py-2 tabular-nums font-medium text-[var(--color-text)]">{formatCurrency(row.balance)}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      {hasMore && (
        <div className="border-t border-[var(--color-border)] p-2">
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="text-sm font-medium text-[var(--color-primary)] hover:underline"
            aria-expanded={expanded}
          >
            {expanded ? "Show less" : `Show more (${rows.length - initialVisible} rows)`}
          </button>
        </div>
      )}
    </div>
  );
}
