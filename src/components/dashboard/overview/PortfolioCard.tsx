import { useTranslation } from "react-i18next";
import type { PortfolioSlice } from "@/hooks/useDashboardData";

export type PortfolioCardProps = {
  titleKey: string;
  strategyBadgeKey: string;
  slices: PortfolioSlice[];
  onNavigate: (path: string) => void;
  detailRoute: string;
};

const SEGMENT_CLASS: Record<PortfolioSlice["tone"], string> = {
  us: "dashboard-screen-portfolio__segment--us",
  intl: "dashboard-screen-portfolio__segment--intl",
  bonds: "dashboard-screen-portfolio__segment--bonds",
  cash: "dashboard-screen-portfolio__segment--cash",
};

const SWATCH_CLASS: Record<PortfolioSlice["tone"], string> = {
  us: "dashboard-screen-portfolio__segment--us",
  intl: "dashboard-screen-portfolio__segment--intl",
  bonds: "dashboard-screen-portfolio__segment--bonds",
  cash: "dashboard-screen-portfolio__segment--cash",
};

export function PortfolioCard({
  titleKey,
  strategyBadgeKey,
  slices,
  onNavigate,
  detailRoute,
}: PortfolioCardProps) {
  const { t } = useTranslation();
  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <button
      type="button"
      className="dashboard-screen-card dashboard-screen-card--interactive w-full text-left"
      onClick={() => onNavigate(detailRoute)}
    >
      <div className="dashboard-screen-portfolio__head">
        <h2 className="dashboard-screen-section-title dashboard-screen-section-title--flush">{t(titleKey)}</h2>
        <span className="dashboard-screen-portfolio__badge">{t(strategyBadgeKey)}</span>
      </div>
      <div
        className="dashboard-screen-portfolio__bar"
        style={{
          gridTemplateColumns: slices.map((s) => `${s.percent}fr`).join(" "),
        }}
      >
        {slices.map((s) => (
          <div
            key={s.id}
            className={`dashboard-screen-portfolio__segment ${SEGMENT_CLASS[s.tone]}`}
            title={`${s.percent}%`}
          />
        ))}
      </div>
      <div className="dashboard-screen-portfolio__legend">
        {slices.map((s) => (
          <div key={s.id} className="dashboard-screen-portfolio__legend-row">
            <span className="dashboard-screen-portfolio__legend-label">
              <span className={`dashboard-screen-portfolio__swatch ${SWATCH_CLASS[s.tone]}`} />
              <span className="dashboard-screen-portfolio__legend-name">{t(s.labelKey)}</span>
            </span>
            <span className="dashboard-screen-portfolio__legend-values">
              {s.percent}% · {fmt(s.amount)}
            </span>
          </div>
        ))}
      </div>
    </button>
  );
}
