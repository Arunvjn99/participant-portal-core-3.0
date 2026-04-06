
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Banknote,
  Building2,
  CheckCircle2,
  Clock,
  CreditCard,
  DollarSign,
  FileText,
  Info,
  Landmark,
  Mail,
  Receipt,
  Shield,
  ShieldAlert,
  Wallet,
  XCircle,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import { getRoutingVersion, withVersion } from "@/core/version";
import { cn } from "@/lib/utils";
import { TransactionFlowShell } from "../TransactionFlowShell";
import { useCrpTransactionStore } from "../crpTransactionStore";
import {
  MOCK_PLAN,
  WITHDRAW_CONFIG,
  WITHDRAW_SOURCES,
} from "../types";

const ease = [0.4, 0, 0.2, 1] as const;

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);

const fmtWhole = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

const pct = (n: number) => `${(n * 100).toFixed(0)}%`;

type WithdrawalType =
  | "hardship"
  | "in-service"
  | "termination"
  | "rmd"
  | "one-time"
  | "full-balance";

const WITHDRAWAL_TYPES: {
  id: WithdrawalType;
  title: string;
  description: string;
  warning: string;
  icon: typeof Wallet;
  color: string;
  bgColor: string;
  warningColor: string;
}[] = [
  {
    id: "hardship",
    title: "Hardship Withdrawal",
    description:
      "Immediate financial need — medical, housing, or education expenses",
    warning: "Must demonstrate immediate and heavy financial need",
    icon: AlertTriangle,
    color: "text-red-600",
    bgColor: "bg-red-50 dark:bg-red-500/10",
    warningColor: "text-red-500",
  },
  {
    id: "in-service",
    title: "In-Service Withdrawal",
    description: "Withdraw while still employed, subject to plan rules",
    warning: "Available only if age 59½ or plan permits",
    icon: Wallet,
    color: "text-primary",
    bgColor: "bg-primary/5 dark:bg-primary/10",
    warningColor: "text-primary",
  },
  {
    id: "termination",
    title: "Termination Distribution",
    description: "Full or partial distribution after leaving your employer",
    warning: "Available after separation from service",
    icon: Building2,
    color: "text-primary",
    bgColor: "bg-primary/5 dark:bg-primary/10",
    warningColor: "text-primary",
  },
  {
    id: "rmd",
    title: "Required Minimum Distribution",
    description: "Required distribution for participants 73 and older",
    warning: "Failure to take RMD may result in 25% excise tax",
    icon: Landmark,
    color: "text-amber-600",
    bgColor: "bg-amber-50 dark:bg-amber-500/10",
    warningColor: "text-amber-500",
  },
  {
    id: "one-time",
    title: "One-Time Withdrawal",
    description: "Single partial distribution from your vested balance",
    warning: "Subject to applicable taxes and penalties",
    icon: Banknote,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50 dark:bg-emerald-500/10",
    warningColor: "text-emerald-500",
  },
  {
    id: "full-balance",
    title: "Full Balance Withdrawal",
    description: "Withdraw your entire vested account balance",
    warning: "This will close your account and cannot be undone",
    icon: DollarSign,
    color: "text-rose-600",
    bgColor: "bg-rose-50 dark:bg-rose-500/10",
    warningColor: "text-rose-500",
  },
];

