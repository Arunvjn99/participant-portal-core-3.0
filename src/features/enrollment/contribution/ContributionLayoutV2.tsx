/**
 * Contribution step — UI layout only. No local state, no calculations.
 * Contribution fields always editable. Only Tax Strategy has "Edit Contribution Split".
 */
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Percent, DollarSign, Zap, Settings, PiggyBank } from "lucide-react";
import Button from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { AIInsightBanner } from "../../../enrollment-v2/components/AIInsightBanner";
import { ContributionQuickSelect } from "../../../enrollment-v2/components/ContributionQuickSelect";
import { ContributionProjectionCard } from "../../../enrollment-v2/components/ContributionProjectionCard";
import { ContributionSourceCard } from "../../../enrollment-v2/components/ContributionSourceCard";

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
  sourceEnabled: { preTax: boolean; roth: boolean; afterTax: boolean };
  onSourceEnabledChange: (key: "preTax" | "roth" | "afterTax", enabled: boolean) => void;
  sourcesEditMode: boolean;
  onSourcesEditModeToggle: () => void;
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
  sourceEnabled,
  onSourceEnabledChange,
  sourcesEditMode,
  onSourcesEditModeToggle,
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

  return (
    <div className="max-w-6xl w-full mx-auto space-y-6 min-w-0">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6 min-w-0">
          <AIInsightBanner
            icon={<Zap className="w-5 h-5 flex-shrink-0" />}
            title="Maximize Your Match"
            description={`Your employer matches up to ${employerMatchCap}% of your salary. By contributing at least ${employerMatchCap}%, you can get the full match.`}
          />

          <div
            className="enrollment-card rounded-2xl border border-[var(--enroll-card-border)] p-6 min-w-0"
            style={{ background: "var(--enroll-card-bg)" }}
          >
            <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-lg font-semibold" style={{ color: "var(--enroll-text-primary)" }}>
                    Set Your Contribution
                  </h3>
                  {onAskAIContribution && (
                    <Button
                      type="button"
                      onClick={onAskAIContribution}
                      className="!bg-transparent hover:!bg-[var(--enroll-soft-bg)] !border-0 !shadow-none text-sm font-medium !py-1.5 !px-2"
                      style={{ color: "var(--enroll-brand)" }}
                    >
                      Ask AI
                    </Button>
                  )}
                </div>
                <p className="text-sm mt-0.5" style={{ color: "var(--enroll-text-secondary)" }}>
                  Choose how much to save for retirement
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium mb-0.5" style={{ color: "var(--enroll-text-secondary)" }}>
                  Monthly Paycheck
                </div>
                <div className="text-lg font-bold" style={{ color: "var(--enroll-text-primary)" }}>
                  ${monthlySalary.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Quick select chips + % / $ Toggle */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium" style={{ color: "var(--enroll-text-secondary)" }}>
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
                  matchValue={6}
                />
              </div>
              <div
                className="flex items-center gap-1 rounded-lg p-1"
                style={{ background: "var(--surface-2)" }}
              >
                <button
                  type="button"
                  onClick={() => onContributionTypeChange("percentage")}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
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
                  onClick={() => onContributionTypeChange("fixed")}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
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
                  <h3 className="text-sm font-medium mb-1.5" style={{ color: "var(--enroll-text-primary)" }}>
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
                        className="w-28 min-w-0 text-2xl md:text-3xl font-semibold text-center tabular-nums"
                        aria-label="Contribution percentage"
                      />
                      <span className="text-xl" style={{ color: "var(--enroll-text-secondary)" }}>%</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-xl" style={{ color: "var(--enroll-text-secondary)" }}>$</span>
                      <Input
                        type="number"
                        min={minDollar}
                        max={maxDollar}
                        value={String(contributionAmount)}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          if (val >= minDollar && val <= maxDollar) onContributionAmountChange(val);
                        }}
                        className="w-32 min-w-0 text-2xl md:text-3xl font-semibold text-center tabular-nums"
                        aria-label="Contribution amount per month in dollars"
                      />
                      <span className="text-sm" style={{ color: "var(--text-secondary)" }}>/mo</span>
                    </div>
                  )}
                </div>
                <motion.div
                  layout
                  initial={{ opacity: 0.9, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-lg border px-4 py-2 text-sm min-w-[180px]"
                  style={{ background: "var(--surface-2)", borderColor: "var(--border-subtle)" }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <PiggyBank className="w-4 h-4 flex-shrink-0" style={{ color: "var(--success)" }} />
                    <span className="font-semibold" style={{ color: "var(--text-primary)" }}>
                      Building Your Future
                    </span>
                  </div>
                  <p style={{ color: "var(--text-primary)" }}>
                    You're saving <strong>${Math.round(monthlyContribution.total).toLocaleString()}/month</strong>
                  </p>
                </motion.div>
              </div>

              {/* Slider: enrollment tokens, consistent thumb, keyboard accessible, value visible via input above */}
              <div className="relative mt-3 mb-2">
                {contributionType === "percentage" ? (
                  <>
                    <input
                      type="range"
                      id="contribution-percent-slider"
                      min={minPercent}
                      max={maxPercent}
                      step={1}
                      value={contributionAmount}
                      onChange={(e) => onContributionAmountChange(Number(e.target.value))}
                      className="contrib-slider-v2 block w-full h-2 rounded-full appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, var(--enroll-brand) 0%, var(--enroll-brand) ${percentPct * 100}%, var(--enroll-card-border) ${percentPct * 100}%, var(--enroll-card-border) 100%)`,
                      }}
                      aria-label="Contribution percentage"
                      aria-valuemin={minPercent}
                      aria-valuemax={maxPercent}
                      aria-valuenow={contributionAmount}
                      aria-valuetext={`${contributionAmount} percent`}
                    />
                    <div className="flex justify-between text-sm mt-1.5 gap-4" style={{ color: "var(--enroll-text-secondary)" }}>
                      <span>{minPercent}%</span>
                      <span>{maxPercent}%</span>
                    </div>
                  </>
                ) : (
                  <>
                    <input
                      type="range"
                      id="contribution-dollar-slider"
                      min={minDollar}
                      max={maxDollar}
                      step={50}
                      value={contributionAmount}
                      onChange={(e) => onContributionAmountChange(Number(e.target.value))}
                      className="contrib-slider-v2 block w-full h-2 rounded-full appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, var(--enroll-brand) 0%, var(--enroll-brand) ${dollarPct * 100}%, var(--enroll-card-border) ${dollarPct * 100}%, var(--enroll-card-border) 100%)`,
                      }}
                      aria-label="Contribution amount per month in dollars"
                      aria-valuemin={minDollar}
                      aria-valuemax={maxDollar}
                      aria-valuenow={contributionAmount}
                      aria-valuetext={`$${contributionAmount} per month`}
                    />
                    <div className="flex justify-between text-sm mt-1.5 gap-4" style={{ color: "var(--enroll-text-secondary)" }}>
                      <span>${minDollar}</span>
                      <span>${maxDollar.toLocaleString()}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Tax Strategy */}
              <div className="mt-5 pt-5 border-t" style={{ borderColor: "var(--border-subtle)" }}>
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <h4 className="text-lg font-semibold" style={{ color: "var(--enroll-text-primary)" }}>
                    Tax Strategy
                  </h4>
                  {sourcesEditMode ? (
                    <Button
                      type="button"
                      size="sm"
                      onClick={onSourcesEditModeToggle}
                      className="!bg-[var(--enroll-brand)] hover:!opacity-90 !text-white !border-0 shadow-sm"
                    >
                      <Settings className="w-3.5 h-3.5 mr-2 rotate-90" />
                      {t("enrollment.done", "Done")}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      size="sm"
                      onClick={onSourcesEditModeToggle}
                      className="border-[var(--border-subtle)] bg-transparent hover:bg-[var(--surface-2)] text-[var(--text-primary)]"
                    >
                      <Settings className="w-3.5 h-3.5 mr-2" />
                      {t("enrollment.editContributionSplit", "Edit Contribution Split")}
                    </Button>
                  )}
                </div>
                <p className="text-sm mb-3" style={{ color: "var(--enroll-text-secondary)" }}>
                  Choose how to split your contributions across different tax treatments
                </p>

                <ContributionSourceCard
                  label="Pre-tax"
                  enabled={sourceEnabled.preTax}
                  onEnabledChange={(enabled) => onSourceEnabledChange("preTax", enabled)}
                  percentage={sourceAllocation.preTax}
                  monthlyAmount={(monthlyContribution.total * sourceAllocation.preTax) / 100}
                  isEditing={sourcesEditMode}
                  onPercentChange={(v) => onSourcePercentChange("preTax", v)}
                  onAskAI={onAskAIPreTax}
                  accentVar="--brand-primary"
                  disabled={!sourcesEditMode}
                />
                <ContributionSourceCard
                  label="Roth"
                  enabled={sourceEnabled.roth}
                  onEnabledChange={(enabled) => onSourceEnabledChange("roth", enabled)}
                  percentage={sourceAllocation.roth}
                  monthlyAmount={(monthlyContribution.total * sourceAllocation.roth) / 100}
                  isEditing={sourcesEditMode}
                  onPercentChange={(v) => onSourcePercentChange("roth", v)}
                  onAskAI={onAskAIRoth}
                  accentVar="--contrib-tax-roth"
                  disabled={!sourcesEditMode}
                />
                <ContributionSourceCard
                  label="After-tax"
                  enabled={sourceEnabled.afterTax}
                  onEnabledChange={(enabled) => onSourceEnabledChange("afterTax", enabled)}
                  percentage={sourceAllocation.afterTax}
                  monthlyAmount={(monthlyContribution.total * sourceAllocation.afterTax) / 100}
                  isEditing={sourcesEditMode}
                  onPercentChange={(v) => onSourcePercentChange("afterTax", v)}
                  onAskAI={onAskAIAfterTax}
                  accentVar="--success"
                  disabled={!sourcesEditMode}
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
                      style={{ width: `${sourceAllocation.roth}%`, background: "var(--contrib-tax-roth)" }}
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

        <div className="lg:col-span-1 space-y-6 min-w-0">
          <ContributionProjectionCard
            chartData={projectionChartData}
            finalProjectedValue={finalProjectedValue}
            yearsToRetire={yearsToRetire}
            totalContributionsOverTime={totalContributionsOverTime}
            className="enrollment-card"
          />

          <div
            className="enrollment-card rounded-2xl border border-[var(--enroll-card-border)] overflow-hidden p-5 min-w-0"
            style={{ background: "var(--enroll-card-bg)" }}
          >
            <div
              className="rounded-lg border p-4 mb-4 flex flex-wrap items-center justify-center gap-3"
              style={{ background: "var(--enroll-soft-bg)", borderColor: "var(--enroll-card-border)" }}
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[var(--brand-primary)]" />
                <span className="text-sm">You</span>
                <span className="font-bold">${perPaycheckContribution.toFixed(2)}</span>
              </div>
              <span style={{ color: "var(--text-secondary)" }}>+</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[var(--success)]" />
                <span className="text-sm">Employer</span>
                <span className="font-bold">${perPaycheckEmployerMatch.toFixed(2)}</span>
              </div>
              <span style={{ color: "var(--text-secondary)" }}>=</span>
              <div className="flex items-center gap-2 flex-shrink-0 min-w-0">
                <span className="text-sm flex-shrink-0">Total</span>
                <span className="text-lg font-semibold tabular-nums truncate">${Math.round(monthlyContribution.total).toLocaleString()}/mo</span>
              </div>
            </div>
            <div className="h-2.5 rounded-full overflow-hidden flex" style={{ background: "var(--surface-2)" }}>
              <div style={{ width: `${employeeShare}%`, background: "var(--brand-primary)" }} />
              <div style={{ width: `${employerShare}%`, background: "var(--success)" }} />
            </div>
            <p className="text-sm text-center mt-3" style={{ color: "var(--enroll-text-secondary)" }}>
              Based on {paychecksPerYear} pay periods per year • <strong>${Math.round(monthlyContribution.total * 12).toLocaleString()}/yr</strong> total
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

