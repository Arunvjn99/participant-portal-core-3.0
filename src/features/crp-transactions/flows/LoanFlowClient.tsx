
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Banknote,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  CreditCard,
  DollarSign,
  FileCheck,
  FileText,
  Home,
  Info,
  RefreshCw,
  Shield,
  TrendingDown,
  Upload,
  X,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState } from "react";

import { getRoutingVersion, withVersion } from "@/core/version";
import { cn } from "@/lib/utils";
import { TransactionFlowShell } from "../TransactionFlowShell";
import { useCrpTransactionStore } from "../crpTransactionStore";
import { LOAN_CONFIG, MOCK_PLAN } from "../types";

const ease = [0.4, 0, 0.2, 1] as const;

const fmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const fmtCents = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function calcMonthlyPayment(principal: number, annualRate: number, years: number) {
  const r = annualRate / 12;
  const n = years * 12;
  if (r === 0) return principal / n;
  return (principal * r) / (1 - Math.pow(1 + r, -n));
}

const LOAN_TYPES = [
  { value: "general" as const, label: "General", icon: Banknote, desc: "Any purpose" },
  { value: "residential" as const, label: "Residential", icon: Home, desc: "Primary residence" },
  { value: "refinance" as const, label: "Refinance", icon: RefreshCw, desc: "Existing loan" },
];

const REASONS = [
  "Home Purchase",
  "Home Repair",
  "Education",
  "Medical",
  "Debt Consolidation",
  "Other",
] as const;

const TOTAL_FEES =
  LOAN_CONFIG.originationFee +
  LOAN_CONFIG.processingFee +
  LOAN_CONFIG.recordkeepingFee +
  LOAN_CONFIG.checkFee;

const REQUIRED_DOCS = [
  { id: "check-leaf", label: "Check Leaf", required: true },
  { id: "promissory-note", label: "Promissory Note", required: true },
  { id: "spousal-consent", label: "Spousal Consent", required: true },
  { id: "purchase-agreement", label: "Purchase Agreement", required: false },
  { id: "employment-verification", label: "Employment Verification", required: false },
];

