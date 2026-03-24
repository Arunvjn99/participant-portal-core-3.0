import { DashboardCard } from "../dashboard/DashboardCard";
import type { ContributionAssumptions } from "@/enrollment/logic/types";

interface AssumptionsPanelProps {
  assumptions: ContributionAssumptions;
  onAssumptionsChange: (assumptions: ContributionAssumptions) => void;
}

export const AssumptionsPanel = ({
  assumptions: _assumptions,
  onAssumptionsChange: _onAssumptionsChange,
}: AssumptionsPanelProps) => {
  return (
    <DashboardCard>
      <div className="assumptions-panel">
        <h3 className="assumptions-panel__title">Projection Assumptions</h3>
        <p className="assumptions-panel__description">
          These assumptions are used to calculate your retirement projection.
        </p>
        {/* TODO: Display and allow editing of assumptions */}
      </div>
    </DashboardCard>
  );
};
