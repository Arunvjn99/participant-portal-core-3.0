import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { CheckCircle2, AlertCircle, Info, ChevronDown, ChevronUp, Calendar } from "lucide-react";
import { TransactionStepCard } from "../../../../../components/transactions/TransactionStepCard";
import { AnimatedNumber } from "../../../../../components/dashboard/shared/AnimatedNumber";
import { ACCOUNT_OVERVIEW } from "../../../../../data/accountOverview";
import { DEFAULT_LOAN_PLAN_CONFIG } from "../../../../../config/loanPlanConfig";
import type { TransactionStepProps } from "../../../../../components/transactions/TransactionApplication";

const formatCurrency = (n: number, decimals = 0) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(n);

const calculatePMT = (rateAnnual: number, nperMonths: number, pv: number) => {
  const r = rateAnnual / 12;
  if (r <= 0 || nperMonths <= 0) return 0;
  return (pv * r * Math.pow(1 + r, nperMonths)) / (Math.pow(1 + r, nperMonths) - 1);
};

const generateAmortizationSchedule = (amount: number, rateAnnual: number, years: number, maxRows = 12) => {
  const r = rateAnnual / 12;
  const n = years * 12;
  const pmt = calculatePMT(rateAnnual, n, amount);
  let balance = amount;
  const schedule: { no: number; date: string; payment: number; principal: number; interest: number; balance: number }[] = [];
  const today = new Date();
  for (let i = 1; i <= n && schedule.length < maxRows; i++) {
    const interest = balance * r;
    const principal = pmt - interest;
    balance = Math.max(0, balance - principal);
    const date = new Date(today.getFullYear(), today.getMonth() + i, 1);
    schedule.push({
      no: i,
      date: date.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      payment: pmt,
      principal,
      interest,
      balance,
    });
  }
  return schedule;
};

const PURPOSE_OPTIONS = ["General", "Residential", "Hardship", "Education"] as const;
const PURPOSE_KEYS = ["transactions.loan.purposeGeneral", "transactions.loan.purposeResidential", "transactions.loan.purposeHardship", "transactions.loan.purposeEducation"] as const;
const TERM_YEARS = [1, 2, 3, 4, 5] as const;
const CUSTOM_TERM_MAX = DEFAULT_LOAN_PLAN_CONFIG.termYearsMaxCustom ?? 15;

