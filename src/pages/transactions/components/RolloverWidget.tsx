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
 * Rollover action widget for Transactions sidebar. Tokens only.
 */
export const RolloverWidget = memo(function RolloverWidget() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const eligibleAmount = 129500;

  return (
    <section className="space-y-3">
      <SectionHeader title={t("transactions.widgets.rolloverTitle")} subtitle={t("transactions.widgets.rolloverSubtitle")} />
      <button
        type="button"
        onClick={() => navigate("/transactions/rollover/start")}
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 21m16-10v10l-8 4" />
            </svg>
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold" style={{ color: "var(--enroll-text-primary)" }}>
              {t("transactions.widgets.startRollover")}
            </p>
            <p className="text-xs" style={{ color: "var(--enroll-text-secondary)" }}>
              {t("transactions.widgets.eligibleAmount", { amount: formatCurrency(eligibleAmount) })}
            </p>
          </div>
          <StatusBadge label={t("transactions.eligible")} variant="success" />
        </div>
      </button>
    </section>
  );
});
