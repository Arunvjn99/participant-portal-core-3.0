import { useEffect, useMemo, useRef, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { ArrowRight, Info, Percent, Sparkles, TrendingUp, Target, type LucideIcon } from "lucide-react";
import { useEnrollmentStore, type EnrollmentV1Store } from "../store/useEnrollmentStore";
import {
  generateRecommendations,
  type GeneratedRecommendation,
  type ReadinessApplyPatch,
} from "../flow/readinessRecommendations";
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
        <circle cx="80" cy="80" r={RING_R} fill="none" className="stroke-[var(--color-border)]" strokeWidth="12" />
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
        <span className={cn("text-[40px] font-bold tabular-nums leading-none tracking-[0.33px]", centerClassName)}>{displayValue}</span>
        <span className="mt-1 text-[11px] font-normal text-[var(--enroll-text-muted)]">{t(`${P}outOf100`)}</span>
      </div>
    </div>
  );
}

function recommendationVisual(recId: string): { boxClass: string; iconClass: string; Icon: LucideIcon } {
  switch (recId) {
    case "auto-increase":
      return {
        boxClass: "bg-[color-mix(in_srgb,var(--color-primary)_15%,transparent)]",
        iconClass: "text-emerald-600 dark:text-emerald-400",
        Icon: TrendingUp,
      };
    case "increase-contribution":
    case "employer-match":
      return {
        boxClass: "bg-[color-mix(in_srgb,var(--color-primary)_15%,transparent)]",
        iconClass: "text-[var(--color-primary)]",
        Icon: Percent,
      };
    case "strategy-balanced":
    case "strategy-growth":
      return {
        boxClass: "bg-violet-100 dark:bg-violet-950/40",
        iconClass: "text-violet-700 dark:text-violet-300",
        Icon: TrendingUp,
      };
    default:
      return {
        boxClass: "bg-[var(--color-background-tertiary)]",
        iconClass: "text-[var(--color-text)]",
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
  const data = useEnrollmentStore();
  const updateField = useEnrollmentStore((s) => s.updateField);
  const [appliedIds, setAppliedIds] = useState<string[]>([]);
  const [selectedRecId, setSelectedRecId] = useState<string | null>(null);

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

  const strategyRec = actionableRecs.find((rec) => rec.id.startsWith("strategy-"));
  const orderedActionableRecs = useMemo(() => {
    if (actionableRecs.length <= 1) return actionableRecs;
    if (!strategyRec || strategyRec.id === actionableRecs[0]?.id) return actionableRecs;
    return [actionableRecs[0], strategyRec, ...actionableRecs.filter((rec) => rec.id !== actionableRecs[0]?.id && rec.id !== strategyRec.id)];
  }, [actionableRecs, strategyRec]);
  const selectedActionableRec =
    orderedActionableRecs.find((rec) => rec.id === selectedRecId) ?? orderedActionableRecs[0];

  useEffect(() => {
    if (orderedActionableRecs.length === 0) {
      setSelectedRecId(null);
      return;
    }
    setSelectedRecId((prev) => (prev && orderedActionableRecs.some((rec) => rec.id === prev) ? prev : orderedActionableRecs[0].id));
  }, [orderedActionableRecs]);

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
        ? "text-[var(--color-text)]"
        : "text-emerald-700 dark:text-emerald-300";

  const targetBarPct = Math.min(100, Math.round((score / READINESS_BENCHMARK) * 100));
  const statusMessage = (s: number) => {
    if (s >= 80) return t(`${P}statusGreat`);
    if (s >= 70) return t(`${P}statusSolid`);
    if (s >= 40) return t(`${P}statusStarted`);
    return t(`${P}statusEveryStep`);
  };

  return (
    <div className="w-full min-w-0 bg-[var(--enroll-card-bg)] px-8 py-8 text-left">

      {/* ── Page header ── */}
      <header className="mb-7">
        <h1 className="text-[26px] font-bold leading-tight tracking-tight text-[var(--enroll-text-primary)]">
          {t(`${P}pageTitle`)}
        </h1>
        <p className="mt-1.5 text-[14px] text-[var(--enroll-text-secondary)]">
          {t(`${P}pageSubtitle`)}
        </p>
      </header>

      {/* ── Two-column grid ── */}
      <div className="grid min-w-0 items-start gap-6 lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)]">

        {/* ════════════ LEFT COLUMN ════════════ */}
        <div className="flex flex-col gap-5">

          {/* Score card */}
          <div className="rounded-2xl border border-[var(--enroll-card-border)] bg-[var(--enroll-card-bg)] p-6 shadow-sm">
            <div className="flex flex-col items-center">
              {/* Score ring */}
              <div className="readiness-score-visual relative !h-[170px] !w-[170px]">
                <AnimatedScoreRing value={score} strokeClass={strokeClass} centerClassName={centerScoreClass} />
              </div>

              {/* "On Track" */}
              <p className="mt-4 text-[18px] font-bold text-[var(--enroll-text-primary)]">
                {statusMessage(score)}
              </p>

              <p className="mt-1 text-center text-[13.5px] text-[var(--enroll-text-secondary)]">
                <Trans
                  i18nKey={`${P}onTrackLine`}
                  values={{ score }}
                  components={{ score: <span className="font-semibold text-[var(--enroll-text-primary)]" /> }}
                />
              </p>

              {/* Progress bar + "Target: 65" */}
              <div className="mt-3 flex w-full max-w-[230px] items-center gap-2">
                <div className="h-[7px] min-w-0 flex-1 overflow-hidden rounded-full bg-[var(--enroll-card-border)]">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-[width] duration-500 ease-out"
                    style={{ width: `${targetBarPct}%` }}
                  />
                </div>
                <span className="shrink-0 text-[12px] text-[var(--enroll-text-muted)]">
                  {t(`${P}target`)} <span className="font-semibold text-[var(--enroll-text-secondary)]">{READINESS_BENCHMARK}</span>
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="my-5 border-t border-[var(--enroll-card-border)]" />

            {/* Projected balance */}
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center gap-1.5">
                <Target className="h-3.5 w-3.5 text-[var(--enroll-text-muted)]" aria-hidden />
                <span className="text-[10.5px] font-semibold uppercase tracking-widest text-[var(--enroll-text-muted)]">
                  {t(`${P}projectedBalanceLabel`)}
                </span>
              </div>
              <p className="mt-1 text-[34px] font-bold tabular-nums leading-none text-[var(--enroll-text-primary)]">
                {formatCurrency(projectedBalance)}
              </p>
              <p className="mt-1.5 text-[12px] text-[var(--enroll-text-muted)]">
                {t(`${P}atAge`, { age: data.retirementAge })}
              </p>
            </div>
          </div>

          {/* Understanding Your Score — no card bg, plain section */}
          <div>
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 shrink-0 text-[var(--enroll-brand)]" aria-hidden />
              <p className="text-[15px] font-semibold text-[var(--enroll-text-primary)]">
                {t(`${P}understandingTitle`)}
              </p>
            </div>
            <p className="mt-1.5 text-[13px] leading-[1.6] text-[var(--enroll-text-secondary)]">
              {t(`${P}understandingBody`, { score })}
            </p>
          </div>

          {/* Annual Funding Summary */}
          <div className="rounded-xl border px-5 py-4" style={{ borderColor: "color-mix(in srgb, var(--enroll-brand) 30%, var(--enroll-card-border))", background: "color-mix(in srgb, var(--enroll-brand) 6%, var(--enroll-card-bg))" }}>
            <p className="text-[15px] font-bold text-[var(--enroll-text-primary)]">
              {t(`${P}fundingTitle`)}
            </p>

            <div className="mt-3.5 space-y-3">
              {/* Retirement Income Goal */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--enroll-text-muted)]" aria-hidden />
                  <span className="text-[13.5px] text-[var(--enroll-text-secondary)]">{t(`${P}fundingGoal`)}</span>
                </div>
                <span className="text-[14px] font-semibold tabular-nums text-[var(--enroll-text-primary)]">
                  ${formatCurrencyDetailed(retirementIncomeGoalAnnual)}
                </span>
              </div>

              {/* Current Annual Contributions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--enroll-brand)]" aria-hidden />
                  <span className="text-[13.5px] text-[var(--enroll-text-secondary)]">{t(`${P}fundingCurrent`)}</span>
                </div>
                <span className="text-[14px] font-semibold tabular-nums text-[var(--enroll-brand)]">
                  ${Math.round(currentAnnualContributions).toLocaleString()}
                </span>
              </div>

              {/* Divider */}
              <div className="h-px" style={{ background: "color-mix(in srgb, var(--enroll-brand) 30%, var(--enroll-card-border))" }} />

              {/* Annual Savings Gap */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--color-error)]" aria-hidden />
                  <span className="text-[13.5px] text-[var(--enroll-text-secondary)]">{t(`${P}fundingGap`)}</span>
                </div>
                <span className="text-[14px] font-semibold tabular-nums text-[var(--color-error)]">
                  ${formatCurrencyDetailed(annualSavingsGap)}
                </span>
              </div>
            </div>

            {/* Footer note */}
            <div className="mt-3.5 border-t pt-3" style={{ borderColor: "color-mix(in srgb, var(--enroll-brand) 30%, var(--enroll-card-border))" }}>
              <p className="text-[11.5px] leading-[1.6] text-[var(--enroll-text-muted)]">
                {t(`${P}fundingFooter`)}
              </p>
            </div>
          </div>
        </div>

        {/* ════════════ RIGHT COLUMN ════════════ */}
        <div className="flex flex-col gap-5">

          {/* Boost banner */}
          {showRecommendedPanel ? (
            <div className="rounded-xl border px-5 py-4" style={{ borderColor: "color-mix(in srgb, var(--enroll-brand) 25%, var(--enroll-card-border))", background: "color-mix(in srgb, var(--enroll-brand) 6%, var(--enroll-card-bg))" }}>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 shrink-0 text-[var(--enroll-brand)]" aria-hidden />
                <span className="text-[14px] font-semibold text-[var(--enroll-brand)]">
                  {t(`${P}boostScore`, { score: bestNewScore })}
                </span>
              </div>
              <p className="mt-2 text-[13.5px] leading-[1.6] text-[var(--enroll-text-secondary)]">
                {t(`${P}boostDesc`, { points: boostPoints })}
              </p>
            </div>
          ) : null}

          {/* Recommendations heading */}
          <div>
            <p className="text-[17px] font-bold text-[var(--enroll-text-primary)]">{t(`${P}recHeading`)}</p>
            <p className="mt-0.5 text-[13px] text-[var(--enroll-text-secondary)]">
              {t(`${P}recSubheading`)}
            </p>
          </div>

          {/* Recommendation cards */}
          <div className="flex flex-col gap-3">
            {orderedActionableRecs.map((rec, index) => {
              const isFeatured = index === 0;
              const isSelected = rec.id === selectedActionableRec?.id;
              const { iconClass, Icon } = recommendationVisual(rec.id);
              return (
                <div
                  key={rec.id}
                  className={cn(
                    "relative cursor-pointer rounded-xl border bg-[var(--enroll-card-bg)] px-5 py-5 transition-all",
                    isFeatured ? "mt-3" : "",
                    isSelected
                      ? "border-[var(--enroll-brand)] shadow-[0_0_0_1.5px_var(--enroll-brand)]"
                      : "border-[var(--enroll-card-border)] hover:border-[var(--enroll-brand)]",
                  )}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSelected}
                  onClick={() => setSelectedRecId(rec.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedRecId(rec.id);
                    }
                  }}
                >
                  {/* RECOMMENDED badge — overlapping top border */}
                  {isFeatured ? (
                    <div className="absolute -top-3 left-4 inline-flex items-center gap-1.5 rounded-full bg-[var(--enroll-brand)] px-3 py-1 shadow-sm">
                      <Sparkles className="h-2.5 w-2.5 text-[var(--color-text-on-primary)]" aria-hidden />
                      <span className="text-[10px] font-bold uppercase tracking-[0.6px] text-[var(--color-text-on-primary)]">
                        {t(`${P}recBadge`)}
                      </span>
                    </div>
                  ) : null}

                  {/* Icon + title + description */}
                  <div className="flex items-start gap-3">
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                      style={{ background: "color-mix(in srgb, var(--enroll-brand) 10%, var(--enroll-card-bg))" }}
                    >
                      <Icon className="h-[18px] w-[18px] text-[var(--enroll-brand)]" aria-hidden strokeWidth={2} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[15px] font-semibold leading-snug text-[var(--enroll-text-primary)]">
                        {rec.title}
                      </p>
                      <p className="mt-0.5 text-[13px] leading-[1.5] text-[var(--enroll-text-secondary)]">
                        {rec.description}
                      </p>
                    </div>
                  </div>

                  {/* Metrics row — SCORE / SAVINGS / BALANCE */}
                  <div className="mt-4 grid grid-cols-3 border-t border-[var(--enroll-card-border)] pt-3">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.06em] text-[var(--enroll-text-muted)]">
                        {t(`${P}metricScore`)}
                      </p>
                      <div className="mt-1 flex items-center gap-1">
                        <span className="text-[13px] font-medium tabular-nums text-[var(--enroll-text-muted)]">{score}</span>
                        <ArrowRight className="h-3 w-3 shrink-0 text-[var(--enroll-text-muted)]" aria-hidden />
                        <span className="text-[13px] font-bold tabular-nums text-[var(--color-success)]">{rec.newScore}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.06em] text-[var(--enroll-text-muted)]">
                        {t(`${P}metricSavings`)}
                      </p>
                      <p className="mt-1 text-[13px] font-bold tabular-nums text-[var(--enroll-brand)]">
                        +${rec.additionalAnnualSavings.toLocaleString()}/yr
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.06em] text-[var(--enroll-text-muted)]">
                        {t(`${P}metricBalance`)}
                      </p>
                      <p className="mt-1 text-[13px] font-bold tabular-nums text-[var(--enroll-text-primary)]">
                        {formatCurrency(rec.projectedBalanceAfter)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Fallback when no recs */}
            {orderedActionableRecs.length === 0 ? (
              <div className="rounded-xl border border-[var(--enroll-card-border)] bg-[var(--enroll-card-bg)] p-4">
                <p className="text-[13px] text-[var(--enroll-text-secondary)]">
                  {recommendations[0]?.description ?? t(`${P}fallbackRec`)}
                </p>
              </div>
            ) : null}
          </div>

          {/* Bottom CTAs */}
          {selectedActionableRec != null && selectedActionableRec.patch.kind !== "none" ? (
            <div>
              <button
                type="button"
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--enroll-brand)] text-[14px] font-semibold text-[var(--color-text-on-primary)] shadow-md transition-colors hover:opacity-90 active:scale-[0.99]"
                onClick={() => applyRec(selectedActionableRec)}
              >
                {t(`${P}applySelected`)} <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
              </button>
            </div>
          ) : null}

        </div>
      </div>
    </div>
  );
}
