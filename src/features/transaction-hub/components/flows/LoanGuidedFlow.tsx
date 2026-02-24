import { useState, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { GuidedFlowDrawer } from "../GuidedFlowDrawer";
import { useAnimatedNumber } from "../../hooks/useAnimatedNumber";
import { useLocaleFormat } from "../../hooks/useLocaleFormat";
import {
  calculateEMI,
  calculateOpportunityCost,
  calculateRetirementDelay,
  calculatePayrollDeduction,
  generateProjectionData,
} from "../../utils/calculations";
import type { HubFinancialData } from "../../data/mockHubData";

interface LoanGuidedFlowProps {
  open: boolean;
  onClose: () => void;
  data: HubFinancialData;
}

const TERM_OPTIONS = [1, 2, 3, 4, 5];
const PURPOSE_KEYS = ["general", "residential", "education", "hardship"] as const;
const LOAN_RATE = 0.045;
const TOTAL_STEPS = 4;

export function LoanGuidedFlow({ open, onClose, data }: LoanGuidedFlowProps) {
  const { t } = useTranslation();
  const fmt = useLocaleFormat();

  const [step, setStep] = useState(0);
  const [amount, setAmount] = useState(Math.round(data.maxLoanEligible * 0.4));
  const [termYears, setTermYears] = useState(5);
  const [repaymentType, setRepaymentType] = useState<"standard" | "accelerated">("standard");
  const [purpose, setPurpose] = useState<(typeof PURPOSE_KEYS)[number]>("general");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const effectiveRate = repaymentType === "accelerated" ? LOAN_RATE * 0.85 : LOAN_RATE;
  const termMonths = termYears * 12;

  const calc = useMemo(() => {
    const emi = calculateEMI(amount, effectiveRate, termMonths);
    const lostGrowth = calculateOpportunityCost(amount, data.avgReturnRate, data.yearsToRetirement);
    const retirementDelay = calculateRetirementDelay(lostGrowth, data.projectedBalance);
    const payrollPct = calculatePayrollDeduction(emi, data.annualSalary / 12);
    const newProjected = data.projectedBalance - lostGrowth;
    const riskDelta = (lostGrowth / data.projectedBalance) * 100;
    const monthlyContrib = (data.annualSalary * data.currentContributionRate) / 100 / 12;
    const projBase = generateProjectionData(data.projectedBalance, monthlyContrib, data.avgReturnRate, 24);
    const projLoan = generateProjectionData(data.projectedBalance - amount, monthlyContrib - emi * 0.3, data.avgReturnRate, 24);
    const chartData = projBase.map((p, i) => ({
      month: p.month,
      without: p.balance,
      with: projLoan[i]?.balance ?? p.balance,
    }));
    return { emi, lostGrowth, retirementDelay, payrollPct, newProjected, riskDelta, chartData };
  }, [amount, effectiveRate, termMonths, data]);

  const animEmi = useAnimatedNumber(calc.emi);
  const animPayroll = useAnimatedNumber(calc.payrollPct);
  const animCost = useAnimatedNumber(calc.lostGrowth);
  const animDelay = useAnimatedNumber(calc.retirementDelay);
  const animProjected = useAnimatedNumber(calc.newProjected);

  const canProceed = step === 3 ? termsAccepted : true;

  const handleNext = useCallback(() => {
    if (step < TOTAL_STEPS - 1) setStep((s) => s + 1);
    else onClose();
  }, [step, onClose]);

  const handleBack = useCallback(() => {
    if (step > 0) setStep((s) => s - 1);
  }, [step]);

  const handleClose = useCallback(() => {
    setStep(0);
    setTermsAccepted(false);
    onClose();
  }, [onClose]);

  return (
    <GuidedFlowDrawer
      open={open}
      onClose={handleClose}
      title={t("transactionHub.loanFlow.step" + (step + 1) + "Title")}
      currentStep={step}
      totalSteps={TOTAL_STEPS}
      onBack={handleBack}
      onNext={handleNext}
      canProceed={canProceed}
      isLastStep={step === TOTAL_STEPS - 1}
    >
      {step === 0 && (
        <div className="flex flex-col gap-5">
          <p className="text-sm text-[var(--color-text-secondary)]">
            {t("transactionHub.loanSim.title")}
          </p>
          <div className="grid grid-cols-2 gap-3">
            <MetricTile label={t("transactionHub.loanFlow.maxLoanEligible")} value={fmt.currency(data.maxLoanEligible, true)} color="var(--color-success)" />
            <MetricTile label={t("transactionHub.loanFlow.existingLoanBalance")} value={fmt.currency(0)} color="var(--color-text)" />
            <MetricTile label={t("transactionHub.loanFlow.availableBalance")} value={fmt.currency(data.projectedBalance, true)} color="var(--color-primary)" />
            <MetricTile label={t("transactionHub.loanFlow.riskIndicator")} value={t("transactionHub.snapshot.riskLow")} color="var(--color-success)" />
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="flex flex-col gap-5">
          {/* Amount slider */}
          <div className="flex flex-col gap-2">
            <label htmlFor="gf-loan-amount" className="text-sm font-medium text-[var(--color-text-secondary)]">
              {t("transactionHub.loanSim.loanAmount")}
            </label>
            <div className="flex items-center gap-3">
              <input
                id="gf-loan-amount"
                type="range"
                min={1000}
                max={data.maxLoanEligible}
                step={500}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="h-2 flex-1 cursor-pointer appearance-none rounded-full accent-[var(--color-primary)]"
                style={{ background: `linear-gradient(to right, var(--color-primary) ${(amount / data.maxLoanEligible) * 100}%, var(--color-border) ${(amount / data.maxLoanEligible) * 100}%)` }}
              />
              <span className="w-24 text-right text-lg font-bold tabular-nums text-[var(--color-text)]">
                {fmt.currency(amount, true)}
              </span>
            </div>
          </div>

          {/* Term */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-[var(--color-text-secondary)]">
              {t("transactionHub.loanSim.repaymentTerm")}
            </span>
            <div className="flex gap-2">
              {TERM_OPTIONS.map((yr) => (
                <button
                  key={yr}
                  type="button"
                  onClick={() => setTermYears(yr)}
                  className={`flex-1 rounded-lg border px-2 py-2 text-sm font-medium transition-colors duration-150 ${
                    termYears === yr
                      ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                      : "border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)]"
                  }`}
                >
                  {yr}y
                </button>
              ))}
            </div>
          </div>

          {/* Repayment type */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-[var(--color-text-secondary)]">
              {t("transactionHub.loanSim.repaymentType")}
            </span>
            <div className="flex gap-2">
              {(["standard", "accelerated"] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setRepaymentType(type)}
                  className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors duration-150 ${
                    repaymentType === type
                      ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                      : "border-[var(--color-border)] text-[var(--color-text-secondary)]"
                  }`}
                >
                  {t(`transactionHub.loanSim.${type}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Purpose */}
          <div className="flex flex-col gap-2">
            <label htmlFor="gf-loan-purpose" className="text-sm font-medium text-[var(--color-text-secondary)]">
              {t("transactionHub.loanSim.loanPurpose")}
            </label>
            <select
              id="gf-loan-purpose"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value as typeof purpose)}
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-sm text-[var(--color-text)]"
            >
              {PURPOSE_KEYS.map((k) => (
                <option key={k} value={k}>{t(`transactionHub.loanSim.${k}`)}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-3">
            <MetricTile label={t("transactionHub.loanSim.monthlyRepayment")} value={fmt.currency(animEmi)} color="var(--color-text)" />
            <MetricTile label={t("transactionHub.loanSim.payrollDeduction")} value={fmt.percent(animPayroll)} color="var(--color-warning, #ca8a04)" />
            <MetricTile label={t("transactionHub.loanSim.opportunityCost")} value={`-${fmt.currency(animCost, true)}`} color="var(--color-danger)" />
            <MetricTile label={t("transactionHub.loanSim.retirementDelay")} value={`${fmt.number(animDelay, 1)} ${t("transactionHub.loanSim.months")}`} color="var(--color-danger)" />
          </div>

          <MetricTile label={t("transactionHub.loanSim.projectedBalance")} value={fmt.currency(animProjected, true)} color="var(--color-primary)" large />

          {/* Chart */}
          <div className="h-44 w-full rounded-lg border border-[var(--color-border)] p-3" style={{ backgroundColor: "var(--color-surface)" }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={calc.chartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="gfGradBase" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-success)" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="var(--color-success)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gfGradLoan" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-warning, #ca8a04)" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="var(--color-warning, #ca8a04)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" strokeOpacity={0.5} />
                <XAxis dataKey="month" tick={{ fill: "var(--color-text-tertiary)", fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: "var(--color-text-tertiary)", fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} width={42} />
                <Tooltip contentStyle={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="without" stroke="var(--color-success)" fill="url(#gfGradBase)" strokeWidth={2} />
                <Area type="monotone" dataKey="with" stroke="var(--color-warning, #ca8a04)" fill="url(#gfGradLoan)" strokeWidth={2} strokeDasharray="4 4" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="flex flex-col gap-5">
          <h3 className="text-base font-semibold text-[var(--color-text)]">
            {t("transactionHub.loanFlow.summaryTitle")}
          </h3>

          <div className="flex flex-col gap-3 rounded-xl border border-[var(--color-border)] p-4" style={{ backgroundColor: "var(--color-surface)" }}>
            <SummaryRow label={t("transactionHub.loanSim.loanAmount")} value={fmt.currency(amount)} />
            <SummaryRow label={t("transactionHub.loanSim.repaymentTerm")} value={`${termYears} ${t("transactionHub.loanSim.years")}`} />
            <SummaryRow label={t("transactionHub.loanSim.repaymentType")} value={t(`transactionHub.loanSim.${repaymentType}`)} />
            <SummaryRow label={t("transactionHub.loanSim.loanPurpose")} value={t(`transactionHub.loanSim.${purpose}`)} />
            <div className="my-1 h-px" style={{ backgroundColor: "var(--color-border)" }} />
            <SummaryRow label={t("transactionHub.loanSim.monthlyRepayment")} value={fmt.currency(calc.emi)} bold />
            <SummaryRow label={t("transactionHub.loanSim.opportunityCost")} value={`-${fmt.currency(calc.lostGrowth, true)}`} bold danger />
          </div>

          <label className="flex items-start gap-3 rounded-lg border border-[var(--color-border)] p-4 transition-colors duration-150 hover:bg-[var(--color-background-secondary)]">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 rounded accent-[var(--color-primary)]"
            />
            <span className="text-sm text-[var(--color-text-secondary)]">
              {t("transactionHub.loanFlow.termsAgreement")}
            </span>
          </label>
        </div>
      )}
    </GuidedFlowDrawer>
  );
}

function MetricTile({ label, value, color, large }: { label: string; value: string; color: string; large?: boolean }) {
  return (
    <div className={`flex flex-col gap-1 rounded-lg border border-[var(--color-border)] p-3 ${large ? "col-span-2" : ""}`} style={{ backgroundColor: "var(--color-surface)" }}>
      <span className="text-xs text-[var(--color-text-secondary)]">{label}</span>
      <span className={`font-bold tabular-nums ${large ? "text-2xl" : "text-lg"}`} style={{ color }}>{value}</span>
    </div>
  );
}

function SummaryRow({ label, value, bold, danger }: { label: string; value: string; bold?: boolean; danger?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-[var(--color-text-secondary)]">{label}</span>
      <span className={`text-sm tabular-nums ${bold ? "font-bold" : "font-medium"}`} style={{ color: danger ? "var(--color-danger)" : "var(--color-text)" }}>{value}</span>
    </div>
  );
}
