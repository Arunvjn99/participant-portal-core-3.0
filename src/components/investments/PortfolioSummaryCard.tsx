import { PieChart, TrendingUp } from "lucide-react";
import type { PortfolioSummary } from "@/modules/investment/data/mockPortfolioDashboard";
import { KPIStatCard } from "./KPIStatCard";

type PortfolioSummaryCardProps = {
  summary: PortfolioSummary;
};

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

function formatSignedCurrency(n: number) {
  const sign = n >= 0 ? "+" : "";
  return `${sign}${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(Math.abs(n))}`;
}

function formatSignedPct(n: number) {
  const sign = n >= 0 ? "+" : "";
  return `${sign}${n.toFixed(1)}%`;
}

function splitBalance(total: number) {
  const int = Math.floor(total);
  const frac = (total % 1).toFixed(2).slice(2);
  return {
    intStr: new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(int),
    frac,
  };
}

/**
 * Hero snapshot: brand column, dominant balance + growth badge, four KPI tiles.
 */
export function PortfolioSummaryCard({ summary }: PortfolioSummaryCardProps) {
  const growthPositive = summary.growthPercentYtd >= 0;
  const { intStr, frac } = splitBalance(summary.totalBalance);

  return (
    <section className="inv-portfolio-summary" aria-labelledby="inv-portfolio-snapshot-title">
      <div className="inv-portfolio-summary__head">
        <div className="inv-portfolio-summary__brand">
          <div className="inv-portfolio-summary__icon-wrap" aria-hidden>
            <PieChart className="inv-portfolio-summary__icon" strokeWidth={1.75} />
          </div>
          <div>
            <p id="inv-portfolio-snapshot-title" className="inv-portfolio-summary__snapshot-label">
              Portfolio Snapshot
            </p>
            <p className="inv-portfolio-summary__snapshot-date">As of {summary.snapshotDateLabel}</p>
          </div>
        </div>
        <div className="inv-portfolio-summary__hero">
          <p className="inv-portfolio-summary__balance-label">Total Portfolio Balance</p>
          <div className="inv-portfolio-summary__balance-row">
            <p className="inv-portfolio-summary__balance">
              <span className="inv-portfolio-summary__balance-currency">$</span>
              <span className="inv-portfolio-summary__balance-int">{intStr}</span>
              <span className="inv-portfolio-summary__balance-frac">.{frac}</span>
            </p>
            <span
              className={
                growthPositive
                  ? "inv-portfolio-summary__badge inv-portfolio-summary__badge--up inv-portfolio-summary__badge--pill"
                  : "inv-portfolio-summary__badge inv-portfolio-summary__badge--down inv-portfolio-summary__badge--pill"
              }
            >
              <TrendingUp className="inv-portfolio-summary__badge-icon" aria-hidden />
              {formatSignedPct(summary.growthPercentYtd)} YTD
            </span>
          </div>
          <p className="inv-portfolio-summary__balance-hint">{summary.asOfLabel}</p>
        </div>
      </div>

      <div className="inv-portfolio-kpi-grid">
        <KPIStatCard
          label="Total Invested"
          value={formatCurrency(summary.totalInvested)}
          subtext="contributions + rollovers"
        />
        <KPIStatCard
          label="Total Gain"
          value={formatSignedCurrency(summary.totalGain)}
          subtext={`${formatSignedPct(summary.gainPercentAllTime)} all time`}
          showPositiveLeadingIcon={summary.totalGain >= 0}
          valueTone={summary.totalGain >= 0 ? "success" : "default"}
        />
        <KPIStatCard
          label="Annual Return"
          value={formatSignedPct(summary.annualReturnPercent)}
          subtext="since Jan 2026"
          showPositiveLeadingIcon={summary.annualReturnPercent >= 0}
          valueTone={summary.annualReturnPercent >= 0 ? "success" : "default"}
        />
        <KPIStatCard
          label="vs S&P 500"
          value={formatSignedPct(summary.vsSp500Percent)}
          subtext={summary.vsSp500Percent >= 0 ? "outperforming benchmark" : "behind benchmark"}
          showPositiveLeadingIcon={summary.vsSp500Percent >= 0}
          valueTone={summary.vsSp500Percent >= 0 ? "primary" : "default"}
        />
      </div>
    </section>
  );
}
