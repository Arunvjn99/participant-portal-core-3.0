import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown, ChevronUp, CheckCircle2 } from "lucide-react";
import { TransactionStepCard } from "../../../../../components/transactions/TransactionStepCard";
import { RetirementImpact } from "../../../../../components/transactions/RetirementImpact";
import { DEFAULT_LOAN_PLAN_CONFIG } from "../../../../../config/loanPlanConfig";
import { calculateLoan } from "../../../../../utils/loanCalculator";
import type { TransactionStepProps } from "../../../../../components/transactions/TransactionApplication";
import type { PayrollFrequency } from "../../../../../types/loan";

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

const INITIAL_AMORT_ROWS = 12;

export const ReviewStep = ({ transaction, initialData, onDataChange, readOnly }: TransactionStepProps) => {
  const { t } = useTranslation();
  const isReadOnly = readOnly || transaction.status !== "draft";
  const amount = initialData?.amount ?? DEFAULT_LOAN_PLAN_CONFIG.minLoanAmount;
  const tenureYears = initialData?.tenureYears ?? DEFAULT_LOAN_PLAN_CONFIG.termYearsMax;
  const frequency = (initialData?.frequency ?? "monthly") as PayrollFrequency;
  const confirmationAccepted = initialData?.confirmationAccepted ?? false;
  const paymentMethod = initialData?.paymentMethod ?? "EFT";

  const calc = useMemo(
    () =>
      calculateLoan({
        loanAmount: amount,
        annualInterestRate: DEFAULT_LOAN_PLAN_CONFIG.defaultAnnualRate,
        tenureYears,
        payrollFrequency: frequency,
        originationFee: DEFAULT_LOAN_PLAN_CONFIG.originationFeePct,
      }),
    [amount, tenureYears, frequency]
  );

  const [amortExpanded, setAmortExpanded] = useState(false);
  const visibleAmortRows = amortExpanded ? calc.amortizationSchedule : calc.amortizationSchedule.slice(0, INITIAL_AMORT_ROWS);
  const hasMoreAmort = calc.amortizationSchedule.length > INITIAL_AMORT_ROWS;

  const handleConfirmationChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onDataChange?.({ confirmationAccepted: e.target.checked });
    },
    [onDataChange]
  );

  const impactLevel = amount <= 10000 ? "low" : amount <= 25000 ? "medium" : "high";
  const impactRationale =
    impactLevel === "low"
      ? t("transactions.loan.impactLow")
      : impactLevel === "medium"
        ? t("transactions.loan.impactMedium")
        : t("transactions.loan.impactHigh");

  const timelineSteps = [
    { label: t("transactions.loan.timelineReceived"), detail: t("transactions.loan.timelineReceivedDetail") },
    { label: t("transactions.loan.timelineDisbursement"), detail: paymentMethod === "EFT" ? t("transactions.loan.timelineDisbursementEft") : t("transactions.loan.timelineDisbursementCheck") },
    { label: t("transactions.loan.timelineRepayment"), detail: t("transactions.loan.timelineRepaymentDetail") },
  ];

  return (
    <div className="space-y-6">
      <TransactionStepCard title={isReadOnly ? t("transactions.loan.reviewConfirm") : t("transactions.loan.reviewSubmit")}>
        <div className="space-y-6">
          {/* Loan summary */}
          <dl className="space-y-0">
            <div className="flex justify-between py-2 border-b" style={{ borderColor: "var(--enroll-card-border)" }}>
              <dt style={{ color: "var(--enroll-text-secondary)" }}>{t("transactions.loan.principal")}</dt>
              <dd className="font-semibold" style={{ color: "var(--enroll-text-primary)" }}>{formatCurrency(amount)}</dd>
            </div>
            <div className="flex justify-between py-2 border-b" style={{ borderColor: "var(--enroll-card-border)" }}>
              <dt style={{ color: "var(--enroll-text-secondary)" }}>{t("transactions.loan.originationFee")}</dt>
              <dd className="font-semibold" style={{ color: "var(--enroll-text-primary)" }}>{formatCurrency(amount * DEFAULT_LOAN_PLAN_CONFIG.originationFeePct)}</dd>
            </div>
            <div className="flex justify-between py-2 border-b" style={{ borderColor: "var(--enroll-card-border)" }}>
              <dt style={{ color: "var(--enroll-text-secondary)" }}>{t("transactions.loan.netDisbursement")}</dt>
              <dd className="font-semibold" style={{ color: "var(--enroll-text-primary)" }}>{formatCurrency(calc.netDisbursement)}</dd>
            </div>
            <div className="flex justify-between py-2 border-b" style={{ borderColor: "var(--enroll-card-border)" }}>
              <dt style={{ color: "var(--enroll-text-secondary)" }}>{t("transactions.loan.payment")} ({frequency})</dt>
              <dd className="font-semibold" style={{ color: "var(--enroll-text-primary)" }}>{formatCurrency(calc.paymentPerPeriod)}</dd>
            </div>
            <div className="flex justify-between py-2">
              <dt style={{ color: "var(--enroll-text-secondary)" }}>Term</dt>
              <dd className="font-semibold" style={{ color: "var(--enroll-text-primary)" }}>{tenureYears} years</dd>
            </div>
          </dl>

          {/* Full amortization table */}
          <div>
            <p className="text-sm font-semibold mb-2" style={{ color: "var(--enroll-text-primary)" }}>{t("transactions.loan.amortizationSchedule")}</p>
            <div
              className="overflow-hidden rounded-[var(--radius-lg)] border"
              style={{
                background: "var(--enroll-card-bg)",
                borderColor: "var(--enroll-card-border)",
              }}
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm" role="table" aria-label="Amortization schedule">
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--enroll-card-border)", background: "var(--enroll-soft-bg)" }}>
                      <th className="px-4 py-3 font-medium" style={{ color: "var(--enroll-text-primary)" }}>#</th>
                      <th className="px-4 py-3 font-medium" style={{ color: "var(--enroll-text-primary)" }}>Payment</th>
                      <th className="px-4 py-3 font-medium" style={{ color: "var(--enroll-text-primary)" }}>Principal</th>
                      <th className="px-4 py-3 font-medium" style={{ color: "var(--enroll-text-primary)" }}>Interest</th>
                      <th className="px-4 py-3 font-medium" style={{ color: "var(--enroll-text-primary)" }}>Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleAmortRows.map((row) => (
                      <tr key={row.paymentNumber} style={{ borderBottom: "1px solid var(--enroll-card-border)" }}>
                        <td className="px-4 py-2 tabular-nums" style={{ color: "var(--enroll-text-secondary)" }}>{row.paymentNumber}</td>
                        <td className="px-4 py-2 tabular-nums" style={{ color: "var(--enroll-text-primary)" }}>{formatCurrency(row.payment)}</td>
                        <td className="px-4 py-2 tabular-nums" style={{ color: "var(--enroll-text-primary)" }}>{formatCurrency(row.principal)}</td>
                        <td className="px-4 py-2 tabular-nums" style={{ color: "var(--enroll-text-primary)" }}>{formatCurrency(row.interest)}</td>
                        <td className="px-4 py-2 tabular-nums font-medium" style={{ color: "var(--enroll-text-primary)" }}>{formatCurrency(row.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {hasMoreAmort && (
                <div className="border-t p-2" style={{ borderColor: "var(--enroll-card-border)" }}>
                  <button
                    type="button"
                    onClick={() => setAmortExpanded(!amortExpanded)}
                    className="text-sm font-medium flex items-center gap-1"
                    style={{ color: "var(--enroll-brand)" }}
                    aria-expanded={amortExpanded}
                  >
                    {amortExpanded ? (
                      <>{t("transactions.loan.showLess")} <ChevronUp className="h-4 w-4 inline" /></>
                    ) : (
                      <>{t("transactions.loan.showMoreRows", { count: calc.amortizationSchedule.length - INITIAL_AMORT_ROWS })} <ChevronDown className="h-4 w-4 inline" /></>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Estimated retirement impact */}
          <RetirementImpact level={impactLevel} rationale={impactRationale} />

          {/* What happens next */}
          <div>
            <p className="text-sm font-semibold mb-3" style={{ color: "var(--enroll-text-primary)" }}>{t("transactions.loan.whatHappensNext")}</p>
            <ul className="space-y-3">
              {timelineSteps.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold"
                    style={{ background: "var(--txn-brand-soft)", color: "var(--enroll-brand)" }}
                  >
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium" style={{ color: "var(--enroll-text-primary)" }}>{step.label}</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--enroll-text-muted)" }}>{step.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {!isReadOnly && (
            <div
              className="p-4 rounded-[var(--radius-lg)] border"
              style={{
                background: "var(--color-warning-light)",
                borderColor: "var(--color-warning)",
              }}
            >
              <p className="text-sm font-medium" style={{ color: "var(--enroll-text-primary)" }}>
                {t("transactions.loan.taxNote")}
              </p>
            </div>
          )}

          {!isReadOnly && (
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={confirmationAccepted}
                onChange={handleConfirmationChange}
                className="mt-1 rounded"
                style={{ accentColor: "var(--enroll-brand)" }}
              />
              <span className="text-sm flex items-center gap-2" style={{ color: "var(--enroll-text-secondary)" }}>
                <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: "var(--color-success)" }} />
                {t("transactions.loan.confirmReviewDetails")}
              </span>
            </label>
          )}

          {isReadOnly && (
            <p className="text-sm" style={{ color: "var(--enroll-text-secondary)" }}>
              {t("transactions.loan.submittedOrCompleted", { status: transaction.status === "completed" ? "completed" : "submitted for processing" })}
            </p>
          )}
        </div>
      </TransactionStepCard>
    </div>
  );
};