export function WithdrawFlowClient() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const version = getRoutingVersion(pathname);
  const { activeStep, activeType, updateFlowData, startFlow, resetFlow } =
    useCrpTransactionStore();

  useEffect(() => {
    if (activeType !== "withdraw") startFlow("withdraw");
  }, [activeType, startFlow]);

  const [withdrawalType, setWithdrawalType] = useState<WithdrawalType | null>(
    null,
  );
  const [sources, setSources] = useState<Record<string, number>>(() =>
    Object.fromEntries(WITHDRAW_SOURCES.map((s) => [s.id, 0])),
  );
  const [paymentMethod, setPaymentMethod] = useState<"ach" | "check" | null>(
    null,
  );
  const [bankLast4, setBankLast4] = useState("1234");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const sourceTotal = Object.values(sources).reduce((a, b) => a + b, 0);
  const federalTax = sourceTotal * WITHDRAW_CONFIG.federalWithholding;
  const stateTax = sourceTotal * WITHDRAW_CONFIG.stateWithholding;
  const fee = WITHDRAW_CONFIG.processingFee;
  const netAmount = sourceTotal - federalTax - stateTax - fee;

  const canContinue = (() => {
    switch (activeStep) {
      case 0:
        return true;
      case 1:
        return withdrawalType !== null;
      case 2:
        return sourceTotal > 0;
      case 3:
        return true;
      case 4:
        return paymentMethod !== null;
      case 5:
        return termsAccepted;
      case 6:
        return true;
      default:
        return false;
    }
  })();

  useEffect(() => {
    if (activeStep === 1 && withdrawalType) {
      updateFlowData("withdraw", { withdrawalType });
    }
  }, [withdrawalType, activeStep, updateFlowData]);

  useEffect(() => {
    if (activeStep === 2) {
      updateFlowData("withdraw", { sources, amount: sourceTotal });
    }
  }, [sources, sourceTotal, activeStep, updateFlowData]);

  useEffect(() => {
    if (activeStep === 4 && paymentMethod) {
      updateFlowData("withdraw", { paymentMethod });
    }
  }, [paymentMethod, activeStep, updateFlowData]);

  useEffect(() => {
    if (activeStep >= 3) {
      updateFlowData("withdraw", {
        taxWithholding: federalTax + stateTax,
        netAmount,
        fees: fee,
      });
    }
  }, [federalTax, stateTax, netAmount, fee, activeStep, updateFlowData]);

  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return <StepEligibility />;
      case 1:
        return (
          <StepTypeSelection
            selected={withdrawalType}
            onSelect={setWithdrawalType}
          />
        );
      case 2:
        return (
          <StepSourceSelection
            sources={sources}
            onSourceChange={(id, val) =>
              setSources((prev) => ({ ...prev, [id]: val }))
            }
            total={sourceTotal}
          />
        );
      case 3:
        return (
          <StepFeesWithholding
            grossAmount={sourceTotal}
            federalTax={federalTax}
            stateTax={stateTax}
            fee={fee}
            netAmount={netAmount}
          />
        );
      case 4:
        return (
          <StepPaymentMethod
            selected={paymentMethod}
            onSelect={setPaymentMethod}
            bankLast4={bankLast4}
            onBankLast4Change={setBankLast4}
          />
        );
      case 5:
        return (
          <StepReview
            withdrawalType={withdrawalType}
            grossAmount={sourceTotal}
            federalTax={federalTax}
            stateTax={stateTax}
            fee={fee}
            netAmount={netAmount}
            paymentMethod={paymentMethod}
            termsAccepted={termsAccepted}
            setTermsAccepted={setTermsAccepted}
          />
        );
      case 6:
        return (
          <StepConfirmation
            grossAmount={sourceTotal}
            netAmount={netAmount}
            paymentMethod={paymentMethod}
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
    <TransactionFlowShell
      type="withdraw"
      canContinue={canContinue}
      hideCta={activeStep === 6}
    >
      {renderStep()}
    </TransactionFlowShell>
  );
}

/* ------------------------------------------------------------------ */
/*  STEP 0 — Eligibility                                               */
/* ------------------------------------------------------------------ */

