import type { ContributionType } from "../../enrollment/logic/types";

interface ContributionTypeToggleProps {
  contributionType: ContributionType;
  onTypeChange: (type: ContributionType) => void;
}

export const ContributionTypeToggle = ({
  contributionType,
  onTypeChange,
}: ContributionTypeToggleProps) => {
  return (
    <div className="contribution-type-toggle" role="radiogroup" aria-label="Contribution type">
      <label className="contribution-type-toggle__option">
        <input
          type="radio"
          name="contribution-type"
          value="percentage"
          checked={contributionType === "percentage"}
          onChange={() => onTypeChange("percentage")}
          className="contribution-type-toggle__radio"
          aria-label="Percentage"
        />
        <span className="contribution-type-toggle__label">Percentage</span>
      </label>
      <label className="contribution-type-toggle__option">
        <input
          type="radio"
          name="contribution-type"
          value="fixed"
          checked={contributionType === "fixed"}
          onChange={() => onTypeChange("fixed")}
          className="contribution-type-toggle__radio"
          aria-label="Amount"
        />
        <span className="contribution-type-toggle__label">Amount</span>
      </label>
    </div>
  );
};
