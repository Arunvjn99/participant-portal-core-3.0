import { useEffect, useMemo, useRef, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ArrowRight, DollarSign, Info, Percent, Ribbon, Sparkles, TrendingUp, type LucideIcon } from "lucide-react";
import { useEnrollmentStore, type EnrollmentV1Store } from "../store/useEnrollmentStore";
import {
  generateRecommendations,
  type GeneratedRecommendation,
  type ReadinessApplyPatch,
} from "../flow/readinessRecommendations";
import { ENROLLMENT_STEPS } from "../flow/steps";
import { pathForWizardStep } from "../flow/v1WizardPaths";
import { cn } from "@/lib/utils";

/** Participant benchmark shown in UI (Figma reference — target score line). */
const READINESS_BENCHMARK = 65;

const RING_R = 58;
const RING_C = 2 * Math.PI * RING_R;
const P = "enrollment.v1.readiness.";

function AnimatedScoreRing({
  value,
  strokeClass,
  centerClassName,
}: {
  value: number;
  strokeClass: string;
  /** Center score number (reference: bold dark text inside donut). */
  centerClassName: string;
}) {
  const { t } = useTranslation();
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
        <circle cx="80" cy="80" r={RING_R} fill="none" className="stroke-slate-200 dark:stroke-slate-600" strokeWidth="12" />
        <circle
          cx="80"
          cy="80"
          r={RING_R}
          fill="none"
          className={strokeClass}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={RING_C}
          strokeDashoffset={dashOffset}
        />
      </svg>
      <div className="absolute inset-0 flex rotate-90 flex-col items-center justify-center">
        <span className={cn("text-4xl font-bold tabular-nums sm:text-5xl", centerClassName)}>{displayValue}</span>
        <span className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">{t(`${P}outOf100`)}</span>
      </div>
    </div>
  );
}

