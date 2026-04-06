import { useMemo, useCallback, useState, useRef, useEffect, type CSSProperties, type ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useEnrollment } from "@/enrollment/context/EnrollmentContext";
import { EnrollmentFooter } from "@/components/enrollment/EnrollmentFooter";
import { loadEnrollmentDraft, saveEnrollmentDraft } from "@/enrollment/enrollmentDraftStore";
import { useAIAssistantStore } from "@/stores/aiAssistantStore";
import { EnrollmentAiHint } from "@/components/ai/EnrollmentAiHint";
import { EnrollmentPageContent } from "@/components/enrollment/EnrollmentPageContent";
import { FinancialSlider } from "@/components/FinancialSlider";
import { Info, Check, ChevronDown, ChevronUp, Wallet, SlidersHorizontal, ArrowRight, TrendingUp, Shield, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  PAYCHECKS_PER_YEAR,
  percentageToAnnualAmount,
  annualAmountToPercentage,
  deriveContribution,
  monthlyEmployerMatchForPreTaxShare,
} from "@/enrollment/logic/contributionCalculator";
import { calculateProjection } from "@/enrollment/logic/projectionCalculator";
import {
  rebalanceSources,
  allocationToSources,
  mergeLocks,
  sourcesToAllocation,
  getLockedIds,
} from "@/enrollment/logic/sourceAllocationEngine";
import type { ProjectionDataPoint } from "@/enrollment/logic/types";
import { formatYAxisLabel, getYAxisTicks } from "@/utils/projectionChartAxis";
import { getRoutingVersion, withVersion } from "@/core/version";

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

/** Reuse V1 enrollment strings for the tax-split UI (same copy as `/v1/enrollment/source`). */
const V1_SA = "enrollment.v1.sourceAllocation.";
const PLAN_DEFAULT_TAX = { preTax: 60, roth: 40, afterTax: 0 } as const;

/** Light grey for Pre-tax / Roth / After-tax blocks — subtle tint vs full secondary surface. */
const TAX_SOURCE_PANEL_BG =
  "color-mix(in srgb, var(--color-background-secondary) 22%, var(--color-background) 78%)";

function asStringArrayTax(v: unknown): string[] {
  return Array.isArray(v) ? v.map(String) : [];
}

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

const V2_EXPLAIN_ACCENT: Record<"pretax" | "roth" | "aftertax", { icon: string; check: string }> = {
  pretax: { icon: "bg-[var(--color-primary)]", check: "text-[var(--color-primary)]" },
  roth: { icon: "bg-purple-600", check: "text-purple-600" },
  aftertax: { icon: "bg-orange-500", check: "text-orange-500" },
};