export function LoanFlowClient() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const version = getRoutingVersion(pathname);
  const { activeStep, activeType, flowData, updateFlowData, startFlow, resetFlow } =
    useCrpTransactionStore();

  useEffect(() => {
    if (activeType !== "loan") startFlow("loan");
  }, [activeType, startFlow]);

  const loanData = flowData.loan;
  const amount = loanData.amount ?? 5_000;
  const term = loanData.term ?? 3;
  const loanType = loanData.loanType ?? "general";
  const reason = loanData.reason ?? "";
  const disbursementMethod = loanData.disbursementMethod ?? "eft";
  const repaymentFrequency = loanData.repaymentFrequency ?? "monthly";
  const repaymentMethod = loanData.repaymentMethod ?? "payroll";

  const monthlyPayment = useMemo(
    () => calcMonthlyPayment(amount, LOAN_CONFIG.interestRate, term),
    [amount, term],
  );
  const totalPayback = monthlyPayment * term * 12;
  const totalInterest = totalPayback - amount;
  const netAmount = amount - TOTAL_FEES;

  const updateLoan = useCallback(
    (patch: Partial<typeof loanData>) => {
      const next = { amount, term, loanType, ...patch };
      const mp = calcMonthlyPayment(
        next.amount ?? amount,
        LOAN_CONFIG.interestRate,
        next.term ?? term,
      );
      updateFlowData("loan", {
        ...next,
        monthlyPayment: mp,
        totalInterest: mp * (next.term ?? term) * 12 - (next.amount ?? amount),
        totalPayback: mp * (next.term ?? term) * 12,
        interestRate: LOAN_CONFIG.interestRate,
      });
    },
    [amount, term, loanType, updateFlowData],
  );

  const [isDragging, setIsDragging] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, string>>({});
  const [docuSignComplete, setDocuSignComplete] = useState(false);
  const [showAmortization, setShowAmortization] = useState(false);

  const minPayment = calcMonthlyPayment(
    LOAN_CONFIG.minAmount,
    LOAN_CONFIG.interestRate,
    LOAN_CONFIG.maxTerm,
  );
  const maxPayment = calcMonthlyPayment(
    LOAN_CONFIG.maxAmount,
    LOAN_CONFIG.interestRate,
    LOAN_CONFIG.minTerm,
  );

  const sliderPct =
    ((amount - LOAN_CONFIG.minAmount) / (LOAN_CONFIG.maxAmount - LOAN_CONFIG.minAmount)) * 100;
  const termSliderPct =
    ((term - LOAN_CONFIG.minTerm) / (LOAN_CONFIG.maxTerm - LOAN_CONFIG.minTerm)) * 100;

  const allRequiredDocsUploaded = REQUIRED_DOCS.filter((d) => d.required).every(
    (d) => uploadedDocs[d.id],
  );
  const documentsReady = docuSignComplete || allRequiredDocsUploaded;

  useEffect(() => {
    if (documentsReady) {
      updateFlowData("loan", { documentsComplete: true });
    }
  }, [documentsReady, updateFlowData]);

  const canContinue = (() => {
    switch (activeStep) {
      case 4:
        return documentsReady;
      case 5:
        return termsAccepted;
      default:
        return true;
    }
  })();

  const stepContent = () => {
    switch (activeStep) {
      case 0:
        return <EligibilityStep minPayment={minPayment} maxPayment={maxPayment} />;
      case 1:
        return (
          <SimulatorStep
            amount={amount}
            term={term}
            monthlyPayment={monthlyPayment}
            totalInterest={totalInterest}
            totalPayback={totalPayback}
            sliderPct={sliderPct}
            termSliderPct={termSliderPct}
            isDragging={isDragging}
            setIsDragging={setIsDragging}
            updateLoan={updateLoan}
          />
        );
      case 2:
        return (
          <ConfigurationStep
            loanType={loanType}
            reason={reason}
            disbursementMethod={disbursementMethod}
            repaymentFrequency={repaymentFrequency}
            repaymentMethod={repaymentMethod}
            showAmortization={showAmortization}
            setShowAmortization={setShowAmortization}
            totalInterest={totalInterest}
            totalPayback={totalPayback}
            term={term}
            updateLoan={updateLoan}
          />
        );
      case 3:
        return <FeesStep amount={amount} netAmount={netAmount} />;
      case 4:
        return (
          <DocumentsStep
            uploadedDocs={uploadedDocs}
            setUploadedDocs={setUploadedDocs}
            docuSignComplete={docuSignComplete}
            setDocuSignComplete={setDocuSignComplete}
          />
        );
      case 5:
        return (
          <ReviewStep
            amount={amount}
            netAmount={netAmount}
            term={term}
            loanType={loanType}
            monthlyPayment={monthlyPayment}
            totalInterest={totalInterest}
            termsAccepted={termsAccepted}
            setTermsAccepted={setTermsAccepted}
          />
        );
      case 6:
        return (
          <ConfirmationStep
            amount={amount}
            term={term}
            loanType={loanType}
            monthlyPayment={monthlyPayment}
            onReturn={() => {
              resetFlow();
              navigate(withVersion(version, "/transactions"));
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <TransactionFlowShell type="loan" canContinue={canContinue} hideCta={activeStep === 6}>
      {stepContent()}
    </TransactionFlowShell>
  );
}

/* ─── Step 0: Eligibility ────────────────────────────────────────────────── */

function EligibilityStep({
  minPayment,
  maxPayment,
}: {
  minPayment: number;
  maxPayment: number;
}) {
  const eligibilityItems = [
    { label: "Max loan available", value: fmt.format(LOAN_CONFIG.maxAmount) },
    { label: "Outstanding loans", value: "$0" },
    { label: "Interest rate", value: `${(LOAN_CONFIG.interestRate * 100).toFixed(1)}%` },
    { label: "Max term", value: `${LOAN_CONFIG.maxTerm} years` },
    {
      label: "Monthly payment range",
      value: `${fmt.format(Math.round(minPayment))}–${fmt.format(Math.round(maxPayment))}`,
    },
  ];

  const restrictions = [
    "Must be actively employed",
    "Maximum 2 outstanding loans",
    "Minimum loan amount $1,000",
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease }}
      >
        <h1 className="text-xl font-semibold text-foreground md:text-2xl">Loan Eligibility</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review your eligibility and loan terms before proceeding.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease, delay: 0.05 }}
        className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 dark:border-emerald-800 dark:bg-emerald-900/20"
      >
        <CheckCircle2 className="size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
        <div>
          <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
            You&apos;re eligible for a plan loan
          </p>
          <p className="mt-0.5 text-xs text-emerald-600/80 dark:text-emerald-400/80">
            Based on your vested balance of {fmt.format(MOCK_PLAN.vestedBalance)}
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease, delay: 0.1 }}
          className="rounded-2xl border border-border bg-card p-6 shadow-sm"
        >
          <div className="mb-4 flex items-center gap-2">
            <Shield className="size-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Loan Terms</h3>
          </div>
          <div className="space-y-3">
            {eligibilityItems.map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{item.label}</span>
                <span className="text-sm font-semibold tabular-nums text-foreground">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease, delay: 0.15 }}
          className="rounded-2xl border border-border bg-card p-6 shadow-sm"
        >
          <div className="mb-4 flex items-center gap-2">
            <AlertTriangle className="size-4 text-amber-500" />
            <h3 className="text-sm font-semibold text-foreground">Requirements</h3>
          </div>
          <ul className="space-y-3">
            {restrictions.map((r) => (
              <li key={r} className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                <span className="text-sm text-muted-foreground">{r}</span>
              </li>
            ))}
          </ul>

          <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-primary/10 bg-primary/5 px-3.5 py-3">
            <Info className="mt-0.5 size-3.5 shrink-0 text-primary" />
            <p className="text-xs text-primary/80">
              Additional documentation may be required for residential and refinance loans.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ─── Step 1: Simulator ──────────────────────────────────────────────────── */

