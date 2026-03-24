import { DollarSign, ShieldCheck, Sparkles, TrendingUp, type LucideIcon } from "lucide-react";
import type { EnrollmentV1Snapshot, RiskLevel } from "../store/useEnrollmentStore";
import {
  computeProjectedBalancePure,
  computeReadinessScore,
  getGrowthRate,
  projectBalanceWithAutoIncrease,
} from "./readinessMetrics";

export type ReadinessApplyPatch =
  | { kind: "contribution"; value: number }
  | { kind: "autoIncreaseOn" }
  | { kind: "riskLevel"; value: RiskLevel }
  | { kind: "none" };

export type GeneratedRecommendation = {
  id: string;
  title: string;
  description: string;
  impact: "High" | "Medium";
  projectedGain: string;
  scoreImpact: string;
  scoreDelta: number;
  Icon: LucideIcon;
  patch: ReadinessApplyPatch;
};

function formatDeltaPortfolio(delta: number): string {
  if (Math.abs(delta) < 500) return "+$0";
  if (Math.abs(delta) >= 1_000_000) return `${delta > 0 ? "+" : ""}$${(delta / 1_000_000).toFixed(1)}M`;
  const k = Math.round(delta / 1000);
  return `+${Math.abs(k)}K`;
}

/**
 * Builds AI-style recommendations from enrollment snapshot (mock / heuristic engine).
 */
export function generateRecommendations(
  data: EnrollmentV1Snapshot,
  appliedIds: readonly string[],
  ctx: {
    score: number;
    projectedBalance: number;
    yearsToRetirement: number;
  },
): GeneratedRecommendation[] {
  const { score, projectedBalance, yearsToRetirement } = ctx;
  const growthRate = getGrowthRate(data.riskLevel);
  const out: GeneratedRecommendation[] = [];

  const pushIf = (id: string, rec: Omit<GeneratedRecommendation, "id"> & { id?: string }) => {
    if (appliedIds.includes(id)) return;
    out.push({ ...rec, id });
  };

  const bumpPct = Math.min(data.contribution + 3, 15);
  if (bumpPct > data.contribution) {
    const futureBal = computeProjectedBalancePure(
      data.salary,
      data.currentSavings,
      bumpPct,
      yearsToRetirement,
      growthRate,
    );
    const deltaBal = futureBal - projectedBalance;
    const newScore = computeReadinessScore(
      bumpPct,
      data.autoIncrease,
      data.riskLevel,
      yearsToRetirement,
      data.currentSavings,
    );
    const dScore = newScore - score;
    pushIf("increase-contribution", {
      title: "Increase Contributions by 3%",
      description:
        "Raising your contribution rate could add significant growth to your retirement savings over time due to compound interest.",
      impact: "High",
      projectedGain: formatDeltaPortfolio(deltaBal),
      scoreImpact: `${dScore >= 0 ? "+" : ""}${dScore} pts`,
      scoreDelta: dScore,
      Icon: DollarSign,
      patch: { kind: "contribution", value: bumpPct },
    });
  }

  if (!data.autoIncrease) {
    const newScore = computeReadinessScore(
      data.contribution,
      true,
      data.riskLevel,
      yearsToRetirement,
      data.currentSavings,
    );
    const dScore = newScore - score;
    const futureBal = projectBalanceWithAutoIncrease(
      data.salary,
      data.currentSavings,
      data.contribution,
      yearsToRetirement,
      growthRate,
      data.autoIncreaseRate,
      data.autoIncreaseMax,
    );
    const deltaBal = futureBal - projectedBalance;
    pushIf("auto-increase", {
      title: "Enable Auto-Increase (1% annually)",
      description:
        "Gradual annual increases help you save more without feeling the impact all at once on your monthly budget.",
      impact: "Medium",
      projectedGain: formatDeltaPortfolio(deltaBal),
      scoreImpact: `${dScore >= 0 ? "+" : ""}${dScore} pts`,
      scoreDelta: dScore,
      Icon: TrendingUp,
      patch: { kind: "autoIncreaseOn" },
    });
  }

  if (data.contribution < 6 && bumpPct < 6) {
    const targetMatch = 6;
    const futureBal = computeProjectedBalancePure(
      data.salary,
      data.currentSavings,
      targetMatch,
      yearsToRetirement,
      growthRate,
    );
    const deltaBal = futureBal - projectedBalance;
    const newScore = computeReadinessScore(
      targetMatch,
      data.autoIncrease,
      data.riskLevel,
      yearsToRetirement,
      data.currentSavings,
    );
    const dScore = newScore - score;
    pushIf("employer-match", {
      title: "Maximize Employer Match",
      description:
        "Don't leave free money on the table—capture the full employer match available to you immediately.",
      impact: "Medium",
      projectedGain: formatDeltaPortfolio(deltaBal),
      scoreImpact: `${dScore >= 0 ? "+" : ""}${dScore} pts`,
      scoreDelta: dScore,
      Icon: ShieldCheck,
      patch: { kind: "contribution", value: targetMatch },
    });
  }

  if (data.riskLevel === "conservative") {
    const balancedRate = getGrowthRate("balanced");
    const futureBal = computeProjectedBalancePure(
      data.salary,
      data.currentSavings,
      data.contribution,
      yearsToRetirement,
      balancedRate,
    );
    const deltaBal = futureBal - projectedBalance;
    const newScore = computeReadinessScore(
      data.contribution,
      data.autoIncrease,
      "balanced",
      yearsToRetirement,
      data.currentSavings,
    );
    const dScore = newScore - score;
    pushIf("strategy-balanced", {
      title: "Shift toward balanced growth",
      description:
        "A modest increase in equity exposure may improve long-term outcomes while keeping diversification.",
      impact: "Medium",
      projectedGain: formatDeltaPortfolio(deltaBal),
      scoreImpact: `${dScore >= 0 ? "+" : ""}${dScore} pts`,
      scoreDelta: dScore,
      Icon: Sparkles,
      patch: { kind: "riskLevel", value: "balanced" },
    });
  }

  const deduped = out.filter((r, i, arr) => arr.findIndex((x) => x.id === r.id) === i);

  if (deduped.length === 0) {
    return [
      {
        id: "review-plan",
        title: "Review your retirement plan",
        description:
          "Walk through contributions and investment strategy with your goals in mind before you enroll.",
        impact: "Medium" as const,
        projectedGain: "+$0",
        scoreImpact: "+0 pts",
        scoreDelta: 0,
        Icon: Sparkles,
        patch: { kind: "none" },
      },
    ];
  }

  return deduped.sort((a, b) => b.scoreDelta - a.scoreDelta);
}
