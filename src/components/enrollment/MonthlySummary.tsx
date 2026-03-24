import { DashboardCard } from "../dashboard/DashboardCard";
import type { MonthlyContribution } from "@/enrollment/logic/types";

interface MonthlySummaryProps {
  monthlyContribution: MonthlyContribution;
}

export const MonthlySummary = ({ monthlyContribution }: MonthlySummaryProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <DashboardCard>
      <div className="monthly-summary">
        <h3 className="monthly-summary__title">Monthly Contribution</h3>
        <div className="monthly-summary__breakdown">
          <div className="monthly-summary__item">
            <span className="monthly-summary__label">Your Contribution</span>
            <span className="monthly-summary__value">{formatCurrency(monthlyContribution.employee)}</span>
          </div>
          {monthlyContribution.employer > 0 && (
            <div className="monthly-summary__item">
              <span className="monthly-summary__label">Employer Match</span>
              <span className="monthly-summary__value">{formatCurrency(monthlyContribution.employer)}</span>
            </div>
          )}
          <div className="monthly-summary__item monthly-summary__item--total">
            <span className="monthly-summary__label">Total Monthly</span>
            <span className="monthly-summary__value">{formatCurrency(monthlyContribution.total)}</span>
          </div>
        </div>
      </div>
    </DashboardCard>
  );
};
