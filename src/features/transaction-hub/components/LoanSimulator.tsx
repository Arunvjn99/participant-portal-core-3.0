import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import {
  calculateEMI,
  calculateOpportunityCost,
  calculateRetirementDelay,
  calculatePayrollDeduction,
  generateProjectionData,
} from "../utils/calculations";
import { useAnimatedNumber } from "../hooks/useAnimatedNumber";
import { useLocaleFormat } from "../hooks/useLocaleFormat";
import type { HubFinancialData } from "../data/mockHubData";

interface LoanSimulatorProps {
  data: HubFinancialData;
}

const TERM_OPTIONS = [1, 2, 3, 4, 5];
const PURPOSE_KEYS = ["general", "residential", "education", "hardship"] as const;
const LOAN_RATE = 0.045;

export function LoanSimulator({ data }: LoanSimulatorProps) {
  const { t } = useTranslation();
  const fmt = useLocaleFormat();

  const [amount, setAmount] = useState(Math.round(data.maxLoanEligible * 0.4));
  const [termYears, setTermYears] = useState(5);
  const [repaymentType, setRepaymentType] = useState<"standard" | "accelerated">("standard");
  const [purpose, setPurpose] = useState<(typeof PURPOSE_KEYS)[number]>("general");

  const termMonths = termYears * 12;
  const effectiveRate = repaymentType === "accelerated" ? LOAN_RATE * 0.85 : LOAN_RATE;

  const calc = useMemo(() => {
    const emi = calculateEMI(amount, effectiveRate, termMonths);
    const lostGrowth = calculateOpportunityCost(amount, data.avgReturnRate, data.yearsToRetirement);
    const opportunityCost = lostGrowth + amount;
    const retirementDelay = calculateRetirementDelay(lostGrowth, data.projectedBalance);
    const payrollPct = calculatePayrollDeduction(emi, data.annualSalary / 12);
    const newProjected = data.projectedBalance - lostGrowth;
    const riskDelta = (lostGrowth / data.projectedBalance) * 100;

    const monthlyContrib = (data.annualSalary * data.currentContributionRate) / 100 / 12;
    const projectionBase = generateProjectionData(data.projectedBalance, monthlyContrib, data.avgReturnRate, 24);
    const projectionLoan = generateProjectionData(data.projectedBalance - amount, monthlyContrib - emi * 0.3, data.avgReturnRate, 24);

    const chartData = projectionBase.map((p, i) => ({
      month: p.month,
      withoutLoan: p.balance,
      withLoan: projectionLoan[i]?.balance ?? p.balance,
    }));

    return { emi, opportunityCost, lostGrowth, retirementDelay, payrollPct, newProjected, riskDelta, chartData };
  }, [amount, effectiveRate, termMonths, data]);

  const animEmi = useAnimatedNumber(calc.emi);
  const animPayroll = useAnimatedNumber(calc.payrollPct);
  const animCost = useAnimatedNumber(calc.opportunityCost);
  const animDelay = useAnimatedNumber(calc.retirementDelay);
  const animProjected = useAnimatedNumber(calc.newProjected);
  const animRisk = useAnimatedNumber(calc.riskDelta);

  return (
    <div
      role="tabpanel"
      id="tabpanel-loan"
      aria-labelledby="tab-loan"
      className="grid gap-6 lg:grid-cols-2"
    >
      {/* Left: Controls */}
      <div className="flex flex-col gap-5 rounded-xl border border-[var(--color-border)] p-5" style={{ backgroundColor: "var(--color-surface)" }}>
        <h3 className="text-lg font-semibold text-[var(--color-text)]">
          {t("transactionHub.loanSim.title")}
        </h3>

        {/* Loan Amount */}
        <div className="flex flex-col gap-2">
          <label htmlFor="loan-amount" className="text-sm font-medium text-[var(--color-text-secondary)]">
            {t("transactionHub.loanSim.loanAmount")}
          </label>
          <div className="flex items-center gap-3">
            <input
              id="loan-amount"
              type="range"
              min={1000}
              max={data.maxLoanEligible}
              step={500}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="h-2 flex-1 cursor-pointer appearance-none rounded-full accent-[var(--color-primary)]"
              style={{ background: `linear-gradient(to right, var(--color-primary) ${(amount / data.maxLoanEligible) * 100}%, var(--color-border) ${(amount / data.maxLoanEligible) * 100}%)` }}
            />
            <input
              type="text"
              inputMode="numeric"
              value={fmt.currency(amount, true)}
              onChange={(e) => {
                const num = parseInt(e.target.value.replace(/[^0-9]/g, ""), 10);
                if (!isNaN(num)) setAmount(Math.min(num, data.maxLoanEligible));
              }}
              className="w-24 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-right text-sm font-semibold tabular-nums text-[var(--color-text)]"
              aria-label={t("transactionHub.loanSim.loanAmount")}
            />
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
                className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors duration-150 ${
                  termYears === yr
                    ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                    : "border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)]"
                }`}
              >
                {yr} {t("transactionHub.loanSim.years")}
              </button>
            ))}
          </div>
        </div>

        {/* Repayment Type */}
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
                    : "border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)]"
                }`}
              >
                {t(`transactionHub.loanSim.${type}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Purpose */}
        <div className="flex flex-col gap-2">
          <label htmlFor="loan-purpose" className="text-sm font-medium text-[var(--color-text-secondary)]">
            {t("transactionHub.loanSim.loanPurpose")}
          </label>
          <select
            id="loan-purpose"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value as typeof purpose)}
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)]"
          >
            {PURPOSE_KEYS.map((k) => (
              <option key={k} value={k}>
                {t(`transactionHub.loanSim.${k}`)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Right: Impact Card */}
      <div className="flex flex-col gap-5 rounded-xl border border-[var(--color-border)] p-5" style={{ backgroundColor: "var(--color-surface)" }}>
        <h3 className="text-lg font-semibold text-[var(--color-text)]">
          {t("transactionHub.loanSim.impactCard")}
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <ImpactMetric label={t("transactionHub.loanSim.monthlyRepayment")} value={fmt.currency(animEmi)} />
          <ImpactMetric label={t("transactionHub.loanSim.payrollDeduction")} value={fmt.percent(animPayroll)} />
          <ImpactMetric label={t("transactionHub.loanSim.opportunityCost")} value={fmt.currency(animCost, true)} negative />
          <ImpactMetric label={t("transactionHub.loanSim.retirementDelay")} value={`${fmt.number(animDelay, 1)} ${t("transactionHub.loanSim.months")}`} negative />
          <ImpactMetric label={t("transactionHub.loanSim.projectedBalance")} value={fmt.currency(animProjected, true)} />
          <ImpactMetric label={t("transactionHub.loanSim.riskDelta")} value={`+${fmt.number(animRisk, 1)}%`} negative />
        </div>

        {/* Projection Chart */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-secondary)]">
            {t("transactionHub.loanSim.projection")}
          </span>
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={calc.chartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="gradBase" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-success)" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="var(--color-success)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradLoan" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-warning, #ca8a04)" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="var(--color-warning, #ca8a04)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" strokeOpacity={0.5} />
                <XAxis dataKey="month" tick={{ fill: "var(--color-text-tertiary)", fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: "var(--color-text-tertiary)", fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} width={45} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  labelStyle={{ color: "var(--color-text-secondary)" }}
                />
                <Area type="monotone" dataKey="withoutLoan" stroke="var(--color-success)" fill="url(#gradBase)" strokeWidth={2} />
                <Area type="monotone" dataKey="withLoan" stroke="var(--color-warning, #ca8a04)" fill="url(#gradLoan)" strokeWidth={2} strokeDasharray="4 4" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function ImpactMetric({
  label,
  value,
  negative,
}: {
  label: string;
  value: string;
  negative?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-[var(--color-text-secondary)]">{label}</span>
      <span
        className="text-base font-bold tabular-nums"
        style={{ color: negative ? "var(--color-danger)" : "var(--color-text)" }}
      >
        {value}
      </span>
    </div>
  );
}
