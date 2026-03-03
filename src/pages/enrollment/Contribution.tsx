import { useMemo, useCallback, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useEnrollment } from "../../enrollment/context/EnrollmentContext";
import { EnrollmentFooter } from "../../components/enrollment/EnrollmentFooter";
import { loadEnrollmentDraft, saveEnrollmentDraft } from "../../enrollment/enrollmentDraftStore";
import { useCoreAIModalOptional } from "../../context/CoreAIModalContext";
import Button from "../../components/ui/Button";
import { EnrollmentPageContent } from "../../components/enrollment/EnrollmentPageContent";
import { FinancialSlider } from "../../components/FinancialSlider";
import { SegmentedToggle } from "../../components/ui/SegmentedToggle";
import { Info } from "lucide-react";
import {
  PAYCHECKS_PER_YEAR,
  percentageToAnnualAmount,
  annualAmountToPercentage,
  deriveContribution,
} from "../../enrollment/logic/contributionCalculator";
import { calculateProjection } from "../../enrollment/logic/projectionCalculator";
import {
  rebalanceSources,
  allocationToSources,
  mergeLocks,
  sourcesToAllocation,
  getLockedIds,
} from "../../enrollment/logic/sourceAllocationEngine";
import type { ProjectionDataPoint } from "../../enrollment/logic/types";
import { formatYAxisLabel, getYAxisTicks } from "../../utils/projectionChartAxis";

/* ── Constants (unchanged) ── */
const SLIDER_MIN = 1;
const SLIDER_MAX = 25;

const PRESETS = [
  { id: "safe", labelKey: "enrollment.presetSafe", percentage: 4 },
  { id: "match", labelKey: "enrollment.presetEmployerMatch", percentage: 6 },
  { id: "aggressive", labelKey: "enrollment.presetAggressive", percentage: 8 },
] as const;

const SOURCE_IDS = ["preTax", "roth", "afterTax"] as const;
const SOURCE_OPTIONS = [
  { id: "preTax", mainKey: "enrollment.preTax", subKey: "enrollment.preTaxSub", key: "preTax" as const },
  { id: "roth", mainKey: "enrollment.roth", subKey: "enrollment.rothSub", key: "roth" as const },
  { id: "afterTax", mainKey: "enrollment.afterTax", subKey: "enrollment.afterTaxSub", key: "afterTax" as const },
] as const;

const LOCALE_MAP: Record<string, string> = {
  en: "en-US",
  fr: "fr-FR",
  es: "es-ES",
  ta: "ta-IN",
  zh: "zh-CN",
  ja: "ja-JP",
  de: "de-DE",
  hi: "hi-IN",
};

const CONTRIBUTION_ASK_AI_PROMPT =
  "Explain how retirement contributions work and how this affects my future savings.";

