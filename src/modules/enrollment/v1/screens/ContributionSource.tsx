import { useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { useTranslation, type TFunction } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { computeSourceSplitMonthly } from "../flow/enrollmentDerivedEngine";
import { isEnrollmentStepValid } from "../flow/stepValidation";
import { ENROLLMENT_STEPS } from "../flow/steps";
import { pathForWizardStep } from "../flow/v1WizardPaths";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Plus,
  Shield,
  SlidersHorizontal,
  TrendingUp,
  Wallet,
} from "lucide-react";
import type { ContributionSources } from "../store/useEnrollmentStore";
import { useEnrollmentStore } from "../store/useEnrollmentStore";
import { cn } from "@/lib/utils";

const A = "enrollment.v1.sourceAllocation.";
const SOURCE_STEP_INDEX = ENROLLMENT_STEPS.indexOf("source");

const PLAN_DEFAULT: ContributionSources = { preTax: 60, roth: 40, afterTax: 0 };

function allocationMatchesPlanDefault(s: ContributionSources): boolean {
  return (
    Math.abs(s.preTax - PLAN_DEFAULT.preTax) < 0.01 &&
    Math.abs(s.roth - PLAN_DEFAULT.roth) < 0.01 &&
    Math.abs(s.afterTax - PLAN_DEFAULT.afterTax) < 0.01
  );
}

function asStringArray(v: unknown): string[] {
  return Array.isArray(v) ? v.map(String) : [];
}

