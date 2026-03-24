import { DashboardCard } from "../dashboard/DashboardCard";
import type { ContributionSource } from "@/enrollment/logic/types";

interface SingleSourceSelectorProps {
  selectedSource: ContributionSource;
  onSourceChange: (source: ContributionSource) => void;
}

/**
 * SingleSourceSelector - Radio selection for single contribution source
 */
export const SingleSourceSelector = ({ selectedSource, onSourceChange }: SingleSourceSelectorProps) => {
  const sources: { value: ContributionSource; label: string; description: string }[] = [
    {
      value: "preTax",
      label: "Pre-tax",
      description: "Reduce taxable income now, pay taxes in retirement",
    },
    {
      value: "roth",
      label: "Roth",
      description: "Pay taxes now, tax-free withdrawals in retirement",
    },
    {
      value: "afterTax",
      label: "After-tax",
      description: "No immediate tax benefit, taxed on growth",
    },
  ];

  return (
    <DashboardCard>
      <div className="single-source-selector">
        <h4 className="single-source-selector__title">Select Source Type</h4>
        <div className="single-source-selector__options" role="radiogroup" aria-label="Contribution source type">
          {sources.map((source) => (
            <label key={source.value} className="single-source-selector__option">
              <input
                type="radio"
                name="singleSource"
                value={source.value}
                checked={selectedSource === source.value}
                onChange={() => onSourceChange(source.value)}
                className="single-source-selector__radio"
                aria-describedby={`single-source-${source.value}-desc`}
              />
              <div className="single-source-selector__option-content">
                <span className="single-source-selector__option-label">{source.label}</span>
                <span id={`single-source-${source.value}-desc`} className="single-source-selector__option-description">
                  {source.description}
                </span>
              </div>
            </label>
          ))}
        </div>
      </div>
    </DashboardCard>
  );
};
