import type { NavigateFunction } from "react-router-dom";
import { withVersionIfEnrollment } from "@/core/version";

/**
 * Side-effect handlers keyed by `SearchScenario.action`.
 * Built per navigation context so routes stay version-aware.
 */
export function buildActionHandlers(
  navigate: NavigateFunction,
  routeVersion: string,
): Record<string, () => void> {
  const v = (path: string) => navigate(withVersionIfEnrollment(routeVersion, path));

  return {
    OPEN_LOAN_FLOW: () => v("/transactions/loan/eligibility"),
    OPEN_CONTRIBUTION_FLOW: () => v("/enrollment/contribution"),
    OPEN_WITHDRAWAL_FLOW: () => v("/transactions/withdraw"),
    OPEN_REBALANCE_FLOW: () => v("/transactions/rebalance"),
    OPEN_TRANSFER_FLOW: () => v("/transactions/transfer"),
    OPEN_ROLLOVER_FLOW: () => v("/transactions/rollover"),
  };
}
