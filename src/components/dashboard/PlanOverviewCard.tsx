import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { PlanDetails, Balances } from "../../data/enrollmentSummary";

interface PlanOverviewCardProps {
  plan: PlanDetails;
  balances: Balances;
  isWithdrawalRestricted: boolean;
}

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);

const formatCurrencyWithSign = (n: number) => {
  const sign = n >= 0 ? "" : "-";
  return `~${sign}${formatCurrency(Math.abs(n))}`;
};

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

/** Mock balance history for chart (5 yrs, 10 yrs, 20 yrs, 30 yrs) */
const BALANCE_CHART_POINTS = [50000, 80000, 120000, 180000, 235000];
const BALANCE_CHART_LABELS = ["5 yrs", "10 yrs", "20 yrs", "30 yrs", "Now"];

/**
 * Plan Overview Card - Figma 595-1517
 * 9% ER badge, enrolled date with calendar, total balance + YTD + line chart, 3 balance cards
 */
export const PlanOverviewCard = ({
  plan,
  balances,
  isWithdrawalRestricted,
}: PlanOverviewCardProps) => {
  const navigate = useNavigate();
  const [tooltip, setTooltip] = useState<{ index: number; x: number; y: number } | null>(null);
  const maxBalance = Math.max(...BALANCE_CHART_POINTS, plan.totalBalance);

  const w = 200;
  const h = 80;
  const padding = { left: 20, right: 20 };
  const chartWidth = w - padding.left - padding.right;
  const handleChartMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const svgX = ((e.clientX - rect.left) / rect.width) * w;
    const index = Math.max(
      0,
      Math.min(
        BALANCE_CHART_POINTS.length - 1,
        Math.round(((svgX - padding.left) / chartWidth) * (BALANCE_CHART_POINTS.length - 1))
      )
    );
    setTooltip({ index, x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <article className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm min-h-fit w-full min-w-0">
      {/* Header: 9% ER badge + Enrolled date */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-[var(--color-success)]/10 px-3 py-1 text-sm font-semibold text-[var(--color-success)]">
            {plan.contributionRate}% ER
          </span>
          <span className="flex items-center gap-1.5 text-sm text-[var(--color-textSecondary)]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Enrolled: {formatDate(plan.enrolledAt)}
          </span>
        </div>
      </div>

      <h2 className="mb-4 text-xl font-bold text-[var(--color-text)]">{plan.planName}</h2>

      {/* Balance + Chart row */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <span className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-textSecondary)]">
            Total Balance
          </span>
          <div className="mt-1 flex flex-wrap items-baseline gap-3">
            <span className="text-3xl font-bold text-[var(--color-text)]">
              {formatCurrency(plan.totalBalance)}
            </span>
            <span className="flex items-center gap-1 text-sm font-medium text-[var(--color-success)]">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <polyline points="18 15 12 9 6 15" />
              </svg>
              +{plan.ytdReturn}% YTD
            </span>
          </div>
        </div>
        <div className="relative h-24 w-full min-w-[180px] max-w-[280px] lg:flex-shrink-0">
          <svg
            viewBox="0 0 200 80"
            className="h-full w-full cursor-crosshair"
            preserveAspectRatio="xMidYMid meet"
            onMouseMove={handleChartMouseMove}
            onMouseLeave={() => setTooltip(null)}
          >
            <defs>
              <linearGradient id="ped-plan-chart-grad" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="var(--color-primary, #3b82f6)" stopOpacity="0.2" />
                <stop offset="100%" stopColor="var(--color-primary, #3b82f6)" stopOpacity="0" />
              </linearGradient>
            </defs>
            {(() => {
              const pts = BALANCE_CHART_POINTS.map((v, i) => ({
                x: 20 + (i / (BALANCE_CHART_POINTS.length - 1)) * 160,
                y: 70 - (v / maxBalance) * 55,
              }));
              const areaPath = `${pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ")} L 180 70 L 20 70 Z`;
              const linePath = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
              return (
                <>
                  <path d={areaPath} fill="url(#ped-plan-chart-grad)" />
                  <path d={linePath} fill="none" stroke="var(--color-primary, #2563eb)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </>
              );
            })()}
          </svg>
          {tooltip && (
            <div
              className="pointer-events-none absolute z-10 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm shadow-lg"
              style={{ left: tooltip.x + 12, top: tooltip.y + 12, transform: "translate(0, -50%)" }}
            >
              <div className="font-medium text-[var(--color-text)]">
                {BALANCE_CHART_LABELS[tooltip.index]}
              </div>
              <div className="text-[var(--color-primary)]">
                {formatCurrency(BALANCE_CHART_POINTS[tooltip.index])}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Three balance cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-4">
          <h3 className="mb-1 text-sm font-semibold text-[var(--color-text)]">
            Vested Balance
          </h3>
          <span className="block text-2xl font-bold text-[var(--color-text)]">
            {formatCurrency(balances.vestedBalance)}
          </span>
          <p className="mb-3 mt-1 text-xs text-[var(--color-textSecondary)]">
            Move to IRA or new employer.
          </p>
          <button
            type="button"
            className="text-sm font-medium text-[var(--color-primary)] hover:underline"
            onClick={() => navigate("/transactions/rollover/start")}
          >
            Start Rollover
          </button>
        </div>
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-4">
          <h3 className="mb-1 text-sm font-semibold text-[var(--color-text)]">
            Rollover Eligible
          </h3>
          <span className="block text-2xl font-bold text-[var(--color-text)]">
            {formatCurrency(balances.rolloverEligible)}
          </span>
          <p className="mb-3 mt-1 text-xs text-[var(--color-textSecondary)]">
            Move to IRA or new employer.
          </p>
          <button
            type="button"
            className="text-sm font-medium text-[var(--color-primary)] hover:underline"
            onClick={() => navigate("/transactions/rollover/start")}
          >
            Start Rollover
          </button>
        </div>
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-4">
          <h3 className="mb-1 text-sm font-semibold text-[var(--color-text)]">
            Available Cash
          </h3>
          <span className="block text-2xl font-bold text-[var(--color-text)]">
            {formatCurrencyWithSign(balances.availableCash)}
          </span>
          <p className="mb-3 mt-1 text-xs text-[var(--color-textSecondary)]">
            Est. after taxes/penalties.
          </p>
          <button
            type="button"
            className="text-sm font-medium text-[var(--color-primary)] hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isWithdrawalRestricted}
            onClick={() => navigate("/transactions/withdrawal/start")}
          >
            Request Withdrawal
          </button>
        </div>
      </div>
    </article>
  );
};