export function ContributionSource() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const data = useEnrollmentStore();
  const updateField = useEnrollmentStore((s) => s.updateField);
  const nextStep = useEnrollmentStore((s) => s.nextStep);
  const sources = data.contributionSources;
  const monthlyTotal = data.monthlyContribution;
  const monthlyMatch = data.employerMatch;
  const percent = data.contribution;
  const supportsAfterTax = data.supportsAfterTax;

  const planDefaultFeatures = useMemo(() => asStringArray(t(`${A}planDefaultFeatures`, { returnObjects: true })), [t]);
  const customizeFeatures = useMemo(() => asStringArray(t(`${A}customizeFeatures`, { returnObjects: true })), [t]);
  const explainPreTax = useMemo(() => asStringArray(t(`${A}explainPreTaxItems`, { returnObjects: true })), [t]);
  const explainRoth = useMemo(() => asStringArray(t(`${A}explainRothItems`, { returnObjects: true })), [t]);
  const explainAfterTax = useMemo(() => asStringArray(t(`${A}explainAfterTaxItems`, { returnObjects: true })), [t]);

  const [showAdvanced, setShowAdvanced] = useState(sources.afterTax > 0);
  /** false = preview card; true = expanded editor (second design state). */
  const [customizeEditorOpen, setCustomizeEditorOpen] = useState(false);

  const { monthlyPreTax, monthlyRoth, monthlyAfterTax } = computeSourceSplitMonthly(monthlyTotal, sources);
  /** Match applies to pre-tax deferrals only (see employer match callout copy). */
  const effectiveEmployerMatch = Math.round((monthlyMatch * sources.preTax) / 100);
  const totalMonthlyInvestment = monthlyTotal + effectiveEmployerMatch;

  const planDefaultSplit = computeSourceSplitMonthly(monthlyTotal, PLAN_DEFAULT);
  const planDefaultEmployerMatch = Math.round((monthlyMatch * PLAN_DEFAULT.preTax) / 100);
  const planDefaultTotalMonthly = monthlyTotal + planDefaultEmployerMatch;

  const setSources = (next: ContributionSources) => {
    updateField("contributionSources", next);
  };

  const tryAdvanceFromSource = () => {
    const state = useEnrollmentStore.getState();
    if (!isEnrollmentStepValid(SOURCE_STEP_INDEX, state)) return;
    nextStep();
    navigate(pathForWizardStep(useEnrollmentStore.getState().currentStep));
  };

  const handleContinuePlanDefault = () => {
    setSources({ ...PLAN_DEFAULT });
    setShowAdvanced(false);
    tryAdvanceFromSource();
  };

  const openCustomizeEditor = () => {
    setCustomizeEditorOpen(true);
    setShowAdvanced(false);
    setSources({ ...PLAN_DEFAULT });
  };

  const handleApplyCustomSplit = () => {
    if (Math.abs(total - 100) < 0.001) tryAdvanceFromSource();
  };

  const handleResetToPlanDefault = () => {
    setSources({ ...PLAN_DEFAULT });
    setShowAdvanced(false);
  };

  const handlePreTaxChange = (value: number) => {
    const newPreTax = Math.min(100, Math.max(0, value));
    const remaining = 100 - newPreTax;
    const currentRothAfterTaxTotal = sources.roth + sources.afterTax;
    if (currentRothAfterTaxTotal > 0) {
      const rothRatio = sources.roth / currentRothAfterTaxTotal;
      setSources({
        preTax: newPreTax,
        roth: Math.round(remaining * rothRatio),
        afterTax: Math.round(remaining * (1 - rothRatio)),
      });
    } else {
      setSources({ preTax: newPreTax, roth: remaining, afterTax: 0 });
    }
  };

  const handleRothChange = (value: number) => {
    const newRoth = Math.min(100, Math.max(0, value));
    const remaining = 100 - newRoth;
    const currentPreTaxAfterTaxTotal = sources.preTax + sources.afterTax;
    if (currentPreTaxAfterTaxTotal > 0) {
      const preTaxRatio = sources.preTax / currentPreTaxAfterTaxTotal;
      setSources({
        preTax: Math.round(remaining * preTaxRatio),
        roth: newRoth,
        afterTax: Math.round(remaining * (1 - preTaxRatio)),
      });
    } else {
      setSources({ preTax: remaining, roth: newRoth, afterTax: 0 });
    }
  };

  const handleAfterTaxChange = (value: number) => {
    const newAfterTax = Math.min(100, Math.max(0, value));
    const remaining = 100 - newAfterTax;
    const currentPreTaxRothTotal = sources.preTax + sources.roth;
    if (currentPreTaxRothTotal > 0) {
      const preTaxRatio = sources.preTax / currentPreTaxRothTotal;
      setSources({
        preTax: Math.round(remaining * preTaxRatio),
        roth: Math.round(remaining * (1 - preTaxRatio)),
        afterTax: newAfterTax,
      });
    } else {
      setSources({ preTax: remaining, roth: 0, afterTax: newAfterTax });
    }
  };

  const handleCombinedPreRoth = (preTax: number) => {
    const v = Math.min(100, Math.max(0, preTax));
    setSources({ preTax: v, roth: 100 - v, afterTax: 0 });
  };

  const total = sources.preTax + sources.roth + sources.afterTax;
  const hasAfterTaxSlice = sources.afterTax > 0;
  const applyCustomDisabled =
    Math.abs(total - 100) > 0.001 || allocationMatchesPlanDefault(sources);

  const scrollToExplain = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  return (
    <div className="w-full min-w-0 space-y-8 pb-2">
      {/* Page header + contributing badge */}
      <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1 text-left">
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-[26px] md:leading-tight">
            {t(`${A}title`)}
          </h1>
        </div>
        <div className="inline-flex min-w-0 max-w-full shrink-0 items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5">
          <Wallet className="h-5 w-5 shrink-0 text-primary" aria-hidden />
          <p className="text-sm font-semibold text-foreground">
            {t(`${A}contributingSummary`, {
              percent,
              amount: `$${monthlyTotal.toLocaleString()}`,
            })}
          </p>
        </div>
      </div>

      {/* Two-column cards */}
      <div className="grid min-w-0 gap-6 lg:grid-cols-2 lg:items-stretch">
        {/* Plan Default */}
        <div className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-[var(--enroll-brand)]/35 bg-background shadow-[0_0_0_1px_rgba(37,99,235,0.12)]">
          <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
            <div>
              <h2 className="m-0 text-base font-semibold leading-none">
                <span className="inline-flex items-center rounded-full bg-[var(--enroll-brand)] px-4 py-2 text-sm font-semibold text-[var(--color-text-on-primary)] shadow-sm">
                  {t(`${A}planDefaultHeader`)}
                </span>
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">{t(`${A}planDefaultSubtitle`)}</p>
            </div>

            <div className="alloc-bar-plain">
              <div className="flex h-full w-full overflow-hidden rounded-full">
                <div className="alloc-seg-pretax" style={{ width: `${PLAN_DEFAULT.preTax}%` }} />
                <div className="alloc-seg-roth" style={{ width: `${PLAN_DEFAULT.roth}%` }} />
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2 text-foreground">
                  <span className="alloc-dot alloc-dot--md alloc-dot--pretax" />
                  {t(`${A}preTaxLabel`)} ${planDefaultSplit.monthlyPreTax.toLocaleString()}/mo
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2 text-foreground">
                  <span className="alloc-dot alloc-dot--md alloc-dot--roth" />
                  {t(`${A}rothLabel`)} ${planDefaultSplit.monthlyRoth.toLocaleString()}/mo
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/90 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/30">
                <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-200">{t(`${A}employerMatch`)}</p>
                <p className="mt-1 text-xl font-bold tabular-nums text-emerald-900 dark:text-emerald-100">
                  +${planDefaultEmployerMatch.toLocaleString()}
                </p>
                <p className="mt-0.5 text-xs font-medium text-emerald-800/90 dark:text-emerald-300/90">
                  {t(`${A}employerMatchOnPreTax`)}
                </p>
              </div>
              <div className="rounded-xl border border-border bg-background p-4">
                <p className="text-xs font-semibold text-muted-foreground">{t(`${A}totalMonthlyLabel`)}</p>
                <p className="mt-1 text-xl font-bold tabular-nums text-foreground">
                  ${planDefaultTotalMonthly.toLocaleString()}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">{t(`${A}totalMonthlyYouPlusEmployer`)}</p>
              </div>
            </div>

            <ul className="flex-1 space-y-2.5">
              {planDefaultFeatures.map((line) => (
                <li key={line} className="flex items-start gap-2.5 text-sm leading-snug text-foreground">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--enroll-brand)]" aria-hidden />
                  <span>{line}</span>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={handleContinuePlanDefault}
              className="flex h-12 w-full items-center justify-center rounded-xl bg-[var(--enroll-brand)] text-sm font-semibold text-[var(--color-text-on-primary)] shadow-sm transition-colors hover:opacity-90 active:scale-[0.99]"
            >
              {t(`${A}continuePlanDefaultCta`)}
            </button>
          </div>
        </div>

        {/* Customize Split */}
        <div
          id="customize-tax-split"
          className={cn(
            "flex min-h-0 flex-col overflow-hidden rounded-2xl border bg-background shadow-sm transition-[box-shadow,border-color]",
            customizeEditorOpen ? "border-[var(--enroll-brand)]/50 shadow-md ring-2 ring-[var(--enroll-brand)]/20" : "border-border",
          )}
        >
          <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
            {!customizeEditorOpen ? (
              <>
                <div>
                  <h2 className="m-0 text-base font-semibold leading-none">
                    <span className="inline-flex items-center gap-2 rounded-full border border-[var(--enroll-brand)]/40 bg-[var(--enroll-brand)]/[0.08] px-4 py-2 text-sm font-semibold text-[var(--enroll-brand)]">
                      <SlidersHorizontal className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
                      {t(`${A}customizeSplitHeader`)}
                    </span>
                  </h2>
                  <p className="mt-3 text-sm font-semibold text-foreground">{t(`${A}customizeCardTitle`)}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{t(`${A}customizeCardSubtitle`)}</p>
                </div>

                <div className="space-y-2 opacity-50">
                  <div className="alloc-bar-track">
                    <div className="alloc-seg-pretax" style={{ width: `${PLAN_DEFAULT.preTax}%` }} />
                    <div className="alloc-seg-roth" style={{ width: `${PLAN_DEFAULT.roth}%` }} />
                  </div>
                  <div className="flex justify-between text-xs font-medium text-muted-foreground">
                    <span>{t(`${A}preTaxLabel`)}</span>
                    <span>{t(`${A}rothLabel`)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-border bg-background p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t(`${A}employerMatch`)}</p>
                    <p className="mt-1 text-xl font-bold tabular-nums text-foreground">+${planDefaultEmployerMatch.toLocaleString()}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{t(`${A}employerMatchBasedOnSplit`)}</p>
                  </div>
                  <div className="rounded-xl border border-border bg-background p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t(`${A}totalMonthlyLabel`)}</p>
                    <p className="mt-1 text-xl font-bold tabular-nums text-foreground">${planDefaultTotalMonthly.toLocaleString()}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{t(`${A}totalMonthlyYouPlusEmployer`)}</p>
                  </div>
                </div>

                <ul className="space-y-2.5">
                  {customizeFeatures.map((line) => (
                    <li key={line} className="flex items-start gap-2.5 text-sm leading-snug text-muted-foreground">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/70" aria-hidden />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap items-center gap-2 border-t border-border pt-3 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">{t(`${A}learnPrefix`)}</span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[color-mix(in_srgb,var(--color-primary)_25%,transparent)] bg-[color-mix(in_srgb,var(--color-primary)_8%,transparent)] px-2.5 py-0.5 font-medium text-[var(--color-primary)]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-primary)]" aria-hidden />
                    {t(`${A}preTaxLabel`)}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-200 bg-purple-50 px-2.5 py-0.5 font-medium text-purple-700 dark:border-purple-800 dark:bg-purple-950/50 dark:text-purple-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-purple-600" aria-hidden />
                    {t(`${A}rothLabel`)}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50 px-2.5 py-0.5 font-medium text-orange-700 dark:border-orange-800 dark:bg-orange-950/50 dark:text-orange-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-orange-500" aria-hidden />
                    {t(`${A}afterTaxLabel`)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={openCustomizeEditor}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-border bg-background text-sm font-semibold text-foreground transition-colors hover:bg-muted/60"
                >
                  {t(`${A}customizeAllocationCta`)}
                  <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
                </button>
              </>
            ) : (
              <CustomizeEditorPanel
                t={t}
                A={A}
                sources={sources}
                monthlyMatch={effectiveEmployerMatch}
                totalMonthlyInvestment={totalMonthlyInvestment}
                monthlyPreTax={monthlyPreTax}
                monthlyRoth={monthlyRoth}
                monthlyAfterTax={monthlyAfterTax}
                hasAfterTaxSlice={hasAfterTaxSlice}
                supportsAfterTax={supportsAfterTax}
                showAdvanced={showAdvanced}
                setShowAdvanced={setShowAdvanced}
                applyCustomDisabled={applyCustomDisabled}
                totalValid={Math.abs(total - 100) < 0.001}
                onPreTaxSlider={handleCombinedPreRoth}
                onRothSlider={(v) => setSources({ preTax: 100 - v, roth: v, afterTax: 0 })}
                onPreset={(preTax, roth) => setSources({ preTax, roth, afterTax: 0 })}
                onPreTaxChange={handlePreTaxChange}
                onRothChange={handleRothChange}
                onAfterTaxChange={handleAfterTaxChange}
                onApply={handleApplyCustomSplit}
                onReset={handleResetToPlanDefault}
                onAddSource={() => setShowAdvanced(true)}
                onScrollExplain={scrollToExplain}
              />
            )}
          </div>
        </div>
      </div>

      {customizeEditorOpen && Math.abs(total - 100) > 0.001 ? (
        <p className="text-center text-sm font-medium text-destructive">{t(`${A}allocMustTotal`, { total })}</p>
      ) : null}

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">{t(`${A}understandingTitle`)}</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <ExplainCard
            id="source-explain-pretax"
            title={t(`${A}preTaxLabel`)}
            subtitle={t(`${A}explainPreTaxSub`)}
            icon={<TrendingUp className="h-4 w-4" aria-hidden />}
            variant="pretax"
            items={explainPreTax}
          />
          <ExplainCard
            id="source-explain-roth"
            title={t(`${A}rothLabel`)}
            subtitle={t(`${A}explainRothSub`)}
            icon={<Shield className="h-4 w-4" aria-hidden />}
            variant="roth"
            items={explainRoth}
          />
          <ExplainCard
            id="source-explain-aftertax"
            title={t(`${A}afterTaxLabel`)}
            subtitle={t(`${A}explainAfterTaxSub`)}
            icon={<DollarSign className="h-4 w-4" aria-hidden />}
            variant="aftertax"
            items={explainAfterTax}
            className="md:col-span-2 lg:col-span-1"
          />
        </div>
      </div>
    </div>
  );
}

function CustomizeEditorPanel({
  t,
  A,
  sources,
  monthlyMatch,
  totalMonthlyInvestment,
  monthlyPreTax,
  monthlyRoth,
  monthlyAfterTax,
  hasAfterTaxSlice,
  supportsAfterTax,
  showAdvanced,
  setShowAdvanced,
  applyCustomDisabled,
  totalValid,
  onPreTaxSlider,
  onRothSlider,
  onPreset,
  onPreTaxChange,
  onRothChange,
  onAfterTaxChange,
  onApply,
  onReset,
  onAddSource,
  onScrollExplain,
}: {
  t: TFunction;
  A: string;
  sources: ContributionSources;
  monthlyMatch: number;
  totalMonthlyInvestment: number;
  monthlyPreTax: number;
  monthlyRoth: number;
  monthlyAfterTax: number;
  hasAfterTaxSlice: boolean;
  supportsAfterTax: boolean;
  showAdvanced: boolean;
  setShowAdvanced: (v: boolean) => void;
  applyCustomDisabled: boolean;
  totalValid: boolean;
  onPreTaxSlider: (n: number) => void;
  onRothSlider: (n: number) => void;
  onPreset: (preTax: number, roth: number) => void;
  onPreTaxChange: (n: number) => void;
  onRothChange: (n: number) => void;
  onAfterTaxChange: (n: number) => void;
  onApply: () => void;
  onReset: () => void;
  onAddSource: () => void;
  onScrollExplain: (id: string) => void;
}) {
  const commonPresets = useMemo(
    () =>
      [
        { preTax: 100, roth: 0, label: t(`${A}splitAllPreTax`) },
        { preTax: 80, roth: 20, label: t(`${A}split8020`) },
        { preTax: 50, roth: 50, label: t(`${A}split5050`) },
        { preTax: 20, roth: 80, label: t(`${A}split2080`) },
        { preTax: 0, roth: 100, label: t(`${A}splitAllRoth`) },
      ] as const,
    [t, A],
  );

  const applyDisabled = applyCustomDisabled || !totalValid;

  return (
    <>
      <div>
        <h2 className="m-0 text-base font-semibold leading-none">
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--enroll-brand)]/40 bg-[var(--enroll-brand)]/[0.08] px-4 py-2 text-sm font-semibold text-[var(--enroll-brand)]">
            <SlidersHorizontal className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
            {t(`${A}customizeSplitHeader`)}
          </span>
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">{t(`${A}customizeEditorSubtitle`)}</p>
      </div>

      <div className="space-y-2">
        <div className="alloc-bar-plain">
          <div className="flex h-full w-full overflow-hidden rounded-full">
            {sources.preTax > 0 ? (
              <div className="alloc-seg-pretax transition-all" style={{ width: `${sources.preTax}%` }} />
            ) : null}
            {sources.roth > 0 ? (
              <div className="alloc-seg-roth transition-all" style={{ width: `${sources.roth}%` }} />
            ) : null}
            {sources.afterTax > 0 ? (
              <div className="alloc-seg-aftertax transition-all" style={{ width: `${sources.afterTax}%` }} />
            ) : null}
          </div>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-foreground">
            <span className="alloc-dot alloc-dot--md alloc-dot--pretax" />
            {t(`${A}preTaxLabel`)} ${monthlyPreTax.toLocaleString()}/mo
          </div>
          <div className="flex items-center gap-2 text-foreground">
            <span className="alloc-dot alloc-dot--md alloc-dot--roth" />
            {t(`${A}rothLabel`)} ${monthlyRoth.toLocaleString()}/mo
          </div>
          {hasAfterTaxSlice ? (
            <div className="flex items-center gap-2 text-foreground">
              <span className="alloc-dot alloc-dot--md alloc-dot--aftertax" />
              {t(`${A}afterTaxLabel`)} {monthlyAfterTax.toLocaleString()}/mo
            </div>
          ) : null}
        </div>
      </div>

      {hasAfterTaxSlice ? (
        <div className="space-y-5">
          <SliderRow
            label={t(`${A}preTaxLabel`)}
            sub={t(`${A}preTaxSub`)}
            color="blue"
            value={sources.preTax}
            monthly={monthlyPreTax}
            onChange={onPreTaxChange}
          />
          <SliderRow
            label={t(`${A}rothLabel`)}
            sub={t(`${A}rothSub`)}
            color="purple"
            value={sources.roth}
            monthly={monthlyRoth}
            onChange={onRothChange}
          />
          <SliderRow
            label={t(`${A}afterTaxLabel`)}
            sub={t(`${A}afterTaxSub`)}
            color="orange"
            value={sources.afterTax}
            monthly={monthlyAfterTax}
            onChange={onAfterTaxChange}
          />
        </div>
      ) : (
        <>
          <div className="space-y-6">
            <ExpandDualSlider
              label={t(`${A}preTaxLabel`)}
              color="blue"
              value={sources.preTax}
              onChange={onPreTaxSlider}
              whatsThisLabel={t(`${A}whatsThis`)}
              onWhatsThis={() => onScrollExplain("source-explain-pretax")}
            />
            <ExpandDualSlider
              label={t(`${A}rothLabel`)}
              color="purple"
              value={sources.roth}
              onChange={onRothSlider}
              whatsThisLabel={t(`${A}whatsThis`)}
              onWhatsThis={() => onScrollExplain("source-explain-roth")}
            />
          </div>

          <div className="space-y-2">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">{t(`${A}commonSplitsLabel`)}</p>
            <div className="flex flex-wrap gap-2">
              {commonPresets.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => onPreset(p.preTax, p.roth)}
                  className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted/70"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {supportsAfterTax && showAdvanced ? (
            <div className="space-y-2 border-t border-border pt-4">
              <div className="enroll-advanced-tag">
                <p className="enroll-advanced-tag__text">{t(`${A}advancedTag`)}</p>
              </div>
              <SliderRow
                label={t(`${A}afterTaxLabel`)}
                sub={t(`${A}afterTaxSub`)}
                color="orange"
                value={sources.afterTax}
                monthly={monthlyAfterTax}
                onChange={onAfterTaxChange}
              />
            </div>
          ) : null}
        </>
      )}

      {supportsAfterTax && !hasAfterTaxSlice ? (
        <div className="flex flex-col gap-2">
          {!showAdvanced ? (
            <button
              type="button"
              onClick={onAddSource}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border text-sm font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:bg-muted/40 hover:text-foreground"
            >
              <Plus className="h-4 w-4 shrink-0" aria-hidden />
              {t(`${A}addAnotherSource`)}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setShowAdvanced(false);
                if (sources.afterTax > 0) {
                  onPreset(sources.preTax + sources.afterTax, sources.roth);
                }
              }}
              className="flex items-center gap-1.5 self-start text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <ChevronUp className="h-4 w-4" aria-hidden />
              {t(`${A}hideAdvanced`)}
            </button>
          )}
        </div>
      ) : null}

      {hasAfterTaxSlice && supportsAfterTax ? (
        <button
          type="button"
          onClick={() => {
            setShowAdvanced(false);
            onPreset(sources.preTax + sources.afterTax, sources.roth);
          }}
          className="flex items-center gap-1.5 self-start text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ChevronUp className="h-4 w-4" aria-hidden />
          {t(`${A}hideAdvanced`)}
        </button>
      ) : null}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/90 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/30">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800 dark:text-emerald-200">{t(`${A}employerMatch`)}</p>
          <p className="mt-1 text-xl font-bold tabular-nums text-emerald-900 dark:text-emerald-100">+${monthlyMatch.toLocaleString()}</p>
          <p className="mt-0.5 text-xs font-medium text-emerald-800/90 dark:text-emerald-300/90">{t(`${A}employerMatchOnPreTax`)}</p>
        </div>
        <div className="rounded-xl border border-border bg-background p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t(`${A}totalMonthlyLabel`)}</p>
          <p className="mt-1 text-xl font-bold tabular-nums text-foreground">${totalMonthlyInvestment.toLocaleString()}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{t(`${A}totalMonthlyYouPlusEmployer`)}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-border pt-3 text-xs text-muted-foreground">
        <span className="font-medium text-foreground">{t(`${A}learnPrefix`)}</span>
        <button
          type="button"
          onClick={() => onScrollExplain("source-explain-pretax")}
          className="inline-flex items-center gap-1.5 rounded-full border border-[color-mix(in_srgb,var(--color-primary)_25%,transparent)] bg-[color-mix(in_srgb,var(--color-primary)_8%,transparent)] px-2.5 py-0.5 font-medium text-[var(--color-primary)]"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-primary)]" aria-hidden />
          {t(`${A}preTaxLabel`)}
        </button>
        <button
          type="button"
          onClick={() => onScrollExplain("source-explain-roth")}
          className="inline-flex items-center gap-1.5 rounded-full border border-purple-200 bg-purple-50 px-2.5 py-0.5 font-medium text-purple-700 dark:border-purple-800 dark:bg-purple-950/50 dark:text-purple-300"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-purple-600" aria-hidden />
          {t(`${A}rothLabel`)}
        </button>
        <button
          type="button"
          onClick={() => onScrollExplain("source-explain-aftertax")}
          className="inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50 px-2.5 py-0.5 font-medium text-orange-700 dark:border-orange-800 dark:bg-orange-950/50 dark:text-orange-300"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-orange-500" aria-hidden />
          {t(`${A}afterTaxLabel`)}
        </button>
      </div>

      <button
        type="button"
        onClick={onApply}
        disabled={applyDisabled}
        className={cn(
          "flex h-12 w-full items-center justify-center rounded-xl text-sm font-semibold transition-colors",
          applyDisabled
            ? "cursor-not-allowed bg-muted text-muted-foreground"
            : "bg-[var(--enroll-brand)] text-[var(--color-text-on-primary)] shadow-sm hover:opacity-90",
        )}
      >
        {t(`${A}adjustSlidersToApply`)}
      </button>

      <button
        type="button"
        onClick={onReset}
        className="flex w-full items-center justify-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
        {t(`${A}resetToPlanDefault`)}
      </button>
    </>
  );
}

