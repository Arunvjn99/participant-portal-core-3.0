import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  DollarSign,
  Info,
  Percent,
  RefreshCw,
  Shield,
  Sparkles,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { motionTokens } from "@/features/crp-pre-enrollment/motion";
import { cn } from "@/lib/utils";
import type { RiskLevel } from "../types";
import { useEnrollmentStore } from "../store/useEnrollmentStore";
import {
  computeReadinessScore,
  computeProjectedBalancePure,
  getGrowthRate,
  projectBalanceWithAutoIncrease,
} from "../utils/calculations";

const PW = "enrollment.v1.readinessWizard.";
const ease = motionTokens.ease;
const RING_RADIUS = 52;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;
const BENCHMARK_SCORE = 65;
const EMPLOYER_MATCH_LIMIT = 6;

function ringColorForScore(score: number): string {
  if (score >= 80) return "var(--color-success)";
  if (score >= 60) return "var(--enroll-brand)";
  if (score >= 40) return "var(--color-warning)";
  return "var(--color-error)";
}

function ringLabelKey(score: number): string {
  if (score >= 80) return `${PW}ringLabelExcellent`;
  if (score >= 60) return `${PW}ringLabelOnTrack`;
  if (score >= 40) return `${PW}ringLabelNeedsAttention`;
  return `${PW}ringLabelAtRisk`;
}

function statusMessageKey(score: number): string {
  if (score >= 80) return `${PW}statusGreatProgress`;
  if (score >= 70) return `${PW}statusSolidFoundation`;
  if (score >= 40) return `${PW}statusStarted`;
  return `${PW}statusEveryStep`;
}

function AnimatedNumber({ value }: { value: number }) {
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { stiffness: 60, damping: 20 });
  const rounded = useTransform(spring, Math.round);

  useEffect(() => {
    motionVal.set(value);
  }, [value, motionVal]);

  return <motion.span>{rounded}</motion.span>;
}

function ScoreRing({ score }: { score: number }) {
  const { t } = useTranslation();
  const motionScore = useMotionValue(0);
  const spring = useSpring(motionScore, { stiffness: 60, damping: 20 });
  const dashOffset = useTransform(spring, [0, 100], [RING_CIRCUMFERENCE, 0]);

  useEffect(() => {
    motionScore.set(score);
  }, [score, motionScore]);

  const color = ringColorForScore(score);

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: 140, height: 140 }}>
        <svg
          width={140}
          height={140}
          viewBox="0 0 120 120"
          className="rotate-[-90deg]"
          aria-hidden
        >
          <circle
            cx={60}
            cy={60}
            r={RING_RADIUS}
            fill="none"
            stroke="var(--enroll-card-border)"
            strokeWidth={10}
          />
          <motion.circle
            cx={60}
            cy={60}
            r={RING_RADIUS}
            fill="none"
            stroke={color}
            strokeWidth={10}
            strokeLinecap="round"
            strokeDasharray={RING_CIRCUMFERENCE}
            style={{ strokeDashoffset: dashOffset }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            style={{
              fontSize: 32,
              fontWeight: 700,
              color,
              lineHeight: 1,
            }}
          >
            <AnimatedNumber value={score} />
          </motion.span>
          <span
            className="mt-0.5 text-xs font-medium"
            style={{ color: "var(--enroll-text-muted)" }}
          >
            {t(`${PW}scoreOutOf100`)}
          </span>
        </div>
      </div>
      <motion.span
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-2 text-sm font-semibold"
        style={{ color }}
      >
        {t(ringLabelKey(score))}
      </motion.span>
    </div>
  );
}

type Recommendation = {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  impact: "High" | "Medium";
  currentScore: number;
  newScore: number;
  currentBalance: number;
  newBalance: number;
  monthlyImpact: number;
  additionalAnnualSavings: number;
  whyBullets: string[];
  apply: () => void;
};