function SimulatorStep({
  amount,
  term,
  monthlyPayment,
  totalInterest,
  totalPayback,
  sliderPct,
  termSliderPct,
  isDragging,
  setIsDragging,
  updateLoan,
}: {
  amount: number;
  term: number;
  monthlyPayment: number;
  totalInterest: number;
  totalPayback: number;
  sliderPct: number;
  termSliderPct: number;
  isDragging: boolean;
  setIsDragging: (v: boolean) => void;
  updateLoan: (patch: Record<string, unknown>) => void;
}) {
  const payoffDate = useMemo(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + term);
    return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  }, [term]);

  const retirementImpact = useMemo(() => {
    const growthRate = 0.07;
    const yearsToRetirement = 25;
    return amount * Math.pow(1 + growthRate, yearsToRetirement) - amount;
  }, [amount]);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease }}
      >
        <h1 className="text-xl font-semibold text-foreground md:text-2xl">Loan Simulator</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Adjust the amount and term to see your estimated payments.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left: Input controls */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease, delay: 0.05 }}
          className="space-y-5"
        >
          {/* Amount slider */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Loan Amount
            </label>
            <motion.p
              key={amount}
              initial={{ scale: 0.9, opacity: 0.4 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.18, ease }}
              className="mt-1 text-4xl font-bold tabular-nums tracking-tight text-foreground"
            >
              {fmt.format(amount)}
            </motion.p>

            <div className="mt-4">
              <div className="relative h-2 w-full rounded-full bg-muted">
                <div
                  className="absolute left-0 top-0 h-full rounded-full bg-primary transition-all duration-150"
                  style={{ width: `${sliderPct}%` }}
                />
                <input
                  type="range"
                  min={LOAN_CONFIG.minAmount}
                  max={LOAN_CONFIG.maxAmount}
                  step={100}
                  value={amount}
                  onChange={(e) => updateLoan({ amount: Number(e.target.value) })}
                  onMouseDown={() => setIsDragging(true)}
                  onMouseUp={() => setIsDragging(false)}
                  onTouchStart={() => setIsDragging(true)}
                  onTouchEnd={() => setIsDragging(false)}
                  className={cn(
                    "absolute inset-0 h-full w-full cursor-pointer opacity-0",
                    isDragging && "cursor-grabbing",
                  )}
                  aria-label="Loan amount slider"
                />
                <div
                  className={cn(
                    "pointer-events-none absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary bg-white shadow-md transition-all duration-150",
                    isDragging ? "h-5 w-5 shadow-lg shadow-primary/20" : "h-4 w-4",
                  )}
                  style={{ left: `${sliderPct}%` }}
                />
              </div>
              <div className="mt-1.5 flex justify-between text-[10px] text-muted-foreground">
                <span>{fmt.format(LOAN_CONFIG.minAmount)}</span>
                <span>{fmt.format(LOAN_CONFIG.maxAmount)}</span>
              </div>
            </div>
          </div>

          {/* Term slider */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Repayment Term
            </label>
            <motion.p
              key={term}
              initial={{ scale: 0.9, opacity: 0.4 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.18, ease }}
              className="mt-1 text-3xl font-bold tabular-nums tracking-tight text-foreground"
            >
              {term} year{term > 1 ? "s" : ""}
            </motion.p>

            <div className="mt-4">
              <div className="relative h-2 w-full rounded-full bg-muted">
                <div
                  className="absolute left-0 top-0 h-full rounded-full bg-primary transition-all duration-150"
                  style={{ width: `${termSliderPct}%` }}
                />
                <input
                  type="range"
                  min={LOAN_CONFIG.minTerm}
                  max={LOAN_CONFIG.maxTerm}
                  step={1}
                  value={term}
                  onChange={(e) => updateLoan({ term: Number(e.target.value) })}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  aria-label="Repayment term slider"
                />
                <div
                  className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary bg-white shadow-md transition-all duration-150"
                  style={{ left: `${termSliderPct}%` }}
                />
              </div>
              <div className="mt-1.5 flex justify-between text-[10px] text-muted-foreground">
                <span>{LOAN_CONFIG.minTerm} yr</span>
                <span>{LOAN_CONFIG.maxTerm} yrs</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right: Payment details */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease, delay: 0.1 }}
          className="space-y-4"
        >
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Monthly Payment
            </p>
            <motion.p
              key={`mp-${Math.round(monthlyPayment)}`}
              initial={{ opacity: 0.4, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22 }}
              className="mt-1 text-4xl font-bold tabular-nums tracking-tight text-foreground"
            >
              {fmtCents.format(monthlyPayment)}
            </motion.p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              for {term * 12} months at {(LOAN_CONFIG.interestRate * 100).toFixed(1)}% APR
            </p>

            <div className="mt-5 grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-border bg-background p-3.5">
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Total Interest
                </p>
                <p className="mt-1 text-lg font-bold tabular-nums text-foreground">
                  {fmtCents.format(totalInterest)}
                </p>
              </div>
              <div className="rounded-xl border border-border bg-background p-3.5">
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Total Payback
                </p>
                <p className="mt-1 text-lg font-bold tabular-nums text-foreground">
                  {fmtCents.format(totalPayback)}
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-xl border border-border bg-background px-3.5 py-3">
              <div className="flex items-center gap-2">
                <Calendar className="size-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Payoff Date</span>
              </div>
              <span className="text-sm font-semibold tabular-nums text-foreground">
                {payoffDate}
              </span>
            </div>
          </div>

          {/* Retirement impact */}
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-800 dark:bg-amber-900/20">
            <div className="flex items-center gap-2">
              <TrendingDown className="size-4 text-amber-600 dark:text-amber-400" />
              <p className="text-xs font-semibold text-amber-700 dark:text-amber-300">
                Retirement Impact
              </p>
            </div>
            <p className="mt-2 text-2xl font-bold tabular-nums text-amber-700 dark:text-amber-300">
              -{fmt.format(Math.round(retirementImpact))}
            </p>
            <p className="mt-1 text-xs text-amber-600/80 dark:text-amber-400/80">
              Projected impact on your retirement balance over 25 years at 7% growth.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ─── Step 2: Configuration ──────────────────────────────────────────────── */