function ExpandDualSlider({
  label,
  color,
  value,
  onChange,
  whatsThisLabel,
  onWhatsThis,
}: {
  label: string;
  color: "blue" | "purple";
  value: number;
  onChange: (n: number) => void;
  whatsThisLabel: string;
  onWhatsThis: () => void;
}) {
  const displayPct = Math.round(value);
  const rangeMod = color === "blue" ? "source-allocation-range--pretax" : "source-allocation-range--roth";
  return (
    <div className="space-y-2 rounded-xl border border-border/80 p-4 [background:color-mix(in_srgb,var(--color-background-secondary)_22%,var(--color-background)_78%)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <span
            className={cn(
              "alloc-dot alloc-dot--md shrink-0",
              color === "blue" ? "alloc-dot--pretax" : "alloc-dot--roth",
            )}
          />
          <span className="text-sm font-semibold text-foreground">{label}</span>
          <button type="button" onClick={onWhatsThis} className="text-xs font-medium text-primary hover:underline">
            {whatsThisLabel}
          </button>
        </div>
        <p className={cn("shrink-0 tabular-nums", color === "blue" ? "alloc-value-pretax" : "alloc-value-roth")}>
          {displayPct}%
        </p>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={Math.min(100, Math.max(0, value))}
        onChange={(e) => onChange(Number(e.target.value))}
        className={cn("source-allocation-range w-full min-w-0", rangeMod)}
        style={{ "--range-pct": `${Math.min(100, Math.max(0, value))}%` } as CSSProperties}
        aria-label={label}
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>0%</span>
        <span>100%</span>
      </div>
    </div>
  );
}

