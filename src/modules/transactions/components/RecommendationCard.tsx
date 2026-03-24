import type { ReactNode } from "react";

export type RecommendationCardProps = {
  title: string;
  badge?: string;
  children: ReactNode;
  action?: ReactNode;
};

export function RecommendationCard({ title, badge, children, action }: RecommendationCardProps) {
  return (
    <div className="card card-highlight">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        {badge ? <span className="chip chip-static chip-warning text-xs">{badge}</span> : null}
      </div>
      <div className="mt-2 text-sm text-muted-foreground">{children}</div>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
