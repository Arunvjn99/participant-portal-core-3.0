import type { ChangeEvent, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { QuickSelectButtons } from "./QuickSelectButtons";
import type { QuickSelectOption } from "./QuickSelectButtons";
import { ContributionSlider } from "./ContributionSlider";
import { PiggyBank } from "lucide-react";

export interface ContributionInputCardProps {
  title: string;
  subtext: string;
  onAskAI?: () => void;
  askAiAriaLabel?: string;
  quickSelectOptions: QuickSelectOption[];
  activePercentage: number;
  onQuickSelect: (percentage: number) => void;
  contributionType: "percentage" | "fixed";
  onContributionTypeChange: (mode: "percentage" | "fixed") => void;
  percentageValue: number;
  onPercentageChange: (e: ChangeEvent<HTMLInputElement>) => void;
  dollarValue: number;
  onDollarChange: (e: ChangeEvent<HTMLInputElement>) => void;
  sliderMin: number;
  sliderMax: number;
  onSliderChange: (e: ChangeEvent<HTMLInputElement>) => void;
  sliderAriaLabel: string;
  /** Dollar mode: monthly amount for slider (display/control) */
  dollarSliderValue?: number;
  dollarSliderMin?: number;
  dollarSliderMax?: number;
  onDollarSliderChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  monthlyPaycheckFormatted: string;
  savingPerMonthFormatted: string;
  savingBadgeLabel: string;
  /** Renders inside the same card below the slider (e.g. Tax Strategy) */
  bottomSection?: ReactNode;
}

/**
 * Set Your Contribution card — Figma design: header row, Quick presets, %/$ toggle,
 * large % input, green savings box, slider, optional bottom section (Tax Strategy).
 */
export function ContributionInputCard({
  title,
  subtext,
  onAskAI,
  askAiAriaLabel,
  quickSelectOptions,
  activePercentage,
  onQuickSelect,
  contributionType,
  onContributionTypeChange,
  percentageValue,
  onPercentageChange,
  dollarValue,
  onDollarChange,
  sliderMin,
  sliderMax,
  onSliderChange,
  sliderAriaLabel,
  dollarSliderValue = 0,
  dollarSliderMin = 0,
  dollarSliderMax = 500,
  onDollarSliderChange,
  monthlyPaycheckFormatted,
  savingPerMonthFormatted,
  savingBadgeLabel,
  bottomSection,
}: ContributionInputCardProps) {
  const { t } = useTranslation();
  const isDollarMode = contributionType === "fixed";
  const displayDollarMonthly = dollarValue / 12;

  return (
    <div className="contrib-input-card-figma">
      <div className="contrib-input-card-figma__header">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="contrib-input-card-figma__title">{title}</h3>
            {onAskAI && askAiAriaLabel && (
              <button
                type="button"
                onClick={onAskAI}
                aria-label={askAiAriaLabel}
                className="contrib-input-card-figma__ask-ai"
              >
                Ask AI
              </button>
            )}
          </div>
          <p className="contrib-input-card-figma__subtext">{subtext}</p>
        </div>
        <div className="contrib-input-card-figma__monthly-paycheck">
          <p className="contrib-input-card-figma__monthly-paycheck-label">Monthly Paycheck</p>
          <p className="contrib-input-card-figma__monthly-paycheck-value">{monthlyPaycheckFormatted}</p>
        </div>
      </div>

      <div className="contrib-quick-figma">
        <span className="contrib-quick-figma__label">Quick:</span>
        <div className="flex flex-wrap items-center gap-2">
          {quickSelectOptions.map((opt) => {
            const isActive = activePercentage === opt.percentage;
            const presetMod = opt.id === "safe" ? "contrib-quick-figma__btn--safe" : opt.id === "match" ? "contrib-quick-figma__btn--match" : opt.id === "aggressive" ? "contrib-quick-figma__btn--aggressive" : "";
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onQuickSelect(opt.percentage)}
                className={`contrib-quick-figma__btn ${isActive ? "contrib-quick-figma__btn--active" : ""} ${presetMod}`}
                aria-pressed={isActive}
              >
                {t(opt.labelKey)}
              </button>
            );
          })}
        </div>
        <div className="contrib-toggle-figma ml-auto" role="group" aria-label={sliderAriaLabel}>
          <button
            type="button"
            className={`contrib-toggle-figma__btn ${contributionType === "percentage" ? "contrib-toggle-figma__btn--active" : ""}`}
            onClick={() => onContributionTypeChange("percentage")}
            aria-pressed={contributionType === "percentage"}
          >
            %
          </button>
          <button
            type="button"
            className={`contrib-toggle-figma__btn ${contributionType === "fixed" ? "contrib-toggle-figma__btn--active" : ""}`}
            onClick={() => onContributionTypeChange("fixed")}
            aria-pressed={contributionType === "fixed"}
          >
            $
          </button>
        </div>
      </div>

      <div className="contrib-value-row-figma">
        <div>
          <p className="contrib-value-figma__label">Your Contribution</p>
          <div className="contrib-value-figma__input-wrap">
            {isDollarMode ? (
              <>
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={displayDollarMonthly === 0 ? 0 : displayDollarMonthly}
                  onChange={onDollarChange}
                  className="contrib-value-figma__input"
                  aria-label={t("enrollment.contributionDollarAria", { defaultValue: "Contribution amount in dollars per month" })}
                />
                <span className="contrib-value-figma__suffix">/mo</span>
              </>
            ) : (
              <>
                <input
                  type="number"
                  min={0}
                  max={sliderMax}
                  step={0.1}
                  value={percentageValue}
                  onChange={onPercentageChange}
                  className="contrib-value-figma__input"
                  aria-label={sliderAriaLabel}
                />
                <span className="contrib-value-figma__suffix">%</span>
              </>
            )}
          </div>
        </div>
        <div className="contrib-savings-box-figma">
          <span className="contrib-savings-box-figma__title">
            <PiggyBank className="h-4 w-4" aria-hidden />
            {savingBadgeLabel}
          </span>
          <p className="contrib-savings-box-figma__amount">{savingPerMonthFormatted}</p>
        </div>
      </div>

      <div className="contrib-slider-figma">
        {isDollarMode && onDollarSliderChange != null ? (
          <>
            <ContributionSlider
              min={dollarSliderMin}
              max={dollarSliderMax}
              value={dollarSliderValue}
              onChange={onDollarSliderChange}
              ariaLabel={t("enrollment.contributionDollarAria", { defaultValue: "Contribution amount in dollars per month" })}
            />
            <div className="contrib-slider-figma__labels">
              <span>${dollarSliderMin}</span>
              <span>${dollarSliderMax}/mo</span>
            </div>
          </>
        ) : (
          <>
            <ContributionSlider
              min={sliderMin}
              max={sliderMax}
              value={percentageValue}
              onChange={onSliderChange}
              ariaLabel={sliderAriaLabel}
            />
            <div className="contrib-slider-figma__labels">
              <span>{sliderMin}%</span>
              <span>{sliderMax}%</span>
            </div>
          </>
        )}
      </div>

      {bottomSection != null ? (
        <div className="contrib-input-card-figma__bottom border-t border-[var(--enroll-card-border)] flex flex-col gap-3 pt-[21px]">
          {bottomSection}
        </div>
      ) : null}
    </div>
  );
}
