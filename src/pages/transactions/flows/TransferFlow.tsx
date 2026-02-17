import { TransactionApplicationRouter } from "../applications/TransactionApplicationRouter";

/**
 * Transfer application flow. Uses generic TransactionApplicationRouter;
 * route /transactions/transfer/start and /transactions/transfer/:transactionId
 * are handled by the router with transactionType=transfer.
 */
export function TransferFlow() {
  return <TransactionApplicationRouter />;
}
