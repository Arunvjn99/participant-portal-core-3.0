import { DashboardCard } from "../dashboard/DashboardCard";
import { Input } from "../ui/Input";
import { ContributionTypeToggle } from "./ContributionTypeToggle";
import type { ContributionType } from "@/enrollment/logic/types";

interface ContributionCardProps {
  contributionType: ContributionType;
  contributionAmount: number;
  salary: number;
  onTypeChange: (type: ContributionType) => void;
  onAmountChange: (amount: number) => void;
}

export const ContributionCard = ({
  contributionType,
  contributionAmount,
  salary: _salary,
  onTypeChange,
  onAmountChange,
}: ContributionCardProps) => {
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numValue = contributionType === "percentage" ? parseFloat(value) : parseFloat(value);
    if (!isNaN(numValue)) {
      onAmountChange(numValue);
    } else if (value === "") {
      onAmountChange(0);
    }
  };

  return (
    <DashboardCard>
      <div className="contribution-card">
        <h3 className="contribution-card__title">Contribution Rate</h3>
        <p className="contribution-card__description">
          Choose how much you want to contribute to your retirement plan.
        </p>
        <div className="contribution-card__controls">
          <ContributionTypeToggle
            contributionType={contributionType}
            onTypeChange={onTypeChange}
          />
          <Input
            label={contributionType === "percentage" ? "Contribution Percentage" : "Monthly Contribution"}
            type="number"
            name="contributionAmount"
            value={contributionAmount > 0 ? contributionAmount.toString() : ""}
            onChange={handleAmountChange}
            placeholder={contributionType === "percentage" ? "Enter percentage" : "Enter amount"}
            min="0"
            max={contributionType === "percentage" ? "100" : undefined}
            step={contributionType === "percentage" ? "0.1" : "100"}
          />
        </div>
      </div>
    </DashboardCard>
  );
};
