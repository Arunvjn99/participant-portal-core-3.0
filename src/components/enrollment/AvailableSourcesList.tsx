import { DashboardCard } from "../dashboard/DashboardCard";
import Button from "../ui/Button";
import type { ContributionSource } from "@/enrollment/logic/types";

interface AvailableSourcesListProps {
  availableSources: ContributionSource[];
  onAddSource: (source: ContributionSource) => void;
  disabled?: boolean;
}

/**
 * AvailableSourcesList - Displays available contribution sources with "Add" actions
 * No input fields, just action buttons
 */
export const AvailableSourcesList = ({
  availableSources,
  onAddSource,
  disabled = false,
}: AvailableSourcesListProps) => {
  const sourceInfo: Record<ContributionSource, { label: string; description: string }> = {
    preTax: {
      label: "Pre-tax",
      description: "Lower taxes today",
    },
    roth: {
      label: "Roth",
      description: "Tax-free withdrawals later",
    },
    afterTax: {
      label: "After-tax",
      description: "Additional savings",
    },
  };

  if (availableSources.length === 0) {
    return null;
  }

  return (
    <DashboardCard>
      <div className="available-sources-list">
        <h3 className="available-sources-list__title">Available Contribution Sources</h3>
        <p className="available-sources-list__description">
          Add sources to allocate your contribution across different tax treatments.
        </p>
        <div className="available-sources-list__items">
          {availableSources.map((source) => (
            <div key={source} className="available-sources-list__item">
              <div className="available-sources-list__item-content">
                <span className="available-sources-list__item-label">{sourceInfo[source].label}</span>
                <span className="available-sources-list__item-description">{sourceInfo[source].description}</span>
              </div>
              <Button
                onClick={() => onAddSource(source)}
                disabled={disabled}
                className="available-sources-list__add-button"
                type="button"
              >
                Add
              </Button>
            </div>
          ))}
        </div>
      </div>
    </DashboardCard>
  );
};
