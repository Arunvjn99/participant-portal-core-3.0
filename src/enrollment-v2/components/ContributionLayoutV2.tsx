/**
 * Contribution step — UI layout only. No local state, no calculations.
 * All values and handlers come from props (useEnrollment + useContributionStore).
 */
import { useTranslation } from "react-i18next";
import { Percent, DollarSign, Zap, Settings, PiggyBank } from "lucide-react";
import Button from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { AIInsightBanner } from "./AIInsightBanner";
import { ContributionQuickSelect } from "./ContributionQuickSelect";
import { ContributionProjectionCard } from "./ContributionProjectionCard";
import { ContributionSourceCard } from "./ContributionSourceCard";

export interface ContributionLayoutV2Props {
  /** Plan name for subtitle */
  selectedPlanLabel: string;
  /** Annual salary (display + limits) */
  salary: number;
  contributionType: "percentage" | "fixed";
  contributionAmount: number;
  onContributionTypeChange: (type: "percentage" | "fixed") => void;
  onContributionAmountChange: (amount: number) => void;
  /** Preset handler: set percentage */
  onPreset: (percent: number) => void;
  sourceAllocation: { preTax: number; roth: number; afterTax: number };
  onSourcePercentChange: (key: "preTax" | "roth" | "afterTax", value: number) => void;
  sourceEnabled?: { preTax: boolean; roth: boolean; afterTax: boolean };
  onSourceEnabledChange?: (key: "preTax" | "roth" | "afterTax", enabled: boolean) => void;
  sourcesEditMode: boolean;
  onSourcesEditModeToggle: () => void;
  /** When false, all controls are read-only; only Edit button shown. When true, controls enabled and Done shown. */
  isEditingContribution: boolean;
  onEditContribution: () => void;
  onDoneContribution: () => void;
  monthlyContribution: { employee: number; employer: number; total: number };
  perPaycheckContribution: number;
  perPaycheckEmployerMatch: number;
  perPaycheckTotal: number;
  /** Chart: year label, balance, contributions */
  projectionChartData: Array<{ year: string; value: number; contributions: number }>;
  finalProjectedValue: number;
  yearsToRetire: number;
  totalContributionsOverTime: number;
  employerMatchCap: number;
  paychecksPerYear: number;
  /** Slider bounds */
  minPercent?: number;
  maxPercent?: number;
  minDollar?: number;
  maxDollar?: number;
  onAskAIContribution?: () => void;
  onAskAIPreTax?: () => void;
  onAskAIRoth?: () => void;
  onAskAIAfterTax?: () => void;
}

