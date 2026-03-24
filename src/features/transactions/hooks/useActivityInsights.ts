import { useMemo } from "react";
import type { TFunction } from "i18next";
import { transactionStore } from "@/data/transactionStore";
import { ACCOUNT_OVERVIEW } from "@/data/accountOverview";
import type { ActivityInsight } from "../types";

/**
 * Analyzes recent transactions and account data to return 2–3 intelligent insight cards.
 * Each insight has title, description, impact value, and optional CTA. Uses t() for i18n.
 */
export function useActivityInsights(planId: string | null, t: TFunction): ActivityInsight[] {
  return useMemo(() => {
    const all = transactionStore.getAllTransactions();
    const filtered =
      planId && planId !== "all"
        ? all.filter((tx) => (tx as { planId?: string }).planId === planId)
        : all;

    const insights: ActivityInsight[] = [];
    const thisMonthContrib = Math.round(ACCOUNT_OVERVIEW.ytdContribution / 12);
    const yearAmount = Math.round(thisMonthContrib * 1.2);
    const yearAmountFormatted = yearAmount.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });
    const thisMonthFormatted = thisMonthContrib.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });

    const matchTitle = t("transactions.insights.matchOpportunityTitle");
    const matchDesc = t("transactions.insights.matchOpportunityDesc", { amount: yearAmountFormatted });
    insights.push({
      id: "contrib",
      title: matchTitle,
      description: matchDesc,
      impact: t("transactions.insights.matchOpportunityValue", { amount: thisMonthFormatted }),
      value: t("transactions.insights.matchOpportunityProjected", { amount: "$18,400" }),
      actionLabel: t("transactions.insights.adjustRate"),
      type: "contribution",
      impactType: "Growth",
      priority: true,
      coreAiPrompt: `Help me understand this insight: ${matchTitle}. ${matchDesc}`,
    });

    const pendingRollover = all.find((tx) => tx.type === "rollover" && (tx.status === "draft" || tx.status === "active"));
    if (pendingRollover) {
      const rollTitle = t("transactions.insights.rolloverProcessingTitle");
      const rollDesc = t("transactions.insights.rolloverProcessingDesc");
      insights.push({
        id: "rollover",
        title: rollTitle,
        description: rollDesc,
        impact: t("transactions.riskOverview.etaDays", { days: 3 }),
        value: t("transactions.riskOverview.etaDays", { days: 3 }),
        actionLabel: t("transactions.insights.trackStatus"),
        type: "rollover",
        impactType: "Pending",
        coreAiPrompt: `Help me understand this insight: ${rollTitle}. ${rollDesc}`,
      });
    }

    const recentWithdrawal = all.find(
      (tx) => (tx.type === "withdrawal" || tx.type === "distribution") && (tx.status === "active" || tx.status === "completed")
    );
    if (recentWithdrawal) {
      const wTitle = t("transactions.insights.taxEventWarningTitle");
      const wDesc = t("transactions.insights.taxEventWarningDesc");
      insights.push({
        id: "withdrawal",
        title: wTitle,
        description: wDesc,
        impact: t("transactions.insights.actionRequired"),
        value: t("transactions.insights.actionRequired"),
        type: "withdrawal",
        impactType: "Risk",
        coreAiPrompt: `Help me understand this insight: ${wTitle}. ${wDesc}`,
      });
    }

    if (insights.length < 3 && !recentWithdrawal) {
      const onTitle = t("transactions.insights.onTrackTitle");
      const onDesc = t("transactions.insights.onTrackDesc");
      insights.push({
        id: "on-track",
        title: onTitle,
        description: onDesc,
        impact: t("transactions.insights.vsLastYear"),
        value: t("transactions.insights.vsLastYear"),
        type: "general",
        impactType: "Info",
        coreAiPrompt: `Help me understand this insight: ${onTitle}. ${onDesc}`,
      });
    }

    return insights.slice(0, 3);
  }, [planId, t]);
}
