import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { GuidedFlowDrawer } from "../GuidedFlowDrawer";
import { useLocaleFormat } from "../../hooks/useLocaleFormat";
import type { HubFinancialData } from "../../data/mockHubData";

interface RolloverGuidedFlowProps {
  open: boolean;
  onClose: () => void;
  data: HubFinancialData;
}

const ACCOUNT_TYPES = ["401k", "403b", "ira", "rothIra"] as const;
const TOTAL_STEPS = 4;

export function RolloverGuidedFlow({ open, onClose, data }: RolloverGuidedFlowProps) {
  const { t } = useTranslation();
  const fmt = useLocaleFormat();
  const [step, setStep] = useState(0);
  const [provider, setProvider] = useState("");
  const [accountType, setAccountType] = useState<string>("401k");
  const [amount, setAmount] = useState(25000);
  const [confirmed, setConfirmed] = useState(false);

  const canProceed =
    step === 0 ? provider.trim().length >= 2 :
    step === 3 ? confirmed :
    true;

  const handleNext = useCallback(() => {
    if (step < TOTAL_STEPS - 1) setStep((s) => s + 1);
    else { onClose(); setStep(0); setConfirmed(false); setProvider(""); }
  }, [step, onClose]);
  const handleBack = useCallback(() => { if (step > 0) setStep((s) => s - 1); }, [step]);
  const handleClose = useCallback(() => { setStep(0); setConfirmed(false); setProvider(""); onClose(); }, [onClose]);

  const stepTitles = [
    t("transactionHub.rolloverFlow.step1Title"),
    t("transactionHub.rolloverFlow.step2Title"),
    t("transactionHub.rolloverFlow.step3Title"),
    t("transactionHub.rolloverFlow.step4Title"),
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
      {/* Step 1: Source */}
      {step === 0 && (
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="gf-rollover-provider" className="text-sm font-medium text-[var(--color-text-secondary)]">
              {t("transactionHub.rolloverFlow.sourceProvider")}
            </label>
            <input
              id="gf-rollover-provider"
              type="text"
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              placeholder="e.g. Fidelity, Vanguard"
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-tertiary)]"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="gf-rollover-type" className="text-sm font-medium text-[var(--color-text-secondary)]">
              {t("transactionHub.rolloverFlow.sourceAccount")}
            </label>
            <select
              id="gf-rollover-type"
              value={accountType}
              onChange={(e) => setAccountType(e.target.value)}
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-3 text-sm text-[var(--color-text)]"
            >
              {ACCOUNT_TYPES.map((at) => (
                <option key={at} value={at}>
                  {t(`transactionHub.rolloverFlow.account${at.charAt(0).toUpperCase() + at.slice(1)}`)}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Step 2: Amount & Plan */}
      {step === 1 && (
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="gf-rollover-amount" className="text-sm font-medium text-[var(--color-text-secondary)]">
              {t("transactionHub.rolloverFlow.estimatedAmount")}
            </label>
            <div className="flex flex-col items-center gap-4 rounded-xl border border-[var(--color-border)] p-6" style={{ backgroundColor: "var(--color-surface)" }}>
              <span className="text-3xl font-bold tabular-nums text-[var(--color-text)]">{fmt.currency(amount)}</span>
              <input
                id="gf-rollover-amount"
                type="range"
                min={1000}
                max={200000}
                step={1000}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-full accent-[var(--color-primary)]"
                style={{ background: `linear-gradient(to right, var(--color-primary) ${(amount / 200000) * 100}%, var(--color-border) ${(amount / 200000) * 100}%)` }}
              />
              <div className="flex w-full justify-between text-xs text-[var(--color-text-tertiary)]">
                <span>{fmt.currency(1000, true)}</span>
                <span>{fmt.currency(200000, true)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Timeline & Fees */}
      {step === 2 && (
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-4 rounded-xl border border-[var(--color-border)] p-5" style={{ backgroundColor: "var(--color-surface)" }}>
            <h4 className="text-sm font-semibold text-[var(--color-text)]">{t("transactionHub.rolloverFlow.processingTimeline")}</h4>
            {/* Timeline visualization */}
            <div className="flex flex-col gap-0">
              {(["timelineInitiate", "timelineProviderProcessing", "timelineFundTransfer", "timelineAccountCredit"] as const).map((key, i) => {
                const dayKeys = ["day1", "day2to5", "day5to10", "day10to15"] as const;
                return (
                  <div key={key} className="flex items-start gap-3 pb-4">
                    <div className="relative flex flex-col items-center">
                      <div className="h-3 w-3 rounded-full border-2" style={{ borderColor: "var(--color-primary)", backgroundColor: i === 0 ? "var(--color-primary)" : "transparent" }} />
                      {i < 3 && <div className="h-8 w-px" style={{ backgroundColor: "var(--color-border)" }} />}
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-medium text-[var(--color-text)]">{t(`transactionHub.rolloverFlow.${key}`)}</span>
                      <span className="text-xs text-[var(--color-text-tertiary)]">{t(`transactionHub.rolloverFlow.${dayKeys[i]}`)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Tile label={t("transactionHub.rolloverFlow.estimatedCompletion")} value={t("transactionHub.rolloverFlow.estimatedDays")} color="var(--color-text)" />
            <Tile label={t("transactionHub.rolloverFlow.noFees")} value={fmt.currency(0)} color="var(--color-success)" />
          </div>
        </div>
      )}

      {/* Step 4: Confirm */}
      {step === 3 && (
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-3 rounded-xl border border-[var(--color-border)] p-4" style={{ backgroundColor: "var(--color-surface)" }}>
            <Row label={t("transactionHub.rolloverFlow.sourceProvider")} value={provider} />
            <Row label={t("transactionHub.rolloverFlow.sourceAccount")} value={t(`transactionHub.rolloverFlow.account${accountType.charAt(0).toUpperCase() + accountType.slice(1)}`)} />
            <Row label={t("transactionHub.rolloverFlow.estimatedAmount")} value={fmt.currency(amount)} bold />
            <Row label={t("transactionHub.rolloverFlow.estimatedCompletion")} value={t("transactionHub.rolloverFlow.estimatedDays")} />
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
