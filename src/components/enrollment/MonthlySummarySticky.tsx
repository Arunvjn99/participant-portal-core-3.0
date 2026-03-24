import { DashboardCard } from "../dashboard/DashboardCard";
import type { MonthlyContribution } from "@/enrollment/logic/types";

interface MonthlySummaryStickyProps {
  monthlyContribution: MonthlyContribution;
}

/**
 * MonthlySummarySticky - Sticky/highlighted card showing monthly contribution summary
 */
export const MonthlySummarySticky = ({ monthlyContribution }: MonthlySummaryStickyProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <DashboardCard className="monthly-summary-sticky">
      <div className="monthly-summary-sticky__content">
        <h3 className="monthly-summary-sticky__title">Monthly Summary</h3>
        <div className="monthly-summary-sticky__breakdown">
          <div className="monthly-summary-sticky__item">
            <span className="monthly-summary-sticky__label">Your monthly contribution</span>
            <span className="monthly-summary-sticky__value">{formatCurrency(monthlyContribution.employee)}</span>
          </div>
          {monthlyContribution.employer > 0 && (
            <div className="monthly-summary-sticky__item">
              <span className="monthly-summary-sticky__label">Employer contribution</span>
              <span className="monthly-summary-sticky__value">{formatCurrency(monthlyContribution.employer)}</span>
            </div>
          )}
          <div className="monthly-summary-sticky__item monthly-summary-sticky__item--total">
            <span className="monthly-summary-sticky__label">Total monthly investment</span>
            <span className="monthly-summary-sticky__value">{formatCurrency(monthlyContribution.total)}</span>
          </div>
        </div>
      </div>
    </DashboardCard>
  );
};
