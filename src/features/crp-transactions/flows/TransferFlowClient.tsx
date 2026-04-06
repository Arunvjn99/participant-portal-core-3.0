
import { motion } from "framer-motion";
import {
  ArrowLeftRight,
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  DollarSign,
  Info,
  Layers,
  Percent,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import { getRoutingVersion, withVersion } from "@/core/version";
import { cn } from "@/lib/utils";
import { TransactionFlowShell } from "../TransactionFlowShell";
import { useCrpTransactionStore } from "../crpTransactionStore";
import { TRANSFER_DEST_FUNDS, TRANSFER_FUNDS } from "../types";

const ease = [0.4, 0, 0.2, 1] as const;

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

const totalBalance = TRANSFER_FUNDS.reduce((s, f) => s + f.balance, 0);

/* ------------------------------------------------------------------ */
/*  Step 0 — Transfer Type                                             */
/* ------------------------------------------------------------------ */

function StepTransferType({
  selected,
  onSelect,
}: {
  selected: "existing" | "future" | null;
  onSelect: (t: "existing" | "future") => void;
}) {
  const options = [
    {
      key: "existing" as const,
      icon: ArrowLeftRight,
      title: "Transfer Existing Balance",
      details: [
        "Reallocate existing balance between funds",
        "No fees for in-plan transfers",
        "Executed at market close",
      ],
    },
    {
      key: "future" as const,
      icon: CalendarClock,
      title: "Transfer Future Contributions",
      details: [
        "Applies to future contributions only",
        "Effective next pay period",
        "Doesn\u2019t affect existing balance",
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">
          Choose Transfer Type
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Select how you&apos;d like to move your investments.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {options.map((opt, i) => {
          const Icon = opt.icon;
          const active = selected === opt.key;
          return (
            <motion.button
              key={opt.key}
              type="button"
              onClick={() => onSelect(opt.key)}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease, delay: i * 0.08 }}
              whileHover={{ y: -2, transition: { duration: 0.15 } }}
              className={cn(
                "group relative flex flex-col items-start gap-4 rounded-2xl border-2 p-6 text-left transition-all",
                active
                  ? "border-primary bg-primary/5 shadow-md shadow-primary/10 dark:bg-primary/5"
                  : "border-border bg-white hover:border-slate-300 hover:shadow-sm dark:bg-card dark:hover:border-slate-600",
              )}
            >
              {active && (
                <motion.div
                  layoutId="transfer-type-check"
                  className="absolute right-4 top-4"
                >
                  <CheckCircle2 className="size-5 text-primary" />
                </motion.div>
              )}

              <div
                className={cn(
                  "flex size-12 items-center justify-center rounded-xl",
                  active
                    ? "bg-primary/10 dark:bg-primary/10"
                    : "bg-slate-100 dark:bg-slate-800",
                )}
              >
                <Icon
                  className={cn(
                    "size-5",
                    active
                      ? "text-primary"
                      : "text-slate-500 dark:text-slate-400",
                  )}
                />
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold text-foreground">
                  {opt.title}
                </p>
                <ul className="space-y-1">
                  {opt.details.map((d) => (
                    <li
                      key={d}
                      className="flex items-start gap-2 text-xs text-muted-foreground"
                    >
                      <span className="mt-1 block size-1 shrink-0 rounded-full bg-slate-400" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.button>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease, delay: 0.2 }}
        className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 dark:border-emerald-800 dark:bg-emerald-950/20"
      >
        <Info className="mt-0.5 size-4 shrink-0 text-emerald-600" />
        <p className="text-sm text-foreground">
          Transfers within your 401(k) are{" "}
          <span className="font-semibold">tax-free</span>.
        </p>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 1 — Source Fund                                               */
/* ------------------------------------------------------------------ */

function StepSourceFund({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">
          Select Source Fund
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose the fund you want to transfer from.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-white p-5 shadow-sm dark:bg-card">
        <h4 className="mb-4 text-sm font-semibold text-foreground">
          Available Funds
        </h4>
        <div className="space-y-2">
          {TRANSFER_FUNDS.map((fund, i) => {
            const active = selected === fund.id;
            return (
              <motion.button
                key={fund.id}
                type="button"
                onClick={() => onSelect(fund.id)}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease, delay: i * 0.06 }}
                className={cn(
                  "flex w-full items-center justify-between rounded-xl border-2 px-4 py-3.5 text-left transition-all",
                  active
                    ? "border-primary bg-primary/5 shadow-sm dark:bg-primary/5"
                    : "border-border bg-white hover:border-slate-300 dark:bg-card dark:hover:border-slate-600",
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn("size-3 rounded-full", fund.color)} />
                  <span className="text-sm font-medium text-foreground">
                    {fund.name}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold tabular-nums text-foreground">
                    {fmt(fund.balance)}
                  </span>
                  {active && (
                    <CheckCircle2 className="size-4 text-primary" />
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 2 — Transfer Amount                                           */
/* ------------------------------------------------------------------ */

function StepTransferAmount({
  mode,
  amount,
  maxAmount,
  onModeChange,
  onAmountChange,
}: {
  mode: "dollar" | "percent";
  amount: number;
  maxAmount: number;
  onModeChange: (m: "dollar" | "percent") => void;
  onAmountChange: (n: number) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">
          Transfer Amount
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter how much you&apos;d like to transfer.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-white p-5 shadow-sm dark:bg-card">
        {/* Dollar / Percentage toggle */}
        <div className="mb-5 flex gap-2">
          {(["dollar", "percent"] as const).map((m) => {
            const active = mode === m;
            const Icon = m === "dollar" ? DollarSign : Percent;
            return (
              <button
                key={m}
                type="button"
                onClick={() => onModeChange(m)}
                className={cn(
                  "inline-flex h-9 items-center gap-1.5 rounded-lg border px-4 text-sm font-medium transition",
                  active
                    ? "border-primary bg-primary/5 text-primary dark:bg-primary/10 dark:text-primary"
                    : "border-border bg-white text-muted-foreground hover:bg-slate-50 dark:bg-card dark:hover:bg-slate-800",
                )}
              >
                <Icon className="size-3.5" />
                {m === "dollar" ? "Dollar" : "Percentage"}
              </button>
            );
          })}
        </div>

        {/* Input */}
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-muted-foreground">
            {mode === "dollar" ? "$" : "%"}
          </span>
          <input
            type="number"
            min={0}
            max={mode === "dollar" ? maxAmount : 100}
            step={mode === "dollar" ? 100 : 1}
            value={amount || ""}
            onChange={(e) => {
              const cap = mode === "dollar" ? maxAmount : 100;
              onAmountChange(Math.min(Number(e.target.value), cap));
            }}
            placeholder="0"
            className="h-16 w-full rounded-xl border border-border bg-white pl-10 pr-4 text-3xl font-bold tabular-nums text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:bg-card"
          />
        </div>

        {mode === "dollar" && maxAmount > 0 && (
          <p className="mt-2 text-xs text-muted-foreground">
            Maximum: {fmt(maxAmount)}
          </p>
        )}

        {mode === "percent" && amount > 0 && maxAmount > 0 && (
          <p className="mt-2 text-xs text-muted-foreground">
            &asymp; {fmt(Math.round((maxAmount * amount) / 100))} of{" "}
            {fmt(maxAmount)}
          </p>
        )}

        <p className="mt-4 text-xs text-muted-foreground">
          You can transfer up to your full source balance.
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 3 — Destination Fund                                          */
/* ------------------------------------------------------------------ */

function StepDestinationFund({
  selected,
  excludeId,
  onSelect,
}: {
  selected: string | null;
  excludeId: string;
  onSelect: (id: string) => void;
}) {
  const funds = TRANSFER_DEST_FUNDS.filter((f) => f.id !== excludeId);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">
          Select Destination Fund
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose where you&apos;d like to move your investment.
        </p>
      </div>

      <div className="space-y-2">
        {funds.map((fund, i) => {
          const active = selected === fund.id;
          return (
            <motion.button
              key={fund.id}
              type="button"
              onClick={() => onSelect(fund.id)}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease, delay: i * 0.06 }}
              className={cn(
                "flex w-full items-center justify-between rounded-2xl border-2 px-5 py-4 text-left transition-all",
                active
                  ? "border-primary bg-primary/5 shadow-sm dark:bg-primary/5"
                  : "border-border bg-white hover:border-slate-300 hover:shadow-sm dark:bg-card dark:hover:border-slate-600",
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn("size-3 rounded-full", fund.color)} />
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {fund.name}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {fund.desc}
                  </p>
                </div>
              </div>
              {active && <CheckCircle2 className="size-5 text-primary" />}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 4 — Impact Preview                                            */
/* ------------------------------------------------------------------ */

function StepImpactPreview({
  fromFund,
  toFund,
  transferAmount,
}: {
  fromFund: string;
  toFund: string;
  transferAmount: number;
}) {
  const from = TRANSFER_FUNDS.find((f) => f.id === fromFund);
  const to = TRANSFER_FUNDS.find((f) => f.id === toFund) ??
    TRANSFER_DEST_FUNDS.find((f) => f.id === toFund);

  const afterAllocations: { id: string; name: string; color: string; beforePct: number; afterPct: number }[] =
    TRANSFER_FUNDS.map((f) => {
      let newBalance = f.balance;
      if (f.id === fromFund) newBalance -= transferAmount;
      if (f.id === toFund) newBalance += transferAmount;
      return {
        id: f.id,
        name: f.name,
        color: f.color,
        beforePct: f.pct,
        afterPct: (newBalance / totalBalance) * 100,
      };
    });

  const destInExisting = TRANSFER_FUNDS.some((f) => f.id === toFund);
  if (!destInExisting) {
    const destFund = TRANSFER_DEST_FUNDS.find((f) => f.id === toFund);
    if (destFund) {
      afterAllocations.push({
        id: destFund.id,
        name: destFund.name,
        color: destFund.color,
        beforePct: 0,
        afterPct: (transferAmount / totalBalance) * 100,
      });
    }
  }

  const metrics = [
    { label: "Amount Moving", value: fmt(transferAmount) },
    { label: "Estimated Trade Date", value: "Next market close" },
    { label: "Tax Impact", value: "None \u2014 in-plan" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">
          Impact Preview
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          See how this transfer affects your portfolio.
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-3">
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease, delay: i * 0.08 }}
            className="rounded-2xl border border-border bg-white p-4 shadow-sm dark:bg-card"
          >
            <p className="text-xs font-medium text-muted-foreground">
              {m.label}
            </p>
            <p className="mt-1 text-base font-bold tabular-nums text-foreground">
              {m.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Transfer direction summary */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease, delay: 0.25 }}
        className="flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4 dark:border-primary/30 dark:bg-primary/5"
      >
        <ArrowLeftRight className="size-4 shrink-0 text-primary" />
        <p className="text-sm text-foreground">
          <span className="font-semibold">{from?.name}</span>
          {" \u2192 "}
          <span className="font-semibold">{to?.name}</span>
        </p>
      </motion.div>

      {/* Allocation change */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease, delay: 0.3 }}
        className="rounded-2xl border border-border bg-white p-5 shadow-sm dark:bg-card"
      >
        <h4 className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
          <Layers className="size-4 text-muted-foreground" />
          Portfolio Allocation After Transfer
        </h4>

        <div className="space-y-3">
          {afterAllocations.map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, ease, delay: 0.35 + i * 0.06 }}
              className="space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={cn("size-2.5 rounded-full", a.color)} />
                  <span className="text-sm text-foreground">{a.name}</span>
                </div>
                <div className="flex items-center gap-2 text-xs tabular-nums text-muted-foreground">
                  <span>{a.beforePct.toFixed(1)}%</span>
                  <ArrowRight className="size-3 text-slate-400" />
                  <span className="font-semibold text-foreground">
                    {a.afterPct.toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <motion.div
                  className={cn("h-full rounded-full", a.color)}
                  initial={{ width: `${a.beforePct}%` }}
                  animate={{ width: `${a.afterPct}%` }}
                  transition={{ duration: 0.6, ease }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 5 — Review                                                    */
/* ------------------------------------------------------------------ */

function StepReview({
  transferType,
  fromFund,
  toFund,
  transferAmount,
  termsAccepted,
  onTermsChange,
}: {
  transferType: string;
  fromFund: string;
  toFund: string;
  transferAmount: number;
  termsAccepted: boolean;
  onTermsChange: (v: boolean) => void;
}) {
  const from = TRANSFER_FUNDS.find((f) => f.id === fromFund);
  const to =
    TRANSFER_FUNDS.find((f) => f.id === toFund) ??
    TRANSFER_DEST_FUNDS.find((f) => f.id === toFund);

  const summaryRows = [
    {
      label: "Transfer Type",
      value: transferType === "existing" ? "Existing Balance" : "Future Contributions",
    },
    { label: "From", value: from?.name ?? "\u2014" },
    { label: "To", value: to?.name ?? "\u2014" },
    { label: "Amount", value: fmt(transferAmount) },
    { label: "Trade Date", value: "Next market close" },
    { label: "Tax Impact", value: "None \u2014 in-plan transfer" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">
          Review Transfer
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Please confirm the details before submitting.
        </p>
      </div>

      {/* Transfer Summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease }}
        className="rounded-2xl border border-border bg-white p-5 shadow-sm dark:bg-card"
      >
        <h4 className="mb-4 text-sm font-semibold text-foreground">
          Transfer Summary
        </h4>
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          {summaryRows.map((row, i) => (
            <motion.div
              key={row.label}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease, delay: i * 0.05 }}
            >
              <p className="text-xs font-medium text-muted-foreground">
                {row.label}
              </p>
              <p className="mt-0.5 text-sm font-semibold tabular-nums text-foreground">
                {row.value}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Terms */}
      <motion.label
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease, delay: 0.3 }}
        className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-white p-4 transition hover:bg-slate-50 dark:bg-card dark:hover:bg-slate-900/40"
      >
        <input
          type="checkbox"
          checked={termsAccepted}
          onChange={(e) => onTermsChange(e.target.checked)}
          className="mt-0.5 size-4 rounded border-slate-300 accent-primary"
        />
        <span className="text-xs leading-relaxed text-muted-foreground">
          I understand that this transfer is irrevocable once processed and that
          fund values may fluctuate. I have reviewed the fund prospectuses and
          agree to the plan&apos;s transfer terms.
        </span>
      </motion.label>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 6 — Confirmation                                              */
/* ------------------------------------------------------------------ */

function StepConfirmation({
  fromFund,
  toFund,
  transferAmount,
}: {
  fromFund: string;
  toFund: string;
  transferAmount: number;
}) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const version = getRoutingVersion(pathname);
  const from = TRANSFER_FUNDS.find((f) => f.id === fromFund);
  const to =
    TRANSFER_FUNDS.find((f) => f.id === toFund) ??
    TRANSFER_DEST_FUNDS.find((f) => f.id === toFund);

  const afterAllocations: { id: string; name: string; color: string; balance: number; pct: number }[] =
    TRANSFER_FUNDS.map((f) => {
      let newBalance = f.balance;
      if (f.id === fromFund) newBalance -= transferAmount;
      if (f.id === toFund) newBalance += transferAmount;
      return {
        id: f.id,
        name: f.name,
        color: f.color,
        balance: newBalance,
        pct: (newBalance / totalBalance) * 100,
      };
    });

  const destInExisting = TRANSFER_FUNDS.some((f) => f.id === toFund);
  if (!destInExisting) {
    const destFund = TRANSFER_DEST_FUNDS.find((f) => f.id === toFund);
    if (destFund) {
      afterAllocations.push({
        id: destFund.id,
        name: destFund.name,
        color: destFund.color,
        balance: transferAmount,
        pct: (transferAmount / totalBalance) * 100,
      });
    }
  }

  return (
    <div className="flex flex-col items-center text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
        className="flex size-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30"
      >
        <CheckCircle2 className="size-8 text-emerald-600" />
      </motion.div>

      <motion.h3
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease, delay: 0.2 }}
        className="mt-4 text-xl font-semibold text-foreground"
      >
        Transfer Submitted
      </motion.h3>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease, delay: 0.25 }}
        className="mt-2 max-w-md text-sm text-muted-foreground"
      >
        Your transfer of{" "}
        <span className="font-semibold tabular-nums text-foreground">
          {fmt(transferAmount)}
        </span>{" "}
        from <span className="font-semibold">{from?.name}</span> to{" "}
        <span className="font-semibold">{to?.name}</span> will be processed at
        the next market close.
      </motion.p>

      {/* New allocation preview */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease, delay: 0.35 }}
        className="mt-6 w-full max-w-md rounded-2xl border border-border bg-white p-5 text-left shadow-sm dark:bg-card"
      >
        <h4 className="mb-3 text-sm font-semibold text-foreground">
          New Allocation
        </h4>

        {/* Stacked bar */}
        <div className="flex h-3 overflow-hidden rounded-full">
          {afterAllocations.map((a) => (
            <div
              key={a.id}
              className={cn("transition-all", a.color)}
              style={{ width: `${a.pct}%` }}
            />
          ))}
        </div>

        <div className="mt-3 space-y-2">
          {afterAllocations.map((a) => (
            <div key={a.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={cn("size-2.5 rounded-full", a.color)} />
                <span className="text-sm text-foreground">{a.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold tabular-nums text-foreground">
                  {fmt(a.balance)}
                </span>
                <span className="w-12 text-right text-xs tabular-nums text-muted-foreground">
                  {a.pct.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.button
        type="button"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease, delay: 0.45 }}
        onClick={() => {
          useCrpTransactionStore.getState().resetFlow();
          navigate(withVersion(version, "/transactions"));
        }}
        className="mt-6 inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-6 text-sm font-semibold text-white shadow-md shadow-primary/20 transition hover:shadow-lg"
      >
        Return to Transactions
        <ArrowRight className="size-4" />
      </motion.button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Flow Client                                                   */
/* ------------------------------------------------------------------ */

export function TransferFlowClient() {
  const { activeStep, activeType, flowData, updateFlowData, startFlow } =
    useCrpTransactionStore();

  const data = flowData.transfer;

  const [termsAccepted, setTermsAccepted] = useState(false);

  useEffect(() => {
    if (activeType !== "transfer") startFlow("transfer");
  }, [activeType, startFlow]);

  const fromFundObj = TRANSFER_FUNDS.find((f) => f.id === data.fromFund);
  const maxAmount = fromFundObj?.balance ?? 0;

  const transferAmount =
    data.mode === "percent"
      ? Math.round((maxAmount * (data.amount ?? 0)) / 100)
      : (data.amount ?? 0);

  const canContinue = (() => {
    switch (activeStep) {
      case 0:
        return !!data.transferType;
      case 1:
        return !!data.fromFund;
      case 2:
        return (data.amount ?? 0) > 0;
      case 3:
        return !!data.toFund;
      case 4:
        return true;
      case 5:
        return termsAccepted;
      default:
        return true;
    }
  })();

  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return (
          <StepTransferType
            selected={data.transferType ?? null}
            onSelect={(t) => updateFlowData("transfer", { transferType: t })}
          />
        );
      case 1:
        return (
          <StepSourceFund
            selected={data.fromFund ?? null}
            onSelect={(id) => updateFlowData("transfer", { fromFund: id })}
          />
        );
      case 2:
        return (
          <StepTransferAmount
            mode={data.mode ?? "dollar"}
            amount={data.amount ?? 0}
            maxAmount={maxAmount}
            onModeChange={(m) => updateFlowData("transfer", { mode: m })}
            onAmountChange={(n) => updateFlowData("transfer", { amount: n })}
          />
        );
      case 3:
        return (
          <StepDestinationFund
            selected={data.toFund ?? null}
            excludeId={data.fromFund ?? ""}
            onSelect={(id) => updateFlowData("transfer", { toFund: id })}
          />
        );
      case 4:
        return (
          <StepImpactPreview
            fromFund={data.fromFund ?? ""}
            toFund={data.toFund ?? ""}
            transferAmount={transferAmount}
          />
        );
      case 5:
        return (
          <StepReview
            transferType={data.transferType ?? "existing"}
            fromFund={data.fromFund ?? ""}
            toFund={data.toFund ?? ""}
            transferAmount={transferAmount}
            termsAccepted={termsAccepted}
            onTermsChange={setTermsAccepted}
          />
        );
      case 6:
        return (
          <StepConfirmation
            fromFund={data.fromFund ?? ""}
            toFund={data.toFund ?? ""}
            transferAmount={transferAmount}
          />
        );
      default:
        return null;
    }
  };

  return (
    <TransactionFlowShell
      type="transfer"
      canContinue={canContinue}
      hideCta={activeStep === 6}
    >
      {renderStep()}
    </TransactionFlowShell>
  );
}
