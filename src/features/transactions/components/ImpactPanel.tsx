import { memo, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Card, CardContent } from "../../../components/ui/card";
import { SectionHeader } from "../../../components/dashboard/shared/SectionHeader";
import { transactionStore } from "../../../data/transactionStore";
import type { MonthlySummaryRow } from "../types";

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);

interface ImpactPanelProps {
  monthlyBreakdown: MonthlySummaryRow[];
}

export const ImpactPanel = memo(function ImpactPanel({ monthlyBreakdown }: ImpactPanelProps) {
  const reduced = !!useReducedMotion();
  const hasWithdrawal = useMemo(() => {
    const all = transactionStore.getAllTransactions();
    return all.some(
      (t) => (t.type === "withdrawal" || t.type === "distribution") && (t.status === "active" || t.status === "completed")
    );
  }, []);

  const contributions = monthlyBreakdown.find((r) => r.label === "Contributions")?.amount ?? 0;
  const netGrowth = monthlyBreakdown.find((r) => r.label === "Net growth impact")?.amount ?? 0;
  const loanPayments = Math.abs(monthlyBreakdown.find((r) => r.label === "Loan payments")?.amount ?? 0);

  return (
    <motion.section
      initial={reduced ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="space-y-4"
    >
      <SectionHeader title="Financial impact" subtitle="Summary and awareness" />
      <Card style={{ boxShadow: "var(--shadow-sm)" }}>
        <CardContent className="p-4 space-y-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--color-text-secondary)" }}>
              Net contributions vs withdrawals
            </p>
            <p className="mt-0.5 text-sm font-semibold" style={{ color: netGrowth >= 0 ? "var(--color-success)" : "var(--color-danger)" }}>
              {netGrowth >= 0 ? "+" : ""}
              {formatCurrency(netGrowth)} net flow
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--color-text-secondary)" }}>
              Projected retirement impact
            </p>
            <p className="mt-0.5 text-sm" style={{ color: "var(--color-text)" }}>
              On track based on current contributions and growth.
            </p>
          </div>
          {loanPayments > 0 && (
            <div>
              <p className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--color-text-secondary)" }}>
                Loan effect on growth
              </p>
              <p className="mt-0.5 text-sm" style={{ color: "var(--color-text)" }}>
                Repaying {formatCurrency(loanPayments)}/mo; balance rebounds as you repay.
              </p>
            </div>
          )}
          {hasWithdrawal && (
            <div
              className="rounded-[var(--radius-md)] p-3"
              style={{
                borderLeft: "4px solid var(--color-warning)",
                background: "var(--color-background-secondary)",
              }}
            >
              <p className="text-xs font-semibold" style={{ color: "var(--color-warning)" }}>
                Tax impact
              </p>
              <p className="mt-1 text-xs" style={{ color: "var(--color-text-secondary)" }}>
                Withdrawals may be subject to income tax and an early withdrawal penalty if under 59½.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.section>
  );
});
