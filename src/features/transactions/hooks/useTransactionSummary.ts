import { useMemo } from "react";
import { transactionStore } from "../../../data/transactionStore";
import { ACCOUNT_OVERVIEW } from "../../../data/accountOverview";
import type { MonthlySummaryRow } from "../types";

export interface ChartDataPoint {
  month: string;
  value: number;
  inflow?: number;
  outflow?: number;
  balance?: number;
}

export interface TransactionSummary {
  totalBalance: number;
  ytdReturnPercent: number;
  netFlowThisMonth: number;
  contributionsYtd: number;
  withdrawalsYtd: number;
  monthlyBreakdown: MonthlySummaryRow[];
  chartData: ChartDataPoint[];
  /** For ComposedChart: inflow, outflow, balance per month */
  momentumChartData?: { month: string; inflow: number; outflow: number; balance: number }[];
}

/**
 * Memoized transaction and account summary for Activity Hero & Monthly Summary.
 */
export function useTransactionSummary(planId: string | null): TransactionSummary {
  return useMemo(() => {
    const all = transactionStore.getAllTransactions();
    const filtered =
      planId && planId !== "all"
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

    filtered.forEach((t) => {
      const d = new Date(t.dateInitiated);
      if (d.getMonth() !== thisMonth || d.getFullYear() !== thisYear) return;
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

    // Mock some contributions/dividends for demo when none this month
    if (contributions === 0 && filtered.length === 0) {
      contributions = Math.round(ACCOUNT_OVERVIEW.ytdContribution / 12);
    }
    if (dividends === 0) {
      dividends = Math.round((ACCOUNT_OVERVIEW.totalBalance * 0.002));
    }

    const netFlow = contributions + dividends - fees - loanPayments - withdrawals;
    const total = contributions + dividends + Math.abs(fees) + loanPayments + Math.abs(withdrawals) || 1;

    // YTD totals
    let contributionsYtd = 0;
    let withdrawalsYtd = 0;
    filtered.forEach((t) => {
      const d = new Date(t.dateInitiated);
      if (d.getFullYear() !== thisYear) return;
      if (t.type === "rollover" || t.type === "transfer") contributionsYtd += t.amount ?? 0;
      if (t.type === "withdrawal" || t.type === "distribution") withdrawalsYtd += t.netAmount ?? t.amount ?? 0;
    });
    if (contributionsYtd === 0) contributionsYtd = Math.round(ACCOUNT_OVERVIEW.ytdContribution);
    if (withdrawalsYtd === 0 && filtered.length > 0) {
      const w = filtered.find((t) => t.type === "withdrawal" || t.type === "distribution");
      if (w) withdrawalsYtd = w.netAmount ?? w.amount ?? 0;
    }

    const monthlyBreakdown: MonthlySummaryRow[] = [
      { label: "Contributions", amount: contributions, pct: (contributions / total) * 100 },
      { label: "Dividends", amount: dividends, pct: (dividends / total) * 100 },
      { label: "Fees", amount: -fees, pct: total ? (fees / total) * 100 : 0 },
      { label: "Loan payments", amount: -loanPayments, pct: total ? (loanPayments / total) * 100 : 0 },
      { label: "Net growth impact", amount: netFlow },
    ];

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const chartData: { month: string; value: number }[] = Array.from({ length: 6 }, (_, i) => {
      const monthIndex = (thisMonth - 5 + i + 12) % 12;
      const base = ACCOUNT_OVERVIEW.totalBalance * (0.92 + (i / 6) * 0.08);
      return {
        month: months[monthIndex],
        value: Math.round(base + (i - 2) * 800),
      };
    });

    // Momentum chart: inflow, outflow, balance (for ComposedChart)
    const momentumChartData = chartData.map((d, i) => {
      const isLast = i === chartData.length - 1;
      const baseInflow = 1200;
      const baseOutflow = 200;
      const inflow = isLast ? baseInflow + Math.max(0, netFlow) : baseInflow + (i % 3) * 100;
      const outflow = isLast ? baseOutflow + Math.max(0, -netFlow) : baseOutflow;
      return {
        month: d.month,
        inflow,
        outflow,
        balance: d.value,
      };
    });

    return {
      totalBalance: ACCOUNT_OVERVIEW.totalBalance,
      ytdReturnPercent: ACCOUNT_OVERVIEW.ytdPercent,
      netFlowThisMonth: netFlow,
      contributionsYtd,
      withdrawalsYtd,
      monthlyBreakdown,
      chartData,
      momentumChartData,
    };
  }, [planId]);
}
