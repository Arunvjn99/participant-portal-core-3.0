import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import type { EnrollmentSummary } from "../../../data/enrollmentSummary";
import type { DashboardEngine, LifeStage, RecommendedAction } from "./types";

const fmtCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

/* ═══════════════════════════════════════════════════════
   Personalization Logic Engine
   Computes derived scores, life stage, recommendations,
   and dynamic messaging from raw enrollment data.
   ═══════════════════════════════════════════════════════ */

function deriveLifeStage(age: number, t: TFunction): { stage: LifeStage; label: string } {
  if (age < 30) return { stage: "early-career", label: t("dashboard.lifeStageEarlyCareer") };
  if (age < 45) return { stage: "growth", label: t("dashboard.lifeStageGrowth") };
  if (age < 60) return { stage: "peak-earnings", label: t("dashboard.lifeStagePeakEarnings") };
  return { stage: "pre-retirement", label: t("dashboard.lifeStagePreRetirement") };
}

function computeRecommendations(
  data: EnrollmentSummary,
  matchGap: number,
  missingMatch: number,
  lifeStage: LifeStage,
  t: TFunction,
): RecommendedAction[] {
  const actions: RecommendedAction[] = [];

  if (matchGap > 0) {
    actions.push({
      id: "match-gap",
      type: "match",
      title: t("dashboard.insightMatchTitle", { amount: fmtCurrency(missingMatch) }),
      description: t("dashboard.insightMatchDesc", { pct: matchGap }),
      impact: t("dashboard.insightMatchImpact", { amount: fmtCurrency(missingMatch) }),
      priority: 1,
    });
  }

  if ((data.contributionRates?.roth ?? 0) === 0 && lifeStage !== "pre-retirement") {
    actions.push({
      id: "roth-diversify",
      type: "roth",
      title: t("dashboard.insightRothTitle"),
      description: t("dashboard.insightRothDesc"),
      impact: t("dashboard.insightRothImpact"),
      priority: 2,
    });
  }

  const allocations = data.investmentAllocations;
  if (allocations.length > 0) {
    const maxAlloc = Math.max(...allocations.map((a) => a.allocationPct));
    if (maxAlloc > 60) {
      actions.push({
        id: "rebalance",
        type: "rebalance",
        title: t("dashboard.insightRebalanceTitle"),
        description: t("dashboard.insightRebalanceDesc", { pct: maxAlloc }),
        impact: t("dashboard.insightRebalanceImpact"),
        priority: 3,
      });
    }
  }

  if (lifeStage === "early-career" || lifeStage === "growth") {
    const rate = data.planDetails?.contributionRate ?? 0;
    if (rate < 15) {
      const years = lifeStage === "early-career" ? "35+" : "20+";
      actions.push({
        id: "increase-savings",
        type: "increase",
        title: t("dashboard.insightIncreaseTitle"),
        description: t("dashboard.insightIncreaseDesc", { rate, years }),
        impact: t("dashboard.insightIncreaseImpact"),
        priority: 4,
      });
    }
  }

  return actions.sort((a, b) => a.priority - b.priority);
}

function computeHeroMessage(
  readinessScore: number,
  matchGap: number,
  lifeStage: LifeStage,
  t: TFunction,
): string {
  if (readinessScore >= 90) return t("dashboard.heroMsgExcellent");
  if (readinessScore >= 70) {
    if (matchGap > 0) {
      return t("dashboard.heroMsgOnTrackWithGap", { score: readinessScore, gap: matchGap });
    }
    return t("dashboard.heroMsgOnTrack", { score: readinessScore });
  }
  if (readinessScore >= 50) {
    switch (lifeStage) {
      case "early-career":
        return t("dashboard.heroMsgTimeOnSide");
      case "growth":
        return t("dashboard.heroMsgGrowthPhase");
      default:
        return t("dashboard.heroMsgEveryStep");
    }
  }
  return t("dashboard.heroMsgBuildFoundation");
}

export function useDashboardEngine(data: EnrollmentSummary): DashboardEngine {
  const { t, i18n } = useTranslation();
  return useMemo(() => {
    const plan = data.planDetails;
    const goal = data.goalProgress;
    const balances = data.balances;
    const ror = data.rateOfReturn;

    const currentAge = goal?.currentAge ?? 40;
    const retirementAge = goal?.retirementAge ?? 65;
    const yearsToRetirement = retirementAge - currentAge;
    const salary = goal?.salary ?? 85000;
    const contributionRate = plan?.contributionRate ?? 0;
    const matchCap = plan?.employerMatchCap ?? 6;
    const matchPct = plan?.employerMatchPct ?? 100;
    const currentBalance = plan?.totalBalance ?? 0;
    const projectedBalance = goal?.projectedBalance ?? 0;
    const vestedBalance = balances?.vestedBalance ?? 0;

    /* Life stage */
    const { stage: lifeStage, label: lifeStageLabel } = deriveLifeStage(currentAge, t);

    /* Match calculation */
    const effectiveContribution = Math.min(contributionRate, matchCap);
    const matchGap = Math.max(0, matchCap - effectiveContribution);
    const missingMatch = matchGap > 0 ? (matchGap / 100) * salary * (matchPct / 100) : 0;

    /* Scores */
    const readinessScore = data.topBanner?.percentOnTrack ?? goal?.percentOnTrack ?? 0;
    const confidenceLevel = ror?.confidencePct ?? 75;

    const optimizationScore = (() => {
      let score = 50;
      if (matchGap === 0) score += 25;
      if (contributionRate >= 10) score += 15;
      if (contributionRate >= 15) score += 10;
      return Math.min(100, score);
    })();

    const allocations = data.investmentAllocations;
    const diversificationScore = (() => {
      if (allocations.length === 0) return 0;
      const maxAlloc = Math.max(...allocations.map((a) => a.allocationPct));
      if (allocations.length >= 4 && maxAlloc <= 50) return 90;
      if (allocations.length >= 3 && maxAlloc <= 60) return 70;
      if (allocations.length >= 2) return 50;
      return 30;
    })();

    const riskAlignment = Math.min(100, diversificationScore + (confidenceLevel > 70 ? 10 : 0));

    /* Liquidity */
    const liquidityStatus: DashboardEngine["liquidityStatus"] =
      vestedBalance > 50000 ? "healthy" : vestedBalance > 20000 ? "warning" : "critical";

    /* Loan */
    const loanEligible = vestedBalance > 1000;
    const maxLoanAmount = Math.min(50000, vestedBalance * 0.5);

    /* Recommendations */
    const recommendedActions = computeRecommendations(data, matchGap, missingMatch, lifeStage, t);

    /* Hero message */
    const heroMessage = computeHeroMessage(readinessScore, matchGap, lifeStage, t);

    return {
      readinessScore,
      confidenceLevel,
      optimizationScore,
      diversificationScore,
      riskAlignment,
      liquidityStatus,
      missingMatch,
      matchGap,
      recommendedActions,
      lifeStage,
      lifeStageLabel,
      heroMessage,
      yearsToRetirement,
      projectedBalance,
      currentBalance,
      contributionRate,
      employerMatch: { pct: matchPct, cap: matchCap },
      ytdReturn: plan?.ytdReturn ?? 0,
      monthlyContribution: goal?.monthlyContribution ?? 0,
      salary,
      currentAge,
      retirementAge,
      loanEligible,
      maxLoanAmount,
    };
  }, [data, t, i18n.language]);
}
