import { motion } from "framer-motion";
import { useReducedMotion } from "framer-motion";
import type { LoanFundAllocation } from "../../types/loan";

interface InvestmentBreakdownTableProps {
  allocations: LoanFundAllocation[];
  totalLabel?: string;
  totalAmount: number;
  className?: string;
}

function formatCurrency(n: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(n);
}

/**
 * Table for loan source allocation. Total must match loan amount.
 */
export function InvestmentBreakdownTable({
  allocations,
  totalLabel = "Total",
  totalAmount,
  className = "",
}: InvestmentBreakdownTableProps) {
  const reduced = useReducedMotion();

  return (
    <div className={`overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm" role="table" aria-label="Investment breakdown">
          <thead>
            <tr className="border-b border-[var(--color-border)] bg-[var(--color-background)]">
              <th className="px-4 py-3 font-medium text-[var(--color-text)]">Fund</th>
              <th className="px-4 py-3 font-medium text-[var(--color-text)] text-right">Amount</th>
              <th className="px-4 py-3 font-medium text-[var(--color-text)] text-right">%</th>
            </tr>
          </thead>
          <tbody>
            {allocations.map((row, i) => (
              <motion.tr
                key={row.fundId}
                initial={reduced ? false : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.2 }}
                className="border-b border-[var(--color-border)]"
              >
                <td className="px-4 py-2 text-[var(--color-text)]">{row.fundName}</td>
                <td className="px-4 py-2 tabular-nums text-right text-[var(--color-text)]">{formatCurrency(row.amount)}</td>
                <td className="px-4 py-2 tabular-nums text-right text-[var(--color-textSecondary)]">{row.percentage.toFixed(1)}%</td>
              </motion.tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-[var(--color-border)] bg-[var(--color-background)] font-medium">
              <td className="px-4 py-3 text-[var(--color-text)]">{totalLabel}</td>
              <td className="px-4 py-3 text-right tabular-nums text-[var(--color-text)]" colSpan={2}>
                {formatCurrency(totalAmount)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
