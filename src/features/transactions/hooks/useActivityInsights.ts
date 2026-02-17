import { useMemo } from "react";
import { transactionStore } from "../../../data/transactionStore";
import { ACCOUNT_OVERVIEW } from "../../../data/accountOverview";
import type { ActivityInsight } from "../types";

/**
 * Analyzes recent transactions and account data to return 2–3 intelligent insight cards.
 * Each insight has title, description, impact value, and optional CTA.
 */
export function useActivityInsights(planId: string | null): ActivityInsight[] {
  return useMemo(() => {
    const all = transactionStore.getAllTransactions();
    const filtered =
      planId && planId !== "all"
        ? all.filter((t) => (t as { planId?: string }).planId === planId)
        : all;

    const insights: ActivityInsight[] = [];
    const thisMonthContrib = Math.round(ACCOUNT_OVERVIEW.ytdContribution / 12);
    const contribPct = 9; // Mock: currently contributing 9%
    const employerMatch = 6; // Mock: employer match up to 6%

    insights.push({
      id: "contrib",
      title: "Match Opportunity",
      description: `Increasing your contribution by 1% will maximize your employer match, adding ~$${Math.round(thisMonthContrib * 1.2).toLocaleString()}/year.`,
      impact: `$${thisMonthContrib.toLocaleString()} this month`,
      value: "+$18,400 Projected",
      actionLabel: "Adjust Rate",
      type: "contribution",
      impactType: "Growth",
      priority: true,
    });

    const pendingRollover = all.find((t) => t.type === "rollover" && (t.status === "draft" || t.status === "active"));
    if (pendingRollover) {
      const eta = "3 days";
      insights.push({
        id: "rollover",
        title: "Rollover Processing",
        description: "Your rollover from Legacy Corp is currently being verified by the clearing house.",
        impact: `ETA: ${eta}`,
        value: `ETA: ${eta}`,
        actionLabel: "Track Status",
        type: "rollover",
        impactType: "Pending",
      });
    }

    const recentWithdrawal = all.find(
      (t) => (t.type === "withdrawal" || t.type === "distribution") && (t.status === "active" || t.status === "completed")
    );
    if (recentWithdrawal) {
      insights.push({
        id: "withdrawal",
        title: "Tax Event Warning",
        description: "Pending loan repayment must be settled before tax filing to avoid penalties.",
        impact: "Action Required",
        value: "Action Required",
        type: "withdrawal",
        impactType: "Risk",
      });
    }

    if (insights.length < 3 && !recentWithdrawal) {
      insights.push({
        id: "on-track",
        title: "On track",
        description: ACCOUNT_OVERVIEW.onTrack.message,
        impact: "+2% vs last year",
        value: "+2% vs last year",
        type: "general",
        impactType: "Info",
      });
    }

    return insights.slice(0, 3);
  }, [planId]);
}
