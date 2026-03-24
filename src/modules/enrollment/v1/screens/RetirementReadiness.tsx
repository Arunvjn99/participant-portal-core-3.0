import { useEffect, useMemo, useRef, useState } from "react";
import { AlertCircle, AlertTriangle, ArrowUp, Bot, Info, Sparkles, Target, Zap } from "lucide-react";
import { useEnrollmentStore, type EnrollmentV1Store } from "../store/useEnrollmentStore";
import { computeMockRetirementProjection } from "../flow/projection";
import {
  computeProjectedBalancePure,
  computeReadinessScore,
  getGrowthRate,
} from "../flow/readinessMetrics";
import {
  generateRecommendations,
  type GeneratedRecommendation,
  type ReadinessApplyPatch,
} from "../flow/readinessRecommendations";
import { cn } from "@/lib/utils";

const RING_R = 58;
const RING_C = 2 * Math.PI * RING_R;

function AnimatedScoreRing({
  value,
  strokeClass,
  displayClass,
}: {
  value: number;
  strokeClass: string;
  displayClass: string;
}) {
  const [displayValue, setDisplayValue] = useState(value);
  const prev = useRef(value);

  useEffect(() => {
    if (prev.current === value) return;
    const start = prev.current;
    const diff = value - start;
    const duration = 800;
    const startTime = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1);
      const eased = 1 - (1 - t) ** 3;
      setDisplayValue(Math.round(start + diff * eased));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    prev.current = value;
  }, [value]);

  const dashOffset = RING_C - (displayValue / 100) * RING_C;

  return (
    <div className="readiness-score-ring-wrap -rotate-90">
      <svg viewBox="0 0 160 160" aria-hidden>
        <circle cx="80" cy="80" r={RING_R} fill="none" className="score-ring-track" strokeWidth="10" />
        <circle
          cx="80"
          cy="80"
          r={RING_R}
          fill="none"
          className={strokeClass}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={RING_C}
          strokeDashoffset={dashOffset}
        />
      </svg>
      <div className="absolute inset-0 flex rotate-90 flex-col items-center justify-center">
        <span className={cn("text-4xl font-bold tabular-nums sm:text-5xl", displayClass)}>{displayValue}</span>
        <span className="text-xs text-muted-foreground">out of 100</span>
      </div>
    </div>
  );
}

function ReadinessScoreCard({
  score,
  onTrack,
  strokeClass,
  displayClass,
}: {
  score: number;
  onTrack: boolean;
  strokeClass: string;
  displayClass: string;
}) {
  return (
    <div className="card readiness-score-shell">
      <h2 className="text-lg font-medium text-foreground">Readiness Score</h2>
      <div className="readiness-score-visual">
        <div className="readiness-score-glow" aria-hidden />
        <div className="readiness-score-deco" aria-hidden>
          <svg viewBox="0 0 160 160" fill="none">
            <circle
              cx="80"
              cy="80"
              r="74"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray="4 10"
              opacity="0.85"
            />
          </svg>
        </div>
        <AnimatedScoreRing value={score} strokeClass={strokeClass} displayClass={displayClass} />
      </div>
      <span
        className={cn(
          "chip chip-static text-xs uppercase tracking-wide",
          onTrack ? "chip--status-success" : "chip--status-warning",
        )}
      >
        {onTrack ? "On Track" : "Needs Attention"}
      </span>
      <p className="max-w-sm text-center text-sm text-muted-foreground">
        {onTrack
          ? "You are progressing toward a solid retirement outcome with your current selections."
          : "Small adjustments to contributions or strategy can materially improve your outlook."}
      </p>
    </div>
  );
}

function applyEnrollmentPatch(patch: ReadinessApplyPatch, updateField: EnrollmentV1Store["updateField"]) {
  switch (patch.kind) {
    case "contribution":
      updateField("contribution", patch.value);
      break;
    case "autoIncreaseOn":
      updateField("autoIncrease", true);
      updateField("autoIncreaseStepResolved", true);
      break;
    case "riskLevel":
      updateField("riskLevel", patch.value);
      break;
    default:
      break;
  }
}