function StepEligibility() {
  const metrics = [
    {
      label: "Available",
      value: fmtWhole(WITHDRAW_CONFIG.availableAmount),
      accent: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-500/10",
      icon: DollarSign,
      iconColor: "text-emerald-600",
    },
    {
      label: "Est. Tax Withholding",
      value: "20–35%",
      accent: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-500/10",
      icon: Receipt,
      iconColor: "text-amber-600",
    },
    {
      label: "Vested Balance",
      value: fmtWhole(WITHDRAW_CONFIG.vestedBalance),
      accent: "text-foreground",
      bg: "bg-slate-50 dark:bg-slate-500/10",
      icon: Shield,
      iconColor: "text-primary",
    },
  ];

  const checks: {
    label: string;
    eligible: boolean;
    reason: string;
  }[] = [
    { label: "Hardship", eligible: true, reason: "Eligible" },
    {
      label: "In-Service",
      eligible: false,
      reason: "Not eligible — age 59½ required",
    },
    { label: "RMD", eligible: false, reason: "Not eligible — age 73 required" },
    {
      label: "Termination",
      eligible: false,
      reason: "Not eligible — active employment",
    },
  ];

  return (
    <div className="space-y-5">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease }}
      >
        <h3 className="text-lg font-semibold text-foreground">
          Withdrawal Eligibility
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Review your eligibility and the tax implications before proceeding.
        </p>
      </motion.div>

      {/* 3-col metrics */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease, delay: 0.05 }}
        className="grid grid-cols-3 gap-3"
      >
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div
              key={m.label}
              className={cn(
                "rounded-2xl border border-border p-4 shadow-sm",
                m.bg,
              )}
            >
              <div className="flex items-center gap-2">
                <Icon className={cn("size-4", m.iconColor)} />
                <span className="text-xs font-medium text-muted-foreground">
                  {m.label}
                </span>
              </div>
              <p className={cn("mt-2 text-xl font-bold tabular-nums", m.accent)}>
                {m.value}
              </p>
            </div>
          );
        })}
      </motion.div>

      {/* Eligibility checks */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease, delay: 0.1 }}
        className="rounded-2xl border border-border bg-white p-5 shadow-sm dark:bg-card"
      >
        <div className="flex items-center gap-2 mb-4">
          <ShieldAlert className="size-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">
            Eligibility Checks
          </span>
        </div>
        <div className="space-y-3">
          {checks.map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, ease, delay: 0.12 + i * 0.04 }}
              className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0"
            >
              <div className="flex items-center gap-2.5">
                {c.eligible ? (
                  <CheckCircle2 className="size-4 text-emerald-500" />
                ) : (
                  <XCircle className="size-4 text-slate-400" />
                )}
                <span className="text-sm font-medium text-foreground">
                  {c.label}
                </span>
              </div>
              <span
                className={cn(
                  "text-xs font-medium",
                  c.eligible
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-muted-foreground",
                )}
              >
                {c.reason}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Warning */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease, delay: 0.2 }}
        className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50/50 p-4 dark:border-amber-800 dark:bg-amber-950/20"
      >
        <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-600" />
        <div>
          <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">
            Early Withdrawal Penalty
          </p>
          <p className="mt-0.5 text-xs text-amber-600/80 dark:text-amber-400/70">
            Early withdrawals before 59½ may be subject to a 10% penalty in
            addition to ordinary income tax.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  STEP 1 — Type Selection                                            */
/* ------------------------------------------------------------------ */

function StepTypeSelection({
  selected,
  onSelect,
}: {
  selected: WithdrawalType | null;
  onSelect: (t: WithdrawalType) => void;
}) {
  return (
    <div className="space-y-5">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease }}
      >
        <h3 className="text-lg font-semibold text-foreground">
          Select Withdrawal Type
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose the type of withdrawal that applies to your situation.
        </p>
      </motion.div>

      <div className="space-y-3">
        {WITHDRAWAL_TYPES.map((wt, i) => {
          const Icon = wt.icon;
          const isSelected = selected === wt.id;
          return (
            <motion.button
              key={wt.id}
              type="button"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease, delay: 0.04 * i }}
              onClick={() => onSelect(wt.id)}
              className={cn(
                "group flex w-full items-start gap-4 rounded-2xl border-2 p-4 text-left transition-all",
                isSelected
                  ? "border-primary bg-primary/5 shadow-md shadow-primary/10 dark:bg-primary/5"
                  : "border-border bg-white hover:border-slate-300 hover:shadow-sm dark:bg-card dark:hover:border-slate-600",
              )}
            >
              <div
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-xl",
                  wt.bgColor,
                )}
              >
                <Icon className={cn("size-5", wt.color)} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-foreground">
                    {wt.title}
                  </p>
                  {isSelected && (
                    <CheckCircle2 className="size-4 text-primary" />
                  )}
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                  {wt.description}
                </p>
                <p
                  className={cn(
                    "mt-1.5 text-[11px] font-medium",
                    wt.warningColor,
                  )}
                >
                  {wt.warning}
                </p>
              </div>
              <div
                className={cn(
                  "mt-1 flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-all",
                  isSelected
                    ? "border-primary bg-primary"
                    : "border-slate-300 dark:border-slate-600",
                )}
              >
                {isSelected && (
                  <div className="size-2 rounded-full bg-white" />
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* RMD info banner */}
      {selected === "rmd" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease }}
          className="flex items-start gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-4 dark:border-primary/30 dark:bg-primary/5"
        >
          <Info className="mt-0.5 size-5 shrink-0 text-primary" />
          <div>
            <p className="text-sm font-semibold text-primary dark:text-primary">
              Estimated RMD for 2026
            </p>
            <p className="mt-0.5 text-xs text-primary/80 dark:text-primary/70">
              Your estimated RMD for 2026 is{" "}
              <span className="font-semibold tabular-nums">$1,125</span> based
              on{" "}
              <span className="font-semibold tabular-nums">
                {fmtWhole(MOCK_PLAN.balance)}
              </span>{" "}
              balance.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  STEP 2 — Source Selection                                          */
