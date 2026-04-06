import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation, Trans } from "react-i18next";
import {
  ArrowRight,
  Info,
  Percent,
  Sparkles,
  Target,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { useEnrollmentStore } from "../store/useEnrollmentStore";

const P = "enrollment.v1.readiness.";
const READINESS_BENCHMARK = 65;
const RING_R = 58;
const RING_C = 2 * Math.PI * RING_R;

function AnimatedScoreRing({
  value,
  strokeColor,
  centerColor,
}: {
  value: number;
  strokeColor: string;
  centerColor: string;
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
      const elapsed = Math.min((now - startTime) / duration, 1);
      const eased = 1 - (1 - elapsed) ** 3;
      setDisplayValue(Math.round(start + diff * eased));
      if (elapsed < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    prev.current = value;
  }, [value]);

  const dashOffset = RING_C - (displayValue / 100) * RING_C;

  return (
    <div className="relative h-[170px] w-[170px]" style={{ transform: "rotate(-90deg)" }}>
      <svg viewBox="0 0 160 160" aria-hidden>
        <circle
          cx="80"
          cy="80"
          r={RING_R}
          fill="none"
          stroke="var(--enroll-card-border)"
          strokeWidth="12"
        />
        <circle
          cx="80"
          cy="80"
          r={RING_R}
          fill="none"
          stroke={strokeColor}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={RING_C}
          strokeDashoffset={dashOffset}
          style={{ transition: "stroke-dashoffset 0.5s ease-out" }}
        />
      </svg>
      <div
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{ transform: "rotate(90deg)" }}
      >
        <span
          className="text-[40px] font-bold tabular-nums leading-none tracking-[0.33px]"
          style={{ color: centerColor }}
        >
          {displayValue}
        </span>
        <span
          className="mt-1 text-[11px] font-normal"
          style={{ color: "var(--enroll-text-muted)" }}
        >
          {t(`${P}outOf100`, "out of 100")}
        </span>
      </div>
    </div>
  );
}