const ACCENT_BY_COLOR: Record<"blue" | "purple" | "orange", { valueClass: string }> = {
  blue: { valueClass: "alloc-value-pretax" },
  purple: { valueClass: "alloc-value-roth" },
  orange: { valueClass: "alloc-value-aftertax" },
};

function SliderRow({
  label,
  sub,
  color,
  value,
  monthly,
  onChange,
}: {
  label: string;
  sub: string;
  color: "blue" | "purple" | "orange";
  value: number;
  monthly: number;
  onChange: (n: number) => void;
}) {
  const { valueClass } = ACCENT_BY_COLOR[color];
  const rangeMod =
    color === "blue"
      ? "source-allocation-range--pretax"
      : color === "purple"
        ? "source-allocation-range--roth"
        : "source-allocation-range--aftertax";
  return (
    <div className="space-y-2 rounded-xl border border-border/80 p-4 [background:color-mix(in_srgb,var(--color-background-secondary)_22%,var(--color-background)_78%)]">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "alloc-dot alloc-dot--md",
                color === "blue" && "alloc-dot--pretax",
                color === "purple" && "alloc-dot--roth",
                color === "orange" && "alloc-dot--aftertax",
              )}
            />
            <p className="text-sm font-semibold text-foreground">{label}</p>
          </div>
          <p className="ml-5 text-[0.7rem] leading-snug text-muted-foreground">{sub}</p>
        </div>
        <p className={valueClass}>{value}%</p>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={cn("source-allocation-range", rangeMod)}
        style={{ "--range-pct": `${value}%` } as CSSProperties}
      />
      <div className="flex justify-between text-[0.7rem] text-muted-foreground">
        <span>0%</span>
        <span className="font-semibold text-foreground">${monthly.toLocaleString()}/mo</span>
        <span>100%</span>
      </div>
    </div>
  );
}