/* ------------------------------------------------------------------ */

function StepSourceSelection({
  sources,
  onSourceChange,
  total,
}: {
  sources: Record<string, number>;
  onSourceChange: (id: string, val: number) => void;
  total: number;
}) {
  return (
    <div className="space-y-5">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease }}
      >
        <h3 className="text-lg font-semibold text-foreground">
          Select Sources &amp; Amounts
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose how much to withdraw from each contribution source.
        </p>
      </motion.div>

      {/* Total header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease, delay: 0.05 }}
        className="flex items-center justify-between rounded-2xl border border-border bg-white p-5 shadow-sm dark:bg-card"
      >
        <div className="flex items-center gap-2">
          <DollarSign className="size-5 text-primary" />
          <span className="text-sm font-semibold text-foreground">
            Total Withdrawal Amount
          </span>
        </div>
        <span
          className={cn(
            "text-2xl font-bold tabular-nums",
            total > 0
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-muted-foreground",
          )}
        >
          {fmt(total)}
        </span>
      </motion.div>

      {/* Per-source sliders */}
      <div className="space-y-3">
        {WITHDRAW_SOURCES.map((src, i) => {
          const val = sources[src.id] ?? 0;
          return (
            <motion.div
              key={src.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease, delay: 0.08 + i * 0.04 }}
              className="rounded-2xl border border-border bg-white p-5 shadow-sm dark:bg-card"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {src.label}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {src.sublabel}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold tabular-nums text-foreground">
                    {fmt(val)}
                  </p>
                  <p className="text-[11px] text-muted-foreground tabular-nums">
                    of {fmtWhole(src.max)} available
                  </p>
                </div>
              </div>
              <input
                type="range"
                min={0}
                max={src.max}
                step={50}
                value={val}
                onChange={(e) => onSourceChange(src.id, Number(e.target.value))}
                className="mt-3 w-full accent-primary"
              />
              <div className="mt-1 flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground tabular-nums">
                  {fmtWhole(0)}
                </span>
                <span className="text-[11px] italic text-muted-foreground">
                  {src.taxNote}
                </span>
                <span className="text-[11px] text-muted-foreground tabular-nums">
                  {fmtWhole(src.max)}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  STEP 3 — Fees & Withholding                                        */
/* ------------------------------------------------------------------ */

function StepFeesWithholding({
  grossAmount,
  federalTax,
  stateTax,
  fee,
  netAmount,
}: {
  grossAmount: number;
  federalTax: number;
  stateTax: number;
  fee: number;
  netAmount: number;
}) {
  const rows = [
    { label: "Gross Amount", value: fmt(grossAmount), color: "text-foreground" },
    {
      label: `Federal Withholding (${pct(WITHDRAW_CONFIG.federalWithholding)})`,
      value: `−${fmt(federalTax)}`,
      color: "text-red-600 dark:text-red-400",
    },
    {
      label: `State Withholding (${pct(WITHDRAW_CONFIG.stateWithholding)})`,
      value: `−${fmt(stateTax)}`,
      color: "text-amber-600 dark:text-amber-400",
    },
    {
      label: "Processing Fee",
      value: `−${fmt(fee)}`,
      color: "text-muted-foreground",
    },
  ];

  return (
    <div className="space-y-5">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease }}
      >
        <h3 className="text-lg font-semibold text-foreground">
          Fees &amp; Withholding
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Review the estimated taxes and fees for your withdrawal.
        </p>
      </motion.div>

      {/* Withholding estimate card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease, delay: 0.05 }}
        className="rounded-2xl border border-border bg-white p-5 shadow-sm dark:bg-card"
      >
        <div className="flex items-center gap-2 mb-4">
          <Banknote className="size-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">
            Withholding Estimate
          </span>
        </div>
        <div className="space-y-3">
          {rows.map((row, i) => (
            <motion.div
              key={row.label}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, ease, delay: 0.08 + i * 0.03 }}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-muted-foreground">{row.label}</span>
              <span className={cn("font-medium tabular-nums", row.color)}>
                {row.value}
              </span>
            </motion.div>
          ))}
          <div className="border-t border-border pt-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground">
              Net Amount
            </span>
            <span className="text-2xl font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
              {fmt(netAmount)}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Info banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease, delay: 0.15 }}
        className="flex items-start gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-4 dark:border-primary/30 dark:bg-primary/5"
      >
        <Info className="mt-0.5 size-5 shrink-0 text-primary" />
        <div>
          <p className="text-sm font-semibold text-primary dark:text-primary">
            Estimated Amounts
          </p>
          <p className="mt-0.5 text-xs text-primary/80 dark:text-primary/70">
            Final amounts depend on your elections and IRS rules. Actual
            withholding may vary based on your W-4 elections and state of
            residence.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  STEP 4 — Payment Method                                            */
/* ------------------------------------------------------------------ */

function StepPaymentMethod({
  selected,
  onSelect,
  bankLast4,
  onBankLast4Change,
}: {
  selected: "ach" | "check" | null;
  onSelect: (m: "ach" | "check") => void;
  bankLast4: string;
  onBankLast4Change: (v: string) => void;
}) {
  const methods = [
    {
      id: "ach" as const,
      title: "ACH Direct Deposit",
      description: "Funds deposited to your linked bank account",
      timeline: "3–5 business days",
      icon: CreditCard,
    },
    {
      id: "check" as const,
      title: "Paper Check by Mail",
      description: "Check mailed to your address on file",
      timeline: "7–10 business days",
      icon: Mail,
    },
  ];

  return (
    <div className="space-y-5">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease }}
      >
        <h3 className="text-lg font-semibold text-foreground">
          Payment Method
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose how you&apos;d like to receive your withdrawal funds.
        </p>
      </motion.div>

      <div className="space-y-3">
        {methods.map((m, i) => {
          const Icon = m.icon;
          const isSelected = selected === m.id;
          return (
            <motion.button
              key={m.id}
              type="button"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease, delay: 0.04 + i * 0.04 }}
              onClick={() => onSelect(m.id)}
              className={cn(
                "flex w-full items-start gap-4 rounded-2xl border-2 p-5 text-left transition-all",
                isSelected
                  ? "border-primary bg-primary/5 shadow-md shadow-primary/10 dark:bg-primary/5"
                  : "border-border bg-white hover:border-slate-300 hover:shadow-sm dark:bg-card dark:hover:border-slate-600",
              )}
            >
              <div
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-xl",
                  isSelected
                    ? "bg-primary/10 dark:bg-primary/10"
                    : "bg-slate-100 dark:bg-slate-800",
                )}
              >
                <Icon
                  className={cn(
                    "size-5",
                    isSelected
                      ? "text-primary"
                      : "text-muted-foreground",
                  )}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">
                  {m.title}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {m.description}
                </p>
                <div className="mt-2 flex items-center gap-1.5">
                  <Clock className="size-3 text-muted-foreground" />
                  <span className="text-[11px] font-medium text-muted-foreground">
                    {m.timeline}
                  </span>
                </div>
              </div>
              <div
                className={cn(
                  "mt-1 flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-all",
                  isSelected
                    ? "border-primary bg-primary"
                    : "border-slate-300 dark:border-slate-600",
                )}
              >
                {isSelected && (
                  <div className="size-2 rounded-full bg-white" />
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Bank account input for ACH */}
      {selected === "ach" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease }}
          className="rounded-2xl border border-border bg-white p-5 shadow-sm dark:bg-card"
        >
          <label className="text-sm font-semibold text-foreground">
            Bank Account (last 4 digits)
          </label>
          <div className="mt-3 flex items-center gap-3">
            <Landmark className="size-5 text-muted-foreground" />
            <input
              type="text"
              maxLength={4}
              value={bankLast4}
              onChange={(e) =>
                onBankLast4Change(e.target.value.replace(/\D/g, "").slice(0, 4))
              }
              placeholder="1234"
              className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm font-medium tabular-nums text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Confirm the last 4 digits of your linked bank account ending in ****
            {bankLast4 || "----"}
          </p>
        </motion.div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  STEP 5 — Review                                                    */
/* ------------------------------------------------------------------ */

function StepReview({
  withdrawalType,
  grossAmount,
  federalTax,
  stateTax,
  fee,
  netAmount,
  paymentMethod,
  termsAccepted,
  setTermsAccepted,
}: {
  withdrawalType: WithdrawalType | null;
  grossAmount: number;
  federalTax: number;
  stateTax: number;
  fee: number;
  netAmount: number;
  paymentMethod: "ach" | "check" | null;
  termsAccepted: boolean;
  setTermsAccepted: (v: boolean) => void;
}) {
  const typeLabel =
    WITHDRAWAL_TYPES.find((t) => t.id === withdrawalType)?.title ??
    (withdrawalType ?? "—");

  const summaryRows = [
    { label: "Withdrawal Type", value: typeLabel },
    { label: "Plan", value: MOCK_PLAN.planName },
    { label: "Account", value: MOCK_PLAN.accountNumber },
    {
      label: "Payment Method",
      value:
        paymentMethod === "ach"
          ? "ACH Direct Deposit"
          : paymentMethod === "check"
            ? "Paper Check"
            : "—",
    },
    { label: "Gross Amount", value: fmt(grossAmount) },
  ];

  const feeRows = [
    {
      item: "Federal Withholding",
      rate: pct(WITHDRAW_CONFIG.federalWithholding),
      amount: fmt(federalTax),
    },
    {
      item: "State Withholding",
      rate: pct(WITHDRAW_CONFIG.stateWithholding),
      amount: fmt(stateTax),
    },
    { item: "Processing Fee", rate: "Flat", amount: fmt(fee) },
  ];

  return (
    <div className="space-y-5">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease }}
      >
        <h3 className="text-lg font-semibold text-foreground">
          Review Withdrawal
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Please confirm the details below before submitting your request.
        </p>
      </motion.div>

      {/* Summary card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease, delay: 0.05 }}
        className="rounded-2xl border border-border bg-white p-5 shadow-sm dark:bg-card"
      >
        <div className="flex items-center gap-2 mb-4">
          <FileText className="size-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">
            Withdrawal Summary
          </span>
        </div>
        <div className="space-y-2.5">
          {summaryRows.map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between border-b border-border pb-2.5 last:border-0 last:pb-0"
            >
              <span className="text-sm text-muted-foreground">{row.label}</span>
              <span className="text-sm font-semibold text-foreground">
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Fee / tax breakdown table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease, delay: 0.1 }}
        className="rounded-2xl border border-border bg-white p-5 shadow-sm dark:bg-card"
      >
        <span className="text-sm font-semibold text-foreground">
          Fee &amp; Tax Breakdown
        </span>
        <div className="mt-4 overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/30">
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                  Item
                </th>
                <th className="px-4 py-2.5 text-right font-medium text-muted-foreground">
                  Rate
                </th>
                <th className="px-4 py-2.5 text-right font-medium text-muted-foreground">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {feeRows.map((row) => (
                <tr key={row.item}>
                  <td className="px-4 py-2.5 text-foreground">{row.item}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-muted-foreground">
                    {row.rate}
                  </td>
                  <td className="px-4 py-2.5 text-right tabular-nums font-medium text-red-600 dark:text-red-400">
                    −{row.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Net amount highlight */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease, delay: 0.15 }}
        className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 dark:border-emerald-800 dark:bg-emerald-950/20"
      >
        <span className="text-sm font-semibold text-foreground">
          Net Amount You&apos;ll Receive
        </span>
        <span className="text-2xl font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
          {fmt(netAmount)}
        </span>
      </motion.div>

      {/* Impact warning */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease, delay: 0.2 }}
        className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50/50 p-4 dark:border-amber-800 dark:bg-amber-950/20"
      >
        <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-600" />
        <div>
          <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">
            This withdrawal reduces your retirement savings
          </p>
          <p className="mt-0.5 text-xs text-amber-600/80 dark:text-amber-400/70">
            Withdrawn funds will no longer benefit from tax-deferred growth.
            Consider the long-term impact on your retirement readiness.
          </p>
        </div>
      </motion.div>

      {/* Terms checkbox */}
      <motion.label
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease, delay: 0.25 }}
        className="flex cursor-pointer items-start gap-3 rounded-2xl border border-border bg-white p-4 shadow-sm transition hover:border-primary/30 dark:bg-card dark:hover:border-primary/30"
      >
        <input
          type="checkbox"
          checked={termsAccepted}
          onChange={(e) => setTermsAccepted(e.target.checked)}
          className="mt-0.5 size-4 rounded border-border accent-primary"
        />
        <span className="text-sm text-muted-foreground leading-relaxed">
          I understand the tax implications and penalties associated with this
          withdrawal and confirm that the information provided is accurate.
        </span>
      </motion.label>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  STEP 6 — Confirmation                                              */