function formatCurrency(val: number) {
  if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(1)}M`;
  if (val >= 1_000) return `$${Math.round(val / 1_000).toLocaleString()}K`;
  return `$${Math.round(val).toLocaleString()}`;
}

function formatCurrencyDetailed(val: number) {
  return val.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

interface SimpleRecommendation {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  newScore: number;
  additionalSavings: number;
  projectedAfter: number;
}

export function ReadinessStep() {
  const { t } = useTranslation();
  const store = useEnrollmentStore();
  const {
    readinessScore: score,
    projectedBalance,
    contribution,
    monthlyContribution,
    employerMatch,
    retirementAge,
    currentAge,
    retirementProjection,
    autoIncrease,
    riskLevel,
  } = store;

  const yearsToRetirement = Math.max(0, retirementAge - currentAge);
  const retirementIncomeGoalAnnual = retirementProjection.monthlyIncome * 12;
  const currentAnnualContributions = monthlyContribution * 12;
  const annualSavingsGap = Math.max(
    0,
    retirementIncomeGoalAnnual - currentAnnualContributions,
  );

  const alertIsCritical = score < 40;
  const strokeColor = alertIsCritical
    ? "var(--color-error)"
    : score < READINESS_BENCHMARK
      ? "var(--color-warning)"
      : "var(--color-success)";
  const centerColor = alertIsCritical
    ? "var(--color-error)"
    : score < READINESS_BENCHMARK
      ? "var(--enroll-text-primary)"
      : "var(--color-success)";

  const targetBarPct = Math.min(
    100,
    Math.round((score / READINESS_BENCHMARK) * 100),
  );

  const statusMessage = (s: number) => {
    if (s >= 80) return t(`${P}statusGreat`, "You're in great shape!");
    if (s >= 70) return t(`${P}statusSolid`, "Solid foundation");
    if (s >= 40) return t(`${P}statusStarted`, "Good start");
    return t(`${P}statusEveryStep`, "Every step counts");
  };

  const recommendations = useMemo<SimpleRecommendation[]>(() => {
    const recs: SimpleRecommendation[] = [];
    if (contribution < 10) {
      recs.push({
        id: "increase-contribution",
        title: t(`${P}recIncreaseTitle`, "Increase your contribution"),
        description: t(
          `${P}recIncreaseDesc`,
          "Boosting your contribution rate is the most impactful change you can make.",
        ),
        icon: Percent,
        newScore: Math.min(100, score + 12),
        additionalSavings: Math.round(
          (store.salary * 0.02) / 12,
        ),
        projectedAfter: Math.round(projectedBalance * 1.15),
      });
    }
    if (!autoIncrease) {
      recs.push({
        id: "auto-increase",
        title: t(`${P}recAutoTitle`, "Enable auto-increase"),
        description: t(
          `${P}recAutoDesc`,
          "Automatically grow your savings rate each year for compounding benefits.",
        ),
        icon: TrendingUp,
        newScore: Math.min(100, score + 8),
        additionalSavings: Math.round(store.salary * 0.01),
        projectedAfter: Math.round(projectedBalance * 1.2),
      });
    }
    if (riskLevel === "conservative") {
      recs.push({
        id: "strategy-balanced",
        title: t(`${P}recStrategyTitle`, "Consider a balanced strategy"),
        description: t(
          `${P}recStrategyDesc`,
          "A balanced approach may offer better long-term growth potential.",
        ),
        icon: TrendingUp,
        newScore: Math.min(100, score + 5),
        additionalSavings: 0,
        projectedAfter: Math.round(projectedBalance * 1.1),
      });
    }
    return recs;
  }, [
    contribution,
    autoIncrease,
    riskLevel,
    score,
    projectedBalance,
    store.salary,
    t,
  ]);

  const bestNewScore = recommendations.reduce(
    (m, r) => Math.max(m, r.newScore),
    score,
  );
  const boostPoints = Math.max(0, bestNewScore - score);
  const showBoost = recommendations.length > 0 && boostPoints > 0;

  const [selectedRecId, setSelectedRecId] = useState<string | null>(null);
  useEffect(() => {
    if (recommendations.length > 0 && !selectedRecId) {
      setSelectedRecId(recommendations[0].id);
    }
  }, [recommendations, selectedRecId]);

  return (
    <div className="ew-step" style={{ gap: 0 }}>
      {/* Header */}
      <header className="mb-7">
        <h1
          className="text-[26px] font-bold leading-tight tracking-tight"
          style={{ color: "var(--enroll-text-primary)" }}
        >
          {t(`${P}pageTitle`, "Retirement Readiness")}
        </h1>
        <p
          className="mt-1.5 text-[14px]"
          style={{ color: "var(--enroll-text-secondary)" }}
        >
          {t(
            `${P}pageSubtitle`,
            "Here's a snapshot of your retirement outlook based on your current selections.",
          )}
        </p>
      </header>

      {/* Two-column grid */}
      <div className="grid min-w-0 items-start gap-6 lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)]">
        {/* ─── LEFT COLUMN ─── */}
        <div className="flex flex-col gap-5">
          {/* Score card */}
          <div
            className="rounded-2xl border p-6 shadow-sm"
            style={{
              borderColor: "var(--enroll-card-border)",
              background: "var(--enroll-card-bg)",
            }}
          >
            <div className="flex flex-col items-center">
              <AnimatedScoreRing
                value={score}
                strokeColor={strokeColor}
                centerColor={centerColor}
              />

              <p
                className="mt-4 text-[18px] font-bold"
                style={{ color: "var(--enroll-text-primary)" }}
              >
                {statusMessage(score)}
              </p>

              <p
                className="mt-1 text-center text-[13.5px]"
                style={{ color: "var(--enroll-text-secondary)" }}
              >
                Your readiness score is{" "}
                <span
                  className="font-semibold"
                  style={{ color: "var(--enroll-text-primary)" }}
                >
                  {score}
                </span>
              </p>

              {/* Progress bar */}
              <div className="mt-3 flex w-full max-w-[230px] items-center gap-2">
                <div
                  className="h-[7px] min-w-0 flex-1 overflow-hidden rounded-full"
                  style={{ background: "var(--enroll-card-border)" }}
                >
                  <div
                    className="h-full rounded-full transition-[width] duration-500 ease-out"
                    style={{
                      width: `${targetBarPct}%`,
                      background: "var(--color-success)",
                    }}
                  />
                </div>
                <span
                  className="shrink-0 text-[12px]"
                  style={{ color: "var(--enroll-text-muted)" }}
                >
                  Target{" "}
                  <span
                    className="font-semibold"
                    style={{ color: "var(--enroll-text-secondary)" }}
                  >
                    {READINESS_BENCHMARK}
                  </span>
                </span>
              </div>
            </div>

            <div
              className="my-5 border-t"
              style={{ borderColor: "var(--enroll-card-border)" }}
            />

            {/* Projected balance */}
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center gap-1.5">
                <Target
                  className="h-3.5 w-3.5"
                  style={{ color: "var(--enroll-text-muted)" }}
                  aria-hidden
                />
                <span
                  className="text-[10.5px] font-semibold uppercase tracking-widest"
                  style={{ color: "var(--enroll-text-muted)" }}
                >
                  Projected Balance
                </span>
              </div>
              <p
                className="mt-1 text-[34px] font-bold tabular-nums leading-none"
                style={{ color: "var(--enroll-text-primary)" }}
              >
                {formatCurrency(projectedBalance)}
              </p>
              <p
                className="mt-1.5 text-[12px]"
                style={{ color: "var(--enroll-text-muted)" }}
              >
                At age {retirementAge}
              </p>
            </div>
          </div>

          {/* Understanding section */}
          <div>
            <div className="flex items-center gap-2">
              <Info
                className="h-4 w-4 shrink-0"
                style={{ color: "var(--enroll-brand)" }}
                aria-hidden
              />
              <p
                className="text-[15px] font-semibold"
                style={{ color: "var(--enroll-text-primary)" }}
              >
                Understanding Your Score
              </p>
            </div>
            <p
              className="mt-1.5 text-[13px] leading-[1.6]"
              style={{ color: "var(--enroll-text-secondary)" }}
            >
              Your score of {score} reflects your contribution rate, investment
              strategy, and time to retirement. Higher contributions and
              longer timelines improve your outlook.
            </p>
          </div>

          {/* Annual Funding Summary */}
          <div
            className="rounded-xl border px-5 py-4"
            style={{
              borderColor:
                "color-mix(in srgb, var(--enroll-brand) 30%, var(--enroll-card-border))",
              background:
                "color-mix(in srgb, var(--enroll-brand) 6%, var(--enroll-card-bg))",
            }}
          >
            <p
              className="text-[15px] font-bold"
              style={{ color: "var(--enroll-text-primary)" }}
            >
              Annual Funding Summary
            </p>

            <div className="mt-3.5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ background: "var(--enroll-text-muted)" }}
                    aria-hidden
                  />
                  <span
                    className="text-[13.5px]"
                    style={{ color: "var(--enroll-text-secondary)" }}
                  >
                    Retirement Income Goal
                  </span>
                </div>
                <span
                  className="text-[14px] font-semibold tabular-nums"
                  style={{ color: "var(--enroll-text-primary)" }}
                >
                  ${formatCurrencyDetailed(retirementIncomeGoalAnnual)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ background: "var(--enroll-brand)" }}
                    aria-hidden
                  />
                  <span
                    className="text-[13.5px]"
                    style={{ color: "var(--enroll-text-secondary)" }}
                  >
                    Current Annual Contributions
                  </span>
                </div>
                <span
                  className="text-[14px] font-semibold tabular-nums"
                  style={{ color: "var(--enroll-brand)" }}
                >
                  ${Math.round(currentAnnualContributions).toLocaleString()}
                </span>
              </div>

              <div
                className="h-px"
                style={{
                  background:
                    "color-mix(in srgb, var(--enroll-brand) 30%, var(--enroll-card-border))",
                }}
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ background: "var(--color-error)" }}
                    aria-hidden
                  />
                  <span
                    className="text-[13.5px]"
                    style={{ color: "var(--enroll-text-secondary)" }}
                  >
                    Annual Savings Gap
                  </span>
                </div>
                <span
                  className="text-[14px] font-semibold tabular-nums"
                  style={{ color: "var(--color-error)" }}
                >
                  ${formatCurrencyDetailed(annualSavingsGap)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ─── RIGHT COLUMN ─── */}
        <div className="flex flex-col gap-5">
          {/* Boost banner */}
          {showBoost && (
            <div
              className="rounded-xl border px-5 py-4"
              style={{
                borderColor:
                  "color-mix(in srgb, var(--enroll-brand) 25%, var(--enroll-card-border))",
                background:
                  "color-mix(in srgb, var(--enroll-brand) 6%, var(--enroll-card-bg))",
              }}
            >
              <div className="flex items-center gap-2">
                <Sparkles
                  className="h-4 w-4 shrink-0"
                  style={{ color: "var(--enroll-brand)" }}
                  aria-hidden
                />
                <span
                  className="text-[14px] font-semibold"
                  style={{ color: "var(--enroll-brand)" }}
                >
                  Boost your score to {bestNewScore}
                </span>
              </div>
              <p
                className="mt-2 text-[13.5px] leading-[1.6]"
                style={{ color: "var(--enroll-text-secondary)" }}
              >
                Apply one or more recommendations below to improve your
                readiness by up to {boostPoints} points.
              </p>
            </div>
          )}

          {/* Recommendations heading */}
          <div>
            <p
              className="text-[17px] font-bold"
              style={{ color: "var(--enroll-text-primary)" }}
            >
              Recommended Actions
            </p>
            <p
              className="mt-0.5 text-[13px]"
              style={{ color: "var(--enroll-text-secondary)" }}
            >
              Personalized suggestions to improve your retirement outlook.
            </p>
          </div>

          {/* Recommendation cards */}
          <div className="flex flex-col gap-3">
            {recommendations.map((rec, index) => {
              const isFeatured = index === 0;
              const isSelected = rec.id === selectedRecId;
              const Icon = rec.icon;

              return (
                <div
                  key={rec.id}
                  className={`relative cursor-pointer rounded-xl border px-5 py-5 transition-all ${isFeatured ? "mt-3" : ""}`}
                  style={{
                    borderColor: isSelected
                      ? "var(--enroll-brand)"
                      : "var(--enroll-card-border)",
                    background: "var(--enroll-card-bg)",
                    boxShadow: isSelected
                      ? "0 0 0 1.5px var(--enroll-brand)"
                      : "none",
                  }}
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
                  {isFeatured && (
                    <div
                      className="absolute -top-3 left-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 shadow-sm"
                      style={{
                        background: "var(--enroll-brand)",
                        color: "var(--color-text-on-primary)",
                      }}
                    >
                      <Sparkles className="h-2.5 w-2.5" aria-hidden />
                      <span className="text-[10px] font-bold uppercase tracking-[0.6px]">
                        Recommended
                      </span>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                      style={{
                        background:
                          "color-mix(in srgb, var(--enroll-brand) 10%, var(--enroll-card-bg))",
                      }}
                    >
                      <Icon
                        className="h-[18px] w-[18px]"
                        style={{ color: "var(--enroll-brand)" }}
                        aria-hidden
                        strokeWidth={2}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className="text-[15px] font-semibold leading-snug"
                        style={{ color: "var(--enroll-text-primary)" }}
                      >
                        {rec.title}
                      </p>
                      <p
                        className="mt-0.5 text-[13px] leading-[1.5]"
                        style={{ color: "var(--enroll-text-secondary)" }}
                      >
                        {rec.description}
                      </p>
                    </div>
                  </div>

                  {/* Metrics row */}
                  <div
                    className="mt-4 grid grid-cols-3 border-t pt-3"
                    style={{ borderColor: "var(--enroll-card-border)" }}
                  >
                    <div>
                      <p
                        className="text-[10px] font-semibold uppercase tracking-[0.06em]"
                        style={{ color: "var(--enroll-text-muted)" }}
                      >
                        Score
                      </p>
                      <div className="mt-1 flex items-center gap-1">
                        <span
                          className="text-[13px] font-medium tabular-nums"
                          style={{ color: "var(--enroll-text-muted)" }}
                        >
                          {score}
                        </span>
                        <ArrowRight
                          className="h-3 w-3 shrink-0"
                          style={{ color: "var(--enroll-text-muted)" }}
                          aria-hidden
                        />
                        <span
                          className="text-[13px] font-bold tabular-nums"
                          style={{ color: "var(--color-success)" }}
                        >
                          {rec.newScore}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p
                        className="text-[10px] font-semibold uppercase tracking-[0.06em]"
                        style={{ color: "var(--enroll-text-muted)" }}
                      >
                        Savings
                      </p>
                      <p
                        className="mt-1 text-[13px] font-bold tabular-nums"
                        style={{ color: "var(--enroll-brand)" }}
                      >
                        +${rec.additionalSavings.toLocaleString()}/yr
                      </p>
                    </div>
                    <div>
                      <p
                        className="text-[10px] font-semibold uppercase tracking-[0.06em]"
                        style={{ color: "var(--enroll-text-muted)" }}
                      >
                        Balance
                      </p>
                      <p
                        className="mt-1 text-[13px] font-bold tabular-nums"
                        style={{ color: "var(--enroll-text-primary)" }}
                      >
                        {formatCurrency(rec.projectedAfter)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            {recommendations.length === 0 && (
              <div
                className="rounded-xl border p-4"
                style={{
                  borderColor: "var(--enroll-card-border)",
                  background: "var(--enroll-card-bg)",
                }}
              >
                <p
                  className="text-[13px]"
                  style={{ color: "var(--enroll-text-secondary)" }}
                >
                  Your plan looks great! No additional recommendations at this
                  time.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
