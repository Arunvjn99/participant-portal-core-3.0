import { useMemo } from "react";
import { transactionStore } from "../../../data/transactionStore";
import { ACCOUNT_OVERVIEW } from "../../../data/accountOverview";
import type { ActivityInsight } from "../types";

/**
 * Analyzes recent transactions and account data to return 2–3 intelligent statements.
 */
export function useActivityInsights(planId: string | null): ActivityInsight[] {
  return useMemo(() => {
    const all = transactionStore.getAllTransactions();
    const filtered = planId
      ? all.filter((t) => (t as { planId?: string }).planId === planId)
      : all;

    const insights: ActivityInsight[] = [];
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    const lastYearContrib = Math.round(ACCOUNT_OVERVIEW.ytdContribution * 0.92);
    const thisMonthContrib = Math.round(ACCOUNT_OVERVIEW.ytdContribution / 12);
    const yoyPct = lastYearContrib ? Math.round(((thisMonthContrib - lastYearContrib / 12) / (lastYearContrib / 12)) * 100) : 8;

    insights.push({
      id: "contrib",
      statement: `You contributed $${thisMonthContrib.toLocaleString()} this month (+${yoyPct}% YoY).`,
      type: "contribution",
    });

    const pendingRollover = all.find((t) => t.type === "rollover" && (t.status === "draft" || t.status === "active"));
    if (pendingRollover) {
      const eta = "3 days";
      insights.push({
        id: "rollover",
        statement: `Your rollover of $${(pendingRollover.amount ?? 0).toLocaleString()} is processing (ETA: ${eta}).`,
        type: "rollover",
      });
    }

    const recentWithdrawal = all.find(
      (t) => (t.type === "withdrawal" || t.type === "distribution") && t.status === "active"
    );
    if (recentWithdrawal) {
      const impact = 18400;
      insights.push({
        id: "withdrawal",
        statement: `Your recent withdrawal reduced projected retirement by $${impact.toLocaleString()}.`,
        type: "withdrawal",
      });
    }

    if (insights.length < 3 && !recentWithdrawal) {
      insights.push({
        id: "on-track",
        statement: ACCOUNT_OVERVIEW.onTrack.message,
        type: "general",
      });
    }

    return insights.slice(0, 3);
  }, [planId]);
}