/* ------------------------------------------------------------------ */

function StepConfirmation({
  grossAmount,
  netAmount,
  paymentMethod,
  onReturn,
}: {
  grossAmount: number;
  netAmount: number;
  paymentMethod: "ach" | "check" | null;
  onReturn: () => void;
}) {
  return (
    <div className="flex flex-col items-center py-8">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease }}
        className="flex size-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30"
      >
        <CheckCircle2 className="size-8 text-emerald-600" />
      </motion.div>

      <motion.h3
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease, delay: 0.1 }}
        className="mt-5 text-xl font-semibold text-foreground"
      >
        Withdrawal Submitted
      </motion.h3>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease, delay: 0.15 }}
        className="mt-2 text-center text-sm text-muted-foreground max-w-md"
      >
        Your withdrawal request of{" "}
        <span className="font-semibold text-foreground">
          {fmt(grossAmount)}
        </span>{" "}
        has been submitted for processing.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease, delay: 0.2 }}
        className="mt-6 w-full max-w-sm rounded-2xl border border-border bg-white p-5 shadow-sm dark:bg-card"
      >
        <div className="space-y-2.5">
          {[
            { label: "Gross Amount", value: fmt(grossAmount) },
            { label: "Net Amount", value: fmt(netAmount), accent: true },
            {
              label: "Payment Method",
              value:
                paymentMethod === "ach"
                  ? "ACH Direct Deposit"
                  : "Paper Check",
            },
            { label: "Estimated Delivery", value: "3–5 business days" },
          ].map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-muted-foreground">{row.label}</span>
              <span
                className={cn(
                  "font-semibold tabular-nums",
                  row.accent
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-foreground",
                )}
              >
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease, delay: 0.25 }}
        className="mt-4 text-xs text-muted-foreground"
      >
        Funds will be deposited within 3–5 business days
      </motion.p>

      <motion.button
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease, delay: 0.3 }}
        type="button"
        onClick={onReturn}
        className="mt-6 inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-6 text-sm font-semibold text-white shadow-md shadow-primary/20 transition hover:shadow-lg"
      >
        Return to Transaction Center
      </motion.button>
    </div>
  );
}