export const Contribution = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const lang = (i18n.language ?? "en").split("-")[0];
  const locale = LOCALE_MAP[lang] ?? LOCALE_MAP.en ?? "en-US";
  const coreAI = useCoreAIModalOptional();
  const {
    state,
    setContributionType,
    setContributionAmount,
    setSourceAllocation,
    setSourcesEditMode,
    setSourcesViewMode,
    perPaycheck,
  } = useEnrollment();

  const selectedPlanId = state.selectedPlan;
  const salary = state.salary || 72000;
  const currentAge = state.currentAge || 40;
  const retirementAge = state.retirementAge || 67;

  useEffect(() => {
    if (state.isInitialized && !selectedPlanId) {
      navigate("/enrollment/choose-plan", { replace: true });
    }
  }, [state.isInitialized, selectedPlanId, navigate]);

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
    [contributionPct, salary, state.employerMatchEnabled, state.assumptions.employerMatchCap, state.assumptions.employerMatchPercentage, currentAge, retirementAge]
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
    [currentAge, retirementAge, state.currentBalance, derived.monthlyContribution, derived.employerMatchMonthly, state.employerMatchEnabled, state.assumptions.annualReturnRate, state.assumptions.inflationRate]
  );

  const activePreset = PRESETS.find((p) => p.percentage === contributionPct)?.id ?? null;

  const formatCurrency = useCallback(
    (n: number) =>
      new Intl.NumberFormat(locale, { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
        Number.isFinite(n) && n >= 0 ? n : 0
      ),
    [locale]
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

  const [lockedSourceIds, setLockedSourceIds] = useState<Set<string>>(() => new Set());
  const sourceTotal = state.sourceAllocation.preTax + state.sourceAllocation.roth + state.sourceAllocation.afterTax;
  const hasUserEditedAllocationRef = useRef(false);
  const prevContributionPctRef = useRef<number | null>(null);

  /* Sync: Contribution % is source of truth. When contribution % changes (not on mount) and
   * user has not edited allocation, set default 100% Pre-tax. If user has edited, split
   * is unchanged so effective % scales proportionally. */
  useEffect(() => {
    const prev = prevContributionPctRef.current;
    prevContributionPctRef.current = contributionPct;
    if (prev === null) return; // skip initial mount
    if (!hasUserEditedAllocationRef.current) {
      setSourceAllocation({ preTax: 100, roth: 0, afterTax: 0 });
    }
  }, [contributionPct, setSourceAllocation]);

  const handleSourcePercentChange = useCallback(
    (key: "preTax" | "roth" | "afterTax", value: number) => {
      const allocation = state.sourceAllocation;
      const sources = mergeLocks(
        allocationToSources(allocation, [...SOURCE_IDS]),
        lockedSourceIds
      );
      const result = rebalanceSources(sources, key, value);
      const newAllocation = sourcesToAllocation(result, [...SOURCE_IDS]) as {
        preTax: number;
        roth: number;
        afterTax: number;
      };
      hasUserEditedAllocationRef.current = true;
      setSourceAllocation(newAllocation);
      setLockedSourceIds(getLockedIds(result));
    },
    [state.sourceAllocation, lockedSourceIds, setSourceAllocation]
  );

  /** Set source by effective % of salary; converts to split and rebalances. Clamps so allocation sum ≤ 100. */
  const handleSourceEffectivePctChange = useCallback(
    (key: "preTax" | "roth" | "afterTax", effectivePct: number) => {
      if (contributionPct <= 0) {
        handleSourcePercentChange(key, 0);
        return;
      }
      const splitValue = Math.min(100, Math.max(0, (effectivePct / contributionPct) * 100));
      handleSourcePercentChange(key, Math.round(splitValue * 100) / 100);
    },
    [contributionPct, handleSourcePercentChange]
  );

  const allocationValid = Math.abs(sourceTotal - 100) < 0.01;

  const saveDraftForNextStep = useCallback(() => {
    try {
      const draft = loadEnrollmentDraft();
      if (draft) {
        saveEnrollmentDraft({
          ...draft,
          contributionType: "percentage",
          contributionAmount: contributionPct,
          sourceAllocation: state.sourceAllocation,
        });
      }
    } catch (_) {
      // ignore
    }
  }, [contributionPct, state.sourceAllocation]);

  const getDraftSnapshot = useCallback(
    () => ({
      contributionType: "percentage" as const,
      contributionAmount: contributionPct,
      sourceAllocation: state.sourceAllocation,
    }),
    [contributionPct, state.sourceAllocation]
  );

  const sliderPct = ((Math.min(SLIDER_MAX, Math.max(SLIDER_MIN, contributionPct)) - SLIDER_MIN) / (SLIDER_MAX - SLIDER_MIN)) * 100;
  const [focusedInput, setFocusedInput] = useState<"pct" | "dollar" | null>(null);
  const monthlyAmount = annualAmount / 12;
  const inputsActive = focusedInput !== null;
  const employerMatchPerPaycheck = derived.employerMatchMonthly / 2;
  const totalPerPaycheck = perPaycheck + employerMatchPerPaycheck;
  const projectedTotal = projectionBaseline.dataPoints.length > 0
    ? projectionBaseline.dataPoints[projectionBaseline.dataPoints.length - 1].balance
    : 0;

  return (
    <EnrollmentPageContent
      headerContent={
        <div className="space-y-2">
          {coreAI && (
            <button
              type="button"
              onClick={() => coreAI.openWithPrompt(CONTRIBUTION_ASK_AI_PROMPT)}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors hover:opacity-80"
              style={{ color: "var(--enroll-brand)" }}
              aria-label={t("enrollment.whatIsContribution")}
            >
              <Info className="h-4 w-4" aria-hidden />
              <span>{t("enrollment.whatIsContribution")}</span>
            </button>
          )}
          <div>
            <h1 className="text-xl md:text-2xl font-bold leading-tight" style={{ color: "var(--enroll-text-primary)" }}>
              {t("enrollment.designSavingsTitle")}
            </h1>
            <p className="mt-1 text-base leading-relaxed max-w-xl" style={{ color: "var(--enroll-text-secondary)" }}>
              {t("enrollment.contributionPageSubtitle")}
            </p>
          </div>
        </div>
      }
    >
      <div className="enrollment-container">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start space-y-8 lg:space-y-0">
        {/* ═══ LEFT: Contribution builder (2 cols) ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="lg:col-span-2 space-y-8"
        >
          {/* ── Contribution builder card (dominant) ── */}
          <div className="rounded-2xl border shadow-sm p-6 sm:p-8 space-y-6" style={{ borderColor: "var(--enroll-card-border)", background: "var(--enroll-card-bg)" }}>
            <div>
              <span className="text-sm font-medium" style={{ color: "var(--enroll-text-muted)" }}>{t("enrollment.quickPresets")}</span>
              <div className="flex flex-wrap items-center gap-3 mt-2">
                {PRESETS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handlePreset(p.percentage)}
                    className="rounded-full px-5 py-2 text-sm font-medium transition-all duration-200"
                    style={{
                      background: activePreset === p.id
                        ? (p.id === "safe" || p.id === "match" ? "rgb(var(--enroll-accent-rgb) / 0.08)" : "rgb(var(--enroll-brand-rgb) / 0.08)")
                        : "var(--enroll-soft-bg)",
                      color: activePreset === p.id
                        ? (p.id === "safe" || p.id === "match" ? "var(--enroll-accent)" : "var(--enroll-brand)")
                        : "var(--enroll-text-secondary)",
                      border: `1px solid ${activePreset === p.id
                        ? (p.id === "safe" || p.id === "match" ? "rgb(var(--enroll-accent-rgb) / 0.2)" : "rgb(var(--enroll-brand-rgb) / 0.2)")
                        : "var(--enroll-card-border)"}`,
                    }}
                  >
                    {t(p.labelKey)}
                  </button>
                ))}
              </div>
            </div>

            {/* Current % prominent above slider */}
            <div className="space-y-4">
              <p className="text-4xl font-semibold tabular-nums" style={{ color: "var(--enroll-brand)" }}>
                {contributionPct > 0 ? `${contributionPct}%` : "0%"}
              </p>
              <div className="space-y-3">
                <div className="flex justify-between text-sm font-medium" style={{ color: "var(--enroll-text-muted)" }}>
                  <span>{SLIDER_MIN}%</span>
                  <span>{SLIDER_MAX}%</span>
                </div>
                <input
                  type="range"
                  min={SLIDER_MIN}
                  max={SLIDER_MAX}
                  value={Math.min(SLIDER_MAX, Math.max(SLIDER_MIN, contributionPct))}
                  onChange={handleSliderChange}
                  aria-label={t("enrollment.contributionPercentageAria")}
                  className="contribution-page-slider"
                  style={{
                    background: `linear-gradient(to right, var(--enroll-brand) 0%, var(--enroll-brand) ${sliderPct}%, var(--enroll-soft-bg) ${sliderPct}%, var(--enroll-soft-bg) 100%)`,
                  } as React.CSSProperties}
                />
              </div>
            </div>

            {/* Dollar/yr and Percentage inputs */}
            <div
              className="rounded-xl transition-all duration-200"
              style={{
                border: inputsActive ? "1px solid var(--enroll-brand)" : "1px solid var(--enroll-card-border)",
                background: "var(--enroll-card-bg)",
              }}
            >
              <div className="flex items-stretch" style={{ borderColor: "var(--enroll-card-border)" }}>
                <div className="flex flex-1 items-center gap-1.5 min-w-0 px-4 py-3">
                  <span className="text-2xl font-bold shrink-0" style={{ color: "var(--enroll-text-muted)" }}>$</span>
                  <input
                    type="number"
                    value={dollarInput > 0 ? Math.round(dollarInput).toString() : ""}
                    onChange={handleDollarChange}
                    onFocus={() => setFocusedInput("dollar")}
                    onBlur={() => setFocusedInput(null)}
                    placeholder="0"
                    min="0"
                    step="1"
                    aria-label={t("enrollment.annualContributionAria")}
                    className="w-full min-w-0 bg-transparent text-2xl font-bold focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    style={{ color: "var(--enroll-text-primary)" }}
                  />
                  <span className="text-lg font-semibold shrink-0" style={{ color: "var(--enroll-text-muted)" }}>{t("enrollment.dollarPerYear")}</span>
                </div>
                <div
                  className="flex shrink-0 items-center px-2"
                  style={{ borderLeft: "1px solid var(--enroll-card-border)", borderRight: "1px solid var(--enroll-card-border)" }}
                >
                  <span className="text-xs font-medium" style={{ color: "var(--enroll-text-muted)" }}>{t("enrollment.contributionOr")}</span>
                </div>
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
                    aria-label={t("enrollment.contributionPercentageAria")}
                    className="w-full min-w-0 bg-transparent text-2xl font-bold focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    style={{ color: "var(--enroll-text-primary)" }}
                  />
                  <span className="text-lg font-semibold shrink-0" style={{ color: "var(--enroll-text-muted)" }}>%</span>
                </div>
              </div>
            </div>

            {/* Split contributions — merged into same card, always visible */}
            <div className="pt-6 space-y-5" style={{ borderTop: "1px solid var(--enroll-card-border)" }}>
              <div>
                <h3 className="text-lg font-semibold" style={{ color: "var(--enroll-text-primary)" }}>
                  {t("enrollment.splitContributionsTitle")}
                </h3>
                <p className="text-sm mt-1" style={{ color: "var(--enroll-text-muted)" }}>
                  {t("enrollment.splitContributionsSupporting")}
                </p>
              </div>
                    <div className="space-y-5">
                      <div className="flex flex-wrap justify-between items-center gap-3 sm:gap-4">
                        <span className="text-sm font-semibold shrink-0" style={{ color: "var(--enroll-text-primary)" }}>
                          {t("enrollment.contributionSources")}
                        </span>
                        <div className="flex flex-wrap items-center gap-3 shrink-0 min-w-0">
                          <SegmentedToggle<"dollar" | "percent">
                            options={[
                              { value: "dollar", label: "$" },
                              { value: "percent", label: "%" },
                            ]}
                            value={state.sourcesViewMode}
                            onChange={setSourcesViewMode}
                            aria-label={t("enrollment.sourcesInputMode")}
                          />
                          <label className="flex items-center gap-2 cursor-pointer shrink-0">
                            <span className="text-xs font-medium" style={{ color: "var(--enroll-text-muted)" }}>{t("enrollment.edit")}</span>
                            <div className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={state.sourcesEditMode}
                                onChange={(e) => setSourcesEditMode(e.target.checked)}
                                className="peer sr-only"
                              />
                              <span className="relative block h-full w-full rounded-full transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-surface-primary after:shadow-sm after:transition-transform after:content-[''] peer-checked:after:translate-x-4"
                                style={{
                                  background: state.sourcesEditMode ? "var(--enroll-brand)" : "var(--enroll-soft-bg)",
                                  border: state.sourcesEditMode ? "none" : "1px solid var(--enroll-card-border)",
                                }}
                              />
                            </div>
                          </label>
                        </div>
                      </div>
                      <div className="flex flex-col gap-5">
                        {SOURCE_OPTIONS.map((opt) => {
                          const paycheckTotal = annualAmount / PAYCHECKS_PER_YEAR;
                          const splitPct = state.sourceAllocation[opt.key];
                          const effectivePctOfSalary = (splitPct / 100) * contributionPct;
                          const sourcePerPaycheck = (splitPct / 100) * paycheckTotal;
                          const isSourceActive = splitPct > 0;
                          const isSliderDisabled = !isSourceActive || !state.sourcesEditMode;
                          const dollarValue = sourcePerPaycheck > 0 ? Math.round(sourcePerPaycheck) : "";
                          return (
                            <div key={opt.id} className="flex flex-col gap-2 min-w-0">
                              <div className="flex justify-between items-center gap-4 min-w-0">
                                <label
                                  className={`flex items-center gap-2 cursor-pointer min-w-0 ${!state.sourcesEditMode ? "opacity-80 cursor-default" : ""}`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={isSourceActive}
                                    disabled={!state.sourcesEditMode}
                                    onChange={(e) => {
                                      const keys = ["preTax", "roth", "afterTax"] as const;
                                      const current = state.sourceAllocation;
                                      if (e.target.checked) {
                                        const activeKeys = keys.filter((k) => current[k] > 0 || k === opt.key);
                                        const count = activeKeys.length;
                                        const equalShare = Math.round((100 / count) * 10) / 10;
                                        const remainder = 100 - equalShare * (count - 1);
                                        const next: { preTax: number; roth: number; afterTax: number } = { preTax: 0, roth: 0, afterTax: 0 };
                                        activeKeys.forEach((k, i) => { next[k] = i === 0 ? remainder : equalShare; });
                                        setSourceAllocation(next);
                                        setLockedSourceIds(new Set());
                                      } else {
                                        const next = { ...current, [opt.key]: 0 };
                                        const remainingKeys = keys.filter((k) => next[k] > 0);
                                        if (remainingKeys.length === 0) {
                                          setSourceAllocation({ preTax: 100, roth: 0, afterTax: 0 });
                                          setLockedSourceIds(new Set());
                                        } else {
                                          const total = remainingKeys.reduce((s, k) => s + next[k], 0);
                                          const scale = total > 0 ? 100 / total : 1;
                                          remainingKeys.forEach((k) => { next[k] = Math.round(next[k] * scale * 10) / 10; });
                                          const diff = 100 - remainingKeys.reduce((s, k) => s + next[k], 0);
                                          if (diff !== 0 && remainingKeys[0]) next[remainingKeys[0]] += diff;
                                          setSourceAllocation(next);
                                          setLockedSourceIds((prev) => {
                                            const nextSet = new Set(prev);
                                            nextSet.delete(opt.key);
                                            return nextSet;
                                          });
                                        }
                                      }
                                    }}
                                    className="h-4 w-4 shrink-0 rounded cursor-pointer disabled:cursor-not-allowed"
                                    style={{ accentColor: "var(--enroll-brand)" }}
                                  />
                                  <div className="flex flex-col gap-0.5">
                                    <span className="text-sm" style={{ color: "var(--enroll-text-primary)" }}>
                                      <span className="font-semibold">{t(opt.mainKey)}</span>
                                      {opt.subKey && <span className="font-normal" style={{ color: "var(--enroll-text-muted)" }}> {t(opt.subKey)}</span>}
                                    </span>
                                  </div>
                                </label>
                                <div className="flex flex-wrap items-center gap-2 shrink-0 min-w-0">
                                  {state.sourcesViewMode === "percent" ? (
                                    <div className="inline-flex overflow-hidden rounded-lg border border-[var(--enroll-card-border)] bg-[var(--enroll-card-bg)]">
                                      <input
                                        type="number"
                                        min={0}
                                        max={contributionPct}
                                        step={0.1}
                                        value={effectivePctOfSalary > 0 ? (Math.round(effectivePctOfSalary * 100) / 100) : ""}
                                        onChange={(e) => {
                                          const v = parseFloat(e.target.value);
                                          if (!isNaN(v) && v >= 0) {
                                            handleSourceEffectivePctChange(opt.key, Math.min(contributionPct, v));
                                          } else if (e.target.value === "") {
                                            handleSourceEffectivePctChange(opt.key, 0);
                                          }
                                        }}
                                        disabled={!isSourceActive || !state.sourcesEditMode}
                                        placeholder="0"
                                        className="w-16 sm:w-20 border-0 bg-transparent px-2 py-1.5 text-sm font-semibold tabular-nums focus:outline-none focus:ring-0 disabled:opacity-60 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        style={{ color: "var(--enroll-text-primary)" }}
                                      />
                                      <span className="flex items-center pr-2 text-sm font-medium" style={{ color: "var(--enroll-text-muted)" }}>%</span>
                                    </div>
                                  ) : (
                                    <div className="inline-flex overflow-hidden rounded-lg border border-[var(--enroll-card-border)] bg-[var(--enroll-card-bg)]">
                                      <span className="flex items-center pl-2 text-sm font-medium shrink-0" style={{ color: "var(--enroll-text-secondary)" }}>$</span>
                                      <input
                                        type="number"
                                        value={dollarValue}
                                        onChange={(e) => {
                                          const v = parseFloat(e.target.value);
                                          if (salary > 0 && !isNaN(v) && v >= 0 && paycheckTotal > 0) {
                                            const pctFromDollar = (v / paycheckTotal) * 100;
                                            handleSourcePercentChange(opt.key, Math.min(100, Math.max(0, pctFromDollar)));
                                          } else if (e.target.value === "" || (typeof v === "number" && isNaN(v))) {
                                            handleSourcePercentChange(opt.key, 0);
                                          }
                                        }}
                                        min={0}
                                        step={1}
                                        disabled={!isSourceActive || !state.sourcesEditMode}
                                        placeholder="0"
                                        className="w-16 sm:w-20 min-w-0 border-0 bg-transparent px-2 py-1.5 text-sm font-semibold tabular-nums focus:outline-none focus:ring-0 disabled:opacity-60 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        style={{ color: "var(--enroll-text-primary)" }}
                                      />
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="mt-1 min-w-0 w-full">
                                <FinancialSlider
                                  value={splitPct}
                                  fillPercent={splitPct}
                                  min={0}
                                  max={100}
                                  step={0.5}
                                  disabled={isSliderDisabled}
                                  onChange={(e) => handleSourcePercentChange(opt.key, Number(e.target.value))}
                                  aria-label={t(opt.mainKey)}
                                  minLabel={t("enrollment.sliderMinLabel")}
                                  maxLabel={t("enrollment.sliderMaxLabel")}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex items-center justify-between pt-2" style={{ borderTop: "1px solid var(--enroll-card-border)" }}>
                        <span className="text-sm font-medium" style={{ color: "var(--enroll-text-muted)" }}>{t("enrollment.totalContributionOfSalary")}</span>
                        <span
                          className="text-sm font-bold tabular-nums"
                          style={{ color: allocationValid ? "var(--enroll-text-primary)" : "var(--color-warning)" }}
                        >
                          {Math.round(contributionPct * 10) / 10}%
                        </span>
                      </div>
                      {!allocationValid && (
                        <p className="text-sm mt-2" style={{ color: "var(--color-danger)" }}>
                          Allocation must total 100% to continue.
                        </p>
                      )}
                    </div>
            </div>
          </div>
        </motion.div>

        {/* ═══ RIGHT: Outcome panel (1 col) ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="lg:col-span-1"
        >
          <div className="lg:sticky lg:top-24 space-y-6">
            {/* Per Paycheck card — strong hierarchy: primary total, support blocks, future view, tax note. Subtle gradient behind total. */}
            <div
              className="rounded-2xl border shadow-sm overflow-hidden"
              style={{
                borderColor: "var(--enroll-card-border)",
                background: "var(--enroll-card-bg)",
              }}
            >
              <div className="p-6">
                {/* Top: primary focus — large total with subtle gradient highlight */}
                <div
                  className="relative rounded-xl p-4 sm:p-5"
                  style={{
                    background: "linear-gradient(135deg, rgb(var(--enroll-brand-rgb) / 0.06) 0%, transparent 60%)",
                  }}
                >
                  <p className="text-3xl sm:text-4xl font-bold tabular-nums tracking-tight" style={{ color: "var(--enroll-text-primary)" }}>
                    {formatCurrency(totalPerPaycheck)}
                  </p>
                  <p className="mt-1 text-sm font-medium" style={{ color: "var(--enroll-text-secondary)" }}>
                    {t("enrollment.totalPerPaycheckLabel")}
                  </p>
                </div>

                {/* Second layer: You contribute | Employer adds — equal weight, employer with accent */}
                <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="rounded-xl p-4" style={{ background: "var(--enroll-soft-bg)" }}>
                    <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--enroll-text-muted)" }}>
                      {t("enrollment.youContributeShort")}
                    </p>
                    <p className="mt-1 text-lg font-semibold tabular-nums" style={{ color: "var(--enroll-text-primary)" }}>
                      {formatCurrency(perPaycheck)}
                    </p>
                  </div>
                  <div className="rounded-xl p-4" style={{ background: "var(--enroll-soft-bg)" }}>
                    <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--enroll-text-muted)" }}>
                      {t("enrollment.employerAddsShort")}
                    </p>
                    <p className="mt-1 text-lg font-semibold tabular-nums" style={{ color: "var(--enroll-accent)" }}>
                      {formatCurrency(employerMatchPerPaycheck)}
                    </p>
                  </div>
                </div>

                {/* Third layer: future view — smaller weight */}
                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-baseline">
                  <div>
                    <p className="text-xs font-medium" style={{ color: "var(--enroll-text-muted)" }}>
                      {t("enrollment.estimatedMonthlyTotal")}
                    </p>
                    <p className="text-sm font-semibold tabular-nums mt-0.5" style={{ color: "var(--enroll-text-primary)" }}>
                      {formatCurrency(derived.totalMonthlyInvestment)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium" style={{ color: "var(--enroll-text-muted)" }}>
                      {t("enrollment.projectedAnnualTotal")}
                    </p>
                    <p className="text-sm font-semibold tabular-nums mt-0.5" style={{ color: "var(--enroll-text-primary)" }}>
                      {formatCurrency(derived.totalMonthlyInvestment * 12)}
                    </p>
                  </div>
                </div>

                {/* Bottom: subtle tax note */}
                {state.sourceAllocation.preTax > 0 && (
                  <p className="mt-4 pt-4 text-xs leading-relaxed border-t border-[var(--enroll-card-border)]" style={{ color: "var(--enroll-text-muted)" }}>
                    {t("enrollment.preTaxLowersTaxable")}
                  </p>
                )}
              </div>
            </div>

            {/* Projected at retirement */}
            <div
              className="rounded-2xl border shadow-sm p-6 md:p-8"
              style={{ borderColor: "var(--enroll-card-border)", background: "var(--enroll-card-bg)" }}
            >
              <h3
                className="text-xs font-semibold uppercase tracking-wider mb-1"
                style={{ color: "var(--enroll-text-muted)" }}
              >
                {t("enrollment.projectedAtRetirement")}
              </h3>
              {projectedTotal > 0 ? (
                <>
                  <motion.p
                    key={Math.round(projectedTotal)}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-4xl font-bold tabular-nums"
                    style={{ color: "var(--enroll-text-primary)" }}
                  >
                    {new Intl.NumberFormat(locale, { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(projectedTotal)}
                  </motion.p>
                  <p className="text-sm mt-1" style={{ color: "var(--enroll-text-muted)" }}>
                    {t("enrollment.byAgeYears", { age: retirementAge, years: retirementAge - currentAge })}
                  </p>
                  <div
                    className="mt-6 rounded-xl p-4"
                    style={{
                      background: "rgb(var(--enroll-brand-rgb) / 0.04)",
                      border: "1px solid rgb(var(--enroll-brand-rgb) / 0.08)",
                    }}
                  >
                    <div className="min-h-[180px]">
                      <ProjectionLineChart baseline={projectionBaseline.dataPoints} locale={locale} />
                    </div>
                  </div>
                  <p className="text-xs leading-relaxed mt-3" style={{ color: "var(--enroll-text-muted)" }}>
                    {t("enrollment.assumesReturnInflation", { return: state.assumptions.annualReturnRate, inflation: state.assumptions.inflationRate })}
                  </p>
                </>
              ) : (
                <div className="mt-4 rounded-xl p-6 min-h-[180px] flex flex-col items-center justify-center text-center" style={{ background: "var(--enroll-soft-bg)", border: "1px solid var(--enroll-card-border)" }}>
                  <p className="text-sm" style={{ color: "var(--enroll-text-muted)" }}>
                    {t("enrollment.startContributingToSeeProjection")}
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      <EnrollmentFooter
        primaryLabel={t("enrollment.continueToAutoIncrease")}
        onPrimary={saveDraftForNextStep}
        getDraftSnapshot={getDraftSnapshot}
        inContent
      />
      </div>
    </EnrollmentPageContent>
  );
};

/* ═══════════════════════════════════════════════════════════════
   Projection Line Chart (unchanged logic)
   ═══════════════════════════════════════════════════════════════ */

function ProjectionLineChart({ baseline, locale }: { baseline: ProjectionDataPoint[]; locale: string }) {
  const { t } = useTranslation();
  const formatTooltipCurrency = useCallback(
    (n: number) =>
      new Intl.NumberFormat(locale, { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n),
    [locale]
  );
  const [tooltip, setTooltip] = useState<{ index: number; x: number; y: number } | null>(null);
  const points = baseline.length;
  if (points === 0) return <div className="flex items-center justify-center min-h-[160px] text-sm" style={{ color: "var(--enroll-text-muted)" }}>{t("enrollment.noData")}</div>;

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
            <stop offset="0%" stopColor="var(--enroll-brand)" stopOpacity="0.12" />
            <stop offset="100%" stopColor="var(--enroll-brand)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {yTicks.map((v, i) => (
          <line key={i} x1={padding.left} y1={yScale(v)} x2={w - padding.right} y2={yScale(v)} className="contrib-chart-grid-line" strokeDasharray="3 3" strokeWidth="1" />
        ))}

        <g fill="currentColor" className="contrib-chart-axis-text">
          {yTicks.map((v, i) => (
            <text key={i} x={padding.left - 8} y={yScale(v)} textAnchor="end" dominantBaseline="middle" fontSize="10">{formatYAxisLabel(v)}</text>
          ))}
        </g>

        <g fill="currentColor" className="contrib-chart-axis-text">
          <text x={xScale(0)} y={h - 10} textAnchor="start" fontSize="10">{currentYear}</text>
          <text x={xScale(baseline.length - 1)} y={h - 10} textAnchor="end" fontSize="10">{currentYear + baseline[baseline.length - 1].year}</text>
        </g>

        <path d={areaPath} fill="url(#contrib-chart-gradient-baseline)" />
        <path d={path} fill="none" stroke="var(--enroll-brand)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {tooltip && (
        <div
          className="pointer-events-none absolute z-10 rounded-lg px-3 py-2 text-sm"
          style={{
            left: tooltip.x + 12,
            top: tooltip.y + 12,
            transform: "translate(0, -50%)",
            background: "var(--enroll-card-bg)",
            border: "1px solid var(--enroll-card-border)",
            boxShadow: "var(--enroll-elevation-2)",
          }}
        >
          <div className="font-medium" style={{ color: "var(--enroll-text-primary)" }}>
            {t("enrollment.yearLabel", { year: new Date().getFullYear() + baseline[tooltip.index].year })}
          </div>
          <div className="font-semibold" style={{ color: "var(--enroll-brand)" }}>
            {formatTooltipCurrency(baseline[tooltip.index].balance)}
          </div>
        </div>
      )}
    </div>
  );
}
