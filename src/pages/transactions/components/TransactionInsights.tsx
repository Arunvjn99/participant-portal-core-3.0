import { memo } from "react";
import { ActivityInsights } from "../../../features/transactions/components/ActivityInsights";
import type { ActivityInsight } from "../../../features/transactions/types";

interface TransactionInsightsProps {
  insights: ActivityInsight[];
}

/**
 * Smart insights section for Transactions screen.
 * Reuses ActivityInsights (InsightCard, left accent); tokens only.
 */
export const TransactionInsights = memo(function TransactionInsights({
  insights,
}: TransactionInsightsProps) {
  return <ActivityInsights insights={insights} />;
});
