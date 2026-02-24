import { useState, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { GuidedFlowDrawer } from "../GuidedFlowDrawer";
import { useAnimatedNumber } from "../../hooks/useAnimatedNumber";
import { useLocaleFormat } from "../../hooks/useLocaleFormat";
import { calculateContributionImpact } from "../../utils/calculations";
import type { HubFinancialData } from "../../data/mockHubData";

interface ContributionGuidedFlowProps {
  open: boolean;
  onClose: () => void;
  data: HubFinancialData;
}

const TOTAL_STEPS = 4;

export function ContributionGuidedFlow({ open, onClose, data }: ContributionGuidedFlowProps) {
  const { t } = useTranslation();
  const fmt = useLocaleFormat();
  const [step, setStep] = useState(0);
  const [rate, setRate] = useState(data.currentContributionRate);
  const [confirmed, setConfirmed] = useState(false);

  const impact = useMemo(
    () => calculateContributionImpact(data.annualSalary, data.currentContributionRate, rate, data.federalTaxRate, data.projectedBalance, data.avgReturnRate, data.yearsToRetirement),
    [rate, data],
  );

  const animPaycheck = useAnimatedNumber(impact.monthlyPaycheckDelta);
  const animTax = useAnimatedNumber(impact.annualTaxSavings);
  const animAge = useAnimatedNumber(impact.retirementAgeDelta);
  const animBalance = useAnimatedNumber(impact.projectedBalanceDelta);

  const canProceed = step === 3 ? confirmed : true;

  const handleNext = useCallback(() => {
    if (step < TOTAL_STEPS - 1) setStep((s) => s + 1);
    else { onClose(); setStep(0); setConfirmed(false); }
  }, [step, onClose]);
  const handleBack = useCallback(() => { if (step > 0) setStep((s) => s - 1); }, [step]);
  const handleClose = useCallback(() => { setStep(0); setConfirmed(false); onClose(); }, [onClose]);

  const stepTitles = [
    t("transactionHub.contributionFlow.step1Title"),
    t("transactionHub.contributionFlow.step2Title"),
    t("transactionHub.contributionFlow.step3Title"),
    t("transactionHub.contributionFlow.step4Title"),
  ];

  return (
    <GuidedFlowDrawer
      open={open}
      onClose={handleClose}
      title={stepTitles[step]}
      currentStep={step}
      totalSteps={TOTAL_STEPS}
      onBack={handleBack}
      onNext={handleNext}
      canProceed={canProceed}
      isLastStep={step === TOTAL_STEPS - 1}
    >
      {/* Step 1: Current Snapshot */}
      {step === 0 && (
        <div className="flex flex-col gap-5">
          <div className="flex flex-col items-center gap-2 rounded-xl p-6" style={{ backgroundColor: "var(--color-background-secondary, var(--color-background))" }}>
            <span className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-secondary)]">{t("transactionHub.contribution.rate")}</span>
            <span className="text-4xl font-bold tabular-nums text-[var(--color-primary)]">{data.currentContributionRate}%</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Tile label={t("transactionHub.contribution.paycheckImpact")} value={fmt.currency((data.annualSalary * data.currentContributionRate) / 100 / 12)} color="var(--color-text)" />
            <Tile label={t("transactionHub.contribution.taxSavings")} value={fmt.currency((data.annualSalary * data.currentContributionRate / 100) * data.federalTaxRate)} color="var(--color-success)" />
          </div>
        </div>
      )}

      {/* Step 2: Adjust Rate */}
      {step === 1 && (
        <div className="flex flex-col gap-5">
          <div className="flex flex-col items-center gap-4 rounded-xl border border-[var(--color-border)] p-6" style={{ backgroundColor: "var(--color-surface)" }}>
            <span className="text-5xl font-bold tabular-nums text-[var(--color-primary)]">{rate}%</span>
            <input
              type="range"
              min={0}
              max={25}
              step={0.5}
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-full accent-[var(--color-primary)]"
              style={{ background: `linear-gradient(to right, var(--color-primary) ${(rate / 25) * 100}%, var(--color-border) ${(rate / 25) * 100}%)` }}
              aria-label={t("transactionHub.contribution.rate")}
            />
            <div className="flex w-full justify-between text-xs text-[var(--color-text-tertiary)]">
              <span>0%</span>
              <span>25%</span>
            </div>
          </div>
          {rate !== data.currentContributionRate && (
            <div className="rounded-lg border border-[var(--color-border)] p-3 text-center text-sm" style={{ backgroundColor: "var(--color-surface)" }}>
              <span className="text-[var(--color-text-secondary)]">
                {data.currentContributionRate}% → {rate}%
              </span>
              <span className="ml-2 font-semibold" style={{ color: rate > data.currentContributionRate ? "var(--color-success)" : "var(--color-warning, #ca8a04)" }}>
                ({rate > data.currentContributionRate ? "+" : ""}{(rate - data.currentContributionRate).toFixed(1)}%)
              </span>
            </div>
          )}
        </div>
      )}

      {/* Step 3: Impact Preview */}
      {step === 2 && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <Tile
              label={t("transactionHub.contribution.paycheckImpact")}
              value={`${animPaycheck >= 0 ? "+" : ""}${fmt.currency(animPaycheck)}${t("transactionHub.contribution.perMonth")}`}
              color={animPaycheck < 0 ? "var(--color-danger)" : "var(--color-success)"}
            />
            <Tile label={t("transactionHub.contribution.taxSavings")} value={fmt.currency(animTax)} color="var(--color-success)" />
            <Tile
              label={t("transactionHub.contribution.retirementShift")}
              value={`${fmt.number(Math.abs(animAge), 1)} ${t(`transactionHub.contribution.${animAge <= 0 ? "earlier" : "later"}`)}`}
              color={animAge <= 0 ? "var(--color-success)" : "var(--color-danger)"}
            />
            <Tile
              label={t("transactionHub.contribution.projectedDelta")}
              value={`${animBalance >= 0 ? "+" : ""}${fmt.currency(animBalance, true)}`}
              color={animBalance >= 0 ? "var(--color-success)" : "var(--color-danger)"}
            />
          </div>
        </div>
      )}

      {/* Step 4: Confirm */}
      {step === 3 && (
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-3 rounded-xl border border-[var(--color-border)] p-4" style={{ backgroundColor: "var(--color-surface)" }}>
            <Row label={t("transactionHub.contribution.rate")} value={`${data.currentContributionRate}% → ${rate}%`} />
            <Row label={t("transactionHub.contribution.paycheckImpact")} value={`${impact.monthlyPaycheckDelta >= 0 ? "+" : ""}${fmt.currency(impact.monthlyPaycheckDelta)}${t("transactionHub.contribution.perMonth")}`} bold />
            <Row label={t("transactionHub.contribution.projectedDelta")} value={`${impact.projectedBalanceDelta >= 0 ? "+" : ""}${fmt.currency(impact.projectedBalanceDelta, true)}`} bold />
          </div>
          <label className="flex items-start gap-3 rounded-lg border border-[var(--color-border)] p-4">
            <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 rounded accent-[var(--color-primary)]" />
            <span className="text-sm text-[var(--color-text-secondary)]">{t("transactionHub.loanFlow.termsAgreement")}</span>
          </label>
        </div>
      )}
    </GuidedFlowDrawer>
  );
}

function Tile({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border border-[var(--color-border)] p-3" style={{ backgroundColor: "var(--color-surface)" }}>
      <span className="text-xs text-[var(--color-text-secondary)]">{label}</span>
      <span className="text-lg font-bold tabular-nums" style={{ color }}>{value}</span>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-[var(--color-text-secondary)]">{label}</span>
      <span className={`text-sm tabular-nums ${bold ? "font-bold" : "font-medium"} text-[var(--color-text)]`}>{value}</span>
    </div>
  );
}
