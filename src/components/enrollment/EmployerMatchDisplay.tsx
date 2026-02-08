import { DashboardCard } from "../dashboard/DashboardCard";

interface EmployerMatchDisplayProps {
  monthlyMatch: number;
  matchCap: number;
}

/**
 * EmployerMatchDisplay - Figma-aligned employer match section
 */
export const EmployerMatchDisplay = ({ monthlyMatch, matchCap }: EmployerMatchDisplayProps) => {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number.isFinite(amount) && amount >= 0 ? amount : 0);

  return (
    <DashboardCard>
      <div className="employer-match-display">
        <h2 className="employer-match-display__title">Employer Match</h2>
        <p className="employer-match-display__instruction">
          Your employer will match 100% of the first {matchCap}% you contribute.
        </p>
        <p className="employer-match-display__amount-text">
          This adds an additional {formatCurrency(monthlyMatch)} to your contribution each month.
        </p>
      </div>
    </DashboardCard>
  );
};
