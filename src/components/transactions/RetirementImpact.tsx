import type { RetirementImpactLevel } from "../../types/transactions";

interface RetirementImpactProps {
  level: RetirementImpactLevel;
  rationale: string;
}

/**
 * Retirement impact panel — uses enrollment/transaction tokens only (no DashboardCard slate).
 * Matches TransactionStepCard elevation and border for UI consistency.
 */
export const RetirementImpact = ({ level, rationale }: RetirementImpactProps) => {
  const getLevelLabel = (level: RetirementImpactLevel): string => {
    switch (level) {
      case "low":
        return "Low Impact";
      case "medium":
        return "Medium Impact";
      case "high":
        return "High Impact";
    }
  };

  const getLevelClass = (level: RetirementImpactLevel): string => {
    return `retirement-impact--${level}`;
  };

  return (
    <article
      className="overflow-hidden rounded-[var(--enroll-card-radius)] border p-4 sm:p-6 md:p-8 transition-shadow"
      style={{
        background: "var(--enroll-card-bg)",
        borderColor: "var(--enroll-card-border)",
        boxShadow: "var(--enroll-elevation-2)",
      }}
    >
      <h3 className="mb-4 text-lg font-semibold" style={{ color: "var(--enroll-text-primary)" }}>
        Retirement Impact
      </h3>
      <div className={`retirement-impact ${getLevelClass(level)}`} style={{ color: "var(--enroll-text-secondary)" }}>
        <div className="retirement-impact__level">
          <span className="retirement-impact__label">{getLevelLabel(level)}</span>
        </div>
        <p className="retirement-impact__rationale">{rationale}</p>
      </div>
    </article>
  );
};
