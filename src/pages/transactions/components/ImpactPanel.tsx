import { memo } from "react";
import { ImpactPanel as FeatureImpactPanel } from "../../../features/transactions/components/ImpactPanel";

interface ImpactPanelProps {
  planId: string | null;
}

/**
 * Financial impact panel for Transactions screen. Reuses feature ImpactPanel; tokens only.
 */
export const ImpactPanel = memo(function ImpactPanel({ planId }: ImpactPanelProps) {
  return <FeatureImpactPanel planId={planId} />;
});
