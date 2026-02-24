import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocaleFormat } from "../hooks/useLocaleFormat";
import type { ActiveTransaction } from "../data/mockHubData";

interface TransactionTimelineProps {
  transactions: ActiveTransaction[];
}

const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  draft: { bg: "var(--color-border)", text: "var(--color-text-secondary)", dot: "var(--color-text-tertiary)" },
  pending: { bg: "var(--color-warning-light, rgba(202,138,4,0.12))", text: "var(--color-warning, #ca8a04)", dot: "var(--color-warning, #ca8a04)" },
  processing: { bg: "var(--color-primary-light, rgba(59,130,246,0.12))", text: "var(--color-primary)", dot: "var(--color-primary)" },
  completed: { bg: "var(--color-success-light, rgba(34,197,94,0.12))", text: "var(--color-success)", dot: "var(--color-success)" },
  cancelled: { bg: "var(--color-danger-light, rgba(239,68,68,0.12))", text: "var(--color-danger)", dot: "var(--color-danger)" },
};

export function TransactionTimeline({ transactions }: TransactionTimelineProps) {
  const { t } = useTranslation();

  if (!transactions.length) {
    return (
      <section
        className="flex flex-col items-center gap-3 rounded-xl border border-[var(--color-border)] p-8"
        style={{ backgroundColor: "var(--color-surface)" }}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full" style={{ backgroundColor: "var(--color-background-secondary, var(--color-background))" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-tertiary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-[var(--color-text)]">{t("transactionHub.timeline.title")}</h3>
        <p className="text-sm text-[var(--color-text-secondary)]">{t("transactionHub.timeline.noActive")}</p>
      </section>
    );
  }

  return (
    <section
      className="rounded-xl border border-[var(--color-border)]"
      style={{ backgroundColor: "var(--color-surface)" }}
    >
      <div className="border-b border-[var(--color-border)] px-5 py-4">
        <h3 className="text-base font-semibold text-[var(--color-text)]">{t("transactionHub.timeline.title")}</h3>
      </div>
      <div className="relative flex flex-col p-5">
        <div
          className="absolute bottom-5 left-[29px] top-5 w-px"
          style={{ backgroundColor: "var(--color-border)" }}
          aria-hidden
        />
        {transactions.map((txn, idx) => (
          <TimelineItem key={txn.id} txn={txn} isLast={idx === transactions.length - 1} />
        ))}
      </div>
    </section>
  );
}

function TimelineItem({ txn, isLast }: { txn: ActiveTransaction; isLast: boolean }) {
  const { t } = useTranslation();
  const fmt = useLocaleFormat();
  const [expanded, setExpanded] = useState(false);

  const style = STATUS_STYLES[txn.status] ?? STATUS_STYLES.draft;
  const statusKey = `transactionHub.timeline.status${txn.status.charAt(0).toUpperCase() + txn.status.slice(1)}` as const;
  const progressPct = txn.totalSteps > 0 ? (txn.currentStep / txn.totalSteps) * 100 : 0;

  return (
    <div className={`relative flex gap-4 pl-6 ${isLast ? "" : "pb-6"}`}>
      {/* Dot with pulse */}
      <div className="absolute left-0 top-1.5 flex items-center justify-center">
        <div className="h-3.5 w-3.5 rounded-full border-[2.5px]" style={{ borderColor: style.dot, backgroundColor: txn.status === "processing" ? style.dot : "var(--color-surface)" }} />
        {txn.status === "processing" && (
          <div className="absolute h-3.5 w-3.5 animate-ping rounded-full opacity-30" style={{ backgroundColor: style.dot }} aria-hidden />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2.5">
        {/* Header */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-[var(--color-text)]">{txn.displayName}</span>
          <span
            className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
            style={{ backgroundColor: style.bg, color: style.text }}
          >
            {t(statusKey)}
          </span>
        </div>

        {/* Amount + Date */}
        <div className="flex items-center gap-3 text-xs text-[var(--color-text-secondary)]">
          <span className="font-medium tabular-nums">{fmt.currency(txn.amount, true)}</span>
          <span>·</span>
          <span>{fmt.date(txn.dateInitiated)}</span>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-3">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full" style={{ backgroundColor: "var(--color-border)" }}>
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progressPct}%`, backgroundColor: style.dot }}
            />
          </div>
          <span className="shrink-0 text-[11px] tabular-nums text-[var(--color-text-tertiary)]">
            {t("transactionHub.timeline.step", { current: txn.currentStep, total: txn.totalSteps })}
          </span>
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap gap-3 text-[11px] text-[var(--color-text-tertiary)]">
          <span>{t("transactionHub.timeline.eta")}: {txn.eta}</span>
          <span>{t("transactionHub.timeline.documents")}: {txn.requiredDocuments.length}</span>
        </div>

        {/* Expand toggle */}
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="self-start text-xs font-medium transition-colors duration-150"
          style={{ color: "var(--color-primary)" }}
          aria-expanded={expanded}
        >
          {expanded ? t("transactionHub.timeline.hideDetails") : t("transactionHub.timeline.viewDetails")}
        </button>

        {/* Expandable details */}
        <div
          className="grid transition-all duration-250 ease-out"
          style={{ gridTemplateRows: expanded ? "1fr" : "0fr", opacity: expanded ? 1 : 0 }}
        >
          <div className="overflow-hidden">
            <div className="flex flex-col gap-2 rounded-lg border border-[var(--color-border)] p-3 mt-1" style={{ backgroundColor: "var(--color-background-secondary, var(--color-background))" }}>
              <span className="text-[11px] font-medium uppercase tracking-wide text-[var(--color-text-secondary)]">
                {t("transactionHub.timeline.documents")}
              </span>
              {txn.requiredDocuments.map((doc) => (
                <div key={doc} className="flex items-center justify-between">
                  <span className="text-sm text-[var(--color-text)]">{doc}</span>
                  <button
                    type="button"
                    className="rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors duration-150"
                    style={{ color: "var(--color-primary)", backgroundColor: "var(--color-primary-light, rgba(59,130,246,0.08))" }}
                  >
                    {t("transactionHub.timeline.upload")}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
