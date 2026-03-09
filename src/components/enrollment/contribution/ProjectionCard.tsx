import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Info, LineChart } from "lucide-react";

export interface ProjectionCardProps {
  title: string;
  /** Formatted projected value (e.g. "$1,234,567") */
  projectedValueFormatted: string;
  /** e.g. "Projected value at age 67" */
  projectedValueAtAgeLabel: string;
  /** e.g. "in 27 years" */
  inYearsLabel: string;
  /** Chart (e.g. line chart) */
  chart: ReactNode;
  /** Contributions breakdown label */
  contributionsLabel: string;
  /** Growth breakdown label */
  growthLabel: string;
  /** Formatted contributions total (e.g. "$43,200") */
  contributionsFormatted?: string;
  /** Formatted growth total (e.g. "$16,081") */
  growthFormatted?: string;
  /** Legend: "Your Contributions" (or contributionsLabel) */
  legendContributionsLabel?: string;
  /** Legend: "Total Value" (or growthLabel) */
  legendTotalLabel?: string;
  /** Disclaimer text with optional info icon */
  disclaimer: string;
}

export function ProjectionCard({
  title,
  projectedValueFormatted,
  projectedValueAtAgeLabel,
  inYearsLabel,
  chart,
  contributionsLabel,
  growthLabel,
  contributionsFormatted,
  growthFormatted,
  legendContributionsLabel,
  legendTotalLabel,
  disclaimer,
}: ProjectionCardProps) {
  const showLegend = contributionsFormatted != null || growthFormatted != null;
  const contribLegend = legendContributionsLabel ?? contributionsLabel;
  const totalLegend = legendTotalLabel ?? growthLabel;

  return (
    <div className="projection-card-figma">
      <div className="flex items-center gap-2 mb-4">
        <div
          className="projection-card-figma__icon flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
          aria-hidden
        >
          <LineChart className="h-4 w-4" />
        </div>
        <h3 className="projection-card-figma__title">{title}</h3>
      </div>
      <p className="projection-card-figma__muted text-sm mb-1">{projectedValueAtAgeLabel}</p>
      <p className="projection-card-figma__value tabular-nums mb-1">{projectedValueFormatted}</p>
      <p className="projection-card-figma__muted text-xs mb-4">{inYearsLabel}</p>
      <div className="min-h-[180px]">{chart}</div>
      {showLegend && (
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="projection-card-figma__legend-dot projection-card-figma__legend-dot--contrib" aria-hidden />
            <span className="text-xs projection-card-figma__muted">{contribLegend}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="projection-card-figma__legend-dot projection-card-figma__legend-dot--total" aria-hidden />
            <span className="text-xs projection-card-figma__muted">{totalLegend}</span>
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {contributionsFormatted != null && (
          <div className="projection-card-figma__contributions-box rounded-lg p-3">
            <div className="text-xs projection-card-figma__muted mb-1">{contributionsLabel}</div>
            <div className="font-bold tabular-nums">{contributionsFormatted}</div>
          </div>
        )}
        {growthFormatted != null && (
          <div className="projection-card-figma__growth-box rounded-lg p-3">
            <div className="text-xs projection-card-figma__muted mb-1">{growthLabel}</div>
            <div className="font-bold tabular-nums">{growthFormatted}</div>
          </div>
        )}
        {contributionsFormatted == null && growthFormatted == null && (
          <div className="col-span-2 flex flex-wrap gap-4 text-xs font-medium projection-card-figma__muted">
            <span>{contributionsLabel}</span>
            <span>{growthLabel}</span>
          </div>
        )}
      </div>
      <div className="flex items-start gap-2">
        <Info className="h-4 w-4 shrink-0 mt-0.5 projection-card-figma__muted" aria-hidden />
        <p className="text-xs leading-relaxed projection-card-figma__disclaimer">
          {disclaimer}
        </p>
      </div>
    </div>
  );
}
