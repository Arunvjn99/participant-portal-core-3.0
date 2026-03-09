import type { ReactNode } from "react";
import { Sparkles } from "lucide-react";
import { InsightCard } from "./InsightCard";

export interface PopularRecommendationProps {
  title: string;
  subtitle?: string;
  badge?: string;
  actionLabel: string;
  onAction: () => void;
  icon?: ReactNode;
}

export function PopularRecommendation({
  title,
  subtitle,
  badge = "Popular",
  actionLabel,
  onAction,
  icon,
}: PopularRecommendationProps) {
  return (
    <InsightCard
      variant="wizard"
      title={title}
      message={subtitle ?? ""}
      icon={icon ?? <Sparkles className="h-3.5 w-3.5" />}
      badge={badge}
      actionLabel={actionLabel}
      onAction={onAction}
    />
  );
}
