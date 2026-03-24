import { DashboardCard } from "../dashboard/DashboardCard";
import { Input } from "../ui/Input";
import { ContributionTypeToggle } from "./ContributionTypeToggle";
import type { ContributionType } from "@/enrollment/logic/types";

interface ContributionAmountSectionProps {
  contributionType: ContributionType;
  contributionAmount: number;
  salary: number;
  onTypeChange: (type: ContributionType) => void;
  onAmountChange: (amount: number) => void;
}

/**
 * ContributionAmountSection - Primary section for setting contribution amount
 * Shows monthly equivalent clearly
 */
export const ContributionAmountSection = ({
  contributionType,
  contributionAmount,
  salary,
  onTypeChange,
  onAmountChange,
}: ContributionAmountSectionProps) => {
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      onAmountChange(numValue);
    } else if (value === "") {
      onAmountChange(0);
    }
  };

  // Calculate monthly equivalent
  const monthlyEquivalent =
    contributionType === "percentage"
      ? (salary * contributionAmount) / 100 / 12
      : contributionAmount;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <DashboardCard>
      <div className="contribution-amount-section">
        <h3 className="contribution-amount-section__title">Contribution Amount</h3>
        <p className="contribution-amount-section__description">
          Choose how much you want to contribute to your retirement plan.
        </p>
        <div className="contribution-amount-section__salary">
          <span className="contribution-amount-section__salary-label">Annual Salary:</span>
          <span className="contribution-amount-section__salary-value">{formatCurrency(salary)}</span>
        </div>
        <div className="contribution-amount-section__controls">
          <ContributionTypeToggle contributionType={contributionType} onTypeChange={onTypeChange} />
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
        <div className="contribution-amount-section__monthly">
          <span className="contribution-amount-section__monthly-label">Monthly equivalent:</span>
          <span className="contribution-amount-section__monthly-value">{formatCurrency(monthlyEquivalent)}</span>
        </div>
      </div>
    </DashboardCard>
  );
};
