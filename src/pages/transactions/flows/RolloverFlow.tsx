import { TransactionApplicationRouter } from "../applications/TransactionApplicationRouter";

/**
 * Rollover application flow. Uses generic TransactionApplicationRouter;
 * route /transactions/rollover/start and /transactions/rollover/:transactionId
 * are handled by the router with transactionType=rollover.
 */
export function RolloverFlow() {
  return <TransactionApplicationRouter />;
}
