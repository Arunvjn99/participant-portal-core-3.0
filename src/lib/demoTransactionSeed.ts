import type { PlanSummary } from "@/features/crp-transactions/types";
import { MOCK_PLAN } from "@/features/crp-transactions/types";

/** Transaction Center plan strip — ties vested totals to demo persona balance. */
export function demoTransactionPlanForBalance(balance: number): PlanSummary {
  const vestedPct = 94;
  return {
    ...MOCK_PLAN,
    balance,
    vestedBalance: Math.round(balance * (vestedPct / 100)),
    vestedPct,
  };
}
