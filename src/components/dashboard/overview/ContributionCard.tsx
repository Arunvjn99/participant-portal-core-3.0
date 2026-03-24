import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import type { ContributionSlice } from "@/hooks/useDashboardData";

export type ContributionCardProps = {
  titleKey: string;
  periodLabel: string;
  totalBadgeKey: string;
  slices: ContributionSlice[];
  onNavigate: (path: string) => void;
  /** e.g. enrollment contribution route */
  detailRoute: string;
};

export function ContributionCard({
  titleKey,
  periodLabel,
  totalBadgeKey,
  slices,
  onNavigate,
  detailRoute,
}: ContributionCardProps) {
  const { t } = useTranslation();

  return (
    <button
      type="button"
      className="dashboard-screen-card dashboard-screen-card--interactive w-full text-left"
      onClick={() => onNavigate(detailRoute)}
    >
      <div className="dashboard-screen-contrib__head">
        <h2 className="dashboard-screen-section-title dashboard-screen-section-title--flush">{t(titleKey)}</h2>
        <span className="dashboard-screen-contrib__period">{periodLabel}</span>
      </div>
      <div className="dashboard-screen-contrib__cols">
        {slices.map((slice) => (
          <div key={slice.id}>
            <p className="dashboard-screen-contrib__col-label">
              {t(slice.labelKey, { pct: slice.percent })}
            </p>
            <p className="dashboard-screen-contrib__col-value">{slice.amountLabel}</p>
            <div className="dashboard-screen-progress">
              <motion.div
                className={
                  slice.fillVariant === "success"
                    ? "dashboard-screen-progress__fill dashboard-screen-progress__fill--success"
                    : "dashboard-screen-progress__fill"
                }
                initial={{ width: 0 }}
                animate={{ width: `${Math.round(slice.progress * 100)}%` }}
                transition={{ duration: 0.55, ease: "easeOut" }}
              />
            </div>
          </div>
        ))}
      </div>
      <span className="dashboard-screen-contrib__total-badge">{t(totalBadgeKey)}</span>
    </button>
  );
}
