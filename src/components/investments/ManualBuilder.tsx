import { SourceAccordion } from "./SourceAccordion";
import { PlanDefaultPortfolioCard } from "./PlanDefaultPortfolioCard";
import { DashboardCard } from "../dashboard/DashboardCard";
import { useInvestment } from "../../context/InvestmentContext";

/** Lock icon for edit toggle — Figma 293-840 */
const LockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <rect x="4" y="8" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="2" />
    <path d="M6 8V5a4 4 0 118 0v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

/**
 * ManualBuilder - Per Figma 293-840: FUND ALLOCATION with edit toggle inside card section, accordions.
 */
export const ManualBuilder = () => {
  const {
    activeSources,
    editAllocationEnabled,
    setEditAllocationEnabled,
    hasPreTaxOrRoth,
    hasAfterTax,
    canConfirmAllocation,
  } = useInvestment();

  if (!hasPreTaxOrRoth && !hasAfterTax) {
    return null;
  }

  return (
    <div className="manual-builder">
      <PlanDefaultPortfolioCard />

      <div className="manual-builder__allocation-section">
        <h3 className="manual-builder__allocation-title">FUND ALLOCATION</h3>

        {/* Edit toggle inside its own card section — Figma 293-840 */}
        <DashboardCard className="manual-builder__edit-toggle-card">
          <div className="manual-builder__edit-toggle">
            <div className="manual-builder__edit-toggle-row">
              <span className="manual-builder__edit-toggle-icon" aria-hidden="true">
                <LockIcon />
              </span>
              <label className="manual-builder__edit-toggle-label">
                <span className="manual-builder__edit-toggle-text">Edit allocation</span>
                <div className="manual-builder__edit-toggle-switch">
                  <input
                    type="checkbox"
                    checked={editAllocationEnabled}
                    onChange={(e) => setEditAllocationEnabled(e.target.checked)}
                    className="manual-builder__edit-toggle-input"
                    role="switch"
                  />
                  <span className="manual-builder__edit-toggle-track" />
                  <span className="manual-builder__edit-toggle-thumb" />
                </div>
              </label>
            </div>
            <p className="manual-builder__edit-toggle-desc">
              Enable to customize recommended allocations and add investments
            </p>
          </div>
        </DashboardCard>

        {activeSources.map((source, index) => (
          <SourceAccordion key={source} source={source} defaultExpanded={index === 0} />
        ))}

        {canConfirmAllocation && (
          <div className="manual-builder__success-banner" role="status">
            <span className="manual-builder__success-icon">✓</span>
            <span>Total Allocation: 100% Perfect! Your allocation is complete.</span>
          </div>
        )}
      </div>
    </div>
  );
};
