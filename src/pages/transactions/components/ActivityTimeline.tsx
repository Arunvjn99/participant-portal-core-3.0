import { memo } from "react";
import { TransactionTimeline } from "../../../features/transactions/components/TransactionTimeline";

/**
 * Activity timeline for Transactions screen (grouped: This Week / This Month / Earlier).
 * Reuses TransactionTimeline; tokens only.
 */
export const ActivityTimeline = memo(function ActivityTimeline() {
  return <TransactionTimeline />;
});
