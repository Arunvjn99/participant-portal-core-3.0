import { memo } from "react";
import { StatusTracker as FeatureStatusTracker } from "../../../features/transactions/components/StatusTracker";

/**
 * In-progress status tracker for Transactions screen.
 * Reuses StatusTracker (rollover, loan payment, auto increase); tokens only.
 */
export const StatusTracker = memo(function StatusTracker() {
  return <FeatureStatusTracker />;
});