function computeBalanceForScenario(
  salary: number,
  savings: number,
  contribPct: number,
  years: number,
  riskLevel: RiskLevel | null,
  autoIncEnabled: boolean,
  autoIncRate: number,
  autoIncMax: number,
): number {
  const rate = getGrowthRate(riskLevel);
  if (autoIncEnabled) {
    return projectBalanceWithAutoIncrease(
      salary,
      savings,
      contribPct,
      years,
      rate,
      autoIncRate,
      autoIncMax,
    );
  }
  return computeProjectedBalancePure(
    salary,
    savings,
    contribPct,
    years,
    rate,
  );
}

/**
 * Readiness step — ported from core-retirement-platform `ReadinessClient`,
 * using enrollment tokens for light/dark and real salary/savings from the V1 store.
 */
export function ReadinessStep() {
  const { t, i18n } = useTranslation();
  const data = useEnrollmentStore();
  const updateField = useEnrollmentStore((s) => s.updateField);

  const {
    contribution: contributionPct,
    salary,
    currentSavings: savings,
    retirementAge,
    currentAge,
    autoIncrease: autoIncreaseEnabled,
    autoIncreaseRate,
    autoIncreaseMax,
    riskLevel,
  } = data;

  const [appliedIds, setAppliedIds] = useState<Set<string>>(() => new Set());

  const years = Math.max(1, retirementAge - currentAge);
  const growthRate = getGrowthRate(riskLevel);

  const fmtMoney = useCallback(
    (n: number) =>
      new Intl.NumberFormat(i18n.language, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(Math.round(n)),
    [i18n.language],
  );

  const projectedBalanceRaw = useMemo(
    () =>
      computeBalanceForScenario(
        salary,
        savings,
        contributionPct,
        years,
        riskLevel,
        autoIncreaseEnabled,
        autoIncreaseRate,
        autoIncreaseMax,
      ),
    [
      salary,
      savings,
      contributionPct,
      years,
      riskLevel,
      autoIncreaseEnabled,
      autoIncreaseRate,
      autoIncreaseMax,
    ],
  );

  const score = computeReadinessScore(
    contributionPct,
    years,
    projectedBalanceRaw,
  );
  const projectedBalanceRounded = Math.round(projectedBalanceRaw);

  const annualEmployee = salary * (contributionPct / 100);
  const annualMatch =
    salary * (Math.min(contributionPct, EMPLOYER_MATCH_LIMIT) / 100);
  const totalAnnualContributions = annualEmployee + annualMatch;

  const targetIncome = salary * 0.8;
  const annualSavingsGap = Math.max(0, targetIncome - totalAnnualContributions);

  const benchmarkProgress = Math.min(
    100,
    Math.round((score / BENCHMARK_SCORE) * 100),
  );

  const recommendations = useMemo(() => {
    const recs: Recommendation[] = [];

    if (contributionPct < 10) {
      const newPct = 10;
      const newBal = computeBalanceForScenario(
        salary,
        savings,
        newPct,
        years,
        riskLevel,
        autoIncreaseEnabled,
        autoIncreaseRate,
        autoIncreaseMax,
      );
      const extraAnnual = salary * ((newPct - contributionPct) / 100);
      const extraMatch =
        salary *
        (Math.max(
          0,
          Math.min(newPct, EMPLOYER_MATCH_LIMIT) -
            Math.min(contributionPct, EMPLOYER_MATCH_LIMIT),
        ) /
          100);
      recs.push({
        id: "increase-contribution",
        icon: Percent,
        title: t(`${PW}recIncreaseTitle`, { pct: newPct }),
        description: t(`${PW}recIncreaseDesc`),
        impact: "High",
        currentScore: score,
        newScore: computeReadinessScore(newPct, years, newBal),
        currentBalance: projectedBalanceRaw,
        newBalance: newBal,
        monthlyImpact: Math.round((extraAnnual + extraMatch) / 12),
        additionalAnnualSavings: Math.round(extraAnnual + extraMatch),
        whyBullets: [
          t(`${PW}recIncreaseWhy1`),
          t(`${PW}recIncreaseWhy2`),
          t(`${PW}recIncreaseWhy3`),
        ],
        apply: () => updateField("contribution", newPct),
      });
    }

    if (!autoIncreaseEnabled) {
      const cap = Math.min(15, Math.max(10, autoIncreaseMax));
      const newBal = projectBalanceWithAutoIncrease(
        salary,
        savings,
        contributionPct,
        years,
        growthRate,
        1,
        cap,
      );
      const newSc = computeReadinessScore(contributionPct, years, newBal);
      const firstYearExtra = Math.round((salary * 1) / 100);
      recs.push({
        id: "enable-auto-increase",
        icon: RefreshCw,
        title: t(`${PW}recAutoTitle`),
        description: t(`${PW}recAutoDesc`, { rate: 1, max: cap }),
        impact: contributionPct < 8 ? "High" : "Medium",
        currentScore: score,
        newScore: newSc,
        currentBalance: projectedBalanceRaw,
        newBalance: newBal,
        monthlyImpact: Math.round(firstYearExtra / 12),
        additionalAnnualSavings: firstYearExtra,
        whyBullets: [
          t(`${PW}recAutoWhy1`),
          t(`${PW}recAutoWhy2`),
          t(`${PW}recAutoWhy3`),
        ],
        apply: () => {
          updateField("autoIncrease", true);
          updateField("autoIncreaseRate", 1);
          updateField("autoIncreaseMax", cap);
        },
      });
    }

    if (riskLevel === "conservative" && currentAge < 50) {
      const newRisk: RiskLevel = "balanced";
      const newRate = getGrowthRate(newRisk);
      const newBal = autoIncreaseEnabled
        ? projectBalanceWithAutoIncrease(
            salary,
            savings,
            contributionPct,
            years,
            newRate,
            autoIncreaseRate,
            autoIncreaseMax,
          )
        : computeProjectedBalancePure(
            salary,
            savings,
            contributionPct,
            years,
            newRate,
          );
      const newSc = computeReadinessScore(contributionPct, years, newBal);
      recs.push({
        id: "balanced-strategy",
        icon: Shield,
        title: t(`${PW}recBalancedTitle`),
        description: t(`${PW}recBalancedDesc`),
        impact: "Medium",
        currentScore: score,
        newScore: newSc,
        currentBalance: projectedBalanceRaw,
        newBalance: newBal,
        monthlyImpact: 0,
        additionalAnnualSavings: 0,
        whyBullets: [
          t(`${PW}recBalancedWhy1`),
          t(`${PW}recBalancedWhy2`),
          t(`${PW}recBalancedWhy3`),
        ],
        apply: () => updateField("riskLevel", newRisk),
      });
    }

    return recs.sort(
      (a, b) =>
        b.newScore - b.currentScore - (a.newScore - a.currentScore),
    );
  }, [
    contributionPct,
    autoIncreaseEnabled,
    autoIncreaseRate,
    autoIncreaseMax,
    riskLevel,
    currentAge,
    savings,
    salary,
    years,
    growthRate,
    score,
    projectedBalanceRaw,
    updateField,
    t,
  ]);

  const bestNewScore =
    recommendations.length > 0
      ? Math.max(...recommendations.map((r) => r.newScore))
      : score;

  const combinedGain = useMemo(() => {
    if (recommendations.length === 0) return 0;
    return recommendations.reduce(
      (sum, r) => sum + (r.newBalance - r.currentBalance),
      0,
    );
  }, [recommendations]);

  const combinedNewScore = useMemo(() => {
    if (recommendations.length === 0) return score;
    return Math.min(
      100,
      bestNewScore + Math.floor(recommendations.length * 2),
    );
  }, [recommendations, bestNewScore, score]);

  function handleApply(rec: Recommendation) {
    rec.apply();
    setAppliedIds((prev) => new Set(prev).add(rec.id));
  }

  function handleApplyAll() {
    recommendations.forEach((rec) => {
      if (!appliedIds.has(rec.id)) {
        rec.apply();
        setAppliedIds((prev) => new Set(prev).add(rec.id));
      }
    });
  }

  const cardStyle = {
    background: "var(--enroll-card-bg)",
    borderColor: "var(--enroll-card-border)",
  } as const;

  const successTint =
    "color-mix(in srgb, var(--color-success) 10%, var(--enroll-card-bg))";
  const successBorder =
    "color-mix(in srgb, var(--color-success) 40%, var(--enroll-card-border))";
  const primarySoft =
    "color-mix(in srgb, var(--enroll-brand) 10%, var(--enroll-card-bg))";

  return (
    <div className="ew-step min-w-0 w-full" style={{ gap: 0 }}>
      <div className="mx-auto w-full max-w-[1100px] pb-1">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease }}
          className="mb-5 shrink-0 text-left"
        >
          <h1
            className="text-xl font-semibold md:text-2xl"
            style={{ color: "var(--enroll-text-primary)" }}
          >
            {t(`${PW}pageTitle`)}
          </h1>
          <p
            className="mt-1 text-sm"
            style={{ color: "var(--enroll-text-secondary)" }}
          >
            {t(`${PW}pageSubtitle`)}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease, delay: 0.06 }}
          className="grid grid-cols-1 gap-5 lg:grid-cols-[340px_1fr]"
        >
          {/* LEFT */}
          <div className="flex flex-col gap-5">
            <div
              className="rounded-2xl border p-6 shadow-sm"
              style={{ ...cardStyle, border: "1px solid var(--enroll-card-border)", boxShadow: "var(--enroll-elevation-1)" }}
            >
              <div
                className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wider"
                style={{ color: "var(--enroll-text-muted)" }}
              >
                <Award className="size-3.5" aria-hidden />
                {t(`${PW}scoreCardEyebrow`)}
              </div>
              <ScoreRing score={score} />
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-3 text-center text-sm font-medium"
                style={{ color: "var(--enroll-text-primary)" }}
              >
                {t(statusMessageKey(score))}
              </motion.p>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span style={{ color: "var(--enroll-text-secondary)" }}>
                    {t(`${PW}onTrackLabel`)}
                  </span>
                  <span
                    className="font-semibold"
                    style={{ color: "var(--enroll-text-primary)" }}
                  >
                    {score}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span style={{ color: "var(--enroll-text-secondary)" }}>
                    {t(`${PW}targetBenchmark`, { benchmark: BENCHMARK_SCORE })}
                  </span>
                </div>
                <div
                  className="relative h-2 overflow-hidden rounded-full"
                  style={{ background: "var(--enroll-card-border)" }}
                >
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{ background: "var(--enroll-brand)" }}
                    initial={{ width: 0 }}
                    animate={{ width: `${benchmarkProgress}%` }}
                    transition={{ duration: 0.8, ease }}
                  />
                </div>
              </div>
            </div>

            <div
              className="rounded-2xl border p-5 shadow-sm"
              style={{ ...cardStyle, border: "1px solid var(--enroll-card-border)", boxShadow: "var(--enroll-elevation-1)" }}
            >
              <div className="mb-2 flex items-center gap-2">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-lg"
                  style={{ background: successTint }}
                >
                  <DollarSign
                    className="size-4"
                    style={{ color: "var(--color-success)" }}
                    aria-hidden
                  />
                </div>
                <span
                  className="text-sm font-medium"
                  style={{ color: "var(--enroll-text-secondary)" }}
                >
                  {t(`${PW}projectedBalanceTitle`)}
                </span>
              </div>
              <p
                className="text-3xl font-bold"
                style={{ color: "var(--enroll-text-primary)" }}
              >
                {fmtMoney(projectedBalanceRounded)}
              </p>
              <p
                className="mt-1 text-xs"
                style={{ color: "var(--enroll-text-secondary)" }}
              >
                {t(`${PW}basedOnYears`, { years })}
              </p>
            </div>

            <div
              className="rounded-2xl border p-5 shadow-sm"
              style={{ ...cardStyle, border: "1px solid var(--enroll-card-border)", boxShadow: "var(--enroll-elevation-1)" }}
            >
              <div className="mb-2 flex items-center gap-2">
                <Info
                  className="size-4"
                  style={{ color: "var(--enroll-brand)" }}
                  aria-hidden
                />
                <span
                  className="text-sm font-semibold"
                  style={{ color: "var(--enroll-text-primary)" }}
                >
                  {t(`${PW}understandingTitle`)}
                </span>
              </div>
              <p
                className="text-xs leading-relaxed"
                style={{ color: "var(--enroll-text-secondary)" }}
              >
                {t(`${PW}understandingBody`, { benchmark: BENCHMARK_SCORE })}
              </p>
            </div>

            <div
              className="overflow-hidden rounded-2xl p-5 shadow-sm"
              style={{
                background: "var(--enroll-brand)",
                color: "var(--color-text-on-primary)",
                boxShadow: "var(--enroll-elevation-1)",
              }}
            >
              <h3 className="mb-4 text-sm font-semibold tracking-wide">
                {t(`${PW}fundingTitle`)}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-full opacity-40"
                      style={{ background: "currentColor" }}
                    />
                    <span className="text-sm opacity-80">
                      {t(`${PW}fundingGoal`)}
                    </span>
                  </div>
                  <span className="text-sm font-semibold">
                    {fmtMoney(targetIncome)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-full opacity-70"
                      style={{ background: "currentColor" }}
                    />
                    <span className="text-sm opacity-80">
                      {t(`${PW}fundingCurrent`)}
                    </span>
                  </div>
                  <span className="text-sm font-semibold">
                    {fmtMoney(totalAnnualContributions)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-full"
                      style={{
                        background: "color-mix(in srgb, var(--color-error) 70%, transparent)",
                      }}
                    />
                    <span className="text-sm opacity-80">
                      {t(`${PW}fundingGap`)}
                    </span>
                  </div>
                  <span className="text-sm font-semibold">
                    {fmtMoney(annualSavingsGap)}
                  </span>
                </div>
              </div>
              <p className="mt-4 text-[11px] leading-relaxed opacity-70">
                {t(`${PW}fundingFooter`)}
              </p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex flex-col gap-5">
            {recommendations.length > 0 ? (
              <>
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles
                      className="size-5"
                      style={{ color: "var(--enroll-brand)" }}
                      aria-hidden
                    />
                    <h2
                      className="text-lg font-semibold"
                      style={{ color: "var(--enroll-text-primary)" }}
                    >
                      {t(`${PW}improveTitle`)}
                    </h2>
                  </div>
                  <p
                    className="mt-1 text-sm"
                    style={{ color: "var(--enroll-text-secondary)" }}
                  >
                    {t(`${PW}improveSubtitle`)}
                  </p>
                </div>

                {recommendations.map((rec, i) => {
                  const Icon = rec.icon;
                  const isApplied = appliedIds.has(rec.id);
                  const isPrimary = i === 0;
                  const gain = rec.newBalance - rec.currentBalance;
                  const scoreDelta = rec.newScore - rec.currentScore;
                  const scoreProgress = Math.round(
                    (scoreDelta / Math.max(1, 100 - rec.currentScore)) * 100,
                  );

                  return (
                    <motion.div
                      key={rec.id}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.35,
                        ease,
                        delay: 0.1 + i * 0.08,
                      }}
                      whileHover={{ y: -2, transition: { duration: 0.15 } }}
                      className="group relative overflow-hidden rounded-2xl border shadow-sm transition-shadow hover:shadow-lg"
                      style={{
                        ...cardStyle,
                        border: isApplied
                          ? `1px solid ${successBorder}`
                          : "1px solid var(--enroll-card-border)",
                        background: isApplied ? successTint : "var(--enroll-card-bg)",
                        boxShadow: "var(--enroll-elevation-1)",
                      }}
                    >
                      {isPrimary && !isApplied && (
                        <div
                          className="absolute inset-x-0 top-0 h-1"
                          style={{ background: "var(--enroll-brand)" }}
                        />
                      )}

                      <div className={cn("p-5", isPrimary && !isApplied && "pt-6")}>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex min-w-0 items-start gap-3">
                            <div
                              className="flex size-10 shrink-0 items-center justify-center rounded-xl"
                              style={{
                                background: isApplied
                                  ? successTint
                                  : isPrimary
                                    ? primarySoft
                                    : "color-mix(in srgb, var(--enroll-text-secondary) 12%, var(--enroll-card-bg))",
                              }}
                            >
                              {isApplied ? (
                                <CheckCircle2
                                  className="size-5"
                                  style={{ color: "var(--color-success)" }}
                                  aria-hidden
                                />
                              ) : (
                                <Icon
                                  className="size-5"
                                  style={{
                                    color: isPrimary
                                      ? "var(--enroll-brand)"
                                      : "var(--enroll-text-secondary)",
                                  }}
                                  aria-hidden
                                />
                              )}
                            </div>
                            <div className="min-w-0">
                              <h4
                                className="text-[0.95rem] font-semibold"
                                style={{ color: "var(--enroll-text-primary)" }}
                              >
                                {rec.title}
                              </h4>
                              <p
                                className="mt-0.5 text-xs"
                                style={{ color: "var(--enroll-text-secondary)" }}
                              >
                                {rec.description}
                              </p>
                            </div>
                          </div>
                          <span
                            className="shrink-0 rounded-full px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider"
                            style={
                              rec.impact === "High"
                                ? {
                                    background: successTint,
                                    color: "var(--color-success)",
                                  }
                                : {
                                    background: primarySoft,
                                    color: "var(--enroll-brand)",
                                  }
                            }
                          >
                            {rec.impact === "High"
                              ? t(`${PW}impactHigh`)
                              : t(`${PW}impactMedium`)}{" "}
                            {t(`${PW}impactSuffix`)}
                          </span>
                        </div>

                        <div
                          className="mt-4 rounded-xl p-4"
                          style={{
                            background: isApplied
                              ? successTint
                              : "color-mix(in srgb, var(--enroll-text-secondary) 6%, var(--enroll-card-bg))",
                          }}
                        >
                          <div className="flex items-end justify-center gap-3">
                            <div className="text-center">
                              <p
                                className="text-[0.65rem] font-medium uppercase tracking-wider"
                                style={{ color: "var(--enroll-text-muted)" }}
                              >
                                {t(`${PW}compareCurrent`)}
                              </p>
                              <p
                                className="mt-0.5 text-xl font-bold tabular-nums"
                                style={{ color: "var(--enroll-text-primary)" }}
                              >
                                {fmtMoney(Math.round(rec.currentBalance))}
                              </p>
                            </div>
                            <div className="mb-1 flex items-center gap-1">
                              <ArrowRight
                                className="size-5"
                                style={{ color: "var(--color-success)" }}
                                aria-hidden
                              />
                            </div>
                            <div className="text-center">
                              <p
                                className="text-[0.65rem] font-medium uppercase tracking-wider"
                                style={{ color: "var(--color-success)" }}
                              >
                                {t(`${PW}compareImproved`)}
                              </p>
                              <p
                                className="mt-0.5 text-xl font-bold tabular-nums"
                                style={{ color: "var(--color-success)" }}
                              >
                                {fmtMoney(Math.round(rec.newBalance))}
                              </p>
                            </div>
                          </div>
                          {gain > 0 && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.3 + i * 0.1 }}
                              className="mt-2 flex justify-center"
                            >
                              <span
                                className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-bold"
                                style={{
                                  background: successTint,
                                  color: "var(--color-success)",
                                }}
                              >
                                <TrendingUp className="size-3.5" aria-hidden />
                                {t(`${PW}gainBadge`, {
                                  amount: fmtMoney(Math.round(gain)),
                                })}
                              </span>
                            </motion.div>
                          )}
                        </div>

                        <div className="mt-3 grid grid-cols-3 gap-3">
                          {rec.monthlyImpact > 0 && (
                            <div
                              className="rounded-lg border p-2.5 text-center"
                              style={{
                                borderColor: "var(--enroll-card-border)",
                                background: "var(--enroll-card-bg)",
                              }}
                            >
                              <p
                                className="text-[0.6rem] font-medium uppercase tracking-wider"
                                style={{ color: "var(--enroll-text-muted)" }}
                              >
                                {t(`${PW}metricMonthly`)}
                              </p>
                              <p
                                className="mt-0.5 text-sm font-bold tabular-nums"
                                style={{ color: "var(--enroll-text-primary)" }}
                              >
                                +{fmtMoney(rec.monthlyImpact)}
                              </p>
                            </div>
                          )}
                          {rec.additionalAnnualSavings > 0 && (
                            <div
                              className="rounded-lg border p-2.5 text-center"
                              style={{
                                borderColor: "var(--enroll-card-border)",
                                background: "var(--enroll-card-bg)",
                              }}
                            >
                              <p
                                className="text-[0.6rem] font-medium uppercase tracking-wider"
                                style={{ color: "var(--enroll-text-muted)" }}
                              >
                                {t(`${PW}metricPerYear`)}
                              </p>
                              <p
                                className="mt-0.5 text-sm font-bold tabular-nums"
                                style={{ color: "var(--enroll-text-primary)" }}
                              >
                                +{fmtMoney(rec.additionalAnnualSavings)}
                              </p>
                            </div>
                          )}
                          <div
                            className="rounded-lg border p-2.5 text-center"
                            style={{
                              borderColor: "var(--enroll-card-border)",
                              background: "var(--enroll-card-bg)",
                            }}
                          >
                            <p
                              className="text-[0.6rem] font-medium uppercase tracking-wider"
                              style={{ color: "var(--enroll-text-muted)" }}
                            >
                              {t(`${PW}metricScore`)}
                            </p>
                            <div className="mt-0.5 flex items-center justify-center gap-1">
                              <span
                                className="text-sm font-bold tabular-nums"
                                style={{ color: "var(--enroll-text-primary)" }}
                              >
                                {rec.currentScore}
                              </span>
                              <ArrowRight
                                className="size-3"
                                style={{ color: "var(--color-success)" }}
                              />
                              <span
                                className="text-sm font-bold tabular-nums"
                                style={{ color: "var(--color-success)" }}
                              >
                                {rec.newScore}
                              </span>
                            </div>
                          </div>
                        </div>

                        {scoreDelta > 0 && (
                          <div className="mt-3">
                            <div className="flex items-center justify-between text-[0.68rem]">
                              <span style={{ color: "var(--enroll-text-secondary)" }}>
                                {t(`${PW}scoreImprovement`)}
                              </span>
                              <span
                                className="font-semibold"
                                style={{ color: "var(--color-success)" }}
                              >
                                {t(`${PW}scoreDeltaPts`, { delta: scoreDelta })}
                              </span>
                            </div>
                            <div
                              className="mt-1 h-1.5 overflow-hidden rounded-full"
                              style={{ background: "var(--enroll-card-border)" }}
                            >
                              <motion.div
                                className="h-full rounded-full"
                                style={{
                                  background: `linear-gradient(to right, var(--color-success), color-mix(in srgb, var(--color-success) 70%, var(--enroll-brand)))`,
                                }}
                                initial={{ width: 0 }}
                                animate={{
                                  width: `${Math.min(100, scoreProgress)}%`,
                                }}
                                transition={{
                                  duration: 0.8,
                                  ease,
                                  delay: 0.4 + i * 0.1,
                                }}
                              />
                            </div>
                          </div>
                        )}

                        <div className="mt-3 space-y-1.5">
                          <p
                            className="text-[0.68rem] font-semibold uppercase tracking-wider"
                            style={{ color: "var(--enroll-text-muted)" }}
                          >
                            {t(`${PW}whyHeading`)}
                          </p>
                          {rec.whyBullets.map((bullet) => (
                            <div key={bullet} className="flex items-start gap-2">
                              <CheckCircle2
                                className="mt-0.5 size-3 shrink-0"
                                style={{ color: "var(--color-success)" }}
                                aria-hidden
                              />
                              <span
                                className="text-xs"
                                style={{ color: "var(--enroll-text-secondary)" }}
                              >
                                {bullet}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="mt-4">
                          {isApplied ? (
                            <div
                              className="flex items-center justify-center gap-2 rounded-xl py-2.5"
                              style={{ background: successTint }}
                            >
                              <CheckCircle2
                                className="size-4"
                                style={{ color: "var(--color-success)" }}
                                aria-hidden
                              />
                              <span
                                className="text-sm font-semibold"
                                style={{ color: "var(--color-success)" }}
                              >
                                {t(`${PW}appliedLabel`)}
                              </span>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleApply(rec)}
                              className={cn(
                                "flex w-full items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition hover:opacity-90",
                              )}
                              style={
                                isPrimary
                                  ? {
                                      background: "var(--enroll-brand)",
                                      color: "var(--color-text-on-primary)",
                                      boxShadow: "var(--enroll-elevation-2)",
                                    }
                                  : {
                                      border: `2px solid color-mix(in srgb, var(--enroll-brand) 35%, var(--enroll-card-border))`,
                                      background: "var(--enroll-card-bg)",
                                      color: "var(--enroll-brand)",
                                    }
                              }
                            >
                              <TrendingUp className="size-4" aria-hidden />
                              {isPrimary
                                ? t(`${PW}ctaBoost`)
                                : t(`${PW}ctaApply`)}
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}

                {recommendations.length > 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.35,
                      ease,
                      delay: 0.3 + recommendations.length * 0.08,
                    }}
                    className="overflow-hidden rounded-2xl p-5 text-white shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, color-mix(in srgb, var(--color-success) 88%, black) 0%, color-mix(in srgb, var(--enroll-brand) 55%, var(--color-success)) 100%)`,
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles
                        className="size-4"
                        style={{ color: "color-mix(in srgb, white 85%, transparent)" }}
                        aria-hidden
                      />
                      <h3 className="text-sm font-semibold tracking-wide opacity-90">
                        {t(`${PW}combinedTitle`)}
                      </h3>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[0.65rem] font-medium uppercase tracking-wider opacity-80">
                          {t(`${PW}combinedGain`)}
                        </p>
                        <p className="mt-1 text-2xl font-bold tabular-nums">
                          +{fmtMoney(Math.round(combinedGain))}
                        </p>
                      </div>
                      <div>
                        <p className="text-[0.65rem] font-medium uppercase tracking-wider opacity-80">
                          {t(`${PW}combinedScore`)}
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-2xl font-bold tabular-nums">
                            {score}
                          </span>
                          <ArrowRight
                            className="size-5 opacity-80"
                            aria-hidden
                          />
                          <span className="text-2xl font-bold tabular-nums">
                            {combinedNewScore}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-black/20">
                      <motion.div
                        className="h-full rounded-full bg-white/80"
                        initial={{ width: 0 }}
                        animate={{
                          width: `${Math.min(100, Math.round((combinedNewScore / 100) * 100))}%`,
                        }}
                        transition={{ duration: 1, ease, delay: 0.6 }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleApplyAll}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-white/15 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/25"
                    >
                      <Sparkles className="size-4" aria-hidden />
                      {t(`${PW}applyAllCta`)}
                    </button>
                  </motion.div>
                )}

                <p
                  className="text-center text-sm font-medium"
                  style={{ color: "var(--enroll-text-secondary)" }}
                >
                  {t(`${PW}continueHint`)}
                </p>
              </>
            ) : (
              <div
                className="flex flex-1 flex-col items-center justify-center rounded-2xl border p-10 text-center shadow-sm"
                style={{
                  borderColor: successBorder,
                  background: successTint,
                  boxShadow: "var(--enroll-elevation-1)",
                }}
              >
                <div
                  className="mb-3 flex size-14 items-center justify-center rounded-full"
                  style={{ background: successTint }}
                >
                  <CheckCircle2
                    className="size-7"
                    style={{ color: "var(--color-success)" }}
                    aria-hidden
                  />
                </div>
                <h3
                  className="text-lg font-semibold"
                  style={{ color: "var(--enroll-text-primary)" }}
                >
                  {t(`${PW}optimizedTitle`)}
                </h3>
                <p
                  className="mt-1 max-w-xs text-sm"
                  style={{ color: "var(--enroll-text-secondary)" }}
                >
                  {t(`${PW}optimizedBody`)}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
