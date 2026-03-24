import { useState, useRef, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import * as Dialog from "@radix-ui/react-dialog";
import { AddInvestmentModal } from "./AddInvestmentModal";
import { useInvestment } from "@/context/InvestmentContext";
import { getFundById } from "@/data/mockFunds";
import { getSourceTotal, isSourceValid } from "@/utils/investmentAllocationHelpers";

export type SourceKey = "preTax" | "roth" | "afterTax";

const SOURCE_LABEL_KEYS: Record<SourceKey, string> = {
  preTax: "enrollment.preTax",
  roth: "enrollment.roth",
  afterTax: "enrollment.afterTax",
};

interface FundAllocationModalProps {
  open: boolean;
  onClose: () => void;
  source: SourceKey;
}

/** Simple SVG sparkline placeholder (mini line chart) */
function SparklinePlaceholder() {
  return (
    <svg width="48" height="20" viewBox="0 0 48 20" className="shrink-0" aria-hidden>
      <polyline
        points="0,14 8,10 16,12 24,6 32,8 40,4 48,8"
        fill="none"
        stroke="var(--enroll-brand)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.7"
      />
    </svg>
  );
}

export const FundAllocationModal = ({ open, onClose, source }: FundAllocationModalProps) => {
  const { t } = useTranslation();
  const {
    getFundsForSource,
    updateSourceAllocation,
    addFundToSource,
    removeFundFromSource,
  } = useInvestment();
  const [showAddFund, setShowAddFund] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const lastAddedFundIdRef = useRef<string | null>(null);

  const funds = getFundsForSource(source);
  const total = getSourceTotal(funds);
  const allocatedFundIds = funds.map((f) => f.fundId);
  const sourceLabel = t(SOURCE_LABEL_KEYS[source]);
  const valid = isSourceValid(funds);

  const handleAddComplete = useCallback((fundId: string) => {
    lastAddedFundIdRef.current = fundId;
  }, []);

  useEffect(() => {
    if (!open) {
      setSearchInput("");
      lastAddedFundIdRef.current = null;
    }
  }, [open]);

  useEffect(() => {
    const fundId = lastAddedFundIdRef.current;
    if (!fundId) return;
    lastAddedFundIdRef.current = null;
    const input = document.querySelector<HTMLInputElement>(`[name="allocation-modal-${fundId}"]`);
    if (input) requestAnimationFrame(() => input.focus());
  }, [funds]);

  return (
    <>
      <Dialog.Root open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
          <Dialog.Content
            className="fixed left-1/2 top-1/2 z-50 flex max-h-[90vh] w-[90vw] max-w-[560px] -translate-x-1/2 -translate-y-1/2 flex-col rounded-xl border shadow-xl focus:outline-none overflow-hidden"
            style={{
              background: "var(--enroll-card-bg)",
              borderColor: "var(--enroll-card-border)",
            }}
            aria-labelledby="fund-allocation-modal-title"
            onEscapeKeyDown={onClose}
            onPointerDownOutside={onClose}
          >
            <header className="shrink-0 flex items-center justify-between gap-4 border-b px-6 py-4" style={{ borderColor: "var(--enroll-card-border)" }}>
              <h2 id="fund-allocation-modal-title" className="text-lg font-bold" style={{ color: "var(--enroll-text-primary)" }}>
                {sourceLabel}
              </h2>
              <Dialog.Close
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors hover:opacity-80"
                style={{ color: "var(--enroll-text-muted)" }}
                aria-label={t("enrollment.close")}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </Dialog.Close>
            </header>

            <div className="min-h-0 flex-1 flex flex-col overflow-hidden">
              {/* Search + Add fund */}
              <div className="shrink-0 px-6 pt-4 flex flex-col sm:flex-row gap-2">
                <input
                  type="search"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder={t("enrollment.searchFunds")}
                  className="flex-1 rounded-lg py-2.5 px-3 text-sm outline-none"
                  style={{
                    background: "var(--enroll-soft-bg)",
                    border: "1px solid var(--enroll-card-border)",
                    color: "var(--enroll-text-primary)",
                  }}
                  aria-label={t("enrollment.searchFunds")}
                />
                <button
                  type="button"
                  onClick={() => setShowAddFund(true)}
                  className="shrink-0 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors"
                  style={{
                    background: "rgb(var(--enroll-brand-rgb) / 0.1)",
                    color: "var(--enroll-brand)",
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M8 3v10M3 8h10" strokeLinecap="round" />
                  </svg>
                  {t("enrollment.addInvestment")}
                </button>
              </div>

              {/* Fund list with allocation */}
              <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4 space-y-3">
                {funds.length === 0 ? (
                  <p className="text-sm py-6 text-center" style={{ color: "var(--enroll-text-muted)" }}>
                    {t("enrollment.noFundsInSource")}
                  </p>
                ) : (
                  funds.map((fa) => {
                    const fund = getFundById(fa.fundId);
                    if (!fund) return null;
                    return (
                      <div
                        key={fa.fundId}
                        className="p-4 rounded-xl"
                        style={{
                          background: "var(--enroll-soft-bg)",
                          border: "1px solid var(--enroll-card-border)",
                        }}
                      >
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div className="min-w-0 flex-1 flex items-center gap-2">
                            <h4 className="text-sm font-semibold truncate" style={{ color: "var(--enroll-text-primary)" }}>
                              {fund.name}
                            </h4>
                            <span
                              className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded shrink-0"
                              style={{ background: "rgb(var(--enroll-brand-rgb) / 0.08)", color: "var(--enroll-brand)" }}
                            >
                              {fund.ticker}
                            </span>
                            <span className="text-[11px] shrink-0" style={{ color: "var(--enroll-text-muted)" }}>
                              {fund.assetClass}
                            </span>
                            <SparklinePlaceholder />
                            <span className="flex items-center gap-0.5 text-[11px]" style={{ color: "var(--enroll-text-muted)" }} aria-label={`Risk ${fund.riskLevel}/10`}>
                              {Array.from({ length: 10 }, (_, i) => (
                                <span
                                  key={i}
                                  className="w-1 h-2 rounded-sm"
                                  style={{
                                    background: i < fund.riskLevel ? "var(--enroll-brand)" : "var(--enroll-card-border)",
                                    opacity: i < fund.riskLevel ? 1 : 0.4,
                                  }}
                                />
                              ))}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFundFromSource(source, fa.fundId)}
                            className="p-1 rounded-md transition-colors hover:opacity-80"
                            style={{ color: "var(--enroll-text-muted)" }}
                            aria-label={t("enrollment.removeFund")}
                          >
                            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                              <path d="M4 4l8 8M12 4l-8 8" />
                            </svg>
                          </button>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 relative">
                            <input
                              type="range"
                              min="0"
                              max="100"
                              step="0.1"
                              value={fa.allocationPercent}
                              onChange={(e) => updateSourceAllocation(source, fa.fundId, parseFloat(e.target.value) || 0)}
                              aria-label={`Allocation ${fund.name}`}
                              className="fund-row-slider w-full"
                              style={{
                                "--slider-pct": `${fa.allocationPercent}%`,
                                "--slider-color": "var(--enroll-brand)",
                              } as React.CSSProperties}
                            />
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <input
                              type="number"
                              name={`allocation-modal-${fund.id}`}
                              value={fa.allocationPercent > 0 ? fa.allocationPercent.toFixed(1) : ""}
                              onChange={(e) => {
                                const v = parseFloat(e.target.value);
                                if (!isNaN(v)) updateSourceAllocation(source, fa.fundId, Math.max(0, Math.min(100, v)));
                              }}
                              min={0}
                              max={100}
                              step={0.1}
                              placeholder="0"
                              className="w-16 text-right text-sm font-semibold py-1.5 px-2 rounded-lg outline-none"
                              style={{
                                background: "var(--enroll-card-bg)",
                                border: "1px solid var(--enroll-card-border)",
                                color: "var(--enroll-text-primary)",
                              }}
                            />
                            <span className="text-xs font-semibold" style={{ color: "var(--enroll-text-muted)" }}>%</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Total + validation */}
              <div
                className="shrink-0 flex items-center justify-between gap-4 px-6 py-4 border-t"
                style={{
                  borderColor: "var(--enroll-card-border)",
                  background: valid ? "rgb(var(--enroll-accent-rgb) / 0.06)" : "rgb(var(--color-warning-rgb) / 0.06)",
                }}
              >
                <span className="text-sm font-semibold" style={{ color: "var(--enroll-text-secondary)" }}>
                  {t("enrollment.totalAllocation")}: {total.toFixed(1)}%
                </span>
                {!valid && (
                  <span className="text-xs font-semibold" style={{ color: "var(--color-warning)" }}>
                    {t("enrollment.eachSourceMustTotal100")}
                  </span>
                )}
              </div>

              <footer className="shrink-0 flex justify-end gap-2 px-6 py-4 border-t" style={{ borderColor: "var(--enroll-card-border)" }}>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    background: "var(--enroll-soft-bg)",
                    color: "var(--enroll-text-primary)",
                    border: "1px solid var(--enroll-card-border)",
                  }}
                >
                  {t("enrollment.cancel")}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-lg text-sm font-semibold text-white transition-colors"
                  style={{ background: "var(--enroll-brand)" }}
                >
                  {t("enrollment.save")}
                </button>
              </footer>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <AddInvestmentModal
        open={showAddFund}
        onClose={() => setShowAddFund(false)}
        activeTaxSource={source}
        existingFundIds={allocatedFundIds}
        onAdd={(fundId) => addFundToSource(source, fundId)}
        onAddComplete={handleAddComplete}
      />
    </>
  );
};