const EXPLAIN_ACCENT: Record<"pretax" | "roth" | "aftertax", { icon: string; check: string }> = {
  pretax: { icon: "bg-[var(--color-primary)]", check: "text-[var(--color-primary)]" },
  roth: { icon: "bg-purple-600", check: "text-purple-600" },
  aftertax: { icon: "bg-orange-500", check: "text-orange-500" },
};

function ExplainCard({
  id,
  title,
  subtitle,
  icon,
  variant,
  items,
  className,
}: {
  id?: string;
  title: string;
  subtitle: string;
  icon: ReactNode;
  variant: "pretax" | "roth" | "aftertax";
  items: string[];
  className?: string;
}) {
  const accent = EXPLAIN_ACCENT[variant];
  return (
    <div
      id={id}
      className={cn(
        "rounded-xl border border-border/80 p-4 transition-all hover:-translate-y-px hover:shadow-md [background:color-mix(in_srgb,var(--color-background-secondary)_22%,var(--color-background)_78%)]",
        className,
      )}
    >
      <div className="mb-3 flex items-start gap-2.5">
        <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white", accent.icon)}>
          {icon}
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      <div className="space-y-1.5">
        {items.map((line) => (
          <div key={line} className="flex items-start gap-2">
            <Check className={cn("mt-0.5 h-3.5 w-3.5 shrink-0", accent.check)} aria-hidden />
            <p className="text-sm text-muted-foreground">{line}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
