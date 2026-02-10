import { useMemo, useCallback, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { DashboardLayout } from "../../layouts/DashboardLayout";
import { DashboardHeader } from "../../components/dashboard/DashboardHeader";
import { useEnrollment } from "../../enrollment/context/EnrollmentContext";
import { EnrollmentStepper } from "../../components/enrollment/EnrollmentStepper";
import Button from "../../components/ui/Button";
import { loadEnrollmentDraft, saveEnrollmentDraft } from "../../enrollment/enrollmentDraftStore";
import { EnrollmentFooter } from "../../components/enrollment/EnrollmentFooter";
import {
  PAYCHECKS_PER_YEAR,
  percentageToAnnualAmount,
  annualAmountToPercentage,
  deriveContribution,
} from "../../enrollment/logic/contributionCalculator";
import { calculateProjection } from "../../enrollment/logic/projectionCalculator";
import type { ProjectionDataPoint } from "../../enrollment/logic/types";
import { formatYAxisLabel, getYAxisTicks } from "../../utils/projectionChartAxis";

const SLIDER_MIN = 1;
const SLIDER_MAX = 25;

const PRESETS = [
  { id: "safe", label: "Safe: 8%", percentage: 8 },
  { id: "aggressive", label: "Aggressive: 15%", percentage: 15 },
] as const;

const MATCH_OPTIONS = [
  { id: "none", label: "No match", pct: 0, cap: 0 },
  { id: "50_3", label: "50% up to 3%", pct: 50, cap: 3 },
  { id: "100_6", label: "100% up to 6%", pct: 100, cap: 6 },
  { id: "custom", label: "Custom", pct: 100, cap: 6 },
] as const;

const SOURCE_OPTIONS = [
  { id: "preTax", main: "Pre-tax", sub: "(default)", key: "preTax" as const },
  { id: "roth", main: "Roth", sub: "(after-tax, tax-free growth)", key: "roth" as const },
  { id: "afterTax", main: "After-tax", sub: "(non-Roth)", key: "afterTax" as const },
] as const;

export const Contribution = () => {
  const navigate = useNavigate();
  const {
    state,
    setContributionType,
    setContributionAmount,
    setEmployerMatchEnabled,
    setEmployerMatchIsCustom,
    setAssumptions,
    setSourceAllocation,
    setSourcesEditMode,
    setSourcesViewMode,
    monthlyContribution,
    perPaycheck,
  } = useEnrollment();

  const selectedPlanId = state.selectedPlan;
  const salary = state.salary || 72000;
  const currentAge = state.currentAge || 40;
  const retirementAge = state.retirementAge || 67;

  if (state.isInitialized && !selectedPlanId) {
    return <Navigate to="/enrollment/plans" replace />;
  }

  const contributionPct =
    state.contributionType === "percentage"
      ? state.contributionAmount
      : salary > 0
        ? annualAmountToPercentage(salary, state.contributionAmount * PAYCHECKS_PER_YEAR)
        : 0;
  const annualAmount = salary > 0 ? percentageToAnnualAmount(salary, contributionPct) : 0;
  const dollarInput = annualAmount;

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
    [
      contributionPct,
      salary,
      state.employerMatchEnabled,
      state.assumptions.employerMatchCap,
      state.assumptions.employerMatchPercentage,
      currentAge,
      retirementAge,
    ]
  );

  const projectionBaseline = useMemo(
    () =>
      calculateProjection({
        currentAge,
        retirementAge,
        currentBalance: state.currentBalance || 0,
        monthlyContribution: derived.monthlyContribution,
        employerMatch: state.employerMatchEnabled ? derived.employerMatchMonthly : 0,
        annualReturnRate: state.assumptions.annualReturnRate,
        inflationRate: state.assumptions.inflationRate,
      }),
    [
      currentAge,
      retirementAge,
      state.currentBalance,
      derived.monthlyContribution,
      derived.employerMatchMonthly,
      state.employerMatchEnabled,
      state.assumptions.annualReturnRate,
      state.assumptions.inflationRate,
    ]
  );

  const activePreset = PRESETS.find((p) => p.percentage === contributionPct)?.id ?? null;
  const activeMatch = !state.employerMatchEnabled
    ? "none"
    : state.employerMatchIsCustom
      ? "custom"
      : MATCH_OPTIONS.find(
          (o) => o.pct === state.assumptions.employerMatchPercentage && o.cap === state.assumptions.employerMatchCap
        )?.id ?? "custom";

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
      Number.isFinite(n) && n >= 0 ? n : 0
    );

  const handlePreset = (pct: number) => {
    setContributionType("percentage");
    setContributionAmount(pct);
  };

  const handlePercentageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setContributionType("percentage");
    if (!isNaN(v) && v >= 0) setContributionAmount(Math.min(100, v));
    else if (e.target.value === "") setContributionAmount(0);
  };

  const handleDollarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    if (!isNaN(v) && v >= 0 && salary > 0) {
      const pct = annualAmountToPercentage(salary, v);
      setContributionType("percentage");
      setContributionAmount(Math.min(100, Math.max(0, pct)));
    } else if (e.target.value === "") {
      setContributionType("percentage");
      setContributionAmount(0);
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    if (!isNaN(v)) {
      setContributionType("percentage");
      setContributionAmount(Math.min(SLIDER_MAX, Math.max(SLIDER_MIN, v)));
    }
  };

  const handleMatchOption = (opt: (typeof MATCH_OPTIONS)[number]) => {
    if (opt.id === "none") {
      setEmployerMatchEnabled(false);
      setEmployerMatchIsCustom(false);
    } else if (opt.id === "custom") {
      setEmployerMatchEnabled(true);
      setEmployerMatchIsCustom(true);
    } else {
      setEmployerMatchEnabled(true);
      setEmployerMatchIsCustom(false);
      setAssumptions({
        ...state.assumptions,
        employerMatchPercentage: opt.pct,
        employerMatchCap: opt.cap,
      });
    }
  };

  const handleSourcePercentChange = (key: "preTax" | "roth" | "afterTax", value: number) => {
    const next = { ...state.sourceAllocation, [key]: Math.min(100, Math.max(0, value)) };
    const sum = next.preTax + next.roth + next.afterTax;
    if (sum <= 100) setSourceAllocation(next);
    else {
      const otherKeys = (["preTax", "roth", "afterTax"] as const).filter((k) => k !== key);
      const otherSum = otherKeys.reduce((s, k) => s + next[k], 0);
      const capped = Math.min(100, Math.max(0, 100 - otherSum));
      setSourceAllocation({ ...next, [key]: capped });
    }
  };

  const canContinue = contributionPct > 0 && contributionPct <= 100;

  const handleNext = useCallback(() => {
    if (!canContinue) return;
    const draft = loadEnrollmentDraft();
    if (draft) {
      saveEnrollmentDraft({
        ...draft,
        contributionType: "percentage",
        contributionAmount: contributionPct,
        sourceAllocation: state.sourceAllocation,
      });
    }
    navigate("/enrollment/future-contributions");
  }, [canContinue, contributionPct, state.sourceAllocation, navigate]);

  const sourceTotal = state.sourceAllocation.preTax + state.sourceAllocation.roth + state.sourceAllocation.afterTax;
  const sliderPct = ((Math.min(SLIDER_MAX, Math.max(SLIDER_MIN, contributionPct)) - SLIDER_MIN) / (SLIDER_MAX - SLIDER_MIN)) * 100;
  const [sourcesExpanded, setSourcesExpanded] = useState(true);
  const [focusedInput, setFocusedInput] = useState<"pct" | "dollar" | null>(null);
  const monthlyAmount = annualAmount / 12;
  const inputsActive = focusedInput !== null;
  const summaryText = `Monthly contribution: ${formatCurrency(derived.monthlyContribution ?? monthlyAmount)}`;

  return (
    <DashboardLayout header={<DashboardHeader />}>
      <div className="flex flex-col gap-6 w-full pb-24">
        <div className="enrollment-stepper-section">
          <EnrollmentStepper
            currentStep={1}
            title="Set Your Contribution Rate"
            subtitle="Choose how much to contribute to your retirement account. You can change this anytime."
          />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[2fr_1fr] items-start">
          <div className="contrib-section-card flex flex-col gap-10">
            {/* PRIMARY: How much do you wish to contribute? */}
            <section className="space-y-8">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                How much do you wish to Contribute?
              </h2>

              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Quick presets:</span>
                {PRESETS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handlePreset(p.percentage)}
                    className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all ${
                      activePreset === p.id && p.id === "safe"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800"
                        : activePreset === p.id && p.id === "aggressive"
                          ? "bg-orange-50 text-orange-700 border border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800"
                          : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* SLIDER: Primary interaction tool */}
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
                  <span>1%</span>
                  {state.employerMatchEnabled && state.assumptions.employerMatchCap > 0 && (
                    <span className="text-blue-600 dark:text-blue-400">
                      {state.assumptions.employerMatchCap}% employer match
                    </span>
                  )}
                  <span>25%</span>
                </div>
                <input
                  type="range"
                  min={SLIDER_MIN}
                  max={SLIDER_MAX}
                  value={Math.min(SLIDER_MAX, Math.max(SLIDER_MIN, contributionPct))}
                  onChange={handleSliderChange}
                  aria-label="Contribution percentage"
                  className="w-full h-3 rounded-full appearance-none bg-transparent [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer dark:[&::-webkit-slider-thumb]:border-slate-900 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-blue-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:cursor-pointer dark:[&::-moz-range-thumb]:border-slate-900"
                  style={{
                    background: `linear-gradient(to right, #2563eb 0%, #2563eb ${sliderPct}%, var(--slider-track-unfilled, #e2e8f0) ${sliderPct}%, var(--slider-track-unfilled, #e2e8f0) 100%)`,
                  } as React.CSSProperties}
                />
              </div>

              {/* % and $ inputs: grouped, linked, OR divider */}
              <div
                className={`rounded-xl border transition-colors ${
                  inputsActive
                    ? "border-slate-200 bg-slate-50/80 dark:border-slate-600 dark:bg-slate-800/50"
                    : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800"
                }`}
              >
                <div className="flex items-stretch divide-x divide-slate-200 dark:divide-slate-600">
                  <div className="flex flex-1 items-center gap-1.5 min-w-0 px-4 py-3">
                    <input
                      type="number"
                      value={contributionPct > 0 ? contributionPct : ""}
                      onChange={handlePercentageChange}
                      onFocus={() => setFocusedInput("pct")}
                      onBlur={() => setFocusedInput(null)}
                      placeholder="0"
                      min="0"
                      max="100"
                      step="0.1"
                      aria-label="Contribution percentage"
                      className="w-full min-w-0 bg-transparent text-2xl font-bold text-slate-900 focus:outline-none dark:text-slate-100 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="text-lg font-semibold text-slate-500 dark:text-slate-400 shrink-0">%</span>
                  </div>
                  <div className="flex shrink-0 items-center px-2">
                    <span className="text-xs font-medium text-slate-400 dark:text-slate-500">or</span>
                  </div>
                  <div className="flex flex-1 items-center gap-1.5 min-w-0 px-4 py-3">
                    <input
                      type="number"
                      value={dollarInput > 0 ? Math.round(dollarInput).toString() : ""}
                      onChange={handleDollarChange}
                      onFocus={() => setFocusedInput("dollar")}
                      onBlur={() => setFocusedInput(null)}
                      placeholder="0"
                      min="0"
                      step="1"
                      aria-label="Annual contribution amount"
                      className="w-full min-w-0 bg-transparent text-2xl font-bold text-slate-900 focus:outline-none dark:text-slate-100 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="text-lg font-semibold text-slate-500 dark:text-slate-400 shrink-0">$</span>
                  </div>
                </div>
              </div>

              {/* Paycheck impact - highlighted separately */}
              <div className="rounded-lg border border-emerald-200 bg-emerald-50/80 px-4 py-3 dark:border-emerald-800/60 dark:bg-emerald-950/40">
                <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
                  That&apos;s {formatCurrency(perPaycheck)} per paycheck.
                </p>
              </div>
            </section>

            {/* Employer Match */}
            <section className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Employer match</h3>
                <label className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={state.employerMatchEnabled}
                    onChange={(e) => setEmployerMatchEnabled(e.target.checked)}
                    className="peer sr-only"
                  />
                  <span className="relative block h-full w-full rounded-full bg-slate-200 transition-colors peer-checked:bg-blue-600 dark:bg-slate-600 dark:peer-checked:bg-blue-600 after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow-sm after:transition-transform after:content-[''] peer-checked:after:translate-x-5" />
                </label>
              </div>
              <div className="flex flex-wrap gap-2">
                {MATCH_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleMatchOption(opt)}
                    className={`rounded-full px-4 py-2.5 text-sm font-medium transition-all ${
                      activeMatch === opt.id
                        ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-sm dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800"
                        : "bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              {activeMatch === "custom" && state.employerMatchEnabled && (
                <div className="mt-4 flex flex-wrap gap-4 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-600 dark:bg-slate-800/50">
                  <div className="flex flex-1 min-w-[140px] items-center gap-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Match</label>
                    <input
                      type="number"
                      value={state.assumptions.employerMatchPercentage > 0 ? state.assumptions.employerMatchPercentage : ""}
                      onChange={(e) => {
                        const v = parseFloat(e.target.value);
                        setAssumptions({
                          ...state.assumptions,
                          employerMatchPercentage: e.target.value === "" ? 0 : Math.min(100, Math.max(0, isNaN(v) ? 0 : v)),
                        });
                      }}
                      placeholder="100"
                      min="0"
                      max="100"
                      step="1"
                      aria-label="Employer match percentage"
                      className="w-20 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                    />
                    <span className="text-sm text-slate-500 dark:text-slate-400">%</span>
                  </div>
                  <div className="flex flex-1 min-w-[140px] items-center gap-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Up to</label>
                    <input
                      type="number"
                      value={state.assumptions.employerMatchCap > 0 ? state.assumptions.employerMatchCap : ""}
                      onChange={(e) => {
                        const v = parseFloat(e.target.value);
                        setAssumptions({
                          ...state.assumptions,
                          employerMatchCap: e.target.value === "" ? 0 : Math.min(25, Math.max(0, isNaN(v) ? 0 : v)),
                        });
                      }}
                      placeholder="6"
                      min="0"
                      max="25"
                      step="0.5"
                      aria-label="Employer match cap (percentage of salary)"
                      className="w-20 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                    />
                    <span className="text-sm text-slate-500 dark:text-slate-400">% of salary</span>
                  </div>
                </div>
              )}
            </section>

            {/* Contribution Sources: Advanced (Optional) - demoted */}
            <section className="rounded-xl border border-slate-200 bg-slate-50/50 dark:border-slate-700 dark:bg-slate-800/40">
              <button
                type="button"
                onClick={() => setSourcesExpanded(!sourcesExpanded)}
                className="flex w-full items-center justify-between px-4 py-3 text-left"
              >
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Advanced (Optional)</span>
                <span className="text-slate-400 dark:text-slate-500">
                  {sourcesExpanded ? "−" : "+"}
                </span>
              </button>
              {sourcesExpanded && (
              <div className="border-t border-slate-200 dark:border-slate-600 px-4 pb-4 pt-3">
                <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Contribution Sources</span>
                  <div className="flex items-center gap-4">
                    <div className="inline-flex rounded-lg overflow-hidden border border-slate-200 dark:border-slate-600">
                      <button
                        type="button"
                        onClick={() => setSourcesViewMode("percent")}
                        className={`px-4 py-2.5 text-sm font-medium transition-colors ${
                          state.sourcesViewMode === "percent"
                            ? "bg-blue-600 text-white"
                            : "bg-white text-slate-600 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                        }`}
                      >
                        %
                      </button>
                      <button
                        type="button"
                        onClick={() => setSourcesViewMode("dollar")}
                        className={`px-4 py-2.5 text-sm font-medium transition-colors border-l border-slate-200 dark:border-slate-600 ${
                          state.sourcesViewMode === "dollar"
                            ? "bg-blue-600 text-white"
                            : "bg-white text-slate-600 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                        }`}
                      >
                        $
                      </button>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <span className="text-sm text-slate-500 dark:text-slate-400">Edit sources</span>
                      <div className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={state.sourcesEditMode}
                          onChange={(e) => setSourcesEditMode(e.target.checked)}
                          className="peer sr-only"
                        />
                        <span className="relative block h-full w-full rounded-full bg-slate-200 transition-colors peer-checked:bg-blue-600 dark:bg-slate-600 dark:peer-checked:bg-blue-600 after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow-sm after:transition-transform after:content-[''] peer-checked:after:translate-x-5" />
                      </div>
                    </label>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  {SOURCE_OPTIONS.map((opt) => {
                    const paycheckTotal = annualAmount / PAYCHECKS_PER_YEAR;
                    const sourcePerPaycheck = (state.sourceAllocation[opt.key] / 100) * paycheckTotal;
                    const displayValue =
                      state.sourcesViewMode === "percent"
                        ? state.sourceAllocation[opt.key] > 0
                          ? state.sourceAllocation[opt.key]
                          : ""
                        : state.sourceAllocation[opt.key] > 0
                          ? Math.round(sourcePerPaycheck)
                          : "";
                    return (
                      <div key={opt.id} className="flex justify-between items-center gap-4">
                        <label
                          className={`flex items-center gap-2 cursor-pointer ${
                            !state.sourcesEditMode ? "opacity-80 cursor-default" : ""
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={state.sourceAllocation[opt.key] > 0}
                            disabled={!state.sourcesEditMode}
                            onChange={(e) => {
                              const keys = ["preTax", "roth", "afterTax"] as const;
                              const current = state.sourceAllocation;
                              if (e.target.checked) {
                                const activeKeys = keys.filter((k) => current[k] > 0 || k === opt.key);
                                const count = activeKeys.length;
                                const equalShare = Math.round((100 / count) * 10) / 10;
                                const remainder = 100 - equalShare * (count - 1);
                                const next: { preTax: number; roth: number; afterTax: number } = {
                                  preTax: 0,
                                  roth: 0,
                                  afterTax: 0,
                                };
                                activeKeys.forEach((k, i) => {
                                  next[k] = i === 0 ? remainder : equalShare;
                                });
                                setSourceAllocation(next);
                              } else {
                                const next = { ...current, [opt.key]: 0 };
                                const remainingKeys = keys.filter((k) => next[k] > 0);
                                if (remainingKeys.length === 0) {
                                  setSourceAllocation({ preTax: 100, roth: 0, afterTax: 0 });
                                } else {
                                  const total = remainingKeys.reduce((s, k) => s + next[k], 0);
                                  const scale = total > 0 ? 100 / total : 1;
                                  remainingKeys.forEach((k) => {
                                    next[k] = Math.round(next[k] * scale * 10) / 10;
                                  });
                                  const diff = 100 - remainingKeys.reduce((s, k) => s + next[k], 0);
                                  if (diff !== 0 && remainingKeys[0]) next[remainingKeys[0]] += diff;
                                  setSourceAllocation(next);
                                }
                              }
                            }}
                            className="h-4 w-4 shrink-0 rounded border-slate-300 cursor-pointer accent-blue-600 disabled:cursor-not-allowed dark:border-slate-500"
                          />
                          <div className="flex flex-col gap-0.5">
                            <span className="text-sm text-slate-900 dark:text-slate-100">
                              <span className="font-semibold">{opt.main}</span>
                              {opt.sub && <span className="font-normal text-slate-500 dark:text-slate-400"> {opt.sub}</span>}
                            </span>
                            <span className="text-xs text-slate-400 dark:text-slate-500">Min 1% - Max 100%</span>
                          </div>
                        </label>
                        <div className="inline-flex w-28 shrink-0 overflow-hidden rounded-md border border-slate-200 bg-white transition-colors focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-900 dark:focus-within:border-blue-400 dark:focus-within:ring-blue-500/30">
                          <input
                            type="number"
                            value={displayValue}
                            onChange={(e) => {
                              const v = parseFloat(e.target.value);
                              if (state.sourcesViewMode === "percent") {
                                handleSourcePercentChange(opt.key, isNaN(v) ? 0 : v);
                              } else if (salary > 0 && !isNaN(v) && v >= 0) {
                                const paycheckTotalVal = annualAmount / PAYCHECKS_PER_YEAR;
                                const pct = paycheckTotalVal > 0 ? (v / paycheckTotalVal) * 100 : 0;
                                handleSourcePercentChange(opt.key, Math.min(100, Math.max(0, pct)));
                              } else if (e.target.value === "") {
                                handleSourcePercentChange(opt.key, 0);
                              }
                            }}
                            min="0"
                            max={state.sourcesViewMode === "percent" ? "100" : undefined}
                            disabled={state.sourceAllocation[opt.key] === 0 || !state.sourcesEditMode}
                            className="min-w-0 flex-1 border-0 bg-transparent px-3 py-2.5 text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-60 dark:text-slate-100 dark:placeholder-slate-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                          <span className="flex shrink-0 items-center bg-slate-100 px-3 py-2.5 text-sm font-medium text-slate-800 dark:bg-slate-700 dark:text-slate-200">
                            {state.sourcesViewMode === "percent" ? "%" : "$"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {sourceTotal !== 100 && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">Total must equal 100%</p>
                )}
              </div>
              )}
            </section>
          </div>

          <div className="flex flex-col gap-6">
            <article className="overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:shadow-black/30">
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-4">Your Paycheck Impact</h3>
              <div className="rounded-xl bg-sky-50/80 p-5 dark:bg-sky-950/30 dark:border dark:border-sky-900/30">
                <div className="space-y-1 mb-4">
                  <span className="text-xs font-medium uppercase tracking-wider text-sky-600 dark:text-sky-400">Per paycheck (bi-weekly)</span>
                  <p className="text-3xl font-bold text-sky-900 dark:text-sky-100">{formatCurrency(perPaycheck)}</p>
                </div>
                <p className="text-sm text-sky-800 dark:text-sky-100/90">
                  That&apos;s about {formatCurrency(monthlyAmount)} per month. A pre-tax deduction lowers your taxable income.
                </p>
              </div>
            </article>

            {/* Projection */}
            <article className="overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:shadow-black/30">
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-4">Projection</h3>
              <div className="min-h-[200px]">
                <ProjectionLineChart baseline={projectionBaseline.dataPoints} />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-3">
                Assumptions: {state.assumptions.annualReturnRate}% annual return, {state.assumptions.inflationRate}% inflation, retirement at age {retirementAge}.
              </p>
            </article>
          </div>
        </div>

        <EnrollmentFooter
          step={1}
          primaryLabel="Continue to Auto Increase"
          primaryDisabled={!canContinue}
          onPrimary={handleNext}
          summaryText={summaryText}
          getDraftSnapshot={() => ({
            contributionType: "percentage",
            contributionAmount: contributionPct,
            sourceAllocation: state.sourceAllocation,
          })}
        />
      </div>
    </DashboardLayout>
  );
};

const formatTooltipCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);

function ProjectionLineChart({ baseline }: { baseline: ProjectionDataPoint[] }) {
  const [tooltip, setTooltip] = useState<{ index: number; x: number; y: number } | null>(null);
  const points = baseline.length;
  if (points === 0) return <div className="flex items-center justify-center min-h-[160px] text-sm text-slate-500 dark:text-slate-400">No data</div>;

  const maxBalance = Math.max(...baseline.map((p) => p.balance));
  const yTicks = getYAxisTicks(maxBalance);
  const yMax = yTicks[yTicks.length - 1] ?? maxBalance;
  const minBalance = 0;
  const range = yMax - minBalance || 1;
  const w = 400;
  const h = 200;
  const padding = { top: 20, right: 12, bottom: 32, left: 56 };

  const xScale = (i: number) => padding.left + (i / Math.max(0, points - 1)) * (w - padding.left - padding.right);
  const yScale = (v: number) => h - padding.bottom - ((v - minBalance) / range) * (h - padding.top - padding.bottom);

  const chartWidth = w - padding.left - padding.right;
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const svgX = ((e.clientX - rect.left) / rect.width) * w;
    const index = Math.max(0, Math.min(points - 1, Math.round(((svgX - padding.left) / chartWidth) * (points - 1))));
    setTooltip({ index, x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const path = baseline
    .map((p, i) => `${i === 0 ? "M" : "L"} ${xScale(i)} ${yScale(p.balance)}`)
    .join(" ");

  const areaPath = `${path} L ${xScale(points - 1)} ${h - padding.bottom} L ${padding.left} ${h - padding.bottom} Z`;

  const currentYear = new Date().getFullYear();

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="contrib-chart block w-full"
        preserveAspectRatio="xMidYMid meet"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setTooltip(null)}
      >
        <defs>
          <linearGradient id="contrib-chart-gradient-baseline" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Horizontal grid lines */}
        {yTicks.map((v, i) => (
          <line
            key={i}
            x1={padding.left}
            y1={yScale(v)}
            x2={w - padding.right}
            y2={yScale(v)}
            className="contrib-chart-grid-line"
            strokeDasharray="3 3"
            strokeWidth="1"
          />
        ))}

        {/* Y-axis labels */}
        <g fill="currentColor" className="contrib-chart-axis-text">
          {yTicks.map((v, i) => (
            <text key={i} x={padding.left - 8} y={yScale(v)} textAnchor="end" dominantBaseline="middle" fontSize="10">
              {formatYAxisLabel(v)}
            </text>
          ))}
        </g>

        {/* X-axis labels */}
        <g fill="currentColor" className="contrib-chart-axis-text">
          <text x={xScale(0)} y={h - 10} textAnchor="start" fontSize="10">
            {currentYear}
          </text>
          <text x={xScale(baseline.length - 1)} y={h - 10} textAnchor="end" fontSize="10">
            {currentYear + baseline[baseline.length - 1].year}
          </text>
        </g>

        {/* Axis labels */}
        <text x={padding.left - 8} y={14} textAnchor="end" fontSize="9" className="contrib-chart-axis-label">
          Projected Balance
        </text>
        <text x={(padding.left + w - padding.right) / 2} y={h - 4} textAnchor="middle" fontSize="9" className="contrib-chart-axis-label">
          Years
        </text>

        <path d={areaPath} fill="url(#contrib-chart-gradient-baseline)" />
        <path d={path} fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {tooltip && (
        <div
          className="pointer-events-none absolute z-10 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-lg dark:border-slate-600 dark:bg-slate-800 dark:shadow-black/50"
          style={{ left: tooltip.x + 12, top: tooltip.y + 12, transform: "translate(0, -50%)" }}
        >
          <div className="font-medium text-slate-900 dark:text-slate-100">
            Year {new Date().getFullYear() + baseline[tooltip.index].year}
          </div>
          <div className="text-blue-600 dark:text-blue-400">
            {formatTooltipCurrency(baseline[tooltip.index].balance)}
          </div>
        </div>
      )}
    </div>
  );
}
