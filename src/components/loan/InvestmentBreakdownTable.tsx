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
    <div
      className={`overflow-hidden rounded-2xl border ${className}`}
      style={{
        borderColor: "var(--enroll-card-border)",
        background: "var(--enroll-card-bg)",
        boxShadow: "var(--enroll-elevation-1)",
      }}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm" role="table" aria-label="Investment breakdown">
          <thead>
            <tr
              className="border-b px-4 py-3 font-medium"
              style={{
                borderColor: "var(--enroll-card-border)",
                background: "var(--enroll-soft-bg)",
              }}
            >
              <th style={{ color: "var(--enroll-text-secondary)" }}>Fund</th>
              <th className="text-right" style={{ color: "var(--enroll-text-secondary)" }}>Amount</th>
              <th className="text-right" style={{ color: "var(--enroll-text-secondary)" }}>%</th>
            </tr>
          </thead>
          <tbody>
            {allocations.map((row, i) => (
              <motion.tr
                key={row.fundId}
                initial={reduced ? false : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.2 }}
                className="border-b px-4 py-2"
                style={{ borderColor: "var(--enroll-card-border)" }}
              >
                <td style={{ color: "var(--enroll-text-primary)" }}>{row.fundName}</td>
                <td className="tabular-nums text-right" style={{ color: "var(--enroll-text-secondary)" }}>{formatCurrency(row.amount)}</td>
                <td className="tabular-nums text-right" style={{ color: "var(--enroll-text-muted)" }}>{row.percentage.toFixed(1)}%</td>
              </motion.tr>
            ))}
          </tbody>
          <tfoot>
            <tr
              className="border-t-2 px-4 py-3 font-medium"
              style={{
                borderColor: "var(--enroll-card-border)",
                background: "var(--enroll-soft-bg)",
              }}
            >
              <td style={{ color: "var(--enroll-text-primary)" }}>{totalLabel}</td>
              <td className="text-right tabular-nums" style={{ color: "var(--enroll-text-primary)" }} colSpan={2}>
                {formatCurrency(totalAmount)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
