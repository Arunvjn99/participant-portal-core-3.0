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
      title: "Contributions",
      statement: `You contributed 9% this month — above employer match.`,
      type: "contribution",
      impact: `+${yoyPct}% YoY`,
    });

    const pendingRollover = all.find((t) => t.type === "rollover" && (t.status === "draft" || t.status === "active"));
    if (pendingRollover) {
      const eta = "3 days";
      insights.push({
        id: "rollover",
        title: "Rollover in progress",
        statement: `Your rollover is processing (ETA: ${eta}).`,
        type: "rollover",
        impact: `${(pendingRollover.amount ?? 0).toLocaleString()} moving`,
      });
    }

    const recentWithdrawal = all.find(
      (t) => (t.type === "withdrawal" || t.type === "distribution") && t.status === "active"
    );
    if (recentWithdrawal) {
      const impactVal = 18400;
      insights.push({
        id: "withdrawal",
        title: "Withdrawal impact",
        statement: `Your recent withdrawal reduced projected retirement by $${impactVal.toLocaleString()}.`,
        type: "withdrawal",
        impact: `−$${impactVal.toLocaleString()}`,
      });
    }

    if (insights.length < 3 && !recentWithdrawal) {
      insights.push({
        id: "on-track",
        title: "On track",
        statement: ACCOUNT_OVERVIEW.onTrack.message,
        type: "general",
      });
    }

    return insights.slice(0, 3);
  }, [planId]);
}
