import { useId } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import type { BalanceChartPoint } from "@/hooks/useDashboardData";

export type DashboardHeroProps = {
  totalLabel: string;
  totalValue: number;
  growthPercent: number;
  growthLabelKey: string;
  onTrackLabelKey: string;
  vestedLabel: string;
  retirementYear: number;
  vestedPct: number;
  chartPoints: BalanceChartPoint[];
  onNavigate?: () => void;
};

function buildPathD(points: BalanceChartPoint[], width: number, height: number): string {
  if (points.length === 0) return "";
  const xs = points.map((p) => (p.x / 100) * width);
  const ys = points.map((p) => height - (p.y / 100) * height * 0.85);
  const first = `M ${xs[0]} ${ys[0]}`;
  const rest = xs.slice(1).map((x, i) => `L ${x} ${ys[i + 1]}`);
  return [first, ...rest].join(" ");
}

function buildAreaD(points: BalanceChartPoint[], width: number, height: number): string {
  const line = buildPathD(points, width, height);
  if (!line) return "";
  const lastX = (points[points.length - 1].x / 100) * width;
  const firstX = (points[0].x / 100) * width;
  return `${line} L ${lastX} ${height} L ${firstX} ${height} Z`;
}

export function DashboardHero({
  totalLabel,
  totalValue,
  growthPercent,
  growthLabelKey,
  onTrackLabelKey,
  vestedLabel,
  retirementYear,
  vestedPct,
  chartPoints,
  onNavigate,
}: DashboardHeroProps) {
  const { t } = useTranslation();
  const gradId = `dashboard-hero-area-${useId().replace(/:/g, "")}`;
  const fmt = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(totalValue);

  const w = 400;
  const h = 120;
  const pathLine = buildPathD(chartPoints, w, h);
  const pathArea = buildAreaD(chartPoints, w, h);

  const body = (
    <>
      <div className="dashboard-screen-hero__top">
        <p className="dashboard-screen-hero__label">{totalLabel}</p>
        <span className="dashboard-screen-hero__badge">{t(onTrackLabelKey)}</span>
      </div>
      <p className="dashboard-screen-hero__value">{fmt}</p>
      <p className="dashboard-screen-hero__growth">{t(growthLabelKey, { pct: growthPercent })}</p>

      <svg className="dashboard-screen-chart" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-hidden>
        <defs>
          <linearGradient id={gradId} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" className="dashboard-screen-chart__area-stop-top" />
            <stop offset="100%" className="dashboard-screen-chart__area-stop-bottom" />
          </linearGradient>
        </defs>
        <motion.path
          d={pathArea}
          fill={`url(#${gradId})`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        />
        <motion.path
          d={pathLine}
          className="dashboard-screen-chart__line"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />
        {chartPoints.map((p, i) => {
          const cx = (p.x / 100) * w;
          const cy = h - (p.y / 100) * h * 0.85;
          return <circle key={i} cx={cx} cy={cy} r={4} className="dashboard-screen-chart__dot" />;
        })}
      </svg>

      <div className="dashboard-screen-hero__footer">
        <div>
          <p className="dashboard-screen-hero__stat-label">{t("dashboardOverview.balance.vestedBalance")}</p>
          <p className="dashboard-screen-hero__stat-value">{vestedLabel}</p>
        </div>
        <div>
          <p className="dashboard-screen-hero__stat-label">{t("dashboardOverview.balance.retirement")}</p>
          <p className="dashboard-screen-hero__stat-value">
            {t("dashboardOverview.balance.retirementYear", { year: retirementYear })}
          </p>
        </div>
        <div>
          <p className="dashboard-screen-hero__stat-label">{t("dashboardOverview.balance.pctVested")}</p>
          <p className="dashboard-screen-hero__stat-value">{vestedPct}%</p>
        </div>
      </div>
    </>
  );

  const shellClass = onNavigate
    ? "dashboard-screen-card dashboard-screen-card--interactive dashboard-screen-fade-up dashboard-screen-hero w-full text-left"
    : "dashboard-screen-card dashboard-screen-fade-up dashboard-screen-hero w-full";

  if (onNavigate) {
    return (
      <button type="button" className={shellClass} onClick={onNavigate}>
        {body}
      </button>
    );
  }

  return <div className={shellClass}>{body}</div>;
}
