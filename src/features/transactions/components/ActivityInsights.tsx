import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { InsightCard } from "../../../components/dashboard/shared/InsightCard";
import { SectionHeader } from "../../../components/dashboard/shared/SectionHeader";
import type { ActivityInsight } from "../types";

interface ActivityInsightsProps {
  insights: ActivityInsight[];
}

const accentColor = (type: ActivityInsight["type"]) => {
  switch (type) {
    case "warning":
      return "var(--color-warning)";
    case "withdrawal":
      return "var(--color-danger)";
    case "rollover":
      return "var(--color-primary)";
    case "contribution":
      return "var(--color-success)";
    default:
      return "var(--color-primary)";
  }
};

export const ActivityInsights = memo(function ActivityInsights({ insights }: ActivityInsightsProps) {
  const navigate = useNavigate();
  const { t } = useTranslation("dashboard");
  if (insights.length === 0) return null;

  return (
    <section className="space-y-4">
      <SectionHeader title={t("insights.title")} subtitle={t("insights.subtitle")} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {insights.map((insight, i) => (
          <div
            key={insight.id}
            className="rounded-[var(--radius-lg)] overflow-hidden"
            style={{
              borderLeft: `4px solid ${accentColor(insight.type)}`,
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <InsightCard
              title={insight.title ?? insight.type}
              description={insight.statement}
              impact={insight.impact}
              actionLabel={insight.actionLabel}
              onAction={insight.actionRoute ? () => navigate(insight.actionRoute!) : undefined}
              index={i}
            />
          </div>
        ))}
      </div>
    </section>
  );
});