export function ContributionLayoutV2({
  selectedPlanLabel,
  salary,
  contributionType,
  contributionAmount,
  onContributionTypeChange,
  onContributionAmountChange,
  onPreset,
  sourceAllocation,
  onSourcePercentChange,
  sourceEnabled: sourceEnabledProp,
  onSourceEnabledChange: onSourceEnabledChangeProp,
  sourcesEditMode,
  onSourcesEditModeToggle,
  isEditingContribution,
  onEditContribution,
  onDoneContribution,
  monthlyContribution,
  perPaycheckContribution,
  perPaycheckEmployerMatch,
  perPaycheckTotal,
  projectionChartData,
  finalProjectedValue,
  yearsToRetire,
  totalContributionsOverTime,
  employerMatchCap,
  paychecksPerYear,
  minPercent = 1,
  maxPercent = 25,
  minDollar = 100,
  maxDollar = 1916,
  onAskAIContribution,
  onAskAIPreTax,
  onAskAIRoth,
  onAskAIAfterTax,
}: ContributionLayoutV2Props) {
  const { t } = useTranslation();
  const monthlySalary = salary / 12;
  const percentPct = (contributionAmount - minPercent) / (maxPercent - minPercent);
  const dollarPct = (contributionAmount - minDollar) / (maxDollar - minDollar);
  const employeeShare = perPaycheckTotal > 0 ? (perPaycheckContribution / perPaycheckTotal) * 100 : 0;
  const employerShare = perPaycheckTotal > 0 ? (perPaycheckEmployerMatch / perPaycheckTotal) * 100 : 0;

  const sourceEnabled = sourceEnabledProp ?? {
    preTax: sourceAllocation.preTax > 0,
    roth: sourceAllocation.roth > 0,
    afterTax: sourceAllocation.afterTax > 0,
  };
  const onSourceEnabledChange = onSourceEnabledChangeProp ?? (() => {});

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Main Grid: 12 columns, left 8 / right 4 — page header rendered by page via ContributionHeader */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column — Contribution UI */}
        <div className="lg:col-span-8 space-y-6">
          {/* AI Insight Banner */}
          <AIInsightBanner
            icon={<Zap className="w-5 h-5" />}
            title="Maximize Your Match"
            description={`Your employer matches up to ${employerMatchCap}% of your salary. By contributing at least ${employerMatchCap}%, you can get the full match.`}
          />

          {/* Main Contribution Card — LEVEL 1 */}
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
                    Set Your Contribution
                  </h3>
                  {onAskAIContribution && isEditingContribution && (
                    <Button
                      type="button"
                      onClick={onAskAIContribution}
                      className="!bg-transparent hover:!bg-[var(--surface-2)] !border-0 !shadow-none text-sm !py-1.5 !px-2 text-[var(--brand-primary)]"
                    >
                      Ask AI
                    </Button>
                  )}
                </div>
                <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>
                  Choose how much to save for retirement
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <div className="text-xs mb-0.5" style={{ color: "var(--text-secondary)" }}>
                    Monthly Paycheck
                  </div>
                  <div className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
                    ${monthlySalary.toLocaleString()}
                  </div>
                </div>
                {isEditingContribution ? (
                  <Button type="button" variant="primary" onClick={onDoneContribution}>
                    {t("enrollment.done", "Done")}
                  </Button>
                ) : (
                  <Button type="button" variant="outline" onClick={onEditContribution}>
                    {t("enrollment.edit", "Edit")}
                  </Button>
                )}
              </div>
            </div>

            {/* Quick select chips + % / $ Toggle */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  Quick:
                </span>
                <ContributionQuickSelect
                  options={[
                    { value: 4, label: "4% Safe" },
                    { value: 6, label: "6% Match" },
                    { value: 15, label: "15% Aggressive" },
                  ]}
                  selectedValue={contributionType === "percentage" ? contributionAmount : 0}
                  contributionType={contributionType}
                  onSelect={onPreset}
                  disabled={!isEditingContribution}
                />
              </div>
              <div
                className="flex items-center gap-1 rounded-lg p-1"
                style={{ background: "var(--surface-2)" }}
              >
                <button
                  type="button"
                  disabled={!isEditingContribution}
                  onClick={() => onContributionTypeChange("percentage")}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
                    contributionType === "percentage" ? "bg-[var(--surface-1)] shadow-sm" : ""
                  }`}
                  style={{
                    color: contributionType === "percentage" ? "var(--brand-primary)" : "var(--text-secondary)",
                  }}
                >
                  <Percent className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  disabled={!isEditingContribution}
                  onClick={() => onContributionTypeChange("fixed")}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
                    contributionType === "fixed" ? "bg-[var(--surface-1)] shadow-sm" : ""
                  }`}
                  style={{
                    color: contributionType === "fixed" ? "var(--brand-primary)" : "var(--text-secondary)",
                  }}
                >
                  <DollarSign className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Slider + input */}
            <div className="mb-4">
              <div className="flex flex-wrap items-end justify-between gap-3 mb-3">
                <div>
                  <h3 className="text-sm font-semibold mb-1.5" style={{ color: "var(--text-primary)" }}>
                    Your Contribution
                  </h3>
                  {contributionType === "percentage" ? (
                    <div className="flex items-center gap-3">
                      <Input
                        type="number"
                        min={minPercent}
                        max={maxPercent}
                        value={String(contributionAmount)}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          if (val >= minPercent && val <= maxPercent) onContributionAmountChange(val);
                        }}
                        className="w-28 text-2xl md:text-4xl font-bold text-center"
                        disabled={!isEditingContribution}
                      />
                      <span className="text-xl" style={{ color: "var(--text-secondary)" }}>%</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-xl" style={{ color: "var(--text-secondary)" }}>$</span>
                      <Input
                        type="number"
                        min={minDollar}
                        max={maxDollar}
                        value={String(contributionAmount)}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          if (val >= minDollar && val <= maxDollar) onContributionAmountChange(val);
                        }}
                        className="w-32 text-2xl md:text-4xl font-bold text-center"
                        disabled={!isEditingContribution}
                      />
                      <span className="text-sm" style={{ color: "var(--text-secondary)" }}>/mo</span>
                    </div>
                  )}
                </div>
                <div className="rounded-lg border px-4 py-2 text-sm min-w-[180px] bg-[var(--color-success)]/10 border-[var(--color-success)]/30">
                  <div className="flex items-center gap-2 mb-1">
                    <PiggyBank className="w-4 h-4 text-green-600 dark:text-[var(--success)]" />
                    <span className="font-semibold text-green-900 dark:text-[var(--text-primary)]">
                      Building Your Future
                    </span>
                  </div>
                  <p className="text-green-800 dark:text-[var(--text-primary)]">
                    You're saving <strong>${Math.round(monthlyContribution.total).toLocaleString()}/month</strong>
                  </p>
                </div>
              </div>

              {/* Slider: h-2 track, rounded-full, accent-blue thumb */}
              <div className="relative mb-2">
                {contributionType === "percentage" ? (
                  <>
                    <input
                      type="range"
                      min={minPercent}
                      max={maxPercent}
                      step={1}
                      value={contributionAmount}
                      onChange={(e) => onContributionAmountChange(Number(e.target.value))}
                      disabled={!isEditingContribution}
                      className={`contrib-slider-v2 block w-full h-2 rounded-full appearance-none ${isEditingContribution ? "cursor-pointer" : "cursor-not-allowed opacity-80"}`}
                      style={{
                        background: `linear-gradient(to right, var(--brand-primary) 0%, var(--brand-primary) ${percentPct * 100}%, var(--border-subtle) ${percentPct * 100}%, var(--border-subtle) 100%)`,
                      }}
                    />
                    <div className="flex justify-between text-xs mt-1.5" style={{ color: "var(--text-secondary)" }}>
                      <span>{minPercent}%</span>
                      <span>{maxPercent}%</span>
                    </div>
                  </>
                ) : (
                  <>
                    <input
                      type="range"
                      min={minDollar}
                      max={maxDollar}
                      step={50}
                      value={contributionAmount}
                      onChange={(e) => onContributionAmountChange(Number(e.target.value))}
                      disabled={!isEditingContribution}
                      className={`contrib-slider-v2 block w-full h-2 rounded-full appearance-none ${isEditingContribution ? "cursor-pointer" : "cursor-not-allowed opacity-80"}`}
                      style={{
                        background: `linear-gradient(to right, var(--brand-primary) 0%, var(--brand-primary) ${dollarPct * 100}%, var(--border-subtle) ${dollarPct * 100}%, var(--border-subtle) 100%)`,
                      }}
                    />
                    <div className="flex justify-between text-xs mt-1.5" style={{ color: "var(--text-secondary)" }}>
                      <span>${minDollar}</span>
                      <span>${maxDollar.toLocaleString()}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Tax Strategy */}
              <div className="mt-5 pt-5 border-t" style={{ borderColor: "var(--border-subtle)" }}>
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <h4 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>
                    Tax Strategy
                  </h4>
                  {isEditingContribution && (
                    <Button
                      type="button"
                      size="sm"
                      onClick={onSourcesEditModeToggle}
                      className="border-[var(--border-subtle)] bg-transparent hover:bg-[var(--surface-2)] text-[var(--text-primary)]"
                    >
                      <Settings className={`w-3.5 h-3.5 mr-2 ${sourcesEditMode ? "rotate-90" : ""}`} />
                      {sourcesEditMode ? t("enrollment.done") : t("enrollment.editContributionSplit")}
                    </Button>
                  )}
                </div>
                <p className="text-xs mb-3" style={{ color: "var(--text-secondary)" }}>
                  Choose how to split your contributions across different tax treatments
                </p>

                <ContributionSourceCard
                  label="Pre-tax"
                  enabled={sourceEnabled.preTax}
                  onEnabledChange={(enabled) => onSourceEnabledChange("preTax", enabled)}
                  percentage={sourceAllocation.preTax}
                  monthlyAmount={(monthlyContribution.total * sourceAllocation.preTax) / 100}
                  isEditing={isEditingContribution && sourcesEditMode}
                  onPercentChange={(v) => onSourcePercentChange("preTax", v)}
                  onAskAI={onAskAIPreTax}
                  accentVar="--brand-primary"
                />
                <ContributionSourceCard
                  label="Roth"
                  enabled={sourceEnabled.roth}
                  onEnabledChange={(enabled) => onSourceEnabledChange("roth", enabled)}
                  percentage={sourceAllocation.roth}
                  monthlyAmount={(monthlyContribution.total * sourceAllocation.roth) / 100}
                  isEditing={isEditingContribution && sourcesEditMode}
                  onPercentChange={(v) => onSourcePercentChange("roth", v)}
                  onAskAI={onAskAIRoth}
                  accentVar="--enroll-accent"
                />
                <ContributionSourceCard
                  label="After-tax"
                  enabled={sourceEnabled.afterTax}
                  onEnabledChange={(enabled) => onSourceEnabledChange("afterTax", enabled)}
                  percentage={sourceAllocation.afterTax}
                  monthlyAmount={(monthlyContribution.total * sourceAllocation.afterTax) / 100}
                  isEditing={isEditingContribution && sourcesEditMode}
                  onPercentChange={(v) => onSourcePercentChange("afterTax", v)}
                  onAskAI={onAskAIAfterTax}
                  accentVar="--success"
                />

                {/* Split bar */}
                <div className="mt-3 h-3 rounded-full overflow-hidden flex" style={{ background: "var(--surface-2)" }}>
                  {sourceAllocation.preTax > 0 && (
                    <div
                      className="flex items-center justify-center text-xs text-white font-semibold"
                      style={{ width: `${sourceAllocation.preTax}%`, background: "var(--brand-primary)" }}
                    >
                      {sourceAllocation.preTax > 10 ? `${sourceAllocation.preTax}%` : ""}
                    </div>
                  )}
                  {sourceAllocation.roth > 0 && (
                    <div
                      className="flex items-center justify-center text-xs text-white font-semibold"
                      style={{ width: `${sourceAllocation.roth}%`, background: "var(--enroll-accent)" }}
                    >
                      {sourceAllocation.roth > 10 ? `${sourceAllocation.roth}%` : ""}
                    </div>
                  )}
                  {sourceAllocation.afterTax > 0 && (
                    <div
                      className="flex items-center justify-center text-xs text-white font-semibold"
                      style={{ width: `${sourceAllocation.afterTax}%`, background: "var(--success)" }}
                    >
                      {sourceAllocation.afterTax > 10 ? `${sourceAllocation.afterTax}%` : ""}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column — Projection card */}
        <div className="lg:col-span-4 space-y-6">
          <ContributionProjectionCard
            chartData={projectionChartData}
            finalProjectedValue={finalProjectedValue}
            yearsToRetire={yearsToRetire}
            totalContributionsOverTime={totalContributionsOverTime}
          />

          {/* Paycheck Impact */}
          {/* Paycheck Impact — LEVEL 1 */}
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden p-5 shadow-sm">
            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-background-secondary)] p-4 mb-4 flex flex-wrap items-center justify-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[var(--brand-primary)]" />
                <span className="text-body-sm">{t("enrollment.you")}</span>
                <span className="font-bold">${perPaycheckContribution.toFixed(2)}</span>
              </div>
              <span style={{ color: "var(--text-secondary)" }}>+</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[var(--success)]" />
                <span className="text-body-sm">{t("enrollment.employer")}</span>
                <span className="font-bold">${perPaycheckEmployerMatch.toFixed(2)}</span>
              </div>
              <span style={{ color: "var(--text-secondary)" }}>=</span>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-body-sm">{t("enrollment.total")}</span>
                <span className="text-xl font-bold">${Math.round(monthlyContribution.total).toLocaleString()}/mo</span>
              </div>
            </div>
            <div className="h-2.5 rounded-full overflow-hidden flex" style={{ background: "var(--surface-2)" }}>
              <div style={{ width: `${employeeShare}%`, background: "var(--brand-primary)" }} />
              <div style={{ width: `${employerShare}%`, background: "var(--success)" }} />
            </div>
            <p className="text-xs text-center mt-3" style={{ color: "var(--text-secondary)" }}>
              Based on {paychecksPerYear} pay periods per year • <strong>${Math.round(monthlyContribution.total * 12).toLocaleString()}/yr</strong> total
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

