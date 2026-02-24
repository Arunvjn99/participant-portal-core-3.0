import { useTranslation } from "react-i18next";
import { useLocaleFormat } from "../hooks/useLocaleFormat";
import type { HubFinancialData } from "../data/mockHubData";

interface RolloverSimulatorProps {
  data: HubFinancialData;
}

export function RolloverSimulator({ data }: RolloverSimulatorProps) {
  const { t } = useTranslation();
  const fmt = useLocaleFormat();

  return (
    <div
      role="tabpanel"
      id="tabpanel-rollover"
      aria-labelledby="tab-rollover"
      className="rounded-xl border border-[var(--color-border)] p-6"
      style={{ backgroundColor: "var(--color-surface)" }}
    >
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <div
          className="flex h-16 w-16 items-center justify-center rounded-full"
          style={{ backgroundColor: "var(--color-primary-light, rgba(59,130,246,0.08))" }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M17 1l4 4-4 4" />
            <path d="M3 11V9a4 4 0 0 1 4-4h14" />
            <path d="M7 23l-4-4 4-4" />
            <path d="M21 13v2a4 4 0 0 1-4 4H3" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-[var(--color-text)]">
          {t("transactionHub.tabs.rollover")}
        </h3>
        <p className="max-w-md text-sm text-[var(--color-text-secondary)]">
          {t("transactions.consolidateAccounts")}
        </p>
        <div className="flex items-center gap-6 rounded-lg border border-[var(--color-border)] px-6 py-4">
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs text-[var(--color-text-secondary)]">
              {t("transactionHub.loanSim.projectedBalance")}
            </span>
            <span className="text-xl font-bold tabular-nums text-[var(--color-text)]">
              {fmt.currency(data.projectedBalance, true)}
            </span>
          </div>
          <div className="h-8 w-px" style={{ backgroundColor: "var(--color-border)" }} aria-hidden />
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs text-[var(--color-text-secondary)]">
              {t("transactions.eligible")}
            </span>
            <span className="text-xl font-bold tabular-nums text-[var(--color-success)]">
              {fmt.currency(data.projectedBalance * 0.85, true)}
            </span>
          </div>
        </div>
        <button
          type="button"
          className="rounded-lg px-6 py-2.5 text-sm font-semibold text-white transition-colors duration-150"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          {t("transactions.startRollover")}
        </button>
      </div>
    </div>
  );
}
