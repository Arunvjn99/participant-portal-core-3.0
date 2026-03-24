import { useTranslation } from "react-i18next";
import type { AdvisorData } from "@/hooks/useDashboardData";

export type AdvisorCardProps = {
  advisor: AdvisorData;
  onMessage: () => void;
  onSchedule: () => void;
};

export function AdvisorCard({ advisor, onMessage, onSchedule }: AdvisorCardProps) {
  const { t } = useTranslation();

  return (
    <div className="dashboard-screen-card dashboard-screen-advisor-card">
      <div className="dashboard-screen-advisor__header">
        <div className="dashboard-screen-advisor__header-row">
          <img
            className="dashboard-screen-advisor__avatar"
            src={advisor.avatarSrc}
            alt=""
            onError={(e) => {
              (e.target as HTMLImageElement).style.opacity = "0";
            }}
          />
          <div>
            <h3 className="dashboard-screen-advisor__name">{advisor.name}</h3>
            <p className="dashboard-screen-advisor__role">{t(advisor.roleKey)}</p>
          </div>
        </div>
      </div>
      <div className="dashboard-screen-advisor-card__body">
        <div className="dashboard-screen-advisor__stats">
          <span>
            <strong>{advisor.rating}</strong>
            {t("dashboardOverview.advisor.rating")}
          </span>
          <span>
            <strong>{advisor.experience}</strong>
            {t("dashboardOverview.advisor.experience")}
          </span>
          <span>
            <strong>{advisor.clients}</strong>
            {t("dashboardOverview.advisor.clients")}
          </span>
        </div>
        <p className="dashboard-screen-advisor__bio">{t(advisor.bioKey)}</p>
        <div className="dashboard-screen-advisor__actions">
          <button type="button" className="btn btn-outline dashboard-screen-advisor__btn" onClick={onMessage}>
            {t("dashboardOverview.advisor.message")}
          </button>
          <button type="button" className="btn btn-primary dashboard-screen-advisor__btn" onClick={onSchedule}>
            {t("dashboardOverview.advisor.schedule")}
          </button>
        </div>
      </div>
    </div>
  );
}
