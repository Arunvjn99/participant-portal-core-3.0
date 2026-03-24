import { useMemo, useState, useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { useEnrollment } from "@/enrollment/context/EnrollmentContext";
import { EnrollmentPageContent } from "@/components/enrollment/EnrollmentPageContent";
import { EnrollmentFooter } from "@/components/enrollment/EnrollmentFooter";
import Button from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { loadEnrollmentDraft, saveEnrollmentDraft } from "@/enrollment/enrollmentDraftStore";
import {
  PAYCHECKS_PER_YEAR,
  percentageToAnnualAmount,
  annualAmountToPercentage,
  deriveContribution,
} from "@/enrollment/logic/contributionCalculator";
import { calculateProjection } from "@/enrollment/logic/projectionCalculator";
import type { ProjectionDataPoint } from "@/enrollment/logic/types";
import { formatYAxisLabel, getYAxisTicks } from "@/utils/projectionChartAxis";
import type { IncrementCycle } from "@/enrollment/logic/types";
import { FinancialSlider } from "@/components/FinancialSlider";

/* ── Shared card style ── */
const cardStyle: React.CSSProperties = {
  background: "var(--enroll-card-bg)",
  border: "1px solid var(--enroll-card-border)",
  borderRadius: "var(--enroll-card-radius)",
  boxShadow: "var(--enroll-elevation-2)",
};

/* ── Animated count-up hook ── */
function useAnimatedValue(target: number, duration = 500): number {
  const [current, setCurrent] = useState(target);
  const raf = useRef(0);
  const startRef = useRef(current);
  const startTime = useRef(0);

  useEffect(() => {
    startRef.current = current;
    startTime.current = performance.now();
    const animate = (now: number) => {
      const t = Math.min((now - startTime.current) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setCurrent(startRef.current + (target - startRef.current) * eased);
      if (t < 1) raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);

  return current;
}

/* ── Format helpers ── */
const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number.isFinite(n) && n >= 0 ? n : 0);

/* ── Persuasion mode: hero banner only ── */
function AutoIncreaseBanner({
  t,
  delta,
  withAutoEnd,
  baselineEnd,
  onEnable,
  onSkipClick,
}: {
  t: (key: string, opts?: Record<string, string | number>) => string;
  delta: number;
  withAutoEnd: number;
  baselineEnd: number;
  onEnable: () => void;
  onSkipClick: () => void;
}) {
  return (
    <section className="auto-increase-hero-region" aria-label={t("enrollment.autoIncreaseBoostLabel")}>
      <div className="auto-increase-hero-card relative rounded-2xl p-6 md:p-10 overflow-hidden">
        <div className="auto-increase-hero-gradient absolute inset-0 rounded-2xl" aria-hidden />
        <div className="relative max-w-3xl">
          <div className="auto-increase-hero-left">
            <p className="auto-increase-hero-label">{t("enrollment.autoIncreaseBoostLabel")}</p>
            <h1 className="auto-increase-hero-title">
              {t("enrollment.autoIncreaseHeroTitlePersonal", { amount: formatCurrency(delta) })}
            </h1>
            <p className="auto-increase-hero-subtext">{t("enrollment.autoIncreaseHeroSubtextPersonal")}</p>
            <div className="auto-increase-projection-block">
              <div className="auto-increase-projection-row">
                <span className="auto-increase-projection-with-auto">{formatCurrency(withAutoEnd)}</span>
                <span className="auto-increase-projection-with-auto-label">
                  {t("enrollment.projectedBalanceWithAuto")}
                </span>
              </div>
              <p className="auto-increase-projection-baseline">
                {t("enrollment.projectedWithoutAuto")}: {formatCurrency(baselineEnd)}
              </p>
              {delta > 0 && (
                <span className="auto-increase-delta-badge inline-flex items-center w-fit" aria-hidden>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M12 19V5M5 12l7-7 7 7" />
                  </svg>
                  {t("enrollment.additionalSavingsDelta", { amount: formatCurrency(delta) })}
                </span>
              )}
            </div>
          </div>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={onEnable}
              className="auto-increase-hero-cta-primary h-10 px-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--enroll-brand)]"
            >
              {t("enrollment.enableAutoIncreaseCta")}
            </button>
            <button
              type="button"
              onClick={onSkipClick}
              className="auto-increase-hero-cta-secondary h-10 px-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--enroll-brand)]"
            >
              {t("enrollment.skipForNow")}
            </button>
          </div>
          <p className="text-sm mt-3" style={{ color: "var(--enroll-text-muted)" }}>
            {t("enrollment.autoIncreaseTrustCopy")}
          </p>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════════════════ */
export const FutureContributions = () => {
  const { t } = useTranslation();
  const { state, setAutoIncrease, setContributionAmount, setContributionType } = useEnrollment();

  const salary = state.salary || 75000;
  const currentAge = state.currentAge || 40;
  const retirementAge = state.retirementAge || 67;
  const currentBalance = state.currentBalance || 0;

  /* Contribution from context; when 0, allow hydrate from draft so we don't redirect after Contribution → Continue */
  const contributionPct =
    state.contributionType === "percentage"
      ? Number(state.contributionAmount) ?? 0
      : salary > 0
        ? annualAmountToPercentage(salary, (state.contributionAmount || 0) * PAYCHECKS_PER_YEAR)
        : 0;

  /* POC: No redirect to contribution — allow staying on Auto Increase and navigating Back to Contribution without validation */

  /* Clear investment-wizard session flag so that after "Skip for now" → Continue we show the wizard on investments page */
  useEffect(() => {
    if (typeof sessionStorage !== "undefined") {
      sessionStorage.removeItem("enrollment-investment-wizard-completed-session");
    }
  }, []);

  const effectivePct =
    contributionPct > 0
      ? contributionPct
      : (() => {
          const draft = loadEnrollmentDraft();
          if (!draft || (draft.contributionAmount ?? 0) <= 0) return 0;
          return draft.contributionType === "percentage"
            ? Number(draft.contributionAmount) ?? 0
            : salary > 0
              ? annualAmountToPercentage(salary, (draft.contributionAmount ?? 0) * PAYCHECKS_PER_YEAR)
              : 0;
        })();

  /* POC: always show page (no return null); Back to Contribution works without validation */

  const contributionDollarPerPaycheck =
    salary > 0 && effectivePct > 0
      ? percentageToAnnualAmount(salary, effectivePct) / PAYCHECKS_PER_YEAR
      : 0;

  const derived = useMemo(
    () =>
      deriveContribution({
        contributionType: "percentage",
        contributionValue: effectivePct,
        annualSalary: salary,
        paychecksPerYear: PAYCHECKS_PER_YEAR,
        employerMatchEnabled: state.employerMatchEnabled,
        employerMatchCap: state.assumptions.employerMatchCap,
        employerMatchPercentage: state.assumptions.employerMatchPercentage,
        currentAge,
        retirementAge,
      }),
    [effectivePct, salary, state.employerMatchEnabled, state.assumptions.employerMatchCap, state.assumptions.employerMatchPercentage, currentAge, retirementAge]
  );

  const projectionBaseline = useMemo(
    () =>
      calculateProjection({
        currentAge,
        retirementAge,
        currentBalance,
        monthlyContribution: derived.monthlyContribution ?? 0,
        employerMatch: state.employerMatchEnabled ? derived.employerMatchMonthly : 0,
        annualReturnRate: state.assumptions.annualReturnRate,
        inflationRate: state.assumptions.inflationRate,
      }),
    [currentAge, retirementAge, currentBalance, derived.monthlyContribution, derived.employerMatchMonthly, state.employerMatchEnabled, state.assumptions.annualReturnRate, state.assumptions.inflationRate]
  );

  const projectionWithAuto = useMemo(() => {
    if (!state.autoIncrease.enabled) return null;
    const pct = state.autoIncrease.percentage;
    return calculateProjection({
      currentAge,
      retirementAge,
      currentBalance,
      monthlyContribution: derived.monthlyContribution ?? 0,
      employerMatch: state.employerMatchEnabled ? derived.employerMatchMonthly : 0,
      annualReturnRate: state.assumptions.annualReturnRate,
      inflationRate: state.assumptions.inflationRate,
      autoIncrease: {
        enabled: true,
        initialPercentage: effectivePct,
        increasePercentage: pct,
        maxPercentage: state.autoIncrease.maxPercentage,
        salary,
        contributionType: "percentage",
        assumptions: state.assumptions,
      },
    });
  }, [state.autoIncrease.enabled, state.autoIncrease.percentage, state.autoIncrease.maxPercentage, effectivePct, salary, currentAge, retirementAge, currentBalance, derived.monthlyContribution, derived.employerMatchMonthly, state.employerMatchEnabled, state.assumptions]);

  /** Hypothetical 1% annual increase for decision card and hero when auto increase not yet enabled */
  const projectionHypotheticalAuto = useMemo(
    () =>
      calculateProjection({
        currentAge,
        retirementAge,
        currentBalance,
        monthlyContribution: derived.monthlyContribution ?? 0,
        employerMatch: state.employerMatchEnabled ? derived.employerMatchMonthly : 0,
        annualReturnRate: state.assumptions.annualReturnRate,
        inflationRate: state.assumptions.inflationRate,
        autoIncrease: {
          enabled: true,
          initialPercentage: effectivePct,
          increasePercentage: 1,
          maxPercentage: Math.max(15, Math.ceil(effectivePct)),
          salary,
          contributionType: "percentage",
          assumptions: state.assumptions,
        },
      }),
    [effectivePct, salary, currentAge, retirementAge, currentBalance, derived.monthlyContribution, derived.employerMatchMonthly, state.employerMatchEnabled, state.assumptions]
  );

  const perPaycheck =
    salary > 0 && effectivePct > 0
      ? percentageToAnnualAmount(salary, effectivePct) / PAYCHECKS_PER_YEAR
      : 0;

  const [showSkipModal, setShowSkipModal] = useState(false);
  const [userSkippedAutoIncrease, setUserSkippedAutoIncrease] = useState(false);
  const [autoIncreaseEnabled, setAutoIncreaseEnabled] = useState(false);

  const handleContinue = useCallback(() => {
    const draft = loadEnrollmentDraft();
    if (!draft) return;
    const contributionAmount =
      draft.contributionAmount != null && draft.contributionAmount > 0
        ? draft.contributionAmount
        : effectivePct;
    const contributionType = draft.contributionType ?? "percentage";
    saveEnrollmentDraft({
      ...draft,
      contributionType,
      contributionAmount,
      autoIncrease: autoIncreaseEnabled
        ? {
            enabled: true,
            annualIncreasePct: state.autoIncrease.percentage,
            stopAtPct: Math.min(50, state.autoIncrease.maxPercentage),
            minimumFloorPct: state.autoIncrease.minimumFloor ?? undefined,
          }
        : { enabled: false, annualIncreasePct: 0, stopAtPct: 0 },
    });
  }, [autoIncreaseEnabled, state.autoIncrease.percentage, state.autoIncrease.maxPercentage, state.autoIncrease.minimumFloor, effectivePct]);

  const handleContributionPctChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    const pct = e.target.value === "" ? 0 : Math.min(100, Math.max(0, isNaN(v) ? 0 : v));
    setContributionAmount(pct);
  };

  const handleContributionDollarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    if (salary > 0 && !isNaN(v) && v >= 0) {
      const annual = v * PAYCHECKS_PER_YEAR;
      const pct = (annual / salary) * 100;
      setContributionAmount(Math.min(100, Math.max(0, pct)));
    } else if (e.target.value === "") {
      setContributionAmount(0);
    }
  };

  const ai = state.autoIncrease;

  /* Validation: stopAt > effectivePct, stopAt <= 50; enable Continue only when valid */
  const isValidAutoIncrease =
    ai.percentage >= 0 &&
    ai.maxPercentage > effectivePct &&
    ai.maxPercentage <= 50;

  /* ── Computed delta: use actual when enabled, hypothetical (1%) when not ── */
  const baselineEnd = projectionBaseline.finalBalance;
  const withAutoEnd = state.autoIncrease.enabled
    ? (projectionWithAuto?.finalBalance ?? baselineEnd)
    : projectionHypotheticalAuto.finalBalance;
  const delta = withAutoEnd - baselineEnd;
  const deltaPct = baselineEnd > 0 ? (delta / baselineEnd) * 100 : 0;

  const comparisonDataForChart = ai.enabled ? projectionWithAuto : projectionHypotheticalAuto;

  const handleEnableAutoIncrease = useCallback(() => {
    setShowSkipModal(false);
    setAutoIncrease({
      enabled: true,
      percentage: Math.min(5, Math.max(0, ai.percentage || 2)),
      maxPercentage: Math.min(50, Math.max(15, Math.ceil(effectivePct))),
    });
  }, [ai.percentage, ai.maxPercentage, effectivePct, setAutoIncrease]);

  const handleSkipAnyway = useCallback(() => {
    setShowSkipModal(false);
    setAutoIncrease({ enabled: false });
    setUserSkippedAutoIncrease(true);
    const draft = loadEnrollmentDraft();
    if (draft) {
      saveEnrollmentDraft({
        ...draft,
        autoIncrease: { enabled: false, annualIncreasePct: 0, stopAtPct: 0 },
      });
    }
  }, [setAutoIncrease]);

  const draft = loadEnrollmentDraft();
  const showDisabledState =
    (state.autoIncrease.enabled === false && userSkippedAutoIncrease) ||
    (draft?.autoIncrease != null && draft.autoIncrease.enabled === false);

  if (showDisabledState) {
    return (
      <EnrollmentPageContent
        title={t("enrollment.autoIncreaseNotEnabledTitle")}
        subtitle={t("enrollment.autoIncreaseNotEnabledDescription")}
      >
        <div className="enrollment-container">
          <p className="text-base leading-relaxed mb-8" style={{ color: "var(--enroll-text-secondary)" }}>
            {t("enrollment.autoIncreaseNotEnabledDescription")}
          </p>
          <EnrollmentFooter
            primaryLabel={t("enrollment.continueToInvestmentElection")}
            onPrimary={handleContinue}
            getDraftSnapshot={() => ({
              autoIncrease: { enabled: false, annualIncreasePct: 0, stopAtPct: 0 },
            })}
            inContent
          />
        </div>
      </EnrollmentPageContent>
    );
  }

  return (
    <>
      <EnrollmentPageContent
        title={!autoIncreaseEnabled ? t("enrollment.futureContributionsTitle") : undefined}
        subtitle={!autoIncreaseEnabled ? t("enrollment.futureContributionsSubtitle") : undefined}
        headerContent={!autoIncreaseEnabled ? undefined : <header className="mb-4" />}
      >
        <div className="enrollment-container">
        {/* ═══ STATE 1: Persuasion (banner) | STATE 2: Configuration (increment + chart side-by-side) ═══ */}
        <div className="auto-increase-state-transition">
          {!autoIncreaseEnabled && !userSkippedAutoIncrease && (
            <AutoIncreaseBanner
              t={t}
              delta={delta}
              withAutoEnd={withAutoEnd}
              baselineEnd={baselineEnd}
              onEnable={() => {
                setAutoIncreaseEnabled(true);
                handleEnableAutoIncrease();
              }}
              onSkipClick={() => setShowSkipModal(true)}
            />
          )}
          {autoIncreaseEnabled && (
            <div className="auto-increase-container">
              {/* Single unified banner: .auto-increase-confirmation (65/35 two-col, all info inside) */}
              <section className="auto-increase-confirmation" aria-labelledby="auto-increase-banner-heading">
                <div className="auto-increase-confirmation__inner rounded-2xl" style={{ ...cardStyle, boxShadow: "var(--enroll-elevation-2)" }}>
                  <div className="auto-increase-confirmation__grid">
                    <div className="auto-increase-confirmation__left">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider rounded-full mb-3" style={{ background: "rgb(var(--enroll-accent-rgb) / 0.12)", color: "var(--enroll-accent)" }}>
                        {t("enrollment.autoIncreaseActive")}
                      </span>
                      <h2 id="auto-increase-banner-heading" className="text-lg font-semibold leading-snug mb-1.5" style={{ color: "var(--enroll-text-primary)" }}>
                        Your contributions will now grow automatically.
                      </h2>
                      <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--enroll-text-secondary)" }}>
                        Your contribution will increase by 1% each year, so your savings grow without you having to remember.
                      </p>
                      <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--enroll-text-secondary)" }}>
                        Your contribution will increase slightly once per year. You can change this anytime.
                      </p>
                      <button
                        type="button"
                        onClick={() => { setAutoIncreaseEnabled(false); setAutoIncrease({ enabled: false }); }}
                        className="auto-increase-panel__btn--secondary inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-lg shrink-0 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--enroll-brand)]"
                      >
                        Pause Auto-Increase
                      </button>
                      <p className="text-sm mt-2 mb-4" style={{ color: "var(--enroll-text-muted)" }}>
                        You can resume anytime.
                      </p>
                      <div className="auto-increase-highlight-box">
                        <p className="text-sm leading-relaxed" style={{ color: "var(--enroll-text-secondary)" }}>
                          With a {ai.percentage}% annual increase, you could accumulate{" "}
                          <strong style={{ color: "var(--enroll-accent)" }}>{Math.round(deltaPct)}% more</strong> by age {retirementAge}. That&apos;s an additional{" "}
                          <strong style={{ color: "var(--enroll-accent)" }}>{formatCurrency(delta)}</strong> toward your retirement.
                        </p>
                      </div>
                      {ai.maxPercentage > 0 && (
                        <p className="text-sm mt-4" style={{ color: "var(--enroll-text-secondary)" }}>
                          Your contributions will gradually increase to {ai.maxPercentage}% and stop there.
                        </p>
                      )}
                    </div>
                    <div className="auto-increase-confirmation__right" aria-hidden="true" />
                  </div>
                </div>
              </section>

              {/* Main content grid: same 65/35 so left/right align with banner */}
              <div className="auto-increase-two-col">
                <div className="auto-increase-two-col__left">
                  {/* Single card: Auto Increase Settings */}
                  <div className="auto-increase-settings-card rounded-2xl p-6" style={cardStyle}>
                    <h3 className="text-base font-semibold mb-4" style={{ color: "var(--enroll-text-primary)" }}>
                      Auto Increase Settings
                    </h3>

                    {/* Increase Frequency */}
                    <div className="mb-6">
                      <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: "var(--enroll-text-muted)" }}>
                        Increase Frequency
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {(["calendar_year", "plan_enroll_date", "plan_year"] as IncrementCycle[]).map((cycle) => {
                          const isActive = ai.incrementCycle === cycle;
                          const labelKey = cycle === "calendar_year" ? "enrollment.calendarYear" : cycle === "plan_enroll_date" ? "enrollment.planEnrollDate" : "enrollment.planYear";
                          return (
                            <button
                              key={cycle}
                              type="button"
                              onClick={() => setAutoIncrease({ incrementCycle: cycle })}
                              className="px-4 py-2 text-xs font-semibold rounded-full transition-all"
                              style={{
                                background: isActive ? "rgb(var(--enroll-brand-rgb) / 0.08)" : "var(--enroll-soft-bg)",
                                color: isActive ? "var(--enroll-brand)" : "var(--enroll-text-secondary)",
                                border: isActive ? "1px solid rgb(var(--enroll-brand-rgb) / 0.2)" : "1px solid var(--enroll-card-border)",
                              }}
                            >
                              {t(labelKey)}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Increase Amount: Slider + Input (0–5%, step 0.5) — applies to total contribution */}
                    <div className="mb-6">
                      <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: "var(--enroll-text-muted)" }}>
                        Increase Amount (annual %)
                      </p>
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex-1 min-w-[120px]">
                          <FinancialSlider
                            min={0}
                            max={5}
                            step={0.5}
                            value={Math.min(5, Math.max(0, ai.percentage))}
                            fillPercent={(Math.min(5, Math.max(0, ai.percentage)) / 5) * 100}
                            minLabel="0%"
                            maxLabel="5%"
                            aria-label="Annual increase percentage"
                            onChange={(e) => setAutoIncrease({ percentage: Math.min(5, Math.max(0, parseFloat(e.target.value) || 0)) })}
                          />
                        </div>
                        <div className="flex items-baseline gap-1">
                          <input
                            type="number"
                            min={0}
                            max={5}
                            step={0.5}
                            value={ai.percentage}
                            onChange={(e) => {
                              const v = parseFloat(e.target.value);
                              setAutoIncrease({ percentage: e.target.value === "" ? 0 : Math.min(5, Math.max(0, Number.isNaN(v) ? 0 : v)) });
                            }}
                            className="w-14 text-right text-sm font-semibold py-1.5 px-2 rounded-lg border outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            style={{ background: "var(--enroll-soft-bg)", border: "1px solid var(--enroll-card-border)", color: "var(--enroll-text-primary)" }}
                            aria-label="Annual increase percent"
                          />
                          <span className="text-sm font-semibold" style={{ color: "var(--enroll-text-muted)" }}>%</span>
                        </div>
                      </div>
                    </div>

                    {/* Stop Increasing At (default 15%, max 50%, must be > current contribution) */}
                    <div className="mb-6">
                      <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--enroll-text-muted)" }}>
                        Stop Increasing At
                      </label>
                      <div className="flex items-baseline gap-1 rounded-xl p-3" style={{ background: "var(--enroll-soft-bg)", border: "1px solid var(--enroll-card-border)" }}>
                        <input
                          type="number"
                          min={effectivePct}
                          max={50}
                          step={0.5}
                          value={ai.maxPercentage > 0 ? ai.maxPercentage : ""}
                          onChange={(e) => {
                            const raw = e.target.value;
                            const num = raw === "" ? 0 : parseFloat(raw);
                            setAutoIncrease({ maxPercentage: Number.isNaN(num) ? 0 : Math.min(50, Math.max(effectivePct, num)) });
                          }}
                          className="w-16 text-lg font-bold bg-transparent border-none outline-none p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          style={{ color: "var(--enroll-text-primary)" }}
                          aria-label="Stop increasing at percent"
                        />
                        <span className="text-sm font-semibold" style={{ color: "var(--enroll-text-muted)" }}>%</span>
                      </div>
                      <p className="text-[10px] mt-1" style={{ color: "var(--enroll-text-muted)" }}>
                        Auto-increase will stop once your contribution reaches this percentage. Must be &gt; {Math.round(effectivePct)}% and ≤ 50%.
                      </p>
                      {ai.maxPercentage > 0 && ai.maxPercentage <= effectivePct && (
                        <p className="text-xs mt-1 font-medium" style={{ color: "var(--color-danger)" }}>
                          Must be greater than your current contribution ({Math.round(effectivePct)}%).
                        </p>
                      )}
                    </div>

                    {/* Minimum Floor (optional) */}
                    <div className="mb-6">
                      <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--enroll-text-muted)" }}>
                        Minimum Floor (optional)
                      </label>
                      <div className="flex items-baseline gap-1 rounded-xl p-3" style={{ background: "var(--enroll-soft-bg)", border: "1px solid var(--enroll-card-border)" }}>
                        <input
                          type="number"
                          min={0}
                          max={ai.maxPercentage || 50}
                          step={0.5}
                          value={ai.minimumFloor !== undefined && ai.minimumFloor > 0 ? ai.minimumFloor : ""}
                          onChange={(e) => {
                            const raw = e.target.value;
                            const num = raw === "" ? undefined : parseFloat(raw);
                            setAutoIncrease({ minimumFloor: raw === "" ? undefined : Number.isNaN(num) ? undefined : Math.min(100, Math.max(0, num)) });
                          }}
                          placeholder="Leave blank"
                          className="w-16 text-lg font-bold bg-transparent border-none outline-none p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          style={{ color: "var(--enroll-text-primary)" }}
                          aria-label="Minimum floor percent"
                        />
                        <span className="text-sm font-semibold" style={{ color: "var(--enroll-text-muted)" }}>%</span>
                      </div>
                    </div>

                    {/* Real-time Impact Summary */}
                    <div className="auto-increase-highlight-box">
                      <p className="text-sm leading-relaxed" style={{ color: "var(--enroll-text-secondary)" }}>
                        With a {ai.percentage}% annual increase, you could accumulate{" "}
                        <strong style={{ color: "var(--enroll-accent)" }}>{Math.round(deltaPct)}% more</strong> by age {retirementAge}. That&apos;s an additional{" "}
                        <strong style={{ color: "var(--enroll-accent)" }}>{formatCurrency(delta)}</strong> toward your retirement.
                      </p>
                    </div>
                  </div>
                </div>

              {/* RIGHT COLUMN (~40%) */}
              <div className="auto-increase-two-col__right">
                {/* PROJECTED AT AGE 65 card */}
                <div className="auto-increase-card rounded-2xl p-6" style={cardStyle}>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: "var(--enroll-text-muted)" }}>
                    PROJECTED AT AGE {retirementAge}
                  </p>
                  <div className="text-2xl font-bold mb-2" style={{ color: "var(--enroll-text-primary)" }}>
                    <AnimatedCurrencyValue value={withAutoEnd} />
                  </div>
                  <p className="text-sm mb-4" style={{ color: "var(--enroll-accent)" }}>
                    ↑ +{formatCurrency(delta)} more with auto-increase
                  </p>
                  <div className="auto-increase-chart-wrap">
                    <ProjectionChart
                      baseline={projectionBaseline.dataPoints}
                      withAutoIncrease={comparisonDataForChart?.dataPoints ?? null}
                    />
                  </div>
                  <div className="flex items-center gap-6 mt-3">
                    <span className="flex items-center gap-1.5 text-xs" style={{ color: "var(--enroll-text-muted)" }}>
                      <span className="w-3 h-0.5 rounded-full" style={{ background: "var(--enroll-brand)" }} />
                      Without
                    </span>
                    <span className="flex items-center gap-1.5 text-xs" style={{ color: "var(--enroll-text-muted)" }}>
                      <span className="w-3 h-0.5 rounded-full" style={{ background: "var(--enroll-accent)" }} />
                      With auto-increase
                    </span>
                  </div>
                  <p className="text-xs mt-2" style={{ color: "var(--enroll-text-muted)" }}>
                    Assumes {state.assumptions.annualReturnRate}% annual return. Actual results may vary.
                  </p>
                </div>

                {/* PAYCHECK IMPACT card */}
                <div className="auto-increase-card rounded-2xl p-6 mt-8" style={cardStyle}>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: "var(--enroll-text-muted)" }}>
                    PAYCHECK IMPACT
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-xl p-3 text-center" style={{ background: "rgb(var(--enroll-brand-rgb) / 0.06)", border: "1px solid rgb(var(--enroll-brand-rgb) / 0.12)" }}>
                      <p className="text-[10px] font-medium uppercase tracking-wider mb-0.5" style={{ color: "var(--enroll-text-muted)" }}>RATE</p>
                      <p className="text-lg font-bold" style={{ color: "var(--enroll-brand)" }}>{Math.round(effectivePct)}%</p>
                    </div>
                    <div className="rounded-xl p-3 text-center" style={{ background: "rgb(var(--enroll-brand-rgb) / 0.06)", border: "1px solid rgb(var(--enroll-brand-rgb) / 0.12)" }}>
                      <p className="text-[10px] font-medium uppercase tracking-wider mb-0.5" style={{ color: "var(--enroll-text-muted)" }}>PER CHECK</p>
                      <p className="text-lg font-bold" style={{ color: "var(--enroll-brand)" }}>{formatCurrency(perPaycheck)}</p>
                    </div>
                  </div>
                  <p className="flex items-center gap-1.5 text-[10px] mt-3" style={{ color: "var(--enroll-text-muted)" }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
                    Based on {formatCurrency(salary)} annual salary.
                  </p>
                </div>
              </div>

            </div>
            </div>
          )}
        </div>

        {/* When auto-increase NOT enabled and not skipped: contribution inputs + chart */}
        {!autoIncreaseEnabled && !userSkippedAutoIncrease && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="p-6 rounded-2xl" style={cardStyle}>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: "var(--enroll-text-muted)" }}>
                {t("enrollment.currentContribution")}
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl p-3" style={{ background: "var(--enroll-soft-bg)", border: "1px solid var(--enroll-card-border)" }}>
                  <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--enroll-text-muted)" }}>{t("enrollment.percentage")}</p>
                  <div className="flex items-baseline gap-1 mt-1">
                    <input
                      type="number"
                      value={effectivePct > 0 ? Math.round(effectivePct) : ""}
                      onChange={handleContributionPctChange}
                      min="0"
                      max="100"
                      className="w-16 text-lg font-bold bg-transparent border-none outline-none p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      style={{ color: "var(--enroll-text-primary)" }}
                      aria-label={t("enrollment.contributionPercentageAria")}
                    />
                    <span className="text-sm font-semibold" style={{ color: "var(--enroll-text-muted)" }}>%</span>
                  </div>
                </div>
                <div className="rounded-xl p-3" style={{ background: "var(--enroll-soft-bg)", border: "1px solid var(--enroll-card-border)" }}>
                  <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--enroll-text-muted)" }}>{t("enrollment.perPaycheck")}</p>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-sm font-semibold" style={{ color: "var(--enroll-text-muted)" }}>$</span>
                    <input
                      type="number"
                      value={contributionDollarPerPaycheck > 0 ? Math.round(contributionDollarPerPaycheck) : ""}
                      onChange={handleContributionDollarChange}
                      min="0"
                      className="w-20 text-lg font-bold bg-transparent border-none outline-none p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      style={{ color: "var(--enroll-text-primary)" }}
                      aria-label={t("enrollment.contributionPerPaycheckDollarAria")}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="auto-increase-impact-chart">
              <ProjectionChart
                baseline={projectionBaseline.dataPoints}
                withAutoIncrease={comparisonDataForChart?.dataPoints ?? null}
              />
              <div className="flex items-center gap-6 mt-3">
                <span className="flex items-center gap-1.5 text-xs" style={{ color: "var(--enroll-text-muted)" }}>
                  <span className="w-3 h-0.5 rounded-full" style={{ background: "var(--enroll-brand)" }} />
                  {t("enrollment.without")}
                </span>
                <span className="flex items-center gap-1.5 text-xs" style={{ color: "var(--enroll-text-muted)" }}>
                  <span className="w-3 h-0.5 rounded-full" style={{ background: "var(--enroll-accent)" }} />
                  {t("enrollment.withAutoIncrease")}
                </span>
              </div>
            </div>
          </div>
        )}

        {!autoIncreaseEnabled && !userSkippedAutoIncrease && (
          <div className="auto-increase-reinforcement mb-8">
            Most participants increase their contributions by 1% annually.
          </div>
        )}

        <EnrollmentFooter
          primaryLabel={t("enrollment.continueToInvestmentElection")}
          primaryDisabled={(!autoIncreaseEnabled && !userSkippedAutoIncrease) || (autoIncreaseEnabled && !isValidAutoIncrease)}
          onPrimary={handleContinue}
          getDraftSnapshot={() =>
            autoIncreaseEnabled
              ? {
                  autoIncrease: {
                    enabled: true,
                    annualIncreasePct: state.autoIncrease.percentage,
                    stopAtPct: Math.min(50, state.autoIncrease.maxPercentage),
                    minimumFloorPct: state.autoIncrease.minimumFloor ?? undefined,
                  },
                }
              : { autoIncrease: { enabled: false, annualIncreasePct: 0, stopAtPct: 0 } }
          }
          inContent
        />
        </div>
      </EnrollmentPageContent>

      {/* Skip confirmation modal — uses shared Modal, enrollment tokens */}
      <Modal
        isOpen={showSkipModal}
        onClose={() => setShowSkipModal(false)}
        closeOnOverlayClick={false}
        dialogClassName="enrollment-modal max-w-md"
      >
        <div className="p-6">
          <h2 id="skip-modal-title" className="enrollment-modal__title text-xl font-bold mb-2">
            {t("enrollment.skipModalTitle")}
          </h2>
          <p id="skip-modal-desc" className="enrollment-modal__body text-sm mb-6 leading-relaxed">
            {t("enrollment.skipModalBody", { amount: formatCurrency(delta) })}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
            <button
              type="button"
              onClick={handleEnableAutoIncrease}
              className="enrollment-modal__primary order-2 sm:order-1 inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold rounded-xl border-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--enroll-brand)]"
            >
              {t("enrollment.enableAutoIncreaseCta")}
            </button>
            <button
              type="button"
              onClick={handleSkipAnyway}
              className="enrollment-modal__secondary order-1 sm:order-2 inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold rounded-xl border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--enroll-brand)]"
            >
              {t("enrollment.skipAnyway")}
            </button>
          </div>
        </div>
      </Modal>

    </>
  );
};

