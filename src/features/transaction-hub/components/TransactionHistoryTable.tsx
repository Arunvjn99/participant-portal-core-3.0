import { useState, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useLocaleFormat } from "../hooks/useLocaleFormat";
import type { HistoryTransaction } from "../data/mockHubData";

interface TransactionHistoryTableProps {
  transactions: HistoryTransaction[];
}

const TYPE_OPTIONS = ["all", "loan", "withdrawal", "rollover", "distribution", "rebalance"] as const;

export function TransactionHistoryTable({ transactions }: TransactionHistoryTableProps) {
  const { t } = useTranslation();
  const fmt = useLocaleFormat();

  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [planFilter, setPlanFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<"date" | "amount">("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const plans = useMemo(
    () => ["all", ...new Set(transactions.map((tx) => tx.planId))],
    [transactions],
  );

  const filtered = useMemo(() => {
    let result = [...transactions];
    if (typeFilter !== "all") result = result.filter((tx) => tx.type === typeFilter);
    if (planFilter !== "all") result = result.filter((tx) => tx.planId === planFilter);
    result.sort((a, b) => {
      const mul = sortDir === "asc" ? 1 : -1;
      if (sortField === "date") return mul * (new Date(a.date).getTime() - new Date(b.date).getTime());
      return mul * (a.amount - b.amount);
    });
    return result;
  }, [transactions, typeFilter, planFilter, sortField, sortDir]);

  const netMovement = useMemo(
    () => filtered.reduce((sum, tx) => sum + (tx.status === "completed" ? tx.amount : 0), 0),
    [filtered],
  );

  const toggleSort = useCallback((field: "date" | "amount") => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("desc"); }
  }, [sortField]);

  const exportCsv = useCallback(() => {
    const header = "Date,Type,Amount,Tax Impact,Status,Plan\n";
    const rows = filtered
      .map((tx) => `${tx.date},${tx.type},${tx.amount},${tx.taxImpact},${tx.status},${tx.planId}`)
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
    a.click();
    URL.revokeObjectURL(url);
  }, [filtered]);

  return (
    <section className="rounded-xl border border-[var(--color-border)]" style={{ backgroundColor: "var(--color-surface)" }}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-border)] p-4 sm:p-5">
        <h3 className="text-lg font-semibold text-[var(--color-text)]">
          {t("transactionHub.history.title")}
        </h3>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-sm">
            <span className="text-[var(--color-text-secondary)]">{t("transactionHub.history.netMovement")}:</span>
            <span className="font-bold tabular-nums text-[var(--color-text)]">{fmt.currency(netMovement, true)}</span>
          </div>
          <button
            type="button"
            onClick={exportCsv}
            className="rounded-lg px-3 py-1.5 text-xs font-medium transition-colors duration-150"
            style={{ color: "var(--color-primary)", backgroundColor: "var(--color-primary-light, rgba(59,130,246,0.08))" }}
          >
            {t("transactionHub.history.exportCsv")}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 border-b border-[var(--color-border)] px-4 py-3 sm:px-5">
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-sm text-[var(--color-text)]"
          aria-label={t("transactionHub.history.filterType")}
        >
          {TYPE_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt === "all" ? t("transactionHub.history.all") : opt.charAt(0).toUpperCase() + opt.slice(1)}
            </option>
          ))}
        </select>
        <select
          value={planFilter}
          onChange={(e) => setPlanFilter(e.target.value)}
          className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-sm text-[var(--color-text)]"
          aria-label={t("transactionHub.history.filterPlan")}
        >
          {plans.map((p) => (
            <option key={p} value={p}>
              {p === "all" ? t("transactionHub.history.all") : p}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0" style={{ backgroundColor: "var(--color-background-secondary, var(--color-surface))" }}>
            <tr className="border-b border-[var(--color-border)]">
              <SortableHeader label={t("transactionHub.history.colDate")} field="date" current={sortField} dir={sortDir} onSort={toggleSort} />
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-[var(--color-text-secondary)]">
                {t("transactionHub.history.colType")}
              </th>
              <SortableHeader label={t("transactionHub.history.colAmount")} field="amount" current={sortField} dir={sortDir} onSort={toggleSort} />
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-[var(--color-text-secondary)]">
                {t("transactionHub.history.colTaxImpact")}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-[var(--color-text-secondary)]">
                {t("transactionHub.history.colStatus")}
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-[var(--color-text-secondary)]">
                  {t("transactionHub.history.noHistory")}
                </td>
              </tr>
            ) : (
              filtered.map((tx) => (
                <tr key={tx.id} className="border-b border-[var(--color-border)] transition-colors duration-100 hover:bg-[var(--color-background-secondary)]">
                  <td className="whitespace-nowrap px-4 py-3 tabular-nums text-[var(--color-text)]">
                    {fmt.date(tx.date)}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex rounded-md px-2 py-0.5 text-xs font-medium capitalize" style={{ backgroundColor: "var(--color-background-secondary, var(--color-background))", color: "var(--color-text-secondary)" }}>
                      {tx.type}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right tabular-nums font-medium text-[var(--color-text)]">
                    {fmt.currency(tx.amount)}
                  </td>
                  <td className="px-4 py-3">
                    {tx.taxImpact > 0 ? (
                      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ backgroundColor: "var(--color-danger-light, rgba(239,68,68,0.12))", color: "var(--color-danger)" }}>
                        -{fmt.currency(tx.taxImpact)}
                      </span>
                    ) : (
                      <span className="text-xs text-[var(--color-text-tertiary)]">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase"
                      style={{
                        backgroundColor: tx.status === "completed" ? "var(--color-success-light, rgba(34,197,94,0.12))" : "var(--color-danger-light, rgba(239,68,68,0.12))",
                        color: tx.status === "completed" ? "var(--color-success)" : "var(--color-danger)",
                      }}
                    >
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function SortableHeader({
  label,
  field,
  current,
  dir,
  onSort,
}: {
  label: string;
  field: "date" | "amount";
  current: string;
  dir: string;
  onSort: (f: "date" | "amount") => void;
}) {
  const isActive = current === field;
  return (
    <th className="px-4 py-3 text-left">
      <button
        type="button"
        onClick={() => onSort(field)}
        className="flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text)]"
      >
        {label}
        <span className="text-[10px]" aria-hidden>
          {isActive ? (dir === "asc" ? "↑" : "↓") : "↕"}
        </span>
      </button>
    </th>
  );
}
