import type { Scenario } from "@/engine/scenarioEngine";
import type { RecentTransaction } from "@/features/crp-transactions/types";

/** Feed Transaction Center “recent” list from scenario engine data. */
export function recentTransactionsFromScenario(scenario: Scenario | null): RecentTransaction[] | undefined {
  if (!scenario?.transactions.length) return undefined;
  return scenario.transactions.map((t) => ({
    id: t.id,
    type: t.type,
    description: t.description,
    amount: t.amount,
    status: t.status,
    date: t.date,
  }));
}