function V2TaxExplainCard({
  title,
  subtitle,
  icon,
  variant,
  items,
  className,
}: {
  title: string;
  subtitle: string;
  icon: ReactNode;
  variant: "pretax" | "roth" | "aftertax";
  items: string[];
  className?: string;
}) {
  const accent = V2_EXPLAIN_ACCENT[variant];
  return (
    <div
      className={cn(
        "rounded-xl border p-4 transition-all hover:-translate-y-px hover:shadow-md",
        className,
      )}
      style={{ borderColor: "var(--enroll-card-border)", background: TAX_SOURCE_PANEL_BG }}
    >
      <div className="mb-3 flex items-start gap-2.5">
        <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white", accent.icon)}>
          {icon}
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-semibold" style={{ color: "var(--enroll-text-primary)" }}>
            {title}
          </h3>
          <p className="mt-0.5 text-xs" style={{ color: "var(--enroll-text-muted)" }}>
            {subtitle}
          </p>
        </div>
      </div>
      <div className="space-y-1.5">
        {items.map((line) => (
          <div key={line} className="flex items-start gap-2">
            <Check className={cn("mt-0.5 h-3.5 w-3.5 shrink-0", accent.check)} aria-hidden />
            <p className="text-sm" style={{ color: "var(--enroll-text-muted)" }}>
              {line}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export const Contribution = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const version = getRoutingVersion(pathname);
  const lang = (i18n.language ?? "en").split("-")[0];
  const locale = LOCALE_MAP[lang] ?? LOCALE_MAP.en ?? "en-US";
  const {
    state,
    setContributionType,
    setContributionAmount,
    setSourceAllocation,
    perPaycheck,
  } = useEnrollment();

  const selectedPlanId = state.selectedPlan;
  const salary = state.salary || 72000;
  const currentAge = state.currentAge || 40;
  const retirementAge = state.retirementAge || 67;

  useEffect(() => {
    if (state.isInitialized && !selectedPlanId) {
      navigate(withVersion(version, "/enrollment/choose-plan"), { replace: true });
    }
  }, [state.isInitialized, selectedPlanId, navigate, version]);

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

  /** Match applies to pre-tax deferrals only; updates when user changes Pre-tax / Roth / After-tax. */
  const employerMatchMonthlyAllocated = useMemo(
    () =>
      monthlyEmployerMatchForPreTaxShare(
        derived.monthlyContribution,
        state.sourceAllocation.preTax,
        salary,
        state.employerMatchEnabled,
        state.assumptions.employerMatchCap,
        state.assumptions.employerMatchPercentage,
      ),
    [
      derived.monthlyContribution,
      state.sourceAllocation.preTax,
      salary,
      state.employerMatchEnabled,
      state.assumptions.employerMatchCap,
      state.assumptions.employerMatchPercentage,
    ],
  );

  const projectionBaseline = useMemo(
    () =>
      calculateProjection({
        currentAge,
        retirementAge,
        currentBalance: state.currentBalance || 0,
        monthlyContribution: derived.monthlyContribution,
        employerMatch: state.employerMatchEnabled ? employerMatchMonthlyAllocated : 0,
        annualReturnRate: state.assumptions.annualReturnRate,
        inflationRate: state.assumptions.inflationRate,
      }),
    [
      currentAge,
      retirementAge,
      state.currentBalance,
      derived.monthlyContribution,
      employerMatchMonthlyAllocated,
      state.employerMatchEnabled,
      state.assumptions.annualReturnRate,
      state.assumptions.inflationRate,
    ],
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

  const allocationValid = Math.abs(sourceTotal - 100) < 0.01;

  const [taxShowAdvanced, setTaxShowAdvanced] = useState(state.sourceAllocation.afterTax > 0);

  const planDefaultFeatures = useMemo(
    () => asStringArrayTax(t(`${V1_SA}planDefaultFeatures`, { returnObjects: true })),
    [t],
  );
  const customizeFeatures = useMemo(
    () => asStringArrayTax(t(`${V1_SA}customizeFeatures`, { returnObjects: true })),
    [t],
  );
  const explainPreTaxItems = useMemo(
    () => asStringArrayTax(t(`${V1_SA}explainPreTaxItems`, { returnObjects: true })),
    [t],
  );
  const explainRothItems = useMemo(
    () => asStringArrayTax(t(`${V1_SA}explainRothItems`, { returnObjects: true })),
    [t],
  );
  const explainAfterTaxItems = useMemo(
    () => asStringArrayTax(t(`${V1_SA}explainAfterTaxItems`, { returnObjects: true })),
    [t],
  );

  const monthlyEmployee = derived.monthlyContribution;
  const planDefaultMatchMo = useMemo(
    () =>
      monthlyEmployerMatchForPreTaxShare(
        derived.monthlyContribution,
        PLAN_DEFAULT_TAX.preTax,
        salary,
        state.employerMatchEnabled,
        state.assumptions.employerMatchCap,
        state.assumptions.employerMatchPercentage,
      ),
    [
      derived.monthlyContribution,
      salary,
      state.employerMatchEnabled,
      state.assumptions.employerMatchCap,
      state.assumptions.employerMatchPercentage,
    ],
  );
  const planDefaultPreMo = Math.round((monthlyEmployee * PLAN_DEFAULT_TAX.preTax) / 100);
  const planDefaultRothMo = Math.round((monthlyEmployee * PLAN_DEFAULT_TAX.roth) / 100);
  const planDefaultTotalMo = Math.round(monthlyEmployee + planDefaultMatchMo);
  const totalMonthlyInvestmentAllocated = monthlyEmployee + employerMatchMonthlyAllocated;
  const hasAfterTaxSlice = state.sourceAllocation.afterTax > 0;

  const applyPlanDefaultTax = () => {
    hasUserEditedAllocationRef.current = true;
    setSourceAllocation({ ...PLAN_DEFAULT_TAX });
    setLockedSourceIds(new Set());
    setTaxShowAdvanced(false);
  };

  const applyPreRothSplitOnly = (preTax: number) => {
    const v = Math.min(100, Math.max(0, Math.round(preTax)));
    hasUserEditedAllocationRef.current = true;
    setSourceAllocation({ preTax: v, roth: 100 - v, afterTax: 0 });
    setLockedSourceIds(new Set());
  };

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
  const inputsActive = focusedInput !== null;
  const employerMatchPerPaycheck = employerMatchMonthlyAllocated / 2;
  const totalPerPaycheck = perPaycheck + employerMatchPerPaycheck;
  const projectedTotal = projectionBaseline.dataPoints.length > 0
    ? projectionBaseline.dataPoints[projectionBaseline.dataPoints.length - 1].balance
    : 0;

  return (
    <EnrollmentPageContent
      headerContent={
        <div className="space-y-2">
          <button
            type="button"
            onClick={() =>
              useAIAssistantStore.getState().openAIModal({ prompt: CONTRIBUTION_ASK_AI_PROMPT, autoSend: true })
            }
            className="ai-assistant inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold text-white shadow-md transition-transform hover:scale-[1.02] active:scale-[0.98]"
            aria-label={t("aiSystem.askCoreAI")}
          >
            <Info className="h-4 w-4" aria-hidden />
            <span>{t("aiSystem.askCoreAI")}</span>
          </button>
          <EnrollmentAiHint
            titleKey="aiSystem.enrollmentContributionHintTitle"
            bodyKey="aiSystem.enrollmentContributionHint"
            prompt="I'm choosing my 401(k) contribution rate during enrollment. What should I consider for employer match and tax types?"
            className="mt-2"
          />
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
          </div>

          {/* Tax treatment — same layout as V1 source step (for users on /v2/enrollment/contribution). */}
          <div className="space-y-8">
            <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 flex-1 text-left">
                <h2 className="text-2xl font-bold tracking-tight" style={{ color: "var(--enroll-text-primary)" }}>
                  {t(`${V1_SA}title`)}
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-relaxed" style={{ color: "var(--enroll-text-muted)" }}>
                  {t(`${V1_SA}subtitle`)}
                </p>
              </div>
              <div
                className="inline-flex min-w-0 max-w-full shrink-0 items-center gap-2 rounded-xl border px-4 py-2.5"
                style={{ borderColor: "var(--enroll-card-border)", background: "var(--enroll-card-bg)" }}
              >
                <Wallet className="h-5 w-5 shrink-0 text-[var(--enroll-brand)]" aria-hidden />
                <p className="text-sm font-semibold" style={{ color: "var(--enroll-text-primary)" }}>
                  {t(`${V1_SA}contributingSummary`, {
                    percent: Math.round(contributionPct * 10) / 10,
                    amount: `$${Math.round(monthlyEmployee).toLocaleString()}`,
                  })}
                </p>
              </div>
            </div>

            <div className="grid min-w-0 gap-6 lg:grid-cols-2 lg:items-stretch">
              {/* Plan Default */}
              <div
                className="flex min-h-0 flex-col overflow-hidden rounded-2xl border shadow-sm"
                style={{ borderColor: "var(--enroll-card-border)", background: "var(--enroll-bg)" }}
              >
                <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
                  <div>
                    <h2 className="m-0 text-base font-semibold leading-none">
                      <span
                        className="inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold text-white shadow-sm"
                        style={{ background: "var(--enroll-brand, #2563eb)" }}
                      >
                        {t(`${V1_SA}planDefaultHeader`)}
                      </span>
                    </h2>
                    <p className="mt-3 text-sm" style={{ color: "var(--enroll-text-muted)" }}>
                      {t(`${V1_SA}planDefaultSubtitle`)}
                    </p>
                  </div>
                  <div className="alloc-bar-plain">
                    <div className="flex h-full w-full overflow-hidden rounded-full">
                      <div className="alloc-seg-pretax" style={{ width: `${PLAN_DEFAULT_TAX.preTax}%` }} />
                      <div className="alloc-seg-roth" style={{ width: `${PLAN_DEFAULT_TAX.roth}%` }} />
                    </div>
                  </div>
                  <div className="space-y-2 text-sm" style={{ color: "var(--enroll-text-primary)" }}>
                    <div className="flex items-center gap-2">
                      <span className="alloc-dot alloc-dot--md alloc-dot--pretax" />
                      {t(`${V1_SA}preTaxLabel`)} ${planDefaultPreMo.toLocaleString()}/mo
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="alloc-dot alloc-dot--md alloc-dot--roth" />
                      {t(`${V1_SA}rothLabel`)} ${planDefaultRothMo.toLocaleString()}/mo
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/90 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/30">
                      <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-200">{t(`${V1_SA}employerMatch`)}</p>
                      <p className="mt-1 text-xl font-bold tabular-nums text-emerald-900 dark:text-emerald-100">
                        +${Math.round(planDefaultMatchMo).toLocaleString()}
                      </p>
                      <p className="mt-0.5 text-xs font-medium text-emerald-800/90 dark:text-emerald-300/90">
                        {t(`${V1_SA}employerMatchOnPreTax`)}
                      </p>
                    </div>
                    <div className="rounded-xl border p-4" style={{ borderColor: "var(--enroll-card-border)", background: "var(--enroll-bg)" }}>
                      <p className="text-xs font-semibold" style={{ color: "var(--enroll-text-muted)" }}>
                        {t(`${V1_SA}totalMonthlyLabel`)}
                      </p>
                      <p className="mt-1 text-xl font-bold tabular-nums" style={{ color: "var(--enroll-text-primary)" }}>
                        ${planDefaultTotalMo.toLocaleString()}
                      </p>
                      <p className="mt-0.5 text-xs" style={{ color: "var(--enroll-text-muted)" }}>
                        {t(`${V1_SA}totalMonthlyYouPlusEmployer`)}
                      </p>
                    </div>
                  </div>
                  <ul className="flex-1 space-y-2.5">
                    {planDefaultFeatures.map((line) => (
                      <li key={line} className="flex items-start gap-2.5 text-sm leading-snug" style={{ color: "var(--enroll-text-primary)" }}>
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--enroll-brand)]" aria-hidden />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={applyPlanDefaultTax}
                    className="flex h-12 w-full items-center justify-center rounded-xl bg-[var(--enroll-brand)] text-sm font-semibold text-[var(--color-text-on-primary)] shadow-sm transition-colors hover:opacity-90 active:scale-[0.99]"
                  >
                    {t(`${V1_SA}continuePlanDefaultCta`)}
                  </button>
                </div>
              </div>

              {/* Customize */}
              <div
                id="customize-tax-split-v2"
                className="flex min-h-0 flex-col overflow-hidden rounded-2xl border shadow-sm"
                style={{ borderColor: "var(--enroll-card-border)", background: "var(--enroll-bg)" }}
              >
                <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
                  <div>
                    <h2 className="m-0 text-base font-semibold leading-none">
                      <span
                        className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold"
                        style={{
                          borderColor: "rgb(var(--enroll-brand-rgb) / 0.35)",
                          background: "rgb(var(--enroll-brand-rgb) / 0.1)",
                          color: "var(--enroll-brand)",
                        }}
                      >
                        <SlidersHorizontal className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
                        {t(`${V1_SA}customizeSplitHeader`)}
                      </span>
                    </h2>
                    <p className="mt-3 text-sm font-semibold" style={{ color: "var(--enroll-text-primary)" }}>
                      {t(`${V1_SA}customizeCardTitle`)}
                    </p>
                    <p className="mt-1 text-sm" style={{ color: "var(--enroll-text-muted)" }}>
                      {t(`${V1_SA}customizeCardSubtitle`)}
                    </p>
                  </div>

                  <div className="alloc-bar-track">
                    {state.sourceAllocation.preTax > 0 ? (
                      <div className="alloc-seg-pretax transition-all" style={{ width: `${state.sourceAllocation.preTax}%` }} />
                    ) : null}
                    {state.sourceAllocation.roth > 0 ? (
                      <div className="alloc-seg-roth transition-all" style={{ width: `${state.sourceAllocation.roth}%` }} />
                    ) : null}
                    {state.sourceAllocation.afterTax > 0 ? (
                      <div className="alloc-seg-aftertax transition-all" style={{ width: `${state.sourceAllocation.afterTax}%` }} />
                    ) : null}
                  </div>

                  {hasAfterTaxSlice ? (
                    <div className="space-y-5">
                      {SOURCE_OPTIONS.map((opt) => {
                        const splitPct = state.sourceAllocation[opt.key];
                        return (
                          <div
                            key={opt.id}
                            className="min-w-0 rounded-xl border p-4"
                            style={{ borderColor: "var(--enroll-card-border)", background: TAX_SOURCE_PANEL_BG }}
                          >
                            <div className="mb-1 flex justify-between gap-2 text-sm font-semibold" style={{ color: "var(--enroll-text-primary)" }}>
                              <span>{t(opt.mainKey)}</span>
                              <span>{splitPct}%</span>
                            </div>
                            <FinancialSlider
                              value={splitPct}
                              fillPercent={splitPct}
                              min={0}
                              max={100}
                              step={0.5}
                              disabled={false}
                              onChange={(e) => handleSourcePercentChange(opt.key, Number(e.target.value))}
                              aria-label={t(opt.mainKey)}
                              minLabel={t("enrollment.sliderMinLabel")}
                              maxLabel={t("enrollment.sliderMaxLabel")}
                            />
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <>
                      <div
                        className="space-y-3 rounded-xl border p-4"
                        style={{ borderColor: "var(--enroll-card-border)", background: TAX_SOURCE_PANEL_BG }}
                      >
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={state.sourceAllocation.preTax}
                          onChange={(e) => applyPreRothSplitOnly(Number(e.target.value))}
                          className={cn("source-allocation-range", "source-allocation-range--pretax")}
                          style={{ "--range-pct": `${state.sourceAllocation.preTax}%` } as CSSProperties}
                          aria-label={t(`${V1_SA}customizeCardTitle`)}
                        />
                        <div className="flex justify-between text-xs font-medium" style={{ color: "var(--enroll-text-muted)" }}>
                          <span>{t(`${V1_SA}preTaxLabel`)}</span>
                          <span>{t(`${V1_SA}rothLabel`)}</span>
                        </div>
                      </div>
                      {taxShowAdvanced ? (
                        <div className="space-y-2 border-t pt-4" style={{ borderColor: "var(--enroll-card-border)" }}>
                          <div className="enroll-advanced-tag">
                            <p className="enroll-advanced-tag__text">{t(`${V1_SA}advancedTag`)}</p>
                          </div>
                          <div
                            className="min-w-0 rounded-xl border p-4"
                            style={{ borderColor: "var(--enroll-card-border)", background: TAX_SOURCE_PANEL_BG }}
                          >
                            <div className="mb-1 flex justify-between gap-2 text-sm font-semibold" style={{ color: "var(--enroll-text-primary)" }}>
                              <span>{t("enrollment.afterTax")}</span>
                              <span>{state.sourceAllocation.afterTax}%</span>
                            </div>
                            <FinancialSlider
                              value={state.sourceAllocation.afterTax}
                              fillPercent={state.sourceAllocation.afterTax}
                              min={0}
                              max={100}
                              step={0.5}
                              disabled={false}
                              onChange={(e) => handleSourcePercentChange("afterTax", Number(e.target.value))}
                              aria-label={t("enrollment.afterTax")}
                              minLabel={t("enrollment.sliderMinLabel")}
                              maxLabel={t("enrollment.sliderMaxLabel")}
                            />
                          </div>
                        </div>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => (taxShowAdvanced ? setTaxShowAdvanced(false) : setTaxShowAdvanced(true))}
                        className="flex items-center gap-1.5 self-start text-sm font-medium"
                        style={{ color: "var(--enroll-text-muted)" }}
                      >
                        {taxShowAdvanced ? <ChevronUp className="h-4 w-4" aria-hidden /> : <ChevronDown className="h-4 w-4" aria-hidden />}
                        {taxShowAdvanced ? t(`${V1_SA}hideAdvanced`) : t(`${V1_SA}showAdvanced`)}
                      </button>
                    </>
                  )}

                  {hasAfterTaxSlice ? (
                    <button
                      type="button"
                      onClick={() => {
                        setTaxShowAdvanced(false);
                        hasUserEditedAllocationRef.current = true;
                        setSourceAllocation({
                          preTax: state.sourceAllocation.preTax + state.sourceAllocation.afterTax,
                          roth: state.sourceAllocation.roth,
                          afterTax: 0,
                        });
                        setLockedSourceIds(new Set());
                      }}
                      className="flex items-center gap-1.5 self-start text-sm font-medium"
                      style={{ color: "var(--enroll-text-muted)" }}
                    >
                      <ChevronUp className="h-4 w-4" aria-hidden />
                      {t(`${V1_SA}hideAdvanced`)}
                    </button>
                  ) : null}

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border p-4" style={{ borderColor: "var(--enroll-card-border)", background: "var(--enroll-bg)" }}>
                      <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--enroll-text-muted)" }}>
                        {t(`${V1_SA}employerMatch`)}
                      </p>
                      <p className="mt-1 text-xl font-bold tabular-nums" style={{ color: "var(--enroll-text-primary)" }}>
                        +{formatCurrency(employerMatchMonthlyAllocated)}
                      </p>
                      <p className="mt-0.5 text-xs" style={{ color: "var(--enroll-text-muted)" }}>
                        {t(`${V1_SA}employerMatchBasedOnSplit`)}
                      </p>
                    </div>
                    <div className="rounded-xl border p-4" style={{ borderColor: "var(--enroll-card-border)", background: "var(--enroll-bg)" }}>
                      <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--enroll-text-muted)" }}>
                        {t(`${V1_SA}totalMonthlyLabel`)}
                      </p>
                      <p className="mt-1 text-xl font-bold tabular-nums" style={{ color: "var(--enroll-text-primary)" }}>
                        {formatCurrency(totalMonthlyInvestmentAllocated)}
                      </p>
                      <p className="mt-0.5 text-xs" style={{ color: "var(--enroll-text-muted)" }}>
                        {t(`${V1_SA}totalMonthlyYouPlusEmployer`)}
                      </p>
                    </div>
                  </div>

                  <ul className="space-y-2.5">
                    {customizeFeatures.map((line) => (
                      <li key={line} className="flex items-start gap-2.5 text-sm leading-snug" style={{ color: "var(--enroll-text-primary)" }}>
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--enroll-brand)]" aria-hidden />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap items-center gap-2 border-t pt-3 text-xs" style={{ borderColor: "var(--enroll-card-border)", color: "var(--enroll-text-muted)" }}>
                    <span className="font-medium" style={{ color: "var(--enroll-text-primary)" }}>
                      {t(`${V1_SA}learnPrefix`)}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[color-mix(in_srgb,var(--color-primary)_25%,transparent)] bg-[color-mix(in_srgb,var(--color-primary)_8%,transparent)] px-2.5 py-0.5 font-medium text-[var(--color-primary)]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-primary)]" aria-hidden />
                      {t(`${V1_SA}preTaxLabel`)}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-200 bg-purple-50 px-2.5 py-0.5 font-medium text-purple-700 dark:border-purple-800 dark:bg-purple-950/50 dark:text-purple-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-purple-600" aria-hidden />
                      {t(`${V1_SA}rothLabel`)}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50 px-2.5 py-0.5 font-medium text-orange-700 dark:border-orange-800 dark:bg-orange-950/50 dark:text-orange-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-orange-500" aria-hidden />
                      {t(`${V1_SA}afterTaxLabel`)}
                    </span>
                  </div>

                  <button
                    type="button"
                    disabled={!allocationValid}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                    style={{
                      borderColor: "var(--enroll-card-border)",
                      background: "var(--enroll-bg)",
                      color: "var(--enroll-text-primary)",
                    }}
                  >
                    {t(`${V1_SA}customizeAllocationCta`)}
                    <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
                  </button>
                </div>
              </div>
            </div>

            {!allocationValid ? (
              <p className="text-center text-sm font-medium" style={{ color: "var(--color-danger)" }}>
                {t(`${V1_SA}allocMustTotal`, { total: Math.round(sourceTotal * 10) / 10 })}
              </p>
            ) : null}

            <div className="space-y-4">
              <h3 className="text-lg font-semibold" style={{ color: "var(--enroll-text-primary)" }}>
                {t(`${V1_SA}understandingTitle`)}
              </h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <V2TaxExplainCard
                  title={t(`${V1_SA}preTaxLabel`)}
                  subtitle={t(`${V1_SA}explainPreTaxSub`)}
                  icon={<TrendingUp className="h-4 w-4" aria-hidden />}
                  variant="pretax"
                  items={explainPreTaxItems}
                />
                <V2TaxExplainCard
                  title={t(`${V1_SA}rothLabel`)}
                  subtitle={t(`${V1_SA}explainRothSub`)}
                  icon={<Shield className="h-4 w-4" aria-hidden />}
                  variant="roth"
                  items={explainRothItems}
                />
                <V2TaxExplainCard
                  title={t(`${V1_SA}afterTaxLabel`)}
                  subtitle={t(`${V1_SA}explainAfterTaxSub`)}
                  icon={<DollarSign className="h-4 w-4" aria-hidden />}
                  variant="aftertax"
                  items={explainAfterTaxItems}
                  className="md:col-span-2 lg:col-span-1"
                />
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
                      {formatCurrency(totalMonthlyInvestmentAllocated)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium" style={{ color: "var(--enroll-text-muted)" }}>
                      {t("enrollment.projectedAnnualTotal")}
                    </p>
                    <p className="text-sm font-semibold tabular-nums mt-0.5" style={{ color: "var(--enroll-text-primary)" }}>
                      {formatCurrency(totalMonthlyInvestmentAllocated * 12)}
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
