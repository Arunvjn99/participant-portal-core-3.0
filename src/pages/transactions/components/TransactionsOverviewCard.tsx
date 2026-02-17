import { memo } from "react";
import { ActivityHero } from "../../../features/transactions/components/ActivityHero";

interface TransactionsOverviewCardProps {
  totalBalance: number;
  ytdReturnPercent: number;
  netFlowThisMonth: number;
  contributionsYtd: number;
  withdrawalsYtd: number;
  chartData: { month: string; value: number }[];
  momentumChartData?: { month: string; inflow: number; outflow: number; balance: number }[];
}

/**
 * Overview card for Transactions screen: hero metrics and 6-month trend.
 * Reuses ActivityHero; styling via global tokens only.
 */
export const TransactionsOverviewCard = memo(function TransactionsOverviewCard(
  props: TransactionsOverviewCardProps
) {
  return <ActivityHero {...props} />;
});
