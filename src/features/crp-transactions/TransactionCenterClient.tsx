import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  Banknote,
  Building2,
  CheckCircle2,
  Clock,
  CreditCard,
  FileText,
  RefreshCw,
  Shield,
  Trash2,
  Wallet,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { getRoutingVersion, withVersion } from "@/core/version";
import { cn } from "@/lib/utils";
import { useCrpTransactionStore } from "./crpTransactionStore";
import {
  MOCK_ATTENTION,
  MOCK_PLAN,
  MOCK_RECENT,
  type AttentionItem,
  type PlanSummary,
  type RecentTransaction,
  type TransactionType,
} from "./types";

const ease = [0.4, 0, 0.2, 1] as const;

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

type QuickAction = {
  type: TransactionType;
  title: string;
  description: string;
  icon: typeof Banknote;
  color: string;
  bgColor: string;
  borderColor: string;
  meta: string;
  route: string;
};

const QUICK_ACTIONS: QuickAction[] = [
  {
    type: "loan",
    title: "Take a Loan",
    description: "Borrow against your vested balance with competitive rates",
    icon: Banknote,
    color: "text-primary",
    bgColor: "bg-primary/5 dark:bg-primary/10",
    borderColor: "border-primary/20 dark:border-primary/30",
    meta: "8% APR · 1–5 year terms",
    route: "/transactions/loan",
  },
  {
    type: "withdraw",
    title: "Withdraw Money",
    description: "Take a distribution from your retirement account",
    icon: Wallet,
    color: "text-primary",
    bgColor: "bg-primary/5 dark:bg-primary/10",
    borderColor: "border-primary/20 dark:border-primary/30",
    meta: "20% federal withholding · Penalties may apply",
    route: "/transactions/withdraw",
  },
  {
    type: "transfer",
    title: "Transfer Funds",
    description: "Move money between investment funds in your plan",
    icon: RefreshCw,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50 dark:bg-emerald-500/10",
    borderColor: "border-emerald-200 dark:border-emerald-800",
    meta: "No fees · Same-day processing",
    route: "/transactions/transfer",
  },
  {
    type: "rollover",
    title: "Roll Over",
    description: "Consolidate a previous employer plan into this account",
    icon: Building2,
    color: "text-amber-600",
    bgColor: "bg-amber-50 dark:bg-amber-500/10",
    borderColor: "border-amber-200 dark:border-amber-800",
    meta: "Traditional · Roth · IRA",
    route: "/transactions/rollover",
  },
];

const STATUS_STYLES: Record<
  AttentionItem["status"],
  { bg: string; text: string; icon: typeof AlertTriangle }
> = {
  "action-required": {
    bg: "bg-red-50 dark:bg-red-500/10",
    text: "text-red-600 dark:text-red-400",
    icon: AlertTriangle,
  },
  pending: {
    bg: "bg-amber-50 dark:bg-amber-500/10",
    text: "text-amber-600 dark:text-amber-400",
    icon: Clock,
  },
  expiring: {
    bg: "bg-orange-50 dark:bg-orange-500/10",
    text: "text-orange-600 dark:text-orange-400",
    icon: Clock,
  },
};

const RECENT_STATUS_STYLES: Record<
  RecentTransaction["status"],
  { bg: string; text: string; icon: typeof CheckCircle2 }
> = {
  completed: {
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
    text: "text-emerald-600 dark:text-emerald-400",
    icon: CheckCircle2,
  },
  processing: {
    bg: "bg-primary/5 dark:bg-primary/10",
    text: "text-primary dark:text-primary",
    icon: Clock,
  },
  cancelled: {
    bg: "bg-slate-100 dark:bg-slate-500/10",
    text: "text-slate-500 dark:text-slate-400",
    icon: XCircle,
  },
};

type RecentFilter = "all" | "loan" | "withdraw" | "transfer" | "rollover";

export type TransactionCenterClientProps = {
  /** When set, replaces mock recent transactions (e.g. merge from app service). */
  recentOverride?: RecentTransaction[];
  /** When set, recent rows become clickable (e.g. open transaction analysis). */
  onRecentRowClick?: (id: string) => void;
};

