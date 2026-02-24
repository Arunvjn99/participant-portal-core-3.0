import { useTranslation } from "react-i18next";
import { useAnimatedNumber } from "../hooks/useAnimatedNumber";
import { useLocaleFormat } from "../hooks/useLocaleFormat";
import type { HubFinancialData } from "../data/mockHubData";

interface SnapshotCardProps {
  title: string;
  value: number;
  format: "currency" | "percent";
  risk: "low" | "moderate" | "high";
  sparkline: number[];
  ctaLabel: string;
  onAction: () => void;
}

const RISK_COLORS: Record<string, string> = {
  low: "var(--color-success)",
  moderate: "var(--color-warning, #ca8a04)",
  high: "var(--color-danger)",
};

const RISK_BG: Record<string, string> = {
  low: "var(--color-success-light, rgba(34,197,94,0.12))",
  moderate: "var(--color-warning-light, rgba(202,138,4,0.12))",
  high: "var(--color-danger-light, rgba(239,68,68,0.12))",
};

function MiniSparkline({ data }: { data: number[] }) {
  if (!data.length) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const h = 32;
  const w = 80;
  const step = w / (data.length - 1);

  const points = data
    .map((v, i) => `${i * step},${h - ((v - min) / range) * h}`)
    .join(" ");

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      className="shrink-0"
      aria-hidden
    >
      <polyline
        points={points}
        fill="none"
        stroke="var(--color-primary)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SnapshotCard({
  title,
  value,
  format,
  risk,
  sparkline,
  ctaLabel,
  onAction,
}: SnapshotCardProps) {
  const { t } = useTranslation();
  const { currency, percent } = useLocaleFormat();
  const animated = useAnimatedNumber(value);

  const riskKey =
    risk === "low"
      ? "transactionHub.snapshot.riskLow"
      : risk === "moderate"
        ? "transactionHub.snapshot.riskModerate"
        : "transactionHub.snapshot.riskHigh";

  const formatted =
    format === "currency" ? currency(animated, true) : percent(animated);

  return (
    <div
      className="group flex flex-col gap-3 rounded-xl border border-[var(--color-border)] p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-5"
      style={{ backgroundColor: "var(--color-surface-elevated, var(--color-surface))" }}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-secondary)]">
          {title}
        </span>
        <span
          className="inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
          style={{
            color: RISK_COLORS[risk],
            backgroundColor: RISK_BG[risk],
          }}
        >
          {t(riskKey)}
        </span>
      </div>

      <div className="flex items-end justify-between gap-3">
        <span className="text-2xl font-bold tabular-nums text-[var(--color-text)] sm:text-3xl">
          {formatted}
        </span>
        <MiniSparkline data={sparkline} />
      </div>

      <button
        type="button"
        onClick={onAction}
        className="mt-auto self-start rounded-lg px-3 py-1.5 text-xs font-medium transition-colors duration-150"
        style={{
          color: "var(--color-primary)",
          backgroundColor: "var(--color-primary-light, rgba(59,130,246,0.08))",
        }}
      >
        {ctaLabel}
      </button>
    </div>
  );
}

interface FinancialSnapshotStripProps {
  data: HubFinancialData;
  onTabSelect: (tab: string) => void;
}

export function FinancialSnapshotStrip({ data, onTabSelect }: FinancialSnapshotStripProps) {
  const { t } = useTranslation();

  const cards: SnapshotCardProps[] = [
    {
      title: t("transactionHub.snapshot.maxLoan"),
      value: data.maxLoanEligible,
      format: "currency",
      risk: data.maxLoanEligible > 40000 ? "low" : data.maxLoanEligible > 20000 ? "moderate" : "high",
      sparkline: data.sparklineData,
      ctaLabel: t("transactionHub.snapshot.applyNow"),
      onAction: () => onTabSelect("loan"),
    },
    {
      title: t("transactionHub.snapshot.safeWithdrawal"),
      value: data.projectedBalance * 0.04,
      format: "currency",
      risk: "moderate",
      sparkline: data.sparklineData.map((v) => v * 0.04),
      ctaLabel: t("transactionHub.snapshot.simulateNow"),
      onAction: () => onTabSelect("withdraw"),
    },
    {
      title: t("transactionHub.snapshot.contributionRate"),
      value: data.currentContributionRate,
      format: "percent",
      risk: data.currentContributionRate >= 10 ? "low" : data.currentContributionRate >= 6 ? "moderate" : "high",
      sparkline: data.sparklineData.map((_, i) => data.currentContributionRate + Math.sin(i) * 0.5),
      ctaLabel: t("transactionHub.snapshot.adjustNow"),
      onAction: () => onTabSelect("contribution"),
    },
    {
      title: t("transactionHub.snapshot.portfolioDrift"),
      value: data.portfolioDriftPercent,
      format: "percent",
      risk: data.portfolioDriftPercent < 3 ? "low" : data.portfolioDriftPercent < 6 ? "moderate" : "high",
      sparkline: data.sparklineData.map((_, i) => data.portfolioDriftPercent + Math.cos(i) * 1.2),
      ctaLabel: t("transactionHub.snapshot.rebalanceNow"),
      onAction: () => onTabSelect("rebalance"),
    },
  ];

  return (
    <section aria-label={t("transactionHub.pageTitle")}>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
        {cards.map((card) => (
          <SnapshotCard key={card.title} {...card} />
        ))}
      </div>
    </section>
  );
}
