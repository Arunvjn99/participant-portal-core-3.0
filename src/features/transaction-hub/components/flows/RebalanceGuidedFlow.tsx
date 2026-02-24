import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { GuidedFlowDrawer } from "../GuidedFlowDrawer";
import { useAnimatedNumber } from "../../hooks/useAnimatedNumber";
import { useLocaleFormat } from "../../hooks/useLocaleFormat";
import { calculateVolatilityReduction, calculateOpportunityCost } from "../../utils/calculations";
import type { HubFinancialData } from "../../data/mockHubData";

interface RebalanceGuidedFlowProps {
  open: boolean;
  onClose: () => void;
  data: HubFinancialData;
}

const ALLOC_KEYS = ["stocks", "bonds", "cash", "other"] as const;
const ALLOC_COLORS: Record<string, string> = {
  stocks: "var(--chart-1, var(--color-primary))",
  bonds: "var(--chart-2, var(--color-success))",
  cash: "var(--chart-3, var(--color-warning, #ca8a04))",
  other: "var(--chart-4, var(--color-text-tertiary))",
};
const TOTAL_STEPS = 4;

export function RebalanceGuidedFlow({ open, onClose, data }: RebalanceGuidedFlowProps) {
  const { t } = useTranslation();
  const fmt = useLocaleFormat();
  const [step, setStep] = useState(0);
  const [confirmed, setConfirmed] = useState(false);

  const volReduction = calculateVolatilityReduction(data.portfolioDriftPercent);
  const projDelta = calculateOpportunityCost(
    data.projectedBalance * (data.portfolioDriftPercent / 100),
    data.avgReturnRate,
    data.yearsToRetirement,
  );

  const animDrift = useAnimatedNumber(data.portfolioDriftPercent);
  const animRisk = useAnimatedNumber(data.riskScore);
  const animVol = useAnimatedNumber(volReduction);
  const animDelta = useAnimatedNumber(projDelta);

  const canProceed = step === 3 ? confirmed : true;

  const handleNext = useCallback(() => {
    if (step < TOTAL_STEPS - 1) setStep((s) => s + 1);
    else { onClose(); setStep(0); setConfirmed(false); }
  }, [step, onClose]);
  const handleBack = useCallback(() => { if (step > 0) setStep((s) => s - 1); }, [step]);
  const handleClose = useCallback(() => { setStep(0); setConfirmed(false); onClose(); }, [onClose]);

  const stepTitles = [
    t("transactionHub.rebalanceFlow.step1Title"),
    t("transactionHub.rebalanceFlow.step2Title"),
    t("transactionHub.rebalanceFlow.step3Title"),
    t("transactionHub.rebalanceFlow.step4Title"),
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
      {/* Step 1: Drift Analysis */}
      {step === 0 && (
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-3">
            <Tile label={t("transactionHub.rebalance.currentDrift")} value={fmt.percent(animDrift)} color="var(--color-warning, #ca8a04)" />
            <Tile label={t("transactionHub.rebalance.riskScore")} value={`${fmt.number(animRisk)}/100`} color="var(--color-text)" />
          </div>
          <div className="flex flex-col gap-3">
            {ALLOC_KEYS.map((key) => {
              const cur = data.currentAllocation[key];
              const tgt = data.targetAllocation[key];
              const diff = cur - tgt;
              return (
                <div key={key} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-[var(--color-text)]">{t(`transactionHub.rebalance.${key}`)}</span>
                    <span className="tabular-nums text-[var(--color-text-secondary)]">
                      {cur}%
                      <span className="ml-1 text-xs" style={{ color: diff > 0 ? "var(--color-danger)" : diff < 0 ? "var(--color-success)" : "var(--color-text-tertiary)" }}>
                        ({diff > 0 ? "+" : ""}{diff}%)
                      </span>
                    </span>
                  </div>
                  <div className="relative h-2.5 w-full overflow-hidden rounded-full" style={{ backgroundColor: "var(--color-border)" }}>
                    <div className="absolute inset-y-0 left-0 rounded-full transition-all duration-500" style={{ width: `${cur}%`, backgroundColor: ALLOC_COLORS[key] }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 2: Suggested Allocation */}
      {step === 1 && (
        <div className="flex flex-col gap-5">
          <p className="text-sm text-[var(--color-text-secondary)]">{t("transactionHub.rebalance.suggestedAllocation")}</p>
          {ALLOC_KEYS.map((key) => {
            const cur = data.currentAllocation[key];
            const tgt = data.targetAllocation[key];
            return (
              <div key={key} className="flex flex-col gap-2 rounded-lg border border-[var(--color-border)] p-3" style={{ backgroundColor: "var(--color-surface)" }}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-[var(--color-text)]">{t(`transactionHub.rebalance.${key}`)}</span>
                  <span className="tabular-nums text-[var(--color-text-secondary)]">{cur}% → {tgt}%</span>
                </div>
                <div className="relative h-3 w-full overflow-hidden rounded-full" style={{ backgroundColor: "var(--color-border)" }}>
                  <div className="absolute inset-y-0 left-0 rounded-full transition-all duration-700" style={{ width: `${tgt}%`, backgroundColor: ALLOC_COLORS[key] }} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Step 3: Risk Improvement */}
      {step === 2 && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <Tile label={t("transactionHub.rebalance.volatilityReduction")} value={`-${fmt.number(animVol, 1)}%`} color="var(--color-success)" />
            <Tile label={t("transactionHub.rebalance.projectionDelta")} value={`+${fmt.currency(animDelta, true)}`} color="var(--color-success)" />
          </div>
          <div className="flex flex-col items-center gap-3 rounded-xl p-6" style={{ backgroundColor: "var(--color-background-secondary, var(--color-background))" }}>
            <span className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-secondary)]">{t("transactionHub.rebalance.riskScore")}</span>
            <div className="relative h-4 w-full max-w-xs overflow-hidden rounded-full" style={{ backgroundColor: "var(--color-border)" }}>
              <div className="absolute inset-y-0 left-0 rounded-full transition-all duration-700" style={{ width: `${data.riskScore - 8}%`, background: "linear-gradient(to right, var(--color-success), var(--color-warning, #ca8a04))" }} />
            </div>
            <span className="text-2xl font-bold tabular-nums text-[var(--color-text)]">{data.riskScore - 8}/100</span>
            <span className="text-xs text-[var(--color-success)]">↓ 8 {t("transactionHub.loanSim.projection")}</span>
          </div>
        </div>
      )}

      {/* Step 4: Confirm */}
      {step === 3 && (
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-3 rounded-xl border border-[var(--color-border)] p-4" style={{ backgroundColor: "var(--color-surface)" }}>
            {ALLOC_KEYS.map((key) => (
              <div key={key} className="flex items-center justify-between text-sm">
                <span className="text-[var(--color-text-secondary)]">{t(`transactionHub.rebalance.${key}`)}</span>
                <span className="font-medium tabular-nums text-[var(--color-text)]">{data.currentAllocation[key]}% → {data.targetAllocation[key]}%</span>
              </div>
            ))}
          </div>
          <label className="flex items-start gap-3 rounded-lg border border-[var(--color-border)] p-4">
            <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 rounded accent-[var(--color-primary)]" />
            <span className="text-sm text-[var(--color-text-secondary)]">{t("transactionHub.rebalance.confirmMessage")}</span>
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
      <span className="text-xl font-bold tabular-nums" style={{ color }}>{value}</span>
    </div>
  );
}
