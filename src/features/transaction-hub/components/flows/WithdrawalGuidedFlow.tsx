import { useState, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { GuidedFlowDrawer } from "../GuidedFlowDrawer";
import { useAnimatedNumber } from "../../hooks/useAnimatedNumber";
import { useLocaleFormat } from "../../hooks/useLocaleFormat";
import { calculateWithdrawalNet, calculateOpportunityCost } from "../../utils/calculations";
import type { HubFinancialData } from "../../data/mockHubData";

interface WithdrawalGuidedFlowProps {
  open: boolean;
  onClose: () => void;
  data: HubFinancialData;
}

type WithdrawalType = "hardship" | "regular" | "roth";
const TOTAL_STEPS = 5;

export function WithdrawalGuidedFlow({ open, onClose, data }: WithdrawalGuidedFlowProps) {
  const { t } = useTranslation();
  const fmt = useLocaleFormat();

  const [step, setStep] = useState(0);
  const [wType, setWType] = useState<WithdrawalType | null>(null);
  const [amount, setAmount] = useState(10000);
  const [confirmed, setConfirmed] = useState(false);

  const maxWithdrawal = Math.round(data.projectedBalance * 0.2);
  const isRoth = wType === "roth";
  const isEarly = wType !== "roth";

  const calc = useMemo(() => {
    const fedRate = isRoth ? 0 : data.federalTaxRate;
    const stRate = isRoth ? 0 : data.stateTaxRate;
    const penRate = isEarly ? data.earlyWithdrawalPenalty : 0;
    const net = calculateWithdrawalNet(amount, fedRate, stRate, penRate, isEarly);
    const retImpact = calculateOpportunityCost(amount, data.avgReturnRate, data.yearsToRetirement);
    return { ...net, retImpact };
  }, [amount, wType, isRoth, isEarly, data]);

  const animNet = useAnimatedNumber(calc.netPayout);
  const animFed = useAnimatedNumber(calc.federalTax);
  const animState = useAnimatedNumber(calc.stateTax);
  const animPenalty = useAnimatedNumber(calc.penalty);
  const animImpact = useAnimatedNumber(calc.retImpact);

  const canProceed =
    step === 0 ? wType !== null :
    step === 4 ? confirmed :
    true;

  const handleNext = useCallback(() => {
    if (step < TOTAL_STEPS - 1) setStep((s) => s + 1);
    else { onClose(); setStep(0); setConfirmed(false); }
  }, [step, onClose]);

  const handleBack = useCallback(() => { if (step > 0) setStep((s) => s - 1); }, [step]);
  const handleClose = useCallback(() => { setStep(0); setConfirmed(false); onClose(); }, [onClose]);

  const stepTitles = [
    t("transactionHub.withdrawFlow.step1Title"),
    t("transactionHub.withdrawFlow.step2Title"),
    t("transactionHub.withdrawFlow.step3Title"),
    t("transactionHub.withdrawFlow.step4Title"),
    t("transactionHub.withdrawFlow.step5Title"),
  ];

  const typeCards: { type: WithdrawalType; titleKey: string; descKey: string }[] = [
    { type: "hardship", titleKey: "transactionHub.withdrawFlow.hardship", descKey: "transactionHub.withdrawFlow.hardshipDesc" },
    { type: "regular", titleKey: "transactionHub.withdrawFlow.regular", descKey: "transactionHub.withdrawFlow.regularDesc" },
    { type: "roth", titleKey: "transactionHub.withdrawFlow.roth", descKey: "transactionHub.withdrawFlow.rothDesc" },
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
      {/* Step 1: Select Type */}
      {step === 0 && (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-[var(--color-text-secondary)]">{t("transactionHub.withdrawFlow.selectType")}</p>
          {typeCards.map((tc) => (
            <button
              key={tc.type}
              type="button"
              onClick={() => setWType(tc.type)}
              className={`flex flex-col gap-1 rounded-xl border p-4 text-left transition-all duration-150 ${
                wType === tc.type
                  ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5"
                  : "border-[var(--color-border)] hover:border-[var(--color-primary)]/50"
              }`}
              style={{ backgroundColor: wType === tc.type ? undefined : "var(--color-surface)" }}
            >
              <span className="text-sm font-semibold text-[var(--color-text)]">{t(tc.titleKey)}</span>
              <span className="text-xs text-[var(--color-text-secondary)]">{t(tc.descKey)}</span>
            </button>
          ))}
        </div>
      )}

      {/* Step 2: Amount */}
      {step === 1 && (
        <div className="flex flex-col gap-5">
          <label htmlFor="gf-withdraw-amount" className="text-sm font-medium text-[var(--color-text-secondary)]">
            {t("transactionHub.withdrawSim.amount")}
          </label>
          <div className="flex flex-col items-center gap-4 rounded-xl border border-[var(--color-border)] p-6" style={{ backgroundColor: "var(--color-surface)" }}>
            <span className="text-3xl font-bold tabular-nums text-[var(--color-text)]">{fmt.currency(amount)}</span>
            <input
              id="gf-withdraw-amount"
              type="range"
              min={1000}
              max={maxWithdrawal}
              step={500}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-full accent-[var(--color-primary)]"
              style={{ background: `linear-gradient(to right, var(--color-primary) ${(amount / maxWithdrawal) * 100}%, var(--color-border) ${(amount / maxWithdrawal) * 100}%)` }}
            />
            <div className="flex w-full justify-between text-xs text-[var(--color-text-tertiary)]">
              <span>{fmt.currency(1000, true)}</span>
              <span>{fmt.currency(maxWithdrawal, true)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Tax & Penalty */}
      {step === 2 && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col items-center gap-2 rounded-xl p-6" style={{ backgroundColor: "var(--color-background-secondary, var(--color-background))" }}>
            <span className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-secondary)]">{t("transactionHub.withdrawSim.netPayout")}</span>
            <span className="text-3xl font-bold tabular-nums text-[var(--color-success)]">{fmt.currency(animNet)}</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Tile label={t("transactionHub.withdrawSim.federalTax")} value={`-${fmt.currency(animFed)}`} color="var(--color-danger)" />
            <Tile label={t("transactionHub.withdrawSim.stateTax")} value={`-${fmt.currency(animState)}`} color="var(--color-danger)" />
            <Tile label={t("transactionHub.withdrawSim.penalty")} value={isEarly ? `-${fmt.currency(animPenalty)}` : "—"} color="var(--color-danger)" />
            <Tile label={t("transactionHub.withdrawSim.riskChange")} value={`+${fmt.number((calc.retImpact / data.projectedBalance) * 100, 1)}%`} color="var(--color-warning, #ca8a04)" />
          </div>
        </div>
      )}

      {/* Step 4: Retirement Impact */}
      {step === 3 && (
        <div className="flex flex-col gap-5">
          <div className="flex flex-col items-center gap-3 rounded-xl border border-[var(--color-border)] p-6" style={{ backgroundColor: "var(--color-surface)" }}>
            <span className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-secondary)]">{t("transactionHub.withdrawSim.retirementImpact")}</span>
            <span className="text-3xl font-bold tabular-nums text-[var(--color-danger)]">-{fmt.currency(animImpact, true)}</span>
            <p className="text-center text-xs text-[var(--color-text-tertiary)]">
              {t("transactionHub.loanSim.projection")}
            </p>
          </div>
          <div className="rounded-lg border border-[var(--color-border)] p-4" style={{ backgroundColor: "var(--color-surface)" }}>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[var(--color-text-secondary)]">{t("transactionHub.loanSim.projectedBalance")}</span>
              <span className="font-bold tabular-nums text-[var(--color-text)]">{fmt.currency(data.projectedBalance - calc.retImpact, true)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Step 5: Confirm */}
      {step === 4 && (
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-3 rounded-xl border border-[var(--color-border)] p-4" style={{ backgroundColor: "var(--color-surface)" }}>
            <Row label={t("transactionHub.withdrawSim.type")} value={wType ? t(`transactionHub.withdrawFlow.${wType}`) : ""} />
            <Row label={t("transactionHub.withdrawSim.amount")} value={fmt.currency(amount)} />
            <Row label={t("transactionHub.withdrawSim.netPayout")} value={fmt.currency(calc.netPayout)} bold />
            <Row label={t("transactionHub.withdrawSim.federalTax")} value={`-${fmt.currency(calc.federalTax)}`} danger />
            <Row label={t("transactionHub.withdrawSim.stateTax")} value={`-${fmt.currency(calc.stateTax)}`} danger />
            {isEarly && <Row label={t("transactionHub.withdrawSim.penalty")} value={`-${fmt.currency(calc.penalty)}`} danger />}
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

function Row({ label, value, bold, danger }: { label: string; value: string; bold?: boolean; danger?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-[var(--color-text-secondary)]">{label}</span>
      <span className={`text-sm tabular-nums ${bold ? "font-bold" : "font-medium"}`} style={{ color: danger ? "var(--color-danger)" : "var(--color-text)" }}>{value}</span>
    </div>
  );
}
