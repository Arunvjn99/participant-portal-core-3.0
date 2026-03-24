import type { ContributionType } from "@/enrollment/logic/types";

interface ContributionTypeRowProps {
  contributionType: ContributionType;
  onTypeChange: (type: ContributionType) => void;
}

export const ContributionTypeRow = ({
  contributionType: _contributionType,
  onTypeChange: _onTypeChange,
}: ContributionTypeRowProps) => {
  return (
    <div className="contribution-type-row" role="radiogroup" aria-label="Contribution type">
      {/* TODO: Implement radio button group for percentage vs fixed amount */}
    </div>
  );
};
