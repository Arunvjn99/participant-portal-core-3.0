import { DashboardCard } from "../dashboard/DashboardCard";
import { Input } from "../ui/Input";
import { ContributionTypeToggle } from "./ContributionTypeToggle";
import Button from "../ui/Button";
import type { ContributionSource, ContributionType } from "@/enrollment/logic/types";

interface SourceAllocationCardProps {
  source: ContributionSource;
  contributionType: ContributionType;
  contributionAmount: number;
  forcePercentageMode?: boolean;
  onTypeChange: (type: ContributionType) => void;
  onAmountChange: (amount: number) => void;
  onRemove: () => void;
}

/**
 * SourceAllocationCard - Card for a selected source with %/$ toggle, value input, and remove button
 */
export const SourceAllocationCard = ({
  source,
  contributionType,
  contributionAmount,
  forcePercentageMode = false,
  onTypeChange,
  onAmountChange,
  onRemove,
}: SourceAllocationCardProps) => {
  const sourceLabels: Record<ContributionSource, string> = {
    preTax: "Pre-tax",
    roth: "Roth",
    afterTax: "After-tax",
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      onAmountChange(numValue);
    } else if (value === "") {
      onAmountChange(0);
    }
  };

  // If forcePercentageMode is true, ensure we're in percentage mode
  const effectiveType = forcePercentageMode ? "percentage" : contributionType;

  return (
    <DashboardCard>
      <div className="source-allocation-card">
        <div className="source-allocation-card__header">
          <h4 className="source-allocation-card__title">{sourceLabels[source]}</h4>
          <Button
            onClick={onRemove}
            className="source-allocation-card__remove-button"
            type="button"
            aria-label={`Remove ${sourceLabels[source]}`}
          >
            Remove
          </Button>
        </div>
        <div className="source-allocation-card__controls">
          {!forcePercentageMode && (
            <ContributionTypeToggle contributionType={effectiveType} onTypeChange={onTypeChange} />
          )}
          {forcePercentageMode && (
            <div className="source-allocation-card__mode-note">
              <span className="source-allocation-card__mode-text">Percentage mode (multiple sources selected)</span>
            </div>
          )}
          <Input
            label={effectiveType === "percentage" ? "Allocation Percentage" : "Monthly Amount"}
            type="number"
            name={`source-${source}-amount`}
            value={contributionAmount > 0 ? contributionAmount.toString() : ""}
            onChange={handleAmountChange}
            placeholder={effectiveType === "percentage" ? "Enter percentage" : "Enter amount"}
            min="0"
            max={effectiveType === "percentage" ? "100" : undefined}
            step={effectiveType === "percentage" ? "0.1" : "100"}
          />
        </div>
      </div>
    </DashboardCard>
  );
};
