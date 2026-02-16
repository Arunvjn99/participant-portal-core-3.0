import { useMemo, useState, useCallback, useEffect, useRef } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useEnrollment } from "../../enrollment/context/EnrollmentContext";
import { EnrollmentFooter } from "../../components/enrollment/EnrollmentFooter";
import { EnrollmentPageContent } from "../../components/enrollment/EnrollmentPageContent";
import { InvestmentProfileWizard } from "../../components/enrollment/InvestmentProfileWizard";
import {
  PAYCHECKS_PER_YEAR,
  percentageToAnnualAmount,
  annualAmountToPercentage,
  deriveContribution,
} from "../../enrollment/logic/contributionCalculator";
import { calculateProjection } from "../../enrollment/logic/projectionCalculator";
import type { ProjectionDataPoint } from "../../enrollment/logic/types";
import { formatYAxisLabel, getYAxisTicks } from "../../utils/projectionChartAxis";
import type { IncrementCycle } from "../../enrollment/logic/types";

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

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════════════════ */
export const FutureContributions = () => {
  const navigate = useNavigate();
  const { state, setAutoIncrease, setContributionAmount } = useEnrollment();
  const [increaseViewMode, setIncreaseViewMode] = useState<"percent" | "dollar">("percent");

  const salary = state.salary || 75000;
  const currentAge = state.currentAge || 40;
  const retirementAge = state.retirementAge || 67;
  const currentBalance = state.currentBalance || 0;
  const contributionPct =
    state.contributionType === "percentage"
      ? state.contributionAmount
      : salary > 0
        ? annualAmountToPercentage(salary, state.contributionAmount * PAYCHECKS_PER_YEAR)
        : 0;

  const contributionDollarPerPaycheck =
    salary > 0 && contributionPct > 0
      ? percentageToAnnualAmount(salary, contributionPct) / PAYCHECKS_PER_YEAR
      : 0;

  const derived = useMemo(
    () =>
      deriveContribution({
        contributionType: "percentage",
        contributionValue: contributionPct,
        annualSalary: salary,
        paychecksPerYear: PAYCHECKS_PER_YEAR,
        employerMatchEnabled: state.employerMatchEnabled,
        employerMatchCap: state.assumptions.employerMatchCap,
        employerMatchPercentage: state.assumptions.employerMatchPercentage,
        currentAge,
        retirementAge,
      }),
    [contributionPct, salary, state.employerMatchEnabled, state.assumptions.employerMatchCap, state.assumptions.employerMatchPercentage, currentAge, retirementAge]
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
        initialPercentage: contributionPct,
        increasePercentage: pct,
        maxPercentage: state.autoIncrease.maxPercentage,
        salary,
        contributionType: "percentage",
        assumptions: state.assumptions,
      },
    });
  }, [state.autoIncrease.enabled, state.autoIncrease.percentage, state.autoIncrease.maxPercentage, contributionPct, salary, currentAge, retirementAge, currentBalance, derived.monthlyContribution, derived.employerMatchMonthly, state.employerMatchEnabled, state.assumptions]);

  const perPaycheck =
    salary > 0 && contributionPct > 0
      ? percentageToAnnualAmount(salary, contributionPct) / PAYCHECKS_PER_YEAR
      : 0;

  const [showInvestmentWizard, setShowInvestmentWizard] = useState(false);

  const handleContinue = useCallback(() => {
    if (state.investmentProfileCompleted) {
      navigate("/enrollment/investments");
    } else {
      setShowInvestmentWizard(true);
    }
  }, [state.investmentProfileCompleted, navigate]);

  const handleWizardComplete = useCallback(() => {
    setShowInvestmentWizard(false);
  }, []);

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

  const handleIncreaseChange = (source: "preTax" | "roth" | "afterTax", value: number) => {
    setAutoIncrease({
      preTaxIncrease: source === "preTax" ? value : state.autoIncrease.preTaxIncrease,
      rothIncrease: source === "roth" ? value : state.autoIncrease.rothIncrease,
      afterTaxIncrease: source === "afterTax" ? value : state.autoIncrease.afterTaxIncrease,
      percentage: value,
    });
  };

  const ai = state.autoIncrease;

  /* ── Computed delta ── */
  const baselineEnd = projectionBaseline.finalBalance;
  const autoEnd = projectionWithAuto?.finalBalance ?? baselineEnd;
  const delta = autoEnd - baselineEnd;
  const deltaPct = baselineEnd > 0 ? ((delta / baselineEnd) * 100) : 0;

  if (contributionPct <= 0) {
    return <Navigate to="/enrollment/contribution" replace />;
  }

  return (
    <>
      <EnrollmentPageContent
        title="Let your savings grow automatically."
        subtitle="Small increases each year can create significant long-term impact."
        badge={
          ai.enabled ? (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full"
              style={{ background: "rgb(var(--enroll-accent-rgb) / 0.08)", color: "var(--enroll-accent)" }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              Auto-Increase Active
            </motion.span>
          ) : null
        }
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* ═══ LEFT: Configuration (2 cols) ═══ */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Enable toggle card */}
            <div className="p-6" style={cardStyle}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold" style={{ color: "var(--enroll-text-primary)" }}>
                    Enable Auto-Increase
                  </h3>
                  <p className="text-sm mt-1" style={{ color: "var(--enroll-text-secondary)" }}>
                    Your contribution will increase slightly once per year. You can change this anytime.
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={ai.enabled}
                  onClick={() => setAutoIncrease({ enabled: !ai.enabled })}
                  className="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1"
                  style={{
                    background: ai.enabled ? "var(--enroll-accent)" : "var(--enroll-card-border)",
                  }}
                >
                  <span
                    className="inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200"
                    style={{ transform: ai.enabled ? "translateX(20px)" : "translateX(2px)" }}
                  />
                </button>
              </div>

              {/* Smart insight — only when enabled */}
              <AnimatePresence>
                {ai.enabled && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div
                      className="flex items-start gap-3 rounded-xl p-4 mt-4"
                      style={{
                        background: "rgb(var(--enroll-accent-rgb) / 0.04)",
                        border: "1px solid rgb(var(--enroll-accent-rgb) / 0.1)",
                      }}
                    >
                      <div
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs"
                        style={{ background: "rgb(var(--enroll-accent-rgb) / 0.15)", color: "var(--enroll-accent)" }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z" /><line x1="9" y1="21" x2="15" y2="21" /></svg>
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: "var(--enroll-text-secondary)" }}>
                        With a {ai.percentage}% annual increase, you could accumulate{" "}
                        <strong style={{ color: "var(--enroll-accent)" }}>{deltaPct > 0 ? `${Math.round(deltaPct)}%` : "—"} more</strong>{" "}
                        by age {retirementAge}. That's an additional{" "}
                        <strong style={{ color: "var(--enroll-accent)" }}>{formatCurrency(delta)}</strong> toward your retirement.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Contribution inputs */}
            <div className="p-6" style={cardStyle}>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: "var(--enroll-text-muted)" }}>
                Current Contribution
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div
                  className="rounded-xl p-3"
                  style={{ background: "var(--enroll-soft-bg)", border: "1px solid var(--enroll-card-border)" }}
                >
                  <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--enroll-text-muted)" }}>Percentage</p>
                  <div className="flex items-baseline gap-1 mt-1">
                    <input
                      type="number"
                      value={contributionPct > 0 ? Math.round(contributionPct) : ""}
                      onChange={handleContributionPctChange}
                      min="0"
                      max="100"
                      className="w-16 text-lg font-bold bg-transparent border-none outline-none p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      style={{ color: "var(--enroll-text-primary)" }}
                      aria-label="Contribution percentage"
                    />
                    <span className="text-sm font-semibold" style={{ color: "var(--enroll-text-muted)" }}>%</span>
                  </div>
                </div>
                <div
                  className="rounded-xl p-3"
                  style={{ background: "var(--enroll-soft-bg)", border: "1px solid var(--enroll-card-border)" }}
                >
                  <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--enroll-text-muted)" }}>Per Paycheck</p>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-sm font-semibold" style={{ color: "var(--enroll-text-muted)" }}>$</span>
                    <input
                      type="number"
                      value={contributionDollarPerPaycheck > 0 ? Math.round(contributionDollarPerPaycheck) : ""}
                      onChange={handleContributionDollarChange}
                      min="0"
                      className="w-20 text-lg font-bold bg-transparent border-none outline-none p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      style={{ color: "var(--enroll-text-primary)" }}
                      aria-label="Contribution per paycheck (dollar)"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Increment cycle + source rows */}
            <AnimatePresence>
              {ai.enabled && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="p-6 space-y-5"
                  style={cardStyle}
                >
                  {/* Increment cycle */}
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: "var(--enroll-text-muted)" }}>
                      Increment Cycle
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {(["calendar_year", "plan_enroll_date", "plan_year"] as IncrementCycle[]).map((cycle) => {
                        const isActive = ai.incrementCycle === cycle;
                        const label = cycle === "calendar_year" ? "Calendar Year" : cycle === "plan_enroll_date" ? "Plan Enroll Date" : "Plan Year";
                        return (
                          <button
                            key={cycle}
                            type="button"
                            onClick={() => setAutoIncrease({ incrementCycle: cycle })}
                            className="px-4 py-2 text-xs font-semibold rounded-full transition-all duration-200"
                            style={{
                              background: isActive ? "rgb(var(--enroll-brand-rgb) / 0.08)" : "var(--enroll-soft-bg)",
                              color: isActive ? "var(--enroll-brand)" : "var(--enroll-text-secondary)",
                              border: isActive ? "1px solid rgb(var(--enroll-brand-rgb) / 0.2)" : "1px solid var(--enroll-card-border)",
                            }}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* View mode toggle + source rows */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--enroll-text-muted)" }}>
                        Annual Increase per Source
                      </p>
                      <div
                        className="inline-flex rounded-lg overflow-hidden"
                        style={{ border: "1px solid var(--enroll-card-border)" }}
                      >
                        {(["percent", "dollar"] as const).map((mode) => (
                          <button
                            key={mode}
                            type="button"
                            onClick={() => setIncreaseViewMode(mode)}
                            className="px-3 py-1 text-xs font-semibold transition-colors"
                            style={{
                              background: increaseViewMode === mode ? "var(--enroll-brand)" : "var(--enroll-card-bg)",
                              color: increaseViewMode === mode ? "white" : "var(--enroll-text-secondary)",
                            }}
                          >
                            {mode === "percent" ? "%" : "$"}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      {[
                        { key: "preTax" as const, label: "Pre-tax", value: ai.preTaxIncrease ?? 0 },
                        { key: "roth" as const, label: "Roth", value: ai.rothIncrease ?? 0 },
                        { key: "afterTax" as const, label: "After-tax", value: ai.afterTaxIncrease ?? 0 },
                      ].map(({ key, label, value }) => {
                        const dollarPerPaycheck =
                          increaseViewMode === "dollar" && salary > 0 && value > 0
                            ? (salary * (value / 100)) / PAYCHECKS_PER_YEAR
                            : 0;
                        const displayValue =
                          increaseViewMode === "percent"
                            ? value > 0 ? value : ""
                            : value > 0 ? Math.round(dollarPerPaycheck) : "";
                        return (
                          <div
                            key={key}
                            className="flex items-center justify-between gap-3 p-3 rounded-xl"
                            style={{ background: "var(--enroll-soft-bg)", border: "1px solid var(--enroll-card-border)" }}
                          >
                            <span className="text-sm font-medium" style={{ color: "var(--enroll-text-primary)" }}>{label}</span>
                            <div className="flex items-center gap-1">
                              <input
                                type="number"
                                value={displayValue}
                                onChange={(e) => {
                                  const raw = e.target.value;
                                  const num = raw === "" ? 0 : parseFloat(raw);
                                  if (increaseViewMode === "percent") {
                                    handleIncreaseChange(key, Number.isNaN(num) ? 0 : Math.min(100, Math.max(0, num)));
                                  } else if (salary > 0 && !Number.isNaN(num) && num >= 0) {
                                    const paycheckTotalVal = salary / PAYCHECKS_PER_YEAR;
                                    const pct = paycheckTotalVal > 0 ? (num / paycheckTotalVal) * 100 : 0;
                                    handleIncreaseChange(key, Math.min(100, Math.max(0, pct)));
                                  } else if (raw === "") {
                                    handleIncreaseChange(key, 0);
                                  }
                                }}
                                min="0"
                                max={increaseViewMode === "percent" ? "100" : undefined}
                                step={increaseViewMode === "percent" ? "0.5" : "1"}
                                className="w-16 text-right text-sm font-semibold py-1.5 px-2 rounded-lg outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                style={{
                                  background: "var(--enroll-card-bg)",
                                  border: "1px solid var(--enroll-card-border)",
                                  color: "var(--enroll-text-primary)",
                                }}
                                aria-label={`${label} increase ${increaseViewMode === "percent" ? "percentage" : "dollar amount"}`}
                              />
                              <span className="text-xs font-semibold" style={{ color: "var(--enroll-text-muted)" }}>
                                {increaseViewMode === "percent" ? "%" : "$"}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* ═══ RIGHT: Projection & Impact (1 col) ═══ */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="lg:sticky lg:top-24 space-y-6">
              {/* Before vs After projection */}
              <div className="p-6" style={cardStyle}>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: "var(--enroll-text-muted)" }}>
                  Projected at Age {retirementAge}
                </p>

                <div className="flex items-end gap-2 mb-1">
                  <AnimatedCurrencyValue value={autoEnd} />
                </div>

                <AnimatePresence>
                  {ai.enabled && delta > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold mb-4"
                      style={{ background: "rgb(var(--enroll-accent-rgb) / 0.08)", color: "var(--enroll-accent)" }}
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
                      +{formatCurrency(delta)} more with auto-increase
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Chart */}
                <div className="mt-2">
                  <ProjectionChart
                    baseline={projectionBaseline.dataPoints}
                    withAutoIncrease={projectionWithAuto?.dataPoints ?? null}
                  />
                </div>

                {/* Legend */}
                <div className="flex items-center gap-4 mt-3">
                  <span className="flex items-center gap-1.5 text-[11px]" style={{ color: "var(--enroll-text-muted)" }}>
                    <span className="w-2.5 h-0.5 rounded-full" style={{ background: "var(--enroll-brand)" }} />
                    Without
                  </span>
                  <span className="flex items-center gap-1.5 text-[11px]" style={{ color: "var(--enroll-text-muted)" }}>
                    <span className="w-2.5 h-0.5 rounded-full" style={{ background: "var(--enroll-accent)" }} />
                    With auto-increase
                  </span>
                </div>

                <p className="text-[10px] mt-2" style={{ color: "var(--enroll-text-muted)" }}>
                  Assumes {state.assumptions.annualReturnRate}% annual return. Actual results may vary.
                </p>
              </div>

              {/* Paycheck impact */}
              <div className="p-5" style={cardStyle}>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: "var(--enroll-text-muted)" }}>
                  Paycheck Impact
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    className="rounded-xl p-3 text-center"
                    style={{ background: "rgb(var(--enroll-brand-rgb) / 0.06)", border: "1px solid rgb(var(--enroll-brand-rgb) / 0.12)" }}
                  >
                    <p className="text-[10px] font-medium uppercase tracking-wider" style={{ color: "var(--enroll-text-muted)" }}>Rate</p>
                    <p className="text-lg font-bold mt-0.5" style={{ color: "var(--enroll-brand)" }}>{Math.round(contributionPct)}%</p>
                  </div>
                  <div
                    className="rounded-xl p-3 text-center"
                    style={{ background: "rgb(var(--enroll-brand-rgb) / 0.06)", border: "1px solid rgb(var(--enroll-brand-rgb) / 0.12)" }}
                  >
                    <p className="text-[10px] font-medium uppercase tracking-wider" style={{ color: "var(--enroll-text-muted)" }}>Per Check</p>
                    <p className="text-lg font-bold mt-0.5" style={{ color: "var(--enroll-brand)" }}>{formatCurrency(perPaycheck)}</p>
                  </div>
                </div>
                <p className="flex items-center gap-1.5 text-[10px] mt-3" style={{ color: "var(--enroll-text-muted)" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
                  Based on {formatCurrency(salary)} annual salary.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <EnrollmentFooter
          step={2}
          primaryLabel="Continue to Investment Election"
          onPrimary={handleContinue}
          summaryText={`Projected balance at age ${retirementAge}: ${formatCurrency(autoEnd)}`}
        />
      </EnrollmentPageContent>

      {showInvestmentWizard && (
        <InvestmentProfileWizard
          isOpen={showInvestmentWizard}
          onClose={() => setShowInvestmentWizard(false)}
          onComplete={handleWizardComplete}
        />
      )}
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
  const [tooltip, setTooltip] = useState<{ index: number; x: number; y: number } | null>(null);

  if (baseline.length === 0) {
    return <div className="text-xs text-center py-8" style={{ color: "var(--enroll-text-muted)" }}>No projection data</div>;
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