function recommendationVisual(recId: string): { boxClass: string; iconClass: string; Icon: LucideIcon } {
  switch (recId) {
    case "auto-increase":
      return {
        boxClass: "bg-blue-100 dark:bg-blue-950/40",
        iconClass: "text-emerald-600 dark:text-emerald-400",
        Icon: TrendingUp,
      };
    case "increase-contribution":
    case "employer-match":
      return {
        boxClass: "bg-blue-100 dark:bg-blue-950/40",
        iconClass: "text-blue-700 dark:text-blue-300",
        Icon: Percent,
      };
    case "strategy-balanced":
      return {
        boxClass: "bg-violet-100 dark:bg-violet-950/40",
        iconClass: "text-violet-700 dark:text-violet-300",
        Icon: Sparkles,
      };
    default:
      return {
        boxClass: "bg-slate-100 dark:bg-slate-800/80",
        iconClass: "text-slate-700 dark:text-slate-200",
        Icon: Sparkles,
      };
  }
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
  const { t } = useTranslation();
  const navigate = useNavigate();
  const data = useEnrollmentStore();
  const updateField = useEnrollmentStore((s) => s.updateField);
  const goToStep = useEnrollmentStore((s) => s.goToStep);
  const [appliedIds, setAppliedIds] = useState<string[]>([]);

  const yearsToRetirement = Math.max(0, data.retirementAge - data.currentAge);

  const projectedBalance = data.projectedBalance;
  const score = data.readinessScore;
  const retirementIncomeGoalAnnual = data.retirementProjection.monthlyIncome * 12;
  const currentAnnualContributions = data.monthlyContribution * 12;
  const annualSavingsGap = Math.max(0, retirementIncomeGoalAnnual - currentAnnualContributions);

  const formatCurrency = (val: number) => {
    if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(1)}M`;
    if (val >= 1_000) return `$${Math.round(val / 1_000).toLocaleString()}K`;
    return `$${Math.round(val).toLocaleString()}`;
  };
  const formatCurrencyDetailed = (val: number) =>
    val.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const recommendations = useMemo(
    () =>
      generateRecommendations(
        data,
        appliedIds,
        {
          score,
          projectedBalance,
          yearsToRetirement,
        },
        t,
      ),
    [appliedIds, data, projectedBalance, score, yearsToRetirement, t],
  );

  const actionableRecs = useMemo(
    () => recommendations.filter((r) => r.patch.kind !== "none"),
    [recommendations],
  );

  const bestNewScore = useMemo(
    () => actionableRecs.reduce((m, r) => Math.max(m, r.newScore), score),
    [actionableRecs, score],
  );

  const boostPoints = Math.max(0, bestNewScore - score);
  const showRecommendedPanel = actionableRecs.length > 0 && boostPoints > 0;

  const applyRec = (rec: GeneratedRecommendation) => {
    if (rec.patch.kind === "none") return;
    if (!window.confirm(t(`${P}confirmApply`))) return;
    applyEnrollmentPatch(rec.patch, updateField);
    setAppliedIds((prev) => (prev.includes(rec.id) ? prev : [...prev, rec.id]));
  };

  const topActionableRec = actionableRecs[0];
  const handleContinueCustomAllocation = () => {
    const idx = ENROLLMENT_STEPS.indexOf("investment");
    goToStep(idx);
    navigate(pathForWizardStep(idx));
  };

  const alertIsCritical = score < 40;
  const strokeClass = alertIsCritical
    ? "stroke-red-500 dark:stroke-red-400"
    : score < READINESS_BENCHMARK
      ? "stroke-orange-500 dark:stroke-orange-400"
      : "stroke-emerald-500 dark:stroke-emerald-400";
  const centerScoreClass =
    alertIsCritical
      ? "text-red-600 dark:text-red-400"
      : score < READINESS_BENCHMARK
        ? "text-slate-900 dark:text-slate-50"
        : "text-emerald-700 dark:text-emerald-300";

  const targetBarPct = Math.min(100, Math.round((score / READINESS_BENCHMARK) * 100));
  const needsAttention = score < READINESS_BENCHMARK;

  const statusMessage = (s: number) => {
    if (s >= 80) return t(`${P}statusGreat`);
    if (s >= 70) return t(`${P}statusSolid`);
    if (s >= 40) return t(`${P}statusStarted`);
    return t(`${P}statusEveryStep`);
  };

  return (
    <div className="w-full min-w-0 rounded-xl bg-[#f3f4f6] p-4 text-left dark:bg-slate-950/60 sm:p-6">
      <header className="mb-4 sm:mb-5">
        <h1 className="text-2xl font-bold leading-tight tracking-tight text-slate-900 dark:text-slate-50">{t(`${P}pageTitle`)}</h1>
        <p className="mt-1.5 text-sm leading-snug text-slate-600 dark:text-slate-400">{t(`${P}pageSubtitle`)}</p>
      </header>

      <div className="grid min-w-0 items-start gap-6 md:grid-cols-[minmax(0,1fr)_min(26rem,100%)] lg:grid-cols-[minmax(0,1fr)_min(28rem,100%)]">
        {/* ── Left: white summary card — donut, status, target bar, projected balance (reference) ── */}
        <div className="min-w-0">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-950 sm:p-8">
            <div className="flex flex-col items-center">
              <div className="readiness-score-visual relative">
                <AnimatedScoreRing value={score} strokeClass={strokeClass} centerClassName={centerScoreClass} />
              </div>

              <p className="mt-5 text-center text-sm font-bold text-slate-900 dark:text-slate-50">{statusMessage(score)}</p>
              <p className="mt-1.5 text-center text-sm text-slate-600 dark:text-slate-400">
                <Trans
                  i18nKey={`${P}onTrackLine`}
                  values={{ score }}
                  components={{ score: <span className="font-semibold text-slate-900 dark:text-slate-100" /> }}
                />
              </p>
              <p className="mt-1 max-w-sm text-center text-xs leading-relaxed text-slate-500 dark:text-slate-500">
                {t(`${P}benchmarkLine`, { benchmark: READINESS_BENCHMARK })}
              </p>

              <div className="mt-3 flex w-full max-w-xs items-center gap-2.5">
                <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                  <div
                    className="h-full rounded-full bg-slate-400 transition-[width] duration-500 ease-out dark:bg-slate-500"
                    style={{ width: `${targetBarPct}%` }}
                  />
                </div>
                <span className="shrink-0 text-[0.7rem] font-medium text-slate-500 dark:text-slate-400">
                  {t(`${P}target`)}{" "}
                  <span className="font-bold text-slate-800 dark:text-slate-100">{READINESS_BENCHMARK}</span>
                </span>
              </div>
            </div>

            <div className="my-7 border-t border-slate-100 dark:border-slate-800" />

            <div className="text-center">
              <div className="mb-1.5 flex items-center justify-center gap-2">
                <DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-400" aria-hidden />
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{t(`${P}projectedBalanceLabel`)}</p>
              </div>
              <p className="text-[1.85rem] font-bold leading-none tabular-nums text-slate-900 sm:text-4xl dark:text-slate-50">
                {formatCurrency(projectedBalance)}
              </p>
              <p className="mt-2 text-xs leading-snug text-slate-500 dark:text-slate-400">
                {t(`${P}projectedBalanceSub`, { years: yearsToRetirement })}
              </p>
            </div>

            <div className="mt-7 space-y-4 text-left">
              {needsAttention ? (
                <div className="flex justify-center">
                  <span className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-5 py-2 text-sm font-extrabold tracking-wide text-amber-700">
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-500" aria-hidden />
                    NEEDS ATTENTION
                  </span>
                </div>
              ) : null}

              <div className="rounded-3xl bg-slate-100 px-6 py-5 dark:bg-slate-900">
                <div className="flex items-start gap-3">
                  <Info className="mt-1 h-6 w-6 shrink-0 text-sky-500" aria-hidden />
                  <div className="min-w-0">
                    <p className="text-[2.15rem] font-bold leading-tight text-slate-900 dark:text-slate-50">
                      {t(`${P}understandingTitle`)}
                    </p>
                    <p className="mt-3 text-[1.05rem] leading-relaxed text-slate-600 dark:text-slate-300">
                      {t(`${P}understandingBody`, { score })}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-sky-200 bg-sky-50 px-6 py-5 dark:border-sky-900/60 dark:bg-sky-950/30">
                <p className="text-[2.15rem] font-bold leading-tight text-slate-900 dark:text-slate-50">{t(`${P}fundingTitle`)}</p>

                <div className="mt-5 space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="h-7 w-7 rounded-full bg-slate-500/70" aria-hidden />
                      <p className="text-[1.05rem] font-semibold text-slate-600 dark:text-slate-300">{t(`${P}fundingGoal`)}</p>
                    </div>
                    <p className="text-[1.05rem] font-bold tabular-nums text-slate-900 dark:text-slate-50">
                      ${formatCurrencyDetailed(retirementIncomeGoalAnnual)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="h-7 w-7 rounded-full bg-blue-500/90" aria-hidden />
                      <p className="text-[1.05rem] font-semibold text-slate-600 dark:text-slate-300">{t(`${P}fundingCurrent`)}</p>
                    </div>
                    <p className="text-[1.05rem] font-bold tabular-nums text-sky-600 dark:text-sky-300">
                      ${Math.round(currentAnnualContributions).toLocaleString()}
                    </p>
                  </div>

                  <div className="border-t border-slate-300/70 pt-3 dark:border-slate-700" />

                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="h-7 w-7 rounded-full bg-red-500/90" aria-hidden />
                      <p className="text-[1.05rem] font-semibold text-slate-600 dark:text-slate-300">{t(`${P}fundingGap`)}</p>
                    </div>
                    <p className="text-[1.05rem] font-bold tabular-nums text-red-600 dark:text-red-400">
                      ${formatCurrencyDetailed(annualSavingsGap)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 border-t border-slate-300/70 pt-4 dark:border-slate-700">
                  <p className="text-[1.02rem] leading-relaxed text-slate-600 dark:text-slate-300">{t(`${P}fundingFooter`)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right: recommended summary + improvement cards + CTAs (reference layout) ── */}
        <div className="min-w-0 space-y-5">
          {showRecommendedPanel ? (
            <div className="rounded-xl border border-blue-200/90 bg-gradient-to-br from-blue-50/95 via-violet-50/60 to-slate-50 p-5 shadow-sm dark:border-indigo-900/50 dark:from-indigo-950/35 dark:via-violet-950/25 dark:to-slate-950">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <p className="m-0 flex items-center gap-2 text-base font-semibold text-blue-900 dark:text-indigo-100">
                  <Sparkles className="h-4 w-4 shrink-0 text-blue-600 dark:text-indigo-400" aria-hidden />
                  {t(`${P}recommendedTitle`)}
                </p>
                <span className="shrink-0 rounded-md bg-emerald-100 px-2.5 py-1 text-sm font-bold text-emerald-800 dark:bg-emerald-900/45 dark:text-emerald-100">
                  {t(`${P}scorePill`, { score: bestNewScore })}
                </span>
              </div>
              <p className="mt-3 text-base leading-relaxed text-slate-700 dark:text-slate-400">
                <Trans
                  i18nKey={`${P}recommendedBody`}
                  values={{ score: bestNewScore, points: boostPoints }}
                  components={{
                    new: <span className="font-bold text-slate-900 dark:text-slate-100" />,
                    pts: <span className="font-bold text-slate-900 dark:text-slate-100" />,
                  }}
                />
              </p>
            </div>
          ) : null}

          {actionableRecs.length > 0 ? (
            <div className="space-y-5">
              <div>
                <p className="m-0 text-[1.95rem] font-bold leading-tight text-slate-900 dark:text-slate-100">{t(`${P}optionalTitle`)}</p>
                <p className="mt-1.5 text-base leading-snug text-slate-500 dark:text-slate-400">{t(`${P}optionalSub`)}</p>
              </div>

              <div className="space-y-4">
                {actionableRecs.map((rec, index) => {
                  const isFeatured = index === 0;
                  const { boxClass, iconClass, Icon } = recommendationVisual(rec.id);
                  return (
                    <div key={rec.id} className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-950/40">
                      <div className="p-5">
                        {isFeatured ? (
                          <div className="mb-3 inline-flex items-center gap-1 text-[0.625rem] font-bold uppercase tracking-[0.08em] text-blue-700 dark:text-blue-300">
                            <Ribbon className="h-3.5 w-3.5 shrink-0 stroke-[2.5]" aria-hidden />
                            {t(`${P}recBadge`)}
                          </div>
                        ) : null}
                        <div className="flex gap-3.5">
                          <div
                            className={cn(
                              "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg",
                              boxClass,
                            )}
                          >
                            <Icon className={cn("h-5 w-5", iconClass)} aria-hidden strokeWidth={2.25} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold text-slate-900 dark:text-slate-50">{rec.title}</p>
                            <p className="mt-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{rec.description}</p>

                            <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-4">
                              <div className="min-w-0">
                                <p className="m-0 text-xs font-medium text-slate-400 dark:text-slate-500">
                                  {t(`${P}metricScore`)}
                                </p>
                                <p className="mt-1.5 text-sm tabular-nums leading-tight">
                                  <span className="font-semibold text-slate-500 dark:text-slate-400">{score}</span>
                                  <span className="mx-0.5 font-medium text-slate-400 dark:text-slate-500" aria-hidden>
                                    →
                                  </span>
                                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{rec.newScore}</span>
                                </p>
                              </div>
                              <div className="min-w-0">
                                <p className="m-0 text-xs font-medium text-slate-400 dark:text-slate-500">
                                  {t(`${P}metricSavings`)}
                                </p>
                                <p className="mt-1.5 truncate text-sm font-bold text-blue-600 tabular-nums dark:text-blue-400">
                                  {t(`${P}savingsPerYr`, {
                                    amount: `$${rec.additionalAnnualSavings.toLocaleString()}`,
                                  })}
                                </p>
                              </div>
                              <div className="min-w-0">
                                <p className="m-0 text-xs font-medium text-slate-400 dark:text-slate-500">
                                  {t(`${P}metricBalance`)}
                                </p>
                                <p className="mt-1.5 text-sm font-bold tabular-nums text-slate-900 dark:text-slate-100">
                                  {formatCurrency(rec.projectedBalanceAfter)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          className="mt-5 w-full rounded-xl border border-gray-300 bg-white py-2.5 text-sm font-semibold text-slate-900 shadow-none transition-colors hover:bg-slate-50 dark:border-gray-600 dark:bg-gray-950 dark:text-slate-100 dark:hover:bg-gray-900/70"
                          onClick={() => applyRec(rec)}
                        >
                          {t(`${P}applyRec`)}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {topActionableRec != null && topActionableRec.patch.kind !== "none" ? (
                <div className="space-y-3 border-t border-slate-200 pt-5 dark:border-slate-700">
                  <button
                    type="button"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3.5 text-base font-bold text-white shadow-sm transition-colors hover:bg-blue-700 active:scale-[0.99] dark:bg-blue-600 dark:hover:bg-blue-500"
                    onClick={() => applyRec(topActionableRec)}
                  >
                    {t(`${P}applyRec`)} <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={handleContinueCustomAllocation}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-base font-semibold text-slate-700 transition-colors hover:bg-slate-50 active:scale-[0.99] dark:border-gray-600 dark:bg-gray-950 dark:text-slate-100 dark:hover:bg-gray-900/70"
                  >
                    {t(`${P}continueCustomAllocation`)}
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-sm text-muted-foreground">
                {recommendations[0]?.description ?? t(`${P}fallbackRec`)}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
