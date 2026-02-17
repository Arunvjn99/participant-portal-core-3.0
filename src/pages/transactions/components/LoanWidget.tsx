import { memo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { SectionHeader } from "../../../components/dashboard/shared/SectionHeader";
import { StatusBadge } from "../../../components/dashboard/shared/StatusBadge";

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);

/**
 * Loan action widget for Transactions sidebar. Tokens only.
 */
export const LoanWidget = memo(function LoanWidget() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const eligibleAmount = 50000;

  return (
    <section className="space-y-3">
      <SectionHeader title={t("transactions.widgets.loanTitle")} subtitle={t("transactions.widgets.loanSubtitle")} />
      <button
        type="button"
        onClick={() => navigate("/transactions/loan/start")}
        className="transaction-widget-button w-full rounded-[var(--radius-lg)] border p-[var(--spacing-4)] text-left transition-shadow duration-200 focus:outline-none"
        style={{
          background: "var(--enroll-card-bg)",
          borderColor: "var(--enroll-card-border)",
          boxShadow: "var(--enroll-elevation-1)",
        }}
      >
        <div className="flex items-center gap-3">
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-md)]"
            style={{ background: "var(--enroll-soft-bg)", color: "var(--enroll-brand)" }}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold" style={{ color: "var(--enroll-text-primary)" }}>
              {t("transactions.widgets.takeLoan")}
            </p>
            <p className="text-xs" style={{ color: "var(--enroll-text-secondary)" }}>
              {t("transactions.widgets.eligibleUpTo", { amount: formatCurrency(eligibleAmount) })}
            </p>
          </div>
          <StatusBadge label={t("transactions.eligible")} variant="success" />
        </div>
      </button>
    </section>
  );
});
