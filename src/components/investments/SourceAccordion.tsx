import { useState, useEffect, useRef } from "react";
import { DashboardCard } from "../dashboard/DashboardCard";
import { FundAllocationRow } from "./FundAllocationRow";
import { AddInvestmentModal } from "./AddInvestmentModal";
import { useInvestment } from "@/context/InvestmentContext";
import { getFundById } from "@/data/mockFunds";
import { getSourceTotal, isSourceValid } from "@/utils/investmentAllocationHelpers";
type SourceKey = "preTax" | "roth" | "afterTax";

const SOURCE_LABELS: Record<SourceKey, string> = {
  preTax: "Pre-tax",
  roth: "Roth",
  afterTax: "After-tax",
};

interface SourceAccordionProps {
  source: SourceKey;
  embedded?: boolean;
  defaultExpanded?: boolean;
}

/**
 * Per-source accordion - Pre-tax, Roth, or After-tax.
 * Figma 293-840: expandable sections with fund list, Add Investment, Total Allocation.
 */
export const SourceAccordion = ({ source, embedded, defaultExpanded = false }: SourceAccordionProps) => {
  const {
    getFundsForSource,
    updateSourceAllocation,
    addFundToSource,
    removeFundFromSource,
    editAllocationEnabled,
  } = useInvestment();
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [showFundSearch, setShowFundSearch] = useState(false);
  const lastAddedFundIdRef = useRef<string | null>(null);

  const funds = getFundsForSource(source);
  const total = getSourceTotal(funds);
  const isValid = isSourceValid(funds);
  const allocatedFundIds = funds.map((f) => f.fundId);

  const handleAddComplete = (fundId: string) => {
    lastAddedFundIdRef.current = fundId;
  };

  useEffect(() => {
    const fundId = lastAddedFundIdRef.current;
    if (!fundId) return;
    lastAddedFundIdRef.current = null;
    const input = document.querySelector<HTMLInputElement>(
      `[name="allocation-${fundId}"]`
    );
    if (input) {
      requestAnimationFrame(() => {
        input.focus();
      });
    }
  }, [funds]);

  const content = (
    <div className="source-accordion">
      <button
        type="button"
        className="source-accordion__trigger"
        onClick={() => setIsExpanded((x) => !x)}
        aria-expanded={isExpanded}
      >
        <span className="source-accordion__title">{SOURCE_LABELS[source]}</span>
        <span className="source-accordion__meta">{funds.length} funds</span>
        <span
          className={`source-accordion__total ${
            isValid ? "" : "source-accordion__total--invalid"
          }`}
        >
          {total.toFixed(1)}%
        </span>
        <span className="source-accordion__chevron" aria-hidden="true">
          {isExpanded ? "▲" : "▼"}
        </span>
      </button>
      <div
        className={`source-accordion__content ${
          isExpanded ? "source-accordion__content--expanded" : ""
        }`}
      >
        <p className="source-accordion__description">
          Allocate your {SOURCE_LABELS[source].toLowerCase()} contributions. Total must equal 100%.
        </p>
        {editAllocationEnabled && (
          <div className="source-accordion__actions source-accordion__actions--top">
            <button
              type="button"
              className="source-accordion__add-btn source-accordion__add-btn--primary source-accordion__add-btn--with-icon"
              onClick={() => setShowFundSearch(true)}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M8 3v10M3 8h10" strokeLinecap="round" />
              </svg>
              <span>Add Investment</span>
            </button>
          </div>
        )}
        <div className="source-accordion__funds">
          {funds.map((fa) => {
            const fund = getFundById(fa.fundId);
            if (!fund) return null;
            return (
              <div key={fa.fundId} className="source-accordion__fund-card">
                <FundAllocationRow
                  fund={fund}
                  allocation={{ fundId: fa.fundId, percentage: fa.allocationPercent }}
                  disabled={!editAllocationEnabled}
                  onAllocationChange={(pct) =>
                    updateSourceAllocation(source, fa.fundId, pct)
                  }
                  onRemove={
                    editAllocationEnabled
                      ? () => removeFundFromSource(source, fa.fundId)
                      : undefined
                  }
                />
              </div>
            );
          })}
        </div>
        <div className={`source-accordion__total-line ${isValid ? "" : "source-accordion__total-line--invalid"}`}>
          <span className="source-accordion__total-label">Total Allocation:</span>
          <span className="source-accordion__total-value">{total.toFixed(1)}%</span>
        </div>
        {isValid ? (
          <div className="source-accordion__success" role="status">
            <span className="source-accordion__success-icon">✓</span>
            <span>Perfect! Your allocation is complete.</span>
          </div>
        ) : (
          <p className="source-accordion__error" role="alert">
            Allocation must total exactly 100%
          </p>
        )}
      </div>
    </div>
  );

  if (embedded) {
    return (
      <>
        {content}
        <AddInvestmentModal
          open={showFundSearch}
          onClose={() => setShowFundSearch(false)}
          activeTaxSource={source}
          existingFundIds={allocatedFundIds}
          onAdd={(fundId) => addFundToSource(source, fundId)}
          onAddComplete={handleAddComplete}
        />
      </>
    );
  }
  return (
    <DashboardCard>
      {content}
      <AddInvestmentModal
        open={showFundSearch}
        onClose={() => setShowFundSearch(false)}
        activeTaxSource={source}
        existingFundIds={allocatedFundIds}
        onAdd={(fundId) => addFundToSource(source, fundId)}
        onAddComplete={handleAddComplete}
      />
    </DashboardCard>
  );
};
