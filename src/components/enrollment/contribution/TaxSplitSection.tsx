import type { ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { Settings } from "lucide-react";

export interface TaxSplitItem {
  id: string;
  labelKey: string;
  percent: number;
  dollarPerMonth: number;
  dollarPerMonthFormatted: string;
  active: boolean;
  onAskAI?: () => void;
}

export type TaxSourceKey = "preTax" | "roth" | "afterTax";

export interface TaxSplitSectionProps {
  title: string;
  subtext: string;
  items: TaxSplitItem[];
  onEditSplit?: () => void;
  editSplitAriaLabel: string;
  /** Segment widths 0–100 for visual bar (preTax, roth, afterTax order) */
  segmentWidths: [number, number, number];
  /** "figma" = inline (no card), Figma row/bar styles; used inside contribution card */
  variant?: "default" | "figma";
  /** When true (and variant=figma), show "Done" as primary gradient button; else "Edit Contribution Split" */
  editMode?: boolean;
  /** When set (and variant=figma, editMode), show per-row slider to change source % */
  onSourcePercentChange?: (key: TaxSourceKey, value: number) => void;
  /** When set (and variant=figma, editMode), show checkbox to enable/disable source */
  onSourceToggle?: (key: TaxSourceKey, enabled: boolean) => void;
}

const SOURCE_IDS = ["preTax", "roth", "afterTax"] as const;

export function TaxSplitSection({
  title,
  subtext,
  items,
  onEditSplit,
  editSplitAriaLabel,
  segmentWidths,
  variant = "default",
  editMode = false,
  onSourcePercentChange,
  onSourceToggle,
}: TaxSplitSectionProps) {
  const { t } = useTranslation();

  const handleSliderChange = (key: TaxSourceKey, e: ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    if (!Number.isNaN(v)) onSourcePercentChange?.(key, Math.min(100, Math.max(0, v)));
  };

  if (variant === "figma") {
    return (
      <div className="contrib-tax-figma flex flex-col gap-3">
        <div className="contrib-tax-figma__header flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-col gap-0.5">
            <h3 className="contrib-tax-figma__title">{title}</h3>
            <p className="contrib-tax-figma__subtext">{subtext}</p>
          </div>
          {onEditSplit && (
            <button
              type="button"
              onClick={onEditSplit}
              className={editMode ? "contrib-tax-figma__done-btn" : "contrib-tax-figma__edit-btn"}
              aria-label={editSplitAriaLabel}
            >
              <Settings
                className={`h-4 w-4 shrink-0 transition-transform duration-200 ${editMode ? "contrib-tax-figma__edit-icon--rotated" : ""}`}
                aria-hidden
              />
              {editMode ? t("enrollment.done") : t("enrollment.editContributionSplit")}
            </button>
          )}
        </div>
        <div className="contrib-tax-figma__rows flex flex-col gap-2">
          {items.map((item) => {
            const id = item.id as (typeof SOURCE_IDS)[number];
            const key = item.id as TaxSourceKey;
            const isInactive = !item.active;
            const barMod = SOURCE_IDS.includes(id) ? `contrib-tax-figma__row-bar--${id}` : "";
            const showCheckbox = editMode && onSourceToggle != null;
            const showSlider = editMode && item.active && onSourcePercentChange != null;
            return (
              <div
                key={item.id}
                className={`contrib-tax-figma__row ${isInactive ? "contrib-tax-figma__row--inactive" : ""}`}
              >
                <div className="flex flex-1 min-w-0 items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    {showCheckbox && (
                      <input
                        type="checkbox"
                        checked={item.active}
                        onChange={() => onSourceToggle?.(key, !item.active)}
                        className="contrib-tax-figma__checkbox"
                        aria-label={t(item.labelKey)}
                      />
                    )}
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="contrib-tax-figma__row-label">{t(item.labelKey)}</span>
                        {item.onAskAI && (
                          <button
                            type="button"
                            onClick={item.onAskAI}
                            className={`contrib-tax-figma__ask-ai contrib-tax-figma__ask-ai--${id} rounded px-2 py-0.5 text-xs font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1`}
                            aria-label={t("enrollment.askAi")}
                          >
                            Ask AI
                          </button>
                        )}
                      </div>
                      {item.active && (
                        <div className="flex items-center gap-1">
                          <span className={`h-1.5 w-1.5 rounded-full shrink-0 contrib-tax-figma__dot--${id}`} aria-hidden />
                          <span className="contrib-tax-figma__active">{t("enrollment.active")}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {item.active && (
                    <div className="flex flex-col items-end gap-0.5 shrink-0">
                      <span className={`contrib-tax-figma__pct contrib-tax-figma__pct--${id} tabular-nums`}>
                        {item.percent}%
                      </span>
                      <span className="contrib-tax-figma__mo tabular-nums">{item.dollarPerMonthFormatted}/mo</span>
                    </div>
                  )}
                </div>
                {item.active && (
                  <div className="contrib-tax-figma__row-bar h-2 w-full overflow-hidden rounded-full">
                    <div
                      className={`h-full transition-all rounded-full ${barMod}`}
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                )}
                {showSlider && (
                  <div className="contrib-tax-figma__row-slider mt-1.5">
                    <input
                      type="range"
                      min={0}
                      max={100}
                      step={1}
                      value={item.percent}
                      onChange={(e) => handleSliderChange(key, e)}
                      className="contribution-slider w-full contrib-tax-figma__slider"
                      style={{ ["--slider-pct" as string]: `${item.percent}%` } as React.CSSProperties}
                      aria-label={t("enrollment.editContributionSplit")}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="contrib-tax-figma__bar flex h-3 w-full overflow-hidden rounded-full">
          {segmentWidths[0] > 0 && (
            <div className="h-full transition-all contrib-tax-figma__segment--0" style={{ width: `${segmentWidths[0]}%` }} />
          )}
          {segmentWidths[1] > 0 && (
            <div className="h-full transition-all contrib-tax-figma__segment--1" style={{ width: `${segmentWidths[1]}%` }} />
          )}
          {segmentWidths[2] > 0 && (
            <div className="h-full transition-all contrib-tax-figma__segment--2" style={{ width: `${segmentWidths[2]}%` }} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="contrib-tax-default rounded-[var(--enroll-card-radius)] border border-[var(--enroll-card-border)] bg-[var(--enroll-card-bg)] pt-[25px] px-6 pb-6 flex flex-col gap-4 shadow-[var(--enroll-elevation-2)]">
      <div>
        <h3 className="text-xl font-bold leading-7 tracking-tight text-[var(--enroll-text-primary)]">
          {title}
        </h3>
        <p className="mt-1 text-sm leading-5 text-[var(--enroll-text-muted)]">
          {subtext}
        </p>
      </div>

      {onEditSplit && (
        <button
          type="button"
          onClick={onEditSplit}
          className="contrib-tax-default__edit inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          aria-label={editSplitAriaLabel}
        >
          <Settings className="h-4 w-4" aria-hidden />
          {t("enrollment.editContributionSplit")}
        </button>
      )}

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-sm font-semibold text-[var(--enroll-text-primary)]">
                {t(item.labelKey)}
              </span>
              {item.active && (
                <span className="rounded px-2 py-0.5 text-xs font-medium bg-[var(--enroll-soft-bg)] text-[var(--enroll-text-muted)]">
                  {t("enrollment.active")}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-sm tabular-nums text-[var(--enroll-text-secondary)]">
                {item.percent}%
              </span>
              <span className="text-sm tabular-nums text-[var(--enroll-text-muted)]">
                {item.dollarPerMonthFormatted}/mo
              </span>
              {item.onAskAI && (
                <button
                  type="button"
                  onClick={item.onAskAI}
                  className="text-xs font-medium text-[var(--enroll-brand)] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                  aria-label={t("enrollment.askAi")}
                >
                  {t("enrollment.askAi")}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex h-2 w-full overflow-hidden rounded-full bg-[var(--enroll-soft-bg)]">
        {segmentWidths[0] > 0 && (
          <div className="h-full transition-all bg-[var(--enroll-brand)]" style={{ width: `${segmentWidths[0]}%` }} />
        )}
        {segmentWidths[1] > 0 && (
          <div className="h-full transition-all bg-[var(--enroll-accent)]" style={{ width: `${segmentWidths[1]}%` }} />
        )}
        {segmentWidths[2] > 0 && (
          <div className="h-full transition-all bg-[var(--enroll-text-muted)]" style={{ width: `${segmentWidths[2]}%` }} />
        )}
      </div>
    </div>
  );
}