function ConfigurationStep({
  loanType,
  reason,
  disbursementMethod,
  repaymentFrequency,
  repaymentMethod,
  showAmortization,
  setShowAmortization,
  totalInterest,
  totalPayback,
  term,
  updateLoan,
}: {
  loanType: "general" | "residential" | "refinance";
  reason: string;
  disbursementMethod: "eft" | "check";
  repaymentFrequency: "weekly" | "biweekly" | "monthly";
  repaymentMethod: "payroll" | "ach" | "manual";
  showAmortization: boolean;
  setShowAmortization: (v: boolean) => void;
  totalInterest: number;
  totalPayback: number;
  term: number;
  updateLoan: (patch: Record<string, unknown>) => void;
}) {
  const numberOfPayments = (() => {
    switch (repaymentFrequency) {
      case "weekly":
        return term * 52;
      case "biweekly":
        return term * 26;
      default:
        return term * 12;
    }
  })();

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease }}
      >
        <h1 className="text-xl font-semibold text-foreground md:text-2xl">Configuration</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose your loan type, reason, and payment preferences.
        </p>
      </motion.div>

      {/* Loan type cards */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease, delay: 0.05 }}
        className="rounded-2xl border border-border bg-card p-6 shadow-sm"
      >
        <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Loan Type
        </label>
        <div className="mt-3 grid grid-cols-3 gap-3">
          {LOAN_TYPES.map((lt) => {
            const Icon = lt.icon;
            const selected = loanType === lt.value;
            return (
              <button
                key={lt.value}
                type="button"
                onClick={() => updateLoan({ loanType: lt.value })}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-xl border p-4 transition active:scale-[0.97]",
                  selected
                    ? "border-primary/40 bg-primary/10 shadow-sm"
                    : "border-border hover:bg-muted",
                )}
              >
                <Icon
                  className={cn(
                    "size-5",
                    selected ? "text-primary dark:text-primary" : "text-muted-foreground",
                  )}
                />
                <span
                  className={cn(
                    "text-xs font-medium",
                    selected ? "text-primary dark:text-primary" : "text-foreground",
                  )}
                >
                  {lt.label}
                </span>
                <span className="text-[10px] text-muted-foreground">{lt.desc}</span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Reason dropdown */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease, delay: 0.08 }}
        className="rounded-2xl border border-border bg-card p-6 shadow-sm"
      >
        <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Reason for Loan
        </label>
        <div className="relative mt-3">
          <select
            value={reason}
            onChange={(e) => updateLoan({ reason: e.target.value })}
            className="h-11 w-full appearance-none rounded-xl border border-border bg-background px-4 pr-10 text-sm text-foreground transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">Select a reason...</option>
            {REASONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        </div>
      </motion.div>

      {/* Processing time */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease, delay: 0.1 }}
        className="flex items-center gap-3 rounded-2xl border border-primary/10 bg-primary/5 px-5 py-4"
      >
        <Clock className="size-4 shrink-0 text-primary" />
        <p className="text-sm text-primary/80">
          Estimated processing time: <span className="font-semibold text-primary">10 business days</span>
        </p>
      </motion.div>

      {/* Payment details */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease, delay: 0.12 }}
        className="rounded-2xl border border-border bg-card p-6 shadow-sm"
      >
        <div className="mb-4 flex items-center gap-2">
            <CreditCard className="size-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Payment Details</h3>
        </div>

        {/* Disbursement method */}
        <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Disbursement Method
        </label>
        <div className="mt-3 space-y-2">
          {(["eft", "check"] as const).map((method) => (
            <label
              key={method}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition",
                disbursementMethod === method
                  ? "border-primary/40 bg-primary/10"
                  : "border-border hover:bg-muted",
              )}
            >
              <input
                type="radio"
                name="disbursement"
                value={method}
                checked={disbursementMethod === method}
                onChange={() => updateLoan({ disbursementMethod: method })}
                className="size-4 border-border text-primary focus:ring-primary"
              />
              <div className="flex-1">
                <span className="text-sm font-medium text-foreground">
                  {method === "eft" ? "Electronic Funds Transfer (EFT)" : "Paper Check"}
                </span>
                {method === "eft" && (
                  <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                    Recommended
                  </span>
                )}
              </div>
            </label>
          ))}
        </div>
        {disbursementMethod === "eft" && (
          <div className="mt-2 flex items-start gap-2 rounded-lg bg-primary/5 px-3 py-2 dark:bg-primary/5">
            <Info className="mt-0.5 size-3 shrink-0 text-primary" />
            <p className="text-[11px] text-primary dark:text-primary">
              EFT deposits are typically received 1–2 business days faster than paper checks.
            </p>
          </div>
        )}
      </motion.div>

      {/* Repayment settings */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease, delay: 0.15 }}
        className="rounded-2xl border border-border bg-card p-6 shadow-sm"
      >
        <h3 className="mb-4 text-sm font-semibold text-foreground">Repayment Settings</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Repayment Frequency
            </label>
            <div className="relative mt-2">
              <select
                value={repaymentFrequency}
                onChange={(e) =>
                  updateLoan({ repaymentFrequency: e.target.value as typeof repaymentFrequency })
                }
                className="h-11 w-full appearance-none rounded-xl border border-border bg-background px-4 pr-10 text-sm text-foreground transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="weekly">Weekly</option>
                <option value="biweekly">Biweekly</option>
                <option value="monthly">Monthly</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Repayment Method
            </label>
            <div className="relative mt-2">
              <select
                value={repaymentMethod}
                onChange={(e) =>
                  updateLoan({ repaymentMethod: e.target.value as typeof repaymentMethod })
                }
                className="h-11 w-full appearance-none rounded-xl border border-border bg-background px-4 pr-10 text-sm text-foreground transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="payroll">Payroll Deduction</option>
                <option value="ach">ACH</option>
                <option value="manual">Manual</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Amortization preview toggle */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease, delay: 0.18 }}
        className="rounded-2xl border border-border bg-card shadow-sm"
      >
        <button
          type="button"
          onClick={() => setShowAmortization(!showAmortization)}
          className="flex w-full items-center justify-between px-6 py-4 text-left"
        >
          <span className="text-sm font-semibold text-foreground">Amortization Preview</span>
          <ChevronDown
            className={cn(
              "size-4 text-muted-foreground transition-transform duration-200",
              showAmortization && "rotate-180",
            )}
          />
        </button>
        {showAmortization && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.2 }}
            className="border-t border-border px-6 pb-5 pt-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Repayment</span>
                <span className="text-sm font-semibold tabular-nums text-foreground">
                  {fmtCents.format(totalPayback)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Interest</span>
                <span className="text-sm font-semibold tabular-nums text-foreground">
                  {fmtCents.format(totalInterest)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Number of Payments</span>
                <span className="text-sm font-semibold tabular-nums text-foreground">
                  {numberOfPayments}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

/* ─── Step 3: Fees ───────────────────────────────────────────────────────── */

function FeesStep({ amount, netAmount }: { amount: number; netAmount: number }) {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease }}
      >
        <h1 className="text-xl font-semibold text-foreground md:text-2xl">Fees & Charges</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review the fees associated with your loan before proceeding.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease, delay: 0.05 }}
        className="rounded-2xl border border-border bg-card p-6 shadow-sm"
      >
        <div className="mb-5 flex items-center gap-2">
          <CreditCard className="size-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Fee Breakdown</h3>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Gross Loan Amount</span>
            <span className="text-sm font-semibold tabular-nums text-foreground">
              {fmt.format(amount)}
            </span>
          </div>

          <div className="border-t border-border pt-3" />

          {[
            { label: "Transaction Fee", value: LOAN_CONFIG.originationFee },
            { label: "TPA Fee", value: LOAN_CONFIG.processingFee },
            { label: "EFT Fee", value: LOAN_CONFIG.recordkeepingFee },
            { label: "Redemption Fee", value: LOAN_CONFIG.checkFee },
          ].map((fee) => (
            <div key={fee.label} className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{fee.label}</span>
              <span className="text-sm tabular-nums text-foreground">-{fmt.format(fee.value)}</span>
            </div>
          ))}

          <div className="border-t border-border pt-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">Total Fees</span>
              <span className="text-sm font-bold tabular-nums text-foreground">
                {fmt.format(TOTAL_FEES)}
              </span>
            </div>
          </div>

          <div className="border-t border-border pt-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">Net Loan Amount</span>
              <span className="text-sm font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
                {fmt.format(netAmount)}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease, delay: 0.1 }}
        className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 dark:border-amber-800 dark:bg-amber-900/20"
      >
        <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-600 dark:text-amber-400" />
        <div>
          <p className="text-sm font-semibold text-amber-700 dark:text-amber-300">
            Important Disclosure
          </p>
          <p className="mt-1 text-xs text-amber-600/80 dark:text-amber-400/80">
            Missed payments may trigger a loan default and a taxable distribution. Please ensure you
            can meet the repayment obligations before proceeding.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Step 4: Documents ──────────────────────────────────────────────────── */

