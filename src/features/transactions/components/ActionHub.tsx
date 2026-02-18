import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, useReducedMotion } from "framer-motion";
import { SectionHeader } from "../../../components/dashboard/shared/SectionHeader";
import { StatusBadge } from "../../../components/dashboard/shared/StatusBadge";
import type { ActionTileConfig } from "../types";
const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);

const TILE_CONFIGS: { type: ActionTileConfig["type"]; titleKey: string; subtextKey: string; statusBadgeKey?: string; eligibilityAmount?: number; route: string; icon: React.ReactNode }[] = [
  {
    type: "loan",
    titleKey: "transactions.takeLoan",
    subtextKey: "transactions.borrowFrom401k",
    statusBadgeKey: "transactions.eligible",
    route: "/transactions/loan/start",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    type: "withdrawal",
    titleKey: "transactions.withdrawalTitle",
    subtextKey: "transactions.hardshipAndRegular",
    eligibilityAmount: 32000,
    route: "/transactions/withdrawal/start",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
  },
  {
    type: "transfer",
    titleKey: "transactions.reallocate",
    subtextKey: "transactions.transferFunds",
    statusBadgeKey: "transactions.smart",
    route: "/transactions/transfer/start",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
      </svg>
    ),
  },
  {
    type: "rollover",
    titleKey: "transactions.startRollover",
    subtextKey: "transactions.consolidateAccounts",
    route: "/transactions/rollover/start",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
  },
];

export const ActionHub = memo(function ActionHub() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const reduced = !!useReducedMotion();

  return (
    <section className="space-y-3">
      <SectionHeader title={t("transactions.actionsTitle")} subtitle={t("transactions.actionsSubtitle")} />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {TILE_CONFIGS.map((tile, i) => (
          <motion.button
            key={tile.type}
            type="button"
            onClick={() => navigate(tile.route)}
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: i * 0.05, ease: "easeOut" }}
            whileHover={reduced ? undefined : { scale: 1.02 }}
            className="group flex flex-col items-start justify-between rounded-[var(--txn-card-radius)] border p-5 text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--enroll-brand)] focus-visible:ring-offset-2"
            style={{
              background: "var(--color-surface)",
              borderColor: "var(--color-border)",
              boxShadow: "var(--shadow-soft)",
            }}
          >
            <div className="mb-3 flex w-full items-start justify-between">
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-colors"
                style={{
                  background: "var(--color-surface)",
                  borderColor: "var(--color-border)",
                  color: "var(--color-text-secondary)",
                }}
              >
                {tile.icon}
              </span>
              {tile.statusBadgeKey && <StatusBadge label={t(tile.statusBadgeKey)} variant="success" />}
            </div>
            <div>
              <span className="block text-sm font-semibold" style={{ color: "var(--color-text)" }}>
                {t(tile.titleKey)}
              </span>
              <span className="block text-xs" style={{ color: "var(--color-text-secondary)" }}>
                {t(tile.subtextKey)}
              </span>
              {tile.eligibilityAmount != null && (
                <span className="mt-1 block text-[10px] font-medium uppercase tracking-wide" style={{ color: "var(--color-success)" }}>
                  {formatCurrency(tile.eligibilityAmount)} {t("transactions.available")}
                </span>
              )}
            </div>
          </motion.button>
        ))}
      </div>
    </section>
  );
});
