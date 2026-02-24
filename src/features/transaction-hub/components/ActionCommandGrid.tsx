import { useTranslation } from "react-i18next";
import { useLocaleFormat } from "../hooks/useLocaleFormat";
import type { HubFinancialData } from "../data/mockHubData";

export type ActionType = "loan" | "withdraw" | "rebalance" | "contribution" | "rollover";

interface ActionCommandGridProps {
  data: HubFinancialData;
  onAction: (action: ActionType) => void;
}

interface ActionCardConfig {
  type: ActionType;
  titleKey: string;
  descKey: string;
  hintKey: string;
  hintParams?: Record<string, string>;
  icon: React.ReactNode;
  accentFrom: string;
  accentTo: string;
  statusKey?: string;
}

const ICONS: Record<ActionType, React.ReactNode> = {
  loan: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <circle cx="12" cy="12" r="3" />
      <path d="M2 10h2" /><path d="M20 10h2" />
    </svg>
  ),
  withdraw: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 2v10" /><path d="m15 9-3 3-3-3" />
      <rect x="3" y="15" width="18" height="6" rx="2" />
    </svg>
  ),
  rebalance: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 3v18h18" />
      <path d="M7 16l4-8 4 4 5-10" />
    </svg>
  ),
  contribution: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 2v20" /><path d="m17 7-5-5-5 5" />
      <path d="M4 12h16" />
    </svg>
  ),
  rollover: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M17 1l4 4-4 4" /><path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <path d="M7 23l-4-4 4-4" /><path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </svg>
  ),
};

export function ActionCommandGrid({ data, onAction }: ActionCommandGridProps) {
  const { t } = useTranslation();
  const fmt = useLocaleFormat();

  const hasActiveLoan = data.activeTransactions.some((tx) => tx.type === "loan");

  const cards: ActionCardConfig[] = [
    {
      type: "loan",
      titleKey: "transactionHub.actions.takeLoan",
      descKey: "transactionHub.actions.takeLoanDesc",
      hintKey: "transactionHub.actions.takeLoanHint",
      hintParams: { amount: fmt.currency(data.maxLoanEligible, true) },
      icon: ICONS.loan,
      accentFrom: "var(--color-primary)",
      accentTo: "var(--color-primary-hover, var(--color-primary))",
      statusKey: hasActiveLoan ? "transactionHub.actions.activeStatus" : "transactionHub.actions.eligibleStatus",
    },
    {
      type: "withdraw",
      titleKey: "transactionHub.actions.withdrawFunds",
      descKey: "transactionHub.actions.withdrawFundsDesc",
      hintKey: "transactionHub.actions.withdrawFundsHint",
      icon: ICONS.withdraw,
      accentFrom: "var(--color-warning, #ca8a04)",
      accentTo: "var(--color-warning, #ca8a04)",
    },
    {
      type: "rebalance",
      titleKey: "transactionHub.actions.rebalancePortfolio",
      descKey: "transactionHub.actions.rebalancePortfolioDesc",
      hintKey: "transactionHub.actions.rebalancePortfolioHint",
      hintParams: { drift: data.portfolioDriftPercent.toFixed(1) },
      icon: ICONS.rebalance,
      accentFrom: "var(--color-success)",
      accentTo: "var(--color-success)",
      statusKey: data.portfolioDriftPercent > 3 ? "transactionHub.actions.driftStatus" : undefined,
    },
    {
      type: "contribution",
      titleKey: "transactionHub.actions.adjustContribution",
      descKey: "transactionHub.actions.adjustContributionDesc",
      hintKey: "transactionHub.actions.adjustContributionHint",
      hintParams: { rate: String(data.currentContributionRate) },
      icon: ICONS.contribution,
      accentFrom: "var(--chart-2, var(--color-success))",
      accentTo: "var(--chart-2, var(--color-success))",
    },
    {
      type: "rollover",
      titleKey: "transactionHub.actions.rolloverTransfer",
      descKey: "transactionHub.actions.rolloverTransferDesc",
      hintKey: "transactionHub.actions.rolloverTransferHint",
      icon: ICONS.rollover,
      accentFrom: "var(--chart-4, var(--color-text-tertiary))",
      accentTo: "var(--chart-4, var(--color-text-tertiary))",
      statusKey: "transactionHub.actions.eligibleStatus",
    },
  ];

  return (
    <section aria-label={t("transactionHub.pageTitle")}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {cards.map((card) => (
          <ActionCard key={card.type} card={card} onClick={() => onAction(card.type)} />
        ))}
      </div>
    </section>
  );
}

function ActionCard({ card, onClick }: { card: ActionCardConfig; onClick: () => void }) {
  const { t } = useTranslation();

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative flex flex-col items-start gap-3 overflow-hidden rounded-xl border border-[var(--color-border)] p-5 text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
      style={{ backgroundColor: "var(--color-surface-elevated, var(--color-surface))" }}
    >
      {/* Accent gradient overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        style={{ background: `linear-gradient(135deg, ${card.accentFrom}08 0%, transparent 60%)` }}
        aria-hidden
      />

      {/* Icon */}
      <div
        className="flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105"
        style={{ backgroundColor: `color-mix(in srgb, ${card.accentFrom} 10%, transparent)`, color: card.accentFrom }}
      >
        {card.icon}
      </div>

      {/* Title */}
      <h3 className="text-base font-semibold text-[var(--color-text)]">
        {t(card.titleKey)}
      </h3>

      {/* Description */}
      <p className="text-xs leading-relaxed text-[var(--color-text-secondary)]">
        {t(card.descKey)}
      </p>

      {/* Hint */}
      <span className="text-xs font-medium text-[var(--color-text-tertiary)]">
        {t(card.hintKey, card.hintParams)}
      </span>

      {/* Status Badge */}
      {card.statusKey && (
        <span
          className="absolute right-3 top-3 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
          style={{ backgroundColor: `color-mix(in srgb, ${card.accentFrom} 12%, transparent)`, color: card.accentFrom }}
        >
          {t(card.statusKey)}
        </span>
      )}

      {/* Arrow indicator */}
      <div className="mt-auto flex items-center gap-1 text-xs font-medium transition-transform duration-150 group-hover:translate-x-1" style={{ color: card.accentFrom }}>
        <span>{t("transactionHub.snapshot.quickAction")}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
        </svg>
      </div>
    </button>
  );
}