export const EligibilityStep = ({ transaction, initialData, onDataChange, readOnly }: TransactionStepProps) => {
  const { t } = useTranslation();
  const vestedBalance = ACCOUNT_OVERVIEW.vestedBalance;
  const outstandingLoan = ACCOUNT_OVERVIEW.outstandingLoan;
  const maxLoan = Math.min(
    DEFAULT_LOAN_PLAN_CONFIG.maxLoanAbsolute,
    vestedBalance * DEFAULT_LOAN_PLAN_CONFIG.maxLoanPctOfVested
  );
  const isEligible = vestedBalance >= DEFAULT_LOAN_PLAN_CONFIG.minLoanAmount && outstandingLoan === 0;

  const amount = initialData?.amount ?? Math.min(5000, maxLoan);
  const tenureYears = initialData?.tenureYears ?? DEFAULT_LOAN_PLAN_CONFIG.termYearsMax;
  const purpose = initialData?.purpose ?? "General";
  const frequency = initialData?.frequency ?? "monthly";
  const isCustomTerm = tenureYears > DEFAULT_LOAN_PLAN_CONFIG.termYearsMax;

  const clampedAmount = Math.min(maxLoan, Math.max(DEFAULT_LOAN_PLAN_CONFIG.minLoanAmount, amount));
  const [amortOpen, setAmortOpen] = useState(false);

  const percentUtilized = vestedBalance > 0 ? clampedAmount / vestedBalance : 0;
  const advisorNote =
    percentUtilized < 0.2
      ? t("transactions.loan.advisorNoteConservative")
      : percentUtilized < 0.4
        ? t("transactions.loan.advisorNoteBalanced")
        : t("transactions.loan.advisorNoteSignificant");

  const monthlyPayment = useMemo(
    () => calculatePMT(DEFAULT_LOAN_PLAN_CONFIG.defaultAnnualRate, tenureYears * 12, clampedAmount),
    [clampedAmount, tenureYears]
  );
  const amortSchedule = useMemo(
    () => generateAmortizationSchedule(clampedAmount, DEFAULT_LOAN_PLAN_CONFIG.defaultAnnualRate, tenureYears, 6),
    [clampedAmount, tenureYears]
  );

  const comparisonYears = tenureYears === 5 ? 3 : 5;
  const comparisonMonthly = useMemo(
    () => calculatePMT(DEFAULT_LOAN_PLAN_CONFIG.defaultAnnualRate, comparisonYears * 12, clampedAmount),
    [clampedAmount, comparisonYears]
  );
  const diffMonthly = monthlyPayment - comparisonMonthly;
  const totalInterestCurrent = monthlyPayment * tenureYears * 12 - clampedAmount;
  const totalInterestComparison = comparisonMonthly * comparisonYears * 12 - clampedAmount;
  const diffInterest = totalInterestCurrent - totalInterestComparison;
  const isLongTerm = tenureYears >= 4;

  const handleAmountChange = useCallback(
    (value: number) => {
      const v = Math.min(maxLoan, Math.max(DEFAULT_LOAN_PLAN_CONFIG.minLoanAmount, value));
      onDataChange?.({ amount: v });
    },
    [maxLoan, onDataChange]
  );
  const handleTenureChange = useCallback((years: number) => onDataChange?.({ tenureYears: years }), [onDataChange]);
  const handleCustomTermChange = useCallback(
    (value: number) => {
      const years = Math.round(Math.max(DEFAULT_LOAN_PLAN_CONFIG.termYearsMin, Math.min(CUSTOM_TERM_MAX, value)));
      onDataChange?.({ tenureYears: years });
    },
    [onDataChange]
  );
  const handlePurposeChange = useCallback((p: string) => onDataChange?.({ purpose: p }), [onDataChange]);

  if (readOnly) {
    return (
      <TransactionStepCard title={t("transactions.loan.strategy")}>
        <div className="space-y-4">
          <p className="text-sm" style={{ color: "var(--enroll-text-secondary)" }}>
            {t("transactions.loan.loanAmountSummary", { amount: formatCurrency(clampedAmount), years: tenureYears, purpose })}
          </p>
        </div>
      </TransactionStepCard>
    );
  }

  return (
    <div className="space-y-6">
      {/* Eligibility blurb */}
      <TransactionStepCard title={t("transactions.loan.eligibility")}>
        <div
          className="flex items-start gap-4 p-4 rounded-[var(--radius-lg)] border"
          style={{
            background: isEligible ? "var(--color-success-light)" : "var(--color-warning-light)",
            borderColor: isEligible ? "var(--color-success)" : "var(--color-warning)",
          }}
        >
          {isEligible ? (
            <CheckCircle2 className="h-6 w-6 shrink-0" style={{ color: "var(--color-success)" }} />
          ) : (
            <AlertCircle className="h-6 w-6 shrink-0" style={{ color: "var(--color-warning)" }} />
          )}
          <div>
            <p className="font-semibold" style={{ color: "var(--enroll-text-primary)" }}>
              {isEligible ? t("transactions.loan.eligibleTitle") : t("transactions.loan.notEligibleTitle")}
            </p>
            <p className="mt-1 text-sm" style={{ color: "var(--enroll-text-secondary)" }}>
              {isEligible
                ? t("transactions.loan.eligibleDesc", { max: formatCurrency(maxLoan) })
                : outstandingLoan > 0
                  ? t("transactions.loan.outstandingLoanDesc")
                  : t("transactions.loan.lowBalanceDesc")}
            </p>
          </div>
        </div>
        <dl className="grid gap-3 sm:grid-cols-2 mt-4">
          <div className="p-3 rounded-[var(--radius-md)]" style={{ background: "var(--enroll-soft-bg)" }}>
            <dt className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--enroll-text-muted)" }}>{t("transactions.loan.vestedBalance")}</dt>
            <dd className="mt-1 font-semibold" style={{ color: "var(--enroll-text-primary)" }}>{formatCurrency(vestedBalance)}</dd>
          </div>
          <div className="p-3 rounded-[var(--radius-md)]" style={{ background: "var(--enroll-soft-bg)" }}>
            <dt className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--enroll-text-muted)" }}>{t("transactions.loan.maxLoan")}</dt>
            <dd className="mt-1 font-semibold" style={{ color: "var(--enroll-text-primary)" }}>{formatCurrency(maxLoan)}</dd>
          </div>
        </dl>
      </TransactionStepCard>

      {/* Amount + tenure + purpose */}
      <TransactionStepCard title={t("transactions.loan.loanStrategy")}>
        <div className="space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <label className="block text-sm font-bold mb-1" style={{ color: "var(--enroll-text-primary)" }}>{t("transactions.loan.iWantToBorrow")}</label>
              <p className="text-xs" style={{ color: "var(--enroll-text-muted)" }}>
                {t("transactions.loan.maxOfVested", { max: formatCurrency(maxLoan), percent: (percentUtilized * 100).toFixed(0) })}
              </p>
            </div>
            <div className="inline-flex items-baseline rounded-[var(--radius-lg)] border px-4 py-2" style={{ borderColor: "var(--enroll-card-border)", background: "var(--enroll-soft-bg)" }}>
              <span className="text-lg mr-1" style={{ color: "var(--enroll-text-muted)" }}>$</span>
              <input
                type="number"
                min={DEFAULT_LOAN_PLAN_CONFIG.minLoanAmount}
                max={maxLoan}
                step={100}
                value={clampedAmount}
                onChange={(e) => handleAmountChange(parseFloat(e.target.value) || 0)}
                className="w-28 bg-transparent text-2xl font-bold outline-none text-right"
                style={{ color: "var(--enroll-text-primary)" }}
              />
            </div>
          </div>
          <input
            type="range"
            min={DEFAULT_LOAN_PLAN_CONFIG.minLoanAmount}
            max={maxLoan}
            step={100}
            value={clampedAmount}
            onChange={(e) => handleAmountChange(parseFloat(e.target.value))}
            className="w-full h-2 rounded-[var(--radius-full)]"
            style={{ accentColor: "var(--enroll-brand)" }}
          />
          <div className="flex gap-3 p-3 rounded-[var(--radius-lg)] border" style={{ background: "var(--txn-brand-soft)", borderColor: "var(--enroll-card-border)" }}>
            <Info className="h-4 w-4 shrink-0 mt-0.5" style={{ color: "var(--enroll-brand)" }} />
            <p className="text-xs font-medium" style={{ color: "var(--enroll-text-secondary)" }}>{advisorNote}</p>
          </div>

          <div>
            <p className="text-sm font-bold mb-3" style={{ color: "var(--enroll-text-primary)" }}>{t("transactions.loan.repaymentTerm")}</p>
            <div className="flex flex-wrap gap-2">
              {TERM_YEARS.map((y) => (
                <button
                  key={y}
                  type="button"
                  onClick={() => handleTenureChange(y)}
                  className="px-4 py-2.5 rounded-[var(--radius-lg)] border text-sm font-bold transition-colors"
                  style={{
                    background: !isCustomTerm && tenureYears === y ? "var(--enroll-brand)" : "var(--enroll-soft-bg)",
                    borderColor: !isCustomTerm && tenureYears === y ? "var(--enroll-brand)" : "var(--enroll-card-border)",
                    color: !isCustomTerm && tenureYears === y ? "var(--color-text-inverse)" : "var(--enroll-text-secondary)",
                  }}
                >
                  {y}Y
                </button>
              ))}
              <button
                type="button"
                onClick={() => handleTenureChange(isCustomTerm ? tenureYears : 6)}
                className="px-4 py-2.5 rounded-[var(--radius-lg)] border text-sm font-bold transition-colors"
                style={{
                  background: isCustomTerm ? "var(--enroll-brand)" : "var(--enroll-soft-bg)",
                  borderColor: isCustomTerm ? "var(--enroll-brand)" : "var(--enroll-card-border)",
                  color: isCustomTerm ? "var(--color-text-inverse)" : "var(--enroll-text-secondary)",
                }}
              >
                {t("transactions.loan.custom")}
              </button>
            </div>
            {isCustomTerm && (
              <div className="mt-3 flex items-center gap-3">
                <label htmlFor="custom-term-years" className="text-sm font-medium" style={{ color: "var(--enroll-text-secondary)" }}>
                  {t("transactions.loan.custom")} ({t("transactions.loan.yearsLabel")})
                </label>
                <input
                  id="custom-term-years"
                  type="number"
                  min={DEFAULT_LOAN_PLAN_CONFIG.termYearsMin}
                  max={CUSTOM_TERM_MAX}
                  value={tenureYears}
                  onChange={(e) => handleCustomTermChange(parseFloat(e.target.value) || DEFAULT_LOAN_PLAN_CONFIG.termYearsMin)}
                  className="w-20 px-3 py-2 rounded-[var(--radius-lg)] border text-sm font-bold text-right"
                  style={{
                    background: "var(--enroll-card-bg)",
                    borderColor: "var(--enroll-card-border)",
                    color: "var(--enroll-text-primary)",
                  }}
                />
                <span className="text-sm" style={{ color: "var(--enroll-text-muted)" }}>{t("transactions.loan.yearsLabel")}</span>
              </div>
            )}
          </div>

          {/* TenureInsights */}
          <div
            className="p-4 rounded-[var(--radius-lg)] border flex gap-3"
            style={{
              background: isLongTerm ? "var(--txn-brand-soft)" : "var(--color-success-light)",
              borderColor: isLongTerm ? "var(--enroll-brand)" : "var(--color-success)",
            }}
          >
            <div className="mt-0.5" style={{ color: isLongTerm ? "var(--enroll-brand)" : "var(--color-success)" }}>
              {isLongTerm ? <Info className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: "var(--enroll-text-primary)" }}>
                {isLongTerm ? t("transactions.loan.cashFlowOptimized") : t("transactions.loan.interestSaver")}
              </p>
              <p className="text-sm font-medium mb-2" style={{ color: "var(--enroll-text-secondary)" }}>
                {isLongTerm
                  ? t("transactions.loan.tenureLongDesc", { years: tenureYears })
                  : t("transactions.loan.tenureShortDesc", { years: tenureYears })}
              </p>
              <div className="flex gap-4 text-xs">
                <div>
                  <span className="block" style={{ color: "var(--enroll-text-muted)" }}>{t("transactions.loan.vsTerm", { years: comparisonYears })}</span>
                  <span className="font-bold" style={{ color: diffMonthly < 0 ? "var(--color-success)" : "var(--enroll-text-primary)" }}>
                    {diffMonthly >= 0 ? "+" : ""}{formatCurrency(diffMonthly)}/mo
                  </span>
                </div>
                <div>
                  <span className="block" style={{ color: "var(--enroll-text-muted)" }}>{t("transactions.loan.totalInterestImpact")}</span>
                  <span className="font-bold" style={{ color: diffInterest < 0 ? "var(--color-success)" : "var(--color-warning)" }}>
                    {diffInterest >= 0 ? "+" : ""}{formatCurrency(diffInterest)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm font-bold mb-3" style={{ color: "var(--enroll-text-primary)" }}>{t("transactions.loan.loanPurpose")}</p>
            <select
              value={purpose}
              onChange={(e) => handlePurposeChange(e.target.value)}
              className="w-full px-4 py-3 pl-10 rounded-[var(--radius-lg)] border text-sm font-medium"
              style={{
                background: "var(--enroll-card-bg)",
                borderColor: "var(--enroll-card-border)",
                color: "var(--enroll-text-primary)",
              }}
            >
              {PURPOSE_OPTIONS.map((p, i) => (
                <option key={p} value={p}>{t(PURPOSE_KEYS[i])}</option>
              ))}
            </select>
            <p className="mt-2 text-xs" style={{ color: "var(--enroll-text-muted)" }}>
              {t("transactions.loan.residentialNote")}
            </p>
          </div>

          {/* AmortizationPreview */}
          <div className="border-t pt-4" style={{ borderColor: "var(--enroll-card-border)" }}>
            <button
              type="button"
              onClick={() => setAmortOpen(!amortOpen)}
              className="w-full flex items-center justify-between py-2 text-xs font-semibold"
              style={{ color: "var(--enroll-brand)" }}
            >
              <span className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5" /> {t("transactions.loan.viewRepaymentBreakdown")}
              </span>
              {amortOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </button>
            {amortOpen && (
              <div className="mt-2 overflow-hidden rounded-[var(--radius-lg)] border" style={{ borderColor: "var(--enroll-card-border)", background: "var(--enroll-soft-bg)" }}>
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr style={{ background: "var(--enroll-soft-bg)", color: "var(--enroll-text-muted)" }}>
                      <th className="p-2.5 font-semibold">#</th>
                      <th className="p-2.5">{t("transactions.loan.date")}</th>
                      <th className="p-2.5 text-right">{t("transactions.loan.payment")}</th>
                      <th className="p-2.5 text-right">{t("transactions.loan.principal")}</th>
                      <th className="p-2.5 text-right">{t("transactions.loan.interest")}</th>
                      <th className="p-2.5 text-right">{t("transactions.loan.balance")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {amortSchedule.map((row) => (
                      <tr key={row.no} className="border-t" style={{ borderColor: "var(--enroll-card-border)" }}>
                        <td className="p-2.5" style={{ color: "var(--enroll-text-muted)" }}>{row.no}</td>
                        <td className="p-2.5" style={{ color: "var(--enroll-text-primary)" }}>{row.date}</td>
                        <td className="p-2.5 text-right font-medium" style={{ color: "var(--enroll-text-primary)" }}>{formatCurrency(row.payment, 2)}</td>
                        <td className="p-2.5 text-right" style={{ color: "var(--enroll-text-secondary)" }}>{formatCurrency(row.principal, 2)}</td>
                        <td className="p-2.5 text-right" style={{ color: "var(--color-success)" }}>+{formatCurrency(row.interest, 2)}</td>
                        <td className="p-2.5 text-right" style={{ color: "var(--enroll-text-muted)" }}>{formatCurrency(row.balance, 0)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </TransactionStepCard>

      {/* Summary panel (inline, no second column) */}
      <TransactionStepCard title={t("transactions.loan.estimatedImpact")}>
        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--enroll-text-muted)" }}>{t("transactions.loan.estimatedMonthlyPayment")}</p>
            <p className="text-2xl font-bold" style={{ color: "var(--enroll-text-primary)" }}>
              <AnimatedNumber value={monthlyPayment} format="currency" decimals={2} />
              <span className="text-sm font-normal ml-1" style={{ color: "var(--enroll-text-muted)" }}>{t("transactions.loan.perMonth")}</span>
            </p>
          </div>
          <div className="flex justify-between text-sm py-2 border-t border-b" style={{ borderColor: "var(--enroll-card-border)" }}>
            <span style={{ color: "var(--enroll-text-secondary)" }}>{t("transactions.loan.principal")}</span>
            <span className="font-medium" style={{ color: "var(--enroll-text-primary)" }}>{formatCurrency(clampedAmount)}</span>
          </div>
          <div className="flex justify-between text-sm py-2 border-b" style={{ borderColor: "var(--enroll-card-border)" }}>
            <span style={{ color: "var(--enroll-text-secondary)" }}>{t("transactions.loan.originationFee")}</span>
            <span className="font-medium" style={{ color: "var(--enroll-text-primary)" }}>{formatCurrency(clampedAmount * DEFAULT_LOAN_PLAN_CONFIG.originationFeePct)}</span>
          </div>
          <div className="flex justify-between text-sm py-2" style={{ color: "var(--enroll-text-primary)" }}>
            <span className="font-semibold">{t("transactions.loan.netDisbursement")}</span>
            <span className="font-bold" style={{ color: "var(--color-success)" }}>{formatCurrency(clampedAmount - clampedAmount * DEFAULT_LOAN_PLAN_CONFIG.originationFeePct)}</span>
          </div>
        </div>
      </TransactionStepCard>
    </div>
  );
};