export function RetirementReadiness() {
  const data = useEnrollmentStore();
  const updateField = useEnrollmentStore((s) => s.updateField);
  const [appliedIds, setAppliedIds] = useState<string[]>([]);

  const yearsToRetirement = Math.max(0, data.retirementAge - data.currentAge);
  const growthRate = getGrowthRate(data.riskLevel);

  const matchPercent = Math.min(data.contribution, 6);
  const annualEmployee = Math.round((data.salary * data.contribution) / 100);
  const annualEmployer = Math.round((data.salary * matchPercent) / 100);
  const totalAnnualContributions = annualEmployee + annualEmployer;

  const projectedBalance = computeProjectedBalancePure(
    data.salary,
    data.currentSavings,
    data.contribution,
    yearsToRetirement,
    growthRate,
  );

  const score = computeReadinessScore(
    data.contribution,
    data.autoIncrease,
    data.riskLevel,
    yearsToRetirement,
    data.currentSavings,
  );

  const retirementIncomeGoalAnnual = Math.round(projectedBalance * 0.03);
  const annualSavingsGap = Math.max(0, retirementIncomeGoalAnnual - totalAnnualContributions);

  const formatCurrency = (val: number) => {
    if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(1)}M`;
    if (val >= 1_000) return `$${Math.round(val / 1_000).toLocaleString()}K`;
    return `$${Math.round(val).toLocaleString()}`;
  };

  const recommendations = useMemo(
    () =>
      generateRecommendations(data, appliedIds, {
        score,
        projectedBalance,
        yearsToRetirement,
      }),
    [appliedIds, data, projectedBalance, score, yearsToRetirement],
  );

  const potentialScore = Math.min(
    100,
    score + recommendations.reduce((s, r) => s + Math.max(0, r.scoreDelta), 0),
  );

  useEffect(() => {
    const p = computeMockRetirementProjection(data.contribution, data.riskLevel);
    const { retirementProjection: rp } = useEnrollmentStore.getState();
    if (rp.estimatedValue === p.estimatedValue && rp.monthlyIncome === p.monthlyIncome) return;
    updateField("retirementProjection", p);
  }, [data.contribution, data.riskLevel, updateField]);

  const applyRec = (rec: GeneratedRecommendation) => {
    if (!window.confirm("Apply this recommendation to your enrollment selections?")) return;
    applyEnrollmentPatch(rec.patch, updateField);
    setAppliedIds((prev) => (prev.includes(rec.id) ? prev : [...prev, rec.id]));
  };

  const showAlertCard = score <= 70;
  const alertIsCritical = score < 40;
  const onTrack = score > 70;

  const strokeClass = alertIsCritical
    ? "stroke-[var(--color-danger)]"
    : score <= 70
      ? "stroke-[var(--color-warning)]"
      : "stroke-[var(--color-success)]";
  const displayClass = alertIsCritical
    ? "text-[var(--color-danger)]"
    : score <= 70
      ? "text-[var(--color-warning)]"
      : "text-[var(--color-success)]";

  const understandingCopy = onTrack
    ? `Your score of ${score} reflects your contributions, timeline, and growth assumptions. You are close to or above the typical participant target.`
    : `Your score of ${score} is based on contributions, timeline, and projected growth — there is room to improve before you finalize.`;

  const AlertIcon = alertIsCritical ? AlertCircle : AlertTriangle;

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-6 text-center lg:text-left">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">AI-Powered Analysis</p>
        <h1 className="mt-2 text-2xl font-semibold text-foreground">Your Retirement Readiness Score</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your personalized score based on contributions, timeline, and projected market performance.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:grid-rows-2 lg:gap-6">
        <div className="order-1 lg:col-start-1 lg:row-start-1">
          <ReadinessScoreCard
            score={score}
            onTrack={onTrack}
            strokeClass={strokeClass}
            displayClass={displayClass}
          />
        </div>

        {showAlertCard ? (
          <div
            className={cn(
              "order-2 flex flex-col gap-4 sm:flex-row sm:items-start lg:col-start-2 lg:row-start-1",
              "card card-alert",
              !alertIsCritical && "card-alert--caution",
            )}
          >
            <div
              className={cn(
                "icon-box-soft flex h-14 w-14 shrink-0 rounded-2xl sm:h-16 sm:w-16",
                alertIsCritical ? "text-danger-token" : "text-warning-token",
              )}
            >
              <AlertIcon className="h-7 w-7 sm:h-8 sm:w-8" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-medium text-foreground">
                  {alertIsCritical ? "You're Not Ready Yet" : "Room to Improve"}
                </h3>
                <span
                  className={cn(
                    "chip chip-static text-xs",
                    alertIsCritical ? "chip--impact-high" : "chip--impact-medium",
                  )}
                >
                  {alertIsCritical ? "Action Required" : "Review Recommended"}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {alertIsCritical
                  ? "You're not on track for your desired retirement income at this pace. Small changes now can make a large difference."
                  : "You're trending in the right direction, but tightening contributions or turning on auto-increase could lift your trajectory."}
              </p>
              <div className="card-alert__metrics mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Current Gap</p>
                  <p
                    className={cn(
                      "text-xl font-bold tabular-nums sm:text-2xl",
                      alertIsCritical ? "text-danger-token" : "text-warning-token",
                    )}
                  >
                    {formatCurrency(annualSavingsGap)}
                  </p>
                  <p className="text-xs text-muted-foreground">per year short</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Time Left</p>
                  <p className="text-xl font-bold tabular-nums text-foreground sm:text-2xl">{yearsToRetirement}</p>
                  <p className="text-xs text-muted-foreground">years to retire</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Readiness %</p>
                  <p
                    className={cn(
                      "text-xl font-bold tabular-nums sm:text-2xl",
                      alertIsCritical ? "text-warning-token" : "text-foreground",
                    )}
                  >
                    {score}%
                  </p>
                  <p className="text-xs text-muted-foreground">of target goal</p>
                </div>
              </div>
              <div className="card-alert__cta">
                <Zap className="mt-0.5 h-4 w-4 shrink-0 text-warning-token" aria-hidden />
                <p className="card-alert__cta-text">
                  <strong>Act now:</strong> Follow the recommendations below to close your gap.
                </p>
              </div>
            </div>
          </div>
        ) : null}

        <div className="order-3 flex flex-col gap-4 lg:col-start-2 lg:row-start-2">
          <div className="card flex flex-col overflow-hidden p-0">
            <div className="border-b border-border px-5 py-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5 shrink-0 text-primary" aria-hidden />
                  <h2 className="text-lg font-medium text-foreground">AI Recommendations</h2>
                </div>
                <span className="text-sm text-muted-foreground">
                  {recommendations.length} action{recommendations.length === 1 ? "" : "s"} surfaced
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Applying all listed actions could lift your score toward{" "}
                <span className="font-semibold text-primary">{potentialScore}</span>.
              </p>
            </div>
            <div className="flex flex-col gap-3 p-4 sm:p-5">
              {recommendations.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  All surfaced actions are applied. Adjust contributions or strategy above to refresh this list.
                </p>
              ) : null}
              {recommendations.map((rec) => {
                const Icon = rec.Icon;
                const high = rec.impact === "High";
                return (
                  <div key={rec.id} className="card card--pad-sm flex flex-col gap-3 sm:flex-row sm:items-start">
                    <div className="icon-box-soft flex h-11 w-11 shrink-0 rounded-full sm:h-12 sm:w-12">
                      <Icon className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-medium text-foreground sm:text-lg">{rec.title}</h3>
                        <span className="chip chip-static flex items-center gap-1 py-1 text-xs">
                          <Sparkles className="h-3 w-3" aria-hidden />
                          AI
                        </span>
                        <span
                          className={cn(
                            "chip chip-static py-1 text-xs",
                            high ? "chip--impact-high" : "chip--impact-medium",
                          )}
                        >
                          {rec.impact} impact
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">{rec.description}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                        <span className="text-success-token inline-flex items-center gap-1 font-medium">
                          <ArrowUp className="h-4 w-4" aria-hidden />
                          {rec.projectedGain} projected
                        </span>
                        <span className="inline-flex items-center gap-1 font-medium text-primary">
                          <Target className="h-4 w-4" aria-hidden />
                          {rec.scoreImpact}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => applyRec(rec)}
                      className="btn btn-primary btn-sm w-full shrink-0 sm:mt-0 sm:w-auto"
                    >
                      Apply
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="order-4 flex flex-col gap-4 lg:col-start-1 lg:row-start-2">
          <div className="card-soft space-y-2">
            <div className="flex items-start gap-2">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
              <h3 className="text-lg font-medium text-foreground">Understanding Your Score</h3>
            </div>
            <p className="text-sm text-muted-foreground">{understandingCopy}</p>
          </div>

          <div className="card-soft space-y-3">
            <h3 className="text-lg font-medium text-foreground">Annual Funding Summary</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3 text-sm">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="metric-dot-tertiary h-3 w-3 shrink-0 rounded-full" />
                  <span className="text-muted-foreground">Retirement goal (est. annual income)</span>
                </div>
                <span className="shrink-0 font-semibold tabular-nums text-foreground">
                  {formatCurrency(retirementIncomeGoalAnnual)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3 text-sm">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="h-3 w-3 shrink-0 rounded-full bg-primary" />
                  <span className="text-muted-foreground">Current contributions (you + employer)</span>
                </div>
                <span className="shrink-0 font-semibold tabular-nums text-primary">
                  {formatCurrency(totalAnnualContributions)}
                </span>
              </div>
              <div className="border-t border-border" />
              <div className="flex items-center justify-between gap-3 text-sm">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="metric-dot-danger h-3 w-3 shrink-0 rounded-full" />
                  <span className="text-muted-foreground">Gap</span>
                </div>
                <span className="text-danger-token shrink-0 font-semibold tabular-nums">
                  {formatCurrency(annualSavingsGap)}
                </span>
              </div>
            </div>
            <p className="border-t border-border pt-3 text-xs text-muted-foreground">
              This compares an estimated sustainable annual income from your projected balance to what you and your
              employer save each year. Close the gap by increasing contributions, enabling auto-increase, or
              revisiting your investment strategy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
