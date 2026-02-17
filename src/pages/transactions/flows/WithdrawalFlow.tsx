import { TransactionApplicationRouter } from "../applications/TransactionApplicationRouter";

/**
 * Withdrawal application flow. Uses generic TransactionApplicationRouter;
 * route /transactions/withdrawal/start and /transactions/withdrawal/:transactionId
 * are handled by the router with transactionType=withdrawal.
 */
export function WithdrawalFlow() {
  return <TransactionApplicationRouter />;
}
