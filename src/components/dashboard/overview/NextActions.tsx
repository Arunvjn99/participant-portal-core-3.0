import { CheckSquare, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { NextActionItem } from "@/hooks/useDashboardData";

export type NextActionsProps = {
  titleKey: string;
  items: NextActionItem[];
  onNavigate: (path: string) => void;
  requiredBadgeKey: string;
};

export function NextActions({ titleKey, items, onNavigate, requiredBadgeKey }: NextActionsProps) {
  const { t } = useTranslation();

  return (
    <div className="dashboard-screen-card">
      <h2 className="dashboard-screen-section-title dashboard-screen-section-title--flush dashboard-screen-next__title">
        <CheckSquare className="dashboard-screen-next__title-icon" strokeWidth={2} aria-hidden />
        {t(titleKey)}
      </h2>
      <div className="dashboard-screen-next__list">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            className="dashboard-screen-next__item"
            onClick={() => onNavigate(item.route)}
          >
            <span className="dashboard-screen-next__item-label">{t(item.titleKey)}</span>
            {item.badgeKey === "required" ? (
              <span className="dashboard-screen-next__badge">{t(requiredBadgeKey)}</span>
            ) : (
              <ChevronRight className="dashboard-screen-next__chevron" aria-hidden />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
