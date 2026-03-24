import { AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import type { DashboardAlert } from "@/hooks/useDashboardData";

export type AlertCardProps = {
  alert: DashboardAlert;
  onNavigate: (path: string) => void;
};

export function AlertCard({ alert, onNavigate }: AlertCardProps) {
  const { t } = useTranslation();
  const isRequired = alert.variant === "required";
  const cls = [
    "dashboard-screen-card",
    "dashboard-screen-card--interactive",
    "dashboard-screen-alert",
    isRequired ? "dashboard-screen-alert--required" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button type="button" className={cls} onClick={() => onNavigate(alert.route)}>
      <div className="dashboard-screen-alert__row">
        <span
          className={
            isRequired ? "dashboard-screen-alert__icon dashboard-screen-alert__icon--danger" : "dashboard-screen-alert__icon"
          }
          aria-hidden
        >
          <AlertTriangle className="h-5 w-5 shrink-0" strokeWidth={2} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="dashboard-screen-alert__title-row">
            <h3 className="dashboard-screen-alert__title">{alert.title}</h3>
            <span
              className={
                isRequired
                  ? "dashboard-screen-alert__badge dashboard-screen-alert__badge--danger"
                  : "dashboard-screen-alert__badge"
              }
            >
              {alert.badgeLabel}
            </span>
          </div>
          <p className="dashboard-screen-alert__meta">{alert.subtitle}</p>
          <div className="dashboard-screen-alert__track" aria-hidden>
            <motion.div
              className="dashboard-screen-alert__track-fill"
              initial={{ width: 0 }}
              animate={{ width: `${Math.round(alert.progress * 100)}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>
      <span className="sr-only">{t("dashboardOverview.alert.hint")}</span>
    </button>
  );
}
