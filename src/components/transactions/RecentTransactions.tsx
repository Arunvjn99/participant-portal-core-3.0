import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { transactionStore } from "../../data/transactionStore";
import type { Transaction, TransactionType } from "../../types/transactions";

const formatCurrency = (amount: number, negative = false) => {
  const value = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(amount));
  return negative ? `-${value}` : `+${value}`;
};

const getDisplayName = (t: Transaction): string =>
  t.displayName ||
  (t.type === "loan"
    ? "Loan Repayment"
    : t.type === "withdrawal"
      ? "Withdrawal"
      : t.type === "distribution"
        ? "Dividend Credit"
        : t.type === "rollover"
          ? "Rollover"
          : t.type === "transfer"
            ? "Transfer"
            : "Rebalance");

const getAccountType = (t: Transaction): string =>
  t.accountType || "Traditional 401(k)";

const getIcon = (type: TransactionType): { bg: string; icon: React.ReactNode } => {
  const base = "flex h-9 w-9 items-center justify-center rounded-lg text-white";
  switch (type) {
    case "loan":
      return {
        bg: "bg-amber-500",
        icon: (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
      };
    case "distribution":
      return {
        bg: "bg-emerald-500",
        icon: (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
      };
    case "withdrawal":
      return {
        bg: "bg-blue-500",
        icon: (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        ),
      };
    case "rollover":
      return {
        bg: "bg-violet-500",
        icon: (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        ),
      };
    case "transfer":
    case "rebalance":
      return {
        bg: "bg-sky-500",
        icon: (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        ),
      };
    default:
      return {
        bg: "bg-slate-500",
        icon: (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V7a2 2 0 012-2z" />
          </svg>
        ),
      };
  }
};

const listItem = {
  hidden: { opacity: 0, y: 8 },
  visible: (reduced: boolean) => ({
    opacity: 1,
    y: 0,
    transition: { duration: reduced ? 0 : 0.2, ease: "easeOut" },
  }),
};

interface RecentTransactionsProps {
  onTransactionAction?: (transaction: Transaction) => void;
}

/**
 * Recent Transactions - list with search, sort, category filter (Figma 613-2059)
 */
export const RecentTransactions = ({ onTransactionAction }: RecentTransactionsProps) => {
  const navigate = useNavigate();
  const reduced = !!useReducedMotion();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "amount">("date");
  const [category, setCategory] = useState<TransactionType | "all">("all");

  const transactions = useMemo(() => {
    let list = transactionStore.getAllTransactions();
    if (category !== "all") list = list.filter((t) => t.type === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          getDisplayName(t).toLowerCase().includes(q) ||
          getAccountType(t).toLowerCase().includes(q) ||
          String(t.amount).includes(q)
      );
    }
    list = [...list].sort((a, b) => {
      if (sortBy === "date")
        return new Date(b.dateInitiated).getTime() - new Date(a.dateInitiated).getTime();
      return b.amount - a.amount;
    });
    return list;
  }, [search, sortBy, category]);

  const handleRowClick = (t: Transaction) => {
    if (onTransactionAction) onTransactionAction(t);
    else navigate(`/transactions/${t.id}`);
  };

  return (
    <section id="recent-transactions">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Recent Transactions
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Your latest account activity
          </p>
        </div>
        <a
          href="#recent-transactions"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById("recent-transactions")?.scrollIntoView({ behavior: "smooth" });
          }}
          className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          See all
        </a>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="search"
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
          />
        </div>
        <div className="flex gap-2">
          <select
            aria-label="Sort by"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "date" | "amount")}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="date">Sort by Date</option>
            <option value="amount">Sort by Amount</option>
          </select>
          <select
            aria-label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value as TransactionType | "all")}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="all">Category: All</option>
            <option value="loan">Loan</option>
            <option value="withdrawal">Withdrawal</option>
            <option value="distribution">Distribution</option>
            <option value="rollover">Rollover</option>
            <option value="transfer">Transfer</option>
            <option value="rebalance">Rebalance</option>
          </select>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <ul className="divide-y divide-slate-200 dark:divide-slate-700">
          {transactions.length === 0 ? (
            <li className="px-4 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
              No transactions match your filters.
            </li>
          ) : (
            transactions.map((t, i) => {
              const isNegative = t.amountNegative ?? (t.type === "loan" || t.type === "withdrawal");
              const { bg, icon } = getIcon(t.type);
              return (
                <motion.li
                  key={t.id}
                  variants={listItem}
                  initial="hidden"
                  animate="visible"
                  custom={reduced}
                  transition={{ delay: reduced ? 0 : i * 0.03 }}
                  className="flex cursor-pointer items-center gap-4 px-4 py-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50"
                  onClick={() => handleRowClick(t)}
                >
                  <span className={`shrink-0 rounded-lg ${bg}`}>{icon}</span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-slate-900 dark:text-white">
                      {getDisplayName(t)}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {new Date(t.dateInitiated).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-semibold ${
                        isNegative
                          ? "text-red-600 dark:text-red-400"
                          : "text-emerald-600 dark:text-emerald-400"
                      }`}
                    >
                      {formatCurrency(t.amount, isNegative)}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {getAccountType(t)}
                    </p>
                  </div>
                </motion.li>
              );
            })
          )}
        </ul>
      </div>
    </section>
  );
};