/* ═══════════════════════════════════════════════════════════
   ANIMATED CURRENCY VALUE
   ═══════════════════════════════════════════════════════════ */
function AnimatedCurrencyValue({ value }: { value: number }) {
  const animatedVal = useAnimatedValue(value);
  return (
    <motion.p
      key={Math.round(value / 1000)}
      initial={{ opacity: 0.7, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="text-2xl font-bold"
      style={{ color: "var(--enroll-text-primary)" }}
    >
      {formatCurrency(animatedVal)}
    </motion.p>
  );
}

/* ═══════════════════════════════════════════════════════════
   PROJECTION CHART
   ═══════════════════════════════════════════════════════════ */
function ProjectionChart({
  baseline,
  withAutoIncrease,
}: {
  baseline: ProjectionDataPoint[];
  withAutoIncrease: ProjectionDataPoint[] | null;
}) {
  const { t } = useTranslation();
  const [tooltip, setTooltip] = useState<{ index: number; x: number; y: number } | null>(null);

  if (baseline.length === 0) {
    return <div className="text-xs text-center py-8" style={{ color: "var(--enroll-text-muted)" }}>{t("enrollment.noProjectionData")}</div>;
  }

  const maxBalance = Math.max(
    ...baseline.map((p) => p.balance),
    ...(withAutoIncrease ?? []).map((p) => p.balance)
  );
  const yTicks = getYAxisTicks(maxBalance);
  const yMax = yTicks[yTicks.length - 1] ?? maxBalance;
  const range = yMax || 1;

  const w = 380;
  const h = 200;
  const pad = { top: 16, right: 12, bottom: 28, left: 44 };

  const xScale = (i: number) =>
    pad.left + (i / Math.max(0, baseline.length - 1)) * (w - pad.left - pad.right);
  const yScale = (v: number) =>
    h - pad.bottom - (v / range) * (h - pad.top - pad.bottom);

  const chartWidth = w - pad.left - pad.right;
  const points = baseline.length;

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const svgX = ((e.clientX - rect.left) / rect.width) * w;
    const index = Math.max(0, Math.min(points - 1, Math.round(((svgX - pad.left) / chartWidth) * (points - 1))));
    setTooltip({ index, x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const baselinePath = baseline
    .map((p, i) => `${i === 0 ? "M" : "L"} ${xScale(i)} ${yScale(p.balance)}`)
    .join(" ");

  const autoPath =
    withAutoIncrease &&
    withAutoIncrease
      .map((p, i) => `${i === 0 ? "M" : "L"} ${xScale(i)} ${yScale(p.balance)}`)
      .join(" ");

  const areaPath = `${baselinePath} L ${xScale(baseline.length - 1)} ${h - pad.bottom} L ${pad.left} ${h - pad.bottom} Z`;

  const autoAreaPath =
    withAutoIncrease && autoPath &&
    `${autoPath} L ${xScale((withAutoIncrease?.length ?? 1) - 1)} ${h - pad.bottom} L ${pad.left} ${h - pad.bottom} Z`;

  const maxIdx = Math.max(0, baseline.length - 1);
  const xLabels = ["Now", "10 yrs", "20 yrs", `${maxIdx} yrs`];

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="w-full"
        preserveAspectRatio="xMidYMid meet"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setTooltip(null)}
      >
        <defs>
          <linearGradient id="fc-grad-base" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="var(--enroll-brand)" stopOpacity="0.15" />
            <stop offset="100%" stopColor="var(--enroll-brand)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="fc-grad-auto" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="var(--enroll-accent)" stopOpacity="0.2" />
            <stop offset="100%" stopColor="var(--enroll-accent)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {yTicks.map((v, i) => (
          <line key={i} x1={pad.left} y1={yScale(v)} x2={w - pad.right} y2={yScale(v)} stroke="var(--enroll-card-border)" strokeWidth="0.5" strokeDasharray="3 3" />
        ))}

        {/* Y-axis labels */}
        {yTicks.map((v, i) => (
          <text key={i} x={pad.left - 6} y={yScale(v)} textAnchor="end" dominantBaseline="middle" fontSize="9" fill="var(--enroll-text-muted)">
            {formatYAxisLabel(v)}
          </text>
        ))}

        {/* X-axis labels */}
        {xLabels.map((label, i) => {
          const idx = i === xLabels.length - 1 ? maxIdx : (i / (xLabels.length - 1)) * maxIdx;
          return (
            <text key={i} x={xScale(idx)} y={h - 8} textAnchor="middle" fontSize="9" fill="var(--enroll-text-muted)">
              {label}
            </text>
          );
        })}

        {/* Baseline area + line */}
        <path d={areaPath} fill="url(#fc-grad-base)" />
        <path d={baselinePath} fill="none" stroke="var(--enroll-brand)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

        {/* Auto-increase area + line */}
        {withAutoIncrease && autoPath && (
          <>
            <path d={autoAreaPath} fill="url(#fc-grad-auto)" />
            <path d={autoPath} fill="none" stroke="var(--enroll-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </>
        )}

        {/* End-point markers */}
        {baseline.length > 0 && (
          <circle cx={xScale(maxIdx)} cy={yScale(baseline[maxIdx].balance)} r="3" fill="var(--enroll-brand)" />
        )}
        {withAutoIncrease && withAutoIncrease.length > 0 && (
          <circle cx={xScale(Math.min(maxIdx, withAutoIncrease.length - 1))} cy={yScale(withAutoIncrease[Math.min(maxIdx, withAutoIncrease.length - 1)].balance)} r="3" fill="var(--enroll-accent)" />
        )}
      </svg>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="pointer-events-none absolute z-10 rounded-lg px-3 py-2 text-xs"
          style={{
            left: Math.min(tooltip.x + 12, 260),
            top: tooltip.y - 8,
            background: "var(--enroll-card-bg)",
            border: "1px solid var(--enroll-card-border)",
            boxShadow: "var(--enroll-elevation-2)",
          }}
        >
          <div className="font-semibold" style={{ color: "var(--enroll-text-primary)" }}>
            {tooltip.index === 0 ? "Now" : `${tooltip.index} yrs`}
          </div>
          <div style={{ color: "var(--enroll-brand)" }}>
            {formatCurrency(baseline[tooltip.index]?.balance ?? 0)}
          </div>
          {withAutoIncrease && tooltip.index < withAutoIncrease.length && (
            <div style={{ color: "var(--enroll-accent)" }}>
              w/ Auto: {formatCurrency(withAutoIncrease[tooltip.index].balance)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