function DocumentsStep({
  uploadedDocs,
  setUploadedDocs,
  docuSignComplete,
  setDocuSignComplete,
}: {
  uploadedDocs: Record<string, string>;
  setUploadedDocs: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  docuSignComplete: boolean;
  setDocuSignComplete: (v: boolean) => void;
}) {
  const handleUpload = (docId: string) => {
    setUploadedDocs((prev) => ({ ...prev, [docId]: `${docId}-uploaded.pdf` }));
  };

  const handleRemove = (docId: string) => {
    setUploadedDocs((prev) => {
      const next = { ...prev };
      delete next[docId];
      return next;
    });
  };

  const handleDocuSign = () => {
    setDocuSignComplete(true);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease }}
      >
        <h1 className="text-xl font-semibold text-foreground md:text-2xl">Documents</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Sign electronically or upload the required documents to proceed.
        </p>
      </motion.div>

      {/* DocuSign banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease, delay: 0.05 }}
        className={cn(
          "flex items-center justify-between rounded-2xl border px-5 py-4",
          docuSignComplete
            ? "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20"
            : "border-primary/20 bg-primary/5 dark:border-primary/30 dark:bg-primary/10",
        )}
      >
        <div className="flex items-center gap-3">
          <FileCheck
            className={cn(
              "size-5 shrink-0",
              docuSignComplete
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-primary dark:text-primary",
            )}
          />
          <div>
            <p
              className={cn(
                "text-sm font-semibold",
                docuSignComplete
                  ? "text-emerald-700 dark:text-emerald-300"
                  : "text-primary dark:text-primary",
              )}
            >
              {docuSignComplete ? "Documents Signed via DocuSign" : "Sign with DocuSign"}
            </p>
            <p
              className={cn(
                "mt-0.5 text-xs",
                docuSignComplete
                  ? "text-emerald-600/80 dark:text-emerald-400/80"
                  : "text-primary/80 dark:text-primary/80",
              )}
            >
              {docuSignComplete
                ? "All required documents have been signed electronically."
                : "Complete all required documents with a single electronic signature."}
            </p>
          </div>
        </div>
        {!docuSignComplete && (
          <button
            type="button"
            onClick={handleDocuSign}
            className="shrink-0 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white transition hover:bg-primary/90 active:scale-[0.97]"
          >
            Sign with DocuSign
          </button>
        )}
        {docuSignComplete && (
          <CheckCircle2 className="size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
        )}
      </motion.div>

      {/* Divider */}
      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs font-medium text-muted-foreground">or upload manually</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      {/* Document list */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease, delay: 0.1 }}
        className="space-y-3"
      >
        {REQUIRED_DOCS.map((doc, i) => {
          const isUploaded = !!uploadedDocs[doc.id] || docuSignComplete;
          return (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease, delay: 0.12 + i * 0.03 }}
              className="flex items-center justify-between rounded-2xl border border-border bg-card px-5 py-4 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex size-9 items-center justify-center rounded-xl",
                    isUploaded
                      ? "bg-emerald-100 dark:bg-emerald-900/30"
                      : "bg-slate-100 dark:bg-slate-800",
                  )}
                >
                  {isUploaded ? (
                    <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <FileText className="size-4 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{doc.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {doc.required ? "Required" : "Optional"}
                    {isUploaded && !docuSignComplete && uploadedDocs[doc.id] && (
                      <span className="ml-1.5 text-emerald-600 dark:text-emerald-400">
                        — {uploadedDocs[doc.id]}
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isUploaded && !docuSignComplete && uploadedDocs[doc.id] && (
                  <button
                    type="button"
                    onClick={() => handleRemove(doc.id)}
                    className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
                    aria-label={`Remove ${doc.label}`}
                  >
                    <X className="size-4" />
                  </button>
                )}
                {!isUploaded && (
                  <button
                    type="button"
                    onClick={() => handleUpload(doc.id)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-1.5 text-xs font-medium text-foreground transition hover:bg-muted active:scale-[0.97]"
                  >
                    <Upload className="size-3.5" />
                    Upload
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}

/* ─── Step 5: Review ─────────────────────────────────────────────────────── */

function ReviewStep({
  amount,
  netAmount,
  term,
  loanType,
  monthlyPayment,
  totalInterest,
  termsAccepted,
  setTermsAccepted,
}: {
  amount: number;
  netAmount: number;
  term: number;
  loanType: string;
  monthlyPayment: number;
  totalInterest: number;
  termsAccepted: boolean;
  setTermsAccepted: (v: boolean) => void;
}) {
  const typeLabel = LOAN_TYPES.find((lt) => lt.value === loanType)?.label ?? loanType;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease }}
      >
        <h1 className="text-xl font-semibold text-foreground md:text-2xl">Review Your Loan</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Please review all details before submitting your loan request.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease, delay: 0.05 }}
        className="rounded-2xl border border-border bg-card p-6 shadow-sm"
      >
        <div className="mb-5 flex items-center gap-2">
          <FileText className="size-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Loan Summary</h3>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[
            { label: "Loan Type", value: typeLabel },
            { label: "Loan Amount", value: fmt.format(amount) },
            { label: "Net Amount", value: fmt.format(netAmount) },
            { label: "Monthly Payment", value: fmtCents.format(monthlyPayment) },
            { label: "Total Interest", value: fmtCents.format(totalInterest) },
            {
              label: "Interest Rate",
              value: `${(LOAN_CONFIG.interestRate * 100).toFixed(1)}%`,
            },
            {
              label: "Tenure",
              value: `${term} year${term > 1 ? "s" : ""} (${term * 12} months)`,
            },
            { label: "Total Fees", value: fmt.format(TOTAL_FEES) },
          ].map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between rounded-xl border border-border bg-background px-4 py-3"
            >
              <span className="text-sm text-muted-foreground">{row.label}</span>
              <span className="text-sm font-semibold tabular-nums text-foreground">
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Terms checkbox */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease, delay: 0.1 }}
        className="rounded-2xl border border-border bg-card p-5 shadow-sm"
      >
        <div className="mb-3 flex items-center gap-2">
          <Shield className="size-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Terms & Agreement</h3>
        </div>
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="mt-0.5 size-4 rounded border-border text-primary focus:ring-primary"
          />
          <span className="text-sm text-muted-foreground">
            I have reviewed and agree to the loan terms, including the repayment schedule, interest
            rate, and associated fees. I understand that failure to repay may result in a deemed
            distribution and tax consequences.
          </span>
        </label>
      </motion.div>
    </div>
  );
}

