import { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { MonthlySummaryRow } from "../types";

interface MonthlySummaryProps {
  rows: MonthlySummaryRow[];
}

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);

export const MonthlySummary = memo(function MonthlySummary({ rows }: MonthlySummaryProps) {
  const reduced = !!useReducedMotion();
  const maxAbs = Math.max(...rows.map((r) => Math.abs(r.amount)), 1);

  return (
    <motion.section
      initial={reduced ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="space-y-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] p-[var(--spacing-4)]"
      style={{ background: "var(--color-surface)", boxShadow: "var(--shadow-sm)" }}
    >
      <h2 className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>
        Monthly summary
      </h2>
      <ul className="space-y-2">
        {rows.map((row, i) => (
          <li key={row.label} className="flex items-center gap-3">
            <span className="w-32 shrink-0 text-xs" style={{ color: "var(--color-text-secondary)" }}>
              {row.label}
            </span>
            <div className="flex-1">
              <div
                className="h-2 overflow-hidden rounded-[var(--radius-sm)]"
                style={{ background: "var(--color-border)" }}
              >
                <motion.div
                  initial={reduced ? false : { width: 0 }}
                  animate={{ width: `${Math.min(100, (Math.abs(row.amount) / maxAbs) * 100)}%` }}
                  transition={{ duration: 0.3, delay: i * 0.05, ease: "easeOut" }}
                  className="h-full rounded-[var(--radius-sm)]"
                  style={{
                    background: row.amount >= 0 ? "var(--color-success)" : "var(--color-danger)",
                  }}
                />
              </div>
            </div>
            <span
              className="w-20 shrink-0 text-right text-xs font-medium"
              style={{
                color: row.amount >= 0 ? "var(--color-success)" : "var(--color-danger)",
              }}
            >
              {row.amount >= 0 ? "+" : ""}
              {formatCurrency(row.amount)}
            </span>
          </li>
        ))}
      </ul>
    </motion.section>
  );
});
