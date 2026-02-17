import { memo } from "react";
import { ActionHub } from "../../../features/transactions/components/ActionHub";

/**
 * Quick actions panel for Transactions screen.
 * Reuses ActionHub (context-aware action tiles); tokens only.
 */
export const QuickActionsPanel = memo(function QuickActionsPanel() {
  return <ActionHub />;
});