/* ─── Step 6: Confirmation ───────────────────────────────────────────────── */

function ConfirmationStep({
  amount,
  term,
  loanType,
  monthlyPayment,
  onReturn,
}: {
  amount: number;
  term: number;
  loanType: string;
  monthlyPayment: number;
  onReturn: () => void;
}) {
  const typeLabel = LOAN_TYPES.find((lt) => lt.value === loanType)?.label ?? loanType;

  const nextSteps = [
    "Your loan request is being processed and reviewed",
    "Expect disbursement within 5–7 business days",
    "Repayments will begin with your next pay period",
    "You can track your loan status in the Transaction Center",
  ];

  return (
    <div className="flex flex-col items-center text-center">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease, delay: 0.1 }}
        className="flex size-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30"
      >
        <CheckCircle2 className="size-10 text-emerald-600 dark:text-emerald-400" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease, delay: 0.2 }}
        className="mt-5 text-2xl font-bold text-foreground"
      >
        Loan Request Submitted
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease, delay: 0.25 }}
        className="mt-2 max-w-md text-sm text-muted-foreground"
      >
        Your {typeLabel.toLowerCase()} loan request for {fmt.format(amount)} has been submitted
        successfully.
      </motion.p>

      {/* Summary card */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease, delay: 0.3 }}
        className="mt-6 w-full max-w-md rounded-2xl border border-border bg-card p-5 text-left shadow-sm"
      >
        <div className="space-y-2.5">
          {[
            { label: "Loan type", value: typeLabel },
            { label: "Amount", value: fmt.format(amount) },
            { label: "Term", value: `${term} year${term > 1 ? "s" : ""}` },
            { label: "Monthly payment", value: fmtCents.format(monthlyPayment) },
          ].map((row) => (
            <div key={row.label} className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{row.label}</span>
              <span className="text-sm font-semibold tabular-nums text-foreground">
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Next steps */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease, delay: 0.35 }}
        className="mt-5 w-full max-w-md rounded-2xl border border-border bg-card p-5 text-left shadow-sm"
      >
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
          <Clock className="size-4 text-primary" />
          Next Steps
        </h3>
        <ul className="space-y-2.5">
          {nextSteps.map((step, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary dark:bg-primary/10 dark:text-primary">
                {i + 1}
              </span>
              <span className="text-sm text-muted-foreground">{step}</span>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Return button */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease, delay: 0.4 }}
        type="button"
        onClick={onReturn}
        className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-8 text-sm font-semibold text-white shadow-md shadow-primary/20 transition hover:shadow-lg active:scale-[0.98]"
      >
        <DollarSign className="size-4" />
        Return to Transaction Center
      </motion.button>
    </div>
  );
}
