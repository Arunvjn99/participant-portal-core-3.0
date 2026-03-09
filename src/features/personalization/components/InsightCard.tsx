import type { ReactNode } from "react";

interface InsightCardProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
}

export function InsightCard({ title, subtitle, icon }: InsightCardProps) {
  return (
    <div
      className="personalization-wizard__insight-card personalization-wizard__insight-card--animate"
      role="region"
      aria-label="Insight"
      style={{
        background: "var(--color-background-secondary)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-xl)",
      }}
    >
      <div className="personalization-wizard__insight-inner">
        {icon && (
          <div
            className="personalization-wizard__insight-icon"
            style={{
              background: "rgb(var(--color-primary-rgb) / 0.1)",
              color: "var(--color-primary)",
            }}
          >
            {icon}
          </div>
        )}
        <div className="personalization-wizard__insight-text">
          <p className="personalization-wizard__insight-title" style={{ color: "var(--color-text)" }}>
            {title}
          </p>
          {subtitle && (
            <p className="personalization-wizard__insight-sub" style={{ color: "var(--color-text-secondary)" }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
