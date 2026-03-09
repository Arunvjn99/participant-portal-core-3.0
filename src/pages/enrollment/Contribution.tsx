import { useMemo, useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useContributionStore } from "../../enrollment/context/useContributionStore";
import { EnrollmentFooter } from "../../components/enrollment/EnrollmentFooter";
import { loadEnrollmentDraft, saveEnrollmentDraft } from "../../enrollment/enrollmentDraftStore";
import { useCoreAIModalOptional } from "../../context/CoreAIModalContext";
import { EnrollmentPageContent } from "../../components/enrollment/EnrollmentPageContent";
import {
  AIInsightBanner,
  ContributionInputCard,
  TaxSplitSection,
  ProjectionCard,
  ContributionSummaryCard,
} from "../../components/enrollment/contribution";
import type { QuickSelectOption } from "../../components/enrollment/contribution";
import { PAYCHECKS_PER_YEAR, annualAmountToPercentage } from "../../enrollment/logic/contributionCalculator";
import type { ProjectionDataPoint } from "../../enrollment/logic/types";
import { formatYAxisLabel, getYAxisTicks } from "../../utils/projectionChartAxis";

/* ── Constants (unchanged) ── */
const SLIDER_MIN = 1;
const SLIDER_MAX = 25;

const PRESETS: QuickSelectOption[] = [
  { id: "safe", labelKey: "enrollment.preset4Safe", percentage: 4 },
  { id: "match", labelKey: "enrollment.preset6Match", percentage: 6 },
  { id: "aggressive", labelKey: "enrollment.preset15Aggressive", percentage: 15 },
];

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
    selectedPlanId,
    salary,
    currentAge,
    retirementAge,
    contributionPct,
    derived,
    projectionBaseline,
    sourceAllocation,
    allocationValid,
    setContributionType,
    setContributionAmount,
    setSourceAllocation,
    setSourcesEditMode,
    setSourcesViewMode,
    handleSourcePercentChange,
    handleSourceEffectivePctChange,
  } = useContributionStore();

  useEffect(() => {
    if (state.isInitialized && !selectedPlanId) {
      navigate("/enrollment/choose-plan", { replace: true });
    }
  }, [state.isInitialized, selectedPlanId, navigate]);

  const annualAmount = salary > 0 ? (salary * contributionPct) / 100 : 0;
  const dollarInput = annualAmount;

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
      const annual = v * 12;
      const pct = annualAmountToPercentage(salary, annual);
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

  const maxMonthlyDollar = salary > 0 ? Math.floor((salary / 12) * 0.25) : 500;
  const handleDollarSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const monthly = parseFloat(e.target.value);
    if (!isNaN(monthly) && salary > 0) {
      const annual = Math.min(maxMonthlyDollar * 12, Math.max(0, monthly) * 12);
      const pct = annualAmountToPercentage(salary, annual);
      setContributionType("percentage");
      setContributionAmount(Math.min(100, Math.max(0, pct)));
    }
  };

  const handleSourceToggle = useCallback(
    (key: "preTax" | "roth" | "afterTax", enabled: boolean) => {
      if (!enabled) {
        handleSourcePercentChange(key, 0);
        return;
      }
      const a = sourceAllocation;
      const activeCount = (a.preTax > 0 ? 1 : 0) + (a.roth > 0 ? 1 : 0) + (a.afterTax > 0 ? 1 : 0);
      const newValue = Math.round((100 / (activeCount + 1)) * 10) / 10;
      handleSourcePercentChange(key, newValue);
    },
    [sourceAllocation, handleSourcePercentChange]
  );

  const saveDraftForNextStep = useCallback(() => {
    try {
      const draft = loadEnrollmentDraft();
      if (draft) {
        saveEnrollmentDraft({
          ...draft,
          contributionType: "percentage",
          contributionAmount: contributionPct,
          sourceAllocation,
        });
      }
    } catch (_) {
      // ignore
    }
  }, [contributionPct, sourceAllocation]);

  const getDraftSnapshot = useCallback(
    () => ({
      contributionType: "percentage" as const,
      contributionAmount: contributionPct,
      sourceAllocation,
    }),
    [contributionPct, sourceAllocation]
  );

  const [contributionInputMode, setContributionInputMode] = useState<"percentage" | "fixed">("percentage");
  const monthlyAmount = derived.monthlyContribution;
  const projectedTotal = projectionBaseline.dataPoints.length > 0
    ? projectionBaseline.dataPoints[projectionBaseline.dataPoints.length - 1].balance
    : 0;

  const fullMatchAmountFormatted = formatCurrency(derived.employerMatchMonthly * 12);
  const monthlyPaycheckFormatted = formatCurrency(salary / 12);
  const savingPerMonthFormatted = t("enrollment.youSavingPerMonth", { amount: formatCurrency(monthlyAmount) });

  const taxSplitAskAIPrompt = "Explain pre-tax, Roth, and after-tax contributions and how to split my contribution.";
  const taxSplitItems = useMemo(() => {
    const paycheckTotal = annualAmount / PAYCHECKS_PER_YEAR;
    return SOURCE_OPTIONS.map((opt) => {
      const splitPct = sourceAllocation[opt.key];
      const sourcePerPaycheck = (splitPct / 100) * paycheckTotal;
      const dollarPerMonth = (sourcePerPaycheck * PAYCHECKS_PER_YEAR) / 12;
      return {
        id: opt.id,
        labelKey: opt.mainKey,
        percent: Math.round(splitPct * 10) / 10,
        dollarPerMonth,
        dollarPerMonthFormatted: formatCurrency(dollarPerMonth),
        active: splitPct > 0,
        onAskAI: coreAI ? () => coreAI.openWithPrompt(taxSplitAskAIPrompt) : undefined,
      };
    });
  }, [sourceAllocation, annualAmount, contributionPct, formatCurrency, coreAI]);

  const segmentWidths: [number, number, number] = [
    sourceAllocation.preTax,
    sourceAllocation.roth,
    sourceAllocation.afterTax,
  ];

  const summaryLine = t("enrollment.summaryYouEmployerTotal", {
    you: formatCurrency(derived.monthlyContribution),
    employer: formatCurrency(derived.employerMatchMonthly),
    total: formatCurrency(derived.totalMonthlyInvestment),
  });
  const annualSummaryLine = t("enrollment.annualSummaryLine", {
    amount: formatCurrency(derived.totalMonthlyInvestment * 12),
  });

  const planName =
    selectedPlanId === "roth_401k"
      ? t("enrollment.planRoth401kTitle")
      : selectedPlanId === "traditional_401k"
        ? t("enrollment.planTraditional401kTitle")
        : t("enrollment.contributionSubtitle");

  return (
    <EnrollmentPageContent
      headerContent={
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div
            className="absolute -left-4 top-0 w-1 h-12 rounded-full"
            style={{ background: "linear-gradient(to bottom, var(--enroll-brand), var(--enroll-accent))" }}
            aria-hidden
          />
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 pl-2" style={{ color: "var(--enroll-text-primary)" }}>
            {t("enrollment.contributionTitle")}
          </h1>
          <p className="text-base pl-2" style={{ color: "var(--enroll-text-secondary)" }}>
            {t("enrollment.contributionSubtitleToPlan", { plan: planName })}
          </p>
        </motion.div>
      }
    >
      <div className="contribution-page-figma-wrapper">
        <div className="contribution-page-figma flex flex-col gap-10 pt-0">
          {/* Layout from figma-dump ContributionStep: grid with AI + main card (left), projection + summary (right) */}
          <div className="enrollment-container contribution-page-figma__content max-w-[1200px] mx-auto w-full">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* ═══ LEFT: AI banner + one card (Set Contribution + Tax Strategy) ═══ */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="flex flex-col gap-6 lg:col-span-2"
          >
            <AIInsightBanner
              variant="figma"
              contributionPercent={contributionPct}
              employerMatchCap={state.assumptions.employerMatchCap}
              fullMatchAmountFormatted={fullMatchAmountFormatted}
            />
            <ContributionInputCard
              title={t("enrollment.setYourContribution")}
              subtext={t("enrollment.setContributionSubtext")}
              onAskAI={coreAI ? () => coreAI.openWithPrompt(CONTRIBUTION_ASK_AI_PROMPT) : undefined}
              askAiAriaLabel={t("enrollment.whatIsContribution")}
              quickSelectOptions={PRESETS}
              activePercentage={contributionPct}
              onQuickSelect={handlePreset}
              contributionType={contributionInputMode}
              onContributionTypeChange={setContributionInputMode}
              percentageValue={contributionPct}
              onPercentageChange={handlePercentageChange}
              dollarValue={dollarInput}
              onDollarChange={handleDollarChange}
              sliderMin={SLIDER_MIN}
              sliderMax={SLIDER_MAX}
              onSliderChange={handleSliderChange}
              sliderAriaLabel={t("enrollment.contributionPercentageAria")}
              dollarSliderValue={monthlyAmount}
              dollarSliderMin={0}
              dollarSliderMax={maxMonthlyDollar}
              onDollarSliderChange={handleDollarSliderChange}
              monthlyPaycheckFormatted={monthlyPaycheckFormatted}
              savingPerMonthFormatted={savingPerMonthFormatted}
              savingBadgeLabel={t("enrollment.buildingYourFuture")}
              bottomSection={
                <TaxSplitSection
                  variant="figma"
                  editMode={state.sourcesEditMode}
                  title={t("enrollment.taxStrategyTitle")}
                  subtext={t("enrollment.taxStrategySubtext")}
                  items={taxSplitItems}
                  onEditSplit={() => setSourcesEditMode(!state.sourcesEditMode)}
                  editSplitAriaLabel={t("enrollment.editContributionSplit")}
                  segmentWidths={segmentWidths}
                  onSourcePercentChange={handleSourcePercentChange}
                  onSourceToggle={handleSourceToggle}
                />
              }
            />
          </motion.div>

          {/* ═══ RIGHT: Projection + Summary ═══ */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="space-y-6 lg:sticky lg:top-24"
          >
            <ProjectionCard
              title={t("enrollment.retirementProjection")}
              legendContributionsLabel={t("enrollment.yourContributionsLegend", { defaultValue: "Your Contributions" })}
              legendTotalLabel={t("enrollment.totalValueLegend", { defaultValue: "Total Value" })}
              projectedValueFormatted={
                projectedTotal > 0
                  ? new Intl.NumberFormat(locale, { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(projectedTotal)
                  : "—"
              }
              projectedValueAtAgeLabel={t("enrollment.projectedValueAtAge", { age: retirementAge })}
              inYearsLabel={t("enrollment.inYears", { years: retirementAge - currentAge })}
              contributionsFormatted={
                projectionBaseline.totalContributions > 0
                  ? new Intl.NumberFormat(locale, { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(projectionBaseline.totalContributions)
                  : undefined
              }
              growthFormatted={
                projectionBaseline.totalGrowth > 0
                  ? new Intl.NumberFormat(locale, { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(projectionBaseline.totalGrowth)
                  : undefined
              }
              chart={
                projectedTotal > 0 ? (
                  <div className="contrib-chart-wrapper">
                    <ProjectionLineChart baseline={projectionBaseline.dataPoints} locale={locale} />
                  </div>
                ) : (
                  <div className="contrib-chart-empty">
                    <p className="contrib-chart-empty__text text-sm">
                      {t("enrollment.startContributingToSeeProjection")}
                    </p>
                  </div>
                )
              }
              contributionsLabel={t("enrollment.contributionsBreakdown")}
              growthLabel={t("enrollment.growthBreakdown")}
              disclaimer={t("enrollment.disclaimerProjection", {
                return: state.assumptions.annualReturnRate,
              })}
            />
            <ContributionSummaryCard
              summaryLine={summaryLine}
              emphasizeTotal
              annualSummaryLine={annualSummaryLine}
              variant="figma"
              progressBar={
                derived.totalMonthlyInvestment > 0
                  ? {
                      youPercent: derived.monthlyContribution / derived.totalMonthlyInvestment,
                      employerPercent: derived.employerMatchMonthly / derived.totalMonthlyInvestment,
                    }
                  : undefined
              }
            />
          </motion.div>
            </div>
          </div>
        </div>
      </div>

      <EnrollmentFooter
        primaryLabel={t("enrollment.continueToAutoIncrease")}
        primaryDisabled={!allocationValid}
        onPrimary={saveDraftForNextStep}
        getDraftSnapshot={getDraftSnapshot}
        inContent
        hideSaveAndExit
      />
    </EnrollmentPageContent>
  );
};

/* ═══════════════════════════════════════════════════════════════
   Projection Area Chart — Figma: two series (Your Contributions + Total Value)
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
  if (points === 0) return <div className="flex items-center justify-center min-h-[160px] text-sm contrib-chart-no-data">{t("enrollment.noData")}</div>;

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

  const pathBalance = baseline
    .map((p, i) => `${i === 0 ? "M" : "L"} ${xScale(i)} ${yScale(p.balance)}`)
    .join(" ");
  const pathContributions = baseline
    .map((p, i) => `${i === 0 ? "M" : "L"} ${xScale(i)} ${yScale(p.contributions)}`)
    .join(" ");
  const areaTotalValue = `${pathBalance} L ${xScale(points - 1)} ${h - padding.bottom} L ${padding.left} ${h - padding.bottom} Z`;
  const areaContributions = `${pathContributions} L ${xScale(points - 1)} ${h - padding.bottom} L ${padding.left} ${h - padding.bottom} Z`;

  const xAxisLabels: { index: number; label: string }[] = [];
  for (let i = 0; i < points; i++) {
    if (i === 0) xAxisLabels.push({ index: i, label: t("enrollment.chartNow", { defaultValue: "Now" }) });
    else if (i === points - 1 || baseline[i].year % 2 === 0)
      xAxisLabels.push({ index: i, label: t("enrollment.chartYear", { year: baseline[i].year, defaultValue: `Year ${baseline[i].year}` }) });
  }

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
          <linearGradient id="contrib-chart-value" x1="0" y1="1" x2="0" y2="0">
            <stop offset="5%" stopColor="var(--enroll-accent)" stopOpacity="0.8" />
            <stop offset="95%" stopColor="var(--enroll-accent)" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="contrib-chart-contributions" x1="0" y1="1" x2="0" y2="0">
            <stop offset="5%" stopColor="var(--enroll-brand)" stopOpacity="0.6" />
            <stop offset="95%" stopColor="var(--enroll-brand)" stopOpacity="0.05" />
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

        {xAxisLabels.map(({ index: i, label }) => (
          <g key={i} fill="currentColor" className="contrib-chart-axis-text">
            <text x={xScale(i)} y={h - 10} textAnchor={i === 0 ? "start" : i === points - 1 ? "end" : "middle"} dominantBaseline="hanging" fontSize="10">{label}</text>
          </g>
        ))}

        <path d={areaTotalValue} fill="url(#contrib-chart-value)" stroke="var(--enroll-accent)" strokeWidth={2} strokeLinejoin="round" />
        <path d={areaContributions} fill="url(#contrib-chart-contributions)" stroke="var(--enroll-brand)" strokeWidth={2} strokeLinejoin="round" />
      </svg>
      {tooltip && (
        <div
          className="contrib-chart-tooltip pointer-events-none absolute z-10 rounded-lg px-3 py-2 text-sm"
          style={{
            left: tooltip.x + 12,
            top: tooltip.y + 12,
            transform: "translate(0, -50%)",
          }}
        >
          <div className="font-medium contrib-chart-tooltip__label">
            {t("enrollment.yearLabel", { year: new Date().getFullYear() + baseline[tooltip.index].year })}
          </div>
          <div className="font-semibold contrib-chart-tooltip__value">
            {t("enrollment.yourContributionsLegend", { defaultValue: "Your Contributions" })}: {formatTooltipCurrency(baseline[tooltip.index].contributions)}
          </div>
          <div className="font-semibold contrib-chart-tooltip__value">
            {t("enrollment.totalValueLegend", { defaultValue: "Total Value" })}: {formatTooltipCurrency(baseline[tooltip.index].balance)}
          </div>
        </div>
      )}
    </div>
  );
}
