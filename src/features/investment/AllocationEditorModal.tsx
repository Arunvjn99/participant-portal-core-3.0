import { useState, useCallback, useEffect } from "react";
import { Modal } from "../../components/ui/Modal";
import { FundAllocationRow } from "./FundAllocationRow";
import { FundSearchInput } from "./FundSearchInput";
import type { Fund, PortfolioSource } from "./types";

const DEFAULT_PRETAX_FUNDS: Fund[] = [
  { id: "1", name: "S&P 500 Index Fund", ticker: "SP500", category: "US Large Cap", allocation: 35 },
  { id: "2", name: "Small Cap Value Fund", ticker: "SCV", category: "US Small Cap", allocation: 25 },
  { id: "3", name: "Emerging Markets Fund", ticker: "EM", category: "International", allocation: 25 },
  { id: "4", name: "Mid Cap Growth Fund", ticker: "MCG", category: "US Mid Cap", allocation: 15 },
];

const SOURCE_TITLES: Record<PortfolioSource, string> = {
  pretax: "Pre-tax",
  roth: "Roth",
  aftertax: "After-tax",
};

function nextId(funds: Fund[]): string {
  const max = funds.reduce((m, f) => {
    const n = parseInt(f.id, 10);
    return Number.isNaN(n) ? m : Math.max(m, n);
  }, 0);
  return String(max + 1);
}

export interface AllocationEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Which source is being edited (determines title and which bucket to update on save) */
  source: PortfolioSource;
  /** Initial funds for this source when opening */
  initialFunds: Fund[];
  /** Called when user saves; receives funds for this source */
  onSave: (source: PortfolioSource, funds: Fund[]) => void;
}

/**
 * Portfolio builder modal. Per-source fund allocation; total must equal 100% to enable Save.
 * Search input + Add Investments to add new fund rows.
 */
export function AllocationEditorModal({
  isOpen,
  onClose,
  source,
  initialFunds,
  onSave,
}: AllocationEditorModalProps) {
  const [funds, setFunds] = useState<Fund[]>(initialFunds);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (isOpen) {
      setFunds(initialFunds);
      setSearchQuery("");
    }
  }, [isOpen, source, initialFunds]);

  const total = funds.reduce((sum, f) => sum + f.allocation, 0);
  const isValid = Math.abs(total - 100) < 0.01;

  const updateAllocation = useCallback((id: string, allocation: number) => {
    setFunds((prev) =>
      prev.map((f) => (f.id === id ? { ...f, allocation } : f))
    );
  }, []);

  const removeFund = useCallback((id: string) => {
    setFunds((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const addFund = useCallback(() => {
    const id = nextId(funds);
    const name = searchQuery.trim() || "New Fund";
    setFunds((prev) => [
      ...prev,
      { id, name, ticker: "—", category: "", allocation: 0 },
    ]);
    setSearchQuery("");
  }, [funds, searchQuery]);

  const handleSave = useCallback(() => {
    if (!isValid) return;
    onSave(source, funds);
    onClose();
  }, [source, funds, isValid, onSave, onClose]);

  const title = SOURCE_TITLES[source];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      dialogClassName="enrollment-modal max-w-lg"
      closeOnOverlayClick={true}
    >
      <div
        className="p-5 rounded-[var(--radius-xl)]"
        style={{
          background: "var(--surface-1)",
          borderColor: "var(--border-subtle)",
        }}
      >
        <h2
          className="text-xl font-semibold mb-4"
          style={{ color: "var(--text-primary)" }}
        >
          {title}
        </h2>

        <div className="mb-4">
          <FundSearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            onAddClick={addFund}
            placeholder="Search funds..."
            addButtonLabel="Add Investments"
          />
        </div>

        <div
          className="rounded-[var(--radius-lg)] border mb-4 max-h-[50vh] overflow-y-auto"
          style={{
            background: "var(--surface-1)",
            borderColor: "var(--border-subtle)",
          }}
        >
          <div className="px-4">
            {funds.map((fund) => (
              <FundAllocationRow
                key={fund.id}
                fund={fund}
                onAllocationChange={updateAllocation}
                onRemove={removeFund}
              />
            ))}
          </div>
        </div>

        <div
          className="flex items-center justify-between gap-4 py-3 mb-4 rounded-[var(--radius-lg)] px-4"
          style={{ background: "var(--enroll-soft-bg)" }}
        >
          <span
            className="text-sm font-medium"
            style={{ color: "var(--text-primary)" }}
          >
            Total Allocation: {total.toFixed(1)}%
          </span>
          {!isValid && (
            <span
              className="text-sm tabular-nums font-medium"
              style={{ color: "var(--danger)" }}
            >
              Must equal 100%
            </span>
          )}
        </div>

        {!isValid && (
          <p
            className="text-sm mb-4"
            style={{ color: "var(--danger)" }}
          >
            Total allocation must equal 100%.
          </p>
        )}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="enrollment-modal__secondary px-4 py-2 rounded-[var(--radius-lg)] text-sm font-medium"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!isValid}
            className="enrollment-modal__primary px-4 py-2 rounded-[var(--radius-lg)] text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save
          </button>
        </div>
      </div>
    </Modal>
  );
}
