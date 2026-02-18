import React from "react";
import { useTranslation } from "react-i18next";
import type { AllocationItem } from "../../types/investmentPortfolio";
import { DashboardCard } from "../dashboard/DashboardCard";
import { StatusBadge } from "../dashboard/shared/StatusBadge";
import { ProgressBar } from "../dashboard/shared/ProgressBar";

interface Props {
  allocations: AllocationItem[];
  diversificationScore: number;
  driftPercent?: number;
}

export const AllocationHealthSection: React.FC<Props> = ({
  allocations,
  diversificationScore,
  driftPercent = 4.2,
}) => {
  const { t } = useTranslation();

  return (
    <DashboardCard title={t("investmentPortfolio.currentVsTarget")}>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-4" style={{ color: "var(--enroll-text-secondary)" }}>
          <span className="text-xs font-medium">
            {t("investmentPortfolio.driftSinceRebalance")}: {driftPercent}%
          </span>
          <StatusBadge
            label={`${t("investmentPortfolio.diversificationHealth")} ${diversificationScore}%`}
            variant={diversificationScore >= 70 ? "success" : "warning"}
          />
        </div>

        <div className="space-y-4">
          {allocations.map((item) => {
            const isOver = item.currentPercent > item.targetPercent;
            const isUnder = item.currentPercent < item.targetPercent;
            const driftLabel = isOver
              ? t("investmentPortfolio.overweight")
              : isUnder
                ? t("investmentPortfolio.underweight")
                : null;

            return (
              <div key={item.name} className="space-y-2">
                <div className="flex justify-between items-center gap-2">
                  <span className="text-sm font-medium" style={{ color: "var(--enroll-text-primary)" }}>
                    {item.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs" style={{ color: "var(--enroll-text-muted)" }}>
                      {item.currentPercent}% / {item.targetPercent}% target
                    </span>
                    {driftLabel && (
                      <StatusBadge label={driftLabel} variant={isOver ? "warning" : "neutral"} />
                    )}
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <div className="flex-1 flex gap-0.5 overflow-hidden rounded-full" style={{ height: 8, background: "var(--color-background-secondary)" }}>
                    <div
                      style={{
                        width: `${Math.min(100, (item.currentPercent / 100) * 100)}%`,
                        background: item.color,
                        borderRadius: "var(--radius-full)",
                      }}
                    />
                  </div>
                  <span className="text-[10px] font-medium w-8 text-right" style={{ color: "var(--enroll-text-muted)" }}>
                    {item.drift > 0 ? "+" : ""}{item.drift}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-4 border-t" style={{ borderColor: "var(--color-border)" }}>
          <div className="flex justify-between text-[10px] font-medium mb-2" style={{ color: "var(--enroll-text-muted)" }}>
            <span>{t("investmentPortfolio.diversificationHealth")}</span>
            <span style={{ color: "var(--enroll-text-primary)" }}>{diversificationScore}/100</span>
          </div>
          <ProgressBar value={diversificationScore} max={100} height={8} barColor="var(--enroll-accent)" />
        </div>
      </div>
    </DashboardCard>
  );
}
