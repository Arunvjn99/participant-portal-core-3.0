import { useTranslation } from "react-i18next";
import type { ActivityItem } from "@/hooks/useDashboardData";

export type ActivityListProps = {
  titleKey: string;
  viewAllKey: string;
  items: ActivityItem[];
  onViewAll: (path: string) => void;
  onOpenItem: (path: string) => void;
  viewAllRoute: string;
};

export function ActivityList({
  titleKey,
  viewAllKey,
  items,
  onViewAll,
  onOpenItem,
  viewAllRoute,
}: ActivityListProps) {
  const { t } = useTranslation();

  return (
    <div className="dashboard-screen-card">
      <div className="dashboard-screen-activity__head">
        <h2 className="dashboard-screen-section-title dashboard-screen-section-title--flush">{t(titleKey)}</h2>
        <button type="button" className="dashboard-screen-activity__link" onClick={() => onViewAll(viewAllRoute)}>
          {t(viewAllKey)}
        </button>
      </div>
      <div className="dashboard-screen-activity__list">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            className="dashboard-screen-activity__item"
            onClick={() => onOpenItem(item.route)}
          >
            <span className="dashboard-screen-activity__item-main">
              <span className="dashboard-screen-activity__item-title">{t(item.titleKey)}</span>
              <span className="dashboard-screen-activity__item-detail">{t(item.detailKey)}</span>
            </span>
            <span className="dashboard-screen-activity__item-right">
              {item.amountLabel ? (
                <span className="dashboard-screen-activity__item-amount">{item.amountLabel}</span>
              ) : null}
              <span className="dashboard-screen-activity__item-date">{item.dateLabel}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
