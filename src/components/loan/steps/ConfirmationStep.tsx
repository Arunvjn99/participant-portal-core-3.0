import { motion } from "framer-motion";
import { useReducedMotion } from "framer-motion";
import type { LoanFlowData, LoanPlanConfig } from "../../../types/loan";
import { calculateLoan } from "../../../utils/loanCalculator";
import { DEFAULT_LOAN_PLAN_CONFIG } from "../../../config/loanPlanConfig";

interface ConfirmationStepProps {
  data: LoanFlowData;
  planConfig: LoanPlanConfig;
  onDownloadPDF?: () => void;
}

function formatCurrency(n: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(n);
}

export function ConfirmationStep({ data, planConfig, onDownloadPDF }: ConfirmationStepProps) {
  const reduced = useReducedMotion();
  const config = planConfig ?? DEFAULT_LOAN_PLAN_CONFIG;
  const basics = data.basics!;
  const calc = calculateLoan({
    loanAmount: basics.loanAmount,
    annualInterestRate: config.defaultAnnualRate,
    tenureYears: basics.tenureYears,
    payrollFrequency: basics.payrollFrequency,
    originationFee: config.originationFeePct,
  });

  return (
    <motion.div
      className="mx-auto max-w-lg rounded-2xl border p-8"
      style={{
        borderColor: "var(--enroll-card-border)",
        background: "var(--enroll-card-bg)",
        boxShadow: "var(--enroll-elevation-1)",
      }}
      initial={reduced ? false : { opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <motion.div
        className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full"
        style={{ background: "rgb(var(--enroll-accent-rgb) / 0.15)" }}
        initial={reduced ? false : { scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
        aria-hidden
      >
        <motion.svg
          className="h-8 w-8"
          style={{ color: "var(--enroll-accent)" }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          initial={reduced ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.3, duration: 0.3 }}
        >
          <motion.path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </motion.svg>
      </motion.div>

      <h2 className="mb-2 text-center text-xl font-semibold" style={{ color: "var(--enroll-text-primary)" }}>
        Loan request submitted
      </h2>
      <p className="mb-6 text-center text-sm" style={{ color: "var(--enroll-text-secondary)" }}>
        You will receive a confirmation email with next steps.
      </p>

      <dl className="space-y-3 text-sm" style={{ gap: "var(--spacing-3)" }}>
        {[
          { label: "Loan amount", value: formatCurrency(basics.loanAmount) },
          { label: "Net disbursement", value: formatCurrency(calc.netDisbursement) },
          { label: "First payment date", value: basics.firstPaymentDate },
          { label: "Payment frequency", value: basics.payrollFrequency },
          { label: "Term", value: `${basics.tenureYears} years` },
          { label: "Payoff date", value: calc.payoffDate },
        ].map(({ label, value }) => (
          <div key={label} className="flex justify-between">
            <dt style={{ color: "var(--enroll-text-secondary)" }}>{label}</dt>
            <dd className="font-medium" style={{ color: "var(--enroll-text-primary)" }}>{value}</dd>
          </div>
        ))}
      </dl>

      {onDownloadPDF && (
        <div className="mt-6 flex justify-center" style={{ marginTop: "var(--spacing-6)" }}>
          <button
            type="button"
            onClick={onDownloadPDF}
            className="rounded-xl border px-6 py-3 text-sm font-medium transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{
              borderColor: "var(--enroll-card-border)",
              background: "var(--enroll-card-bg)",
              color: "var(--enroll-text-primary)",
            }}
            aria-label="Download PDF confirmation"
          >
            Download PDF
          </button>
        </div>
      )}
    </motion.div>
  );
}
