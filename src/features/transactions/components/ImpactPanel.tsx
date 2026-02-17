import { memo, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Card, CardContent } from "../../../components/ui/card";
import { SectionHeader } from "../../../components/dashboard/shared/SectionHeader";
import { transactionStore } from "../../../data/transactionStore";
import { useTransactionSummary } from "../hooks/useTransactionSummary";

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);

interface ImpactPanelProps {
  planId: string | null;
}

/**
 * Financial impact summary: net contributions vs withdrawals,
 * projected retirement impact, tax awareness, loan effect.
 * Hides tax warning when no withdrawal exists.
 */
export const ImpactPanel = memo(function ImpactPanel({ planId }: ImpactPanelProps) {
  const reduced = !!useReducedMotion();
  const summary = useTransactionSummary(planId);

  const hasWithdrawal = useMemo(() => {
    const all = transactionStore.getAllTransactions();
    return all.some(
      (t) =>
        (t.type === "withdrawal" || t.type === "distribution") &&
        (t.status === "active" || t.status === "completed")
    );
  }, []);

  const netContributions = summary.contributionsYtd - summary.withdrawalsYtd;
  const loanEffect = 4494.52; // Mock: outstanding loan

  return (
    <motion.section
      initial={reduced ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="space-y-3"
    >
      <SectionHeader
        title="Financial impact"
        subtitle="Net contributions, projections, and tax awareness"
      />
      <Card className="border-[var(--color-border)]" style={{ boxShadow: "var(--shadow-sm)" }}>
        <CardContent className="p-4">
          <dl className="space-y-3">
            <div className="flex justify-between gap-2">
              <dt className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                Net contributions vs withdrawals
              </dt>
              <dd
                className="text-sm font-semibold"
                style={{
                  color: netContributions >= 0 ? "var(--color-success)" : "var(--color-danger)",
                }}
              >
                {netContributions >= 0 ? "+" : "−"}
                {formatCurrency(Math.abs(netContributions))} YTD
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                Projected retirement impact
              </dt>
              <dd className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>
                {summary.totalBalance > 0 ? "On track" : "—"}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                Loan effect on growth
              </dt>
              <dd className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                {formatCurrency(loanEffect)} outstanding
              </dd>
            </div>
          </dl>
          {hasWithdrawal && (
            <div
              className="mt-4 rounded-[var(--radius-md)] border-l-4 p-3"
              style={{
                borderLeftColor: "var(--color-warning)",
                background: "var(--color-background-secondary)",
              }}
            >
              <p className="text-xs font-medium" style={{ color: "var(--color-text)" }}>
                Tax impact awareness
              </p>
              <p className="mt-0.5 text-xs" style={{ color: "var(--color-text-secondary)" }}>
                Withdrawals may be subject to income tax and an early withdrawal penalty if under 59½.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.section>
  );
});