export function TransactionCenterClient({
  recentOverride,
  planSummaryOverride,
  onRecentRowClick,
}: TransactionCenterClientProps = {}) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const version = getRoutingVersion(pathname);
  const { drafts, startFlow, resumeDraft, deleteDraft } =
    useCrpTransactionStore();
  const [mounted, setMounted] = useState(false);
  const [recentFilter, setRecentFilter] = useState<RecentFilter>("all");
  useEffect(() => setMounted(true), []);

  const recentSource = recentOverride ?? MOCK_RECENT;
  const plan = planSummaryOverride ?? MOCK_PLAN;

  const handleStartFlow = (action: QuickAction) => {
    startFlow(action.type);
    navigate(withVersion(version, action.route));
  };

  const handleResume = (id: string, type: TransactionType) => {
    resumeDraft(id);
    navigate(withVersion(version, `/transactions/${type}`));
  };

  const filteredRecent =
    recentFilter === "all"
      ? recentSource
      : recentSource.filter((t) => t.type === recentFilter);

  return (
    <div className="min-h-[calc(100vh-3.5rem)]">
      <div className="mx-auto max-w-[1100px] px-6 py-8">
        {/* Page heading */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease }}
        >
          <h1 className="text-2xl font-semibold text-foreground">
            Transaction Center
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage loans, withdrawals, transfers, and rollovers for your
            retirement plan.
          </p>
        </motion.div>

        {/* Plan Summary */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease, delay: 0.05 }}
          className="mt-6 rounded-2xl border border-border bg-white p-5 shadow-sm dark:bg-card"
        >
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 dark:bg-primary/10">
              <Shield className="size-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                {plan.planName}
              </p>
              <p className="text-xs text-muted-foreground">
                Account {plan.accountNumber}
              </p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div>
              <p className="text-[0.65rem] font-medium uppercase tracking-wider text-muted-foreground">
                Total Balance
              </p>
              <p className="mt-0.5 text-xl font-bold tabular-nums text-foreground">
                {fmt(plan.balance)}
              </p>
            </div>
            <div>
              <p className="text-[0.65rem] font-medium uppercase tracking-wider text-muted-foreground">
                Vested Balance
              </p>
              <p className="mt-0.5 text-xl font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
                {fmt(plan.vestedBalance)}
              </p>
            </div>
            <div>
              <p className="text-[0.65rem] font-medium uppercase tracking-wider text-muted-foreground">
                Vested %
              </p>
              <p className="mt-0.5 text-xl font-bold tabular-nums text-foreground">
                {plan.vestedPct}%
              </p>
            </div>
          </div>
        </motion.div>

        {/* Draft Transactions */}
        {mounted && drafts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease, delay: 0.08 }}
            className="mt-6"
          >
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
              <FileText className="size-4 text-amber-500" />
              Resume Where You Left Off
            </h2>
            <div className="space-y-2">
              {drafts.map((draft) => (
                <div
                  key={draft.id}
                  className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50/50 p-4 dark:border-amber-800 dark:bg-amber-950/20"
                >
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">
                      {draft.label}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Step {draft.step + 1} · {draft.progress}% complete · Last
                      updated{" "}
                      {new Date(draft.updatedAt).toLocaleDateString()}
                    </p>
                    <div className="mt-2 h-1.5 w-40 overflow-hidden rounded-full bg-amber-200 dark:bg-amber-800">
                      <div
                        className="h-full rounded-full bg-amber-500 transition-all"
                        style={{ width: `${draft.progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => deleteDraft(draft.id)}
                      className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/50"
                      aria-label="Delete draft"
                    >
                      <Trash2 className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleResume(draft.id, draft.type)}
                      className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-amber-600 px-3 text-xs font-semibold text-white transition hover:bg-amber-700"
                    >
                      Resume
                      <ArrowRight className="size-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease, delay: 0.1 }}
          className="mt-6"
        >
          <h2 className="mb-3 text-sm font-semibold text-foreground">
            What would you like to do?
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {QUICK_ACTIONS.map((action, i) => {
              const Icon = action.icon;
              return (
                <motion.button
                  key={action.type}
                  type="button"
                  onClick={() => handleStartFlow(action)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    ease,
                    delay: 0.12 + i * 0.05,
                  }}
                  whileHover={{ y: -2, transition: { duration: 0.15 } }}
                  className={cn(
                    "group flex items-start gap-4 rounded-2xl border-2 p-5 text-left transition-shadow hover:shadow-lg",
                    action.borderColor,
                    "bg-white dark:bg-card",
                  )}
                >
                  <div
                    className={cn(
                      "flex size-11 shrink-0 items-center justify-center rounded-xl",
                      action.bgColor,
                    )}
                  >
                    <Icon className={cn("size-5", action.color)} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-foreground">
                        {action.title}
                      </h3>
                      <ArrowUpRight className="size-4 text-muted-foreground opacity-0 transition group-hover:opacity-100" />
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {action.description}
                    </p>
                    <p className="mt-2 flex items-center gap-1 text-[0.68rem] text-muted-foreground">
                      <CreditCard className="size-3" />
                      {action.meta}
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Two-column: Attention + Recent */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-5">
          {/* Attention Required */}
          {MOCK_ATTENTION.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease, delay: 0.2 }}
              className="lg:col-span-2"
            >
              <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                <AlertTriangle className="size-4 text-red-500" />
                Attention Required
                <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-600 dark:bg-red-900/30 dark:text-red-400">
                  {MOCK_ATTENTION.length}
                </span>
              </h2>
              <div className="space-y-2">
                {MOCK_ATTENTION.map((item) => {
                  const style = STATUS_STYLES[item.status];
                  const StatusIcon = style.icon;
                  return (
                    <div
                      key={item.id}
                      className={cn(
                        "rounded-xl border p-4",
                        item.status === "action-required"
                          ? "border-red-200 dark:border-red-800"
                          : "border-amber-200 dark:border-amber-800",
                        style.bg,
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <StatusIcon
                          className={cn("mt-0.5 size-4 shrink-0", style.text)}
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold text-foreground">
                              {item.title}
                            </p>
                            <span className="text-sm font-bold tabular-nums text-foreground">
                              {item.amount}
                            </span>
                          </div>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {item.description}
                          </p>
                          <div className="mt-2 flex items-center gap-2">
                            <span
                              className={cn(
                                "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase",
                                style.bg,
                                style.text,
                              )}
                            >
                              {item.statusLabel}
                            </span>
                            <button
                              type="button"
                              className="text-xs font-semibold text-primary hover:underline dark:text-primary"
                            >
                              Resolve →
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Recent Transactions */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease, delay: 0.25 }}
            className="lg:col-span-3"
          >
            <h2 className="mb-3 text-sm font-semibold text-foreground">
              Recent Transactions
            </h2>

            {/* Filter tabs */}
            <div className="mb-3 flex gap-1">
              {(
                [
                  "all",
                  "loan",
                  "withdraw",
                  "transfer",
                  "rollover",
                ] as RecentFilter[]
              ).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setRecentFilter(f)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition",
                    recentFilter === f
                      ? "bg-primary/10 text-primary dark:bg-primary/10 dark:text-primary"
                      : "text-muted-foreground hover:bg-muted",
                  )}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm dark:bg-card">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-slate-50 dark:bg-slate-900/30">
                    <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                      Description
                    </th>
                    <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                      Type
                    </th>
                    <th className="px-4 py-2.5 text-right font-medium text-muted-foreground">
                      Amount
                    </th>
                    <th className="px-4 py-2.5 text-center font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="px-4 py-2.5 text-right font-medium text-muted-foreground">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredRecent.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-8 text-center text-sm text-muted-foreground"
                      >
                        No transactions found
                      </td>
                    </tr>
                  ) : (
                    filteredRecent.map((txn) => {
                      const statusStyle = RECENT_STATUS_STYLES[txn.status];
                      const StatusIcon = statusStyle.icon;
                      return (
                        <tr
                          key={txn.id}
                          className={cn(
                            "transition hover:bg-slate-50 dark:hover:bg-slate-900/20",
                            onRecentRowClick && "cursor-pointer",
                          )}
                          onClick={() => onRecentRowClick?.(txn.id)}
                          onKeyDown={(e) => {
                            if (onRecentRowClick && (e.key === "Enter" || e.key === " ")) {
                              e.preventDefault();
                              onRecentRowClick(txn.id);
                            }
                          }}
                          tabIndex={onRecentRowClick ? 0 : undefined}
                          role={onRecentRowClick ? "button" : undefined}
                        >
                          <td className="px-4 py-3">
                            <p className="font-medium text-foreground">
                              {txn.description}
                            </p>
                          </td>
                          <td className="px-4 py-3">
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                              {txn.type}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right font-semibold tabular-nums text-foreground">
                            {txn.amount}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span
                              className={cn(
                                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold capitalize",
                                statusStyle.bg,
                                statusStyle.text,
                              )}
                            >
                              <StatusIcon className="size-3" />
                              {txn.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                            {new Date(txn.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
