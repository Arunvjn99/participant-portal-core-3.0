import { useMemo } from "react";
import { transactionStore } from "../../../data/transactionStore";
import { ACCOUNT_OVERVIEW } from "../../../data/accountOverview";
import type { MonthlySummaryRow } from "../types";

export interface TransactionSummary {
  totalBalance: number;
  ytdReturnPercent: number;
  netFlowThisMonth: number;
  /** Total contributions this year (YTD) */
  totalContributionsThisYear: number;
  /** Total withdrawals this year (YTD) */
  withdrawalsThisYear: number;
  monthlyBreakdown: MonthlySummaryRow[];
  chartData: { month: string; value: number }[];
}

/**
 * Memoized transaction and account summary for Activity Hero & Monthly Summary.
 */
export function useTransactionSummary(planId: string | null): TransactionSummary {
  return useMemo(() => {
    const all = transactionStore.getAllTransactions();
    const filtered = planId
      ? all.filter((t) => (t as { planId?: string }).planId === planId)
      : all;

    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();

    let contributions = 0;
    let dividends = 0;
    let fees = 0;
    let loanPayments = 0;
    let withdrawals = 0;
    let ytdContributions = 0;
    let ytdWithdrawals = 0;

    filtered.forEach((t) => {
      const d = new Date(t.dateInitiated);
      const sameYear = d.getFullYear() === thisYear;
      const sameMonth = d.getMonth() === thisMonth && sameYear;
      if (sameYear) {
        if (t.type === "withdrawal" || t.type === "distribution") {
          ytdWithdrawals += t.netAmount ?? t.amount ?? 0;
        } else if (t.type === "rollover" || t.type === "transfer" || t.type === "loan") {
          if (t.type === "loan") ytdContributions += 0;
          else ytdContributions += t.amount ?? 0;
        }
      }
      if (!sameMonth) return;
      switch (t.type) {
        case "loan":
          loanPayments += t.amount ?? 0;
          break;
        case "withdrawal":
        case "distribution":
          withdrawals += t.netAmount ?? t.amount ?? 0;
          break;
        case "rollover":
        case "transfer":
          contributions += t.amount ?? 0;
          break;
        default:
          break;
      }
      if (t.fees) fees += t.fees;
    });

    if (ytdContributions === 0) ytdContributions = ACCOUNT_OVERVIEW.ytdContribution;
    // Mock some contributions/dividends for demo when none this month
    if (contributions === 0 && filtered.length === 0) {
      contributions = Math.round(ACCOUNT_OVERVIEW.ytdContribution / 12);
    }
    if (dividends === 0) {
      dividends = Math.round((ACCOUNT_OVERVIEW.totalBalance * 0.002));
    }

    const netFlow = contributions + dividends - fees - loanPayments - withdrawals;
    const total = contributions + dividends + Math.abs(fees) + loanPayments + Math.abs(withdrawals) || 1;

    const monthlyBreakdown: MonthlySummaryRow[] = [
      { label: "Contributions", amount: contributions, pct: (contributions / total) * 100 },
      { label: "Dividends", amount: dividends, pct: (dividends / total) * 100 },
      { label: "Fees", amount: -fees, pct: total ? (fees / total) * 100 : 0 },
      { label: "Loan payments", amount: -loanPayments, pct: total ? (loanPayments / total) * 100 : 0 },
      { label: "Net growth impact", amount: netFlow },
    ];

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const chartData = Array.from({ length: 6 }, (_, i) => {
      const monthIndex = (thisMonth - 5 + i + 12) % 12;
      const year = thisMonth - 5 + i < 0 ? thisYear - 1 : thisYear;
      const base = ACCOUNT_OVERVIEW.totalBalance * (0.92 + (i / 6) * 0.08);
      return {
        month: months[monthIndex],
        value: Math.round(base + (i - 2) * 800),
      };
    });

    return {
      totalBalance: ACCOUNT_OVERVIEW.totalBalance,
      ytdReturnPercent: ACCOUNT_OVERVIEW.ytdPercent,
      netFlowThisMonth: netFlow,
      totalContributionsThisYear: ytdContributions,
      withdrawalsThisYear: ytdWithdrawals,
      monthlyBreakdown,
      chartData,
    };
  }, [planId]);
}
