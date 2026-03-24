import {
  ArrowLeftRight,
  RefreshCw,
  UserRound,
  Wallet,
  Landmark,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import type { QuickAction } from "@/hooks/useDashboardData";

const ICONS = {
  contribution: Wallet,
  transfer: ArrowLeftRight,
  rebalance: RefreshCw,
  rollover: Landmark,
  profile: UserRound,
} as const;

export type QuickActionsProps = {
  titleKey: string;
  actions: QuickAction[];
  onNavigate: (path: string) => void;
};

export function QuickActions({ titleKey, actions, onNavigate }: QuickActionsProps) {
  const { t } = useTranslation();

  return (
    <div className="dashboard-screen-card">
      <h2 className="dashboard-screen-section-title">{t(titleKey)}</h2>
      <div className="dashboard-screen-quick-actions">
        {actions.map((a) => {
          const Icon = ICONS[a.icon];
          return (
            <button
              key={a.id}
              type="button"
              className="dashboard-screen-quick-actions__item"
              onClick={() => onNavigate(a.route)}
            >
              <span className="dashboard-screen-quick-actions__icon">
                <Icon className="h-5 w-5" strokeWidth={2} aria-hidden />
              </span>
              <span className="dashboard-screen-quick-actions__label">{t(a.labelKey)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
